from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
from flask import request
from database import get_db
from models.doctor_model import serialize_doctor, validate_doctor_data
from utils.response_utils import success_response, error_response


# ── Indian Doctor Seed Data ────────────────────────────────────────────────────
INDIAN_DOCTORS_SEED = [
    {
        "name": "Dr. Rajesh Sharma",
        "specialization": "Cardiology",
        "phone": "9810012345",
        "email": "rajesh.sharma@hopehospital.com",
        "shift": "Morning",
        "status": "Active",
        "experience": 18,
        "qualification": "MBBS, MD (Cardiology), DM",
    },
    {
        "name": "Dr. Priya Mehta",
        "specialization": "Gynaecology",
        "phone": "9820023456",
        "email": "priya.mehta@hopehospital.com",
        "shift": "Morning",
        "status": "Active",
        "experience": 14,
        "qualification": "MBBS, MS (Obstetrics & Gynaecology)",
    },
    {
        "name": "Dr. Anil Kumar",
        "specialization": "Orthopaedics",
        "phone": "9830034567",
        "email": "anil.kumar@hopehospital.com",
        "shift": "Evening",
        "status": "Active",
        "experience": 20,
        "qualification": "MBBS, MS (Orthopaedics), Fellowship",
    },
    {
        "name": "Dr. Sunita Verma",
        "specialization": "Neurology",
        "phone": "9840045678",
        "email": "sunita.verma@hopehospital.com",
        "shift": "Morning",
        "status": "Active",
        "experience": 12,
        "qualification": "MBBS, MD (Neurology), DM",
    },
    {
        "name": "Dr. Vikram Patel",
        "specialization": "Paediatrics",
        "phone": "9850056789",
        "email": "vikram.patel@hopehospital.com",
        "shift": "Evening",
        "status": "Active",
        "experience": 10,
        "qualification": "MBBS, MD (Paediatrics)",
    },
    {
        "name": "Dr. Kavitha Nair",
        "specialization": "Dermatology",
        "phone": "9860067890",
        "email": "kavitha.nair@hopehospital.com",
        "shift": "Morning",
        "status": "Active",
        "experience": 8,
        "qualification": "MBBS, MD (Dermatology)",
    },
    {
        "name": "Dr. Suresh Iyer",
        "specialization": "General Surgery",
        "phone": "9870078901",
        "email": "suresh.iyer@hopehospital.com",
        "shift": "Night",
        "status": "Active",
        "experience": 22,
        "qualification": "MBBS, MS (General Surgery), MCh",
    },
    {
        "name": "Dr. Anjali Singh",
        "specialization": "Endocrinology",
        "phone": "9880089012",
        "email": "anjali.singh@hopehospital.com",
        "shift": "Morning",
        "status": "Active",
        "experience": 9,
        "qualification": "MBBS, MD (Endocrinology)",
    },
]


def _generate_doctor_id(db) -> str:
    """Auto-incrementing doctor ID in format DR-XXXX."""
    counters = db["counters"]
    result = counters.find_one_and_update(
        {"_id": "doctorId"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=True,
    )
    return f"DR-{result['seq']:04d}"


def get_all_doctors():
    """
    GET /api/doctors
    Returns all doctors with live patient counts from the patients collection.
    Supports: search, status, shift, specialization filters + pagination.
    """
    db = get_db()
    doctors_col = db["doctors"]
    patients_col = db["patients"]

    search = request.args.get("search", "").strip()
    status = request.args.get("status", "")
    shift = request.args.get("shift", "")
    specialization = request.args.get("specialization", "")
    page = max(1, int(request.args.get("page", 1)))
    limit = min(100, max(1, int(request.args.get("limit", 20))))

    query = {}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"specialization": {"$regex": search, "$options": "i"}},
            {"doctorId": {"$regex": search, "$options": "i"}},
        ]
    if status:
        query["status"] = status
    if shift:
        query["shift"] = shift
    if specialization:
        query["specialization"] = {"$regex": specialization, "$options": "i"}

    total = doctors_col.count_documents(query)
    total_pages = max(1, -(-total // limit))
    skip = (page - 1) * limit

    cursor = doctors_col.find(query).sort("name", 1).skip(skip).limit(limit)
    doctors = []
    for doc in cursor:
        serialized = serialize_doctor(doc)
        # Live patient count from patients collection
        serialized["patientCount"] = patients_col.count_documents({
            "doctor": {"$regex": f"^{doc['name']}$", "$options": "i"}
        })
        doctors.append(serialized)

    return success_response(
        data=doctors,
        message="Doctors retrieved successfully.",
        meta={"total": total, "page": page, "limit": limit, "totalPages": total_pages},
    )


def get_doctor_by_id(doctor_id: str):
    """GET /api/doctors/:id"""
    db = get_db()
    doctors_col = db["doctors"]
    patients_col = db["patients"]

    doctor = doctors_col.find_one({"doctorId": doctor_id})
    if not doctor:
        try:
            doctor = doctors_col.find_one({"_id": ObjectId(doctor_id)})
        except InvalidId:
            pass
    if not doctor:
        return error_response(f"Doctor '{doctor_id}' not found.", 404)

    serialized = serialize_doctor(doctor)
    serialized["patientCount"] = patients_col.count_documents({
        "doctor": {"$regex": f"^{doctor['name']}$", "$options": "i"}
    })
    return success_response(data=serialized)


def create_doctor():
    """POST /api/doctors"""
    db = get_db()
    doctors_col = db["doctors"]

    data = request.get_json()
    if not data:
        return error_response("Request body is required.", 400)

    is_valid, errors = validate_doctor_data(data)
    if not is_valid:
        return error_response("Validation failed.", 422, errors=errors)

    # Prevent duplicate name
    existing = doctors_col.find_one({"name": {"$regex": f"^{data['name'].strip()}$", "$options": "i"}})
    if existing:
        return error_response(f"A doctor named '{data['name']}' already exists.", 409)

    now = datetime.now(timezone.utc)
    new_doctor = {
        "doctorId": _generate_doctor_id(db),
        "name": data["name"].strip(),
        "specialization": data["specialization"].strip(),
        "phone": data["phone"].strip(),
        "email": data.get("email", "").strip(),
        "shift": data.get("shift", "Morning"),
        "status": data.get("status", "Active"),
        "experience": int(data.get("experience", 0)),
        "qualification": data.get("qualification", "").strip(),
        "createdAt": now,
        "updatedAt": now,
    }

    result = doctors_col.insert_one(new_doctor)
    new_doctor["_id"] = result.inserted_id
    serialized = serialize_doctor(new_doctor)
    serialized["patientCount"] = 0

    return success_response(data=serialized, message="Doctor added successfully.", status_code=201)


def update_doctor(doctor_id: str):
    """PUT /api/doctors/:id"""
    db = get_db()
    doctors_col = db["doctors"]

    data = request.get_json()
    if not data:
        return error_response("Request body is required.", 400)

    is_valid, errors = validate_doctor_data(data, is_update=True)
    if not is_valid:
        return error_response("Validation failed.", 422, errors=errors)

    doctor = doctors_col.find_one({"doctorId": doctor_id})
    if not doctor:
        try:
            doctor = doctors_col.find_one({"_id": ObjectId(doctor_id)})
        except InvalidId:
            pass
    if not doctor:
        return error_response(f"Doctor '{doctor_id}' not found.", 404)

    allowed_fields = ["name", "specialization", "phone", "email", "shift", "status", "experience", "qualification"]
    update_data = {}
    for field in allowed_fields:
        if field in data:
            update_data[field] = data[field]

    if "experience" in update_data:
        update_data["experience"] = int(update_data["experience"])
    if "name" in update_data:
        update_data["name"] = update_data["name"].strip()

    update_data["updatedAt"] = datetime.now(timezone.utc)
    doctors_col.update_one({"_id": doctor["_id"]}, {"$set": update_data})

    updated = doctors_col.find_one({"_id": doctor["_id"]})
    return success_response(data=serialize_doctor(updated), message="Doctor updated successfully.")


def delete_doctor(doctor_id: str):
    """DELETE /api/doctors/:id"""
    db = get_db()
    doctors_col = db["doctors"]

    doctor = doctors_col.find_one({"doctorId": doctor_id})
    if not doctor:
        try:
            doctor = doctors_col.find_one({"_id": ObjectId(doctor_id)})
        except InvalidId:
            pass
    if not doctor:
        return error_response(f"Doctor '{doctor_id}' not found.", 404)

    doctors_col.delete_one({"_id": doctor["_id"]})
    return success_response(message=f"Dr. {doctor.get('name', doctor_id)} removed successfully.")


def get_doctor_patients(doctor_id: str):
    """GET /api/doctors/:id/patients — patients assigned to this doctor."""
    db = get_db()
    doctors_col = db["doctors"]
    patients_col = db["patients"]
    from models.patient_model import serialize_patient

    doctor = doctors_col.find_one({"doctorId": doctor_id})
    if not doctor:
        try:
            doctor = doctors_col.find_one({"_id": ObjectId(doctor_id)})
        except InvalidId:
            pass
    if not doctor:
        return error_response(f"Doctor '{doctor_id}' not found.", 404)

    cursor = patients_col.find(
        {"doctor": {"$regex": f"^{doctor['name']}$", "$options": "i"}}
    ).sort("createdAt", -1).limit(50)

    patients = [serialize_patient(p) for p in cursor]
    return success_response(data=patients, message=f"Patients for {doctor['name']} retrieved.")


def seed_doctors():
    """
    POST /api/doctors/seed
    Seeds the initial Indian doctor roster. Safe to call multiple times —
    skips doctors that already exist by name.
    """
    db = get_db()
    doctors_col = db["doctors"]

    inserted = []
    skipped = []
    now = datetime.now(timezone.utc)

    for doc_data in INDIAN_DOCTORS_SEED:
        existing = doctors_col.find_one(
            {"name": {"$regex": f"^{doc_data['name']}$", "$options": "i"}}
        )
        if existing:
            skipped.append(doc_data["name"])
            continue

        new_doctor = {
            "doctorId": _generate_doctor_id(db),
            "name": doc_data["name"],
            "specialization": doc_data["specialization"],
            "phone": doc_data["phone"],
            "email": doc_data["email"],
            "shift": doc_data["shift"],
            "status": doc_data["status"],
            "experience": doc_data["experience"],
            "qualification": doc_data["qualification"],
            "createdAt": now,
            "updatedAt": now,
        }
        doctors_col.insert_one(new_doctor)
        inserted.append(doc_data["name"])

    return success_response(
        data={"inserted": inserted, "skipped": skipped},
        message=f"Seeded {len(inserted)} doctors. Skipped {len(skipped)} existing.",
        status_code=201 if inserted else 200,
    )
