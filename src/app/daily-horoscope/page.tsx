"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  Calendar,
  Clock,
  Compass,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Briefcase,
  Coins,
  Activity,
  ChevronLeft,
  ChevronRight,
  Languages,
  RotateCcw,
  Info,
  Sun,
  Moon,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Share2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui";
import { astrologyApi } from "@/lib/api";
import type {
  AstrologyLanguage,
  DailyHoroscopeResult,
  DailySignHoroscope,
} from "@/types";

// 12 Zodiac signs metadata
const ZODIAC_LIST = [
  { id: "aries", index: 0, en: "Aries", bn: "মেষ", hi: "मेष", sa: "Mesha", symbol: "♈", element: "Fire", ruler: "Mars" },
  { id: "taurus", index: 1, en: "Taurus", bn: "বৃষ", hi: "वृष", sa: "Vrishabha", symbol: "♉", element: "Earth", ruler: "Venus" },
  { id: "gemini", index: 2, en: "Gemini", bn: "মিথুন", hi: "मिथुन", sa: "Mithuna", symbol: "♊", element: "Air", ruler: "Mercury" },
  { id: "cancer", index: 3, en: "Cancer", bn: "কর্কট", hi: "कर्क", sa: "Karka", symbol: "♋", element: "Water", ruler: "Moon" },
  { id: "leo", index: 4, en: "Leo", bn: "সিংহ", hi: "सिंह", sa: "Simha", symbol: "♌", element: "Fire", ruler: "Sun" },
  { id: "virgo", index: 5, en: "Virgo", bn: "কন্যা", hi: "कन्या", sa: "Kanya", symbol: "♍", element: "Earth", ruler: "Mercury" },
  { id: "libra", index: 6, en: "Libra", bn: "তুলা", hi: "तुला", sa: "Tula", symbol: "♎", element: "Air", ruler: "Venus" },
  { id: "scorpio", index: 7, en: "Scorpio", bn: "বৃশ্চিক", hi: "वृश्चिक", sa: "Vrishchika", symbol: "♏", element: "Water", ruler: "Mars" },
  { id: "sagittarius", index: 8, en: "Sagittarius", bn: "ধনু", hi: "धनु", sa: "Dhanu", symbol: "♐", element: "Fire", ruler: "Jupiter" },
  { id: "capricorn", index: 9, en: "Capricorn", bn: "মকর", hi: "मकर", sa: "Makara", symbol: "♑", element: "Earth", ruler: "Saturn" },
  { id: "aquarius", index: 10, en: "Aquarius", bn: "কুম্ভ", hi: "कुम्भ", sa: "Kumbha", symbol: "♒", element: "Air", ruler: "Saturn" },
  { id: "pisces", index: 11, en: "Pisces", bn: "মীন", hi: "मीन", sa: "Meena", symbol: "♓", element: "Water", ruler: "Jupiter" },
];

const ELEMENT_COLORS: Record<string, { badge: string; text: string; bg: string }> = {
  Fire: { badge: "bg-amber-500/10 text-amber-700 border-amber-500/25", text: "text-amber-600", bg: "bg-amber-50" },
  Earth: { badge: "bg-emerald-500/10 text-emerald-800 border-emerald-500/25", text: "text-emerald-700", bg: "bg-emerald-50" },
  Air: { badge: "bg-sky-500/10 text-sky-800 border-sky-500/25", text: "text-sky-700", bg: "bg-sky-50" },
  Water: { badge: "bg-indigo-500/10 text-indigo-800 border-indigo-500/25", text: "text-indigo-700", bg: "bg-indigo-50" },
};

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-600 bg-emerald-500";
  if (score >= 60) return "text-blue-600 bg-blue-500";
  if (score >= 40) return "text-amber-600 bg-amber-500";
  return "text-rose-600 bg-rose-500";
}

function getVerdictBadgeClass(verdict: string) {
  const lower = verdict.toLowerCase();
  if (lower.includes("highly") || lower.includes("পরম") || lower.includes("अत्यंत")) {
    return "bg-emerald-100 text-emerald-800 border-emerald-300";
  }
  if (lower.includes("favorable") || lower.includes("শুভ") || lower.includes("शुभ")) {
    return "bg-blue-100 text-blue-800 border-blue-300";
  }
  if (lower.includes("caution") || lower.includes("সতর্ক") || lower.includes("सावधानी")) {
    return "bg-amber-100 text-amber-800 border-amber-300";
  }
  return "bg-stone-100 text-stone-700 border-stone-300";
}

function formatDateToYMD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function HoroscopeContent() {
  const searchParams = useSearchParams();
  const initialSign = searchParams?.get("sign") || "aries";

  // State
  const [language, setLanguage] = React.useState<AstrologyLanguage>("bn");
  const [selectedDate, setSelectedDate] = React.useState<string>(() => formatDateToYMD(new Date()));
  const [activeSignIndex, setActiveSignIndex] = React.useState<number>(() => {
    const found = ZODIAC_LIST.findIndex(
      (z) => z.id.toLowerCase() === initialSign.toLowerCase() || z.en.toLowerCase() === initialSign.toLowerCase()
    );
    return found >= 0 ? found : 0;
  });

  const [loading, setLoading] = React.useState<boolean>(true);
  const [horoscopeData, setHoroscopeData] = React.useState<DailyHoroscopeResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Quick date presets
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

  // Fetch daily horoscope
  const fetchHoroscope = React.useCallback(async (date: string, lang: AstrologyLanguage) => {
    setLoading(true);
    setError(null);
    try {
      const data = await astrologyApi.dailyHoroscope({
        date,
        language: lang,
        latitude: 22.5726,
        longitude: 88.3639,
        timezone: 5.5,
      });
      setHoroscopeData(data);
    } catch (err: any) {
      console.error("Daily horoscope fetch error:", err);
      setError(err?.message || "Failed to calculate daily horoscope.");
      toast.error(err?.message || "Could not fetch horoscope data.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchHoroscope(selectedDate, language);
  }, [fetchHoroscope, selectedDate, language]);

  // Sync active sign from query param if changed
  React.useEffect(() => {
    const signParam = searchParams?.get("sign");
    if (signParam) {
      const found = ZODIAC_LIST.findIndex(
        (z) => z.id.toLowerCase() === signParam.toLowerCase() || z.en.toLowerCase() === signParam.toLowerCase()
      );
      if (found >= 0) setActiveSignIndex(found);
    }
  }, [searchParams]);

  const activeSignData: DailySignHoroscope | undefined = horoscopeData?.signs?.find(
    (s) => s.sign_index === activeSignIndex
  ) || horoscopeData?.signs?.[activeSignIndex];

  const currentMeta = ZODIAC_LIST[activeSignIndex];

  // Translations strings
  const t = {
    bn: {
      title: "দৈনিক রাশিফল",
      subtitle: "সুইস এফিমেরিস ভিত্তিক নিখুঁত চন্দ্র গোচর ও দৈনিক পঞ্চাঙ্গ",
      tag: "১০০% নিজস্ব জ্যোতিষীয় গণনা • কোনো থার্ড পার্টি API নেই",
      yesterday: "গতকাল",
      today: "আজ",
      tomorrow: "আগামীকাল",
      selectDate: "তারিখ নির্বাচন করুন",
      panchangTitle: "আজকের বৈদিক পঞ্চাঙ্গ",
      tithi: "তিথি",
      nakshatra: "নক্ষত্র",
      yoga: "যোগ",
      karana: "করণ",
      vara: "বার",
      moonPosition: "চন্দ্র গোচর",
      sunSign: "সূর্য রাশি",
      abhijit: "অভিজিৎ মুহূর্ত (শুভ সময়)",
      rahuKaal: "রাহু কাল (সতর্কতার সময়)",
      allSigns: "১২টি রাশি",
      transitScore: "গোচর শুভাশুভ স্কোর",
      overall: "সার্বিক প্রভাব",
      career: "কর্ম ও পেশা",
      love: "প্রেম ও দাম্পত্য",
      finance: "অর্থ ও সম্পদ",
      health: "স্বাস্থ্য ও মন",
      generalSummary: "আজকের সার্বিক দিনলিপি",
      careerSummary: "কর্ম ও পেশাগত নির্দেশিকা",
      loveSummary: "সম্পর্ক ও পারিবারিক অবস্থা",
      financeSummary: "অর্থভাগ্য ও লেনদেন",
      healthSummary: "শারীরিক সুস্থতা ও মানসিক শান্তি",
      luckyAttributes: "শাস্ত্রীয় শুভ উপাদান",
      luckyNumber: "শুভ সংখ্যা",
      luckyColor: "শুভ রঙ",
      luckyTime: "শুভ সময়",
      direction: "অনুকূল দিক",
      rulingLord: "অধিপতি গ্রহ",
      element: "তত্ত্ব",
      remedyTitle: "বৈদিক প্রতিকার ও মঙ্গল উপায়",
      accuracyTitle: "১০০% নির্ভুল বৈদিক গোচর প্রযুক্তি",
      accuracyDesc: "এই দৈনিক রাশিফল সুইস এফিমেরিস ২.১০ (Swiss Ephemeris) এর মাধ্যমে লাহিড়ী অয়নাংশ ব্যবহার করে চন্দ্রের রিয়েল-টাইম রাশি গোচর ও দ্বাদশ ভাব অবস্থান অনুসারে নির্ভুলভাবে গণনাকৃত।",
      consultCta: "অভিজ্ঞ জ্যোতিষীর সাথে বিস্তারিত কুষ্ঠি বিচার করুন",
      share: "রাশিফল শেয়ার করুন",
    },
    hi: {
      title: "दैनिक राशिफल",
      subtitle: "स्विस एफेमेरिस आधारित सटीक चंद्र गोचर और दैनिक पंचांग",
      tag: "100% इन-हाउस ज्योतिषीय गणना • कोई तृतीय-पक्ष API नहीं",
      yesterday: "कल (बीता)",
      today: "आज",
      tomorrow: "कल (आने वाला)",
      selectDate: "तिथि चुनें",
      panchangTitle: "आज का वैदिक पंचांग",
      tithi: "तिथि",
      nakshatra: "नक्षत्र",
      yoga: "योग",
      karana: "करण",
      vara: "वार",
      moonPosition: "चंद्र गोचर",
      sunSign: "सूर्य राशि",
      abhijit: "अभिजित मुहूर्त (शुभ समय)",
      rahuKaal: "राहु काल (सावधानी का समय)",
      allSigns: "12 राशियां",
      transitScore: "गोचर शुभाशुभ स्कोर",
      overall: "समग्र प्रभाव",
      career: "कार्य और आजीविका",
      love: "प्रेम और वैवाहिक जीवन",
      finance: "वित्त और समृद्धि",
      health: "स्वास्थ्य और ऊर्जा",
      generalSummary: "आज का संपूर्ण विश्लेषण",
      careerSummary: "करियर और व्यावसायिक मार्गदर्शन",
      loveSummary: "संबंध और पारिवारिक स्थिति",
      financeSummary: "आर्थिक स्थिति और लेन-देन",
      healthSummary: "शारीरिक और मानसिक स्वास्थ्य",
      luckyAttributes: "शास्त्रसम्मत शुभ तत्व",
      luckyNumber: "शुभ अंक",
      luckyColor: "शुभ रंग",
      luckyTime: "शुभ समय",
      direction: "अनुकूल दिशा",
      rulingLord: "स्वामी ग्रह",
      element: "तत्व",
      remedyTitle: "वैदिक उपाय और शांति मंत्र",
      accuracyTitle: "100% सटीक वैदिक गोचर प्रणाली",
      accuracyDesc: "यह दैनिक राशिफल स्विस एफेमेरिस 2.10 द्वारा लाहिड़ी अयनांश के आधार पर चंद्रमा की वर्तमान स्थिति व द्वादश भाव गोचर के शास्त्रीय नियमों से पूर्णतः प्रामाणिक है।",
      consultCta: "विशेषज्ञ ज्योतिषी से अपनी कुंडली का संपूर्ण विश्लेषण कराएं",
      share: "राशिफल साझा करें",
    },
    en: {
      title: "Daily Horoscope",
      subtitle: "Precision Vedic Moon Transit (Gochar) & Daily Panchang",
      tag: "100% In-House Astrological Engine • Zero 3rd-Party APIs",
      yesterday: "Yesterday",
      today: "Today",
      tomorrow: "Tomorrow",
      selectDate: "Select Date",
      panchangTitle: "Today's Vedic Panchang",
      tithi: "Tithi",
      nakshatra: "Nakshatra",
      yoga: "Yoga",
      karana: "Karana",
      vara: "Vara (Day)",
      moonPosition: "Moon Transit",
      sunSign: "Sun Sign",
      abhijit: "Abhijit Muhurat (Auspicious)",
      rahuKaal: "Rahu Kaal (Caution Window)",
      allSigns: "12 Zodiac Signs",
      transitScore: "Gochar Transit Score",
      overall: "Overall Impact",
      career: "Career & Work",
      love: "Love & Marriage",
      finance: "Wealth & Finance",
      health: "Health & Vitality",
      generalSummary: "Cosmic Daily Outlook",
      careerSummary: "Career & Business Guidance",
      loveSummary: "Relationship & Family Life",
      financeSummary: "Financial Dynamics & Trade",
      healthSummary: "Wellness & Mental Peace",
      luckyAttributes: "Auspicious Attributes",
      luckyNumber: "Lucky Number",
      luckyColor: "Lucky Color",
      luckyTime: "Auspicious Window",
      direction: "Favorable Direction",
      rulingLord: "Ruling Planet",
      element: "Element",
      remedyTitle: "Classical Vedic Remedy & Action",
      accuracyTitle: "100% Mathematical & Ephemeris Accuracy",
      accuracyDesc: "Calculated strictly with Swiss Ephemeris 2.10 sidereal coordinates using Lahiri Ayanamsha and classical Vedic Moon transit houses relative to your Janma Rashi.",
      consultCta: "Consult Verified Astrologers for In-depth Kundli Reading",
      share: "Share Horoscope",
    },
  }[language];

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success(
        language === "bn" ? "লিংক কপি করা হয়েছে!" : language === "hi" ? "लिंक कॉपी हो गया!" : "Link copied to clipboard!"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6f0] text-[#332c39]">
      <SiteHeader />

      <main className="relative overflow-hidden pt-6 pb-20">
        {/* Subtle celestial background glows */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-gradient-to-b from-[#ebd5be]/40 via-[#f5e3d0]/20 to-transparent blur-3xl" />
          <div className="absolute top-[40%] -left-48 size-[450px] rounded-full bg-[#fae8d4]/30 blur-3xl" />
          <div className="absolute top-[60%] -right-48 size-[450px] rounded-full bg-[#f3ded0]/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
          
          {/* Top Banner / Header */}
          <div className="text-center max-w-3xl mx-auto pt-4 sm:pt-8 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ebd7c8]/60 border border-[#ddc4b2] text-[#8c5035] text-xs font-semibold tracking-wide shadow-2xs mb-4">
              <Sparkles className="size-3.5 text-[#b06d4e]" />
              <span>{t.tag}</span>
            </div>
            
            <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight text-[#4D4664]">
              {t.title}
            </h1>
            
            <p className="mt-3 text-sm sm:text-base text-[#6b6278] leading-relaxed">
              {t.subtitle}
            </p>

            {/* Controls Bar: Language + Date Switchers */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {/* Language Switcher */}
              <div className="inline-flex items-center p-1 rounded-xl bg-[#f0e3d5] border border-[#e2d0bf] shadow-2xs">
                {(["bn", "en", "hi"] as AstrologyLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                      language === lang
                        ? "bg-[#b06d4e] text-white shadow-sm"
                        : "text-[#5e5369] hover:text-[#b06d4e]"
                    }`}
                  >
                    {lang === "bn" ? "বাংলা" : lang === "hi" ? "हिन्दी" : "English"}
                  </button>
                ))}
              </div>

              {/* Date Presets */}
              <div className="inline-flex items-center p-1 rounded-xl bg-[#f0e3d5] border border-[#e2d0bf] shadow-2xs">
                <button
                  type="button"
                  onClick={() => setSelectedDate(yesterdayStr)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                    selectedDate === yesterdayStr
                      ? "bg-[#4D4664] text-white shadow-sm"
                      : "text-[#5e5369] hover:text-[#4D4664]"
                  }`}
                >
                  {t.yesterday}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDate(todayStr)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                    selectedDate === todayStr
                      ? "bg-[#4D4664] text-white shadow-sm"
                      : "text-[#5e5369] hover:text-[#4D4664]"
                  }`}
                >
                  {t.today}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDate(tomorrowStr)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                    selectedDate === tomorrowStr
                      ? "bg-[#4D4664] text-white shadow-sm"
                      : "text-[#5e5369] hover:text-[#4D4664]"
                  }`}
                >
                  {t.tomorrow}
                </button>
              </div>

              {/* Custom Date Picker */}
              <div className="relative inline-flex items-center">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    if (e.target.value) setSelectedDate(e.target.value);
                  }}
                  className="rounded-xl border border-[#e2d0bf] bg-[#fbf4ec] px-3 py-1.5 text-xs font-medium text-[#4D4664] focus:outline-none focus:ring-2 focus:ring-[#b06d4e]/40 shadow-2xs cursor-pointer"
                />
              </div>

              {/* Share & Refresh */}
              <button
                type="button"
                onClick={() => fetchHoroscope(selectedDate, language)}
                title="Refresh"
                className="flex size-8 items-center justify-center rounded-xl border border-[#e2d0bf] bg-[#fbf4ec] text-[#5e5369] hover:text-[#b06d4e] transition-colors shadow-2xs"
              >
                <RotateCcw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              </button>
              <button
                type="button"
                onClick={handleShare}
                title={t.share}
                className="flex size-8 items-center justify-center rounded-xl border border-[#e2d0bf] bg-[#fbf4ec] text-[#5e5369] hover:text-[#b06d4e] transition-colors shadow-2xs"
              >
                <Share2 className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Daily Panchang Banner */}
          {horoscopeData?.panchang && (
            <div className="mb-8 rounded-2xl border border-[#ebd7c8] bg-gradient-to-r from-[#fbf4eb] via-[#f7ebe0] to-[#fbf4eb] p-4 sm:p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-3.5 border-b border-[#ebd7c8]/80">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-[#b06d4e]/10 text-[#b06d4e]">
                    <Sun className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-cinzel text-base font-bold text-[#4D4664]">
                      {t.panchangTitle} • {horoscopeData.date} ({horoscopeData.day_of_week})
                    </h2>
                    <p className="text-xs text-[#7d7388]">
                      {t.rulingLord}: <span className="font-semibold text-[#4D4664]">{horoscopeData.vara_lord}</span> • {t.moonPosition}: <span className="font-semibold text-[#b06d4e]">{horoscopeData.moon_sign} ({horoscopeData.moon_degree})</span>
                    </p>
                  </div>
                </div>

                {/* Muhurat Quick Badges */}
                <div className="flex items-center gap-2.5 flex-wrap text-xs">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/25">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>{t.abhijit}: <strong className="font-semibold">{horoscopeData.panchang.abhijit_muhurat}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-800 border border-rose-500/25">
                    <AlertTriangle className="size-3.5 text-rose-600" />
                    <span>{t.rahuKaal}: <strong className="font-semibold">{horoscopeData.panchang.rahu_kaal}</strong></span>
                  </div>
                </div>
              </div>

              {/* Panchang 5 Limbs Grid */}
              <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <div className="rounded-xl bg-[#fffcf9] border border-[#f0dfd2] p-2.5">
                  <span className="text-[#8c7e97] block font-medium">{t.tithi}</span>
                  <p className="mt-0.5 font-bold text-[#4D4664] truncate">{horoscopeData.panchang.tithi}</p>
                  <span className="text-[10px] text-[#a597b0] block">{horoscopeData.panchang.paksha}</span>
                </div>
                <div className="rounded-xl bg-[#fffcf9] border border-[#f0dfd2] p-2.5">
                  <span className="text-[#8c7e97] block font-medium">{t.nakshatra}</span>
                  <p className="mt-0.5 font-bold text-[#4D4664] truncate">{horoscopeData.panchang.nakshatra}</p>
                  <span className="text-[10px] text-[#a597b0] block">Pada {horoscopeData.panchang.nakshatra_pada}</span>
                </div>
                <div className="rounded-xl bg-[#fffcf9] border border-[#f0dfd2] p-2.5">
                  <span className="text-[#8c7e97] block font-medium">{t.yoga}</span>
                  <p className="mt-0.5 font-bold text-[#4D4664] truncate">{horoscopeData.panchang.yoga}</p>
                </div>
                <div className="rounded-xl bg-[#fffcf9] border border-[#f0dfd2] p-2.5">
                  <span className="text-[#8c7e97] block font-medium">{t.karana}</span>
                  <p className="mt-0.5 font-bold text-[#4D4664] truncate">{horoscopeData.panchang.karana}</p>
                </div>
                <div className="rounded-xl bg-[#fffcf9] border border-[#f0dfd2] p-2.5">
                  <span className="text-[#8c7e97] block font-medium">{t.sunSign}</span>
                  <p className="mt-0.5 font-bold text-[#b06d4e] truncate">{horoscopeData.sun_sign}</p>
                </div>
                <div className="rounded-xl bg-[#fffcf9] border border-[#f0dfd2] p-2.5">
                  <span className="text-[#8c7e97] block font-medium">{t.vara}</span>
                  <p className="mt-0.5 font-bold text-[#4D4664] truncate">{horoscopeData.panchang.vara}</p>
                </div>
              </div>
            </div>
          )}

          {/* 12 Zodiac Sign Tabs Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-cinzel text-lg font-bold text-[#4D4664]">
                {t.allSigns}
              </h2>
              <span className="text-xs text-[#8c7e97]">
                Click any sign to view today&apos;s transit prediction
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
              {ZODIAC_LIST.map((sign) => {
                const isSelected = sign.index === activeSignIndex;
                const signHoroscope = horoscopeData?.signs?.find((s) => s.sign_index === sign.index);
                const score = signHoroscope?.overall_score ?? 75;

                return (
                  <button
                    key={sign.id}
                    type="button"
                    onClick={() => setActiveSignIndex(sign.index)}
                    className={`group relative rounded-2xl border p-3 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-[#b06d4e] bg-[#fbf1e7] shadow-md -translate-y-0.5 ring-2 ring-[#b06d4e]/30"
                        : "border-[#e8d7c9] bg-[#fffaf5] hover:border-[#b06d4e]/60 hover:bg-[#faf2ea]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-2xl font-serif ${isSelected ? "scale-110 text-[#b06d4e]" : "text-[#5e5369]"} transition-transform`}>
                        {sign.symbol}
                      </span>
                      {signHoroscope && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          score >= 75 ? "bg-emerald-100 text-emerald-800" : score >= 55 ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {score}%
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <p className={`font-bold text-sm ${isSelected ? "text-[#b06d4e]" : "text-[#4D4664]"}`}>
                        {language === "bn" ? sign.bn : language === "hi" ? sign.hi : sign.en}
                      </p>
                      <p className="text-[11px] text-[#8c7e97] truncate">
                        {sign.sa} • {sign.ruler}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Sign Deep Horoscope View */}
          {loading ? (
            <div className="rounded-3xl border border-[#ebd7c8] bg-[#fdf9f4] p-12 text-center shadow-sm">
              <RotateCcw className="size-8 text-[#b06d4e] animate-spin mx-auto mb-3" />
              <p className="font-cinzel text-lg font-bold text-[#4D4664]">Calculating Moon Gochar Positions...</p>
              <p className="text-xs text-[#7d7388] mt-1">Astronomical sub-second computation in progress</p>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-300 bg-rose-50/70 p-8 text-center">
              <AlertTriangle className="size-8 text-rose-600 mx-auto mb-2" />
              <p className="font-bold text-rose-900">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => fetchHoroscope(selectedDate, language)}
              >
                Retry Calculation
              </Button>
            </div>
          ) : activeSignData ? (
            <div className="space-y-6">
              
              {/* Active Sign Header & Score Overview Card */}
              <div className="rounded-3xl border border-[#e5cebd] bg-gradient-to-br from-[#fbf4eb] via-[#f8ede2] to-[#faf1e6] p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-[#e5cebd]">
                  
                  {/* Left: Sign Identity */}
                  <div className="flex items-center gap-4 sm:gap-5">
                    <div className="flex size-16 sm:size-20 shrink-0 items-center justify-center rounded-2xl border border-[#d6b7a2] bg-[#fbf0e4] text-4xl sm:text-5xl font-serif text-[#b06d4e] shadow-sm">
                      {activeSignData.symbol}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#4D4664]">
                          {activeSignData.sign_name}
                        </h2>
                        <span className="text-sm font-serif italic text-[#8d7b92]">
                          ({activeSignData.sign_name_sanskrit})
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getVerdictBadgeClass(activeSignData.gochar_verdict)}`}>
                          {activeSignData.gochar_verdict}
                        </span>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-[#736780]">
                        <strong>{activeSignData.transit_house_name}</strong> • {t.rulingLord}: <strong className="text-[#4D4664]">{currentMeta.ruler}</strong> • {t.element}: <strong className="text-[#4D4664]">{currentMeta.element}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Right: Overall Day Score Wheel / Badge */}
                  <div className="flex items-center gap-4 bg-[#fffaf5] border border-[#ebd7c8] rounded-2xl p-4 sm:px-6 shadow-2xs">
                    <div className="text-right">
                      <span className="text-xs font-semibold text-[#8c7e97] block uppercase tracking-wider">{t.overall}</span>
                      <p className="text-xs text-[#6e6279]">Vedic Gochar Index</p>
                    </div>
                    <div className="flex size-14 sm:size-16 items-center justify-center rounded-full border-4 border-[#b06d4e] bg-[#fbf1e7] text-xl sm:text-2xl font-bold text-[#b06d4e] shadow-inner">
                      {activeSignData.overall_score}%
                    </div>
                  </div>
                </div>

                {/* Sub-Scores Progress Bars */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Career */}
                  <div className="rounded-2xl bg-[#fffbf7] border border-[#eedecf] p-4">
                    <div className="flex items-center justify-between text-xs font-bold text-[#4D4664] mb-2">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="size-3.5 text-blue-600" />
                        {t.career}
                      </span>
                      <span className="text-blue-700">{activeSignData.career_score}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#eee0d3] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${activeSignData.career_score}%` }}
                      />
                    </div>
                  </div>

                  {/* Love */}
                  <div className="rounded-2xl bg-[#fffbf7] border border-[#eedecf] p-4">
                    <div className="flex items-center justify-between text-xs font-bold text-[#4D4664] mb-2">
                      <span className="flex items-center gap-1.5">
                        <Heart className="size-3.5 text-rose-500" />
                        {t.love}
                      </span>
                      <span className="text-rose-600">{activeSignData.love_score}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#eee0d3] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-rose-500 transition-all duration-500"
                        style={{ width: `${activeSignData.love_score}%` }}
                      />
                    </div>
                  </div>

                  {/* Finance */}
                  <div className="rounded-2xl bg-[#fffbf7] border border-[#eedecf] p-4">
                    <div className="flex items-center justify-between text-xs font-bold text-[#4D4664] mb-2">
                      <span className="flex items-center gap-1.5">
                        <Coins className="size-3.5 text-emerald-600" />
                        {t.finance}
                      </span>
                      <span className="text-emerald-700">{activeSignData.finance_score}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#eee0d3] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                        style={{ width: `${activeSignData.finance_score}%` }}
                      />
                    </div>
                  </div>

                  {/* Health */}
                  <div className="rounded-2xl bg-[#fffbf7] border border-[#eedecf] p-4">
                    <div className="flex items-center justify-between text-xs font-bold text-[#4D4664] mb-2">
                      <span className="flex items-center gap-1.5">
                        <Activity className="size-3.5 text-amber-600" />
                        {t.health}
                      </span>
                      <span className="text-amber-700">{activeSignData.health_score}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#eee0d3] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500 transition-all duration-500"
                        style={{ width: `${activeSignData.health_score}%` }}
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Detailed Predictions Grid (5 Detailed Sections) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                
                {/* 1. General Summary */}
                <div className="md:col-span-2 rounded-2xl border border-[#ebd7c8] bg-[#fefcf9] p-5 sm:p-6 shadow-2xs">
                  <div className="flex items-center gap-2.5 text-[#b06d4e] mb-3">
                    <Sparkles className="size-4" />
                    <h3 className="font-cinzel text-base font-bold text-[#4D4664]">
                      {t.generalSummary}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#594f63]">
                    {activeSignData.summary}
                  </p>
                </div>

                {/* 2. Career & Business */}
                <div className="rounded-2xl border border-[#ebd7c8] bg-[#fefcf9] p-5 sm:p-6 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Briefcase className="size-4" />
                      <h3 className="font-cinzel text-base font-bold text-[#4D4664]">
                        {t.careerSummary}
                      </h3>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      {activeSignData.career_score}%
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-[#594f63]">
                    {activeSignData.career_prediction}
                  </p>
                </div>

                {/* 3. Love & Marriage */}
                <div className="rounded-2xl border border-[#ebd7c8] bg-[#fefcf9] p-5 sm:p-6 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-rose-600">
                      <Heart className="size-4" />
                      <h3 className="font-cinzel text-base font-bold text-[#4D4664]">
                        {t.loveSummary}
                      </h3>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                      {activeSignData.love_score}%
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-[#594f63]">
                    {activeSignData.love_prediction}
                  </p>
                </div>

                {/* 4. Finance & Wealth */}
                <div className="rounded-2xl border border-[#ebd7c8] bg-[#fefcf9] p-5 sm:p-6 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Coins className="size-4" />
                      <h3 className="font-cinzel text-base font-bold text-[#4D4664]">
                        {t.financeSummary}
                      </h3>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {activeSignData.finance_score}%
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-[#594f63]">
                    {activeSignData.finance_prediction}
                  </p>
                </div>

                {/* 5. Health & Wellness */}
                <div className="rounded-2xl border border-[#ebd7c8] bg-[#fefcf9] p-5 sm:p-6 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-amber-700">
                      <Activity className="size-4" />
                      <h3 className="font-cinzel text-base font-bold text-[#4D4664]">
                        {t.healthSummary}
                      </h3>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      {activeSignData.health_score}%
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-[#594f63]">
                    {activeSignData.health_prediction}
                  </p>
                </div>

              </div>

              {/* Lucky Elements + Vedic Remedy Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
                
                {/* Lucky Attributes Card */}
                <div className="lg:col-span-1 rounded-2xl border border-[#ebd7c8] bg-[#fbf3e9] p-5 sm:p-6 shadow-2xs">
                  <h3 className="font-cinzel text-base font-bold text-[#4D4664] mb-4">
                    {t.luckyAttributes}
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-[#ebd7c8]">
                      <span className="text-[#8c7e97] font-medium">{t.luckyNumber}</span>
                      <strong className="text-sm font-bold text-[#b06d4e]">{activeSignData.lucky_number}</strong>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-[#ebd7c8]">
                      <span className="text-[#8c7e97] font-medium">{t.luckyColor}</span>
                      <strong className="text-[#4D4664] font-semibold">{activeSignData.lucky_color}</strong>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-[#ebd7c8]">
                      <span className="text-[#8c7e97] font-medium">{t.luckyTime}</span>
                      <strong className="text-[#4D4664] font-semibold">{activeSignData.lucky_time}</strong>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-[#8c7e97] font-medium">{t.direction}</span>
                      <strong className="text-[#4D4664] font-semibold">{activeSignData.favorable_direction}</strong>
                    </div>
                  </div>
                </div>

                {/* Vedic Remedy Card (From client's resources) */}
                <div className="lg:col-span-2 rounded-2xl border border-[#d8bead] bg-gradient-to-br from-[#f8ebe0] via-[#f7e7da] to-[#f8ebe0] p-5 sm:p-6 shadow-2xs">
                  <div className="flex items-center gap-2 text-[#8c5035] mb-2.5">
                    <ShieldCheck className="size-5 text-[#b06d4e]" />
                    <h3 className="font-cinzel text-base font-bold text-[#4D4664]">
                      {t.remedyTitle}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#594f63] font-medium">
                    {activeSignData.remedy}
                  </p>
                  
                  {/* CTA Banner inside remedy */}
                  <div className="mt-5 pt-4 border-t border-[#e2cdbf] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <span className="text-xs text-[#7d7088]">
                      Want a detailed birth chart remedy for doshas and dasha?
                    </span>
                    <Link
                      href="/astrologers"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b06d4e] hover:text-[#8c5035] uppercase tracking-wider"
                    >
                      <span>{t.consultCta}</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>

              </div>

              {/* Accuracy Transparency & Methodology Card */}
              <div className="rounded-2xl border border-[#ebd7c8] bg-[#fbf5ee] p-5 text-xs text-[#7d7088]">
                <div className="flex items-center gap-2 text-[#4D4664] font-bold mb-1">
                  <Info className="size-4 text-[#b06d4e]" />
                  <span>{t.accuracyTitle}</span>
                </div>
                <p className="leading-relaxed">
                  {t.accuracyDesc}
                </p>
                {horoscopeData?.calculation_meta && (
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#9b8d9f]">
                    <span>Engine: {horoscopeData.calculation_meta.engine}</span>
                    <span>•</span>
                    <span>Ayanamsha: {horoscopeData.calculation_meta.ayanamsha}</span>
                    <span>•</span>
                    <span>Precision: {horoscopeData.calculation_meta.precision}</span>
                  </div>
                )}
              </div>

            </div>
          ) : null}

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export default function DailyHoroscopePage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
          <RotateCcw className="size-8 text-[#b06d4e] animate-spin" />
        </div>
      }
    >
      <HoroscopeContent />
    </React.Suspense>
  );
}
