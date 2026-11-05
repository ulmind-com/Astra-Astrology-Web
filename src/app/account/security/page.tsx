"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { startRegistration } from "@simplewebauthn/browser";
import {
  CheckCircle2,
  Fingerprint,
  KeyRound,
  Laptop,
  LogOut,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Trash2,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  Input,
} from "@/components/ui";
import { useProfile } from "@/hooks/use-profile";
import { authApi, passkeyApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { formatDateTime } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

export default function SecurityPage() {
  const { data: profile } = useProfile();
  const { signOut } = useAuth();
  const queryClient = useQueryClient();

  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [mismatch, setMismatch] = React.useState(false);
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [deviceSupported, setDeviceSupported] = React.useState<boolean | null>(null);

  // Check hardware biometric support
  React.useEffect(() => {
    if (typeof window !== "undefined" && window.PublicKeyCredential) {
      if (PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
        PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
          .then((avail) => setDeviceSupported(avail))
          .catch(() => setDeviceSupported(false));
      } else {
        setDeviceSupported(true);
      }
    } else {
      setDeviceSupported(false);
    }
  }, []);

  const { data: passkeys, isLoading: passkeysLoading } = useQuery({
    queryKey: ["auth", "passkeys", "mine"],
    queryFn: passkeyApi.listMine,
  });

  const deletePasskeyMutation = useMutation({
    mutationFn: (id: string) => passkeyApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "passkeys", "mine"] });
      toast.success("Passkey removed.");
    },
    onError: (err: unknown) => {
      const msg = err instanceof ApiError ? err.message : "Failed to remove passkey.";
      toast.error(msg);
    },
  });

  const handleRegisterPasskey = async () => {
    setIsRegistering(true);
    try {
      toast.loading("Preparing device sensor...", { id: "passkey-reg" });
      const optionsRes = await passkeyApi.getRegisterOptions();

      toast.loading("Touch your fingerprint sensor or verify with Face ID...", { id: "passkey-reg" });
      const attResp = await startRegistration({ optionsJSON: optionsRes });

      let defaultLabel = "Biometric Sensor / Touch ID";
      if (typeof navigator !== "undefined") {
        const ua = navigator.userAgent.toLowerCase();
        if (ua.includes("mac")) defaultLabel = "MacBook Touch ID";
        else if (ua.includes("win")) defaultLabel = "Windows Hello";
        else if (ua.includes("android")) defaultLabel = "Android Fingerprint";
        else if (ua.includes("iphone") || ua.includes("ipad")) defaultLabel = "iPhone / iPad Face ID";
      }

      toast.loading("Verifying and saving passkey...", { id: "passkey-reg" });
      await passkeyApi.verifyRegistration({
        credential: attResp,
        device_name: defaultLabel,
      });

      queryClient.invalidateQueries({ queryKey: ["auth", "passkeys", "mine"] });
      toast.success("Fingerprint registered successfully! You can now log in with 1 click.", { id: "passkey-reg" });
    } catch (caught: any) {
      if (caught?.name === "NotAllowedError") {
        toast.error("Biometric registration was cancelled or timed out.", { id: "passkey-reg" });
      } else {
        const msg = caught instanceof ApiError ? caught.message : caught?.message || "Failed to register fingerprint";
        toast.error(msg, { id: "passkey-reg" });
      }
    } finally {
      setIsRegistering(false);
    }
  };

  // A Google-only account has no password to prove, so it is not asked for one.
  const hasPassword = profile?.auth_providers.includes("password") ?? true;

  const change = useMutation({
    mutationFn: () => authApi.changePassword(next, hasPassword ? current : null),
    onSuccess: () => {
      toast.success("Password changed.");
      setCurrent("");
      setNext("");
      setConfirm("");
    },
    onError: (error: ApiError) => {
      if (error.status !== 422) toast.error(error.message);
    },
  });

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (next !== confirm) {
      setMismatch(true);
      return;
    }
    setMismatch(false);
    change.mutate();
  }

  const errors = (change.error as ApiError | null)?.fieldErrors ?? {};

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Security</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          How you sign in, and what the account knows about you.
        </p>
      </header>

      {/* ----------------------------------------------------- sign-in */}
      <Card>
        <CardHeader>
          <CardTitle>Sign-in methods</CardTitle>
        </CardHeader>
        <CardBody className="space-y-3 pt-0">
          <div className="flex flex-wrap items-center gap-2">
            {profile?.auth_providers.map((provider) => (
              <Badge key={provider} tone="brand">
                {provider === "google" ? "Google" : "Email & password"}
              </Badge>
            ))}
            {profile?.is_email_verified && (
              <Badge tone="green">
                <ShieldCheck className="size-3" />
                Email verified
              </Badge>
            )}
          </div>

          <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            <div className="flex justify-between gap-4 border-b border-border py-2">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="truncate font-medium">{profile?.email}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-border py-2">
              <dt className="text-muted-foreground">Last sign-in</dt>
              <dd className="font-medium">{formatDateTime(profile?.last_login_at)}</dd>
            </div>
          </dl>
        </CardBody>
      </Card>

      {/* --------------------------------------------- passkeys / biometric */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Fingerprint className="size-5 text-brand-700" />
                Passkeys & Fingerprint (বায়োমেট্রিক লগইন)
              </CardTitle>
              <CardDescription className="mt-1">
                Log in instantly with Touch ID, Windows Hello, Android fingerprint, or Face ID without typing passwords.
              </CardDescription>
            </div>
            <Button
              type="button"
              onClick={handleRegisterPasskey}
              loading={isRegistering}
              disabled={deviceSupported === false}
              className="shrink-0 h-10 px-5 text-sm font-semibold"
            >
              <Plus className="size-4" />
              Add Fingerprint
            </Button>
          </div>
        </CardHeader>

        <CardBody className="space-y-4 pt-0">
          {/* Sensor status pill */}
          {deviceSupported !== null && (
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border ${
                deviceSupported
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300"
              }`}
            >
              {deviceSupported ? (
                <>
                  <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Biometric sensor (Touch ID / Fingerprint / Face ID) is supported on this browser.</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>No biometric hardware sensor detected on this browser/device.</span>
                </>
              )}
            </div>
          )}

          {/* List of registered passkeys */}
          {passkeysLoading ? (
            <p className="text-xs text-muted-foreground animate-pulse py-2">Loading registered passkeys...</p>
          ) : !passkeys || passkeys.length === 0 ? (
            <div className="p-5 rounded-xl border border-dashed border-border bg-surface-muted/50 text-center">
              <Fingerprint className="size-8 mx-auto text-muted-foreground/60 mb-2" />
              <p className="text-xs sm:text-sm font-medium text-foreground">No biometric passkeys added yet</p>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-sm mx-auto">
                Click &ldquo;Add Fingerprint&rdquo; above to register this device for 1-click passwordless sign in.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-surface">
              {passkeys.map((pk) => {
                const isMobile =
                  pk.device_name?.toLowerCase().includes("android") ||
                  pk.device_name?.toLowerCase().includes("phone") ||
                  pk.device_name?.toLowerCase().includes("ipad");
                return (
                  <div key={pk.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-9 rounded-lg bg-brand-200/50 dark:bg-brand-900/30 text-brand-800 dark:text-brand-300 flex items-center justify-center shrink-0">
                        {isMobile ? <Smartphone className="size-4.5" /> : <Laptop className="size-4.5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate text-foreground">
                          {pk.device_name || "Biometric Device"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Registered {formatDateTime(pk.created_at)}
                          {pk.last_used_at && ` • Last used ${formatDateTime(pk.last_used_at)}`}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => deletePasskeyMutation.mutate(pk.id)}
                      loading={
                        deletePasskeyMutation.isPending &&
                        deletePasskeyMutation.variables === pk.id
                      }
                      className="shrink-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      title="Remove passkey"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>

      {/* --------------------------------------------------- password */}
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>
              {hasPassword ? "Change password" : "Set a password"}
            </CardTitle>
            <CardDescription>
              {hasPassword
                ? "Choose something you do not use anywhere else."
                : "You signed up with Google. Setting a password lets you sign in either way."}
            </CardDescription>
          </CardHeader>

          <CardBody className="grid max-w-md gap-4 pt-0">
            {hasPassword && (
              <Field
                label="Current password"
                htmlFor="current"
                required
                error={errors.current_password}
              >
                <Input
                  id="current"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                />
              </Field>
            )}

            <Field
              label="New password"
              htmlFor="new"
              required
              hint="At least 6 characters"
              error={errors.new_password}
            >
              <Input
                id="new"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={next}
                invalid={Boolean(errors.new_password)}
                onChange={(e) => setNext(e.target.value)}
              />
            </Field>

            <Field
              label="Confirm new password"
              htmlFor="confirm"
              required
              error={mismatch ? "The two passwords do not match." : undefined}
            >
              <Input
                id="confirm"
                type="password"
                required
                autoComplete="new-password"
                value={confirm}
                invalid={mismatch}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  setMismatch(false);
                }}
              />
            </Field>

            {change.error && (change.error as ApiError).status !== 422 && (
              <Alert tone="error">{(change.error as ApiError).message}</Alert>
            )}
          </CardBody>

          <CardFooter className="justify-end">
            <Button type="submit" loading={change.isPending} className="w-full sm:w-auto h-11 sm:h-10 text-base sm:text-sm">
              <KeyRound className="size-4" />
              {hasPassword ? "Change password" : "Set password"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* ---------------------------------------------------- sign out */}
      <Card>
        <CardHeader>
          <CardTitle>Sign out</CardTitle>
          <CardDescription>
            Ends this session on this device. Your saved details stay as they are.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-end">
          <Button variant="secondary" onClick={() => signOut({ redirectTo: "/" })} className="w-full sm:w-auto h-11 sm:h-10 text-base sm:text-sm">
            <LogOut className="size-4" />
            Sign out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
