from fastapi import APIRouter, HTTPException

router = APIRouter(
    prefix="/api/platforms",
    tags=["Platform Mocks"]
)

@router.get("/verify-rider/{platform_id}")
async def verify_rider_platform_data(platform_id: str):
    """
    Mocked endpoint simulating an external Platform API (Zepto, Blinkit, etc.).
    This verifies the rider's historical "Active Days" before onboarding.
    """
    # 🏆 Demo Mock Database:
    mock_platform_db = {
        "BLK-RAVI-01": {"active_days": 3, "name": "Ravi K."},
        "ZEP-PRIYA-02": {"active_days": 12, "name": "Priya S."},
        "SWG-ARJUN-03": {"active_days": 22, "name": "Arjun V."},
        "TEST-PASS": {"active_days": 10, "name": "Test User"},
        "TEST-FAIL": {"active_days": 4, "name": "Test User"}
    }

    data = mock_platform_db.get(platform_id.upper())
    
    if not data:
        # Fallback for any unknown ID to 4 days (not eligible)
        return {
            "platform_id": platform_id,
            "active_days": 4,
            "is_eligible": False,
            "message": "UNKNOWN ID: RECENT JOINER"
        }

    is_eligible = data["active_days"] >= 7
    
    return {
        "platform_id": platform_id,
        "active_days": data["active_days"],
        "is_eligible": is_eligible,
        "message": "7+ DAYS ACTIVE: ELIGIBLE" if is_eligible else f"{7 - data['active_days']} MORE DAYS NEEDED"
    }
