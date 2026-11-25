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
  Search,
  HelpCircle,
  Check,
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
import {
  RASHI_I18N,
  translatePlanetList,
  translateRashiList,
  translatePayaBadge,
} from "@/lib/rashi-translations";
import {
  RASHI_ASTROTALK_ROLE,
  ALL_12_MOON_SIGNS,
  RASHI_ELEMENT_COMPATIBILITY,
  RASHI_FAQS,
  RASHI_RELATED_TOOLS,
} from "@/lib/rashi-guide-data";
import {
  translatePlanetName,
  translateRashiName,
  translateNakshatraName,
  toLocalizedDigits,
} from "@/lib/kundli-translations";
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

  // Centralized Global Language Selection for Output & UI (English, বাংলা, हिन्दी)
  const { language, setLanguage } = useLanguage();
  const t = RASHI_I18N[language] || RASHI_I18N.en;
  const lastPayloadRef = React.useRef<RashiCalculatePayload | null>(null);

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

  // Astrotalk Guide State
  const [expandedHero, setExpandedHero] = React.useState(false);
  const [rashiSearch, setRashiSearch] = React.useState("");
  const [selectedElementFilter, setSelectedElementFilter] = React.useState<string>("all");
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(null);

  const filteredRashis = React.useMemo(() => {
    return ALL_12_MOON_SIGNS.filter((item) => {
      if (selectedElementFilter !== "all") {
        const el = item.element.en.toLowerCase();
        if (!el.includes(selectedElementFilter.toLowerCase())) return false;
      }
      if (!rashiSearch.trim()) return true;
      const q = rashiSearch.toLowerCase().trim();
      return (
        item.name.en.toLowerCase().includes(q) ||
        item.name.bn.toLowerCase().includes(q) ||
        item.name.hi.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.ruler.en.toLowerCase().includes(q) ||
        item.ruler.bn.toLowerCase().includes(q) ||
        item.ruler.hi.toLowerCase().includes(q)
      );
    });
  }, [rashiSearch, selectedElementFilter]);

  // Auto re-calculate when language preference changes so backend-generated narratives update instantly
  React.useEffect(() => {
    if (!lastPayloadRef.current || !result) return;
    if (lastPayloadRef.current.language === language) return;
    const nextPayload = { ...lastPayloadRef.current, language };
    lastPayloadRef.current = nextPayload;
    astrologyApi
      .calculateRashi(nextPayload)
      .then((res) => {
        if (res) setResult(res);
      })
      .catch(() => {});
  }, [language, result]);

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
    lastPayloadRef.current = null;
    toast.info(t.toastFormCleared);
  };

  // Re-sync with profile
  const handleReloadFromProfile = () => {
    if (profile) {
      populateFromProfileData(profile, user);
      toast.success(t.toastProfileLoaded);
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
      toast.error(t.toastNameRequired);
      return;
    }

    // 1. Mandatory Date of Birth (DOB) Validation
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (isNaN(d) || d < 1 || d > 31 || isNaN(m) || m < 1 || m > 12 || isNaN(y) || y < 1900) {
      toast.error(t.toastDobRequired);
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
        toast.error(t.toastTobInvalid);
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
      toast.error(t.toastPlaceRequired);
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
        toast.error(t.featureDisabled);
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
        lastPayloadRef.current = payload;
        if (access.requiredCoins > 0) {
          toast.success(
            language === "bn"
              ? `রাশি গণনা সম্পন্ন হয়েছে! (${access.requiredCoins} কয়েন খরচ হয়েছে)`
              : language === "hi"
              ? `राशि गणना पूर्ण! (${access.requiredCoins} सिक्के प्रयुक्त)`
              : `Rashi calculated! (${access.requiredCoins} coins used)`,
          );
          refreshWallet();
        } else {
          toast.success(
            t.toastCalculationSuccess(
              language === "bn"
                ? res.rashi_name_bn
                : language === "hi"
                ? res.rashi_name_hi
                : res.rashi_name_en,
              translateNakshatraName(res.nakshatra_name, language)
            )
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
    <div className="min-h-screen bg-[#fbf6f3]/70 text-stone-900 flex flex-col font-sans pb-24 selection:bg-amber-100 selection:text-amber-900">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 lg:px-8 space-y-8 flex-1">
        {/* =========================================================================
            1. BREADCRUMB & LANGUAGE SWITCHER
        ========================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold tracking-wider uppercase text-stone-400">
            <Link href="/" className="hover:text-amber-700 transition-colors">HOME</Link>
            <span>&gt;</span>
            <span className="text-stone-700">RASHI CALCULATOR</span>
          </div>

          <div className="flex items-center gap-1 rounded-full border border-stone-200 bg-white p-1 shadow-2xs">
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
                className={`min-h-7 inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-all cursor-pointer ${
                  language === lang.code
                    ? "bg-[#f39419] text-stone-950 shadow-2xs font-extrabold"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            2. HERO SECTION: Compact left title, faint gold rotating zodiac wheel on right
        ========================================================================= */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-r from-amber-50/50 via-white to-amber-50/30 px-4 sm:px-6 py-5 shadow-2xs">
          {/* Faint rotating golden zodiac wheel in background top-right */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/zodiac-wheel-gold.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 size-[260px] sm:size-[340px] select-none opacity-[0.16] mix-blend-multiply animate-spin [animation-duration:120s] motion-reduce:animate-none"
          />

          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-900">
              <Sparkles className="size-3 text-amber-600" />
              <span>{t.badge}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
              {language === "bn"
                ? "রাশি (চন্দ্র রাশি) ক্যালকুলেটর: জন্ম তারিখ ও সময় অনুযায়ী"
                : language === "hi"
                ? "राशि (चंद्र राशि) कैलकुलेटर: जन्म तिथि व समय के अनुसार"
                : "Rashi (Moon Sign) Calculator by Date of Birth & Time"}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {expandedHero
                ? (language === "bn"
                    ? "কীভাবে নিজের জন্ম রাশি জানতে হয় — এটি বহু মানুষের সাধারণ জিজ্ঞাসা। রাশি শুধুমাত্র মানুষের সঙ্গে আপনার সামঞ্জস্য নির্দেশ করে না, বরং মানসিক চাপ সামলানোর কৌশল এবং ক্যারিয়ারের সঠিক পছন্দ বেছে নিতে সাহায্য করে। চন্দ্র রাশি ক্যালকুলেটর ব্যবহার করে তাৎক্ষণিক ফলাফল পান।"
                    : language === "hi"
                    ? "अपनी चंद्र राशि कैसे जानें—यह अधिकांश लोगों की मुख्य जिज्ञासा होती है। यह न केवल दूसरों के साथ अनुकूलता बताती है, बल्कि तनाव से निपटने और सही करियर चुनने में भी मार्गदर्शन करती है। चंद्र राशि कैलकुलेटर से तुरंत फल प्राप्त करें।"
                    : "How to find moon sign is a common question for many. It not only reveals how compatible you are with another person, but also your coping mechanisms with stress, and helps you make better career choices. Use the moon sign calculator to get instant results.")
                : (language === "bn"
                    ? "কীভাবে নিজের জন্ম রাশি জানতে হয় — এটি বহু মানুষের সাধারণ জিজ্ঞাসা। রাশি সম্পর্কের সামঞ্জস্য ও মানসিক চাপের মোকাবিলা..."
                    : language === "hi"
                    ? "अपनी चंद्र राशि कैसे जानें—यह जिज्ञासा अनुकूलता और करियर चयन में..."
                    : "How to find moon sign is a common question for many. It not only reveals how compatible you are with another person, but also your coping mechanisms with stress...")}
              <button
                type="button"
                onClick={() => setExpandedHero(!expandedHero)}
                className="ml-1.5 font-bold text-amber-700 hover:text-amber-900 hover:underline inline-flex items-center cursor-pointer"
              >
                {expandedHero
                  ? (language === "bn" ? "কম দেখুন" : language === "hi" ? "कम देखें" : "Read less")
                  : (language === "bn" ? "আরও পড়ুন" : language === "hi" ? "और पढ़ें" : "Read more")}
              </button>
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {isSignedIn && profile && (
                <button
                  type="button"
                  onClick={handleReloadFromProfile}
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 hover:border-amber-400 bg-white/90 hover:bg-amber-50/70 px-3 py-1 text-xs font-semibold text-stone-700 hover:text-stone-900 transition-colors shadow-2xs cursor-pointer"
                >
                  <User className="size-3.5 text-amber-600" />
                  <span>{t.reloadProfile}</span>
                </button>
              )}

              <FeatureCoinBadge
                feature={rashiFeature}
                walletBalance={walletBalance}
                language={language}
              />
            </div>
          </div>
        </div>

        {/* Section title above form */}
        <div className="space-y-0.5 pt-1">
          <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900">
            {language === "bn"
              ? "রাশি ক্যালকুলেটর"
              : language === "hi"
              ? "राशि कैलकुलेटर"
              : "Rashi Calculator"}
          </h2>
          <p className="text-xs text-stone-500">
            {language === "bn"
              ? "আপনার রাশি (চন্দ্র রাশি) জানতে জন্ম বিবরণ লিখুন"
              : language === "hi"
              ? "अपनी राशि जानने के लिए जन्म विवरण दर्ज करें"
              : "Enter your birth details to calculate your rashi (zodiac sign)"}
          </p>
        </div>

        {/* =========================================================================
            3. ULTRA-PRO BIRTH DETAILS INPUT FORM (Astrotalk Luxury Style)
        ========================================================================= */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-4 sm:p-6 shadow-xs space-y-5">
          {/* Header inside form */}
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="inline-flex items-center gap-2">
              <div className="size-2 rounded-full bg-[#f39419]" />
              <span className="text-sm font-bold text-stone-900">
                {language === "bn" ? "আপনার জন্ম বিবরণ (Your Birth Details)" : language === "hi" ? "जन्म विवरण (Your Birth Details)" : "Your Birth Details"}
              </span>
            </div>
            {isSignedIn && profile && (
              <button
                type="button"
                onClick={handleReloadFromProfile}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline cursor-pointer"
              >
                <User className="size-3" />
                <span>{t.reloadProfile}</span>
              </button>
            )}
          </div>

          {rashiFeature && !rashiFeature.enabled && (
            <div className="mb-2">
              <FeatureDisabledAlert
                featureName={language === "bn" ? "রাশি ক্যালকুলেটর" : language === "hi" ? "राशि कैलकुलेटर" : "Rashi Calculator"}
                language={language}
              />
            </div>
          )}

          <form onSubmit={handleCalculate} className="space-y-4">
            {/* Name and Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  {t.fullName} <span className="text-stone-400 font-normal">({language === "bn" ? "ঐচ্ছিক" : language === "hi" ? "वैकल्पिक" : "optional"})</span>
                </label>
                <div className="relative rounded-2xl border border-stone-200 hover:border-stone-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-stone-50/50 hover:bg-white focus-within:bg-white px-3.5 py-2.5 flex items-center gap-2.5 transition-all shadow-2xs">
                  <User className="size-4 text-stone-400 shrink-0" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.fullNamePlaceholder}
                    className="w-full text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 bg-transparent outline-none font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  {t.gender}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "male", label: "♂ " + t.male },
                    { id: "female", label: "♀ " + t.female },
                    { id: "other", label: "⚥ " + t.other },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGender(g.id as any)}
                      className={`min-h-10 rounded-xl border px-2 py-1.5 text-center text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                        gender === g.id
                          ? "bg-[#f39419] border-[#f39419] text-stone-950 shadow-xs font-extrabold"
                          : "bg-stone-100/70 border-stone-200/80 text-stone-700 hover:bg-stone-200/60 font-semibold"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* DOB & TOB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* DOB */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  {t.dob} <span className="text-rose-500">*</span>
                </label>
                <div className="rounded-2xl border border-stone-200 hover:border-stone-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-stone-50/50 hover:bg-white focus-within:bg-white px-3.5 py-2 flex items-center gap-2 shadow-2xs transition-all">
                  <Calendar className="size-4 text-stone-400 shrink-0" />
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    <input
                      ref={dayRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={day}
                      onChange={handleDayChange}
                      placeholder="DD"
                      className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400"
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
                      className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400 border-x border-stone-200 px-1"
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
                      className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400"
                    />
                  </div>
                </div>
              </div>

              {/* TOB */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-700">
                    {t.tob} <span className="text-stone-400 font-normal">({language === "bn" ? "ঐচ্ছিক" : language === "hi" ? "वैकल्पिक" : "optional"})</span>
                  </label>
                  <span className="text-[11px] text-stone-400">
                    {hour.trim() === ""
                      ? (language === "bn" ? "না দিলে দুপুর ১২:০০ ধরা হবে" : language === "hi" ? "खाली रहने पर 12:00 PM माना जाएगा" : "Defaults to 12:00 PM")
                      : ""}
                  </span>
                </div>
                <div className="rounded-2xl border border-stone-200 hover:border-stone-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-stone-50/50 hover:bg-white focus-within:bg-white px-3.5 py-2 flex items-center gap-2 shadow-2xs transition-all">
                  <Clock className="size-4 text-stone-400 shrink-0" />
                  <div className="grid grid-cols-4 gap-1.5 flex-1 items-center">
                    <input
                      ref={hourRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={hour}
                      onChange={handleHourChange}
                      placeholder="HH"
                      className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400"
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
                      className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400 border-x border-stone-200 px-1"
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
                      className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400"
                    />
                    <div className="flex rounded-lg border border-stone-200 bg-stone-100 p-0.5 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setPeriod("AM")}
                        className={`flex-1 text-[11px] font-bold py-1 rounded-md transition-all cursor-pointer ${
                          period === "AM" ? "bg-[#f39419] text-stone-950 font-extrabold shadow-2xs" : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        AM
                      </button>
                      <button
                        type="button"
                        onClick={() => setPeriod("PM")}
                        className={`flex-1 text-[11px] font-bold py-1 rounded-md transition-all cursor-pointer ${
                          period === "PM" ? "bg-[#f39419] text-stone-950 font-extrabold shadow-2xs" : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        PM
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Place of Birth */}
            <div className="space-y-1.5">
              <label htmlFor="birth-place" className="block text-xs font-bold text-stone-700">
                {t.pob} <span className="text-rose-500">*</span>
              </label>
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

            {/* Advanced Settings Accordion */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAdvance((prev) => !prev)}
                className="w-full flex items-center justify-between rounded-xl bg-stone-50 hover:bg-stone-100 px-4 py-2.5 text-xs font-bold text-stone-700 transition-colors border border-stone-200 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Sliders className="size-3.5 text-amber-600" />
                  <span>{t.advancedSettings}</span>
                </span>
                {showAdvance ? (
                  <ChevronUp className="size-4 text-stone-400" />
                ) : (
                  <ChevronDown className="size-4 text-stone-400" />
                )}
              </button>

              {showAdvance && (
                <div className="mt-3 rounded-2xl border border-stone-200 bg-stone-50/60 p-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Ayanamsa */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-stone-600 block">{t.ayanamsa}</label>
                      <select
                        value={ayanamsa}
                        onChange={(e) => setAyanamsa(e.target.value as any)}
                        className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="lahiri">Lahiri (Chitra Paksha - Standard)</option>
                        <option value="bv_raman">B.V. Raman</option>
                        <option value="krishnamurti">Krishnamurti (KP)</option>
                        <option value="yukteshwar">Yukteshwar</option>
                        <option value="suryasiddhanta">Suryasiddhanta</option>
                        <option value="true_pushya">True Pushya</option>
                        <option value="true_mula">True Mula</option>
                      </select>
                    </div>

                    {/* House System */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-stone-600 block">{t.houseSystem}</label>
                      <select
                        value={houseSystem}
                        onChange={(e) => setHouseSystem(e.target.value as any)}
                        className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="placidus">Placidus (KP)</option>
                        <option value="equal">Equal House</option>
                        <option value="whole_sign">Whole Sign</option>
                        <option value="koch">Koch</option>
                      </select>
                    </div>

                    {/* Chart Style */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-stone-600 block">{t.chartStyle}</label>
                      <select
                        value={chartStyle}
                        onChange={(e) => setChartStyle(e.target.value as any)}
                        className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="north_indian">North Indian (Diamond)</option>
                        <option value="south_indian">South Indian (Box Grid)</option>
                        <option value="east_indian">East Indian (Bengali ছক)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100">
              <button
                type="button"
                onClick={handleResetForm}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer order-2 sm:order-1"
              >
                <RotateCcw className="size-3.5" />
                <span>{t.clearForm}</span>
              </button>

              <div className="flex items-center gap-3 order-1 sm:order-2 w-full sm:w-auto">
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
                  className="flex-1 sm:flex-none min-h-11 px-8 py-2.5 rounded-xl bg-[#f39419] hover:bg-[#e6860c] text-stone-950 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer border border-amber-300/80 active:scale-95"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin text-sm">✦</span>
                      <span>{t.calculatingBtn}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>
                        {rashiFeature && !rashiFeature.enabled
                          ? t.featureDisabledBtn
                          : (language === "bn" ? "আমার রাশি গণনা করুন" : language === "hi" ? "मेरी राशि की गणना करें" : "Calculate my Rashi")}
                      </span>
                      <ArrowRight className="size-3.5" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* =========================================================================
            RESULTS DASHBOARD (When Calculated)
        ========================================================================= */}
        {result && activeTraits && (
          <div ref={resultsRef} className="mx-auto max-w-5xl px-4 pt-12 sm:px-6 lg:px-8 space-y-8 reveal-cascade">
            {/* 1. Main Rashi Announcement Hero Card */}
            <div className="rounded-[32px] border border-amber-400/80 bg-gradient-to-br from-card via-[#fef6f1] to-card p-6 sm:p-10 shadow-[0_20px_50px_-20px_rgba(234,136,8,0.22)] text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

              {/* Top Banner with High-Contrast Text */}
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-extrabold px-4 py-1.5 text-xs shadow-2xs mb-4">
                <Sparkles className="size-3.5 text-amber-700" />
                <span>{t.calculatedFor(result.name)}</span>
              </div>

              {/* Big Sign Symbol & Typography */}
              <div className="flex flex-col items-center justify-center">
                <div className="size-20 sm:size-24 rounded-3xl bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900 flex items-center justify-center text-4xl sm:text-5xl text-white shadow-lg shadow-indigo-500/25 border-2 border-white/40 mb-3">
                  <span>{result.rashi_symbol}</span>
                </div>

                <h2 className="font-display text-3xl sm:text-5xl font-black text-ink-950 tracking-tight">
                  {language === "bn"
                    ? `${result.rashi_name_bn} ${t.rashiSuffix}`
                    : language === "hi"
                    ? `${result.rashi_name_hi} ${t.rashiSuffix}`
                    : `${result.rashi_name_en} ${t.rashiSuffix}`}
                  <span className="text-amber-600 font-extrabold text-2xl sm:text-3xl ml-2">
                    ({language === "bn" ? result.rashi_name_en : language === "hi" ? result.rashi_name_en : `${result.rashi_name_hi} / ${result.rashi_name_bn}`})
                  </span>
                </h2>

                <p className="mt-3 text-xs sm:text-[13px] text-ink-700 max-w-2xl leading-relaxed font-medium">
                  {activeTraits.overview}
                </p>

                {/* Vargottama Moon Badge */}
                {result.is_vargottama && (
                  <div className="mt-3.5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-amber-500/20 border-2 border-amber-400 px-4 py-1.5 text-xs font-black text-amber-950 shadow-sm animate-pulse">
                    <Award className="size-4 text-amber-600 fill-amber-500 shrink-0" />
                    <span>{t.vargottamaBadge}</span>
                  </div>
                )}
              </div>

              {/* High-Contrast Badges Strip */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
                <span className="rounded-xl bg-white px-3.5 py-1.5 text-ink-950 border border-border/80 shadow-2xs">
                  {t.rulingLord}{" "}
                  <strong className="text-amber-700">{translatePlanetName(result.rashi_lord, language)}</strong>
                </span>
                <span className="rounded-xl bg-white px-3.5 py-1.5 text-ink-950 border border-border/80 shadow-2xs">
                  {t.moonPosition}{" "}
                  <strong className="tabular-nums text-amber-700">{toLocalizedDigits(result.moon_degree_formatted, language)}</strong>
                </span>
                <span className="rounded-xl bg-white px-3.5 py-1.5 text-ink-950 border border-border/80 shadow-2xs">
                  {t.element}{" "}
                  <strong className="text-ink-900">{activeTraits.element}</strong>
                </span>
                <span className="rounded-xl bg-white px-3.5 py-1.5 text-ink-950 border border-border/80 shadow-2xs">
                  {t.modality}{" "}
                  <strong className="text-ink-900">{activeTraits.modality}</strong>
                </span>
                <span className="rounded-xl bg-white px-3.5 py-1.5 text-ink-950 border border-border/80 shadow-2xs">
                  {t.polarity}{" "}
                  <strong className="text-ink-900">{activeTraits.polarity}</strong>
                </span>
              </div>
            </div>

            {/* 2. Nakshatra & KP Sub-Lord Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-border/80 bg-card p-4 text-center shadow-2xs">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {t.nakshatraPada}
                </p>
                <p className="mt-1 font-display text-base sm:text-lg font-black text-ink-950">
                  {translateNakshatraName(result.nakshatra_name, language)}
                </p>
                <span className="inline-block mt-1.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 px-3 py-0.5 text-xs font-black shadow-2xs">
                  {t.padaSuffix(result.nakshatra_pada)}
                </span>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-4 text-center shadow-2xs">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {t.starLordKP}
                </p>
                <p className="mt-1 font-display text-base sm:text-lg font-black text-ink-950">
                  {translatePlanetName(result.nakshatra_lord, language)}
                </p>
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {t.governsResult}
                </span>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-4 text-center shadow-2xs">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {t.kpSubLord}
                </p>
                <p className="mt-1 font-display text-base sm:text-lg font-black text-amber-700">
                  {translatePlanetName(result.kp_sub_lord, language)}
                </p>
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {t.qualifiesOutcome}
                </span>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-4 text-center shadow-2xs">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {t.ascendantLagna}
                </p>
                <p className="mt-1 font-display text-base sm:text-lg font-black text-ink-950">
                  {translateRashiName(result.ascendant_rashi_name_en, language)}
                </p>
                <span className="text-[10px] font-mono font-bold text-amber-700">
                  {toLocalizedDigits(result.ascendant_degree_formatted, language)}
                </span>
              </div>
            </div>

            {/* 3. 5-Tab Navigation System */}
            <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 p-1.5 rounded-2xl bg-surface-muted border border-border/80 shadow-inner scrollbar-none">
              {[
                { id: "core", label: t.tabCore, icon: Sparkles },
                { id: "rules", label: t.tabRules, icon: BookOpen },
                { id: "kundali", label: t.tabKundali, icon: Eye },
                { id: "transit", label: t.tabTransit, icon: Activity },
                { id: "predictions", label: t.tabPredictions, icon: Shield },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap press transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-amber-500 text-amber-950 font-black shadow-md shadow-amber-500/20 scale-[1.02]"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/70"
                    }`}
                  >
                    <Icon className={`size-4 ${isActive ? "text-amber-950" : "text-muted-foreground"}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* =========================================================================
                TAB 1: CORE RASHI & AVAKAHADA CHAKRA
            ========================================================================= */}
            {activeTab === "core" && (
              <div className="space-y-6 fade-in">
                {/* Avakahada Chakra Grid */}
                <div className="rounded-[28px] border border-amber-300/80 bg-card p-6 sm:p-8 shadow-2xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border/60">
                    <div>
                      <h3 className="font-display text-lg font-bold text-ink-950 flex items-center gap-2">
                        <Sparkles className="size-4 text-amber-600" />
                        <span>{t.avakahadaHeading}</span>
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {t.avakahadaSub}
                      </p>
                    </div>

                    {result.namakshar && (
                      <div className="inline-flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-300 px-3.5 py-1.5 text-xs font-black text-amber-950 shadow-2xs">
                        <Star className="size-3.5 text-amber-600 fill-amber-500" />
                        <span>
                          {t.auspiciousLetter}{" "}
                          <strong className="text-base text-amber-800 ml-1 font-mono">{result.namakshar}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 6 Avakahada Pillars Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                    <div className="rounded-xl bg-surface-muted/60 p-3.5 border border-border/60">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {t.varna}
                      </p>
                      <p className="mt-1 font-extrabold text-ink-950 text-sm">
                        {result.avakahada_chakra?.varna || activeTraits.element}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {t.varnaSub}
                      </span>
                    </div>

                    <div className="rounded-xl bg-surface-muted/60 p-3.5 border border-border/60">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {t.vashya}
                      </p>
                      <p className="mt-1 font-extrabold text-ink-950 text-sm">
                        {result.avakahada_chakra?.vashya || "—"}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {t.vashyaSub}
                      </span>
                    </div>

                    <div className="rounded-xl bg-surface-muted/60 p-3.5 border border-border/60">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {t.yoni}
                      </p>
                      <p className="mt-1 font-extrabold text-ink-950 text-sm">
                        {result.avakahada_chakra?.yoni || "—"}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {t.yoniSub}
                      </span>
                    </div>

                    <div className="rounded-xl bg-surface-muted/60 p-3.5 border border-border/60">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {t.gana}
                      </p>
                      <p className="mt-1 font-extrabold text-ink-950 text-sm">
                        {result.avakahada_chakra?.gana || "—"}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {t.ganaSub}
                      </span>
                    </div>

                    <div className="rounded-xl bg-surface-muted/60 p-3.5 border border-border/60">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {t.nadi}
                      </p>
                      <p className="mt-1 font-extrabold text-ink-950 text-sm">
                        {result.avakahada_chakra?.nadi || "—"}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {t.nadiSub}
                      </span>
                    </div>

                    <div className="rounded-xl bg-surface-muted/60 p-3.5 border border-border/60">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {t.tatva}
                      </p>
                      <p className="mt-1 font-extrabold text-ink-950 text-sm">
                        {result.avakahada_chakra?.tatva || activeTraits.element}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {t.tatvaSub}
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
                            {t.payaHeading}
                          </h4>
                          <span className="rounded-md bg-amber-100 text-amber-950 border border-amber-300 px-2.5 py-0.5 text-xs font-black shadow-2xs">
                            {translatePayaBadge(result.avakahada_chakra.paya, language)}
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
                        {t.navamshaMoon}
                      </span>
                      <strong className="text-ink-950 font-extrabold">
                        {language === "bn" ? result.navamsha_rashi_name_bn : language === "hi" ? result.navamsha_rashi_name_hi : result.navamsha_rashi_name_en}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {t.vargottamaStatus}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                        result.is_vargottama
                          ? "bg-emerald-100 text-emerald-950 border border-emerald-300"
                          : "bg-surface-muted text-muted-foreground border border-border"
                      }`}>
                        {result.is_vargottama ? t.vargottamaActive : t.vargottamaInactive}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 12 Zodiac Signs & 27 Nakshatras Interactive Wheel */}
                <div className="rounded-[28px] border border-border/80 bg-card p-6 sm:p-8 shadow-2xs space-y-6">
                  <div className="text-center space-y-1">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                      {t.wheelHeading}
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-xl mx-auto">
                      {t.wheelSub}
                    </p>
                  </div>

                  <div className="flex justify-center py-4">
                    <MoonSignWheel
                      activeRashiIndex={result.rashi_index}
                      activeNakshatraIndex={result.nakshatra_index}
                      language={language}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                TAB 2: 15 CLASSICAL CLASSIFICATIONS (01.PDF)
            ========================================================================= */}
            {activeTab === "rules" && (
              <div className="space-y-6 fade-in">
                {result.client_rules ? (
                  <ClientRulesPanel
                    profile={result.client_rules}
                    ascendantProfile={result.ascendant_client_rules}
                    kpReference={result.kp_reference}
                    language={language}
                  />
                ) : (
                  <div className="rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground text-xs">
                    {t.rulesUnavailable}
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                TAB 3: CHANDRA LAGNA KUNDLI & PLANETARY DIGNITY
            ========================================================================= */}
            {activeTab === "kundali" && (
              <div className="space-y-6 fade-in">
                {/* Kundali Chart Visualizer with Chandra Lagna Toggle */}
                <div className="rounded-[28px] border border-amber-300/80 bg-card p-6 sm:p-8 shadow-2xs space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border/60">
                    <div>
                      <h3 className="font-display text-lg font-bold text-ink-950 flex items-center gap-2">
                        <Eye className="size-4 text-amber-600" />
                        <span>
                          {chartMode === "chandra" ? t.chandraLagnaChart : t.janmaLagnaChart}
                        </span>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {chartMode === "chandra"
                          ? t.chandraLagnaSub
                          : t.janmaLagnaSub(result.ayanamsa_name)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Dual Chart Toggle */}
                      <div className="flex items-center gap-1 rounded-xl border border-amber-300 bg-amber-50/50 p-1 text-xs font-black shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setChartMode("chandra")}
                          className={`rounded-lg px-3 py-1.5 press transition-all cursor-pointer ${
                            chartMode === "chandra"
                              ? "bg-amber-500 text-amber-950 shadow-xs"
                              : "text-amber-900/80 hover:text-amber-950 hover:bg-amber-100/50"
                          }`}
                        >
                          {t.chandraLagnaBtn}
                        </button>
                        <button
                          type="button"
                          onClick={() => setChartMode("lagna")}
                          className={`rounded-lg px-3 py-1.5 press transition-all cursor-pointer ${
                            chartMode === "lagna"
                              ? "bg-amber-500 text-amber-950 shadow-xs"
                              : "text-amber-900/80 hover:text-amber-950 hover:bg-amber-100/50"
                          }`}
                        >
                          {t.janmaLagnaBtn}
                        </button>
                      </div>

                      {/* Style selector pills */}
                      <div className="flex items-center gap-1 rounded-xl border border-border bg-surface-muted p-1 text-xs font-bold">
                        {(["north_indian", "south_indian", "east_indian"] as ChartStyleType[]).map((style) => (
                          <button
                            key={style}
                            type="button"
                            onClick={() => setChartStyle(style)}
                            className={`rounded-lg px-2.5 py-1.5 press transition-all cursor-pointer ${
                              chartStyle === style
                                ? "bg-card text-foreground font-black shadow-2xs border border-border/60"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {style === "north_indian"
                              ? t.chartNorth
                              : style === "south_indian"
                              ? t.chartSouth
                              : t.chartEast}
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
                          {t.dignityTitle(
                            language === "bn"
                              ? result.rashi_name_bn
                              : language === "hi"
                              ? result.rashi_name_hi
                              : result.rashi_name_en
                          )}
                        </span>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t.dignitySub}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Exalted & Debilitated */}
                      <div className="rounded-2xl border border-border/80 bg-surface-muted/50 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                            <CheckCircle2 className="size-4 text-emerald-600" />
                            <span>{t.exaltedPlanets}</span>
                          </span>
                          <span className="font-extrabold text-ink-950">
                            {result.planetary_dignity.exalted_planets?.length
                              ? translatePlanetList(result.planetary_dignity.exalted_planets, language)
                              : t.noneText}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border/60">
                          <span className="font-bold text-rose-800 flex items-center gap-1.5">
                            <AlertTriangle className="size-4 text-rose-600" />
                            <span>{t.debilitatedPlanets}</span>
                          </span>
                          <span className="font-extrabold text-ink-950">
                            {result.planetary_dignity.debilitated_planets?.length
                              ? translatePlanetList(result.planetary_dignity.debilitated_planets, language)
                              : t.noneText}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border/60">
                          <span className="font-bold text-indigo-800 flex items-center gap-1.5">
                            <Star className="size-4 text-indigo-600" />
                            <span>{t.moolatrikonaOwn}</span>
                          </span>
                          <span className="font-extrabold text-ink-950">
                            {translatePlanetName(
                              result.planetary_dignity.moolatrikona || result.planetary_dignity.own_lord,
                              language
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Natural Friendships of Ruling Lord */}
                      <div className="rounded-2xl border border-border/80 bg-surface-muted/50 p-4 space-y-2.5">
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                          {t.naturalFriendships(
                            translatePlanetName(result.rashi_lord, language)
                          )}
                        </p>

                        <div className="flex items-start gap-2 pt-1">
                          <span className="rounded-md bg-emerald-100 text-emerald-950 px-2 py-0.5 font-bold text-[10px] shrink-0">
                            {t.friends}
                          </span>
                          <span className="text-ink-950 font-medium">
                            {result.planetary_dignity.ruler_friends?.length
                              ? translatePlanetList(result.planetary_dignity.ruler_friends, language)
                              : "—"}
                          </span>
                        </div>

                        <div className="flex items-start gap-2 pt-1 border-t border-border/40">
                          <span className="rounded-md bg-rose-100 text-rose-950 px-2 py-0.5 font-bold text-[10px] shrink-0">
                            {t.enemies}
                          </span>
                          <span className="text-ink-950 font-medium">
                            {result.planetary_dignity.ruler_enemies?.length
                              ? translatePlanetList(result.planetary_dignity.ruler_enemies, language)
                              : t.noEnemies}
                          </span>
                        </div>

                        <div className="flex items-start gap-2 pt-1 border-t border-border/40">
                          <span className="rounded-md bg-amber-100 text-amber-950 px-2 py-0.5 font-bold text-[10px] shrink-0">
                            {t.neutrals}
                          </span>
                          <span className="text-ink-950 font-medium">
                            {result.planetary_dignity.ruler_neutrals?.length
                              ? translatePlanetList(result.planetary_dignity.ruler_neutrals, language)
                              : "—"}
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
              <div className="space-y-6 fade-in">
                {/* 1. Chandra Bala Meter */}
                {result.chandra_bala && (
                  <div className="rounded-[28px] border border-amber-300/80 bg-card p-6 sm:p-8 shadow-2xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/60">
                      <div>
                        <h3 className="font-display text-base sm:text-lg font-extrabold text-ink-950 flex items-center gap-2">
                          <Activity className="size-4 text-amber-600" />
                          <span>{t.chandraBalaHeading}</span>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {t.chandraBalaSub}
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
                          {t.transitingMoonSign}
                        </p>
                        <p className="mt-1 font-extrabold text-ink-950 text-base">
                          {translateRashiName(result.chandra_bala.current_moon_sign_name, language)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-surface-muted/60 p-3.5 border border-border/60">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">
                          {t.houseFromMoon}
                        </p>
                        <p className="mt-1 font-extrabold text-amber-700 text-base">
                          {toLocalizedDigits(result.chandra_bala.house_from_natal_moon, language)}
                          <span className="text-xs text-muted-foreground ml-1">
                            {t.houseSuffix(result.chandra_bala.house_from_natal_moon)}
                          </span>
                        </p>
                      </div>

                      <div className="rounded-xl bg-surface-muted/60 p-3.5 border border-border/60">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">
                          {t.resultCategory}
                        </p>
                        <p className="mt-1 font-extrabold text-ink-950 text-sm">
                          {result.chandra_bala.house_from_natal_moon === 8
                            ? t.chandrashtama
                            : result.chandra_bala.is_auspicious
                            ? t.auspiciousTransit
                            : t.neutralTransit}
                        </p>
                      </div>
                    </div>

                    {/* Narrative Description & Advice */}
                    <div className="rounded-2xl border border-border/80 bg-surface-muted/40 p-4 sm:p-5 space-y-2">
                      <p className="text-xs sm:text-[13px] text-ink-950 leading-relaxed font-medium">
                        {result.chandra_bala.description}
                      </p>
                      <p className="text-[11px] text-muted-foreground italic pt-1 border-t border-border/40">
                        {t.muhurtaRule}
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
                          <span>{t.sadeSatiHeading}</span>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {t.sadeSatiSub}
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
                          ? t.sadeSatiActive
                          : t.sadeSatiInactive}
                      </span>
                    </div>

                    {/* Phase Title Card */}
                    <div className="rounded-2xl border border-amber-300/60 bg-gradient-to-r from-amber-500/10 via-card to-card p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">
                            {t.activePhase}
                          </p>
                          <h4 className="font-display text-base sm:text-lg font-black text-ink-950 mt-0.5">
                            {result.sade_sati_status.phase_title}
                          </h4>
                        </div>
                        <span className="text-xs text-ink-800 font-bold">
                          {t.saturnSign}{" "}
                          <strong className="text-amber-800">
                            {translateRashiName(result.sade_sati_status.saturn_sign_name, language)}
                          </strong>{" "}
                          ({toLocalizedDigits(result.sade_sati_status.saturn_house_from_moon, language)}
                          {t.houseSuffix(result.sade_sati_status.saturn_house_from_moon)})
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
                        <span>{t.remedyHeading}</span>
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
              <div className="space-y-6 fade-in">
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
                          {t.cautionsHeading}
                        </h3>
                        <p className="text-[11px] font-semibold text-rose-700/90">
                          {t.cautionsSub}
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
                          {t.remediesHeading}
                        </h3>
                        <p className="text-[11px] font-semibold text-emerald-700/90">
                          {t.remediesSub}
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
                      <span>{t.luckyHeading}</span>
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {t.kalapurusha}{" "}
                      <strong className="text-ink-950">{activeTraits.body_parts}</strong>
                    </span>
                  </div>

                  {/* Attribute Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                    <div className="rounded-xl bg-surface-muted/60 p-3 border border-border/60 flex flex-col justify-start">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        <Gem className="size-3 text-amber-600 shrink-0" />{" "}
                        <span>{t.luckyGem}</span>
                      </p>
                      <p className="mt-1.5 font-extrabold text-ink-950 break-words leading-snug">{activeTraits.lucky_gemstone}</p>
                    </div>

                    <div className="rounded-xl bg-surface-muted/60 p-3 border border-border/60 flex flex-col justify-start">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        <Palette className="size-3 text-indigo-600 shrink-0" />{" "}
                        <span>{t.luckyColors}</span>
                      </p>
                      <p className="mt-1.5 font-extrabold text-ink-950 break-words leading-snug">{activeTraits.lucky_color}</p>
                    </div>

                    <div className="rounded-xl bg-surface-muted/60 p-3 border border-border/60 flex flex-col justify-start">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">
                        {t.luckyNumbers}
                      </p>
                      <p className="mt-1.5 font-extrabold text-ink-950 break-words leading-snug">
                        {result.traits.lucky_numbers.map((num) => toLocalizedDigits(num, language)).join(", ")}
                      </p>
                    </div>

                    <div className="rounded-xl bg-surface-muted/60 p-3 border border-border/60 flex flex-col justify-start">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">
                        {t.luckyDay}
                      </p>
                      <p className="mt-1.5 font-extrabold text-ink-950 break-words leading-snug">{activeTraits.lucky_day}</p>
                    </div>

                    <div className="rounded-xl bg-surface-muted/60 p-3 border border-border/60 flex flex-col justify-start">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">
                        {t.rulingDeity}
                      </p>
                      <p className="mt-1.5 font-extrabold text-ink-950 break-words leading-snug">{activeTraits.ruling_deity}</p>
                    </div>

                    <div className="rounded-xl bg-surface-muted/60 p-3 border border-border/60 flex flex-col justify-start">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">
                        {t.compatibleSigns}
                      </p>
                      <p className="mt-1.5 font-extrabold text-ink-950 break-words leading-snug">
                        {translateRashiList(activeTraits.compatible_rashis || result.traits.compatible_rashis, language)}
                      </p>
                    </div>
                  </div>

                  {/* Strengths Pills */}
                  <div className="pt-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
                      {t.personalityStrengths}
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
                <span>{t.recalculateBtn}</span>
              </button>

              <div className="flex items-center gap-2">
                <Link href="/appointments">
                  <Button size="sm" className="bg-amber-500 text-amber-950 font-black hover:bg-amber-400">
                    {t.consultAstrologerBtn}
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

        {/* =========================================================================
            4. WHAT IS THE ROLE OF MOON SIGN (RASHI) IN ASTROLOGY? (Astrotalk Guide)
        ========================================================================= */}
        <div className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-900">
              <Sparkles className="size-3 text-amber-600" />
              <span>
                {language === "bn" ? "জ্যোতিষশাস্ত্রে ভূমিকা" : language === "hi" ? "ज्योतिष में भूमिका" : "Role in Astrology"}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              {RASHI_ASTROTALK_ROLE.roleHeading[language]}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-1">
              {RASHI_ASTROTALK_ROLE.roleSub[language]}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RASHI_ASTROTALK_ROLE.roles.map((r, i) => (
              <div
                key={i}
                className="rounded-2xl border border-stone-200/80 bg-stone-50/40 hover:bg-white p-5 space-y-2 hover:border-amber-300 transition-all shadow-2xs hover:shadow-xs"
              >
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#f39419]" />
                  <span>{r.title[language]}</span>
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed pl-4">
                  {r.desc[language]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            5. RASHI FINDER: FIND OUT WHAT YOUR MOON SIGN SAYS (12 Moon Signs Guide)
        ========================================================================= */}
        <div className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-100">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-900">
                <BookOpen className="size-3 text-amber-600" />
                <span>
                  {language === "bn" ? "১২টি চন্দ্র রাশি বিশ্লেষণ" : language === "hi" ? "12 चंद्र राशि विश्लेषण" : "All 12 Moon Signs"}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1">
                {language === "bn"
                  ? "রাশি বিবরণ ও ব্যক্তিত্ব: আপনার চন্দ্র রাশি কী নির্দেশ করে"
                  : language === "hi"
                  ? "राशि विवरण एवं स्वभाव: आपकी चंद्र राशि क्या बताती है"
                  : "Rashi Finder: Find Out What Your Moon Sign Says"}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {language === "bn"
                  ? "মেষ থেকে মীন — ১২টি চন্দ্র রাশির গভীর ব্যক্তিত্ব, মানসিক ধরণ, ক্যারিয়ার ও দাম্পত্য জীবনের প্রতিফলন"
                  : language === "hi"
                  ? "मेष से मीन — 12 चंद्र राशियों का व्यक्तित्व, भावनात्मक शैली, करियर और संबंध"
                  : "From Aries to Pisces — explore personality, emotional style, career path, and relationship expectations"}
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
              <input
                type="text"
                value={rashiSearch}
                onChange={(e) => setRashiSearch(e.target.value)}
                placeholder={language === "bn" ? "রাশি বা অধিপতি খুঁজুন..." : language === "hi" ? "राशि या स्वामी खोजें..." : "Search Moon sign or ruler..."}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
              />
              {rashiSearch && (
                <button
                  type="button"
                  onClick={() => setRashiSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Element Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-stone-500 mr-1">
              {language === "bn" ? "তত্ত্ব (Element):" : language === "hi" ? "तत्व (Element):" : "Element:"}
            </span>
            {[
              { id: "all", label: language === "bn" ? "সকল (১২)" : language === "hi" ? "सभी (12)" : "All (12)" },
              { id: "fire", label: language === "bn" ? "অগ্নি (Fire)" : language === "hi" ? "अग्नि (Fire)" : "Fire (3)" },
              { id: "earth", label: language === "bn" ? "পৃথিবী (Earth)" : language === "hi" ? "पृथ्वी (Earth)" : "Earth (3)" },
              { id: "air", label: language === "bn" ? "বায়ু (Air)" : language === "hi" ? "वायु (Air)" : "Air (3)" },
              { id: "water", label: language === "bn" ? "জল (Water)" : language === "hi" ? "जल (Water)" : "Water (3)" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedElementFilter(f.id)}
                className={`px-3 py-1 text-xs rounded-full font-bold transition-all cursor-pointer ${
                  selectedElementFilter === f.id
                    ? "bg-[#f39419] text-stone-950 font-extrabold shadow-2xs"
                    : "bg-stone-100/80 text-stone-600 hover:bg-stone-200/70"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {filteredRashis.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-stone-200/90 bg-stone-50/30 hover:bg-white p-5 space-y-3.5 transition-all shadow-2xs hover:shadow-xs hover:border-amber-300"
              >
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div>
                    <h4 className="text-base font-serif font-bold text-stone-900">
                      {item.name[language]}
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {language === "bn" ? "তত্ত্ব:" : language === "hi" ? "तत्व:" : "Element:"}{" "}
                      <span className="font-semibold text-stone-700">{item.element[language]}</span>
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-900">
                    <span>{item.ruler[language]}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-stone-900 block mb-0.5">
                      • {language === "bn" ? "স্বভাব ও ব্যক্তিত্ব (Overview):" : language === "hi" ? "स्वभाव (Overview):" : "Overview:"}
                    </span>
                    <p className="text-stone-600 leading-relaxed pl-3">
                      {item.overview[language]}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-stone-900 block mb-0.5">
                      • {language === "bn" ? "আবেগিক বৈশিষ্ট্য (Emotional Style):" : language === "hi" ? "भावनात्मक शैली (Emotional Style):" : "Emotional Style:"}
                    </span>
                    <p className="text-stone-600 leading-relaxed pl-3">
                      {item.emotionalStyle[language]}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-stone-900 block mb-0.5">
                      • {language === "bn" ? "সম্পর্ক ও ভালোবাসা (Relationships):" : language === "hi" ? "संबंध एवं प्रेम (Relationships):" : "Relationships:"}
                    </span>
                    <p className="text-stone-600 leading-relaxed pl-3">
                      {item.relationship[language]}
                    </p>
                  </div>

                  <div className="pt-1">
                    <span className="text-[11px] font-bold text-stone-500 block mb-1">
                      {language === "bn" ? "সেরা সামঞ্জস্যপূর্ণ রাশি:" : language === "hi" ? "सर्वोत्तम अनुकूल राशियां:" : "Best Matching Signs:"}
                    </span>
                    <div className="flex flex-wrap gap-1.5 pl-3">
                      {item.bestMatches.map((m, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg bg-amber-50 border border-amber-200/80 text-amber-950 font-bold px-2 py-0.5 text-[11px]"
                        >
                          ✦ {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRashis.length === 0 && (
            <div className="py-12 text-center text-xs text-stone-500">
              {language === "bn"
                ? "কোনো রাশি পাওয়া যায়নি। অন্য বানান দিয়ে অনুসন্ধান করুন।"
                : language === "hi"
                ? "कोई राशि नहीं मिली। पुनः प्रयास करें।"
                : "No Moon signs match your search."}
            </div>
          )}
        </div>

        {/* =========================================================================
            6. MOON SIGN COMPATIBILITY: CHECK OUT THE BEST MATCHES (Vedic 4 Elements)
        ========================================================================= */}
        <div className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-900">
              <Sparkles className="size-3 text-amber-600" />
              <span>
                {language === "bn" ? "বৈদিক তত্ত্ব সামঞ্জস্য" : language === "hi" ? "वैदिक तत्व अनुकूलता" : "Element Compatibility"}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              {RASHI_ELEMENT_COMPATIBILITY.title[language]}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-1">
              {RASHI_ELEMENT_COMPATIBILITY.subtitle[language]}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RASHI_ELEMENT_COMPATIBILITY.rules.map((rule, i) => (
              <div
                key={i}
                className="rounded-2xl border border-stone-200/90 bg-stone-50/40 hover:bg-white p-5 space-y-3 transition-all shadow-2xs hover:shadow-xs hover:border-amber-300"
              >
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#f39419]" />
                    <span>{rule.element[language]}</span>
                  </h4>
                  <span className="text-[11px] font-semibold text-stone-500">
                    {rule.signs[language]}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-stone-900">
                      {language === "bn" ? "সেরা যোটক:" : language === "hi" ? "सर्वोत्तम मिलान:" : "Best Matches:"}{" "}
                    </span>
                    <span className="font-semibold text-amber-800">{rule.compatibleWith[language]}</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    {rule.why[language]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            7. DISCOVER MORE ABOUT YOURSELF (RELATED TOOLS)
        ========================================================================= */}
        <div className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              {language === "bn"
                ? "নিজের সম্পর্কে আরও জানুন (সম্পর্কিত বৈদিক গণনা)"
                : language === "hi"
                ? "अपने बारे में और अधिक जानें (अन्य वैदिक सेवाएं)"
                : "Discover More About Yourself"}
            </h3>
            <p className="text-xs text-stone-500">
              {language === "bn"
                ? "আপনার কুন্ডলী, নক্ষত্র, দশা ও ভাগ্যের সম্পূর্ণ মহাজাগতিক রূপরেখা আবিষ্কার করুন"
                : language === "hi"
                ? "अपनी कुंडली, नक्षत्र, दशा और भाग्य की संपूर्ण जानकारी प्राप्त करें"
                : "Explore your full Vedic birth chart, love compatibility, and life timelines"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RASHI_RELATED_TOOLS.map((tool, i) => (
              <Link
                key={i}
                href={tool.href}
                className="group rounded-2xl border border-stone-200/80 bg-stone-50/50 hover:bg-white p-5 space-y-2 hover:border-amber-400 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="size-8 rounded-xl bg-amber-500/10 text-amber-800 flex items-center justify-center font-bold text-xs group-hover:bg-[#f39419] group-hover:text-stone-950 transition-colors">
                    ✦
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                    {tool.title[language]}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {tool.desc[language]}
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-amber-700 group-hover:text-amber-900 group-hover:translate-x-1 transition-all">
                  <span>{language === "bn" ? "গণনা করুন" : language === "hi" ? "गणना करें" : "Explore Now"}</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* =========================================================================
            8. FREQUENTLY ASKED QUESTIONS (FAQ)
        ========================================================================= */}
        <div className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-900">
              <HelpCircle className="size-3 text-amber-600" />
              <span>{language === "bn" ? "সাধারণ জিজ্ঞাসা" : language === "hi" ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently Asked Questions"}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              {language === "bn"
                ? "চন্দ্র রাশি সংক্রান্ত সচরাচর জিজ্ঞাসিত প্রশ্নোত্তর"
                : language === "hi"
                ? "चंद्र राशि से संबंधित महत्वपूर्ण प्रश्न व उत्तर"
                : "Frequently Asked Questions About Moon Signs (Rashi)"}
            </h3>
          </div>

          <div className="space-y-3">
            {RASHI_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-200/80 bg-stone-50/40 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-stone-50 cursor-pointer transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-stone-900">
                      {faq.question[language]}
                    </span>
                    <ChevronDown
                      className={`size-4 text-stone-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-amber-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                      {faq.answer[language]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <FeatureCoinModal
        open={coinModalOpen}
        onClose={() => setCoinModalOpen(false)}
        featureName={rashiFeature?.name || (language === "bn" ? "রাশি ক্যালকুলেটর" : language === "hi" ? "राशि कैलकुलेटर" : "Rashi Calculator")}
        requiredCoins={rashiFeature?.coins ?? 10}
        walletBalance={walletBalance}
        reason={coinModalReason}
        language={language}
      />

      <SiteFooter />
    </div>
  );
}
