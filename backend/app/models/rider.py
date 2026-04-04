from pydantic import BaseModel, field_validator
from typing import Optional
from enum import Enum

class Platform(str, Enum):
    zepto = "zepto"
    blinkit = "blinkit"
    swiggy_instamart = "swiggy_instamart"

class IncomeTier(str, Enum):
    low = "low"
    mid = "mid"
    high = "high"

class ShiftWindow(str, Enum):
    morning = "morning"      # 6 AM - 2 PM
    evening = "evening"      # 2 PM - 11 PM
    full_day = "full_day"    # 6 AM - 11 PM

class PolicyType(str, Enum):
    suraksha_basic = "suraksha_basic"
    suraksha_plus = "suraksha_plus"
    bima_elite = "bima_elite"

class RiderRegistrationRequest(BaseModel):
    name: str
    phone: str
    firebase_token: str
    platform: Platform
    platform_id: str
    dark_store_pincode: str
    upi_id: str
    income_tier: IncomeTier
    shift_window: ShiftWindow

    @field_validator("platform_id")
    @classmethod
    def norm_platform_id(cls, v):
        return v.strip().upper()

    @field_validator("dark_store_pincode")
    @classmethod
    def validate_pincode(cls, v):
        v = v.strip()
        if not v.isdigit() or len(v) != 6:
            raise ValueError("Pincode must be exactly 6 digits")
        return v

    @field_validator("upi_id")
    @classmethod
    def validate_upi(cls, v):
        v = v.strip().lower()
        if "@" not in v:
            raise ValueError("Invalid UPI ID. Must contain @ (e.g. name@okaxis)")
        return v

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v):
        v = v.strip()
        if not v.isdigit() or len(v) != 10:
            raise ValueError("Phone number must be exactly 10 digits")
        return v

class PolicyPurchaseRequest(BaseModel):
    rider_id: str
    policy_type: PolicyType

class RiderLoginRequest(BaseModel):
    phone: str
    otp: str

class RiderRegisterResponse(BaseModel):
    rider_id: str
    status: str
    message: str
    next_step: str

class RiderProfileResponse(BaseModel):
    rider_id: str
    name: Optional[str] = None
    platform: str
    dark_store_pincode: str
    income_tier: str
    upi_id: str
    risk_score: Optional[int] = None
    active_policy: bool = False
    active_days_count: int = 0
    is_eligible_for_policy: bool = False
    policy_name: Optional[str] = None
    valid_until: Optional[str] = None
    payout_history: Optional[list] = []