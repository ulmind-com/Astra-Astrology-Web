"use client";

import Link from "next/link";
import React from "react";
import { ArrowRight } from "lucide-react";
import { astrologyApi } from "@/lib/api";
import type { DailyHoroscopeResult, DailySignHoroscope } from "@/types";

interface ZodiacSignItem {
  id: string;
  index: number;
  name: string;
  sanskrit: string;
  dates: string;
  icon: string; // @arivedha/astro-icons rashi name
}

// Order MUST match backend sign_index (0 = Aries ... 11 = Pisces)
const ZODIAC_SIGNS: ZodiacSignItem[] = [
  { id: "aries", index: 0, name: "Aries", sanskrit: "Mesh", dates: "Mar 21 – Apr 19", icon: "mesha" },
  { id: "taurus", index: 1, name: "Taurus", sanskrit: "Vrishabh", dates: "Apr 20 – May 20", icon: "rishabha" },
  { id: "gemini", index: 2, name: "Gemini", sanskrit: "Mithun", dates: "May 21 – Jun 20", icon: "mithuna" },
  { id: "cancer", index: 3, name: "Cancer", sanskrit: "Kark", dates: "Jun 21 – Jul 22", icon: "kataka" },
  { id: "leo", index: 4, name: "Leo", sanskrit: "Singh", dates: "Jul 23 – Aug 22", icon: "simha" },
  { id: "virgo", index: 5, name: "Virgo", sanskrit: "Kanya", dates: "Aug 23 – Sep 22", icon: "kanya" },
  { id: "libra", index: 6, name: "Libra", sanskrit: "Tula", dates: "Sep 23 – Oct 22", icon: "thula" },
  { id: "scorpio", index: 7, name: "Scorpio", sanskrit: "Vrishchik", dates: "Oct 23 – Nov 21", icon: "vrischika" },
  { id: "sagittarius", index: 8, name: "Sagittarius", sanskrit: "Dhanu", dates: "Nov 22 – Dec 21", icon: "dhanus" },
  { id: "capricorn", index: 9, name: "Capricorn", sanskrit: "Makar", dates: "Dec 22 – Jan 19", icon: "makara" },
  { id: "aquarius", index: 10, name: "Aquarius", sanskrit: "Kumbh", dates: "Jan 20 – Feb 18", icon: "kumbha" },
  { id: "pisces", index: 11, name: "Pisces", sanskrit: "Meen", dates: "Feb 19 – Mar 20", icon: "meena" },
];

// Renders a rashi logo from the @arivedha/astro-icons web component (<astro-rashi>).
function RashiIcon({ icon, size, color }: { icon: string; size: number; color: string }) {
  return React.createElement("astro-rashi", {
    icon,
    size: String(size),
    color,
    bg: "none",
    ring: "none",
    radius: "50%",
    style: { width: size, height: size, display: "inline-block" },
  });
}

type RangeTab = "today" | "tomorrow" | "week" | "month";

const RANGE_TABS: { id: RangeTab; label: string; offset: number }[] = [
  { id: "today", label: "Today", offset: 0 },
  { id: "tomorrow", label: "Tomorrow", offset: 1 },
  { id: "week", label: "Week", offset: 7 },
  { id: "month", label: "Month", offset: 30 },
];

function formatDateToYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dateFromOffset(offset: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d;
}

// Map a 0-100 score to a short verdict word (two scales to echo the video).
function scoreVerdict(score: number, scale: "strength" | "level"): string {
  if (scale === "strength") {
    if (score >= 78) return "Strong";
    if (score >= 60) return "Steady";
    if (score >= 42) return "Soft";
    return "Low";
  }
  if (score >= 78) return "High";
  if (score >= 60) return "Good";
  if (score >= 42) return "Mild";
  return "Low";
}

function moodFromScores(sign?: DailySignHoroscope): { emoji: string; label: string } {
  if (!sign) return { emoji: "✨", label: "Balanced" };
  const love = sign.love_score ?? 0;
  const overall = sign.overall_score ?? 0;
  if (love >= 78) return { emoji: "😍", label: "Romantic" };
  if (overall >= 75) return { emoji: "😄", label: "Upbeat" };
  if (overall >= 60) return { emoji: "🙂", label: "Hopeful" };
  if (overall >= 45) return { emoji: "😌", label: "Calm" };
  return { emoji: "🧘", label: "Reserved" };
}

// Resolve lucky_color string to a usable CSS color for the swatch.
const COLOR_MAP: Record<string, string> = {
  red: "#ef4444", crimson: "#dc143c", scarlet: "#ff2400",
  pink: "#ec4899", rose: "#f43f5e", magenta: "#d946ef",
  orange: "#f97316", amber: "#f59e0b", gold: "#d4af37", yellow: "#eab308",
  green: "#22c55e", emerald: "#10b981", lime: "#84cc16", olive: "#808000",
  teal: "#14b8a6", cyan: "#06b6d4", blue: "#3b82f6", navy: "#1e3a8a", indigo: "#6366f1",
  purple: "#a855f7", violet: "#8b5cf6", lavender: "#b57edc",
  brown: "#92400e", maroon: "#800000", white: "#f8fafc", cream: "#fdf6e3",
  silver: "#cbd5e1", grey: "#94a3b8", gray: "#94a3b8", black: "#1f2937",
};

function resolveColor(raw?: string): string {
  if (!raw) return "#d946ef";
  const s = raw.trim().toLowerCase();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s)) return s;
  for (const key of Object.keys(COLOR_MAP)) {
    if (s.includes(key)) return COLOR_MAP[key];
  }
  return "#d946ef";
}

const METERS: {
  key: keyof Pick<DailySignHoroscope, "love_score" | "career_score" | "health_score" | "finance_score">;
  label: string;
  scale: "strength" | "level";
  bar: string;
}[] = [
  { key: "love_score", label: "Love", scale: "strength", bar: "from-rose-400 to-red-500" },
  { key: "career_score", label: "Career", scale: "strength", bar: "from-amber-300 to-orange-400" },
  { key: "health_score", label: "Health", scale: "level", bar: "from-emerald-300 to-green-500" },
  { key: "finance_score", label: "Money", scale: "level", bar: "from-orange-300 to-amber-500" },
];

export function AstrologyPredictionZodiac() {
  const [tab, setTab] = React.useState<RangeTab>("today");
  const [activeIndex, setActiveIndex] = React.useState<number>(11); // Pisces, like the video
  const [data, setData] = React.useState<DailyHoroscopeResult | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  // Register the <astro-rashi> web component on the client only.
  React.useEffect(() => {
    import("@arivedha/astro-icons").catch((e) => console.error("astro-icons load failed:", e));
  }, []);

  const selectedDate = React.useMemo(() => {
    const t = RANGE_TABS.find((r) => r.id === tab) ?? RANGE_TABS[0];
    return dateFromOffset(t.offset);
  }, [tab]);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    astrologyApi
      .dailyHoroscope({
        date: formatDateToYMD(selectedDate),
        language: "en",
        latitude: 22.5726,
        longitude: 88.3639,
        timezone: 5.5,
      })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        console.error("Home daily horoscope error:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  const activeMeta = ZODIAC_SIGNS[activeIndex];
  const activeSign: DailySignHoroscope | undefined =
    data?.signs?.find((s) => s.sign_index === activeIndex) || data?.signs?.[activeIndex];

  const mood = moodFromScores(activeSign);
  const swatch = resolveColor(activeSign?.lucky_color);

  const datePill = React.useMemo(() => {
    const label = RANGE_TABS.find((r) => r.id === tab)?.label ?? "Today";
    const d = selectedDate;
    const nice = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    return `${label} · ${nice}`;
  }, [tab, selectedDate]);

  return (
    <section className="relative overflow-hidden border-b border-[#f2e9b0]/60 bg-gradient-to-br from-white via-[#fffdf3] to-[#fef7cf] py-10 sm:py-14">
      {/* soft celestial glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-0 size-[520px] rounded-full bg-[#fdeeb0]/40 blur-3xl" />
        <div className="absolute top-1/2 -left-40 size-[420px] rounded-full bg-[#ffe9d6]/40 blur-3xl" />
      </div>

      {/* faint rotating zodiac wheel — left side background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/zodiac-wheel.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-[-90px] top-[90px] z-0 size-[360px] animate-[spin_55s_linear_infinite] select-none opacity-[0.05] lg:size-[460px] [will-change:transform] motion-reduce:animate-none"
        draggable={false}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading + range tabs */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#b8860b]">
              Your Daily Horoscope
            </span>
            <h2 className="mt-2 font-serif text-4xl font-bold leading-[1.05] tracking-tight text-[#1a1208] sm:text-5xl">
              Your daily
              <br />
              <span className="bg-gradient-to-r from-[#f5c000] via-[#f0b100] to-[#d9a300] bg-clip-text text-transparent">
                horoscope
              </span>{" "}
              reading
            </h2>
            <p className="mt-2 text-sm text-[#6b5f4d]">
              Pick your raashi to see today&apos;s pillars at a glance.
            </p>
          </div>

          <div className="inline-flex shrink-0 items-center gap-1 self-start rounded-full border border-[#eadf9a] bg-white/80 p-1 shadow-xs backdrop-blur-sm lg:self-end">
            {RANGE_TABS.map((r) => {
              const active = r.id === tab;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setTab(r.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors sm:text-sm ${
                    active
                      ? "bg-gradient-to-r from-[#e2561f] to-[#c2410c] text-white shadow-sm"
                      : "text-[#8b5e0a] hover:bg-[#fff7d1]"
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Zodiac picker row */}
        <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
          {ZODIAC_SIGNS.map((sign) => {
            const selected = sign.index === activeIndex;
            return (
              <button
                key={sign.id}
                type="button"
                onClick={() => setActiveIndex(sign.index)}
                className={`group flex flex-col items-center gap-2 rounded-2xl border bg-white px-2 py-3 text-center transition-all duration-300 hover:-translate-y-1 ${
                  selected
                    ? "border-[#e0b000] shadow-[0_12px_26px_-10px_rgba(224,176,0,0.5)] ring-1 ring-[#e0b000]/40"
                    : "border-[#efe6bd]/80 hover:border-brand-300 hover:shadow-[0_10px_24px_-12px_rgba(201,154,20,0.4)]"
                }`}
              >
                <span
                  className={`flex size-12 items-center justify-center overflow-hidden rounded-full ring-1 transition-all sm:size-[52px] ${
                    selected ? "ring-[#e0b000]/60" : "ring-[#e7dcae]"
                  }`}
                >
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    <RashiIcon icon={sign.icon} size={42} color={selected ? "#c99a14" : "#b8860b"} />
                  </span>
                </span>
                <span className="flex flex-col leading-tight">
                  <span
                    className={`text-[13px] font-bold ${
                      selected ? "text-[#b8860b]" : "text-[#1a1208]"
                    }`}
                  >
                    {sign.name}
                  </span>
                  <span className="text-[10px] font-semibold text-[#a08a5e]">{sign.sanskrit}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected sign card */}
        <div className="mt-6 rounded-3xl border border-[#eadf9a] bg-white/90 p-5 shadow-[0_18px_44px_-24px_rgba(201,154,20,0.45)] backdrop-blur-sm sm:p-7">
          {/* top row: identity + date pill */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span className="flex size-14 items-center justify-center overflow-hidden rounded-full ring-1 ring-[#e7dcae] sm:size-16">
                <RashiIcon icon={activeMeta.icon} size={54} color="#c99a14" />
              </span>
              <div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xl font-bold text-[#1a1208] sm:text-2xl">{activeMeta.name}</h3>
                  <span className="text-sm font-semibold text-[#a08a5e]">{activeMeta.sanskrit}</span>
                </div>
                <p className="mt-0.5 text-xs font-medium text-[#8b7d63]">{activeMeta.dates}</p>
              </div>
            </div>

            <span className="rounded-full border border-[#eadf9a] bg-[#fffdf5] px-3.5 py-1.5 text-xs font-bold text-[#8b5e0a] shadow-2xs">
              {datePill}
            </span>
          </div>

          {/* body: summary + meters */}
          <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            {/* left: summary, meta, CTAs */}
            <div>
              <p className="text-base font-medium leading-relaxed text-[#332c39] sm:text-lg">
                {loading && !activeSign
                  ? "Reading today's transit…"
                  : activeSign?.summary || "Your reading is being prepared."}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#6b5f4d]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-semibold text-[#8b7d63]">Mood:</span>
                  <span className="font-bold text-[#1a1208]">
                    {mood.emoji} {mood.label}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-semibold text-[#8b7d63]">Lucky #:</span>
                  <span className="font-bold text-[#1a1208]">{activeSign?.lucky_number ?? "—"}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-semibold text-[#8b7d63]">Color:</span>
                  <span
                    className="inline-block size-4 rounded-sm ring-1 ring-black/10"
                    style={{ backgroundColor: swatch }}
                    title={activeSign?.lucky_color || undefined}
                  />
                </span>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={`/daily-horoscope?sign=${activeMeta.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#fcd404] to-[#f3c200] px-5 py-2.5 text-sm font-bold text-[#1c1304] shadow-sm transition-transform hover:scale-[1.03] border border-[#d9af00]"
                >
                  Get my detailed horoscope
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/astrologers"
                  className="rounded-full border border-[#eadf9a] bg-white px-5 py-2.5 text-sm font-bold text-[#1a1208] shadow-2xs transition-colors hover:bg-[#fffdf5]"
                >
                  Talk to a specialist
                </Link>
              </div>
            </div>

            {/* right: meters */}
            <div className="flex flex-col justify-center gap-4 rounded-2xl bg-[#fffdf5]/60 p-4 sm:p-5">
              {METERS.map((m) => {
                const score = Math.max(0, Math.min(100, (activeSign?.[m.key] as number) ?? 0));
                return (
                  <div key={m.key}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold uppercase tracking-wide text-[#8b7d63]">{m.label}</span>
                      <span className="font-bold text-[#1a1208]">
                        {activeSign ? scoreVerdict(score, m.scale) : "—"}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#eee3c4]/70">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${m.bar} transition-[width] duration-500`}
                        style={{ width: `${activeSign ? score : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
