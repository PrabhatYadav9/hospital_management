from flask import Blueprint
from controllers.appointment_controller import (
    get_all_appointments, get_today_appointments, get_appointment_by_id,
    create_appointment, update_appointment, update_appointment_status, delete_appointment
)
from middleware.auth_middleware import token_required

appointment_bp = Blueprint("appointments", __name__, url_prefix="/api/appointments")


@appointment_bp.route("/", methods=["GET"])
@token_required
def appointments_list():
    return get_all_appointments()


@appointment_bp.route("/today", methods=["GET"])
@token_required
def appointments_today():
    return get_today_appointments()


@appointment_bp.route("/<string:appointment_id>", methods=["GET"])
@token_required
def appointment_detail(appointment_id):
    return get_appointment_by_id(appointment_id)


@appointment_bp.route("/", methods=["POST"])
@token_required
def appointment_create():
    return create_appointment()


@appointment_bp.route("/<string:appointment_id>", methods=["PUT"])
@token_required
def appointment_update(appointment_id):
    return update_appointment(appointment_id)


@appointment_bp.route("/<string:appointment_id>/status", methods=["PATCH"])
@token_required
def appointment_status(appointment_id):
    return update_appointment_status(appointment_id)


@appointment_bp.route("/<string:appointment_id>", methods=["DELETE"])
@token_required
def appointment_delete(appointment_id):
    return delete_appointment(appointment_id)
