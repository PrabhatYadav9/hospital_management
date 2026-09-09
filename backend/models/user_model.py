from datetime import datetime
from bson import ObjectId


def serialize_user(user: dict) -> dict:
    """Convert a MongoDB user document to a JSON-serializable dict (without password)."""
    if not user:
        return None
    return {
        "_id": str(user["_id"]),
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "role": user.get("role", "admin"),
        "createdAt": user.get("createdAt", "").isoformat() if isinstance(user.get("createdAt"), datetime) else user.get("createdAt", ""),
    }
