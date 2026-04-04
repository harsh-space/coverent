from fastapi import APIRouter, HTTPException
from app.models.trigger import TriggerEvent
from app.services import trigger_service

router = APIRouter(
    prefix="/api/triggers",
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
