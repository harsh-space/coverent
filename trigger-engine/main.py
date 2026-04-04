import time
import requests
import random
from datetime import datetime

# Configuration
BACKEND_URL = "http://localhost:8000/api/triggers/event"
CHECK_INTERVAL = 30  # Seconds for demo, would be 300+ in production
ZONES = ["400053", "110001", "560001", "400099"]

# Thresholds
RAIN_THRESHOLD = 5.0   # mm/hr
HEAT_THRESHOLD = 42.0  # Celsius
AQI_THRESHOLD = 400.0  # Dangerous level

def poll_weather(zone_id):
    """
    Mocking OpenWeatherMap / AQICN / Platform API polling.
    In production, this would use:
    requests.get(f"https://api.openweathermap.org/data/2.5/weather?zip={zone_id},in&appid=API_KEY")
    """
    # Simulate data fetching
    # We force high values randomly for demo purposes
    rain = random.uniform(0, 10)
    aqi = random.uniform(50, 500)
    temp = random.uniform(25, 45)
    
    # Mock platform outage (1 in 50 chance)
    is_outage = random.random() < 0.02
    
    events = []
    
    if rain > RAIN_THRESHOLD:
        events.append({
            "trigger_type": "heavy_rain",
            "zone_id": zone_id,
            "severity": round(rain, 2),
            "description": f"Heavy downpour detected: {round(rain, 1)}mm/hr"
        })
        
    if aqi > AQI_THRESHOLD:
        events.append({
            "trigger_type": "severe_aqi",
            "zone_id": zone_id,
            "severity": round(aqi, 2),
            "description": f"Hazardous air quality index: {int(aqi)}"
        })

    if temp > HEAT_THRESHOLD:
        events.append({
            "trigger_type": "extreme_heat",
            "zone_id": zone_id,
            "severity": round(temp, 2),
            "description": f"Extreme heat warning: {round(temp, 1)}°C"
        })
        
    if is_outage:
        events.append({
            "trigger_type": "platform_outage",
            "zone_id": zone_id,
            "severity": 1.0,
            "description": "Critical platform API outage detected in this region"
        })
        
    return events

def run_engine():
    print(f"[{datetime.now().strftime('%H:%M:%S')}] 🔥 Trigger Engine Starting...")
    print(f"Monitoring Zones: {', '.join(ZONES)}")
    
    while True:
        for zone in ZONES:
            try:
                events = poll_weather(zone)
                for event in events:
                    print(f"[{datetime.now().strftime('%H:%M:%S')}] 🚨 THRESHOLD BREACH: {event['trigger_type']} in {zone}")
                    
                    # POST to backend
                    resp = requests.post(BACKEND_URL, json=event)
                    if resp.status_code == 200:
                        result = resp.json()
                        print(f"   ✅ Backend Processed: {result['affected_count']} payouts triggered (ID: {result['trigger_id']})")
                    else:
                        print(f"   ❌ Backend Error: {resp.status_code} - {resp.text}")
                        
            except Exception as e:
                print(f"   ❌ Error polling {zone}: {str(e)}")
        
        time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    run_engine()
