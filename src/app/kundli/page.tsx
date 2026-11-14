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
  ChevronDown,
  ChevronUp,
  HeartHandshake,
  Languages,
  User,
  Download,
  MessageCircle,
  Lock,
  Edit,
  FilePlus,
  Award,
  ShieldCheck,
  Compass,
  Gem,
  Flame,
  Heart,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  X,
  Info,
  Star,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { astrologyApi, astrologerApi } from "@/lib/api";
import {
  BirthPlaceField,
  type SelectedPlace,
} from "@/components/astrology/birth-place-field";
import { KundliDiamondChart } from "@/components/astrology/kundli-diamond-chart";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";
import { usePlatform } from "@/providers/realtime-provider";
import { useProfile } from "@/hooks/use-profile";
import { useFeaturePricing } from "@/hooks/use-feature-pricing";
import {
  FeatureCoinBadge,
  FeatureDisabledAlert,
  FeatureCoinModal,
} from "@/components/astrology/feature-pricing-banner";
import {
  KUNDLI_UI_STRINGS,
  KUNDLI_GENDER_NAMES,
  type KundliLanguage,
  type KundliUiStrings,
  translatePlanetName,
  translateRashiName,
  translateNakshatraName,
  translateDayName,
  translateTithi,
  translateKaran,
  translateYoga,
  translateDmsStyled,
  translateHouseName,
  translateDashaCardTitle,
  translateDashaDuration,
  translateBalDasa,
  translateYogaName,
  translateYogaDetails,
  translateMetal,
  translateFinger,
  translateWearingDay,
  toLocalizedDigits,
} from "@/lib/kundli-translations";
import {
  SKILL_LABELS,
  type AstrologyLanguage,
  type AyanamsaType,
  type KundliCalculatePayload,
  type KundliCalculateResult,
  type UserProfile,
  type UserPublic,
} from "@/types";
import { coinsPerMinute } from "@/lib/utils";

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

// Authentic Vedic Parchment Scroll illustration matching Screenshot 1 (Compact & Sleek)
function VedicParchmentScroll({ className = "" }: { className?: string }) {
  return (
    <div className={`relative select-none py-1 ${className || "w-[120px] sm:w-[140px]"}`}>
      {/* Top Wooden Roller Dowel with Turned Finials */}
      <div className="relative flex items-center justify-center -mb-1 z-10 drop-shadow-xs">
        <div className="w-2.5 h-3.5 rounded-l-full bg-gradient-to-r from-amber-950 via-amber-800 to-amber-900 border border-amber-950 shadow-xs" />
        <div className="h-2 flex-1 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 border-y border-amber-950 shadow-inner rounded-xs" />
        <div className="w-2.5 h-3.5 rounded-r-full bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 border border-amber-950 shadow-xs" />
      </div>

      {/* Parchment Body */}
      <div className="relative bg-gradient-to-b from-[#faf5e6] via-[#fbf7eb] to-[#f5edd4] border-x border-amber-700/40 p-1.5 sm:p-2 shadow-[0_6px_16px_rgba(180,83,9,0.08)] rounded-xs">
        {/* Subtle Watermark Glyph in Center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06]">
          <span className="text-3xl font-serif text-amber-900 select-none">ॐ</span>
        </div>

        {/* Inner Ornamental Border */}
        <div className="border border-amber-600/35 p-1 bg-amber-50/30 rounded-xs">
          {/* Traditional North Indian Kundli Diamond Chart Artwork */}
          <svg
            viewBox="0 0 300 300"
            className="w-full h-auto aspect-square stroke-amber-700/85 fill-none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Outer Boundary Box */}
            <rect x="8" y="8" width="284" height="284" strokeWidth="2.4" stroke="#b45309" />

            {/* Inner Diagonals & Central Diamond */}
            <line x1="8" y1="8" x2="292" y2="292" />
            <line x1="8" y1="292" x2="292" y2="8" />
            <polygon points="150,8 292,150 150,292 8,150" strokeWidth="2.2" stroke="#b45309" />

            {/* Sacred House Numbers in Deep Vedic Saffron */}
            <text x="150" y="75" textAnchor="middle" fill="#92400e" fontSize="15" fontWeight="bold">1</text>
            <text x="85" y="45" textAnchor="middle" fill="#92400e" fontSize="14" fontWeight="bold">2</text>
            <text x="45" y="85" textAnchor="middle" fill="#92400e" fontSize="14" fontWeight="bold">3</text>
            <text x="75" y="155" textAnchor="middle" fill="#92400e" fontSize="15" fontWeight="bold">4</text>
            <text x="45" y="225" textAnchor="middle" fill="#92400e" fontSize="14" fontWeight="bold">5</text>
            <text x="85" y="265" textAnchor="middle" fill="#92400e" fontSize="14" fontWeight="bold">6</text>
            <text x="150" y="235" textAnchor="middle" fill="#92400e" fontSize="15" fontWeight="bold">7</text>
            <text x="215" y="265" textAnchor="middle" fill="#92400e" fontSize="14" fontWeight="bold">8</text>
            <text x="255" y="225" textAnchor="middle" fill="#92400e" fontSize="14" fontWeight="bold">9</text>
            <text x="225" y="155" textAnchor="middle" fill="#92400e" fontSize="15" fontWeight="bold">10</text>
            <text x="255" y="85" textAnchor="middle" fill="#92400e" fontSize="14" fontWeight="bold">11</text>
            <text x="215" y="45" textAnchor="middle" fill="#92400e" fontSize="14" fontWeight="bold">12</text>

            {/* Auspicious Vedic Planetary Glyphs in Classical Saffron */}
            <text x="150" y="100" textAnchor="middle" fill="#b45309" fontSize="14" fontWeight="700">लग्न</text>
            <text x="150" y="125" textAnchor="middle" fill="#d97706" fontSize="13" fontWeight="600">সূর্য / চন্দ্র</text>
            <text x="75" y="175" textAnchor="middle" fill="#b45309" fontSize="13" fontWeight="600">বৃহ</text>
            <text x="225" y="175" textAnchor="middle" fill="#b45309" fontSize="13" fontWeight="600">শুক্র</text>
            <text x="150" y="205" textAnchor="middle" fill="#b45309" fontSize="13" fontWeight="600">বুধ</text>
          </svg>
        </div>
      </div>

      {/* Bottom Wooden Roller Dowel with Turned Finials */}
      <div className="relative flex items-center justify-center -mt-1 z-10 drop-shadow-xs">
        <div className="w-2.5 h-3.5 rounded-l-full bg-gradient-to-r from-amber-950 via-amber-800 to-amber-900 border border-amber-950 shadow-xs" />
        <div className="h-2 flex-1 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 border-y border-amber-950 shadow-inner rounded-xs" />
        <div className="w-2.5 h-3.5 rounded-r-full bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 border border-amber-950 shadow-xs" />
      </div>
    </div>
  );
}

// Sidebar Card: Real Live Astrologers from MongoDB via REST API (No Dummy Data)
function AstrologerSidebarCard({
  language,
  t,
}: {
  language: KundliLanguage;
  t: KundliUiStrings;
}) {
  const { data: astrologersData, isLoading } = useQuery({
    queryKey: ["astrologers", { kundli_sidebar: true, limit: 6 }],
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
    <div className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-xs flex flex-col justify-between h-full space-y-6">
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
                  .join(", ") || "Vedic Astrology";
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

// Sample Report Modal Preview
function SampleReportModal({
  open,
  onClose,
  language,
  t,
}: {
  open: boolean;
  onClose: () => void;
  language: KundliLanguage;
  t: KundliUiStrings;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/60 backdrop-blur-xs fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="space-y-1">
            <span className="inline-block text-[11px] font-bold text-amber-800 tracking-wider uppercase">
              {language === "bn" ? "প্রামাণ্য বৈদিক নমুনা" : "Vedic Sample Preview"}
            </span>
            <h3 className="font-display text-xl font-extrabold text-stone-900">
              {t.sampleReportTitle}
            </h3>
            <p className="text-xs text-stone-500">
              {t.sampleReportDesc}
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

        {/* Sample Content */}
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
            <div>
              <span className="text-stone-500 block text-[11px]">{t.nameLabel}</span>
              <span className="font-bold text-stone-900">Aryan Sharma</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[11px]">{t.lblAsc}</span>
              <span className="font-bold text-stone-900">{language === "bn" ? "তুলা (Libra)" : "Libra (তুলা)"}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[11px]">{t.lblRasi}</span>
              <span className="font-bold text-stone-900">{language === "bn" ? "মেষ (Aries)" : "Aries (মেষ)"}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[11px]">{t.thNakshatra}</span>
              <span className="font-bold text-stone-900">{language === "bn" ? "অশ্বিনী (Pada 3)" : "Ashwini (Pada 3)"}</span>
            </div>
          </div>

          {/* Miniature Diamond Chart Artwork */}
          <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-200 flex flex-col items-center justify-center space-y-2">
            <span className="text-[11px] font-bold text-amber-900">
              {language === "bn" ? "লগ্ন কুন্ডলী (D1) ও নবাংশ (D9) চার্ট স্যাম্পল" : "Lagna (D1) & Navamsa (D9) Chart Sample"}
            </span>
            <div className="w-48 sm:w-56">
              <VedicParchmentScroll />
            </div>
          </div>

          {/* Sample Planetary Dignities */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-900">
              {language === "bn" ? "প্রধান গ্রহের অবস্থান ও যোগ" : "Key Planetary Positions & Yogas"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
              <div className="p-2.5 rounded-xl border border-stone-200 bg-white">
                <span className="font-bold text-stone-900">☀️ সূর্য (Sun):</span> ১০ম ভাব (কর্মভাব), মূলত্রিকোণ
              </div>
              <div className="p-2.5 rounded-xl border border-stone-200 bg-white">
                <span className="font-bold text-stone-900">♃ বৃহস্পতি (Jupiter):</span> ৪র্থ ভাব, গজকেশরী যোগ
              </div>
              <div className="p-2.5 rounded-xl border border-stone-200 bg-white">
                <span className="font-bold text-stone-900">♀ শুক্র (Venus):</span> ১ম ভাব (লগ্ন ভাব), মালব্য যোগ
              </div>
              <div className="p-2.5 rounded-xl border border-stone-200 bg-white">
                <span className="font-bold text-stone-900">♄ শনি (Saturn):</span> ৫ম ভাব, শশ মহাপুরুষ যোগ
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
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

export default function KundliPage() {
  const { user, isSignedIn } = useAuth();
  const { data: profile } = useProfile({ enabled: isSignedIn });
  const { getFeature, checkAccess, walletBalance, refresh: refreshWallet } = useFeaturePricing();
  const kundliFeature = getFeature("kundli");
  const [coinModalOpen, setCoinModalOpen] = React.useState(false);
  const [coinModalReason, setCoinModalReason] = React.useState<"unauthorized" | "insufficient_coins" | "disabled">("insufficient_coins");
  const [expandedHero, setExpandedHero] = React.useState(false);
  const [sampleModalOpen, setSampleModalOpen] = React.useState(false);

  // Centralized Language state
  const { language, setLanguage } = useLanguage();
  const t = KUNDLI_UI_STRINGS[language] || KUNDLI_UI_STRINGS.bn;

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
  const [selectedPlace, setSelectedPlace] = React.useState<SelectedPlace | null>(null);
  const [placeTouched, setPlaceTouched] = React.useState(false);
  const [latitude, setLatitude] = React.useState<number | null>(null);
  const [longitude, setLongitude] = React.useState<number | null>(null);
  const [timezone, setTimezone] = React.useState("5.5");
  const [ayanamsa, setAyanamsa] = React.useState<AyanamsaType>("lahiri");
  const [houseSystem, setHouseSystem] = React.useState<"placidus" | "equal" | "whole_sign">("placidus");
  const [showAdvance, setShowAdvance] = React.useState(false);

  // Chart Style Selector: "north" | "east" | "south" | "wheel"
  const [chartStyle, setChartStyle] = React.useState<"north" | "east" | "south" | "wheel">("north");
  const [activeChartTab, setActiveChartTab] = React.useState<"d1" | "d9" | "d10" | "d7">("d1");
  const [activeHouseTab, setActiveHouseTab] = React.useState<number>(1);

  // Loading & Result
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<KundliCalculateResult | null>(null);

  const formRef = React.useRef<HTMLDivElement>(null);
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
        if (placeName) {
          setPlace(placeName);
          const lat = b.latitude != null && !isNaN(Number(b.latitude)) ? Number(b.latitude) : 22.5726;
          const lon = b.longitude != null && !isNaN(Number(b.longitude)) ? Number(b.longitude) : 88.3639;
          setLatitude(lat);
          setLongitude(lon);

          let tzOffset = 5.5;
          let tzName: string | null = null;
          if (b.timezone_offset != null && !isNaN(Number(b.timezone_offset))) {
            tzOffset = Number(b.timezone_offset);
          } else if (b.timezone != null && !isNaN(Number(b.timezone))) {
            tzOffset = Number(b.timezone);
          }
          if (typeof b.timezone === "string" && isNaN(Number(b.timezone))) {
            tzName = b.timezone;
          }

          setSelectedPlace({
            place: placeName,
            displayName: placeName,
            latitude: lat,
            longitude: lon,
            timezoneName: tzName,
            timezoneOffset: tzOffset,
            timezoneLabel: tzName || `UTC+${tzOffset}`,
            timezoneAbbreviation: null,
            isDst: false,
          });
          setTimezone(String(tzOffset));
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

  // Input Handlers with auto-focus
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

  const handleResetForm = () => {
    setName("");
    setDay("");
    setMonth("");
    setYear("");
    setHour("");
    setMinute("");
    setSecond("");
    setPlace("");
    setSelectedPlace(null);
    setPlaceTouched(false);
  };

  const handleReloadFromProfile = () => {
    if (profile) {
      populateFromProfileData(profile, user);
      toast.success(t.toastProfileLoaded);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(t.toastEnterName);
      return;
    }

    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (
      !day ||
      isNaN(d) ||
      d < 1 ||
      d > 31 ||
      !month ||
      isNaN(m) ||
      m < 1 ||
      m > 12 ||
      !year ||
      isNaN(y) ||
      y < 1800 ||
      y > 2100
    ) {
      toast.error(t.toastEnterDob);
      return;
    }

    if (!selectedPlace && !place.trim()) {
      setPlaceTouched(true);
      toast.error(t.toastChoosePlace);
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

    const effectiveLat =
      selectedPlace?.latitude != null && !isNaN(selectedPlace.latitude)
        ? selectedPlace.latitude
        : latitude != null && !isNaN(latitude)
        ? latitude
        : 22.5726;

    const effectiveLon =
      selectedPlace?.longitude != null && !isNaN(selectedPlace.longitude)
        ? selectedPlace.longitude
        : longitude != null && !isNaN(longitude)
        ? longitude
        : 88.3639;

    const rawTz =
      selectedPlace?.timezoneOffset != null && !isNaN(selectedPlace.timezoneOffset)
        ? selectedPlace.timezoneOffset
        : parseFloat(timezone);
    const effectiveTz = typeof rawTz === "number" && !isNaN(rawTz) ? rawTz : 5.5;

    const effectivePlace = selectedPlace?.place ?? (place.trim() || "Kolkata, West Bengal, India");

    const effectiveTzName =
      selectedPlace?.timezoneName ||
      (typeof profile?.birth?.timezone === "string" && isNaN(Number(profile.birth.timezone))
        ? profile.birth.timezone
        : null);

    const payload: KundliCalculatePayload = {
      name: name.trim(),
      gender,
      day: d,
      month: m,
      year: y,
      hour: parsedHour,
      minute: parsedMinute,
      second: parsedSecond,
      period: effectivePeriod,
      place: effectivePlace,
      latitude: effectiveLat,
      longitude: effectiveLon,
      timezone: effectiveTz,
      timezone_name: effectiveTzName,
      ayanamsa,
      house_system: houseSystem,
      chart_style:
        chartStyle === "wheel"
          ? "north_indian"
          : chartStyle === "south"
          ? "south_indian"
          : chartStyle === "east"
          ? "east_indian"
          : "north_indian",
      language,
    };

    const access = checkAccess("kundli");
    if (!access.allowed) {
      if (access.reason === "disabled") {
        toast.error(t.toastDisabled);
        return;
      }
      setCoinModalReason(access.reason || "insufficient_coins");
      setCoinModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const resp = await astrologyApi.calculateKundli(payload);
      setResult(resp);
      if (access.requiredCoins > 0) {
        toast.success(t.toastSuccessCoins(access.requiredCoins));
        refreshWallet();
      } else {
        toast.success(t.toastSuccess);
      }
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (err: any) {
      console.error("Kundli calculation error:", err);
      if (err?.code === "insufficient_coins") {
        setCoinModalReason("insufficient_coins");
        setCoinModalOpen(true);
      } else if (err?.code === "authentication_required" || err?.status === 401) {
        setCoinModalReason("unauthorized");
        setCoinModalOpen(true);
      } else {
        const detailedMsg =
          err?.fieldErrors && Object.keys(err.fieldErrors).length > 0
            ? Object.entries(err.fieldErrors)
                .map(([f, m]) => `${f}: ${m}`)
                .join(", ")
            : err?.message || "Failed to calculate Kundli.";
        toast.error(detailedMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Printable Download PDF Handler
  const handlePrintDownload = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9]/70 text-stone-900 flex flex-col font-sans pb-24">
      <SiteHeader />

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-3 sm:px-6 py-4 flex-1 w-full space-y-5">
        {/* =========================================================================
            1. BREADCRUMB & LANGUAGE SWITCHER
        ========================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 pt-0.5 pb-1">
          <div className="flex items-center gap-1.5 uppercase tracking-wider font-semibold">
            <Link href="/" className="hover:text-amber-700 transition-colors">
              {t.breadcrumbHome}
            </Link>
            <span className="text-stone-300">&gt;</span>
            <span className="text-stone-900 font-bold">{t.breadcrumbKundli}</span>
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
        <div className="relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-r from-amber-50/50 via-white to-amber-50/30 px-4 sm:px-6 py-3.5 shadow-2xs">
          {/* Faint rotating zodiac wheel in background (matching horoscope) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/zodiac-wheel-gold.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 size-[280px] sm:size-[360px] select-none opacity-[0.14] mix-blend-multiply animate-spin [animation-duration:120s] motion-reduce:animate-none"
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left Content: Compact Title, Description & Pricing */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <h1 className="font-display text-lg sm:text-2xl font-bold tracking-tight text-stone-900 leading-snug">
                {t.heroTitle} <span className="text-amber-600 font-extrabold">{t.heroHighlight}</span>
              </h1>

              <div className="text-xs text-stone-600 leading-relaxed max-w-2xl">
                <p className={expandedHero ? "" : "line-clamp-2 sm:line-clamp-none"}>
                  {t.heroDescription}
                </p>
                {expandedHero && (
                  <p className="fade-in pt-1 text-stone-600">{t.heroDescriptionExpanded}</p>
                )}
                <button
                  type="button"
                  onClick={() => setExpandedHero((prev) => !prev)}
                  className="inline-flex items-center gap-1 font-bold text-amber-700 hover:text-amber-800 transition-colors cursor-pointer text-[11px] pt-0.5"
                >
                  {expandedHero ? t.readLess : t.readMore}
                </button>
              </div>

              {/* Coin Pricing Badge */}
              <div className="pt-0.5 flex items-center gap-2">
                <FeatureCoinBadge
                  feature={kundliFeature}
                  walletBalance={walletBalance}
                  language={language}
                />
              </div>
            </div>

            {/* Right: Small, sleek Vedic Parchment Scroll */}
            <div className="shrink-0 flex items-center justify-center">
              <VedicParchmentScroll className="w-[110px] sm:w-[130px]" />
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. MAIN 2-COLUMN GRID: Form Card (Left) & Live Astrologers (Right)
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Card */}
          <div ref={formRef} className="lg:col-span-8">
            <div className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              {/* Top Header of Form */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fef9c3] border border-[#fde047] px-3.5 py-1 text-xs font-bold text-amber-900 shadow-2xs">
                  <span className="text-sm">♂</span>
                  <span>{t.newKundliBadge}</span>
                </div>

                {isSignedIn ? (
                  <button
                    type="button"
                    onClick={handleReloadFromProfile}
                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 hover:border-amber-400 bg-stone-50/80 hover:bg-amber-50/50 px-3.5 py-1 text-xs font-semibold text-stone-700 hover:text-stone-900 transition-colors shadow-2xs cursor-pointer"
                  >
                    <RefreshCw className="size-3 text-amber-600" />
                    <span>{t.savedKundliBtn}</span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 hover:border-amber-400 bg-stone-50/80 hover:bg-amber-50/50 px-3.5 py-1 text-xs font-semibold text-stone-700 hover:text-stone-900 transition-colors shadow-2xs"
                  >
                    <User className="size-3 text-amber-600" />
                    <span>{t.savedKundliBtn}</span>
                  </Link>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm">
                {/* 1. Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">
                    {t.nameLabel}
                  </label>
                  <div className="relative rounded-2xl border border-stone-200 hover:border-stone-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-white px-3.5 py-2.5 flex items-center gap-2.5 transition-all shadow-2xs">
                    <User className="size-4 text-stone-400 shrink-0" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.namePlaceholder || "Rahul Sharma"}
                      className="w-full text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 bg-transparent outline-none font-medium"
                    />
                  </div>
                </div>

                {/* 2. Gender & Birth Date Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Gender Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      {t.genderLabel}
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { val: "male", label: "♂ " + (language === "bn" ? "পুরুষ" : language === "hi" ? "पुरुष" : "Male") },
                        { val: "female", label: "♀ " + (language === "bn" ? "মহিলা" : language === "hi" ? "महिला" : "Female") },
                        { val: "other", label: "⚥ " + (language === "bn" ? "অন্যান্য" : language === "hi" ? "अन्य" : "Other") },
                      ].map((g) => (
                        <button
                          key={g.val}
                          type="button"
                          onClick={() => setGender(g.val as any)}
                          className={`min-h-11 rounded-2xl border px-2 py-2 text-center text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                            gender === g.val
                              ? "bg-[#fcd404] border-[#fcd404] text-stone-950 shadow-xs font-extrabold"
                              : "bg-stone-100/70 border-stone-200/80 text-stone-700 hover:bg-stone-200/60 font-semibold"
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
                      {t.dobLabel} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative rounded-2xl border border-stone-200 hover:border-stone-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-white px-3 py-2 flex items-center gap-2 transition-all shadow-2xs min-h-11">
                      <Calendar className="size-4 text-stone-400 shrink-0" />
                      <div className="grid grid-cols-3 gap-1 flex-1 items-center">
                        <input
                          ref={dayRef}
                          type="text"
                          inputMode="numeric"
                          maxLength={2}
                          value={day}
                          onChange={handleDayChange}
                          placeholder="dd"
                          className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400"
                        />
                        <span className="text-stone-300 text-center select-none font-bold">/</span>
                        <input
                          ref={monthRef}
                          type="text"
                          inputMode="numeric"
                          maxLength={2}
                          value={month}
                          onChange={handleMonthChange}
                          placeholder="mm"
                          className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400"
                        />
                        <span className="text-stone-300 text-center select-none font-bold">/</span>
                        <input
                          ref={yearRef}
                          type="text"
                          inputMode="numeric"
                          maxLength={4}
                          value={year}
                          onChange={handleYearChange}
                          placeholder="yyyy"
                          className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Birth Time & Birth Place Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Birth Time */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      {t.tobLabel}{" "}
                      <span className="text-[11px] font-normal text-stone-500">
                        ({t.tobOptional})
                      </span>
                    </label>
                    <div className="relative rounded-2xl border border-stone-200 hover:border-stone-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-white px-3 py-2 flex items-center gap-2 transition-all shadow-2xs min-h-11">
                      <Clock className="size-4 text-stone-400 shrink-0" />
                      <div className="grid grid-cols-4 gap-1 flex-1 items-center">
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
                          placeholder="MM"
                          className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400"
                        />
                        <input
                          ref={secondRef}
                          type="text"
                          inputMode="numeric"
                          maxLength={2}
                          value={second}
                          onChange={handleSecondChange}
                          placeholder="SS"
                          className="w-full text-center text-xs sm:text-sm font-semibold text-stone-900 bg-transparent outline-none placeholder:text-stone-400"
                        />
                        <select
                          aria-label="AM or PM"
                          value={period}
                          onChange={(e) => setPeriod(e.target.value as any)}
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
                      {t.placeLabel} <span className="text-rose-500">*</span>
                    </label>
                    <BirthPlaceField
                      value={selectedPlace}
                      onChange={(next) => {
                        setSelectedPlace(next);
                        if (next) {
                          setPlace(next.place);
                          setLatitude(next.latitude);
                          setLongitude(next.longitude);
                          if (next.timezoneOffset != null) setTimezone(String(next.timezoneOffset));
                        }
                      }}
                      birthDate={{
                        year: parseInt(year, 10) || undefined,
                        month: parseInt(month, 10) || undefined,
                        day: parseInt(day, 10) || undefined,
                      }}
                      language={language}
                      invalid={placeTouched && !selectedPlace}
                    />
                  </div>
                </div>

                {/* Exact Birth Time Lagna Note */}
                <div className="pt-1 flex items-start gap-1.5 text-[11px] sm:text-xs text-stone-500 italic">
                  <Info className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{t.exactBirthTimeHint}</span>
                </div>

                {/* Advanced Settings Disclosure */}
                <div className="pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowAdvance((prev) => !prev)}
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 transition-colors cursor-pointer"
                  >
                    <Sliders className="size-3.5" />
                    <span>{t.advancedSettings}</span>
                    {showAdvance ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                  </button>

                  {showAdvance && (
                    <div className="mt-3 p-4 rounded-2xl bg-stone-50 border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4 fade-in">
                      <div>
                        <label htmlFor="kundli-ayanamsa" className="block text-xs font-bold text-stone-700 mb-1">
                          {t.ayanamsaLabel || "Ayanamsa"}
                        </label>
                        <select
                          id="kundli-ayanamsa"
                          value={ayanamsa}
                          onChange={(e) => setAyanamsa(e.target.value as any)}
                          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold cursor-pointer"
                        >
                          <option value="lahiri">Lahiri (Chitra Paksha - Classical Vedic)</option>
                          <option value="krishnamurti">Krishnamurti (KP Astrology)</option>
                          <option value="bv_raman">B.V. Raman</option>
                          <option value="yukteshwar">Yukteshwar</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="kundli-house-system" className="block text-xs font-bold text-stone-700 mb-1">
                          {t.houseSystemLabel || "House System"}
                        </label>
                        <select
                          id="kundli-house-system"
                          value={houseSystem}
                          onChange={(e) => setHouseSystem(e.target.value as any)}
                          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold cursor-pointer"
                        >
                          <option value="placidus">Placidus (Standard KP / Western)</option>
                          <option value="whole_sign">Whole Sign (Equal Rashi)</option>
                          <option value="equal">Equal House (30 deg each)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Feature Disabled Alert if applicable */}
                {kundliFeature && !kundliFeature.enabled && (
                  <div className="pt-2">
                    <FeatureDisabledAlert
                      featureName={kundliFeature?.name || t.calculateBtn}
                      language={language}
                    />
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading || (kundliFeature ? !kundliFeature.enabled : false)}
                    className="w-full min-h-[50px] rounded-2xl bg-[#fcd404] hover:bg-[#ebd500] text-stone-950 font-bold shadow-sm hover:shadow-md text-base transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed press"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="size-4 animate-spin text-stone-900" />
                        <span>{t.calculating}</span>
                      </>
                    ) : (
                      <>
                        <span>{t.generateKundliBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Talk to Kundli & Birth Chart Experts */}
          <div className="lg:col-span-4">
            <AstrologerSidebarCard language={language} t={t} />
          </div>
        </div>

        {/* =========================================================================
            4. SAMPLE REPORT BANNER (NOT SURE YET? See a Sample Report First)
        ========================================================================= */}
        <div className="rounded-2xl border border-amber-200/90 bg-[#fffdf0] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <span className="inline-block text-[11px] font-bold tracking-wider text-amber-800 uppercase">
              {t.notSureYet}
            </span>
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-stone-900">
              {t.sampleReportTitle}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
              {t.sampleReportDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSampleModalOpen(true)}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#fcd404] hover:bg-[#ebd500] px-5 py-2.5 text-xs sm:text-sm font-bold text-stone-950 shadow-xs press transition-colors cursor-pointer"
          >
            <Download className="size-4" />
            <span>{t.downloadSampleReport}</span>
          </button>
        </div>

        {/* =========================================================================
            5. VEDIC EDUCATIONAL DOSSIER SECTION (Astrotalk Reference - Screenshots 2 & 3)
        ========================================================================= */}
        <div className="space-y-10 pt-6 border-t border-stone-200/70 text-stone-800">
          {/* What is Kundli? */}
          <div className="space-y-3">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-stone-900">
              {t.whatIsKundliTitle}
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed max-w-4xl">
              <p>{t.whatIsKundliP1}</p>
              <p>{t.whatIsKundliP2}</p>
              <p>{t.whatIsKundliP3}</p>
            </div>
          </div>

          {/* What does your Kundli include? */}
          <div className="space-y-6">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-stone-900">
              {t.whatIncludesTitle}
            </h3>

            {/* Lagna / Ascendant */}
            <div className="space-y-2">
              <h4 className="font-display text-base sm:text-lg font-bold text-stone-900">
                {t.lagnaSectionTitle}
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-4xl">
                {t.lagnaSectionDesc}
              </p>
            </div>

            {/* Rashi / Moon Sign */}
            <div className="space-y-2">
              <h4 className="font-display text-base sm:text-lg font-bold text-stone-900">
                {t.rashiSectionTitle}
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-4xl">
                {t.rashiSectionDesc}
              </p>
            </div>

            {/* Navgrahas - The 9 Planets and Their Role */}
            <div className="space-y-4">
              <div>
                <h4 className="font-display text-base sm:text-lg font-bold text-stone-900">
                  {t.navgrahasTitle}
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 pt-1">
                  {t.navgrahasSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
                {[
                  { name: "Sun", bn: "সূর্য", hi: "सूर्य", symbol: "☀️", role: "authority, confidence, father figures, leadership", roleBn: "কর্তৃত্ব, আত্মবিশ্বাস, পিতা ও নেতৃত্ব", roleHi: "अधिकार, आत्मविश्वास, पिता और नेतृत्व" },
                  { name: "Moon", bn: "চন্দ্র", hi: "चन्द्र", symbol: "🌙", role: "emotions, mental peace, feminine energy, intuition", roleBn: "আবেগ, মানসিক শান্তি, অন্তর্দৃষ্টি ও মাতৃস্নেহ", roleHi: "भावनाएं, मानसिक शांति, अंतर्ज्ञान और मातृशक्ति" },
                  { name: "Mars", bn: "মঙ্গল", hi: "मंगल", symbol: "♂️", role: "aggression, courage, discipline, action", roleBn: "সাহস, পরাক্রম, নিয়মানুবর্তিতা ও কর্মোদ্যম", roleHi: "साहस, पराक्रम, अनुशासन और क्रियाशीलता" },
                  { name: "Mercury", bn: "বুধ", hi: "बुध", symbol: "☿️", role: "communication, intelligence, logic, business", roleBn: "যোগাযোগ, বুদ্ধিমত্তা, যুক্তি ও ব্যবসা-বাণিজ্য", roleHi: "संचार, बुद्धि, तर्क और व्यापार" },
                  { name: "Jupiter", bn: "বৃহস্পতি", hi: "बृहस्पति", symbol: "♃️", role: "wisdom, spirituality, wealth, teacher, expansion", roleBn: "জ্ঞান, আধ্যাত্মিকতা, ধনসম্পদ ও বিস্তার", roleHi: "ज्ञान, आध्यात्मिकता, धन-समृद्धि और विस्तार" },
                  { name: "Venus", bn: "শুক্র", hi: "शुक्र", symbol: "♀️", role: "luxury, beauty, desires, relationship, romance, creativity", roleBn: "বিলাসিতা, সৌন্দর্য, প্রণয়, দাম্পত্য ও সৃজনশীলতা", roleHi: "सौंदर्य, सुख-सुविधा, प्रेम, वैवाहिक जीवन और कला" },
                  { name: "Saturn", bn: "শনি", hi: "शनि", symbol: "♄️", role: "karma, delays, patience, responsibility", roleBn: "কর্মফল, ধৈর্য, দায়িত্ববোধ ও ন্যায়পরায়ণতা", roleHi: "कर्म, धैर्य, अनुशासन और उत्तरदायित्व" },
                  { name: "Rahu", bn: "রাহু", hi: "राहु", symbol: "☊️", role: "ambition, obsession, foreign influence, unconventional success", roleBn: "উচ্চাকাঙ্ক্ষা, বৈদেশিক প্রভাব ও অপ্রচলিত সাফল্য", roleHi: "महत्वाकांक्षा, विदेशी प्रभाव और अप्रत्याशित सफलता" },
                  { name: "Ketu", bn: "কেতু", hi: "केতু", symbol: "☋️", role: "spirituality, detachment, past-life karmas, intuition", roleBn: "মোক্ষ, বৈরাগ্য, পূর্বজন্মের কর্ম ও আধ্যাত্মিক মুক্তি", roleHi: "मोक्ष, वैराग्य, पूर्वजन्म के कर्म और आत्मज्ञान" },
                ].map((planet, idx) => (
                  <div key={idx} className="rounded-2xl border border-stone-200/80 bg-white p-3.5 flex items-start gap-3 shadow-2xs hover:border-amber-300 transition-colors">
                    <span className="text-xl shrink-0 p-1.5 rounded-xl bg-amber-50 border border-amber-100">{planet.symbol}</span>
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-stone-900">
                        {language === "bn" ? planet.bn : language === "hi" ? planet.hi : planet.name}:
                      </span>
                      <p className="text-[11px] sm:text-xs text-stone-600 leading-snug">
                        {language === "bn" ? planet.roleBn : language === "hi" ? planet.roleHi : planet.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-amber-50/70 border border-amber-200/70 p-3.5 text-xs text-amber-900 font-medium">
                {t.navgrahasNote}
              </div>
            </div>

            {/* Nakshatras */}
            <div className="space-y-2">
              <h4 className="font-display text-base sm:text-lg font-bold text-stone-900">
                {t.nakshatrasTitle}
              </h4>
              <div className="space-y-2.5 text-xs sm:text-sm text-stone-600 leading-relaxed max-w-4xl">
                <p>{t.nakshatrasP1}</p>
                <p>{t.nakshatrasP2}</p>
                <p>{t.nakshatrasP3}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            SECTION 2: Kundli Results Section (Only rendered after calculation)
        ───────────────────────────────────────────────────────────── */}
        {result && (
          <div ref={resultsRef} className="space-y-8 reveal-cascade pt-4">
            {/* Profile Card matching Screenshot 1 */}
            <div className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-soft text-center space-y-4">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                {t.profileTitle}
              </h2>
              <GoldDiamondDivider />

              {/* Rashi Graphic Symbol Box */}
              <div className="mx-auto size-24 rounded-2xl border-2 border-amber-300 bg-amber-50/80 flex items-center justify-center p-2 shadow-xs">
                <span className="text-5xl select-none" role="img" aria-label="Scorpio">
                  {ZODIAC_SYMBOLS_MAP[result.planetary_info.rasi] || "🦂"}
                </span>
              </div>

              <div>
                <span className="inline-block rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs px-4 py-1.5 shadow-2xs">
                  {result.personal_details.name}
                </span>
              </div>

              {/* Profile Action Buttons */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleResetForm();
                    formRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 px-4 py-2 text-xs font-bold text-amber-950 press transition-colors shadow-2xs cursor-pointer"
                >
                  <FilePlus className="size-4 text-amber-600" />
                  <span>{t.createNewKundli}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toast.success(t.toastSaved)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 px-4 py-2 text-xs font-bold text-amber-950 press transition-colors shadow-2xs cursor-pointer"
                >
                  <Lock className="size-4 text-amber-600" />
                  <span>{t.saveKundli}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    formRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 px-4 py-2 text-xs font-bold text-amber-950 press transition-colors shadow-2xs cursor-pointer"
                >
                  <Edit className="size-4 text-amber-600" />
                  <span>{t.editDetails}</span>
                </button>
              </div>
            </div>

            {/* Current Running Dasha Card */}
            {result.current_dasha && (
              <div className="rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-white p-6 shadow-soft relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      🪐
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">
                        {t.currentRunningDasha}
                      </div>
                      <h3 className="font-display text-lg sm:text-xl font-extrabold text-foreground">
                        {language === "bn" && result.current_dasha.verdict_bn
                          ? result.current_dasha.verdict_bn
                          : language === "hi" && result.current_dasha.verdict_hi
                          ? result.current_dasha.verdict_hi
                          : result.current_dasha.verdict}
                      </h3>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-xl bg-amber-100/90 border border-amber-300 px-3.5 py-1.5 text-xs font-bold text-amber-950 self-start sm:self-auto">
                    <Clock className="size-3.5 text-amber-700" />
                    <span>
                      {t.dashaEndsLabel} {toLocalizedDigits(result.current_dasha.end_date, language)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-4 rounded-2xl bg-white/80 border border-amber-200 text-xs sm:text-sm leading-relaxed text-foreground-muted">
                  <p className="font-medium text-foreground">
                    {language === "bn" && result.current_dasha.guidance_bn
                      ? result.current_dasha.guidance_bn
                      : language === "hi" && result.current_dasha.guidance_hi
                      ? result.current_dasha.guidance_hi
                      : result.current_dasha.guidance}
                  </p>
                </div>
              </div>
            )}

            <div className="text-center space-y-1">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {t.kundliDetailsTitle}
              </h2>
              <GoldDiamondDivider />
            </div>

            {/* 4 Side-by-side Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: PERSONAL DETAILS */}
              <div className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-soft space-y-3">
                <div className="rounded-xl bg-amber-100/90 border border-amber-300/70 px-3 py-1.5 text-center font-display text-xs font-bold uppercase tracking-wider text-amber-950">
                  {t.personalDetailsCard}
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.nameLabel}
                    </span>
                    <span className="font-bold text-foreground truncate max-w-[120px]">
                      {result.personal_details.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.genderLabel}
                    </span>
                    <span className="font-bold text-foreground">
                      {KUNDLI_GENDER_NAMES[result.personal_details.gender.toLowerCase()]?.[language] || result.personal_details.gender}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.dobLabel}
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {toLocalizedDigits(result.personal_details.date_of_birth, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.tobLabel}
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {toLocalizedDigits(result.personal_details.time_of_birth, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblDay}
                    </span>
                    <span className="font-bold text-foreground">
                      {translateDayName(result.personal_details.day, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblVedicDay}
                    </span>
                    <span className="font-bold text-foreground">
                      {translateDayName(result.personal_details.vedic_day, language)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: ASTRONOMICAL INFO */}
              <div className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-soft space-y-3">
                <div className="rounded-xl bg-amber-100/90 border border-amber-300/70 px-3 py-1.5 text-center font-display text-xs font-bold uppercase tracking-wider text-amber-950">
                  {t.astronomicalInfoCard}
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblJulianDay}
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {toLocalizedDigits(result.astronomical_info.julian_day, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblAyanType}
                    </span>
                    <span className="font-bold text-foreground">{result.astronomical_info.ayan_type}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblHouseSystem}
                    </span>
                    <span className="font-bold text-foreground">{result.astronomical_info.house_system}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblPlace}
                    </span>
                    <span className="font-bold text-foreground truncate max-w-[120px]" title={result.astronomical_info.place}>
                      {result.astronomical_info.place}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblLongitude}
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {toLocalizedDigits(result.astronomical_info.longitude_formatted, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblLatitude}
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {toLocalizedDigits(result.astronomical_info.latitude_formatted, language)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: ASTRO POSITIONS */}
              <div className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-soft space-y-3">
                <div className="rounded-xl bg-amber-100/90 border border-amber-300/70 px-3 py-1.5 text-center font-display text-xs font-bold uppercase tracking-wider text-amber-950">
                  {t.astroPositionsCard}
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblAscLord}
                    </span>
                    <span className="font-bold text-foreground">
                      {translatePlanetName(result.astro_positions.asc_lord, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblAsc}
                    </span>
                    <span className="font-bold text-foreground">
                      {translateRashiName(result.astro_positions.asc, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblYoga}
                    </span>
                    <span className="font-bold text-foreground">
                      {translateYoga(result.astro_positions.yoga, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblTithi}
                    </span>
                    <span className="font-bold text-foreground">
                      {translateTithi(result.astro_positions.tithi, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblSunset}
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {toLocalizedDigits(result.astro_positions.sunset, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblSunrise}
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {toLocalizedDigits(result.astro_positions.sunrise, language)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 4: PLANETARY INFO */}
              <div className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-soft space-y-3">
                <div className="rounded-xl bg-amber-100/90 border border-amber-300/70 px-3 py-1.5 text-center font-display text-xs font-bold uppercase tracking-wider text-amber-950">
                  {t.planetaryInfoCard}
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblBalDasa}
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {translateBalDasa(result.planetary_info.bal_dasa, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblKaran}
                    </span>
                    <span className="font-bold text-foreground">
                      {translateKaran(result.planetary_info.karan, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.thNakshatraLord}
                    </span>
                    <span className="font-bold text-foreground">
                      {translatePlanetName(result.planetary_info.nakshatra_lord, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.thNakshatra}
                    </span>
                    <span className="font-bold text-foreground">
                      {translateNakshatraName(result.planetary_info.nakshatra, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-100/70 pb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblRasiLord}
                    </span>
                    <span className="font-bold text-foreground">
                      {translatePlanetName(result.planetary_info.rasi_lord, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-foreground-muted font-medium">
                      <span className="text-amber-600 text-[10px]">➔</span> {t.lblRasi}
                    </span>
                    <span className="font-bold text-foreground">
                      {translateRashiName(result.planetary_info.rasi, language)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Style Switcher */}
            <div className="text-center space-y-3 pt-2">
              <h3 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                {t.chartStyleTitle}
              </h3>
              <GoldDiamondDivider />

              <div className="inline-flex rounded-xl bg-amber-50 p-1 border border-amber-300">
                {(
                  [
                    { key: "north", label: t.styleNorth },
                    { key: "east", label: t.styleEast },
                    { key: "south", label: t.styleSouth },
                    { key: "wheel", label: t.styleDiamond },
                  ] as const
                ).map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setChartStyle(s.key)}
                    className={`rounded-lg px-4 py-1.5 text-xs font-bold press transition-all ${
                      chartStyle === s.key
                        ? "bg-amber-500 text-white shadow-2xs"
                        : "text-amber-950 hover:bg-amber-100 cursor-pointer"
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
                    title={t.lagnaChartTitle}
                    planets={result.d1_planets}
                    ascSignNum={result.d1_asc_sign}
                    isNavamsa={false}
                    chartStyle={chartStyle}
                  />
                </div>

                {/* 2. Navamsa Chart (D9) */}
                <div className="w-full flex flex-col items-center">
                  <KundliDiamondChart
                    title={t.navamsaChartTitle}
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
                  {t.planetTableTitle}
                </h3>
                <GoldDiamondDivider />
              </div>

              <div className="overflow-x-auto rounded-2xl border border-amber-200/80">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-amber-100/90 text-amber-950 font-bold border-b border-amber-300">
                      <th className="py-3 px-4 font-bold text-center">{t.thPlanet}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thLongitude}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thNakshatra}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thNakshatraLord}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thPada}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thSubLord}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thFullDegree}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100/80 bg-white">
                    {result.planets_table.map((row, idx) => (
                      <tr
                        key={`planet-row-${idx}`}
                        className="hover:bg-amber-50/60 transition-colors"
                      >
                        <td className="py-3 px-4 text-center font-bold text-foreground">
                          {translatePlanetName(row.name, language)}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-foreground tabular-nums">
                          {translateDmsStyled(row.longitude_formatted, language)}
                        </td>
                        <td className="py-3 px-4 text-center text-foreground-muted">
                          {translateNakshatraName(row.nakshatra, language)}
                        </td>
                        <td className="py-3 px-4 text-center text-foreground-muted">
                          {translatePlanetName(row.nakshatra_lord, language)}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-amber-800 tabular-nums">
                          {toLocalizedDigits(row.pada, language)}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-foreground">
                          {translatePlanetName(row.sub_lord, language)}
                        </td>
                        <td className="py-3 px-4 text-center text-foreground-muted tabular-nums">
                          {toLocalizedDigits(row.full_degree_formatted, language)}
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
                  {t.houseTableTitle}
                </h3>
                <GoldDiamondDivider />
              </div>

              <div className="overflow-x-auto rounded-2xl border border-amber-200/80">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-amber-100/90 text-amber-950 font-bold border-b border-amber-300">
                      <th className="py-3 px-4 font-bold text-center">{t.thHouse}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thLongitude}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thNakshatra}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thNakshatraLord}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thPada}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thSubLord}</th>
                      <th className="py-3 px-4 font-bold text-center">{t.thFullDegree}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100/80 bg-white">
                    {result.houses_table.map((row, idx) => (
                      <tr
                        key={`house-row-${idx}`}
                        className="hover:bg-amber-50/60 transition-colors"
                      >
                        <td className="py-3 px-4 text-center font-bold text-foreground">
                          {translateHouseName(row.name, language)}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-foreground tabular-nums">
                          {translateDmsStyled(row.longitude_formatted, language)}
                        </td>
                        <td className="py-3 px-4 text-center text-foreground-muted">
                          {translateNakshatraName(row.nakshatra, language)}
                        </td>
                        <td className="py-3 px-4 text-center text-foreground-muted">
                          {translatePlanetName(row.nakshatra_lord, language)}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-amber-800 tabular-nums">
                          {toLocalizedDigits(row.pada, language)}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-foreground">
                          {translatePlanetName(row.sub_lord, language)}
                        </td>
                        <td className="py-3 px-4 text-center text-foreground-muted tabular-nums">
                          {toLocalizedDigits(row.full_degree_formatted, language)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table: Planetary Dignities, Combustion & Avasthas */}
            {result.planetary_dignities && result.planetary_dignities.length > 0 && (
              <div className="rounded-3xl border border-amber-200/80 bg-white p-5 sm:p-6 shadow-soft space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                    {t.dignitiesTableTitle}
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    {t.dignitiesTableSub}
                  </p>
                  <GoldDiamondDivider />
                </div>

                <div className="overflow-x-auto rounded-2xl border border-amber-200/80">
                  <table className="w-full border-collapse text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-amber-100/90 text-amber-950 font-bold border-b border-amber-300">
                        <th className="py-3 px-4 font-bold text-center">{t.thPlanet}</th>
                        <th className="py-3 px-4 font-bold text-center">{t.thLongitude}</th>
                        <th className="py-3 px-4 font-bold text-center">{t.thHouse}</th>
                        <th className="py-3 px-4 font-bold text-center">{t.thDignity}</th>
                        <th className="py-3 px-4 font-bold text-center">{t.thAvastha}</th>
                        <th className="py-3 px-4 font-bold text-center">{t.thCombustion}</th>
                        <th className="py-3 px-4 font-bold text-center">{t.thSpecialYoga}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100/80 bg-white">
                      {result.planetary_dignities.map((item, idx) => (
                        <tr key={`dig-${idx}`} className="hover:bg-amber-50/60 transition-colors">
                          <td className="py-3 px-4 text-center font-bold text-foreground">
                            {translatePlanetName(item.planet, language)}
                            {item.is_retrograde && (
                              <span className="ml-1 text-[11px] text-amber-700 font-bold">
                                ({t.retroTag})
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center text-foreground-muted">
                            <span className="font-semibold text-foreground">
                              {translateRashiName(item.sign, language)}
                            </span>
                            <span className="ml-1 text-[11px] tabular-nums text-foreground-muted">
                              ({toLocalizedDigits(item.degree_formatted, language)})
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-amber-900 tabular-nums">
                            {toLocalizedDigits(item.house, language)}
                            <span className="text-[10px] text-foreground-muted ml-0.5">
                              {t.houseSuffix}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                item.dignity === "Exalted"
                                  ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                                  : item.dignity === "Moolatrikona" || item.dignity === "Own Sign"
                                  ? "bg-amber-100 text-amber-900 border-amber-300"
                                  : item.dignity === "Friendly Sign"
                                  ? "bg-blue-100 text-blue-900 border-blue-300"
                                  : item.dignity === "Debilitated"
                                  ? "bg-rose-100 text-rose-900 border-rose-300"
                                  : "bg-stone-100 text-stone-800 border-stone-300"
                              }`}
                            >
                              {language === "bn" ? item.dignity_bn : language === "hi" ? item.dignity_hi : item.dignity}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-medium">
                            <span className="text-foreground">
                              {language === "bn" ? item.avastha_bn : language === "hi" ? item.avastha_hi : item.avastha}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {item.is_combust ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-900 border border-orange-300">
                                <Flame className="size-3 text-orange-600" />
                                {t.combustTag}
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-medium text-xs">
                                {t.normalTag}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center text-xs">
                            {item.neechabhanga ? (
                              <span
                                title={item.neechabhanga_reason || undefined}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-500 text-white shadow-2xs"
                              >
                                <Award className="size-3" />
                                {t.neechabhangaTag}
                              </span>
                            ) : (
                              <span className="text-foreground-muted">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                SECTION: 12 Houses Astrological Synthesis (দ্বাদশ ভাব বিচার)
            ───────────────────────────────────────────────────────────── */}
            {result.house_predictions && result.house_predictions.length > 0 && (
              <div className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-soft space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                    {t.housesSynthesisTitle}
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    {t.housesSynthesisSub}
                  </p>
                  <GoldDiamondDivider />
                </div>

                {/* 12 House Selector Buttons */}
                <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
                  {result.house_predictions.map((h) => {
                    const isSelected = activeHouseTab === h.house_number;
                    const hNameDisplay =
                      language === "bn"
                        ? h.house_name_bn.split(" ")[0]
                        : language === "hi"
                        ? (h.house_name_hi || h.house_name).split(" ")[0]
                        : h.house_name.split(" ")[0];
                    return (
                      <button
                        key={`h-tab-${h.house_number}`}
                        type="button"
                        onClick={() => setActiveHouseTab(h.house_number)}
                        className={`p-2 rounded-xl text-center border press transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                            : "bg-amber-50/60 hover:bg-amber-100 text-amber-950 border-amber-200"
                        }`}
                      >
                        <div className="font-display font-extrabold text-sm tabular-nums">
                          {toLocalizedDigits(h.house_number, language)}
                        </div>
                        <div className="text-[10px] font-bold truncate">
                          {hNameDisplay}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected House Deep Insights Card */}
                {(() => {
                  const sel =
                    result.house_predictions.find((h) => h.house_number === activeHouseTab) ||
                    result.house_predictions[0];
                  if (!sel) return null;

                  const selHouseName =
                    language === "bn"
                      ? sel.house_name_bn
                      : language === "hi"
                      ? (sel.house_name_hi || sel.house_name)
                      : sel.house_name;

                  return (
                    <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 p-5 sm:p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200">
                        <div>
                          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">
                            {t.houseOverviewLabel}
                          </div>
                          <h4 className="font-display text-xl font-extrabold text-foreground flex items-center gap-2">
                            <span>
                              {toLocalizedDigits(sel.house_number, language)}
                              {t.houseTitleSuffix} {selHouseName}
                            </span>
                          </h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="px-3 py-1 rounded-xl bg-amber-100 border border-amber-300 font-bold text-amber-950">
                            {t.signLabel} {translateRashiName(sel.sign, language)}
                          </span>
                          <span className="px-3 py-1 rounded-xl bg-amber-100 border border-amber-300 font-bold text-amber-950">
                            {t.lordLabel} {translatePlanetName(sel.sign_lord, language)} (
                            {toLocalizedDigits(sel.lord_placement_house, language)} {t.placementSuffix})
                          </span>
                        </div>
                      </div>

                      {/* Occupants badge */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-foreground-muted">
                          {t.occupantsLabel}
                        </span>
                        {sel.occupants.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {sel.occupants.map((occ, oIdx) => (
                              <span
                                key={`occ-${oIdx}`}
                                className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-white font-bold text-[11px]"
                              >
                                {translatePlanetName(occ, language)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-foreground-muted italic">
                            {t.emptyHouseNote}
                          </span>
                        )}
                      </div>

                      {/* 3 Column Detailed Effect Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <div className="rounded-xl border border-amber-200 bg-white p-4 space-y-1.5 shadow-2xs">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                            <BookOpen className="size-3.5 text-amber-600" />
                            <span>{t.significanceLabel}</span>
                          </div>
                          <p className="text-xs text-foreground-muted leading-relaxed">
                            {language === "bn"
                              ? sel.overview_bn
                              : language === "hi"
                              ? (sel.overview_hi || sel.overview)
                              : sel.overview}
                          </p>
                        </div>

                        <div className="rounded-xl border border-amber-200 bg-white p-4 space-y-1.5 shadow-2xs">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                            <Award className="size-3.5 text-emerald-600" />
                            <span>{t.careerWealthLabel}</span>
                          </div>
                          <p className="text-xs text-foreground-muted leading-relaxed">
                            {language === "bn"
                              ? sel.career_wealth_effect_bn
                              : language === "hi"
                              ? (sel.career_wealth_effect_hi || sel.career_wealth_effect)
                              : sel.career_wealth_effect}
                          </p>
                        </div>

                        <div className="rounded-xl border border-amber-200 bg-white p-4 space-y-1.5 shadow-2xs">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                            <Heart className="size-3.5 text-purple-600" />
                            <span>{t.familyRelationshipsLabel}</span>
                          </div>
                          <p className="text-xs text-foreground-muted leading-relaxed">
                            {language === "bn"
                              ? sel.relationship_family_effect_bn
                              : language === "hi"
                              ? (sel.relationship_family_effect_hi || sel.relationship_family_effect)
                              : sel.relationship_family_effect}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                SECTION 4: Vimshottari Dasha 3x3 Grid (Screenshot 4)
            ───────────────────────────────────────────────────────────── */}
            <div className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-soft space-y-6">
              <div className="text-center space-y-1">
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                  {t.vimshottariDashaTitle}
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
                        {translateDashaCardTitle(card.title, language)}
                      </h4>

                      <div className="mt-3 overflow-x-auto">
                        <table className="w-full text-[11px] text-left">
                          <thead>
                            <tr className="bg-amber-100/80 text-amber-950 font-bold">
                              <th className="py-1.5 px-2 font-bold">{t.thAntarDasha}</th>
                              <th className="py-1.5 px-2 font-bold text-center">{t.thDuration}</th>
                              <th className="py-1.5 px-2 font-bold text-center">{t.thEndDate}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-amber-100/60 bg-white/70">
                            {card.antardashas.map((ant, aIdx) => (
                              <tr key={`ant-${cIdx}-${aIdx}`} className="hover:bg-amber-50/60">
                                <td className="py-1.5 px-2 font-bold text-foreground flex items-center gap-1">
                                  <span>{translatePlanetName(ant.lord, language)}</span>
                                  {ant.duration !== "-" && (
                                    <span className="text-amber-600 text-[9px]">➔</span>
                                  )}
                                </td>
                                <td className="py-1.5 px-2 text-center text-foreground-muted tabular-nums">
                                  {translateDashaDuration(ant.duration, language)}
                                </td>
                                <td className="py-1.5 px-2 text-center text-foreground-muted tabular-nums">
                                  {ant.end_date === "-" ? "-" : toLocalizedDigits(ant.end_date, language)}
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
                  {t.divisionalChartsTitle}
                </h3>
                <GoldDiamondDivider />

                {/* Divisional Chart Switcher Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  {[
                    { id: "d1", name: t.d1Tab },
                    { id: "d9", name: t.d9Tab },
                    { id: "d10", name: t.d10Tab },
                    { id: "d7", name: t.d7Tab },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveChartTab(tab.id as any)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold press transition-all cursor-pointer border ${
                        activeChartTab === tab.id
                          ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                          : "bg-amber-50/70 text-amber-950 border-amber-300/80 hover:bg-amber-100"
                      }`}
                    >
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </div>

                {/* Regional Chart Style Selector (North, East, South) */}
                <div className="inline-flex rounded-xl bg-amber-50 p-1 border border-amber-300 mt-2">
                  {(
                    [
                      { key: "north", label: t.styleNorth },
                      { key: "east", label: t.styleEast },
                      { key: "south", label: t.styleSouth },
                    ] as const
                  ).map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setChartStyle(s.key as any)}
                      className={`rounded-lg px-4 py-1 text-xs font-bold press transition-all cursor-pointer ${
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

              {/* Dynamic Divisional Chart Rendering */}
              <div className="flex flex-col items-center space-y-3">
                {activeChartTab === "d1" && (
                  <>
                    <p className="text-xs text-foreground-muted text-center max-w-md">
                      {t.d1Desc}
                    </p>
                    <KundliDiamondChart
                      title={t.rasiChartTitle}
                      planets={result.d1_planets}
                      ascSignNum={result.d1_asc_sign}
                      isNavamsa={false}
                      chartStyle={chartStyle}
                      className="max-w-lg w-full"
                    />
                  </>
                )}

                {activeChartTab === "d9" && (
                  <>
                    <p className="text-xs text-foreground-muted text-center max-w-md">
                      {t.d9Desc}
                    </p>
                    <KundliDiamondChart
                      title={t.navamsaChartTitle}
                      planets={result.d9_planets}
                      ascSignNum={result.d9_asc_sign}
                      isNavamsa={true}
                      chartStyle={chartStyle}
                      className="max-w-lg w-full"
                    />
                  </>
                )}

                {activeChartTab === "d10" && (
                  <>
                    <p className="text-xs text-foreground-muted text-center max-w-md">
                      {t.d10Desc}
                    </p>
                    <KundliDiamondChart
                      title={t.d10Title}
                      planets={result.d10_planets || result.d1_planets}
                      ascSignNum={result.d10_asc_sign || result.d1_asc_sign}
                      isNavamsa={false}
                      chartStyle={chartStyle}
                      className="max-w-lg w-full"
                    />
                  </>
                )}

                {activeChartTab === "d7" && (
                  <>
                    <p className="text-xs text-foreground-muted text-center max-w-md">
                      {t.d7Desc}
                    </p>
                    <KundliDiamondChart
                      title={t.d7Title}
                      planets={result.d7_planets || result.d1_planets}
                      ascSignNum={result.d7_asc_sign || result.d1_asc_sign}
                      isNavamsa={false}
                      chartStyle={chartStyle}
                      className="max-w-lg w-full"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Yoga Section matching Screenshot 5 */}
            <div ref={yogaRef} className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-soft space-y-6">
              <div className="text-center space-y-1">
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                  {t.yogaAnalysisTitle}
                </h3>
                <GoldDiamondDivider />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Left Column: Kundli Yoga Status List */}
                <div className="space-y-3">
                  <div className="rounded-xl bg-amber-500 px-4 py-2.5 text-center font-bold text-xs uppercase tracking-wider text-white shadow-2xs">
                    {t.kundliYogaBanner} — {name || result.personal_details.name}
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
                            {translateYogaName(y.name, language)}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-bold rounded-lg px-2.5 py-0.5 border ${
                            y.is_present
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : "bg-rose-50 text-rose-800 border-rose-300"
                          }`}
                        >
                          {y.is_present ? t.presentBadge : t.notPresentBadge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Detailed Active Yogas */}
                <div className="space-y-4">
                  {result.active_yogas_details.map((act, idx) => {
                    const localizedAct = translateYogaDetails(act.name, act.description, act.effects, language);
                    return (
                      <div
                        key={`act-yoga-${idx}`}
                        className="rounded-2xl border border-amber-200/80 bg-amber-50/30 p-4 space-y-1.5 shadow-2xs"
                      >
                        <h4 className="font-display text-base font-bold text-amber-950">
                          {localizedAct.name}
                        </h4>
                        <p className="text-xs text-foreground-muted leading-relaxed">
                          {localizedAct.effects}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Extended Classical Raj Yogas & Dhana Yogas */}
            {result.extended_yogas && result.extended_yogas.length > 0 && (
              <div className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-soft space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                    {t.extendedYogasTitle}
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    {t.extendedYogasSub}
                  </p>
                  <GoldDiamondDivider />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.extended_yogas.map((ey, eIdx) => {
                    const eyName = language === "bn" ? ey.name_bn || ey.name : language === "hi" ? ey.name_hi || ey.name : ey.name;
                    const eyCategory = language === "bn" ? ey.category_bn || ey.category : language === "hi" ? ey.category_hi || ey.category : ey.category;
                    const eyDescription = language === "bn" ? ey.description_bn || ey.description : language === "hi" ? ey.description_hi || ey.description : ey.description;
                    const eyEffects = language === "bn" ? ey.effects_bn || ey.effects : language === "hi" ? ey.effects_hi || ey.effects : ey.effects;

                    return (
                      <div
                        key={`ext-yoga-${eIdx}`}
                        className="rounded-2xl border-2 border-amber-200/90 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 p-5 space-y-2.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded-lg bg-amber-500 text-white">
                              <Star className="size-4" />
                            </span>
                            <h4 className="font-display text-base font-extrabold text-amber-950">
                              {eyName}
                            </h4>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            {eyCategory}
                          </span>
                        </div>

                        <p className="text-xs text-foreground-muted leading-relaxed font-serif italic">
                          {eyDescription}
                        </p>

                        <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-foreground leading-relaxed">
                          <span className="font-bold text-amber-950 mr-1">
                            {t.effectsLabel}:
                          </span>
                          {eyEffects}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                SECTION: Classical Doshas Analysis & Vedic Remedies (দোষ ও প্রতিকার)
            ───────────────────────────────────────────────────────────── */}
            {result.doshas_analysis && result.doshas_analysis.length > 0 && (
              <div className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-soft space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                    {t.doshasAnalysisTitle}
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    {t.doshasAnalysisSub}
                  </p>
                  <GoldDiamondDivider />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {result.doshas_analysis.map((d, dIdx) => {
                    const doshaName = language === "bn" ? d.dosha_name_bn || d.dosha_name : language === "hi" ? d.dosha_name_hi || d.dosha_name : d.dosha_name;
                    const severity = language === "bn" ? d.severity_bn || d.severity : language === "hi" ? d.severity_hi || d.severity : d.severity;
                    const specificType = language === "bn" ? d.specific_type_bn : language === "hi" ? d.specific_type_hi || d.specific_type_bn : d.specific_type;
                    const cancellationReason = language === "bn" ? d.cancellation_reason_bn : language === "hi" ? d.cancellation_reason_hi || d.cancellation_reason_bn : d.cancellation_reason;
                    const remedy = language === "bn" ? d.remedy_bn || d.remedy : language === "hi" ? d.remedy_hi || d.remedy : d.remedy;

                    return (
                      <div
                        key={`dosha-${dIdx}`}
                        className="rounded-2xl border-2 border-amber-200 bg-amber-50/20 p-5 space-y-3 shadow-2xs"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                          <div className="flex items-center gap-2">
                            <span className="size-7 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-sm">
                              {d.is_present ? "⚠️" : "✨"}
                            </span>
                            <h4 className="font-display text-base font-extrabold text-foreground">
                              {doshaName}
                            </h4>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                              d.is_present
                                ? "bg-rose-100 text-rose-900 border-rose-300"
                                : "bg-emerald-100 text-emerald-900 border-emerald-300"
                            }`}
                          >
                            {d.is_present
                              ? `${t.doshaActive} (${severity})`
                              : t.doshaClean}
                          </span>
                        </div>

                        {specificType && (
                          <div className="text-xs font-bold text-amber-900">
                            {t.doshaTypeLabel}: {specificType}
                          </div>
                        )}

                        {cancellationReason && (
                          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                            <span className="font-bold">
                              {t.cancellationLabel}:{" "}
                            </span>
                            {cancellationReason}
                          </div>
                        )}

                        <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                            <ShieldCheck className="size-3.5 text-amber-600" />
                            <span>{t.remedyLabel}:</span>
                          </div>
                          <p className="text-xs text-foreground-muted leading-relaxed">
                            {remedy}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                SECTION: Personalized Gemstones & Vedic Remedies (রত্ন ও রুদ্রাক্ষ)
            ───────────────────────────────────────────────────────────── */}
            {result.remedies && (
              <div className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-soft space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                    {t.remediesTitle}
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    {t.remediesSub}
                  </p>
                  <GoldDiamondDivider />
                </div>

                {/* 3 Gemstone Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    { data: result.remedies.life_stone, title: t.lifeStoneTitle, badge: t.lifeStoneBadge },
                    { data: result.remedies.lucky_stone, title: t.luckyStoneTitle, badge: t.luckyStoneBadge },
                    { data: result.remedies.career_stone, title: t.careerStoneTitle, badge: t.careerStoneBadge },
                  ].map((card, cIdx) => {
                    const stoneName = language === "bn" ? card.data.stone_name_bn || card.data.stone_name : language === "hi" ? card.data.stone_name_hi || card.data.stone_name : card.data.stone_name;
                    const planetName = language === "bn" ? card.data.ruling_planet_bn || card.data.ruling_planet : language === "hi" ? card.data.ruling_planet_hi || card.data.ruling_planet : card.data.ruling_planet;
                    const metal = language === "bn" ? card.data.metal_bn : language === "hi" ? card.data.metal_hi || translateMetal(card.data.metal, language) : card.data.metal;
                    const finger = language === "bn" ? card.data.finger_bn : language === "hi" ? card.data.finger_hi || translateFinger(card.data.finger, language) : card.data.finger;
                    const wearingDay = language === "bn" ? card.data.wearing_day_bn : language === "hi" ? card.data.wearing_day_hi || translateWearingDay(card.data.wearing_day, language) : card.data.wearing_day;
                    const benefit = language === "bn" ? card.data.benefit_bn || card.data.benefit : language === "hi" ? card.data.benefit_hi || card.data.benefit : card.data.benefit;

                    return (
                      <div
                        key={`gem-${cIdx}`}
                        className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50/50 to-white p-5 space-y-3.5 shadow-2xs flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">
                              {card.badge}
                            </span>
                            <span className="p-1 rounded-lg bg-amber-100 text-amber-900">
                              <Gem className="size-4" />
                            </span>
                          </div>

                          <div>
                            <h4 className="font-display text-lg font-extrabold text-foreground">
                              {stoneName}
                            </h4>
                            <div className="text-xs font-semibold text-amber-900">
                              {card.data.sanskrit_name} ({planetName})
                            </div>
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center justify-between border-b border-amber-100 pb-1">
                              <span className="text-foreground-muted">{t.metalLabel}:</span>
                              <span className="font-bold text-foreground">
                                {metal}
                              </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-amber-100 pb-1">
                              <span className="text-foreground-muted">{t.fingerLabel}:</span>
                              <span className="font-bold text-foreground">
                                {finger}
                              </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-amber-100 pb-1">
                              <span className="text-foreground-muted">{t.wearingDayLabel}:</span>
                              <span className="font-bold text-foreground">
                                {wearingDay}
                              </span>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-amber-100/70 border border-amber-200 text-center text-xs font-bold text-amber-950 font-serif">
                            {card.data.beej_mantra}
                          </div>
                        </div>

                        <p className="text-xs text-foreground-muted leading-relaxed pt-2 border-t border-amber-100">
                          {benefit}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Rudraksha, Ishta Devata & Favorable Elements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-5 space-y-2 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📿</span>
                      <h4 className="font-display text-base font-bold text-amber-950">
                        {t.rudrakshaTitle}
                      </h4>
                    </div>
                    <p className="text-xs text-foreground-muted leading-relaxed">
                      {language === "bn"
                        ? result.remedies.rudraksha_recommendation_bn
                        : language === "hi"
                        ? result.remedies.rudraksha_recommendation_hi || result.remedies.rudraksha_recommendation
                        : result.remedies.rudraksha_recommendation}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-5 space-y-2 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🕉️</span>
                      <h4 className="font-display text-base font-bold text-amber-950">
                        {t.ishtaDevataTitle}
                      </h4>
                    </div>
                    <p className="text-xs text-foreground-muted leading-relaxed">
                      {language === "bn"
                        ? result.remedies.ishta_devata_bn
                        : language === "hi"
                        ? result.remedies.ishta_devata_hi || result.remedies.ishta_devata
                        : result.remedies.ishta_devata}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-5 space-y-2.5 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <Compass className="size-4 text-amber-700" />
                      <h4 className="font-display text-base font-bold text-amber-950">
                        {t.favorableElementsTitle}
                      </h4>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between border-b border-amber-100 pb-1">
                        <span className="text-foreground-muted">{t.favorableDirectionLabel}:</span>
                        <span className="font-bold text-foreground">
                          {language === "bn"
                            ? result.remedies.favorable_direction_bn
                            : language === "hi"
                            ? result.remedies.favorable_direction_hi || result.remedies.favorable_direction
                            : result.remedies.favorable_direction}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-amber-100 pb-1">
                        <span className="text-foreground-muted">{t.favorableColorsLabel}:</span>
                        <span className="font-bold text-foreground">
                          {language === "bn"
                            ? result.remedies.lucky_colors_bn.join(", ")
                            : language === "hi"
                            ? (result.remedies.lucky_colors_hi || result.remedies.lucky_colors).join(", ")
                            : result.remedies.lucky_colors.join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-foreground-muted">{t.favorableNumbersLabel}:</span>
                        <span className="font-bold text-foreground tabular-nums">
                          {result.remedies.lucky_numbers.map((n) => toLocalizedDigits(n, language)).join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Action Bar at Bottom matching Screenshot 2 & 5 */}
      {result && (
        <div className="fixed bottom-4 inset-x-0 mx-auto max-w-md px-4 z-40">
          <div className="rounded-2xl bg-white/95 border-2 border-amber-300 shadow-xl p-2 flex items-center justify-between gap-2 backdrop-blur-md">
            <button
              type="button"
              onClick={() => toast.success(t.toastSaved)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 py-2.5 px-3 text-xs font-bold text-amber-950 press transition-colors shadow-2xs cursor-pointer"
            >
              <Lock className="size-3.5 text-amber-600" />
              <span>{t.saveKundli}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintDownload}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 px-3 text-xs font-bold text-white shadow-xs press transition-colors cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>{t.downloadBtn}</span>
            </button>

            <Link
              href="/astrologers"
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-400 hover:bg-brand-500 py-2.5 px-3 text-xs font-bold text-ink-900 shadow-glow press transition-all"
            >
              <MessageCircle className="size-3.5 text-ink-900" />
              <span>{t.consultBtn}</span>
            </Link>
          </div>
        </div>
      )}

      <SampleReportModal
        open={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
        language={language}
        t={t}
      />

      <FeatureCoinModal
        open={coinModalOpen}
        onClose={() => setCoinModalOpen(false)}
        featureName={kundliFeature?.name || t.title}
        requiredCoins={kundliFeature?.coins ?? 20}
        walletBalance={walletBalance}
        reason={coinModalReason}
        language={language}
      />

      <SiteFooter />
    </div>
  );
}
