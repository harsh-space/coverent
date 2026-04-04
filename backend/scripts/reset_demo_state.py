import firebase_admin
from firebase_admin import credentials, firestore
import os
import sys

# Add backend to path to find firestore credentials
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(backend_dir)

def reset_demo_payouts():
    """
    Utility script to wipe payout_logs and trigger_logs for a clean demo start.
    """
    print("🚀 Initializing Demo Reset...")
    
    # Path to your credentials
    cred_path = os.path.join(backend_dir, "serviceAccountKey.json")
    if not os.path.exists(cred_path):
        print(f"❌ Error: Credentials not found at {cred_path}")
        return

    cred = credentials.Certificate(cred_path)
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)
    
    db = firestore.client()

    collections = ["payout_logs", "trigger_logs"]

    for coll_name in collections:
        print(f"🧹 Clearing {coll_name}...")
        docs = db.collection(coll_name).stream()
        count = 0
        for doc in docs:
            doc.reference.delete()
            count += 1
        print(f"✅ Deleted {count} documents from {coll_name}")

    print("\n✨ Ready for a professional demo!")

if __name__ == "__main__":
    reset_demo_payouts()
