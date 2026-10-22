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
  ChevronLeft,
  ChevronRight,
  Sun,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  User,
  Compass,
  Download,
  MessageCircle,
  Lock,
  Edit,
  FilePlus,
  Flame,
  Star,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { astrologyApi } from "@/lib/api";
import { LocationPickerModal } from "@/components/astrology/location-picker-modal";
import { KundliDiamondChart } from "@/components/astrology/kundli-diamond-chart";
import { KPChartViewer } from "@/components/astrology/kp-chart-viewer";
import { useAuth } from "@/providers/auth-provider";
import { useProfile } from "@/hooks/use-profile";
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

  // Language state
  const [language, setLanguage] = React.useState<AstrologyLanguage>("bn");

  // Form State
  const [name, setName] = React.useState("Samiran Samanta");
  const [gender, setGender] = React.useState<"male" | "female" | "other">("male");

  // Mandatory DOB (DD-MM-YYYY)
  const [day, setDay] = React.useState("30");
  const [month, setMonth] = React.useState("06");
  const [year, setYear] = React.useState("2004");

  // Optional Time (HH:MM:SS AM/PM)
  const [hour, setHour] = React.useState("10");
  const [minute, setMinute] = React.useState("01");
  const [second, setSecond] = React.useState("28");
  const [period, setPeriod] = React.useState<"AM" | "PM">("AM");

  // Place & Coordinates
  const [place, setPlace] = React.useState("Kolaghat, West Bengal, India");
  const [latitude, setLatitude] = React.useState<number | null>(22.4333);
  const [longitude, setLongitude] = React.useState<number | null>(87.8500);
  const [timezone, setTimezone] = React.useState("5.5");
  const [ayanamsa, setAyanamsa] = React.useState<AyanamsaType>("lahiri");
  const [isMapModalOpen, setIsMapModalOpen] = React.useState(false);
  const [showAdvance, setShowAdvance] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);

  // Chart Style Selector: "north" | "east" | "south" | "wheel"
  const [chartStyle, setChartStyle] = React.useState<"north" | "east" | "south" | "wheel">("north");

  // Loading & Result
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<KundliCalculateResult | null>(null);

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

  // Initial auto calculation for sample demonstration
  React.useEffect(() => {
    if (!result) {
      runCalculation();
    }
  }, []);

  const runCalculation = async () => {
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (!day || isNaN(d) || d < 1 || d > 31) return;
    if (!month || isNaN(m) || m < 1 || m > 12) return;
    if (!year || isNaN(y) || y < 1800 || y > 2100) return;

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

    const payload: KundliCalculatePayload = {
      name: name.trim() || "Samiran Samanta",
      gender,
      day: d,
      month: m,
      year: y,
      hour: parsedHour,
      minute: parsedMinute,
      second: parsedSecond,
      period: effectivePeriod,
      place: place.trim() || "Kolaghat, West Bengal, India",
      latitude: latitude !== null ? latitude : 22.4333,
      longitude: longitude !== null ? longitude : 87.8500,
      timezone: parseFloat(timezone) || 5.5,
      ayanamsa,
      language,
    };

    setLoading(true);
    try {
      const resp = await astrologyApi.calculateKundli(payload);
      setResult(resp);
    } catch (err: any) {
      console.error("Kundli calculation error:", err);
      toast.error(err?.message || "Failed to calculate Kundli.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await runCalculation();
    toast.success(
      language === "bn"
        ? "কুন্ডলী ও গ্রহের অবস্থান নির্ভুল গণনা সম্পন্ন হয়েছে!"
        : "Kundli & Planetary Position calculated successfully!",
    );
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
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

        {/* Profile Card matching Screenshot 1 with Astra Calm Glow Theme */}
        <div className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-soft text-center space-y-4">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
            {language === "bn" ? "প্রোফাইল" : "Profile"}
          </h2>
          <GoldDiamondDivider />

          {/* Rashi Graphic Symbol Box */}
          <div className="mx-auto size-24 rounded-2xl border-2 border-amber-300 bg-amber-50/80 flex items-center justify-center p-2 shadow-xs">
            <span className="text-5xl select-none" role="img" aria-label="Scorpio">
              🦂
            </span>
          </div>

          <div>
            <span className="inline-block rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs px-4 py-1.5 shadow-2xs">
              {isSignedIn ? user?.full_name || name : name}
            </span>
          </div>

          {/* Profile Action Buttons */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 px-4 py-2 text-xs font-bold text-amber-950 transition-colors shadow-2xs"
            >
              <FilePlus className="size-4 text-amber-600" />
              <span>{language === "bn" ? "নতুন কুন্ডলী তৈরি করুন" : "Create New Kundli"}</span>
            </button>

            <button
              type="button"
              onClick={() => toast.success("Kundli saved to your profile!")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 px-4 py-2 text-xs font-bold text-amber-950 transition-colors shadow-2xs"
            >
              <Lock className="size-4 text-amber-600" />
              <span>{language === "bn" ? "কুন্ডলী সংরক্ষণ করুন" : "Save Kundli"}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 px-4 py-2 text-xs font-bold text-amber-950 transition-colors shadow-2xs"
            >
              <Edit className="size-4 text-amber-600" />
              <span>{language === "bn" ? "বিবরণ পরিবর্তন করুন" : "Edit Details"}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Birth Input Form matching Image 2 */}
        {showForm && (
          <div className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-soft animate-in fade-in duration-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-amber-100">
              <h3 className="font-display text-xl font-bold text-foreground">
                {language === "bn" ? "আপনার জন্ম বিবরণ প্রবেশ করান" : "Enter Your Birth Details"}
              </h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-xs font-bold text-foreground-muted hover:text-foreground"
              >
                ✕ {language === "bn" ? "বন্ধ করুন" : "Close"}
              </button>
            </div>

            {/* Profile greeting banner matching Image 2 */}
            <div className="rounded-2xl border border-amber-300/80 bg-amber-50/70 p-3 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">✓</span>
                <span>
                  {language === "bn"
                    ? `স্বাগত, ${name}! আপনার প্রোফাইলের তথ্য লোড করা হয়েছে।`
                    : `Welcome, ${name}! Profile details have been loaded.`}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (profile) populateFromProfileData(profile, user);
                  }}
                  className="rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-[11px] font-bold text-amber-950 hover:bg-amber-50 transition-colors"
                >
                  🔄 {language === "bn" ? "রিলোড" : "Reload"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName("");
                    setDay("");
                    setMonth("");
                    setYear("");
                    setHour("");
                    setMinute("");
                    setSecond("");
                    setPlace("");
                  }}
                  className="rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-[11px] font-bold text-red-700 hover:bg-red-50 transition-colors"
                >
                  ↺ {language === "bn" ? "খালি করুন" : "Clear"}
                </button>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <User className="size-3.5 text-amber-600" />
                    <span>{language === "bn" ? "নাম" : "Full Name"}</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3 py-2 text-sm text-foreground focus:border-amber-500 focus:outline-none shadow-2xs"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    {language === "bn" ? "লিঙ্গ" : "Gender"}
                  </label>
                  <div className="grid grid-cols-3 gap-1 rounded-xl bg-amber-50/40 p-1 border border-amber-200">
                    {(["male", "female", "other"] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`rounded-lg py-1.5 text-xs font-bold capitalize transition-all ${
                          gender === g ? "bg-amber-500 text-white shadow-2xs" : "text-foreground-muted hover:text-foreground"
                        }`}
                      >
                        {g === "male" ? (language === "bn" ? "পুরুষ" : "Male") : g === "female" ? (language === "bn" ? "মহিলা" : "Female") : (language === "bn" ? "অন্যান্য" : "Other")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-amber-600" />
                    <span>{language === "bn" ? "জন্মতারিখ *" : "Date of Birth *"}</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <input
                      ref={dayRef}
                      type="text"
                      placeholder="DD"
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-2 py-2 text-center text-sm font-semibold text-foreground focus:border-amber-500 focus:outline-none shadow-2xs"
                    />
                    <input
                      ref={monthRef}
                      type="text"
                      placeholder="MM"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-2 py-2 text-center text-sm font-semibold text-foreground focus:border-amber-500 focus:outline-none shadow-2xs"
                    />
                    <input
                      ref={yearRef}
                      type="text"
                      placeholder="YYYY"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-2 py-2 text-center text-sm font-semibold text-foreground focus:border-amber-500 focus:outline-none shadow-2xs"
                    />
                  </div>
                </div>

                {/* Time of Birth */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Clock className="size-3.5 text-amber-600" />
                    <span>{language === "bn" ? "জন্মসময় (ঐচ্ছিক)" : "Birth Time (Optional)"}</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    <input
                      ref={hourRef}
                      type="text"
                      placeholder="HH"
                      value={hour}
                      onChange={(e) => setHour(e.target.value)}
                      className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-1 py-2 text-center text-sm font-semibold text-foreground focus:border-amber-500 focus:outline-none shadow-2xs"
                    />
                    <input
                      ref={minuteRef}
                      type="text"
                      placeholder="MM"
                      value={minute}
                      onChange={(e) => setMinute(e.target.value)}
                      className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-1 py-2 text-center text-sm font-semibold text-foreground focus:border-amber-500 focus:outline-none shadow-2xs"
                    />
                    <input
                      ref={secondRef}
                      type="text"
                      placeholder="SS"
                      value={second}
                      onChange={(e) => setSecond(e.target.value)}
                      className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-1 py-2 text-center text-sm font-semibold text-foreground focus:border-amber-500 focus:outline-none shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setPeriod((p) => (p === "AM" ? "PM" : "AM"))}
                      className="w-full rounded-xl border border-amber-200 bg-amber-100/90 font-bold text-xs text-amber-950 hover:bg-amber-200 transition-colors"
                    >
                      {period}
                    </button>
                  </div>
                </div>

                {/* Place */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-amber-600" />
                    <span>{language === "bn" ? "জন্মস্থান *" : "Birth Place *"}</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      placeholder="শহর বা গ্রামের নাম লিখুন..."
                      className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3 py-2 text-sm text-foreground focus:border-amber-500 focus:outline-none shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setIsMapModalOpen(true)}
                      className="shrink-0 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-950 hover:bg-amber-100 transition-colors"
                    >
                      ম্যাপ নির্বাচন
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 rounded-xl bg-brand-400 hover:bg-brand-500 text-ink-900 font-bold shadow-glow text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="size-4" />
                  <span>{loading ? "গণনা করা হচ্ছে..." : "কুন্ডলী গণনা করুন"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-amber-200 bg-surface px-4 py-3 text-xs font-semibold text-foreground-muted hover:text-foreground"
                >
                  বন্ধ করুন
                </button>
              </div>
            </form>
          </div>
        )}

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

        {/* ─────────────────────────────────────────────────────────────
            SECTION 2: Kundli Details & Chart (Screenshot 2)
        ───────────────────────────────────────────────────────────── */}
        {result && (
          <div ref={resultsRef} className="space-y-8">
            <div className="text-center space-y-1">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {language === "bn" ? "কুন্ডলী বিবরণ ও চার্ট" : "Kundli Details & Chart"}
              </h2>
              <GoldDiamondDivider />
            </div>

            {/* 4 Side-by-side Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: PERSONAL DETAILS */}
              <div className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-soft space-y-3">
                <div className="rounded-xl bg-amber-100/90 border border-amber-300/70 px-3 py-1.5 text-center font-display text-xs font-bold uppercase tracking-wider text-amber-950">
                  PERSONAL DETAILS
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Name
                    </span>
                    <span className="font-bold text-foreground truncate max-w-[120px]">
                      {result.personal_details.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Gender
                    </span>
                    <span className="font-bold text-foreground">{result.personal_details.gender}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Date of Birth
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {result.personal_details.date_of_birth}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Time of Birth
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {result.personal_details.time_of_birth}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Day
                    </span>
                    <span className="font-bold text-foreground">{result.personal_details.day}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Vedic Day
                    </span>
                    <span className="font-bold text-foreground">{result.personal_details.vedic_day}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: ASTRONOMICAL INFO */}
              <div className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-soft space-y-3">
                <div className="rounded-xl bg-amber-100/90 border border-amber-300/70 px-3 py-1.5 text-center font-display text-xs font-bold uppercase tracking-wider text-amber-950">
                  ASTRONOMICAL INFO
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Julian Day
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {result.astronomical_info.julian_day}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Ayan Type
                    </span>
                    <span className="font-bold text-foreground">{result.astronomical_info.ayan_type}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> House
                    </span>
                    <span className="font-bold text-foreground">{result.astronomical_info.house_system}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Place
                    </span>
                    <span className="font-bold text-foreground truncate max-w-[120px]" title={result.astronomical_info.place}>
                      {result.astronomical_info.place}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Longitude
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {result.astronomical_info.longitude_formatted}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Latitude
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {result.astronomical_info.latitude_formatted}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: ASTRO POSITIONS */}
              <div className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-soft space-y-3">
                <div className="rounded-xl bg-amber-100/90 border border-amber-300/70 px-3 py-1.5 text-center font-display text-xs font-bold uppercase tracking-wider text-amber-950">
                  ASTRO POSITIONS
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Asc Lord
                    </span>
                    <span className="font-bold text-foreground">{result.astro_positions.asc_lord}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Asc
                    </span>
                    <span className="font-bold text-foreground">{result.astro_positions.asc}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Yoga
                    </span>
                    <span className="font-bold text-foreground">{result.astro_positions.yoga}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Tithi
                    </span>
                    <span className="font-bold text-foreground">{result.astro_positions.tithi}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Sunset
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {result.astro_positions.sunset}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Sunrise
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {result.astro_positions.sunrise}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 4: PLANETARY INFO */}
              <div className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-soft space-y-3">
                <div className="rounded-xl bg-amber-100/90 border border-amber-300/70 px-3 py-1.5 text-center font-display text-xs font-bold uppercase tracking-wider text-amber-950">
                  PLANETARY INFO
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Bal. Dasa
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {result.planetary_info.bal_dasa}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Karan
                    </span>
                    <span className="font-bold text-foreground">{result.planetary_info.karan}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Nakshatra Lord
                    </span>
                    <span className="font-bold text-foreground">
                      {result.planetary_info.nakshatra_lord}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Nakshatra
                    </span>
                    <span className="font-bold text-foreground">{result.planetary_info.nakshatra}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Rasi Lord
                    </span>
                    <span className="font-bold text-foreground">{result.planetary_info.rasi_lord}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> Rasi
                    </span>
                    <span className="font-bold text-foreground">{result.planetary_info.rasi}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Style Switcher */}
            <div className="text-center space-y-3 pt-2">
              <h3 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                {language === "bn" ? "চার্ট শৈলী নির্বাচন করুন" : "Choose Chart Style"}
              </h3>
              <GoldDiamondDivider />

              <div className="inline-flex rounded-xl bg-amber-50 p-1 border border-amber-300">
                {(
                  [
                    { key: "north", label: "North" },
                    { key: "east", label: "East" },
                    { key: "south", label: "South" },
                    { key: "wheel", label: "AppliedJyotish" },
                  ] as const
                ).map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setChartStyle(s.key)}
                    className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
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

            {/* Side-by-side Charts: Lagna Chart (D1) and Navamsa Chart (D9) */}
            <div ref={d9Ref} className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-soft">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
                {/* 1. Lagna Chart (D1) */}
                <div className="w-full flex flex-col items-center">
                  <KundliDiamondChart
                    title="Lagna Chart (D1)"
                    planets={result.d1_planets}
                    ascSignNum={result.d1_asc_sign}
                    isNavamsa={false}
                    chartStyle={chartStyle}
                  />
                </div>

                {/* 2. Navamsa Chart (D9) */}
                <div className="w-full flex flex-col items-center">
                  <KundliDiamondChart
                    title="Navamsa Chart (D9)"
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
                  {language === "bn" ? "গ্রহের অবস্থান" : "Planet Positions"}
                </h3>
                <GoldDiamondDivider />
              </div>

              <div className="overflow-x-auto rounded-2xl border border-amber-200/80">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-amber-100/90 text-amber-950 font-bold border-b border-amber-300">
                      <th className="py-3 px-4 font-bold text-center">Planet</th>
                      <th className="py-3 px-4 font-bold text-center">Longitude</th>
                      <th className="py-3 px-4 font-bold text-center">Nakshatra</th>
                      <th className="py-3 px-4 font-bold text-center">Nakshatra Lord</th>
                      <th className="py-3 px-4 font-bold text-center">Padma</th>
                      <th className="py-3 px-4 font-bold text-center">Sub Lord</th>
                      <th className="py-3 px-4 font-bold text-center">Full Degree</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100/80 bg-white">
                    {result.planets_table.map((row, idx) => (
                      <tr
                        key={`planet-row-${idx}`}
                        className="hover:bg-amber-50/60 transition-colors"
                      >
                        <td className="py-3 px-4 text-center font-bold text-foreground">
                          {row.name}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-foreground tabular-nums">
                          {row.longitude_formatted}
                        </td>
                        <td className="py-3 px-4 text-center text-foreground-muted">
                          {row.nakshatra}
                        </td>
                        <td className="py-3 px-4 text-center text-foreground-muted">
                          {row.nakshatra_lord}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-amber-800 tabular-nums">
                          {row.pada}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-foreground">
                          {row.sub_lord}
                        </td>
                        <td className="py-3 px-4 text-center text-foreground-muted tabular-nums">
                          {row.full_degree_formatted}
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
                  {language === "bn" ? "ভাব বিবরণ" : "House Positions"}
                </h3>
                <GoldDiamondDivider />
              </div>

              <div className="overflow-x-auto rounded-2xl border border-amber-200/80">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-amber-100/90 text-amber-950 font-bold border-b border-amber-300">
                      <th className="py-3 px-4 font-bold text-center">House</th>
                      <th className="py-3 px-4 font-bold text-center">Longitude</th>
                      <th className="py-3 px-4 font-bold text-center">Nakshatra</th>
                      <th className="py-3 px-4 font-bold text-center">Nakshatra Lord</th>
                      <th className="py-3 px-4 font-bold text-center">Padma</th>
                      <th className="py-3 px-4 font-bold text-center">Sub Lord</th>
                      <th className="py-3 px-4 font-bold text-center">Full Degree</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100/80 bg-white">
                    {result.houses_table.map((row, idx) => (
                      <tr
                        key={`house-row-${idx}`}
                        className="hover:bg-amber-50/60 transition-colors"
                      >
                        <td className="py-3 px-4 text-center font-bold text-foreground">
                          {row.name}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-foreground tabular-nums">
                          {row.longitude_formatted}
                        </td>
                        <td className="py-3 px-4 text-center text-foreground-muted">
                          {row.nakshatra}
                        </td>
                        <td className="py-3 px-4 text-center text-foreground-muted">
                          {row.nakshatra_lord}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-amber-800 tabular-nums">
                          {row.pada}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-foreground">
                          {row.sub_lord}
                        </td>
                        <td className="py-3 px-4 text-center text-foreground-muted tabular-nums">
                          {row.full_degree_formatted}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                SECTION 4: Vimshottari Dasha 3x3 Grid (Screenshot 4)
            ───────────────────────────────────────────────────────────── */}
            <div className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-soft space-y-6">
              <div className="text-center space-y-1">
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                  {language === "bn" ? "বিংশোত্তরী দশা" : "Vimshottari Dasha"}
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
                        {card.title}
                      </h4>

                      <div className="mt-3 overflow-x-auto">
                        <table className="w-full text-[11px] text-left">
                          <thead>
                            <tr className="bg-amber-100/80 text-amber-950 font-bold">
                              <th className="py-1.5 px-2 font-bold">Antar Dasha</th>
                              <th className="py-1.5 px-2 font-bold text-center">Duration</th>
                              <th className="py-1.5 px-2 font-bold text-center">End Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-amber-100/60 bg-white/70">
                            {card.antardashas.map((ant, aIdx) => (
                              <tr key={`ant-${cIdx}-${aIdx}`} className="hover:bg-amber-50/60">
                                <td className="py-1.5 px-2 font-bold text-foreground flex items-center gap-1">
                                  <span>{ant.lord}</span>
                                  {ant.duration !== "-" && (
                                    <span className="text-amber-600 text-[9px]">➔</span>
                                  )}
                                </td>
                                <td className="py-1.5 px-2 text-center text-foreground-muted tabular-nums">
                                  {ant.duration}
                                </td>
                                <td className="py-1.5 px-2 text-center text-foreground-muted tabular-nums">
                                  {ant.end_date}
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
                  {language === "bn" ? "বর্গ কুন্ডলী (Divisional Charts)" : "Divisional Charts"}
                </h3>
                <GoldDiamondDivider />

                <div className="inline-flex rounded-xl bg-amber-50 p-1 border border-amber-300 my-2">
                  {(["North", "South", "East"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="rounded-lg px-4 py-1 text-xs font-bold bg-amber-500 text-white shadow-2xs"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Large Rasi Chart (D1) */}
              <div className="flex flex-col items-center">
                <KundliDiamondChart
                  title="RASI CHART (D1)"
                  planets={result.d1_planets}
                  ascSignNum={result.d1_asc_sign}
                  isNavamsa={false}
                  chartStyle={chartStyle}
                  className="max-w-lg w-full"
                />
              </div>
            </div>

            {/* Yoga Section matching Screenshot 5 */}
            <div ref={yogaRef} className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-soft space-y-6">
              <div className="text-center space-y-1">
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                  {language === "bn" ? "বৈদিক যোগ ও দোষ বিশ্লেষণ" : "Yoga Analysis"}
                </h3>
                <GoldDiamondDivider />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Left Column: Kundli Yoga Status List */}
                <div className="space-y-3">
                  <div className="rounded-xl bg-amber-500 px-4 py-2.5 text-center font-bold text-xs uppercase tracking-wider text-white shadow-2xs">
                    Kundli Yoga - {name}
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
                            {y.name}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-bold rounded-lg px-2.5 py-0.5 border ${
                            y.is_present
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : "bg-rose-50 text-rose-800 border-rose-300"
                          }`}
                        >
                          {y.is_present ? "Present" : "Not Present"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Detailed Active Yogas */}
                <div className="space-y-4">
                  {result.active_yogas_details.map((act, idx) => (
                    <div
                      key={`act-yoga-${idx}`}
                      className="rounded-2xl border border-amber-200/80 bg-amber-50/30 p-4 space-y-1.5 shadow-2xs"
                    >
                      <h4 className="font-display text-base font-bold text-amber-950">
                        {act.name}
                      </h4>
                      <p className="text-xs text-foreground-muted leading-relaxed">
                        {act.effects}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Bar at Bottom matching Screenshot 2 & 5 */}
      {result && (
        <div className="fixed bottom-4 inset-x-0 mx-auto max-w-md px-4 z-40">
          <div className="rounded-2xl bg-white/95 border-2 border-amber-300 shadow-xl p-2 flex items-center justify-between gap-2 backdrop-blur-md">
            <button
              type="button"
              onClick={() => toast.success("Kundli saved to your account!")}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 py-2.5 px-3 text-xs font-bold text-amber-950 transition-colors shadow-2xs"
            >
              <Lock className="size-3.5 text-amber-600" />
              <span>Save Kundli</span>
            </button>

            <button
              type="button"
              onClick={handlePrintDownload}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-colors"
            >
              <Download className="size-3.5" />
              <span>Download</span>
            </button>

            <Link
              href="/astrologers"
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-400 hover:bg-brand-500 py-2.5 px-3 text-xs font-bold text-ink-900 shadow-glow transition-all"
            >
              <MessageCircle className="size-3.5 text-ink-900" />
              <span>Consult</span>
            </Link>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
