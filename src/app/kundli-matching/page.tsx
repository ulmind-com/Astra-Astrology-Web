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
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { astrologyApi } from "@/lib/api";
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
  period: "AM" | "PM";
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
  second: "00",
  period: "AM",
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
  // Language State
  const [language, setLanguage] = React.useState<AstrologyLanguage>("bn");
  const t: KundliMatchingTranslations =
    KUNDLI_MATCHING_STRINGS[language] || KUNDLI_MATCHING_STRINGS.bn;

  // Stepper State: 1 = Groom, 2 = Bride
  const [step, setStep] = React.useState<1 | 2>(1);

  const defaultPlace: SelectedPlace = {
    place: "Kolkata",
    displayName: "Kolkata, WB, India",
    latitude: 22.5726,
    longitude: 88.3639,
    timezoneName: "Asia/Kolkata",
    timezoneOffset: 5.5,
    timezoneLabel: "UTC+05:30",
    timezoneAbbreviation: "IST",
    isDst: false,
  };

  // Forms State
  const [groom, setGroom] = React.useState<PersonFormState>({
    ...defaultPersonState,
    name: "Samiran Samanta",
    day: "22",
    month: "10",
    year: "1998",
    hour: "10",
    minute: "30",
    second: "00",
    period: "AM",
    place: "Kolkata, WB, India",
    selectedPlace: defaultPlace,
    latitude: 22.5726,
    longitude: 88.3639,
  });

  const [bride, setBride] = React.useState<PersonFormState>({
    ...defaultPersonState,
    name: "Arunima Banik",
    day: "15",
    month: "05",
    year: "2000",
    hour: "04",
    minute: "15",
    second: "00",
    period: "PM",
    place: "Kolkata, WB, India",
    selectedPlace: defaultPlace,
    latitude: 22.5726,
    longitude: 88.3639,
  });

  // Results & Tabs State
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<KundliMatchingResult | null>(null);
  const [activeTab, setActiveTab] = React.useState<"dosha" | "planets" | "charts">("dosha");
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
    if (!p.place.trim()) {
      toast.error(`${label}: ${t.form.validationPlace}`);
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
      const payload: KundliMatchingPayload = {
        groom: {
          name: groom.name.trim(),
          day: parseInt(groom.day, 10),
          month: parseInt(groom.month, 10),
          year: parseInt(groom.year, 10),
          hour: groom.hour ? parseInt(groom.hour, 10) : 12,
          minute: groom.minute ? parseInt(groom.minute, 10) : 0,
          second: groom.second ? parseInt(groom.second, 10) : 0,
          period: groom.period,
          place: groom.place,
          latitude: groom.latitude ?? 22.5726,
          longitude: groom.longitude ?? 88.3639,
          timezone: parseFloat(groom.timezone) || 5.5,
          ayanamsa: groom.ayanamsa,
          house_system: groom.houseSystem,
        },
        bride: {
          name: bride.name.trim(),
          day: parseInt(bride.day, 10),
          month: parseInt(bride.month, 10),
          year: parseInt(bride.year, 10),
          hour: bride.hour ? parseInt(bride.hour, 10) : 12,
          minute: bride.minute ? parseInt(bride.minute, 10) : 0,
          second: bride.second ? parseInt(bride.second, 10) : 0,
          period: bride.period,
          place: bride.place,
          latitude: bride.latitude ?? 22.5726,
          longitude: bride.longitude ?? 88.3639,
          timezone: parseFloat(bride.timezone) || 5.5,
          ayanamsa: bride.ayanamsa,
          house_system: bride.houseSystem,
        },
        language,
      };

      const res = await astrologyApi.calculateKundliMatching(payload);
      if (res) {
        setResult(res);
        toast.success(
          language === "bn"
            ? "কুন্ডলী মিলন গণনা সফলভাবে সম্পন্ন হয়েছে!"
            : language === "hi"
            ? "कुंडली मिलान सफलतापूर्वक पूरा हुआ!"
            : "Kundli matching calculated successfully!"
        );
        setTimeout(() => {
          document.getElementById("matching-results")?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    } catch (err: any) {
      console.error("Kundli Matching Error:", err);
      toast.error(
        err?.message ||
          (language === "bn"
            ? "কুন্ডলী মিলন গণনা করতে সমস্যা হয়েছে। তথ্য পরীক্ষা করুন।"
            : "Failed to calculate Kundli matching. Please check inputs.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setResult(null);
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
                <span>{t.step1Title}</span>
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
                  {t.form.tobLabel}
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
                <span>{t.step2Title}</span>
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
                  {t.form.tobLabel}
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
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all"
                >
                  <ArrowLeft className="size-4" />
                  <span>{t.backButton}</span>
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleCalculateMatch}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="size-4 animate-spin" />
                      <span>{language === "bn" ? "গণনা করা হচ্ছে..." : "Calculating..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.matchButton}</span>
                      <HeartHandshake className="size-4" />
                    </>
                  )}
                </button>
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
                    {result.groom.manglik_status_text}
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
                    <span className="font-medium text-slate-800">{result.groom.rasi_lord}</span>
                  </div>
                  <div className="px-5 py-2.5 flex justify-between">
                    <span className="text-slate-500">{t.janamNakshatra}</span>
                    <span className="font-semibold text-amber-900">
                      {translateNakshatraName(result.groom.janam_nakshatra, language)}
                    </span>
                  </div>
                  <div className="px-5 py-2.5 flex justify-between">
                    <span className="text-slate-500">{t.nakshatraLord}</span>
                    <span className="font-medium text-slate-800">{result.groom.nakshatra_lord}</span>
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
                    {result.bride.manglik_status_text}
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
                    <span className="font-medium text-slate-800">{result.bride.rasi_lord}</span>
                  </div>
                  <div className="px-5 py-2.5 flex justify-between">
                    <span className="text-slate-500">{t.janamNakshatra}</span>
                    <span className="font-semibold text-amber-900">
                      {translateNakshatraName(result.bride.janam_nakshatra, language)}
                    </span>
                  </div>
                  <div className="px-5 py-2.5 flex justify-between">
                    <span className="text-slate-500">{t.nakshatraLord}</span>
                    <span className="font-medium text-slate-800">{result.bride.nakshatra_lord}</span>
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
                      ? language === "bn"
                        ? "উভয়ের মধ্যে মাঙ্গলিক সামঞ্জস্য শুভ ও বিবাহযোগ্য।"
                        : "Manglik compatibility is favorable for this marriage."
                      : language === "bn"
                      ? "মাঙ্গলিক অসামঞ্জস্য রয়েছে, অভিজ্ঞ জ্যোতিষীর পরামর্শ বা শান্তি স্বস্ত্যয়ন প্রয়োজন।"
                      : "Manglik disparity detected; astrological consultation recommended."}
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
                      ? language === "bn"
                        ? "মাঙ্গলিক সামঞ্জস্য: হ্যাঁ"
                        : "Manglik Match: Yes"
                      : language === "bn"
                      ? "মাঙ্গলিক সামঞ্জস্য: না"
                      : "Manglik Match: No"}
                  </span>
                </span>
              </div>
            </div>

            {/* 4. THREE INTERACTIVE TABS (Dosha, Planet Details, Lagna Charts) */}
            <div className="space-y-6">
              {/* Tab Navigation Pill Bar matching screenshot */}
              <div className="flex border-b border-amber-200">
                <button
                  type="button"
                  onClick={() => setActiveTab("dosha")}
                  className={`py-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === "dosha"
                      ? "border-amber-500 text-amber-900 bg-amber-50/40"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <ShieldCheck className="size-4" />
                  <span>{t.tabs.dosha}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("planets")}
                  className={`py-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === "planets"
                      ? "border-amber-500 text-amber-900 bg-amber-50/40"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Sparkles className="size-4" />
                  <span>{t.tabs.planetDetails}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("charts")}
                  className={`py-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === "charts"
                      ? "border-amber-500 text-amber-900 bg-amber-50/40"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <RotateCcw className="size-4" />
                  <span>{t.tabs.lagnaCharts}</span>
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
                          ? language === "bn"
                            ? "শুভ মিলন"
                            : "Auspicious"
                          : language === "bn"
                          ? "অশুভ মিলন"
                          : "Inauspicious"}
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
                          ? language === "bn"
                            ? "দোষ মুক্ত"
                            : "Dosha Free"
                          : language === "bn"
                          ? "রজ্জু দোষ বিদ্যমান"
                          : "Dosha Present"}
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
                          ? language === "bn"
                            ? "দোষ মুক্ত"
                            : "Dosha Free"
                          : language === "bn"
                          ? "বেধ দোষ বিদ্যমান"
                          : "Dosha Present"}
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
                          ? language === "bn"
                            ? "অনুকূল"
                            : "Compatible"
                          : language === "bn"
                          ? "প্রতিকার সাপেক্ষ"
                          : "Remedy Needed"}
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
                          ? language === "bn"
                            ? "বিবাহের জন্য শুভ ও অনুকূল যোটক"
                            : "Favorable Alliance for Marriage"
                          : language === "bn"
                          ? "সতর্কতা ও জ্যোতিষীয় প্রতিকার পরামর্শিত"
                          : "Remedial Consultation Strongly Advised"}
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
                            const attrName = attrTrans?.name || k.attribute;
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
                                  {k.male}
                                </td>
                                <td className="py-3 px-4 text-slate-700 font-medium">
                                  {k.female}
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
                        {language === "bn"
                          ? "উভয়ের গ্রহ অবস্থান তুলনামূলক সারণী"
                          : "Comparative Planetary Positions"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {language === "bn"
                          ? "বর ও কনের গ্রহের নির্ভুল ডিগ্রি, রাশি ও নক্ষত্র অবস্থান"
                          : "High precision sidereal longitudes, signs and nakshatras for Groom & Bride"}
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
                                  {translateNakshatraName(gp.nakshatra, language)} (পাদ:{" "}
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
                                      {translateNakshatraName(bp.nakshatra, language)} (পাদ:{" "}
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
                  {/* Chart Style Switcher */}
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setChartStyle("north")}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        chartStyle === "north"
                          ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {t.charts.chartStyleNorth}
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartStyle("east")}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        chartStyle === "east"
                          ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {t.charts.chartStyleEast}
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartStyle("south")}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        chartStyle === "south"
                          ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {t.charts.chartStyleSouth}
                    </button>
                  </div>

                  {/* Side-by-Side D1 Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Groom Lagna Chart */}
                    <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-xs text-center space-y-4">
                      <h4 className="font-serif font-bold text-slate-900 text-base">
                        {t.charts.groomChartTitle}
                      </h4>
                      <div className="flex justify-center">
                        <KundliDiamondChart
                          title={result.groom.name}
                          planets={result.groom.d1_planets}
                          ascSignNum={result.groom.d1_asc_sign}
                          chartStyle={chartStyle}
                          className="max-w-[340px] sm:max-w-[380px]"
                        />
                      </div>
                    </div>

                    {/* Bride Lagna Chart */}
                    <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-xs text-center space-y-4">
                      <h4 className="font-serif font-bold text-slate-900 text-base">
                        {t.charts.brideChartTitle}
                      </h4>
                      <div className="flex justify-center">
                        <KundliDiamondChart
                          title={result.bride.name}
                          planets={result.bride.d1_planets}
                          ascSignNum={result.bride.d1_asc_sign}
                          chartStyle={chartStyle}
                          className="max-w-[340px] sm:max-w-[380px]"
                        />
                      </div>
                    </div>
                  </div>
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
                    ? language === "bn"
                      ? "অনুকূল যোটক"
                      : "Favorable Match"
                    : language === "bn"
                    ? "সতর্কতা প্রয়োজন"
                    : "Caution Needed"}
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
                  <span>
                    {language === "bn"
                      ? "জ্যোতিষীর পরামর্শ নিন"
                      : "Consult Astrologer"}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
