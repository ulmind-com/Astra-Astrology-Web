"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Briefcase,
  Compass,
  Hand,
  Hash,
  Heart,
  Layers,
  LayoutGrid,
  MessageCircleQuestion,
  Orbit,
  ScanFace,
  Scroll,
  Sparkles,
  Star,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import {
  AstrologerCard,
  AstrologerCardSkeleton,
} from "@/components/astrologers/astrologer-card";
import { Avatar } from "@/components/ui";
import { SKILL_LABELS, formatCoins, type AstrologerPublic } from "@/types";
import { cn, coinsPerMinute } from "@/lib/utils";
import { SKILLS } from "@/types";
import {
  ActiveFilterChips,
  DirectoryFilters,
  EMPTY_FILTERS,
  type Filters,
} from "@/components/astrologers/directory-filters";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Alert, Button, EmptyState, Pagination, Reveal } from "@/components/ui";
import { astrologerApi, type DirectoryFilters as ApiFilters } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import type { ConsultationMode, Skill } from "@/types";
import { useLanguage } from "@/providers/language-provider";
import { ASTROLOGERS_I18N } from "@/lib/astrologers-translations";

/** Form state is all strings; the API wants numbers and omitted keys. */
function toQuery(filters: Filters, page: number): ApiFilters {
  return {
    search: filters.search.trim() || undefined,
    skill: (filters.skill || undefined) as Skill | undefined,
    language: filters.language || undefined,
    mode: (filters.mode || undefined) as ConsultationMode | undefined,
    online_only: filters.online_only || undefined,
    featured_only: filters.featured_only || undefined,
    min_experience: filters.min_experience ? Number(filters.min_experience) : undefined,
    max_coins_per_minute: filters.max_rate ? Number(filters.max_rate) : undefined,
    page,
    limit: 12,
  };
}

const SIDEBAR_COPY = {
  en: {
    now: "Trending now",
    most: "Most consulted this week",
    sub: "The astrologers everyone is talking to right now.",
  },
  bn: {
    now: "এখন জনপ্রিয়",
    most: "এই সপ্তাহে সর্বাধিক পরামর্শ",
    sub: "যাঁদের সঙ্গে সবাই এখন কথা বলছেন।",
  },
  hi: {
    now: "अभी ट्रेंडिंग",
    most: "इस सप्ताह सर्वाधिक परामर्श",
    sub: "जिनसे अभी सब बात कर रहे हैं।",
  },
} as const;

/** Astrotalk-style "Most consulted this week" rail: top astrologers by volume. */
function TrendingSidebar({
  items,
  chatLabel,
  language,
}: {
  items: AstrologerPublic[];
  chatLabel: string;
  language: keyof typeof SIDEBAR_COPY;
}) {
  const copy = SIDEBAR_COPY[language] ?? SIDEBAR_COPY.en;
  const top = [...items]
    .sort((a, b) => (b.total_consultations ?? 0) - (a.total_consultations ?? 0))
    .slice(0, 6);
  if (top.length === 0) return null;

  return (
    <aside className="mt-8 lg:mt-0 lg:w-80 lg:shrink-0">
      <div className="lg:sticky lg:top-6 rounded-3xl border border-black/[0.07] bg-white/90 backdrop-blur-sm p-5 shadow-[0_10px_30px_-18px_rgba(26,18,8,0.14)]">
        <p className="text-[11px] font-bold uppercase tracking-widest text-brand-700">{copy.now}</p>
        <h2 className="mt-1 font-display text-xl font-bold tracking-tight text-ink-950">{copy.most}</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{copy.sub}</p>

        <ul className="mt-4 space-y-2.5">
          {top.map((a) => {
            const href = `/astrologers/${a.slug ?? a.id}`;
            const price = coinsPerMinute(
              a.rates,
              a.modes_enabled.includes("chat") ? "chat" : (a.modes_enabled[0] ?? "chat"),
            );
            const skills = a.skills.slice(0, 2).map((s) => SKILL_LABELS[s]).join(" · ");
            const rating = a.rating?.average ? a.rating.average.toFixed(1) : "5.0";
            return (
              <li key={a.id}>
                <div className="flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-white px-3 py-2.5 shadow-2xs transition-colors hover:border-brand-400/40 hover:bg-brand-50/40">
                  <Link href={href} className="relative shrink-0">
                    <span className="block size-11 overflow-hidden rounded-full ring-2 ring-emerald-400/70 ring-offset-2 ring-offset-white">
                      <Avatar
                        src={a.profile_image_url}
                        name={a.display_name}
                        size="md"
                        className="size-full rounded-full ring-0 shadow-none"
                      />
                    </span>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={href}
                      className="block truncate text-sm font-bold text-ink-950 transition-colors hover:text-brand-900"
                    >
                      {a.display_name}
                    </Link>
                    {skills && <p className="truncate text-[11px] text-muted-foreground">{skills}</p>}
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-ink-800">
                      <Star className="size-3 fill-gold-500 text-gold-500 shrink-0" />
                      <span className="tabular-nums">{rating}</span>
                      <span className="font-normal text-muted-foreground">· {formatCoins(price)}/min</span>
                    </p>
                  </div>
                  <Link
                    href={`${href}?mode=chat`}
                    className="shrink-0 rounded-full border border-brand-500/40 bg-brand-50 px-3.5 py-1.5 text-xs font-bold text-brand-800 transition-colors hover:border-brand-500 hover:bg-brand-500 hover:text-white"
                  >
                    {chatLabel}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

const CATEGORY_ALL_LABEL = { en: "All", bn: "সব", hi: "सभी" } as const;

/** An icon per category chip, like Astrotalk's quick-filters. */
const CATEGORY_ICONS: Record<Skill, LucideIcon> = {
  vedic_astrology: Sparkles,
  numerology: Hash,
  tarot: Layers,
  vastu: Compass,
  palmistry: Hand,
  face_reading: ScanFace,
  kp_astrology: Orbit,
  lal_kitab: BookOpen,
  nadi: Scroll,
  prashna: MessageCircleQuestion,
  love_relationship: Heart,
  career_business: Briefcase,
  finance_wealth: Wallet,
};

/** Astrotalk-style horizontal quick-filter chips over the real `skill` taxonomy
 * — each chip sets the backend `skill` filter. */
function QuickCategories({
  active,
  language,
  onPick,
}: {
  active: Skill | "";
  language: keyof typeof CATEGORY_ALL_LABEL;
  onPick: (skill: Skill | "") => void;
}) {
  const allLabel = CATEGORY_ALL_LABEL[language] ?? CATEGORY_ALL_LABEL.en;
  const options: (Skill | "")[] = ["", ...SKILLS];
  return (
      <div className="flex w-max items-center gap-2">
        {options.map((opt) => {
          const isActive = active === opt;
          const Icon = opt === "" ? LayoutGrid : CATEGORY_ICONS[opt];
          return (
            <button
              key={opt || "all"}
              type="button"
              onClick={() => onPick(opt)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-[0.97]",
                isActive
                  ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-[0_6px_16px_-7px_rgba(217,119,6,0.6)]"
                  : "border border-black/[0.08] bg-white text-ink-700 hover:border-amber-400/60 hover:bg-amber-50/60",
              )}
            >
              <Icon className={cn("size-4 shrink-0", isActive ? "text-white" : "text-amber-500")} />
              {opt === "" ? allLabel : SKILL_LABELS[opt]}
            </button>
          );
        })}
      </div>
  );
}

function DirectoryInner() {
  const { language } = useLanguage();
  const t = ASTROLOGERS_I18N[language] || ASTROLOGERS_I18N.en;
  const [filters, setFilters] = React.useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = React.useState(1);

  // Typing should not fire a request per keystroke.
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 350);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const query = toQuery({ ...filters, search: debouncedSearch }, page);

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["astrologers", query],
    queryFn: () => astrologerApi.list(query),
    // Keeps the previous page on screen while the next one loads.
    placeholderData: (previous) => previous,
  });

  function applyFilters(next: Filters) {
    setFilters(next);
    setPage(1); // a changed filter invalidates the page number
  }

  const apiError = error as ApiError | null;

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <header className="relative mb-10 overflow-hidden">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Left: copy */}
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-700 mb-4">
                {t.liveDirectoryBadge}
              </span>
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">{t.heading}</h1>
              <p className="mt-3 max-w-xl text-muted-foreground leading-relaxed">
                {t.subtitle}
              </p>
              <Link
                href="/account/favorites"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-rose-300/70 bg-rose-50/80 px-4 py-2 text-xs sm:text-sm font-semibold text-rose-700 shadow-2xs hover:bg-rose-100/90 transition-colors"
              >
                <Heart className="size-4 fill-rose-500 text-rose-500" />
                <span>My Favorites</span>
              </Link>
            </div>

            {/* Right: slow-rotating zodiac wheel + sample chat bubbles */}
            <div className="relative hidden min-h-[280px] items-center justify-center lg:flex" aria-hidden="true">
              <img
                src="/zodiac-wheel-gold.webp"
                alt=""
                className="pointer-events-none absolute size-[420px] select-none opacity-60 mix-blend-multiply animate-spin [animation-duration:90s] motion-reduce:animate-none"
              />
              <div className="absolute right-4 top-6 max-w-[230px] rounded-2xl rounded-tr-md bg-white px-4 py-2.5 text-sm leading-snug text-ink-800 shadow-[0_12px_32px_-12px_rgba(180,83,9,0.3)] ring-1 ring-black/5">
                Will I get the promotion I&apos;m hoping for this year?
              </div>
              <div className="absolute bottom-8 left-0 max-w-[250px] rounded-2xl rounded-tl-md bg-gradient-to-br from-amber-500 to-orange-600 px-4 py-2.5 text-sm leading-snug text-white shadow-[0_14px_34px_-12px_rgba(217,119,6,0.55)]">
                Your 10th house is strong — the window opens after September.
              </div>
            </div>
          </div>
        </header>

        <div className="lg:flex lg:items-start lg:gap-8">
          <div className="min-w-0 lg:flex-1">
        <div className="space-y-4">
          <DirectoryFilters
            filters={filters}
            onChange={applyFilters}
            total={data?.meta.total}
            trailing={
              <QuickCategories
                active={filters.skill}
                language={language as keyof typeof CATEGORY_ALL_LABEL}
                onPick={(skill) => applyFilters({ ...filters, skill })}
              />
            }
          />
          <ActiveFilterChips filters={filters} onChange={applyFilters} />
        </div>

        <div className="mt-8">
          {apiError ? (
            <Alert tone="error" title={t.errorTitle}>
              {apiError.message}
              <div className="mt-3">
                <Button size="sm" variant="secondary" onClick={() => refetch()}>
                  {t.tryAgainBtn}
                </Button>
              </div>
            </Alert>
          ) : isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <AstrologerCardSkeleton key={index} />
              ))}
            </div>
          ) : !data || data.items.length === 0 ? (
            <EmptyState
              icon={Users}
              title={t.noMatchTitle}
              description={t.noMatchDesc}
              action={
                <Button variant="secondary" onClick={() => applyFilters(EMPTY_FILTERS)}>
                  {t.clearFiltersBtn}
                </Button>
              }
            />
          ) : (
            <>
              {/* The wrapper stays mounted across pages, so the cards of the
                  next page animate in the same way the first page's did. */}
              <Reveal
                stagger
                className={`grid gap-5 transition-opacity duration-300 sm:grid-cols-2 xl:grid-cols-3 ${
                  isFetching ? "opacity-50" : "opacity-100"
                }`}
              >
                {data.items.map((astrologer) => (
                  <AstrologerCard key={astrologer.id} astrologer={astrologer} />
                ))}
              </Reveal>

              <div className="mt-8">
                <Pagination meta={data.meta} onPage={setPage} />
              </div>
            </>
          )}
        </div>
          </div>
          <TrendingSidebar
            items={data?.items ?? []}
            chatLabel={t.chat}
            language={language as keyof typeof SIDEBAR_COPY}
          />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

export default function AstrologersPage() {
  return <DirectoryInner />;
}
