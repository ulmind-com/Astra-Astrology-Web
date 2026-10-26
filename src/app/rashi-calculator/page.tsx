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
  Shield,
  Zap,
  BookOpen,
  Award,
  Activity,
  Flame,
  Layers,
  Radio,
  Info,
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
import { useFeaturePricing } from "@/hooks/use-feature-pricing";
import {
  FeatureCoinBadge,
  FeatureDisabledAlert,
  FeatureCoinModal,
} from "@/components/astrology/feature-pricing-banner";
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
  const { getFeature, checkAccess, walletBalance, refresh: refreshWallet } = useFeaturePricing();
  const rashiFeature = getFeature("rashi_calculator");
  const [coinModalOpen, setCoinModalOpen] = React.useState(false);
  const [coinModalReason, setCoinModalReason] = React.useState<"unauthorized" | "insufficient_coins" | "disabled">("insufficient_coins");

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

  // Tab & Chart Toggle State
  const [activeTab, setActiveTab] = React.useState<"core" | "rules" | "kundali" | "transit" | "predictions">("core");
  const [chartMode, setChartMode] = React.useState<"chandra" | "lagna">("chandra");

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

    const access = checkAccess("rashi_calculator");
    if (!access.allowed) {
      if (access.reason === "disabled") {
        toast.error(
          language === "bn"
            ? "রাশি ক্যালকুলেটর ফিচারটি বর্তমানে বন্ধ রাখা হয়েছে।"
            : "Rashi calculator feature is temporarily unavailable.",
        );
        return;
      }
      setCoinModalReason(access.reason || "insufficient_coins");
      setCoinModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const res = await astrologyApi.calculateRashi(payload);
      if (res) {
        setResult(res);
        if (access.requiredCoins > 0) {
          toast.success(
            language === "bn"
              ? `রাশি গণনা সম্পন্ন হয়েছে! (${access.requiredCoins} কয়েন খরচ হয়েছে)`
              : `Rashi calculated! (${access.requiredCoins} coins used)`,
          );
          refreshWallet();
        } else {
          toast.success(
            language === "bn"
              ? `চন্দ্রের অবস্থান: ${res.rashi_name_bn} রাশি (${res.nakshatra_name} নক্ষত্র)`
              : language === "hi"
              ? `गणना पूर्ण: ${res.rashi_name_hi} राशि (${res.nakshatra_name} नक्षत्र)`
              : `Calculated Moon Sign: ${res.rashi_name_en} (${res.rashi_name_hi})`,
          );
        }
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (err: any) {
      if (err?.code === "insufficient_coins") {
        setCoinModalReason("insufficient_coins");
        setCoinModalOpen(true);
      } else if (err?.code === "authentication_required" || err?.status === 401) {
        setCoinModalReason("unauthorized");
        setCoinModalOpen(true);
      } else {
        toast.error(err?.message || "Failed to calculate Rashi. Please check inputs.");
      }
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

          {/* Feature Coin Badge */}
          <div className="pt-2 flex justify-center">
            <FeatureCoinBadge
              feature={rashiFeature}
              walletBalance={walletBalance}
              language={language}
            />
          </div>

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

            {rashiFeature && !rashiFeature.enabled && (
              <div className="mb-6">
                <FeatureDisabledAlert
                  featureName={language === "bn" ? "রাশি ক্যালকুলেটর" : "Rashi Calculator"}
                  language={language}
                />
              </div>
            )}

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
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <FeatureCoinBadge
                  feature={rashiFeature}
                  walletBalance={walletBalance}
                  language={language}
                  showWallet={false}
                />

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading || (rashiFeature ? !rashiFeature.enabled : false)}
                  className="px-9 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-ink-950 font-black text-sm shadow-[0_8px_24px_rgba(234,179,8,0.35)] hover:shadow-[0_12px_32px_rgba(234,179,8,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
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
                        {rashiFeature && !rashiFeature.enabled
                          ? language === "bn"
                            ? "ফিচারটি বন্ধ রয়েছে"
                            : "Feature Disabled"
                          : language === "bn"
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

                {/* Vargottama Moon Badge */}
                {result.is_vargottama && (
                  <div className="mt-3.5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-amber-500/20 border-2 border-amber-400 px-4 py-1.5 text-xs font-black text-amber-950 shadow-sm animate-pulse">
                    <Award className="size-4 text-amber-600 fill-amber-500 shrink-0" />
                    <span>
                      {language === "bn"
                        ? "পরম শুভ বর্গোত্তম চন্দ্র (Vargottama Moon) — জন্ম রাশি (D1) ও নবাংশ (D9) উভয় চক্রেই একই রাশিতে অবস্থিত!"
                        : language === "hi"
                        ? "परम शुभ वर्गोत्तम चंद्र (Vargottama Moon) — लग्न (D1) एवं नवांश (D9) दोनों चक्रों में एक ही राशि में स्थित!"
                        : "Sacred Vargottama Moon — Positioned in the same sign in both D1 & D9 Navamsha!"}
                    </span>
                  </div>
                )}
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

            {/* 3. 5-Tab Navigation System */}
            <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 p-1.5 rounded-2xl bg-surface-muted border border-border/80 shadow-inner scrollbar-none">
              {[
                { id: "core", labelBn: "অবকহড়া ও মূল চক্র", labelHi: "अवकहड़ा एवं मूल चक्र", labelEn: "Core & Avakahada", icon: Sparkles },
                { id: "rules", labelBn: "১৫টি শাস্ত্রীয় নিয়ম (01.pdf)", labelHi: "१५ शास्त्रीय नियम", labelEn: "15 Classical Rules", icon: BookOpen },
                { id: "kundali", labelBn: "চন্দ্র লগ্ন ও গ্রহ সম্বন্ধ", labelHi: "चंद्र लग्न एवं ग्रह संबंध", labelEn: "Chandra Lagna & Dignity", icon: Eye },
                { id: "transit", labelBn: "লাইভ গোচর ও সাড়ে সাতি", labelHi: "लाइव गोचर एवं साढ़े साती", labelEn: "Transit & Sade Sati", icon: Activity },
                { id: "predictions", labelBn: "সতর্কতা, প্রতিকার ও জীবন", labelHi: "सावधानियां एवं उपाय", labelEn: "Cautions & Remedies", icon: Shield },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-amber-500 text-amber-950 font-black shadow-md shadow-amber-500/20 scale-[1.02]"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/70"
                    }`}
                  >
                    <Icon className={`size-4 ${isActive ? "text-amber-950" : "text-muted-foreground"}`} />
                    <span>{language === "bn" ? tab.labelBn : language === "hi" ? tab.labelHi : tab.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* =========================================================================
                TAB 1: CORE RASHI & AVAKAHADA CHAKRA
            ========================================================================= */}
            {activeTab === "core" && (
              <div className="space-y-6 animate-in fade-in-50 duration-300">
                {/* Avakahada Chakra Grid */}
                <div className="rounded-[28px] border border-amber-300/80 bg-card p-6 sm:p-8 shadow-2xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border/60">
                    <div>
                      <h3 className="font-display text-lg font-bold text-ink-950 flex items-center gap-2">
                        <Sparkles className="size-4 text-amber-600" />
                        <span>
                          {language === "bn"
                            ? "মহাজাগতিক অবকহড়া চক্র (Avakahada Chakra)"
                            : language === "hi"
                            ? "वैदिक अवकहड़ा चक्र (Avakahada Chakra)"
                            : "Vedic Avakahada Chakra Attributes"}
                        </span>
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {language === "bn"
                          ? "ক্লায়েন্টের ম্যাচমেকিং ও কুণ্ডলী শাস্ত্রের মূল ৭টি বৈশিষ্ট্য এবং বৈদিক নামাক্ষর"
                          : language === "hi"
                          ? "क्लाइंट के कुंडली शास्त्र अनुसार प्रमुख ७ गुण एवं वैदिक नामाक्षर"
                          : "Foundational 7 attributes transcribed from classical Vedic matchmaking documents"}
                      </p>
                    </div>

                    {result.namakshar && (
                      <div className="inline-flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-300 px-3.5 py-1.5 text-xs font-black text-amber-950 shadow-2xs">
                        <Star className="size-3.5 text-amber-600 fill-amber-500" />
                        <span>
                          {language === "bn" ? "শুভ নামাক্ষর:" : language === "hi" ? "शुभ नामाक्षर:" : "Auspicious Letter:"}{" "}
                          <strong className="text-base text-amber-800 ml-1 font-mono">{result.namakshar}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 6 Avakahada Pillars Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                    <div className="rounded-xl bg-surface-muted/60 p-3.5 border border-border/60">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {language === "bn" ? "১. বর্ণ (Varna)" : language === "hi" ? "१. वर्ण (Varna)" : "1. Varna"}
                      </p>
                      <p className="mt-1 font-extrabold text-ink-950 text-sm">
                        {result.avakahada_chakra?.varna || activeTraits.element}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {language === "bn" ? "স্বভাবগত শ্রেণী" : "Temperament"}
                      </span>
                    </div>

                    <div className="rounded-xl bg-surface-muted/60 p-3.5 border border-border/60">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {language === "bn" ? "২. বশ্য (Vashya)" : language === "hi" ? "२. वश्य (Vashya)" : "2. Vashya"}
                      </p>
                      <p className="mt-1 font-extrabold text-ink-950 text-sm">
                        {result.avakahada_chakra?.vashya || "—"}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {language === "bn" ? "নিয়ন্ত্রণ ও আকর্ষণ" : "Influence"}
                      </span>
                    </div>

                    <div className="rounded-xl bg-surface-muted/60 p-3.5 border border-border/60">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {language === "bn" ? "৩. যোনি প্রাণী (Yoni)" : language === "hi" ? "३. योनि (Yoni)" : "3. Yoni Animal"}
                      </p>
                      <p className="mt-1 font-extrabold text-ink-950 text-sm">
                        {result.avakahada_chakra?.yoni || "—"}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {language === "bn" ? "জৈবিক প্রবৃত্তি" : "Instinct"}
                      </span>
                    </div>

                    <div className="rounded-xl bg-surface-muted/60 p-3.5 border border-border/60">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {language === "bn" ? "৪. গণ (Gana)" : language === "hi" ? "४. गण (Gana)" : "4. Gana"}
                      </p>
                      <p className="mt-1 font-extrabold text-ink-950 text-sm">
                        {result.avakahada_chakra?.gana || "—"}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {language === "bn" ? "মানসিক চরিত্র" : "Disposition"}
                      </span>
                    </div>

                    <div className="rounded-xl bg-surface-muted/60 p-3.5 border border-border/60">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {language === "bn" ? "৫. নাড়ী (Nadi)" : language === "hi" ? "५. नाड़ी (Nadi)" : "5. Nadi"}
                      </p>
                      <p className="mt-1 font-extrabold text-ink-950 text-sm">
                        {result.avakahada_chakra?.nadi || "—"}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {language === "bn" ? "শারীরিক ধারা" : "Physiology"}
                      </span>
                    </div>

                    <div className="rounded-xl bg-surface-muted/60 p-3.5 border border-border/60">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {language === "bn" ? "৬. তত্ত্ব (Tatva)" : language === "hi" ? "६. तत्व (Tatva)" : "6. Tatva"}
                      </p>
                      <p className="mt-1 font-extrabold text-ink-950 text-sm">
                        {result.avakahada_chakra?.tatva || activeTraits.element}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {language === "bn" ? "মহাজাগতিক মৌল" : "Cosmic Element"}
                      </span>
                    </div>
                  </div>

                  {/* Paya Analysis Banner */}
                  {result.avakahada_chakra?.paya && (
                    <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="size-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-700 shrink-0 shadow-xs">
                        <Award className="size-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-display text-sm font-extrabold text-ink-950">
                            {language === "bn" ? "জন্মকালীন পায়া (Paya of Birth):" : language === "hi" ? "जन्म कालीन पाया (Paya):" : "Birth Foot (Paya):"}
                          </h4>
                          <span className="rounded-md bg-amber-100 text-amber-950 border border-amber-300 px-2.5 py-0.5 text-xs font-black shadow-2xs">
                            {result.avakahada_chakra.paya.split("-")[0].trim()}
                          </span>
                        </div>
                        <p className="text-xs text-ink-800 leading-relaxed font-medium">
                          {result.avakahada_chakra.paya}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Navamsha (D9) Moon Details */}
                  <div className="pt-2 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-indigo-600" />
                      <span className="text-muted-foreground">
                        {language === "bn" ? "নবাংশ রাশি (D9 Navamsha Moon):" : language === "hi" ? "नवांश राशि (D9 Navamsha):" : "Navamsha Moon Sign (D9):"}
                      </span>
                      <strong className="text-ink-950 font-extrabold">
                        {language === "bn" ? result.navamsha_rashi_name_bn : language === "hi" ? result.navamsha_rashi_name_hi : result.navamsha_rashi_name_en}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {language === "bn" ? "বর্গোত্তম স্ট্যাটাস:" : "Vargottama Status:"}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                        result.is_vargottama
                          ? "bg-emerald-100 text-emerald-950 border border-emerald-300"
                          : "bg-surface-muted text-muted-foreground border border-border"
                      }`}>
                        {result.is_vargottama
                          ? (language === "bn" ? "বর্গোত্তম (অত্যন্ত বলবান)" : "Vargottama (Supreme Fortitude)")
                          : (language === "bn" ? "সাধারণ নবাংশ" : "Standard Navamsha")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 12 Zodiac Signs & 27 Nakshatras Interactive Wheel */}
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
              </div>
            )}

            {/* =========================================================================
                TAB 2: 15 CLASSICAL CLASSIFICATIONS (01.PDF)
            ========================================================================= */}
            {activeTab === "rules" && (
              <div className="space-y-6 animate-in fade-in-50 duration-300">
                {result.client_rules ? (
                  <ClientRulesPanel
                    profile={result.client_rules}
                    ascendantProfile={result.ascendant_client_rules}
                    kpReference={result.kp_reference}
                    language={language}
                  />
                ) : (
                  <div className="rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground text-xs">
                    {language === "bn" ? "শাস্ত্রীয় নিয়মের তথ্য উপলব্ধ নয়।" : "Classical rules data not available."}
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                TAB 3: CHANDRA LAGNA KUNDLI & PLANETARY DIGNITY
            ========================================================================= */}
            {activeTab === "kundali" && (
              <div className="space-y-6 animate-in fade-in-50 duration-300">
                {/* Kundali Chart Visualizer with Chandra Lagna Toggle */}
                <div className="rounded-[28px] border border-amber-300/80 bg-card p-6 sm:p-8 shadow-2xs space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border/60">
                    <div>
                      <h3 className="font-display text-lg font-bold text-ink-950 flex items-center gap-2">
                        <Eye className="size-4 text-amber-600" />
                        <span>
                          {chartMode === "chandra"
                            ? (language === "bn" ? "চন্দ্র লগ্ন কুষ্ঠী চক্র (Chandra Lagna Chart)" : "Chandra Lagna Kundali Chart")
                            : (language === "bn" ? "জন্ম লগ্ন কুষ্ঠী চক্র (Janma Lagna D1 Chart)" : "Janma Lagna D1 Kundali Chart")}
                        </span>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {chartMode === "chandra"
                          ? (language === "bn"
                              ? "চন্দ্রকে ১ম ভাব (লগ্ন) ধরে মানসিক স্থিতি, দৃষ্টিভঙ্গি ও গোচর প্রভাব নির্ণয়ের প্রামাণ্য চার্ট"
                              : "Moon placed in 1st House for psychological resilience and transit evaluation")
                          : (language === "bn"
                              ? `${result.ayanamsa_name} অয়নামশা অনুসারে জন্ম লগ্ন ও ৯টি গ্রহের মূল অবস্থান`
                              : `Ascendant (Lagna) and 9 planets in natal birth horoscope with ${result.ayanamsa_name}`)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Dual Chart Toggle */}
                      <div className="flex items-center gap-1 rounded-xl border border-amber-300 bg-amber-50/50 p-1 text-xs font-black shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setChartMode("chandra")}
                          className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                            chartMode === "chandra"
                              ? "bg-amber-500 text-amber-950 shadow-xs"
                              : "text-amber-900/80 hover:text-amber-950 hover:bg-amber-100/50"
                          }`}
                        >
                          {language === "bn" ? "চন্দ্র লগ্ন চক্র" : language === "hi" ? "चंद्र लग्न चक्र" : "Chandra Lagna"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setChartMode("lagna")}
                          className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                            chartMode === "lagna"
                              ? "bg-amber-500 text-amber-950 shadow-xs"
                              : "text-amber-900/80 hover:text-amber-950 hover:bg-amber-100/50"
                          }`}
                        >
                          {language === "bn" ? "লগ্ন চক্র (D1)" : language === "hi" ? "लग्न चक्र (D1)" : "Lagna D1"}
                        </button>
                      </div>

                      {/* Style selector pills */}
                      <div className="flex items-center gap-1 rounded-xl border border-border bg-surface-muted p-1 text-xs font-bold">
                        {(["north_indian", "south_indian", "east_indian"] as ChartStyleType[]).map((style) => (
                          <button
                            key={style}
                            type="button"
                            onClick={() => setChartStyle(style)}
                            className={`rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
                              chartStyle === style
                                ? "bg-card text-foreground font-black shadow-2xs border border-border/60"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {style === "north_indian"
                              ? "North"
                              : style === "south_indian"
                              ? "South"
                              : "বাংলা"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Chart Renderer */}
                  <div className="py-2">
                    <KundaliChart
                      planets={chartMode === "chandra" && result.chandra_lagna_planets?.length ? result.chandra_lagna_planets : result.planets}
                      ascendantRashiIndex={chartMode === "chandra" ? result.rashi_index : result.ascendant_rashi_index}
                      chartStyle={chartStyle}
                      language={language}
                    />
                  </div>
                </div>

                {/* Classical Planetary Dignity Matrix */}
                {result.planetary_dignity && (
                  <div className="rounded-[28px] border border-amber-300/80 bg-card p-6 sm:p-8 shadow-2xs space-y-5">
                    <div className="pb-3 border-b border-border/60">
                      <h3 className="font-display text-base sm:text-lg font-extrabold text-ink-950 flex items-center gap-2">
                        <Award className="size-4 text-amber-600" />
                        <span>
                          {language === "bn"
                            ? `এই রাশিতে গ্রহদের উচ্চ-নীচ ও নৈসর্গিক মৈত্রী সম্বন্ধ`
                            : language === "hi"
                            ? `इस राशि में ग्रहों का उच्च-नीच एवं नैसर्गिक मैत्री संबंध`
                            : `Planetary Dignities & Natural Friendships for ${result.rashi_name_en}`}
                        </span>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {language === "bn"
                          ? "সূত্র: ক্লায়েন্টের রিসোর্স নথি 'Basics of Kundali Reading Explained' (পৃষ্ঠা ১-৫)"
                          : "Source: Client Resource Document 'Basics of Kundali Reading Explained' (pp. 1-5)"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Exalted & Debilitated */}
                      <div className="rounded-2xl border border-border/80 bg-surface-muted/50 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                            <CheckCircle2 className="size-4 text-emerald-600" />
                            <span>{language === "bn" ? "উচ্চ গ্রহ (Exalted Graha):" : "Exalted Planets:"}</span>
                          </span>
                          <span className="font-extrabold text-ink-950">
                            {result.planetary_dignity.exalted_planets?.length
                              ? result.planetary_dignity.exalted_planets.join(", ")
                              : (language === "bn" ? "কোনো গ্রহ উচ্চ নয়" : "None")}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border/60">
                          <span className="font-bold text-rose-800 flex items-center gap-1.5">
                            <AlertTriangle className="size-4 text-rose-600" />
                            <span>{language === "bn" ? "নীচ গ্রহ (Debilitated Graha):" : "Debilitated Planets:"}</span>
                          </span>
                          <span className="font-extrabold text-ink-950">
                            {result.planetary_dignity.debilitated_planets?.length
                              ? result.planetary_dignity.debilitated_planets.join(", ")
                              : (language === "bn" ? "কোনো গ্রহ নীচ নয়" : "None")}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border/60">
                          <span className="font-bold text-indigo-800 flex items-center gap-1.5">
                            <Star className="size-4 text-indigo-600" />
                            <span>{language === "bn" ? "মূলত্রিকোণ / স্বক্ষেত্র:" : "Moolatrikona / Own:"}</span>
                          </span>
                          <span className="font-extrabold text-ink-950">
                            {result.planetary_dignity.moolatrikona || result.planetary_dignity.own_lord}
                          </span>
                        </div>
                      </div>

                      {/* Natural Friendships of Ruling Lord */}
                      <div className="rounded-2xl border border-border/80 bg-surface-muted/50 p-4 space-y-2.5">
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                          {language === "bn"
                            ? `${result.rashi_lord} গ্রহের নৈসর্গিক মৈত্রী (Friendship Table)`
                            : `Natural Friendships of Lord ${result.rashi_lord}`}
                        </p>

                        <div className="flex items-start gap-2 pt-1">
                          <span className="rounded-md bg-emerald-100 text-emerald-950 px-2 py-0.5 font-bold text-[10px] shrink-0">
                            {language === "bn" ? "মিত্র (Friends)" : "Friends"}
                          </span>
                          <span className="text-ink-950 font-medium">
                            {result.planetary_dignity.ruler_friends?.join(", ") || "—"}
                          </span>
                        </div>

                        <div className="flex items-start gap-2 pt-1 border-t border-border/40">
                          <span className="rounded-md bg-rose-100 text-rose-950 px-2 py-0.5 font-bold text-[10px] shrink-0">
                            {language === "bn" ? "শত্রু (Enemies)" : "Enemies"}
                          </span>
                          <span className="text-ink-950 font-medium">
                            {result.planetary_dignity.ruler_enemies?.length
                              ? result.planetary_dignity.ruler_enemies.join(", ")
                              : (language === "bn" ? "কোনো শত্রু গ্রহ নেই (None)" : "No natural enemies")}
                          </span>
                        </div>

                        <div className="flex items-start gap-2 pt-1 border-t border-border/40">
                          <span className="rounded-md bg-amber-100 text-amber-950 px-2 py-0.5 font-bold text-[10px] shrink-0">
                            {language === "bn" ? "সম (Neutrals)" : "Neutrals"}
                          </span>
                          <span className="text-ink-950 font-medium">
                            {result.planetary_dignity.ruler_neutrals?.join(", ") || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                TAB 4: REAL-TIME TRANSIT, CHANDRA BALA & SADE SATI
            ========================================================================= */}
            {activeTab === "transit" && (
              <div className="space-y-6 animate-in fade-in-50 duration-300">
                {/* 1. Chandra Bala Meter */}
                {result.chandra_bala && (
                  <div className="rounded-[28px] border border-amber-300/80 bg-card p-6 sm:p-8 shadow-2xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/60">
                      <div>
                        <h3 className="font-display text-base sm:text-lg font-extrabold text-ink-950 flex items-center gap-2">
                          <Activity className="size-4 text-amber-600" />
                          <span>
                            {language === "bn"
                              ? "বর্তমান চন্দ্র বল গোচর (Real-Time Chandra Bala)"
                              : language === "hi"
                              ? "वर्तमान चंद्र बल गोचर"
                              : "Current Chandra Bala (Lunar Transit Strength)"}
                          </span>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {language === "bn"
                            ? "আজকের দিনে চন্দ্র আপনার জন্ম রাশি থেকে কোন রাশিতে ভ্রমণ করছে তার ভিত্তিতে শুভাশুভ বল"
                            : "Daily transit evaluation of Moon relative to your Natal Moon Sign"}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span className={`px-3.5 py-1.5 rounded-xl font-black text-xs shadow-2xs border ${
                        result.chandra_bala.house_from_natal_moon === 8
                          ? "bg-rose-100 text-rose-950 border-rose-300 animate-pulse"
                          : result.chandra_bala.is_auspicious
                          ? "bg-emerald-100 text-emerald-950 border-emerald-300"
                          : "bg-amber-100 text-amber-950 border-amber-300"
                      }`}>
                        {result.chandra_bala.status_label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="rounded-xl bg-surface-muted/60 p-3.5 border border-border/60">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">
                          {language === "bn" ? "চন্দ্রের বর্তমান রাশি" : "Transiting Moon Sign"}
                        </p>
                        <p className="mt-1 font-extrabold text-ink-950 text-base">
                          {result.chandra_bala.current_moon_sign_name}
                        </p>
                      </div>

                      <div className="rounded-xl bg-surface-muted/60 p-3.5 border border-border/60">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">
                          {language === "bn" ? "জন্ম রাশি থেকে ভাব" : "House from Natal Moon"}
                        </p>
                        <p className="mt-1 font-extrabold text-amber-700 text-base">
                          {result.chandra_bala.house_from_natal_moon}
                          <span className="text-xs text-muted-foreground ml-1">
                            {language === "bn" ? "ম ভাব" : "th House"}
                          </span>
                        </p>
                      </div>

                      <div className="rounded-xl bg-surface-muted/60 p-3.5 border border-border/60">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">
                          {language === "bn" ? "ফল নির্ণয়" : "Result Category"}
                        </p>
                        <p className="mt-1 font-extrabold text-ink-950 text-sm">
                          {result.chandra_bala.house_from_natal_moon === 8
                            ? (language === "bn" ? "চন্দ্রাষ্টম (সতর্কতা)" : "Chandrashtama")
                            : result.chandra_bala.is_auspicious
                            ? (language === "bn" ? "পরম শুভ ও সহায়ক" : "Highly Auspicious")
                            : (language === "bn" ? "সাধারণ / নিরপেক্ষ" : "Neutral / Moderate")}
                        </p>
                      </div>
                    </div>

                    {/* Narrative Description & Advice */}
                    <div className="rounded-2xl border border-border/80 bg-surface-muted/40 p-4 sm:p-5 space-y-2">
                      <p className="text-xs sm:text-[13px] text-ink-950 leading-relaxed font-medium">
                        {result.chandra_bala.description}
                      </p>
                      <p className="text-[11px] text-muted-foreground italic pt-1 border-t border-border/40">
                        {language === "bn"
                          ? "শাস্ত্রীয় নিয়ম: জন্ম রাশি থেকে ১, ৩, ৬, ৭, ১০, ১১ ভাবে চন্দ্র শুভফলদায়ক; ২, ৫, ৯ মধ্যম; ৪, ৮, ১২ ভাবে সতর্কতা কাম্য।"
                          : "Classical Muhurta rule: 1st, 3rd, 6th, 7th, 10th, 11th from Moon are auspicious; 4th, 8th, 12th demand mindfulness."}
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. Saturn Sade Sati & Dhaiya Tracker */}
                {result.sade_sati_status && (
                  <div className="rounded-[28px] border border-amber-300/80 bg-card p-6 sm:p-8 shadow-2xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/60">
                      <div>
                        <h3 className="font-display text-base sm:text-lg font-extrabold text-ink-950 flex items-center gap-2">
                          <Shield className="size-4 text-amber-600" />
                          <span>
                            {language === "bn"
                              ? "শনির সাড়ে সাতি ও ধাইয়া ট্র্যাকার (Saturn Sade Sati Tracker)"
                              : language === "hi"
                              ? "शनि साढ़े साती एवं ढैया ट्रैकर"
                              : "Saturn Sade Sati & Dhaiya Transit Tracker"}
                          </span>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {language === "bn"
                            ? "জন্ম রাশি সাপেক্ষে শনির বর্তমান গোচর অবস্থান ও শাস্ত্রসম্মত উপশম"
                            : "Real-time planetary analysis of Saturn's current transit relative to your Moon Sign"}
                        </p>
                      </div>

                      <span className={`px-3.5 py-1.5 rounded-xl font-black text-xs shadow-2xs border ${
                        result.sade_sati_status.is_active
                          ? result.sade_sati_status.impact_level === "high"
                            ? "bg-rose-100 text-rose-950 border-rose-300"
                            : "bg-amber-100 text-amber-950 border-amber-300"
                          : "bg-emerald-100 text-emerald-950 border-emerald-300"
                      }`}>
                        {result.sade_sati_status.is_active
                          ? (language === "bn" ? "প্রভাব সক্রিয়" : "Active Transit")
                          : (language === "bn" ? "অনুকূল অবস্থা" : "Favorable Transit")}
                      </span>
                    </div>

                    {/* Phase Title Card */}
                    <div className="rounded-2xl border border-amber-300/60 bg-gradient-to-r from-amber-500/10 via-card to-card p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">
                            {language === "bn" ? "শনির বর্তমান পর্যায়" : "Active Phase"}
                          </p>
                          <h4 className="font-display text-base sm:text-lg font-black text-ink-950 mt-0.5">
                            {result.sade_sati_status.phase_title}
                          </h4>
                        </div>
                        <span className="text-xs text-ink-800 font-bold">
                          {language === "bn" ? "শনির রাশি:" : "Saturn Sign:"}{" "}
                          <strong className="text-amber-800">{result.sade_sati_status.saturn_sign_name}</strong>{" "}
                          ({result.sade_sati_status.saturn_house_from_moon}
                          {language === "bn" ? "ম ভাব" : "th House"})
                        </span>
                      </div>

                      <p className="mt-3 text-xs sm:text-[13px] text-ink-900 leading-relaxed font-medium">
                        {result.sade_sati_status.description}
                      </p>
                    </div>

                    {/* Authentic Remedy Banner */}
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.05] p-4 sm:p-5 space-y-1.5">
                      <div className="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase tracking-wider">
                        <CheckCircle2 className="size-4" />
                        <span>{language === "bn" ? "শাস্ত্রসম্মত শনি শান্তি প্রতিকার:" : "Prescribed Classical Remedy:"}</span>
                      </div>
                      <p className="text-xs sm:text-[13px] text-ink-950 font-medium leading-relaxed">
                        {result.sade_sati_status.remedy_summary}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                TAB 5: PREDICTIONS, CAUTIONS & BENEFICIAL REMEDIES
            ========================================================================= */}
            {activeTab === "predictions" && (
              <div className="space-y-6 animate-in fade-in-50 duration-300">
                {/* Warnings and Beneficial Actions Dual Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Warnings & Cautions */}
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

                  {/* Beneficial Actions & Remedies */}
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

                {/* Lucky Attributes & Strengths */}
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
                      {language === "bn" ? "শারীরিক শাসন (কালপুরুষ):" : "Kalapurusha Governance:"}{" "}
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

                  {/* Strengths Pills */}
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
              </div>
            )}

            {/* Bottom Actions: Recalculate & Consult CTA */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  window.scrollTo({ top: 150, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
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

      <FeatureCoinModal
        open={coinModalOpen}
        onClose={() => setCoinModalOpen(false)}
        featureName={rashiFeature?.name || (language === "bn" ? "রাশি ক্যালকুলেটর" : "Rashi Calculator")}
        requiredCoins={rashiFeature?.coins ?? 10}
        walletBalance={walletBalance}
        reason={coinModalReason}
        language={language}
      />

      <SiteFooter />
    </>
  );
}
