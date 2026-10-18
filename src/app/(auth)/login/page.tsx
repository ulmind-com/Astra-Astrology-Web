"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Alert, Button, Field, Input, LoadingBlock } from "@/components/ui";
import { authApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { GoogleButton } from "@/components/auth/google-button";
import { useAuth } from "@/providers/auth-provider";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { signIn, isSignedIn } = useAuth();

  const [email, setEmail] = React.useState(params.get("email") ?? "");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<ApiError | null>(null);
  const [busy, setBusy] = React.useState(false);

  const next = params.get("next") ?? "/account";

  // Already signed in? Nothing to do here.
  React.useEffect(() => {
    if (isSignedIn) router.replace(next);
  }, [isSignedIn, next, router]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const result = await authApi.login(email, password);
      signIn(result);
      toast.success(`Welcome back, ${result.user.first_name}`);
      router.replace(next);
    } catch (caught) {
      const apiError = caught as ApiError;
      setError(apiError);
      // "No account" is not a failure the user can fix here — send them on.
      if (apiError.code === "user_not_found") {
        toast.error("No account found for this email.");
      }
    } finally {
      setBusy(false);
    }
  }

  const fieldErrors = error?.fieldErrors ?? {};

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Sign in to pick up where you left off.
      </p>

      {error && error.status !== 422 && (
        <Alert tone="error" className="mt-5">
          {error.message}
          {error.code === "user_not_found" && (
            <>
              {" "}
              <Link href="/register" className="font-semibold underline">
                Create one
              </Link>
              .
            </>
          )}
          {error.code === "registration_incomplete" && (
            <>
              {" "}
              <Link
                href={`/register?email=${encodeURIComponent(email)}`}
                className="font-semibold underline"
              >
                Finish signing up
              </Link>
              .
            </>
          )}
        </Alert>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <Field label="Email" htmlFor="email" error={fieldErrors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            invalid={Boolean(fieldErrors.email)}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </Field>

        <Field label="Password" htmlFor="password" error={fieldErrors.password}>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            invalid={Boolean(fieldErrors.password)}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </Field>

        <div className="flex justify-end">
          <Link
            href={`/forgot-password?email=${encodeURIComponent(email)}`}
            className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-700"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" loading={busy}>
          Sign in
          <ArrowRight className="size-4" />
        </Button>
      </form>

      {/* A line rather than a second heading: the two routes lead to the same
          place, so neither should look like the main one. */}
      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          or
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton onSignedIn={() => router.replace(next)} />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link
          href="/register"
          className="font-medium text-brand-700 hover:underline dark:text-brand-700"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}


/**
 * `useSearchParams` reads something only known per request, so the page shell
 * prerenders and the form streams in behind this boundary.
 */
export default function Page() {
  return (
    <React.Suspense fallback={<LoadingBlock />}>
      <LoginForm />
    </React.Suspense>
  );
}
