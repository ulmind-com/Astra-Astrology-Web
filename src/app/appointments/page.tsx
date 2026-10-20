"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, Clock, Star } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Avatar, EmptyState, LoadingBlock, StatusDot } from "@/components/ui";
import { astrologerApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { SKILL_LABELS } from "@/types";

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
      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <header className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Appointments
          </h1>
          <p className="mt-2 max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Book a time with an astrologer rather than waiting for one to be free. You
            pay a part now to hold the slot; the rest at the appointment.
          </p>
        </header>

        <div>
          {isLoading ? (
            <LoadingBlock label="Finding who takes appointments…" />
          ) : bookable.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="Nobody is taking appointments yet"
              description="Astrologers open their calendars from their own panel. Try a live consultation instead."
            />
          ) : (
            <ul className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {bookable.map((a) => (
                <li key={a.id} className="h-full">
                  <Link
                    href={`/appointments/${a.slug ?? a.id}`}
                    className={cn(
                      "group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl",
                      "border border-border/80 bg-card p-5 sm:p-6 shadow-xs",
                      "transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-md",
                    )}
                  >
                    {/* Top Section: Avatar, Name, Rating, Tagline, Experience & Skills */}
                    <div>
                      <div className="flex items-start gap-3.5">
                        <div className="relative shrink-0">
                          <Avatar src={a.profile_image_url} name={a.display_name} size="lg" />
                          <span className="absolute -bottom-0.5 -right-0.5 rounded-full bg-card p-0.5 shadow-xs">
                            <StatusDot
                              online={a.availability.is_online}
                              busy={a.availability.is_busy}
                            />
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1.5">
                            <h3 className="truncate font-display text-base sm:text-lg font-bold text-foreground group-hover:text-brand-600 transition-colors">
                              {a.display_name}
                            </h3>
                            {a.rating?.count > 0 && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 shrink-0">
                                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                                <span>{a.rating.average.toFixed(1)}</span>
                              </span>
                            )}
                          </div>

                          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                            {a.tagline || "Vedic Astrologer"}
                          </p>

                          {a.experience_years > 0 && (
                            <p className="mt-1 text-[11px] font-medium text-muted-foreground/80">
                              {a.experience_years}+ years experience
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Skills Badges */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {a.skills.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="rounded-lg bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground/80 border border-border/40"
                          >
                            {SKILL_LABELS[s] || s.replace(/_/g, " ")}
                          </span>
                        ))}
                        {a.skills.length > 3 && (
                          <span className="rounded-lg bg-surface-muted/60 px-2 py-1 text-xs text-muted-foreground">
                            +{a.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Section: Slot Info, Price & Book CTA */}
                    <div className="mt-5 pt-4 border-t border-border/60">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="size-4 text-brand-600 dark:text-brand-400 shrink-0" />
                          <span className="font-semibold text-foreground">
                            {a.appointment.block_minutes} mins
                          </span>
                          <span>slot</span>
                        </div>

                        <div className="text-right">
                          <span className="font-display text-base sm:text-lg font-bold text-foreground tabular-nums">
                            ₹{rupees(a.appointment.price_paise)}
                          </span>
                        </div>
                      </div>

                      {/* Call-to-action button */}
                      <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-surface-muted group-hover:bg-brand-600 group-hover:text-white px-4 py-2.5 text-xs font-semibold text-foreground transition-all duration-200">
                        <span>Book Appointment</span>
                        <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </div>
                    </div>
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
