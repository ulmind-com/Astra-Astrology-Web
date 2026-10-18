"use client";

/**
 * "Continue with Google", for both signing in and signing up.
 *
 * There is only one button because there is only one flow: the backend decides
 * whether this Google account is already somebody or a new arrival, and makes
 * the account if not. Asking the person to pick "sign in" or "sign up" first
 * would be asking them a question only the server can answer.
 */

import { Loader2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { authApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { GoogleSignInError, isGoogleConfigured, signInWithGoogle } from "@/lib/google-auth";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

/** Google's mark. Their brand guidelines want the colours, so it is inline. */
function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" className={className} aria-hidden focusable="false">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.94v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.98 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.94a9 9 0 0 0 0 8.1l3.04-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .94 4.95l3.04 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}

export function GoogleButton({
  label = "Continue with Google",
  onSignedIn,
  className,
}: {
  label?: string;
  /** Where to go once they are in. The page owns that, not this button. */
  onSignedIn?: () => void;
  className?: string;
}) {
  const { signIn } = useAuth();
  const [busy, setBusy] = React.useState(false);

  // No keys in this build means no button, rather than a button that always
  // fails.
  if (!isGoogleConfigured()) return null;

  async function start() {
    if (busy) return;
    setBusy(true);
    try {
      const idToken = await signInWithGoogle();
      const result = await authApi.google(idToken);
      signIn(result);
      onSignedIn?.();
    } catch (error) {
      if (error instanceof GoogleSignInError) {
        // Closing the chooser is deliberate; do not scold them for it.
        if (!error.cancelled) toast.error(error.message);
      } else if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Could not sign in with Google. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={start}
      disabled={busy}
      className={cn(
        "inline-flex h-[51px] w-full items-center justify-center gap-3 rounded-full",
        "border border-border-strong bg-surface text-[15px] font-semibold text-foreground",
        "transition-colors hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {busy ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <GoogleMark className="size-[18px]" />
      )}
      {busy ? "Opening Google…" : label}
    </button>
  );
}
