import jwt
from functools import wraps
from flask import request
from config import Config
from utils.response_utils import error_response


def token_required(f):
    """
    Decorator to protect routes with JWT authentication.
    Reads the Authorization: Bearer <token> header.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

        if not token:
            return error_response("Authentication required. No token provided.", 401)

        try:
            payload = jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
            request.current_user = payload
        except jwt.ExpiredSignatureError:
            return error_response("Token has expired. Please log in again.", 401)
        except jwt.InvalidTokenError:
            return error_response("Invalid token. Please log in again.", 401)

        return f(*args, **kwargs)

    return decorated
