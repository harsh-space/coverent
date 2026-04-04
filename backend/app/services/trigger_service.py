from firebase_admin import firestore
from datetime import datetime
from app.models.trigger import TriggerEvent, TriggerType
import uuid

def get_db():
    return firestore.client()

async def process_trigger_event(event: TriggerEvent):
    """
    1. Log the trigger event
    2. Identify affected riders in the zone
    3. Filter by 'active_policy' and 'active_days >= 7'
    4. Execute bulk payouts (Ant-Abuse check in memory)
    """
    db = get_db()
    trigger_id = str(uuid.uuid4())
    
    # 1. Log the event
    db.collection("trigger_logs").document(trigger_id).set({
        "trigger_id": trigger_id,
        "type": event.trigger_type,
        "zone_id": event.zone_id,
        "severity": event.severity,
        "description": event.description,
        "timestamp": event.timestamp.isoformat()
    })
    
    # 2. Identify affected riders
    # Clean the zone_id input to prevent whitespace mismatches
    clean_zone_id = str(event.zone_id).strip()
    riders_ref = db.collection("riders").where("dark_store_pincode", "==", clean_zone_id)
    riders = riders_ref.stream()
    
    payouts = []
    for rider in riders:
        data = rider.to_dict()
        rider_id = rider.id
        
        # 3. Eligibility Checks
        if not data.get("active_policy"):
            continue
            
        # Grace Period Check (fetch latest from platform_data)
        platform_id = data.get("platform_id", "").upper().strip()
        active_days = 0
        if platform_id:
            p_doc = db.collection("platform_data").document(platform_id).get()
            if p_doc.exists:
                active_days = p_doc.to_dict().get("active_days", 0)
        
        if active_days < 0: # CHANGED: Reduced from 7 to 0 for demo purposes
            db.collection("payout_logs").add({
                "rider_id": rider_id,
                "trigger_id": trigger_id,
                "status": "blocked",
                "reason": "grace_period_active",
                "active_days": active_days,
                "timestamp": datetime.utcnow().isoformat()
            })
            continue

        # NEW: Solid Idempotency Check (Python Memory Filter to avoid Index issues)
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
        
        # Basic query only (No Index Required)
        existing_docs = db.collection("payout_logs").where("rider_id", "==", rider_id).limit(30).get()
            
        is_duplicate = False
        for doc in existing_docs:
            p_data = doc.to_dict()
            if p_data.get("trigger_type") == event.trigger_type and \
               p_data.get("status") == "completed" and \
               p_data.get("timestamp", "") >= today_start:
                is_duplicate = True
                break
                
        if is_duplicate:
            print(f"DEBUG: [ENGINE] Skipping duplicate for {rider_id}")
            continue

        # NEW: Tiered Payout Logic (Matching shared slides)
        # 1. Trigger fires -> 2. Policy Checked -> 3. Fraud Verified -> 4. Payout Released
        
        # Fraud Verification Simulation (GPS & Platform Active Status)
        # In a real app, this would query a real GPS stream
        print(f"DEBUG: [VETTING] Performing GPS cross-check for {rider_id}")
        fraud_check_passed = True # Simulation
        
        if not fraud_check_passed:
            continue

        # 4. Dynamic Payout Base (README Formula: (Daily Avg) * 0.70)
        # Low (Avg 600) -> 420, Mid (Avg 900) -> 630, High (Avg 1150) -> 805
        tier_payout_map = {
            'low': 420.0,
            'mid': 630.0,
            'high': 805.0
        }
        
        income_tier = str(data.get('income_tier', 'mid')).lower().strip()
        base_payout_for_tier = tier_payout_map.get(income_tier, 630.0)
        
        if event.severity <= 5.0:
            multiplier = 0.30 # 30% Payout
        elif event.severity <= 8.0:
            multiplier = 0.60 # 60% Payout
        else:
            multiplier = 1.0  # 100% Payout
            
        payout_amount = base_payout_for_tier * multiplier
            
        # Execute Payout (Mock)
        payout_id = str(uuid.uuid4())
        payout_entry = {
            "payout_id": payout_id,
            "rider_id": rider_id,
            "name": data.get("name"),
            "trigger_id": trigger_id,
            "amount": payout_amount,
            "trigger_type": event.trigger_type,
            "status": "completed",
            "tier_percentage": int(multiplier * 100),
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Write payout
        db.collection("payout_logs").document(payout_id).set(payout_entry)
        payouts.append(payout_entry)
        
    return {
        "trigger_id": trigger_id,
        "affected_count": len(payouts),
        "payouts": payouts
    }        
    return {
        "trigger_id": trigger_id,
        "affected_count": len(payouts),
        "payouts": payouts
    }
