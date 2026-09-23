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
  // Google sign-in (popup)
  "auth/popup-blocked": "Your browser blocked the Google sign-in window. Please allow pop-ups for this site and try again.",
  "auth/account-exists-with-different-credential":
    "An account with this email already exists. Please sign in with your email and password.",
  "auth/operation-not-allowed": "Google sign-in isn't enabled yet. Please use your email and password.",
  "auth/unauthorized-domain": "Google sign-in isn't set up for this website address yet.",
};

/** Firebase errors that just mean the user backed out of the Google popup — nothing to report. */
export function isAuthPopupDismissed(error: unknown): boolean {
  return (
    error instanceof FirebaseError &&
    (error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request")
  );
}

export function mapAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return MESSAGES[error.code] ?? "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please try again.";
}
