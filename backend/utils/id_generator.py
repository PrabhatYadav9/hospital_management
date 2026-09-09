from database import get_db


def generate_patient_id() -> str:
    """
    Generate the next auto-incrementing patient ID in the format PT-XXXX.
    Thread-safe via MongoDB's atomic findOneAndUpdate on a counters collection.
    """
    db = get_db()
    counters = db["counters"]

    result = counters.find_one_and_update(
        {"_id": "patientId"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=True,
    )

    seq = result["seq"]
    return f"PT-{seq:04d}"
