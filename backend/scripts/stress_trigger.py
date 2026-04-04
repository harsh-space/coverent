import asyncio
import httpx
from datetime import datetime

async def trigger_payout(client, pincode, type_):
    url = f"http://localhost:8000/api/triggers/event"
    payload = {
        "event_id": "STRESS_TEST_EVENT_ID", # SHARED ID TO TEST IDEMPOTENCY
        "pincode": pincode,
        "type": type_,
        "severity": 10.0, # MAX SEVERITY for 100% payout
        "description": "STRESS TEST TRIGGER",
        "timestamp": datetime.now().isoformat()
    }
    try:
        response = await client.post(url, json=payload, timeout=15.0)
        return response.status_code, response.json()
    except Exception as e:
        return 500, str(e)

async def run_stress_test():
    print("--- 🔬 Starting Stress Test: Idempotency Attack ---")
    pincode = "560001"
    trigger_type = "waterlogging"
    
    async with httpx.AsyncClient() as client:
        # Fire 20 CONCURRENT requests for the same pincode/type
        tasks = [trigger_payout(client, pincode, trigger_type) for _ in range(30)]
        results = await asyncio.gather(*tasks)
    
    # Analyze responses
    success_count = sum(1 for status, _ in results if status == 200)
    error_count = 30 - success_count
    
    print(f"\n--- 📊 Results ---")
    print(f"Total Triggers Sent: 30")
    print(f"Successful Hits: {success_count}")
    print(f"Failures/Rejections: {error_count}")
    
    # Analyze Payload Content (How many payouts were actually generated?)
    actual_payouts_generated = []
    for status, body in results:
        if status == 200:
            actual_payouts_generated.append(body.get('affected_count', 0))
    
    print(f"Actual Payouts Generated in first hit: {actual_payouts_generated[0] if actual_payouts_generated else 0}")
    print(f"Subsequent Payouts Generated (Expect 0): {sum(actual_payouts_generated[1:])}")
    
    print("\n--- 🕵️ Conclusion ---")
    if sum(actual_payouts_generated[1:]) == 0:
        print("✅ SUCCESS: Idempotency is HOLDING. No double payouts detected.")
    else:
        print("❌ FAILURE: Double payouts detected! Check trigger_service.py.")
    print("-----------------------------------")

if __name__ == "__main__":
    asyncio.run(run_stress_test())
