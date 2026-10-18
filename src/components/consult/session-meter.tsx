"use client";

import { AlertTriangle, Coins } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";
import { coinWord, formatCoins, type SessionBilling } from "@/types";

/**
 * What this session is costing, while it runs.
 *
 * The numbers come from the server on every poll, so the meter cannot drift
 * away from the wallet — a client-side countdown would, and would then be
 * wrong at exactly the moment it mattered.
 *
 * It turns into a warning when there is about a minute left, because being cut
 * off is far less upsetting when you saw it coming.
 */
export function SessionMeter({
  billing,
  onDark = false,
}: {
  billing: SessionBilling;
  onDark?: boolean;
}) {
  const low = billing.minutes_left <= 1;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-xl px-3 py-2 text-xs",
        low
          ? "bg-amber-500/15 text-amber-600 dark:text-amber-300"
          : onDark
            ? "bg-white/10 text-white/80"
            : "bg-surface-muted text-muted-foreground",
      )}
    >
      <span className="flex items-center gap-1.5">
        {low ? (
          <AlertTriangle className="size-3.5 shrink-0" />
        ) : (
          <Coins className="size-3.5 shrink-0" />
        )}
        {low ? (
          billing.minutes_left === 0 ? (
            <span className="font-medium">
              This is your last minute — add coins to keep going.
            </span>
          ) : (
            <span className="font-medium">About a minute of coins left.</span>
          )
        ) : (
          <span>
            {formatCoins(billing.coins_per_minute)} {coinWord(billing.coins_per_minute)}
            /min · about {billing.minutes_left} min left
          </span>
        )}
      </span>

      <span className="flex items-center gap-2">
        <span className={cn(onDark && !low && "text-white/60")}>
          {formatCoins(billing.coins_charged)} spent ·{" "}
          {formatCoins(billing.balance_coins)} left
        </span>
        {low && (
          <Link
            href="/account/wallet"
            className="rounded-full bg-amber-500 px-2.5 py-0.5 font-medium text-white"
          >
            Add coins
          </Link>
        )}
      </span>
    </div>
  );
}

/** The screen after a session the wallet could not carry. */
export function OutOfCoins({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
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
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
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
