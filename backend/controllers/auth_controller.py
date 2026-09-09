import jwt
import bcrypt
from datetime import datetime, timezone, timedelta
from flask import request
from database import get_db
from models.user_model import serialize_user
from utils.response_utils import success_response, error_response
from config import Config


def login():
    """
    POST /api/auth/login
    Validates email/password, issues a signed JWT.
    """
    data = request.get_json()
    if not data:
        return error_response("Request body is required.", 400)

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return error_response("Email and password are required.", 400)

    db = get_db()
    users_col = db["users"]

    user = users_col.find_one({"email": email})
    if not user:
        return error_response("Invalid email or password.", 401)

    # Verify password hash
    if not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        return error_response("Invalid email or password.", 401)

    # Issue JWT
    expiry = datetime.now(timezone.utc) + timedelta(hours=Config.JWT_EXPIRY_HOURS)
    payload = {
        "userId": str(user["_id"]),
        "email": user["email"],
        "role": user.get("role", "admin"),
        "exp": expiry,
    }
    token = jwt.encode(payload, Config.JWT_SECRET, algorithm="HS256")

    return success_response(
        data={
            "token": token,
            "user": serialize_user(user),
            "expiresAt": expiry.isoformat(),
        },
        message="Login successful.",
    )


def logout():
    """
    POST /api/auth/logout
    Stateless JWT — client just discards token.
    """
    return success_response(message="Logged out successfully.")


def change_password():
    """
    PUT /api/auth/password
    Change the current user's password. Requires old + new passwords.
    Protected by token_required middleware.
    """
    current_user = request.current_user
    data = request.get_json()
    if not data:
        return error_response("Request body is required.", 400)

    old_password = data.get("oldPassword", "")
    new_password = data.get("newPassword", "")

    if not old_password or not new_password:
        return error_response("Both oldPassword and newPassword are required.", 400)

    if len(new_password) < 8:
        return error_response("New password must be at least 8 characters.", 400)

    db = get_db()
    from bson import ObjectId
    user = db["users"].find_one({"_id": ObjectId(current_user["userId"])})
    if not user:
        return error_response("User not found.", 404)

    if not bcrypt.checkpw(old_password.encode("utf-8"), user["password"]):
        return error_response("Current password is incorrect.", 401)

    hashed_new = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())
    db["users"].update_one(
        {"_id": user["_id"]},
        {"$set": {"password": hashed_new}}
    )
    return success_response(message="Password changed successfully.")



def get_me():
    """
    GET /api/auth/me
    Returns the currently authenticated user from the JWT payload.
    Protected by token_required middleware.
    """
    current_user = request.current_user
    db = get_db()
    from bson import ObjectId
    user = db["users"].find_one({"_id": ObjectId(current_user["userId"])})
    if not user:
        return error_response("User not found.", 404)
    return success_response(data=serialize_user(user))


def seed_admin():
    """
    POST /api/auth/seed
    One-time admin seeder. Creates default admin if none exists.
    DISABLE THIS ENDPOINT IN PRODUCTION.
    """
    db = get_db()
    users_col = db["users"]

    if users_col.count_documents({}) > 0:
        return error_response("Admin already exists. Seeding is disabled.", 400)

    hashed_pw = bcrypt.hashpw("Admin@123".encode("utf-8"), bcrypt.gensalt())
    now = datetime.now(timezone.utc)

    admin = {
        "name": "Dr. Sarah Jenkins",
        "email": "admin@hopehospital.com",
        "password": hashed_pw,
        "role": "admin",
        "createdAt": now,
    }

    users_col.insert_one(admin)

    return success_response(
        data={
            "email": "admin@hopehospital.com",
            "password": "Admin@123",
            "note": "Change this password immediately after first login.",
        },
        message="Admin user created successfully.",
        status_code=201,
    )
