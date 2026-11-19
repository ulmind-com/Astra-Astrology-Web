"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  Clock,
  Compass,
  PartyPopper,
  Search,
  Sparkles,
  Sun,
  Flame,
  Star,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Video,
  X,
} from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { astrologyApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";
import {
  VEDIC_FESTIVALS_BY_YEAR,
  type StaticFestivalItem,
} from "@/constants/festivalsData";
import {
  AkshayaTritiyaGoldKalashClipart,
  ChhathPujaSuryaArghyaClipart,
  DiwaliLakshmiDiyaClipart,
  DurgaPujaTrishulClipart,
  GuruPurnimaPadukaClipart,
  HanumanGadaSanjeevaniClipart,
  HoliColorsPitchkariClipart,
  KrishnaFluteFeatherClipart,
  NavratriGhatSthapanaClipart,
  PohelaBoishakhHaalkhataClipart,
  RakshaBandhanSacredThreadClipart,
  RathYatraChariotWheelClipart,
  SankrantiSunKiteClipart,
  SaraswatiVeenaBookClipart,
  ShivaratriTrishulDamruClipart,
} from "@/components/astro/festival-cliparts";
import type { FestivalItemData } from "@/types";

type FestivalCategory = "all" | "major" | "vrat" | "jayanti";

const FESTIVAL_CLIPART_MAP: Record<string, React.ComponentType<{ size?: number; color?: string; secondaryColor?: string; className?: string }>> = {
  "makar-sankranti": SankrantiSunKiteClipart,
  "vasant-panchami": SaraswatiVeenaBookClipart,
  "saraswati-puja": SaraswatiVeenaBookClipart,
  "maha-shivaratri": ShivaratriTrishulDamruClipart,
  "holi": HoliColorsPitchkariClipart,
  "holi-dol-yatra": HoliColorsPitchkariClipart,
  "chaitra-navratri": NavratriGhatSthapanaClipart,
  "chaitra-navratri-ram-navami": NavratriGhatSthapanaClipart,
  "shardiya-navratri": NavratriGhatSthapanaClipart,
  "ram-navami": KrishnaFluteFeatherClipart,
  "hanuman-jayanti": HanumanGadaSanjeevaniClipart,
  "pohela-boishakh": PohelaBoishakhHaalkhataClipart,
  "akshaya-tritiya": AkshayaTritiyaGoldKalashClipart,
  "jagannath-rath-yatra": RathYatraChariotWheelClipart,
  "rath-yatra": RathYatraChariotWheelClipart,
  "guru-purnima": GuruPurnimaPadukaClipart,
  "raksha-bandhan": RakshaBandhanSacredThreadClipart,
  "krishna-janmashtami": KrishnaFluteFeatherClipart,
  "ganesh-chaturthi": PohelaBoishakhHaalkhataClipart,
  "durga-puja": DurgaPujaTrishulClipart,
  "dussehra-vijayadashami": DurgaPujaTrishulClipart,
  "karwa-chauth": ShivaratriTrishulDamruClipart,
  "dhanteras": AkshayaTritiyaGoldKalashClipart,
  "diwali": DiwaliLakshmiDiyaClipart,
  "kali-puja": DiwaliLakshmiDiyaClipart,
  "bhai-dooj": RakshaBandhanSacredThreadClipart,
  "chhath-puja": ChhathPujaSuryaArghyaClipart,
  "devutthana-ekadashi": AkshayaTritiyaGoldKalashClipart,
  "gita-jayanti": KrishnaFluteFeatherClipart,
};

const AVAILABLE_YEARS = [2025, 2026, 2027, 2028, 2029] as const;

export default function FestivalsPage() {
  const { language } = useLanguage();
  const lang = (["en", "bn", "hi"].includes(language) ? language : "en") as
    | "en"
    | "bn"
    | "hi";

  const isBn = lang === "bn";
  const isHi = lang === "hi";

  const [selectedYear, setSelectedYear] = React.useState<number>(2026);
  const [category, setCategory] = React.useState<FestivalCategory>("all");
  const [search, setSearch] = React.useState<string>("");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const todayIso = React.useMemo(() => new Date().toISOString().split("T")[0], []);

  // Real-time backend query for selected year
  const { data: calendarData, isLoading } = useQuery({
    queryKey: ["festivals", "calendar", selectedYear, category],
    queryFn: () => astrologyApi.festivals(selectedYear, category),
    staleTime: 1000 * 60 * 60 * 24,
  });

  // Real-time upcoming festivals query relative to current date
  const { data: upcomingData } = useQuery({
    queryKey: ["festivals", "upcoming"],
    queryFn: () => astrologyApi.upcomingFestivals(15),
    staleTime: 1000 * 60 * 60 * 6,
  });

  // Active festivals list dynamically populated with Swiss Ephemeris data
  const activeFestivals = React.useMemo(() => {
    if (
      calendarData?.festivals &&
      calendarData.festivals.length > 0 &&
      calendarData.year === selectedYear
    ) {
      return calendarData.festivals.map((f: FestivalItemData) => ({
        id: f.id,
        name: f.name,
        dateStr: f.date,
        date: f.date_formatted,
        dayOfWeek: f.day_of_week,
        tithi: f.tithi,
        category: f.category,
        badge: f.badge,
        accentColor: f.accent_color,
        clipart: FESTIVAL_CLIPART_MAP[f.id] || SankrantiSunKiteClipart,
        muhurat: f.muhurat,
        shloka: f.shloka,
        desc: f.desc,
        rituals: f.rituals,
      }));
    }

    // Instant fallback from VEDIC_FESTIVALS_BY_YEAR
    const staticList =
      VEDIC_FESTIVALS_BY_YEAR[selectedYear] ||
      VEDIC_FESTIVALS_BY_YEAR[2026] ||
      [];

    return staticList.map((f: StaticFestivalItem) => ({
      id: f.id,
      name: f.name,
      dateStr: f.dateStr,
      date: f.date,
      dayOfWeek: f.dayOfWeek,
      tithi: f.tithi,
      category: f.category,
      badge: f.badge,
      accentColor: f.accentColor,
      clipart: FESTIVAL_CLIPART_MAP[f.id] || SankrantiSunKiteClipart,
      muhurat: f.muhurat,
      shloka: f.shloka,
      desc: f.desc,
      rituals: f.rituals,
    }));
  }, [calendarData, selectedYear]);

  // Filtered list by category & search
  const filteredFestivals = React.useMemo(() => {
    let list = activeFestivals;

    if (category !== "all") {
      list = list.filter((f) => f.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((f) => {
        const nameEn = (f.name.en || "").toLowerCase();
        const nameBn = (f.name.bn || "").toLowerCase();
        const nameHi = (f.name.hi || "").toLowerCase();
        const tithiStr = (f.tithi[lang] || f.tithi.en || "").toLowerCase();
        return (
          nameEn.includes(q) ||
          nameBn.includes(q) ||
          nameHi.includes(q) ||
          tithiStr.includes(q)
        );
      });
    }

    return list;
  }, [activeFestivals, category, search, lang]);

  // Next Upcoming Festival Spotlight
  const nextUpcoming = React.useMemo(() => {
    // Check upcoming data from backend first
    if (upcomingData && upcomingData.length > 0) {
      const first = upcomingData[0];
      return {
        id: first.id,
        name: first.name,
        dateStr: first.date,
        date: first.date_formatted,
        dayOfWeek: first.day_of_week,
        tithi: first.tithi,
        category: first.category,
        badge: first.badge,
        accentColor: first.accent_color,
        clipart: FESTIVAL_CLIPART_MAP[first.id] || SankrantiSunKiteClipart,
        muhurat: first.muhurat,
        shloka: first.shloka,
        desc: first.desc,
        rituals: first.rituals,
        daysRemaining: first.days_remaining,
      };
    }

    // Find next festival from active list relative to todayIso
    const allKnown = Object.values(VEDIC_FESTIVALS_BY_YEAR).flat();
    const sorted = [...allKnown].sort((a, b) => a.dateStr.localeCompare(b.dateStr));
    const future = sorted.filter((f) => f.dateStr >= todayIso);
    const target = future[0] || sorted[0];
    if (!target) return null;

    const targetDate = new Date(target.dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = targetDate.getTime() - today.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    return {
      ...target,
      clipart: FESTIVAL_CLIPART_MAP[target.id] || SankrantiSunKiteClipart,
      daysRemaining,
    };
  }, [upcomingData, todayIso]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col font-sans">
      <SiteHeader />

      <main className="relative flex-1 w-full pb-28 overflow-hidden">
        {/* Cosmic Ambient Auras */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-amber-200/40 via-orange-100/25 to-transparent blur-3xl opacity-80" />
          <div className="absolute top-20 -right-20 w-96 h-96 opacity-[0.03] animate-celestial-spin">
            <Image
              src="/images/panchang/zodiac-wheel-gold.webp"
              alt="Zodiac Yantra"
              width={384}
              height={384}
              className="w-full h-full object-contain"
            />
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
                {isBn ? "বৈদিক উৎসব ও ব্রত পঞ্জিকা" : "Vedic Festival Calendar"}
              </span>
            </div>

            <Link
              href="/panchang"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 rounded-xl transition-all"
            >
              <Sun className="size-3.5 text-amber-600" />
              <span>{isBn ? "দৈনিক পঞ্চাঙ্গ ও হোরা দেখুন →" : "View Daily Panchang & Horas →"}</span>
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
                <PartyPopper className="size-3.5 text-amber-400" />
                <span>
                  {isBn
                    ? "সুইস এফিমেরিস দ্বারা ২০২৫-২০২৯ নিখুঁত পঞ্জিকা"
                    : isHi
                    ? "स्विस एफिमेरिस द्वारा २०२५-२०२९ प्रामाणिक पंचांग"
                    : "Swiss Ephemeris Vedic Almanac (2025 – 2029)"}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#FFF8E7] leading-tight">
                {isBn
                  ? `সনাতন বৈদিক উৎসব পঞ্জিকা · ${selectedYear}`
                  : isHi
                  ? `सनातन वैदिक उत्सव पंचांग · ${selectedYear}`
                  : `Vedic Festivals & Vrats · ${selectedYear}`}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {isBn
                  ? "সূর্য ও চন্দ্রের গতিবিধি এবং নিখুঁত তিথি সমন্বয়ে গণনাকৃত হিন্দু সনাতন উৎসব, ব্রত, পার্বণ ও জন্মজয়ন্তী।"
                  : isHi
                  ? "सूर्य-चंद्र गोचर एवं प्रामाणिक तिथि गणना अनुसार प्रमुख हिन्दू त्योहार, व्रत, पर्व एवं जयंती।"
                  : "Authentic Vedic festivals, fasting days (vrats), sacred muhurats, and divine appearance days."}
              </p>
            </div>
          </section>

          {/* Dynamic Year Switcher Ribbon (2025 - 2029) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-amber-900/15 bg-white/95 p-3.5 sm:p-4 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-xs font-bold text-slate-500 mr-1 shrink-0 flex items-center gap-1.5">
                <CalendarDays className="size-4 text-amber-600" />
                <span>{isBn ? "বছর নির্বাচন করুন:" : "Select Year:"}</span>
              </span>

              {AVAILABLE_YEARS.map((yr) => {
                const active = selectedYear === yr;
                return (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setSelectedYear(yr)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all border cursor-pointer shrink-0",
                      active
                        ? "bg-gradient-to-r from-[#D97706] to-[#EA580C] text-white border-[#B45309] shadow-md scale-105"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-300"
                    )}
                  >
                    {yr}
                  </button>
                );
              })}
            </div>

            <span className="text-xs font-semibold text-amber-900/70">
              {filteredFestivals.length} {isBn ? "টি উৎসব ও ব্রত তালিকাভুক্ত" : "Festivals Listed"}
            </span>
          </div>

          {/* Spotlight / Next Upcoming Festival Banner */}
          {nextUpcoming && (
            <div className="relative overflow-hidden rounded-3xl border border-amber-400 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="size-16 sm:size-20 rounded-2xl bg-white p-2 shadow-md border border-amber-300 flex items-center justify-center shrink-0">
                    <nextUpcoming.clipart size={64} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-600 text-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-2xs">
                        <Flame className="size-3 fill-yellow-200 text-yellow-200" />
                        <span>{isBn ? "পরবর্তী আসন্ন মহোৎসব" : "Next Upcoming Festival"}</span>
                      </span>

                      {nextUpcoming.daysRemaining !== undefined && (
                        <span className="rounded-full bg-white/90 border border-amber-300 px-2.5 py-0.5 text-[11px] font-bold text-amber-950">
                          {nextUpcoming.daysRemaining === 0
                            ? isBn ? "🎉 আজ অনুষ্ঠিত হচ্ছে!" : "🎉 Happening Today!"
                            : nextUpcoming.daysRemaining === 1
                            ? isBn ? "কাল অনুষ্ঠিত হবে" : "Tomorrow"
                            : isBn ? `আর ${nextUpcoming.daysRemaining} দিন বাকি` : `In ${nextUpcoming.daysRemaining} days`}
                        </span>
                      )}
                    </div>

                    <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900">
                      {nextUpcoming.name[lang] || nextUpcoming.name.en}
                    </h2>

                    <p className="text-xs font-semibold text-amber-900">
                      {nextUpcoming.date[lang] || nextUpcoming.date.en} (
                      {nextUpcoming.dayOfWeek[lang] || nextUpcoming.dayOfWeek.en}) •{" "}
                      <span className="font-bold">{nextUpcoming.tithi[lang] || nextUpcoming.tithi.en}</span>
                    </p>
                  </div>
                </div>

                <Link
                  href="/appointments"
                  className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
                >
                  <Video className="size-3.5" />
                  <span>{isBn ? "পূজা ও মুহূর্তের পরামর্শ বুক করুন" : "Consult Astrologer for Muhurat"}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>

              {nextUpcoming.muhurat?.[lang] && (
                <div className="rounded-2xl bg-white/85 border border-amber-200/80 p-3.5 text-xs text-amber-950 flex items-center gap-2">
                  <Clock className="size-4 text-amber-600 shrink-0" />
                  <span>
                    <strong className="text-amber-900">{isBn ? "শুভ পূজা মুহূর্ত:" : "Auspicious Muhurat:"}</strong>{" "}
                    {nextUpcoming.muhurat[lang]}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Search & Category Filter Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={
                    isBn
                      ? "উৎসবের নাম বা তিথি দিয়ে খুঁজুন (যেমন: সরস্বতী, শিবরাত্রি, দীপাবলি)..."
                      : "Search festival by name or tithi (e.g. Diwali, Holi, Navratri)..."
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {(
                [
                  { id: "all", label: isBn ? "সকল উৎসব" : isHi ? "सभी पर्व" : "All Festivals" },
                  { id: "major", label: isBn ? "প্রধান উৎসব" : isHi ? "प्रमुख पर्व" : "Major Celebrations" },
                  { id: "vrat", label: isBn ? "ব্রত ও উপবাস" : isHi ? "व्रत व उपवास" : "Vrats & Fasting" },
                  { id: "jayanti", label: isBn ? "জয়ন্তী ও আবির্ভাব" : isHi ? "जयंती व प्राकट्य" : "Jayanti & Avirbhav" },
                ] as const
              ).map((cat) => {
                const active = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      "rounded-xl px-4 py-2 text-xs font-bold transition-all border shrink-0 cursor-pointer",
                      active
                        ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-amber-50"
                    )}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Festival Cards Grid */}
          <div className="space-y-4">
            {isLoading && activeFestivals.length === 0 ? (
              <div className="py-24 text-center rounded-3xl border border-slate-200 bg-white shadow-sm">
                <p className="text-sm font-bold text-slate-500">
                  {isBn ? "পঞ্জিকা লোড হচ্ছে…" : "Loading festival almanac…"}
                </p>
              </div>
            ) : filteredFestivals.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-amber-900/15 bg-white p-12 text-center space-y-4 shadow-sm">
                <div className="size-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                  <PartyPopper className="size-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-lg font-bold text-slate-900">
                    {isBn ? "কোন উৎসব পাওয়া যায়নি" : "No festivals found"}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {isBn
                      ? "অন্য কোনো নাম বা ফিল্টার নির্বাচন করে দেখুন।"
                      : "Try clearing your search query or switching categories."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCategory("all");
                    setSearch("");
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white shadow-xs cursor-pointer"
                >
                  {isBn ? "ফিল্টার রিসেট করুন" : "Reset Filter"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFestivals.map((f) => {
                  const ClipartComponent = f.clipart;
                  const isExpanded = expandedId === f.id;

                  return (
                    <div
                      key={f.id}
                      className="group overflow-hidden rounded-3xl border border-amber-900/15 bg-white/95 backdrop-blur-md shadow-xs hover:shadow-md hover:border-amber-400 transition-all duration-300"
                    >
                      {/* Main Clickable Header Row */}
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : f.id)}
                        className="w-full p-5 sm:p-6 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Distinct Vedic Clipart with ambient glow */}
                          <div className="size-16 sm:size-20 rounded-2xl bg-gradient-to-br from-[#FFFBF2] to-[#FAF3E0] border border-amber-200/80 p-2 shadow-2xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                            <ClipartComponent size={56} />
                          </div>

                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5">
                                {f.badge[lang] || f.badge.en}
                              </span>
                              <span className="text-xs text-slate-500 font-medium">
                                {f.dayOfWeek[lang] || f.dayOfWeek.en}
                              </span>
                            </div>

                            <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 truncate">
                              {f.name[lang] || f.name.en}
                            </h3>

                            <p className="text-xs text-amber-900 font-semibold truncate">
                              {f.date[lang] || f.date.en} •{" "}
                              <span className="font-medium text-slate-600">
                                {f.tithi[lang] || f.tithi.en}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Right side Muhurat pill and expand button */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          {f.muhurat?.[lang] && (
                            <span className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-1 text-[11px] font-bold text-amber-950 flex items-center gap-1.5 shadow-2xs">
                              <Clock className="size-3 text-amber-600" />
                              <span className="truncate max-w-[150px]">{f.muhurat[lang]}</span>
                            </span>
                          )}

                          <span className="flex size-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-900 transition-colors">
                            {isExpanded ? (
                              <ChevronUp className="size-4" />
                            ) : (
                              <ChevronDown className="size-4" />
                            )}
                          </span>
                        </div>
                      </button>

                      {/* Expandable Details Section */}
                      {isExpanded && (
                        <div className="border-t border-amber-900/10 bg-gradient-to-b from-[#FFFDF9] to-[#FAF6EE]/50 p-5 sm:p-7 space-y-5 animate-in slide-in-from-top-2 duration-200">
                          {/* Sacred Shloka in Golden Parchment Card */}
                          {f.shloka && (
                            <div className="relative rounded-2xl border border-amber-300/80 bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7]/60 to-[#FFFBEB] p-4 text-center shadow-2xs">
                              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 block mb-1">
                                ॐ {isBn ? "পবিত্র বৈদিক শ্লোক ও স্তোত্র" : "Sacred Vedic Shloka"} ॐ
                              </span>
                              <p className="font-serif text-sm sm:text-base font-semibold text-amber-950 leading-relaxed italic">
                                &ldquo;{f.shloka}&rdquo;
                              </p>
                            </div>
                          )}

                          {/* Significance & Description */}
                          <div className="space-y-1.5">
                            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                              <BookOpen className="size-3.5 text-amber-600" />
                              <span>{isBn ? "উৎসবের শাস্ত্রীয় মহিমা ও বিবরণ" : "Spiritual Significance"}</span>
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                              {f.desc[lang] || f.desc.en}
                            </p>
                          </div>

                          {/* Rituals / Puja Vidhi Checklist */}
                          {f.rituals?.[lang] && f.rituals[lang].length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-amber-900/10">
                              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                                <Sparkles className="size-3.5 text-amber-600" />
                                <span>{isBn ? "পূজা বিধি ও ভক্তিমূলক আচার" : "Sacred Rituals & Puja Vidhi"}</span>
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {f.rituals[lang].map((ritual: string, rIdx: number) => (
                                  <div
                                    key={rIdx}
                                    className="rounded-xl bg-white/90 border border-slate-200/90 p-2.5 text-xs text-slate-700 flex items-start gap-2 shadow-2xs"
                                  >
                                    <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>{ritual}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Consult Astrologer CTA for this Festival */}
                          <div className="pt-3 border-t border-amber-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <span className="text-xs font-semibold text-slate-600">
                              {isBn
                                ? "এই তিথিতে বিশেষ পূজা, ব্রত বা সংকল্পের জন্য বৈদিক পরামর্শ নিন:"
                                : "Book consultation for customized ritual muhurat and planetary remedies:"}
                            </span>

                            <Link
                              href="/appointments"
                              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-xs transition-all w-fit"
                            >
                              <Video className="size-3.5" />
                              <span>{isBn ? "জ্যোতিষীর পরামর্শ বুক করুন" : "Consult Astrologer"}</span>
                              <ArrowRight className="size-3.5" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
