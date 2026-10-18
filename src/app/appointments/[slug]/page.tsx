"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock, Wallet } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  Alert,
  Avatar,
  Button,
  LoadingBlock,
  Textarea,
} from "@/components/ui";
import { appointmentApi, astrologerApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

function rupees(paise: number): string {
  return (paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function clock(d: Date): string {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** The next N days, as YYYY-MM-DD in the viewer's own timezone. */
function nextDays(count: number): { key: string; date: Date }[] {
  const out: { key: string; date: Date }[] = [];
  for (let i = 0; i < count; i += 1) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    const pad = (n: number) => String(n).padStart(2, "0");
    out.push({
      key: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      date: d,
    });
  }
  return out;
}

type Range = { starts_at: string; ends_at: string };

/**
 * Every start time that would fit a booking of `minutes`.
 *
 * Built by walking each open window on the slot grid and rejecting any start
 * whose whole length would touch something already booked — which is exactly
 * the rule the server enforces, so what is offered here is what will be
 * accepted. Offering a time the server would refuse is worse than offering
 * fewer times.
 */
function startsThatFit(
  windows: Range[],
  booked: Range[],
  minutes: number,
  slotMinutes: number,
  dayKey: string,
): Date[] {
  const starts: Date[] = [];
  const now = Date.now();
  const taken = booked.map((b) => [
    new Date(b.starts_at).getTime(),
    new Date(b.ends_at).getTime(),
  ]);

  for (const w of windows) {
    const windowStart = new Date(w.starts_at).getTime();
    const windowEnd = new Date(w.ends_at).getTime();
    const step = slotMinutes * 60_000;
    const length = minutes * 60_000;

    for (let t = windowStart; t + length <= windowEnd; t += step) {
      if (t <= now) continue;

      // Only times that land on the day the person is looking at.
      const asDate = new Date(t);
      const pad = (n: number) => String(n).padStart(2, "0");
      const key = `${asDate.getFullYear()}-${pad(asDate.getMonth() + 1)}-${pad(asDate.getDate())}`;
      if (key !== dayKey) continue;

      const clashes = taken.some(([s, e]) => t < e && s < t + length);
      if (!clashes) starts.push(asDate);
    }
  }
  return starts;
}

export default function BookAppointmentPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isSignedIn } = useAuth();

  const days = React.useMemo(() => nextDays(30), []);
  const [dayKey, setDayKey] = React.useState(days[0].key);
  const [minutes, setMinutes] = React.useState(30);
  const [chosen, setChosen] = React.useState<Date | null>(null);
  const [note, setNote] = React.useState("");

  const { data: astrologer, isLoading } = useQuery({
    queryKey: ["astrologer", slug],
    queryFn: () => astrologerApi.detail(slug),
  });

  const { data: view, isLoading: loadingDay } = useQuery({
    queryKey: ["appointments", "day", astrologer?.id, dayKey],
    queryFn: () => appointmentApi.day(astrologer!.id, dayKey),
    enabled: Boolean(astrologer?.id),
  });

  const { data: quote } = useQuery({
    queryKey: ["appointments", "quote", astrologer?.id, minutes],
    queryFn: () => appointmentApi.quote(astrologer!.id, minutes),
    enabled: Boolean(astrologer?.id) && isSignedIn,
  });

  // A length that no longer fits should not stay selected.
  React.useEffect(() => setChosen(null), [dayKey, minutes]);

  const lengths = React.useMemo(() => {
    if (!view) return [30];
    const out: number[] = [];
    for (let m = view.min_minutes; m <= view.max_minutes; m += view.slot_minutes) {
      // Keep the list short: the round numbers people actually pick.
      if (m % 15 === 0 || m === view.min_minutes) out.push(m);
    }
    return out;
  }, [view]);

  const options = React.useMemo(
    () =>
      view
        ? startsThatFit(view.windows, view.booked, minutes, view.slot_minutes, dayKey)
        : [],
    [view, minutes, dayKey],
  );

  const book = useMutation({
    mutationFn: () =>
      appointmentApi.book({
        astrologer_id: astrologer!.id,
        starts_at: chosen!.toISOString(),
        minutes,
        note: note.trim() || null,
      }),
    onSuccess: (appointment) => {
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
      void queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast.success("Booked.", {
        description: `${new Date(appointment.starts_at).toLocaleString()} · ${appointment.minutes} minutes`,
      });
      router.push("/account/appointments");
    },
    onError: (e: ApiError) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-16">
          <LoadingBlock />
        </main>
      </>
    );
  }

  if (!astrologer) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-16">
          <Alert tone="error">That astrologer could not be found.</Alert>
        </main>
      </>
    );
  }

  const card = astrologer.appointment;
  const takesBookings = card?.enabled && card.price_paise > 0;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link
          href="/appointments"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          All appointments
        </Link>

        <div className="card-surface flex items-center gap-4 p-5">
          <Avatar src={astrologer.profile_image_url} name={astrologer.display_name} size="lg" />
          <div className="min-w-0">
            <h1 className="font-display text-xl font-bold">{astrologer.display_name}</h1>
            <p className="truncate text-sm text-muted-foreground">{astrologer.tagline}</p>
            {takesBookings && (
              <p className="mt-1 text-sm">
                <span className="font-semibold tabular-nums">₹{rupees(card.price_paise)}</span>
                <span className="text-muted-foreground"> / {card.block_minutes} min</span>
              </p>
            )}
          </div>
        </div>

        {!takesBookings ? (
          <Alert tone="info" className="mt-6">
            This astrologer is not taking appointments right now.
          </Alert>
        ) : (
          <>
            {/* ------------------------------------------------------- day */}
            <section className="mt-8">
              <h2 className="font-display text-lg font-semibold">Pick a day</h2>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                {days.map(({ key, date }) => {
                  const active = key === dayKey;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setDayKey(key)}
                      className={cn(
                        "flex min-w-16 shrink-0 flex-col items-center rounded-xl border px-3 py-2 text-sm transition-colors",
                        active
                          ? "border-brand-500/45 bg-brand-200/60 text-ink-900"
                          : "border-border text-muted-foreground hover:border-border-strong",
                      )}
                    >
                      <span className="text-[11px] uppercase tracking-wide">
                        {date.toLocaleDateString([], { weekday: "short" })}
                      </span>
                      <span className="text-base font-semibold tabular-nums">
                        {date.getDate()}
                      </span>
                      <span className="text-[11px]">
                        {date.toLocaleDateString([], { month: "short" })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* -------------------------------------------------- duration */}
            <section className="mt-6">
              <h2 className="font-display text-lg font-semibold">How long?</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {lengths.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMinutes(m)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition-colors",
                      m === minutes
                        ? "border-brand-500/45 bg-brand-200/60 text-ink-900"
                        : "border-border text-muted-foreground hover:border-border-strong",
                    )}
                  >
                    {m} min
                    <span className="ml-1.5 text-xs opacity-70">
                      ₹{rupees(Math.round((card.price_paise * m) / card.block_minutes))}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* ------------------------------------------------- the times */}
            <section className="mt-6">
              <h2 className="font-display text-lg font-semibold">Pick a time</h2>

              {loadingDay ? (
                <LoadingBlock label="Checking what is free…" />
              ) : (
                <>
                  {(view?.booked.length ?? 0) > 0 && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Already booked:{" "}
                      {view!.booked
                        .map(
                          (b) =>
                            `${clock(new Date(b.starts_at))}–${clock(new Date(b.ends_at))}`,
                        )
                        .join(", ")}
                    </p>
                  )}

                  {options.length === 0 ? (
                    <Alert tone="warning" className="mt-3">
                      {view?.windows.length
                        ? `No ${minutes}-minute gap left on this day. Try a shorter appointment or another day.`
                        : "The astrologer has not opened any hours on this day."}
                    </Alert>
                  ) : (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {options.map((t) => {
                        const active = chosen?.getTime() === t.getTime();
                        return (
                          <button
                            key={t.toISOString()}
                            type="button"
                            onClick={() => setChosen(t)}
                            className={cn(
                              "rounded-lg border px-3.5 py-2 text-sm tabular-nums transition-colors",
                              active
                                ? "border-brand-500/55 bg-brand-200/70 text-ink-900"
                                : "border-border hover:border-border-strong",
                            )}
                          >
                            {clock(t)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </section>

            {/* ----------------------------------------------- confirming */}
            {chosen && (
              <section className="card-surface card-glow mt-8 p-5">
                <h2 className="font-display text-lg font-semibold">Confirm</h2>

                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">
                      <CalendarDays className="mr-1.5 inline size-4" />
                      When
                    </dt>
                    <dd className="text-right font-medium">
                      {chosen.toLocaleDateString([], {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                      <br />
                      <span className="tabular-nums">
                        {clock(chosen)} –{" "}
                        {clock(new Date(chosen.getTime() + minutes * 60_000))}
                      </span>
                    </dd>
                  </div>

                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">
                      <Clock className="mr-1.5 inline size-4" />
                      Length
                    </dt>
                    <dd className="font-medium tabular-nums">{minutes} minutes</dd>
                  </div>

                  {quote && (
                    <>
                      <div className="flex justify-between gap-4 border-t border-border pt-2">
                        <dt className="text-muted-foreground">Total</dt>
                        <dd className="font-medium tabular-nums">
                          ₹{rupees(quote.price_paise)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">
                          Pay now to hold it ({quote.commission_percent}%)
                        </dt>
                        <dd className="font-semibold tabular-nums text-ink-800">
                          ₹{rupees(quote.deposit_paise)} · {quote.deposit_coins} coins
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">At the appointment</dt>
                        <dd className="font-medium tabular-nums">
                          ₹{rupees(quote.balance_due_paise)}
                        </dd>
                      </div>
                    </>
                  )}
                </dl>

                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  What you pay now holds the slot and is <strong>not refunded</strong> if
                  you cancel.
                </p>

                <div className="mt-4">
                  <Textarea
                    rows={2}
                    maxLength={1000}
                    placeholder="Anything they should know beforehand? (optional)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                {!isSignedIn ? (
                  <Link href="/login" className="mt-4 block">
                    <Button size="lg" className="w-full">
                      Sign in to book
                    </Button>
                  </Link>
                ) : quote && !quote.can_afford ? (
                  <div className="mt-4">
                    <Alert tone="warning">
                      <Wallet className="mr-1.5 inline size-4" />
                      You have {quote.balance_coins} coins; this needs{" "}
                      {quote.deposit_coins}.
                    </Alert>
                    <Link href="/account/wallet" className="mt-3 block">
                      <Button size="lg" className="w-full">
                        Add coins
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    className="mt-4 w-full"
                    loading={book.isPending}
                    onClick={() => book.mutate()}
                  >
                    <CheckCircle2 className="size-4" />
                    Book this slot
                  </Button>
                )}
              </section>
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
