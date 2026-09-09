from flask import Blueprint
from controllers.auth_controller import login, logout, get_me, seed_admin, change_password
from middleware.auth_middleware import token_required

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/login", methods=["POST"])
def auth_login():
    return login()


@auth_bp.route("/logout", methods=["POST"])
@token_required
def auth_logout():
    return logout()


@auth_bp.route("/me", methods=["GET"])
@token_required
def auth_me():
    return get_me()


@auth_bp.route("/seed", methods=["POST"])
def auth_seed():
    """One-time admin seeder — disable in production."""
    return seed_admin()


@auth_bp.route("/password", methods=["PUT"])
@token_required
def auth_change_password():
    """Change current user's password."""
    return change_password()
