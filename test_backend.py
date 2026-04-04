import sys
import os
from pathlib import Path

# Add backend to path
sys.path.append(str(Path(__file__).resolve().parent / 'backend'))

try:
    print("Testing Imports...")
    from app.services.ml_service import ml_service
    from app.models.rider import IncomeTier, ShiftWindow
    print("Imports Success.")
    
    print("Testing ML Function...")
    score, loading, features = ml_service.predict_risk_and_premium(
        "560001", 
        IncomeTier.mid, 
        ShiftWindow.morning, 
        0
    )
    print(f"ML Success: Score={score}, Loading={loading}")
    
    print("Testing Plan Logic...")
    plans = ml_service.get_dynamic_plans(IncomeTier.mid, loading, score)
    print(f"Plan Success: {plans}")

except Exception as e:
    import traceback
    print("CRASH DETECTED:")
    traceback.print_exc()
