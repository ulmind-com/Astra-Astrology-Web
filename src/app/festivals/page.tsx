"use client";

import * as React from "react";
import Link from "next/link";
import {
  PartyPopper,
  CalendarDays,
  Sparkles,
  ArrowRight,
  Flame,
  Sun,
  Moon,
  Search,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { useLanguage } from "@/providers/language-provider";
import {
  astrologyApi,
  type WebFestivalCalendarResponse,
  type WebFestivalItem,
} from "@/lib/api";
import { FestivalClipart } from "@/components/festivals/festival-cliparts";
import { VEDIC_FESTIVALS_BY_YEAR } from "@/lib/festivals-data";

const T = {
  en: {
    badge: "Vedic Festivals & Vrat",
    title: "Hindu Festivals & Vrat Calendar 2026",
    subtitle:
      "A complete guide to sacred Vedic festivals, auspicious vrats, and lunar celebrations throughout 2026 with precise tithis and significance.",
    searchPlaceholder: "Search festival (e.g. Diwali, Shivaratri, Holi)...",
    filterAll: "All Festivals",
    filterMajor: "Major Festivals",
    filterVrat: "Fasting & Vrat",
    filterJayanti: "Jayanti & Days",
    vratRulesTitle: "Vedic Significance of Vrats & Fasts",
    vratRulesDesc:
      "In Vedic astrology and Sanatana Dharma, fasts (Vrats) are not merely dietary restrictions. They are sacred alignments designed to cleanse the physical body, purify the mind, and harmonize individual consciousness with planetary and lunar vibrations on peak energetic tithis like Ekadashi, Purnima, and Amavasya.",
    livePanchangTitle: "Live Daily Tithi & Panchang Available",
    livePanchangSub:
      "Track every upcoming Ekadashi, Purnima, Sankranti, and Amavasya in real-time with our Swiss Ephemeris-backed Daily Horoscope & Panchang engine.",
    livePanchangCta: "Check Today's Tithi in Daily Horoscope",
    consultTitle: "Planning a Special Puja or Havan?",
    consultSub:
      "Our verified Vedic pandits and astrologers provide authentic guidance on festival rituals, auspicious sankalp timings, and personalized dosha shanti.",
    consultCta: "Consult a Vedic Astrologer",
  },
  bn: {
    badge: "বৈদিক উৎসব ও ব্রত",
    title: "হিন্দু উৎসব ও ব্রত পঞ্জিকা ২০২৬",
    subtitle:
      "২০২৬ সালের প্রধান হিন্দু উৎসব, পবিত্র উপবাস ও ব্রত তিথির সম্পূর্ণ সহায়িকা—নির্ভুল তিথি, তারিখ ও আধ্যাত্মিক তাৎপর্য সহ।",
    searchPlaceholder: "উৎসব খুঁজুন (যেমন: দুর্গাপূজা, দীপাবলি, শিবরাত্রি)...",
    filterAll: "সকল উৎসব",
    filterMajor: "প্রধান উৎসব",
    filterVrat: "ব্রত ও উপবাস",
    filterJayanti: "জয়ন্তী ও বিশেষ দিন",
    vratRulesTitle: "ব্রত ও উপবাসের বৈদিক তাৎপর্য",
    vratRulesDesc:
      "বৈদিক শাস্ত্র ও সনাতন ধর্মে ব্রত কেবলমাত্র উপবাস নয়; এটি দেহ, মন ও আত্মাকে পবিত্র করার এক গভীর তপস্যা। একাদশী, পূর্ণিমা ও অমাবস্যার মতো বিশেষ তিথিতে গ্রহ ও চন্দ্রের শক্তির সাথে সুরসংগতি বজায় রেখে আধ্যাত্মিক উন্নতি ও শারীরিক আরোগ্য লাভ হয়।",
    livePanchangTitle: "লাইভ দৈনিক তিথি ও পঞ্জিকা উপলব্ধ",
    livePanchangSub:
      "প্রতিটি একাদশী, পূর্ণিমা, অমাবস্যা ও সংক্রান্তির নির্ভুল তিথি মুহূর্ত রিয়েল-টাইমে দেখতে আমাদের দৈনিক রাশিফল ও পঞ্চাঙ্গ ব্যবহার করুন।",
    livePanchangCta: "আজকের তিথি রাশিফলে দেখুন",
    consultTitle: "বিশেষ পূজা বা যজ্ঞের পরিকল্পনা করছেন?",
    consultSub:
      "উৎসবের শাস্ত্রীয় নিয়ম, শুভ সংকল্প মুহূর্ত এবং গৃহশান্তির জন্য আমাদের সার্টিফাইড বৈদিক জ্যোতিষী ও পণ্ডিতদের সাথে সরাসরি পরামর্শ করুন।",
    consultCta: "বৈদিক জ্যোতিষীর সাথে কথা বলুন",
  },
  hi: {
    badge: "वैदिक त्योहार एवं व्रत",
    title: "हिन्दू त्योहार एवं व्रत कैलेंडर 2026",
    subtitle:
      "वर्ष 2026 के सभी प्रमुख हिन्दू पर्व, पावन व्रत और तिथियों की प्रामाणिक मार्गदर्शिका—सटीक तिथि, मुहूर्त और आध्यात्मिक महत्व के साथ।",
    searchPlaceholder: "त्योहार खोजें (उदा: दीवाली, होली, शिवरात्रि)...",
    filterAll: "सभी त्योहार",
    filterMajor: "प्रमुख पर्व",
    filterVrat: "व्रत एवं उपवास",
    filterJayanti: "जयंती व विशेष दिवस",
    vratRulesTitle: "व्रत एवं उपवास का वैदिक महत्व",
    vratRulesDesc:
      "वैदिक परंपरा और सनातन धर्म में व्रत केवल अन्न त्याग नहीं, अपितु शरीर और मन की शुद्धि की वैज्ञानिक साधना है। एकादशी, पूर्णिमा और अमावस्या जैसी ऊर्जावान तिथियों पर उपवास करने से ग्रहों के प्रतिकूल प्रभाव शांत होते हैं और आत्मिक शांति प्राप्त होती है।",
    livePanchangTitle: "लाइव दैनिक तिथि व पंचांग उपलब्ध",
    livePanchangSub:
      "आगामी एकादशी, पूर्णिमा, संक्रांति और प्रदोष व्रत की सटीक तिथि स्विस एफेमेरिस आधारित हमारे दैनिक राशिफल एवं पंचांग में देखें।",
    livePanchangCta: "आज की तिथि दैनिक राशिफल में देखें",
    consultTitle: "त्योहार पर विशेष पूजा या अनुष्ठान?",
    consultSub:
      "शास्त्रोक्त विधि-विधान, शुभ संकल्प मुहूर्त और विशेष पूजन हेतु हमारे प्रमाणित वैदिक विद्वानों एवं ज्योतिषियों से परामर्श लें।",
    consultCta: "वैदिक ज्योतिषी से बात करें",
  },
};

function resolveNextFestival(
  upcomingData: WebFestivalItem[],
  calendarData: WebFestivalCalendarResponse | null,
  selectedYear: number,
  todayIso: string,
  nowMs: number,
) {
  if (upcomingData && upcomingData.length > 0) return upcomingData[0];
  if (calendarData?.next_upcoming) return calendarData.next_upcoming;
  for (const yr of [selectedYear, selectedYear + 1]) {
    const list = VEDIC_FESTIVALS_BY_YEAR[yr] || [];
    const upcoming = list.filter((f) => f.dateStr >= todayIso);
    if (upcoming.length > 0) {
      const u = upcoming[0];
      const daysDiff = (new Date(u.dateStr).getTime() - nowMs) / (1000 * 60 * 60 * 24);
      return {
        id: u.id,
        name: u.name,
        date: u.dateStr,
        date_formatted: u.date,
        day_of_week: u.dayOfWeek,
        tithi: u.tithi,
        category: u.category,
        badge: u.badge,
        accent_color: u.accentColor,
        muhurat: u.muhurat,
        shloka: u.shloka,
        desc: u.desc,
        rituals: u.rituals,
        days_remaining: daysDiff,
        is_today: u.dateStr === todayIso,
        is_upcoming: true,
        is_past: false,
      };
    }
  }
  return null;
}

export default function FestivalsPage() {
  const { language } = useLanguage();
  const lang = (["en", "bn", "hi"].includes(language) ? language : "en") as
    | "en"
    | "bn"
    | "hi";
  const t = T[lang];

  const [selectedYear, setSelectedYear] = React.useState<number>(2026);
  const [search, setSearch] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState<"all" | "major" | "vrat" | "jayanti">("all");
  const [calendarData, setCalendarData] = React.useState<WebFestivalCalendarResponse | null>(null);
  const [upcomingData, setUpcomingData] = React.useState<WebFestivalItem[]>([]);
  const [todayIso] = React.useState<string>(() => new Date().toISOString().split("T")[0]);
  const [nowMs] = React.useState<number>(() => Date.now());

  React.useEffect(() => {
    let active = true;
    Promise.all([
      astrologyApi.festivals(selectedYear),
      astrologyApi.upcomingFestivals(10),
    ])
      .then(([cal, up]) => {
        if (!active) return;
        setCalendarData(cal);
        setUpcomingData(up);
      })
      .catch((err) => {
        console.warn("Failed fetching dynamic festivals:", err);
      });
    return () => {
      active = false;
    };
  }, [selectedYear]);

  // Dynamic next upcoming festival relative to today
  const nextFestival = React.useMemo(
    () => resolveNextFestival(upcomingData, calendarData, selectedYear, todayIso, nowMs),
    [upcomingData, calendarData, selectedYear, todayIso, nowMs]
  );

  // Festivals list from backend with instant year-aware fallback
  const activeList = React.useMemo(() => {
    if (calendarData?.festivals && calendarData.festivals.length > 0 && calendarData.year === selectedYear) {
      return calendarData.festivals.map((f) => ({
        id: f.id,
        name: f.name,
        date: f.date_formatted,
        tithi: f.tithi,
        category: f.category,
        desc: f.desc,
        gradient: "from-[#ffb347] to-[#ff8a00]",
        glow: "rgba(255,138,0,0.3)",
        badge: f.badge,
        days_remaining: f.days_remaining,
        is_today: f.is_today,
        is_upcoming: f.days_remaining >= 0,
        muhurat: f.muhurat,
        shloka: f.shloka,
      }));
    }
    // Instant authentic fallback tailored specifically to selectedYear (never stuck on 2026!)
    const yearList = VEDIC_FESTIVALS_BY_YEAR[selectedYear] ?? VEDIC_FESTIVALS_BY_YEAR[2026] ?? [];
    return yearList.map((f) => {
      const daysDiff = (new Date(f.dateStr).getTime() - nowMs) / (1000 * 60 * 60 * 24);
      return {
        id: f.id,
        name: f.name,
        date: f.date,
        tithi: f.tithi,
        category: f.category,
        desc: f.desc,
        gradient: "from-[#ffb347] to-[#ff8a00]",
        glow: "rgba(255,138,0,0.3)",
        badge: f.badge,
        days_remaining: daysDiff,
        is_today: f.dateStr === todayIso,
        is_upcoming: f.dateStr >= todayIso,
        muhurat: f.muhurat,
        shloka: f.shloka,
      };
    });
  }, [calendarData, selectedYear, todayIso, nowMs]);

  const filtered = React.useMemo(() => {
    return activeList.filter((f) => {
      if (activeFilter !== "all" && f.category !== activeFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const n = (f.name[lang] || f.name.en).toLowerCase();
      const d = (f.desc[lang] || f.desc.en).toLowerCase();
      const dt = (f.date[lang] || f.date.en).toLowerCase();
      return n.includes(q) || d.includes(q) || dt.includes(q);
    });
  }, [activeList, search, activeFilter, lang]);

  return (
    <div className="min-h-screen bg-surface-muted/30 text-foreground flex flex-col font-sans pb-24">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex-1 w-full space-y-10">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-100/90 text-pink-950 border border-pink-300 font-bold px-4 py-1.5 text-xs shadow-2xs">
            <PartyPopper className="size-3.5 text-pink-600" />
            <span>{t.badge}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1a1208]">
            {lang === "bn"
              ? `হিন্দু উৎসব ও ব্রত পঞ্জিকা ${selectedYear}`
              : lang === "hi"
              ? `हिन्दू त्योहार एवं व्रत कैलेंडर ${selectedYear}`
              : `Vedic Festival & Vrat Calendar ${selectedYear}`}
          </h1>

          <p className="text-sm sm:text-base text-[#6b5f4d] max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>

          {/* Dynamic Year Switcher */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {[2025, 2026, 2027, 2028].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(yr)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 ${
                  selectedYear === yr
                    ? "bg-amber-600 text-white shadow-sm ring-2 ring-amber-400"
                    : "bg-white text-[#766545] border border-[#ece0ac] hover:bg-amber-50"
                }`}
              >
                <CalendarDays className="size-3 text-amber-400" />
                <span>{yr}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Real-time Upcoming Festival Spotlight */}
        {nextFestival && (
          <div className="rounded-[24px] border-2 border-amber-400/80 bg-gradient-to-r from-amber-50 via-[#fffbeb] to-amber-100/60 p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 font-bold px-3 py-1 text-xs">
                <Sparkles className="size-3 text-amber-600" />
                <span>
                  {nextFestival.days_remaining === 0
                    ? (lang === "bn" ? "আজকের মহোৎসব" : "TODAY'S FESTIVAL")
                    : nextFestival.days_remaining === 1
                    ? (lang === "bn" ? "আগামীকাল" : "TOMORROW")
                    : nextFestival.days_remaining > 0
                    ? (lang === "bn" ? `আর মাত্র ${Math.round(nextFestival.days_remaining)} দিন বাকি` : `IN ${Math.round(nextFestival.days_remaining)} DAYS`)
                    : (lang === "bn" ? "আসন্ন মহোৎসব" : "UPCOMING FESTIVAL")}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1a1208]">
                {nextFestival.name[lang] || nextFestival.name.en}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-amber-800 flex items-center justify-center sm:justify-start gap-1.5">
                <CalendarDays className="size-3.5 text-amber-600" />
                <span>{nextFestival.date_formatted?.[lang] || nextFestival.date_formatted?.en || nextFestival.date}</span>
                <span className="text-amber-400">·</span>
                <Moon className="size-3.5 text-amber-600" />
                <span>{nextFestival.tithi?.[lang] || nextFestival.tithi?.en}</span>
              </p>
            </div>
            <div className="text-right shrink-0">
              <Link
                href="/daily-horoscope"
                className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-amber-700 hover:shadow-md"
              >
                <span>{lang === "bn" ? "লাইভ পঞ্চাঙ্গ দেখুন" : "View Live Panchang"}</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8b6a1a]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full rounded-full border border-[#ece0ac] bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#1a1208] placeholder:text-[#998a72] focus:border-amber-400 focus:outline-hidden shadow-2xs"
            />
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: t.filterAll },
              { id: "major", label: t.filterMajor },
              { id: "vrat", label: t.filterVrat },
              { id: "jayanti", label: t.filterJayanti },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as "all" | "major" | "vrat" | "jayanti")}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                  activeFilter === tab.id
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-white text-[#766545] border border-[#ece0ac] hover:bg-[#fff9e6]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Festival Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((fest, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-[22px] border border-[#ece0ac] bg-gradient-to-b from-white to-[#fffdf3] p-5 sm:p-6 shadow-[0_6px_22px_-12px_rgba(26,18,8,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400 hover:shadow-[0_16px_36px_-12px_rgba(240,200,50,0.45)] flex flex-col justify-between"
            >
              {/* Corner ambient glow */}
              <div
                className="pointer-events-none absolute -top-10 -right-10 size-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                style={{ backgroundColor: fest.glow }}
              />

              <div>
                {/* Header: Clipart + Date, Countdown & Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="relative flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fffdf5] to-[#fef3c7] p-2 ring-1 ring-[#ebd881] shadow-xs group-hover:scale-105 transition-transform">
                    <FestivalClipart id={fest.name.en} className="size-full" />
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-1.5">
                      {fest.days_remaining === 0 ? (
                        <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full border border-red-200">
                          {lang === "bn" ? "আজ" : "Today"}
                        </span>
                      ) : fest.days_remaining > 0 ? (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                          {lang === "bn" ? `আর ${Math.round(fest.days_remaining)} দিন` : `In ${Math.round(fest.days_remaining)}d`}
                        </span>
                      ) : null}
                      <span className="text-[11px] font-bold text-[#8b5e0a] bg-[#fff6d8] px-2.5 py-0.5 rounded-full border border-amber-300/50 shadow-2xs">
                        {fest.badge[lang] || fest.badge.en}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50/90 border border-amber-200/80 px-2.5 py-1 rounded-full">
                      <CalendarDays className="size-3 text-amber-600" />
                      <span>{fest.date[lang] || fest.date.en}</span>
                    </div>
                  </div>
                </div>

                {/* Festival Name */}
                <h3 className="text-lg font-black tracking-tight text-[#1a1208] mb-1 group-hover:text-amber-800 transition-colors">
                  {fest.name[lang] || fest.name.en}
                </h3>

                {/* Tithi subtitle */}
                <p className="text-[11.5px] font-semibold text-amber-900/70 mb-3 flex items-center gap-1">
                  <Moon className="size-3 text-amber-600" />
                  <span>{fest.tithi[lang] || fest.tithi.en}</span>
                </p>

                {/* Description */}
                <p className="text-xs text-[#6b5f4d] leading-relaxed mb-4">
                  {fest.desc[lang] || fest.desc.en}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-[#f2e9b0]/80 flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-[#8b6a1a]">
                  {lang === "bn" ? `${selectedYear} পঞ্জিকা তিথি` : lang === "hi" ? `${selectedYear} पंचांग तिथि` : `${selectedYear} Vedic Calendar`}
                </span>
                <Link
                  href="/daily-horoscope"
                  className="inline-flex items-center gap-1 font-bold text-amber-700 hover:text-amber-900 transition-colors"
                >
                  <span>{lang === "bn" ? "তিথি দেখুন" : lang === "hi" ? "तिथि देखें" : "View Tithi"}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 rounded-[24px] border border-[#ece0ac] bg-white">
            <p className="text-sm font-semibold text-[#766545]">
              {lang === "bn"
                ? "কোন উৎসব খুঁজে পাওয়া যায়নি।"
                : lang === "hi"
                ? "कोई त्योहार नहीं मिला।"
                : "No festivals matched your search."}
            </p>
          </div>
        )}

        {/* Vrat & Fasting Vedic Significance */}
        <section className="rounded-[24px] border border-[#ece0ac] bg-gradient-to-b from-white to-[#fffdf3] p-6 sm:p-8 shadow-[0_6px_22px_-12px_rgba(26,18,8,0.1)]">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="size-5 text-amber-600" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1a1208]">
              {t.vratRulesTitle}
            </h2>
          </div>
          <p className="text-sm text-[#6b5f4d] leading-relaxed">
            {t.vratRulesDesc}
          </p>
        </section>

        {/* Live Panchang CTA */}
        <section className="rounded-[24px] border-2 border-amber-300 bg-gradient-to-r from-[#fffbeb] to-[#fff7d1] p-6 sm:p-8 shadow-[0_8px_24px_-10px_rgba(240,200,50,0.35)]">
          <div className="flex items-center gap-2 mb-3">
            <Sun className="size-5 text-amber-600" />
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1a1208]">
              {t.livePanchangTitle}
            </h2>
          </div>
          <p className="text-sm text-[#6b5f4d] leading-relaxed mb-5">
            {t.livePanchangSub}
          </p>
          <Link
            href="/daily-horoscope"
            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-amber-600 hover:shadow-lg"
          >
            {t.livePanchangCta}
            <ArrowRight className="size-4" />
          </Link>
        </section>

        {/* Consult CTA */}
        <section className="rounded-[24px] border border-[#ece0ac] bg-white p-6 sm:p-8 shadow-[0_4px_14px_-6px_rgba(26,18,8,0.06)] text-center">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1a1208] mb-2">
            {t.consultTitle}
          </h2>
          <p className="text-sm text-[#6b5f4d] max-w-lg mx-auto mb-5">
            {t.consultSub}
          </p>
          <Link
            href="/astrologers"
            className="inline-flex items-center gap-2 rounded-full border-2 border-amber-400 bg-white px-6 py-3 text-sm font-bold text-[#8b5e0a] shadow-sm transition-all hover:bg-[#fff7d1] hover:shadow-md"
          >
            {t.consultCta}
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

