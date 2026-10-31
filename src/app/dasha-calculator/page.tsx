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
  Activity,
  Zap,
  TrendingUp,
  AlertCircle,
  Gem,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { astrologyApi } from "@/lib/api";
import { LocationPickerModal } from "@/components/astrology/location-picker-modal";
import { KPChartViewer } from "@/components/astrology/kp-chart-viewer";
import { KP_PLANET_NAMES } from "@/lib/kp-translations";
import {
  translatePlanetName,
  translateRashiName,
  translateNakshatraName,
  toLocalizedDigits,
} from "@/lib/kundli-translations";
import {
  DASHA_I18N,
  type DashaTranslations,
  translateActivePath,
  translateFunctionalNature,
  translateDignity,
  translateSadeSatiPhase,
  translateYoginiNature,
} from "@/lib/dasha-translations";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";
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
  PersonalizedDashaPhalaItem,
  YoginiPeriodItem,
  UserProfile,
  UserPublic,
} from "@/types";

const PLANET_PILLS: Array<{
  key: string;
  code: string;
  nameEn: string;
  nameBn: string;
  nameHi: string;
  color: string;
  bgClass: string;
}> = [
  { key: "Sun", code: "Su", nameEn: "Sun", nameBn: "সূর্য", nameHi: "सूर्य", color: "#f97316", bgClass: "bg-orange-100 border-orange-400 text-orange-900" },
  { key: "Moon", code: "Mo", nameEn: "Moon", nameBn: "চন্দ্র", nameHi: "चन्द्र", color: "#64748b", bgClass: "bg-slate-100 border-slate-400 text-slate-900" },
  { key: "Mars", code: "Ma", nameEn: "Mars", nameBn: "মঙ্গল", nameHi: "मंगल", color: "#ef4444", bgClass: "bg-red-100 border-red-400 text-red-900" },
  { key: "Rahu", code: "Ra", nameEn: "Rahu", nameBn: "রাহু", nameHi: "राहु", color: "#6366f1", bgClass: "bg-indigo-100 border-indigo-400 text-indigo-900" },
  { key: "Jupiter", code: "Ju", nameEn: "Jupiter", nameBn: "বৃহস্পতি", nameHi: "बृहस्पति", color: "#f59e0b", bgClass: "bg-amber-100 border-amber-400 text-amber-900" },
  { key: "Saturn", code: "Sa", nameEn: "Saturn", nameBn: "শনি", nameHi: "शनि", color: "#8b5cf6", bgClass: "bg-purple-100 border-purple-400 text-purple-900" },
  { key: "Mercury", code: "Me", nameEn: "Mercury", nameBn: "বুধ", nameHi: "बुध", color: "#10b981", bgClass: "bg-emerald-100 border-emerald-400 text-emerald-900" },
  { key: "Ketu", code: "Ke", nameEn: "Ketu", nameBn: "কেতু", nameHi: "केतु", color: "#d97706", bgClass: "bg-amber-100 border-amber-600 text-amber-950" },
  { key: "Venus", code: "Ve", nameEn: "Venus", nameBn: "শুক্র", nameHi: "शुक्र", color: "#ec4899", bgClass: "bg-pink-100 border-pink-400 text-pink-900" },
];

function formatDateDisplay(dStr?: string): string {
  if (!dStr) return "—";
  if (dStr.includes("-")) {
    const parts = dStr.split("-");
    if (parts[0].length === 4) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dStr;
  }
  return dStr;
}

function GoldDiamondDivider() {
  return (
    <div className="relative flex items-center justify-center my-3">
      <div className="h-[2px] w-48 sm:w-64 bg-gradient-to-r from-transparent via-amber-400 to-transparent relative flex items-center justify-between">
        <span className="size-2 rotate-45 border-2 border-amber-500 bg-white" />
        <span className="size-2 rotate-45 border-2 border-amber-500 bg-white" />
      </div>
    </div>
  );
}

export default function DashaCalculatorPage() {
  const { user, isSignedIn } = useAuth();
  const { data: profile } = useProfile({ enabled: isSignedIn });
  const { getFeature, checkAccess, walletBalance, refresh: refreshWallet } = useFeaturePricing();
  const dashaFeature = getFeature("dasha_calculator");
  const [coinModalOpen, setCoinModalOpen] = React.useState(false);
  const [coinModalReason, setCoinModalReason] = React.useState<"unauthorized" | "insufficient_coins" | "disabled">("insufficient_coins");

  // Centralized Language state
  const { language, setLanguage } = useLanguage();
  const ui = DASHA_I18N[language] || DASHA_I18N.bn;

  // Active Tab
  const [activeTab, setActiveTab] = React.useState<
    "radar" | "tree" | "yogini" | "phala" | "transit" | "timeline"
  >("radar");

  // Form State
  const [name, setName] = React.useState("");
  const [gender, setGender] = React.useState<"male" | "female" | "other">("male");
  const [day, setDay] = React.useState("");
  const [month, setMonth] = React.useState("");
  const [year, setYear] = React.useState("");
  const [hour, setHour] = React.useState("");
  const [minute, setMinute] = React.useState("");
  const [second, setSecond] = React.useState("");
  const [period, setPeriod] = React.useState<"AM" | "PM">("PM");
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
  const lastPayloadRef = React.useRef<KPCalculatePayload | null>(null);

  // Stepper Drilldown States for Vimshottari Tree (1 = MD, 2 = AD, 3 = PD)
  const [activeTreeStep, setActiveTreeStep] = React.useState<1 | 2 | 3>(1);
  const [selectedMD, setSelectedMD] = React.useState<KPDashaPeriod | null>(null);
  const [selectedAD, setSelectedAD] = React.useState<KPDashaPeriod | null>(null);

  // Yogini active selection
  const [selectedYogini, setSelectedYogini] = React.useState<YoginiPeriodItem | null>(null);

  // Active Planet Phala selection
  const [selectedPhalaPlanet, setSelectedPhalaPlanet] = React.useState<string>("Jupiter");

  const resultsRef = React.useRef<HTMLDivElement>(null);
  const hasAutoFilled = React.useRef(false);

  const dayRef = React.useRef<HTMLInputElement>(null);
  const monthRef = React.useRef<HTMLInputElement>(null);
  const yearRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);

  // Auto-fill from profile
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

        const placeName = b.place || b.city || [b.city, b.state, b.country].filter(Boolean).join(", ");
        if (placeName) setPlace(placeName);
        if (b.latitude != null && b.longitude != null) {
          setLatitude(Number(b.latitude));
          setLongitude(Number(b.longitude));
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

  // When language preference switches, re-fetch calculation with the new language seamlessly
  React.useEffect(() => {
    if (lastPayloadRef.current && result && !loading) {
      const updatedPayload: KPCalculatePayload = {
        ...lastPayloadRef.current,
        language,
      };
      astrologyApi
        .calculateDasha(updatedPayload)
        .then((resp) => {
          setResult(resp);
          lastPayloadRef.current = updatedPayload;
        })
        .catch(() => {});
    }
  }, [language]);

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
    lastPayloadRef.current = null;
    setActiveTreeStep(1);
    setSelectedMD(null);
    setSelectedAD(null);
    setSelectedYogini(null);
    toast.info(
      language === "bn"
        ? "ফর্ম রিসেট করা হয়েছে।"
        : language === "hi"
        ? "फ़ॉर्म रीसेट कर दिया गया है।"
        : "Form cleared.",
    );
  };

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
          ? "सही जन्म दिन (१-३१) लिखें।"
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
          ? "सही जन्म माह (१-१२) लिखें।"
          : "Enter a valid birth month (1-12).",
      );
      monthRef.current?.focus();
      return;
    }
    if (!year || isNaN(y) || y < 1800 || y > 2100) {
      toast.error(
        language === "bn"
          ? "সঠিক জন্ম বছর লিখুন।"
          : language === "hi"
          ? "सही जन्म वर्ष लिखें।"
          : "Enter a valid 4-digit birth year.",
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

    const access = checkAccess("dasha_calculator");
    if (!access.allowed) {
      if (access.reason === "disabled") {
        toast.error(ui.formFeatureDisabled);
        return;
      }
      setCoinModalReason(access.reason || "insufficient_coins");
      setCoinModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const resp = await astrologyApi.calculateDasha(payload);
      setResult(resp);
      lastPayloadRef.current = payload;

      // Auto-set selections
      const currentMD = resp.dashas?.find((d) => d.is_current) || resp.dashas?.[0];
      if (currentMD) {
        setSelectedMD(currentMD);
        setSelectedPhalaPlanet(currentMD.lord);
        const currentAD = currentMD.sub_periods?.find((ad) => ad.is_current) || currentMD.sub_periods?.[0];
        if (currentAD) setSelectedAD(currentAD);
      }
      if (resp.yogini_dasha?.periods) {
        const curY = resp.yogini_dasha.periods.find((y) => y.is_current) || resp.yogini_dasha.periods[0];
        setSelectedYogini(curY);
      }

      toast.success(
        language === "bn"
          ? "বিংশোত্তরী ও যোগিনী দশা নির্ভুল গণনা সম্পন্ন হয়েছে!"
          : language === "hi"
          ? "विंशोत्तरी एवं योगिनी दशा की सटीक गणना पूर्ण हुई!"
          : "Dasha calculated with 100% precision!",
      );

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (err: any) {
      console.error("Dasha Calculation Error:", err);
      if (err?.code === "insufficient_coins") {
        setCoinModalReason("insufficient_coins");
        setCoinModalOpen(true);
      } else if (err?.code === "authentication_required" || err?.status === 401) {
        setCoinModalReason("unauthorized");
        setCoinModalOpen(true);
      } else {
        toast.error(err?.message || "Failed to calculate Dasha timeline.");
      }
    } finally {
      setLoading(false);
    }
  };

  const runningSnapshot = result?.current_running_dasha;
  const sandhiInfo = result?.dasha_sandhi_chidra;
  const transitSynergy = result?.dasha_transit_synergy;
  const yoginiSys = result?.yogini_dasha;
  const phalaList = result?.personalized_dasha_phala || [];
  const timelineSegments = result?.dasha_life_timeline || [];

  const selectedPhalaItem = React.useMemo(() => {
    return phalaList.find((p) => p.planet === selectedPhalaPlanet) || phalaList[0];
  }, [phalaList, selectedPhalaPlanet]);

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans">
      <SiteHeader />

      {/* Hero Header */}
      <div className="relative border-b border-amber-200/60 bg-gradient-to-b from-amber-500/10 via-amber-50/40 to-background py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          {/* Language Switcher Bar */}
          <div className="flex items-center justify-center gap-1.5 mb-5">
            <span className="text-xs font-semibold text-slate-500 mr-1">
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
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-900">
            <Sparkles className="size-3.5 text-amber-600" />
            <span>{ui.badgeVimshottari}</span>
          </div>

          <h1 className="mt-3.5 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-950">
            {ui.titleMain}
          </h1>

          <p className="mx-auto mt-3 max-w-3xl text-sm sm:text-base text-slate-600 leading-relaxed">
            {ui.subtitleMain}
          </p>

          {profile && (
            <div className="mt-4 flex items-center justify-center">
              <button
                type="button"
                onClick={() => populateFromProfileData(profile, user)}
                className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50/80 px-3 py-1 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors"
              >
                <User className="size-3.5" />
                <span>{ui.profileSync}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 flex-1 w-full space-y-10">
        {/* Birth Details Input Form */}
        <div className="rounded-2xl border border-amber-300/80 bg-white p-5 sm:p-8 shadow-sm">
          {dashaFeature && !dashaFeature.enabled && (
            <div className="mb-6">
              <FeatureDisabledAlert featureName={dashaFeature?.name} language={language} />
            </div>
          )}

          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {ui.formFullName}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={ui.formFullNamePlaceholder}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {ui.formGender}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["male", "female", "other"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`rounded-xl py-2.5 text-xs font-bold capitalize transition-all border ${
                        gender === g
                          ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {g === "male"
                        ? ui.formMale
                        : g === "female"
                        ? ui.formFemale
                        : ui.formOther}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Birth Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* DOB */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  <Calendar className="inline-block size-3.5 mr-1 text-amber-600" />
                  <span>{ui.formDob}</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    ref={dayRef}
                    type="text"
                    value={day}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 2);
                      setDay(v);
                      if (v.length === 2) monthRef.current?.focus();
                    }}
                    placeholder="DD"
                    maxLength={2}
                    className="w-full text-center rounded-xl border border-slate-200 py-2.5 text-sm font-semibold focus:border-amber-500 focus:outline-none"
                  />
                  <input
                    ref={monthRef}
                    type="text"
                    value={month}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 2);
                      setMonth(v);
                      if (v.length === 2) yearRef.current?.focus();
                    }}
                    placeholder="MM"
                    maxLength={2}
                    className="w-full text-center rounded-xl border border-slate-200 py-2.5 text-sm font-semibold focus:border-amber-500 focus:outline-none"
                  />
                  <input
                    ref={yearRef}
                    type="text"
                    value={year}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setYear(v);
                      if (v.length === 4) hourRef.current?.focus();
                    }}
                    placeholder="YYYY"
                    maxLength={4}
                    className="w-full text-center rounded-xl border border-slate-200 py-2.5 text-sm font-semibold focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* TOB */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  <Clock className="inline-block size-3.5 mr-1 text-amber-600" />
                  <span>{ui.formTob}</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <input
                    ref={hourRef}
                    type="text"
                    value={hour}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 2);
                      setHour(v);
                      if (v.length === 2) minuteRef.current?.focus();
                    }}
                    placeholder="HH"
                    maxLength={2}
                    className="w-full text-center rounded-xl border border-slate-200 py-2.5 text-sm font-semibold focus:border-amber-500 focus:outline-none"
                  />
                  <input
                    ref={minuteRef}
                    type="text"
                    value={minute}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 2);
                      setMinute(v);
                      if (v.length === 2) secondRef.current?.focus();
                    }}
                    placeholder="MM"
                    maxLength={2}
                    className="w-full text-center rounded-xl border border-slate-200 py-2.5 text-sm font-semibold focus:border-amber-500 focus:outline-none"
                  />
                  <input
                    ref={secondRef}
                    type="text"
                    value={second}
                    onChange={(e) => setSecond(e.target.value.replace(/\D/g, "").slice(0, 2))}
                    placeholder="SS"
                    maxLength={2}
                    className="w-full text-center rounded-xl border border-slate-200 py-2.5 text-sm font-semibold focus:border-amber-500 focus:outline-none"
                  />
                  <div className="flex rounded-xl border border-slate-200 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setPeriod("AM")}
                      className={`flex-1 text-xs font-bold py-2.5 ${
                        period === "AM" ? "bg-amber-500 text-white" : "bg-white text-slate-600"
                      }`}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => setPeriod("PM")}
                      className={`flex-1 text-xs font-bold py-2.5 ${
                        period === "PM" ? "bg-amber-500 text-white" : "bg-white text-slate-600"
                      }`}
                    >
                      PM
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Place */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                <MapPin className="inline-block size-3.5 mr-1 text-amber-600" />
                <span>{ui.formPob}</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder={ui.formPobPlaceholder}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setIsMapModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100 transition-colors"
                >
                  <Compass className="size-4" />
                  <span>{ui.formMap}</span>
                </button>
              </div>
            </div>

            {/* Advance Settings Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAdvance(!showAdvance)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                <Sliders className="size-3.5" />
                <span>{ui.formAdvancedSettings}</span>
              </button>

              {showAdvance && (
                <div className="mt-3 p-4 rounded-xl border border-slate-100 bg-slate-50/70 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {ui.formAyanamsa}
                    </label>
                    <select
                      value={ayanamsa}
                      onChange={(e) => setAyanamsa(e.target.value as AyanamsaType)}
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold"
                    >
                      <option value="krishnamurti">KP (Krishnamurti Standard)</option>
                      <option value="lahiri">Lahiri (Chitra Paksha)</option>
                      <option value="raman">BV Raman</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {ui.formTimezone}
                    </label>
                    <input
                      type="text"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      placeholder="+5.5"
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 py-2.5 px-4 rounded-xl hover:bg-slate-100 transition-colors order-2 sm:order-1 cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>{ui.resetBtn}</span>
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end order-1 sm:order-2">
                <FeatureCoinBadge
                  feature={dashaFeature}
                  coins={dashaFeature?.coins ?? 15}
                  language={language}
                />

                <button
                  type="submit"
                  disabled={loading || (dashaFeature ? !dashaFeature.enabled : false)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="size-4 animate-spin" />
                      <span>{ui.calculating}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      <span>{ui.calculateBtn}</span>
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
            if (loc.timezone != null) setTimezone(String(loc.timezone));
            setIsMapModalOpen(false);
          }}
          currentPlace={place}
          currentLat={latitude}
          currentLon={longitude}
        />

        {/* Results Section */}
        {result && (
          <div ref={resultsRef} className="space-y-8 pt-4">
            {/* User Profile Header Card */}
            <div className="rounded-2xl border-2 border-amber-300 bg-white p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                  {ui.analyzedDetailsTitle}
                </span>
                <h3 className="font-display text-2xl font-bold text-slate-900">
                  {result.name || name || "Native"} (
                  {result.gender === "female"
                    ? ui.formFemale
                    : result.gender === "other"
                    ? ui.formOther
                    : ui.formMale}
                  )
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  📅 {toLocalizedDigits(result.birth_date_formatted, language)} · ⏰ {toLocalizedDigits(result.birth_time_formatted, language)} · 📍 {result.birth_place}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-amber-100 border border-amber-300 px-3 py-1 text-xs font-bold text-amber-900">
                  {ui.lagnaPrefix} {translateRashiName(result.panchang.ascendant_sign, language)}
                </span>
                <span className="rounded-lg bg-slate-100 border border-slate-300 px-3 py-1 text-xs font-bold text-slate-800">
                  {ui.moonPrefix} {translateRashiName(result.panchang.moon_rashi, language)} ({translateNakshatraName(result.panchang.moon_nakshatra, language)})
                </span>
              </div>
            </div>

            {/* 6-Tab Navigation Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 [scrollbar-width:thin]">
              {[
                { id: "radar", label: ui.tabActiveRadar, icon: Activity },
                { id: "tree", label: ui.tabVimshottari, icon: Layers },
                { id: "yogini", label: ui.tabYogini, icon: Zap },
                { id: "phala", label: ui.tabPhala, icon: TrendingUp },
                { id: "transit", label: ui.tabTransitSandhi, icon: Compass },
                { id: "timeline", label: ui.tabTimelineRemedies, icon: Flame },
              ].map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id as any)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ════════════════════════════════════════════════════════════
                TAB 1: LIVE ACTIVE RADAR SNAPSHOT (5-Tier Running Dasha)
            ════════════════════════════════════════════════════════════ */}
            {activeTab === "radar" && runningSnapshot && (
              <div className="space-y-6">
                <div className="rounded-2xl border-2 border-amber-300 bg-white p-6 shadow-sm space-y-6">
                  <div className="text-center space-y-1">
                    <h3 className="font-display text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                      <Activity className="size-6 text-amber-600" />
                      <span>{ui.activeRadarTitle}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
                      {ui.activeRadarSubtitle}
                    </p>
                    <GoldDiamondDivider />
                  </div>

                  {/* Active Breadcrumb Path */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                      {ui.activePathTitle}
                    </span>
                    <p className="font-display text-lg sm:text-2xl font-extrabold text-amber-950 mt-1">
                      {translateActivePath(runningSnapshot.active_path, language)}
                    </p>
                  </div>

                  {/* 5 Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {/* 1. Mahadasha */}
                    <div className="rounded-xl border-2 border-blue-400 bg-blue-50/30 p-4 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-blue-700">
                          {ui.levelMahadasha}
                        </span>
                        <h4 className="font-display text-xl font-bold text-slate-900 mt-1">
                          {translatePlanetName(runningSnapshot.mahadasha, language)}
                        </h4>
                      </div>
                      <div className="mt-3 pt-2 border-t border-blue-200/60 text-[11px] text-slate-600 space-y-0.5">
                        <p><span className="font-semibold">{ui.startDate}:</span> {toLocalizedDigits(formatDateDisplay(runningSnapshot.md_start), language)}</p>
                        <p><span className="font-semibold">{ui.endDate}:</span> {toLocalizedDigits(formatDateDisplay(runningSnapshot.md_end), language)}</p>
                        <p className="text-blue-700 font-bold">{toLocalizedDigits(runningSnapshot.remaining_days_md, language)} {ui.remainingDays}</p>
                      </div>
                    </div>

                    {/* 2. Antardasha */}
                    <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50/30 p-4 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-emerald-700">
                          {ui.levelAntardasha}
                        </span>
                        <h4 className="font-display text-xl font-bold text-slate-900 mt-1">
                          {translatePlanetName(runningSnapshot.antardasha, language)}
                        </h4>
                      </div>
                      <div className="mt-3 pt-2 border-t border-emerald-200/60 text-[11px] text-slate-600 space-y-0.5">
                        <p><span className="font-semibold">{ui.startDate}:</span> {toLocalizedDigits(formatDateDisplay(runningSnapshot.ad_start), language)}</p>
                        <p><span className="font-semibold">{ui.endDate}:</span> {toLocalizedDigits(formatDateDisplay(runningSnapshot.ad_end), language)}</p>
                        <p className="text-emerald-700 font-bold">{toLocalizedDigits(runningSnapshot.remaining_days_ad, language)} {ui.remainingDays}</p>
                      </div>
                    </div>

                    {/* 3. Pratyantardasha */}
                    <div className="rounded-xl border-2 border-amber-400 bg-amber-50/30 p-4 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-amber-800">
                          {ui.levelPratyantardasha}
                        </span>
                        <h4 className="font-display text-xl font-bold text-slate-900 mt-1">
                          {translatePlanetName(runningSnapshot.pratyantardasha, language)}
                        </h4>
                      </div>
                      <div className="mt-3 pt-2 border-t border-amber-200/60 text-[11px] text-slate-600 space-y-0.5">
                        <p><span className="font-semibold">{ui.startDate}:</span> {toLocalizedDigits(formatDateDisplay(runningSnapshot.pd_start), language)}</p>
                        <p><span className="font-semibold">{ui.endDate}:</span> {toLocalizedDigits(formatDateDisplay(runningSnapshot.pd_end), language)}</p>
                      </div>
                    </div>

                    {/* 4. Sookshma Dasha */}
                    <div className="rounded-xl border-2 border-purple-400 bg-purple-50/30 p-4 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-purple-700">
                          {ui.levelSookshma}
                        </span>
                        <h4 className="font-display text-xl font-bold text-slate-900 mt-1">
                          {translatePlanetName(runningSnapshot.sookshma_dasha || "Sun", language)}
                        </h4>
                      </div>
                      <div className="mt-3 pt-2 border-t border-purple-200/60 text-[11px] text-slate-600 space-y-0.5">
                        <p><span className="font-semibold">{ui.startDate}:</span> {toLocalizedDigits(formatDateDisplay(runningSnapshot.sd_start), language)}</p>
                        <p><span className="font-semibold">{ui.endDate}:</span> {toLocalizedDigits(formatDateDisplay(runningSnapshot.sd_end), language)}</p>
                      </div>
                    </div>

                    {/* 5. Pran Dasha */}
                    <div className="rounded-xl border-2 border-rose-400 bg-rose-50/30 p-4 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-rose-700">
                          {ui.levelPran}
                        </span>
                        <h4 className="font-display text-xl font-bold text-slate-900 mt-1">
                          {translatePlanetName(runningSnapshot.pran_dasha || "Sun", language)}
                        </h4>
                      </div>
                      <div className="mt-3 pt-2 border-t border-rose-200/60 text-[11px] text-slate-600 space-y-0.5">
                        <p><span className="font-semibold">{ui.startDate}:</span> {toLocalizedDigits(formatDateDisplay(runningSnapshot.pran_start), language)}</p>
                        <p><span className="font-semibold">{ui.endDate}:</span> {toLocalizedDigits(formatDateDisplay(runningSnapshot.pran_end), language)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Meters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span>
                          {ui.antardashaProgress} ({translatePlanetName(runningSnapshot.antardasha, language)})
                        </span>
                        <span className="text-emerald-700">
                          {toLocalizedDigits(runningSnapshot.percentage_completed_ad, language)}%
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${runningSnapshot.percentage_completed_ad}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span>
                          {ui.mahadashaProgress} ({translatePlanetName(runningSnapshot.mahadasha, language)})
                        </span>
                        <span className="text-blue-700">
                          {toLocalizedDigits(runningSnapshot.percentage_completed_md, language)}%
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${runningSnapshot.percentage_completed_md}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sookshma & Pran Dasha Micro Tables */}
                {runningSnapshot.sookshma_periods && runningSnapshot.sookshma_periods.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="size-4 text-purple-600" />
                        <span>{ui.sookshmaTitle}</span>
                      </h4>
                      <span className="text-xs text-slate-500 font-semibold">
                        {ui.underPratyantar} {translatePlanetName(runningSnapshot.pratyantardasha, language)}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                            <th className="py-2.5 px-3">{ui.tableLord}</th>
                            <th className="py-2.5 px-3 text-center">{ui.tableStart}</th>
                            <th className="py-2.5 px-3 text-center">{ui.tableEnd}</th>
                            <th className="py-2.5 px-3 text-center">{ui.tableDuration}</th>
                            <th className="py-2.5 px-3 text-center">{ui.tableStatus}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {runningSnapshot.sookshma_periods.map((sd, i) => (
                            <tr
                              key={i}
                              className={sd.is_current ? "bg-purple-50 font-bold" : "hover:bg-slate-50"}
                            >
                              <td className="py-2.5 px-3 font-semibold">
                                {translatePlanetName(sd.lord, language)}
                              </td>
                              <td className="py-2.5 px-3 text-center text-slate-600">
                                {toLocalizedDigits(sd.start_date, language)} {toLocalizedDigits(sd.start_time, language)}
                              </td>
                              <td className="py-2.5 px-3 text-center text-slate-600">
                                {toLocalizedDigits(sd.end_date, language)} {toLocalizedDigits(sd.end_time, language)}
                              </td>
                              <td className="py-2.5 px-3 text-center text-slate-600">
                                {toLocalizedDigits(sd.duration, language)}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                {sd.is_current ? (
                                  <span className="rounded-full bg-purple-100 text-purple-800 px-2 py-0.5 text-[10px] font-bold border border-purple-300">
                                    {ui.activeNow}
                                  </span>
                                ) : (
                                  "—"
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════
                TAB 2: VIMSHOTTARI TREE (5-Tier Full Interactive Drilldown)
            ════════════════════════════════════════════════════════════ */}
            {activeTab === "tree" && (
              <div className="rounded-2xl border border-amber-200/90 bg-white p-5 sm:p-8 shadow-sm space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="font-display text-2xl font-bold text-slate-900">
                    {ui.vimshottariTreeTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {ui.drilldownHint}
                  </p>
                  <GoldDiamondDivider />

                  {/* 3-Step Stepper */}
                  <div className="mt-4 flex items-center justify-center gap-2 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveTreeStep(1)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                        activeTreeStep === 1
                          ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                          : "bg-white border-slate-200 text-slate-600 hover:border-amber-400"
                      }`}
                    >
                      <span>{ui.stepper1}</span>
                    </button>

                    <div className="h-0.5 w-6 sm:w-10 bg-slate-200" />

                    <button
                      type="button"
                      onClick={() => selectedMD && setActiveTreeStep(2)}
                      disabled={!selectedMD}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                        activeTreeStep === 2
                          ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                          : "bg-white border-slate-200 text-slate-600 hover:border-amber-400"
                      }`}
                    >
                      <span>{ui.stepper2}</span>
                    </button>

                    <div className="h-0.5 w-6 sm:w-10 bg-slate-200" />

                    <button
                      type="button"
                      onClick={() => selectedAD && setActiveTreeStep(3)}
                      disabled={!selectedAD}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                        activeTreeStep === 3
                          ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                          : "bg-white border-slate-200 text-slate-600 hover:border-amber-400"
                      }`}
                    >
                      <span>{ui.stepper3}</span>
                    </button>
                  </div>
                </div>

                {/* Breadcrumbs */}
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span
                      onClick={() => setActiveTreeStep(1)}
                      className="cursor-pointer hover:underline text-amber-800 font-bold"
                    >
                      {ui.allMahadashas}
                    </span>
                    {selectedMD && activeTreeStep >= 2 && (
                      <>
                        <span>➔</span>
                        <span
                          onClick={() => setActiveTreeStep(2)}
                          className="cursor-pointer hover:underline text-amber-800 font-bold"
                        >
                          {translatePlanetName(selectedMD.lord, language)}
                        </span>
                      </>
                    )}
                    {selectedAD && activeTreeStep === 3 && (
                      <>
                        <span>➔</span>
                        <span className="text-slate-900 font-bold">
                          {translatePlanetName(selectedAD.lord, language)}
                        </span>
                      </>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">{ui.drilldownHint}</span>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                        <th className="py-3 px-4">{ui.tableLord}</th>
                        <th className="py-3 px-4 text-center">{ui.startDate}</th>
                        <th className="py-3 px-4 text-center">{ui.endDate}</th>
                        <th className="py-3 px-4 text-center">{ui.duration}</th>
                        <th className="py-3 px-4 text-center">{ui.tableStatus}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {activeTreeStep === 1 &&
                        result.dashas?.map((md, idx) => (
                          <tr
                            key={`md-${idx}`}
                            onClick={() => {
                              setSelectedMD(md);
                              setActiveTreeStep(2);
                            }}
                            className={`cursor-pointer transition-colors ${
                              md.is_current ? "bg-amber-50/70 font-semibold" : "hover:bg-slate-50"
                            }`}
                          >
                            <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                              <span>➔</span>
                              <span>{translatePlanetName(md.lord, language)}</span>
                            </td>
                            <td className="py-3.5 px-4 text-center text-slate-600 tabular-nums">
                              {toLocalizedDigits(formatDateDisplay(md.start_date), language)}
                            </td>
                            <td className="py-3.5 px-4 text-center text-slate-600 tabular-nums">
                              {toLocalizedDigits(formatDateDisplay(md.end_date), language)}
                            </td>
                            <td className="py-3.5 px-4 text-center text-slate-600">
                              {toLocalizedDigits(md.duration, language)}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              {md.is_current ? (
                                <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs font-bold border border-emerald-300">
                                  {ui.currentTag}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                          </tr>
                        ))}

                      {activeTreeStep === 2 &&
                        selectedMD?.sub_periods?.map((ad, idx) => (
                          <tr
                            key={`ad-${idx}`}
                            onClick={() => {
                              setSelectedAD(ad);
                              setActiveTreeStep(3);
                            }}
                            className={`cursor-pointer transition-colors ${
                              ad.is_current ? "bg-emerald-50/70 font-semibold" : "hover:bg-slate-50"
                            }`}
                          >
                            <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                              <span>➔</span>
                              <span>{translatePlanetName(ad.lord, language)}</span>
                            </td>
                            <td className="py-3.5 px-4 text-center text-slate-600 tabular-nums">
                              {toLocalizedDigits(formatDateDisplay(ad.start_date), language)}
                            </td>
                            <td className="py-3.5 px-4 text-center text-slate-600 tabular-nums">
                              {toLocalizedDigits(formatDateDisplay(ad.end_date), language)}
                            </td>
                            <td className="py-3.5 px-4 text-center text-slate-600">
                              {toLocalizedDigits(ad.duration, language)}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              {ad.is_current ? (
                                <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs font-bold border border-emerald-300">
                                  {ui.currentTag}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                          </tr>
                        ))}

                      {activeTreeStep === 3 &&
                        selectedAD?.sub_periods?.map((pad, idx) => (
                          <tr
                            key={`pad-${idx}`}
                            className={pad.is_current ? "bg-amber-50/70 font-semibold" : "hover:bg-slate-50"}
                          >
                            <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                              <span>•</span>
                              <span>{translatePlanetName(pad.lord, language)}</span>
                            </td>
                            <td className="py-3.5 px-4 text-center text-slate-600 tabular-nums">
                              {toLocalizedDigits(formatDateDisplay(pad.start_date), language)}
                            </td>
                            <td className="py-3.5 px-4 text-center text-slate-600 tabular-nums">
                              {toLocalizedDigits(formatDateDisplay(pad.end_date), language)}
                            </td>
                            <td className="py-3.5 px-4 text-center text-slate-600">
                              {toLocalizedDigits(pad.duration, language)}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              {pad.is_current ? (
                                <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs font-bold border border-emerald-300">
                                  {ui.currentTag}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════
                TAB 3: YOGINI DASHA (36-Year Classical Cycle)
            ════════════════════════════════════════════════════════════ */}
            {activeTab === "yogini" && yoginiSys && (
              <div className="space-y-6">
                <div className="rounded-2xl border-2 border-amber-300 bg-white p-6 shadow-sm space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="font-display text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                      <Zap className="size-6 text-amber-600" />
                      <span>{ui.yoginiTitle}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
                      {ui.yoginiSubtitle}
                    </p>
                    <GoldDiamondDivider />
                  </div>

                  {/* Summary Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50/50 text-xs">
                    <div>
                      <span className="font-semibold text-slate-500">{ui.startingYogini}:</span>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">{yoginiSys.starting_yogini}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500">{ui.balanceAtBirth}:</span>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">
                        {toLocalizedDigits(yoginiSys.balance_str, language)}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500">{ui.currentRunningYogini}:</span>
                      <p className="font-bold text-amber-800 text-sm mt-0.5">
                        {yoginiSys.current_yogini} ({yoginiSys.current_sub_yogini})
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500">{ui.cycleNumber}:</span>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">
                        {toLocalizedDigits(yoginiSys.current_cycle_number, language)}
                      </p>
                    </div>
                  </div>

                  {/* Verdict */}
                  {yoginiSys.verdict && (
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                      💡 {yoginiSys.verdict}
                    </div>
                  )}

                  {/* Yoginis Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200 mt-4">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                          <th className="py-3 px-3">Yogini</th>
                          <th className="py-3 px-3">{ui.rulerPlanet}</th>
                          <th className="py-3 px-3 text-center">{ui.tableDuration}</th>
                          <th className="py-3 px-3 text-center">{ui.yoginiNature}</th>
                          <th className="py-3 px-3 text-center">{ui.startDate}</th>
                          <th className="py-3 px-3 text-center">{ui.endDate}</th>
                          <th className="py-3 px-3 text-center">{ui.tableStatus}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {yoginiSys.periods.slice(0, 16).map((yp, i) => (
                          <tr
                            key={i}
                            onClick={() => setSelectedYogini(yp)}
                            className={`cursor-pointer transition-colors ${
                              yp.is_current ? "bg-amber-50/80 font-bold" : "hover:bg-slate-50"
                            }`}
                          >
                            <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                              <span>➔</span>
                              <span>{yp.name}</span>
                            </td>
                            <td className="py-3 px-3 text-slate-700 font-semibold">
                              {translatePlanetName(yp.ruler_planet, language)}
                            </td>
                            <td className="py-3 px-3 text-center text-slate-600">
                              {toLocalizedDigits(yp.duration_years, language)} {ui.yearsSuffix}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                                  yp.nature === "Benefic"
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                    : yp.nature === "Challenging"
                                    ? "bg-red-100 text-red-800 border-red-300"
                                    : "bg-slate-100 text-slate-700 border-slate-300"
                                }`}
                              >
                                {translateYoginiNature(yp.nature, language)}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center text-slate-600 tabular-nums">
                              {toLocalizedDigits(yp.start_date, language)}
                            </td>
                            <td className="py-3 px-3 text-center text-slate-600 tabular-nums">
                              {toLocalizedDigits(yp.end_date, language)}
                            </td>
                            <td className="py-3 px-3 text-center">
                              {yp.is_current ? (
                                <span className="rounded-full bg-amber-500 text-white px-2 py-0.5 text-[10px] font-bold">
                                  {ui.runningTag}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Sub-Yoginis for Selected Yogini */}
                  {selectedYogini?.sub_periods && selectedYogini.sub_periods.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-slate-200 space-y-3">
                      <h4 className="font-display text-sm font-bold text-slate-900">
                        {selectedYogini.name} {ui.antarYoginisUnder}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {selectedYogini.sub_periods.map((sub, sidx) => (
                          <div
                            key={sidx}
                            className={`p-3 rounded-xl border text-xs ${
                              sub.is_current
                                ? "bg-amber-100 border-amber-400 font-bold shadow-xs"
                                : "bg-slate-50 border-slate-200"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-slate-900">{sub.name}</span>
                              <span className="text-[10px] text-slate-500 font-semibold">
                                ({translatePlanetName(sub.ruler_planet, language)})
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600">
                              {toLocalizedDigits(sub.start_date, language)} – {toLocalizedDigits(sub.end_date, language)}
                            </p>
                            {sub.is_current && (
                              <span className="inline-block mt-1 text-[9px] font-bold bg-amber-600 text-white px-1.5 py-0.2 rounded">
                                {ui.activeNow}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════
                TAB 4: PERSONALIZED KUNDLI PHALA (Lagna-Specific)
            ════════════════════════════════════════════════════════════ */}
            {activeTab === "phala" && (
              <div className="space-y-6">
                <div className="rounded-2xl border-2 border-amber-300 bg-white p-6 shadow-sm space-y-6">
                  <div className="text-center space-y-1">
                    <h3 className="font-display text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                      <TrendingUp className="size-6 text-amber-600" />
                      <span>{ui.phalaTitle}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
                      {ui.phalaSubtitle}
                    </p>
                    <GoldDiamondDivider />
                  </div>

                  {/* Planet Pill Selectors */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {PLANET_PILLS.map((pill) => {
                      const isSelected = selectedPhalaPlanet === pill.key;
                      return (
                        <button
                          key={pill.key}
                          type="button"
                          onClick={() => setSelectedPhalaPlanet(pill.key)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? "ring-2 ring-amber-500 scale-105 shadow-xs " + pill.bgClass
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <span className="size-2 rounded-full" style={{ backgroundColor: pill.color }} />
                          <span>
                            {language === "bn" ? pill.nameBn : language === "hi" ? pill.nameHi : pill.nameEn}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Planet Phala Card */}
                  {selectedPhalaItem && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/20 p-5 sm:p-7 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/60">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                            {translateRashiName(selectedPhalaItem.lagna, language)} {ui.lagnaAnalysisSuffix}
                          </span>
                          <h4 className="font-display text-2xl font-bold text-slate-900 mt-0.5">
                            {translatePlanetName(selectedPhalaItem.planet, language)} –{" "}
                            {translateFunctionalNature(selectedPhalaItem.functional_nature, language)}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">
                            {toLocalizedDigits(selectedPhalaItem.house_placed, language)}
                            {ui.placedInHouseText} ({translateRashiName(selectedPhalaItem.sign_placed, language)}) ·{" "}
                            {ui.dignityText} {translateDignity(selectedPhalaItem.dignity, language)}
                          </p>
                        </div>

                        {/* Favorability Score Meter */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-[11px] font-bold text-slate-500">{ui.favorabilityScore}</span>
                            <p className="text-2xl font-black text-amber-900">
                              {toLocalizedDigits(selectedPhalaItem.favorability_score, language)}%
                            </p>
                          </div>
                          <div className="size-14 rounded-full border-4 border-amber-500 flex items-center justify-center bg-white font-extrabold text-sm">
                            {selectedPhalaItem.favorability_score >= 60 ? "🌟" : "⚖️"}
                          </div>
                        </div>
                      </div>

                      {/* 4 Life Domains Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                            <span>💼</span>
                            <span>{ui.careerImpact}</span>
                          </h5>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {selectedPhalaItem.career_impact}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                            <span>💰</span>
                            <span>{ui.wealthImpact}</span>
                          </h5>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {selectedPhalaItem.wealth_impact}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                            <span>❤️</span>
                            <span>{ui.relationshipImpact}</span>
                          </h5>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {selectedPhalaItem.relationship_impact}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                            <span>🌿</span>
                            <span>{ui.healthImpact}</span>
                          </h5>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {selectedPhalaItem.health_impact}
                          </p>
                        </div>
                      </div>

                      {/* Gemstone Warning & Remedies */}
                      <div className="space-y-3">
                        {selectedPhalaItem.gemstone_warning && (
                          <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50 text-xs text-amber-900 flex items-start gap-2.5">
                            <Gem className="size-4 text-amber-700 shrink-0 mt-0.5" />
                            <span>{selectedPhalaItem.gemstone_warning}</span>
                          </div>
                        )}

                        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 flex items-start gap-2.5">
                          <Flame className="size-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">{ui.remedyAction}:</span>{" "}
                            <span>{selectedPhalaItem.recommended_remedy}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════
                TAB 5: TRANSIT & SANDHI (Live Synergy & Alerts)
            ════════════════════════════════════════════════════════════ */}
            {activeTab === "transit" && (
              <div className="space-y-6">
                <div className="rounded-2xl border-2 border-amber-300 bg-white p-6 shadow-sm space-y-6">
                  <div className="text-center space-y-1">
                    <h3 className="font-display text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                      <Compass className="size-6 text-amber-600" />
                      <span>{ui.transitSandhiTitle}</span>
                    </h3>
                    <GoldDiamondDivider />
                  </div>

                  {/* Sandhi & Chidra Banners */}
                  {sandhiInfo && (
                    <div className="space-y-3">
                      {sandhiInfo.is_in_chidra_dasha && (
                        <div className="p-4 rounded-xl border-2 border-red-400 bg-red-50 text-xs text-red-950 space-y-2">
                          <div className="flex items-center gap-2 font-bold text-sm text-red-800">
                            <AlertTriangle className="size-4 text-red-600" />
                            <span>{ui.chidraAlertTitle}</span>
                          </div>
                          <p>{sandhiInfo.chidra_message}</p>
                          {sandhiInfo.precautions.length > 0 && (
                            <ul className="list-disc list-inside space-y-1 text-[11px] text-red-900 pt-1">
                              {sandhiInfo.precautions.map((p, idx) => (
                                <li key={idx}>{p}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}

                      {sandhiInfo.is_in_dasha_sandhi && (
                        <div className="p-4 rounded-xl border-2 border-amber-400 bg-amber-50 text-xs text-amber-950 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-amber-900 flex items-center gap-2">
                              <Clock className="size-4 text-amber-700" />
                              <span>{ui.sandhiAlertTitle}</span>
                            </span>
                            <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-950">
                              {toLocalizedDigits(sandhiInfo.days_to_transition, language)} {ui.daysLeft}
                            </span>
                          </div>
                          <p>{sandhiInfo.sandhi_message}</p>
                        </div>
                      )}

                      {!sandhiInfo.is_in_chidra_dasha && !sandhiInfo.is_in_dasha_sandhi && (
                        <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 text-xs text-emerald-900 flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                          <span>
                            {ui.transitionStabilityMsg}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Real-time Transit Synergy Box */}
                  {transitSynergy && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                        <h4 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                          <Activity className="size-4 text-amber-600" />
                          <span>{ui.transitPositionTitle}</span>
                        </h4>
                        <span className="text-xs font-bold text-amber-800">
                          {ui.synergyScore}: {toLocalizedDigits(transitSynergy.synergy_score, language)}%
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 rounded-lg bg-white border border-slate-200">
                          <span className="font-bold text-slate-800">
                            {ui.levelMahadasha.split(" ")[0]} ({translatePlanetName(transitSynergy.md_lord, language)}):
                          </span>
                          <p className="text-slate-600 mt-1">
                            {ui.transitingIn} {translateRashiName(transitSynergy.md_transit_sign, language)} (
                            {toLocalizedDigits(transitSynergy.md_transit_house_from_moon, language)} {ui.fromMoon} –{" "}
                            {transitSynergy.md_transit_nature === "Favorable" ? ui.favorablePhase : ui.neutralPhase}
                            )
                          </p>
                        </div>

                        <div className="p-3.5 rounded-lg bg-white border border-slate-200">
                          <span className="font-bold text-slate-800">
                            {ui.levelAntardasha.split(" ")[0]} ({translatePlanetName(transitSynergy.ad_lord, language)}):
                          </span>
                          <p className="text-slate-600 mt-1">
                            {ui.transitingIn} {translateRashiName(transitSynergy.ad_transit_sign, language)} (
                            {toLocalizedDigits(transitSynergy.ad_transit_house_from_moon, language)} {ui.fromMoon} –{" "}
                            {transitSynergy.ad_transit_nature === "Favorable" ? ui.favorablePhase : ui.neutralPhase}
                            )
                          </p>
                        </div>
                      </div>

                      {/* Sade Sati Card */}
                      <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">{ui.sadeSatiTitle}:</span>
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                              transitSynergy.sade_sati_active
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            }`}
                          >
                            {translateSadeSatiPhase(transitSynergy.sade_sati_phase, language)}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{transitSynergy.sade_sati_description}</p>
                      </div>

                      {transitSynergy.synergy_verdict && (
                        <div className="text-xs font-medium text-slate-700 bg-amber-50/70 p-3 rounded-lg border border-amber-200">
                          🌟 <strong>{ui.verdictLabel}</strong> {transitSynergy.synergy_verdict}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════
                TAB 6: LIFE TIMELINE & REMEDIES
            ════════════════════════════════════════════════════════════ */}
            {activeTab === "timeline" && (
              <div className="space-y-6">
                <div className="rounded-2xl border-2 border-amber-300 bg-white p-6 shadow-sm space-y-6">
                  <div className="text-center space-y-1">
                    <h3 className="font-display text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                      <Flame className="size-6 text-amber-600" />
                      <span>{ui.timelineTitle}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
                      {ui.timelineSubtitle}
                    </p>
                    <GoldDiamondDivider />
                  </div>

                  {/* Visual Life Journey Bar */}
                  <div className="space-y-3">
                    <div className="h-5 w-full bg-slate-100 rounded-xl overflow-hidden flex shadow-inner">
                      {timelineSegments.map((seg, sidx) => {
                        const bg =
                          seg.nature === "favorable"
                            ? "bg-emerald-500"
                            : seg.nature === "challenging"
                            ? "bg-red-500"
                            : "bg-amber-400";
                        return (
                          <div
                            key={sidx}
                            title={`${translatePlanetName(seg.lord, language)} (${toLocalizedDigits(seg.age_start, language)}-${toLocalizedDigits(seg.age_end, language)} ${ui.yearsLabel})`}
                            className={`h-full ${bg} border-r border-white/50 transition-all hover:opacity-80`}
                            style={{ flex: seg.duration_years }}
                          />
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-center gap-4 text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-emerald-700">
                        <span className="size-2.5 rounded-full bg-emerald-500" />
                        <span>{ui.favorablePhase}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-amber-700">
                        <span className="size-2.5 rounded-full bg-amber-400" />
                        <span>{ui.neutralPhase}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-red-700">
                        <span className="size-2.5 rounded-full bg-red-500" />
                        <span>{ui.challengingPhase}</span>
                      </span>
                    </div>

                    {/* Timeline Segments Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                      {timelineSegments.map((seg, sidx) => (
                        <div
                          key={sidx}
                          className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                            seg.is_current
                              ? "border-amber-500 bg-amber-50/80 shadow-xs ring-1 ring-amber-400"
                              : "border-slate-200 bg-slate-50"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-sm text-slate-900">
                              {translatePlanetName(seg.lord, language)} {ui.levelMahadasha.split(" ")[0]}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500">
                              {ui.ageLabel} {toLocalizedDigits(seg.age_start, language)}–{toLocalizedDigits(seg.age_end, language)} {ui.yearsLabel}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {toLocalizedDigits(seg.start_date, language)} – {toLocalizedDigits(seg.end_date, language)}
                          </p>
                          <p className="text-slate-700 text-xs pt-1">{seg.theme}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Authentic Vedic & Lal Kitab Remedies Dashboard */}
                  <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
                    <h4 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="size-5 text-amber-600" />
                      <span>{ui.authenticRemediesTitle}</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/60 space-y-2">
                        <span className="font-bold text-amber-900 uppercase tracking-wider text-[11px]">
                          {ui.beejMantra}
                        </span>
                        <p className="font-serif text-sm font-extrabold text-slate-900">
                          ॐ ग्राং গ্রীং গ্রৌং সঃ গুরবে নমঃ / ॐ শুং শুক্রায় নমঃ
                        </p>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {ui.beejMantraInstruction}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/60 space-y-2">
                        <span className="font-bold text-emerald-900 uppercase tracking-wider text-[11px]">
                          {ui.gayatriMantra}
                        </span>
                        <p className="font-serif text-xs font-bold text-slate-900">
                          ॐ ভूर्ভুবঃ স্বঃ তৎসবিতুর্বরেণ্যং ভর্গো দেবস্য ধীমহি ধিয়ো য়ো নঃ প্রচোদয়াৎ॥
                        </p>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {ui.gayatriMantraInstruction}
                        </p>
                      </div>
                    </div>

                    {/* Consultation CTA */}
                    <div className="rounded-xl border border-amber-300 bg-gradient-to-r from-amber-500/10 via-amber-50/40 to-amber-500/10 p-5 text-center space-y-3">
                      <p className="text-sm font-semibold text-slate-800">
                        {ui.consultationCta}
                      </p>
                      <Link
                        href="/astrologers"
                        className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 text-xs shadow-md transition-all cursor-pointer"
                      >
                        <span>{ui.bookAstrologer}</span>
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rashi Kundli Chart Viewer */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-display text-xl font-bold text-slate-900 text-center">
                {ui.rashiKundliTitle}
              </h3>
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
          </div>
        )}
      </main>

      <FeatureCoinModal
        open={coinModalOpen}
        onClose={() => setCoinModalOpen(false)}
        featureName={dashaFeature?.name || (language === "bn" ? "দশা ক্যালকুলেটর" : language === "hi" ? "दशा कैलकुलेटर" : "Dasha Calculator")}
        requiredCoins={dashaFeature?.coins ?? 15}
        walletBalance={walletBalance}
        reason={coinModalReason}
        language={language}
      />

      <SiteFooter />
    </div>
  );
}
