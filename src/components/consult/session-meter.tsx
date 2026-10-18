"use client";

import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, Clock, Coins, Loader2, Plus, Wallet } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button, Modal } from "@/components/ui";
import { callApi, chatApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import {
  coinWord,
  formatCoins,
  formatDuration,
  type SessionBilling,
} from "@/types";

/** Minutes the user is offered when extending, within what they can afford. */
const EXTEND_PRESETS = [2, 5, 10, 15];

function Cell({
  label,
  value,
  tone,
  onDark,
}: {
  label: string;
  value: React.ReactNode;
  tone?: "warn";
  onDark?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p
        className={cn(
          "text-[10px] uppercase tracking-wide",
          onDark ? "text-ink-500" : "text-muted-foreground",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "truncate text-sm font-semibold tabular-nums",
          tone === "warn" && "text-warning",
        )}
      >
        {value}
      </p>
    </div>
  );
}

/**
 * The session meter: elapsed, left, spent, balance — all four, always.
 *
 * Every number comes from the server on each poll rather than being counted
 * down here, because a client-side clock drifts and would be wrong exactly
 * when it matters: the minute before someone is cut off.
 */
export function SessionMeter({
  sessionId,
  kind,
  billing,
  elapsedSeconds,
  onDark = false,
  onExtended,
}: {
  sessionId: string;
  kind: "call" | "chat";
  billing: SessionBilling;
  elapsedSeconds: number;
  onDark?: boolean;
  onExtended?: () => void;
}) {
  const [asking, setAsking] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const extend = useMutation({
    // Both endpoints return their own session shape; nothing here needs it,
    // only that the call succeeded.
    mutationFn: async (minutes: number): Promise<void> => {
      if (kind === "call") await callApi.extend(sessionId, minutes);
      else await chatApi.extend(sessionId, minutes);
    },
    onSuccess: () => {
      setAsking(false);
      setDismissed(false);
      onExtended?.();
    },
    onError: (e: ApiError) => setError(e.message),
  });

  const lastMinute = billing.minutes_remaining <= 1;

  // Ask once, a minute before the booked time runs out — and only when they
  // could actually say yes. Offering an extension nobody can pay for is just
  // telling someone they are about to be cut off.
  React.useEffect(() => {
    if (lastMinute && billing.can_extend && !dismissed) setAsking(true);
  }, [lastMinute, billing.can_extend, dismissed]);

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between gap-3 rounded-xl px-3 py-2",
          lastMinute
            ? "bg-warning-surface"
            : onDark
              ? "bg-ink-900/5 text-brand-950"
              : "bg-surface-muted",
        )}
      >
        <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
          <Cell label="Talking" value={formatDuration(elapsedSeconds)} onDark={onDark} />
          <Cell
            label="Time left"
            value={`${billing.minutes_remaining} min`}
            tone={lastMinute ? "warn" : undefined}
            onDark={onDark}
          />
          <Cell
            label="Spent"
            value={`${formatCoins(billing.coins_charged)}`}
            onDark={onDark}
          />
          <Cell
            label="Wallet"
            value={`${formatCoins(billing.balance_coins)}`}
            onDark={onDark}
          />
        </div>

        {billing.can_extend && (
          <Button
            size="sm"
            variant={lastMinute ? "primary" : "secondary"}
            onClick={() => {
              setError(null);
              setAsking(true);
            }}
            className={lastMinute ? "shrink-0 bg-warning text-night-950 hover:bg-gold-300" : "shrink-0"}
          >
            <Plus className="size-3.5" />
            Add time
          </Button>
        )}
      </div>

      {lastMinute && !billing.can_extend && (
        <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs text-warning">
          <AlertTriangle className="size-3.5 shrink-0" />
          Last minute, and not enough coins to add more.
          <Link href="/account/wallet" className="font-medium underline">
            Recharge
          </Link>
        </p>
      )}

      <ExtendModal
        open={asking}
        billing={billing}
        pending={extend.isPending}
        error={error}
        onClose={() => {
          setAsking(false);
          setDismissed(true);
          setError(null);
        }}
        onPick={(m) => extend.mutate(m)}
      />
    </>
  );
}

function ExtendModal({
  open,
  billing,
  pending,
  error,
  onClose,
  onPick,
}: {
  open: boolean;
  billing: SessionBilling;
  pending: boolean;
  error: string | null;
  onClose: () => void;
  onPick: (minutes: number) => void;
}) {
  const max = billing.max_extend_minutes;
  // Only offer what the wallet can actually carry, and always offer the
  // largest affordable option — someone with 40 minutes of coins should not be
  // limited to the presets.
  const options = Array.from(
    new Set([...EXTEND_PRESETS.filter((m) => m <= max), max].filter((m) => m >= 1)),
  ).sort((a, b) => a - b);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Keep talking?"
      description={`Your booked time is almost up. You have ${formatCoins(
        billing.balance_coins,
      )} ${coinWord(billing.balance_coins)} — enough for about ${max} more minute${
        max === 1 ? "" : "s"
      }.`}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface-muted/60 px-3.5 py-2.5 text-sm">
          <span className="flex items-center gap-1.5">
            <Coins className="size-4 text-gold-600" />
            {billing.coins_per_minute} {coinWord(billing.coins_per_minute)} a minute
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Wallet className="size-4" />
            {formatCoins(billing.balance_coins)} left
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {options.map((m) => (
            <button
              key={m}
              type="button"
              disabled={pending}
              onClick={() => onPick(m)}
              className="rounded-xl border border-border px-2 py-3 text-center transition-colors hover:border-brand-500/50 hover:bg-brand-100 disabled:opacity-50 dark:hover:bg-brand-100"
            >
              <span className="block text-base font-semibold">+{m}</span>
              <span className="block text-[11px] text-muted-foreground">
                {m * billing.coins_per_minute} {coinWord(m * billing.coins_per_minute)}
              </span>
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex items-center justify-between gap-2 pt-1">
          <Link href="/account/wallet" className="text-sm font-medium text-brand-700 underline">
            Add coins instead
          </Link>
          <Button type="button" variant="secondary" onClick={onClose} disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Clock className="size-4" />}
            No thanks
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/** The screen after a session the wallet could not carry. */
export function OutOfCoins({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-warning-surface text-warning">
        <Coins className="size-7" />
      </span>
      <div>
        <p className="text-lg font-semibold">You ran out of coins</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The session stopped when there were not enough coins for the next minute.
        </p>
      </div>
      <div className="flex gap-2 pt-1">
        <Link href="/account/wallet">
          <button
            type="button"
            className="rounded-lg bg-brand-300 px-4 py-2 text-sm font-medium text-brand-950 hover:bg-brand-400"
          >
            Add coins
          </button>
        </Link>
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-surface-muted"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
