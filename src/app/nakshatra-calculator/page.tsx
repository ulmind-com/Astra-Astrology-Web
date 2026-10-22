"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Sliders,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Star,
  Globe,
  ArrowRight,
  User,
  Gem,
  Palette,
  Eye,
  RotateCcw,
  Languages,
  Compass,
  RefreshCw,
  Trees,
  Scroll,
  BookOpen,
  Award,
  ShieldAlert,
  Flame,
  Briefcase,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui";
import { astrologyApi } from "@/lib/api";
import {
  BirthPlaceField,
  type SelectedPlace,
} from "@/components/astrology/birth-place-field";
import { PanchangStrip } from "@/components/astrology/panchang-strip";
import { NakshatraTechniquesPanel } from "@/components/astrology/nakshatra-techniques-panel";
import { ClientRulesPanel } from "@/components/astrology/client-rules-panel";
import { CalculationDetails } from "@/components/astrology/calculation-details";
import { NakshatraWheel } from "@/components/astrology/nakshatra-wheel";
import { NAKSHATRA_UI_TEXTS } from "@/lib/nakshatra-translations";
import { useAuth } from "@/providers/auth-provider";
import { useProfile } from "@/hooks/use-profile";
import type {
  AstrologyLanguage,
  AyanamsaType,
  NakshatraCalculatePayload,
  NakshatraCalculateResult,
  UserProfile,
  UserPublic,
} from "@/types";

export default function NakshatraCalculatorPage() {
  const { user, isSignedIn } = useAuth();
  const { data: profile } = useProfile({ enabled: isSignedIn });

  // Language state: 'bn' (Bengali), 'en' (English), 'hi' (Hindi)
  const [language, setLanguage] = React.useState<AstrologyLanguage>("bn");
  const ui = NAKSHATRA_UI_TEXTS[language];

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
  // `selectedPlace` is the authoritative source for coordinates and timezone. It is
  // only ever set from a geocoded result, so a typed string can no longer be
  // submitted against the old Kolkata fallback.
  const [place, setPlace] = React.useState("");
  const [selectedPlace, setSelectedPlace] = React.useState<SelectedPlace | null>(null);
  const [placeTouched, setPlaceTouched] = React.useState(false);
  const [latitude, setLatitude] = React.useState<number | null>(null);
  const [longitude, setLongitude] = React.useState<number | null>(null);
  // Manual offset, used only when no place has been resolved.
  const [timezone, setTimezone] = React.useState("5.5");

  const handlePlaceSelected = React.useCallback((next: SelectedPlace | null) => {
    setSelectedPlace(next);
    if (!next) {
      setPlace("");
      setLatitude(null);
      setLongitude(null);
      return;
    }
    setPlace(next.place);
    setLatitude(next.latitude);
    setLongitude(next.longitude);
    if (next.timezoneOffset != null) setTimezone(String(next.timezoneOffset));
  }, []);
  const [ayanamsa, setAyanamsa] = React.useState<AyanamsaType>("lahiri");
  const [showAdvance, setShowAdvance] = React.useState(false);

  // Loading & Result
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<NakshatraCalculateResult | null>(null);

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
    if (isSignedIn && profile && !hasAutoFilled.current) {
      populateFromProfileData(profile, user);
      hasAutoFilled.current = true;
    } else if (user && !name && !hasAutoFilled.current) {
      setName(user.full_name || user.first_name || "");
    }
  }, [isSignedIn, profile, user, name, populateFromProfileData]);

  // Reset Form
  const handleResetForm = () => {
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
    toast.info(language === "bn" ? "ফর্ম খালি করা হয়েছে।" : language === "hi" ? "फ़ॉर्म साफ़ कर दिया गया है।" : "Form cleared.");
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

  // Input formatting & auto-advance navigation handlers
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
    if (val.length === 4 && hourRef.current) {
      hourRef.current.focus();
    }
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

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Mandatory Date of Birth validation
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (!day || isNaN(d) || d < 1 || d > 31) {
      toast.error(language === "bn" ? "সঠিক জন্ম দিন (১-৩১) লিখুন।" : language === "hi" ? "मान्य जन्म दिन (1-31) दर्ज करें।" : "Enter a valid birth day (1-31).");
      dayRef.current?.focus();
      return;
    }
    if (!month || isNaN(m) || m < 1 || m > 12) {
      toast.error(language === "bn" ? "সঠিক জন্ম মাস (১-১২) লিখুন।" : language === "hi" ? "मान्य जन्म माह (1-12) दर्ज करें।" : "Enter a valid birth month (1-12).");
      monthRef.current?.focus();
      return;
    }
    if (!year || isNaN(y) || y < 1800 || y > 2100) {
      toast.error(language === "bn" ? "সঠিক জন্ম বছর (১৮০০-২১০০) লিখুন।" : language === "hi" ? "मान्य जन्म वर्ष (1800-2100) दर्ज करें।" : "Enter a valid 4-digit birth year (1800-2100).");
      yearRef.current?.focus();
      return;
    }

    // 2. Optional Birth Time handling (defaulting to 12:00 PM if omitted)
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

    // 3. Location. A typed name is not enough: without a geocoded selection the
    // chart would silently fall back to Kolkata, which shifts the ascendant and
    // every house placement the nakshatra techniques are evaluated against.
    if (!selectedPlace && (latitude === null || longitude === null)) {
      setPlaceTouched(true);
      toast.error(
        language === "bn"
          ? "অনুগ্রহ করে তালিকা থেকে জন্মস্থান বেছে নিন — সঠিক লগ্ন ও সময়াঞ্চলের জন্য এটি প্রয়োজন"
          : language === "hi"
          ? "कृपया सूची से जन्म स्थान चुनें — सही लग्न एवं समय क्षेत्र हेतु यह आवश्यक है"
          : "Please choose your birth place from the list — the ascendant and timezone depend on it"
      );
      return;
    }

    const placeName = (selectedPlace?.place || place).trim();
    const lat = selectedPlace?.latitude ?? (latitude as number);
    const lon = selectedPlace?.longitude ?? (longitude as number);
    const tz = parseFloat(timezone) || 5.5;

    const payload: NakshatraCalculatePayload = {
      name: name.trim() || "Seeker",
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
      // The offset is a fallback only. With a zone name the backend resolves the
      // exact offset at the birth instant, covering daylight saving and history.
      timezone: tz,
      timezone_name: selectedPlace?.timezoneName ?? null,
      ayanamsa,
      language,
    };

    setLoading(true);
    try {
      const resp = await astrologyApi.calculateNakshatra(payload);
      setResult(resp);
      toast.success(
        language === "bn"
          ? `আপনার জন্ম নক্ষত্র: ${resp.nakshatra_name_bn} (পদ ${resp.pada})`
          : language === "hi"
          ? `आपका जन्म नक्षत्र: ${resp.nakshatra_name_hi} (पद ${resp.pada})`
          : `Calculated Birth Star: ${resp.nakshatra_name_en} (Pada ${resp.pada})`,
      );

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (err: any) {
      const msg = err?.message || "Failed to calculate Birth Star. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Switch language instantly without network round-trip using result translations
  const handleLanguageSwitch = (newLang: AstrologyLanguage) => {
    setLanguage(newLang);
    if (result && result.translations && result.translations[newLang]) {
      const t = result.translations[newLang];
      setResult((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          selected_language: newLang,
          symbol: t.symbol,
          deity: t.deity,
          sacred_tree: t.sacred_tree,
          current_namakshar: t.current_namakshar,
          avakahada: {
            ...prev.avakahada,
            gana: t.gana,
            yoni: t.yoni,
            yoni_animal: t.yoni,
            nadi: t.nadi,
            varna: t.varna,
            vashya: t.vashya,
            tatva: t.tatva,
            paya: t.paya,
          },
          traits: {
            ...prev.traits,
            overview: t.overview,
            strengths: t.strengths,
            cautions_and_pitfalls: t.cautions_and_pitfalls,
            beneficial_actions_and_remedies: t.beneficial_actions_and_remedies,
            career_fields: t.career_fields,
            lucky_color: t.lucky_color,
            lucky_gemstone: t.lucky_gemstone,
            ruling_deity: t.deity,
            symbol: t.symbol,
            sacred_tree: t.sacred_tree,
          },
        };
      });
    }
  };

  // Get active localized texts for result
  const activeStarName = result
    ? language === "bn"
      ? result.nakshatra_name_bn
      : language === "hi"
      ? result.nakshatra_name_hi
      : result.nakshatra_name_en
    : "";

  const activeRashiName = result
    ? language === "bn"
      ? result.rashi_name_bn
      : language === "hi"
      ? result.rashi_name_hi
      : result.rashi_name_en
    : "";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-brand-500/20">
      <SiteHeader />

      <main className="flex-1 pb-20">
        {/* Top Hero Section */}
        <section className="relative overflow-hidden py-14 md:py-20 border-b border-border/50 bg-gradient-to-b from-surface-muted/60 via-background to-background">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-brand-500/10 rounded-full blur-[130px]" />
            <div className="absolute top-1/3 left-1/4 w-[360px] h-[280px] bg-indigo-500/10 rounded-full blur-[100px]" />
            <div className="absolute top-1/3 right-1/4 w-[360px] h-[280px] bg-amber-500/10 rounded-full blur-[100px]" />
          </div>

          <div className="max-w-5xl mx-auto px-4 text-center">
            {/* Language Switcher Bar */}
            <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-surface-muted/80 border border-border/80 shadow-2xs mb-6 backdrop-blur-md">
              <span className="flex items-center gap-1 px-2.5 py-1 text-xs text-muted-foreground font-medium">
                <Languages className="size-3.5" />
                Language:
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
                  onClick={() => handleLanguageSwitch(lang.code)}
                  className={`px-3 py-1 text-xs rounded-full font-semibold transition-all duration-200 ${
                    language === lang.code
                      ? "bg-brand-500 text-white shadow-soft scale-102"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated/80"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-700 dark:text-brand-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-2xs">
              <Sparkles className="size-3.5 text-brand-500 animate-pulse" />
              <span>{ui.badge}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground max-w-3xl mx-auto leading-tight">
              {ui.title}
            </h1>

            <p className="mt-4 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {ui.subtitle}
            </p>
          </div>
        </section>

        {/* Calculator Form Section */}
        <section className="max-w-4xl mx-auto px-4 -mt-6">
          <div className="rounded-2xl border border-border/80 bg-surface-elevated/95 backdrop-blur-xl shadow-xl overflow-hidden">
            {/* Auto-fill banner if user is logged in */}
            {isSignedIn && profile && (
              <div className="px-5 py-3 bg-brand-500/10 border-b border-brand-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-brand-900 dark:text-brand-200 font-medium">
                  <CheckCircle2 className="size-4 text-brand-600 shrink-0" />
                  <span>{ui.syncProfileNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={handleReloadFromProfile}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-500/20 hover:bg-brand-500/30 text-brand-900 dark:text-brand-100 font-semibold transition-colors"
                >
                  <RefreshCw className="size-3" />
                  <span>{ui.syncProfileBtn}</span>
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Row 1: Name and Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                    {ui.nameLabel}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={ui.namePlaceholder}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface-muted/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all placeholder:text-muted-foreground/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                    {ui.genderLabel}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: "male", label: ui.genderMale },
                        { id: "female", label: ui.genderFemale },
                        { id: "other", label: ui.genderOther },
                      ] as const
                    ).map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setGender(g.id)}
                        className={`py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                          gender === g.id
                            ? "border-brand-500 bg-brand-500/15 text-brand-900 dark:text-brand-100 shadow-2xs"
                            : "border-border bg-surface-muted/30 text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 2: Date of Birth (Mandatory) & Time of Birth (Optional) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                {/* DOB with auto-advance */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-brand-500" />
                      <span>{ui.dobLabel}</span>
                      <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <span className="text-[11px] text-muted-foreground">{ui.dobNotice}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      ref={dayRef}
                      type="text"
                      inputMode="numeric"
                      value={day}
                      onChange={handleDayChange}
                      onKeyDown={(e) => handleKeyDown(e)}
                      placeholder={ui.dayPlaceholder}
                      maxLength={2}
                      className="text-center py-2.5 px-2 rounded-xl border border-border bg-surface-muted/50 text-foreground font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all placeholder:text-muted-foreground/60"
                    />
                    <input
                      ref={monthRef}
                      type="text"
                      inputMode="numeric"
                      value={month}
                      onChange={handleMonthChange}
                      onKeyDown={(e) => handleKeyDown(e, dayRef)}
                      placeholder={ui.monthPlaceholder}
                      maxLength={2}
                      className="text-center py-2.5 px-2 rounded-xl border border-border bg-surface-muted/50 text-foreground font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all placeholder:text-muted-foreground/60"
                    />
                    <input
                      ref={yearRef}
                      type="text"
                      inputMode="numeric"
                      value={year}
                      onChange={handleYearChange}
                      onKeyDown={(e) => handleKeyDown(e, monthRef)}
                      placeholder={ui.yearPlaceholder}
                      maxLength={4}
                      className="text-center py-2.5 px-2 rounded-xl border border-border bg-surface-muted/50 text-foreground font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all placeholder:text-muted-foreground/60"
                    />
                  </div>
                </div>

                {/* TOB (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="size-3.5 text-brand-500" />
                      <span>{ui.tobLabel}</span>
                    </label>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      {hour.trim() === "" ? (language === "bn" ? "ঐচ্ছিক — না দিলে ১২:০০ PM" : language === "hi" ? "वैकल्पिक — 12:00 PM" : "Optional — 12:00 PM") : ""}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <input
                      ref={hourRef}
                      type="text"
                      inputMode="numeric"
                      value={hour}
                      onChange={handleHourChange}
                      onKeyDown={(e) => handleKeyDown(e, yearRef)}
                      placeholder={ui.hourPlaceholder}
                      maxLength={2}
                      className="text-center py-2.5 px-2 rounded-xl border border-border bg-surface-muted/50 text-foreground font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all placeholder:text-muted-foreground/60"
                    />
                    <input
                      ref={minuteRef}
                      type="text"
                      inputMode="numeric"
                      value={minute}
                      onChange={handleMinuteChange}
                      onKeyDown={(e) => handleKeyDown(e, hourRef)}
                      placeholder={ui.minutePlaceholder}
                      maxLength={2}
                      className="text-center py-2.5 px-2 rounded-xl border border-border bg-surface-muted/50 text-foreground font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all placeholder:text-muted-foreground/60"
                    />
                    <input
                      ref={secondRef}
                      type="text"
                      inputMode="numeric"
                      value={second}
                      onChange={handleSecondChange}
                      onKeyDown={(e) => handleKeyDown(e, minuteRef)}
                      placeholder="SS"
                      maxLength={2}
                      className="text-center py-2.5 px-2 rounded-xl border border-border bg-surface-muted/50 text-foreground font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all placeholder:text-muted-foreground/60"
                    />
                    <button
                      type="button"
                      onClick={() => setPeriod(period === "AM" ? "PM" : "AM")}
                      className="py-2.5 px-2 rounded-xl border border-border bg-surface-muted/70 text-foreground font-bold text-xs hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                    >
                      {period}
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 3: Birth Place - geocoded inline, with its real timezone */}
              <div>
                <label
                  htmlFor="nakshatra-birth-place"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground"
                >
                  {ui.locationLabel} <span className="text-rose-500">*</span>
                </label>
                <BirthPlaceField
                  id="nakshatra-birth-place"
                  value={selectedPlace}
                  onChange={handlePlaceSelected}
                  birthDate={{
                    year: parseInt(year, 10) || undefined,
                    month: parseInt(month, 10) || undefined,
                    day: parseInt(day, 10) || undefined,
                  }}
                  language={language}
                  invalid={placeTouched}
                />
              </div>

              {/* Advanced Settings Accordion */}
              <div className="border border-border/70 rounded-xl overflow-hidden bg-surface-muted/20">
                <button
                  type="button"
                  onClick={() => setShowAdvance(!showAdvance)}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-surface-muted/40 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Sliders className="size-3.5 text-brand-500" />
                    Advanced Ephemeris & Ayanamsa Options
                  </span>
                  {showAdvance ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </button>

                {showAdvance && (
                  <div className="p-4 border-t border-border/70 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-muted/30">
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        {ui.ayanamsaLabel}
                      </label>
                      <select
                        value={ayanamsa}
                        onChange={(e) => setAyanamsa(e.target.value as AyanamsaType)}
                        className="w-full py-2 px-3 rounded-lg border border-border bg-surface-elevated text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                      >
                        <option value="lahiri">Lahiri (Chitra Paksha) - Standard Vedic Canonical</option>
                        <option value="krishnamurti">Krishnamurti (KP System)</option>
                        <option value="bv_raman">B.V. Raman</option>
                        <option value="yukteshwar">Sri Yukteshwar</option>
                        <option value="true_pushya">True Pushya (PVRN Rao)</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="nakshatra-timezone"
                        className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        {language === "bn"
                          ? "সময়াঞ্চল"
                          : language === "hi"
                          ? "समय क्षेत्र"
                          : "Timezone"}
                      </label>
                      {selectedPlace?.timezoneName ? (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-2">
                          <p className="flex flex-wrap items-center gap-x-1.5 text-[11px] font-bold text-emerald-900">
                            <span>{selectedPlace.timezoneName}</span>
                            {selectedPlace.timezoneLabel && (
                              <span className="rounded bg-white px-1 tabular-nums">
                                {selectedPlace.timezoneLabel}
                              </span>
                            )}
                          </p>
                          <p className="mt-0.5 text-[10px] leading-relaxed text-emerald-800/90">
                            {language === "bn"
                              ? "জন্মস্থান ও তারিখ অনুসারে নির্ণীত — ডেলাইট সেভিং ও ঐতিহাসিক পরিবর্তন সহ।"
                              : language === "hi"
                              ? "जन्म स्थान एवं तिथि अनुसार निर्धारित — डेलाइट सेविंग एवं ऐतिहासिक परिवर्तन सहित।"
                              : "Resolved from your birth place and date, daylight saving and historical changes included."}
                          </p>
                        </div>
                      ) : (
                        <input
                          id="nakshatra-timezone"
                          type="text"
                          inputMode="decimal"
                          value={timezone}
                          onChange={(e) =>
                            setTimezone(e.target.value.replace(/[^0-9.+-]/g, ""))
                          }
                          placeholder="5.5 (for IST)"
                          className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-xs tabular-nums text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-1 py-3 text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-soft hover:shadow-glow transition-all duration-200"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="size-4 animate-spin" />
                      {ui.calculating}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Star className="size-4 fill-amber-300 text-amber-300" />
                      {ui.calculateBtn}
                      <ArrowRight className="size-4" />
                    </span>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetForm}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold"
                >
                  <RotateCcw className="size-3.5 mr-1.5" />
                  {ui.resetBtn}
                </Button>
              </div>
            </form>
          </div>
        </section>

        {/* =================================================================== */}
        {/* Results Dashboard Section */}
        {/* =================================================================== */}
        {result && (
          <section ref={resultsRef} className="max-w-5xl mx-auto px-4 mt-14 space-y-8 animate-fade-in">
            {/* Grand Header Card */}
            <div className="relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-6 sm:p-10 shadow-2xl text-white">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
                    <Sparkles className="size-3 text-amber-400" />
                    <span>
                      {result.birth_date_formatted} • {result.birth_time_formatted} • {result.birth_place}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                    {activeStarName}
                    <span className="text-amber-400 ml-2 font-normal text-xl sm:text-2xl">
                      ({ui.padaLabel} {result.pada})
                    </span>
                  </h2>

                  <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl">
                    {language === "bn" ? (
                      <>
                        চন্দ্রের অবস্থান: <strong className="text-amber-300">{activeRashiName}</strong> রাশিতে{" "}
                        <strong className="text-amber-300">{result.moon_degree_in_nakshatra_formatted}</strong> ভোগাংশে।
                      </>
                    ) : language === "hi" ? (
                      <>
                        चंद्रमा की स्थिति: <strong className="text-amber-300">{activeRashiName}</strong> राशि में{" "}
                        <strong className="text-amber-300">{result.moon_degree_in_nakshatra_formatted}</strong> पर।
                      </>
                    ) : (
                      <>
                        Moon in <strong className="text-amber-300">{activeRashiName}</strong> sign at{" "}
                        <strong className="text-amber-300">{result.moon_degree_in_nakshatra_formatted}</strong> in star.
                      </>
                    )}
                  </p>
                </div>

                {/* Circular / Pill Metrics */}
                <div className="flex flex-wrap md:flex-col items-center md:items-end gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
                    <Star className="size-4 text-amber-400 fill-amber-400" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">{ui.starLordLabel}</div>
                      <div className="text-sm font-bold text-amber-300">{result.star_lord}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
                    <Compass className="size-4 text-indigo-400" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">{ui.kpSubLordLabel}</div>
                      <div className="text-sm font-bold text-indigo-200">{result.kp_sub_lord}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
                    <Sparkles className="size-4 text-emerald-400" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">{ui.elapsedLabel}</div>
                      <div className="text-sm font-bold text-emerald-300">{result.nakshatra_elapsed_percentage}%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bar of Star elapsed */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-medium">
                  <span>0° 00&apos; (Start)</span>
                  <span className="text-amber-300 font-bold">
                    {result.moon_degree_in_nakshatra_formatted} ({result.nakshatra_elapsed_percentage}%)
                  </span>
                  <span>13° 20&apos; (Full Star)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(251,191,36,0.5)]"
                    style={{ width: `${result.nakshatra_elapsed_percentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Sacred Identity Cards Grid */}
            <div>
              <h3 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="size-5 text-amber-500" />
                <span>{ui.sacredIdentityHeading}</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-border/80 bg-surface-elevated p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    <Star className="size-3.5 text-amber-500" />
                    <span>{ui.deityLabel}</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-foreground break-words leading-snug">
                    {result.traits.ruling_deity}
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-surface-elevated p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    <Scroll className="size-3.5 text-indigo-500" />
                    <span>{ui.symbolLabel}</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-foreground break-words leading-snug">
                    {result.traits.symbol}
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-surface-elevated p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    <Trees className="size-3.5 text-emerald-500" />
                    <span>{ui.sacredTreeLabel}</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-foreground break-words leading-snug">
                    {result.traits.sacred_tree}
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-surface-elevated p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    <Award className="size-3.5 text-amber-500" />
                    <span>{ui.currentNamaksharLabel}</span>
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold text-brand-600 dark:text-brand-400">
                    &ldquo;{result.current_namakshar}&rdquo;
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-surface-elevated p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    <Palette className="size-3.5 text-rose-500" />
                    <span>{ui.luckyColorLabel}</span>
                  </div>
                  <div className="text-sm font-semibold text-foreground break-words leading-snug">
                    {result.traits.lucky_color}
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-surface-elevated p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    <Gem className="size-3.5 text-teal-500" />
                    <span>{ui.luckyGemstoneLabel}</span>
                  </div>
                  <div className="text-sm font-semibold text-foreground break-words leading-snug">
                    {result.traits.lucky_gemstone}
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-surface-elevated p-4 shadow-sm col-span-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    <Flame className="size-3.5 text-amber-500" />
                    <span>{ui.beejMantraLabel}</span>
                  </div>
                  <div className="text-sm font-bold text-amber-700 dark:text-amber-300 break-words leading-snug">
                    {result.traits.beej_mantra}
                  </div>
                </div>
              </div>
            </div>

            {/* Panchang - the elements the client's reference report lists */}
            {result.panchang && (
              <PanchangStrip
                panchang={result.panchang}
                nakshatraName={
                  language === "bn"
                    ? result.nakshatra_name_bn
                    : language === "hi"
                      ? result.nakshatra_name_hi
                      : result.nakshatra_name_en
                }
                language={language}
              />
            )}

            {/* Avakahada Chakra Section */}
            <div className="rounded-3xl border border-border/80 bg-surface-elevated p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                    <Compass className="size-5 text-brand-500" />
                    <span>{ui.avakahadaHeading}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Vedic classifications for marriage compatibility (Ashtakoota) & core constitutional disposition
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-surface-muted/40 border border-border/60">
                  <div className="text-xs font-medium text-muted-foreground uppercase mb-1">{ui.ganaLabel}</div>
                  <div className="text-base font-bold text-foreground">{result.avakahada.gana}</div>
                </div>

                <div className="p-4 rounded-2xl bg-surface-muted/40 border border-border/60">
                  <div className="text-xs font-medium text-muted-foreground uppercase mb-1">{ui.yoniLabel}</div>
                  <div className="text-base font-bold text-foreground">{result.avakahada.yoni}</div>
                </div>

                <div className="p-4 rounded-2xl bg-surface-muted/40 border border-border/60">
                  <div className="text-xs font-medium text-muted-foreground uppercase mb-1">{ui.nadiLabel}</div>
                  <div className="text-base font-bold text-foreground">{result.avakahada.nadi}</div>
                </div>

                <div className="p-4 rounded-2xl bg-surface-muted/40 border border-border/60">
                  <div className="text-xs font-medium text-muted-foreground uppercase mb-1">{ui.varnaLabel}</div>
                  <div className="text-base font-bold text-foreground">{result.avakahada.varna}</div>
                </div>

                <div className="p-4 rounded-2xl bg-surface-muted/40 border border-border/60">
                  <div className="text-xs font-medium text-muted-foreground uppercase mb-1">{ui.vashyaLabel}</div>
                  <div className="text-base font-bold text-foreground">{result.avakahada.vashya}</div>
                </div>

                <div className="p-4 rounded-2xl bg-surface-muted/40 border border-border/60">
                  <div className="text-xs font-medium text-muted-foreground uppercase mb-1">{ui.tatvaLabel}</div>
                  <div className="text-base font-bold text-foreground">{result.avakahada.tatva}</div>
                </div>

                {/* Paya is the one Avakahada field that disagrees with the client's
                    own reference report, and no supplied document defines the rule.
                    It is still shown, but never as settled. */}
                <div
                  className={`col-span-2 rounded-2xl border p-4 ${
                    result.paya?.is_disputed
                      ? "border-amber-300 bg-amber-50"
                      : "border-border/60 bg-surface-muted/40"
                  }`}
                >
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium uppercase text-muted-foreground">
                      {ui.payaLabel}
                    </span>
                    {result.paya?.is_disputed && (
                      <span className="rounded-md bg-amber-200/70 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-900">
                        {language === "bn"
                          ? "অনিশ্চিত"
                          : language === "hi"
                          ? "अपुष्ट"
                          : "Unconfirmed"}
                      </span>
                    )}
                  </div>
                  <div className="break-words text-sm font-bold leading-snug text-amber-700 dark:text-amber-300">
                    {result.paya?.value ?? result.avakahada.paya}
                  </div>
                  {result.paya?.is_disputed && result.paya.notice && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-[11px] font-semibold text-amber-900">
                        {language === "bn"
                          ? "কেন অনিশ্চিত"
                          : language === "hi"
                          ? "क्यों अपुष्ट"
                          : "Why this is unconfirmed"}
                      </summary>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-amber-900/90">
                        {result.paya.notice}
                      </p>
                      {result.paya.evidence.length > 0 && (
                        <ul className="mt-1.5 space-y-0.5 border-t border-amber-200 pt-1.5">
                          {result.paya.evidence.map((item, index) => (
                            <li key={index} className="text-[10px] leading-relaxed text-amber-900/80">
                              • {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </details>
                  )}
                </div>
              </div>
            </div>

            {/* Auspicious Name Syllables Across 4 Padas */}
            <div className="rounded-3xl border border-border/80 bg-surface-elevated p-6 sm:p-8 shadow-sm">
              <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2 mb-1">
                <BookOpen className="size-5 text-indigo-500" />
                <span>{ui.padasHeading}</span>
              </h3>
              <p className="text-xs text-muted-foreground mb-6">{ui.padasSubheading}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {result.padas.map((p) => {
                  const isNative = p.is_native_pada;
                  return (
                    <div
                      key={p.pada}
                      className={`relative rounded-2xl p-5 border transition-all duration-300 ${
                        isNative
                          ? "border-amber-500 bg-amber-500/10 shadow-md ring-2 ring-amber-500/30 scale-102"
                          : "border-border/70 bg-surface-muted/30"
                      }`}
                    >
                      {isNative && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <Star className="size-2.5 fill-slate-950 text-slate-950" />
                          <span>{ui.nativePadaBadge}</span>
                        </div>
                      )}

                      <div className="text-center space-y-2">
                        <div className="text-xs font-semibold text-muted-foreground uppercase">
                          {ui.padaLabel} {p.pada}
                        </div>

                        <div className="text-3xl font-extrabold text-foreground tracking-tight">
                          &ldquo;{p.namakshar}&rdquo;
                        </div>

                        <div className="text-[11px] text-muted-foreground space-y-0.5 pt-1">
                          <div>
                            {language === "bn" ? p.rashi_name_bn : language === "hi" ? p.rashi_name_hi : p.rashi_name_en}
                          </div>
                          <div className="font-semibold text-indigo-600 dark:text-indigo-400">
                            {ui.navamshaSignLabel}: {p.navamsha_sign}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Personality Overview, Strengths, Cautions, Remedies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overview & Strengths */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-border/80 bg-surface-elevated p-6 shadow-sm">
                  <h4 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="size-4 text-brand-500" />
                    <span>{ui.overviewHeading}</span>
                  </h4>
                  <p className="text-sm text-foreground/90 leading-relaxed">{result.traits.overview}</p>
                </div>

                <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6 shadow-sm">
                  <h4 className="font-display text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-emerald-600" />
                    <span>{ui.strengthsHeading}</span>
                  </h4>
                  <ul className="space-y-2.5 text-sm text-foreground/90">
                    {result.traits.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="size-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                        <span className="leading-snug">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Cautions & Remedies */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 p-6 shadow-sm">
                  <h4 className="font-display text-lg font-bold text-rose-800 dark:text-rose-300 mb-3 flex items-center gap-2">
                    <AlertTriangle className="size-5 text-rose-600" />
                    <span>{ui.cautionsHeading}</span>
                  </h4>
                  <ul className="space-y-2.5 text-sm text-foreground/90">
                    {result.traits.cautions_and_pitfalls.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="size-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                        <span className="leading-snug">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-6 shadow-sm">
                  <h4 className="font-display text-lg font-bold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
                    <Heart className="size-5 text-amber-600" />
                    <span>{ui.remediesHeading}</span>
                  </h4>
                  <ul className="space-y-2.5 text-sm text-foreground/90">
                    {result.traits.beneficial_actions_and_remedies.map((r, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="size-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                        <span className="leading-snug">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Suitable Careers */}
            <div className="rounded-3xl border border-border/80 bg-surface-elevated p-6 sm:p-8 shadow-sm">
              <h4 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Briefcase className="size-5 text-brand-500" />
                <span>{ui.careerHeading}</span>
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {result.traits.career_fields.map((career, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-500/10 text-brand-900 dark:text-brand-200 border border-brand-500/20 shadow-2xs"
                  >
                    ✦ {career}
                  </span>
                ))}
              </div>
            </div>

            {/* Tarabala Chakra (9 Taras) */}
            <div className="rounded-3xl border border-border/80 bg-surface-elevated p-6 sm:p-8 shadow-sm">
              <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2 mb-1">
                <Star className="size-5 text-amber-500" />
                <span>{ui.tarabalaHeading}</span>
              </h3>
              <p className="text-xs text-muted-foreground mb-6">{ui.tarabalaSubheading}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.tarabala.map((t) => (
                  <div
                    key={t.tara_index}
                    className={`rounded-2xl p-4 border transition-all ${
                      t.is_auspicious
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-rose-500/30 bg-rose-500/5"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-foreground">
                        {language === "bn" ? t.tara_name_bn : language === "hi" ? t.tara_name_hi : t.tara_name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.is_auspicious
                            ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {t.is_auspicious ? ui.auspiciousBadge : ui.inauspiciousBadge}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      {t.significance}
                    </p>

                    <div className="pt-2 border-t border-border/40 text-[11px] font-semibold text-foreground/80">
                      <span className="text-muted-foreground font-normal">Stars: </span>
                      {t.nakshatras.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* The client's own nakshatra techniques, applied to this chart */}
            {result.client_rules && (
              <NakshatraTechniquesPanel rules={result.client_rules} language={language} />
            )}

            {/* Classifications for the Moon's rashi, from the client's 01.pdf */}
            {result.rashi_client_rules && (
              <ClientRulesPanel
                profile={result.rashi_client_rules}
                kpReference={undefined}
                language={language}
              />
            )}

            {/* 27 Cosmic Constellations Wheel Section */}
            <div className="rounded-3xl border border-border/80 bg-surface-elevated p-6 sm:p-10 shadow-sm text-center">
              <h3 className="font-display text-2xl font-extrabold text-foreground mb-2 flex items-center justify-center gap-2">
                <Globe className="size-6 text-brand-500" />
                <span>{ui.wheelHeading}</span>
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto mb-8">
                {ui.wheelSubheading}
              </p>

              <NakshatraWheel
                activeNakshatraIndex={result.nakshatra_index}
                activePada={result.pada}
                language={language}
              />
            </div>

            {/* How the chart was calculated - timezone provenance and caveats */}
            <CalculationDetails
              timezone={result.timezone_resolution}
              calculation={result.calculation}
              ayanamsaName={result.ayanamsa_name}
              houseSystem="Whole Sign"
              language={language}
            />
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
