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
  Star,
  Sliders,
  X,
  ChevronRight,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { usePlatform } from "@/providers/realtime-provider";
import { coinsPerMinute } from "@/lib/utils";
import { SKILL_LABELS } from "@/types";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { astrologyApi, astrologerApi } from "@/lib/api";
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
  gender: "male" | "female" | "other";
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
  gender: "male",
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

// Sidebar Card: Real Live Astrologers from MongoDB via REST API (No Dummy Data)
function AstrologerMatchmakingCard({
  language,
  t,
}: {
  language: AstrologyLanguage;
  t: KundliMatchingTranslations;
}) {
  const { data: astrologersData, isLoading } = useQuery({
    queryKey: ["astrologers", { matchmaking_sidebar: true, limit: 6 }],
    queryFn: () => astrologerApi.list({ limit: 6 }),
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  const platform = usePlatform();
  const coinsPerRupee = platform?.coins_per_rupee ?? 1;

  const topAstrologers = React.useMemo(() => {
    const items = astrologersData?.items ?? [];
    return items.slice(0, 3);
  }, [astrologersData]);

  return (
    <div className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-xs flex flex-col justify-between space-y-5">
      <div className="space-y-4">
        <h3 className="font-display font-bold text-base sm:text-lg text-stone-900">
          {t.talkToExperts}
        </h3>

        <div className="space-y-3 divide-y divide-stone-100">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="pt-3 first:pt-0 flex items-center gap-3 animate-pulse">
                <div className="size-11 rounded-full bg-stone-200" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-stone-200 rounded w-28" />
                  <div className="h-3 bg-stone-100 rounded w-36" />
                  <div className="h-3 bg-stone-100 rounded w-20" />
                </div>
                <div className="h-8 w-14 bg-stone-200 rounded-xl" />
              </div>
            ))
          ) : topAstrologers.length === 0 ? (
            <p className="text-xs text-stone-500 py-3">
              {language === "bn"
                ? "বর্তমানে কোনো বিশেষজ্ঞ অনলাইনে নেই। সকল জ্যোতিষী দেখতে নিচের লিঙ্কে ক্লিক করুন।"
                : "No experts online right now. Browse our directory below."}
            </p>
          ) : (
            topAstrologers.map((astrologer) => {
              const primaryMode = astrologer.modes_enabled?.includes("chat")
                ? "chat"
                : (astrologer.modes_enabled?.[0] ?? "chat");
              const rateCoins = coinsPerMinute(astrologer.rates, primaryMode);
              const rateRupees = Math.max(1, Math.round(rateCoins / coinsPerRupee));
              const skills =
                (astrologer.skills || [])
                  .slice(0, 3)
                  .map((s) => SKILL_LABELS[s] ?? s)
                  .join(", ") || "Marriage & Kundli Milan";
              const isOnline = astrologer.availability?.is_online;

              return (
                <div
                  key={astrologer.id}
                  className="pt-3.5 first:pt-0 flex items-center justify-between gap-2.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      {astrologer.profile_image_url ? (
                        <img
                          src={astrologer.profile_image_url}
                          alt={astrologer.display_name}
                          className="size-11 rounded-full object-cover border border-amber-200"
                        />
                      ) : (
                        <div className="size-11 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs border border-amber-300">
                          {astrologer.display_name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                        {astrologer.display_name}
                      </h4>
                      <p className="text-[11px] text-stone-500 truncate">
                        {skills}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-700 font-medium pt-0.5">
                        <span className="text-amber-500 font-bold flex items-center gap-0.5">
                          <Star className="size-3 fill-amber-500 text-amber-500" /> 5.0
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="font-semibold text-stone-900">
                          ₹{rateRupees}/min
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/astrologers/${astrologer.slug || astrologer.id}`}
                    className="shrink-0 inline-flex items-center justify-center rounded-xl border border-stone-300 hover:border-amber-500 bg-white hover:bg-amber-50 px-3.5 py-1.5 text-xs font-bold text-stone-800 transition-colors shadow-2xs"
                  >
                    {t.chatNow}
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-stone-100">
        <Link
          href="/astrologers"
          className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 hover:border-amber-400 bg-stone-50/80 hover:bg-amber-50/50 py-2.5 px-4 text-xs font-bold text-stone-800 transition-colors"
        >
          <span>{t.viewAllAstrologers}</span>
          <span className="text-stone-400">→</span>
        </Link>
      </div>
    </div>
  );
}

// Sample Kundli Milan Report Preview Modal
function SampleMatchReportModal({
  open,
  onClose,
  language,
  t,
}: {
  open: boolean;
  onClose: () => void;
  language: AstrologyLanguage;
  t: KundliMatchingTranslations;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/60 backdrop-blur-xs fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="space-y-1">
            <span className="inline-block text-[11px] font-bold text-amber-800 tracking-wider uppercase">
              {language === "bn" ? "বৈদিক যোটক বিচার নমুনা" : "Vedic Milan Sample Preview"}
            </span>
            <h3 className="font-display text-xl font-extrabold text-stone-900">
              {t.sampleReportTitle}
            </h3>
            <p className="text-xs text-stone-500">
              {t.sampleReportSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-50 to-amber-500/10 border border-amber-300 text-center space-y-1">
            <div className="text-2xl font-black text-amber-950 font-serif">
              28 / 36 {language === "bn" ? "গুণ প্রাপ্ত (উত্তম মিলন)" : "Gunas (Favorable Alliance)"}
            </div>
            <p className="text-xs font-semibold text-emerald-800">
              ✓ {language === "bn" ? "দাম্পত্য জীবনের জন্য এটি অত্যন্ত শুভ ও সমৃদ্ধিশালী মিলন" : "Highly auspicious and harmonious alliance for a joyful marriage"}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl border border-stone-200 bg-stone-50">
              <span className="block text-[11px] text-stone-500">বর্ণ (Varna - 1 Pt)</span>
              <span className="font-bold text-stone-900">1 / 1 (সম্পূর্ণ)</span>
            </div>
            <div className="p-3 rounded-xl border border-stone-200 bg-stone-50">
              <span className="block text-[11px] text-stone-500">বশ্য (Vashya - 2 Pts)</span>
              <span className="font-bold text-stone-900">2 / 2 (সম্পূর্ণ)</span>
            </div>
            <div className="p-3 rounded-xl border border-stone-200 bg-stone-50">
              <span className="block text-[11px] text-stone-500">তারা (Tara - 3 Pts)</span>
              <span className="font-bold text-stone-900">3 / 3 (সম্পূর্ণ)</span>
            </div>
            <div className="p-3 rounded-xl border border-stone-200 bg-stone-50">
              <span className="block text-[11px] text-stone-500">যোনি (Yoni - 4 Pts)</span>
              <span className="font-bold text-stone-900">3 / 4 (অনুকূল)</span>
            </div>
            <div className="p-3 rounded-xl border border-stone-200 bg-stone-50">
              <span className="block text-[11px] text-stone-500">মৈত্রী (Maitri - 5 Pts)</span>
              <span className="font-bold text-stone-900">5 / 5 (সম্পূর্ণ)</span>
            </div>
            <div className="p-3 rounded-xl border border-stone-200 bg-stone-50">
              <span className="block text-[11px] text-stone-500">গণ (Gana - 6 Pts)</span>
              <span className="font-bold text-stone-900">6 / 6 (দেব গণ)</span>
            </div>
            <div className="p-3 rounded-xl border border-stone-200 bg-stone-50">
              <span className="block text-[11px] text-stone-500">ভকূট (Bhakoot - 7 Pts)</span>
              <span className="font-bold text-stone-900">7 / 7 (শুভ)</span>
            </div>
            <div className="p-3 rounded-xl border border-stone-200 bg-stone-50">
              <span className="block text-[11px] text-stone-500">নাড়ী (Nadi - 8 Pts)</span>
              <span className="font-bold text-stone-900">8 / 8 (নাড়ী দোষ মুক্ত)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-1">
            <h4 className="font-bold text-stone-900">মাঙ্গলিক দোষ বিশ্লেষণ:</h4>
            <p className="text-stone-600 text-xs">
              বর এবং কনে উভয়েরই কুন্ডলীতে মাঙ্গলিক ভারসাম্য অনুকূল রয়েছে। কোনো কুজ দোষের ক্ষতিকর প্রভাব নেই।
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            {language === "bn" ? "বন্ধ করুন" : "Close"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") window.print();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#fcd404] hover:bg-[#ebd500] px-4 py-2 text-xs font-bold text-stone-950 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="size-3.5" />
            <span>{language === "bn" ? "প্রিন্ট / পিডিএফ ডাউনলোড" : "Print / Save PDF"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

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

  // Astrotalk-inspired Redesign States
  const [expandedHero, setExpandedHero] = React.useState(false);
  const [sampleModalOpen, setSampleModalOpen] = React.useState(false);
  const [showGroomAdvanced, setShowGroomAdvanced] = React.useState(false);
  const [showBrideAdvanced, setShowBrideAdvanced] = React.useState(false);
  const [groomPlaceTouched, setGroomPlaceTouched] = React.useState(false);
  const [bridePlaceTouched, setBridePlaceTouched] = React.useState(false);

  // Auto-focus refs for groom
  const groomDayRef = React.useRef<HTMLInputElement | null>(null);
  const groomMonthRef = React.useRef<HTMLInputElement | null>(null);
  const groomYearRef = React.useRef<HTMLInputElement | null>(null);
  const groomHourRef = React.useRef<HTMLInputElement | null>(null);
  const groomMinuteRef = React.useRef<HTMLInputElement | null>(null);
  const groomSecondRef = React.useRef<HTMLInputElement | null>(null);

  // Auto-focus refs for bride
  const brideDayRef = React.useRef<HTMLInputElement | null>(null);
  const brideMonthRef = React.useRef<HTMLInputElement | null>(null);
  const brideYearRef = React.useRef<HTMLInputElement | null>(null);
  const brideHourRef = React.useRef<HTMLInputElement | null>(null);
  const brideMinuteRef = React.useRef<HTMLInputElement | null>(null);
  const brideSecondRef = React.useRef<HTMLInputElement | null>(null);

  // Auto-fill and clear actions
  const handleLoadGroomFromProfile = () => {
    if (profile?.birth) {
      const parsed = parseProfileBirthDetails(profile.birth);
      setGroom((prev) => ({
        ...prev,
        ...parsed,
        name: prev.name || user?.full_name || "Self",
      }));
      toast.success(
        language === "bn"
          ? "আপনার প্রোফাইলের কুন্ডলি লোড হয়েছে"
          : language === "hi"
          ? "आपकी प्रोफ़ाइल कुंडली लोड हुई"
          : "Your profile kundli loaded"
      );
    } else {
      toast.info(
        language === "bn"
          ? "প্রোফাইলে সংরক্ষিত কোনো জন্ম বিবরণ পাওয়া যায়নি"
          : language === "hi"
          ? "प्रोफ़ाइल में जन्म विवरण उपलब्ध नहीं है"
          : "No birth details found in profile"
      );
    }
  };

  const handleClearGroom = () => {
    setGroom({ ...defaultPersonState });
  };

  const handleLoadSamplePartner = () => {
    setBride({
      ...defaultPersonState,
      name: language === "bn" ? "প্রিয়া শর্মা" : language === "hi" ? "প্রিয়া शर्मा" : "Priya Sharma",
      gender: "female",
      day: "15",
      month: "08",
      year: "1998",
      hour: "10",
      minute: "30",
      second: "00",
      period: "AM",
      place: "Kolkata, West Bengal, India",
      selectedPlace: {
        place: "Kolkata, West Bengal, India",
        displayName: "Kolkata, West Bengal, India",
        latitude: 22.5726,
        longitude: 88.3639,
        timezoneOffset: 5.5,
        timezoneName: "Asia/Kolkata",
        timezoneLabel: "IST (UTC+05:30)",
        timezoneAbbreviation: "IST",
        isDst: false,
      },
      latitude: 22.5726,
      longitude: 88.3639,
      timezone: "5.5",
      ayanamsa: "lahiri",
      houseSystem: "placidus",
    });
    toast.success(
      language === "bn"
        ? "নমুনা পার্টনার বিবরণ লোড হয়েছে"
        : language === "hi"
        ? "नमूना साथी विवरण लोड हुआ"
        : "Sample partner details loaded"
    );
  };

  const handleClearBride = () => {
    setBride({ ...defaultPersonState, gender: "female" });
  };

  // Groom auto-advance handlers
  const handleGroomDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 2);
    setGroom((prev) => ({ ...prev, day: val }));
    if (val.length === 2) groomMonthRef.current?.focus();
  };
  const handleGroomMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 2);
    setGroom((prev) => ({ ...prev, month: val }));
    if (val.length === 2) groomYearRef.current?.focus();
  };
  const handleGroomYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    setGroom((prev) => ({ ...prev, year: val }));
  };

  const handleGroomHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 2);
    setGroom((prev) => ({ ...prev, hour: val }));
    if (val.length === 2) groomMinuteRef.current?.focus();
  };
  const handleGroomMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 2);
    setGroom((prev) => ({ ...prev, minute: val }));
    if (val.length === 2) groomSecondRef.current?.focus();
  };
  const handleGroomSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 2);
    setGroom((prev) => ({ ...prev, second: val }));
  };

  // Bride auto-advance handlers
  const handleBrideDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 2);
    setBride((prev) => ({ ...prev, day: val }));
    if (val.length === 2) brideMonthRef.current?.focus();
  };
  const handleBrideMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 2);
    setBride((prev) => ({ ...prev, month: val }));
    if (val.length === 2) brideYearRef.current?.focus();
  };
  const handleBrideYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    setBride((prev) => ({ ...prev, year: val }));
  };

  const handleBrideHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 2);
    setBride((prev) => ({ ...prev, hour: val }));
    if (val.length === 2) brideMinuteRef.current?.focus();
  };
  const handleBrideMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 2);
    setBride((prev) => ({ ...prev, minute: val }));
    if (val.length === 2) brideSecondRef.current?.focus();
  };
  const handleBrideSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 2);
    setBride((prev) => ({ ...prev, second: val }));
  };

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
    setGroomPlaceTouched(true);
    setBridePlaceTouched(true);

    if (!validatePerson(groom, t.yourDetailsTitle || t.groomLabel)) {
      return;
    }
    if (!validatePerson(bride, t.partnerDetailsTitle || t.brideLabel)) {
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
    <div className="min-h-screen bg-[#fafaf9]/70 text-stone-900 flex flex-col font-sans pb-24 selection:bg-amber-100 selection:text-amber-900">
      <SiteHeader />

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-3 sm:px-6 py-4 flex-1 w-full space-y-6">
        {/* =========================================================================
            1. BREADCRUMB & LANGUAGE SWITCHER
        ========================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 pt-0.5 pb-1">
          <div className="flex items-center gap-1.5 uppercase tracking-wider font-semibold">
            <Link href="/" className="hover:text-amber-700 transition-colors">
              {t.breadcrumbHome}
            </Link>
            <span className="text-stone-300">&gt;</span>
            <span className="text-stone-900 font-bold">{t.breadcrumbMatchmaking}</span>
          </div>

          {/* Language Switcher Bar */}
          <div className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white p-0.5 text-xs font-semibold shadow-2xs">
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
                    ? "bg-[#fcd404] text-stone-950 shadow-2xs font-extrabold"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            2. HERO SECTION: Compact, sleek, with rotating faint zodiac circle in background
        ========================================================================= */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-r from-amber-50/50 via-white to-amber-50/30 px-4 sm:px-6 py-4 shadow-2xs">
          {/* Faint rotating zodiac wheel in background */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/zodiac-wheel-gold.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 size-[280px] sm:size-[360px] select-none opacity-[0.14] mix-blend-multiply animate-spin [animation-duration:120s] motion-reduce:animate-none"
          />

          <div className="relative z-10 max-w-2xl space-y-1.5">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
              {t.heroTitle}{" "}
              <span className="text-amber-800 font-serif font-bold">{t.heroHighlight}</span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {t.heroDescription}
              {expandedHero && (
                <span className="block mt-1.5 text-stone-600 leading-relaxed">
                  {t.heroDescriptionExpanded}
                </span>
              )}
              <button
                type="button"
                onClick={() => setExpandedHero(!expandedHero)}
                className="ml-1.5 font-bold text-amber-700 hover:text-amber-900 hover:underline inline-flex items-center cursor-pointer"
              >
                {expandedHero ? t.readLess : t.readMore}
              </button>
            </p>

            <div className="pt-1.5">
              <FeatureCoinBadge
                feature={matchingFeature}
                walletBalance={walletBalance}
                language={language}
              />
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. MATCH YOUR KUNDLI TITLE
        ========================================================================= */}
        <div className="space-y-0.5 pt-1">
          <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900">
            {t.matchYourKundliTitle}
          </h2>
          <p className="text-xs text-stone-500">
            {t.matchYourKundliSubtitle}
          </p>
        </div>

        {/* =========================================================================
            4. SIDE-BY-SIDE 2-COLUMN FORM CARD (Matching Astrotalk)
        ========================================================================= */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-4 sm:p-6 shadow-xs space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 divide-y md:divide-y-0 md:divide-x divide-stone-100">
            {/* COLUMN 1: YOUR DETAILS (GROOM) */}
            <div className="space-y-4 md:pr-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-1">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fef9c3] border border-[#fde047] px-3.5 py-1 text-xs font-bold text-amber-900 shadow-2xs">
                  <span className="text-sm">♂</span>
                  <span>{t.yourDetailsTitle}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLoadGroomFromProfile}
                    className="inline-flex items-center gap-1 rounded-full border border-stone-200 hover:border-amber-400 bg-stone-50/80 hover:bg-amber-50/50 px-3 py-1 text-xs font-semibold text-stone-700 hover:text-stone-900 transition-colors shadow-2xs cursor-pointer"
                    title={language === "bn" ? "প্রোফাইল থেকে লোড করুন" : "Load from Profile"}
                  >
                    <span>{t.chooseKundliBtn}</span>
                    <span className="text-[10px]">▾</span>
                  </button>
                  {groom.name && (
                    <button
                      type="button"
                      onClick={handleClearGroom}
                      className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
                      title={language === "bn" ? "মুছে ফেলুন" : "Clear"}
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  {t.form.fullNameLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="relative rounded-2xl border border-stone-200 hover:border-stone-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-white px-3.5 py-2.5 flex items-center gap-2.5 transition-all shadow-2xs">
                  <User className="size-4 text-stone-400 shrink-0" />
                  <input
                    type="text"
                    value={groom.name}
                    onChange={(e) => setGroom((p) => ({ ...p, name: e.target.value }))}
                    placeholder={t.form.fullNamePlaceholder || "Rahul Sharma"}
                    className="w-full text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 bg-transparent outline-none font-medium"
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  {t.genderLabel}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { val: "male", label: "♂ " + t.genderMale },
                    { val: "female", label: "♀ " + t.genderFemale },
                    { val: "other", label: "⚥ " + t.genderOther },
                  ].map((g) => (
                    <button
                      key={g.val}
                      type="button"
                      onClick={() => setGroom((p) => ({ ...p, gender: g.val as any }))}
                      className={`min-h-10 rounded-xl border px-2 py-1.5 text-center text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                        groom.gender === g.val
                          ? "bg-[#fffbeb] border-[#f59e0b] text-stone-950 shadow-2xs font-extrabold"
                          : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Birth Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  {t.form.dobLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="rounded-2xl border border-stone-200 hover:border-stone-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-white px-3.5 py-2 flex items-center gap-2 shadow-2xs">
                  <Calendar className="size-4 text-stone-400 shrink-0" />
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    <input
                      ref={groomDayRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={groom.day}
                      onChange={handleGroomDayChange}
                      placeholder={t.form.dayPlaceholder || "DD"}
                      className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400"
                    />
                    <input
                      ref={groomMonthRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={groom.month}
                      onChange={handleGroomMonthChange}
                      placeholder={t.form.monthPlaceholder || "MM"}
                      className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400 border-x border-stone-200 px-1"
                    />
                    <input
                      ref={groomYearRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={groom.year}
                      onChange={handleGroomYearChange}
                      placeholder={t.form.yearPlaceholder || "YYYY"}
                      className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400"
                    />
                  </div>
                </div>
              </div>

              {/* Birth Time (optional) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-700">
                    {t.form.tobLabel} <span className="text-stone-400 font-normal">({t.birthTimeOptional})</span>
                  </label>
                  <span className="text-[11px] text-stone-400">{t.timeDefaultHint}</span>
                </div>
                <div className="rounded-2xl border border-stone-200 hover:border-stone-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-white px-3.5 py-2 flex items-center gap-2 shadow-2xs">
                  <Clock className="size-4 text-stone-400 shrink-0" />
                  <div className="grid grid-cols-4 gap-1.5 flex-1 items-center">
                    <input
                      ref={groomHourRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={groom.hour}
                      onChange={handleGroomHourChange}
                      placeholder="HH"
                      className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400"
                    />
                    <input
                      ref={groomMinuteRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={groom.minute}
                      onChange={handleGroomMinuteChange}
                      placeholder="MM"
                      className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400 border-x border-stone-200 px-1"
                    />
                    <input
                      ref={groomSecondRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={groom.second}
                      onChange={handleGroomSecondChange}
                      placeholder="SS"
                      className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400"
                    />
                    <select
                      aria-label="AM or PM"
                      value={groom.period ?? "AM"}
                      onChange={(e) => setGroom((p) => ({ ...p, period: e.target.value as "AM" | "PM" }))}
                      className="w-full text-center text-xs font-bold text-stone-800 bg-stone-100 rounded-lg py-1 outline-none cursor-pointer"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Birth Place */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  {t.form.placeLabel} <span className="text-rose-500">*</span>
                </label>
                <BirthPlaceField
                  value={groom.selectedPlace}
                  onChange={(next) => {
                    setGroomPlaceTouched(true);
                    setGroom((prev) => ({
                      ...prev,
                      selectedPlace: next,
                      place: next ? next.displayName || next.place : prev.place,
                      timezone: next?.timezoneOffset != null ? String(next.timezoneOffset) : prev.timezone,
                    }));
                  }}
                  birthDate={{
                    year: parseInt(groom.year, 10) || undefined,
                    month: parseInt(groom.month, 10) || undefined,
                    day: parseInt(groom.day, 10) || undefined,
                  }}
                  language={language}
                  invalid={groomPlaceTouched && !groom.selectedPlace}
                />
              </div>

              {/* Exact time lagna hint */}
              <div className="pt-0.5 flex items-start gap-1.5 text-[11px] text-stone-500 italic">
                <Info className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{t.exactTimeLagnaHint}</span>
              </div>

              {/* Advanced Settings */}
              <div className="pt-1 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowGroomAdvanced(!showGroomAdvanced)}
                  className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors py-1 cursor-pointer"
                >
                  <Sliders className="size-3 text-amber-600" />
                  <span>
                    {showGroomAdvanced ? t.form.hideAdvancedSettings : t.form.advancedSettings}
                  </span>
                  <ChevronDown
                    className={`size-3 text-stone-400 transition-transform ${
                      showGroomAdvanced ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showGroomAdvanced && (
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div>
                      <label className="block font-semibold text-stone-600 mb-1">{t.form.ayanamsa}</label>
                      <select
                        value={groom.ayanamsa}
                        onChange={(e) => setGroom((p) => ({ ...p, ayanamsa: e.target.value as any }))}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50/70 p-2 text-stone-900 outline-none"
                      >
                        <option value="lahiri">Lahiri (Chitrapaksha)</option>
                        <option value="raman">B.V. Raman</option>
                        <option value="krishnamurti">KP (Krishnamurti)</option>
                        <option value="sayana">Sayana (Tropical)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-600 mb-1">{t.form.houseSystem}</label>
                      <select
                        value={groom.houseSystem}
                        onChange={(e) => setGroom((p) => ({ ...p, houseSystem: e.target.value as any }))}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50/70 p-2 text-stone-900 outline-none"
                      >
                        <option value="placidus">Placidus</option>
                        <option value="whole_sign">Whole Sign</option>
                        <option value="equal">Equal House</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* COLUMN 2: PARTNER'S DETAILS (BRIDE) */}
            <div className="space-y-4 pt-4 md:pt-0 md:pl-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-1">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fef9c3] border border-[#fde047] px-3.5 py-1 text-xs font-bold text-amber-900 shadow-2xs">
                  <span className="text-sm">♀</span>
                  <span>{t.partnerDetailsTitle}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLoadSamplePartner}
                    className="inline-flex items-center gap-1 rounded-full border border-stone-200 hover:border-amber-400 bg-stone-50/80 hover:bg-amber-50/50 px-3 py-1 text-xs font-semibold text-stone-700 hover:text-stone-900 transition-colors shadow-2xs cursor-pointer"
                    title={language === "bn" ? "নমুনা কুন্ডলি লোড করুন" : "Load sample partner"}
                  >
                    <span>{t.chooseKundliBtn}</span>
                    <span className="text-[10px]">▾</span>
                  </button>
                  {bride.name && (
                    <button
                      type="button"
                      onClick={handleClearBride}
                      className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
                      title={language === "bn" ? "মুছে ফেলুন" : "Clear"}
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  {t.form.fullNameLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="relative rounded-2xl border border-stone-200 hover:border-stone-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-white px-3.5 py-2.5 flex items-center gap-2.5 transition-all shadow-2xs">
                  <User className="size-4 text-stone-400 shrink-0" />
                  <input
                    type="text"
                    value={bride.name}
                    onChange={(e) => setBride((p) => ({ ...p, name: e.target.value }))}
                    placeholder={language === "bn" ? "প্রিয়া শর্মা" : language === "hi" ? "प्रिया शर्मा" : "Priya Sharma"}
                    className="w-full text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 bg-transparent outline-none font-medium"
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  {t.genderLabel}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { val: "male", label: "♂ " + t.genderMale },
                    { val: "female", label: "♀ " + t.genderFemale },
                    { val: "other", label: "⚥ " + t.genderOther },
                  ].map((g) => (
                    <button
                      key={g.val}
                      type="button"
                      onClick={() => setBride((p) => ({ ...p, gender: g.val as any }))}
                      className={`min-h-10 rounded-xl border px-2 py-1.5 text-center text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                        bride.gender === g.val
                          ? "bg-[#fffbeb] border-[#f59e0b] text-stone-950 shadow-2xs font-extrabold"
                          : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Birth Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  {t.form.dobLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="rounded-2xl border border-stone-200 hover:border-stone-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-white px-3.5 py-2 flex items-center gap-2 shadow-2xs">
                  <Calendar className="size-4 text-stone-400 shrink-0" />
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    <input
                      ref={brideDayRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={bride.day}
                      onChange={handleBrideDayChange}
                      placeholder={t.form.dayPlaceholder || "DD"}
                      className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400"
                    />
                    <input
                      ref={brideMonthRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={bride.month}
                      onChange={handleBrideMonthChange}
                      placeholder={t.form.monthPlaceholder || "MM"}
                      className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400 border-x border-stone-200 px-1"
                    />
                    <input
                      ref={brideYearRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={bride.year}
                      onChange={handleBrideYearChange}
                      placeholder={t.form.yearPlaceholder || "YYYY"}
                      className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400"
                    />
                  </div>
                </div>
              </div>

              {/* Birth Time (optional) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-700">
                    {t.form.tobLabel} <span className="text-stone-400 font-normal">({t.birthTimeOptional})</span>
                  </label>
                  <span className="text-[11px] text-stone-400">{t.timeDefaultHint}</span>
                </div>
                <div className="rounded-2xl border border-stone-200 hover:border-stone-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-white px-3.5 py-2 flex items-center gap-2 shadow-2xs">
                  <Clock className="size-4 text-stone-400 shrink-0" />
                  <div className="grid grid-cols-4 gap-1.5 flex-1 items-center">
                    <input
                      ref={brideHourRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={bride.hour}
                      onChange={handleBrideHourChange}
                      placeholder="HH"
                      className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400"
                    />
                    <input
                      ref={brideMinuteRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={bride.minute}
                      onChange={handleBrideMinuteChange}
                      placeholder="MM"
                      className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400 border-x border-stone-200 px-1"
                    />
                    <input
                      ref={brideSecondRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={bride.second}
                      onChange={handleBrideSecondChange}
                      placeholder="SS"
                      className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400"
                    />
                    <select
                      aria-label="AM or PM"
                      value={bride.period ?? "AM"}
                      onChange={(e) => setBride((p) => ({ ...p, period: e.target.value as "AM" | "PM" }))}
                      className="w-full text-center text-xs font-bold text-stone-800 bg-stone-100 rounded-lg py-1 outline-none cursor-pointer"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Birth Place */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  {t.form.placeLabel} <span className="text-rose-500">*</span>
                </label>
                <BirthPlaceField
                  value={bride.selectedPlace}
                  onChange={(next) => {
                    setBridePlaceTouched(true);
                    setBride((prev) => ({
                      ...prev,
                      selectedPlace: next,
                      place: next ? next.displayName || next.place : prev.place,
                      timezone: next?.timezoneOffset != null ? String(next.timezoneOffset) : prev.timezone,
                    }));
                  }}
                  birthDate={{
                    year: parseInt(bride.year, 10) || undefined,
                    month: parseInt(bride.month, 10) || undefined,
                    day: parseInt(bride.day, 10) || undefined,
                  }}
                  language={language}
                  invalid={bridePlaceTouched && !bride.selectedPlace}
                />
              </div>

              {/* Exact time lagna hint */}
              <div className="pt-0.5 flex items-start gap-1.5 text-[11px] text-stone-500 italic">
                <Info className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{t.exactTimeLagnaHint}</span>
              </div>

              {/* Advanced Settings */}
              <div className="pt-1 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowBrideAdvanced(!showBrideAdvanced)}
                  className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors py-1 cursor-pointer"
                >
                  <Sliders className="size-3 text-amber-600" />
                  <span>
                    {showBrideAdvanced ? t.form.hideAdvancedSettings : t.form.advancedSettings}
                  </span>
                  <ChevronDown
                    className={`size-3 text-stone-400 transition-transform ${
                      showBrideAdvanced ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showBrideAdvanced && (
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div>
                      <label className="block font-semibold text-stone-600 mb-1">{t.form.ayanamsa}</label>
                      <select
                        value={bride.ayanamsa}
                        onChange={(e) => setBride((p) => ({ ...p, ayanamsa: e.target.value as any }))}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50/70 p-2 text-stone-900 outline-none"
                      >
                        <option value="lahiri">Lahiri (Chitrapaksha)</option>
                        <option value="raman">B.V. Raman</option>
                        <option value="krishnamurti">KP (Krishnamurti)</option>
                        <option value="sayana">Sayana (Tropical)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-600 mb-1">{t.form.houseSystem}</label>
                      <select
                        value={bride.houseSystem}
                        onChange={(e) => setBride((p) => ({ ...p, houseSystem: e.target.value as any }))}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50/70 p-2 text-stone-900 outline-none"
                      >
                        <option value="placidus">Placidus</option>
                        <option value="whole_sign">Whole Sign</option>
                        <option value="equal">Equal House</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Action Footer */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-stone-500 text-center sm:text-left">
              {t.formRequirementNote}
            </p>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleCalculateMatch}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#fcd404] hover:bg-[#ebd500] active:scale-[0.99] text-stone-950 font-bold px-8 py-3 text-sm shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>{t.calculatingBtn}</span>
                </>
              ) : (
                <>
                  <span>{t.matchHoroscopeBtn}</span>
                  <HeartHandshake className="size-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* =========================================================================
            5. RELATED GUIDES PILLS
        ========================================================================= */}
        <div className="space-y-2 pt-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
            {language === "bn" ? "প্রাসঙ্গিক সহায়িকা" : language === "hi" ? "संबंधित गाइड" : "RELATED GUIDES"}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: language === "bn" ? "কীভাবে কুন্ডলি দেখতে হয়" : language === "hi" ? "कुंडली कैसे पढ़ें" : "How to Read Kundli", href: "/kundli" },
              { label: language === "bn" ? "কুন্ডলির ভাব বা ঘরের অর্থ" : language === "hi" ? "कुंडली में भाव कैसे समझें" : "How to Read Houses in Kundli", href: "/kundli" },
              { label: language === "bn" ? "জ্যোতিষে গ্রহের প্রভাব" : language === "hi" ? "ज्योतिष में ग्रह कैसे समझें" : "How to Read Planets in Astrology", href: "/kundli" },
              { label: language === "bn" ? "গ্রহ, রাশি ও ভাব বিস্তার" : language === "hi" ? "ग्रह, राशियां और भाव" : "Planets, Signs & Houses in Astrology", href: "/kundli" },
              { label: language === "bn" ? "গ্রহ ও রাশির গুরুত্ব ও তাৎপর্য" : language === "hi" ? "ग्रह और राशियों का महत्व" : "Planets, Signs and Their Significance", href: "/kundli" },
            ].map((guide, idx) => (
              <Link
                key={idx}
                href={guide.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 hover:border-amber-300 px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 transition-colors shadow-2xs"
              >
                <span>{guide.label}</span>
                <span className="text-stone-400 text-[10px]">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* =========================================================================
            6. EDUCATIONAL DOSSIER & SIDEBAR (Astrotalk Matchmaking Style)
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          {/* LEFT COLUMN: 8 COLS */}
          <div className="lg:col-span-8 space-y-6">
            {/* Why is Kundali Matching Important */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7 shadow-xs space-y-4">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                {t.whyImportantTitle}
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-1">
                    {t.emotionalTitle}
                  </h3>
                  <p>{t.emotionalDesc}</p>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-1">
                    {t.financialTitle}
                  </h3>
                  <p>{t.financialDesc}</p>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-1">
                    {t.healthLongevityTitle}
                  </h3>
                  <p>{t.healthLongevityDesc}</p>
                </div>
              </div>
            </div>

            {/* Deep Astrological Steps */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7 shadow-xs space-y-4">
              <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-1">
                    {t.step7thHouseTitle}
                  </h3>
                  <p>{t.step7thHouseDesc}</p>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-1">
                    {t.stepDashaTitle}
                  </h3>
                  <p>{t.stepDashaDesc}</p>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-1">
                    {t.stepNavamsaTitle}
                  </h3>
                  <p>{t.stepNavamsaDesc}</p>
                </div>
              </div>
            </div>

            {/* The 8 Kootas in Guna Milan Table */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7 shadow-xs space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                  {t.kootasTableTitle}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {t.kootasTableSub}
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-stone-200">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Koota</th>
                      <th className="py-2.5 px-3 text-center">Points</th>
                      <th className="py-2.5 px-3">Area of Life & Vedic Significance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-600">
                    {[
                      { koota: "Varna (বর্ণ)", pts: 1, desc: language === "bn" ? "আধ্যাত্মিক সামঞ্জস্য এবং উভয়ের আত্মসম্মানের ভারসাম্য" : language === "hi" ? "आध्यात्मिक अनुकूलता और अहंकार का संतुलन" : "Spiritual compatibility, ego alignment and mutual respect" },
                      { koota: "Vashya (বশ্য)", pts: 2, desc: language === "bn" ? "পারস্পরিক আকর্ষণ, মানসিক নিয়ন্ত্রণ ও দাম্পত্য আনুগত্য" : language === "hi" ? "आपसी आकर्षण, नियंत्रण और निष्ठा" : "Mutual attraction, influence, emotional control and power dynamics" },
                      { koota: "Tara (তারা)", pts: 3, desc: language === "bn" ? "জন্ম নক্ষত্রের শুভত্ব, ভাগ্য ও দীর্ঘায়ুর অনুকূলতা" : language === "hi" ? "जन्म नक्षत्र अनुकूलता, भाग्य और खुशहाली" : "Birth star compatibility, destiny and partner's well-being" },
                      { koota: "Yoni (যোনি)", pts: 4, desc: language === "bn" ? "দৈহিক আকর্ষণ, ঘনিষ্ঠতা ও জৈবিক সঙ্গতি" : language === "hi" ? "शारीरिक अनुकूलता, अंतरंगता और यौन संतुष्टि" : "Physical intimacy, sexual compatibility and mutual affection" },
                      { koota: "Graha Maitri (গ্রহ মৈত্রী)", pts: 5, desc: language === "bn" ? "চন্দ্র রাশির অধিপতিদের বন্ধুত্ব, মানসিক মিলন ও দৃষ্টিভঙ্গির মিল" : language === "hi" ? "मानसिक तालमेल, चंद्रमा के स्वामियों की मित्रता" : "Mental and intellectual friendship, communication and worldview" },
                      { koota: "Gana (গণ)", pts: 6, desc: language === "bn" ? "স্বভাব ও মেজাজ (দেব, নর বা রাক্ষস গণ) এর সামঞ্জস্য" : language === "hi" ? "स्वभाव और व्यवहारिक अनुकूलता (देव, मनुष्य, राक्षस)" : "Temperamental and behavioral harmony between social instincts" },
                      { koota: "Bhakoot (ভকূট)", pts: 7, desc: language === "bn" ? "পারিবারিক সমৃদ্ধি, দীর্ঘমেয়াদী ভালোবাসা ও অর্থভাগ্য" : language === "hi" ? "पारिवारिक समृद्धि, प्रेम और आर्थिक स्थिति" : "Family prosperity, emotional depth, longevity and financial flow" },
                      { koota: "Nadi (নাড়ী)", pts: 8, desc: language === "bn" ? "জিনগত অনুকূলতা, স্নায়বিক স্বাস্থ্য ও সুস্থ সন্তানসন্ততি" : language === "hi" ? "आनुवंशिक संगतता, स्वास्थ्य और स्वस्थ संतान" : "Genetic compatibility, nervous and physiological health, progeny" },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/30 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-stone-900">{row.koota}</td>
                        <td className="py-2.5 px-3 text-center font-extrabold text-amber-900">{row.pts}</td>
                        <td className="py-2.5 px-3">{row.desc}</td>
                      </tr>
                    ))}
                    <tr className="bg-amber-50/70 font-bold text-stone-900 border-t border-amber-200">
                      <td className="py-2.5 px-3">{language === "bn" ? "সর্বমোট গুণ" : language === "hi" ? "कुल गुण" : "Total Gunas"}</td>
                      <td className="py-2.5 px-3 text-center text-base text-amber-900 font-black">36</td>
                      <td className="py-2.5 px-3 text-xs text-stone-600">
                        {language === "bn" ? "১৮ বা তার বেশি গুণ অনুকূল হিসেবে বিবেচিত হয়" : language === "hi" ? "18 या अधिक गुण अनुकूल माने जाते हैं" : "18 or more points are considered auspicious for marriage"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 4 COLS (Sample report card & Live Astrologers) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Kundli Milan Report Card */}
            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs space-y-3">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  {t.sampleReportTitle}
                </h3>
                <p className="text-xs text-stone-500">
                  {t.sampleReportSubtitle}
                </p>
              </div>

              {/* Sample report preview image */}
              <div className="relative overflow-hidden rounded-xl border border-stone-100 bg-amber-50 aspect-[4/3] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero-kundli-sample.webp"
                  alt="Kundli Milan Report Sample"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to stylized box
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Astra Milan Dossier
                  </div>
                  <div className="text-sm font-serif font-bold">
                    36 Guna Ashtakoota & Manglik Analysis
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-stone-900">₹1,599</span>
                    <span className="text-xs text-stone-400 line-through">₹3,199</span>
                  </div>
                  <span className="inline-block text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5">
                    {t.sampleReportDiscount}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSampleModalOpen(true)}
                  className="size-9 rounded-full bg-[#fcd404] hover:bg-[#ebd500] text-stone-950 flex items-center justify-center font-bold shadow-xs transition-colors cursor-pointer"
                  title="View Sample Report"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>

            {/* Live Astrologer Card (NO DUMMY DATA) */}
            <AstrologerMatchmakingCard language={language} t={t} />
          </div>
        </div>

        {/* =========================================================================
            RESULTS SECTION (Visible after calculation)
           ========================================================================= */}
        {result && (
          <div id="matching-results" className="space-y-8 reveal-cascade pt-4">
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
                  className={`py-2.5 px-3.5 sm:px-4 text-xs sm:text-sm font-bold rounded-xl press transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
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
                  className={`py-2.5 px-3.5 sm:px-4 text-xs sm:text-sm font-bold rounded-xl press transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
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
                  className={`py-2.5 px-3.5 sm:px-4 text-xs sm:text-sm font-bold rounded-xl press transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
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
                  className={`py-2.5 px-3.5 sm:px-4 text-xs sm:text-sm font-bold rounded-xl press transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
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
                  className={`py-2.5 px-3.5 sm:px-4 text-xs sm:text-sm font-bold rounded-xl press transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
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
                  className={`py-2.5 px-3.5 sm:px-4 text-xs sm:text-sm font-bold rounded-xl press transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
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
                  className={`py-2.5 px-3.5 sm:px-4 text-xs sm:text-sm font-bold rounded-xl press transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
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
                  className={`py-2.5 px-3.5 sm:px-4 text-xs sm:text-sm font-bold rounded-xl press transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
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
                  className={`py-2.5 px-3.5 sm:px-4 text-xs sm:text-sm font-bold rounded-xl press transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
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
                <div className="space-y-6 fade-in">
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
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold press transition-all shadow-xs shrink-0 cursor-pointer"
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
                <div className="space-y-6 fade-in">
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
                <div className="space-y-6 fade-in">
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
                <div className="space-y-6 fade-in">
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
                <div className="space-y-6 fade-in">
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
                <div className="space-y-6 fade-in">
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
                <div className="space-y-6 fade-in">
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
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 press transition-colors shrink-0 shadow-2xs"
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
                <div className="space-y-6 fade-in">
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
                <div className="space-y-6 fade-in">
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
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border press transition-all ${
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
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border press transition-all ${
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
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border press transition-all ${
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
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border press transition-all ${
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
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border press transition-all ${
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
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border press transition-all ${
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
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border press transition-all ${
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs press transition-all"
                >
                  <Download className="size-3.5" />
                  <span>{t.downloadPdfButton}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-xs press transition-all cursor-pointer"
                >
                  <RotateCcw className="size-3.5" />
                  <span>{t.recalculateButton}</span>
                </button>

                <Link
                  href="/astrologers"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs press transition-all"
                >
                  <MessageCircle className="size-3.5" />
                  <span>{t.consultAstrologerBtn}</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <SampleMatchReportModal
        open={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
        language={language}
        t={t}
      />

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
