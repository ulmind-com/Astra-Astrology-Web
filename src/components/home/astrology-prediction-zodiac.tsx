"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { astrologyApi } from "@/lib/api";
import { useLanguage } from "@/providers/language-provider";
import type { DailyHoroscopeResult, DailySignHoroscope } from "@/types";

interface ZodiacSignItem {
  id: string;
  index: number;
  name: string;
  bengaliName: string;
  hindiName: string;
  sanskrit: string;
  dates: string;
  image: string;
}

// Order MUST match backend sign_index (0 = Aries ... 11 = Pisces)
const ZODIAC_SIGNS: ZodiacSignItem[] = [
  {
    id: "aries",
    index: 0,
    name: "Aries",
    bengaliName: "মেষ",
    hindiName: "मेष",
    sanskrit: "Mesha",
    dates: "Mar 21 - Apr 19",
    image: "/images/zodiac/modern/aries.webp",
  },
  {
    id: "taurus",
    index: 1,
    name: "Taurus",
    bengaliName: "বৃষ",
    hindiName: "वृषभ",
    sanskrit: "Vrishabha",
    dates: "Apr 20 - May 20",
    image: "/images/zodiac/modern/taurus.webp",
  },
  {
    id: "gemini",
    index: 2,
    name: "Gemini",
    bengaliName: "মিথুন",
    hindiName: "मिथुन",
    sanskrit: "Mithuna",
    dates: "May 21 - Jun 21",
    image: "/images/zodiac/modern/gemini.webp",
  },
  {
    id: "cancer",
    index: 3,
    name: "Cancer",
    bengaliName: "কর্কট",
    hindiName: "कर्क",
    sanskrit: "Karka",
    dates: "Jun 22 - Jul 22",
    image: "/images/zodiac/modern/cancer.webp",
  },
  {
    id: "leo",
    index: 4,
    name: "Leo",
    bengaliName: "সিংহ",
    hindiName: "सिंह",
    sanskrit: "Simha",
    dates: "Jul 23 - Aug 22",
    image: "/images/zodiac/modern/leo.webp",
  },
  {
    id: "virgo",
    index: 5,
    name: "Virgo",
    bengaliName: "কন্যা",
    hindiName: "कन्या",
    sanskrit: "Kanya",
    dates: "Aug 23 - Sept 22",
    image: "/images/zodiac/modern/virgo.webp",
  },
  {
    id: "libra",
    index: 6,
    name: "Libra",
    bengaliName: "তুলা",
    hindiName: "तुला",
    sanskrit: "Tula",
    dates: "Sept 23 - Oct 23",
    image: "/images/zodiac/modern/libra.webp",
  },
  {
    id: "scorpio",
    index: 7,
    name: "Scorpio",
    bengaliName: "বৃশ্চিক",
    hindiName: "वृश्चिक",
    sanskrit: "Vrishchika",
    dates: "Oct 24 - Nov 22",
    image: "/images/zodiac/modern/scorpio.webp",
  },
  {
    id: "sagittarius",
    index: 8,
    name: "Sagittarius",
    bengaliName: "ধনু",
    hindiName: "धनु",
    sanskrit: "Dhanu",
    dates: "Nov 23 - Dec 21",
    image: "/images/zodiac/modern/sagittarius.webp",
  },
  {
    id: "capricorn",
    index: 9,
    name: "Capricorn",
    bengaliName: "মকর",
    hindiName: "मकर",
    sanskrit: "Makara",
    dates: "Dec 22 - Jan 19",
    image: "/images/zodiac/modern/capricorn.webp",
  },
  {
    id: "aquarius",
    index: 10,
    name: "Aquarius",
    bengaliName: "কুম্ভ",
    hindiName: "कुंभ",
    sanskrit: "Kumbha",
    dates: "Jan 20 - Feb 18",
    image: "/images/zodiac/modern/aquarius.webp",
  },
  {
    id: "pisces",
    index: 11,
    name: "Pisces",
    bengaliName: "মীন",
    hindiName: "मीन",
    sanskrit: "Meena",
    dates: "Feb 19 - Mar 20",
    image: "/images/zodiac/modern/pisces.webp",
  },
];

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

// Map a 0-100 score to a short verdict word.
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
  const { language } = useLanguage();
  const [tab, setTab] = React.useState<RangeTab>("today");
  const [activeIndex, setActiveIndex] = React.useState<number>(0); // Aries default (or user preference)
  const [data, setData] = React.useState<DailyHoroscopeResult | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

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

  const activeMeta = ZODIAC_SIGNS[activeIndex] || ZODIAC_SIGNS[0];
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
    <section className="relative overflow-hidden border-b border-stone-200/80 bg-white py-12 sm:py-16 select-none">
      {/* Soft celestial background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 -left-40 size-[420px] rounded-full bg-amber-50/60 blur-3xl" />
        <div className="absolute top-1/3 -right-40 size-[420px] rounded-full bg-amber-50/40 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header: Choose your Zodiac Sign (Exact InstaAstro Screenshot Design) */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between pb-2">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1a1208]">
              {language === "bn"
                ? "আপনার রাশি বেছে নিন"
                : language === "hi"
                ? "अपनी राशि चुनें"
                : "Choose your Zodiac Sign"}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#6b5f4d] font-medium max-w-xl">
              {language === "bn"
                ? "আজকের গ্রহের প্রভাব, শুভ রং এবং বিশদ রাশিফল দেখতে যেকোনো রাশিতে ক্লিক করুন।"
                : "Select your rashi below to discover today's planetary transit, cosmic scores, and guidance."}
            </p>
          </div>

          {/* Range Tabs (Today / Tomorrow / Week / Month) */}
          <div className="inline-flex shrink-0 items-center gap-1 self-start rounded-full border border-stone-200 bg-stone-50/90 p-1 shadow-xs backdrop-blur-sm lg:self-end">
            {RANGE_TABS.map((r) => {
              const active = r.id === tab;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setTab(r.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all sm:text-sm cursor-pointer ${
                    active
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm"
                      : "text-stone-700 hover:text-amber-800 hover:bg-white"
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 12 Zodiac Signs Grid (2 Rows of 6 on Desktop, Exact InstaAstro Screenshot Style) */}
        <div className="mt-8 sm:mt-10 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-y-7 sm:gap-y-9 gap-x-3 sm:gap-x-6">
          {ZODIAC_SIGNS.map((sign) => {
            const selected = sign.index === activeIndex;
            return (
              <button
                key={sign.id}
                type="button"
                onClick={() => setActiveIndex(sign.index)}
                aria-pressed={selected}
                aria-label={`Select ${sign.name}`}
                className={`group flex flex-col items-center text-center cursor-pointer transition-all duration-300 focus:outline-none ${
                  selected ? "scale-105" : "hover:-translate-y-1.5"
                }`}
              >
                {/* Circular Golden Ring Container */}
                <div
                  className={`relative size-20 sm:size-22 md:size-24 rounded-full border flex items-center justify-center p-2.5 sm:p-3 transition-all duration-300 ${
                    selected
                      ? "border-amber-500 bg-amber-50/90 ring-4 ring-amber-400/35 shadow-[0_0_24px_rgba(245,158,11,0.35)]"
                      : "border-amber-300/80 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 shadow-xs group-hover:border-amber-400 group-hover:shadow-[0_8px_20px_rgba(245,158,11,0.22)] group-hover:bg-amber-50/60"
                  }`}
                >
                  <Image
                    src={sign.image}
                    alt={sign.name}
                    width={80}
                    height={80}
                    className="size-14 sm:size-16 md:size-17 object-contain transform transition-transform duration-300 group-hover:scale-110 drop-shadow-xs"
                    unoptimized
                  />
                </div>

                {/* Sign Name */}
                <span
                  className={`mt-2.5 sm:mt-3 font-semibold text-xs sm:text-sm tracking-tight transition-colors line-clamp-1 ${
                    selected ? "text-amber-700 font-bold" : "text-stone-900 group-hover:text-amber-600"
                  }`}
                >
                  {sign.name}
                </span>

                {/* Date Range (Exact InstaAstro Screenshot Style) */}
                <span className="text-[10px] sm:text-[11px] text-stone-500 font-medium mt-0.5 whitespace-nowrap">
                  {sign.dates}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Sign Detailed Prediction Card */}
        <div className="mt-10 sm:mt-12 rounded-3xl border border-amber-900/10 bg-gradient-to-br from-amber-50/30 via-white to-stone-50/50 p-6 sm:p-8 shadow-[0_18px_44px_-24px_rgba(0,0,0,0.08)] backdrop-blur-sm">
          {/* Top row: identity + date pill */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="size-16 sm:size-18 rounded-full border border-amber-300/90 bg-amber-50/80 p-2 shadow-sm flex items-center justify-center shrink-0">
                <Image
                  src={activeMeta.image}
                  alt={activeMeta.name}
                  width={64}
                  height={64}
                  className="size-12 sm:size-14 object-contain"
                  unoptimized
                />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1a1208]">{activeMeta.name}</h3>
                  <span className="text-sm font-semibold text-amber-700">
                    {language === "bn" ? activeMeta.bengaliName : activeMeta.sanskrit}
                  </span>
                </div>
                <p className="mt-0.5 text-xs font-medium text-stone-500">{activeMeta.dates}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="rounded-full border border-amber-300/60 bg-amber-50 px-3.5 py-1.5 text-xs font-bold text-amber-900 shadow-2xs">
                {datePill}
              </span>
              <Link
                href={`/daily-horoscope/${activeMeta.id}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 hover:bg-amber-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs transition-transform hover:scale-105"
              >
                <span>Read Full Horoscope</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Body: Summary + Meters */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            {/* Left: Summary, Mood, Lucky Color, Lucky Number */}
            <div className="space-y-5">
              <p className="text-sm sm:text-base font-medium leading-relaxed text-stone-800">
                {loading && !activeSign
                  ? "Calculating planetary transits for your rashi…"
                  : activeSign?.summary ||
                    "Cosmic energies favor productive focus and positive interactions today. Balance ambition with gentle mindfulness."}
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#6b5f4d] pt-2">
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-semibold text-stone-500">Mood:</span>
                  <span className="font-bold text-[#1a1208]">
                    {mood.emoji} {mood.label}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-semibold text-stone-500">Lucky #:</span>
                  <span className="font-bold text-[#1a1208]">{activeSign?.lucky_number ?? "7"}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-semibold text-stone-500">Lucky Color:</span>
                  <span
                    className="inline-block size-4 rounded-full ring-1 ring-black/15 shadow-2xs"
                    style={{ backgroundColor: swatch }}
                    title={activeSign?.lucky_color || undefined}
                  />
                  <span className="font-medium text-stone-700 capitalize">{activeSign?.lucky_color || "Gold"}</span>
                </span>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={`/daily-horoscope/${activeMeta.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-stone-900 hover:bg-stone-800 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.02]"
                >
                  <span>Detailed 12-Month Forecast</span>
                  <ArrowRight className="size-3.5" />
                </Link>
                <Link
                  href="/astrologers"
                  className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white hover:bg-stone-50 px-5 py-2.5 text-xs sm:text-sm font-semibold text-stone-800 shadow-2xs transition-colors"
                >
                  <Sparkles className="size-3.5 text-amber-500" />
                  <span>Talk to an Astrologer</span>
                </Link>
              </div>
            </div>

            {/* Right: Score Meters */}
            <div className="flex flex-col justify-center gap-4 rounded-2xl bg-amber-50/40 border border-amber-900/10 p-5">
              {METERS.map((m) => {
                const score = Math.max(0, Math.min(100, (activeSign?.[m.key] as number) ?? 75));
                return (
                  <div key={m.key}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold uppercase tracking-wider text-stone-600">{m.label}</span>
                      <span className="font-bold text-stone-900">
                        {activeSign ? scoreVerdict(score, m.scale) : "Good"} ({score}%)
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-amber-200/50">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${m.bar} transition-[width] duration-500`}
                        style={{ width: `${score}%` }}
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
