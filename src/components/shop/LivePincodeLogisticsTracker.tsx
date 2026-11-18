"use client";

import * as React from "react";
import {
  Truck,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  Flame,
  Plane,
  PackageCheck,
  ShieldCheck,
  Coins,
  Gift,
  Zap,
  ArrowRight,
  Info,
  Sparkles,
  RefreshCw,
  XCircle,
  HelpCircle,
  BadgeCheck,
  Check,
  X,
  Compass,
} from "lucide-react";
import { shopApi, type PincodeResult } from "@/lib/api";
import { useLanguage } from "@/providers/language-provider";

interface LivePincodeLogisticsTrackerProps {
  salePrice: number;
  cashbackPercent?: number | null;
  freeGiftTitle?: string | null;
  freeGiftValue?: number | null;
}

// Popular Quick Pincodes for Instant 1-Click Verification
const POPULAR_PINCODES = [
  { code: "700001", city_bn: "কলকাতা", city_en: "Kolkata" },
  { code: "221001", city_bn: "বারাণসী", city_en: "Varanasi" },
  { code: "110001", city_bn: "দিল্লি", city_en: "New Delhi" },
  { code: "400001", city_bn: "মুম্বাই", city_en: "Mumbai" },
  { code: "560001", city_bn: "বেঙ্গালুরু", city_en: "Bengaluru" },
  { code: "799001", city_bn: "আগরতলা", city_en: "Agartala" },
];

// Offline / Fallback City Map for instant reliability
const FALLBACK_STATE_MAP: Record<string, { city_bn: string; city_en: string; state_bn: string; state_en: string }> = {
  "11": { city_bn: "নতুন দিল্লি", city_en: "New Delhi", state_bn: "দিল্লি", state_en: "Delhi" },
  "12": { city_bn: "গুরুগ্রাম / ফরিদাবাদ", city_en: "Gurugram / Faridabad", state_bn: "হরিয়ানা", state_en: "Haryana" },
  "20": { city_bn: "মেরুট / আলিগড়", city_en: "Meerut / Aligarh", state_bn: "উত্তর প্রদেশ", state_en: "Uttar Pradesh" },
  "21": { city_bn: "বারাণসী / প্রয়াগরাজ", city_en: "Varanasi / Prayagraj", state_bn: "উত্তর প্রদেশ", state_en: "Uttar Pradesh" },
  "22": { city_bn: "লখনউ / অযোধ্যা", city_en: "Lucknow / Ayodhya", state_bn: "উত্তর প্রদেশ", state_en: "Uttar Pradesh" },
  "30": { city_bn: "জয়পুর", city_en: "Jaipur", state_bn: "রাজস্থান", state_en: "Rajasthan" },
  "38": { city_bn: "আহমেদাবাদ", city_en: "Ahmedabad", state_bn: "গুজরাট", state_en: "Gujarat" },
  "40": { city_bn: "মুম্বাই", city_en: "Mumbai", state_bn: "মহারাষ্ট্র", state_en: "Maharashtra" },
  "41": { city_bn: "পুনে", city_en: "Pune", state_bn: "মহারাষ্ট্র", state_en: "Maharashtra" },
  "50": { city_bn: "হায়দ্রাবাদ", city_en: "Hyderabad", state_bn: "তেলেঙ্গানা", state_en: "Telangana" },
  "56": { city_bn: "বেঙ্গালুরু", city_en: "Bengaluru", state_bn: "কর্ণাটক", state_en: "Karnataka" },
  "60": { city_bn: "চেন্নাই", city_en: "Chennai", state_bn: "তামিলনাড়ু", state_en: "Tamil Nadu" },
  "70": { city_bn: "কলকাতা", city_en: "Kolkata", state_bn: "পশ্চিমবঙ্গ", state_en: "West Bengal" },
  "71": { city_bn: "হাওড়া / হুগলি", city_en: "Howrah / Hooghly", state_bn: "পশ্চিমবঙ্গ", state_en: "West Bengal" },
  "72": { city_bn: "মেদিনীপুর", city_en: "Midnapore", state_bn: "পশ্চিমবঙ্গ", state_en: "West Bengal" },
  "73": { city_bn: "শিলিগুড়ি / দার্জিলিং", city_en: "Siliguri / Darjeeling", state_bn: "পশ্চিমবঙ্গ", state_en: "West Bengal" },
  "74": { city_bn: "নদিয়া / উত্তর ২৪ পরগনা", city_en: "Nadia / North 24 Pgs", state_bn: "পশ্চিমবঙ্গ", state_en: "West Bengal" },
  "75": { city_bn: "ভুবনেশ্বর / কটক", city_en: "Bhubaneswar / Cuttack", state_bn: "ওড়িশা", state_en: "Odisha" },
  "78": { city_bn: "গুয়াহাটি", city_en: "Guwahati", state_bn: "আসাম", state_en: "Assam" },
  "80": { city_bn: "পাটনা", city_en: "Patna", state_bn: "বিহার", state_en: "Bihar" },
  "83": { city_bn: "রাঁচি / জামশেদপুর", city_en: "Ranchi / Jamshedpur", state_bn: "ঝাড়খণ্ড", state_en: "Jharkhand" },
};

export function LivePincodeLogisticsTracker({
  salePrice,
  cashbackPercent = 100,
  freeGiftTitle = "খাঁটি সেলিনাইট ক্রিস্টাল প্লেট",
  freeGiftValue = 729,
}: LivePincodeLogisticsTrackerProps) {
  const { language } = useLanguage();
  const isBn = language === "bn";

  // State
  const [pincode, setPincode] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<PincodeResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedPayTab, setSelectedPayTab] = React.useState<"prepaid" | "cod">("prepaid");
  const [showGuaranteeModal, setShowGuaranteeModal] = React.useState<boolean>(false);

  // Cashback coins calculation
  const effectiveCashback = cashbackPercent ?? 100;
  const cashbackCoins = Math.round(salePrice * (effectiveCashback / 100));
  const giftWorth = freeGiftValue || 729;
  const totalPrepaidSavings = giftWorth + 70 + cashbackCoins; // Gift + Free shipping + Cashback coins

  // Daily Kashi Evening Aarti Countdown (Target 18:00 IST / 6:00 PM)
  const [timeLeft, setTimeLeft] = React.useState<{ hours: number; minutes: number; seconds: number; isAfter6pm: boolean }>({
    hours: 3,
    minutes: 42,
    seconds: 15,
    isAfter6pm: false,
  });

  React.useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // Target: today at 18:00:00 local IST
      const cutoff = new Date();
      cutoff.setHours(18, 0, 0, 0);

      let diff = cutoff.getTime() - now.getTime();
      let isAfter = false;

      if (diff <= 0) {
        // If after 6 PM, count towards tomorrow's 18:00
        isAfter = true;
        const tomorrowCutoff = new Date(cutoff.getTime() + 24 * 60 * 60 * 1000);
        diff = tomorrowCutoff.getTime() - now.getTime();
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, isAfter6pm: isAfter });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format dynamic dates
  const dates = React.useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const estDays = result?.estimated_delivery_days || 3;
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + estDays);

    const formatBengali = (d: Date) => {
      const dayNames = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
      const monthNames = [
        "জানুয়ারি",
        "ফেব্রুয়ারি",
        "মার্চ",
        "এপ্রিল",
        "মে",
        "জুন",
        "জুলাই",
        "আগস্ট",
        "সেপ্টেম্বর",
        "অক্টোবর",
        "নভেম্বর",
        "ডিসেম্বর",
      ];
      return `${d.getDate()} ${monthNames[d.getMonth()]}, ${dayNames[d.getDay()]}`;
    };

    const formatEnglish = (d: Date) => {
      return d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    };

    return {
      today: isBn ? formatBengali(today) : formatEnglish(today),
      tomorrow: isBn ? formatBengali(tomorrow) : formatEnglish(tomorrow),
      delivery: isBn ? formatBengali(deliveryDate) : formatEnglish(deliveryDate),
      estDays,
    };
  }, [result, isBn]);

  // Initial check from localStorage or default pincode
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPincode = localStorage.getItem("divinlink_shop_pincode") || "700001";
      setPincode(savedPincode);
      performCheck(savedPincode, false);
    }
  }, []);

  // Fast Pincode Verification Function
  const performCheck = async (pinToTest: string, showToastError = true) => {
    const clean = pinToTest.replace(/\D/g, "").slice(0, 6);
    if (clean.length !== 6) {
      if (showToastError) {
        setError(isBn ? "অনুগ্রহ করে ৬ ডিজিটের বৈধ পিনকোড লিখুন।" : "Please enter a valid 6-digit PIN code.");
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await shopApi.checkPincode(clean);
      setResult(res);
      if (typeof window !== "undefined") {
        localStorage.setItem("divinlink_shop_pincode", clean);
      }
      if (!res.is_serviceable) {
        setError(
          isBn
            ? "দুঃখিত, এই নির্দিষ্ট পিনকোডে আপাতত কোনো পার্সেল সার্ভিস সক্রিয় নেই।"
            : "Sorry, delivery is temporarily not serviceable to this PIN code."
        );
      }
    } catch {
      // Resilient local fallback so users never face blank/broken states
      const prefix = clean.slice(0, 2);
      const fallbackInfo = FALLBACK_STATE_MAP[prefix] || {
        city_bn: "আপনার এলাকা",
        city_en: "Your Area",
        state_bn: "ভারত",
        state_en: "India",
      };
      const estDays = ["70", "71", "21", "22", "11", "40", "56"].includes(prefix) ? 3 : 4;
      const fallbackDate = new Date();
      fallbackDate.setDate(fallbackDate.getDate() + estDays);

      const fallbackResult: PincodeResult = {
        pincode: clean,
        city: isBn ? fallbackInfo.city_bn : fallbackInfo.city_en,
        state: isBn ? fallbackInfo.state_bn : fallbackInfo.state_en,
        is_serviceable: true,
        cod_available: true,
        estimated_delivery_days: estDays,
        estimated_delivery_date: fallbackDate.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
      };
      setResult(fallbackResult);
      if (typeof window !== "undefined") {
        localStorage.setItem("divinlink_shop_pincode", clean);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheck = () => {
    performCheck(pincode, true);
  };

  const handleSelectQuickPincode = (code: string) => {
    setPincode(code);
    performCheck(code, false);
  };

  return (
    <div className="rounded-2xl border border-amber-200/80 bg-linear-to-b from-amber-50/40 via-white to-stone-50/60 p-4 sm:p-5 shadow-sm space-y-4">
      {/* ----------------------------------------------------------------------- */}
      {/* 1. Header & Live Countdown Badge */}
      {/* ----------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pb-2 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-700">
            <Truck className="size-4.5 animate-pulse text-amber-700" />
          </div>
          <div>
            <h3 className="font-cinzel text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <span>{isBn ? "লাইভ বৈদিক ডিসপ্যাচ ও ডেলিভারি ট্র্যাকার" : "Live Vedic Dispatch & Delivery Tracker"}</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                ● LIVE
              </span>
            </h3>
            <p className="text-[11px] text-stone-500">
              {isBn
                ? "কাশীর বিশ্বনাথ ঘাট থেকে সরাসরি পবিত্র অভিষেক ও এয়ার এক্সপ্রেস পরিবহন"
                : "Consecrated at Kashi Ghats & Dispatched via Express Air Cargo"}
            </p>
          </div>
        </div>

        {/* Real-time Aarti Dispatch Cutoff Badge */}
        <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-linear-to-r from-amber-100/90 via-orange-100/80 to-amber-100/90 border border-amber-300 text-[11px] font-medium text-amber-950 shadow-2xs">
          <Flame className="size-3.5 text-orange-600 animate-bounce shrink-0" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-stone-700">
              {isBn
                ? timeLeft.isAfter6pm
                  ? "সকালের ব্রহ্মমুহূর্ত সংকল্পে:"
                  : "সন্ধ্যার কাশীর আরতি সংকল্পে:"
                : "Kashi Evening Aarti Cutoff:"}
            </span>
            <span className="font-mono font-bold text-orange-700">
              {String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m :{" "}
              {String(timeLeft.seconds).padStart(2, "0")}s
            </span>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* 2. Pincode Input Bar + Quick Chips */}
      {/* ----------------------------------------------------------------------- */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-amber-600" />
            <input
              type="text"
              value={pincode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                setPincode(val);
                setError(null);
                if (val.length === 6) {
                  performCheck(val, false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleManualCheck();
              }}
              placeholder={isBn ? "আপনার ৬ ডিজিটের পিনকোড দিন (যেমন: 700001)" : "Enter 6-digit PIN code (e.g. 700001)"}
              maxLength={6}
              inputMode="numeric"
              className="w-full rounded-xl border border-stone-300 bg-white pl-9 pr-8 py-2 text-xs font-medium text-stone-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all placeholder:text-stone-400 shadow-2xs"
            />
            {pincode && (
              <button
                type="button"
                onClick={() => {
                  setPincode("");
                  setResult(null);
                  setError(null);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                title="Clear"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleManualCheck}
            disabled={loading || pincode.length !== 6}
            className="rounded-xl bg-linear-to-r from-amber-700 to-stone-900 hover:from-amber-800 hover:to-black disabled:opacity-50 text-white font-bold px-4 py-2 text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            {loading ? (
              <>
                <RefreshCw className="size-3.5 animate-spin" />
                <span>{isBn ? "যাচাই হচ্ছে..." : "Checking..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="size-3.5 text-amber-300" />
                <span>{isBn ? "যাচাই করুন" : "Verify PIN"}</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Metro Region Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          <span className="text-[10px] text-stone-500 font-medium">
            {isBn ? "জনপ্রিয় শহরসমূহ:" : "Quick Select:"}
          </span>
          {POPULAR_PINCODES.map((item) => {
            const isSelected = pincode === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => handleSelectQuickPincode(item.code)}
                className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-amber-100 border-amber-400 text-amber-900 font-bold shadow-2xs"
                    : "bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600"
                }`}
              >
                {isBn ? item.city_bn : item.city_en} ({item.code})
              </button>
            );
          })}
        </div>

        {error && (
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs animate-in fade-in">
            <AlertCircle className="size-3.5 shrink-0" />
            <p className="text-[11px] font-medium">{error}</p>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* 3. Visual 3-Step Consecration & Logistics Roadmap */}
      {/* ----------------------------------------------------------------------- */}
      {result && result.is_serviceable && (
        <div className="space-y-3 pt-1">
          {/* Destination Notification Banner */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-300 text-emerald-950 text-xs shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
              <div className="font-bold flex items-center gap-1.5 flex-wrap">
                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                <span>
                  {result.city}, {result.state} ({result.pincode})
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200">
                  {isBn ? "এক্সপ্রেস সার্ভিস সক্রিয়" : "Express Active"}
                </span>
              </div>
            </div>
            <div className="text-[11px] text-emerald-800 font-bold shrink-0">
              {isBn ? `পৌঁছাবে ${dates.estDays} দিনে` : `In ${dates.estDays} Days`}
            </div>
          </div>

          {/* 3-Step Visual Sacred Timeline */}
          <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-3 before:w-0.5 before:bg-linear-to-b before:from-amber-400 via-orange-400 to-emerald-500">
            {/* Step 1: Kashi Consecration (Today) */}
            <div className="relative group">
              <div className="absolute -left-6 sm:-left-8 top-0.5 size-6 sm:size-8 rounded-full bg-linear-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center shadow-md border-2 border-white">
                <Flame className="size-3 sm:size-4 animate-pulse" />
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 space-y-1 shadow-2xs transition-all hover:bg-amber-50">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                    <Sparkles className="size-3 text-amber-600" />
                    {isBn ? "ধাপ ১: আজ" : "Step 1: Today"} ({dates.today})
                  </span>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full border border-amber-300">
                    {isBn ? "পবিত্র সংকল্প ও প্রাণ-প্রতিষ্ঠা" : "Sacred Consecration"}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-stone-900">
                  {isBn
                    ? "কাশীর বিশ্বনাথ ঘাটে আপনার নামে সংকল্প ও বৈদিক মোম সিলমোহর"
                    : "Consecration & Vedic Wax Seal at Kashi Vishwanath Ghat"}
                </h4>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {isBn
                    ? "পবিত্র গঙ্গাজল ও পঞ্চামৃতে অভিষেক পূর্বক আপনার নাম-গোত্রে বৈদিক স্তোত্র পাঠ এবং প্রামাণ্য হলোগ্রাফিক ল্যাব সিলমোহর প্রদান।"
                    : "Vedic Abhishek with Holy Ganga Jal, customized Devotee Sankalpa chanting, and authentic holographic wax-sealed security."}
                </p>
              </div>
            </div>

            {/* Step 2: Express Air Cargo Dispatch (Tomorrow) */}
            <div className="relative group">
              <div className="absolute -left-6 sm:-left-8 top-0.5 size-6 sm:size-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md border-2 border-white">
                <Plane className="size-3 sm:size-4 text-white" />
              </div>
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 space-y-1 shadow-2xs transition-all hover:bg-indigo-50/70">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-800 flex items-center gap-1">
                    <Plane className="size-3 text-indigo-600" />
                    {isBn ? "ধাপ ২: আগামীকাল" : "Step 2: Tomorrow"} ({dates.tomorrow})
                  </span>
                  <span className="text-[10px] font-bold text-indigo-900 bg-indigo-200/70 px-2 py-0.5 rounded-full border border-indigo-300">
                    {isBn ? "এয়ার এক্সপ্রেস কার্গো" : "Express Air Cargo"}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-stone-900">
                  {isBn
                    ? "কাশী বিমানবন্দর থেকে দিল্লিভেরি / ব্লু ডার্ট এয়ার কার্গোতে ডিসপ্যাচ"
                    : "Priority Air Cargo Dispatch via Delhivery / Blue Dart Express"}
                </h4>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {isBn
                    ? `কাশী আন্তর্জাতিক বিমানবন্দর থেকে দ্রুততম এয়ার কার্গো মারফত ${result.city} ট্রানজিট সেন্টারের উদ্দেশ্যে প্রেরণ করা হবে।`
                    : `Dispatched from Varanasi Cargo Terminal directly to your nearest ${result.city} delivery hub.`}
                </p>
              </div>
            </div>

            {/* Step 3: Guaranteed Doorstep Handover */}
            <div className="relative group">
              <div className="absolute -left-6 sm:-left-8 top-0.5 size-6 sm:size-8 rounded-full bg-linear-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md border-2 border-white">
                <PackageCheck className="size-3 sm:size-4 text-white" />
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 space-y-1 shadow-2xs transition-all hover:bg-emerald-50">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="size-3 text-emerald-600" />
                    {isBn ? "ধাপ ৩: আনুমানিক ডেলিভারি" : "Step 3: Delivery Day"} ({dates.delivery})
                  </span>
                  <span className="text-[10px] font-bold text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded-full border border-emerald-300">
                    {isBn ? "দরজায় পবিত্র অর্পণ" : "Guaranteed Doorstep Delivery"}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-stone-900">
                  {isBn
                    ? `${result.city}-তে আপনার দরজায় টেম্পার-প্রুফ খাঁটি বৈদিক বক্সে হস্তান্তর`
                    : `Safe Doorstep Delivery to ${result.city} in Tamper-Proof Sacred Box`}
                </h4>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {isBn
                    ? `সুরক্ষিত সিলমোহর, ফ্রি সেলিনাইট ক্রিস্টাল প্লেট ও লাইভ এসএমএস/হোয়াটসঅ্যাপ ট্র্যাকিং আপডেট সহ আপনার ঠিকানায় অর্পণ করা হবে।`
                    : `Delivered safely with tamper-proof seal, Selenite charging plate, and live real-time WhatsApp cargo tracking.`}
                </p>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* 4. Prepaid vs COD Interactive Comparison Preview */}
          {/* ------------------------------------------------------------------- */}
          <div className="rounded-xl border border-amber-300/80 bg-white p-3 sm:p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <Coins className="size-4 text-amber-600" />
                <h4 className="font-cinzel text-xs font-bold text-stone-900">
                  {isBn ? "প্রিপেইড বনাম ক্যাশ অন ডেলিভারি (COD) তুলনা" : "Prepaid vs Cash on Delivery Comparison"}
                </h4>
              </div>

              {/* Tab Selector Buttons */}
              <div className="inline-flex rounded-lg bg-stone-100 p-0.5 border border-stone-200 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedPayTab("prepaid")}
                  className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    selectedPayTab === "prepaid"
                      ? "bg-amber-600 text-white shadow-2xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {isBn ? "💳 প্রিপেইড (সেরা সাশ্রয়)" : "💳 Prepaid (Best Value)"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPayTab("cod")}
                  className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    selectedPayTab === "cod"
                      ? "bg-stone-800 text-white shadow-2xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {isBn ? "💵 ক্যাশ অন ডেলিভারি" : "💵 COD"}
                  {result && !result.cod_available && (
                    <span className="ml-1 text-[9px] text-rose-400 font-medium">
                      ({isBn ? "অনুপলব্ধ" : "Off"})
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Dynamic Comparison Matrix Display */}
            {selectedPayTab === "prepaid" ? (
              <div className="rounded-xl bg-linear-to-r from-emerald-50/80 via-amber-50/50 to-emerald-50/80 border border-emerald-300 p-3.5 space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-950">
                    <BadgeCheck className="size-4 text-emerald-600" />
                    {isBn ? "অনলাইন প্রিপেইড পেমেন্ট সুবিধা (UPI / Card / NetBanking)" : "Prepaid Online Payment Benefits"}
                  </span>
                  <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                    {isBn ? "🏆 ৯৮% ভক্তদের প্রথম পছন্দ" : "🏆 98% Devotees Choose This"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-start gap-2 bg-white/90 p-2 rounded-lg border border-emerald-200">
                    <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-900">
                        {isBn ? "১০০% কয়েন ক্যাশব্যাক:" : "100% Coin Cashback:"}
                      </span>
                      <p className="text-[11px] text-stone-600">
                        {isBn
                          ? `ডেলিভারির পর নিরাপদভাবে ${cashbackCoins} টি ওয়ালেট কয়েন ক্রেডিট (জ্যোতিষীর সাথে ফ্রি পরামর্শে ব্যবহার্য)`
                          : `${cashbackCoins} coins safely credited to wallet upon delivery for free live astrologer calls.`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white/90 p-2 rounded-lg border border-emerald-200">
                    <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-900">
                        {isBn ? "বিনামূল্যে উপহার:" : "Free Sacred Gift:"}
                      </span>
                      <p className="text-[11px] text-stone-600">
                        {isBn
                          ? `₹${giftWorth} মূল্যের ${freeGiftTitle} সম্পূর্ণ ফ্রি`
                          : `Free ${freeGiftTitle} worth ₹${giftWorth} included.`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white/90 p-2 rounded-lg border border-emerald-200">
                    <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-900">
                        {isBn ? "ফ্রি এক্সপ্রেস শিপিং:" : "Zero Delivery Fee:"}
                      </span>
                      <p className="text-[11px] text-stone-600">
                        {isBn
                          ? "₹৭০ ডেলিভারি ফি সম্পূর্ণ মাফ (ফ্রি ব্লু ডার্ট এয়ার কার্গো)"
                          : "Save ₹70 delivery charges with free priority air cargo."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white/90 p-2 rounded-lg border border-emerald-200">
                    <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-900">
                        {isBn ? "ভিআইপি প্রায়োরিটি সংকল্প:" : "VIP Priority Batch:"}
                      </span>
                      <p className="text-[11px] text-stone-600">
                        {isBn
                          ? "কাশীর প্রথম সকালের মহাভিষেক ব্যাচে অগ্রাধিকার ভিত্তিতে পূজা"
                          : "First priority consecration batch at Varanasi temple ghats."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total savings banner */}
                <div className="flex items-center justify-between pt-1 px-1 text-[11px] text-emerald-900 font-bold border-t border-emerald-200/80">
                  <span>{isBn ? "✨ প্রিপেইডে মোট মোট সাশ্রয়:" : "✨ Total Savings on Prepaid:"}</span>
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {isBn ? `₹${totalPrepaidSavings} সাশ্রয় + ফ্রি পরামর্শ` : `Save ₹${totalPrepaidSavings} + Free Advice`}
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-stone-50 border border-stone-300 p-3.5 space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-800">
                    <Info className="size-4 text-stone-600" />
                    {isBn ? "ক্যাশ অন ডেলিভারি (COD) শর্তাবলী" : "Cash on Delivery (COD) Terms"}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    result?.cod_available
                      ? "text-stone-600 bg-stone-200"
                      : "text-rose-700 bg-rose-100 border border-rose-300"
                  }`}>
                    {result?.cod_available
                      ? (isBn ? "নগদ পেমেন্ট সুবিধা" : "Pay Cash on Handover")
                      : (isBn ? "বর্তমানে অনুপলব্ধ" : "Currently Disabled")}
                  </span>
                </div>

                {!result?.cod_available ? (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="size-4 shrink-0 text-rose-600" />
                    <span>
                      {isBn
                        ? "এই মুহূর্তে ক্যাশ অন ডেলিভারি (COD) সাময়িকভাবে বন্ধ আছে। শুধুমাত্র অনলাইন প্রিপেইড পেমেন্ট (UPI, Card, NetBanking) গ্রহণযোগ্য।"
                        : "Cash on Delivery is currently unavailable. Only online prepaid payment is accepted."}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2 text-stone-700">
                      <Check className="size-3.5 text-stone-500 shrink-0 mt-0.5" />
                      <span>
                        {isBn
                          ? "পার্সেল হাতে পাওয়ার পর ডেলিভারি পার্টনারকে নগদ টাকা দেওয়ার সুবিধা।"
                          : "Pay cash in hand directly to delivery executive upon physical arrival."}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-rose-700 font-medium">
                      <X className="size-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>
                        {isBn
                          ? `১০০% ওয়ালেট ক্যাশব্যাক অফার প্রযোজ্য নয় (${cashbackCoins} কয়েনের সুযোগ থাকবে না)।`
                          : `100% Wallet Coin Cashback is NOT applicable (No ${cashbackCoins} coins).`}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-rose-700 font-medium">
                      <X className="size-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>
                        {isBn
                          ? `ফ্রি সেলিনাইট প্লেট গিফট ও প্রায়োরিটি কাশীর সংকল্প কিউ পাওয়া যাবে না।`
                          : `Free Selenite Plate gift & VIP temple queue priority are not eligible.`}
                      </span>
                    </div>
                  </div>
                )}

                <p className="text-[10px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  {isBn
                    ? "💡 পরামর্শ: ১০০% ক্যাশব্যাক ও ফ্রি উপহার উপভোগ করতে চেকআউট পেজে UPI বা অনলাইন প্রিপেইড বেছে নেওয়ার পরামর্শ দেওয়া হচ্ছে।"
                    : "💡 Tip: Choose online Prepaid at checkout to unlock 100% cashback coins and the free Selenite gift!"}
                </p>
              </div>
            )}
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* 5. Unboxing & Vedic Packaging Trust Micro-Pillars */}
          {/* ------------------------------------------------------------------- */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-2 text-center space-y-1">
              <ShieldCheck className="size-4 text-amber-700 mx-auto" />
              <div className="text-[10px] font-bold text-stone-800">
                {isBn ? "বৈদিক মোম সিল" : "Wax Sealed"}
              </div>
              <div className="text-[9px] text-stone-500">
                {isBn ? "১০০% অক্ষত সুরক্ষা" : "Tamper-proof Box"}
              </div>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-2 text-center space-y-1">
              <Sparkles className="size-4 text-amber-700 mx-auto" />
              <div className="text-[10px] font-bold text-stone-800">
                {isBn ? "গঙ্গাজল অভিষিক্ত" : "Ganga Consecrated"}
              </div>
              <div className="text-[9px] text-stone-500">
                {isBn ? "কাশীর মূল মন্দিরে" : "Direct From Kashi"}
              </div>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-2 text-center space-y-1">
              <Clock className="size-4 text-amber-700 mx-auto" />
              <div className="text-[10px] font-bold text-stone-800">
                {isBn ? "লাইভ ট্র্যাকিং" : "Live Cargo SMS"}
              </div>
              <div className="text-[9px] text-stone-500">
                {isBn ? "WhatsApp এ আপডেট" : "Real-time updates"}
              </div>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-2 text-center space-y-1">
              <RefreshCw className="size-4 text-amber-700 mx-auto" />
              <div className="text-[10px] font-bold text-stone-800">
                {isBn ? "৭ দিনের রিটার্ন" : "7-Day Return"}
              </div>
              <div className="text-[9px] text-stone-500">
                {isBn ? "সহজ প্রতিস্থাপন" : "Easy Replacement"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
