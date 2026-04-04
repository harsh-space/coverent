from fastapi import APIRouter, HTTPException
from app.models.rider import RiderRegistrationRequest, RiderRegisterResponse, RiderLoginRequest, PolicyPurchaseRequest
from app.services import rider_service
import traceback
from app.services.ml_service import ml_service

router = APIRouter(
    prefix="/api/riders",
    tags=["Riders"]
)

@router.post("/login", response_model=RiderRegisterResponse)
async def login_rider(request: RiderLoginRequest):
    try:
        result = await rider_service.login_rider(request.phone, request.otp)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/register", response_model=RiderRegisterResponse, status_code=201)
async def register_rider(request: RiderRegistrationRequest):
    try: 
        result = await rider_service.register_rider(request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/profile/{rider_id}")
async def get_rider_profile(rider_id: str):
    try:
        profile = await rider_service.get_rider_profile(rider_id)
        # Ensure it exists
        if not profile:
            raise HTTPException(status_code=404, detail="Rider profile not found")
        return profile
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@router.post("/purchase-policy")
async def purchase_policy(request: PolicyPurchaseRequest):
    try:
        return await rider_service.purchase_policy(request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/pricing-logic/{rider_id}")
async def get_pricing_logic(rider_id: str):
    """
    Expose the ML-calculated premiums and risk score for a specific rider.
    """
    try:
        # 1. Fetch rider data
        profile = await rider_service.get_rider_profile(rider_id)
        if not profile:
            raise HTTPException(status_code=404, detail="Rider not found.")
        
        # 2. Extract and sanitize profile data for ML (use raw strings to avoid Enum Mismatches)
        dark_pincode = str(profile.get('dark_store_pincode', '400099')).strip()
        income_tier_str = str(profile.get('income_tier', 'mid')).lower().strip()
        shift_window_str = str(profile.get('shift_window', 'morning')).lower().strip()
        prior_claims = int(profile.get('claim_history_count', 0))

        # 3. Predict risk and loading (pass raw strings)
        score, loading, ml_features = ml_service.predict_risk_and_premium(
            dark_pincode,
            income_tier_str,
            shift_window_str,
            prior_claims
        )
        
        # 4. Get Dynamic Pricing Plans (pass raw strings and loss ratio)
        l_ratio = ml_features.get('pincode_loss_ratio', 25)
        plans = ml_service.get_dynamic_plans(income_tier_str, loading, score, l_ratio)
        
        # 5. Sync risk score if needed
        if profile.get('risk_score') != score:
            await rider_service.update_rider_risk_score(rider_id, score)

        return {
            "risk_score": score,
            "pricing": plans,
            "features": {
                "zone_flood_score": ml_features.get('zone_flood_score', 3),
                "zone_aqi_score": ml_features.get('zone_aqi_score', 4),
                "ai_adjustment": loading,
                "is_restricted": plans.get("is_restricted", False),
                "pincode_loss_ratio": l_ratio
            },
            "active_days_count": profile.get("active_days_count", 0),
            "is_eligible_for_policy": profile.get("is_eligible_for_policy", False),
            "is_restricted": plans.get("is_restricted", False),
            "pincode": dark_pincode
        }
    except Exception as e:
        print("\n" + "!" * 50)
        print(f"FATAL ERROR IN PRICING LOGIC FOR RIDER {rider_id}: {str(e)}")
        traceback.print_exc()
        print("!" * 50 + "\n")
        raise HTTPException(status_code=500, detail=str(e))