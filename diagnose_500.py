import sys
import os
import asyncio
from pathlib import Path

# Setup paths
BACKEND_DIR = Path("c:/Users/Harsh/Documents/GitHub/coverent/backend")
sys.path.append(str(BACKEND_DIR))

os.environ["ENVIRONMENT"] = "development" # Bypass token checks

async def diagnose():
    print("--- 🔬 Starting Hardcore Diagnosis ---")
    
    try:
        print("1. Testing app.main Import...")
        import app.main
        print("✅ app.main imported successfully.")
        
        print("2. Testing Firebase Initialization...")
        import firebase_admin
        from firebase_admin import firestore
        db = firestore.client()
        print(f"✅ Firebase Admin check: {db.project}")
        
        print("3. Testing ML Service Lazy Load...")
        from app.services.ml_service import ml_service
        print("✅ ml_service imported.")
        
        print("4. Testing predict_risk_and_premium...")
        score, loading, features = ml_service.predict_risk_and_premium("560001", "mid", "morning", 0)
        print(f"✅ ML Success: Score={score}, Loading={loading}")
        
        print("5. Testing rider_service.get_rider_profile(9999900003)...")
        from app.services import rider_service
        profile = await rider_service.get_rider_profile("9999900003")
        print(f"✅ Profile Success: Name={profile.get('name')}")
        
        print("6. Testing FULL pricing-logic call (Direct simulation)...")
        from app.models.rider import IncomeTier
        dark_pincode = str(profile.get('dark_store_pincode', '400099')).strip()
        income_tier_str = str(profile.get('income_tier', 'mid')).lower().strip()
        shift_window_str = str(profile.get('shift_window', 'morning')).lower().strip()
        prior_claims = int(profile.get('claim_history_count', 0))

        score, loading, ml_features = ml_service.predict_risk_and_premium(
            dark_pincode,
            income_tier_str,
            shift_window_str,
            prior_claims
        )
        print(f"✅ Full Prediction Success: {score}")

    except Exception as e:
        import traceback
        print("\n--- ❌ CRASH DETECTED ---")
        traceback.print_exc()
        print("------------------------\n")

if __name__ == "__main__":
    asyncio.run(diagnose())
