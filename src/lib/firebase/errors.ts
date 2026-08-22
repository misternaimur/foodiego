import { FirebaseError } from "firebase/app";

const MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/invalid-credential": "Invalid email or password.",
  "auth/wrong-password": "Invalid email or password.",
  "auth/user-not-found": "Invalid email or password.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error. Please check your connection and try again.",
};

export function mapAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return MESSAGES[error.code] ?? "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please try again.";
}
