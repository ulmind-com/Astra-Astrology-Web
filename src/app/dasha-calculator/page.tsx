"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  RotateCcw,
  RefreshCw,
  Sliders,
  ChevronRight,
  Sun,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  User,
  Compass,
  AlertTriangle,
  Lightbulb,
  HeartHandshake,
  Layers,
  Flame,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { astrologyApi } from "@/lib/api";
import { LocationPickerModal } from "@/components/astrology/location-picker-modal";
import { KPChartViewer } from "@/components/astrology/kp-chart-viewer";
import {
  KP_PLANET_NAMES,
  KP_LOCALIZED_DASHA_INSIGHTS,
} from "@/lib/kp-translations";
import { useAuth } from "@/providers/auth-provider";
import { useProfile } from "@/hooks/use-profile";
import type {
  AstrologyLanguage,
  AyanamsaType,
  KPCalculatePayload,
  KPCalculateResult,
  KPDashaPeriod,
  UserProfile,
  UserPublic,
} from "@/types";

// Planet abbreviations and icons matching AppliedJyotish screenshot
const PLANET_PILLS: Array<{
  key: string;
  code: string;
  nameEn: string;
  nameBn: string;
  nameHi: string;
  color: string;
  bgClass: string;
}> = [
  { key: "Asc", code: "Asc", nameEn: "Ascendant", nameBn: "লগ্ন", nameHi: "लग्न", color: "#eab308", bgClass: "bg-amber-100 border-amber-400 text-amber-900" },
  { key: "Sun", code: "Su", nameEn: "Sun", nameBn: "সূর্য", nameHi: "सूर्य", color: "#f97316", bgClass: "bg-orange-100 border-orange-400 text-orange-900" },
  { key: "Moon", code: "Mo", nameEn: "Moon", nameBn: "চন্দ্র", nameHi: "चंद्र", color: "#64748b", bgClass: "bg-slate-100 border-slate-400 text-slate-900" },
  { key: "Mercury", code: "Me", nameEn: "Mercury", nameBn: "বুধ", nameHi: "बुध", color: "#10b981", bgClass: "bg-emerald-100 border-emerald-400 text-emerald-900" },
  { key: "Venus", code: "Ve", nameEn: "Venus", nameBn: "শুক্র", nameHi: "शुक्र", color: "#eab308", bgClass: "bg-yellow-100 border-yellow-400 text-yellow-900" },
  { key: "Mars", code: "Ma", nameEn: "Mars", nameBn: "মঙ্গল", nameHi: "मंगल", color: "#ef4444", bgClass: "bg-red-100 border-red-400 text-red-900" },
  { key: "Jupiter", code: "Ju", nameEn: "Jupiter", nameBn: "বৃহস্পতি", nameHi: "बृहस्पति", color: "#f59e0b", bgClass: "bg-amber-100 border-amber-400 text-amber-900" },
  { key: "Saturn", code: "Sa", nameEn: "Saturn", nameBn: "শনি", nameHi: "शनि", color: "#8b5cf6", bgClass: "bg-purple-100 border-purple-400 text-purple-900" },
  { key: "Rahu", code: "Ra", nameEn: "Rahu", nameBn: "রাহু", nameHi: "राहु", color: "#6366f1", bgClass: "bg-indigo-100 border-indigo-400 text-indigo-900" },
  { key: "Ketu", code: "Ke", nameEn: "Ketu", nameBn: "কেতু", nameHi: "केतु", color: "#d97706", bgClass: "bg-stone-100 border-stone-400 text-stone-900" },
];

// Helper to format date strings to DD-MM-YYYY
function formatDateDisplay(dStr: string): string {
  if (!dStr) return "—";
  if (dStr.includes("-")) {
    const parts = dStr.split("-");
    if (parts[0].length === 4) {
      // YYYY-MM-DD -> DD-MM-YYYY
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dStr;
  }
  if (dStr.includes("/")) {
    const parts = dStr.split("/");
    if (parts[2]?.length === 4) {
      return `${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}-${parts[2]}`;
    }
  }
  return dStr;
}

// Decorative Gold Diamond Divider matching Screenshots
function GoldDiamondDivider() {
  return (
    <div className="relative flex items-center justify-center my-4">
      <div className="h-[2px] w-48 sm:w-64 bg-gradient-to-r from-transparent via-amber-400 to-transparent relative flex items-center justify-between">
        <span className="size-2 rotate-45 border-2 border-amber-500 bg-white dark:bg-stone-900" />
        <span className="size-2 rotate-45 border-2 border-amber-500 bg-white dark:bg-stone-900" />
      </div>
    </div>
  );
}

export default function DashaCalculatorPage() {
  const { user, isSignedIn } = useAuth();
  const { data: profile } = useProfile({ enabled: isSignedIn });

  // Language state
  const [language, setLanguage] = React.useState<AstrologyLanguage>("bn");

  // Form State
  const [name, setName] = React.useState("");
  const [gender, setGender] = React.useState<"male" | "female" | "other">("male");

  // Mandatory DOB (DD-MM-YYYY)
  const [day, setDay] = React.useState("");
  const [month, setMonth] = React.useState("");
  const [year, setYear] = React.useState("");

  // Optional Time (HH:MM:SS AM/PM)
  const [hour, setHour] = React.useState("");
  const [minute, setMinute] = React.useState("");
  const [second, setSecond] = React.useState("");
  const [period, setPeriod] = React.useState<"AM" | "PM">("PM");

  // Place & Coordinates
  const [place, setPlace] = React.useState("");
  const [latitude, setLatitude] = React.useState<number | null>(null);
  const [longitude, setLongitude] = React.useState<number | null>(null);
  const [timezone, setTimezone] = React.useState("5.5");
  const [ayanamsa, setAyanamsa] = React.useState<AyanamsaType>("krishnamurti");
  const [isMapModalOpen, setIsMapModalOpen] = React.useState(false);
  const [showAdvance, setShowAdvance] = React.useState(false);

  // Loading & Result
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<KPCalculateResult | null>(null);

  // Stepper Drilldown States: 1 = Mahadasha, 2 = Antar Dasha, 3 = Pratyantar Dasha
  const [activeStep, setActiveStep] = React.useState<1 | 2 | 3>(1);
  const [selectedMD, setSelectedMD] = React.useState<KPDashaPeriod | null>(null);
  const [selectedAD, setSelectedAD] = React.useState<KPDashaPeriod | null>(null);

  // Active Planet Insights Pill
  const [selectedPlanetInsight, setSelectedPlanetInsight] = React.useState<string>("Venus");

  const resultsRef = React.useRef<HTMLDivElement>(null);
  const hasAutoFilled = React.useRef(false);

  // Focus navigation refs
  const dayRef = React.useRef<HTMLInputElement>(null);
  const monthRef = React.useRef<HTMLInputElement>(null);
  const yearRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);

  // Helper: auto-fill from logged-in user profile
  const populateFromProfileData = React.useCallback(
    (p: UserProfile, u?: UserPublic | null) => {
      const fullName =
        p.full_name ||
        [p.first_name, p.middle_name, p.last_name].filter(Boolean).join(" ").trim() ||
        u?.full_name ||
        "";
      if (fullName) setName(fullName);

      if (p.gender) {
        const g = p.gender.toLowerCase();
        if (g === "female") setGender("female");
        else if (g === "other") setGender("other");
        else setGender("male");
      }

      const b = p.birth;
      if (b) {
        if (b.date_of_birth) {
          const isoMatch = b.date_of_birth.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
          if (isoMatch) {
            setYear(isoMatch[1]);
            setMonth(isoMatch[2].padStart(2, "0"));
            setDay(isoMatch[3].padStart(2, "0"));
          } else {
            const dmyMatch = b.date_of_birth.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
            if (dmyMatch) {
              setDay(dmyMatch[1].padStart(2, "0"));
              setMonth(dmyMatch[2].padStart(2, "0"));
              setYear(dmyMatch[3]);
            }
          }
        }

        if (b.time_of_birth) {
          const timeMatch = b.time_of_birth.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?/i);
          if (timeMatch) {
            const rawHour = parseInt(timeMatch[1], 10);
            const rawMin = timeMatch[2];
            const rawSec = timeMatch[3] || "00";
            const periodStr = timeMatch[4]?.toUpperCase() as "AM" | "PM" | undefined;

            if (periodStr) {
              setHour(String(rawHour).padStart(2, "0"));
              setMinute(rawMin);
              setSecond(rawSec);
              setPeriod(periodStr);
            } else {
              if (rawHour >= 12) {
                setPeriod("PM");
                const h12 = rawHour > 12 ? rawHour - 12 : 12;
                setHour(String(h12).padStart(2, "0"));
              } else {
                setPeriod("AM");
                const h12 = rawHour === 0 ? 12 : rawHour;
                setHour(String(h12).padStart(2, "0"));
              }
              setMinute(rawMin);
              setSecond(rawSec);
            }
          }
        }

        const placeName = b.place || [b.city, b.state, b.country].filter(Boolean).join(", ");
        if (placeName) {
          setPlace(placeName);
        }
        if (b.latitude != null && b.longitude != null) {
          setLatitude(Number(b.latitude));
          setLongitude(Number(b.longitude));
        }
        if (b.timezone != null) {
          setTimezone(String(b.timezone));
        }
      }
    },
    [],
  );

  React.useEffect(() => {
    if (profile && !hasAutoFilled.current) {
      populateFromProfileData(profile, user);
      hasAutoFilled.current = true;
    }
  }, [profile, user, populateFromProfileData]);

  // Form Reset
  const handleReset = () => {
    setName("");
    setGender("male");
    setDay("");
    setMonth("");
    setYear("");
    setHour("");
    setMinute("");
    setSecond("");
    setPeriod("PM");
    setPlace("");
    setLatitude(null);
    setLongitude(null);
    setTimezone("5.5");
    setResult(null);
    setActiveStep(1);
    setSelectedMD(null);
    setSelectedAD(null);
    toast.info(
      language === "bn"
        ? "ফর্ম খালি করা হয়েছে।"
        : language === "hi"
        ? "फ़ॉर्म साफ़ कर दिया गया है।"
        : "Form cleared.",
    );
  };

  // Re-sync with Profile
  const handleReloadFromProfile = () => {
    if (profile) {
      populateFromProfileData(profile, user);
      toast.success(
        language === "bn"
          ? "প্রোফাইল থেকে তথ্য পুনরায় লোড করা হয়েছে।"
          : language === "hi"
          ? "प्रोफ़ाइल से विवरण पुनः लोड किया गया।"
          : "Loaded details from your profile.",
      );
    }
  };

  // Navigation keydowns
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    prevRef?: React.RefObject<HTMLInputElement | null>,
  ) => {
    if (e.key === "Backspace" && (e.target as HTMLInputElement).value === "" && prevRef?.current) {
      prevRef.current.focus();
    }
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 31) val = "31";
    setDay(val);
    if (val.length === 2 && monthRef.current) monthRef.current.focus();
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 12) val = "12";
    setMonth(val);
    if (val.length === 2 && yearRef.current) yearRef.current.focus();
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.slice(0, 4);
    setYear(val);
    if (val.length === 4 && hourRef.current) hourRef.current.focus();
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 12) val = "12";
    setHour(val);
    if (val.length === 2 && minuteRef.current) minuteRef.current.focus();
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 59) val = "59";
    setMinute(val);
    if (val.length === 2 && secondRef.current) secondRef.current.focus();
  };

  const handleSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 59) val = "59";
    setSecond(val);
  };

  // Submit & Calculate
  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();

    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (!day || isNaN(d) || d < 1 || d > 31) {
      toast.error(
        language === "bn"
          ? "সঠিক জন্ম দিন (১-৩১) লিখুন।"
          : language === "hi"
          ? "मान्य जन्म दिन (1-31) दर्ज करें।"
          : "Enter a valid birth day (1-31).",
      );
      dayRef.current?.focus();
      return;
    }
    if (!month || isNaN(m) || m < 1 || m > 12) {
      toast.error(
        language === "bn"
          ? "সঠিক জন্ম মাস (১-১২) লিখুন।"
          : language === "hi"
          ? "मान्य जन्म माह (1-12) दर्ज करें।"
          : "Enter a valid birth month (1-12).",
      );
      monthRef.current?.focus();
      return;
    }
    if (!year || isNaN(y) || y < 1800 || y > 2100) {
      toast.error(
        language === "bn"
          ? "সঠিক জন্ম বছর (১৮০০-২১০০) লিখুন।"
          : language === "hi"
          ? "मान्य जन्म वर्ष (1800-2100) दर्ज करें।"
          : "Enter a valid 4-digit birth year (1800-2100).",
      );
      yearRef.current?.focus();
      return;
    }

    let parsedHour = 12;
    let parsedMinute = 0;
    let parsedSecond = 0;
    let effectivePeriod: "AM" | "PM" = "PM";

    if (hour.trim() !== "") {
      parsedHour = parseInt(hour, 10) || 12;
      parsedMinute = parseInt(minute, 10) || 0;
      parsedSecond = parseInt(second, 10) || 0;
      effectivePeriod = period;
    }

    const placeName = place.trim() || "Kolkata, West Bengal, India";
    const lat = latitude !== null ? latitude : 22.5726;
    const lon = longitude !== null ? longitude : 88.3639;
    const tz = parseFloat(timezone) || 5.5;

    const payload: KPCalculatePayload = {
      name: name.trim() || "Native",
      gender,
      day: d,
      month: m,
      year: y,
      hour: parsedHour,
      minute: parsedMinute,
      second: parsedSecond,
      period: effectivePeriod,
      place: placeName,
      latitude: lat,
      longitude: lon,
      timezone: tz,
      ayanamsa,
      language,
    };

    setLoading(true);
    try {
      const resp = await astrologyApi.calculateKp(payload);
      setResult(resp);

      // Auto-set active Mahadasha & Antardasha
      const currentMD = resp.dashas?.find((d: KPDashaPeriod) => d.is_current) || resp.dashas?.[0];
      if (currentMD) {
        setSelectedMD(currentMD);
        setSelectedPlanetInsight(currentMD.lord);
        const currentAD = currentMD.sub_periods?.find((ad: KPDashaPeriod) => ad.is_current) || currentMD.sub_periods?.[0];
        if (currentAD) {
          setSelectedAD(currentAD);
        }
      }
      setActiveStep(1);

      toast.success(
        language === "bn"
          ? "বিংশোত্তরী দশা নির্ভুল গণনা সম্পন্ন হয়েছে!"
          : language === "hi"
          ? "विंशोत्तरी दशा की सटीक गणना संपन्न!"
          : "Vimshottari Dasha calculated successfully!",
      );

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (err: any) {
      console.error("Dasha Calculation Error:", err);
      toast.error(
        err?.message ||
          (language === "bn"
            ? "দশা নির্ণয়ে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
            : language === "hi"
            ? "दशा गणना में त्रुटि हुई। कृपया पुनः प्रयास करें।"
            : "Failed to calculate Dasha timeline."),
      );
    } finally {
      setLoading(false);
    }
  };

  // Find Current Mahadasha, Antardasha, and Pratyantardasha
  const currentMahadasha = React.useMemo(() => {
    return result?.dashas?.find((d) => d.is_current) || result?.dashas?.[0];
  }, [result]);

  const currentAntardasha = React.useMemo(() => {
    if (!currentMahadasha?.sub_periods) return null;
    return currentMahadasha.sub_periods.find((ad) => ad.is_current) || currentMahadasha.sub_periods[0];
  }, [currentMahadasha]);

  const currentPratyantardasha = React.useMemo(() => {
    if (!currentAntardasha?.sub_periods) return null;
    return currentAntardasha.sub_periods.find((pad) => pad.is_current) || currentAntardasha.sub_periods[0];
  }, [currentAntardasha]);

  // Active insight for selected planet
  const activeInsight = React.useMemo(() => {
    const localized = KP_LOCALIZED_DASHA_INSIGHTS[selectedPlanetInsight] || KP_LOCALIZED_DASHA_INSIGHTS["Venus"];
    return localized?.[language] || localized?.en;
  }, [selectedPlanetInsight, language]);

  return (
    <div className="min-h-screen bg-stone-50/60 dark:bg-stone-950 text-foreground flex flex-col font-sans">
      <SiteHeader />

      {/* Hero Header */}
      <div className="relative border-b border-amber-200/50 bg-gradient-to-b from-amber-500/10 via-amber-50/30 to-background dark:from-amber-950/20 dark:via-background dark:to-background py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          {/* Language Switcher Bar */}
          <div className="flex items-center justify-center gap-1.5 mb-6">
            <span className="text-xs font-semibold text-muted-foreground mr-1">
              {language === "bn" ? "ভাষা:" : language === "hi" ? "भाषा:" : "Language:"}
            </span>
            {(
              [
                { code: "bn", label: "বাংলা" },
                { code: "en", label: "English" },
                { code: "hi", label: "हिन्दी" },
              ] as const
            ).map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                  language === lang.code
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-surface border border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
            <Sparkles className="size-3.5 text-amber-600" />
            <span>Vimshottari Dasha System (120-Year Vedic Cycle)</span>
          </div>

          <h1 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink-950 dark:text-stone-100">
            {language === "bn"
              ? "দশা ক্যালকুলেটর - বিংশোত্তরী মহাদশা ও অন্তর্দশা ফলাফল"
              : language === "hi"
              ? "दशा कैलकुलेटर - विंशोत्तरी महादशा एवं अंतर्दशा परिणाम"
              : "Dasha Calculator - Vimshottari Mahadasha and Antardasha Result"}
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            {language === "bn"
              ? "কৃষ্ণমূর্তি ও লাহিড়ী অয়নাংশের সাথে আপনার জন্মকালীন সঠিক বিংশোত্তরী মহাদশা, অন্তর্দশা ও প্রত্যন্তর্দশা সময়রেখা ও প্রতিকার জানুন।"
              : language === "hi"
              ? "सटीक अयनांश गणना के साथ अपनी विंशोत्तरी महादशा, अंतर्दशा एवं प्रत्यंतर्दशा की समयसीमा और वैदिक उपाय जानें।"
              : "Discover your exact active planetary periods (Mahadasha, Antardasha, Pratyantardasha) with 100% astronomical accuracy and authentic Vedic remedies."}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-8 flex-1 w-full space-y-10">
        {/* Birth Details Input Form */}
        <div className="rounded-2xl border border-amber-300/80 bg-white dark:bg-stone-900 p-5 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                <Calendar className="size-5 text-amber-600" />
                {language === "bn"
                  ? "জন্ম বিবরণ লিখুন"
                  : language === "hi"
                  ? "जन्म विवरण दर्ज करें"
                  : "Enter Birth Details"}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {language === "bn"
                  ? "জন্ম তারিখ বাধ্যতামূলক। জন্ম সময় জানা না থাকলে দুপুর ১২:০০ স্বয়ংক্রিয়ভাবে নেওয়া হবে।"
                  : language === "hi"
                  ? "जन्म तिथि अनिवार्य है। यदि समय ज्ञात न हो तो 12:00 PM लिया जाएगा।"
                  : "Birth date is mandatory. Time is optional (defaults to 12:00 PM if omitted)."}
              </p>
            </div>

            {isSignedIn && (
              <button
                type="button"
                onClick={handleReloadFromProfile}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 bg-amber-50 dark:bg-amber-950/40 border border-amber-300/60 rounded-xl px-3 py-2 transition-colors self-start sm:self-auto"
              >
                <RefreshCw className="size-3.5" />
                {language === "bn" ? "প্রোফাইল থেকে লোড করুন" : language === "hi" ? "प्रोफ़ाइल से लोड करें" : "Sync Profile"}
              </button>
            )}
          </div>

          <form onSubmit={handleCalculate} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  {language === "bn" ? "নাম" : language === "hi" ? "पूरा नाम" : "Full Name"}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === "bn" ? "আপনার নাম" : language === "hi" ? "अपना नाम" : "Your Name"}
                    className="w-full rounded-xl border border-input bg-surface pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  {language === "bn" ? "লিঙ্গ" : language === "hi" ? "लिंग" : "Gender"}
                </label>
                <div className="grid grid-cols-3 gap-1 rounded-xl bg-surface-muted p-1 border border-input">
                  {(["male", "female", "other"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`rounded-lg py-1.5 text-xs font-bold capitalize transition-all ${
                        gender === g
                          ? "bg-amber-600 text-white shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {g === "male"
                        ? language === "bn"
                          ? "পুরুষ"
                          : language === "hi"
                          ? "पुरुष"
                          : "Male"
                        : g === "female"
                        ? language === "bn"
                          ? "মহিলা"
                          : language === "hi"
                          ? "महिला"
                          : "Female"
                        : language === "bn"
                        ? "অন্যান্য"
                        : language === "hi"
                        ? "अन्य"
                        : "Other"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date of Birth (DD-MM-YYYY) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>
                    {language === "bn" ? "জন্ম তারিখ *" : language === "hi" ? "जन्म तिथि *" : "Date of Birth *"}
                  </span>
                  <span className="text-[11px] font-normal text-amber-700 dark:text-amber-400">
                    DD - MM - YYYY
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    ref={dayRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="DD"
                    value={day}
                    onChange={handleDayChange}
                    className="w-full rounded-xl border border-input bg-surface px-2 py-2 text-center text-sm font-semibold tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    ref={monthRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="MM"
                    value={month}
                    onChange={handleMonthChange}
                    onKeyDown={(e) => handleKeyDown(e, dayRef)}
                    className="w-full rounded-xl border border-input bg-surface px-2 py-2 text-center text-sm font-semibold tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    ref={yearRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="YYYY"
                    value={year}
                    onChange={handleYearChange}
                    onKeyDown={(e) => handleKeyDown(e, monthRef)}
                    className="w-full rounded-xl border border-input bg-surface px-2 py-2 text-center text-sm font-semibold tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Time of Birth */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>
                    {language === "bn" ? "জন্ম সময়" : language === "hi" ? "जन्म समय" : "Time of Birth"}
                  </span>
                  <span className="text-[11px] font-normal text-muted-foreground">
                    HH : MM : SS
                  </span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  <input
                    ref={hourRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="12"
                    value={hour}
                    onChange={handleHourChange}
                    className="w-full rounded-xl border border-input bg-surface px-1 py-2 text-center text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    ref={minuteRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="00"
                    value={minute}
                    onChange={handleMinuteChange}
                    onKeyDown={(e) => handleKeyDown(e, hourRef)}
                    className="w-full rounded-xl border border-input bg-surface px-1 py-2 text-center text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    ref={secondRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="00"
                    value={second}
                    onChange={handleSecondChange}
                    onKeyDown={(e) => handleKeyDown(e, minuteRef)}
                    className="w-full rounded-xl border border-input bg-surface px-1 py-2 text-center text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setPeriod((p) => (p === "AM" ? "PM" : "AM"))}
                    className="w-full rounded-xl border border-input bg-amber-50 dark:bg-amber-950/40 font-bold text-xs text-amber-900 dark:text-amber-200 hover:bg-amber-100 transition-colors"
                  >
                    {period}
                  </button>
                </div>
              </div>

              {/* Birth Place with Location Picker Modal */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>
                    {language === "bn" ? "জন্মস্থান *" : language === "hi" ? "जन्म स्थान *" : "Birth Place *"}
                  </span>
                  {latitude !== null && longitude !== null && (
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      ✓ {latitude.toFixed(2)}°, {longitude.toFixed(2)}°
                    </span>
                  )}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      placeholder={
                        language === "bn"
                          ? "শহরের নাম লিখুন (যেমন: Kolaghat, Kolkata, Delhi)"
                          : language === "hi"
                          ? "शहर का नाम (जैसे: Kolaghat, Kolkata, Delhi)"
                          : "Search city or town (e.g. Kolaghat, Kolkata, Delhi)"
                      }
                      className="w-full rounded-xl border border-input bg-surface pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMapModalOpen(true)}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-amber-400 bg-amber-50 dark:bg-amber-950/50 px-3 py-2 text-xs font-bold text-amber-900 dark:text-amber-200 hover:bg-amber-100 transition-colors"
                  >
                    <Compass className="size-4 text-amber-600" />
                    <span className="hidden sm:inline">
                      {language === "bn" ? "ম্যাপ নির্বাচন" : language === "hi" ? "मानचित्र" : "Map Select"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Advance Settings Toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdvance((v) => !v)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <Sliders className="size-3.5" />
                <span>
                  {showAdvance
                    ? language === "bn"
                      ? "উন্নত সেটিংস লুকান"
                      : "Hide Advanced Settings"
                    : language === "bn"
                    ? "উন্নত সেটিংস (অয়নাংশ ও সময় অঞ্চল)"
                    : "Advanced Settings (Ayanamsa & Timezone)"}
                </span>
              </button>

              {showAdvance && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-border/80 bg-surface-muted/40 p-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      {language === "bn" ? "অয়নাংশ পদ্ধতি" : "Ayanamsa System"}
                    </label>
                    <select
                      value={ayanamsa}
                      onChange={(e) => setAyanamsa(e.target.value as AyanamsaType)}
                      className="w-full rounded-xl border border-input bg-surface px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="krishnamurti">Krishnamurti (KP Original)</option>
                      <option value="lahiri">Lahiri (Chitra Paksha / AppliedJyotish)</option>
                      <option value="bv_raman">B.V. Raman</option>
                      <option value="kp_new">KP New Ayanamsa</option>
                      <option value="yukteshwar">Sri Yukteshwar</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      {language === "bn" ? "সময় অঞ্চল (Timezone Offset)" : "Timezone Offset (Hours)"}
                    </label>
                    <input
                      type="text"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      placeholder="+5.5 for IST"
                      className="w-full rounded-xl border border-input bg-surface px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3 text-sm font-bold text-white shadow-md hover:from-amber-600 hover:to-amber-700 active:scale-98 transition-all disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    <span>{language === "bn" ? "দশা গণনা চলছে..." : "Calculating Dasha..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    <span>
                      {language === "bn"
                        ? "বিংশোত্তরী দশা গণনা করুন"
                        : language === "hi"
                        ? "विंशोत्तरी दशा की गणना करें"
                        : "Calculate Vimshottari Dasha"}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-input bg-surface px-5 py-3 text-sm font-semibold text-muted-foreground hover:bg-surface-muted hover:text-foreground transition-colors"
              >
                <RotateCcw className="size-4" />
                <span>{language === "bn" ? "রিসেট" : "Reset"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Location Picker Modal */}
        <LocationPickerModal
          open={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          onSelect={(loc) => {
            setPlace(loc.place);
            setLatitude(loc.latitude);
            setLongitude(loc.longitude);
            if (loc.timezone != null) setTimezone(String(loc.timezone));
            setIsMapModalOpen(false);
            toast.success(
              language === "bn"
                ? `স্থান নিশ্চিত করা হয়েছে: ${loc.place}`
                : `Location set: ${loc.place}`,
            );
          }}
          currentPlace={place}
          currentLat={latitude}
          currentLon={longitude}
        />

        {/* Results Section */}
        {result && (
          <div ref={resultsRef} className="space-y-12 pt-6">
            {/* ─────────────────────────────────────────────────────────
                SECTION 1: Your Details Card (Matching Screenshot 1)
            ───────────────────────────────────────────────────────── */}
            <div className="max-w-xl mx-auto rounded-2xl border-2 border-amber-400/90 bg-white dark:bg-stone-900 p-6 shadow-sm">
              <h2 className="text-center font-display text-2xl font-bold tracking-tight text-slate-800 dark:text-stone-100">
                {language === "bn" ? "আপনার বিবরণ" : language === "hi" ? "आपका विवरण" : "Your Details"}
              </h2>

              <GoldDiamondDivider />

              <div className="mt-4 space-y-3 px-2 sm:px-6">
                <div className="flex items-center justify-between text-sm sm:text-base">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-stone-200">
                    <span className="flex size-4 items-center justify-center rounded-full bg-amber-500 text-white text-[10px]">
                      ➔
                    </span>
                    <span>{language === "bn" ? "নাম:" : "Name:"}</span>
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-stone-300">
                    {result.name || name || "Native"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm sm:text-base">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-stone-200">
                    <span className="flex size-4 items-center justify-center rounded-full bg-amber-500 text-white text-[10px]">
                      ➔
                    </span>
                    <span>{language === "bn" ? "লিঙ্গ:" : "Gender:"}</span>
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-stone-300 capitalize">
                    {result.gender || gender}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm sm:text-base">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-stone-200">
                    <span className="flex size-4 items-center justify-center rounded-full bg-amber-500 text-white text-[10px]">
                      ➔
                    </span>
                    <span>{language === "bn" ? "জন্ম তারিখ:" : "Date of Birth:"}</span>
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-stone-300 tabular-nums">
                    {result.birth_date_formatted || `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm sm:text-base">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-stone-200">
                    <span className="flex size-4 items-center justify-center rounded-full bg-amber-500 text-white text-[10px]">
                      ➔
                    </span>
                    <span>{language === "bn" ? "জন্ম সময়:" : "Time of Birth:"}</span>
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-stone-300 tabular-nums">
                    {result.birth_time_formatted || `${hour.padStart(2, "0")}h:${minute.padStart(2, "0")}m:${second.padStart(2, "0")}s`}
                  </span>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────
                SECTION 2: Current Dasha 3 Cards (Matching Screenshot 1)
            ───────────────────────────────────────────────────────── */}
            <div className="rounded-2xl border-2 border-amber-300/80 bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-sm">
              <div className="text-center">
                <h3 className="font-display text-2xl font-bold tracking-tight text-amber-900 dark:text-amber-200 flex items-center justify-center gap-2">
                  <Calendar className="size-6 text-amber-700" />
                  <span>{language === "bn" ? "বর্তমান দশা" : language === "hi" ? "वर्तमान दशा" : "Current Dasha"}</span>
                </h3>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Mahadasha Card (Blue Border) */}
                <div className="rounded-xl border-2 border-blue-400 bg-blue-50/20 dark:bg-blue-950/20 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-display text-base font-bold text-blue-600 dark:text-blue-400">
                      {language === "bn" ? "মহাদশা (Mahadasha)" : "Mahadasha"}
                    </h4>
                    <div className="h-px bg-blue-200 dark:bg-blue-800 my-2.5" />
                    <div className="flex items-center gap-3 mt-3">
                      <div className="size-10 rounded-full bg-orange-100 border border-orange-300 flex items-center justify-center text-lg">
                        🪐
                      </div>
                      <div>
                        <p className="font-display text-lg font-bold text-foreground">
                          {currentMahadasha?.lord
                            ? KP_PLANET_NAMES[currentMahadasha.lord]?.[language] || currentMahadasha.lord
                            : "Venus"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {language === "bn" ? "প্রধান সময়চক্র" : "Major planetary period"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-blue-100 dark:border-blue-900/60 text-xs text-slate-700 dark:text-stone-300 space-y-1 tabular-nums font-medium">
                    <p>
                      <span className="font-semibold text-foreground">Start:</span>{" "}
                      {formatDateDisplay(currentMahadasha?.start_date || "2025-06-27")}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">End:</span>{" "}
                      {formatDateDisplay(currentMahadasha?.end_date || "2045-06-26")}
                    </p>
                  </div>
                </div>

                {/* 2. Antar Dasha Card (Green Border) */}
                <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-display text-base font-bold text-emerald-600 dark:text-emerald-400">
                      {language === "bn" ? "অন্তর্দশা (Antar Dasha)" : "Antar Dasha"}
                    </h4>
                    <div className="h-px bg-emerald-200 dark:bg-emerald-800 my-2.5" />
                    <div className="flex items-center gap-3 mt-3">
                      <div className="size-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-lg">
                        ✨
                      </div>
                      <div>
                        <p className="font-display text-lg font-bold text-foreground">
                          {currentAntardasha?.lord
                            ? KP_PLANET_NAMES[currentAntardasha.lord]?.[language] || currentAntardasha.lord
                            : "Venus"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {language === "bn" ? "উপ-পর্যায়" : "Sub-period inside Mahadasha"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-emerald-100 dark:border-emerald-900/60 text-xs text-slate-700 dark:text-stone-300 space-y-1 tabular-nums font-medium">
                    <p>
                      <span className="font-semibold text-foreground">Start:</span>{" "}
                      {formatDateDisplay(currentAntardasha?.start_date || "2025-06-27")}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">End:</span>{" "}
                      {formatDateDisplay(currentAntardasha?.end_date || "2028-11-01")}
                    </p>
                  </div>
                </div>

                {/* 3. Pratyantar Dasha Card (Gold Border) */}
                <div className="rounded-xl border-2 border-amber-400 bg-amber-50/20 dark:bg-amber-950/20 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-display text-base font-bold text-amber-700 dark:text-amber-300">
                      {language === "bn" ? "প্রত্যন্তর্দশা (Pratyantar Dasha)" : "Pratyantar Dasha"}
                    </h4>
                    <div className="h-px bg-amber-200 dark:bg-amber-800 my-2.5" />
                    <div className="flex items-center gap-3 mt-3">
                      <div className="size-10 rounded-full bg-indigo-100 border border-indigo-300 flex items-center justify-center text-lg">
                        🔮
                      </div>
                      <div>
                        <p className="font-display text-lg font-bold text-foreground">
                          {currentPratyantardasha?.lord
                            ? KP_PLANET_NAMES[currentPratyantardasha.lord]?.[language] || currentPratyantardasha.lord
                            : "Rahu"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {language === "bn" ? "সূক্ষ্ম দশা" : "Current sub-sub period"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-amber-100 dark:border-amber-900/60 text-xs text-slate-700 dark:text-stone-300 space-y-1 tabular-nums font-medium">
                    <p>
                      <span className="font-semibold text-foreground">Start:</span>{" "}
                      {formatDateDisplay(currentPratyantardasha?.start_date || "2026-08-31")}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">End:</span>{" "}
                      {formatDateDisplay(currentPratyantardasha?.end_date || "2027-03-02")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────
                SECTION 3: Vimshottari Dasha 3-Level Stepper & Interactive Table
                (Matching Screenshot 2)
            ───────────────────────────────────────────────────────── */}
            <div className="rounded-2xl border border-amber-200/80 bg-white dark:bg-stone-900 p-5 sm:p-8 shadow-sm">
              <div className="text-center">
                <h3 className="font-display text-2xl font-bold tracking-tight text-slate-800 dark:text-stone-100">
                  {language === "bn" ? "বিংশোত্তরী দশা" : language === "hi" ? "विंशोत्तरी दशा" : "Vimshottari Dasha"}
                </h3>
                <GoldDiamondDivider />

                {/* 3-Level Stepper */}
                <div className="mt-6 flex items-center justify-center gap-2 sm:gap-4">
                  {/* Step 1: Mahadasha */}
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="inline-flex items-center gap-2 cursor-pointer group"
                  >
                    <span
                      className={`flex size-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        activeStep === 1
                          ? "bg-amber-500 text-white shadow-xs"
                          : "border border-stone-300 bg-white text-stone-600 hover:border-amber-400"
                      }`}
                    >
                      1
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        activeStep === 1 ? "text-amber-950 dark:text-amber-300" : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {language === "bn" ? "মহাদশা" : "Mahadasha"}
                    </span>
                  </button>

                  <div className="h-0.5 w-6 sm:w-12 bg-stone-300 dark:bg-stone-700" />

                  {/* Step 2: Antar Dasha */}
                  <button
                    type="button"
                    onClick={() => selectedMD && setActiveStep(2)}
                    disabled={!selectedMD}
                    className="inline-flex items-center gap-2 cursor-pointer group disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span
                      className={`flex size-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        activeStep === 2
                          ? "bg-amber-500 text-white shadow-xs"
                          : "border border-stone-300 bg-white text-stone-600 hover:border-amber-400"
                      }`}
                    >
                      2
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        activeStep === 2 ? "text-amber-950 dark:text-amber-300" : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {language === "bn" ? "অন্তর্দশা" : "Antar Dasha"}
                    </span>
                  </button>

                  <div className="h-0.5 w-6 sm:w-12 bg-stone-300 dark:bg-stone-700" />

                  {/* Step 3: Pratyantar Dasha */}
                  <button
                    type="button"
                    onClick={() => selectedAD && setActiveStep(3)}
                    disabled={!selectedAD}
                    className="inline-flex items-center gap-2 cursor-pointer group disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span
                      className={`flex size-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        activeStep === 3
                          ? "bg-amber-500 text-white shadow-xs"
                          : "border border-stone-300 bg-white text-stone-600 hover:border-amber-400"
                      }`}
                    >
                      3
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        activeStep === 3 ? "text-amber-950 dark:text-amber-300" : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {language === "bn" ? "প্রত্যন্তর্দশা" : "Pratyantar Dasha"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Breadcrumb Context indicator */}
              <div className="mt-6 flex items-center justify-between px-2 text-xs font-semibold text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span
                    onClick={() => setActiveStep(1)}
                    className="hover:underline cursor-pointer text-amber-800 dark:text-amber-400"
                  >
                    Mahadashas
                  </span>
                  {selectedMD && activeStep >= 2 && (
                    <>
                      <span>➔</span>
                      <span
                        onClick={() => setActiveStep(2)}
                        className="hover:underline cursor-pointer text-amber-800 dark:text-amber-400"
                      >
                        {selectedMD.lord}
                      </span>
                    </>
                  )}
                  {selectedAD && activeStep === 3 && (
                    <>
                      <span>➔</span>
                      <span className="text-foreground">{selectedAD.lord}</span>
                    </>
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {language === "bn" ? "যেকোনো সারিতে ক্লিক করে বিস্তারিত দেখুন" : "Click any row to drill down"}
                </span>
              </div>

              {/* Interactive Table with Olive Green Header matching Screenshot */}
              <div className="mt-3 overflow-x-auto rounded-xl border border-stone-300 dark:border-stone-700">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-[#c5c1a5] dark:bg-stone-700 text-stone-900 dark:text-stone-100 font-bold border-b border-stone-300 dark:border-stone-600">
                      <th className="py-3 px-4 font-bold">
                        {activeStep === 1
                          ? language === "bn" ? "মহাদশা" : "Mahadasha"
                          : activeStep === 2
                          ? language === "bn" ? "অন্তর্দশা" : "Antar Dasha"
                          : language === "bn" ? "প্রত্যন্তর্দশা" : "Pratyantar Dasha"}
                      </th>
                      <th className="py-3 px-4 font-bold text-center">
                        {language === "bn" ? "শুরুর তারিখ" : "Start Date"}
                      </th>
                      <th className="py-3 px-4 font-bold text-center">
                        {language === "bn" ? "শেষের তারিখ" : "End Date"}
                      </th>
                      <th className="py-3 px-4 font-bold text-center">
                        {language === "bn" ? "স্থায়িত্ব" : "Duration"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800 bg-white dark:bg-stone-900">
                    {/* Render Level 1: 9 Mahadashas */}
                    {activeStep === 1 &&
                      result.dashas?.map((md, idx) => {
                        const isCurrent = md.is_current;
                        const isSelected = selectedMD?.lord === md.lord;
                        return (
                          <tr
                            key={`md-${md.lord}-${idx}`}
                            onClick={() => {
                              setSelectedMD(md);
                              setActiveStep(2);
                              setSelectedPlanetInsight(md.lord);
                            }}
                            className={`group cursor-pointer transition-colors ${
                              isCurrent
                                ? "bg-amber-50/70 dark:bg-amber-950/20 font-semibold"
                                : "hover:bg-amber-50/40 dark:hover:bg-stone-800/60"
                            }`}
                          >
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <span className="flex size-4 items-center justify-center rounded-full bg-amber-500 text-white text-[9px] group-hover:scale-110 transition-transform">
                                  ➔
                                </span>
                                <span className="font-bold text-foreground">
                                  {KP_PLANET_NAMES[md.lord]?.[language] || md.lord}
                                </span>
                                {isCurrent && (
                                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                                    {language === "bn" ? "বর্তমান" : "Current"}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-center tabular-nums text-slate-700 dark:text-stone-300">
                              {formatDateDisplay(md.start_date)}
                            </td>
                            <td className="py-3.5 px-4 text-center tabular-nums text-slate-700 dark:text-stone-300">
                              {formatDateDisplay(md.end_date)}
                            </td>
                            <td className="py-3.5 px-4 text-center font-medium text-slate-800 dark:text-stone-200">
                              {md.duration}
                            </td>
                          </tr>
                        );
                      })}

                    {/* Render Level 2: 9 Antardashas for selected Mahadasha */}
                    {activeStep === 2 &&
                      selectedMD?.sub_periods?.map((ad, idx) => {
                        const isCurrent = ad.is_current;
                        return (
                          <tr
                            key={`ad-${ad.lord}-${idx}`}
                            onClick={() => {
                              setSelectedAD(ad);
                              setActiveStep(3);
                              setSelectedPlanetInsight(ad.lord);
                            }}
                            className={`group cursor-pointer transition-colors ${
                              isCurrent
                                ? "bg-emerald-50/70 dark:bg-emerald-950/20 font-semibold"
                                : "hover:bg-amber-50/40 dark:hover:bg-stone-800/60"
                            }`}
                          >
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <span className="flex size-4 items-center justify-center rounded-full bg-emerald-600 text-white text-[9px] group-hover:scale-110 transition-transform">
                                  ➔
                                </span>
                                <span className="font-bold text-foreground">
                                  {KP_PLANET_NAMES[ad.lord]?.[language] || ad.lord}
                                </span>
                                {isCurrent && (
                                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                                    {language === "bn" ? "বর্তমান" : "Current"}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-center tabular-nums text-slate-700 dark:text-stone-300">
                              {formatDateDisplay(ad.start_date)}
                            </td>
                            <td className="py-3.5 px-4 text-center tabular-nums text-slate-700 dark:text-stone-300">
                              {formatDateDisplay(ad.end_date)}
                            </td>
                            <td className="py-3.5 px-4 text-center font-medium text-slate-800 dark:text-stone-200">
                              {ad.duration}
                            </td>
                          </tr>
                        );
                      })}

                    {/* Render Level 3: 9 Pratyantardashas for selected Antardasha */}
                    {activeStep === 3 &&
                      selectedAD?.sub_periods?.map((pad, idx) => {
                        const isCurrent = pad.is_current;
                        return (
                          <tr
                            key={`pad-${pad.lord}-${idx}`}
                            onClick={() => setSelectedPlanetInsight(pad.lord)}
                            className={`group cursor-pointer transition-colors ${
                              isCurrent
                                ? "bg-amber-50/70 dark:bg-amber-950/20 font-semibold"
                                : "hover:bg-amber-50/40 dark:hover:bg-stone-800/60"
                            }`}
                          >
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <span className="flex size-4 items-center justify-center rounded-full bg-amber-500 text-white text-[9px]">
                                  ➔
                                </span>
                                <span className="font-bold text-foreground">
                                  {KP_PLANET_NAMES[pad.lord]?.[language] || pad.lord}
                                </span>
                                {isCurrent && (
                                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                                    {language === "bn" ? "বর্তমান" : "Current"}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-center tabular-nums text-slate-700 dark:text-stone-300">
                              {formatDateDisplay(pad.start_date)}
                            </td>
                            <td className="py-3.5 px-4 text-center tabular-nums text-slate-700 dark:text-stone-300">
                              {formatDateDisplay(pad.end_date)}
                            </td>
                            <td className="py-3.5 px-4 text-center font-medium text-slate-800 dark:text-stone-200">
                              {pad.duration}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────
                SECTION 4: Choose Rashi Kundli Chart Style (Matching Screenshots 3 & 4)
            ───────────────────────────────────────────────────────── */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-display text-2xl font-bold tracking-tight text-slate-800 dark:text-stone-100">
                  {language === "bn"
                    ? "রাশি কুন্ডলী চার্ট শৈলী নির্বাচন করুন"
                    : language === "hi"
                    ? "राशि कुंडली चार्ट शैली चुनें"
                    : "Choose Rashi Kundli Chart Style"}
                </h3>
                <GoldDiamondDivider />
              </div>

              <KPChartViewer
                planets={result.planets}
                cusps={result.cusps}
                ascendantSignIndex={
                  result.planets.find((p) => p.name === "Asc")?.sign_index ?? 0
                }
                userName={result.name}
                birthDate={result.birth_date_formatted}
                birthTime={result.birth_time_formatted}
                moonSignName={result.panchang.moon_rashi}
                nakshatraName={result.panchang.moon_nakshatra}
                language={language}
              />
            </div>

            {/* ─────────────────────────────────────────────────────────
                SECTION 5: "Is Your Life Suddenly Changing? It Could Be Your Mahadasha."
                (Matching Screenshot 5)
            ───────────────────────────────────────────────────────── */}
            <div className="rounded-2xl border-2 border-amber-300/80 bg-white dark:bg-stone-900 p-6 sm:p-10 shadow-sm space-y-8">
              {/* Top Planet Pill Selectors matching Screenshot 5 */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {PLANET_PILLS.map((pill) => {
                  const isSelected = selectedPlanetInsight === pill.key;
                  return (
                    <button
                      key={pill.key}
                      type="button"
                      onClick={() => setSelectedPlanetInsight(pill.key)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold border transition-all ${
                        isSelected
                          ? "ring-2 ring-amber-500 scale-105 shadow-xs " + pill.bgClass
                          : "border-stone-200 dark:border-stone-800 bg-surface-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: pill.color }}
                      />
                      <span>{pill.code}</span>
                    </button>
                  );
                })}
              </div>

              {/* Title Header */}
              <div className="text-center space-y-2">
                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-800 dark:text-stone-100 flex items-center justify-center gap-2">
                  <Clock className="size-7 text-amber-600 inline-block" />
                  <span>
                    {language === "bn"
                      ? "আপনার জীবন কি হঠাৎ বদলে যাচ্ছে? এটি হতে পারে আপনার মহাদশা।"
                      : language === "hi"
                      ? "क्या आपका जीवन अचानक बदल रहा है? यह आपकी महादशा हो सकती है।"
                      : "Is Your Life Suddenly Changing? It Could Be Your Mahadasha."}
                  </span>
                </h3>
                <GoldDiamondDivider />
              </div>

              {/* Astrological Description & Life Impact */}
              <div className="max-w-3xl mx-auto text-center space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <p>
                  {language === "bn" ? (
                    <>
                      বৈদিক জ্যোতিষশাস্ত্র অনুসারে আপনার জীবনের প্রতিটি গুরুত্বপূর্ণ অধ্যায়{" "}
                      <strong className="text-foreground">বিংশোত্তরী দশা পদ্ধতি</strong> দ্বারা নিয়ন্ত্রিত হয়,
                      যা দুটি প্রধান ভাগে বিভক্ত:
                    </>
                  ) : language === "hi" ? (
                    <>
                      वैदिक ज्योतिष के अनुसार आपके जीवन की महत्वपूर्ण घटनाएं{" "}
                      <strong className="text-foreground">विंशोत्तरी दशा प्रणाली</strong> द्वारा संचालित होती हैं:
                    </>
                  ) : (
                    <>
                      In Vedic astrology, your life events are governed by the{" "}
                      <strong className="text-foreground">Vimshottari Dasha system</strong>, which is divided into:
                    </>
                  )}
                </p>

                <p className="font-semibold text-slate-800 dark:text-stone-200">
                  <span className="text-amber-800 dark:text-amber-400">
                    {language === "bn" ? "মহাদশা (Mahadasha)" : "Mahadasha"}
                  </span>{" "}
                  – {language === "bn" ? "প্রধান জীবনচক্র" : "the major planetary period"}{" "}
                  |{" "}
                  <span className="text-emerald-700 dark:text-emerald-400">
                    {language === "bn" ? "অন্তর্দশা (Antardasha)" : "Antardasha"}
                  </span>{" "}
                  – {language === "bn" ? "মহাদশার অন্তর্গত উপ-পর্যায়" : "the sub-period within Mahadasha"}
                </p>

                <p>
                  {language === "bn"
                    ? "প্রতিটি গ্রহের সময়কাল আপনার জীবনের বিভিন্ন ক্ষেত্রে প্রত্যক্ষ প্রভাব ফেলে: ক্যারিয়ারের উত্থান বা কর্মক্ষেত্রে পরিবর্তন, সম্পর্কের শুভফল বা মনোমালিন্য, স্বাস্থ্যের উন্নতি বা সংবেদনশীলতা, এবং অপ্রত্যাশিত আর্থিক লাভ।"
                    : "Each planetary period affects different areas of your life like: Career growth or career transitions, Relationship harmony or conflicts, Health vitality, and Sudden financial gains or unexpected changes."}
                </p>

                <p className="font-bold text-foreground">
                  🧠{" "}
                  {language === "bn"
                    ? "বিভ্রান্তিতে থাকবেন না। জানুন আপনি কোন গ্রহের প্রভাবে আছেন এবং সঠিক সিদ্ধান্তের মাধ্যমে জীবনকে সফল করুন।"
                    : "Don't live in confusion. Understand what phase you're in and how to navigate it wisely."}
                </p>
              </div>

              {/* Consultation Booking CTA Card */}
              <div className="max-w-2xl mx-auto rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 border-2 border-amber-400/80 p-6 text-center space-y-4">
                <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-stone-200">
                  🎯{" "}
                  {language === "bn"
                    ? "আমাদের অভিজ্ঞ বৈদিক জ্যোতিষীদের সাথে সরাসরি কথা বলুন — মহাদশা, অন্তর্দশার নির্ভুল বিশ্লেষণ, সঠিক সময়জ্ঞান এবং প্রামাণ্য বৈদিক প্রতিকার।"
                    : "Consult with our Verified Vedic Astrology Experts, specialized in Mahadasha & Antardasha reading, planetary remedies, and timing of life events."}
                </p>

                <div className="pt-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-2">
                    🔗 {language === "bn" ? "আপনার দশা কনসাল্টেশন বুক করুন:" : "Book Your Dasha Consultation Now:"}
                  </p>
                  <Link
                    href="/astrologers"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2.5 text-sm font-bold text-white shadow-soft hover:from-amber-600 hover:to-amber-700 active:scale-98 transition-all"
                  >
                    <span>👉 {language === "bn" ? "জ্যোতিষী নির্বাচন করুন" : "Find an Astrologer"}</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>

                <p className="text-xs font-bold text-amber-900 dark:text-amber-300">
                  🛡️{" "}
                  {language === "bn"
                    ? "জানুন কোন গ্রহ আপনার জীবন নিয়ন্ত্রণ করছে — এবং প্রতিকারের মাধ্যমে পরিস্থিতিকে নিজের অনুকূলে আনুন।"
                    : "Know which planet is ruling your life — and how to turn the tide in your favor."}
                </p>
              </div>

              {/* Selected Planet Insights Card */}
              {activeInsight && (
                <div className="mt-8 rounded-2xl border border-amber-200/90 bg-amber-50/20 dark:bg-stone-900/60 p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/60">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                        {language === "bn" ? "নির্বাচিত গ্রহের গভীর অন্তর্দৃষ্টি" : "Dasha Insights & Authentic Remedies"}
                      </span>
                      <h4 className="font-display text-2xl font-bold text-foreground mt-0.5">
                        {KP_PLANET_NAMES[selectedPlanetInsight]?.[language] || selectedPlanetInsight} –{" "}
                        {language === "bn" ? "প্রভাব ও ফলাফল" : "Predictions & Remedies"}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="rounded-lg bg-amber-100 dark:bg-amber-950/60 border border-amber-300 px-3 py-1 font-bold text-amber-900 dark:text-amber-300">
                        {language === "bn" ? "শুভ বার: " : "Lucky Day: "}
                        {activeInsight.lucky_day}
                      </span>
                      <span className="rounded-lg bg-surface border border-border px-3 py-1 font-bold text-foreground">
                        {language === "bn" ? "শুভ রং: " : "Color: "}
                        {activeInsight.lucky_color}
                      </span>
                    </div>
                  </div>

                  {/* Overview */}
                  <div className="space-y-1.5">
                    <h5 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Sparkles className="size-4 text-amber-600" />
                      <span>{language === "bn" ? "সাধারণ প্রভাব ও মনস্তত্ত্ব" : "General Overview & Mindset"}</span>
                    </h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {activeInsight.overview}
                    </p>
                  </div>

                  {/* Career & Wealth */}
                  <div className="space-y-1.5">
                    <h5 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Layers className="size-4 text-amber-600" />
                      <span>{language === "bn" ? "কর্মজীবন ও আর্থিক স্থিতি" : "Career & Wealth Guidance"}</span>
                    </h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {activeInsight.career_and_wealth}
                    </p>
                  </div>

                  {/* Do's and Don'ts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    {/* Favorable actions */}
                    <div className="rounded-xl border border-emerald-300/80 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 space-y-2.5">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="size-4 text-emerald-600" />
                        <span>{language === "bn" ? "কী কী করা উচিত (Do's)" : "Favorable Actions (Do's)"}</span>
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-stone-300">
                        {activeInsight.favorable_actions?.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cautions */}
                    <div className="rounded-xl border border-red-300/80 bg-red-50/40 dark:bg-red-950/20 p-4 space-y-2.5">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-red-800 dark:text-red-300 flex items-center gap-1.5">
                        <AlertTriangle className="size-4 text-red-600" />
                        <span>{language === "bn" ? "কী কী বর্জনীয় (Don'ts)" : "Cautions & Pitfalls (Don'ts)"}</span>
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-stone-300">
                        {activeInsight.cautions_and_pitfalls?.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-red-600 font-bold">✕</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Authentic Vedic & KP Remedies from Chapter 9 */}
                  <div className="rounded-xl border border-amber-300 bg-amber-50/60 dark:bg-amber-950/30 p-5 space-y-3">
                    <h5 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                      <Flame className="size-4 text-amber-600" />
                      <span>
                        {language === "bn"
                          ? "প্রামাণ্য কেপি ও বৈদিক প্রতিকার (Client's Vedic Remedies)"
                          : "Authentic KP & Vedic Remedies"}
                      </span>
                    </h5>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-800 dark:text-stone-200">
                      {activeInsight.remedies?.map((rem, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-white/80 dark:bg-stone-900/80 p-2.5 rounded-lg border border-amber-200/80">
                          <span className="text-amber-600 font-bold">❖</span>
                          <span>{rem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Mantras */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="rounded-xl border border-border bg-surface p-4 space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        {language === "bn" ? "বীজ মন্ত্র" : "Beej Mantra"}
                      </span>
                      <p className="font-serif text-sm font-bold text-amber-900 dark:text-amber-300">
                        {activeInsight.beej_mantra}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border bg-surface p-4 space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        {language === "bn" ? "গায়ত্রী মন্ত্র" : "Gayatri Mantra"}
                      </span>
                      <p className="font-serif text-xs font-semibold text-foreground leading-relaxed">
                        {activeInsight.gayatri_mantra}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
