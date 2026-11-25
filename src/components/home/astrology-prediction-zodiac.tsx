"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles } from "lucide-react";
import { astrologyApi } from "@/lib/api";
import { useLanguage } from "@/providers/language-provider";
import type { DailyHoroscopeResult, DailySignHoroscope } from "@/types";
import initialTeaserData from "./initial-horoscope-teaser.json";

const INITIAL_ZODIAC_TEASER = initialTeaserData as unknown as DailyHoroscopeResult;

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
    image: "/images/zodiac/medallions/aries.png",
  },
  {
    id: "taurus",
    index: 1,
    name: "Taurus",
    bengaliName: "বৃষ",
    hindiName: "वृषभ",
    sanskrit: "Vrishabha",
    dates: "Apr 20 - May 20",
    image: "/images/zodiac/medallions/taurus.png",
  },
  {
    id: "gemini",
    index: 2,
    name: "Gemini",
    bengaliName: "মিথুন",
    hindiName: "मिथुन",
    sanskrit: "Mithuna",
    dates: "May 21 - Jun 21",
    image: "/images/zodiac/medallions/gemini.png",
  },
  {
    id: "cancer",
    index: 3,
    name: "Cancer",
    bengaliName: "কর্কট",
    hindiName: "कर्क",
    sanskrit: "Karka",
    dates: "Jun 22 - Jul 22",
    image: "/images/zodiac/medallions/cancer.png",
  },
  {
    id: "leo",
    index: 4,
    name: "Leo",
    bengaliName: "সিংহ",
    hindiName: "सिंह",
    sanskrit: "Simha",
    dates: "Jul 23 - Aug 22",
    image: "/images/zodiac/medallions/leo.png",
  },
  {
    id: "virgo",
    index: 5,
    name: "Virgo",
    bengaliName: "কন্যা",
    hindiName: "कन्या",
    sanskrit: "Kanya",
    dates: "Aug 23 - Sept 22",
    image: "/images/zodiac/medallions/virgo.png",
  },
  {
    id: "libra",
    index: 6,
    name: "Libra",
    bengaliName: "তুলা",
    hindiName: "तुला",
    sanskrit: "Tula",
    dates: "Sept 23 - Oct 23",
    image: "/images/zodiac/medallions/libra.png",
  },
  {
    id: "scorpio",
    index: 7,
    name: "Scorpio",
    bengaliName: "বৃশ্চিক",
    hindiName: "वृश्चिक",
    sanskrit: "Vrishchika",
    dates: "Oct 24 - Nov 22",
    image: "/images/zodiac/medallions/scorpio.png",
  },
  {
    id: "sagittarius",
    index: 8,
    name: "Sagittarius",
    bengaliName: "ধনু",
    hindiName: "धनु",
    sanskrit: "Dhanu",
    dates: "Nov 23 - Dec 21",
    image: "/images/zodiac/medallions/sagittarius.png",
  },
  {
    id: "capricorn",
    index: 9,
    name: "Capricorn",
    bengaliName: "মকর",
    hindiName: "मकर",
    sanskrit: "Makara",
    dates: "Dec 22 - Jan 19",
    image: "/images/zodiac/medallions/capricorn.png",
  },
  {
    id: "aquarius",
    index: 10,
    name: "Aquarius",
    bengaliName: "কুম্ভ",
    hindiName: "कुंभ",
    sanskrit: "Kumbha",
    dates: "Jan 20 - Feb 18",
    image: "/images/zodiac/medallions/aquarius.png",
  },
  {
    id: "pisces",
    index: 11,
    name: "Pisces",
    bengaliName: "মীন",
    hindiName: "मीन",
    sanskrit: "Meena",
    dates: "Feb 19 - Mar 20",
    image: "/images/zodiac/medallions/pisces.png",
  },
];

type RangeTab = "today" | "tomorrow" | "week" | "month";

const RANGE_TABS: { id: RangeTab; label: string; offset: number }[] = [
  { id: "today", label: "Today", offset: 0 },
  { id: "tomorrow", label: "Tomorrow", offset: 1 },
  { id: "week", label: "Week", offset: 7 },
  { id: "month", label: "Month", offset: 30 },
];

const RANGE_TAB_LABELS: Record<string, Record<RangeTab, string>> = {
  bn: { today: "আজ", tomorrow: "আগামীকাল", week: "সাপ্তাহিক", month: "মাসিক" },
  hi: { today: "आज", tomorrow: "कल", week: "साप्ताहिक", month: "मासिक" },
  en: { today: "Today", tomorrow: "Tomorrow", week: "Weekly", month: "Monthly" },
};

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

// Map a 0-100 score to a localized verdict word.
function scoreVerdict(score: number, scale: "strength" | "level", lang: string): string {
  if (lang === "bn") {
    if (score >= 78) return "উত্তম";
    if (score >= 60) return "স্থিতিশীল";
    if (score >= 42) return "মাঝারি";
    return "সতর্ক";
  }
  if (lang === "hi") {
    if (score >= 78) return "उत्तम";
    if (score >= 60) return "अनुकूल";
    if (score >= 42) return "मध्यम";
    return "सतर्क";
  }
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

function moodFromScores(sign?: DailySignHoroscope, lang: string = "en"): { emoji: string; label: string } {
  if (!sign) {
    return {
      emoji: "✨",
      label: lang === "bn" ? "ভারসাম্যপূর্ণ" : lang === "hi" ? "संतुलित" : "Balanced",
    };
  }
  const love = sign.love_score ?? 0;
  const overall = sign.overall_score ?? 0;
  if (love >= 78) {
    return {
      emoji: "😍",
      label: lang === "bn" ? "রোমান্টিক" : lang === "hi" ? "रोमांटिक" : "Romantic",
    };
  }
  if (overall >= 75) {
    return {
      emoji: "😄",
      label: lang === "bn" ? "উচ্ছ্বসিত" : lang === "hi" ? "उत्साही" : "Upbeat",
    };
  }
  if (overall >= 60) {
    return {
      emoji: "🙂",
      label: lang === "bn" ? "আশাবাদী" : lang === "hi" ? "आशावादी" : "Hopeful",
    };
  }
  if (overall >= 45) {
    return {
      emoji: "😌",
      label: lang === "bn" ? "শান্ত" : lang === "hi" ? "शांत" : "Calm",
    };
  }
  return {
    emoji: "🧘",
    label: lang === "bn" ? "ধৈর্যশীল" : lang === "hi" ? "संयमित" : "Reserved",
  };
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

const METER_CONFIG: Record<
  string,
  {
    key: keyof Pick<DailySignHoroscope, "love_score" | "career_score" | "health_score" | "finance_score">;
    label: string;
    scale: "strength" | "level";
    bar: string;
  }[]
> = {
  bn: [
    { key: "love_score", label: "প্রেম ও সম্পর্ক", scale: "strength", bar: "from-rose-400 to-red-500" },
    { key: "career_score", label: "কর্ম ও ব্যবসা", scale: "strength", bar: "from-amber-300 to-orange-400" },
    { key: "health_score", label: "সুস্বাস্থ্য", scale: "level", bar: "from-emerald-300 to-green-500" },
    { key: "finance_score", label: "অর্থ ও লাভ", scale: "level", bar: "from-orange-300 to-amber-500" },
  ],
  hi: [
    { key: "love_score", label: "प्रेम व संबंध", scale: "strength", bar: "from-rose-400 to-red-500" },
    { key: "career_score", label: "करियर व व्यवसाय", scale: "strength", bar: "from-amber-300 to-orange-400" },
    { key: "health_score", label: "स्वास्थ्य", scale: "level", bar: "from-emerald-300 to-green-500" },
    { key: "finance_score", label: "धन व लाभ", scale: "level", bar: "from-orange-300 to-amber-500" },
  ],
  en: [
    { key: "love_score", label: "Love & Romance", scale: "strength", bar: "from-rose-400 to-red-500" },
    { key: "career_score", label: "Career & Business", scale: "strength", bar: "from-amber-300 to-orange-400" },
    { key: "health_score", label: "Health & Vitality", scale: "level", bar: "from-emerald-300 to-green-500" },
    { key: "finance_score", label: "Money & Wealth", scale: "level", bar: "from-orange-300 to-amber-500" },
  ],
};

export function AstrologyPredictionZodiac() {
  const { language } = useLanguage();
  const [tab, setTab] = React.useState<RangeTab>("today");
  const [activeIndex, setActiveIndex] = React.useState<number>(0); // Aries default (or user preference)

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const selectedDate = React.useMemo(() => {
    const t = RANGE_TABS.find((r) => r.id === tab) ?? RANGE_TABS[0];
    return dateFromOffset(t.offset);
  }, [tab]);

  const { data, isLoading: loading } = useQuery({
    queryKey: ["dailyHoroscope", formatDateToYMD(selectedDate), language, tab],
    queryFn: () =>
      astrologyApi.dailyHoroscope({
        date: formatDateToYMD(selectedDate),
        language: language === "bn" || language === "hi" ? language : "en",
        latitude: 22.5726,
        longitude: 88.3639,
        timezone: 5.5,
      }),
    placeholderData: (previousData) =>
      previousData ?? (tab === "today" ? INITIAL_ZODIAC_TEASER : undefined),
    staleTime: 1000 * 60 * 15,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 8000),
  });

  const activeMeta = ZODIAC_SIGNS[activeIndex] || ZODIAC_SIGNS[0];
  const activeSign: DailySignHoroscope | undefined =
    data?.signs?.find((s) => s.sign_index === activeIndex) || data?.signs?.[activeIndex];

  const mood = moodFromScores(activeSign, language);
  const swatch = resolveColor(activeSign?.lucky_color);
  const tabLabels = RANGE_TAB_LABELS[language] || RANGE_TAB_LABELS.en;
  const meters = METER_CONFIG[language] || METER_CONFIG.en;

  const datePill = React.useMemo(() => {
    const label = tabLabels[tab] ?? (language === "bn" ? "আজ" : language === "hi" ? "आज" : "Today");
    const d = selectedDate;
    const locale = language === "bn" ? "bn-IN" : language === "hi" ? "hi-IN" : "en-GB";
    const nice = d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
    return `${label} · ${nice}`;
  }, [tab, selectedDate, language, tabLabels]);

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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1d1a1c]">
              {language === "bn"
                ? "আপনার রাশি বেছে নিন"
                : language === "hi"
                ? "अपनी राशि चुनें"
                : "Choose your Zodiac Sign"}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#5c5156] font-medium max-w-xl">
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
                  {tabLabels[r.id]}
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
                  />
                </div>

                {/* Sign Name */}
                <span
                  className={`mt-2.5 sm:mt-3 font-semibold text-xs sm:text-sm tracking-tight transition-colors line-clamp-1 ${
                    selected ? "text-amber-700 font-bold" : "text-stone-900 group-hover:text-amber-600"
                  }`}
                >
                  {language === "bn" ? sign.bengaliName : language === "hi" ? sign.hindiName : sign.name}
                </span>

                {/* Subtitle / Dates */}
                <span className="text-[10px] sm:text-[11px] text-stone-500 font-medium mt-0.5 whitespace-nowrap">
                  {language === "bn" ? sign.name : sign.dates}
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
                />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1d1a1c]">
                    {language === "bn"
                      ? `${activeMeta.bengaliName} (${activeMeta.name})`
                      : language === "hi"
                      ? `${activeMeta.hindiName} (${activeMeta.sanskrit})`
                      : activeMeta.name}
                  </h3>
                  <span className="text-sm font-semibold text-amber-700">
                    {language === "bn" ? activeMeta.sanskrit : activeMeta.dates}
                  </span>
                </div>
                <p className="mt-0.5 text-xs font-medium text-stone-500">{activeMeta.dates}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                suppressHydrationWarning
                className="rounded-full border border-amber-300/60 bg-amber-50 px-3.5 py-1.5 text-xs font-bold text-amber-900 shadow-2xs"
              >
                {mounted ? datePill : tabLabels[tab]}
              </span>
              <Link
                href={`/daily-horoscope/${activeMeta.id}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 hover:bg-amber-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs transition-transform hover:scale-105"
              >
                <span>
                  {language === "bn"
                    ? "সম্পূর্ণ রাশিফল পড়ুন"
                    : language === "hi"
                    ? "पूरा राशिफल पढ़ें"
                    : "Read Full Horoscope"}
                </span>
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
                  ? language === "bn"
                    ? "গ্রহের গোচর ও শুভ ফলাফল গণনা করা হচ্ছে…"
                    : language === "hi"
                    ? "ग्रह गोचर एवं शुभ परिणाम की गणना हो रही है…"
                    : "Calculating planetary transits for your rashi…"
                  : activeSign?.summary ||
                    (language === "bn"
                      ? "আজ চন্দ্রের শুভ গোচরে কর্ম ও অর্থ ভাগ্য সুদৃঢ় হবে। আত্মবিশ্বাস রাখুন ও সংকল্পবদ্ধ হয়ে কাজ করুন।"
                      : language === "hi"
                      ? "आज चंद्रमा के शुभ गोचर से कार्य एवं आर्थिक स्थिति मजबूत रहेगी। सकारात्मक सोच बनाए रखें।"
                      : "Cosmic energies favor productive focus and positive interactions today. Balance ambition with gentle mindfulness.")}
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#5c5156] pt-2">
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-semibold text-stone-500">
                    {language === "bn" ? "মনোভাব:" : language === "hi" ? "मनोदशा:" : "Mood:"}
                  </span>
                  <span className="font-bold text-[#1d1a1c]">
                    {mood.emoji} {mood.label}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-semibold text-stone-500">
                    {language === "bn" ? "শুভ সংখ্যা:" : language === "hi" ? "शुभ अंक:" : "Lucky #:"}
                  </span>
                  <span className="font-bold text-[#1d1a1c]">{activeSign?.lucky_number ?? "7"}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-semibold text-stone-500">
                    {language === "bn" ? "শুভ রং:" : language === "hi" ? "शुभ रंग:" : "Lucky Color:"}
                  </span>
                  <span
                    className="inline-block size-4 rounded-full ring-1 ring-black/15 shadow-2xs"
                    style={{ backgroundColor: swatch }}
                    title={activeSign?.lucky_color || undefined}
                  />
                  <span className="font-medium text-stone-700 capitalize">
                    {activeSign?.lucky_color || (language === "bn" ? "সোনালী" : "Gold")}
                  </span>
                </span>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={`/daily-horoscope/${activeMeta.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-stone-900 hover:bg-stone-800 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.02]"
                >
                  <span>
                    {language === "bn"
                      ? "১২ মাসের বিস্তারিত ভাগ্যফল"
                      : language === "hi"
                      ? "12 महीने का विस्तृत फलादेश"
                      : "Detailed 12-Month Forecast"}
                  </span>
                  <ArrowRight className="size-3.5" />
                </Link>
                <Link
                  href="/astrologers"
                  className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white hover:bg-stone-50 px-5 py-2.5 text-xs sm:text-sm font-semibold text-stone-800 shadow-2xs transition-colors"
                >
                  <Sparkles className="size-3.5 text-amber-500" />
                  <span>
                    {language === "bn"
                      ? "জ্যোতিষীর সাথে কথা বলুন"
                      : language === "hi"
                      ? "ज्योतिषी से बात करें"
                      : "Talk to an Astrologer"}
                  </span>
                </Link>
              </div>
            </div>

            {/* Right: Score Meters */}
            <div className="flex flex-col justify-center gap-4 rounded-2xl bg-amber-50/40 border border-amber-900/10 p-5">
              {meters.map((m) => {
                const score = Math.max(
                  0,
                  Math.min(100, (activeSign?.[m.key] as number) ?? (activeSign?.overall_score ?? 78))
                );
                return (
                  <div key={m.key}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold uppercase tracking-wider text-stone-600">{m.label}</span>
                      <span className="font-bold text-stone-900">
                        {activeSign ? scoreVerdict(score, m.scale, language) : (language === "bn" ? "উত্তম" : language === "hi" ? "उत्तम" : "Good")} ({score}%)
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
