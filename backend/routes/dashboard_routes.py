from flask import Blueprint
from controllers.dashboard_controller import get_dashboard_stats
from middleware.auth_middleware import token_required

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")


@dashboard_bp.route("/stats", methods=["GET"])
@token_required
def stats():
    return get_dashboard_stats()
