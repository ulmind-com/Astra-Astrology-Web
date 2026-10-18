"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertTriangle, Coins, Loader2, Wallet } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Alert, Button, Modal } from "@/components/ui";
import { astrologerApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { MODE_LABELS, coinWord, formatCoins, type ConsultationMode } from "@/types";

const PRESETS = [5, 10, 15, 30];

/**
 * "How long do you want to talk?"
 *
 * Asked before anything is booked, against real numbers: the rate and the
 * wallet both come from the server, so a choice shown as affordable is one the
 * server will accept. The alternative — let them pick, then refuse — teaches
 * people the app is unreliable.
 *
 * The chosen length is a hard stop. That is deliberate and is said plainly,
 * because a call that ends mid-sentence without warning is worse than one that
 * ends when you said it would.
 */
export function DurationPicker({
  astrologerId,
  astrologerName,
  mode,
  open,
  onClose,
  onConfirm,
  starting,
  error,
}: {
  astrologerId: string;
  astrologerName: string;
  mode: ConsultationMode | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (minutes: number) => void;
  starting: boolean;
  error: string | null;
}) {
  const { data: quote, isLoading } = useQuery({
    queryKey: ["quote", astrologerId, mode],
    queryFn: () => astrologerApi.quote(astrologerId, mode!),
    enabled: open && Boolean(mode),
    // The balance can change while this is open, so do not serve a stale one.
    staleTime: 0,
  });

  const [minutes, setMinutes] = React.useState<number | null>(null);
  const [custom, setCustom] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setMinutes(null);
      setCustom("");
    }
  }, [open, mode]);

  if (!mode) return null;

  const affordable = quote?.affordable_minutes ?? 0;
  const rate = quote?.coins_per_minute ?? 0;
  const minMinutes = quote?.min_minutes ?? 1;
  const maxMinutes = quote?.max_minutes ?? 60;

  const chosen = minutes ?? (custom ? Number(custom) : null);
  const cost = chosen && rate ? chosen * rate : 0;
  const tooLong = chosen !== null && chosen > affordable;
  const outOfRange =
    chosen !== null && (chosen < minMinutes || chosen > maxMinutes);
  const canGo = chosen !== null && !tooLong && !outOfRange && !starting;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${MODE_LABELS[mode]} with ${astrologerName}`}
      description="How long would you like to talk? We will stop at that."
    >
      {isLoading || !quote ? (
        <p className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Checking your balance…
        </p>
      ) : (
        <div className="space-y-4">
          {/* ------------------------------------------------- the numbers */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-surface-muted/50 px-3.5 py-2.5 text-sm">
            <span className="flex items-center gap-1.5">
              <Coins className="size-4 text-gold-500" />
              <strong>{rate}</strong> {coinWord(rate)} a minute
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Wallet className="size-4" />
              {formatCoins(quote.balance_coins)} left
            </span>
          </div>

          {affordable < minMinutes ? (
            <>
              <Alert tone="warning" title="Not enough coins">
                You need at least {formatCoins(rate * minMinutes)} {coinWord(rate)} for
                a {minMinutes}-minute {MODE_LABELS[mode].toLowerCase()}, and have{" "}
                {formatCoins(quote.balance_coins)}.
              </Alert>
              <Link href="/account/wallet" className="block">
                <Button className="w-full">Add coins</Button>
              </Link>
            </>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-2">
                {PRESETS.filter((m) => m >= minMinutes && m <= maxMinutes).map((m) => {
                  const over = m > affordable;
                  const active = minutes === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      disabled={over}
                      onClick={() => {
                        setMinutes(m);
                        setCustom("");
                      }}
                      className={cn(
                        "rounded-xl border px-2 py-2.5 text-center transition-colors",
                        over
                          ? "cursor-not-allowed border-border opacity-40"
                          : active
                            ? "border-brand-500 bg-brand-500 text-white"
                            : "border-border hover:border-brand-400",
                      )}
                    >
                      <span className="block text-base font-semibold">{m}</span>
                      <span className="block text-[11px] opacity-80">min</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={minMinutes}
                  max={maxMinutes}
                  step={1}
                  placeholder={`Or type minutes (max ${Math.min(affordable, maxMinutes)})`}
                  value={custom}
                  onChange={(e) => {
                    setCustom(e.target.value);
                    setMinutes(null);
                  }}
                  className="h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm outline-none focus:border-brand-400"
                />
              </div>

              {/* --------------------------------------------- what it costs */}
              {chosen !== null && chosen > 0 && (
                <div
                  className={cn(
                    "rounded-xl px-3.5 py-2.5 text-sm",
                    tooLong || outOfRange
                      ? "bg-danger-surface text-danger"
                      : "bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-200",
                  )}
                >
                  {outOfRange ? (
                    `Choose between ${minMinutes} and ${maxMinutes} minutes.`
                  ) : tooLong ? (
                    `That needs ${formatCoins(cost)} ${coinWord(cost)} — you have ${formatCoins(quote.balance_coins)}. You can talk for up to ${affordable} minute${affordable === 1 ? "" : "s"}.`
                  ) : (
                    <>
                      {chosen} minute{chosen === 1 ? "" : "s"} ={" "}
                      <strong>
                        {formatCoins(cost)} {coinWord(cost)}
                      </strong>
                      , leaving {formatCoins(quote.balance_coins - cost)}.
                    </>
                  )}
                </div>
              )}

              {error && <Alert tone="error">{error}</Alert>}

              <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                We stop at the time you choose. Coins are taken for each minute
                that starts.
              </p>

              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={!canGo}
                  onClick={() => chosen && onConfirm(chosen)}
                >
                  {starting && <Loader2 className="size-4 animate-spin" />}
                  {chosen && !tooLong && !outOfRange
                    ? `Start · ${formatCoins(cost)} ${coinWord(cost)}`
                    : "Start"}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
