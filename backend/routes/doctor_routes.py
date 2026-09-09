from flask import Blueprint
from controllers.doctor_controller import (
    get_all_doctors, get_doctor_by_id, create_doctor,
    update_doctor, delete_doctor, get_doctor_patients, seed_doctors
)
from middleware.auth_middleware import token_required

doctor_bp = Blueprint("doctors", __name__, url_prefix="/api/doctors")


@doctor_bp.route("/", methods=["GET"])
@token_required
def doctors_list():
    return get_all_doctors()


@doctor_bp.route("/seed", methods=["POST"])
@token_required
def doctors_seed():
    """Seed Indian doctor roster — idempotent."""
    return seed_doctors()


@doctor_bp.route("/<string:doctor_id>", methods=["GET"])
@token_required
def doctor_detail(doctor_id):
    return get_doctor_by_id(doctor_id)


@doctor_bp.route("/", methods=["POST"])
@token_required
def doctor_create():
    return create_doctor()


@doctor_bp.route("/<string:doctor_id>", methods=["PUT"])
@token_required
def doctor_update(doctor_id):
    return update_doctor(doctor_id)


@doctor_bp.route("/<string:doctor_id>", methods=["DELETE"])
@token_required
def doctor_delete(doctor_id):
    return delete_doctor(doctor_id)


@doctor_bp.route("/<string:doctor_id>/patients", methods=["GET"])
@token_required
def doctor_patients(doctor_id):
    return get_doctor_patients(doctor_id)
