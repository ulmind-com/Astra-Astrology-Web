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
  ChevronDown,
  ChevronUp,
  HeartHandshake,
  Languages,
  User,
  Download,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Flame,
  Info,
  Heart,
  Baby,
  Coins,
  Activity,
  TrendingUp,
  ShieldAlert,
  Scale,
  BookOpen,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { astrologyApi } from "@/lib/api";
import { parseProfileBirthDetails } from "@/lib/birth-details";
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
  BirthPlaceField,
  type SelectedPlace,
} from "@/components/astrology/birth-place-field";
import {
  KundliDiamondChart,
  type ChartStyleType,
} from "@/components/astrology/kundli-diamond-chart";
import {
  KUNDLI_MATCHING_STRINGS,
  type KundliMatchingTranslations,
  translateKootaAttribute,
  translateKootaValue,
  translatePoruthamStatus,
  translatePersonalityTrait,
  translatePersonalitySummary,
  translateSeverity,
  translateAvakahadaAttr,
  translateAvakahadaValue,
  translateDoshaName,
} from "@/lib/kundli-matching-translations";
import {
  translatePlanetName,
  translateRashiName,
  translateNakshatraName,
  toLocalizedDigits,
} from "@/lib/kundli-translations";
import type {
  AstrologyLanguage,
  AyanamsaType,
  HouseSystemType,
  KundliMatchingPayload,
  KundliMatchingResult,
} from "@/types";

// Decorative Gold Diamond Divider matching Astra Aesthetics
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

// Zodiac Glyphs Map
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

interface PersonFormState {
  name: string;
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  second: string;
  period: "AM" | "PM" | null;
  place: string;
  selectedPlace: SelectedPlace | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string;
  ayanamsa: AyanamsaType;
  houseSystem: HouseSystemType;
  showAdvanced: boolean;
}

const defaultPersonState: PersonFormState = {
  name: "",
  day: "",
  month: "",
  year: "",
  hour: "",
  minute: "",
  second: "",
  period: null,
  place: "",
  selectedPlace: null,
  latitude: null,
  longitude: null,
  timezone: "5.5",
  ayanamsa: "lahiri",
  houseSystem: "placidus",
  showAdvanced: false,
};

export default function KundliMatchingPage() {
  // Centralized Language State
  const { language, setLanguage } = useLanguage();
  const t: KundliMatchingTranslations =
    KUNDLI_MATCHING_STRINGS[language] || KUNDLI_MATCHING_STRINGS.bn;

  // Stepper State: 1 = Groom, 2 = Bride
  const [step, setStep] = React.useState<1 | 2>(1);

  // Forms State - always completely empty by default so user enters everything
  const [groom, setGroom] = React.useState<PersonFormState>({
    ...defaultPersonState,
  });

  const [bride, setBride] = React.useState<PersonFormState>({
    ...defaultPersonState,
  });

  // Prefill the groom side from the signed-in user's saved birth details, the same
  // source `/kundli` reads. Without this a signed-in user got their stored details
  // on one page and a blank form on the other, and the two pages then disagreed
  // about the same person.
  const { isSignedIn, user } = useAuth();
  const { data: profile } = useProfile({ enabled: Boolean(isSignedIn) });
  const { getFeature, checkAccess, walletBalance, refresh: refreshWallet } = useFeaturePricing();
  const matchingFeature = getFeature("kundli_matching");
  const [coinModalOpen, setCoinModalOpen] = React.useState(false);
  const [coinModalReason, setCoinModalReason] = React.useState<"unauthorized" | "insufficient_coins" | "disabled">("insufficient_coins");

  // Prefill the groom side from the signed-in user's saved birth details, the same
  // source `/kundli` reads. Without this a signed-in user got their stored details
  // on one page and a blank form on the other, and the two pages then disagreed
  // about the same person.
  //
  // Adjusted during render rather than in an effect so the form never paints blank
  // for a frame and then jumps once the profile arrives.
  const profileKey = profile ? (profile.email ?? profile.full_name ?? "profile") : null;
  const [autoFilledFor, setAutoFilledFor] = React.useState<string | null>(null);
  if (isSignedIn && profileKey && profileKey !== autoFilledFor) {
    setAutoFilledFor(profileKey);
    const parsed = parseProfileBirthDetails(profile?.birth);
    setGroom((prev) => ({
      ...prev,
      ...parsed,
      // Never overwrite something already typed.
      name: prev.name || user?.full_name || prev.name,
    }));
  }

  // Results & Tabs State
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<KundliMatchingResult | null>(null);
  const [activeTab, setActiveTab] = React.useState<
    "dosha" | "dashakoot" | "cancellations" | "papasamya" | "charts" | "avakahada" | "forecast" | "personality" | "planets"
  >("dosha");
  const [selectedChartType, setSelectedChartType] = React.useState<"d1" | "d9" | "chalit" | "moon">("d1");
  const [chartStyle, setChartStyle] = React.useState<ChartStyleType>("north");

  // Validate Person
  const validatePerson = (p: PersonFormState, label: string): boolean => {
    if (!p.name.trim()) {
      toast.error(`${label}: ${t.form.validationName}`);
      return false;
    }
    const d = parseInt(p.day, 10);
    const m = parseInt(p.month, 10);
    const y = parseInt(p.year, 10);
    if (!d || !m || !y || d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > 2100) {
      toast.error(`${label}: ${t.form.validationDob}`);
      return false;
    }
    if (!p.selectedPlace) {
      toast.error(`${label}: ${t.form.validationPlace}`);
      return false;
    }
    // A time without AM or PM is ambiguous by twelve hours, so it is not accepted.
    if (p.hour.trim() !== "" && p.period === null) {
      toast.error(
        language === "bn"
          ? `${label}: জন্মসময়ের জন্য AM না PM বেছে নিন`
          : language === "hi"
          ? `${label}: जन्म समय हेतु AM अथवा PM चुनें`
          : `${label}: choose AM or PM for the birth time`,
      );
      return false;
    }
    return true;
  };

  // Step 1 to Step 2
  const handleNextToBride = () => {
    if (validatePerson(groom, t.groomLabel)) {
      setStep(2);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  // Handle Form Submission
  const handleCalculateMatch = async () => {
    if (!validatePerson(groom, t.groomLabel)) {
      setStep(1);
      return;
    }
    if (!validatePerson(bride, t.brideLabel)) {
      setStep(2);
      return;
    }

    setIsLoading(true);
    try {
      // Default to 12:00 PM (Noon) if birth time is not entered, conforming with Vedic convention and rashi-calculator
      let groomHour = 12;
      let groomMin = 0;
      let groomSec = 0;
      let groomPeriod: "AM" | "PM" = "PM";  // noon fallback when no time is given

      if (groom.hour.trim() !== "") {
        groomHour = parseInt(groom.hour, 10) || 12;
        groomMin = groom.minute.trim() !== "" ? parseInt(groom.minute, 10) : 0;
        groomSec = groom.second.trim() !== "" ? parseInt(groom.second, 10) : 0;
        groomPeriod = groom.period ?? "AM";
      }

      let brideHour = 12;
      let brideMin = 0;
      let brideSec = 0;
      let bridePeriod: "AM" | "PM" = "PM";  // noon fallback when no time is given

      if (bride.hour.trim() !== "") {
        brideHour = parseInt(bride.hour, 10) || 12;
        brideMin = bride.minute.trim() !== "" ? parseInt(bride.minute, 10) : 0;
        brideSec = bride.second.trim() !== "" ? parseInt(bride.second, 10) : 0;
        bridePeriod = bride.period ?? "AM";
      }

      const payload: KundliMatchingPayload = {
        groom: {
          name: groom.name.trim(),
          day: parseInt(groom.day, 10),
          month: parseInt(groom.month, 10),
          year: parseInt(groom.year, 10),
          hour: groomHour,
          minute: groomMin,
          second: groomSec,
          period: groomPeriod,
          place:
            groom.selectedPlace?.displayName ||
            groom.selectedPlace?.place ||
            groom.place.trim(),
          latitude: groom.selectedPlace!.latitude,
          longitude: groom.selectedPlace!.longitude,
          timezone:
            groom.selectedPlace?.timezoneOffset != null
              ? groom.selectedPlace.timezoneOffset
              : parseFloat(groom.timezone) || 5.5,
          // With a zone name the backend resolves the exact offset at the birth
          // instant, so daylight saving and historical changes are handled.
          timezone_name: groom.selectedPlace?.timezoneName ?? null,
          ayanamsa: groom.ayanamsa,
          house_system: groom.houseSystem,
        },
        bride: {
          name: bride.name.trim(),
          day: parseInt(bride.day, 10),
          month: parseInt(bride.month, 10),
          year: parseInt(bride.year, 10),
          hour: brideHour,
          minute: brideMin,
          second: brideSec,
          period: bridePeriod,
          place:
            bride.selectedPlace?.displayName ||
            bride.selectedPlace?.place ||
            bride.place.trim(),
          latitude: bride.selectedPlace!.latitude,
          longitude: bride.selectedPlace!.longitude,
          timezone:
            bride.selectedPlace?.timezoneOffset != null
              ? bride.selectedPlace.timezoneOffset
              : parseFloat(bride.timezone) || 5.5,
          // With a zone name the backend resolves the exact offset at the birth
          // instant, so daylight saving and historical changes are handled.
          timezone_name: bride.selectedPlace?.timezoneName ?? null,
          ayanamsa: bride.ayanamsa,
          house_system: bride.houseSystem,
        },
        language,
      };

      const access = checkAccess("kundli_matching");
      if (!access.allowed) {
        if (access.reason === "disabled") {
          toast.error(t.toastDisabled);
          return;
        }
        setCoinModalReason(access.reason || "insufficient_coins");
        setCoinModalOpen(true);
        return;
      }

      setIsLoading(true);
      const res = await astrologyApi.calculateKundliMatching(payload);
      if (res) {
        setResult(res);
        if (access.requiredCoins > 0) {
          toast.success(t.toastSuccessCoins(access.requiredCoins));
          refreshWallet();
        } else {
          toast.success(t.toastSuccess);
        }
        setTimeout(() => {
          document.getElementById("matching-results")?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    } catch (err: any) {
      console.error("Kundli Matching Error:", err);
      if (err?.code === "insufficient_coins") {
        setCoinModalReason("insufficient_coins");
        setCoinModalOpen(true);
      } else if (err?.code === "authentication_required" || err?.status === 401) {
        setCoinModalReason("unauthorized");
        setCoinModalOpen(true);
      } else {
        toast.error(err?.message || t.toastErrorCalc);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setResult(null);
    setGroom({ ...defaultPersonState });
    setBride({ ...defaultPersonState });
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-surface-muted/30 text-surface-foreground flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      <SiteHeader />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* =========================================================================
            HEADER & TITLE matching Astra Warm Calm Aesthetic
           ========================================================================= */}
        <section className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-300 bg-amber-50/80 text-amber-900 text-xs font-semibold tracking-wide shadow-sm">
            <Sparkles className="size-3.5 text-amber-600 animate-pulse" />
            <span>{t.pageTitle}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
            {t.pageTitle}
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.pageSubtitle}
          </p>

          <GoldDiamondDivider />

          {/* Feature Coin Badge */}
          <div className="flex justify-center pt-1">
            <FeatureCoinBadge
              feature={matchingFeature}
              walletBalance={walletBalance}
              language={language}
            />
          </div>

          {/* Language Switcher Bar */}
          <div className="inline-flex items-center p-1 rounded-full border border-amber-200/80 bg-white/90 shadow-sm gap-1 text-xs font-medium">
            <Languages className="size-3.5 text-amber-600 ml-2 mr-1" />
            <button
              type="button"
              onClick={() => setLanguage("bn")}
              className={`px-3 py-1 rounded-full transition-all duration-200 ${
                language === "bn"
                  ? "bg-amber-500 text-white font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-amber-50"
              }`}
            >
              বাংলা
            </button>
            <button
              type="button"
              onClick={() => setLanguage("hi")}
              className={`px-3 py-1 rounded-full transition-all duration-200 ${
                language === "hi"
                  ? "bg-amber-500 text-white font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-amber-50"
              }`}
            >
              हिंदी
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 rounded-full transition-all duration-200 ${
                language === "en"
                  ? "bg-amber-500 text-white font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-amber-50"
              }`}
            >
              English
            </button>
          </div>
        </section>

        {/* =========================================================================
            2-STEP STEPPER WIZARD (Matching Screenshots 1 & 2)
           ========================================================================= */}
        <section className="bg-white rounded-2xl border border-amber-200/70 shadow-sm p-5 sm:p-8 space-y-6">
          {/* Stepper Tabs Bar */}
          <div className="grid grid-cols-2 gap-3 pb-4 border-b border-amber-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                step === 1
                  ? "border-amber-400 bg-amber-50/70 text-amber-900 shadow-xs"
                  : "border-slate-200 bg-slate-50/60 text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span
                className={`size-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 1 ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-600"
                }`}
              >
                1
              </span>
              <span>{t.step1Title}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (validatePerson(groom, t.groomLabel)) setStep(2);
              }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                step === 2
                  ? "border-amber-400 bg-amber-50/70 text-amber-900 shadow-xs"
                  : "border-slate-200 bg-slate-50/60 text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span
                className={`size-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 2 ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-600"
                }`}
              >
                2
              </span>
              <span>{t.step2Title}</span>
            </button>
          </div>

          {/* Form Content */}
          {step === 1 ? (
            /* STEP 1: GROOM FORM */
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-2 text-amber-800 font-semibold text-base sm:text-lg border-b border-amber-100 pb-2">
                <span className="text-xl">♂</span>
                <span>{t.groomFormHeading}</span>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
                  {t.form.fullNameLabel} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    value={groom.name}
                    onChange={(e) => setGroom({ ...groom, name: e.target.value })}
                    placeholder={t.form.fullNamePlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Birth Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
                  {t.form.dobLabel} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={groom.day}
                    onChange={(e) => setGroom({ ...groom, day: e.target.value })}
                    placeholder={t.form.dayPlaceholder}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center"
                  />
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={groom.month}
                    onChange={(e) => setGroom({ ...groom, month: e.target.value })}
                    placeholder={t.form.monthPlaceholder}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center"
                  />
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={groom.year}
                    onChange={(e) => setGroom({ ...groom, year: e.target.value })}
                    placeholder={t.form.yearPlaceholder}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center"
                  />
                </div>
              </div>

              {/* Birth Time */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
                  {t.form.tobLabel}{" "}
                  <span className="text-[11px] font-semibold text-emerald-700 lowercase">
                    ({t.timeOptionalSuffix})
                  </span>
                </label>
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={groom.hour}
                    onChange={(e) => setGroom({ ...groom, hour: e.target.value })}
                    placeholder={t.form.hourPlaceholder}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center"
                  />
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={groom.minute}
                    onChange={(e) => setGroom({ ...groom, minute: e.target.value })}
                    placeholder={t.form.minutePlaceholder}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center"
                  />
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={groom.second}
                    onChange={(e) => setGroom({ ...groom, second: e.target.value })}
                    placeholder={t.form.secondPlaceholder}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center"
                  />
                  <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-0.5">
                    <button
                      type="button"
                      onClick={() => setGroom({ ...groom, period: "AM" })}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                        groom.period === "AM"
                          ? "bg-amber-500 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => setGroom({ ...groom, period: "PM" })}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                        groom.period === "PM"
                          ? "bg-amber-500 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      PM
                    </button>
                  </div>
                </div>
              </div>

              {/* Birth Place */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
                  {t.form.placeLabel} <span className="text-red-500">*</span>
                </label>
                <BirthPlaceField
                  value={groom.selectedPlace}
                  onChange={(next: SelectedPlace | null) => {
                    setGroom((prev) => ({
                      ...prev,
                      selectedPlace: next,
                      place: next ? next.displayName || next.place : "",
                      latitude: next ? next.latitude : null,
                      longitude: next ? next.longitude : null,
                      timezone: next && next.timezoneOffset != null ? String(next.timezoneOffset) : prev.timezone,
                    }));
                  }}
                  birthDate={{
                    year: parseInt(groom.year, 10) || undefined,
                    month: parseInt(groom.month, 10) || undefined,
                    day: parseInt(groom.day, 10) || undefined,
                  }}
                  language={language}
                />
              </div>

              {/* Advanced Settings Toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setGroom({ ...groom, showAdvanced: !groom.showAdvanced })}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                >
                  {groom.showAdvanced ? (
                    <>
                      <ChevronUp className="size-4" />
                      <span>{t.form.hideAdvancedSettings}</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="size-4" />
                      <span>{t.form.advancedSettings}</span>
                    </>
                  )}
                </button>

                {groom.showAdvanced && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 mt-2 rounded-xl bg-amber-50/50 border border-amber-200/60 animate-fadeIn">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        {t.form.latitude}
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={groom.latitude ?? ""}
                        onChange={(e) =>
                          setGroom({ ...groom, latitude: parseFloat(e.target.value) || null })
                        }
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        {t.form.longitude}
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={groom.longitude ?? ""}
                        onChange={(e) =>
                          setGroom({ ...groom, longitude: parseFloat(e.target.value) || null })
                        }
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        {t.form.timezone}
                      </label>
                      <input
                        type="text"
                        value={groom.timezone}
                        onChange={(e) => setGroom({ ...groom, timezone: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button for Step 1 */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextToBride}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <span>{t.nextStepButton}</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: BRIDE FORM */
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-2 text-amber-800 font-semibold text-base sm:text-lg border-b border-amber-100 pb-2">
                <span className="text-xl">♀</span>
                <span>{t.brideFormHeading}</span>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
                  {t.form.fullNameLabel} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    value={bride.name}
                    onChange={(e) => setBride({ ...bride, name: e.target.value })}
                    placeholder={t.form.fullNamePlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Birth Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
                  {t.form.dobLabel} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={bride.day}
                    onChange={(e) => setBride({ ...bride, day: e.target.value })}
                    placeholder={t.form.dayPlaceholder}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center"
                  />
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={bride.month}
                    onChange={(e) => setBride({ ...bride, month: e.target.value })}
                    placeholder={t.form.monthPlaceholder}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center"
                  />
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={bride.year}
                    onChange={(e) => setBride({ ...bride, year: e.target.value })}
                    placeholder={t.form.yearPlaceholder}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center"
                  />
                </div>
              </div>

              {/* Birth Time */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
                  {t.form.tobLabel}{" "}
                  <span className="text-[11px] font-semibold text-emerald-700 lowercase">
                    ({t.timeOptionalSuffix})
                  </span>
                </label>
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={bride.hour}
                    onChange={(e) => setBride({ ...bride, hour: e.target.value })}
                    placeholder={t.form.hourPlaceholder}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center"
                  />
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={bride.minute}
                    onChange={(e) => setBride({ ...bride, minute: e.target.value })}
                    placeholder={t.form.minutePlaceholder}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center"
                  />
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={bride.second}
                    onChange={(e) => setBride({ ...bride, second: e.target.value })}
                    placeholder={t.form.secondPlaceholder}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center"
                  />
                  <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-0.5">
                    <button
                      type="button"
                      onClick={() => setBride({ ...bride, period: "AM" })}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                        bride.period === "AM"
                          ? "bg-amber-500 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => setBride({ ...bride, period: "PM" })}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                        bride.period === "PM"
                          ? "bg-amber-500 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      PM
                    </button>
                  </div>
                </div>
              </div>

              {/* Birth Place */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
                  {t.form.placeLabel} <span className="text-red-500">*</span>
                </label>
                <BirthPlaceField
                  value={bride.selectedPlace}
                  onChange={(next: SelectedPlace | null) => {
                    setBride((prev) => ({
                      ...prev,
                      selectedPlace: next,
                      place: next ? next.displayName || next.place : "",
                      latitude: next ? next.latitude : null,
                      longitude: next ? next.longitude : null,
                      timezone: next && next.timezoneOffset != null ? String(next.timezoneOffset) : prev.timezone,
                    }));
                  }}
                  birthDate={{
                    year: parseInt(bride.year, 10) || undefined,
                    month: parseInt(bride.month, 10) || undefined,
                    day: parseInt(bride.day, 10) || undefined,
                  }}
                  language={language}
                />
              </div>

              {/* Advanced Settings Toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setBride({ ...bride, showAdvanced: !bride.showAdvanced })}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                >
                  {bride.showAdvanced ? (
                    <>
                      <ChevronUp className="size-4" />
                      <span>{t.form.hideAdvancedSettings}</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="size-4" />
                      <span>{t.form.advancedSettings}</span>
                    </>
                  )}
                </button>

                {bride.showAdvanced && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 mt-2 rounded-xl bg-amber-50/50 border border-amber-200/60 animate-fadeIn">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        {t.form.latitude}
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={bride.latitude ?? ""}
                        onChange={(e) =>
                          setBride({ ...bride, latitude: parseFloat(e.target.value) || null })
                        }
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        {t.form.longitude}
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={bride.longitude ?? ""}
                        onChange={(e) =>
                          setBride({ ...bride, longitude: parseFloat(e.target.value) || null })
                        }
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        {t.form.timezone}
                      </label>
                      <input
                        type="text"
                        value={bride.timezone}
                        onChange={(e) => setBride({ ...bride, timezone: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons for Step 2 */}
              <div className="pt-4 space-y-3">
                {matchingFeature && !matchingFeature.enabled && (
                  <FeatureDisabledAlert
                    featureName={language === "bn" ? "কুন্ডলী মিলন" : "Kundli Matching"}
                    language={language}
                  />
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all"
                  >
                    <ArrowLeft className="size-4" />
                    <span>{t.backButton}</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <FeatureCoinBadge
                      feature={matchingFeature}
                      walletBalance={walletBalance}
                      language={language}
                      showWallet={false}
                    />

                    <button
                      type="button"
                      disabled={isLoading || (matchingFeature ? !matchingFeature.enabled : false)}
                      onClick={handleCalculateMatch}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="size-4 animate-spin" />
                          <span>{t.calculatingBtn}</span>
                        </>
                      ) : (
                        <>
                          <span>
                            {matchingFeature && !matchingFeature.enabled
                              ? t.featureUnavailable
                              : t.matchButton}
                          </span>
                          <HeartHandshake className="size-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* =========================================================================
            RESULTS SECTION (Visible after calculation)
           ========================================================================= */}
        {result && (
          <div id="matching-results" className="space-y-8 animate-fadeIn pt-4">
            {/* 1. WEDDING RINGS GRAPHIC BANNER matching screenshot */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white p-6 sm:p-8 text-center shadow-md">
              <div className="relative z-10 space-y-2">
                <div className="text-3xl sm:text-4xl">💍</div>
                <h2 className="text-xl sm:text-3xl font-serif font-bold tracking-tight">
                  <span className="text-white drop-shadow-xs">{result.groom.name}</span>
                  <span className="mx-3 text-amber-200 text-xl font-normal">❤️</span>
                  <span className="text-white drop-shadow-xs">{result.bride.name}</span>
                </h2>
                <p className="text-xs sm:text-sm text-amber-100 font-medium">
                  {t.ringsBanner} • {t.pointsTable.totalLabel}:{" "}
                  <span className="font-bold text-white text-base">
                    {toLocalizedDigits(result.total_received, language)} /{" "}
                    {toLocalizedDigits(result.total_out_of, language)}
                  </span>
                </p>
              </div>
            </div>

            {/* 2. SIDE-BY-SIDE BASIC DETAILS TABLES matching screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GROOM DETAILS CARD */}
              <div className="bg-white rounded-2xl border border-amber-200/80 shadow-xs overflow-hidden">
                <div className="bg-amber-500/10 px-5 py-3 border-b border-amber-200/70 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-amber-950 text-sm sm:text-base flex items-center gap-2">
                    <span className="text-amber-700">♂</span>
                    <span>{t.groomTitle}</span>
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800">
                    {result.groom.is_manglik ? t.groomManglikBadge : t.groomNonManglikBadge}
                  </span>
                </div>
                <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                  <div className="px-5 py-2.5 flex justify-between">
                    <span className="text-slate-500">{t.name}</span>
                    <span className="font-semibold text-slate-800">{result.groom.name}</span>
                  </div>
                  <div className="px-5 py-2.5 flex justify-between">
                    <span className="text-slate-500">{t.birthDateTime}</span>
                    <span className="font-medium text-slate-800">
                      {toLocalizedDigits(result.groom.birth_date_time, language)}
                    </span>
                  </div>
                  <div className="px-5 py-2.5 flex justify-between">
                    <span className="text-slate-500">{t.birthPlace}</span>
                    <span className="font-medium text-slate-800 text-right max-w-[200px] truncate">
                      {result.groom.birth_place}
                    </span>
                  </div>
                  <div className="px-5 py-2.5 flex justify-between items-center">
                    <span className="text-slate-500">{t.janamRashi}</span>
                    <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <span>{ZODIAC_SYMBOLS_MAP[result.groom.janam_rasi] || "♈"}</span>
                      <span>{translateRashiName(result.groom.janam_rasi, language)}</span>
                    </span>
                  </div>
                  <div className="px-5 py-2.5 flex justify-between">
                    <span className="text-slate-500">{t.rashiLord}</span>
                    <span className="font-medium text-slate-800">
                      {translatePlanetName(result.groom.rasi_lord, language)}
                    </span>
                  </div>
                  <div className="px-5 py-2.5 flex justify-between">
                    <span className="text-slate-500">{t.janamNakshatra}</span>
                    <span className="font-semibold text-amber-900">
                      {translateNakshatraName(result.groom.janam_nakshatra, language)}
                    </span>
                  </div>
                  <div className="px-5 py-2.5 flex justify-between">
                    <span className="text-slate-500">{t.nakshatraLord}</span>
                    <span className="font-medium text-slate-800">
                      {translatePlanetName(result.groom.nakshatra_lord, language)}
                    </span>
                  </div>
                  <div className="px-5 py-2.5 flex justify-between">
                    <span className="text-slate-500">{t.pada}</span>
                    <span className="font-medium text-slate-800">
                      {toLocalizedDigits(result.groom.pada, language)}
                    </span>
                  </div>
                </div>
              </div>

              {/* BRIDE DETAILS CARD */}
              <div className="bg-white rounded-2xl border border-amber-200/80 shadow-xs overflow-hidden">
                <div className="bg-amber-500/10 px-5 py-3 border-b border-amber-200/70 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-amber-950 text-sm sm:text-base flex items-center gap-2">
                    <span className="text-amber-700">♀</span>
                    <span>{t.brideTitle}</span>
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800">
                    {result.bride.is_manglik ? t.brideManglikBadge : t.brideNonManglikBadge}
                  </span>
                </div>
                <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                  <div className="px-5 py-2.5 flex justify-between">
                    <span className="text-slate-500">{t.name}</span>
                    <span className="font-semibold text-slate-800">{result.bride.name}</span>
                  </div>
                  <div className="px-5 py-2.5 flex justify-between">
                    <span className="text-slate-500">{t.birthDateTime}</span>
                    <span className="font-medium text-slate-800">
                      {toLocalizedDigits(result.bride.birth_date_time, language)}
                    </span>
                  </div>
                  <div className="px-5 py-2.5 flex justify-between">
                    <span className="text-slate-500">{t.birthPlace}</span>
                    <span className="font-medium text-slate-800 text-right max-w-[200px] truncate">
                      {result.bride.birth_place}
                    </span>
                  </div>
                  <div className="px-5 py-2.5 flex justify-between items-center">
                    <span className="text-slate-500">{t.janamRashi}</span>
                    <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <span>{ZODIAC_SYMBOLS_MAP[result.bride.janam_rasi] || "♍"}</span>
                      <span>{translateRashiName(result.bride.janam_rasi, language)}</span>
                    </span>
                  </div>
                  <div className="px-5 py-2.5 flex justify-between">
                    <span className="text-slate-500">{t.rashiLord}</span>
                    <span className="font-medium text-slate-800">
                      {translatePlanetName(result.bride.rasi_lord, language)}
                    </span>
                  </div>
                  <div className="px-5 py-2.5 flex justify-between">
                    <span className="text-slate-500">{t.janamNakshatra}</span>
                    <span className="font-semibold text-amber-900">
                      {translateNakshatraName(result.bride.janam_nakshatra, language)}
                    </span>
                  </div>
                  <div className="px-5 py-2.5 flex justify-between">
                    <span className="text-slate-500">{t.nakshatraLord}</span>
                    <span className="font-medium text-slate-800">
                      {translatePlanetName(result.bride.nakshatra_lord, language)}
                    </span>
                  </div>
                  <div className="px-5 py-2.5 flex justify-between">
                    <span className="text-slate-500">{t.pada}</span>
                    <span className="font-medium text-slate-800">
                      {toLocalizedDigits(result.bride.pada, language)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. MANGLIK STATUS BANNER matching screenshot */}
            <div className="rounded-xl border border-amber-200/90 bg-amber-50/70 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="size-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-800">
                  <Flame className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    <span>
                      {t.manglikBannerPrefixBoy}{" "}
                      <strong className="text-amber-900">
                        {result.groom.is_manglik ? t.isManglik : t.isNotManglik}
                      </strong>
                      .
                    </span>{" "}
                    <span>
                      {t.manglikBannerPrefixGirl}{" "}
                      <strong className="text-amber-900">
                        {result.bride.is_manglik ? t.isManglik : t.isNotManglik}
                      </strong>
                      .
                    </span>
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {result.doshas.manglik_match
                      ? t.manglikDescFavorable
                      : t.manglikDescCaution}
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                    result.doshas.manglik_match
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-rose-100 text-rose-800 border border-rose-300"
                  }`}
                >
                  <ShieldCheck className="size-3.5" />
                  <span>
                    {result.doshas.manglik_match
                      ? t.manglikMatchYes
                      : t.manglikMatchNo}
                  </span>
                </span>
              </div>
            </div>

            {/* 4. MULTI-LAYERED INTERACTIVE TABS */}
            <div className="space-y-6">
              {/* Tab Navigation Pill Bar */}
              <div className="flex border-b border-amber-200 overflow-x-auto scrollbar-none gap-1 py-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("dosha")}
                  className={`py-2.5 px-3.5 sm:px-4 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === "dosha"
                      ? "bg-amber-500 text-white shadow-xs font-extrabold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-amber-50/60"
                  }`}
                >
                  <ShieldCheck className="size-4" />
                  <span>{t.tabs.dosha}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("dashakoot")}
                  className={`py-2.5 px-3.5 sm:px-4 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === "dashakoot"
                      ? "bg-amber-500 text-white shadow-xs font-extrabold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-amber-50/60"
                  }`}
                >
                  <Sparkles className="size-4" />
                  <span>{t.tabs.dashakoot}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("cancellations")}
                  className={`py-2.5 px-3.5 sm:px-4 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === "cancellations"
                      ? "bg-amber-500 text-white shadow-xs font-extrabold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-amber-50/60"
                  }`}
                >
                  <ShieldAlert className="size-4 text-emerald-600" />
                  <span>{t.tabs.cancellations}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("papasamya")}
                  className={`py-2.5 px-3.5 sm:px-4 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === "papasamya"
                      ? "bg-amber-500 text-white shadow-xs font-extrabold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-amber-50/60"
                  }`}
                >
                  <Scale className="size-4 text-indigo-500" />
                  <span>{t.tabs.papasamya}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("charts")}
                  className={`py-2.5 px-3.5 sm:px-4 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === "charts"
                      ? "bg-amber-500 text-white shadow-xs font-extrabold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-amber-50/60"
                  }`}
                >
                  <RotateCcw className="size-4" />
                  <span>{t.tabs.lagnaCharts}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("avakahada")}
                  className={`py-2.5 px-3.5 sm:px-4 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === "avakahada"
                      ? "bg-amber-500 text-white shadow-xs font-extrabold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-amber-50/60"
                  }`}
                >
                  <BookOpen className="size-4 text-purple-600" />
                  <span>{t.tabs.avakahada}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("forecast")}
                  className={`py-2.5 px-3.5 sm:px-4 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === "forecast"
                      ? "bg-amber-500 text-white shadow-xs font-extrabold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-amber-50/60"
                  }`}
                >
                  <Heart className="size-4 text-rose-500" />
                  <span>{t.tabs.forecast}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("personality")}
                  className={`py-2.5 px-3.5 sm:px-4 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === "personality"
                      ? "bg-amber-500 text-white shadow-xs font-extrabold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-amber-50/60"
                  }`}
                >
                  <User className="size-4 text-teal-600" />
                  <span>{t.tabs.personality}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("planets")}
                  className={`py-2.5 px-3.5 sm:px-4 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === "planets"
                      ? "bg-amber-500 text-white shadow-xs font-extrabold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-amber-50/60"
                  }`}
                >
                  <Sparkles className="size-4" />
                  <span>{t.tabs.planetDetails}</span>
                </button>
              </div>

              {/* =================================================================
                  TAB 1: DOSHA & ASHTAKOOT POINTS
                 ================================================================= */}
              {activeTab === "dosha" && (
                <div className="space-y-6 animate-fadeIn">
                  {/* 4 Metric Cards matching screenshot */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Card 1: Ashtakoot */}
                    <div className="bg-white rounded-2xl border border-amber-200/80 p-4 text-center shadow-xs">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {t.metricCards.ashtakootTitle}
                      </span>
                      <div className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-amber-900">
                        {toLocalizedDigits(result.total_received, language)}
                        <span className="text-xs sm:text-sm font-normal text-slate-400">
                          {" "}
                          / {toLocalizedDigits(result.total_out_of, language)}
                        </span>
                      </div>
                      <span
                        className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          result.total_received >= 18
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {result.total_received >= 18
                          ? t.auspiciousMatch
                          : t.inauspiciousMatch}
                      </span>
                    </div>

                    {/* Card 2: Rajjoo Dosha */}
                    <div className="bg-white rounded-2xl border border-amber-200/80 p-4 text-center shadow-xs">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {t.metricCards.rajjooDoshaTitle}
                      </span>
                      <div className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-slate-800">
                        {result.doshas.rajjoo_dosha ? t.metricCards.yes : t.metricCards.no}
                      </div>
                      <span
                        className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          !result.doshas.rajjoo_dosha
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {!result.doshas.rajjoo_dosha
                          ? t.doshaFree
                          : t.doshaPresent}
                      </span>
                    </div>

                    {/* Card 3: Vedha Dosha */}
                    <div className="bg-white rounded-2xl border border-amber-200/80 p-4 text-center shadow-xs">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {t.metricCards.vedhaDoshaTitle}
                      </span>
                      <div className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-slate-800">
                        {result.doshas.vedha_dosha ? t.metricCards.yes : t.metricCards.no}
                      </div>
                      <span
                        className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          !result.doshas.vedha_dosha
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {!result.doshas.vedha_dosha
                          ? t.doshaFree
                          : t.doshaPresent}
                      </span>
                    </div>

                    {/* Card 4: Manglik Match */}
                    <div className="bg-white rounded-2xl border border-amber-200/80 p-4 text-center shadow-xs">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {t.metricCards.manglikMatchTitle}
                      </span>
                      <div className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-slate-800">
                        {result.doshas.manglik_match ? t.metricCards.yes : t.metricCards.no}
                      </div>
                      <span
                        className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          result.doshas.manglik_match
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {result.doshas.manglik_match
                          ? t.compatibleBadge
                          : t.remedyNeededBadge}
                      </span>
                    </div>
                  </div>

                  {/* Compatibility Verdict Banner matching screenshot */}
                  <div className="rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50/60 p-5 shadow-xs flex items-start gap-4">
                    <div className="size-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <CheckCircle2 className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-serif font-bold text-slate-900">
                        {result.is_compatible
                          ? t.verdictAuspiciousTitle
                          : t.verdictCautionTitle}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {result.is_compatible ? t.verdict.favorable : t.verdict.unfavorable}
                      </p>
                    </div>
                  </div>

                  {/* MATCH ASHTAKOOT POINTS TABLE matching screenshot */}
                  <div className="bg-white rounded-2xl border border-amber-200/80 shadow-xs overflow-hidden">
                    <div className="bg-amber-500/10 px-5 py-4 border-b border-amber-200/70">
                      <h3 className="font-serif font-bold text-amber-950 text-base sm:text-lg">
                        {t.pointsTable.title}
                      </h3>
                      <p className="text-xs text-slate-500">{t.pointsTable.subtitle}</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-amber-50/70 border-b border-amber-200/70 text-slate-700 font-bold">
                            <th className="py-3 px-4">{t.pointsTable.colAttribute}</th>
                            <th className="py-3 px-4">{t.pointsTable.colMale}</th>
                            <th className="py-3 px-4">{t.pointsTable.colFemale}</th>
                            <th className="py-3 px-4 text-center">{t.pointsTable.colOutOf}</th>
                            <th className="py-3 px-4 text-center">{t.pointsTable.colReceived}</th>
                            <th className="py-3 px-4">{t.pointsTable.colAreaOfLife}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {result.kootas.map((k, idx) => {
                            const attrTrans = t.attributes[k.attribute];
                            const attrName = translateKootaAttribute(k.attribute, language) || attrTrans?.name || k.attribute;
                            const areaOfLife = attrTrans?.areaOfLife || k.area_of_life;
                            const isFull = k.received === k.out_of;
                            const isZero = k.received === 0;

                            return (
                              <tr
                                key={k.attribute}
                                className={`hover:bg-amber-50/40 transition-colors ${
                                  idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                                }`}
                              >
                                <td className="py-3 px-4 font-semibold text-slate-900">
                                  {attrName}
                                </td>
                                <td className="py-3 px-4 text-slate-700 font-medium">
                                  {translateKootaValue(k.attribute, k.male, language)}
                                </td>
                                <td className="py-3 px-4 text-slate-700 font-medium">
                                  {translateKootaValue(k.attribute, k.female, language)}
                                </td>
                                <td className="py-3 px-4 text-center font-bold text-slate-600">
                                  {toLocalizedDigits(k.out_of, language)}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span
                                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                      isFull
                                        ? "bg-emerald-100 text-emerald-800"
                                        : isZero
                                        ? "bg-rose-100 text-rose-800"
                                        : "bg-amber-100 text-amber-800"
                                    }`}
                                  >
                                    {toLocalizedDigits(k.received, language)}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-slate-600 text-xs">
                                  {areaOfLife}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="bg-amber-100/60 font-bold border-t-2 border-amber-300 text-slate-900">
                            <td className="py-3.5 px-4 text-base font-serif">
                              {t.pointsTable.totalLabel}
                            </td>
                            <td className="py-3.5 px-4">-</td>
                            <td className="py-3.5 px-4">-</td>
                            <td className="py-3.5 px-4 text-center text-base">
                              {toLocalizedDigits(result.total_out_of, language)}
                            </td>
                            <td className="py-3.5 px-4 text-center text-base font-extrabold text-amber-900">
                              {toLocalizedDigits(result.total_received, language)}
                            </td>
                            <td className="py-3.5 px-4 text-xs font-medium text-amber-950">
                              {t.pointsTable.overallCompatibility}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Marriage Forecast Quick Teaser Banner */}
                  {result.forecast && (
                    <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50 via-amber-100/50 to-amber-50 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                      <div className="flex items-center gap-3.5 text-center sm:text-left">
                        <div className="size-11 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Heart className="size-5" />
                        </div>
                        <div>
                          <p className="font-serif font-bold text-amber-950 text-sm sm:text-base">
                            {t.forecastBannerTitle}
                          </p>
                          <p className="text-xs text-amber-800 mt-0.5">
                            {t.forecastBannerSubtitle(
                              result.forecast.auspicious_marriage_years.map((y) => toLocalizedDigits(y, language)).join(", "),
                              toLocalizedDigits(result.forecast.marital_harmony_score, language),
                              toLocalizedDigits(result.forecast.children_progeny_score, language)
                            )}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("forecast")}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                      >
                        <span>{t.viewFullForecastBtn}</span>
                        <ArrowRight className="size-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* =================================================================
                  TAB: DASHAKOOT (10 PORUTHAMS - SOUTH INDIAN METHOD)
                 ================================================================= */}
              {activeTab === "dashakoot" && result.dashakoot && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Summary Card */}
                  <div className="rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 via-amber-100/40 to-orange-50/50 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="size-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs">
                        {toLocalizedDigits(result.dashakoot.total_received, language)}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-amber-950 text-base">
                          {t.dashakootTitle}
                        </h4>
                        <p className="text-xs text-amber-900/80 mt-0.5">
                          {t.dashakootSummary(
                            toLocalizedDigits(result.dashakoot.total_received, language),
                            toLocalizedDigits(result.dashakoot.porutham_count, language)
                          )}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        result.dashakoot.is_favorable
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {result.dashakoot.is_favorable
                        ? t.dashakootFavorableBadge
                        : t.dashakootModerateBadge}
                    </span>
                  </div>

                  {/* 10 Poruthams Table matching Client Report page 15 */}
                  <div className="bg-white rounded-2xl border border-amber-200/80 shadow-xs overflow-hidden">
                    <div className="bg-amber-500/10 px-5 py-4 border-b border-amber-200/70">
                      <h3 className="font-serif font-bold text-amber-950 text-base sm:text-lg">
                        {t.dashakootTableTitle}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {t.dashakootTableSubtitle}
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-amber-50/70 border-b border-amber-200/70 text-slate-700 font-bold">
                            <th className="py-3 px-4">{t.attributeTh}</th>
                            <th className="py-3 px-4">{t.pointsTable.colMale}</th>
                            <th className="py-3 px-4">{t.pointsTable.colFemale}</th>
                            <th className="py-3 px-4 text-center">{t.pointsTable.colOutOf}</th>
                            <th className="py-3 px-4 text-center">{t.pointsTable.colReceived}</th>
                            <th className="py-3 px-4">{t.significanceTh}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {result.dashakoot.items.map((item, idx) => (
                            <tr
                              key={item.attribute}
                              className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"}
                            >
                              <td className="py-3 px-4 font-bold text-slate-900">{translateKootaAttribute(item.attribute, language)}</td>
                              <td className="py-3 px-4 text-slate-700">{translateKootaValue(item.attribute, item.male, language)}</td>
                              <td className="py-3 px-4 text-slate-700">{translateKootaValue(item.attribute, item.female, language)}</td>
                              <td className="py-3 px-4 text-center font-bold text-slate-600">
                                {toLocalizedDigits(item.out_of, language)}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                    item.received === item.out_of
                                      ? "bg-emerald-100 text-emerald-800"
                                      : item.received > 0
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-rose-100 text-rose-800"
                                  }`}
                                >
                                  {toLocalizedDigits(item.received, language)}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-600 text-xs">{translatePoruthamStatus(item.description, language)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-amber-100/60 font-bold border-t-2 border-amber-300 text-slate-900">
                            <td className="py-3.5 px-4 text-base font-serif">{t.pointsTable.totalLabel}</td>
                            <td className="py-3.5 px-4">-</td>
                            <td className="py-3.5 px-4">-</td>
                            <td className="py-3.5 px-4 text-center text-base">{toLocalizedDigits(36, language)}</td>
                            <td className="py-3.5 px-4 text-center text-base font-extrabold text-amber-900">
                              {toLocalizedDigits(result.dashakoot.total_received, language)}
                            </td>
                            <td className="py-3.5 px-4 text-xs font-medium text-amber-950">{result.dashakoot.verdict}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================================
                  TAB: DOSHA CANCELLATIONS & BHANGA ENGINE
                 ================================================================= */}
              {activeTab === "cancellations" && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Headline */}
                  <div className="rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50/60 p-5 shadow-xs">
                    <h3 className="font-serif font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                      <ShieldCheck className="size-5 text-emerald-600" />
                      <span>{t.cancellationsTitle}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {t.cancellationsSubtitle}
                    </p>
                  </div>

                  {/* Cancellations Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.cancellations?.map((c) => (
                      <div
                        key={c.dosha_name}
                        className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-xs space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif font-bold text-slate-900 text-base">{translateDoshaName(c.dosha_name, language)}</h4>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              !c.is_present
                                ? "bg-emerald-100 text-emerald-800"
                                : c.is_cancelled
                                ? "bg-teal-100 text-teal-800 border border-teal-300"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {!c.is_present
                              ? t.doshaFree
                              : c.is_cancelled
                              ? t.cancelledBhanga
                              : t.doshaPresent}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                          {c.cancellation_reason}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                          <span>
                            <strong>{t.shastraCitationLabel}</strong> {c.shastra_citation}
                          </span>
                          <span>
                            <strong>{t.severityLabel}</strong> {translateSeverity(c.severity, language)}
                          </span>
                        </div>

                        {c.remedy && c.remedy !== "No remedy required." && (
                          <div className="text-xs text-amber-900 bg-amber-100/40 p-2.5 rounded-lg border border-amber-200 flex items-start gap-2">
                            <Sparkles className="size-3.5 text-amber-700 shrink-0 mt-0.5" />
                            <span>
                              <strong>{t.remedyLabel}</strong> {c.remedy}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Manglik Detailed Factors Side-by-Side (Matching Client Report Page 9-10) */}
                  {result.manglik_detail && (
                    <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-xs space-y-4">
                      <h4 className="font-serif font-bold text-amber-950 text-base flex items-center gap-2">
                        <Flame className="size-4 text-orange-500" />
                        <span>{t.manglikAspectsTitle}</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="flex justify-between items-center font-bold text-slate-900 text-xs sm:text-sm pb-1 border-b border-slate-200">
                            <span>{result.groom.name} ({t.groomLabel})</span>
                            <span className="text-amber-800 font-serif">
                              {toLocalizedDigits(result.manglik_detail.groom_percentage, language)}% ({translateSeverity(result.manglik_detail.groom_severity, language)})
                            </span>
                          </div>
                          <ul className="text-xs text-slate-700 space-y-1">
                            {(result.manglik_detail.groom_factors || []).map((f: string, i: number) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-amber-500 font-bold">•</span>
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                          {result.manglik_detail.groom_cancellations?.length > 0 && (
                            <div className="mt-2 text-xs text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                              <strong>{t.relativesReliefLabel}</strong>{" "}
                              {result.manglik_detail.groom_cancellations.join("; ")}
                            </div>
                          )}
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="flex justify-between items-center font-bold text-slate-900 text-xs sm:text-sm pb-1 border-b border-slate-200">
                            <span>{result.bride.name} ({t.brideLabel})</span>
                            <span className="text-amber-800 font-serif">
                              {toLocalizedDigits(result.manglik_detail.bride_percentage, language)}% ({translateSeverity(result.manglik_detail.bride_severity, language)})
                            </span>
                          </div>
                          <ul className="text-xs text-slate-700 space-y-1">
                            {(result.manglik_detail.bride_factors || []).map((f: string, i: number) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-amber-500 font-bold">•</span>
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                          {result.manglik_detail.bride_cancellations?.length > 0 && (
                            <div className="mt-2 text-xs text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                              <strong>{t.relativesReliefLabel}</strong>{" "}
                              {result.manglik_detail.bride_cancellations.join("; ")}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* =================================================================
                  TAB: PAPASAMYA (MALEFIC BALANCING SCALE)
                 ================================================================= */}
              {activeTab === "papasamya" && result.papasamya && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Papasamya Meter Banner */}
                  <div className="rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50/60 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="size-12 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Scale className="size-6" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-slate-900 text-base">
                          {t.papasamyaTitle}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {t.papasamyaSubtitle(
                            toLocalizedDigits(result.papasamya.groom_score.total_points, language),
                            toLocalizedDigits(result.papasamya.bride_score.total_points, language),
                            toLocalizedDigits(result.papasamya.difference, language)
                          )}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        result.papasamya.is_balanced
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {result.papasamya.verdict}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-xs space-y-4">
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {result.papasamya.description}
                    </p>

                    {/* Side by side breakdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                        <div className="font-bold text-slate-900 text-sm flex justify-between border-b border-slate-200 pb-1">
                          <span>{result.groom.name} ({t.groomLabel})</span>
                          <span className="text-indigo-700 font-serif text-base">
                            {toLocalizedDigits(result.papasamya.groom_score.total_points, language)} pts
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center py-2">
                          <div className="bg-white p-2 rounded border border-slate-200">
                            <span className="text-slate-500 text-[10px] block">
                              {t.fromLagna}
                            </span>
                            <strong className="text-slate-800">{toLocalizedDigits(result.papasamya.groom_score.lagna_points, language)}</strong>
                          </div>
                          <div className="bg-white p-2 rounded border border-slate-200">
                            <span className="text-slate-500 text-[10px] block">
                              {t.fromMoon}
                            </span>
                            <strong className="text-slate-800">{toLocalizedDigits(result.papasamya.groom_score.moon_points, language)}</strong>
                          </div>
                          <div className="bg-white p-2 rounded border border-slate-200">
                            <span className="text-slate-500 text-[10px] block">
                              {t.fromVenus}
                            </span>
                            <strong className="text-slate-800">{toLocalizedDigits(result.papasamya.groom_score.venus_points, language)}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                        <div className="font-bold text-slate-900 text-sm flex justify-between border-b border-slate-200 pb-1">
                          <span>{result.bride.name} ({t.brideLabel})</span>
                          <span className="text-indigo-700 font-serif text-base">
                            {toLocalizedDigits(result.papasamya.bride_score.total_points, language)} pts
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center py-2">
                          <div className="bg-white p-2 rounded border border-slate-200">
                            <span className="text-slate-500 text-[10px] block">
                              {t.fromLagna}
                            </span>
                            <strong className="text-slate-800">{toLocalizedDigits(result.papasamya.bride_score.lagna_points, language)}</strong>
                          </div>
                          <div className="bg-white p-2 rounded border border-slate-200">
                            <span className="text-slate-500 text-[10px] block">
                              {t.fromMoon}
                            </span>
                            <strong className="text-slate-800">{toLocalizedDigits(result.papasamya.bride_score.moon_points, language)}</strong>
                          </div>
                          <div className="bg-white p-2 rounded border border-slate-200">
                            <span className="text-slate-500 text-[10px] block">
                              {t.fromVenus}
                            </span>
                            <strong className="text-slate-800">{toLocalizedDigits(result.papasamya.bride_score.venus_points, language)}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================================
                  TAB: AVAKAHADA & PANCHANG MATRIX (Matching Client Report Page 2)
                 ================================================================= */}
              {activeTab === "avakahada" && result.avakahada_comparison && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-white rounded-2xl border border-amber-200/80 shadow-xs overflow-hidden">
                    <div className="bg-amber-500/10 px-5 py-4 border-b border-amber-200/70">
                      <h3 className="font-serif font-bold text-amber-950 text-base sm:text-lg">
                        {t.avakahadaTableTitle}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {t.avakahadaTableSubtitle}
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-amber-50/70 border-b border-amber-200/70 text-slate-700 font-bold">
                            <th className="py-3 px-4">{t.pointsTable.colAttribute}</th>
                            <th className="py-3 px-4 text-center font-bold text-amber-900">
                              {result.groom.name} ({t.groomLabel})
                            </th>
                            <th className="py-3 px-4 text-center font-bold text-amber-900">
                              {result.bride.name} ({t.brideLabel})
                            </th>
                            <th className="py-3 px-4">{t.significanceTh}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {result.avakahada_comparison.map((item, idx) => (
                            <tr
                              key={item.attribute}
                              className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"}
                            >
                              <td className="py-2.5 px-4 font-bold text-slate-900">{translateAvakahadaAttr(item.attribute, language)}</td>
                              <td className="py-2.5 px-4 text-center text-slate-800 font-medium">{translateAvakahadaValue(item.attribute, item.male, language)}</td>
                              <td className="py-2.5 px-4 text-center text-slate-800 font-medium">{translateAvakahadaValue(item.attribute, item.female, language)}</td>
                              <td className="py-2.5 px-4 text-slate-500 text-xs">{item.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================================
                  TAB: PERSONALITY & TRAITS (Matching Client Report Page 21-22)
                 ================================================================= */}
              {activeTab === "personality" && result.personality && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Summary */}
                  <div className="rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50/60 p-5 shadow-xs">
                    <h4 className="font-serif font-bold text-slate-900 text-base">
                      {t.personalityTitle}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                      {result.personality.compatibility_summary}
                    </p>
                  </div>

                  {/* Traits cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Groom */}
                    <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-xs space-y-4">
                      <h4 className="font-serif font-bold text-amber-950 text-base border-b border-amber-100 pb-2">
                        {result.groom.name} ({t.groomLabel}) — {translateRashiName(result.groom.janam_rasi, language)}
                      </h4>
                      <p className="text-xs text-slate-600 italic">
                        {translatePersonalitySummary(result.personality.groom_summary, language)}
                      </p>

                      <div>
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide block mb-2">
                          {t.traitsPositiveTitle}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {result.personality.groom_positive_traits.map((tr) => (
                            <span
                              key={tr}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200"
                            >
                              {translatePersonalityTrait(tr, language)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-rose-800 uppercase tracking-wide block mb-2">
                          {t.traitsSensitiveTitle}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {result.personality.groom_negative_traits.map((tr) => (
                            <span
                              key={tr}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-200"
                            >
                              {translatePersonalityTrait(tr, language)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bride */}
                    <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-xs space-y-4">
                      <h4 className="font-serif font-bold text-amber-950 text-base border-b border-amber-100 pb-2">
                        {result.bride.name} ({t.brideLabel}) — {translateRashiName(result.bride.janam_rasi, language)}
                      </h4>
                      <p className="text-xs text-slate-600 italic">
                        {translatePersonalitySummary(result.personality.bride_summary, language)}
                      </p>

                      <div>
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide block mb-2">
                          {t.traitsPositiveTitle}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {result.personality.bride_positive_traits.map((tr) => (
                            <span
                              key={tr}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200"
                            >
                              {translatePersonalityTrait(tr, language)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-rose-800 uppercase tracking-wide block mb-2">
                          {t.traitsSensitiveTitle}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {result.personality.bride_negative_traits.map((tr) => (
                            <span
                              key={tr}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-200"
                            >
                              {translatePersonalityTrait(tr, language)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================================
                  TAB: MARRIAGE LIFE FORECAST & TIMING (7 Core Insights)
                 ================================================================= */}
              {activeTab === "forecast" && result.forecast && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Top Banner: Ideal Age & Auspicious Years */}
                  <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 p-5 sm:p-6 shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-amber-200/80">
                      <div>
                        <div className="inline-flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">
                          <Calendar className="size-4" />
                          <span>{t.jupiterTransitSubtitle}</span>
                        </div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-950">
                          {t.forecastAuspiciousTitle}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {result.forecast.auspicious_marriage_years.map((yr) => (
                          <span
                            key={yr}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-sm shadow-xs"
                          >
                            {toLocalizedDigits(yr, language)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                      {result.forecast.auspicious_marriage_years_text}
                    </p>

                    {/* Age Recommendations Row */}
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-amber-200/70">
                      <div className="rounded-xl bg-white/85 border border-amber-200/80 p-3.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          {t.idealMarriageAgeBoy}
                        </span>
                        <p className="mt-1 font-bold text-slate-900 text-xs sm:text-sm">
                          {result.forecast.ideal_marriage_age_groom}
                        </p>
                      </div>
                      <div className="rounded-xl bg-white/85 border border-amber-200/80 p-3.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          {t.idealMarriageAgeGirl}
                        </span>
                        <p className="mt-1 font-bold text-slate-900 text-xs sm:text-sm">
                          {result.forecast.ideal_marriage_age_bride}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 4 Core Life Dimension Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* 1. Marital Harmony */}
                    <div className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-xs">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                        <div className="flex items-center gap-2 text-rose-600">
                          <Heart className="size-5" />
                          <h4 className="font-serif font-bold text-slate-900 text-base">
                            {t.forecastHarmonyTitle}
                          </h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                          {toLocalizedDigits(result.forecast.marital_harmony_score, language)}%
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-800 block mb-1">
                        {result.forecast.marital_harmony_verdict}
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {result.forecast.marital_harmony_description}
                      </p>
                    </div>

                    {/* 2. Children & Progeny (Nadi Koota) */}
                    <div className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-xs">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                        <div className="flex items-center gap-2 text-indigo-600">
                          <Baby className="size-5" />
                          <h4 className="font-serif font-bold text-slate-900 text-base">
                            {t.forecastProgenyTitle}
                          </h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                          {toLocalizedDigits(result.forecast.children_progeny_score, language)}%
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-800 block mb-1">
                        {result.forecast.children_progeny_verdict}
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {result.forecast.children_progeny_description}
                      </p>
                    </div>

                    {/* 3. Conflict & Friction Control */}
                    <div className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-xs">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                        <div className="flex items-center gap-2 text-amber-600">
                          <Activity className="size-5" />
                          <h4 className="font-serif font-bold text-slate-900 text-base">
                            {t.forecastTemperamentTitle}
                          </h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {toLocalizedDigits(result.forecast.conflict_friction_score, language)}%
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-800 block mb-1">
                        {result.forecast.conflict_friction_verdict}
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {result.forecast.conflict_friction_description}
                      </p>
                    </div>

                    {/* 4. Financial Growth Post-Marriage (Bhakoot) */}
                    <div className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-xs">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                        <div className="flex items-center gap-2 text-emerald-600">
                          <Coins className="size-5" />
                          <h4 className="font-serif font-bold text-slate-900 text-base">
                            {t.forecastWealthTitle}
                          </h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {toLocalizedDigits(result.forecast.financial_prosperity_score, language)}%
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-800 block mb-1">
                        {result.forecast.financial_prosperity_verdict}
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {result.forecast.financial_prosperity_description}
                      </p>
                    </div>
                  </div>

                  {/* 5. Future & Longevity Card */}
                  <div className="rounded-2xl border border-amber-200/80 bg-white p-5 sm:p-6 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                      <div className="flex items-center gap-2 text-purple-700">
                        <TrendingUp className="size-5" />
                        <h4 className="font-serif font-bold text-slate-900 text-base sm:text-lg">
                          {t.forecastMutualTitle}
                        </h4>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-900 border border-purple-200">
                        {toLocalizedDigits(result.forecast.future_longevity_score, language)}%
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-800 block mb-1">
                      {result.forecast.future_longevity_verdict}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {result.forecast.future_longevity_description}
                    </p>
                  </div>

                  {/* 6. Vimshottari Dasha & Dasha Sandhi Comparison */}
                  {result.dasha_comparison && (
                    <div className="rounded-2xl border border-indigo-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-indigo-100">
                        <div className="flex items-center gap-2.5 text-indigo-900">
                          <Clock className="size-5 text-indigo-600" />
                          <div>
                            <h4 className="font-serif font-bold text-base sm:text-lg">
                              {t.dashaComparisonTitle}
                            </h4>
                            <p className="text-xs text-slate-500">
                              {t.dashaComparisonSubtitle}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${
                              result.dasha_comparison.dasha_sandhi_present
                                ? "bg-amber-100 text-amber-800 border-amber-300"
                                : "bg-emerald-100 text-emerald-800 border-emerald-300"
                            }`}
                          >
                            {result.dasha_comparison.dasha_sandhi_present
                              ? t.dashaSandhiPresentBadge
                              : t.dashaSandhiAbsentBadge}
                          </span>
                        </div>
                      </div>

                      {/* Current Dasha Comparison Columns */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Groom Dasha */}
                        <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-100 space-y-2">
                          <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block">
                            {result.groom.name} — {t.currentDashaTitle}
                          </span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-semibold text-slate-600">
                              {t.mahadashaLabel}
                            </span>
                            <span className="text-base font-bold text-slate-900">
                              {translatePlanetName(result.dasha_comparison.groom_dasha.current_mahadasha, language)}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-semibold text-slate-600">
                              {t.antardashaLabel}
                            </span>
                            <span className="text-xs font-bold text-slate-800">
                              {translatePlanetName(result.dasha_comparison.groom_dasha.current_antardasha, language)}
                            </span>
                          </div>
                          {result.dasha_comparison.groom_dasha.dasha_sequence && (
                            <div className="pt-2 flex flex-wrap gap-1.5">
                              {result.dasha_comparison.groom_dasha.dasha_sequence.slice(0, 3).map((p, idx) => (
                                <span
                                  key={idx}
                                  className="text-[11px] px-2 py-0.5 rounded-md font-medium border bg-white text-slate-600 border-slate-200"
                                >
                                  {translatePlanetName(p.planet, language)}: {toLocalizedDigits(p.start_date.split("-")[0], language)} - {toLocalizedDigits(p.end_date.split("-")[0], language)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Bride Dasha */}
                        <div className="p-4 rounded-xl bg-pink-50/40 border border-pink-100 space-y-2">
                          <span className="text-xs font-bold text-pink-900 uppercase tracking-wider block">
                            {result.bride.name} — {t.currentDashaTitle}
                          </span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-semibold text-slate-600">
                              {t.mahadashaLabel}
                            </span>
                            <span className="text-base font-bold text-slate-900">
                              {translatePlanetName(result.dasha_comparison.bride_dasha.current_mahadasha, language)}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-semibold text-slate-600">
                              {t.antardashaLabel}
                            </span>
                            <span className="text-xs font-bold text-slate-800">
                              {translatePlanetName(result.dasha_comparison.bride_dasha.current_antardasha, language)}
                            </span>
                          </div>
                          {result.dasha_comparison.bride_dasha.dasha_sequence && (
                            <div className="pt-2 flex flex-wrap gap-1.5">
                              {result.dasha_comparison.bride_dasha.dasha_sequence.slice(0, 3).map((p, idx) => (
                                <span
                                  key={idx}
                                  className="text-[11px] px-2 py-0.5 rounded-md font-medium border bg-white text-slate-600 border-slate-200"
                                >
                                  {translatePlanetName(p.planet, language)}: {toLocalizedDigits(p.start_date.split("-")[0], language)} - {toLocalizedDigits(p.end_date.split("-")[0], language)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Notes / Explanation */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                        <p className="font-semibold text-slate-900">
                          {result.dasha_comparison.dasha_compatibility_verdict}
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                          {result.dasha_comparison.dasha_compatibility_description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 7. Classical Vedic Remedies */}
                  <div className="rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/80 p-5 sm:p-6 shadow-xs">
                    <div className="flex items-center gap-2.5 text-amber-900 mb-3">
                      <ShieldCheck className="size-5 text-amber-600" />
                      <h4 className="font-serif font-bold text-base sm:text-lg">
                        {t.vedicRemediesTitle}
                      </h4>
                    </div>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                      {result.forecast.remedies_guidance.map((rem, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="size-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                          <span>{rem}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 pt-4 border-t border-amber-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <p className="text-xs text-slate-500">
                        {t.vedicRemediesNotice}
                      </p>
                      <Link
                        href="/astrologers"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors shrink-0 shadow-2xs"
                      >
                        <span>{t.talkAstrologerBtn}</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================================
                  TAB 2: PLANET DETAILS (Comparative Table)
                 ================================================================= */}
              {activeTab === "planets" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-white rounded-2xl border border-amber-200/80 shadow-xs overflow-hidden">
                    <div className="bg-amber-500/10 px-5 py-4 border-b border-amber-200/70">
                      <h3 className="font-serif font-bold text-amber-950 text-base sm:text-lg">
                        {t.planetsTableTitle}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {t.planetsTableSubtitle}
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-amber-50/70 border-b border-amber-200/70 text-slate-700 font-bold">
                            <th className="py-3 px-4">{t.planetTable.planet}</th>
                            <th className="py-3 px-4 text-amber-900">
                              {t.groomLabel} ({t.planetTable.sign})
                            </th>
                            <th className="py-3 px-4 text-amber-900">
                              {t.groomLabel} ({t.planetTable.nakshatra})
                            </th>
                            <th className="py-3 px-4 text-rose-900">
                              {t.brideLabel} ({t.planetTable.sign})
                            </th>
                            <th className="py-3 px-4 text-rose-900">
                              {t.brideLabel} ({t.planetTable.nakshatra})
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {result.groom.planets_table.map((gp, i) => {
                            const bp = result.bride.planets_table[i];
                            return (
                              <tr
                                key={gp.name}
                                className={`hover:bg-amber-50/40 transition-colors ${
                                  i % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                                }`}
                              >
                                <td className="py-3 px-4 font-semibold text-slate-900">
                                  {translatePlanetName(gp.name, language)}
                                </td>
                                <td className="py-3 px-4 text-slate-700 font-medium">
                                  {translateRashiName(gp.sign, language)}{" "}
                                  <span className="text-slate-400 text-xs">
                                    ({gp.longitude_formatted})
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-slate-700">
                                  {translateNakshatraName(gp.nakshatra, language)} ({t.padaLabel}:{" "}
                                  {toLocalizedDigits(gp.pada, language)})
                                </td>
                                <td className="py-3 px-4 text-slate-700 font-medium">
                                  {bp ? (
                                    <>
                                      {translateRashiName(bp.sign, language)}{" "}
                                      <span className="text-slate-400 text-xs">
                                        ({bp.longitude_formatted})
                                      </span>
                                    </>
                                  ) : (
                                    "-"
                                  )}
                                </td>
                                <td className="py-3 px-4 text-slate-700">
                                  {bp ? (
                                    <>
                                      {translateNakshatraName(bp.nakshatra, language)} ({t.padaLabel}:{" "}
                                      {toLocalizedDigits(bp.pada, language)})
                                    </>
                                  ) : (
                                    "-"
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================================
                  TAB 3: LAGNA CHARTS (Side-by-side D1 Charts)
                 ================================================================= */}
              {activeTab === "charts" && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Chart Selection Controls: Type & Style */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/80 rounded-2xl border border-amber-200/80 p-4 shadow-xs">
                    {/* Chart Type Selector */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                        {t.chartTypeLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedChartType("d1")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          selectedChartType === "d1"
                            ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-amber-50"
                        }`}
                      >
                        {t.chartTypeD1}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedChartType("d9")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          selectedChartType === "d9"
                            ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-amber-50"
                        }`}
                      >
                        {t.chartTypeD9}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedChartType("chalit")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          selectedChartType === "chalit"
                            ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-amber-50"
                        }`}
                      >
                        {t.chartTypeChalit}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedChartType("moon")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          selectedChartType === "moon"
                            ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-amber-50"
                        }`}
                      >
                        {t.chartTypeMoon}
                      </button>
                    </div>

                    {/* Chart Style Switcher (North, East, South) */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                        {t.chartStyleLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => setChartStyle("north")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                          chartStyle === "north"
                            ? "bg-slate-800 text-white border-slate-900 shadow-xs"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {t.charts.chartStyleNorth}
                      </button>
                      <button
                        type="button"
                        onClick={() => setChartStyle("east")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                          chartStyle === "east"
                            ? "bg-slate-800 text-white border-slate-900 shadow-xs"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {t.charts.chartStyleEast}
                      </button>
                      <button
                        type="button"
                        onClick={() => setChartStyle("south")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                          chartStyle === "south"
                            ? "bg-slate-800 text-white border-slate-900 shadow-xs"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {t.charts.chartStyleSouth}
                      </button>
                    </div>
                  </div>

                  {/* Informational Banner for the selected chart */}
                  <div className="rounded-xl bg-amber-50 border border-amber-200/80 px-4 py-3 flex items-center justify-between text-xs text-amber-900">
                    <p className="font-medium">
                      {selectedChartType === "d1"
                        ? t.chartD1Desc
                        : selectedChartType === "d9"
                        ? t.chartD9Desc
                        : selectedChartType === "chalit"
                        ? t.chartChalitDesc
                        : t.chartMoonDesc}
                    </p>
                  </div>

                  {/* Side-by-Side Comparative Charts */}
                  {(() => {
                    const groomPlanets =
                      selectedChartType === "d9"
                        ? result.groom_charts?.d9_planets || result.groom.d1_planets
                        : selectedChartType === "chalit"
                        ? result.groom_charts?.chalit_planets || result.groom.d1_planets
                        : selectedChartType === "moon"
                        ? result.groom_charts?.moon_chart_planets || result.groom.d1_planets
                        : result.groom_charts?.d1_planets || result.groom.d1_planets;

                    const groomAscSign =
                      selectedChartType === "d9"
                        ? result.groom_charts?.d9_asc_sign || result.groom.d1_asc_sign
                        : selectedChartType === "chalit"
                        ? result.groom_charts?.chalit_asc_sign || result.groom.d1_asc_sign
                        : selectedChartType === "moon"
                        ? result.groom_charts?.moon_chart_asc_sign || result.groom.d1_asc_sign
                        : result.groom_charts?.d1_asc_sign || result.groom.d1_asc_sign;

                    const bridePlanets =
                      selectedChartType === "d9"
                        ? result.bride_charts?.d9_planets || result.bride.d1_planets
                        : selectedChartType === "chalit"
                        ? result.bride_charts?.chalit_planets || result.bride.d1_planets
                        : selectedChartType === "moon"
                        ? result.bride_charts?.moon_chart_planets || result.bride.d1_planets
                        : result.bride_charts?.d1_planets || result.bride.d1_planets;

                    const brideAscSign =
                      selectedChartType === "d9"
                        ? result.bride_charts?.d9_asc_sign || result.bride.d1_asc_sign
                        : selectedChartType === "chalit"
                        ? result.bride_charts?.chalit_asc_sign || result.bride.d1_asc_sign
                        : selectedChartType === "moon"
                        ? result.bride_charts?.moon_chart_asc_sign || result.bride.d1_asc_sign
                        : result.bride_charts?.d1_asc_sign || result.bride.d1_asc_sign;

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Groom Chart */}
                        <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-xs text-center space-y-4">
                          <div>
                            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-0.5">
                              {t.groomChartSub}
                            </span>
                            <h4 className="font-serif font-bold text-slate-900 text-base">
                              {result.groom.name} —{" "}
                              {selectedChartType === "d1"
                                ? "D1 Lagna"
                                : selectedChartType === "d9"
                                ? "D9 Navamsha"
                                : selectedChartType === "chalit"
                                ? "Bhava Chalit"
                                : "Chandra Kundli"}
                            </h4>
                          </div>
                          <div className="flex justify-center">
                            <KundliDiamondChart
                              title={result.groom.name}
                              planets={groomPlanets}
                              ascSignNum={groomAscSign}
                              chartStyle={chartStyle}
                              className="max-w-[340px] sm:max-w-[380px]"
                            />
                          </div>
                        </div>

                        {/* Bride Chart */}
                        <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-xs text-center space-y-4">
                          <div>
                            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block mb-0.5">
                              {t.brideChartSub}
                            </span>
                            <h4 className="font-serif font-bold text-slate-900 text-base">
                              {result.bride.name} —{" "}
                              {selectedChartType === "d1"
                                ? "D1 Lagna"
                                : selectedChartType === "d9"
                                ? "D9 Navamsha"
                                : selectedChartType === "chalit"
                                ? "Bhava Chalit"
                                : "Chandra Kundli"}
                            </h4>
                          </div>
                          <div className="flex justify-center">
                            <KundliDiamondChart
                              title={result.bride.name}
                              planets={bridePlanets}
                              ascSignNum={brideAscSign}
                              chartStyle={chartStyle}
                              className="max-w-[340px] sm:max-w-[380px]"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* =========================================================================
                FLOATING ACTION BAR AT BOTTOM
               ========================================================================= */}
            <div className="sticky bottom-6 z-40 bg-white/95 backdrop-blur-md border border-amber-300 rounded-2xl shadow-xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  {t.pointsTable.totalLabel}:{" "}
                  <strong className="text-amber-800 text-base">
                    {toLocalizedDigits(result.total_received, language)} / 36
                  </strong>
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    result.is_compatible
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {result.is_compatible
                    ? t.floatingFavorable
                    : t.floatingCaution}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-all"
                >
                  <Download className="size-3.5" />
                  <span>{t.downloadPdfButton}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <RotateCcw className="size-3.5" />
                  <span>{t.recalculateButton}</span>
                </button>

                <Link
                  href="/astrologers"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all"
                >
                  <MessageCircle className="size-3.5" />
                  <span>{t.consultAstrologerBtn}</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <FeatureCoinModal
        open={coinModalOpen}
        onClose={() => setCoinModalOpen(false)}
        featureName={matchingFeature?.name || t.pageTitle}
        requiredCoins={matchingFeature?.coins ?? 20}
        walletBalance={walletBalance}
        reason={coinModalReason}
        language={language}
      />

      <SiteFooter />
    </div>
  );
}
