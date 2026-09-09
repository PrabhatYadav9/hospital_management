from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
from flask import request
from database import get_db
from models.patient_model import serialize_patient, validate_patient_data
from utils.id_generator import generate_patient_id
from utils.response_utils import success_response, error_response


def get_all_patients():
    """
    GET /api/patients
    Supports: search, status filter, gender filter, doctor filter,
              sort, pagination via query params.
    """
    db = get_db()
    patients_col = db["patients"]

    # --- Query Params ---
    search = request.args.get("search", "").strip()
    status = request.args.get("status", "")
    gender = request.args.get("gender", "")
    doctor = request.args.get("doctor", "")
    sort_by = request.args.get("sortBy", "createdAt")
    sort_order = request.args.get("sortOrder", "desc")
    page = max(1, int(request.args.get("page", 1)))
    limit = min(100, max(1, int(request.args.get("limit", 10))))

    # --- Build Filter ---
    query = {}

    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"patientId": {"$regex": search, "$options": "i"}},
            {"disease": {"$regex": search, "$options": "i"}},
            {"doctor": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
        ]

    if status:
        query["status"] = status
    if gender:
        query["gender"] = gender
    if doctor:
        query["doctor"] = {"$regex": doctor, "$options": "i"}

    # --- Sort ---
    sort_field_map = {
        "name": "name",
        "age": "age",
        "admissionDate": "admissionDate",
        "createdAt": "createdAt",
        "patientId": "patientId",
    }
    sort_field = sort_field_map.get(sort_by, "createdAt")
    sort_dir = -1 if sort_order == "desc" else 1

    # --- Paginate ---
    total = patients_col.count_documents(query)
    total_pages = max(1, -(-total // limit))  # ceiling division
    skip = (page - 1) * limit

    cursor = patients_col.find(query).sort(sort_field, sort_dir).skip(skip).limit(limit)
    patients = [serialize_patient(p) for p in cursor]

    return success_response(
        data=patients,
        message="Patients retrieved successfully.",
        meta={
            "total": total,
            "page": page,
            "limit": limit,
            "totalPages": total_pages,
        },
    )


def get_patient_by_id(patient_id: str):
    """GET /api/patients/:id"""
    db = get_db()
    patients_col = db["patients"]

    # Support lookup by patientId (PT-XXXX) or MongoDB _id
    patient = patients_col.find_one({"patientId": patient_id})
    if not patient:
        try:
            patient = patients_col.find_one({"_id": ObjectId(patient_id)})
        except InvalidId:
            pass

    if not patient:
        return error_response(f"Patient '{patient_id}' not found.", 404)

    return success_response(data=serialize_patient(patient))


def create_patient():
    """POST /api/patients"""
    db = get_db()
    patients_col = db["patients"]

    data = request.get_json()
    if not data:
        return error_response("Request body is required.", 400)

    is_valid, errors = validate_patient_data(data)
    if not is_valid:
        return error_response("Validation failed.", 422, errors=errors)

    now = datetime.now(timezone.utc)
    new_patient = {
        "patientId": generate_patient_id(),
        "name": data["name"].strip(),
        "age": int(data["age"]),
        "gender": data["gender"],
        "bloodGroup": data.get("bloodGroup", ""),
        "phone": data["phone"].strip(),
        "email": data.get("email", "").strip(),
        "address": data.get("address", "").strip(),
        "emergencyContact": data.get("emergencyContact", "").strip(),
        "doctor": data["doctor"].strip(),
        "disease": data["disease"].strip(),
        "admissionDate": data["admissionDate"],
        "status": data.get("status", "Admitted"),
        "createdAt": now,
        "updatedAt": now,
    }

    result = patients_col.insert_one(new_patient)
    new_patient["_id"] = result.inserted_id

    return success_response(
        data=serialize_patient(new_patient),
        message="Patient admitted successfully.",
        status_code=201,
    )


def update_patient(patient_id: str):
    """PUT /api/patients/:id"""
    db = get_db()
    patients_col = db["patients"]

    data = request.get_json()
    if not data:
        return error_response("Request body is required.", 400)

    is_valid, errors = validate_patient_data(data, is_update=True)
    if not is_valid:
        return error_response("Validation failed.", 422, errors=errors)

    # Find patient
    patient = patients_col.find_one({"patientId": patient_id})
    if not patient:
        try:
            patient = patients_col.find_one({"_id": ObjectId(patient_id)})
        except InvalidId:
            pass
    if not patient:
        return error_response(f"Patient '{patient_id}' not found.", 404)

    # Build update document (only update provided fields)
    allowed_fields = [
        "name", "age", "gender", "bloodGroup", "phone", "email",
        "address", "emergencyContact", "doctor", "disease",
        "admissionDate", "status"
    ]
    update_data = {}
    for field in allowed_fields:
        if field in data:
            update_data[field] = data[field]

    if "age" in update_data:
        update_data["age"] = int(update_data["age"])

    update_data["updatedAt"] = datetime.now(timezone.utc)

    patients_col.update_one(
        {"_id": patient["_id"]},
        {"$set": update_data}
    )

    updated = patients_col.find_one({"_id": patient["_id"]})
    return success_response(
        data=serialize_patient(updated),
        message="Patient record updated successfully.",
    )


def delete_patient(patient_id: str):
    """DELETE /api/patients/:id"""
    db = get_db()
    patients_col = db["patients"]

    patient = patients_col.find_one({"patientId": patient_id})
    if not patient:
        try:
            patient = patients_col.find_one({"_id": ObjectId(patient_id)})
        except InvalidId:
            pass
    if not patient:
        return error_response(f"Patient '{patient_id}' not found.", 404)

    patients_col.delete_one({"_id": patient["_id"]})
    return success_response(message=f"Patient '{patient.get('name', patient_id)}' deleted successfully.")


def discharge_patient(patient_id: str):
    """PATCH /api/patients/:id/discharge"""
    db = get_db()
    patients_col = db["patients"]

    patient = patients_col.find_one({"patientId": patient_id})
    if not patient:
        try:
            patient = patients_col.find_one({"_id": ObjectId(patient_id)})
        except InvalidId:
            pass
    if not patient:
        return error_response(f"Patient '{patient_id}' not found.", 404)

    if patient.get("status") == "Discharged":
        return error_response("Patient is already discharged.", 400)

    patients_col.update_one(
        {"_id": patient["_id"]},
        {"$set": {"status": "Discharged", "updatedAt": datetime.now(timezone.utc)}}
    )

    updated = patients_col.find_one({"_id": patient["_id"]})
    return success_response(
        data=serialize_patient(updated),
        message=f"{patient['name']} has been discharged successfully.",
    )
