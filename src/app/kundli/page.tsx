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
  ChevronDown,
  ChevronUp,
  HeartHandshake,
  Languages,
  User,
  Download,
  MessageCircle,
  Lock,
  Edit,
  FilePlus,
  Award,
  ShieldCheck,
  Compass,
  Gem,
  Flame,
  Heart,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { astrologyApi } from "@/lib/api";
import {
  BirthPlaceField,
  type SelectedPlace,
} from "@/components/astrology/birth-place-field";
import { KundliDiamondChart } from "@/components/astrology/kundli-diamond-chart";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";
import { useProfile } from "@/hooks/use-profile";
import { useFeaturePricing } from "@/hooks/use-feature-pricing";
import {
  FeatureCoinBadge,
  FeatureDisabledAlert,
  FeatureCoinModal,
} from "@/components/astrology/feature-pricing-banner";
import {
  KUNDLI_UI_STRINGS,
  KUNDLI_GENDER_NAMES,
  translatePlanetName,
  translateRashiName,
  translateNakshatraName,
  translateDayName,
  translateTithi,
  translateKaran,
  translateYoga,
  translateDmsStyled,
  translateHouseName,
  translateDashaCardTitle,
  translateDashaDuration,
  translateBalDasa,
  translateYogaName,
  translateYogaDetails,
  toLocalizedDigits,
} from "@/lib/kundli-translations";
import type {
  AstrologyLanguage,
  AyanamsaType,
  KundliCalculatePayload,
  KundliCalculateResult,
  UserProfile,
  UserPublic,
} from "@/types";

// Decorative Gold Diamond Divider matching Screenshots
function GoldDiamondDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center my-3 ${className}`}>
      <div className="h-[2px] w-48 sm:w-64 bg-gradient-to-r from-transparent via-amber-400 to-transparent relative flex items-center justify-between">
        <span className="size-2 rotate-45 border-2 border-amber-500 bg-white" />
        <span className="size-2 rotate-45 border-2 border-amber-500 bg-white" />
      </div>
    </div>
  );
}

// Zodiac SVGs / Glyphs
const ZODIAC_SYMBOLS_MAP: Record<string, string> = {
  Aries: "♈",
  Taurus: "♉",
  Gemini: "♊",
  Cancer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Scorpio: "♏",
  Sagittarius: "♐",
  Capricorn: "♑",
  Aquarius: "♒",
  Pisces: "♓",
};

export default function KundliPage() {
  const { user, isSignedIn } = useAuth();
  const { data: profile } = useProfile({ enabled: isSignedIn });
  const { getFeature, checkAccess, walletBalance, refresh: refreshWallet } = useFeaturePricing();
  const kundliFeature = getFeature("kundli");
  const [coinModalOpen, setCoinModalOpen] = React.useState(false);
  const [coinModalReason, setCoinModalReason] = React.useState<"unauthorized" | "insufficient_coins" | "disabled">("insufficient_coins");

  // Centralized Language state
  const { language, setLanguage } = useLanguage();
  const t = KUNDLI_UI_STRINGS[language] || KUNDLI_UI_STRINGS.bn;

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
  const [selectedPlace, setSelectedPlace] = React.useState<SelectedPlace | null>(null);
  const [placeTouched, setPlaceTouched] = React.useState(false);
  const [latitude, setLatitude] = React.useState<number | null>(null);
  const [longitude, setLongitude] = React.useState<number | null>(null);
  const [timezone, setTimezone] = React.useState("5.5");
  const [ayanamsa, setAyanamsa] = React.useState<AyanamsaType>("lahiri");
  const [houseSystem, setHouseSystem] = React.useState<"placidus" | "equal" | "whole_sign">("placidus");
  const [showAdvance, setShowAdvance] = React.useState(false);

  // Chart Style Selector: "north" | "east" | "south" | "wheel"
  const [chartStyle, setChartStyle] = React.useState<"north" | "east" | "south" | "wheel">("north");
  const [activeChartTab, setActiveChartTab] = React.useState<"d1" | "d9" | "d10" | "d7">("d1");
  const [activeHouseTab, setActiveHouseTab] = React.useState<number>(1);

  // Loading & Result
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<KundliCalculateResult | null>(null);

  const formRef = React.useRef<HTMLDivElement>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);
  const d9Ref = React.useRef<HTMLDivElement>(null);
  const yogaRef = React.useRef<HTMLDivElement>(null);
  const hasAutoFilled = React.useRef(false);

  // Focus navigation refs
  const dayRef = React.useRef<HTMLInputElement>(null);
  const monthRef = React.useRef<HTMLInputElement>(null);
  const yearRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);

  // Populate from Profile
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
          const lat = b.latitude != null ? Number(b.latitude) : 22.5726;
          const lon = b.longitude != null ? Number(b.longitude) : 88.3639;
          setLatitude(lat);
          setLongitude(lon);
          setSelectedPlace({
            place: placeName,
            displayName: placeName,
            latitude: lat,
            longitude: lon,
            timezoneName: null,
            timezoneOffset: b.timezone != null ? Number(b.timezone) : 5.5,
            timezoneLabel: null,
            timezoneAbbreviation: null,
            isDst: false,
          });
        }
        if (b.timezone != null) setTimezone(String(b.timezone));
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

  // Input Handlers with auto-focus
  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 31) val = "31";
    setDay(val);
    if (val.length === 2 && monthRef.current) {
      monthRef.current.focus();
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 12) val = "12";
    setMonth(val);
    if (val.length === 2 && yearRef.current) {
      yearRef.current.focus();
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.slice(0, 4);
    setYear(val);
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 12) val = "12";
    setHour(val);
    if (val.length === 2 && minuteRef.current) {
      minuteRef.current.focus();
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 59) val = "59";
    setMinute(val);
    if (val.length === 2 && secondRef.current) {
      secondRef.current.focus();
    }
  };

  const handleSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 59) val = "59";
    setSecond(val);
  };

  const handleResetForm = () => {
    setName("");
    setDay("");
    setMonth("");
    setYear("");
    setHour("");
    setMinute("");
    setSecond("");
    setPlace("");
    setSelectedPlace(null);
    setPlaceTouched(false);
  };

  const handleReloadFromProfile = () => {
    if (profile) {
      populateFromProfileData(profile, user);
      toast.success(
        language === "bn"
          ? "প্রোফাইল থেকে তথ্য লোড করা হয়েছে"
          : "Details reloaded from your profile",
      );
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(
        language === "bn"
          ? "অনুগ্রহ করে আপনার নাম লিখুন"
          : language === "hi"
          ? "कृपया अपना नाम दर्ज करें"
          : "Please enter your name",
      );
      return;
    }

    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (
      !day ||
      isNaN(d) ||
      d < 1 ||
      d > 31 ||
      !month ||
      isNaN(m) ||
      m < 1 ||
      m > 12 ||
      !year ||
      isNaN(y) ||
      y < 1800 ||
      y > 2100
    ) {
      toast.error(
        language === "bn"
          ? "সঠিক জন্মতারিখ (দিন, মাস ও সাল) প্রদান করুন"
          : language === "hi"
          ? "कृपया मान्य जन्म तिथि दर्ज करें"
          : "Please enter a valid birth date (DD, MM, YYYY)",
      );
      return;
    }

    if (!selectedPlace && !place.trim()) {
      setPlaceTouched(true);
      toast.error(
        language === "bn"
          ? "অনুগ্রহ করে তালিকা থেকে আপনার জন্মস্থান নির্বাচন করুন"
          : language === "hi"
          ? "कृपया सूची से अपना जन्म स्थान चुनें"
          : "Please choose your birth place from the list",
      );
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

    const effectiveLat = selectedPlace?.latitude ?? latitude ?? 22.5726;
    const effectiveLon = selectedPlace?.longitude ?? longitude ?? 88.3639;
    const effectiveTz = selectedPlace?.timezoneOffset ?? parseFloat(timezone) ?? 5.5;
    const effectivePlace = selectedPlace?.place ?? (place.trim() || "Kolkata, West Bengal, India");

    const payload: KundliCalculatePayload = {
      name: name.trim(),
      gender,
      day: d,
      month: m,
      year: y,
      hour: parsedHour,
      minute: parsedMinute,
      second: parsedSecond,
      period: effectivePeriod,
      place: effectivePlace,
      latitude: effectiveLat,
      longitude: effectiveLon,
      timezone: effectiveTz,
      ayanamsa,
      house_system: houseSystem,
      chart_style:
        chartStyle === "wheel"
          ? "north_indian"
          : chartStyle === "south"
          ? "south_indian"
          : chartStyle === "east"
          ? "east_indian"
          : "north_indian",
      language,
    };

    const access = checkAccess("kundli");
    if (!access.allowed) {
      if (access.reason === "disabled") {
        toast.error(
          language === "bn"
            ? "কুন্ডলী ফিচারটি বর্তমানে অ্যাডমিন দ্বারা বন্ধ রাখা হয়েছে।"
            : "Kundli feature is temporarily unavailable.",
        );
        return;
      }
      setCoinModalReason(access.reason || "insufficient_coins");
      setCoinModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const resp = await astrologyApi.calculateKundli(payload);
      setResult(resp);
      if (access.requiredCoins > 0) {
        toast.success(
          language === "bn"
            ? `কুন্ডলী গণনা সম্পন্ন হয়েছে! (${access.requiredCoins} কয়েন খরচ হয়েছে)`
            : `Kundli calculated! (${access.requiredCoins} coins used)`,
        );
        refreshWallet();
      } else {
        toast.success(
          language === "bn"
            ? "কুন্ডলী ও গ্রহের অবস্থান সফলভাবে গণনা সম্পন্ন হয়েছে!"
            : "Kundli & Planetary Position calculated successfully!",
        );
      }
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (err: any) {
      console.error("Kundli calculation error:", err);
      if (err?.code === "insufficient_coins") {
        setCoinModalReason("insufficient_coins");
        setCoinModalOpen(true);
      } else if (err?.code === "authentication_required" || err?.status === 401) {
        setCoinModalReason("unauthorized");
        setCoinModalOpen(true);
      } else {
        toast.error(err?.message || "Failed to calculate Kundli.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Printable Download PDF Handler
  const handlePrintDownload = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted/30 text-foreground flex flex-col font-sans pb-24">
      <SiteHeader />

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-3 sm:px-4 py-8 flex-1 w-full space-y-8">
        {/* =========================================================================
            HEADER & TITLE matching Astra Theme (Image 2)
        ========================================================================= */}
        <div className="mx-auto max-w-4xl text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/90 text-amber-950 border border-amber-300 font-bold px-4 py-1.5 text-xs shadow-2xs">
            <Sparkles className="size-3.5 text-amber-600" />
            <span>
              {language === "bn"
                ? "বৈদিক জ্যোতিষশাস্ত্র ভিত্তিক নির্ভুল কুন্ডলী ক্যালকুলেটর"
                : language === "hi"
                ? "वैदिक ज्योतिष सम्मत सटीक जन्म कुंडली कैलकुलेटर"
                : "Vedic Sidereal Accurate Birth Kundli Calculator"}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {language === "bn"
              ? "জন্মতারিখ দিয়ে কুন্ডলী ও গ্রহের অবস্থান — সম্পূর্ণ ফ্রি"
              : language === "hi"
              ? "जन्मतिथि से जानें जन्म कुंडली एवं ग्रह स्थिति — पूर्णतः निःशुल्क"
              : "Find Your Kundli by Date of Birth - Complete Vedic Chart"}
          </h1>

          <p className="text-xs sm:text-sm text-foreground-muted max-w-2xl mx-auto">
            {language === "bn"
              ? "সঠিক লগ্ন, ১২টি ভাব, নবাংশ (D9) চার্ট, বিংশোত্তরী দশা ও বৈদিক যোগের পূর্ণাঙ্গ বিশ্লেষণ।"
              : language === "hi"
              ? "सटीक लग्न, १२ भाव, नवमांश (D9) चार्ट, विंशोत्तरी दशा एवं वैदिक योगों का संपूर्ण विश्लेषण।"
              : "Accurate Ascendant, 12 Placidus House Cusps, Navamsha D9 Chart, Vimshottari Dashas and Classical Vedic Yogas."}
          </p>

          {/* Feature Coin Badge */}
          <div className="flex justify-center pt-1">
            <FeatureCoinBadge
              feature={kundliFeature}
              walletBalance={walletBalance}
              language={language}
            />
          </div>

          {/* Language Switcher Bar matching Image 2 */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="text-xs font-semibold text-foreground-muted">
              {language === "bn" ? "ভাষা / Language:" : language === "hi" ? "भाषा / Language:" : "Language:"}
            </span>
            <div className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-white p-1 text-xs font-semibold shadow-2xs">
              {(
                [
                  { code: "bn", label: "বাংলা" },
                  { code: "hi", label: "हिन्दी" },
                  { code: "en", label: "English" },
                ] as const
              ).map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                    language === lang.code
                      ? "bg-amber-500 text-white shadow-2xs"
                      : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            FORM SECTION (Always visible first, matching Image 2 & Rashi Calculator)
        ========================================================================= */}
        <div ref={formRef} className="mx-auto max-w-3xl w-full">
          <div className="rounded-[28px] border border-amber-300/70 bg-card p-6 sm:p-9 shadow-[0_12px_40px_-15px_rgba(26,18,8,0.08)] backdrop-blur-md">
            <h2 className="text-center font-display text-xl sm:text-2xl font-bold text-foreground mb-4">
              {language === "bn"
                ? "আপনার জন্ম বিবরণ প্রবেশ করান"
                : language === "hi"
                ? "अपना जन्म विवरण दर्ज करें"
                : "Enter Your Birth Details"}
            </h2>

            {/* Dynamic Profile Sync Status Banner */}
            {isSignedIn && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-amber-500/10 border border-amber-300/80 px-4 py-3 text-xs text-amber-950 font-medium shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="size-6 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center font-bold text-[11px]">
                    ✓
                  </div>
                  <div>
                    <span className="font-bold">
                      {language === "bn"
                        ? `স্বাগত, ${profile?.full_name || user?.full_name || user?.first_name || "সম্মানিত ব্যবহারকারী"}!`
                        : language === "hi"
                        ? `स्वागत है, ${profile?.full_name || user?.full_name || user?.first_name || "उपयोगकर्ता"}!`
                        : `Welcome, ${profile?.full_name || user?.full_name || user?.first_name || "User"}!`}
                    </span>
                    <span className="text-muted-foreground ml-1.5 block sm:inline">
                      {profile?.birth?.date_of_birth
                        ? language === "bn"
                          ? "আপনার প্রোফাইল থেকে সংরক্ষিত জন্ম বিবরণ স্বয়ংক্রিয়ভাবে লোড করা হয়েছে।"
                          : language === "hi"
                          ? "आपकी प्रोफ़ाइल से सहेजा गया जन्म विवरण स्वतः भर दिया गया है।"
                          : "Saved birth details loaded from your profile."
                        : language === "bn"
                        ? "আপনার প্রোফাইলের নাম লোড করা হয়েছে।"
                        : language === "hi"
                        ? "आपकी प्रोफ़ाइल का नाम लोड किया गया है।"
                        : "Name loaded from your profile."}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  {profile && (
                    <button
                      type="button"
                      onClick={handleReloadFromProfile}
                      className="inline-flex items-center gap-1 rounded-xl bg-white/90 hover:bg-white px-2.5 py-1 text-[11px] font-bold text-amber-900 border border-amber-300 shadow-2xs transition-colors cursor-pointer"
                    >
                      <RefreshCw className="size-3 text-amber-700" />
                      <span>{language === "bn" ? "রিলোড" : language === "hi" ? "रीलोड" : "Reload"}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="inline-flex items-center gap-1 rounded-xl bg-white/90 hover:bg-white px-2.5 py-1 text-[11px] font-bold text-rose-800 border border-rose-300 shadow-2xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="size-3 text-rose-600" />
                    <span>{language === "bn" ? "খালি করুন" : language === "hi" ? "साफ़ करें" : "Clear"}</span>
                  </button>
                </div>
              </div>
            )}

            {!isSignedIn && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface-muted/50 border border-border/80 px-4 py-3 text-xs text-muted-foreground shadow-2xs">
                <div className="flex items-center gap-2">
                  <User className="size-4 text-amber-600 shrink-0" />
                  <span>
                    {language === "bn"
                      ? "লগ-ইন করলে আপনার প্রোফাইলের সেভ করা জন্ম বিবরণ সরাসরি এখানে পূরণ হয়ে যাবে।"
                      : language === "hi"
                      ? "लॉग-इन करने पर आपकी प्रोफ़ाइल का विवरण स्वतः यहाँ भर जाएगा।"
                      : "Sign in to automatically load your saved profile and birth details."}
                  </span>
                </div>
                <Link
                  href="/login"
                  className="rounded-xl bg-amber-500 text-amber-950 px-3 py-1 text-[11px] font-bold shadow-2xs hover:bg-amber-400 transition-colors ml-auto"
                >
                  {language === "bn" ? "লগ-ইন করুন" : language === "hi" ? "लॉग-इन करें" : "Sign In"}
                </Link>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-5 text-xs sm:text-sm">
              {/* 1. Name */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                <label className="sm:col-span-3 flex items-center gap-2 font-bold text-foreground">
                  <User className="size-4 text-amber-600" />
                  <span>{language === "bn" ? "নাম" : language === "hi" ? "नाम" : "Name"}</span>
                </label>
                <div className="sm:col-span-9">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={
                      language === "bn"
                        ? "আপনার নাম লিখুন..."
                        : language === "hi"
                        ? "अपना नाम लिखें..."
                        : "Enter your name..."
                    }
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs font-medium"
                  />
                </div>
              </div>

              {/* 2. Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                <label className="sm:col-span-3 flex items-center gap-2 font-bold text-foreground">
                  <HeartHandshake className="size-4 text-indigo-500" />
                  <span>{language === "bn" ? "লিঙ্গ" : language === "hi" ? "लिंग" : "Gender"}</span>
                </label>
                <div className="sm:col-span-9">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs cursor-pointer font-medium"
                  >
                    <option value="male">
                      {language === "bn" ? "পুরুষ (Male)" : language === "hi" ? "पुरुष (Male)" : "Male"}
                    </option>
                    <option value="female">
                      {language === "bn" ? "মহিলা (Female)" : language === "hi" ? "महिला (Female)" : "Female"}
                    </option>
                    <option value="other">
                      {language === "bn" ? "অন্যান্য (Other)" : language === "hi" ? "अन्य (Other)" : "Other"}
                    </option>
                  </select>
                </div>
              </div>

              {/* 3. Birth Day */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                <label className="sm:col-span-3 flex items-center gap-2 font-bold text-foreground">
                  <Calendar className="size-4 text-amber-600" />
                  <span>
                    {language === "bn" ? "জন্মতারিখ" : language === "hi" ? "जन्म तिथि" : "Birth Day"}
                    <span className="text-[11px] font-bold text-rose-600 ml-1.5">*</span>
                  </span>
                </label>
                <div className="sm:col-span-9 grid grid-cols-3 gap-2">
                  <input
                    ref={dayRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={day}
                    onChange={handleDayChange}
                    placeholder="DD"
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-3 py-2.5 text-center text-xs sm:text-sm font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs"
                  />
                  <input
                    ref={monthRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={month}
                    onChange={handleMonthChange}
                    placeholder="MM"
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-3 py-2.5 text-center text-xs sm:text-sm font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs"
                  />
                  <input
                    ref={yearRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={year}
                    onChange={handleYearChange}
                    placeholder="YYYY"
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-3 py-2.5 text-center text-xs sm:text-sm font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* 4. Birth Time */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                <label className="sm:col-span-3 flex items-center gap-2 font-bold text-foreground">
                  <Clock className="size-4 text-emerald-600" />
                  <span>
                    {language === "bn" ? "জন্মসময়" : language === "hi" ? "जन्म समय" : "Birth Time"}
                    <span className="text-[11px] font-semibold text-emerald-700 ml-1.5">
                      ({language === "bn" ? "ঐচ্ছিক — না দিলে ১২:০০ PM" : language === "hi" ? "वैकल्पिक — 12:00 PM" : "Optional — 12:00 PM"})
                    </span>
                  </span>
                </label>
                <div className="sm:col-span-9 grid grid-cols-4 gap-2">
                  <input
                    ref={hourRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={hour}
                    onChange={handleHourChange}
                    placeholder="HH"
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-2 py-2.5 text-center text-xs sm:text-sm font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs"
                  />
                  <input
                    ref={minuteRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={minute}
                    onChange={handleMinuteChange}
                    placeholder="MM"
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-2 py-2.5 text-center text-xs sm:text-sm font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs"
                  />
                  <input
                    ref={secondRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={second}
                    onChange={handleSecondChange}
                    placeholder="SS"
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-2 py-2.5 text-center text-xs sm:text-sm font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs"
                  />
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as any)}
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-2 py-2.5 text-center text-xs sm:text-sm font-bold text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs cursor-pointer"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              {/* 5. Birth Place with live geocoded autocomplete */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4">
                <label className="sm:col-span-3 flex items-start gap-2 pt-3 font-bold text-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-rose-500" />
                  <span>
                    {language === "bn" ? "জন্মস্থান" : "Birth Place"}
                    <span className="ml-1 text-rose-500">*</span>
                  </span>
                </label>
                <div className="sm:col-span-9">
                  <BirthPlaceField
                    value={selectedPlace}
                    onChange={(next) => {
                      setSelectedPlace(next);
                      if (next) {
                        setPlace(next.place);
                        setLatitude(next.latitude);
                        setLongitude(next.longitude);
                        if (next.timezoneOffset != null) setTimezone(String(next.timezoneOffset));
                      }
                    }}
                    birthDate={{
                      year: parseInt(year, 10) || undefined,
                      month: parseInt(month, 10) || undefined,
                      day: parseInt(day, 10) || undefined,
                    }}
                    language={language}
                    invalid={placeTouched && !selectedPlace}
                  />
                </div>
              </div>

              {/* 6. Advanced Settings Toggle (Optional) */}
              <div className="pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowAdvance((prev) => !prev)}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 transition-colors cursor-pointer"
                >
                  <Sliders className="size-3.5" />
                  <span>
                    {language === "bn"
                      ? "উন্নত সেটিংস (অয়নাংশ ও ভাব পদ্ধতি)"
                      : "Advanced Settings (Ayanamsa & House System)"}
                  </span>
                  {showAdvance ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                </button>

                {showAdvance && (
                  <div className="mt-3 p-4 rounded-2xl bg-surface-muted/30 border border-border/80 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">Ayanamsa</label>
                      <select
                        value={ayanamsa}
                        onChange={(e) => setAyanamsa(e.target.value as any)}
                        className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold cursor-pointer"
                      >
                        <option value="lahiri">Lahiri (Chitra Paksha - Classical Vedic)</option>
                        <option value="krishnamurti">Krishnamurti (KP Astrology)</option>
                        <option value="bv_raman">B.V. Raman</option>
                        <option value="yukteshwar">Yukteshwar</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">House System</label>
                      <select
                        value={houseSystem}
                        onChange={(e) => setHouseSystem(e.target.value as any)}
                        className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold cursor-pointer"
                      >
                        <option value="placidus">Placidus (Standard KP / Western)</option>
                        <option value="whole_sign">Whole Sign (Equal Rashi)</option>
                        <option value="equal">Equal House (30 deg each)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Feature Disabled Alert if applicable */}
              {kundliFeature && !kundliFeature.enabled && (
                <div className="pt-2">
                  <FeatureDisabledAlert
                    featureName={language === "bn" ? "কুন্ডলী গণনা" : "Kundli Calculation"}
                    language={language}
                  />
                </div>
              )}

              {/* Submit Button & Fee Info */}
              <div className="pt-3 space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-medium text-foreground-muted">
                    {language === "bn" ? "গণনা খরচ" : "Calculation Fee"}:
                  </span>
                  <FeatureCoinBadge
                    feature={kundliFeature}
                    walletBalance={walletBalance}
                    language={language}
                    showWallet={false}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || (kundliFeature ? !kundliFeature.enabled : false)}
                  className="w-full h-12 rounded-xl bg-brand-400 hover:bg-brand-500 text-ink-900 font-bold shadow-glow text-base transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="size-4" />
                  <span>
                    {loading
                      ? language === "bn"
                        ? "কুন্ডলী গণনা করা হচ্ছে..."
                        : "Calculating Kundli..."
                      : kundliFeature && !kundliFeature.enabled
                      ? language === "bn"
                        ? "ফিচারটি বন্ধ রয়েছে"
                        : "Feature Unavailable"
                      : language === "bn"
                      ? "কুন্ডলী গণনা করুন"
                      : "Calculate Kundli"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            SECTION 2: Kundli Results Section (Only rendered after calculation)
        ───────────────────────────────────────────────────────────── */}
        {result && (
          <div ref={resultsRef} className="space-y-8 pt-4">
            {/* Profile Card matching Screenshot 1 */}
            <div className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-soft text-center space-y-4">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                {t.profileTitle}
              </h2>
              <GoldDiamondDivider />

              {/* Rashi Graphic Symbol Box */}
              <div className="mx-auto size-24 rounded-2xl border-2 border-amber-300 bg-amber-50/80 flex items-center justify-center p-2 shadow-xs">
                <span className="text-5xl select-none" role="img" aria-label="Scorpio">
                  {ZODIAC_SYMBOLS_MAP[result.planetary_info.rasi] || "🦂"}
                </span>
              </div>

              <div>
                <span className="inline-block rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs px-4 py-1.5 shadow-2xs">
                  {result.personal_details.name}
                </span>
              </div>

              {/* Profile Action Buttons */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleResetForm();
                    formRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 px-4 py-2 text-xs font-bold text-amber-950 transition-colors shadow-2xs cursor-pointer"
                >
                  <FilePlus className="size-4 text-amber-600" />
                  <span>{t.createNewKundli}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    toast.success(
                      language === "bn"
                        ? "কুন্ডলী আপনার প্রোফাইলে সংরক্ষিত হয়েছে!"
                        : language === "hi"
                        ? "कुण्डली आपके प्रोफ़ाइल में सुरक्षित हो गई है!"
                        : "Kundli saved to your profile!"
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 px-4 py-2 text-xs font-bold text-amber-950 transition-colors shadow-2xs cursor-pointer"
                >
                  <Lock className="size-4 text-amber-600" />
                  <span>{t.saveKundli}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    formRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 px-4 py-2 text-xs font-bold text-amber-950 transition-colors shadow-2xs cursor-pointer"
                >
                  <Edit className="size-4 text-amber-600" />
                  <span>{t.editDetails}</span>
                </button>
              </div>
            </div>

            {/* Current Running Dasha Card */}
            {result.current_dasha && (
              <div className="rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-white p-6 shadow-soft relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      🪐
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">
                        {language === "bn"
                          ? "চলমান বিংশোত্তরী দশা মার্গদর্শন"
                          : language === "hi"
                          ? "वर्तमान विंशोत्तरी दशा मार्गदर्शन"
                          : "Current Vimshottari Dasha Insight"}
                      </div>
                      <h3 className="font-display text-lg sm:text-xl font-extrabold text-foreground">
                        {language === "bn" && result.current_dasha.verdict_bn
                          ? result.current_dasha.verdict_bn
                          : result.current_dasha.verdict}
                      </h3>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-xl bg-amber-100/90 border border-amber-300 px-3.5 py-1.5 text-xs font-bold text-amber-950 self-start sm:self-auto">
                    <Clock className="size-3.5 text-amber-700" />
                    <span>
                      {language === "bn" ? "সমাপ্তি:" : "Ends:"} {toLocalizedDigits(result.current_dasha.end_date, language)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-4 rounded-2xl bg-white/80 border border-amber-200 text-xs sm:text-sm leading-relaxed text-foreground-muted">
                  <p className="font-medium text-foreground">
                    {language === "bn" && result.current_dasha.guidance_bn
                      ? result.current_dasha.guidance_bn
                      : result.current_dasha.guidance}
                  </p>
                </div>
              </div>
            )}

            <div className="text-center space-y-1">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {t.kundliDetailsTitle}
              </h2>
              <GoldDiamondDivider />
            </div>

            {/* 4 Side-by-side Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: PERSONAL DETAILS */}
              <div className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-soft space-y-3">
                <div className="rounded-xl bg-amber-100/90 border border-amber-300/70 px-3 py-1.5 text-center font-display text-xs font-bold uppercase tracking-wider text-amber-950">
                  {t.personalDetailsCard}
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.nameLabel}
                    </span>
                    <span className="font-bold text-foreground truncate max-w-[120px]">
                      {result.personal_details.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.genderLabel}
                    </span>
                    <span className="font-bold text-foreground">
                      {KUNDLI_GENDER_NAMES[result.personal_details.gender.toLowerCase()]?.[language] || result.personal_details.gender}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.dobLabel}
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {toLocalizedDigits(result.personal_details.date_of_birth, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.tobLabel}
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {toLocalizedDigits(result.personal_details.time_of_birth, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblDay}
                    </span>
                    <span className="font-bold text-foreground">
                      {translateDayName(result.personal_details.day, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblVedicDay}
                    </span>
                    <span className="font-bold text-foreground">
                      {translateDayName(result.personal_details.vedic_day, language)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: ASTRONOMICAL INFO */}
              <div className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-soft space-y-3">
                <div className="rounded-xl bg-amber-100/90 border border-amber-300/70 px-3 py-1.5 text-center font-display text-xs font-bold uppercase tracking-wider text-amber-950">
                  {t.astronomicalInfoCard}
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblJulianDay}
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {toLocalizedDigits(result.astronomical_info.julian_day, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblAyanType}
                    </span>
                    <span className="font-bold text-foreground">{result.astronomical_info.ayan_type}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblHouseSystem}
                    </span>
                    <span className="font-bold text-foreground">{result.astronomical_info.house_system}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblPlace}
                    </span>
                    <span className="font-bold text-foreground truncate max-w-[120px]" title={result.astronomical_info.place}>
                      {result.astronomical_info.place}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblLongitude}
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {toLocalizedDigits(result.astronomical_info.longitude_formatted, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblLatitude}
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {toLocalizedDigits(result.astronomical_info.latitude_formatted, language)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: ASTRO POSITIONS */}
              <div className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-soft space-y-3">
                <div className="rounded-xl bg-amber-100/90 border border-amber-300/70 px-3 py-1.5 text-center font-display text-xs font-bold uppercase tracking-wider text-amber-950">
                  {t.astroPositionsCard}
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblAscLord}
                    </span>
                    <span className="font-bold text-foreground">
                      {translatePlanetName(result.astro_positions.asc_lord, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblAsc}
                    </span>
                    <span className="font-bold text-foreground">
                      {translateRashiName(result.astro_positions.asc, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblYoga}
                    </span>
                    <span className="font-bold text-foreground">
                      {translateYoga(result.astro_positions.yoga, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblTithi}
                    </span>
                    <span className="font-bold text-foreground">
                      {translateTithi(result.astro_positions.tithi, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblSunset}
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {toLocalizedDigits(result.astro_positions.sunset, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblSunrise}
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {toLocalizedDigits(result.astro_positions.sunrise, language)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 4: PLANETARY INFO */}
              <div className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-soft space-y-3">
                <div className="rounded-xl bg-amber-100/90 border border-amber-300/70 px-3 py-1.5 text-center font-display text-xs font-bold uppercase tracking-wider text-amber-950">
                  {t.planetaryInfoCard}
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblBalDasa}
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {translateBalDasa(result.planetary_info.bal_dasa, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblKaran}
                    </span>
                    <span className="font-bold text-foreground">
                      {translateKaran(result.planetary_info.karan, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.thNakshatraLord}
                    </span>
                    <span className="font-bold text-foreground">
                      {translatePlanetName(result.planetary_info.nakshatra_lord, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.thNakshatra}
                    </span>
                    <span className="font-bold text-foreground">
                      {translateNakshatraName(result.planetary_info.nakshatra, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblRasiLord}
                    </span>
                    <span className="font-bold text-foreground">
                      {translatePlanetName(result.planetary_info.rasi_lord, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblRasi}
                    </span>
                    <span className="font-bold text-foreground">
                      {translateRashiName(result.planetary_info.rasi, language)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Style Switcher */}
            <div className="text-center space-y-3 pt-2">
              <h3 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                {t.chartStyleTitle}
              </h3>
              <GoldDiamondDivider />

              <div className="inline-flex rounded-xl bg-amber-50 p-1 border border-amber-300">
                {(
                  [
                    { key: "north", label: language === "bn" ? "উত্তর ভারত" : language === "hi" ? "उत्तर भारत" : "North" },
                    { key: "east", label: language === "bn" ? "পূর্ব ভারত" : language === "hi" ? "पूर्व भारत" : "East" },
                    { key: "south", label: language === "bn" ? "দক্ষিণ ভারত" : language === "hi" ? "दक्षिण भारत" : "South" },
                    { key: "wheel", label: language === "bn" ? "ডায়মন্ড চার্ট" : language === "hi" ? "डायमंड चक्र" : "AppliedJyotish" },
                  ] as const
                ).map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setChartStyle(s.key)}
                    className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                      chartStyle === s.key
                        ? "bg-amber-500 text-white shadow-2xs"
                        : "text-amber-950 hover:bg-amber-100 cursor-pointer"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Side-by-side Charts: Lagna Chart (D1) and Navamsa Chart (D9) */}
            <div ref={d9Ref} className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-soft">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
                {/* 1. Lagna Chart (D1) */}
                <div className="w-full flex flex-col items-center">
                  <KundliDiamondChart
                    title={t.lagnaChartTitle}
                    planets={result.d1_planets}
                    ascSignNum={result.d1_asc_sign}
                    isNavamsa={false}
                    chartStyle={chartStyle}
                  />
                </div>

                {/* 2. Navamsa Chart (D9) */}
                <div className="w-full flex flex-col items-center">
                  <KundliDiamondChart
                    title={t.navamsaChartTitle}
                    planets={result.d9_planets}
                    ascSignNum={result.d9_asc_sign}
                    isNavamsa={true}
                    chartStyle={chartStyle}
                  />
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                SECTION 3: Planet & House Tables (Screenshot 3)
            ───────────────────────────────────────────────────────────── */}
            {/* Table 1: Planet Table */}
            <div className="rounded-3xl border border-amber-200/80 bg-white p-5 sm:p-6 shadow-soft space-y-4">
              <div className="text-center space-y-1">
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                  {t.planetTableTitle}
                </h3>
                <GoldDiamondDivider />
              </div>

              <div className="overflow-x-auto rounded-2xl border border-amber-200/80">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-amber-100/90 text-amber-950 font-bold border-b border-amber-300">
                      <th className="py-3 px-4 font-bold text-center">{t.thPlanet}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thLongitude}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thNakshatra}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thNakshatraLord}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thPada}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thSubLord}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thFullDegree}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100/80 bg-white">
                    {result.planets_table.map((row, idx) => (
                      <tr
                        key={`planet-row-${idx}`}
                        className="hover:bg-amber-50/60 transition-colors"
                      >
                        <td className="py-3 px-4 text-center font-bold text-foreground">
                          {translatePlanetName(row.name, language)}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-foreground tabular-nums">
                          {translateDmsStyled(row.longitude_formatted, language)}
                        </td>
                        <td className="py-3 px-4 text-center text-foreground-muted">
                          {translateNakshatraName(row.nakshatra, language)}
                        </td>
                        <td className="py-3 px-4 text-center text-foreground-muted">
                          {translatePlanetName(row.nakshatra_lord, language)}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-amber-800 tabular-nums">
                          {toLocalizedDigits(row.pada, language)}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-foreground">
                          {translatePlanetName(row.sub_lord, language)}
                        </td>
                        <td className="py-3 px-4 text-center text-foreground-muted tabular-nums">
                          {toLocalizedDigits(row.full_degree_formatted, language)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: House Table */}
            <div className="rounded-3xl border border-amber-200/80 bg-white p-5 sm:p-6 shadow-soft space-y-4">
              <div className="text-center space-y-1">
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                  {t.houseTableTitle}
                </h3>
                <GoldDiamondDivider />
              </div>

              <div className="overflow-x-auto rounded-2xl border border-amber-200/80">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-amber-100/90 text-amber-950 font-bold border-b border-amber-300">
                      <th className="py-3 px-4 font-bold text-center">{t.thHouse}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thLongitude}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thNakshatra}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thNakshatraLord}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thPada}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thSubLord}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thFullDegree}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100/80 bg-white">
                    {result.houses_table.map((row, idx) => (
                      <tr
                        key={`house-row-${idx}`}
                        className="hover:bg-amber-50/60 transition-colors"
                      >
                        <td className="py-3 px-4 text-center font-bold text-foreground">
                          {translateHouseName(row.name, language)}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-foreground tabular-nums">
                          {translateDmsStyled(row.longitude_formatted, language)}
                        </td>
                        <td className="py-3 px-4 text-center text-foreground-muted">
                          {translateNakshatraName(row.nakshatra, language)}
                        </td>
                        <td className="py-3 px-4 text-center text-foreground-muted">
                          {translatePlanetName(row.nakshatra_lord, language)}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-amber-800 tabular-nums">
                          {toLocalizedDigits(row.pada, language)}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-foreground">
                          {translatePlanetName(row.sub_lord, language)}
                        </td>
                        <td className="py-3 px-4 text-center text-foreground-muted tabular-nums">
                          {toLocalizedDigits(row.full_degree_formatted, language)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table: Planetary Dignities, Combustion & Avasthas */}
            {result.planetary_dignities && result.planetary_dignities.length > 0 && (
              <div className="rounded-3xl border border-amber-200/80 bg-white p-5 sm:p-6 shadow-soft space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                    {language === "bn"
                      ? "গ্রহের বলবত্তা, দগ্ধাবস্থা ও পঞ্চাবস্থা বিচার"
                      : language === "hi"
                      ? "ग्रहों का बलाबल, दग्धावस्था एवं पंचावस्था"
                      : "Planetary Dignities, Combustion & Avasthas"}
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    {language === "bn"
                      ? "পরাশর হোরা শাস্ত্র অনুসারে প্রতিটি গ্রহের উচ্চ/নীচ বলবত্তা, সূর্যের সান্নিধ্যে দগ্ধাবস্থা এবং জাগ্রত শক্তির মাত্রা।"
                      : "Classical Brihat Parashara analysis of planetary dignity, combustion and operational vitality."}
                  </p>
                  <GoldDiamondDivider />
                </div>

                <div className="overflow-x-auto rounded-2xl border border-amber-200/80">
                  <table className="w-full border-collapse text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-amber-100/90 text-amber-950 font-bold border-b border-amber-300">
                        <th className="py-3 px-4 font-bold text-center">{language === "bn" ? "গ্রহ" : "Planet"}</th>
                        <th className="py-3 px-4 font-bold text-center">{language === "bn" ? "রাশি ও ডিগ্রি" : "Sign & Deg"}</th>
                        <th className="py-3 px-4 font-bold text-center">{language === "bn" ? "অবস্থান ভাব" : "House"}</th>
                        <th className="py-3 px-4 font-bold text-center">{language === "bn" ? "বলবত্তা (Dignity)" : "Dignity"}</th>
                        <th className="py-3 px-4 font-bold text-center">{language === "bn" ? "পঞ্চাবস্থা" : "Avastha"}</th>
                        <th className="py-3 px-4 font-bold text-center">{language === "bn" ? "দগ্ধাবস্থা" : "Combustion"}</th>
                        <th className="py-3 px-4 font-bold text-center">{language === "bn" ? "বিশেষ মর্যাদা" : "Special Yoga"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100/80 bg-white">
                      {result.planetary_dignities.map((item, idx) => (
                        <tr key={`dig-${idx}`} className="hover:bg-amber-50/60 transition-colors">
                          <td className="py-3 px-4 text-center font-bold text-foreground">
                            {translatePlanetName(item.planet, language)}
                            {item.is_retrograde && (
                              <span className="ml-1 text-[11px] text-amber-700 font-bold">
                                ({language === "bn" ? "বক্রী" : "R"})
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center text-foreground-muted">
                            <span className="font-semibold text-foreground">
                              {translateRashiName(item.sign, language)}
                            </span>
                            <span className="ml-1 text-[11px] tabular-nums text-foreground-muted">
                              ({toLocalizedDigits(item.degree_formatted, language)})
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-amber-900 tabular-nums">
                            {toLocalizedDigits(item.house, language)}
                            <span className="text-[10px] text-foreground-muted ml-0.5">
                              {language === "bn" ? "ম ভাব" : "th"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                item.dignity === "Exalted"
                                  ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                                  : item.dignity === "Moolatrikona" || item.dignity === "Own Sign"
                                  ? "bg-amber-100 text-amber-900 border-amber-300"
                                  : item.dignity === "Friendly Sign"
                                  ? "bg-blue-100 text-blue-900 border-blue-300"
                                  : item.dignity === "Debilitated"
                                  ? "bg-rose-100 text-rose-900 border-rose-300"
                                  : "bg-stone-100 text-stone-800 border-stone-300"
                              }`}
                            >
                              {language === "bn" ? item.dignity_bn : language === "hi" ? item.dignity_hi : item.dignity}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-medium">
                            <span className="text-foreground">
                              {language === "bn" ? item.avastha_bn : language === "hi" ? item.avastha_hi : item.avastha}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {item.is_combust ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-900 border border-orange-300">
                                <Flame className="size-3 text-orange-600" />
                                {language === "bn" ? "সূর্যদগ্ধ" : "Combust"}
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-medium text-xs">
                                {language === "bn" ? "অক্ষত" : "Normal"}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center text-xs">
                            {item.neechabhanga ? (
                              <span
                                title={item.neechabhanga_reason || undefined}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-500 text-white shadow-2xs"
                              >
                                <Award className="size-3" />
                                {language === "bn" ? "নীচভঙ্গ রাজযোগ" : "Neechabhanga"}
                              </span>
                            ) : (
                              <span className="text-foreground-muted">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                SECTION: 12 Houses Astrological Synthesis (দ্বাদশ ভাব বিচার)
            ───────────────────────────────────────────────────────────── */}
            {result.house_predictions && result.house_predictions.length > 0 && (
              <div className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-soft space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                    {language === "bn"
                      ? "দ্বাদশ ভাব ও জীবনের ১২টি ক্ষেত্রের ফলাফল"
                      : language === "hi"
                      ? "द्वादश भाव एवं जीवन के १२ क्षेत्र"
                      : "12 Houses Deep Astrological Synthesis"}
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    {language === "bn"
                      ? "আপনার কুন্ডলীর প্রতিটি ভাবের রাশিপতি, অবস্থানরত গ্রহ এবং ক্যারিয়ার, অর্থ ও সম্পর্কের ওপর প্রভাব।"
                      : "Comprehensive house-by-house analysis of career, wealth, health and relationships."}
                  </p>
                  <GoldDiamondDivider />
                </div>

                {/* 12 House Selector Buttons */}
                <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
                  {result.house_predictions.map((h) => {
                    const isSelected = activeHouseTab === h.house_number;
                    return (
                      <button
                        key={`h-tab-${h.house_number}`}
                        type="button"
                        onClick={() => setActiveHouseTab(h.house_number)}
                        className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                            : "bg-amber-50/60 hover:bg-amber-100 text-amber-950 border-amber-200"
                        }`}
                      >
                        <div className="font-display font-extrabold text-sm tabular-nums">
                          {toLocalizedDigits(h.house_number, language)}
                        </div>
                        <div className="text-[10px] font-bold truncate">
                          {language === "bn" ? h.house_name_bn.split(" ")[0] : h.house_name.split(" ")[0]}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected House Deep Insights Card */}
                {(() => {
                  const sel =
                    result.house_predictions.find((h) => h.house_number === activeHouseTab) ||
                    result.house_predictions[0];
                  if (!sel) return null;

                  return (
                    <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 p-5 sm:p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200">
                        <div>
                          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">
                            {language === "bn" ? "ভাব পরিচয়" : "House Overview"}
                          </div>
                          <h4 className="font-display text-xl font-extrabold text-foreground flex items-center gap-2">
                            <span>
                              {toLocalizedDigits(sel.house_number, language)}
                              {language === "bn" ? "ম ভাব: " : "th House: "}
                              {language === "bn" ? sel.house_name_bn : sel.house_name}
                            </span>
                          </h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="px-3 py-1 rounded-xl bg-amber-100 border border-amber-300 font-bold text-amber-950">
                            {language === "bn" ? "রাশি: " : "Sign: "}
                            {translateRashiName(sel.sign, language)}
                          </span>
                          <span className="px-3 py-1 rounded-xl bg-amber-100 border border-amber-300 font-bold text-amber-950">
                            {language === "bn" ? "ভাবাধিপতি: " : "Lord: "}
                            {translatePlanetName(sel.sign_lord, language)} (
                            {toLocalizedDigits(sel.lord_placement_house, language)}
                            {language === "bn" ? "মে অবস্থান" : "th house"})
                          </span>
                        </div>
                      </div>

                      {/* Occupants badge */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-foreground-muted">
                          {language === "bn" ? "অবস্থানরত গ্রহ:" : "Occupants:"}
                        </span>
                        {sel.occupants.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {sel.occupants.map((occ, oIdx) => (
                              <span
                                key={`occ-${oIdx}`}
                                className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-white font-bold text-[11px]"
                              >
                                {translatePlanetName(occ, language)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-foreground-muted italic">
                            {language === "bn" ? "কোন গ্রহ নেই (দৃষ্টির প্রভাব প্রযোজ্য)" : "Empty house"}
                          </span>
                        )}
                      </div>

                      {/* 3 Column Detailed Effect Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <div className="rounded-xl border border-amber-200 bg-white p-4 space-y-1.5 shadow-2xs">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                            <BookOpen className="size-3.5 text-amber-600" />
                            <span>{language === "bn" ? "মূল তাৎপর্য" : "Significance"}</span>
                          </div>
                          <p className="text-xs text-foreground-muted leading-relaxed">
                            {language === "bn" ? sel.overview_bn : sel.overview}
                          </p>
                        </div>

                        <div className="rounded-xl border border-amber-200 bg-white p-4 space-y-1.5 shadow-2xs">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                            <Award className="size-3.5 text-emerald-600" />
                            <span>{language === "bn" ? "কর্ম ও অর্থভাগ্য" : "Career & Wealth"}</span>
                          </div>
                          <p className="text-xs text-foreground-muted leading-relaxed">
                            {language === "bn" ? sel.career_wealth_effect_bn : sel.career_wealth_effect}
                          </p>
                        </div>

                        <div className="rounded-xl border border-amber-200 bg-white p-4 space-y-1.5 shadow-2xs">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                            <Heart className="size-3.5 text-purple-600" />
                            <span>{language === "bn" ? "সম্পর্ক ও পারিবারিক সুখ" : "Family & Relationships"}</span>
                          </div>
                          <p className="text-xs text-foreground-muted leading-relaxed">
                            {language === "bn" ? sel.relationship_family_effect_bn : sel.relationship_family_effect}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                SECTION 4: Vimshottari Dasha 3x3 Grid (Screenshot 4)
            ───────────────────────────────────────────────────────────── */}
            <div className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-soft space-y-6">
              <div className="text-center space-y-1">
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                  {t.vimshottariDashaTitle}
                </h3>
                <GoldDiamondDivider />
              </div>

              {/* 3x3 Grid of 9 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {result.dashas_grid.map((card, cIdx) => (
                  <div
                    key={`dasha-card-${cIdx}`}
                    className="rounded-2xl border border-amber-200/80 bg-amber-50/30 p-4 shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-display text-center text-xs font-bold uppercase tracking-wider text-amber-950 pb-2 border-b border-amber-200">
                        {translateDashaCardTitle(card.title, language)}
                      </h4>

                      <div className="mt-3 overflow-x-auto">
                        <table className="w-full text-[11px] text-left">
                          <thead>
                            <tr className="bg-amber-100/80 text-amber-950 font-bold">
                              <th className="py-1.5 px-2 font-bold">{t.thAntarDasha}</th>
                              <th className="py-1.5 px-2 font-bold text-center">{t.thDuration}</th>
                              <th className="py-1.5 px-2 font-bold text-center">{t.thEndDate}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-amber-100/60 bg-white/70">
                            {card.antardashas.map((ant, aIdx) => (
                              <tr key={`ant-${cIdx}-${aIdx}`} className="hover:bg-amber-50/60">
                                <td className="py-1.5 px-2 font-bold text-foreground flex items-center gap-1">
                                  <span>{translatePlanetName(ant.lord, language)}</span>
                                  {ant.duration !== "-" && (
                                    <span className="text-amber-600 text-[9px]">➔</span>
                                  )}
                                </td>
                                <td className="py-1.5 px-2 text-center text-foreground-muted tabular-nums">
                                  {translateDashaDuration(ant.duration, language)}
                                </td>
                                <td className="py-1.5 px-2 text-center text-foreground-muted tabular-nums">
                                  {ant.end_date === "-" ? "-" : toLocalizedDigits(ant.end_date, language)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                SECTION 5: Divisional Charts & Yoga (Screenshot 5)
            ───────────────────────────────────────────────────────────── */}
            <div className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-soft space-y-6">
              <div className="text-center space-y-2">
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                  {t.divisionalChartsTitle}
                </h3>
                <GoldDiamondDivider />

                {/* Divisional Chart Switcher Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  {[
                    {
                      id: "d1",
                      name: language === "bn" ? "D1: লগ্ন ছক (সাধারণ জীবন)" : language === "hi" ? "D1: लग्न कुंडली (जीवन)" : "D1: Rasi (Foundation)",
                    },
                    {
                      id: "d9",
                      name: language === "bn" ? "D9: নবাংশ ছক (দাম্পত্য ও ভাগ্য)" : language === "hi" ? "D9: नवांश कुंडली (भाग्य/दांपत्य)" : "D9: Navamsha (Destiny)",
                    },
                    {
                      id: "d10",
                      name: language === "bn" ? "D10: দশমাংশ ছক (ক্যারিয়ার ও পদমর্যাদা)" : language === "hi" ? "D10: दशमांश कुंडली (करियर)" : "D10: Dasamsha (Career)",
                    },
                    {
                      id: "d7",
                      name: language === "bn" ? "D7: সপ্তাংশ ছক (সন্তান ও সৃজনশীলতা)" : language === "hi" ? "D7: सप्तांश कुंडली (संतान)" : "D7: Saptamsha (Children)",
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveChartTab(tab.id as any)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        activeChartTab === tab.id
                          ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                          : "bg-amber-50/70 text-amber-950 border-amber-300/80 hover:bg-amber-100"
                      }`}
                    >
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </div>

                {/* Regional Chart Style Selector (North, East, South) */}
                <div className="inline-flex rounded-xl bg-amber-50 p-1 border border-amber-300 mt-2">
                  {(
                    [
                      { key: "north", label: language === "bn" ? "উত্তর ভারত" : language === "hi" ? "उत्तर भारत" : "North" },
                      { key: "east", label: language === "bn" ? "পূর্ব ভারত" : language === "hi" ? "पूर्व भारत" : "East" },
                      { key: "south", label: language === "bn" ? "দক্ষিণ ভারত" : language === "hi" ? "दक्षिण भारत" : "South" },
                    ] as const
                  ).map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setChartStyle(s.key as any)}
                      className={`rounded-lg px-4 py-1 text-xs font-bold transition-all cursor-pointer ${
                        chartStyle === s.key
                          ? "bg-amber-500 text-white shadow-2xs"
                          : "text-amber-950 hover:bg-amber-100"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Divisional Chart Rendering */}
              <div className="flex flex-col items-center space-y-3">
                {activeChartTab === "d1" && (
                  <>
                    <p className="text-xs text-foreground-muted text-center max-w-md">
                      {language === "bn"
                        ? "लग्न কুন্ডলী (D1) সমগ্র মানবজীবনের শারীরিক গঠন, স্বাস্থ্য, প্রবৃত্তি এবং ভাগ্যের মূল স্তম্ভ নির্দেশ করে।"
                        : "Lagna Chart (D1) represents the foundational core, physical life, vitality and basic destiny."}
                    </p>
                    <KundliDiamondChart
                      title={t.rasiChartTitle}
                      planets={result.d1_planets}
                      ascSignNum={result.d1_asc_sign}
                      isNavamsa={false}
                      chartStyle={chartStyle}
                      className="max-w-lg w-full"
                    />
                  </>
                )}

                {activeChartTab === "d9" && (
                  <>
                    <p className="text-xs text-foreground-muted text-center max-w-md">
                      {language === "bn"
                        ? "নবাংশ কুন্ডলী (D9) আত্মার অন্তর্নিহিত শক্তি, আধ্যাত্মিক সাধনা এবং দাম্পত্য জীবনের পূর্ণতা নির্দেশ করে।"
                        : "Navamsha Chart (D9) reveals soul destiny, spiritual evolution and marriage longevity."}
                    </p>
                    <KundliDiamondChart
                      title={language === "bn" ? "নবাংশ চক্র (D9) — দাম্পত্য ও ভাগ্য" : language === "hi" ? "नवांश चक्र (D9)" : "Navamsha Chart (D9)"}
                      planets={result.d9_planets}
                      ascSignNum={result.d9_asc_sign}
                      isNavamsa={true}
                      chartStyle={chartStyle}
                      className="max-w-lg w-full"
                    />
                  </>
                )}

                {activeChartTab === "d10" && (
                  <>
                    <p className="text-xs text-foreground-muted text-center max-w-md">
                      {language === "bn"
                        ? "দশমাংশ কুন্ডলী (D10) কর্মজীবন, পেশাগত সাফল্য, পদমর্যাদা, খ্যাতি এবং সমাজে অর্জিত প্রতিষ্ঠা নির্দেশ করে।"
                        : "Dasamsha Chart (D10) governs profession, authority, achievements and social stature."}
                    </p>
                    <KundliDiamondChart
                      title={language === "bn" ? "দশমাংশ চক্র (D10) — কর্ম ও রাজসম্মান" : language === "hi" ? "दशमांश चक्र (D10)" : "Dasamsha Chart (D10)"}
                      planets={result.d10_planets || result.d1_planets}
                      ascSignNum={result.d10_asc_sign || result.d1_asc_sign}
                      isNavamsa={false}
                      chartStyle={chartStyle}
                      className="max-w-lg w-full"
                    />
                  </>
                )}

                {activeChartTab === "d7" && (
                  <>
                    <p className="text-xs text-foreground-muted text-center max-w-md">
                      {language === "bn"
                        ? "সপ্তাংশ কুন্ডলী (D7) সন্তানসুখ, বংশধর, উদ্ভাবনী ক্ষমতা এবং সৃষ্টিশীল মেধা নির্দেশ করে।"
                        : "Saptamsha Chart (D7) governs children, progeny, lineage and creative intellect."}
                    </p>
                    <KundliDiamondChart
                      title={language === "bn" ? "সপ্তাংশ চক্র (D7) — সন্তান ও সৃজনশীলতা" : language === "hi" ? "सप्तांश चक्र (D7)" : "Saptamsha Chart (D7)"}
                      planets={result.d7_planets || result.d1_planets}
                      ascSignNum={result.d7_asc_sign || result.d1_asc_sign}
                      isNavamsa={false}
                      chartStyle={chartStyle}
                      className="max-w-lg w-full"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Yoga Section matching Screenshot 5 */}
            <div ref={yogaRef} className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-soft space-y-6">
              <div className="text-center space-y-1">
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                  {t.yogaAnalysisTitle}
                </h3>
                <GoldDiamondDivider />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Left Column: Kundli Yoga Status List */}
                <div className="space-y-3">
                  <div className="rounded-xl bg-amber-500 px-4 py-2.5 text-center font-bold text-xs uppercase tracking-wider text-white shadow-2xs">
                    {t.kundliYogaBanner} — {name || result.personal_details.name}
                  </div>

                  <div className="space-y-2.5">
                    {result.yogas_status.map((y, idx) => (
                      <div
                        key={`yoga-stat-${idx}`}
                        className="flex items-center justify-between rounded-xl border border-amber-200/80 bg-amber-50/40 px-4 py-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="flex size-5 items-center justify-center rounded-full bg-amber-100 border border-amber-300 text-xs">
                            💡
                          </span>
                          <span className="font-bold text-sm text-foreground">
                            {y.is_present ? (
                              <span className="text-emerald-600 mr-1.5 font-bold">✔</span>
                            ) : (
                              <span className="text-rose-600 mr-1.5 font-bold">✖</span>
                            )}
                            {translateYogaName(y.name, language)}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-bold rounded-lg px-2.5 py-0.5 border ${
                            y.is_present
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : "bg-rose-50 text-rose-800 border-rose-300"
                          }`}
                        >
                          {y.is_present ? t.presentBadge : t.notPresentBadge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Detailed Active Yogas */}
                <div className="space-y-4">
                  {result.active_yogas_details.map((act, idx) => {
                    const localizedAct = translateYogaDetails(act.name, act.description, act.effects, language);
                    return (
                      <div
                        key={`act-yoga-${idx}`}
                        className="rounded-2xl border border-amber-200/80 bg-amber-50/30 p-4 space-y-1.5 shadow-2xs"
                      >
                        <h4 className="font-display text-base font-bold text-amber-950">
                          {localizedAct.name}
                        </h4>
                        <p className="text-xs text-foreground-muted leading-relaxed">
                          {localizedAct.effects}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Extended Classical Raj Yogas & Dhana Yogas */}
            {result.extended_yogas && result.extended_yogas.length > 0 && (
              <div className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-soft space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                    {language === "bn"
                      ? "পঞ্চ মহাপুরুষ, রাজযোগ ও ধনযোগ বিশ্লেষণ"
                      : language === "hi"
                      ? "पंच महापुरुष, राजयोग एवं धनयोग विश्लेषण"
                      : "Pancha Mahapurusha, Raj Yogas & Dhana Yogas"}
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    {language === "bn"
                      ? "পরাশর হোরা শাস্ত্র ও জাতক পারিজাত অনুসারে গঠিত বিশেষ গ্রহ সংস্থান ও জীবনের শুভ ফলাফল।"
                      : "Classical Vedic planetary configurations conferring wealth, authority, wisdom and fortune."}
                  </p>
                  <GoldDiamondDivider />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.extended_yogas.map((ey, eIdx) => (
                    <div
                      key={`ext-yoga-${eIdx}`}
                      className="rounded-2xl border-2 border-amber-200/90 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 p-5 space-y-2.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded-lg bg-amber-500 text-white">
                            <Star className="size-4" />
                          </span>
                          <h4 className="font-display text-base font-extrabold text-amber-950">
                            {language === "bn" ? ey.name_bn : ey.name}
                          </h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          {language === "bn" ? ey.category_bn : ey.category}
                        </span>
                      </div>

                      <p className="text-xs text-foreground-muted leading-relaxed font-serif italic">
                        {language === "bn" ? ey.description_bn : ey.description}
                      </p>

                      <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-foreground leading-relaxed">
                        <span className="font-bold text-amber-950 mr-1">
                          {language === "bn" ? "প্রভাব:" : "Effects:"}
                        </span>
                        {language === "bn" ? ey.effects_bn : ey.effects}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                SECTION: Classical Doshas Analysis & Vedic Remedies (দোষ ও প্রতিকার)
            ───────────────────────────────────────────────────────────── */}
            {result.doshas_analysis && result.doshas_analysis.length > 0 && (
              <div className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-soft space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                    {language === "bn"
                      ? "প্রধান বৈদিক দোষ বিশ্লেষণ ও প্রতিকার"
                      : language === "hi"
                      ? "प्रमुख वैदिक दोष विश्लेषण एवं उपाय"
                      : "Classical Vedic Dosha Analysis & Remedies"}
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    {language === "bn"
                      ? "মাঙ্গলিক, কালসর্প, পিতৃ ও গুরু চণ্ডাল দোষের গভীর বিচার, ভঙ্গ নির্ণয় এবং নিশ্চিত বৈদিক প্রতিকার।"
                      : "Authentic Parashari checks for Manglik, Kaal Sarp, Pitra and Guru Chandal doshas."}
                  </p>
                  <GoldDiamondDivider />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {result.doshas_analysis.map((d, dIdx) => (
                    <div
                      key={`dosha-${dIdx}`}
                      className="rounded-2xl border-2 border-amber-200 bg-amber-50/20 p-5 space-y-3 shadow-2xs"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                        <div className="flex items-center gap-2">
                          <span className="size-7 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-sm">
                            {d.is_present ? "⚠️" : "✨"}
                          </span>
                          <h4 className="font-display text-base font-extrabold text-foreground">
                            {language === "bn" ? d.dosha_name_bn : d.dosha_name}
                          </h4>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                            d.is_present
                              ? "bg-rose-100 text-rose-900 border-rose-300"
                              : "bg-emerald-100 text-emerald-900 border-emerald-300"
                          }`}
                        >
                          {d.is_present
                            ? language === "bn"
                              ? `সক্রিয় (${d.severity_bn})`
                              : `Active (${d.severity})`
                            : language === "bn"
                            ? "দোষমুক্ত / প্রশমিত"
                            : "Clean / Cancelled"}
                        </span>
                      </div>

                      {d.specific_type_bn && (
                        <div className="text-xs font-bold text-amber-900">
                          {language === "bn" ? "প্রকৃতি:" : "Type:"} {d.specific_type_bn}
                        </div>
                      )}

                      {d.cancellation_reason_bn && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                          <span className="font-bold">
                            {language === "bn" ? "দোষভঙ্গ যোগ: " : "Cancellation: "}
                          </span>
                          {d.cancellation_reason_bn}
                        </div>
                      )}

                      <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                          <ShieldCheck className="size-3.5 text-amber-600" />
                          <span>{language === "bn" ? "প্রস্তাবিত বৈদিক প্রতিকার:" : "Recommended Remedy:"}</span>
                        </div>
                        <p className="text-xs text-foreground-muted leading-relaxed">
                          {language === "bn" ? d.remedy_bn : d.remedy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                SECTION: Personalized Gemstones & Vedic Remedies (রত্ন ও রুদ্রাক্ষ)
            ───────────────────────────────────────────────────────────── */}
            {result.remedies && (
              <div className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-soft space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                    {language === "bn"
                      ? "ব্যক্তিগত রত্ন, রুদ্রাক্ষ ও ইষ্টদেবতা নির্দেশিকা"
                      : language === "hi"
                      ? "व्यक्तिगत रत्न, रुद्राक्ष एवं इष्टदेवता मार्गदर्शन"
                      : "Personalized Gemstones, Rudraksha & Ishta Devata Guide"}
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    {language === "bn"
                      ? "বৃহৎ সংহিতা ও জাতক পারিজাত মতে আপনার কুণ্ডলীর ত্রিকোণাধিপতি অনুযায়ী প্রাণ রত্ন, ভাগ্য রত্ন ও রুদ্রাক্ষ বিধান।"
                      : "Classical Brihat Samhita prescriptions for Life Stone, Lucky Stone, Rudraksha and Ishta Devata."}
                  </p>
                  <GoldDiamondDivider />
                </div>

                {/* 3 Gemstone Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    { data: result.remedies.life_stone, title: language === "bn" ? "প্রাণ রত্ন (লগ্ন রত্ন)" : "Life Stone", badge: language === "bn" ? "১ম ভাবাধিপতি" : "1st Lord" },
                    { data: result.remedies.lucky_stone, title: language === "bn" ? "ভাগ্য রত্ন (ত্রিকোণ রত্ন)" : "Lucky Stone", badge: language === "bn" ? "৯ম ভাবাধিপতি" : "9th Lord" },
                    { data: result.remedies.career_stone, title: language === "bn" ? "কর্ম রত্ন (পেশাগত রত্ন)" : "Career Stone", badge: language === "bn" ? "১০ম ভাবাধিপতি" : "10th Lord" },
                  ].map((card, cIdx) => (
                    <div
                      key={`gem-${cIdx}`}
                      className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50/50 to-white p-5 space-y-3.5 shadow-2xs flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">
                            {card.badge}
                          </span>
                          <span className="p-1 rounded-lg bg-amber-100 text-amber-900">
                            <Gem className="size-4" />
                          </span>
                        </div>

                        <div>
                          <h4 className="font-display text-lg font-extrabold text-foreground">
                            {language === "bn" ? card.data.stone_name_bn : card.data.stone_name}
                          </h4>
                          <div className="text-xs font-semibold text-amber-900">
                            {card.data.sanskrit_name} ({card.data.ruling_planet})
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center justify-between border-b border-amber-100 pb-1">
                            <span className="text-foreground-muted">{language === "bn" ? "ধাতু:" : "Metal:"}</span>
                            <span className="font-bold text-foreground">
                              {language === "bn" ? card.data.metal_bn : card.data.metal}
                            </span>
                          </div>
                          <div className="flex items-center justify-between border-b border-amber-100 pb-1">
                            <span className="text-foreground-muted">{language === "bn" ? "আঙুল:" : "Finger:"}</span>
                            <span className="font-bold text-foreground">
                              {language === "bn" ? card.data.finger_bn : card.data.finger}
                            </span>
                          </div>
                          <div className="flex items-center justify-between border-b border-amber-100 pb-1">
                            <span className="text-foreground-muted">{language === "bn" ? "ধারণের বার:" : "Day:"}</span>
                            <span className="font-bold text-foreground">
                              {language === "bn" ? card.data.wearing_day_bn : card.data.wearing_day}
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-amber-100/70 border border-amber-200 text-center text-xs font-bold text-amber-950 font-serif">
                          {card.data.beej_mantra}
                        </div>
                      </div>

                      <p className="text-xs text-foreground-muted leading-relaxed pt-2 border-t border-amber-100">
                        {language === "bn" ? card.data.benefit_bn : card.data.benefit}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Rudraksha, Ishta Devata & Favorable Elements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-5 space-y-2 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📿</span>
                      <h4 className="font-display text-base font-bold text-amber-950">
                        {language === "bn" ? "অনুকূল রুদ্রাক্ষ" : "Auspicious Rudraksha"}
                      </h4>
                    </div>
                    <p className="text-xs text-foreground-muted leading-relaxed">
                      {language === "bn"
                        ? result.remedies.rudraksha_recommendation_bn
                        : result.remedies.rudraksha_recommendation}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-5 space-y-2 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🕉️</span>
                      <h4 className="font-display text-base font-bold text-amber-950">
                        {language === "bn" ? "ইষ্টদেবতা ও সাধনা" : "Ishta Devata"}
                      </h4>
                    </div>
                    <p className="text-xs text-foreground-muted leading-relaxed">
                      {language === "bn"
                        ? result.remedies.ishta_devata_bn
                        : result.remedies.ishta_devata}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-5 space-y-2.5 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <Compass className="size-4 text-amber-700" />
                      <h4 className="font-display text-base font-bold text-amber-950">
                        {language === "bn" ? "অনুকূল দিক, বর্ণ ও সংখ্যা" : "Favorable Elements"}
                      </h4>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between border-b border-amber-100 pb-1">
                        <span className="text-foreground-muted">{language === "bn" ? "শুভ দিক:" : "Direction:"}</span>
                        <span className="font-bold text-foreground">
                          {language === "bn"
                            ? result.remedies.favorable_direction_bn
                            : result.remedies.favorable_direction}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-amber-100 pb-1">
                        <span className="text-foreground-muted">{language === "bn" ? "শুভ বর্ণ:" : "Colors:"}</span>
                        <span className="font-bold text-foreground">
                          {language === "bn"
                            ? result.remedies.lucky_colors_bn.join(", ")
                            : result.remedies.lucky_colors.join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-foreground-muted">{language === "bn" ? "শুভ সংখ্যা:" : "Numbers:"}</span>
                        <span className="font-bold text-foreground tabular-nums">
                          {result.remedies.lucky_numbers.map((n) => toLocalizedDigits(n, language)).join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Action Bar at Bottom matching Screenshot 2 & 5 */}
      {result && (
        <div className="fixed bottom-4 inset-x-0 mx-auto max-w-md px-4 z-40">
          <div className="rounded-2xl bg-white/95 border-2 border-amber-300 shadow-xl p-2 flex items-center justify-between gap-2 backdrop-blur-md">
            <button
              type="button"
              onClick={() =>
                toast.success(
                  language === "bn"
                    ? "কুন্ডলী আপনার অ্যাকাউন্টে সংরক্ষিত হয়েছে!"
                    : language === "hi"
                    ? "कुण्डली आपके खाते में सुरक्षित हो गई है!"
                    : "Kundli saved to your account!"
                )
              }
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 py-2.5 px-3 text-xs font-bold text-amber-950 transition-colors shadow-2xs cursor-pointer"
            >
              <Lock className="size-3.5 text-amber-600" />
              <span>{t.saveKundli}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintDownload}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>{t.downloadBtn}</span>
            </button>

            <Link
              href="/astrologers"
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-400 hover:bg-brand-500 py-2.5 px-3 text-xs font-bold text-ink-900 shadow-glow transition-all"
            >
              <MessageCircle className="size-3.5 text-ink-900" />
              <span>{t.consultBtn}</span>
            </Link>
          </div>
        </div>
      )}

      <FeatureCoinModal
        open={coinModalOpen}
        onClose={() => setCoinModalOpen(false)}
        featureName={kundliFeature?.name || (language === "bn" ? "কুন্ডলী (জন্ম ছক)" : "Kundli Chart")}
        requiredCoins={kundliFeature?.coins ?? 20}
        walletBalance={walletBalance}
        reason={coinModalReason}
        language={language}
      />

      <SiteFooter />
    </div>
  );
}
