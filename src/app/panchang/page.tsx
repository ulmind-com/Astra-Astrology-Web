"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  Clock,
  Compass,
  Sparkles,
  Sun,
  Moon,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Video,
  Info,
} from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LoadingBlock } from "@/components/ui";
import { astrologyApi } from "@/lib/api";
import { INITIAL_DAILY_HOROSCOPE } from "@/components/home/astrology-prediction-zodiac";
import initialTabHoroscopes from "@/components/home/initial-horoscopes-tabs.json";
import { useLanguage } from "@/providers/language-provider";
import {
  SuryaChandraHorizonArc,
  TithiMoonClipart,
  NakshatraStarClipart,
  YogaUnionClipart,
  KaranaKalashClipart,
  VaraSunClipart,
  VedicCompassClipart,
} from "@/components/astro/panchang-cliparts";
import { CelestialZodiacHalo } from "@/components/astro/celestial-zodiac-halo";
import { cn } from "@/lib/utils";
import type { HoraItem, ChoghadiyaItem } from "@/types";

function formatDateToYMD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function PanchangPage() {
  const { language } = useLanguage();
  const lang = (["en", "bn", "hi"].includes(language) ? language : "en") as
    | "en"
    | "bn"
    | "hi";

  const isBn = lang === "bn";
  const isHi = lang === "hi";

  const todayStr = React.useMemo(() => formatDateToYMD(new Date()), []);
  const yesterdayStr = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return formatDateToYMD(d);
  }, []);
  const tomorrowStr = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return formatDateToYMD(d);
  }, []);

  const [selectedDate, setSelectedDate] = React.useState<string>(todayStr);
  const [activeTab, setActiveTab] = React.useState<"limbs" | "horas" | "choghadiya">("limbs");
  const [horaPeriod, setHoraPeriod] = React.useState<"day" | "night">("day");
  const [choghadiyaPeriod, setChoghadiyaPeriod] = React.useState<"day" | "night">("day");

  const tabDataMap = initialTabHoroscopes as unknown as Record<string, typeof INITIAL_DAILY_HOROSCOPE>;
  const dateInitialData = tabDataMap[selectedDate] ?? (selectedDate === todayStr ? INITIAL_DAILY_HOROSCOPE : undefined);

  // Real-time backend API query with pre-hydrated Swiss Ephemeris data for instant switching
  const { data: horoscopeData, isLoading, error } = useQuery({
    queryKey: ["panchang", "daily", lang, selectedDate],
    queryFn: () =>
      astrologyApi.dailyHoroscope({
        language: lang,
        date: selectedDate,
        latitude: 22.5726,
        longitude: 88.3639,
        timezone: 5.5,
      }),
    initialData: dateInitialData,
    placeholderData: (previousData) => previousData ?? dateInitialData ?? INITIAL_DAILY_HOROSCOPE,
    staleTime: 1000 * 60 * 15,
  });

  const panchang = horoscopeData?.panchang;
  const horas: HoraItem[] = panchang?.horas ?? [];
  const choghadiya: ChoghadiyaItem[] = panchang?.choghadiya ?? [];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col font-sans">
      <SiteHeader />

      <main className="relative flex-1 w-full pb-28 overflow-hidden">
        {/* Cosmic Ambient Aura */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-amber-200/40 via-orange-100/25 to-transparent blur-3xl opacity-80" />
          <div className="absolute top-16 -right-24 w-96 h-96 opacity-10">
            <CelestialZodiacHalo size={384} speedSeconds={90} />
          </div>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold text-amber-950/80">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-amber-700 transition-colors flex items-center gap-1.5">
                <Compass className="size-3.5 text-amber-600" />
                <span>Astra Home</span>
              </Link>
              <span className="text-amber-900/30">/</span>
              <span className="text-slate-900 font-bold">
                {isBn ? "দৈনিক বৈদিক পঞ্জিকা ও পঞ্চাঙ্গ" : "Vedic Daily Panchang"}
              </span>
            </div>

            <Link
              href="/festivals"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 rounded-xl transition-all"
            >
              <CalendarDays className="size-3.5 text-amber-600" />
              <span>{isBn ? "উৎসব ও ব্রতের পঞ্জিকা দেখুন →" : "View Vedic Festival Calendar →"}</span>
            </Link>
          </div>

          {/* Luxury Vedic Cosmic Hero Banner */}
          <section className="relative overflow-hidden rounded-3xl border border-amber-900/15 bg-gradient-to-br from-[#1A1224] via-[#0D0A17] to-[#08060E] p-6 sm:p-10 text-white shadow-[0_20px_50px_rgba(20,10,35,0.4)]">
            {/* Background Watermark */}
            <div className="pointer-events-none absolute -right-16 -bottom-16 w-80 h-80 opacity-15">
              <Image
                src="/images/panchang/zodiac-wheel-gold.png"
                alt="Zodiac Wheel"
                width={320}
                height={320}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="relative max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/15 border border-amber-400/30 px-3.5 py-1 text-xs font-bold text-amber-300 shadow-2xs">
                <Sparkles className="size-3.5 text-amber-400" />
                <span>
                  {isBn
                    ? "সুইস এফিমেরিস দ্বারা নিখুঁত জ্যোতিষীয় কাল-গণনা"
                    : isHi
                    ? "स्विस एफिमेरिस द्वारा प्रामाणिक पंचांग गणना"
                    : "Swiss Ephemeris Vedic Precision Engine"}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#FFF8E7] leading-tight">
                {isBn
                  ? "পঞ্চাঙ্গ ও কাল-নির্ণয়"
                  : isHi
                  ? "पंचांग व काल निर्णय"
                  : "Five Limbs of Cosmic Time"}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {isBn
                  ? "তিথি, নক্ষত্র, যোগ, করণ ও বারের সমন্বয়ে নির্ণিত আজকের সম্পূর্ণ শুভাশুভ সময়সূচী ও মহাজাগতিক দিনচক্র।"
                  : isHi
                  ? "तिथि, नक्षत्र, योग, करण व वार का वैदिक समन्वय एवं दैनिक मुहूर्त विचार।"
                  : "Authentic astronomical coordination of Tithi, Nakshatra, Yoga, Karana & Vara."}
              </p>

              {/* Real-time Sun & Moon Sign Pills */}
              {horoscopeData ? (
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-amber-400/20 px-3 py-1 text-xs text-amber-200">
                    <Sun className="size-3.5 text-amber-400" />
                    <span>
                      {isBn ? "সূর্য: " : "Sun: "}
                      <strong className="text-amber-100 font-bold">{horoscopeData.sun_sign}</strong>
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-sky-400/20 px-3 py-1 text-xs text-sky-200">
                    <Moon className="size-3.5 text-sky-400" />
                    <span>
                      {isBn ? "চন্দ্র: " : "Moon: "}
                      <strong className="text-sky-100 font-bold">
                        {horoscopeData.moon_sign} ({horoscopeData.moon_degree})
                      </strong>
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-emerald-400/20 px-3 py-1 text-xs text-emerald-200">
                    <Clock className="size-3.5 text-emerald-400" />
                    <span>
                      {isBn ? "বারাধিপতি: " : "Lord: "}
                      <strong className="text-emerald-100 font-bold">{horoscopeData.vara_lord}</strong>
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          {/* Quick Date Selector Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-amber-900/15 bg-white/95 p-3.5 sm:p-4 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-2">
              {[
                { id: yesterdayStr, label: isBn ? "গতকাল" : isHi ? "कल (बीता)" : "Yesterday" },
                { id: todayStr, label: isBn ? "আজ" : isHi ? "आज" : "Today" },
                { id: tomorrowStr, label: isBn ? "আগামীকাল" : isHi ? "कल (आने वाला)" : "Tomorrow" },
              ].map((d) => {
                const active = selectedDate === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDate(d.id)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                      active
                        ? "bg-gradient-to-r from-[#D97706] to-[#EA580C] text-white border-[#B45309] shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-300"
                    )}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>

            {/* Custom Date Picker */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-500">
                {isBn ? "নির্দিষ্ট তারিখ:" : "Custom Date:"}
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) setSelectedDate(e.target.value);
                }}
                className="rounded-xl border border-amber-900/15 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {isLoading && !panchang ? (
            <div className="py-24 text-center rounded-3xl border border-slate-200 bg-white shadow-sm">
              <LoadingBlock label={isBn ? "সুইস এফিমেরিস বৈদিক পঞ্চাঙ্গ গণনা করা হচ্ছে…" : "Calculating Swiss Ephemeris Vedic Panchang…"} />
            </div>
          ) : (error && !panchang) || !panchang ? (
            <div className="rounded-3xl border border-dashed border-rose-300 bg-rose-50/50 p-10 text-center space-y-3">
              <AlertTriangle className="size-10 text-rose-500 mx-auto" />
              <h3 className="font-bold text-rose-950">
                {isBn ? "পঞ্চাঙ্গ লোড করা সম্ভব হয়নি" : "Unable to load Panchang"}
              </h3>
              <p className="text-xs text-rose-800 max-w-md mx-auto">
                {isBn
                  ? "সার্ভার সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর পুনরায় চেষ্টা করুন।"
                  : "Please check your network connection and try again."}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* 1. Surya-Chandra Horizon Arc Clipart Card */}
              <div className="relative overflow-hidden rounded-3xl border border-amber-900/15 bg-white/95 backdrop-blur-md p-6 sm:p-8 shadow-[0_12px_36px_rgba(180,83,9,0.06)] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                      <Sun className="size-4" />
                    </span>
                    <h2 className="font-display font-bold text-lg text-slate-900">
                      {isBn ? "মহাজাগতিক দিনচক্র ও লগ্ন কাল" : "Solar Horizon & Celestial Track"}
                    </h2>
                  </div>
                  <span className="rounded-full bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1">
                    {horoscopeData.date} ({horoscopeData.day_of_week})
                  </span>
                </div>

                {/* Dynamic Celestial Arc Clipart */}
                <div className="py-2">
                  <SuryaChandraHorizonArc
                    sunrise={panchang.sunrise}
                    sunset={panchang.sunset}
                    abhijit={panchang.abhijit_muhurat}
                    rahuKaal={panchang.rahu_kaal}
                    isBn={isBn}
                  />
                </div>

                {/* Quick Muhurat Highlights Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Abhijit Muhurat Card */}
                  <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 p-5 space-y-2 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                        <Sparkles className="size-4" />
                      </span>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-900">
                        {isBn ? "অভিজিৎ মুহূর্ত (অতি শুভ)" : "Abhijit Muhurat (Auspicious)"}
                      </h3>
                    </div>
                    <p className="font-display text-xl font-black text-emerald-950 tabular-nums">
                      {panchang.abhijit_muhurat || "11:38 AM – 12:24 PM"}
                    </p>
                    <p className="text-xs text-emerald-800">
                      {isBn
                        ? "সর্ববিধ শুভকার্য আরম্ভের মহেন্দ্রক্ষণ ও বিজয় মুহূর্ত।"
                        : "Peak victory window for new ventures, business & spiritual milestones."}
                    </p>
                  </div>

                  {/* Rahu Kaal Card */}
                  <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-50/80 via-white to-rose-50/40 p-5 space-y-2 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                        <Clock className="size-4" />
                      </span>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-rose-900">
                        {isBn ? "রাহু কাল (বর্জনীয়)" : "Rahu Kaal (Avoid)"}
                      </h3>
                    </div>
                    <p className="font-display text-xl font-black text-rose-950 tabular-nums">
                      {panchang.rahu_kaal || "01:30 PM – 03:00 PM"}
                    </p>
                    <p className="text-xs text-rose-800">
                      {isBn
                        ? "যাত্রা ও আর্থিক চুক্তি সম্পাদন নিষিদ্ধ ও অশুভ।"
                        : "Avoid major financial decisions, signed contracts, or beginning journeys."}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Tab Switcher: 5 Limbs / 24 Horas / Choghadiya */}
              <div className="flex items-center gap-2 rounded-2xl border border-amber-900/15 bg-white/95 p-1.5 shadow-2xs">
                {(
                  [
                    {
                      id: "limbs",
                      label: isBn ? "৫টি বৈদিক অঙ্গ (পঞ্জিকা)" : isHi ? "५ अंग (पंचांग)" : "5 Vedic Limbs",
                      icon: Sparkles,
                    },
                    {
                      id: "horas",
                      label: isBn ? "২৪ হোরা চক্র" : isHi ? "२४ होरा चक्र" : "24 Planetary Horas",
                      icon: Clock,
                    },
                    {
                      id: "choghadiya",
                      label: isBn ? "চোঘড়িয়া মুহূর্ত" : isHi ? "चौघड़िया मुहूर्त" : "Choghadiya Muhurat",
                      icon: Compass,
                    },
                  ] as const
                ).map((tab) => {
                  const active = activeTab === tab.id;
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer",
                        active
                          ? "bg-gradient-to-r from-[#D97706] to-[#EA580C] text-white shadow-xs"
                          : "text-slate-700 hover:bg-amber-50"
                      )}
                    >
                      <IconComponent className="size-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: 5 VEDIC LIMBS WITH RICH CLIPARTS */}
              {activeTab === "limbs" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 1. Tithi Card */}
                    <div className="rounded-3xl border border-amber-900/15 bg-white/95 p-5 sm:p-6 shadow-sm flex items-start gap-4">
                      <TithiMoonClipart size={64} />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                            {isBn ? "১. তিথি · চান্দ্র দিন" : "1. TITHI · LUNAR PHASE"}
                          </span>
                          <span className="rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] px-2.5 py-0.5">
                            {panchang.paksha}
                          </span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-slate-900">
                          {panchang.tithi}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {isBn
                            ? `${panchang.paksha} তিথির অধিপতি দেবশক্তির আশীর্বাদে শুভ কর্ম সাধিত হয়।`
                            : `Governed by the lunar cycle in ${panchang.paksha}; auspicious for spiritual focus.`}
                        </p>
                      </div>
                    </div>

                    {/* 2. Nakshatra Card */}
                    <div className="rounded-3xl border border-amber-900/15 bg-white/95 p-5 sm:p-6 shadow-sm flex items-start gap-4">
                      <NakshatraStarClipart size={64} />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                            {isBn ? "২. নক্ষত্র · চন্দ্র নিবাস" : "2. NAKSHATRA · LUNAR MANSION"}
                          </span>
                          <span className="rounded-full bg-amber-500/15 text-amber-950 font-bold text-[10px] px-2.5 py-0.5 border border-amber-500/25">
                            {isBn ? `পদ ${panchang.nakshatra_pada}` : `Pada ${panchang.nakshatra_pada}`}
                          </span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-slate-900">
                          {panchang.nakshatra}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {isBn
                            ? "২৭ নক্ষত্রের মধ্যে আজকের নক্ষত্র মানসিক স্থৈর্য ও কর্মশক্তি নিয়ন্ত্রণ করে।"
                            : "Governs subconscious vibration, travel, and personal intuition."}
                        </p>
                      </div>
                    </div>

                    {/* 3. Yoga Card */}
                    <div className="rounded-3xl border border-amber-900/15 bg-white/95 p-5 sm:p-6 shadow-sm flex items-start gap-4">
                      <YogaUnionClipart size={64} />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                            {isBn ? "৩. যোগ · রবি-চন্দ্রের মিলন" : "3. YOGA · SOLAR-LUNAR UNION"}
                          </span>
                          <span className="rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] px-2 py-0.5">
                            {isBn ? "২৭ মহা যোগ" : "27 Vedic Yogas"}
                          </span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-slate-900">
                          {panchang.yoga}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {isBn
                            ? "সূর্য ও চন্দ্রের দ্রাঘিমাংশের যোগফল থেকে উৎপন্ন শুভাশুভ ফলপ্রসূ যোগ।"
                            : "Geometric solar-lunar degree sum determining daily cosmic vitality."}
                        </p>
                      </div>
                    </div>

                    {/* 4. Karana Card */}
                    <div className="rounded-3xl border border-amber-900/15 bg-white/95 p-5 sm:p-6 shadow-sm flex items-start gap-4">
                      <KaranaKalashClipart size={64} />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                            {isBn ? "৪. করণ · তিথির অর্ধাংশ" : "4. KARANA · HALF TITHI"}
                          </span>
                          <span className="rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] px-2 py-0.5">
                            {isBn ? "১১ করণ চক্র" : "11 Karana Cycle"}
                          </span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-slate-900">
                          {panchang.karana}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {isBn
                            ? "তিথির অর্ধেক কাল; তাৎক্ষণিক কার্যসিদ্ধি ও কর্ম উদ্যোগের ফলাফল নির্দেশক।"
                            : "Half-span of the tithi; dictates immediate executive actions."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 5. Vara Card (Full Width) */}
                  <div className="rounded-3xl border border-amber-900/15 bg-white/95 p-5 sm:p-6 shadow-sm flex items-start gap-4">
                    <VaraSunClipart size={64} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                          {isBn ? "৫. বার · বারাধিপতি গ্রহ" : "5. VARA · PLANETARY RULER"}
                        </span>
                        <span className="rounded-full bg-amber-500/15 text-amber-950 font-bold text-[10px] px-2.5 py-0.5 border border-amber-500/25">
                          {horoscopeData.vara_lord}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-slate-900">
                        {panchang.vara}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {isBn
                          ? `আজকের দিনের প্রধান নিয়ন্ত্রক গ্রহ ${horoscopeData.vara_lord}। তাঁর প্রভাব আজকের সামগ্রিক শক্তিতে বিদ্যমান।`
                          : `The principal presiding graha for today is ${horoscopeData.vara_lord}.`}
                      </p>
                    </div>
                  </div>

                  {/* Disha Shoola With Vedic Compass */}
                  {panchang.disha_shoola && (
                    <div className="rounded-3xl border border-rose-200 bg-gradient-to-r from-rose-50/70 via-white to-amber-50/40 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                      <VedicCompassClipart size={100} blockedDirection={panchang.disha_shoola} isBn={isBn} />
                      <div className="space-y-2 text-center sm:text-left flex-1">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold px-3 py-1">
                          <Compass className="size-3.5" />
                          <span>{isBn ? "দিশা শূল সতর্কতা" : "Disha Shoola Alert"}</span>
                        </div>
                        <h4 className="font-display font-bold text-lg text-slate-900">
                          {isBn ? "আজকের বর্জনীয় দিক: " : "Restricted Travel Direction: "}
                          <span className="text-rose-600 font-black">{panchang.disha_shoola}</span>
                        </h4>
                        {panchang.disha_remedy && (
                          <div className="rounded-2xl bg-white/90 border border-amber-200 p-3.5 text-xs text-amber-950 space-y-1">
                            <span className="font-bold text-amber-900 block">
                              {isBn ? "বৈদিক প্রতিবিধান / প্রতিকার:" : "Vedic Remedy Before Travel:"}
                            </span>
                            <p className="text-slate-600 leading-relaxed">{panchang.disha_remedy}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ================= VEDIC PANCHAK STATUS CARD ================= */}
                  {panchang.panchak && (
                    <div
                      className={`rounded-3xl border p-6 sm:p-7 shadow-sm space-y-3.5 transition-all ${
                        panchang.panchak.is_panchak
                          ? "border-rose-300 bg-gradient-to-r from-rose-50/90 via-white to-red-50/40"
                          : "border-emerald-300 bg-gradient-to-r from-emerald-50/90 via-white to-teal-50/40"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${
                            panchang.panchak.is_panchak
                              ? "bg-rose-100 text-rose-600 ring-2 ring-rose-200"
                              : "bg-emerald-100 text-emerald-600 ring-2 ring-emerald-200"
                          }`}
                        >
                          {panchang.panchak.is_panchak ? (
                            <ShieldAlert className="size-6 text-rose-600" />
                          ) : (
                            <CheckCircle2 className="size-6 text-emerald-600" />
                          )}
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                  panchang.panchak.is_panchak
                                    ? "bg-rose-200/80 text-rose-900 border border-rose-300"
                                    : "bg-emerald-200/80 text-emerald-900 border border-emerald-300"
                                }`}
                              >
                                {isBn ? "পঞ্চক বিচার" : isHi ? "पंचक विचार" : "Panchak Status"}
                              </span>
                              {panchang.panchak.severity && (
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 capitalize">
                                  {panchang.panchak.severity} severity
                                </span>
                              )}
                            </div>
                          </div>

                          <h4
                            className={`font-display text-lg font-bold ${
                              panchang.panchak.is_panchak ? "text-rose-900" : "text-emerald-900"
                            }`}
                          >
                            {panchang.panchak.is_panchak
                              ? isBn
                                ? `পঞ্চক দোষ সচল: ${panchang.panchak.panchak_type_bn || panchang.panchak.panchak_type}`
                                : isHi
                                ? `सक्रिय पंचक: ${panchang.panchak.panchak_type_hi || panchang.panchak.panchak_type}`
                                : `Active Panchak: ${panchang.panchak.panchak_type}`
                              : isBn
                              ? "আজ কোনো পঞ্চক দোষ নেই (সম্পূর্ণ শুভ)"
                              : isHi
                              ? "आज कोई पंचक दोष नहीं है (शुभ)"
                              : "No Panchak Inauspiciousness Today"}
                          </h4>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {panchang.panchak.is_panchak
                              ? isBn
                                ? panchang.panchak.description_bn || "ধনিষ্ঠা থেকে রেবতী নক্ষত্র পর্যন্ত এই সময় সতর্ক থাকুন।"
                                : isHi
                                ? panchang.panchak.description_hi || panchang.panchak.description
                                : panchang.panchak.description || "Special Vedic caution required during this 5-nakshatra alignment."
                              : isBn
                              ? "সকল প্রকার গৃহনির্মাণ, যাত্রা ও পারিবারিক কর্মের জন্য সময় অনুকূল।"
                              : isHi
                              ? "सभी प्रकार के गृह निर्माण, यात्रा व पारिवारिक कार्यों के लिए अनुकूल समय है।"
                              : "All standard auspicious domestic, travel and ceremonial rites are permitted."}
                          </p>
                        </div>
                      </div>

                      {panchang.panchak.is_panchak && panchang.panchak.prohibited_activities && panchang.panchak.prohibited_activities.length > 0 && (
                        <div className="pt-2 border-t border-rose-200/80 space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                            <AlertTriangle className="size-3.5 text-rose-600" />
                            <span>{isBn ? "বর্জনীয় ৫টি বিশেষ কর্ম:" : isHi ? "वर्जित कार्य:" : "Prohibited Activities:"}</span>
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {panchang.panchak.prohibited_activities.map((act, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-900 shadow-2xs"
                              >
                                <AlertTriangle className="size-3 text-rose-500" />
                                <span>{act}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Favorable Chandra Rashis */}
                  {panchang.favorable_chandra_rashis && panchang.favorable_chandra_rashis.length > 0 && (
                    <div className="rounded-3xl border border-amber-900/15 bg-white/95 p-6 shadow-sm space-y-3">
                      <h4 className="font-display text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="size-4 text-amber-600" />
                        <span>{isBn ? "আজকের অনুকূল চন্দ্র রাশি" : "Favorable Moon Signs Today"}</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        {isBn
                          ? "গোচর গণনা অনুযায়ী আজকের দিনে নিম্নলিখিত রাশিসমূহের জন্য চন্দ্রবল শুভ ও ফলদায়ী:"
                          : "Moon transit is exceptionally favorable and fortunate today for the following rashis:"}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {panchang.favorable_chandra_rashis.map((rashi, idx) => (
                          <span
                            key={idx}
                            className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-bold text-amber-950 shadow-2xs"
                          >
                            ✨ {rashi}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: 24 PLANETARY HORAS */}
              {activeTab === "horas" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div>
                      <h3 className="font-display font-bold text-lg text-slate-900">
                        {isBn ? "২৪ বৈদিক হোরা চক্র" : "24 Planetary Horas Timeline"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {isBn
                          ? "প্রতিটি হোরা এক ঘণ্টা স্থায়ী এবং নির্দিষ্ট গ্রহাধিপতির প্রভাবে বিশেষ কাজের জন্য শুভ।"
                          : "Each 1-hour planetary hora is ruled by a celestial graha favoring specific activities."}
                      </p>
                    </div>

                    {/* Day / Night Toggle */}
                    <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setHoraPeriod("day")}
                        className={cn(
                          "px-3 py-1.5 rounded-lg transition-all cursor-pointer",
                          horaPeriod === "day"
                            ? "bg-amber-500 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        )}
                      >
                        ☀️ {isBn ? "দিবা হোরা" : "Day"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setHoraPeriod("night")}
                        className={cn(
                          "px-3 py-1.5 rounded-lg transition-all cursor-pointer",
                          horaPeriod === "night"
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        )}
                      >
                        🌙 {isBn ? "রাত্রি হোরা" : "Night"}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {horas
                      .filter((h) => (horaPeriod === "day" ? h.is_day : !h.is_day))
                      .map((hora) => (
                        <div
                          key={hora.hora_index}
                          className={cn(
                            "rounded-2xl border p-4 transition-all text-xs space-y-2",
                            hora.is_auspicious
                              ? "bg-white border-emerald-300 hover:border-emerald-500 shadow-2xs"
                              : "bg-white border-amber-200 hover:border-amber-400 shadow-2xs"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] font-bold text-slate-500">
                              #{hora.hora_number}
                            </span>
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-bold",
                                hora.is_auspicious
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              )}
                            >
                              {hora.is_auspicious ? (isBn ? "শুভ" : "Auspicious") : (isBn ? "সাধারণ" : "Neutral")}
                            </span>
                          </div>

                          <div className="space-y-0.5">
                            <p className="font-bold text-sm text-slate-900">
                              {isBn ? hora.planet_bn : isHi ? hora.planet_hi : hora.planet}
                              <span className="text-[11px] font-normal text-slate-500 ml-1">
                                ({hora.planet_sa || hora.planet})
                              </span>
                            </p>
                            <p className="text-[11px] font-mono text-slate-500">
                              {hora.start_time} – {hora.end_time}
                            </p>
                          </div>

                          {hora.best_activities && (
                            <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-100 leading-relaxed">
                              {isBn
                                ? hora.best_activities_bn || hora.best_activities
                                : isHi
                                ? hora.best_activities_hi || hora.best_activities
                                : hora.best_activities}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CHOGHADIYA MUHURAT */}
              {activeTab === "choghadiya" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div>
                      <h3 className="font-display font-bold text-lg text-slate-900">
                        {isBn ? "১৬ বৈদিক চোঘড়িয়া মুহূর্ত" : "16 Vedic Choghadiya Muhurat"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {isBn
                          ? "অমৃত, শুভ, লাভ, চর, রোগ, কাল ও উদ্বেগ — তাৎক্ষণিক শুভ কাজ শুরুর বৈদিক নির্দেশিকা।"
                          : "Amrit, Shubh, Labh, Char, Rog, Kaal & Udveg windows for immediate venture timing."}
                      </p>
                    </div>

                    {/* Day / Night Toggle */}
                    <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setChoghadiyaPeriod("day")}
                        className={cn(
                          "px-3 py-1.5 rounded-lg transition-all cursor-pointer",
                          choghadiyaPeriod === "day"
                            ? "bg-amber-500 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        )}
                      >
                        ☀️ {isBn ? "দিবা চোঘড়িয়া" : "Day"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setChoghadiyaPeriod("night")}
                        className={cn(
                          "px-3 py-1.5 rounded-lg transition-all cursor-pointer",
                          choghadiyaPeriod === "night"
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        )}
                      >
                        🌙 {isBn ? "রাত্রি চোঘড়িয়া" : "Night"}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {choghadiya
                      .filter((c) => (choghadiyaPeriod === "day" ? c.is_day : !c.is_day))
                      .map((chog) => {
                        const nameLower = (chog.name || "").toLowerCase();
                        const isGood =
                          nameLower.includes("amrit") ||
                          nameLower.includes("shubh") ||
                          nameLower.includes("labh");
                        const isNeutral = nameLower.includes("char");

                        return (
                          <div
                            key={chog.period_index}
                            className={cn(
                              "rounded-2xl border p-4 transition-all text-xs space-y-2 shadow-2xs",
                              isGood
                                ? "bg-white border-emerald-300 hover:border-emerald-500"
                                : isNeutral
                                ? "bg-white border-sky-300 hover:border-sky-500"
                                : "bg-white border-rose-300 hover:border-rose-500"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm text-slate-900">
                                {isBn ? chog.name_bn || chog.name : isHi ? chog.name_hi || chog.name : chog.name}
                              </span>
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-[10px] font-bold",
                                  isGood
                                    ? "bg-emerald-100 text-emerald-800"
                                    : isNeutral
                                    ? "bg-sky-100 text-sky-800"
                                    : "bg-rose-100 text-rose-800"
                                )}
                              >
                                {chog.status || (isGood ? (isBn ? "শুভ" : "Auspicious") : isNeutral ? (isBn ? "চর" : "Neutral") : (isBn ? "বর্জনীয়" : "Caution"))}
                              </span>
                            </div>

                            <p className="font-mono text-[11px] text-slate-500 font-bold">
                              {chog.start_time} – {chog.end_time}
                            </p>

                            {chog.guidance && (
                              <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-100 leading-relaxed">
                                {chog.guidance}
                              </p>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Consultation & Booking CTA */}
              <div className="rounded-3xl border border-amber-300 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
                <div className="space-y-1.5 max-w-xl">
                  <h3 className="font-display font-bold text-xl text-amber-950">
                    {isBn ? "শুভ মুহূর্ত বা ব্যক্তিগত পরামর্শ প্রয়োজন?" : "Need Personalized Muhurat Consultation?"}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-900/80 leading-relaxed">
                    {isBn
                      ? "বিবাহ, গৃহপ্রবেশ, নামকরণ বা নতুন ব্যবসার শুভ মুহূর্ত নির্ধারণে আমাদের যাচাইকৃত বৈদিক জ্যোতিষীদের সাথে সরাসরি ১-অন-১ ভিডিও পরামর্শ বুক করুন।"
                      : "Consult our certified Vedic astrologers for customized wedding dates, Griha Pravesh, business launches, or personalized birth chart analysis."}
                  </p>
                </div>

                <Link
                  href="/appointments"
                  className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#D97706] to-[#EA580C] hover:from-[#B45309] hover:to-[#C2410C] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <Video className="size-4" />
                  <span>{isBn ? "ভিডিও অ্যাপয়েন্টমেন্ট বুক করুন" : "Book Video Consultation"}</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
