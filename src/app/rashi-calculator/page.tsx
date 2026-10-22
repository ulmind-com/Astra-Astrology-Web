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
  HeartHandshake,
  Gem,
  Palette,
  Eye,
  RotateCcw,
  Languages,
  Compass,
  RefreshCw,
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
import { ClientRulesPanel } from "@/components/astrology/client-rules-panel";
import { CalculationDetails } from "@/components/astrology/calculation-details";
import { MoonSignWheel } from "@/components/astrology/moon-sign-wheel";
import { KundaliChart } from "@/components/astrology/kundali-chart";
import { getClientRashiTraits } from "@/lib/astrology-translations";
import { useAuth } from "@/providers/auth-provider";
import { useProfile } from "@/hooks/use-profile";
import type {
  AstrologyLanguage,
  AyanamsaType,
  ChartStyleType,
  HouseSystemType,
  RashiCalculatePayload,
  RashiCalculateResult,
  UserProfile,
  UserPublic,
} from "@/types";

export default function RashiCalculatorPage() {
  // Auth & Profile hooks for dynamic data fetching
  const { user, isSignedIn } = useAuth();
  const { data: profile } = useProfile({ enabled: isSignedIn });

  // Global Language Selection for Output & UI (English, বাংলা, हिन्दी)
  const [language, setLanguage] = React.useState<AstrologyLanguage>("bn");

  // Form State - initialized empty, dynamically populated from logged-in profile
  const [name, setName] = React.useState("");
  const [gender, setGender] = React.useState<"male" | "female" | "other">("male");

  // Birth Day (DD-MM-YYYY)
  const [day, setDay] = React.useState("");
  const [month, setMonth] = React.useState("");
  const [year, setYear] = React.useState("");

  // Time (HH:mm:ss AM/PM) - Optional
  const [hour, setHour] = React.useState("");
  const [minute, setMinute] = React.useState("");
  const [second, setSecond] = React.useState("");
  const [period, setPeriod] = React.useState<"AM" | "PM">("PM");

  // Place. `selectedPlace` is the authoritative source for coordinates and
  // timezone: it is only ever set by choosing a real geocoded result, so a typed
  // string can no longer be submitted against the old Kolkata fallback.
  const [place, setPlace] = React.useState("");
  const [selectedPlace, setSelectedPlace] = React.useState<SelectedPlace | null>(null);
  const [placeTouched, setPlaceTouched] = React.useState(false);

  // Advance Settings (Optional)
  const [showAdvance, setShowAdvance] = React.useState(false);
  const [lonDeg, setLonDeg] = React.useState("");
  const [lonMin, setLonMin] = React.useState("");
  const [lonDir, setLonDir] = React.useState<"E" | "W">("E");

  const [latDeg, setLatDeg] = React.useState("");
  const [latMin, setLatMin] = React.useState("");
  const [latDir, setLatDir] = React.useState<"N" | "S">("N");

  // Manual timezone override, used only when no place has been resolved. Free-form
  // rather than an eight-option select, so offsets the old list could not express -
  // +05:53:20 for a pre-1906 Kolkata birth, +06:30, +09:00 - are reachable.
  const [timezone, setTimezone] = React.useState("5.5");
  const [ayanamsa, setAyanamsa] = React.useState<AyanamsaType>("lahiri");
  const [houseSystem, setHouseSystem] = React.useState<HouseSystemType>("placidus");
  const [chartStyle, setChartStyle] = React.useState<ChartStyleType>("north_indian");

  // Calculation State
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<RashiCalculateResult | null>(null);

  const resultsRef = React.useRef<HTMLDivElement>(null);
  const hasAutoFilled = React.useRef(false);

  // Focus navigation refs for smooth input
  const dayRef = React.useRef<HTMLInputElement>(null);
  const monthRef = React.useRef<HTMLInputElement>(null);
  const yearRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);

  // Helper to extract and format profile birth details
  const populateFromProfileData = React.useCallback(
    (p: UserProfile, u?: UserPublic | null) => {
      // 1. Full name
      const fullName =
        p.full_name ||
        [p.first_name, p.middle_name, p.last_name].filter(Boolean).join(" ").trim() ||
        u?.full_name ||
        "";
      if (fullName) setName(fullName);

      // 2. Gender
      if (p.gender) {
        const g = p.gender.toLowerCase();
        if (g === "female") setGender("female");
        else if (g === "other") setGender("other");
        else setGender("male");
      }

      // 3. Birth details
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
          const absLat = Math.abs(b.latitude);
          const dLat = Math.floor(absLat);
          const mLat = Math.round((absLat - dLat) * 60);
          setLatDeg(String(dLat));
          setLatMin(String(mLat));
          setLatDir(b.latitude >= 0 ? "N" : "S");

          const absLon = Math.abs(b.longitude);
          const dLon = Math.floor(absLon);
          const mLon = Math.round((absLon - dLon) * 60);
          setLonDeg(String(dLon));
          setLonMin(String(mLon));
          setLonDir(b.longitude >= 0 ? "E" : "W");
        }

        if (b.latitude != null && b.longitude != null) {
          setSelectedPlace({
            place: placeName || "Saved birth place",
            displayName: placeName || "Saved birth place",
            latitude: b.latitude,
            longitude: b.longitude,
            timezoneName: typeof b.timezone === "string" ? b.timezone : null,
            timezoneOffset: b.timezone_offset ?? null,
            timezoneLabel: null,
            timezoneAbbreviation: null,
            isDst: false,
          });
        }

        if (b.timezone_offset != null) {
          setTimezone(String(b.timezone_offset));
        } else if (b.timezone) {
          if (b.timezone.includes("Kolkata") || b.timezone.includes("Calcutta")) {
            setTimezone("5.5");
          } else if (b.timezone.includes("Dhaka")) {
            setTimezone("6.0");
          } else if (b.timezone.includes("Kathmandu")) {
            setTimezone("5.75");
          } else if (b.timezone.includes("Dubai")) {
            setTimezone("4.0");
          }
        }
      }
    },
    []
  );

  // Automatically populate when user profile is loaded
  React.useEffect(() => {
    if (!isSignedIn) return;

    if (profile && !hasAutoFilled.current) {
      hasAutoFilled.current = true;
      populateFromProfileData(profile, user);
    } else if (user && !name && !hasAutoFilled.current) {
      setName(user.full_name || user.first_name || "");
    }
  }, [isSignedIn, profile, user, name, populateFromProfileData]);

  // Reset form helper
  const handleResetForm = () => {
    setSelectedPlace(null);
    setPlaceTouched(false);
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
    setLatDeg("");
    setLatMin("");
    setLatDir("N");
    setLonDeg("");
    setLonMin("");
    setLonDir("E");
    setTimezone("5.5");
    setResult(null);
    toast.info(
      language === "bn"
        ? "ফর্ম খালি করা হয়েছে।"
        : language === "hi"
        ? "फ़ॉर्म साफ़ कर दिया गया है।"
        : "Form cleared."
    );
  };

  // Re-sync with profile
  const handleReloadFromProfile = () => {
    if (profile) {
      populateFromProfileData(profile, user);
      toast.success(
        language === "bn"
          ? "প্রোফাইল থেকে তথ্য পুনরায় লোড করা হয়েছে।"
          : language === "hi"
          ? "प्रोफ़ाइल से विवरण पुनः लोड किया गया।"
          : "Loaded details from your profile."
      );
    }
  };

  // Input formatting & auto-advance navigation handlers
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    prevRef?: React.RefObject<HTMLInputElement | null>
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

  const handleLonDegChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 3) val = val.slice(0, 3);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 180) val = "180";
    setLonDeg(val);
  };

  const handleLonMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 59) val = "59";
    setLonMin(val);
  };

  const handleLatDegChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 90) val = "90";
    setLatDeg(val);
  };

  const handleLatMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 59) val = "59";
    setLatMin(val);
  };

  // Choosing a place drives the coordinate and timezone fields, so the Advanced
  // panel always shows what will actually be sent.
  const handlePlaceSelected = React.useCallback((next: SelectedPlace | null) => {
    setSelectedPlace(next);
    if (!next) {
      setPlace("");
      return;
    }
    setPlace(next.place);

    const absLat = Math.abs(next.latitude);
    const degLat = Math.floor(absLat);
    setLatDeg(String(degLat));
    setLatMin(String(Math.round((absLat - degLat) * 60)));
    setLatDir(next.latitude >= 0 ? "N" : "S");

    const absLon = Math.abs(next.longitude);
    const degLon = Math.floor(absLon);
    setLonDeg(String(degLon));
    setLonMin(String(Math.round((absLon - degLon) * 60)));
    setLonDir(next.longitude >= 0 ? "E" : "W");

    if (next.timezoneOffset != null) setTimezone(String(next.timezoneOffset));
  }, []);

  const getDecimalCoords = () => {
    if (!latDeg && !lonDeg) {
      // Default fallback coordinates if user leaves advanced empty
      return { lat: 22.5726, lon: 88.3639 };
    }
    const lat = (Number(latDeg) || 0) + (Number(latMin) || 0) / 60;
    const finalLat = latDir === "S" ? -lat : lat;

    const lon = (Number(lonDeg) || 0) + (Number(lonMin) || 0) / 60;
    const finalLon = lonDir === "W" ? -lon : lon;

    return { lat: finalLat, lon: finalLon };
  };

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Validation
    if (!name.trim()) {
      toast.error(
        language === "bn"
          ? "অনুগ্রহ করে আপনার নাম লিখুন"
          : language === "hi"
          ? "कृपया अपना नाम दर्ज करें"
          : "Please enter your name"
      );
      return;
    }

    // 1. Mandatory Date of Birth (DOB) Validation
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (isNaN(d) || d < 1 || d > 31 || isNaN(m) || m < 1 || m > 12 || isNaN(y) || y < 1900) {
      toast.error(
        language === "bn"
          ? "অনুগ্রহ করে সঠিক জন্মতারিখ দিন (DD-MM-YYYY) — জন্মতারিখ বাধ্যতামূলক"
          : language === "hi"
          ? "कृपया सही जन्म तिथि दर्ज करें (DD-MM-YYYY) — जन्म तिथि अनिवार्य है"
          : "Please enter a valid birth date (DD-MM-YYYY) — DOB is required"
      );
      return;
    }

    // 2. Optional Birth Time (Time of Birth)
    // If not provided, smoothly default to 12:00 PM (Noon) as per standard Vedic astrology convention
    let finalHour = 12;
    let finalMin = 0;
    let finalSec = 0;
    let finalPeriod: "AM" | "PM" = "PM";

    if (hour.trim() !== "") {
      const parsedH = parseInt(hour, 10);
      const parsedMin = minute.trim() !== "" ? parseInt(minute, 10) : 0;
      const parsedSec = second.trim() !== "" ? parseInt(second, 10) : 0;

      if (isNaN(parsedH) || parsedH < 1 || parsedH > 12 || isNaN(parsedMin) || parsedMin < 0 || parsedMin > 59) {
        toast.error(
          language === "bn"
            ? "অনুগ্রহ করে সঠিক জন্মসময় দিন (০১-১২ ঘন্টা, ০০-৫৯ মিনিট)"
            : language === "hi"
            ? "कृपया सही जन्म समय दर्ज करें (01-12 घंटे, 00-59 मिनट)"
            : "Please enter a valid birth time (01-12 hours, 00-59 minutes)"
        );
        return;
      }
      finalHour = parsedH;
      finalMin = parsedMin;
      finalSec = parsedSec;
      finalPeriod = period;
    }

    // 3. Birth Place Validation
    // A typed place name is not enough. Without a geocoded selection the chart
    // would be cast for whatever coordinates happen to be in the Advanced fields,
    // which used to default to Kolkata and shifted the ascendant silently.
    if (!selectedPlace && !(latDeg && lonDeg)) {
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

    const { lat, lon } = selectedPlace
      ? { lat: selectedPlace.latitude, lon: selectedPlace.longitude }
      : getDecimalCoords();

    const payload: RashiCalculatePayload = {
      name: name.trim() || "Seeker",
      gender,
      day: d,
      month: m,
      year: y,
      hour: finalHour,
      minute: finalMin,
      second: finalSec,
      period: finalPeriod,
      place: (selectedPlace?.place || place).trim(),
      latitude: lat,
      longitude: lon,
      // The offset is a fallback only. When a zone name is present the backend
      // resolves the exact offset at the birth instant, which is what makes
      // daylight saving and historical changes come out right.
      timezone: parseFloat(timezone) || 5.5,
      timezone_name: selectedPlace?.timezoneName ?? null,
      ayanamsa,
      house_system: houseSystem,
      chart_style: chartStyle,
      language,
    };

    setLoading(true);
    try {
      const res = await astrologyApi.calculateRashi(payload);
      if (res) {
        setResult(res);
        toast.success(
          language === "bn"
            ? `চন্দ্রের অবস্থান: ${res.rashi_name_bn} রাশি (${res.nakshatra_name} নক্ষত্র)`
            : language === "hi"
            ? `गणना पूर्ण: ${res.rashi_name_hi} राशि (${res.nakshatra_name} नक्षत्र)`
            : `Calculated Moon Sign: ${res.rashi_name_en} (${res.rashi_name_hi})`
        );
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to calculate Rashi. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  // Derive localized traits dynamically whenever language or result changes
  // Guarantees INSTANT 0ms multilingual switching!
  const activeTraits = React.useMemo(() => {
    if (!result) return null;
    return getClientRashiTraits(result.rashi_index, language, result.traits, result.translations);
  }, [result, language]);

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-surface-muted/30 pb-20">
        {/* =========================================================================
            HEADER & BREADCRUMBS
        ========================================================================= */}
        <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/90 text-amber-950 border border-amber-300 font-bold px-4 py-1.5 text-xs shadow-2xs">
            <Sparkles className="size-3.5 text-amber-600" />
            <span>
              {language === "bn"
                ? "বৈদিক জ্যোতিষশাস্ত্র ভিত্তিক নির্ভুল রাশি ক্যালকুলেটর"
                : language === "hi"
                ? "वैदिक ज्योतिष सम्मत सटीक चंद्र राशि कैलकुलेटर"
                : "Vedic Sidereal Moon Sign & Nakshatra Calculator"}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {language === "bn"
              ? "জন্মতারিখ দিয়ে নিজের রাশি ও প্রতিকার জানুন — সম্পূর্ণ ফ্রি"
              : language === "hi"
              ? "जन्मतिथि से जानें अपनी राशि, सावधानियां एवं अचूक उपाय"
              : "Find Your Rashi by Date of Birth - Accurate Moon Sign Calculator"}
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
            {language === "bn"
              ? "সঠিক চন্দ্রের অবস্থান, ২৭ নক্ষত্র, ৪ পদ, কৃষ্ণমূর্তি (KP) সাব-লর্ড, কী কী থেকে সাবধান থাকবেন এবং কী করলে সৌভাগ্য বৃদ্ধি পাবে তার পূর্ণাঙ্গ বিশ্লেষণ।"
              : language === "hi"
              ? "सटीक चंद्र स्थिति, २७ नक्षत्र, ४ चरण, केपी सब-लॉर्ड, किन बातों से सावधान रहें और किन उपायों से भाग्य चमकेगा—सब कुछ विस्तार से जानें।"
              : "Accurate planetary calculations powered by Vedic Sidereal Ephemeris with KP Sub-Lord, astrological warnings, and Vedic remedies."}
          </p>

          {/* Interactive Language Switcher Bar */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-amber-300/80 shadow-xs">
              <span className="text-[11px] font-bold text-muted-foreground px-2 flex items-center gap-1">
                <Languages className="size-3 text-amber-600" />
                <span>ভাষা / Language:</span>
              </span>
              <button
                type="button"
                onClick={() => setLanguage("bn")}
                className={`rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                  language === "bn"
                    ? "bg-amber-500 text-amber-950 shadow-xs scale-105 font-black"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setLanguage("hi")}
                className={`rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                  language === "hi"
                    ? "bg-amber-500 text-amber-950 shadow-xs scale-105 font-black"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                  language === "en"
                    ? "bg-amber-500 text-amber-950 shadow-xs scale-105 font-black"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            FORM SECTION
        ========================================================================= */}
        <div className="mx-auto max-w-3xl px-4 pt-7 sm:px-6">
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

            <form onSubmit={handleCalculate} className="space-y-5 text-xs sm:text-sm">
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
                    placeholder={language === "bn" ? "আপনার নাম লিখুন..." : language === "hi" ? "अपना नाम लिखें..." : "Enter your name..."}
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
                    <option value="male">{language === "bn" ? "পুরুষ (Male)" : language === "hi" ? "पुरुष (Male)" : "Male"}</option>
                    <option value="female">{language === "bn" ? "মহিলা (Female)" : language === "hi" ? "महिला (Female)" : "Female"}</option>
                    <option value="other">{language === "bn" ? "অন্যান্য (Other)" : language === "hi" ? "अन्य (Other)" : "Other"}</option>
                  </select>
                </div>
              </div>

              {/* 3. Birth Day (DD-MM-YYYY in 3 separate inputs) - MANDATORY */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                <label className="sm:col-span-3 flex items-center gap-2 font-bold text-foreground">
                  <Calendar className="size-4 text-amber-600" />
                  <span>
                    {language === "bn" ? "জন্মতারিখ" : language === "hi" ? "जन्म तिथि" : "Birth Day"}
                    <span className="text-[11px] font-bold text-rose-600 ml-1.5">
                      * ({language === "bn" ? "বাধ্যতামূলক" : language === "hi" ? "अनिवार्य" : "Required"})
                    </span>
                  </span>
                </label>
                <div className="sm:col-span-9 grid grid-cols-3 gap-2">
                  <input
                    ref={dayRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={2}
                    value={day}
                    onChange={handleDayChange}
                    placeholder="DD"
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-3 py-2.5 text-center text-xs sm:text-sm font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <input
                    ref={monthRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={2}
                    value={month}
                    onChange={handleMonthChange}
                    onKeyDown={(e) => handleKeyDown(e, dayRef)}
                    placeholder="MM"
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-3 py-2.5 text-center text-xs sm:text-sm font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <input
                    ref={yearRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    value={year}
                    onChange={handleYearChange}
                    onKeyDown={(e) => handleKeyDown(e, monthRef)}
                    placeholder="YYYY"
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-3 py-2.5 text-center text-xs sm:text-sm font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              {/* 4. Birth Time (HH:mm:ss in 3 inputs + AM/PM) - OPTIONAL */}
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
                    pattern="[0-9]*"
                    maxLength={2}
                    value={hour}
                    onChange={handleHourChange}
                    placeholder="HH"
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-2 py-2.5 text-center text-xs sm:text-sm font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <input
                    ref={minuteRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={2}
                    value={minute}
                    onChange={handleMinuteChange}
                    onKeyDown={(e) => handleKeyDown(e, hourRef)}
                    placeholder="MM"
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-2 py-2.5 text-center text-xs sm:text-sm font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <input
                    ref={secondRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={2}
                    value={second}
                    onChange={handleSecondChange}
                    onKeyDown={(e) => handleKeyDown(e, minuteRef)}
                    placeholder="SS"
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-2 py-2.5 text-center text-xs sm:text-sm font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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

              {/* 5. Birth Place - geocoded inline, with the resolved timezone shown */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4">
                <label
                  htmlFor="birth-place"
                  className="sm:col-span-3 flex items-start gap-2 pt-3 font-bold text-foreground"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-rose-500" />
                  <span>
                    {language === "bn"
                      ? "জন্মস্থান"
                      : language === "hi"
                        ? "जन्म स्थान"
                        : "Birth Place"}
                    <span className="ml-1 text-rose-500">*</span>
                  </span>
                </label>
                <div className="sm:col-span-9">
                  <BirthPlaceField
                    id="birth-place"
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
              </div>

              {/* Collapsible Advance Settings Toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvance((prev) => !prev)}
                  className="w-full flex items-center justify-between rounded-xl bg-surface-muted/60 hover:bg-surface-muted px-4 py-3 text-xs font-bold text-foreground transition-colors border border-border/60"
                >
                  <span className="flex items-center gap-2 text-amber-900">
                    <Sliders className="size-4 text-amber-600" />
                    <span>
                      {language === "bn"
                        ? "উন্নত সেটিংস (ঐচ্ছিক)"
                        : language === "hi"
                        ? "उन्नत सेटिंग्स (वैकल्पिक)"
                        : "Advance Settings (Optional)"}
                    </span>
                  </span>
                  {showAdvance ? (
                    <ChevronUp className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  )}
                </button>
              </div>

              {/* Advance Settings Body */}
              {showAdvance && (
                <div className="rounded-2xl border border-border/80 bg-surface-muted/20 p-4 sm:p-5 space-y-4 animate-in fade-in-50 duration-200">
                  {/* Longitude */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                    <label className="sm:col-span-3 flex items-center gap-2 font-bold text-foreground">
                      <Compass className="size-4 text-indigo-500" />
                      <span>Longitude</span>
                    </label>
                    <div className="sm:col-span-9 grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={3}
                        value={lonDeg}
                        onChange={handleLonDegChange}
                        placeholder="Deg"
                        className="w-full rounded-xl border border-border bg-surface-muted/40 px-2 py-2 text-center text-xs font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={2}
                        value={lonMin}
                        onChange={handleLonMinChange}
                        placeholder="Min"
                        className="w-full rounded-xl border border-border bg-surface-muted/40 px-2 py-2 text-center text-xs font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <select
                        value={lonDir}
                        onChange={(e) => setLonDir(e.target.value as any)}
                        className="w-full rounded-xl border border-border bg-surface-muted/40 px-2 py-2 text-center text-xs font-bold text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer"
                      >
                        <option value="E">East</option>
                        <option value="W">West</option>
                      </select>
                    </div>
                  </div>

                  {/* Latitude */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                    <label className="sm:col-span-3 flex items-center gap-2 font-bold text-foreground">
                      <Compass className="size-4 text-rose-500" />
                      <span>Latitude</span>
                    </label>
                    <div className="sm:col-span-9 grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={2}
                        value={latDeg}
                        onChange={handleLatDegChange}
                        placeholder="Deg"
                        className="w-full rounded-xl border border-border bg-surface-muted/40 px-2 py-2 text-center text-xs font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={2}
                        value={latMin}
                        onChange={handleLatMinChange}
                        placeholder="Min"
                        className="w-full rounded-xl border border-border bg-surface-muted/40 px-2 py-2 text-center text-xs font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <select
                        value={latDir}
                        onChange={(e) => setLatDir(e.target.value as any)}
                        className="w-full rounded-xl border border-border bg-surface-muted/40 px-2 py-2 text-center text-xs font-bold text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer"
                      >
                        <option value="N">North</option>
                        <option value="S">South</option>
                      </select>
                    </div>
                  </div>

                  {/* Timezone. Read-only once a place is chosen, because the
                      backend resolves the exact offset from the zone at the birth
                      instant; editable as a free-form override otherwise, so any
                      offset is reachable rather than only eight preset ones. */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-start gap-2 sm:gap-4">
                    <label
                      htmlFor="timezone"
                      className="sm:col-span-3 flex items-center gap-2 pt-2 font-bold text-foreground"
                    >
                      <Globe className="size-4 text-emerald-500" />
                      <span>
                        {language === "bn"
                          ? "সময়াঞ্চল"
                          : language === "hi"
                            ? "समय क्षेत्र"
                            : "Time Zone"}
                      </span>
                    </label>
                    <div className="sm:col-span-9">
                      {selectedPlace?.timezoneName ? (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-2.5">
                          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-emerald-900">
                            <span>{selectedPlace.timezoneName}</span>
                            {selectedPlace.timezoneLabel && (
                              <span className="rounded-md bg-white px-1.5 py-0.5 tabular-nums">
                                {selectedPlace.timezoneLabel}
                              </span>
                            )}
                            {selectedPlace.timezoneAbbreviation && (
                              <span className="font-semibold text-emerald-700">
                                {selectedPlace.timezoneAbbreviation}
                              </span>
                            )}
                          </p>
                          <p className="mt-1 text-[11px] leading-relaxed text-emerald-800/90">
                            {language === "bn"
                              ? "জন্মস্থান ও জন্মতারিখ অনুসারে সঠিক সময়াঞ্চল নির্ণীত — ডেলাইট সেভিং ও ঐতিহাসিক পরিবর্তন সহ।"
                              : language === "hi"
                                ? "जन्म स्थान एवं जन्म तिथि अनुसार सही समय क्षेत्र निर्धारित — डेलाइट सेविंग एवं ऐतिहासिक परिवर्तन सहित।"
                                : "Resolved from your birth place and date, including daylight saving and historical changes."}
                          </p>
                        </div>
                      ) : (
                        <>
                          <input
                            id="timezone"
                            type="text"
                            inputMode="decimal"
                            value={timezone}
                            onChange={(e) =>
                              setTimezone(e.target.value.replace(/[^0-9.+-]/g, ""))
                            }
                            placeholder="5.5"
                            className="w-full rounded-xl border border-border bg-surface-muted/40 px-3.5 py-2.5 text-xs font-semibold tabular-nums text-foreground shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 sm:text-sm"
                          />
                          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                            {language === "bn"
                              ? "UTC থেকে ঘণ্টার হিসেবে, যেমন ভারত 5.5, বাংলাদেশ 6, নেপাল 5.75। তালিকা থেকে জন্মস্থান বেছে নিলে এটি স্বয়ংক্রিয়ভাবে ঠিক হয়ে যাবে।"
                              : language === "hi"
                                ? "UTC से घंटों में, जैसे भारत 5.5, बांग्लादेश 6, नेपाल 5.75। सूची से जन्म स्थान चुनने पर यह स्वतः सही हो जाएगा।"
                                : "Hours from UTC, e.g. India 5.5, Bangladesh 6, Nepal 5.75. Choosing your birth place from the list sets this automatically."}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Ayanamsa */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                    <label className="sm:col-span-3 flex items-center gap-2 font-bold text-foreground">
                      <Sliders className="size-4 text-indigo-400" />
                      <span>Ayanamsa</span>
                    </label>
                    <div className="sm:col-span-9">
                      <select
                        value={ayanamsa}
                        onChange={(e) => setAyanamsa(e.target.value as any)}
                        className="w-full rounded-xl border border-border bg-surface-muted/40 px-3.5 py-2 text-xs font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer"
                      >
                        <option value="lahiri">Lahiri (Chitra Paksha - Most Popular)</option>
                        <option value="bv_raman">B.V. Raman</option>
                        <option value="krishnamurti">Krishnamurti (KP Standard)</option>
                        <option value="yukteshwar">Yukteshwar</option>
                        <option value="suryasiddhanta">Suryasiddhanta</option>
                        <option value="true_pushya">True Pushya (PVRN Rao)</option>
                        <option value="true_mula">True Mula (Chandra Hari)</option>
                      </select>
                    </div>
                  </div>

                  {/* House System */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                    <label className="sm:col-span-3 flex items-center gap-2 font-bold text-foreground">
                      <Sliders className="size-4 text-amber-500" />
                      <span>House System</span>
                    </label>
                    <div className="sm:col-span-9">
                      <select
                        value={houseSystem}
                        onChange={(e) => setHouseSystem(e.target.value as any)}
                        className="w-full rounded-xl border border-border bg-surface-muted/40 px-3.5 py-2 text-xs font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer"
                      >
                        <option value="placidus">Placidus (Standard in KP)</option>
                        <option value="equal">Equal House</option>
                        <option value="whole_sign">Whole Sign</option>
                        <option value="koch">Koch</option>
                      </select>
                    </div>
                  </div>

                  {/* Chart Style */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                    <label className="sm:col-span-3 flex items-center gap-2 font-bold text-foreground">
                      <Sliders className="size-4 text-indigo-400" />
                      <span>Chart Style</span>
                    </label>
                    <div className="sm:col-span-9">
                      <select
                        value={chartStyle}
                        onChange={(e) => setChartStyle(e.target.value as any)}
                        className="w-full rounded-xl border border-border bg-surface-muted/40 px-3.5 py-2 text-xs font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer"
                      >
                        <option value="north_indian">North Indian (Diamond)</option>
                        <option value="south_indian">South Indian (Square Grid)</option>
                        <option value="east_indian">East Indian (Bengali ছক)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-4 flex justify-center">
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="px-9 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-ink-950 font-black text-sm shadow-[0_8px_24px_rgba(234,179,8,0.35)] hover:shadow-[0_12px_32px_rgba(234,179,8,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin text-base">✦</span>
                      <span>
                        {language === "bn"
                          ? "চন্দ্র রাশি গণনা করা হচ্ছে…"
                          : language === "hi"
                          ? "चंद्र राशि की गणना हो रही है…"
                          : "Calculating Moon Sign…"}
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>
                        {language === "bn"
                          ? "আপনার রাশি জানুন"
                          : language === "hi"
                          ? "अपनी राशि जानें"
                          : "Know Your Rashi"}
                      </span>
                      <ArrowRight className="size-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* =========================================================================
            RESULTS DASHBOARD (When Calculated)
        ========================================================================= */}
        {result && activeTraits && (
          <div ref={resultsRef} className="mx-auto max-w-5xl px-4 pt-12 sm:px-6 lg:px-8 space-y-8 animate-in fade-in-50 duration-300">
            {/* 1. Main Rashi Announcement Hero Card */}
            <div className="rounded-[32px] border border-amber-400/80 bg-gradient-to-br from-card via-[#fffdf0] to-card p-6 sm:p-10 shadow-[0_20px_50px_-20px_rgba(234,179,8,0.22)] text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

              {/* Top Banner with High-Contrast Text */}
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-extrabold px-4 py-1.5 text-xs shadow-2xs mb-4">
                <Sparkles className="size-3.5 text-amber-700" />
                <span>
                  {language === "bn"
                    ? `${result.name} এর জন্য বৈদিক চন্দ্র রাশি গণনা সম্পন্ন`
                    : language === "hi"
                    ? `${result.name} के लिए वैदिक चंद्र राशि गणना पूर्ण`
                    : `Vedic Moon Sign Calculated for ${result.name}`}
                </span>
              </div>

              {/* Big Sign Symbol & Typography */}
              <div className="flex flex-col items-center justify-center">
                <div className="size-20 sm:size-24 rounded-3xl bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900 flex items-center justify-center text-4xl sm:text-5xl text-white shadow-lg shadow-indigo-500/25 border-2 border-white/40 mb-3">
                  <span>{result.rashi_symbol}</span>
                </div>

                <h2 className="font-display text-3xl sm:text-5xl font-black text-ink-950 tracking-tight">
                  {language === "bn"
                    ? `${result.rashi_name_bn} রাশি`
                    : language === "hi"
                    ? `${result.rashi_name_hi} राशि`
                    : result.rashi_name_en}
                  <span className="text-amber-600 font-extrabold text-2xl sm:text-3xl ml-2">
                    ({language === "bn" ? result.rashi_name_en : `${result.rashi_name_hi} / ${result.rashi_name_bn}`})
                  </span>
                </h2>

                <p className="mt-3 text-xs sm:text-[13px] text-ink-700 max-w-2xl leading-relaxed font-medium">
                  {activeTraits.overview}
                </p>
              </div>

              {/* High-Contrast Badges Strip */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
                <span className="rounded-xl bg-white px-3.5 py-1.5 text-ink-950 border border-border/80 shadow-2xs">
                  {language === "bn" ? "অধিপতি গ্রহ:" : language === "hi" ? "स्वामी ग्रह:" : "Ruling Lord:"}{" "}
                  <strong className="text-amber-700">{result.rashi_lord}</strong>
                </span>
                <span className="rounded-xl bg-white px-3.5 py-1.5 text-ink-950 border border-border/80 shadow-2xs">
                  {language === "bn" ? "চন্দ্রের অবস্থান:" : language === "hi" ? "चंद्रमा स्थिति:" : "Moon Position:"}{" "}
                  <strong className="tabular-nums text-amber-700">{result.moon_degree_formatted}</strong>
                </span>
                <span className="rounded-xl bg-white px-3.5 py-1.5 text-ink-950 border border-border/80 shadow-2xs">
                  {language === "bn" ? "তত্ত্ব:" : language === "hi" ? "तत्व:" : "Element:"}{" "}
                  <strong className="text-ink-900">{activeTraits.element}</strong>
                </span>
                <span className="rounded-xl bg-white px-3.5 py-1.5 text-ink-950 border border-border/80 shadow-2xs">
                  {language === "bn" ? "স্বভাব:" : language === "hi" ? "स्वभाव:" : "Modality:"}{" "}
                  <strong className="text-ink-900">{activeTraits.modality}</strong>
                </span>
                <span className="rounded-xl bg-white px-3.5 py-1.5 text-ink-950 border border-border/80 shadow-2xs">
                  {language === "bn" ? "প্রকৃতি:" : language === "hi" ? "प्रकृति:" : "Polarity:"}{" "}
                  <strong className="text-ink-900">{activeTraits.polarity}</strong>
                </span>
              </div>
            </div>

            {/* 2. Nakshatra & KP Sub-Lord Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-border/80 bg-card p-4 text-center shadow-2xs">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {language === "bn" ? "নক্ষত্র ও পদ" : language === "hi" ? "नक्षत्र एवं चरण" : "Nakshatra & Pada"}
                </p>
                <p className="mt-1 font-display text-base sm:text-lg font-black text-ink-950">
                  {result.nakshatra_name}
                </p>
                {/* Fixed High-Contrast Pada Badge */}
                <span className="inline-block mt-1.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 px-3 py-0.5 text-xs font-black shadow-2xs">
                  {language === "bn" ? `${result.nakshatra_pada} নং পদ` : language === "hi" ? `चरण ${result.nakshatra_pada}` : `Pada ${result.nakshatra_pada}`}
                </span>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-4 text-center shadow-2xs">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {language === "bn" ? "নক্ষত্রাধিপতি (KP)" : language === "hi" ? "नक्षत्र स्वामी" : "Star Lord (KP)"}
                </p>
                <p className="mt-1 font-display text-base sm:text-lg font-black text-ink-950">
                  {result.nakshatra_lord}
                </p>
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {language === "bn" ? "ফল নির্দেশক" : language === "hi" ? "फल का स्रोत" : "Governs Result"}
                </span>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-4 text-center shadow-2xs">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {language === "bn" ? "উপ-অধিপতি (KP Sub)" : language === "hi" ? "उप-स्वामी (KP Sub)" : "KP Sub-Lord"}
                </p>
                <p className="mt-1 font-display text-base sm:text-lg font-black text-amber-700">
                  {result.kp_sub_lord}
                </p>
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {language === "bn" ? "ফলাফল নির্ধারক" : language === "hi" ? "अंतिम परिणाम" : "Qualifies Outcome"}
                </span>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-4 text-center shadow-2xs">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {language === "bn" ? "লগ্ন (Ascendant)" : language === "hi" ? "लग्न (Ascendant)" : "Ascendant (Lagna)"}
                </p>
                <p className="mt-1 font-display text-base sm:text-lg font-black text-ink-950">
                  {result.ascendant_rashi_name_en}
                </p>
                <span className="text-[10px] font-mono font-bold text-amber-700">
                  {result.ascendant_degree_formatted}
                </span>
              </div>
            </div>

            {/* 3. CRITICAL SECTION REQUESTED BY USER:
                - What to Be Cautious About (কি কি থেকে সাবধান থাকতে হবে)
                - What is Beneficial & Auspicious (কি করলে ভালো হবে)
                - Fully Localized in the Selected Language (BN / HI / EN)
            */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Warnings & Cautions (সাবধানতা ও দুর্বলতা) */}
              <div className="rounded-[26px] border border-rose-500/30 bg-gradient-to-br from-rose-500/[0.05] via-card to-card p-6 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-rose-500/20">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-rose-500/15 text-rose-700 shadow-xs">
                    <AlertTriangle className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-extrabold text-ink-950">
                      {language === "bn"
                        ? "কী কী থেকে সাবধান থাকবেন (সতর্কতা)"
                        : language === "hi"
                        ? "किन-किन बातों से सावधान रहें (सावधानियां)"
                        : "Cautions & Pitfalls (What to Avoid)"}
                    </h3>
                    <p className="text-[11px] font-semibold text-rose-700/90">
                      {language === "bn"
                        ? "আপনার রাশির স্বভাবজাত দুর্বলতা ও প্রতিকূল ক্ষেত্র"
                        : language === "hi"
                        ? "आपकी राशि की स्वाभाविक कमजोरियां और प्रतिकूल क्षेत्र"
                        : "Innate vulnerabilities and traits to be mindful of"}
                    </p>
                  </div>
                </div>

                <ul className="space-y-3 text-xs sm:text-[13px] text-ink-950">
                  {activeTraits.cautions_and_pitfalls.map((caution, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 font-medium">
                      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-rose-600 shadow-xs" />
                      <span className="leading-relaxed">{caution}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Beneficial Actions & Remedies (করণীয় ও বৈদিক প্রতিকার) */}
              <div className="rounded-[26px] border border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.05] via-card to-card p-6 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-emerald-500/20">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 shadow-xs">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-extrabold text-ink-950">
                      {language === "bn"
                        ? "কী করলে আপনার ভালো হবে (শুভ প্রতিকার)"
                        : language === "hi"
                        ? "क्या करने से आपका कल्याण होगा (शुभ उपाय)"
                        : "Beneficial Actions & Remedies (What to Do)"}
                    </h3>
                    <p className="text-[11px] font-semibold text-emerald-700/90">
                      {language === "bn"
                        ? "সৌভাগ্য বৃদ্ধি, মানসিক শান্তি ও সাফল্যের বৈদিক উপায়"
                        : language === "hi"
                        ? "सौभाग्य, मानसिक शांति और सफलता के अचूक उपाय"
                        : "Auspicious Vedic practices to enhance luck and peace"}
                    </p>
                  </div>
                </div>

                <ul className="space-y-3 text-xs sm:text-[13px] text-ink-950">
                  {activeTraits.beneficial_actions_and_remedies.map((remedy, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 font-medium">
                      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-emerald-600 shadow-xs" />
                      <span className="leading-relaxed">{remedy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 4. Lucky Attributes & Strengths */}
            <div className="rounded-[26px] border border-amber-300/80 bg-card p-6 sm:p-7 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-border/60">
                <h3 className="font-display text-base sm:text-lg font-extrabold text-ink-950 flex items-center gap-2">
                  <Star className="size-4 text-amber-500 fill-amber-500" />
                  <span>
                    {language === "bn"
                      ? "শুভ বৈশিষ্ট্য ও রাশির কারকতা"
                      : language === "hi"
                      ? "शुभ गुण एवं राशि की विशेषताएं"
                      : "Lucky Attributes & Key Strengths"}
                  </span>
                </h3>
                <span className="text-xs text-muted-foreground">
                  {language === "bn" ? "শারীরিক শাসন:" : language === "hi" ? "शारीरिक नियंत्रण:" : "Body Governance:"}{" "}
                  <strong className="text-ink-950">{activeTraits.body_parts}</strong>
                </span>
              </div>

              {/* Attribute Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <div className="rounded-xl bg-surface-muted/60 p-3 border border-border/60 flex flex-col justify-start">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                    <Gem className="size-3 text-amber-600 shrink-0" />{" "}
                    <span>{language === "bn" ? "শুভ রত্ন" : language === "hi" ? "शुभ रत्न" : "Lucky Gem"}</span>
                  </p>
                  <p className="mt-1.5 font-extrabold text-ink-950 break-words leading-snug">{activeTraits.lucky_gemstone}</p>
                </div>

                <div className="rounded-xl bg-surface-muted/60 p-3 border border-border/60 flex flex-col justify-start">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                    <Palette className="size-3 text-indigo-600 shrink-0" />{" "}
                    <span>{language === "bn" ? "শুভ বর্ণ" : language === "hi" ? "शुभ रंग" : "Lucky Colors"}</span>
                  </p>
                  <p className="mt-1.5 font-extrabold text-ink-950 break-words leading-snug">{activeTraits.lucky_color}</p>
                </div>

                <div className="rounded-xl bg-surface-muted/60 p-3 border border-border/60 flex flex-col justify-start">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">
                    {language === "bn" ? "শুভ সংখ্যা" : language === "hi" ? "शुभ अंक" : "Lucky Numbers"}
                  </p>
                  <p className="mt-1.5 font-extrabold text-ink-950 break-words leading-snug">{result.traits.lucky_numbers.join(", ")}</p>
                </div>

                <div className="rounded-xl bg-surface-muted/60 p-3 border border-border/60 flex flex-col justify-start">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">
                    {language === "bn" ? "শুভ বার" : language === "hi" ? "शुभ दिन" : "Lucky Day"}
                  </p>
                  <p className="mt-1.5 font-extrabold text-ink-950 break-words leading-snug">{activeTraits.lucky_day}</p>
                </div>

                <div className="rounded-xl bg-surface-muted/60 p-3 border border-border/60 flex flex-col justify-start">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">
                    {language === "bn" ? "উপাস্য দেবতা" : language === "hi" ? "पूज्य देवता" : "Ruling Deity"}
                  </p>
                  <p className="mt-1.5 font-extrabold text-ink-950 break-words leading-snug">{activeTraits.ruling_deity}</p>
                </div>

                <div className="rounded-xl bg-surface-muted/60 p-3 border border-border/60 flex flex-col justify-start">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">
                    {language === "bn" ? "অনুকূল রাশি" : language === "hi" ? "अनुकूल राशियां" : "Compatible Signs"}
                  </p>
                  <p className="mt-1.5 font-extrabold text-ink-950 break-words leading-snug">
                    {activeTraits.compatible_rashis?.join(", ") || result.traits.compatible_rashis.join(", ")}
                  </p>
                </div>
              </div>

              {/* Strengths Pills with Crisp High-Contrast Text */}
              <div className="pt-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
                  {language === "bn" ? "ব্যক্তিত্বের প্রধান শক্তিসমূহ" : language === "hi" ? "व्यक्तित्व की प्रमुख विशेषताएं" : "Personality Strengths"}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {activeTraits.strengths.map((str, idx) => (
                    <span
                      key={idx}
                      className="rounded-xl bg-white text-ink-950 px-3.5 py-1.5 font-bold border border-amber-300/80 shadow-2xs hover:border-amber-400 transition-colors"
                    >
                      <span className="text-amber-600 mr-1.5 font-black">✦</span>
                      <span>{str}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 4b. Classical rules, every one traceable to a client document */}
            {result.client_rules && (
              <ClientRulesPanel
                profile={result.client_rules}
                ascendantProfile={result.ascendant_client_rules}
                kpReference={result.kp_reference}
                language={language}
              />
            )}

            {/* 5. Kundali Chart Visualization with Consistent Aesthetic */}
            <div className="rounded-[28px] border border-amber-300/80 bg-card p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border/60">
                <div>
                  <h3 className="font-display text-lg font-bold text-ink-950 flex items-center gap-2">
                    <Eye className="size-4 text-amber-600" />
                    <span>
                      {language === "bn"
                        ? "জন্ম কোষ্ঠী চক্র (Birth Kundali Chart)"
                        : language === "hi"
                        ? "जन्म कुंडली चक्र (Birth Kundali)"
                        : "Birth Kundali Chart Visualization"}
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {language === "bn"
                      ? `${result.ayanamsa_name} অয়নামশা অনুযায়ী লগ্ন ও ৯টি গ্রহের সঠিক অবস্থান`
                      : language === "hi"
                      ? `${result.ayanamsa_name} अयनांश अनुसार लग्न और ९ ग्रहों की सही स्थिति`
                      : `Ascendant (Lagna) and Moon placement calculated with ${result.ayanamsa_name}`}
                  </p>
                </div>

                {/* Style selector pills */}
                <div className="flex items-center gap-1.5 rounded-xl border border-border bg-surface-muted p-1 text-xs font-bold">
                  {(["north_indian", "south_indian", "east_indian"] as ChartStyleType[]).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setChartStyle(style)}
                      className={`rounded-lg px-2.5 py-1 transition-all ${
                        chartStyle === style
                          ? "bg-amber-500 text-amber-950 font-black shadow-2xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {style === "north_indian"
                        ? "North Indian"
                        : style === "south_indian"
                        ? "South Indian"
                        : "East Indian (বাংলা)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Renderer with Consistent Parchment/Cosmic Background */}
              <div className="py-2">
                <KundaliChart
                  planets={result.planets}
                  ascendantRashiIndex={result.ascendant_rashi_index}
                  chartStyle={chartStyle}
                  language={language}
                />
              </div>

              {/* Re-calculate Callouts */}
              <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    window.scrollTo({ top: 150, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="size-3.5" />
                  <span>
                    {language === "bn"
                      ? "অন্য জন্ম বিবরণ দিয়ে পুনরায় গণনা করুন"
                      : language === "hi"
                      ? "अन्य जन्म विवरण से पुनः गणना करें"
                      : "Recalculate with different details"}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <Link href="/appointments">
                    <Button size="sm" className="bg-amber-500 text-amber-950 font-black hover:bg-amber-400">
                      {language === "bn"
                        ? "অভিজ্ঞ জ্যোতিষীর সাথে বিস্তারিত পরামর্শ করুন"
                        : language === "hi"
                        ? "विस्तृत कुंडली विश्लेषण के लिए ज्योतिषी से परामर्श लें"
                        : "Consult an Astrologer for Detailed Kundali"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* 6. Interactive Moon Sign Wheel Diagram */}
            <div className="rounded-[28px] border border-border/80 bg-card p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="text-center space-y-1">
                <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                  {language === "bn"
                    ? "১২ রাশি ও ২৭ নক্ষত্রের মহাজাগতিক চক্র (Zodiac Wheel)"
                    : language === "hi"
                    ? "१२ राशि एवं २७ नक्षत्रों का ब्रह्मांडीय चक्र"
                    : "12 Zodiac Signs & 27 Nakshatras Interactive Wheel"}
                </h3>
                <p className="text-xs text-muted-foreground max-w-xl mx-auto">
                  {language === "bn"
                    ? "আপনার রাশি ও নক্ষত্রের তাৎক্ষণিক মহাজাগতিক অবস্থান নিচে আলোকিত করে নির্দেশ করা হয়েছে।"
                    : language === "hi"
                    ? "आपकी राशि एवं नक्षत्र की खगोलीय स्थिति नीचे चक्र में प्रदर्शित है।"
                    : "Your calculated Moon Sign and Nakshatra are illuminated on the zodiac mandala below."}
                </p>
              </div>

              <div className="flex justify-center py-4">
                <MoonSignWheel
                  activeRashiIndex={result.rashi_index}
                  activeNakshatraIndex={result.nakshatra_index}
                />
              </div>
            </div>

            {/* 7. How the chart was calculated - timezone, cusps and any caveat */}
            <CalculationDetails
              timezone={result.timezone_resolution}
              cusps={result.house_cusps}
              calculation={result.calculation}
              ayanamsaName={result.ayanamsa_name}
              houseSystem={result.house_system}
              language={language}
            />
          </div>
        )}

      </main>

      <SiteFooter />
    </>
  );
}
