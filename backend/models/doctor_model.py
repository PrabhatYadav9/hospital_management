from datetime import datetime
from bson import ObjectId


def serialize_doctor(doctor: dict) -> dict:
    """Convert a MongoDB doctor document to a JSON-serializable dict."""
    if not doctor:
        return None
    return {
        "_id": str(doctor["_id"]),
        "doctorId": doctor.get("doctorId", ""),
        "name": doctor.get("name", ""),
        "specialization": doctor.get("specialization", ""),
        "phone": doctor.get("phone", ""),
        "email": doctor.get("email", ""),
        "shift": doctor.get("shift", "Morning"),
        "status": doctor.get("status", "Active"),
        "experience": doctor.get("experience", 0),
        "qualification": doctor.get("qualification", ""),
        "patientCount": doctor.get("patientCount", 0),
        "createdAt": doctor.get("createdAt", "").isoformat() if isinstance(doctor.get("createdAt"), datetime) else doctor.get("createdAt", ""),
        "updatedAt": doctor.get("updatedAt", "").isoformat() if isinstance(doctor.get("updatedAt"), datetime) else doctor.get("updatedAt", ""),
    }


def validate_doctor_data(data: dict, is_update: bool = False) -> tuple[bool, list[str]]:
    """Validate doctor input data. Returns (is_valid, errors)."""
    errors = []

    required_fields = ["name", "specialization", "phone", "shift"]

    if not is_update:
        for field in required_fields:
            if not data.get(field):
                errors.append(f"'{field}' is required.")

    if "shift" in data and data["shift"] not in ["Morning", "Evening", "Night"]:
        errors.append("Shift must be 'Morning', 'Evening', or 'Night'.")

    if "status" in data and data["status"] not in ["Active", "On Leave"]:
        errors.append("Status must be 'Active' or 'On Leave'.")

    if "phone" in data and data["phone"]:
        phone = str(data["phone"]).strip()
        if len(phone) < 7:
            errors.append("Phone number is too short.")

    if "email" in data and data["email"]:
        import re
        email_regex = r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, data["email"]):
            errors.append("Invalid email address format.")

    if "experience" in data and data["experience"] is not None:
        try:
            exp = int(data["experience"])
            if exp < 0 or exp > 60:
                errors.append("Experience must be between 0 and 60 years.")
        except (ValueError, TypeError):
            errors.append("Experience must be a valid number.")

    return len(errors) == 0, errors
