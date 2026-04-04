import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load from backend/.env
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(backend_dir, '.env'))

FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH")
# Resolve relative to backend folder if not absolute
if not os.path.isabs(FIREBASE_CREDENTIALS_PATH):
    FIREBASE_CREDENTIALS_PATH = os.path.join(backend_dir, FIREBASE_CREDENTIALS_PATH)

if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def seed_demo_riders():
    """
    Seeds 3 distinct rider personas for testing:
    1. Ravi (The Newbie): Ineligible (< 7 days)
    2. Priya (The Clean Record Pro): Eligible, Low Risk Discount
    3. Arjun (The High Risk Pro): Eligible, High AI Loading
    """
    
    riders = [
        {
            "id": "9999900001",
            "name": "Ravi (Newbie)",
            "phone_number": "9999900001",
            "active_days_count": 3,
            "is_eligible_for_policy": False,
            "claim_history_count": 0,
            "dark_store_pincode": "110001",
            "income_tier": "mid",
            "shift_window": "morning",
            "platform": "blinkit",
            "platform_id": "BLK-RAVI-01",
            "upi_id": "ravi@okicici",
            "active_policy": False,
            "risk_score": None
        },
        {
            "id": "9999900002",
            "name": "Priya (Clean Pro)",
            "phone_number": "9999900002",
            "active_days_count": 12,
            "is_eligible_for_policy": True,
            "claim_history_count": 0,
            "dark_store_pincode": "560001", # Bangalore (Lower AQI/Risk)
            "income_tier": "mid",
            "shift_window": "morning",
            "platform": "zepto",
            "platform_id": "ZEP-PRIYA-02",
            "upi_id": "priya@okaxis",
            "active_policy": False,
            "risk_score": None
        },
        {
            "id": "9999900003",
            "name": "Arjun (High Risk Pro)",
            "phone_number": "9999900003",
            "active_days_count": 22,
            "is_eligible_for_policy": True,
            "claim_history_count": 10, # Very High claims
            "dark_store_pincode": "400099", # Mumbai High Flood (9) and High AQI (9)
            "income_tier": "high",
            "shift_window": "full_day", # Maximum risk shift
            "platform": "swiggy_instamart",
            "platform_id": "SWG-ARJUN-03",
            "upi_id": "arjun@okhdfc",
            "active_policy": False,
            "risk_score": None
        }
    ]

    for rider_data in riders:
        rider_id = rider_data.pop("id")
        rider_data["registered_at"] = datetime.utcnow().isoformat()
        rider_data["status"] = "registered"
        
        # Save Rider
        db.collection("riders").document(rider_id).set(rider_data)
        
        # Save Platform Data
        db.collection("platform_data").document(rider_data["platform_id"]).set({
            "platform_id": rider_data["platform_id"],
            "name": rider_data["name"],
            "active_days": rider_data["active_days_count"]
        })
        print(f"Seeded User & Platform Data: {rider_data['name']} (Phone: {rider_id})")

if __name__ == "__main__":
    seed_demo_riders()
