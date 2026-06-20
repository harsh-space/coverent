from fastapi import APIRouter, HTTPException
from app.models.trigger import TriggerEvent
from app.services import trigger_service
from app.services.ml_service import ml_service

router = APIRouter(
    prefix="/triggers",
    tags=["Triggers"]
)

@router.post("/event")
async def receive_trigger_event(event: TriggerEvent):
    """
    Called by the Trigger Engine process when a threshold is breached.
    """
    try:
        result = await trigger_service.process_trigger_event(event)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trigger processing failed: {str(e)}")

@router.get("/logs")
async def get_trigger_logs():
    """
    Historical view of all recent triggers.
    """
    from app.services.trigger_service import get_db
    db = get_db()
    logs = db.collection("trigger_logs").order_by("timestamp", direction="DESCENDING").limit(20).stream()
    return [log.to_dict() for log in logs]

@router.get("/claims")
async def get_all_claims():
    """
    Returns all payout logs as claims for the insurer audit dashboard.
    """
    from app.services.trigger_service import get_db
    db = get_db()
    # Payout logs are the system's "claims"
    payouts = db.collection("payout_logs").order_by("timestamp", direction="DESCENDING").limit(50).stream()
    return [p.to_dict() for p in payouts]

@router.get("/forecast")
async def get_7_day_forecast():
    """
    Returns 7-day payout liability forecast using the trained LSTM disruption forecaster.
    Runs predictions across all major zones for the insurer dashboard.
    """
    ZONES = [
        {"name": "Andheri West (400053)", "pincode": "400053", "active_enrolled_riders": 3120, "historical_trigger_frequency": 0.15, "rain_forecast_score": 0.6, "aqi_forecast_score": 0.3},
        {"name": "Delhi NCR (110001)",    "pincode": "110001", "active_enrolled_riders": 4250, "historical_trigger_frequency": 0.22, "rain_forecast_score": 0.8, "aqi_forecast_score": 0.7},
        {"name": "MG Road (560001)",      "pincode": "560001", "active_enrolled_riders": 2890, "historical_trigger_frequency": 0.08, "rain_forecast_score": 0.4, "aqi_forecast_score": 0.2},
        {"name": "Gurgaon (122018)",      "pincode": "122018", "active_enrolled_riders": 1850, "historical_trigger_frequency": 0.18, "rain_forecast_score": 0.7, "aqi_forecast_score": 0.6},
        {"name": "BBD Bagh (700001)",     "pincode": "700001", "active_enrolled_riders": 2100, "historical_trigger_frequency": 0.12, "rain_forecast_score": 0.5, "aqi_forecast_score": 0.4},
    ]

    results = []
    total_claims = 0
    total_liability = 0.0

    for zone in ZONES:
        prediction = ml_service.predict_7_day_liability(zone)
        zone_claims = prediction.get("estimated_claims", 0)
        zone_liability = prediction.get("estimated_liability", 0.0)
        total_claims += zone_claims
        total_liability += zone_liability
        results.append({
            "zone": zone["name"],
            "estimated_claims": zone_claims,
            "estimated_liability": round(zone_liability, 2),
            "active_riders": zone["active_enrolled_riders"],
            "status": prediction.get("status", "unknown")
        })

    return {
        "zones": results,
        "total_estimated_claims": total_claims,
        "total_estimated_liability": round(total_liability, 2),
        "forecast_window_days": 7
    }
