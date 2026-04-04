import asyncio
import os
import sys
from pathlib import Path

# Add backend to sys.path
backend_path = Path("c:/Users/Harsh/Documents/GitHub/coverent/backend")
sys.path.append(str(backend_path))

# Mock environment
os.environ["ENVIRONMENT"] = "development"

async def test_pricing_logic():
    from app.services.ml_service import ml_service
    from app.services import rider_service
    
    rider_id = "9999900003"
    print(f"Testing for rider_id: {rider_id}")
    
    try:
        profile = await rider_service.get_rider_profile(rider_id)
        print(f"Profile fetched: {profile}")
        
        dark_pincode = str(profile.get('dark_store_pincode', '400099')).strip()
        income_tier_str = str(profile.get('income_tier', 'mid')).lower().strip()
        shift_window_str = str(profile.get('shift_window', 'morning')).lower().strip()
        prior_claims = int(profile.get('claim_history_count', 0))
        
        print(f"Features: {dark_pincode}, {income_tier_str}, {shift_window_str}, {prior_claims}")
        
        score, loading, ml_features = ml_service.predict_risk_and_premium(
            dark_pincode,
            income_tier_str,
            shift_window_str,
            prior_claims
        )
        print(f"ML Output: score={score}, loading={loading}, features={ml_features}")
        
        plans = ml_service.get_dynamic_plans(income_tier_str, loading, score)
        print(f"Plans: {plans}")
        
        if profile.get('risk_score') != score:
            print("Updating risk score...")
            await rider_service.update_rider_risk_score(rider_id, score)
            print("Update successful")
            
    except Exception as e:
        print(f"Error occurred: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_pricing_logic())
