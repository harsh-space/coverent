from firebase_admin import firestore, messaging
from datetime import datetime, timedelta
from app.models.trigger import TriggerEvent
import uuid
import random
from app.services.ml_service import ml_service

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
    riders = list(riders_ref.stream())
    
    payouts = []
    for rider in riders:
        data = rider.to_dict()
        rider_id = rider.id
        
        # 3. Eligibility Checks
        if not data.get("active_policy"):
            continue
            
        # Check for policy expiration
        valid_until_str = data.get("valid_until")
        if valid_until_str:
            try:
                valid_until = datetime.fromisoformat(valid_until_str)
                if datetime.utcnow() > valid_until:
                    continue # Policy expired!
            except ValueError:
                pass
            
        # Grace Period Check (fetch latest from platform_data)
        platform_id = data.get("platform_id", "").upper().strip()
        active_days = 0
        if platform_id:
            p_doc = db.collection("platform_data").document(platform_id).get()
            if p_doc.exists:
                active_days = p_doc.to_dict().get("active_days", 0)
        
        if active_days < 7: # Restored from 0 to 7 to enforce real eligibility
            db.collection("payout_logs").add({
                "rider_id": rider_id,
                "trigger_id": trigger_id,
                "status": "blocked",
                "reason": "grace_period_active",
                "active_days": active_days,
                "timestamp": datetime.utcnow().isoformat()
            })
            continue

        # Idempotency Check (2-second window for ultra-responsive stress testing)
        short_window = (datetime.utcnow() - timedelta(seconds=2)).isoformat()
        
        # Basic query only (No Index Required)
        existing_docs = db.collection("payout_logs") \
                          .where("rider_id", "==", rider_id) \
                          .limit(10).get()
            
        is_duplicate = False
        for doc in existing_docs:
            p_data = doc.to_dict()
            if p_data.get("trigger_type") == event.trigger_type and \
               p_data.get("status") == "completed" and \
               p_data.get("timestamp", "") >= short_window:
                is_duplicate = True
                break
                
        if is_duplicate:
            print(f"DEBUG: [ENGINE] Skipping duplicate for {rider_id}")
            continue

        # Tiered Payout Logic
        tier_payout_map = {
            'low': 420.0,
            'mid': 630.0,
            'high': 805.0
        }
        
        income_tier = str(data.get('income_tier', 'mid')).lower().strip()
        base_payout_for_tier = tier_payout_map.get(income_tier, 630.0)
        
        if event.severity <= 5.0:
            multiplier = 0.30 
        elif event.severity <= 8.0:
            multiplier = 0.60 
        else:
            multiplier = 1.0  
            
        payout_amount = base_payout_for_tier * multiplier
            
        payout_id = str(uuid.uuid4())
        
        # --- ML FRAUD ENGINE INTEGRATION ---
        # Simulate 5-signal data for the fraud engine
        # 5% chance of simulating a spoofer to demonstrate the Isolation Forest
        is_simulated_spoofer = random.random() < 0.05
        
        if is_simulated_spoofer:
            claim_data = {
                'location_continuity': random.uniform(0.0, 0.3),
                'accelerometer_variance': random.gauss(0.2, 0.1),
                'minutes_active_pre_trigger': random.randint(0, 5),
                'cell_tower_mismatch_meters': random.uniform(2000, 10000),
                'zone_history_deliveries': random.randint(0, 2)
            }
        else:
            claim_data = {
                'location_continuity': random.uniform(0.7, 1.0),
                'accelerometer_variance': random.gauss(5.0, 1.5),
                'minutes_active_pre_trigger': random.randint(20, 240),
                'cell_tower_mismatch_meters': random.uniform(0, 800),
                'zone_history_deliveries': random.randint(5, 200)
            }
            
        # Ensure non-negative variance
        claim_data['accelerometer_variance'] = max(0, claim_data['accelerometer_variance'])
        
        fraud_result = ml_service.evaluate_fraud_claim(claim_data)
        payout_status = "flagged" if fraud_result.get("is_fraud") else "completed"
        # -----------------------------------

        payout_entry = {
            "payout_id": payout_id,
            "rider_id": rider_id,
            "name": data.get("name", "Rider"),
            "trigger_id": trigger_id,
            "amount": payout_amount,
            "trigger_type": event.trigger_type,
            "status": payout_status,
            "tier_percentage": int(multiplier * 100),
            "timestamp": datetime.utcnow().isoformat(),
            "is_simulated_fraud": is_simulated_spoofer # added for debug visibility
        }
        
        db.collection("payout_logs").document(payout_id).set(payout_entry)
        payouts.append(payout_entry)
        
        # --- SEND PUSH NOTIFICATION ---
        if payout_status == "completed":
            fcm_token = data.get("fcm_token")
            if fcm_token:
                try:
                    message = messaging.Message(
                        notification=messaging.Notification(
                            title=f"Instant Payout Settled: ₹{payout_amount}",
                            body=f"Reason: {event.trigger_type.replace('_', ' ').upper()}",
                        ),
                        token=fcm_token,
                    )
                    messaging.send(message)
                    print(f"DEBUG: [FCM] Push Notification sent to {rider_id}")
                except Exception as e:
                    print(f"ERROR: [FCM] Push Notification failed for {rider_id}: {e}")
        # ------------------------------
        
    return {
        "trigger_id": trigger_id,
        "affected_count": len(payouts),
        "payouts": payouts
    }
