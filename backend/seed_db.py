import firebase_admin
from firebase_admin import credentials, firestore
import os
import sys
from datetime import datetime, timedelta

# Add backend to path to import config
from pathlib import Path
BACKEND_DIR = Path(__file__).resolve().parent
sys.path.append(str(BACKEND_DIR))
from app.config import FIREBASE_CREDENTIALS_PATH


if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def clear_collection(collection_name):
    print(f"Cleaning {collection_name}...")
    docs = db.collection(collection_name).stream()
    for doc in docs:
        doc.reference.delete()

def seed_database():
    # 1. Clear everything
    clear_collection("riders")
    clear_collection("platform_data")
    clear_collection("payout_logs")
    clear_collection("trigger_logs")

    now = datetime.utcnow()
    one_week_later = (now + timedelta(days=7)).replace(hour=23, minute=59, second=59).isoformat()

    # ---------------------------------------------------------
    # RIDER 1: HARSH (ID: 9999999999)
    # PURPOSE: Demonstrating Protected Status & Normal Operation
    # ---------------------------------------------------------
    harsh_id = "9999999999"
    db.collection("riders").document(harsh_id).set({
        "rider_id": harsh_id,
        "name": "Harsh (Protected)",
        "phone_number": harsh_id,
        "platform": "blinkit",
        "platform_id": "BLK-HARSH",
        "dark_store_pincode": "110001",
        "upi_id": "harsh@wallet",
        "income_tier": "high",
        "shift_window": "full_day",
        "risk_score": 44,
        "active_policy": True,
        "policy_name": "Suraksha Plus",
        "policy_type": "suraksha_plus",
        "active_days_count": 10,
        "is_eligible_for_policy": True,
        "valid_until": one_week_later,
        "purchased_at": now.isoformat(),
        "status": "registered"
    })
    db.collection("platform_data").document("BLK-HARSH").set({
        "platform_id": "BLK-HARSH",
        "name": "Harsh",
        "active_days": 10
    })

    # ---------------------------------------------------------
    # RIDER 2: RAVI (ID: 9999999998)
    # PURPOSE: Demonstrating Eligibility Restriction (Newbie)
    # ---------------------------------------------------------
    ravi_id = "9999999998"
    db.collection("riders").document(ravi_id).set({
        "rider_id": ravi_id,
        "name": "Ravi (Newbie Restricted)",
        "phone_number": ravi_id,
        "platform": "swiggy_instamart",
        "platform_id": "SW-RAVI",
        "dark_store_pincode": "110001",
        "upi_id": "ravi@upi",
        "income_tier": "mid",
        "shift_window": "part_time",
        "risk_score": 52,
        "active_policy": True,
        "policy_name": "Suraksha Basic",
        "policy_type": "suraksha_basic",
        "active_days_count": 3,
        "is_eligible_for_policy": False,
        "valid_until": one_week_later,
        "purchased_at": now.isoformat(),
        "status": "registered"
    })
    db.collection("platform_data").document("SW-RAVI").set({
        "platform_id": "SW-RAVI",
        "name": "Ravi",
        "active_days": 3
    })

    # ---------------------------------------------------------
    # RIDER 3: SONIA (ID: 9999999997)
    # PURPOSE: Demonstrating High Risk / Dynamic Premium
    # ---------------------------------------------------------
    sonia_id = "9999999997"
    db.collection("riders").document(sonia_id).set({
        "rider_id": sonia_id,
        "name": "Sonia (High Risk Demo)",
        "phone_number": sonia_id,
        "platform": "zepto",
        "platform_id": "ZP-SONIA",
        "dark_store_pincode": "400053",
        "upi_id": "sonia@paytm",
        "income_tier": "low",
        "shift_window": "night_shift",
        "risk_score": 92, # High risk manually set
        "active_policy": False,
        "active_days_count": 15,
        "is_eligible_for_policy": True,
        "status": "registered"
    })
    db.collection("platform_data").document("ZP-SONIA").set({
        "platform_id": "ZP-SONIA",
        "name": "Sonia",
        "active_days": 15
    })

    # ---------------------------------------------------------
    # RIDER 4: AMIT (ID: 9999999996)
    # PURPOSE: Demonstrating Historical Claims & Payout Logic
    # ---------------------------------------------------------
    amit_id = "9999999996"
    db.collection("riders").document(amit_id).set({
        "rider_id": amit_id,
        "name": "Amit (Historical Claims)",
        "phone_number": amit_id,
        "platform": "zomato",
        "platform_id": "ZM-AMIT",
        "dark_store_pincode": "110001",
        "upi_id": "amit@ybl",
        "income_tier": "high",
        "shift_window": "full_day",
        "risk_score": 45,
        "active_policy": True,
        "policy_name": "Suraksha Plus",
        "policy_type": "suraksha_plus",
        "active_days_count": 25,
        "is_eligible_for_policy": True,
        "valid_until": one_week_later,
        "purchased_at": now.isoformat(),
        "status": "registered"
    })
    db.collection("platform_data").document("ZM-AMIT").set({
        "platform_id": "ZM-AMIT",
        "name": "Amit",
        "active_days": 25
    })

    # Seed some historical payouts for Amit
    payout_id_1 = "payout-amit-1"
    db.collection("payout_logs").document(payout_id_1).set({
        "payout_id": payout_id_1,
        "rider_id": amit_id,
        "name": "Amit",
        "trigger_id": "trigger-rainfall-old",
        "amount": 805.0,
        "trigger_type": "rainfall",
        "status": "completed",
        "tier_percentage": 100,
        "timestamp": (now - timedelta(days=2)).isoformat()
    })

    payout_id_2 = "payout-amit-2"
    db.collection("payout_logs").document(payout_id_2).set({
        "payout_id": payout_id_2,
        "rider_id": amit_id,
        "name": "Amit",
        "trigger_id": "trigger-aqi-old",
        "amount": 483.0,
        "trigger_type": "aqi",
        "status": "completed",
        "tier_percentage": 60,
        "timestamp": (now - timedelta(days=5)).isoformat()
    })

    print("Success: Database seeded for Phase 2 deliverables!")

if __name__ == "__main__":
    seed_database()
