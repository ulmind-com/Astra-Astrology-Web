"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  Compass,
  GraduationCap,
  Languages,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Users,
  Video,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { getAstrologerBanner } from "@/components/astrologers/astrologer-card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Avatar, Badge, Button, EmptyState, StatusDot } from "@/components/ui";
import { astrologerApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  SKILL_LABELS,
  type AstrologerPublic,
  type Skill,
} from "@/types";

function rupees(paise: number): string {
  return (paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

type SortOption = "recommended" | "rating" | "price_asc" | "price_desc" | "experience";

const POPULAR_SKILL_FILTERS: { label: string; skill: Skill | "all" }[] = [
  { label: "All Disciplines", skill: "all" },
  { label: "Vedic Astrology", skill: "vedic_astrology" },
  { label: "Kundali & Love", skill: "love_relationship" },
  { label: "Tarot Reading", skill: "tarot" },
  { label: "Numerology", skill: "numerology" },
  { label: "Career & Business", skill: "career_business" },
  { label: "KP Astrology", skill: "kp_astrology" },
  { label: "Palmistry", skill: "palmistry" },
  { label: "Vastu Shastra", skill: "vastu" },
];

export default function AppointmentsPage() {
  const [search, setSearch] = React.useState("");
  const [selectedSkill, setSelectedSkill] = React.useState<Skill | "all">("all");
  const [sortBy, setSortBy] = React.useState<SortOption>("recommended");

  const { data, isLoading } = useQuery({
    queryKey: ["astrologers", { appointments: true }],
    queryFn: () => astrologerApi.list({ limit: 100 }),
  });

  // Only astrologers with enabled appointment pricing
  const bookableAstrologers = React.useMemo(
    () => (data?.items ?? []).filter((a) => a.appointment?.enabled && a.appointment.price_paise > 0),
    [data],
  );

  // Filter & search
  const filtered = React.useMemo(() => {
    let list = bookableAstrologers;

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.display_name.toLowerCase().includes(q) ||
          (a.tagline && a.tagline.toLowerCase().includes(q)) ||
          a.skills.some((s) => s.toLowerCase().includes(q)) ||
          a.languages.some((l) => l.toLowerCase().includes(q)),
      );
    }

    if (selectedSkill !== "all") {
      list = list.filter((a) => a.skills.includes(selectedSkill));
    }

    // Sort
    return [...list].sort((a, b) => {
      if (sortBy === "rating") {
        return (b.rating?.average ?? 0) - (a.rating?.average ?? 0);
      }
      if (sortBy === "price_asc") {
        return a.appointment.price_paise - b.appointment.price_paise;
      }
      if (sortBy === "price_desc") {
        return b.appointment.price_paise - a.appointment.price_paise;
      }
      if (sortBy === "experience") {
        return b.experience_years - a.experience_years;
      }
      // "recommended" (featured first, then rating, then consultations)
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
      return (b.rating?.average ?? 0) - (a.rating?.average ?? 0);
    });
  }, [bookableAstrologers, search, selectedSkill, sortBy]);

  const hasActiveFilters = search.trim() !== "" || selectedSkill !== "all";

  const clearFilters = () => {
    setSearch("");
    setSelectedSkill("all");
    setSortBy("recommended");
  };

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-surface-muted/30 pb-20">
        {/* --------------------------------- HERO BANNER --------------------------------- */}
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-brand-950/10 via-brand-900/5 to-transparent pt-12 pb-14 sm:pt-16 sm:pb-20">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-radial from-brand-500/12 via-amber-500/6 to-transparent blur-3xl" />
            <div className="absolute top-10 right-10 size-72 rounded-full bg-amber-400/8 blur-2xl" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 shadow-xs backdrop-blur-xs">
                  <Sparkles className="size-3.5 text-amber-500 animate-pulse" />
                  <span>Scheduled 1-on-1 Consultations</span>
                </div>

                <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                  Book Astrologer Appointments{" "}
                  <span className="bg-gradient-to-r from-amber-600 via-brand-600 to-amber-700 bg-clip-text text-transparent dark:from-amber-400 dark:via-brand-400 dark:to-amber-300">
                    With Verified Gurus
                  </span>
                </h1>

                <p className="mt-3.5 text-base sm:text-lg leading-relaxed text-muted-foreground">
                  Reserve dedicated, uninterrupted consultation time. No waiting in queue — receive detailed birth chart (Kundali) analysis, career guidance, and remedies.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href="/account/appointments"
                  className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-xs transition-all hover:bg-surface-muted hover:border-brand-500/40 hover:-translate-y-0.5"
                >
                  <CalendarCheck className="size-4 text-brand-600 dark:text-brand-400" />
                  <span>My Bookings</span>
                </Link>

                <Link
                  href="/astrologers"
                  className="inline-flex items-center gap-2 rounded-2xl border border-brand-500/30 bg-brand-50/70 dark:bg-brand-950/40 px-4 py-2.5 text-sm font-semibold text-brand-700 dark:text-brand-300 shadow-xs transition-all hover:bg-brand-100 hover:-translate-y-0.5"
                >
                  <Compass className="size-4 text-brand-600 dark:text-brand-400" />
                  <span>Live Directory</span>
                </Link>
              </div>
            </div>

            {/* Feature trust pills strip */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-border/50">
              <div className="flex items-center gap-2.5 rounded-xl bg-card/60 p-2.5 sm:p-3 border border-border/40 backdrop-blur-xs">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Clock className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground">Guaranteed Slot</p>
                  <p className="text-[11px] text-muted-foreground truncate">No queue or wait</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl bg-card/60 p-2.5 sm:p-3 border border-border/40 backdrop-blur-xs">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Sparkles className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground">In-Depth Review</p>
                  <p className="text-[11px] text-muted-foreground truncate">Kundali chart analysis</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl bg-card/60 p-2.5 sm:p-3 border border-border/40 backdrop-blur-xs">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground">100% Private</p>
                  <p className="text-[11px] text-muted-foreground truncate">Direct HD Video / Call</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl bg-card/60 p-2.5 sm:p-3 border border-border/40 backdrop-blur-xs">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <CheckCircle2 className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground">Transparent Fee</p>
                  <p className="text-[11px] text-muted-foreground truncate">Fixed slot pricing</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------- SEARCH & FILTER SECTION ---------------------------- */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, expertise, language..."
                className="w-full rounded-2xl border border-border bg-card pl-10 pr-9 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:outline-hidden focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all shadow-xs"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <SlidersHorizontal className="size-4 text-muted-foreground shrink-0" />
              <span className="text-xs font-medium text-muted-foreground shrink-0">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort astrologers by"
                className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-brand-500/30 transition-all shadow-xs"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Top Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="experience">Most Experienced</option>
              </select>
            </div>
          </div>

          {/* Discipline / Skill category pill tabs */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {POPULAR_SKILL_FILTERS.map((f) => {
              const active = selectedSkill === f.skill;
              return (
                <button
                  key={f.skill}
                  type="button"
                  onClick={() => setSelectedSkill(f.skill)}
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
                    active
                      ? "bg-brand-600 text-white shadow-xs font-semibold"
                      : "bg-card text-muted-foreground border border-border hover:border-brand-500/40 hover:text-foreground",
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Result meta count and active filters reset */}
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <p>
              Showing{" "}
              <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "astrologer" : "astrologers"} available for booking
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-brand-600 dark:text-brand-400 hover:underline font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* ----------------------------- ASTROLOGER CARDS GRID ----------------------------- */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-6">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <AppointmentCardSkeleton key={n} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4">
                <CalendarDays className="size-7" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">
                No appointment slots found
              </h3>
              <p className="mt-1.5 max-w-md mx-auto text-sm text-muted-foreground">
                {hasActiveFilters
                  ? "None of our astrologers match your selected search or filter criteria. Try clearing filters."
                  : "Astrologers are currently setting up their appointment schedules. Please check back shortly or try an instant consultation."}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {hasActiveFilters && (
                  <Button variant="secondary" size="sm" onClick={clearFilters}>
                    Clear filters
                  </Button>
                )}
                <Link href="/astrologers">
                  <Button size="sm">Explore live astrologers</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((astrologer) => (
                <AppointmentAstrologerCard key={astrologer.id} astrologer={astrologer} />
              ))}
            </div>
          )}
        </div>

        {/* ------------------------ HOW APPOINTMENTS WORK SECTION ------------------------ */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-16 sm:mt-24">
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-xs">
            <div className="text-center max-w-xl mx-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-50/70 dark:bg-brand-950/40 px-3 py-1 text-xs font-semibold text-brand-700 dark:text-brand-300">
                ✦ Easy 3-Step Process
              </span>
              <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                How Scheduled Appointments Work
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Simple, transparent, and completely private Vedic astrology consultations.
              </p>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-surface-muted/50 border border-border/40">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-display font-bold text-lg mb-3">
                  1
                </div>
                <h4 className="font-semibold text-sm text-foreground">Select Astrologer & Day</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Browse verified astrologers and select a convenient date from their calendar.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-surface-muted/50 border border-border/40">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-display font-bold text-lg mb-3">
                  2
                </div>
                <h4 className="font-semibold text-sm text-foreground">Pick Slot & Share Details</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Choose your time slot and provide your birth date, time, and queries in advance.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-surface-muted/50 border border-border/40">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-display font-bold text-lg mb-3">
                  3
                </div>
                <h4 className="font-semibold text-sm text-foreground">Join Direct Consultation</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Connect on scheduled time via crystal clear HD call with zero waiting.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

// -------------------------------------------------------------------------------------------------
// APPOINTMENT ASTROLOGER CARD COMPONENT
// -------------------------------------------------------------------------------------------------
function AppointmentAstrologerCard({ astrologer }: { astrologer: AstrologerPublic }) {
  const href = `/appointments/${astrologer.slug ?? astrologer.id}`;
  const bannerSrc = astrologer.banner_image_url || getAstrologerBanner(astrologer.id);
  const isCustomBanner = Boolean(astrologer.banner_image_url);

  const priceFormatted = rupees(astrologer.appointment.price_paise);
  const blockMinutes = astrologer.appointment.block_minutes;

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-[26px] sm:rounded-[28px]",
        "bg-card border border-border/80 shadow-[0_8px_30px_-12px_rgba(26,18,8,0.08)]",
        "transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_-12px_rgba(26,18,8,0.18)] hover:border-brand-500/40",
      )}
    >
      {/* Top 3D Cosmic Banner */}
      <div className="relative h-32 sm:h-36 w-full overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-brand-950">
        <Image
          src={bannerSrc}
          alt={astrologer.display_name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          unoptimized={isCustomBanner}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

        {/* Status badges overlay */}
        <div className="absolute inset-x-3.5 top-3.5 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/45 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white border border-white/20 shadow-xs">
            <Sparkles className="size-3 text-amber-400" />
            <span>Slot Booking Open</span>
          </span>

          {astrologer.rating?.count > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/55 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-amber-300 border border-amber-400/30 shadow-xs">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              <span>{astrologer.rating.average.toFixed(1)}</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="relative flex flex-1 flex-col px-5 pt-0 pb-5">
        {/* Overlapping Avatar */}
        <div className="relative -mt-9 flex items-end justify-between mb-3">
          <div className="relative rounded-full ring-4 ring-card shadow-md">
            <Avatar src={astrologer.profile_image_url} name={astrologer.display_name} size="lg" />
            <span className="absolute right-0.5 bottom-0.5 rounded-full bg-card p-0.5 shadow-xs">
              <StatusDot
                online={astrologer.availability.is_online}
                busy={astrologer.availability.is_busy}
              />
            </span>
          </div>

          {/* Experience pill */}
          {astrologer.experience_years > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground border border-border/60">
              <GraduationCap className="size-3 text-brand-600 dark:text-brand-400" />
              <span>{astrologer.experience_years}+ yrs exp</span>
            </span>
          )}
        </div>

        {/* Astrologer Name & Tagline */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-display text-base sm:text-lg font-bold text-foreground group-hover:text-brand-600 transition-colors">
              {astrologer.display_name}
            </h3>
            <ShieldCheck className="size-4 shrink-0 text-amber-500 fill-amber-500/20" />
          </div>

          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
            {astrologer.tagline || "Vedic Astrologer & Kundali Specialist"}
          </p>
        </div>

        {/* Languages */}
        {astrologer.languages.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Languages className="size-3.5 shrink-0 text-muted-foreground/70" />
            <span className="truncate text-[11px]">
              {astrologer.languages.slice(0, 3).join(", ")}
            </span>
          </div>
        )}

        {/* Skills Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {astrologer.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-lg bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-foreground/80 border border-border/50"
            >
              {SKILL_LABELS[skill] || skill.replace(/_/g, " ")}
            </span>
          ))}
          {astrologer.skills.length > 3 && (
            <span className="rounded-lg bg-surface-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              +{astrologer.skills.length - 3}
            </span>
          )}
        </div>

        {/* Appointment Pricing Highlight Box */}
        <div className="mt-4 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-amber-500/5 p-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                <Clock className="size-3" />
                <span>{blockMinutes} Min Session</span>
              </span>
              <p className="text-[10px] text-muted-foreground">1-on-1 private slot</p>
            </div>

            <div className="text-right">
              <span className="text-base sm:text-lg font-bold text-foreground font-display tabular-nums">
                ₹{priceFormatted}
              </span>
              <p className="text-[10px] text-muted-foreground">Total booking fee</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-4">
          <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all group-hover:bg-brand-700 group-hover:shadow-brand-500/20">
            <span>Book Appointment Slot</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// -------------------------------------------------------------------------------------------------
// SKELETON PLACEHOLDER COMPONENT
// -------------------------------------------------------------------------------------------------
function AppointmentCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[26px] border border-border/80 bg-card shadow-xs animate-pulse">
      <div className="h-32 sm:h-36 bg-surface-muted" />
      <div className="p-5 pt-0">
        <div className="-mt-9 flex items-end justify-between mb-3">
          <div className="size-16 rounded-full bg-surface-muted ring-4 ring-card" />
          <div className="h-5 w-20 rounded-full bg-surface-muted" />
        </div>
        <div className="h-5 w-36 rounded-md bg-surface-muted mb-2" />
        <div className="h-3 w-48 rounded-md bg-surface-muted mb-4" />
        <div className="flex gap-1.5 mb-4">
          <div className="h-5 w-16 rounded-lg bg-surface-muted" />
          <div className="h-5 w-20 rounded-lg bg-surface-muted" />
        </div>
        <div className="h-16 rounded-2xl bg-surface-muted mb-4" />
        <div className="h-10 rounded-xl bg-surface-muted" />
      </div>
    </div>
  );
}
