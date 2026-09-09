from datetime import datetime, timezone
from bson import ObjectId


def serialize_patient(patient: dict) -> dict:
    """Convert a MongoDB patient document to a JSON-serializable dict."""
    if not patient:
        return None
    return {
        "_id": str(patient["_id"]),
        "patientId": patient.get("patientId", ""),
        "name": patient.get("name", ""),
        "age": patient.get("age", 0),
        "gender": patient.get("gender", ""),
        "bloodGroup": patient.get("bloodGroup", ""),
        "phone": patient.get("phone", ""),
        "email": patient.get("email", ""),
        "address": patient.get("address", ""),
        "emergencyContact": patient.get("emergencyContact", ""),
        "doctor": patient.get("doctor", ""),
        "disease": patient.get("disease", ""),
        "admissionDate": patient.get("admissionDate", ""),
        "status": patient.get("status", "Admitted"),
        "createdAt": patient.get("createdAt", "").isoformat() if isinstance(patient.get("createdAt"), datetime) else patient.get("createdAt", ""),
        "updatedAt": patient.get("updatedAt", "").isoformat() if isinstance(patient.get("updatedAt"), datetime) else patient.get("updatedAt", ""),
    }


def validate_patient_data(data: dict, is_update: bool = False) -> tuple[bool, list[str]]:
    """Validate patient data. Returns (is_valid, errors)."""
    errors = []

    required_fields = ["name", "age", "gender", "phone", "disease", "doctor", "admissionDate"]

    if not is_update:
        for field in required_fields:
            if not data.get(field):
                errors.append(f"'{field}' is required.")

    # Age validation
    if "age" in data:
        try:
            age = int(data["age"])
            if age <= 0 or age > 150:
                errors.append("Age must be between 1 and 150.")
        except (ValueError, TypeError):
            errors.append("Age must be a valid number.")

    # Phone validation (basic)
    if "phone" in data and data["phone"]:
        phone = str(data["phone"]).strip()
        if len(phone) < 7:
            errors.append("Phone number is too short.")

    # Email validation (optional field)
    if "email" in data and data["email"]:
        import re
        email_regex = r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, data["email"]):
            errors.append("Invalid email address format.")

    # Status validation
    if "status" in data and data["status"] not in ["Admitted", "Discharged"]:
        errors.append("Status must be 'Admitted' or 'Discharged'.")

    return len(errors) == 0, errors
