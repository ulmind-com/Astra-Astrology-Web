"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Avatar, Badge, EmptyState, LoadingBlock } from "@/components/ui";
import { astrologerApi } from "@/lib/api";

function rupees(paise: number): string {
  return (paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export default function AppointmentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["astrologers", { appointments: true }],
    queryFn: () => astrologerApi.list({ limit: 50 }),
  });

  // Only the ones actually taking bookings; the rest have nothing to show.
  const bookable = React.useMemo(
    () => (data?.items ?? []).filter((a) => a.appointment?.enabled && a.appointment.price_paise > 0),
    [data],
  );

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-3xl font-bold tracking-tight">Appointments</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Book a time with an astrologer rather than waiting for one to be free. You
          pay a part now to hold the slot; the rest at the appointment.
        </p>

        <div className="mt-8">
          {isLoading ? (
            <LoadingBlock label="Finding who takes appointments…" />
          ) : bookable.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="Nobody is taking appointments yet"
              description="Astrologers open their calendars from their own panel. Try a live consultation instead."
            />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bookable.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/appointments/${a.slug ?? a.id}`}
                    className="card-surface group flex h-full flex-col gap-3 p-5 transition-all hover:card-glow hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar src={a.profile_image_url} name={a.display_name} size="md" />
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{a.display_name}</p>
                        <p className="truncate text-xs text-muted-foreground">{a.tagline}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {a.skills.slice(0, 2).map((s) => (
                        <Badge key={s} tone="brand" className="capitalize">
                          {s.replace(/_/g, " ")}
                        </Badge>
                      ))}
                    </div>

                    <p className="mt-auto flex items-center gap-1.5 text-sm">
                      <Clock className="size-4 text-brand-700" />
                      <span className="font-semibold tabular-nums">
                        ₹{rupees(a.appointment.price_paise)}
                      </span>
                      <span className="text-muted-foreground">
                        / {a.appointment.block_minutes} min
                      </span>
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
