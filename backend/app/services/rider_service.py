from firebase_admin import firestore, auth
from datetime import datetime, timedelta
from app.models.rider import RiderRegistrationRequest, PolicyPurchaseRequest
import os

def get_db():
    return firestore.client()

async def register_rider(request: RiderRegistrationRequest):
    print(f"DEBUG: Starting registration for {request.name}")
    db = get_db()
    
    if os.getenv("ENVIRONMENT") == "development":
        rider_id = request.firebase_token 
        phone_number = request.phone
    else:
        try: 
            decoded_token = auth.verify_id_token(request.firebase_token)
            rider_id = decoded_token['uid']
            phone_number = decoded_token.get("phone_number", "")
        except Exception:
            raise ValueError("Invalid Firebase token")
    
    rider_ref = db.collection("riders").document(rider_id)
    rider_doc = rider_ref.get()
    if rider_doc.exists:
        raise ValueError("Rider already registered")
    
    rider_data = {
        "rider_id": rider_id,
        "name": request.name,
        "phone_number": phone_number,
        "platform": request.platform.value,
        "platform_id": request.platform_id,
        "dark_store_pincode": request.dark_store_pincode,
        "upi_id": request.upi_id,
        "income_tier": request.income_tier.value,
        "shift_window": request.shift_window.value,
        "risk_score": None,          
        "active_policy": False,
        "active_days_count": 0,      
        "is_eligible_for_policy": False,
        "registered_at": datetime.utcnow().isoformat(),
        "status": "registered"
    }
    rider_ref.set(rider_data)
    
    # NEW LOGIC: Also set up the Mock Platform DB entry for this rider if it doesn't exist
    platform_ref = db.collection("platform_data").document(request.platform_id.upper())
    if not platform_ref.get().exists:
        platform_ref.set({
            "platform_id": request.platform_id.upper(),
            "name": request.name,
            "active_days": 0
        })

    print(f"DEBUG: Registration complete for {rider_id}")

    return {
        "rider_id": rider_id,
        "status": "registered",
        "message": "Registration successful",
        "next_step": "awaiting_active_days"
    }

async def purchase_policy(request: PolicyPurchaseRequest):
    db=get_db()
    rider_ref=db.collection("riders").document(request.rider_id)
    
    rider_doc=rider_ref.get()
    if not rider_doc.exists:
        raise ValueError("Rider not found")

    # Parametric window: Valid until the upcoming Sunday 23:59:59
    now = datetime.utcnow()
    days_until_sunday = (6 - now.weekday()) % 7
    if days_until_sunday == 0 and now.hour >= 23: # If it's already late Sunday, move to next week
        days_until_sunday = 7
        
    sunday_deadline = (now + timedelta(days=days_until_sunday)).replace(hour=23, minute=59, second=59, microsecond=0)
    valid_until = sunday_deadline.isoformat()
    
    policy_data = {
        "active_policy": True,
        "policy_type": request.policy_type.value,
        "policy_name": request.policy_type.value.replace("_", " ").title(),
        "valid_until": valid_until,
        "purchased_at": now.isoformat()
    }
    
    rider_ref.update(policy_data)

    return {
        "status": "success",
        "message": f"Policy {policy_data['policy_name']} activated successfully",
        "policy_details": policy_data
    }

async def get_rider_profile(rider_id: str):
    print(f"DEBUG: Fetching profile for ID: {rider_id}")
    db = get_db()
    rider_ref = db.collection("riders").document(rider_id)
    rider_doc = rider_ref.get()
    
    if not rider_doc.exists:
        print(f"DEBUG: ERROR - Profile not found for {rider_id}")
        raise ValueError("Rider not found")
        
    rider_dict = rider_doc.to_dict()
    
    # NEW LOGIC: Always override active_days_count with latest from platform_data
    platform_id = rider_dict.get("platform_id", "").upper()
    active_days = 0 # Default fallback
    if platform_id:
        p_doc = db.collection("platform_data").document(platform_id).get()
        if p_doc.exists:
            active_days = p_doc.to_dict().get("active_days", 0)
            # Sync back to rider collection if it changed
            if active_days != rider_dict.get("active_days_count"):
                rider_ref.update({"active_days_count": active_days})
            
    rider_dict["rider_id"] = rider_doc.id
    rider_dict["active_days_count"] = active_days
    rider_dict["is_eligible_for_policy"] = active_days >= 7

    # Fetch latest payouts (payout_logs) for this rider
    payouts_ref = db.collection("payout_logs").where("rider_id", "==", rider_doc.id).limit(20)
    payout_docs = payouts_ref.stream()
    
    all_payouts = []
    for p in payout_docs:
        p_data = p.to_dict()
        if p_data.get("status") == "completed":
            all_payouts.append(p_data)
            
    # Sort by timestamp descending in Python to avoid needing a Firestore composite index
    all_payouts.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
    rider_dict["payout_history"] = all_payouts

    return rider_dict

async def login_rider(phone: str, otp: str):
    print(f"DEBUG: Login Attempt - Phone: {phone}, OTP: {otp}")
    
    # Mock OTP check for demo
    if otp != "1234":
        print("DEBUG: ERROR - Invalid OTP provided")
        raise ValueError("Invalid OTP. Use 1234 for testing.")
        
    db = get_db()
    # In development mode, phone number is used as ID
    rider_ref = db.collection("riders").document(phone)
    rider_doc = rider_ref.get()
    
    if not rider_doc.exists:
        print(f"DEBUG: ERROR - No account found for phone: {phone}")
        raise ValueError("No account found for this number. Please register.")
        
    print(f"DEBUG: Login SUCCESS for {phone}")
    return {
        "rider_id": phone,
        "status": "logged_in",
        "message": "Login successful",
        "next_step": "dashboard"
    }

async def update_rider_risk_score(rider_id: str, risk_score: int):
    """Update risk score in Firestore"""
    db = get_db()
    rider_ref = db.collection("riders").document(rider_id)
    rider_ref.update({"risk_score": risk_score})