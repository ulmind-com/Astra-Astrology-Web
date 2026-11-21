"use client";

import * as React from "react";
import {
  Truck,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  X,
  Flame,
  Plane,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Coins,
  Gift,
  Check,
  Ban,
} from "lucide-react";
import { shopApi, type PincodeResult } from "@/lib/api";
import { useLanguage } from "@/providers/language-provider";

interface ProductPincodeEstimatorProps {
  salePrice: number;
  cashbackPercent?: number | null;
  freeGiftTitle?: string | null;
  freeGiftValue?: number | null;
}

const POPULAR_PINCODES = [
  { code: "700001", city_bn: "কলকাতা", city_en: "Kolkata" },
  { code: "221001", city_bn: "বারাণসী", city_en: "Varanasi" },
  { code: "110001", city_bn: "দিল্লি", city_en: "Delhi" },
  { code: "400001", city_bn: "মুম্বাই", city_en: "Mumbai" },
  { code: "560001", city_bn: "বেঙ্গালুরু", city_en: "Bengaluru" },
];

const FALLBACK_STATE_MAP: Record<string, { city_bn: string; city_en: string; state_bn: string; state_en: string }> = {
  "11": { city_bn: "নতুন দিল্লি", city_en: "New Delhi", state_bn: "দিল্লি", state_en: "Delhi" },
  "12": { city_bn: "গুরুগ্রাম", city_en: "Gurugram", state_bn: "হরিয়ানা", state_en: "Haryana" },
  "20": { city_bn: "আলিগড়", city_en: "Aligarh", state_bn: "উত্তর প্রদেশ", state_en: "Uttar Pradesh" },
  "21": { city_bn: "বারাণসী", city_en: "Varanasi", state_bn: "উত্তর প্রদেশ", state_en: "Uttar Pradesh" },
  "22": { city_bn: "লখনউ", city_en: "Lucknow", state_bn: "উত্তর প্রদেশ", state_en: "Uttar Pradesh" },
  "30": { city_bn: "জয়পুর", city_en: "Jaipur", state_bn: "রাজস্থান", state_en: "Rajasthan" },
  "38": { city_bn: "আহমেদাবাদ", city_en: "Ahmedabad", state_bn: "গুজরাট", state_en: "Gujarat" },
  "40": { city_bn: "মুম্বাই", city_en: "Mumbai", state_bn: "মহারাষ্ট্র", state_en: "Maharashtra" },
  "56": { city_bn: "বেঙ্গালুরু", city_en: "Bengaluru", state_bn: "কর্ণাটক", state_en: "Karnataka" },
  "60": { city_bn: "চেন্নাই", city_en: "Chennai", state_bn: "তামিলনাড়ু", state_en: "Tamil Nadu" },
  "70": { city_bn: "কলকাতা", city_en: "Kolkata", state_bn: "পশ্চিমবঙ্গ", state_en: "West Bengal" },
  "71": { city_bn: "হাওড়া", city_en: "Howrah", state_bn: "পশ্চিমবঙ্গ", state_en: "West Bengal" },
  "72": { city_bn: "মেদিনীপুর", city_en: "Midnapore", state_bn: "পশ্চিমবঙ্গ", state_en: "West Bengal" },
  "73": { city_bn: "শিলিগুড়ি", city_en: "Siliguri", state_bn: "পশ্চিমবঙ্গ", state_en: "West Bengal" },
  "74": { city_bn: "নদিয়া", city_en: "Nadia", state_bn: "পশ্চিমবঙ্গ", state_en: "West Bengal" },
  "75": { city_bn: "ভুবনেশ্বর", city_en: "Bhubaneswar", state_bn: "ওড়িশা", state_en: "Odisha" },
  "78": { city_bn: "গুয়াহাটি", city_en: "Guwahati", state_bn: "আসাম", state_en: "Assam" },
  "80": { city_bn: "পাটনা", city_en: "Patna", state_bn: "বিহার", state_en: "Bihar" },
  "83": { city_bn: "রাঁচি", city_en: "Ranchi", state_bn: "ঝাড়খণ্ড", state_en: "Jharkhand" },
};

export function ProductPincodeEstimator({
  salePrice,
  cashbackPercent = 100,
  freeGiftTitle = "খাঁটি সেলিনাইট ক্রিস্টাল প্লেট",
  freeGiftValue = 729,
}: ProductPincodeEstimatorProps) {
  const { language } = useLanguage();
  const isBn = language === "bn";

  const [pincode, setPincode] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<PincodeResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [showDetails, setShowDetails] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  // Load saved pincode from localStorage on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPin = localStorage.getItem("divinlink_shop_pincode") || "700001";
      setPincode(savedPin);
      performCheck(savedPin, false);
    }
  }, []);

  const performCheck = async (pin: string, notifyError = true) => {
    const clean = pin.replace(/\D/g, "").slice(0, 6);
    if (clean.length !== 6) {
      if (notifyError) {
        setError(isBn ? "অনুগ্রহ করে ৬ ডিজিটের সঠিক পিনকোড দিন।" : "Please enter a valid 6-digit PIN code.");
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await shopApi.checkPincode(clean);
      setResult(res);
      setIsEditing(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("divinlink_shop_pincode", clean);
      }
      if (!res.is_serviceable) {
        setError(
          isBn
            ? "দুঃখিত, এই পিনকোডে আপাতত ডেলিভারি সক্রিয় নেই।"
            : "Sorry, delivery is currently not serviceable to this PIN code."
        );
      }
    } catch {
      // Graceful offline fallback
      const prefix = clean.slice(0, 2);
      const fallback = FALLBACK_STATE_MAP[prefix] || {
        city_bn: "আপনার এলাকা",
        city_en: "Your City",
        state_bn: "ভারত",
        state_en: "India",
      };
      const estDays = ["70", "71", "21", "22", "11", "40", "56"].includes(prefix) ? 3 : 4;
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + estDays);

      const fallbackResult: PincodeResult = {
        pincode: clean,
        city: isBn ? fallback.city_bn : fallback.city_en,
        state: isBn ? fallback.state_bn : fallback.state_en,
        is_serviceable: true,
        cod_available: true,
        estimated_delivery_days: estDays,
        estimated_delivery_date: targetDate.toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "short",
        }),
      };
      setResult(fallbackResult);
      setIsEditing(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("divinlink_shop_pincode", clean);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (code: string) => {
    setPincode(code);
    performCheck(code, false);
  };

  const deliveryDayString = React.useMemo(() => {
    if (!result?.estimated_delivery_date) {
      const d = new Date();
      d.setDate(d.getDate() + 3);
      return d.toLocaleDateString(isBn ? "bn-BD" : "en-IN", { weekday: "long", day: "numeric", month: "short" });
    }
    return result.estimated_delivery_date;
  }, [result, isBn]);

  const cashbackCoins = Math.round(salePrice * ((cashbackPercent ?? 100) / 100));

  return (
    <div className="rounded-2xl border border-amber-200/90 bg-gradient-to-b from-amber-50/50 via-white to-stone-50/80 p-4 sm:p-5 shadow-sm space-y-3.5 transition-all">
      {/* Label / Prompt Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-700 shrink-0">
            <Truck className="size-4 text-amber-700" />
          </div>
          <div>
            <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <span>
                {isBn
                  ? "ডেলিভারি তারিখ ও COD যাচাই করতে পিনকোড দিন"
                  : "Enter Pincode to check delivery date & COD availability"}
              </span>
            </span>
          </div>
        </div>

        {result && !isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline cursor-pointer shrink-0"
          >
            {isBn ? "পরিবর্তন করুন" : "Change"}
          </button>
        )}
      </div>

      {/* Input Form & Buttons */}
      {(!result || isEditing) ? (
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
                  if (e.key === "Enter") performCheck(pincode, true);
                }}
                placeholder={isBn ? "৬ ডিজিটের পিনকোড (যেমন: 700001)" : "Enter 6-digit Pincode (e.g. 700001)"}
                maxLength={6}
                inputMode="numeric"
                className="w-full rounded-xl border border-stone-300 bg-white pl-9 pr-8 py-2 text-xs font-medium text-stone-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all placeholder:text-stone-400 shadow-xs"
              />
              {pincode && (
                <button
                  type="button"
                  onClick={() => {
                    setPincode("");
                    setError(null);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => performCheck(pincode, true)}
              disabled={loading || pincode.length !== 6}
              className="rounded-xl bg-gradient-to-r from-amber-700 to-stone-900 hover:from-amber-800 hover:to-black disabled:opacity-50 text-white font-bold px-4 py-2 text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed shrink-0"
            >
              {loading ? (
                <>
                  <RefreshCw className="size-3.5 animate-spin" />
                  <span>{isBn ? "যাচাই..." : "Checking..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5 text-amber-300" />
                  <span>{isBn ? "চেক করুন" : "Check"}</span>
                </>
              )}
            </button>
          </div>

          {/* Quick city tags */}
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <span className="text-[10px] text-stone-500 font-medium">
              {isBn ? "জনপ্রিয়:" : "Quick:"}
            </span>
            {POPULAR_PINCODES.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => handleQuickSelect(item.code)}
                className="text-[10px] px-2 py-0.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-300 text-stone-600 hover:text-amber-900 transition-all cursor-pointer"
              >
                {isBn ? item.city_bn : item.city_en}
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs animate-in fade-in">
              <AlertCircle className="size-3.5 shrink-0" />
              <p className="text-[11px] font-medium">{error}</p>
            </div>
          )}
        </div>
      ) : null}

      {/* Verified Delivery Result Card (Matches Exact Spec) */}
      {result && result.is_serviceable && !isEditing && (
        <div className="space-y-2.5 animate-in fade-in slide-in-from-top-1">
          {/* Main Primary Result Banner */}
          <div className="rounded-xl border border-emerald-300 bg-emerald-50/90 p-3 text-stone-900 shadow-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs font-extrabold text-stone-900 leading-snug">
                  {isBn ? (
                    <>
                      <span className="text-emerald-800">{result.city}</span>-তে ডেলিভারি{" "}
                      <span className="text-amber-900 font-black">{deliveryDayString}</span>-এর মধ্যে,{" "}
                      <span className="text-emerald-700 font-bold">ফ্রি ডেলিভারি</span>{" "}
                      {result.cod_available ? (
                        <span className="text-stone-800">& ক্যাশ অন ডেলিভারি (COD) উপলব্ধ</span>
                      ) : (
                        <span className="text-rose-700 font-medium">(প্রিপেইড অর্ডার উপলব্ধ)</span>
                      )}
                    </>
                  ) : (
                    <>
                      Delivering to <span className="text-emerald-800 font-bold">{result.city}</span> by{" "}
                      <span className="text-amber-900 font-black">{deliveryDayString}</span>,{" "}
                      <span className="text-emerald-700 font-bold">Free Delivery</span>{" "}
                      {result.cod_available ? (
                        <span className="text-stone-800">& COD Available</span>
                      ) : (
                        <span className="text-rose-700 font-medium">(COD Not Available • Prepaid Only)</span>
                      )}
                    </>
                  )}
                </div>

                <div className="text-[11px] text-stone-600 flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-medium text-stone-500">PIN: {result.pincode}</span>
                  <span>•</span>
                  <span>{result.state}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-bold">
                    {isBn ? `আনুমানিক ${result.estimated_delivery_days || 3} কর্মদিবস` : `Est. ${result.estimated_delivery_days || 3} business days`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Value Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
            {/* Free Delivery */}
            <div className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white p-2">
              <Check className="size-3.5 text-emerald-600 shrink-0" />
              <span className="font-semibold text-stone-800">
                {isBn ? "ফ্রি ডেলিভারি (₹৭০ ছাড়)" : "Free Delivery (Save ₹70)"}
              </span>
            </div>

            {/* COD Status (Controlled by Admin ShopCMS) */}
            <div
              className={`flex items-center gap-1.5 rounded-lg border p-2 ${
                result.cod_available
                  ? "border-emerald-200 bg-white text-stone-800"
                  : "border-amber-200 bg-amber-50/70 text-amber-900"
              }`}
            >
              {result.cod_available ? (
                <>
                  <Check className="size-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-stone-800">
                    {isBn ? "ক্যাশ অন ডেলিভারি চালু" : "Cash on Delivery Available"}
                  </span>
                </>
              ) : (
                <>
                  <Ban className="size-3.5 text-amber-600 shrink-0" />
                  <span className="font-semibold text-amber-800" title={result.cod_disabled_reason || ""}>
                    {isBn ? "COD সাময়িক বন্ধ (Prepaid Only)" : "Prepaid Only (COD Off)"}
                  </span>
                </>
              )}
            </div>

            {/* Express Consecration */}
            <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white p-2">
              <Flame className="size-3.5 text-orange-600 shrink-0" />
              <span className="font-semibold text-stone-800">
                {isBn ? "কাশী থেকে ২৪ ঘণ্টায় ডিসপ্যাচ" : "Dispatched in 24h"}
              </span>
            </div>
          </div>

          {/* Collapsible Details Drawer for Kashi Consecration Journey */}
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between text-[11px] font-semibold text-stone-600 hover:text-stone-900 pt-1 border-t border-stone-200/80 cursor-pointer transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-3 text-amber-600" />
              {isBn ? "কাশীর প্রাণ-প্রতিষ্ঠা ও এক্সপ্রেস পরিবহন বিবরণ দেখুন" : "View Sacred Consecration & Express Timeline"}
            </span>
            {showDetails ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          </button>

          {showDetails && (
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-3 space-y-2 text-xs animate-in fade-in">
              <div className="flex items-start gap-2">
                <Flame className="size-3.5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900">
                    {isBn ? "ধাপ ১: কাশীর ঘাটে বৈদিক অভিষেক (আজ)" : "Step 1: Kashi Consecration (Today)"}
                  </span>
                  <p className="text-[11px] text-stone-600">
                    {isBn
                      ? "পবিত্র গঙ্গাজল ও পঞ্চামৃতে আপনার নাম-গোত্রে সংকল্প পাঠ এবং প্রামাণ্য ল্যাব সিলমোহর।"
                      : "Consecrated with Holy Ganga Jal & personalized Sankalpa in your name & Gotra."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Plane className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900">
                    {isBn ? "ধাপ ২: এয়ার এক্সপ্রেস পরিবহন (আগামীকাল)" : "Step 2: Express Air Cargo (Tomorrow)"}
                  </span>
                  <p className="text-[11px] text-stone-600">
                    {isBn
                      ? "বারাণসী বিমানবন্দর হয়ে প্রিমিয়াম সুরক্ষিত প্যাকেটে দ্রুত প্রেরণ।"
                      : "Tamper-proof insured air cargo packaging from Varanasi hub."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Gift className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900">
                    {isBn ? "ধাপ ৩: দোরগোড়ায় ডেলিভারি ও উপহার" : "Step 3: Doorstep Delivery & Free Gift"}
                  </span>
                  <p className="text-[11px] text-stone-600">
                    {isBn
                      ? `বিনামূল্যে ${freeGiftTitle} (মূল্য ₹${freeGiftValue}) এবং ₹${cashbackCoins} ক্যাশব্যাক পয়েন্ট।`
                      : `Includes complimentary ${freeGiftTitle} (Value ₹${freeGiftValue}) + ₹${cashbackCoins} Divine Coins.`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
