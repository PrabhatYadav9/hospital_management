from datetime import datetime, timezone
from database import get_db
from models.patient_model import serialize_patient
from utils.response_utils import success_response, error_response


def get_dashboard_stats():
    """
    GET /api/dashboard/stats
    Returns: total patients, admitted, discharged, unique doctors,
             recent 5 patients, monthly admissions chart data,
             patient status ratio for donut chart.
    """
    db = get_db()
    patients_col = db["patients"]

    total_patients = patients_col.count_documents({})
    total_admitted = patients_col.count_documents({"status": "Admitted"})
    total_discharged = patients_col.count_documents({"status": "Discharged"})

    # Unique doctors count
    unique_doctors = len(patients_col.distinct("doctor"))

    # Recent 5 patients
    recent_cursor = patients_col.find({}).sort("createdAt", -1).limit(5)
    recent_patients = [serialize_patient(p) for p in recent_cursor]

    # Monthly admissions for current year (for line chart)
    current_year = datetime.now(timezone.utc).year
    monthly_admissions = _get_monthly_admissions(patients_col, current_year)

    # Status breakdown for donut chart
    status_breakdown = {
        "admitted": total_admitted,
        "discharged": total_discharged,
        "total": total_patients,
    }

    # Top diseases
    top_diseases = list(patients_col.aggregate([
        {"$group": {"_id": "$disease", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5},
        {"$project": {"disease": "$_id", "count": 1, "_id": 0}},
    ]))

    # Top doctors (by patient count)
    top_doctors = list(patients_col.aggregate([
        {"$group": {"_id": "$doctor", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5},
        {"$project": {"doctor": "$_id", "count": 1, "_id": 0}},
    ]))

    stats = {
        "totalPatients": total_patients,
        "totalAdmitted": total_admitted,
        "totalDischarged": total_discharged,
        "uniqueDoctors": unique_doctors,
        "recentPatients": recent_patients,
        "monthlyAdmissions": monthly_admissions,
        "statusBreakdown": status_breakdown,
        "topDiseases": top_diseases,
        "topDoctors": top_doctors,
    }

    return success_response(data=stats, message="Dashboard stats retrieved.")


def _get_monthly_admissions(patients_col, year: int) -> list:
    """Aggregate admissions by month for the given year."""
    month_labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    # Aggregate using admissionDate string (format: YYYY-MM-DD)
    pipeline = [
        {
            "$match": {
                "admissionDate": {
                    "$gte": f"{year}-01-01",
                    "$lte": f"{year}-12-31",
                }
            }
        },
        {
            "$group": {
                "_id": {"$substr": ["$admissionDate", 5, 2]},  # extract MM
                "count": {"$sum": 1},
            }
        },
        {"$sort": {"_id": 1}},
    ]

    result = list(patients_col.aggregate(pipeline))
    monthly_map = {r["_id"]: r["count"] for r in result}

    # Build full 12-month array with 0 for missing months
    monthly_data = []
    for i in range(1, 13):
        month_key = f"{i:02d}"
        monthly_data.append({
            "month": month_labels[i - 1],
            "admissions": monthly_map.get(month_key, 0),
        })

    return monthly_data
