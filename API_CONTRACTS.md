# GigShield API Contracts

Base URL: http://localhost:8000

---

## 1. Health Check

GET /health

Response:
{
  "status": "ok",
  "firebase": "connected"
}

---

## 2. Register User

POST /register

Request:
{
  "name": "Ravi",
  "phone": "9876543210",
  "platform": "Blinkit",
  "pincode": "110085",
  "income_tier": "Mid",
  "upi_id": "ravi@upi"
}

Response:
{
  "user_id": "user_123",
  "message": "User registered successfully"
}

---

## 3. Get Risk Score (ML)

POST /risk-score

Request:
{
  "pincode": "110085",
  "city": "Delhi",
  "shift_hours": 8
}

Response:
{
  "risk_score": 74,
  "premium_adjustment": 30
}

---

## 4. Create Policy

POST /create-policy

Request:
{
  "user_id": "user_123",
  "plan": "Plus",
  "weekly_income": 5400
}

Response:
{
  "policy_id": "policy_456",
  "premium": 169,
  "status": "active"
}

---

## 5. Get Policy

GET /policy/{user_id}

Response:
{
  "policy_id": "policy_456",
  "plan": "Plus",
  "premium": 169,
  "status": "active"
}

---

## 6. Create Claim (Triggered Automatically)

POST /claim

Request:
{
  "user_id": "user_123",
  "trigger_type": "rain",
  "disrupted_hours": 4
}

Response:
{
  "claim_id": "claim_789",
  "status": "approved",
  "payout": 630
}

---

## 7. Fraud Check (ML)

POST /ml/fraud-check

Request:
{
  "distance": 2,
  "login_gap": 10,
  "claims": 1,
  "speed": 25
}

Response:
{
  "result": "CLEAR"
}

---

## 8. Payout

POST /payout

Request:
{
  "claim_id": "claim_789"
}

Response:
{
  "status": "success",
  "message": "₹630 sent to UPI"
}

---

## 9. Get Claims (Dashboard)

GET /claims

Response:
[
  {
    "name": "Ravi",
    "trigger": "rain",
    "amount": 630,
    "status": "approved",
    "time": "2:15 PM"
  }
]

---

## 10. Get Analytics

GET /analytics

Response:
{
  "total_claims": 24,
  "total_payout": 14200,
  "active_policies": 312
}

---

## 11. Trigger Logs

GET /triggers

Response:
[
  {
    "type": "rain",
    "location": "Rohini",
    "time": "11:30 AM",
    "affected_riders": 42
  }
]

