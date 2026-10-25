"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Compass,
  RotateCcw,
  RefreshCw,
  Eye,
  Sliders,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon as MoonIcon,
  Sunrise,
  Sunset,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  User,
  Star,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { astrologyApi } from "@/lib/api";
import { LocationPickerModal } from "@/components/astrology/location-picker-modal";
import { KPChartViewer } from "@/components/astrology/kp-chart-viewer";
import {
  KP_UI_TRANSLATIONS,
  KP_PLANET_NAMES,
  KP_SIGN_NAMES,
  KP_LOCALIZED_DASHA_INSIGHTS,
} from "@/lib/kp-translations";
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
  AyanamsaType,
  KPCalculatePayload,
  KPCalculateResult,
  KPDashaPeriod,
  UserProfile,
  UserPublic,
} from "@/types";

export default function KPCalculatorPage() {
  const { user, isSignedIn } = useAuth();
  const { data: profile } = useProfile({ enabled: isSignedIn });
  const { getFeature, checkAccess, walletBalance, refresh: refreshWallet } = useFeaturePricing();
  const kpFeature = getFeature("kp_calculator");
  const [coinModalOpen, setCoinModalOpen] = React.useState(false);
  const [coinModalReason, setCoinModalReason] = React.useState<"unauthorized" | "insufficient_coins" | "disabled">("insufficient_coins");

  // Language state: 'bn' (Bengali), 'en' (English), 'hi' (Hindi)
  const [language, setLanguage] = React.useState<AstrologyLanguage>("bn");
  const ui = KP_UI_TRANSLATIONS[language];

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

  // Dasha Accordion states
  const [expandedMD, setExpandedMD] = React.useState<string | null>(null);
  const [expandedAD, setExpandedAD] = React.useState<string | null>(null);
  const [expandedInsightMD, setExpandedInsightMD] = React.useState<string | null>(null);

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

  // Input formatting & navigation
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

  // Submit Handler
  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Mandatory DOB validation
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

    // 2. Optional Birth Time handling (defaults to 12:00 PM if omitted)
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

    // 3. Location validation / fallback
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

    const access = checkAccess("kp_calculator");
    if (!access.allowed) {
      if (access.reason === "disabled") {
        toast.error(
          language === "bn"
            ? "কেপি অ্যাস্ট্রোলজি ফিচারটি বর্তমানে অ্যাডমিন দ্বারা বন্ধ রয়েছে।"
            : "KP Astrology feature is temporarily unavailable.",
        );
        return;
      }
      setCoinModalReason(access.reason || "insufficient_coins");
      setCoinModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const resp = await astrologyApi.calculateKp(payload);
      setResult(resp);

      // Auto-expand active Mahadasha
      const activeMD = resp.dashas?.find((d: KPDashaPeriod) => d.is_current);
      if (activeMD) {
        setExpandedMD(activeMD.lord);
        setExpandedInsightMD(activeMD.lord);
        const activeAD = activeMD.sub_periods?.find((ad: KPDashaPeriod) => ad.is_current);
        if (activeAD) setExpandedAD(activeAD.lord);
      }

      if (access.requiredCoins > 0) {
        toast.success(
          language === "bn"
            ? `কেপি নির্ভুল চার্ট নির্ণয় সম্পন্ন হয়েছে! (${access.requiredCoins} কয়েন খরচ হয়েছে)`
            : `KP Chart calculated! (${access.requiredCoins} coins used)`,
        );
        refreshWallet();
      } else {
        toast.success(
          language === "bn"
            ? `কেপি নির্ভুল চার্ট নির্ণয় সম্পন্ন হয়েছে!`
            : language === "hi"
            ? `केपी ज्योतिष गणना सफलतापूर्वक संपन्न!`
            : `KP Astrology Chart calculated successfully!`,
        );
      }

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (err: any) {
      console.error("KP Calculation Error:", err);
      if (err?.code === "insufficient_coins") {
        setCoinModalReason("insufficient_coins");
        setCoinModalOpen(true);
      } else if (err?.code === "authentication_required" || err?.status === 401) {
        setCoinModalReason("unauthorized");
        setCoinModalOpen(true);
      } else {
        toast.error(
          err?.message ||
            (language === "bn"
              ? "কেপি চার্ট গণনায় ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
              : language === "hi"
              ? "केपी चक्र गणना में त्रुटि हुई। कृपया पुनः प्रयास करें।"
              : "Failed to calculate KP Chart. Please try again."),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper for localized sign & planet names
  const getLocalizedSign = (sign: string) => {
    return KP_SIGN_NAMES[sign]?.[language] || sign;
  };

  const getLocalizedPlanet = (planet: string) => {
    return KP_PLANET_NAMES[planet]?.[language] || planet;
  };

  // Ascendant sign index
  const ascendantSignIndex = React.useMemo(() => {
    if (!result) return 0;
    const ascPlanet = result.planets.find((p) => p.name === "Ascendant" || p.code === "Asc");
    return ascPlanet ? ascPlanet.sign_index : 0;
  }, [result]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <SiteHeader />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Top Header & Language Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{ui.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              {ui.title}
            </h1>
            <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-2xl">
              {ui.subtitle}
            </p>
            <div className="pt-2">
              <FeatureCoinBadge
                feature={kpFeature}
                walletBalance={walletBalance}
                language={language}
              />
            </div>
          </div>

          {/* Language Switcher */}
          <div className="inline-flex items-center rounded-xl bg-white border border-slate-200 p-1 shadow-xs self-start md:self-auto">
            {(["bn", "en", "hi"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  language === lang
                    ? "bg-amber-500 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {lang === "bn" ? "বাংলা" : lang === "hi" ? "हिन्दी" : "English"}
              </button>
            ))}
          </div>
        </div>

        {/* Calculation Input Form */}
        <div className="bg-white rounded-2xl border border-amber-200/90 shadow-sm p-6 sm:p-8 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-3">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-500" />
              <span>{ui.formTitle}</span>
            </h2>

            {isSignedIn && profile && (
              <button
                type="button"
                onClick={handleReloadFromProfile}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors self-start sm:self-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{ui.syncProfileBtn}</span>
              </button>
            )}
          </div>

          {kpFeature && !kpFeature.enabled && (
            <div className="mb-6">
              <FeatureDisabledAlert
                featureName={language === "bn" ? "কেপি অ্যাস্ট্রোলজি" : "KP Astrology"}
                language={language}
              />
            </div>
          )}

          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {ui.nameLabel}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={ui.namePlaceholder}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {ui.genderLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["male", "female", "other"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                        gender === g
                          ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {g === "male"
                        ? ui.genderMale
                        : g === "female"
                        ? ui.genderFemale
                        : ui.genderOther}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mandatory Date of Birth */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {ui.dobLabel}
                  </label>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {ui.dobNotice}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    ref={dayRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={day}
                    onChange={handleDayChange}
                    onKeyDown={(e) => handleKeyDown(e)}
                    placeholder="DD"
                    className="w-full text-center py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                  <input
                    ref={monthRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={month}
                    onChange={handleMonthChange}
                    onKeyDown={(e) => handleKeyDown(e, dayRef)}
                    placeholder="MM"
                    className="w-full text-center py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                  <input
                    ref={yearRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={year}
                    onChange={handleYearChange}
                    onKeyDown={(e) => handleKeyDown(e, monthRef)}
                    placeholder="YYYY"
                    className="w-full text-center py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Optional Time of Birth */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {ui.tobLabel}
                  </label>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {ui.tobNotice}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  <input
                    ref={hourRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={hour}
                    onChange={handleHourChange}
                    onKeyDown={(e) => handleKeyDown(e, yearRef)}
                    placeholder="HH"
                    className="w-full text-center py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                  <input
                    ref={minuteRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={minute}
                    onChange={handleMinuteChange}
                    onKeyDown={(e) => handleKeyDown(e, hourRef)}
                    placeholder="MM"
                    className="w-full text-center py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                  <input
                    ref={secondRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={second}
                    onChange={handleSecondChange}
                    onKeyDown={(e) => handleKeyDown(e, minuteRef)}
                    placeholder="SS"
                    className="w-full text-center py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setPeriod(period === "AM" ? "PM" : "AM")}
                    className="py-2.5 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors"
                  >
                    {period}
                  </button>
                </div>
              </div>

              {/* Birth Place */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {ui.locationLabel}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      placeholder={ui.locationPlaceholder}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMapModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold transition-colors shrink-0"
                  >
                    {ui.searchCity}
                  </button>
                </div>
              </div>
            </div>

            {/* Advance Settings Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvance(!showAdvance)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Advanced Astrological Settings (Ayanamsa & Coordinates)</span>
                {showAdvance ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>

              {showAdvance && (
                <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      {ui.ayanamsaLabel}
                    </label>
                    <select
                      value={ayanamsa}
                      onChange={(e) => setAyanamsa(e.target.value as AyanamsaType)}
                      className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="krishnamurti">KP Krishnamurti (Standard)</option>
                      <option value="lahiri">Lahiri / Chitra Paksha</option>
                      <option value="bv_raman">B.V. Raman</option>
                      <option value="yukteshwar">Sri Yukteshwar</option>
                      <option value="suryasiddhanta">Surya Siddhanta</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={latitude !== null ? latitude : ""}
                      onChange={(e) =>
                        setLatitude(e.target.value ? parseFloat(e.target.value) : null)
                      }
                      placeholder="e.g. 22.4333"
                      className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={longitude !== null ? longitude : ""}
                      onChange={(e) =>
                        setLongitude(e.target.value ? parseFloat(e.target.value) : null)
                      }
                      placeholder="e.g. 87.8667"
                      className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 py-2.5 px-4 rounded-xl hover:bg-slate-100 transition-colors order-2 sm:order-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{ui.resetBtn}</span>
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end order-1 sm:order-2">
                <FeatureCoinBadge
                  feature={kpFeature}
                  walletBalance={walletBalance}
                  language={language}
                  showWallet={false}
                />

                <button
                  type="submit"
                  disabled={loading || (kpFeature ? !kpFeature.enabled : false)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{ui.calculating}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {kpFeature && !kpFeature.enabled
                          ? language === "bn"
                            ? "ফিচারটি বন্ধ রয়েছে"
                            : "Feature Unavailable"
                          : ui.calculateBtn}
                      </span>
                    </>
                  )}
                </button>
              </div>
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
            if (loc.timezone) setTimezone(String(loc.timezone));
            setIsMapModalOpen(false);
          }}
        />

        {/* Calculation Results Dashboard */}
        {result && (
          <div ref={resultsRef} className="space-y-10 animate-in fade-in duration-300">
            {/* 1. KP Astrological Key Metrics (4-Column Card Grid matching user screenshot) */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl font-extrabold text-slate-900">{ui.detailsHeading}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Column 1: Ayanamsa & Casting Time */}
                <div className="bg-white rounded-2xl border border-amber-200/90 p-5 shadow-xs">
                  <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
                    {ui.ayanamsaTitle}
                  </div>
                  <div className="text-xl font-black text-slate-800 tracking-tight">
                    {result.panchang.ayanamsa_name} ({result.panchang.ayanamsa_degrees.toFixed(2)}°)
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                    <div>
                      <span className="font-semibold">{ui.castingTimeTitle}:</span>{" "}
                      <span className="font-mono text-slate-800">
                        {result.ruling_planets_casting.time_formatted || result.birth_time_formatted}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">{ui.julianDayTitle}:</span>{" "}
                      <span className="font-mono text-slate-800">{result.panchang.julian_day}</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Vedic Panchang */}
                <div className="bg-white rounded-2xl border border-amber-200/90 p-5 shadow-xs">
                  <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
                    {ui.panchangHeading}
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-500">{ui.tithiLabel}:</span>
                      <span className="font-bold text-slate-800">{result.panchang.tithi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-500">{ui.karanaLabel}:</span>
                      <span className="font-bold text-slate-800">{result.panchang.karana}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-500">{ui.yogaLabel}:</span>
                      <span className="font-bold text-slate-800">{result.panchang.yoga}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-500">{ui.dayLabel}:</span>
                      <span className="font-bold text-slate-800">
                        {result.panchang.vedic_day_name || result.panchang.day_name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Column 3: Solar Timings */}
                <div className="bg-white rounded-2xl border border-amber-200/90 p-5 shadow-xs">
                  <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
                    {ui.sunTimesHeading}
                  </div>
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center gap-2.5">
                      <Sunrise className="w-5 h-5 text-amber-500" />
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">
                          {ui.sunriseLabel}
                        </div>
                        <div className="text-sm font-extrabold text-slate-800 font-mono">
                          {result.panchang.sunrise}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Sunset className="w-5 h-5 text-orange-500" />
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">
                          {ui.sunsetLabel}
                        </div>
                        <div className="text-sm font-extrabold text-slate-800 font-mono">
                          {result.panchang.sunset}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 4: Dasha Balance at Birth */}
                <div className="bg-white rounded-2xl border border-amber-200/90 p-5 shadow-xs">
                  <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
                    {ui.dashaBalanceHeading}
                  </div>
                  <div className="text-base font-extrabold text-slate-900">
                    {result.panchang.balance_dasha}
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    {result.panchang.moon_rashi} • {result.panchang.moon_nakshatra}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Nirayana Bhava Chalit Chart Viewer */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-extrabold text-slate-900">{ui.chartHeading}</h2>
                <p className="text-xs text-slate-600 mt-0.5">{ui.chartSubheading}</p>
              </div>

              <KPChartViewer
                planets={result.planets}
                cusps={result.cusps}
                ascendantSignIndex={ascendantSignIndex}
                userName={result.name}
                birthDate={result.birth_date_formatted}
                birthTime={result.birth_time_formatted}
                moonSignName={result.panchang.moon_rashi}
                nakshatraName={result.panchang.moon_nakshatra}
                language={language}
              />
            </div>

            {/* 3. KP Ruling Planets (RP) Dual Side-by-Side Tables */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-extrabold text-slate-900">{ui.rpHeading}</h2>
                <p className="text-xs text-slate-600 mt-0.5">{ui.rpSubheading}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Table 1: Ruling Planets at Birth (DOB) */}
                <div className="bg-white rounded-2xl border border-amber-200/90 shadow-xs overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 text-white">
                    <h3 className="text-sm font-extrabold tracking-wide">{ui.rpDobTitle}</h3>
                  </div>
                  <div className="p-4 divide-y divide-slate-100 text-xs">
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-600">{ui.lagnaSignLord}</span>
                      <span className="font-extrabold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        {result.ruling_planets_dob.lagna_rashi_lord}
                      </span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-600">{ui.lagnaStarLord}</span>
                      <span className="font-extrabold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        {result.ruling_planets_dob.lagna_nakshatra_lord}
                      </span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-600">{ui.lagnaSubLord}</span>
                      <span className="font-extrabold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        {result.ruling_planets_dob.lagna_sub_lord}
                      </span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-600">{ui.moonSignLord}</span>
                      <span className="font-extrabold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        {result.ruling_planets_dob.moon_rashi_lord}
                      </span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-600">{ui.moonStarLord}</span>
                      <span className="font-extrabold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        {result.ruling_planets_dob.moon_nakshatra_lord}
                      </span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-600">{ui.moonSubLord}</span>
                      <span className="font-extrabold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        {result.ruling_planets_dob.moon_sub_lord}
                      </span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-600">{ui.dayLordLabel}</span>
                      <span className="font-extrabold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        {result.ruling_planets_dob.day_lord}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Table 2: Ruling Planets at Casting Time */}
                <div className="bg-white rounded-2xl border border-amber-200/90 shadow-xs overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-5 py-3 text-white">
                    <h3 className="text-sm font-extrabold tracking-wide">{ui.rpCastingTitle}</h3>
                  </div>
                  <div className="p-4 divide-y divide-slate-100 text-xs">
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-600">{ui.lagnaSignLord}</span>
                      <span className="font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        {result.ruling_planets_casting.lagna_rashi_lord}
                      </span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-600">{ui.lagnaStarLord}</span>
                      <span className="font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        {result.ruling_planets_casting.lagna_nakshatra_lord}
                      </span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-600">{ui.lagnaSubLord}</span>
                      <span className="font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        {result.ruling_planets_casting.lagna_sub_lord}
                      </span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-600">{ui.moonSignLord}</span>
                      <span className="font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        {result.ruling_planets_casting.moon_rashi_lord}
                      </span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-600">{ui.moonStarLord}</span>
                      <span className="font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        {result.ruling_planets_casting.moon_nakshatra_lord}
                      </span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-600">{ui.moonSubLord}</span>
                      <span className="font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        {result.ruling_planets_casting.moon_sub_lord}
                      </span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-600">{ui.dayLordLabel}</span>
                      <span className="font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        {result.ruling_planets_casting.day_lord}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Placidus 12 House Cusps Table */}
            <div className="bg-white rounded-2xl border border-amber-200/90 shadow-xs overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900">{ui.cuspsHeading}</h3>
                <span className="text-xs font-semibold text-amber-700">Placidus Unequal Division</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/75 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">{ui.cuspCol}</th>
                      <th className="py-3 px-4">{ui.degreeCol}</th>
                      <th className="py-3 px-4">{ui.signCol}</th>
                      <th className="py-3 px-4">{ui.signLordCol}</th>
                      <th className="py-3 px-4">{ui.starLordCol}</th>
                      <th className="py-3 px-4">{ui.subLordCol}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.cusps.map((c) => (
                      <tr key={`cusp-${c.cusp}`} className="hover:bg-amber-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800">
                          {c.cusp === 1 ? `I (${c.cusp}) [Lagna]` : `${c.cusp}`}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-slate-700">
                          {c.degree_formatted}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {getLocalizedSign(c.sign)}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-700">{c.sign_lord}</td>
                        <td className="py-3 px-4 font-bold text-amber-700">{c.star_lord}</td>
                        <td className="py-3 px-4 font-extrabold text-amber-900 bg-amber-50/80">
                          {c.sub_lord}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. Planetary Positions & Bhava Table */}
            <div className="bg-white rounded-2xl border border-amber-200/90 shadow-xs overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900">{ui.planetsHeading}</h3>
                <span className="text-xs font-semibold text-slate-500">9 Grahas + Ascendant</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/75 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">{ui.planetCol}</th>
                      <th className="py-3 px-4">{ui.motionCol}</th>
                      <th className="py-3 px-4">{ui.degreeCol}</th>
                      <th className="py-3 px-4">{ui.signCol}</th>
                      <th className="py-3 px-4">{ui.signLordCol}</th>
                      <th className="py-3 px-4">{ui.starLordCol}</th>
                      <th className="py-3 px-4">{ui.subLordCol}</th>
                      <th className="py-3 px-4">{ui.houseCol}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.planets.map((p) => (
                      <tr key={`planet-pos-${p.name}`} className="hover:bg-amber-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{p.name}</span>
                          <span className="text-[10px] text-slate-400">({p.code})</span>
                        </td>
                        <td className="py-3 px-4">
                          {p.is_retrograde ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-red-800">
                              {ui.retrogradeText}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                              {ui.directText}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-slate-700">
                          {p.degree_formatted}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {getLocalizedSign(p.sign)}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-700">{p.sign_lord}</td>
                        <td className="py-3 px-4 font-bold text-amber-700">{p.star_lord}</td>
                        <td className="py-3 px-4 font-extrabold text-amber-900 bg-amber-50/80">
                          {p.sub_lord}
                        </td>
                        <td className="py-3 px-4 font-black text-amber-800 text-sm">
                          {p.bhav_house}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 6. Vimshottari Dasha 3-Tier Drilldown Timeline */}
            <div className="bg-white rounded-2xl border border-amber-200/90 shadow-xs overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="text-base font-extrabold text-slate-900">{ui.dashaHeading}</h3>
                <p className="text-xs text-slate-600 mt-0.5">{ui.dashaSubheading}</p>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                {result.dashas?.map((md: KPDashaPeriod) => {
                  const isMDExpanded = expandedMD === md.lord;
                  const isInsightExpanded = expandedInsightMD === md.lord;
                  const insight =
                    KP_LOCALIZED_DASHA_INSIGHTS[md.lord]?.[language] ||
                    md.insight ||
                    KP_LOCALIZED_DASHA_INSIGHTS[md.lord]?.["en"];

                  return (
                    <div
                      key={`md-${md.lord}`}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        md.is_current
                          ? "border-amber-400 bg-amber-50/30 shadow-md ring-1 ring-amber-400/50"
                          : "border-slate-200 bg-white shadow-xs"
                      }`}
                    >
                      {/* Mahadasha Header */}
                      <div className="p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 bg-white">
                        <button
                          type="button"
                          onClick={() => setExpandedMD(isMDExpanded ? null : md.lord)}
                          className="flex items-center gap-2.5 text-left hover:opacity-80 transition-opacity"
                        >
                          {isMDExpanded ? (
                            <ChevronDown className="w-4 h-4 text-amber-600 shrink-0" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm sm:text-base font-extrabold text-slate-900">
                                {md.lord} {ui.mahadashaTitle}
                              </span>
                              <span className="text-xs font-semibold text-slate-500">
                                ({md.duration})
                              </span>
                              {md.is_current && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs animate-pulse">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>{ui.activeStatus}</span>
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                              {md.start_date} → {md.end_date}
                            </div>
                          </div>
                        </button>

                        {/* Action Buttons: Insights toggle */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedInsightMD(isInsightExpanded ? null : md.lord)
                            }
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                              isInsightExpanded
                                ? "bg-amber-600 text-white border-amber-700 shadow-xs"
                                : md.is_current
                                ? "bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300"
                                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>
                              {isInsightExpanded ? ui.hideInsightsBtn : ui.viewInsightsBtn}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Detailed Insights & Guidance Card */}
                      {isInsightExpanded && insight && (
                        <div className="p-4 sm:p-6 bg-gradient-to-b from-amber-50/60 to-white border-t border-amber-200/80 space-y-4 animate-in fade-in duration-200">
                          {/* Meta tags bar */}
                          <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-amber-200/50 text-xs">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100/80 text-amber-900 font-semibold border border-amber-300">
                              <span>📿 {ui.luckyDeity}:</span>
                              <strong className="font-extrabold">{insight.deity}</strong>
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 font-semibold border border-blue-200">
                              <span>🗓️ {ui.luckyDay}:</span>
                              <strong className="font-extrabold">{insight.lucky_day}</strong>
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 font-semibold border border-purple-200">
                              <span>🎨 {ui.luckyColor}:</span>
                              <strong className="font-extrabold">{insight.lucky_color}</strong>
                            </span>
                          </div>

                          {/* Overview / What to Expect */}
                          <div className="bg-white/80 rounded-xl p-4 border border-amber-200/80 shadow-xs">
                            <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-2 mb-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                              <span>{ui.overviewTitle}</span>
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                              {insight.overview}
                            </p>
                          </div>

                          {/* Career & Wealth */}
                          <div className="bg-white/80 rounded-xl p-4 border border-amber-200/80 shadow-xs">
                            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{ui.careerWealthTitle}</span>
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                              {insight.career_and_wealth}
                            </p>
                          </div>

                          {/* 2-Column Grid: Do's & Don'ts */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Do's (Favorable Actions) */}
                            <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200 shadow-xs">
                              <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>{ui.favorableTitle}</span>
                              </h4>
                              <ul className="space-y-2 text-xs text-slate-700">
                                {insight.favorable_actions.map((act, idx) => (
                                  <li key={`fav-${idx}`} className="flex items-start gap-2">
                                    <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✦</span>
                                    <span className="font-medium leading-relaxed">{act}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Don'ts (Cautions & Pitfalls) */}
                            <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-200 shadow-xs">
                              <h4 className="text-xs font-extrabold text-rose-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                                <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
                                <span>{ui.cautionsTitle}</span>
                              </h4>
                              <ul className="space-y-2 text-xs text-slate-700">
                                {insight.cautions_and_pitfalls.map((pit, idx) => (
                                  <li key={`pit-${idx}`} className="flex items-start gap-2">
                                    <span className="text-rose-600 font-bold shrink-0 mt-0.5">⚠</span>
                                    <span className="font-medium leading-relaxed">{pit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Remedies & Upayas */}
                          <div className="bg-amber-100/40 rounded-xl p-4 sm:p-5 border border-amber-300/80 shadow-xs">
                            <h4 className="text-xs font-extrabold text-amber-950 uppercase tracking-wider flex items-center gap-2 mb-3">
                              <BookOpen className="w-4 h-4 text-amber-700 shrink-0" />
                              <span>{ui.remediesTitle}</span>
                            </h4>
                            <ul className="space-y-2 text-xs text-slate-800">
                              {insight.remedies.map((rem, idx) => (
                                <li key={`rem-${idx}`} className="flex items-start gap-2.5">
                                  <span className="text-amber-700 font-extrabold shrink-0 mt-0.5">🪔</span>
                                  <span className="font-semibold leading-relaxed">{rem}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Sacred Mantras */}
                          <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-amber-500/10 rounded-xl p-4 border border-amber-400/60 shadow-xs space-y-2">
                            <div className="text-xs font-bold text-amber-900">
                              <span className="text-slate-500">{ui.beejMantra}:</span>{" "}
                              <span className="font-extrabold font-serif text-amber-950">
                                {insight.beej_mantra}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-amber-900 pt-1 border-t border-amber-200/50">
                              <span className="text-slate-500">{ui.gayatriMantra}:</span>{" "}
                              <span className="font-extrabold font-serif text-amber-950 italic">
                                {insight.gayatri_mantra}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Level 2: Antardashas */}
                      {isMDExpanded && md.sub_periods && (
                        <div className="px-4 pb-4 pt-1 space-y-2 border-t border-amber-200/60 ml-6">
                          {md.sub_periods.map((ad: KPDashaPeriod) => {
                            const isADExpanded = expandedAD === `${md.lord}-${ad.lord}`;
                            return (
                              <div
                                key={`ad-${md.lord}-${ad.lord}`}
                                className={`rounded-lg border text-xs ${
                                  ad.is_current
                                    ? "border-amber-400 bg-amber-100/40"
                                    : "border-slate-200 bg-slate-50/50"
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedAD(
                                      isADExpanded ? null : `${md.lord}-${ad.lord}`,
                                    )
                                  }
                                  className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-amber-100/30 rounded-lg transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    {isADExpanded ? (
                                      <ChevronDown className="w-3.5 h-3.5 text-amber-600" />
                                    ) : (
                                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                    )}
                                    <span className="font-bold text-slate-800">
                                      {md.lord} / {ad.lord} ({ui.antardashaTitle})
                                    </span>
                                    {ad.is_current && (
                                      <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-600 text-white">
                                        ACTIVE
                                      </span>
                                    )}
                                  </div>
                                  <div className="font-mono text-[11px] text-slate-600">
                                    {ad.start_date} → {ad.end_date}
                                  </div>
                                </button>

                                {/* Level 3: Pratyantardashas */}
                                {isADExpanded && ad.sub_periods && (
                                  <div className="px-4 py-2 border-t border-slate-200 ml-4 space-y-1 bg-white rounded-b-lg">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                      {ui.pratyantardashaTitle}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                      {ad.sub_periods.map((pd: KPDashaPeriod) => (
                                        <div
                                          key={`pd-${pd.lord}`}
                                          className={`p-2 rounded border text-[11px] flex items-center justify-between ${
                                            pd.is_current
                                              ? "border-amber-500 bg-amber-50 font-bold text-amber-900"
                                              : "border-slate-100 bg-slate-50/50 text-slate-700"
                                          }`}
                                        >
                                          <span>
                                            {pd.lord}{" "}
                                            {pd.is_current && (
                                              <span className="text-[9px] text-amber-600 font-extrabold">
                                                ● Active
                                              </span>
                                            )}
                                          </span>
                                          <span className="font-mono text-[10px] text-slate-500">
                                            {pd.start_date}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      <FeatureCoinModal
        open={coinModalOpen}
        onClose={() => setCoinModalOpen(false)}
        featureName={kpFeature?.name || (language === "bn" ? "কেপি অ্যাস্ট্রোলজি" : "KP Astrology")}
        requiredCoins={kpFeature?.coins ?? 20}
        walletBalance={walletBalance}
        reason={coinModalReason}
        language={language}
      />

      <SiteFooter />
    </div>
  );
}
