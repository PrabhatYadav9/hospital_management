from datetime import datetime
from bson import ObjectId


def serialize_appointment(appt: dict) -> dict:
    """Convert a MongoDB appointment document to a JSON-serializable dict."""
    if not appt:
        return None
    return {
        "_id": str(appt["_id"]),
        "appointmentId": appt.get("appointmentId", ""),
        "patientId": appt.get("patientId", ""),
        "patientName": appt.get("patientName", ""),
        "doctor": appt.get("doctor", ""),
        "date": appt.get("date", ""),
        "time": appt.get("time", ""),
        "type": appt.get("type", "Consultation"),
        "status": appt.get("status", "Scheduled"),
        "notes": appt.get("notes", ""),
        "createdAt": appt.get("createdAt", "").isoformat() if isinstance(appt.get("createdAt"), datetime) else appt.get("createdAt", ""),
        "updatedAt": appt.get("updatedAt", "").isoformat() if isinstance(appt.get("updatedAt"), datetime) else appt.get("updatedAt", ""),
    }


def validate_appointment_data(data: dict, is_update: bool = False) -> tuple[bool, list[str]]:
    """Validate appointment input data. Returns (is_valid, errors)."""
    errors = []

    required_fields = ["patientId", "patientName", "doctor", "date", "time", "type"]

    if not is_update:
        for field in required_fields:
            if not data.get(field):
                errors.append(f"'{field}' is required.")

    if "type" in data and data["type"] not in ["Consultation", "Follow-up", "Procedure", "Emergency"]:
        errors.append("Type must be 'Consultation', 'Follow-up', 'Procedure', or 'Emergency'.")

    if "status" in data and data["status"] not in ["Scheduled", "Completed", "Cancelled"]:
        errors.append("Status must be 'Scheduled', 'Completed', or 'Cancelled'.")

    return len(errors) == 0, errors
