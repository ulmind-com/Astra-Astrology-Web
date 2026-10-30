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
  RotateCcw,
  Info,
  Sun,
  Share2,
  ArrowRight,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Eye,
  BookOpen,
  Award,
  Scale,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui";
import { astrologyApi } from "@/lib/api";
import { useLanguage } from "@/providers/language-provider";
import { useAuth } from "@/providers/auth-provider";
import { useProfile } from "@/hooks/use-profile";
import { useFeaturePricing } from "@/hooks/use-feature-pricing";
import {
  FeatureCoinBadge,
  FeatureDisabledAlert,
  FeatureCoinModal,
} from "@/components/astrology/feature-pricing-banner";
import type {
  AstrologyLanguage,
  DailyHoroscopeResult,
  DailySignHoroscope,
  HoraItem,
  ChoghadiyaItem,
  BiorhythmHour,
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

// 27 Nakshatras list for quick personalization
const NAKSHATRA_OPTIONS = [
  { index: 0, en: "Ashwini", bn: "অশ্বিনী", hi: "अश्विनी", lord: "Ketu", rashi: "Aries" },
  { index: 1, en: "Bharani", bn: "ভরণী", hi: "भरणी", lord: "Venus", rashi: "Aries" },
  { index: 2, en: "Krittika", bn: "কৃত্তিকা", hi: "कृत्तिका", lord: "Sun", rashi: "Aries / Taurus" },
  { index: 3, en: "Rohini", bn: "রোহিণী", hi: "रोहिणी", lord: "Moon", rashi: "Taurus" },
  { index: 4, en: "Mrigashira", bn: "মৃগশিরা", hi: "मृगशिरा", lord: "Mars", rashi: "Taurus / Gemini" },
  { index: 5, en: "Ardra", bn: "আর্দ্রা", hi: "आर्द्रा", lord: "Rahu", rashi: "Gemini" },
  { index: 6, en: "Punarvasu", bn: "পুনর্বসু", hi: "पुनर्वसु", lord: "Jupiter", rashi: "Gemini / Cancer" },
  { index: 7, en: "Pushya", bn: "পুষ্যা", hi: "पुष्य", lord: "Saturn", rashi: "Cancer" },
  { index: 8, en: "Ashlesha", bn: "অশ্লেষা", hi: "आश्लेषा", lord: "Mercury", rashi: "Cancer" },
  { index: 9, en: "Magha", bn: "মঘা", hi: "मघा", lord: "Ketu", rashi: "Leo" },
  { index: 10, en: "Purva Phalguni", bn: "পূর্ব ফাল্গুনী", hi: "पूर्वा फाल्गुनी", lord: "Venus", rashi: "Leo" },
  { index: 11, en: "Uttara Phalguni", bn: "উত্তর ফাল্গুনী", hi: "उत्तरा फाल्गुनी", lord: "Sun", rashi: "Leo / Virgo" },
  { index: 12, en: "Hasta", bn: "হস্তা", hi: "हस्त", lord: "Moon", rashi: "Virgo" },
  { index: 13, en: "Chitra", bn: "চিত্রা", hi: "चित्रा", lord: "Mars", rashi: "Virgo / Libra" },
  { index: 14, en: "Swati", bn: "স্বাতী", hi: "स्वाति", lord: "Rahu", rashi: "Libra" },
  { index: 15, en: "Vishakha", bn: "বিশাখা", hi: "विशाखा", lord: "Jupiter", rashi: "Libra / Scorpio" },
  { index: 16, en: "Anuradha", bn: "অনুরাধা", hi: "अनुराधा", lord: "Saturn", rashi: "Scorpio" },
  { index: 17, en: "Jyeshtha", bn: "জ্যেষ্ঠা", hi: "ज्येष्ठा", lord: "Mercury", rashi: "Scorpio" },
  { index: 18, en: "Mula", bn: "মূলা", hi: "मूल", lord: "Ketu", rashi: "Sagittarius" },
  { index: 19, en: "Purva Ashadha", bn: "পূর্বাষাঢ়া", hi: "पूर्वाषाढ़ा", lord: "Venus", rashi: "Sagittarius" },
  { index: 20, en: "Uttara Ashadha", bn: "উত্তরাষাঢ়া", hi: "उत्तराषाढ़ा", lord: "Sun", rashi: "Sagittarius / Capricorn" },
  { index: 21, en: "Shravana", bn: "শ্রবণা", hi: "श्रवण", lord: "Moon", rashi: "Capricorn" },
  { index: 22, en: "Dhanishta", bn: "ধনিষ্ঠা", hi: "धनिष्ठा", lord: "Mars", rashi: "Capricorn / Aquarius" },
  { index: 23, en: "Shatabhisha", bn: "শতভিষা", hi: "शतभिषा", lord: "Rahu", rashi: "Aquarius" },
  { index: 24, en: "Purva Bhadrapada", bn: "পূর্ব ভাদ্রপদ", hi: "पूर्वा भाद्रपद", lord: "Jupiter", rashi: "Aquarius / Pisces" },
  { index: 25, en: "Uttara Bhadrapada", bn: "উত্তর ভাদ্রপদ", hi: "उत्तरा भाद्रपद", lord: "Saturn", rashi: "Pisces" },
  { index: 26, en: "Revati", bn: "রেবতী", hi: "रेवती", lord: "Mercury", rashi: "Pisces" },
];

function getVerdictBadgeClass(verdict: string) {
  if (!verdict) return "bg-stone-100 text-stone-700 border-stone-300";
  const lower = verdict.toLowerCase();
  if (
    lower.includes("highly") ||
    lower.includes("পরম") ||
    lower.includes("অত্যন্ত") ||
    lower.includes("अत्यंत") ||
    lower.includes("महा")
  ) {
    return "bg-emerald-100 text-emerald-800 border-emerald-300";
  }
  if (
    lower.includes("favorable") ||
    lower.includes("শুভ") ||
    lower.includes("शुभ") ||
    lower.includes("blessing")
  ) {
    return "bg-blue-100 text-blue-800 border-blue-300";
  }
  if (
    lower.includes("caution") ||
    lower.includes("সতর্ক") ||
    lower.includes("সাৰধান") ||
    lower.includes("सावधानी") ||
    lower.includes("सतर्क") ||
    lower.includes("बाधा") ||
    lower.includes("obstacle")
  ) {
    return "bg-amber-100 text-amber-800 border-amber-300";
  }
  return "bg-stone-100 text-stone-700 border-stone-300";
}

function getChoghadiyaBadgeClass(status: string) {
  if (status === "auspicious") return "bg-emerald-100 text-emerald-800 border-emerald-300";
  if (status === "neutral") return "bg-blue-100 text-blue-800 border-blue-300";
  return "bg-rose-100 text-rose-800 border-rose-300";
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

  const { isSignedIn } = useAuth();
  const { data: profile } = useProfile({ enabled: isSignedIn });

  const { getFeature, walletBalance } = useFeaturePricing();
  const horoscopeFeature = getFeature("daily_horoscope");
  const [coinModalOpen, setCoinModalOpen] = React.useState(false);
  const [coinModalReason, setCoinModalReason] = React.useState<"unauthorized" | "insufficient_coins" | "disabled">("insufficient_coins");

  // Centralized Language & State
  const { language, setLanguage } = useLanguage();
  const [selectedDate, setSelectedDate] = React.useState<string>(() => formatDateToYMD(new Date()));
  const [activeSignIndex, setActiveSignIndex] = React.useState<number>(() => {
    const found = ZODIAC_LIST.findIndex(
      (z) => z.id.toLowerCase() === initialSign.toLowerCase() || z.en.toLowerCase() === initialSign.toLowerCase()
    );
    return found >= 0 ? found : 0;
  });

  // Personalization State
  const [selectedNakshatra, setSelectedNakshatra] = React.useState<number | null>(null);
  const [showPersonalize, setShowPersonalize] = React.useState<boolean>(false);
  const [birthDateInput, setBirthDateInput] = React.useState<string>("");
  const [birthTimeInput, setBirthTimeInput] = React.useState<string>("");
  const [selectedLagna, setSelectedLagna] = React.useState<number | null>(null);
  const [showClientRules, setShowClientRules] = React.useState<boolean>(false);

  // Auto-populate from authenticated user's profile if available and not yet modified
  React.useEffect(() => {
    if (profile?.birth?.date_of_birth && !birthDateInput) {
      setBirthDateInput(profile.birth.date_of_birth);
      if (profile.birth.time_of_birth && !birthTimeInput) {
        setBirthTimeInput(profile.birth.time_of_birth);
      }
    }
  }, [profile?.birth?.date_of_birth, profile?.birth?.time_of_birth, birthDateInput, birthTimeInput]);

  // Interactive Timeline Drawers
  const [showHoras, setShowHoras] = React.useState<boolean>(false);
  const [horaViewPeriod, setHoraViewPeriod] = React.useState<"day" | "night">("day");
  const [showChoghadiya, setShowChoghadiya] = React.useState<boolean>(false);
  const [choghadiyaViewPeriod, setChoghadiyaViewPeriod] = React.useState<"day" | "night">("day");
  const [showBiorhythm, setShowBiorhythm] = React.useState<boolean>(false);

  // Copied mantra toast state
  const [copiedMantra, setCopiedMantra] = React.useState<boolean>(false);

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
  const fetchHoroscope = React.useCallback(
    async (
      date: string,
      lang: AstrologyLanguage,
      nakIdx: number | null,
      bDate?: string,
      bTime?: string,
      bLagna?: number | null,
      activeSign?: number
    ) => {
      if (horoscopeFeature && !horoscopeFeature.enabled) {
        setLoading(false);
        setError(
          lang === "bn"
            ? "দৈনিক রাশিফল ফিচারটি বর্তমানে বন্ধ রাখা হয়েছে।"
            : lang === "hi"
            ? "दैनिक राशिफल फीचर वर्तमान में व्यवस्थापक द्वारा अक्षम है।"
            : "Daily horoscope is currently disabled by administrator."
        );
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const payload: any = {
          date,
          language: lang,
          latitude: 22.5726,
          longitude: 88.3639,
          timezone: 5.5,
        };

        if (nakIdx !== null && nakIdx !== undefined) {
          payload.birth_nakshatra_index = nakIdx;
        } else if (bDate) {
          payload.birth_date = bDate;
          if (bTime) payload.birth_time = bTime;
        }
        if (bLagna !== null && bLagna !== undefined) {
          payload.birth_lagna_index = bLagna;
        }
        if (activeSign !== undefined && activeSign !== null) {
          payload.birth_rashi_index = activeSign;
        }

        const data = await astrologyApi.dailyHoroscope(payload);
        setHoroscopeData(data);
      } catch (err: any) {
        console.error("Daily horoscope fetch error:", err);
        if (err?.code === "insufficient_coins") {
          setCoinModalReason("insufficient_coins");
          setCoinModalOpen(true);
        } else if (err?.code === "authentication_required" || err?.status === 401) {
          setCoinModalReason("unauthorized");
          setCoinModalOpen(true);
        }
        setError(err?.message || "Failed to calculate daily horoscope.");
        toast.error(err?.message || "Could not fetch horoscope data.");
      } finally {
        setLoading(false);
      }
    },
    [horoscopeFeature]
  );

  React.useEffect(() => {
    fetchHoroscope(
      selectedDate,
      language,
      selectedNakshatra,
      birthDateInput,
      birthTimeInput,
      selectedLagna,
      activeSignIndex
    );
  }, [
    fetchHoroscope,
    selectedDate,
    language,
    selectedNakshatra,
    birthDateInput,
    birthTimeInput,
    selectedLagna,
    activeSignIndex,
  ]);

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

  const activeSignData: DailySignHoroscope | undefined =
    horoscopeData?.signs?.find((s) => s.sign_index === activeSignIndex) ||
    horoscopeData?.signs?.[activeSignIndex];

  const currentMeta = ZODIAC_LIST[activeSignIndex];

  // Comprehensive 3-language translations dictionary
  const t = {
    bn: {
      title: "দৈনিক রাশিফল",
      subtitle: "সুইস এফিমেরিস ভিত্তিক নিখুঁত চন্দ্র গোচর, বৈদিক হোরা ও নবতারা বল",
      tag: "১০০% নিজস্ব জ্যোতিষীয় গণনা • কোনো থার্ড পার্টি API নেই • শাস্ত্রীয় নির্ভুলতা",
      yesterday: "গতকাল",
      today: "আজ",
      tomorrow: "আগামীকাল",
      selectDate: "তারিখ নির্বাচন করুন",
      panchangTitle: "আজকের বৈদিক পঞ্চাঙ্গ",
      tithi: "তিথি",
      nakshatra: "নক্ষত্র",
      pada: "পদ",
      yoga: "যোগ",
      karana: "করণ",
      vara: "বার",
      moonPosition: "চন্দ্র গোচর",
      sunSign: "সূর্য রাশি",
      abhijit: "অভিজিৎ মুহূর্ত (শুভ সময়)",
      rahuKaal: "রাহু কাল (সতর্কতার সময়)",
      allSigns: "১২টি রাশি",
      clickSignHint: "আজকের গোচর পূর্বাভাস দেখতে যে কোনো রাশিতে ক্লিক করুন",
      transitScore: "গোচর শুভাশুভ স্কোর",
      overall: "সার্বিক প্রভাব",
      vedicGocharIndex: "বৈদিক গোচর সূচক",
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
      accuracyTitle: "১০০% শাস্ত্রীয় নির্ভুল বৈদিক গোচর প্রযুক্তি",
      accuracyDesc: "এই দৈনিক রাশিফল সুইস এফিমেরিস ২.১০ (Swiss Ephemeris) এর মাধ্যমে লাহিড়ী অয়নাংশ ব্যবহার করে চন্দ্রের রিয়েল-টাইম রাশি গোচর, দ্বাদশ ভাব ফল, ক্লাসিক্যাল গোচর বেধ ও ২৪ হোরা চক্র অনুসারে নির্ভুলভাবে গণনাকৃত।",
      consultPrompt: "কুষ্ঠির বিস্তারিত গ্রহদোষ ও দশার প্রতিকার জানতে চান?",
      consultCta: "অভিজ্ঞ জ্যোতিষীর সাথে বিস্তারিত কুষ্ঠি বিচার করুন",
      share: "রাশিফল শেয়ার করুন",
      horaBtn: "২৪ ঘণ্টা বৈদিক হোরা চক্র দেখুন",
      horaTitle: "২৪ ঘণ্টা গ্রহ হোরা চক্র (Planetary Horas)",
      horaDesc: "সূর্যোদয় থেকে দিন ও রাতের ২৪টি হোরা। শুভ হোরায় জরুরি কাজের সূচনা করলে সাফল্য নিশ্চিত হয়।",
      dayHoras: "দিবা হোরা (দিনের ১২ হোরা)",
      nightHoras: "রাত্রি হোরা (রাতের ১২ হোরা)",
      horaSuffix: "হোরা",
      personalizeBtn: "জন্ম নক্ষত্র যোগ করুন",
      personalizeTitle: "আমার জন্ম নক্ষত্র দিয়ে ফলাফল পার্সোনালাইজ করুন",
      personalizeSub: "নবতারা চক্র (Navatara Chakra) অনুসারে আজকের গোচরে আপনার জন্ম নক্ষত্রের শুভাশুভ বল ও ব্যক্তিগত প্রতিকার দেখুন।",
      selectNakshatra: "জন্ম নক্ষত্র নির্বাচন করুন",
      clearPersonalize: "রিসেট করুন",
      personalizeStep1: "১. সরাসরি জন্ম নক্ষত্র নির্বাচন করুন:",
      personalizeStep2: "২. জন্ম তারিখ ও সময় (সংখ্যাতত্ত্ব ও কুষ্ঠির জন্য):",
      personalizeStep3: "৩. জন্ম লগ্ন (দ্বৈত গোচর বিশ্লেষণের জন্য):",
      birthDatePlaceholder: "জন্ম তারিখ",
      birthTimePlaceholder: "জন্ম সময়",
      personalizedProfileTitle: "ব্যক্তিগত জন্ম নক্ষত্র প্রোফাইল",
      lord: "অধিপতি",
      deity: "দেবতা",
      tree: "বৃক্ষ",
      taraBalaBadge: "নবতারা বল",
      taraGuidanceLabel: "আজকের তারা বলের তাৎপর্য",
      dishaShoolaTitle: "দিশাশূল (ভ্রমণ নির্দেশিকা)",
      dishaRemedyTitle: "যাত্রার শাস্ত্রীয় শুভ প্রতিকার",
      favorableChandraTitle: "আজকের চন্দ্রবল যুক্ত শুভ রাশি",
      beejMantraTitle: "রাশি অধিপতির মূল বৈদিক বীজ মন্ত্র",
      charityTitle: "আজকের বিশেষ দান ও সৎকর্ম (দান মাহাত্ম্য)",
      copyMantra: "মন্ত্র কপি করুন",
      copied: "কপি হয়েছে!",
      sadeSatiLabel: "শনি গোচর / সাড়ে সাতি",
      guruLabel: "বৃহস্পতি গোচর",
      choghadiyaBtn: "১৬ বৈদিক চৌঘড়িয়া",
      choghadiyaTitle: "১৬ বৈদিক চৌঘড়িয়া মুহূর্ত (অমৃত, শুভ, লাভ, চল, রোগ, কাল, উদ্বেগ)",
      choghadiyaDesc: "সূর্যোদয় ও সূর্যাস্তের নিখুঁত জ্যোতির্বৈজ্ঞানিক বিভাজন অনুসারে দিন ও রাতের ১৬টি মুহূর্ত।",
      dayChoghadiya: "দিবা চৌঘড়িয়া (দিনের ৮ মুহূর্ত)",
      nightChoghadiya: "রাত্রি চৌঘড়িয়া (রাতের ৮ মুহূর্ত)",
      biorhythmBtn: "২৪-ঘণ্টা কসমিক বায়োরিদম",
      biorhythmTitle: "২৪-ঘণ্টার মহাজাগতিক শক্তি বায়োরিদম তরঙ্গ",
      biorhythmDesc: "হোরা, চৌঘড়িয়া ও অষ্টকবর্গের সম্মিলিত সূচকে আপনার দৈনিক শারীরিক ও মানসিক শক্তির পরিবর্তন।",
      panchakTitle: "বৈদিক পঞ্চক স্থিতি",
      ashtakavargaTitle: "পরাশর অষ্টকবর্গ গোচর বল",
      numerologySynergyTitle: "দৈনিক সংখ্যাতত্ত্ব ও বার অধিপতি সুরসংগতি (Client §3.5)",
      dualTransitTitle: "দ্বৈত গোচর বিচার (চন্দ্র মনস্তত্ত্ব + লগ্ন জাগতিক সাফল্য)",
      clientRulesTitle: "ক্লায়েন্ট রাশি শাস্ত্রীয় গুণাবলী ও শ্রেণিবিভাগ (01.pdf)",
      drishtiTitle: "চন্দ্র গোচরে গ্রহের দৃষ্টি ও বিশেষ শুভাশুভ যোগ",
      selectLagna: "জন্ম লগ্ন নির্বাচন করুন",
      prohibitedLabel: "বর্জনীয় কাজ",
      chandrashtamaAlertTitle: "⚠️ অষ্টম চন্দ্র গোচর (চন্দ্রাষ্টম) সতর্কবার্তা",
      vedhaAlertTitle: "গোচর বেধ (বাধা) পর্যবেক্ষণ",
      moonTransitHeading: "চন্দ্র গোচর (মানসিক দিক)",
      lagnaTransitHeading: "লগ্ন গোচর (বাস্তব ঘটনা ও শারীরিক ফল)",
      houseTransitSuffix: "ম ভাব গোচর",
      mulank: "আপনার মূলাঙ্ক",
      bhagyank: "ভাগ্যাঙ্ক",
      ruler: "অধিপতি গ্রহ",
      dayHarmony: "দিনের সম্পর্ক",
      savTitle: "সর্বাষ্টকবর্গ (SAV)",
      savHint: "২৮+ বিন্দু অত্যন্ত শুভ",
      bavTitle: "চন্দ্র ভিন্নাষ্টকবর্গ (BAV)",
      bavHint: "৪+ বিন্দু মানসিক বল",
      kpSubLord: "কেপি সাব-লর্ড (KP Sub-Lord)",
      remedyLabel: "প্রতিকার",
      collapseRules: "সংক্ষেপ করুন",
      viewAllRules: "সবগুলো ১৫টি দেখুন",
      calculatingTitle: "চন্দ্র গোচর গণনা করা হচ্ছে...",
      calculatingSub: "সুইস এফিমেরিস দ্বারা নিখুঁত গণনা সম্পন্ন হচ্ছে",
      retryBtn: "পুনরায় চেষ্টা করুন",
      linkCopiedToast: "লিংক কপি করা হয়েছে!",
      mantraCopiedToast: "বীজ মন্ত্র কপি করা হয়েছে!",
      directionEast: "পূর্ব",
      directionWest: "পশ্চিম",
      directionNorth: "উত্তর",
      directionSouth: "দক্ষিণ",
    },
    hi: {
      title: "दैनिक राशिफल",
      subtitle: "स्विस एफेमेरिस आधारित सटीक चंद्र गोचर, वैदिक होरा और नवतारा बल",
      tag: "100% इन-हाउस ज्योतिषीय गणना • कोई तृतीय-पक्ष API नहीं • पूर्ण शास्त्रीय प्रामाणिकता",
      yesterday: "कल (बीता)",
      today: "आज",
      tomorrow: "कल (आने वाला)",
      selectDate: "तिथि चुनें",
      panchangTitle: "आज का वैदिक पंचांग",
      tithi: "तिथि",
      nakshatra: "नक्षत्र",
      pada: "पाद",
      yoga: "योग",
      karana: "करण",
      vara: "वार",
      moonPosition: "चंद्र गोचर",
      sunSign: "सूर्य राशि",
      abhijit: "अभिजित मुहूर्त (शुभ समय)",
      rahuKaal: "राहु काल (सावधानी का समय)",
      allSigns: "12 राशियां",
      clickSignHint: "आज का गोचर फल देखने के लिए किसी भी राशि पर क्लिक करें",
      transitScore: "गोचर शुभाशुभ स्कोर",
      overall: "समग्र प्रभाव",
      vedicGocharIndex: "वैदिक गोचर सूचकांक",
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
      accuracyDesc: "यह दैनिक राशिफल स्विस एफेमेरिस 2.10 द्वारा लाहिड़ी अयनांश के आधार पर चंद्रमा की वर्तमान स्थिति, द्वादश भाव गोचर, शास्त्रीय गोचर वेध और 24 होरा चक्र के नियमों से पूर्णतः प्रामाणिक है।",
      consultPrompt: "क्या आप विस्तृत जन्म कुंडली विश्लेषण व सटीक उपाय चाहते हैं?",
      consultCta: "विशेषज्ञ ज्योतिषी से अपनी कुंडली का संपूर्ण विश्लेषण कराएं",
      share: "राशिफल साझा करें",
      horaBtn: "24 घंटे का वैदिक होरा चक्र देखें",
      horaTitle: "24 घंटे का ग्रह होरा चक्र (Planetary Horas)",
      horaDesc: "सूर्योदय से दिन और रात की 24 होराएं। शुभ होरा में महत्वपूर्ण कार्य करने से सफलता मिलती है।",
      dayHoras: "दिन की होरा (12 होराएं)",
      nightHoras: "रात्रि की होरा (12 होराएं)",
      horaSuffix: "होरा",
      personalizeBtn: "जन्म नक्षत्र जोड़ें",
      personalizeTitle: "अपने जन्म नक्षत्र से परिणाम पर्सनलाइज़ करें",
      personalizeSub: "नवतारा चक्र के अनुसार आज के गोचर में अपने जन्म नक्षत्र का तारा बल और व्यक्तिगत उपाय देखें।",
      selectNakshatra: "जन्म नक्षत्र चुनें",
      clearPersonalize: "रीसेट करें",
      personalizeStep1: "1. सीधे जन्म नक्षत्र चुनें:",
      personalizeStep2: "2. जन्म तिथि और समय (अंकशास्त्र व कुंडली हेतु):",
      personalizeStep3: "3. जन्म लग्न (द्वैत गोचर विश्लेषण हेतु):",
      birthDatePlaceholder: "जन्म तिथि",
      birthTimePlaceholder: "जन्म समय",
      personalizedProfileTitle: "व्यक्तिगत जन्म नक्षत्र प्रोफ़ाइल",
      lord: "स्वामी",
      deity: "देवता",
      tree: "पवित्र वृक्ष",
      taraBalaBadge: "नवतारा बल",
      taraGuidanceLabel: "आज का तारा बल मार्गदर्शन",
      dishaShoolaTitle: "दिशाशूल (यात्रा मार्गदर्शन)",
      dishaRemedyTitle: "यात्रा का शास्त्रीय उपाय",
      favorableChandraTitle: "आज चंद्रबल युक्त शुभ राशियां",
      beejMantraTitle: "राशि स्वामी का मूल वैदिक बीज मंत्र",
      charityTitle: "आज का विशेष दान एवं सत्कर्म (दान माहात्म्य)",
      copyMantra: "मंत्र कॉपी करें",
      copied: "कॉपी हुआ!",
      sadeSatiLabel: "शनि गोचर / साढ़े साती",
      guruLabel: "गुरु गोचर",
      choghadiyaBtn: "16 वैदिक चौघड़िया",
      choghadiyaTitle: "16 वैदिक चौघड़िया मुहूर्त (अमृत, शुभ, लाभ, चर, रोग, काल, उद्वेग)",
      choghadiyaDesc: "सूर्योदय और सूर्यास्त के सटीक खगोलीय विभाजन अनुसार दिन और रात के 16 मुहूर्त।",
      dayChoghadiya: "दिन का चौघड़िया (8 मुहूर्त)",
      nightChoghadiya: "रात्रि का चौघड़िया (8 मुहूर्त)",
      biorhythmBtn: "24-घंटे का कॉस्मिक बायोरिदम",
      biorhythmTitle: "24-घंटे की महाजागतिक ऊर्जा बायोरिदम तरंग",
      biorhythmDesc: "होरा, चौघड़िया और अष्टकवर्ग के संयुक्त सूचकांक से आपकी दैनिक ऊर्जा में परिवर्तन।",
      panchakTitle: "वैदिक पंचक स्थिति",
      ashtakavargaTitle: "पराशर अष्टकवर्ग गोचर बल",
      numerologySynergyTitle: "दैनिक अंकशास्त्र व वार स्वामी सामंजस्य (Client §3.5)",
      dualTransitTitle: "द्वैत गोचर विश्लेषण (चंद्र मन + लग्न भौतिक फल)",
      clientRulesTitle: "शास्त्रीय राशि वर्गीकरण व गुण (01.pdf)",
      drishtiTitle: "चंद्र गोचर पर ग्रहों की दृष्टि व विशेष योग",
      selectLagna: "जन्म लग्न चुनें",
      prohibitedLabel: "वर्जित कार्य",
      chandrashtamaAlertTitle: "⚠️ अष्टम चंद्र गोचर (चंद्राष्टम) सावधानी",
      vedhaAlertTitle: "गोचर वेध (बाधा) सक्रिय",
      moonTransitHeading: "चंद्र गोचर (मानसिक स्थिति)",
      lagnaTransitHeading: "लग्न गोचर (भौतिक घटनाएं व फल)",
      houseTransitSuffix: "वां भाव गोचर",
      mulank: "आपका मूलांक",
      bhagyank: "भाग्यांक",
      ruler: "स्वामी ग्रह",
      dayHarmony: "दिन से संबंध",
      savTitle: "सर्वाष्टकवर्ग (SAV)",
      savHint: "28+ बिंदु अत्यधिक शुभ",
      bavTitle: "चंद्र भिन्नाष्टकवर्ग (BAV)",
      bavHint: "4+ बिंदु मानसिक बल",
      kpSubLord: "केपी सब-लॉर्ड (KP Sub-Lord)",
      remedyLabel: "उपाय",
      collapseRules: "संक्षेप करें",
      viewAllRules: "सभी 15 देखें",
      calculatingTitle: "चंद्र गोचर की गणना की जा रही है...",
      calculatingSub: "स्विस एफेमेरिस द्वारा सूक्ष्म गणना जारी है",
      retryBtn: "पुनः प्रयास करें",
      linkCopiedToast: "लिंक कॉपी हो गया!",
      mantraCopiedToast: "बीज मंत्र कॉपी हो गया!",
      directionEast: "पूर्व",
      directionWest: "पश्चिम",
      directionNorth: "उत्तर",
      directionSouth: "दक्षिण",
    },
    en: {
      title: "Daily Horoscope",
      subtitle: "Precision Vedic Moon Transit (Gochar), 24 Planetary Horas & Navatara Bala",
      tag: "100% In-House Astrological Engine • Zero 3rd-Party APIs • Classical Authenticity",
      yesterday: "Yesterday",
      today: "Today",
      tomorrow: "Tomorrow",
      selectDate: "Select Date",
      panchangTitle: "Today's Vedic Panchang",
      tithi: "Tithi",
      nakshatra: "Nakshatra",
      pada: "Pada",
      yoga: "Yoga",
      karana: "Karana",
      vara: "Vara (Day)",
      moonPosition: "Moon Transit",
      sunSign: "Sun Sign",
      abhijit: "Abhijit Muhurat (Auspicious)",
      rahuKaal: "Rahu Kaal (Caution Window)",
      allSigns: "12 Zodiac Signs",
      clickSignHint: "Click any sign to view today's transit prediction",
      transitScore: "Gochar Transit Score",
      overall: "Overall Impact",
      vedicGocharIndex: "Vedic Gochar Index",
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
      accuracyDesc: "Calculated strictly with Swiss Ephemeris 2.10 sidereal coordinates using Lahiri Ayanamsha, Moon transit houses, classical Gochar Vedha, and 24 planetary horas.",
      consultPrompt: "Want a detailed birth chart remedy for doshas and dasha?",
      consultCta: "Consult Verified Astrologers for In-depth Kundli Reading",
      share: "Share Horoscope",
      horaBtn: "View 24-Hour Planetary Horas",
      horaTitle: "24-Hour Planetary Hora Timeline",
      horaDesc: "24 Planetary Horas calculated from local sunrise. Initiate important ventures during auspicious horas for optimal success.",
      dayHoras: "Daytime Horas (12 Horas)",
      nightHoras: "Nighttime Horas (12 Horas)",
      horaSuffix: "Hora",
      personalizeBtn: "Personalize",
      personalizeTitle: "Personalize with Your Birth Nakshatra",
      personalizeSub: "Discover your exact Navatara Tara Bala, personal score boost, and birth-star remedies for today's planetary transit.",
      selectNakshatra: "Select Birth Nakshatra",
      clearPersonalize: "Reset",
      personalizeStep1: "1. Select Birth Star (Nakshatra):",
      personalizeStep2: "2. Birth Date & Time (Numerology & Chart):",
      personalizeStep3: "3. Birth Lagna (For Dual Transit Analysis):",
      birthDatePlaceholder: "Birth Date",
      birthTimePlaceholder: "Birth Time",
      personalizedProfileTitle: "Personalized Nakshatra Profile",
      lord: "Lord",
      deity: "Deity",
      tree: "Sacred Tree",
      taraBalaBadge: "Navatara Bala",
      taraGuidanceLabel: "Tara Bala Guidance",
      dishaShoolaTitle: "Disha Shoola (Travel Direction)",
      dishaRemedyTitle: "Travel Shastra Remedy",
      favorableChandraTitle: "Chandra Bala Favorable Signs Today",
      beejMantraTitle: "Sign Lord Vedic Beej Mantra",
      charityTitle: "Recommended Charity & Dana Today",
      copyMantra: "Copy Mantra",
      copied: "Copied!",
      sadeSatiLabel: "Saturn Transit / Sade Sati",
      guruLabel: "Jupiter Transit",
      choghadiyaBtn: "16 Vedic Choghadiyas",
      choghadiyaTitle: "16 Vedic Choghadiya Muhurats (Amrit, Shubh, Labh, Char, Rog, Kaal, Udveg)",
      choghadiyaDesc: "Exact division of daylight and nighttime into 16 auspicious & challenging periods.",
      dayChoghadiya: "Daytime Choghadiyas (8 Periods)",
      nightChoghadiya: "Nighttime Choghadiyas (8 Periods)",
      biorhythmBtn: "24h Cosmic Biorhythm",
      biorhythmTitle: "24-Hour Cosmic Biorhythm Energy Timeline",
      biorhythmDesc: "Hour-by-hour vital cosmic energy index synthesized from Hora, Choghadiya & Ashtakavarga.",
      panchakTitle: "Vedic Panchak Status",
      ashtakavargaTitle: "Parashara Ashtakavarga Transit Strength",
      numerologySynergyTitle: "Daily Numerology & Day Lord Synergy (Client §3.5)",
      dualTransitTitle: "Dual Transit Analysis (Moon Mind + Lagna Manifestation)",
      clientRulesTitle: "Client Classical Sign Classifications (01.pdf)",
      drishtiTitle: "Planetary Aspects & Yogas on Transit Moon",
      selectLagna: "Select Birth Lagna (Ascendant)",
      prohibitedLabel: "Caution",
      chandrashtamaAlertTitle: "⚠️ Chandrashtama Gochar Caution",
      vedhaAlertTitle: "Gochar Vedha Active",
      moonTransitHeading: "Moon Transit (Mind & Emotion)",
      lagnaTransitHeading: "Lagna Transit (Physical Events)",
      houseTransitSuffix: "House ",
      mulank: "Mulank",
      bhagyank: "Bhagyank",
      ruler: "Ruler",
      dayHarmony: "Day Harmony",
      savTitle: "Sarvashtakavarga (SAV)",
      savHint: "28+ points is favorable",
      bavTitle: "Moon Bhinnashtakavarga",
      bavHint: "4+ bindus is protective",
      kpSubLord: "KP Nakshatra Sub-Lord",
      remedyLabel: "Remedy",
      collapseRules: "Collapse",
      viewAllRules: "View All 15",
      calculatingTitle: "Calculating Moon Gochar Positions...",
      calculatingSub: "Astronomical sub-second computation in progress",
      retryBtn: "Retry Calculation",
      linkCopiedToast: "Link copied to clipboard!",
      mantraCopiedToast: "Mantra copied to clipboard!",
      directionEast: "East",
      directionWest: "West",
      directionNorth: "North",
      directionSouth: "South",
    },
  }[language];

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t.linkCopiedToast);
    }
  };

  const handleCopyMantra = (mantraText: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(mantraText);
      setCopiedMantra(true);
      toast.success(t.mantraCopiedToast);
      setTimeout(() => setCopiedMantra(false), 2500);
    }
  };

  const directionDisplay = React.useMemo(() => {
    if (!activeSignData?.favorable_direction) return "";
    const dir = activeSignData.favorable_direction.toLowerCase();
    if (dir.includes("east") || dir.includes("পূর্ব") || dir.includes("पूर्व")) return t.directionEast;
    if (dir.includes("west") || dir.includes("পশ্চিম") || dir.includes("पश्चिम")) return t.directionWest;
    if (dir.includes("north") || dir.includes("উত্তর") || dir.includes("उत्तर")) return t.directionNorth;
    if (dir.includes("south") || dir.includes("দক্ষিণ") || dir.includes("दक्षिण")) return t.directionSouth;
    return activeSignData.favorable_direction;
  }, [activeSignData?.favorable_direction, t]);

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

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d6b7a2] bg-[#fbf1e7]/80 px-3.5 py-1 text-xs font-semibold text-[#8c5035] shadow-xs backdrop-blur-xs mb-3">
              <Sparkles className="size-3.5 text-[#b06d4e]" />
              <span>{t.tag}</span>
            </div>

            <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#4D4664]">
              {t.title}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#6f637b] leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* Pricing coin pill banner */}
          {horoscopeFeature && (
            <div className="mb-6 flex justify-center">
              <FeatureCoinBadge
                feature={horoscopeFeature}
                walletBalance={walletBalance}
                language={language}
              />
            </div>
          )}

          {/* Toolbar: Language Switcher + Date Navigation */}
          <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border border-[#ebd7c8] bg-[#fbf5ee]/90 p-3 sm:p-4 shadow-sm backdrop-blur-xs">
            
            {/* Left: Quick Date Preset Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center sm:justify-start">
              <button
                type="button"
                onClick={() => setSelectedDate(yesterdayStr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedDate === yesterdayStr
                    ? "bg-[#b06d4e] text-white shadow-xs"
                    : "bg-[#f5ece3] text-[#5e5369] hover:bg-[#ebdccf]"
                }`}
              >
                {t.yesterday}
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate(todayStr)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedDate === todayStr
                    ? "bg-[#b06d4e] text-white shadow-xs ring-2 ring-[#b06d4e]/30"
                    : "bg-[#f5ece3] text-[#5e5369] hover:bg-[#ebdccf]"
                }`}
              >
                {t.today}
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate(tomorrowStr)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedDate === tomorrowStr
                    ? "bg-[#b06d4e] text-white shadow-xs"
                    : "bg-[#f5ece3] text-[#5e5369] hover:bg-[#ebdccf]"
                }`}
              >
                {t.tomorrow}
              </button>

              {/* Custom Date Input */}
              <div className="flex items-center gap-1.5 ml-1 sm:ml-2 pl-2 border-l border-[#e2d0bf]">
                <Calendar className="size-3.5 text-[#8c7e97]" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    if (e.target.value) setSelectedDate(e.target.value);
                  }}
                  className="rounded-lg border border-[#e2d0bf] bg-[#fffaf5] px-2 py-1 text-xs text-[#4D4664] focus:outline-none focus:ring-1 focus:ring-[#b06d4e]"
                />
              </div>
            </div>

            {/* Right: Language switch + Personalize Toggle + Refresh & Share */}
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* Personalize Button */}
              <button
                type="button"
                onClick={() => setShowPersonalize(!showPersonalize)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all shadow-2xs ${
                  showPersonalize || selectedNakshatra !== null
                    ? "border-[#b06d4e] bg-[#fbf1e7] text-[#b06d4e] ring-2 ring-[#b06d4e]/20"
                    : "border-[#e2d0bf] bg-[#fbf4ec] text-[#5e5369] hover:text-[#b06d4e]"
                }`}
              >
                <Sparkles className="size-3.5 text-[#b06d4e]" />
                <span>
                  {selectedNakshatra !== null
                    ? language === "bn"
                      ? NAKSHATRA_OPTIONS[selectedNakshatra]?.bn
                      : language === "hi"
                      ? NAKSHATRA_OPTIONS[selectedNakshatra]?.hi
                      : NAKSHATRA_OPTIONS[selectedNakshatra]?.en
                    : t.personalizeBtn}
                </span>
                {showPersonalize ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
              </button>

              {/* Language Selector */}
              <div className="flex items-center rounded-xl border border-[#e2d0bf] bg-[#fbf4ec] p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setLanguage("bn")}
                  className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                    language === "bn" ? "bg-[#b06d4e] text-white shadow-2xs" : "text-[#5e5369] hover:text-[#332c39]"
                  }`}
                >
                  বাংলা
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                    language === "hi" ? "bg-[#b06d4e] text-white shadow-2xs" : "text-[#5e5369] hover:text-[#332c39]"
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                    language === "en" ? "bg-[#b06d4e] text-white shadow-2xs" : "text-[#5e5369] hover:text-[#332c39]"
                  }`}
                >
                  EN
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  fetchHoroscope(
                    selectedDate,
                    language,
                    selectedNakshatra,
                    birthDateInput,
                    birthTimeInput,
                    selectedLagna,
                    activeSignIndex
                  )
                }
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

          {/* Personalization Drawer / Panel */}
          {showPersonalize && (
            <div className="mb-8 rounded-2xl border border-[#d6b7a2] bg-gradient-to-r from-[#fdf7f0] via-[#fbf1e6] to-[#fdf7f0] p-5 shadow-sm transition-all animate-in fade-in slide-in-from-top-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#ebd7c8]">
                <div className="flex items-center gap-2">
                  <UserCheck className="size-5 text-[#b06d4e]" />
                  <div>
                    <h3 className="font-cinzel text-base font-bold text-[#4D4664]">{t.personalizeTitle}</h3>
                    <p className="text-xs text-[#7d7388]">{t.personalizeSub}</p>
                  </div>
                </div>
                {(selectedNakshatra !== null || birthDateInput !== "" || selectedLagna !== null) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedNakshatra(null);
                      setBirthDateInput("");
                      setBirthTimeInput("");
                      setSelectedLagna(null);
                    }}
                    className="text-xs font-semibold text-rose-700 hover:underline"
                  >
                    {t.clearPersonalize}
                  </button>
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Method 1: Direct Nakshatra Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#4D4664] mb-1">
                    {t.personalizeStep1}
                  </label>
                  <select
                    value={selectedNakshatra !== null ? selectedNakshatra : ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? null : Number(e.target.value);
                      setSelectedNakshatra(val);
                    }}
                    className="w-full rounded-xl border border-[#e2d0bf] bg-[#fffaf5] px-3 py-2 text-xs text-[#4D4664] focus:outline-none focus:ring-1 focus:ring-[#b06d4e]"
                  >
                    <option value="">-- {t.selectNakshatra} --</option>
                    {NAKSHATRA_OPTIONS.map((n) => (
                      <option key={n.index} value={n.index}>
                        #{n.index + 1} {language === "bn" ? n.bn : language === "hi" ? n.hi : n.en} ({n.en} • {n.lord})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Method 2: Birth Date & Time */}
                <div>
                  <label className="block text-xs font-bold text-[#4D4664] mb-1">
                    {t.personalizeStep2}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={birthDateInput}
                      onChange={(e) => setBirthDateInput(e.target.value)}
                      placeholder={t.birthDatePlaceholder}
                      className="w-1/2 rounded-xl border border-[#e2d0bf] bg-[#fffaf5] px-2.5 py-1.5 text-xs text-[#4D4664] focus:outline-none focus:ring-1 focus:ring-[#b06d4e]"
                    />
                    <input
                      type="time"
                      value={birthTimeInput}
                      onChange={(e) => setBirthTimeInput(e.target.value)}
                      placeholder={t.birthTimePlaceholder}
                      className="w-1/2 rounded-xl border border-[#e2d0bf] bg-[#fffaf5] px-2.5 py-1.5 text-xs text-[#4D4664] focus:outline-none focus:ring-1 focus:ring-[#b06d4e]"
                    />
                  </div>
                </div>

                {/* Method 3: Birth Lagna Selector for Dual Transit */}
                <div className="md:col-span-2 pt-2 border-t border-[#ebd7c8]/60">
                  <label className="block text-xs font-bold text-[#4D4664] mb-1">
                    {t.personalizeStep3}
                  </label>
                  <select
                    value={selectedLagna !== null ? selectedLagna : ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? null : Number(e.target.value);
                      setSelectedLagna(val);
                    }}
                    className="w-full sm:w-1/2 rounded-xl border border-[#e2d0bf] bg-[#fffaf5] px-3 py-2 text-xs text-[#4D4664] focus:outline-none focus:ring-1 focus:ring-[#b06d4e]"
                  >
                    <option value="">-- {t.selectLagna} --</option>
                    {ZODIAC_LIST.map((z) => (
                      <option key={z.index} value={z.index}>
                        {z.symbol} {language === "bn" ? z.bn : language === "hi" ? z.hi : z.en} ({z.sa} • {z.ruler})
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>
          )}

          {/* Personalized Profile Banner (If generated) */}
          {horoscopeData?.personalized_profile && (
            <div className="mb-8 rounded-2xl border-2 border-[#b06d4e]/40 bg-gradient-to-r from-[#fbf2e7] via-[#f7e6d5] to-[#fbf2e7] p-4 sm:p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-[#b06d4e] text-white shadow-sm">
                    <Sparkles className="size-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs uppercase font-bold text-[#b06d4e] tracking-wider">
                        {t.personalizedProfileTitle}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#b06d4e]/15 text-[#8c4f34] border border-[#b06d4e]/30">
                        {language === "bn"
                          ? horoscopeData.personalized_profile.birth_nakshatra_name_bn
                          : language === "hi"
                          ? horoscopeData.personalized_profile.birth_nakshatra_name_hi || horoscopeData.personalized_profile.birth_nakshatra_name
                          : horoscopeData.personalized_profile.birth_nakshatra_name}{" "}
                        ({horoscopeData.personalized_profile.birth_nakshatra_name})
                      </span>
                    </div>
                    <p className="text-xs text-[#594c65] mt-0.5">
                      {t.lord}: <strong className="text-[#4D4664]">{horoscopeData.personalized_profile.birth_nakshatra_lord}</strong> • {t.deity}: <strong className="text-[#4D4664]">{horoscopeData.personalized_profile.birth_nakshatra_deity}</strong> • {t.tree}: <strong className="text-[#4D4664]">{horoscopeData.personalized_profile.sacred_tree}</strong>
                    </p>
                  </div>
                </div>

                {/* Navatara Tara Bala Badge */}
                <div className="flex items-center gap-3 bg-[#fffaf5] border border-[#e5ccba] rounded-2xl p-3 sm:px-4 shadow-2xs">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-[#8c7e97] uppercase tracking-wider block">
                      {t.taraBalaBadge}
                    </span>
                    <strong className="text-xs text-[#4D4664] block font-cinzel">
                      {language === "bn"
                        ? horoscopeData.personalized_profile.tara_bala.tara_name_bn
                        : language === "hi"
                        ? horoscopeData.personalized_profile.tara_bala.tara_name_hi || horoscopeData.personalized_profile.tara_bala.tara_name
                        : horoscopeData.personalized_profile.tara_bala.tara_name}
                    </strong>
                  </div>
                  <div className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                    horoscopeData.personalized_profile.tara_bala.is_auspicious
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : "bg-amber-100 text-amber-800 border-amber-300"
                  }`}>
                    {horoscopeData.personalized_profile.tara_bala.score_percent}%
                  </div>
                </div>

              </div>

              {/* Tara Guidance Message */}
              <div className="mt-3 pt-3 border-t border-[#ebd0be] text-xs text-[#6e5f7a] flex items-start gap-2">
                <Info className="size-4 text-[#b06d4e] shrink-0 mt-0.5" />
                <p>
                  <strong>{t.taraGuidanceLabel}:</strong>{" "}
                  {language === "bn"
                    ? horoscopeData.personalized_profile.tara_bala.guidance_bn
                    : language === "hi"
                    ? horoscopeData.personalized_profile.tara_bala.guidance_hi || horoscopeData.personalized_profile.tara_bala.guidance
                    : horoscopeData.personalized_profile.tara_bala.guidance}
                </p>
              </div>
            </div>
          )}

          {horoscopeFeature && !horoscopeFeature.enabled && (
            <div className="mb-8">
              <FeatureDisabledAlert
                featureName={t.title}
                language={language}
              />
            </div>
          )}

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

                {/* Muhurat Quick Badges + Horas / Choghadiya / Biorhythm Toggles */}
                <div className="flex items-center gap-2.5 flex-wrap text-xs">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/25">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>{t.abhijit}: <strong className="font-semibold">{horoscopeData.panchang.abhijit_muhurat}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-800 border border-rose-500/25">
                    <AlertTriangle className="size-3.5 text-rose-600" />
                    <span>{t.rahuKaal}: <strong className="font-semibold">{horoscopeData.panchang.rahu_kaal}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowHoras(!showHoras);
                      if (!showHoras) {
                        setShowChoghadiya(false);
                        setShowBiorhythm(false);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-colors font-medium shadow-2xs ${
                      showHoras ? "bg-[#b06d4e] text-white border-[#b06d4e]" : "bg-[#b06d4e]/10 text-[#8c5035] border-[#b06d4e]/30 hover:bg-[#b06d4e]/20"
                    }`}
                  >
                    <Clock className="size-3.5" />
                    <span>{t.horaBtn}</span>
                    {showHoras ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowChoghadiya(!showChoghadiya);
                      if (!showChoghadiya) {
                        setShowHoras(false);
                        setShowBiorhythm(false);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-colors font-medium shadow-2xs ${
                      showChoghadiya ? "bg-[#4D4664] text-white border-[#4D4664]" : "bg-[#4D4664]/10 text-[#4D4664] border-[#4D4664]/30 hover:bg-[#4D4664]/20"
                    }`}
                  >
                    <Sparkles className="size-3.5" />
                    <span>{t.choghadiyaBtn}</span>
                    {showChoghadiya ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBiorhythm(!showBiorhythm);
                      if (!showBiorhythm) {
                        setShowHoras(false);
                        setShowChoghadiya(false);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-colors font-medium shadow-2xs ${
                      showBiorhythm ? "bg-emerald-700 text-white border-emerald-700" : "bg-emerald-600/10 text-emerald-800 border-emerald-600/30 hover:bg-emerald-600/20"
                    }`}
                  >
                    <Activity className="size-3.5" />
                    <span>{t.biorhythmBtn}</span>
                    {showBiorhythm ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                  </button>
                </div>
              </div>

              {/* Vedic Panchak Status Banner (If Active) */}
              {horoscopeData.panchang.panchak?.is_panchak && (
                <div className={`mt-3.5 rounded-xl border p-3 text-xs shadow-2xs ${
                  horoscopeData.panchang.panchak.severity === "high"
                    ? "bg-rose-50/80 border-rose-300 text-rose-950"
                    : horoscopeData.panchang.panchak.severity === "medium"
                    ? "bg-amber-50/80 border-amber-300 text-amber-950"
                    : "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                }`}>
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className={`size-4 shrink-0 mt-0.5 ${
                      horoscopeData.panchang.panchak.severity === "high" ? "text-rose-600" : "text-amber-600"
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="font-bold">
                          {t.panchakTitle}:{" "}
                          {language === "bn"
                            ? horoscopeData.panchang.panchak.panchak_type_bn
                            : language === "hi"
                            ? horoscopeData.panchang.panchak.panchak_type_hi || horoscopeData.panchang.panchak.panchak_type
                            : horoscopeData.panchang.panchak.panchak_type}
                        </strong>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full ${
                          horoscopeData.panchang.panchak.severity === "high" ? "bg-rose-200 text-rose-900" : "bg-amber-200 text-amber-900"
                        }`}>
                          {horoscopeData.panchang.panchak.severity} severity
                        </span>
                      </div>
                      <p className="mt-1 leading-relaxed">
                        {language === "bn"
                          ? horoscopeData.panchang.panchak.description_bn
                          : language === "hi"
                          ? horoscopeData.panchang.panchak.description_hi || horoscopeData.panchang.panchak.description
                          : horoscopeData.panchang.panchak.description}
                      </p>
                      {horoscopeData.panchang.panchak.prohibited_activities?.length > 0 && (
                        <p className="mt-1.5 font-semibold text-rose-800">
                          {t.prohibitedLabel}: {horoscopeData.panchang.panchak.prohibited_activities.join(" • ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

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
                  <span className="text-[10px] text-[#a597b0] block">{t.pada} {horoscopeData.panchang.nakshatra_pada}</span>
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

              {/* Disha Shoola & Chandra Bala Favorable Signs Sub-Row */}
              <div className="mt-3.5 pt-3 border-t border-[#ebd7c8]/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[#6e5f7a]">
                <div className="flex items-center gap-2">
                  <Compass className="size-4 text-[#b06d4e] shrink-0" />
                  <span>
                    <strong>{t.dishaShoolaTitle}:</strong> <span className="font-bold text-rose-700">{horoscopeData.panchang.disha_shoola}</span> — {horoscopeData.panchang.disha_remedy}
                  </span>
                </div>
                {horoscopeData.panchang.favorable_chandra_rashis && horoscopeData.panchang.favorable_chandra_rashis.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[#8c7e97]">{t.favorableChandraTitle}:</span>
                    {horoscopeData.panchang.favorable_chandra_rashis.map((r, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-[#fff7ef] border border-[#edd7c4] text-[#8c5035] font-semibold text-[11px]">
                        {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Interactive 24-Hour Planetary Hora Timeline Drawer */}
          {showHoras && horoscopeData?.panchang.horas && (
            <div className="mb-8 rounded-3xl border border-[#d6b7a2] bg-gradient-to-br from-[#fbf4eb] via-[#f8ebe0] to-[#fbf4eb] p-6 shadow-sm animate-in fade-in slide-in-from-top-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#ebd7c8]">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-[#4D4664] flex items-center gap-2">
                    <Clock className="size-5 text-[#b06d4e]" />
                    <span>{t.horaTitle}</span>
                  </h3>
                  <p className="text-xs text-[#7d7388] mt-0.5">{t.horaDesc}</p>
                </div>

                <div className="flex items-center rounded-xl border border-[#e2d0bf] bg-[#fbf4ec] p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setHoraViewPeriod("day")}
                    className={`px-3 py-1 rounded-lg transition-colors font-semibold ${
                      horaViewPeriod === "day" ? "bg-[#b06d4e] text-white shadow-xs" : "text-[#5e5369]"
                    }`}
                  >
                    ☀️ {t.dayHoras}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHoraViewPeriod("night")}
                    className={`px-3 py-1 rounded-lg transition-colors font-semibold ${
                      horaViewPeriod === "night" ? "bg-[#b06d4e] text-white shadow-xs" : "text-[#5e5369]"
                    }`}
                  >
                    🌙 {t.nightHoras}
                  </button>
                </div>
              </div>

              {/* 12 Horas Grid for Selected Period */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {horoscopeData.panchang.horas
                  .filter((h) => (horaViewPeriod === "day" ? h.is_day : !h.is_day))
                  .map((hora) => (
                    <div
                      key={hora.hora_index}
                      className={`rounded-2xl border p-3.5 transition-all text-xs ${
                        hora.is_auspicious
                          ? "bg-[#fffcf9] border-emerald-500/25 hover:border-emerald-500/50 shadow-2xs"
                          : "bg-[#fffaf5] border-amber-500/25 hover:border-amber-500/50 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-[#4D4664]">
                          {hora.start_time} – {hora.end_time}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            hora.is_auspicious
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : "bg-amber-100 text-amber-800 border-amber-300"
                          }`}
                        >
                          {language === "bn"
                            ? hora.category_bn
                            : language === "hi"
                            ? hora.category_hi || hora.category
                            : hora.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm font-bold text-[#b06d4e] mb-1">
                        <span>
                          #{hora.hora_number}{" "}
                          {language === "bn"
                            ? hora.planet_bn
                            : language === "hi"
                            ? hora.planet_hi || hora.planet
                            : hora.planet}{" "}
                          {t.horaSuffix}
                        </span>
                        <span className="text-xs font-normal text-[#8c7e97]">{hora.planet_sa}</span>
                      </div>

                      <p className="text-[11px] font-medium text-[#4D4664] mb-1">
                        {language === "bn"
                          ? hora.verdict_bn || hora.verdict
                          : language === "hi"
                          ? hora.verdict_hi || hora.verdict
                          : hora.verdict}
                      </p>

                      <p className="text-[10px] leading-relaxed text-[#736881]">
                        {language === "bn"
                          ? hora.best_activities_bn || hora.best_activities
                          : language === "hi"
                          ? hora.best_activities_hi || hora.best_activities
                          : hora.best_activities}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Interactive 16 Vedic Choghadiya Drawer */}
          {showChoghadiya && horoscopeData?.panchang.choghadiya && (
            <div className="mb-8 rounded-3xl border border-[#d6b7a2] bg-gradient-to-br from-[#fbf4eb] via-[#f8ebe0] to-[#fbf4eb] p-6 shadow-sm animate-in fade-in slide-in-from-top-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#ebd7c8]">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-[#4D4664] flex items-center gap-2">
                    <Sparkles className="size-5 text-[#b06d4e]" />
                    <span>{t.choghadiyaTitle}</span>
                  </h3>
                  <p className="text-xs text-[#7d7388] mt-0.5">{t.choghadiyaDesc}</p>
                </div>

                <div className="flex items-center rounded-xl border border-[#e2d0bf] bg-[#fbf4ec] p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setChoghadiyaViewPeriod("day")}
                    className={`px-3 py-1 rounded-lg transition-colors font-semibold ${
                      choghadiyaViewPeriod === "day" ? "bg-[#b06d4e] text-white shadow-xs" : "text-[#5e5369]"
                    }`}
                  >
                    ☀️ {t.dayChoghadiya}
                  </button>
                  <button
                    type="button"
                    onClick={() => setChoghadiyaViewPeriod("night")}
                    className={`px-3 py-1 rounded-lg transition-colors font-semibold ${
                      choghadiyaViewPeriod === "night" ? "bg-[#b06d4e] text-white shadow-xs" : "text-[#5e5369]"
                    }`}
                  >
                    🌙 {t.nightChoghadiya}
                  </button>
                </div>
              </div>

              {/* 8 Choghadiyas Grid for Selected Period */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {horoscopeData.panchang.choghadiya
                  .filter((c: ChoghadiyaItem) => (choghadiyaViewPeriod === "day" ? c.is_day : !c.is_day))
                  .map((chog: ChoghadiyaItem) => (
                    <div
                      key={chog.period_index}
                      className="rounded-2xl border border-[#eedecf] bg-[#fffcf9] p-3.5 transition-all text-xs shadow-2xs hover:border-[#b06d4e]/40"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-[#4D4664]">
                          {chog.start_time} – {chog.end_time}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getChoghadiyaBadgeClass(
                            chog.status
                          )}`}
                        >
                          {chog.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm font-bold text-[#b06d4e] mb-1">
                        <span>
                          {language === "bn" ? chog.name_bn : language === "hi" ? chog.name_hi || chog.name : chog.name}
                        </span>
                        <span className="text-[11px] font-normal text-[#8c7e97]">{chog.ruler_planet}</span>
                      </div>

                      <p className="text-[11px] leading-relaxed text-[#594f63] mt-1">
                        {language === "bn"
                          ? chog.guidance_bn
                          : language === "hi"
                          ? chog.guidance_hi || chog.guidance
                          : chog.guidance}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Interactive 24-Hour Cosmic Biorhythm Drawer */}
          {showBiorhythm && horoscopeData?.biorhythm_timeline && (
            <div className="mb-8 rounded-3xl border border-emerald-600/30 bg-gradient-to-br from-[#f6fcf8] via-[#f0f9f3] to-[#f6fcf8] p-6 shadow-sm animate-in fade-in slide-in-from-top-3">
              <div className="pb-4 border-b border-emerald-600/20">
                <h3 className="font-cinzel text-lg font-bold text-emerald-950 flex items-center gap-2">
                  <Activity className="size-5 text-emerald-700" />
                  <span>{t.biorhythmTitle}</span>
                </h3>
                <p className="text-xs text-emerald-800/80 mt-0.5">{t.biorhythmDesc}</p>
              </div>

              {/* 24-Hour Biorhythm Grid */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
                {horoscopeData.biorhythm_timeline.map((bio: BiorhythmHour) => (
                  <div
                    key={bio.hour}
                    className="rounded-xl border border-emerald-600/20 bg-white/90 p-2.5 text-center text-xs shadow-2xs"
                  >
                    <span className="text-[11px] font-semibold text-[#8c7e97] block">
                      {bio.time_label}
                    </span>
                    <strong className="text-base font-bold text-emerald-900 block my-1">
                      {bio.energy_score}%
                    </strong>
                    <div className="h-1.5 w-full rounded-full bg-stone-200 overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full ${
                          bio.energy_score >= 80
                            ? "bg-emerald-600"
                            : bio.energy_score >= 60
                            ? "bg-blue-600"
                            : bio.energy_score >= 45
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${bio.energy_score}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[#594f63] font-medium block truncate">
                      {language === "bn" ? bio.status_bn : language === "hi" ? bio.status_hi || bio.status : bio.status}
                    </span>
                    <span className="text-[9px] text-[#8c7e97] block">
                      {bio.dominant_graha}
                    </span>
                  </div>
                ))}
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
                {t.clickSignHint}
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
              <p className="font-cinzel text-lg font-bold text-[#4D4664]">{t.calculatingTitle}</p>
              <p className="text-xs text-[#7d7388] mt-1">{t.calculatingSub}</p>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-300 bg-rose-50/70 p-8 text-center">
              <AlertTriangle className="size-8 text-rose-600 mx-auto mb-2" />
              <p className="font-bold text-rose-900">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() =>
                  fetchHoroscope(
                    selectedDate,
                    language,
                    selectedNakshatra,
                    birthDateInput,
                    birthTimeInput,
                    selectedLagna,
                    activeSignIndex
                  )
                }
              >
                {t.retryBtn}
              </Button>
            </div>
          ) : activeSignData ? (
            <div className="space-y-6">
              
              {/* Chandrashtama High-Priority Alert Banner (If Moon in 8th House) */}
              {activeSignData.is_chandrashtama && activeSignData.chandrashtama_advice && (
                <div className="rounded-2xl border-2 border-amber-500/50 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 p-5 shadow-xs animate-pulse">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="size-6 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-cinzel text-base font-bold text-amber-900">
                        {t.chandrashtamaAlertTitle}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
                        {activeSignData.chandrashtama_advice}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Classical Gochar Vedha Alert (If Auspicious house is obstructed) */}
              {activeSignData.vedha_active && activeSignData.vedha_description && (
                <div className="rounded-2xl border border-blue-400/40 bg-blue-50/80 p-4 shadow-2xs">
                  <div className="flex items-start gap-2.5">
                    <Info className="size-5 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-cinzel text-xs font-bold text-blue-900 uppercase tracking-wider">
                        {t.vedhaAlertTitle}
                      </h4>
                      <p className="text-xs text-blue-950 mt-0.5 leading-relaxed">
                        {activeSignData.vedha_description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

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

                      {/* Saturn Sade Sati & Jupiter Status Badges */}
                      <div className="mt-2.5 flex items-center gap-2 flex-wrap text-xs">
                        {activeSignData.sade_sati_status && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#f3e7dc] border border-[#d9c4b2] text-[#6d4d3d] font-semibold text-[11px]">
                            🪐 {t.sadeSatiLabel}: {activeSignData.sade_sati_status}
                          </span>
                        )}
                        {activeSignData.guru_gochar_verdict && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#fbf3db] border border-[#ebd6a4] text-[#73581c] font-semibold text-[11px]">
                            🌟 {t.guruLabel}: {activeSignData.guru_gochar_verdict}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Overall Day Score Wheel / Badge */}
                  <div className="flex items-center gap-4 bg-[#fffaf5] border border-[#ebd7c8] rounded-2xl p-4 sm:px-6 shadow-2xs">
                    <div className="text-right">
                      <span className="text-xs font-semibold text-[#8c7e97] block uppercase tracking-wider">{t.overall}</span>
                      <p className="text-xs text-[#6e6279]">{t.vedicGocharIndex}</p>
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

              {/* Dual Transit Analysis (Moon Mind + Lagna Manifestation) */}
              {horoscopeData?.dual_transit && (
                <div className="rounded-2xl border border-[#c4a482] bg-gradient-to-br from-[#fbf4eb] via-[#f7e9dc] to-[#fbf4eb] p-5 sm:p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5 text-[#8c5035]">
                      <Scale className="size-5 text-[#b06d4e]" />
                      <h3 className="font-cinzel text-base font-bold text-[#4D4664]">{t.dualTransitTitle}</h3>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {horoscopeData.dual_transit.dual_harmony_score}% Harmony
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-xl bg-[#fffcf9] border border-[#f0dfd2] p-3.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#b06d4e]">
                        {t.moonTransitHeading}
                      </span>
                      <p className="text-sm font-bold text-[#4D4664] mt-0.5">
                        {language === "bn"
                          ? `${horoscopeData.dual_transit.moon_transit_house}ম ভাব গোচর`
                          : language === "hi"
                          ? `${horoscopeData.dual_transit.moon_transit_house}वां भाव गोचर`
                          : `House ${horoscopeData.dual_transit.moon_transit_house}`}
                      </p>
                      <p className="mt-1 text-[#6e5f7a]">
                        {language === "bn"
                          ? horoscopeData.dual_transit.emotional_outlook_bn
                          : language === "hi"
                          ? horoscopeData.dual_transit.emotional_outlook_hi || horoscopeData.dual_transit.emotional_outlook
                          : horoscopeData.dual_transit.emotional_outlook}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#fffcf9] border border-[#f0dfd2] p-3.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#b06d4e]">
                        {t.lagnaTransitHeading}
                      </span>
                      <p className="text-sm font-bold text-[#4D4664] mt-0.5">
                        {language === "bn"
                          ? `${horoscopeData.dual_transit.lagna_transit_house}ম ভাব গোচর`
                          : language === "hi"
                          ? `${horoscopeData.dual_transit.lagna_transit_house}वां भाव गोचर`
                          : `House ${horoscopeData.dual_transit.lagna_transit_house}`}
                      </p>
                      <p className="mt-1 text-[#6e5f7a]">
                        {language === "bn"
                          ? horoscopeData.dual_transit.physical_event_outlook_bn
                          : language === "hi"
                          ? horoscopeData.dual_transit.physical_event_outlook_hi || horoscopeData.dual_transit.physical_event_outlook
                          : horoscopeData.dual_transit.physical_event_outlook}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[#594f63] font-medium border-t border-[#ebd0be] pt-2.5">
                    {language === "bn"
                      ? horoscopeData.dual_transit.synthesis_verdict_bn
                      : language === "hi"
                      ? horoscopeData.dual_transit.synthesis_verdict_hi || horoscopeData.dual_transit.synthesis_verdict
                      : horoscopeData.dual_transit.synthesis_verdict}
                  </p>
                </div>
              )}

              {/* Numerology Synergy Card (Client §3.5 NEW NUMRO) */}
              {horoscopeData?.numerology_synergy && (
                <div className="rounded-2xl border border-[#ebd7c8] bg-gradient-to-r from-[#fefbf7] via-[#fbf2e7] to-[#fefbf7] p-5 sm:p-6 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-[#b06d4e]">
                      <Coins className="size-4" />
                      <h3 className="font-cinzel text-base font-bold text-[#4D4664]">{t.numerologySynergyTitle}</h3>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {horoscopeData.numerology_synergy.synergy_score_pct}% Match
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
                    <div className="rounded-xl bg-[#fff] border border-[#f0dfd2] p-2.5 text-center">
                      <span className="text-[#8c7e97] block">{t.mulank}</span>
                      <strong className="text-lg text-[#b06d4e]">{horoscopeData.numerology_synergy.mulank}</strong>
                    </div>
                    <div className="rounded-xl bg-[#fff] border border-[#f0dfd2] p-2.5 text-center">
                      <span className="text-[#8c7e97] block">{t.bhagyank}</span>
                      <strong className="text-lg text-[#4D4664]">{horoscopeData.numerology_synergy.bhagyank}</strong>
                    </div>
                    <div className="rounded-xl bg-[#fff] border border-[#f0dfd2] p-2.5 text-center">
                      <span className="text-[#8c7e97] block">{t.ruler}</span>
                      <strong className="text-sm text-[#4D4664]">{horoscopeData.numerology_synergy.ruling_planet}</strong>
                    </div>
                    <div className="rounded-xl bg-[#fff] border border-[#f0dfd2] p-2.5 text-center">
                      <span className="text-[#8c7e97] block">{t.dayHarmony}</span>
                      <strong className="text-sm text-[#b06d4e]">
                        {language === "bn"
                          ? horoscopeData.numerology_synergy.day_relationship_bn
                          : language === "hi"
                          ? horoscopeData.numerology_synergy.day_relationship_hi || horoscopeData.numerology_synergy.day_relationship
                          : horoscopeData.numerology_synergy.day_relationship}
                      </strong>
                    </div>
                  </div>
                  <p className="text-xs text-[#594f63] leading-relaxed">
                    {language === "bn"
                      ? horoscopeData.numerology_synergy.advice_bn
                      : language === "hi"
                      ? horoscopeData.numerology_synergy.advice_hi || horoscopeData.numerology_synergy.advice
                      : horoscopeData.numerology_synergy.advice}
                  </p>
                </div>
              )}

              {/* Ashtakavarga & KP Nakshatra Sub-Lord Transit Card */}
              {activeSignData.ashtakavarga && (
                <div className="rounded-2xl border border-[#ebd7c8] bg-[#fbf5ee] p-5 sm:p-6 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-[#8c5035]">
                      <Award className="size-5 text-[#b06d4e]" />
                      <h3 className="font-cinzel text-base font-bold text-[#4D4664]">{t.ashtakavargaTitle}</h3>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {language === "bn"
                        ? activeSignData.ashtakavarga.strength_grade_bn
                        : language === "hi"
                        ? activeSignData.ashtakavarga.strength_grade_hi || activeSignData.ashtakavarga.strength_grade
                        : activeSignData.ashtakavarga.strength_grade}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="rounded-xl bg-[#fffaf5] border border-[#edd7c4] p-3 text-center">
                      <span className="text-[#8c7e97] block">{t.savTitle}</span>
                      <strong className="text-xl text-[#b06d4e]">{activeSignData.ashtakavarga.sarvashtakavarga_points} / 56</strong>
                      <span className="text-[10px] text-[#7d7388] block">{t.savHint}</span>
                    </div>
                    <div className="rounded-xl bg-[#fffaf5] border border-[#edd7c4] p-3 text-center">
                      <span className="text-[#8c7e97] block">{t.bavTitle}</span>
                      <strong className="text-xl text-[#4D4664]">{activeSignData.ashtakavarga.moon_bhinnashtakavarga_points} / 8</strong>
                      <span className="text-[10px] text-[#7d7388] block">{t.bavHint}</span>
                    </div>
                    <div className="rounded-xl bg-[#fffaf5] border border-[#edd7c4] p-3 text-center">
                      <span className="text-[#8c7e97] block">{t.kpSubLord}</span>
                      <strong className="text-sm text-[#4D4664] block mt-1">
                        {activeSignData.nakshatra_pada_shift?.kp_sub_lord || "Active"}
                      </strong>
                      <span className="text-[10px] text-[#7d7388] block">
                        Lord: {activeSignData.nakshatra_pada_shift?.nakshatra_lord || "Active"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Real-time Planetary Aspects & Yogas on Moon */}
              {activeSignData.planetary_drishtis && activeSignData.planetary_drishtis.length > 0 && (
                <div className="rounded-2xl border border-[#ebd7c8] bg-[#fbf5ee] p-5 sm:p-6 shadow-2xs">
                  <div className="flex items-center gap-2 text-[#8c5035] mb-3">
                    <Eye className="size-5 text-[#b06d4e]" />
                    <h3 className="font-cinzel text-base font-bold text-[#4D4664]">{t.drishtiTitle}</h3>
                  </div>
                  <div className="space-y-3">
                    {activeSignData.planetary_drishtis.map((d, idx) => (
                      <div key={idx} className="rounded-xl bg-[#fffaf5] border border-[#eedecf] p-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#4D4664]">
                            {language === "bn"
                              ? d.yoga_name_bn
                              : language === "hi"
                              ? d.yoga_name_hi || d.yoga_name
                              : d.yoga_name}{" "}
                            ({d.aspecting_planet})
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            d.is_positive ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}>
                            {d.aspect_type}
                          </span>
                        </div>
                        <p className="mt-1 text-[#594f63] leading-relaxed">
                          {language === "bn"
                            ? d.impact_bn
                            : language === "hi"
                            ? d.impact_hi || d.impact
                            : d.impact}
                        </p>
                        {d.classical_remedy && (
                          <p className="mt-1.5 text-[11px] font-semibold text-[#8c5035]">
                            <strong>{t.remedyLabel}:</strong>{" "}
                            {language === "bn"
                              ? d.classical_remedy_bn
                              : language === "hi"
                              ? d.classical_remedy_hi || d.classical_remedy
                              : d.classical_remedy}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Client's 15 Classifications (01.pdf) Grid */}
              {activeSignData.client_classifications?.classifications && (
                <div className="rounded-2xl border border-[#ebd7c8] bg-[#fbf3e9] p-5 sm:p-6 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-[#8c5035]">
                      <BookOpen className="size-5 text-[#b06d4e]" />
                      <h3 className="font-cinzel text-base font-bold text-[#4D4664]">{t.clientRulesTitle}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowClientRules(!showClientRules)}
                      className="text-xs font-semibold text-[#b06d4e] hover:underline flex items-center gap-1"
                    >
                      <span>{showClientRules ? t.collapseRules : t.viewAllRules}</span>
                      {showClientRules ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                    {activeSignData.client_classifications.classifications
                      .slice(0, showClientRules ? 15 : 6)
                      .map((cl: any, idx: number) => (
                        <div key={idx} className="rounded-xl bg-[#fff] border border-[#eedecf] p-2.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7e97] block">
                            {cl.label}
                          </span>
                          <strong className="text-xs text-[#4D4664] block mt-0.5">{cl.value}</strong>
                          <p className="text-[11px] text-[#6e5f7a] mt-1 line-clamp-2">{cl.definition}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

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

              {/* Lucky Elements + Vedic Remedy & Beej Mantra Row */}
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
                    <div className="flex items-center justify-between py-1.5 border-b border-[#ebd7c8]">
                      <span className="text-[#8c7e97] font-medium">{t.direction}</span>
                      <strong className="text-[#4D4664] font-semibold">{directionDisplay}</strong>
                    </div>
                    {activeSignData.tara_bala && (
                      <div className="flex items-center justify-between py-1.5">
                        <span className="text-[#8c7e97] font-medium">{t.taraBalaBadge}</span>
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] border ${
                          activeSignData.tara_bala.is_auspicious ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-amber-100 text-amber-800 border-amber-300"
                        }`}>
                          {language === "bn"
                            ? activeSignData.tara_bala.tara_name_bn
                            : language === "hi"
                            ? activeSignData.tara_bala.tara_name_hi || activeSignData.tara_bala.tara_name
                            : activeSignData.tara_bala.tara_name}{" "}
                          ({activeSignData.tara_bala.score_percent}%)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vedic Remedy, Beej Mantra & Dana Card (From client's resources) */}
                <div className="lg:col-span-2 rounded-2xl border border-[#d8bead] bg-gradient-to-br from-[#f8ebe0] via-[#f7e7da] to-[#f8ebe0] p-5 sm:p-6 shadow-2xs">
                  <div className="flex items-center gap-2 text-[#8c5035] mb-2.5">
                    <ShieldCheck className="size-5 text-[#b06d4e]" />
                    <h3 className="font-cinzel text-base font-bold text-[#4D4664]">
                      {t.remedyTitle}
                    </h3>
                  </div>
                  
                  {/* Classical Remedy */}
                  <p className="text-sm leading-relaxed text-[#594f63] font-medium mb-3">
                    {activeSignData.remedy}
                  </p>

                  {/* Beej Mantra Box */}
                  {activeSignData.beej_mantra && (
                    <div className="mt-3 rounded-xl border border-[#e5ccba] bg-[#fffaf5] p-3 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#b06d4e] block">
                          {t.beejMantraTitle}
                        </span>
                        <p className="font-serif text-sm font-bold text-[#4D4664] mt-0.5">
                          {activeSignData.beej_mantra}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyMantra(activeSignData.beej_mantra!)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#d6bca8] bg-[#fbf3e9] text-[#8c5035] hover:bg-[#b06d4e] hover:text-white transition-colors text-xs font-semibold shrink-0"
                      >
                        {copiedMantra ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                        <span>{copiedMantra ? t.copied : t.copyMantra}</span>
                      </button>
                    </div>
                  )}

                  {/* Specific Charity Dana Box */}
                  {activeSignData.charity_dana && (
                    <div className="mt-3 rounded-xl border border-[#edd7c4] bg-[#fdf8f2] p-3 text-xs text-[#594f63]">
                      <span className="font-bold text-[#8c5035] block mb-0.5">
                        {t.charityTitle}:
                      </span>
                      <p>{activeSignData.charity_dana}</p>
                    </div>
                  )}
                  
                  {/* CTA Banner inside remedy */}
                  <div className="mt-4 pt-4 border-t border-[#e2cdbf] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <span className="text-xs text-[#7d7088]">
                      {t.consultPrompt}
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

      <FeatureCoinModal
        open={coinModalOpen}
        onClose={() => setCoinModalOpen(false)}
        featureName={horoscopeFeature?.name || t.title}
        requiredCoins={horoscopeFeature?.coins ?? 0}
        walletBalance={walletBalance}
        reason={coinModalReason}
        language={language}
      />

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
