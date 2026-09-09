from flask import Blueprint
from controllers.patient_controller import (
    get_all_patients,
    get_patient_by_id,
    create_patient,
    update_patient,
    delete_patient,
    discharge_patient,
)
from middleware.auth_middleware import token_required

patient_bp = Blueprint("patients", __name__, url_prefix="/api/patients")


@patient_bp.route("/", methods=["GET"])
@token_required
def list_patients():
    return get_all_patients()


@patient_bp.route("/<string:patient_id>", methods=["GET"])
@token_required
def get_patient(patient_id):
    return get_patient_by_id(patient_id)


@patient_bp.route("/", methods=["POST"])
@token_required
def add_patient():
    return create_patient()


@patient_bp.route("/<string:patient_id>", methods=["PUT"])
@token_required
def edit_patient(patient_id):
    return update_patient(patient_id)


@patient_bp.route("/<string:patient_id>", methods=["DELETE"])
@token_required
def remove_patient(patient_id):
    return delete_patient(patient_id)


@patient_bp.route("/<string:patient_id>/discharge", methods=["PATCH"])
@token_required
def discharge(patient_id):
    return discharge_patient(patient_id)
