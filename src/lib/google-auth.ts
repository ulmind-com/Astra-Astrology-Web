"use client";

/**
 * Signing in with Google.
 *
 * The backend verifies a **Firebase** ID token, not a raw Google one, so the
 * browser signs in through Firebase Auth and hands the resulting token to our
 * own `/auth/google`. Doing it the other way — taking a Google token straight
 * from Google Identity Services — would mean the uid we store stopped matching
 * the Firebase uid every other account already has, and the two would drift
 * apart the first time anything looked a user up by it.
 *
 * Firebase is used here and nowhere else in this app: authentication only.
 * Everything live runs over our own socket, and chat lives in MongoDB. The SDK
 * is imported lazily so that weight is only paid by someone who actually
 * presses the button — a visitor who signs in with a password never downloads
 * it.
 */

import type { FirebaseApp } from "firebase/app";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** False when the build has no Firebase keys, so the button can be hidden. */
export function isGoogleConfigured(): boolean {
  return Boolean(config.apiKey && config.projectId && config.authDomain);
}

let appPromise: Promise<FirebaseApp> | null = null;

async function getApp(): Promise<FirebaseApp> {
  if (!appPromise) {
    appPromise = (async () => {
      const { getApps, initializeApp } = await import("firebase/app");
      const existing = getApps();
      return existing.length ? existing[0] : initializeApp(config);
    })();
  }
  return appPromise;
}

/** Raised with a message already fit to show someone. */
export class GoogleSignInError extends Error {
  readonly cancelled: boolean;

  constructor(message: string, cancelled = false) {
    super(message);
    this.name = "GoogleSignInError";
    this.cancelled = cancelled;
  }
}

/**
 * Opens Google's chooser and returns a Firebase ID token.
 *
 * The caller posts that token to `/auth/google`, which is where the account is
 * actually created or matched — this function knows nothing about our own
 * accounts and deliberately leaves that decision on the server.
 */
export async function signInWithGoogle(): Promise<string> {
  if (!isGoogleConfigured()) {
    throw new GoogleSignInError("Google sign-in is not set up in this build.");
  }

  const { GoogleAuthProvider, getAuth, signInWithPopup } = await import("firebase/auth");
  const auth = getAuth(await getApp());
  // Follow the browser's language rather than the project's default.
  auth.useDeviceLanguage();

  const provider = new GoogleAuthProvider();
  // Always ask which account, instead of silently reusing the last one — on a
  // shared computer that is the difference between signing in and signing in
  // as somebody else.
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    const credential = await signInWithPopup(auth, provider);
    return await credential.user.getIdToken();
  } catch (error) {
    throw asFriendlyError(error);
  }
}

function asFriendlyError(error: unknown): GoogleSignInError {
  const code = (error as { code?: string })?.code ?? "";

  // Closing the chooser is a decision, not a failure — the caller stays quiet
  // about it rather than showing an error for something deliberate.
  if (
    code === "auth/popup-closed-by-user" ||
    code === "auth/cancelled-popup-request" ||
    code === "auth/user-cancelled"
  ) {
    return new GoogleSignInError("Sign-in cancelled.", true);
  }

  if (code === "auth/popup-blocked") {
    return new GoogleSignInError(
      "Your browser blocked the Google window. Allow pop-ups for this site and try again.",
    );
  }
  if (code === "auth/account-exists-with-different-credential") {
    return new GoogleSignInError(
      "You already have an account with this email. Sign in with your password instead.",
    );
  }
  if (code === "auth/operation-not-allowed") {
    // Worth saying plainly: this one is a console setting, not the user.
    return new GoogleSignInError(
      "Google sign-in is not enabled for this project yet.",
    );
  }
  if (code === "auth/unauthorized-domain") {
    return new GoogleSignInError(
      "This website address is not on the Google sign-in allow list yet.",
    );
  }
  if (code === "auth/network-request-failed") {
    return new GoogleSignInError("Could not reach Google. Check your connection.");
  }

  return new GoogleSignInError("Could not sign in with Google. Please try again.");
}
