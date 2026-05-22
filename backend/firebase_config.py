"""
Firebase configuration placeholder for FynavoX.

Set environment variables or replace with your Firebase project credentials:
  FIREBASE_PROJECT_ID
  FIREBASE_API_KEY
  GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON)

For production, integrate firebase-admin SDK for:
  - Patient records persistence
  - Alert history
  - Hospital tenant configuration
"""

import os

FIREBASE_CONFIG = {
    "projectId": os.getenv("FIREBASE_PROJECT_ID", "fynavox-pilot"),
    "apiKey": os.getenv("FIREBASE_API_KEY", ""),
    "authDomain": os.getenv(
        "FIREBASE_AUTH_DOMAIN", "fynavox-pilot.firebaseapp.com"
    ),
    "storageBucket": os.getenv(
        "FIREBASE_STORAGE_BUCKET", "fynavox-pilot.appspot.com"
    ),
}


def is_configured() -> bool:
    return bool(FIREBASE_CONFIG.get("apiKey"))
