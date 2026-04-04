from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class TriggerType:
    RAIN = "heavy_rain"
    HEAT = "extreme_heat"
    AQI = "severe_aqi"
    OUTAGE = "platform_outage"
    CLOSURE = "zone_closure"

class TriggerEvent(BaseModel):
    trigger_type: str
    zone_id: str
    severity: float  # e.g., mm of rain, AQI value, etc.
    description: str
    timestamp: datetime = datetime.now()

class BulkPayoutRequest(BaseModel):
    trigger_id: str
    affected_riders: List[str]
    payout_amount: float
    reason: str
