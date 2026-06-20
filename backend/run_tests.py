import requests
import json
import sys

BASE = 'http://localhost:8001'

passed = 0
failed = 0
errors = []

def test(name, fn):
    global passed, failed
    try:
        fn()
        print(f"  [PASS] {name}")
        passed += 1
    except AssertionError as e:
        print(f"  [FAIL] {name}: {e}")
        failed += 1
        errors.append(f"{name}: {e}")
    except Exception as e:
        print(f"  [ERROR] {name}: {e}")
        failed += 1
        errors.append(f"{name}: {e}")

print("=" * 60)
print("COVERENT BACKEND - COMPREHENSIVE TEST SUITE")
print("=" * 60)

# --- GROUP 1: Core Health ---
print("\n[GROUP 1] Core Health")

def test_health():
    r = requests.get(f"{BASE}/")
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    assert r.json().get("status") == "ok", f"Expected status=ok, got {r.json()}"

def test_openapi():
    r = requests.get(f"{BASE}/openapi.json")
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    data = r.json()
    assert "paths" in data, "openapi.json missing 'paths'"

test("Health Check GET /", test_health)
test("OpenAPI Schema GET /openapi.json", test_openapi)

# --- GROUP 2: Platform API ---
print("\n[GROUP 2] Platform API")

def test_platform_eligible():
    r = requests.get(f"{BASE}/api/platforms/verify-rider/ZEP-PRIYA-02")
    assert r.status_code == 200
    data = r.json()
    assert data["is_eligible"] == True, f"ZEP-PRIYA-02 should be eligible. Got: {data}"
    assert data["active_days"] >= 7

def test_platform_ineligible():
    r = requests.get(f"{BASE}/api/platforms/verify-rider/BLK-RAVI-01")
    assert r.status_code == 200
    data = r.json()
    assert data["is_eligible"] == False, f"BLK-RAVI-01 should NOT be eligible. Got: {data}"
    assert data["active_days"] < 7

def test_platform_unknown():
    r = requests.get(f"{BASE}/api/platforms/verify-rider/UNKNOWN-RIDER-999")
    assert r.status_code == 200
    data = r.json()
    assert "active_days" in data  # Should return fallback, not 500

test("Platform: eligible rider (ZEP-PRIYA-02)", test_platform_eligible)
test("Platform: ineligible rider (BLK-RAVI-01)", test_platform_ineligible)
test("Platform: unknown rider fallback", test_platform_unknown)

# --- GROUP 3: Rider Registration ---
print("\n[GROUP 3] Rider Registration")

RIDER_ID = "9111111111"  # In dev mode, rider_id = phone number

def test_register_rider():
    payload = {
        "name": "Backend Test Rider",
        "phone": "9111111111",
        "firebase_token": "test_token_backendtest001",
        "platform": "zepto",
        "platform_id": "ZEP-BGTEST-01",
        "dark_store_pincode": "110001",
        "upi_id": "bgtest@okaxis",
        "income_tier": "mid",
        "shift_window": "evening"
    }
    r = requests.post(f"{BASE}/api/riders/register", json=payload)
    # 201 = new, 400 = already exists (ok for retests)
    assert r.status_code in [201, 400], f"Unexpected status: {r.status_code} - {r.text}"
    if r.status_code == 201:
        data = r.json()
        assert "rider_id" in data
        assert data["status"] == "registered"
        print(f"      Registered Rider ID: {data['rider_id']}")
    else:
        print(f"      Rider already exists (expected for retests)")


def test_register_invalid_pincode():
    payload = {
        "name": "Bad Pincode",
        "phone": "9222222222",
        "firebase_token": "bad_pincode_test",
        "platform": "blinkit",
        "platform_id": "BLK-BAD-01",
        "dark_store_pincode": "1234",  # Invalid: only 4 digits
        "upi_id": "bad@okaxis",
        "income_tier": "low",
        "shift_window": "morning"
    }
    r = requests.post(f"{BASE}/api/riders/register", json=payload)
    assert r.status_code == 422, f"Expected 422 (validation error), got {r.status_code}"

def test_register_invalid_upi():
    payload = {
        "name": "Bad UPI",
        "phone": "9333333333",
        "firebase_token": "bad_upi_test",
        "platform": "swiggy_instamart",
        "platform_id": "SWG-BAD-01",
        "dark_store_pincode": "400099",
        "upi_id": "notavalidupi",  # Missing @
        "income_tier": "high",
        "shift_window": "full_day"
    }
    r = requests.post(f"{BASE}/api/riders/register", json=payload)
    assert r.status_code == 422, f"Expected 422 (validation error), got {r.status_code}"

test("Register new rider (or already exists)", test_register_rider)
test("Register with invalid pincode (expect 422)", test_register_invalid_pincode)
test("Register with invalid UPI (expect 422)", test_register_invalid_upi)

# --- GROUP 4: Rider Profile ---
print("\n[GROUP 4] Rider Profile")

def test_get_profile():
    r = requests.get(f"{BASE}/api/riders/profile/{RIDER_ID}")
    assert r.status_code == 200, f"Expected 200, got {r.status_code} - {r.text}"
    data = r.json()
    assert "name" in data
    assert "platform" in data
    assert "active_days_count" in data
    assert "active_policy" in data
    assert "payout_history" in data

def test_get_profile_not_found():
    r = requests.get(f"{BASE}/api/riders/profile/nonexistent_rider_xyz_12345")
    assert r.status_code == 404, f"Expected 404 for non-existent rider, got {r.status_code}"

test("Get rider profile", test_get_profile)
test("Get non-existent profile (expect 404)", test_get_profile_not_found)

# --- GROUP 5: ML Pricing Logic ---
print("\n[GROUP 5] ML Pricing Logic")

def test_pricing_logic():
    r = requests.get(f"{BASE}/api/riders/pricing-logic/{RIDER_ID}")
    assert r.status_code == 200, f"Pricing logic returned {r.status_code}: {r.text}"
    data = r.json()
    assert "risk_score" in data, "Missing risk_score"
    assert "pricing" in data, "Missing pricing"
    
    score = data["risk_score"]
    assert 0 <= score <= 100, f"Risk score {score} out of range [0,100]"
    
    pricing = data["pricing"]
    assert "lite" in pricing, "Missing lite plan"
    assert "plus" in pricing, "Missing plus plan"
    assert "max" in pricing, "Missing max plan"
    assert pricing["lite"] > 0, "Lite premium should be > 0"
    assert pricing["plus"] >= pricing["lite"], "Plus should be >= Lite"
    assert pricing["max"] >= pricing["plus"], "Max should be >= Plus"
    
    features = data.get("features", {})
    assert "zone_flood_score" in features, "Missing zone_flood_score in features"
    assert "zone_aqi_score" in features, "Missing zone_aqi_score in features"
    
    print(f"      Risk Score: {score}")
    print(f"      Premiums: Lite={pricing['lite']}, Plus={pricing['plus']}, Max={pricing['max']}")
    print(f"      Flood: {features.get('zone_flood_score')}, AQI: {features.get('zone_aqi_score')}")

test("ML Pricing Logic endpoint", test_pricing_logic)

# --- GROUP 6: Trigger Engine ---
print("\n[GROUP 6] Trigger Engine")

def test_trigger_event():
    payload = {
        "trigger_type": "heavy_rain",
        "zone_id": "110001",
        "severity": 9.5,
        "description": "Backend automated test trigger",
        "timestamp": "2026-06-20T10:00:00"
    }
    r = requests.post(f"{BASE}/api/triggers/event", json=payload)
    assert r.status_code == 200, f"Trigger event returned {r.status_code}: {r.text}"
    data = r.json()
    assert "trigger_id" in data, "Missing trigger_id"
    assert "affected_count" in data, "Missing affected_count"
    assert "payouts" in data, "Missing payouts"
    print(f"      Trigger ID: {data['trigger_id'][:8]}...")
    print(f"      Affected Riders: {data['affected_count']}")

def test_trigger_logs():
    r = requests.get(f"{BASE}/api/triggers/logs")
    assert r.status_code == 200, f"Trigger logs returned {r.status_code}"
    data = r.json()
    assert isinstance(data, list), "Expected list of logs"

def test_claims():
    r = requests.get(f"{BASE}/api/triggers/claims")
    assert r.status_code == 200, f"Claims endpoint returned {r.status_code}"
    data = r.json()
    assert isinstance(data, list), "Expected list of claims"
    print(f"      Total claims in DB: {len(data)}")

test("POST trigger event (heavy_rain, severity 9.5)", test_trigger_event)
test("GET trigger logs", test_trigger_logs)
test("GET all claims (payout_logs)", test_claims)

# --- SUMMARY ---
print("\n" + "=" * 60)
print(f"RESULTS: {passed} PASSED  |  {failed} FAILED")
if errors:
    print("\nFailed Tests:")
    for e in errors:
        print(f"  - {e}")
print("=" * 60)

sys.exit(0 if failed == 0 else 1)
