"use client";

import { ArrowLeft, ArrowRight, MailCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Alert, Button, Field, Input, LoadingBlock } from "@/components/ui";
import { authApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/providers/auth-provider";

/**
 * Registration is two steps, because the account is only created once the code
 * is verified: details → emailed code → account.
 */
type Step = "details" | "code";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { signIn } = useAuth();

  const [step, setStep] = React.useState<Step>("details");
  const [form, setForm] = React.useState({
    email: params.get("email") ?? "",
    password: "",
    first_name: "",
    middle_name: "",
    last_name: "",
  });
  const [code, setCode] = React.useState("");
  const [devCode, setDevCode] = React.useState<string | null>(null);
  const [error, setError] = React.useState<ApiError | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [resendIn, setResendIn] = React.useState(0);

  // The API tells us when a new code may be requested; count down to it.
  React.useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setInterval(() => setResendIn((n) => Math.max(0, n - 1)), 1000);
    return () => clearInterval(timer);
  }, [resendIn]);

  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: event.target.value }));

  function startCooldown(resendAt: string) {
    const seconds = Math.ceil((new Date(resendAt).getTime() - Date.now()) / 1000);
    setResendIn(Math.max(0, seconds));
  }

  async function submitDetails(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const sent = await authApi.register({
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        middle_name: form.middle_name || null,
        last_name: form.last_name || null,
      });
      setDevCode(sent.dev_code ?? null);
      startCooldown(sent.resend_available_at);
      setStep("code");
      toast.success(`We sent a code to ${sent.email}`);
    } catch (caught) {
      setError(caught as ApiError);
    } finally {
      setBusy(false);
    }
  }

  async function submitCode(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const result = await authApi.verifyRegistration(form.email, code);
      signIn(result);
      toast.success("Your account is ready. Welcome!");
      router.replace("/account/birth-details");
    } catch (caught) {
      setError(caught as ApiError);
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    setError(null);
    try {
      const sent = await authApi.resendCode(form.email);
      setDevCode(sent.dev_code ?? null);
      startCooldown(sent.resend_available_at);
      toast.success("A new code is on its way.");
    } catch (caught) {
      const apiError = caught as ApiError;
      setError(apiError);
      const retry = (apiError.details as { retry_after_seconds?: number })?.retry_after_seconds;
      if (retry) setResendIn(retry);
    }
  }

  const fieldErrors = error?.fieldErrors ?? {};
  const attemptsLeft = (error?.details as { attempts_left?: number })?.attempts_left;

  // ------------------------------------------------------------- step two
  if (step === "code") {
    return (
      <div>
        <button
          onClick={() => {
            setStep("details");
            setError(null);
          }}
          className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        <span className="flex size-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-100 dark:text-ink-800">
          <MailCheck className="size-5" />
        </span>

        <h1 className="mt-4 text-2xl font-bold tracking-tight">Check your email</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          We sent a six-digit code to{" "}
          <span className="font-medium text-foreground">{form.email}</span>.
        </p>

        {devCode && (
          <Alert tone="info" title="Development mode" className="mt-5">
            Your code is <span className="font-mono font-semibold">{devCode}</span>. This
            only appears because the server has <code>OTP_DEV_MODE</code> on.
          </Alert>
        )}

        {error && (
          <Alert tone="error" className="mt-5">
            {error.message}
            {typeof attemptsLeft === "number" && attemptsLeft === 0 && (
              <> Request a new code to try again.</>
            )}
          </Alert>
        )}

        <form onSubmit={submitCode} className="mt-6 space-y-4">
          <Field label="Verification code" htmlFor="code">
            <Input
              id="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="text-center font-mono text-xl tracking-[0.4em]"
            />
          </Field>

          <Button type="submit" className="w-full" loading={busy} disabled={code.length < 4}>
            Verify and create account
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {resendIn > 0 ? (
            <>Resend available in {resendIn}s</>
          ) : (
            <button
              onClick={resend}
              className="font-medium text-brand-700 hover:underline dark:text-brand-700"
            >
              Send a new code
            </button>
          )}
        </p>
      </div>
    );
  }

  // ------------------------------------------------------------- step one
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        It takes a minute. We will email you a code to confirm it is you.
      </p>

      {error && error.status !== 422 && (
        <Alert tone="error" className="mt-5">
          {error.message}
          {error.code === "email_already_registered" && (
            <>
              {" "}
              <Link
                href={`/login?email=${encodeURIComponent(form.email)}`}
                className="font-semibold underline"
              >
                Sign in instead
              </Link>
              .
            </>
          )}
        </Alert>
      )}

      <form onSubmit={submitDetails} className="mt-6 space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" htmlFor="first_name" required error={fieldErrors.first_name}>
            <Input
              id="first_name"
              required
              autoComplete="given-name"
              value={form.first_name}
              invalid={Boolean(fieldErrors.first_name)}
              onChange={set("first_name")}
              placeholder="Ravi"
            />
          </Field>
          <Field label="Last name" htmlFor="last_name" error={fieldErrors.last_name}>
            <Input
              id="last_name"
              autoComplete="family-name"
              value={form.last_name}
              onChange={set("last_name")}
              placeholder="Sharma"
            />
          </Field>
        </div>

        <Field
          label="Middle name"
          htmlFor="middle_name"
          hint="Optional"
          error={fieldErrors.middle_name}
        >
          <Input
            id="middle_name"
            autoComplete="additional-name"
            value={form.middle_name}
            onChange={set("middle_name")}
            placeholder="Kumar"
          />
        </Field>

        <Field label="Email" htmlFor="email" required error={fieldErrors.email}>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            invalid={Boolean(fieldErrors.email)}
            onChange={set("email")}
            placeholder="you@example.com"
          />
        </Field>

        <Field
          label="Password"
          htmlFor="password"
          required
          error={fieldErrors.password}
          hint="At least 6 characters"
        >
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={form.password}
            invalid={Boolean(fieldErrors.password)}
            onChange={set("password")}
            placeholder="••••••••"
          />
        </Field>

        <Button type="submit" className="w-full" loading={busy}>
          Continue
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-brand-700 hover:underline dark:text-brand-700"
        >
          Sign in
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
      <RegisterForm />
    </React.Suspense>
  );
}
