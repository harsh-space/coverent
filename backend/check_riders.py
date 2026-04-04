import firebase_admin
from firebase_admin import credentials, firestore
import json
import os

from app.config import FIREBASE_CREDENTIALS_PATH

if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
    firebase_admin.initialize_app(cred)

db = firestore.client()
riders = db.collection('riders').stream()
result = []
for r in riders:
    data = r.to_dict()
    result.append({
        "id": r.id,
        "name": data.get("name"),
        "pincode": data.get("dark_store_pincode"),
        "active_policy": data.get("active_policy"),
        "active_days": data.get("active_days_count", 0)
    })

print(json.dumps(result, indent=2))
