"use client";

import { useMutation } from "@tanstack/react-query";
import { KeyRound, LogOut, ShieldCheck } from "lucide-react";
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
import { authApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { formatDateTime } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

export default function SecurityPage() {
  const { data: profile } = useProfile();
  const { signOut } = useAuth();

  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [mismatch, setMismatch] = React.useState(false);

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
