/**
 * Firebase client configuration placeholder for FynavoX pilot.
 * Set NEXT_PUBLIC_FIREBASE_* in .env.local for persistence.
 */

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    "fynavox-pilot.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "fynavox-pilot",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    "fynavox-pilot.appspot.com",
};

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey);
}
