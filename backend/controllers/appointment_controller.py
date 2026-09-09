from datetime import datetime, timezone, date
from bson import ObjectId
from bson.errors import InvalidId
from flask import request
from database import get_db
from models.appointment_model import serialize_appointment, validate_appointment_data
from utils.response_utils import success_response, error_response


def _generate_appointment_id(db) -> str:
    """Auto-incrementing appointment ID in format APT-XXXX."""
    counters = db["counters"]
    result = counters.find_one_and_update(
        {"_id": "appointmentId"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=True,
    )
    return f"APT-{result['seq']:04d}"


def get_all_appointments():
    """
    GET /api/appointments
    Supports: doctor, date, status, patientId, search filters + pagination.
    """
    db = get_db()
    appts_col = db["appointments"]

    doctor = request.args.get("doctor", "").strip()
    date_filter = request.args.get("date", "").strip()
    status = request.args.get("status", "").strip()
    patient_id = request.args.get("patientId", "").strip()
    search = request.args.get("search", "").strip()
    page = max(1, int(request.args.get("page", 1)))
    limit = min(100, max(1, int(request.args.get("limit", 20))))

    query = {}
    if doctor:
        query["doctor"] = {"$regex": doctor, "$options": "i"}
    if date_filter:
        query["date"] = date_filter
    if status:
        query["status"] = status
    if patient_id:
        query["patientId"] = patient_id
    if search:
        query["$or"] = [
            {"patientName": {"$regex": search, "$options": "i"}},
            {"doctor": {"$regex": search, "$options": "i"}},
            {"appointmentId": {"$regex": search, "$options": "i"}},
        ]

    total = appts_col.count_documents(query)
    total_pages = max(1, -(-total // limit))
    skip = (page - 1) * limit

    cursor = appts_col.find(query).sort([("date", 1), ("time", 1)]).skip(skip).limit(limit)
    appointments = [serialize_appointment(a) for a in cursor]

    return success_response(
        data=appointments,
        message="Appointments retrieved successfully.",
        meta={"total": total, "page": page, "limit": limit, "totalPages": total_pages},
    )


def get_today_appointments():
    """GET /api/appointments/today — today's schedule for dashboard widget."""
    db = get_db()
    appts_col = db["appointments"]

    today_str = date.today().isoformat()  # YYYY-MM-DD
    cursor = appts_col.find({"date": today_str}).sort("time", 1).limit(10)
    appointments = [serialize_appointment(a) for a in cursor]

    return success_response(
        data=appointments,
        message=f"Today's appointments ({today_str}) retrieved.",
    )


def get_appointment_by_id(appointment_id: str):
    """GET /api/appointments/:id"""
    db = get_db()
    appts_col = db["appointments"]

    appt = appts_col.find_one({"appointmentId": appointment_id})
    if not appt:
        try:
            appt = appts_col.find_one({"_id": ObjectId(appointment_id)})
        except InvalidId:
            pass
    if not appt:
        return error_response(f"Appointment '{appointment_id}' not found.", 404)

    return success_response(data=serialize_appointment(appt))


def create_appointment():
    """POST /api/appointments"""
    db = get_db()
    appts_col = db["appointments"]

    data = request.get_json()
    if not data:
        return error_response("Request body is required.", 400)

    is_valid, errors = validate_appointment_data(data)
    if not is_valid:
        return error_response("Validation failed.", 422, errors=errors)

    now = datetime.now(timezone.utc)
    new_appt = {
        "appointmentId": _generate_appointment_id(db),
        "patientId": data["patientId"].strip(),
        "patientName": data["patientName"].strip(),
        "doctor": data["doctor"].strip(),
        "date": data["date"],
        "time": data["time"],
        "type": data.get("type", "Consultation"),
        "status": data.get("status", "Scheduled"),
        "notes": data.get("notes", "").strip(),
        "createdAt": now,
        "updatedAt": now,
    }

    result = appts_col.insert_one(new_appt)
    new_appt["_id"] = result.inserted_id
    return success_response(
        data=serialize_appointment(new_appt),
        message="Appointment scheduled successfully.",
        status_code=201,
    )


def update_appointment(appointment_id: str):
    """PUT /api/appointments/:id"""
    db = get_db()
    appts_col = db["appointments"]

    data = request.get_json()
    if not data:
        return error_response("Request body is required.", 400)

    is_valid, errors = validate_appointment_data(data, is_update=True)
    if not is_valid:
        return error_response("Validation failed.", 422, errors=errors)

    appt = appts_col.find_one({"appointmentId": appointment_id})
    if not appt:
        try:
            appt = appts_col.find_one({"_id": ObjectId(appointment_id)})
        except InvalidId:
            pass
    if not appt:
        return error_response(f"Appointment '{appointment_id}' not found.", 404)

    allowed_fields = ["patientId", "patientName", "doctor", "date", "time", "type", "status", "notes"]
    update_data = {field: data[field] for field in allowed_fields if field in data}
    update_data["updatedAt"] = datetime.now(timezone.utc)

    appts_col.update_one({"_id": appt["_id"]}, {"$set": update_data})
    updated = appts_col.find_one({"_id": appt["_id"]})
    return success_response(data=serialize_appointment(updated), message="Appointment updated successfully.")


def update_appointment_status(appointment_id: str):
    """PATCH /api/appointments/:id/status"""
    db = get_db()
    appts_col = db["appointments"]

    data = request.get_json()
    new_status = data.get("status") if data else None

    if not new_status or new_status not in ["Scheduled", "Completed", "Cancelled"]:
        return error_response("Status must be 'Scheduled', 'Completed', or 'Cancelled'.", 400)

    appt = appts_col.find_one({"appointmentId": appointment_id})
    if not appt:
        try:
            appt = appts_col.find_one({"_id": ObjectId(appointment_id)})
        except InvalidId:
            pass
    if not appt:
        return error_response(f"Appointment '{appointment_id}' not found.", 404)

    appts_col.update_one(
        {"_id": appt["_id"]},
        {"$set": {"status": new_status, "updatedAt": datetime.now(timezone.utc)}}
    )
    updated = appts_col.find_one({"_id": appt["_id"]})
    return success_response(data=serialize_appointment(updated), message=f"Appointment marked as {new_status}.")


def delete_appointment(appointment_id: str):
    """DELETE /api/appointments/:id"""
    db = get_db()
    appts_col = db["appointments"]

    appt = appts_col.find_one({"appointmentId": appointment_id})
    if not appt:
        try:
            appt = appts_col.find_one({"_id": ObjectId(appointment_id)})
        except InvalidId:
            pass
    if not appt:
        return error_response(f"Appointment '{appointment_id}' not found.", 404)

    appts_col.delete_one({"_id": appt["_id"]})
    return success_response(message=f"Appointment {appointment_id} deleted successfully.")
