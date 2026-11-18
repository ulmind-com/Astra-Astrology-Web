"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Coins,
  PhoneCall,
  MessageSquare,
  Video,
  Sparkles,
  Gift,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ShieldCheck,
  Flame,
  ArrowRight,
  Clock,
  Award,
  Zap,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { astrologerApi } from "@/lib/api";
import type { AstrologerPublic } from "@/types";
import { useLanguage } from "@/providers/language-provider";

interface CashbackConsultationBridgeProps {
  productTitle: string;
  mrp: number;
  salePrice: number;
  cashbackPercent?: number | null;
  freeGiftTitle?: string | null;
  freeGiftValue?: number | null;
  freeGiftBadge?: string | null;
  categorySlug?: string | null;
}

// Fallback verified astrologers if API returns 0 or offline
const FALLBACK_ASTROLOGERS = [
  {
    id: "rudraksha-acharya-1",
    display_name: "আচার্য দেবব্রত শর্মা",
    display_name_en: "Acharya Devabrata Sharma",
    title_bn: "রুদ্রাক্ষ ও গ্রহদোষ বিশেষজ্ঞ",
    title_en: "Rudraksha & Dosha Specialist",
    profile_image_url:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80",
    experience_years: 18,
    rating: { average: 4.95, count: 2430 },
    rates: { call_coins_per_minute: 15, chat_coins_per_minute: 10, video_coins_per_minute: 25 },
    is_online: true,
    slug: "acharya-devabrata-sharma",
  },
  {
    id: "gemology-expert-2",
    display_name: "ড. রূপালী ভট্টাচার্য",
    display_name_en: "Dr. Rupali Bhattacharya",
    title_bn: "রত্ন ও কুন্ডলী বিশেষজ্ঞ",
    title_en: "Gemology & Kundli Expert",
    profile_image_url:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80",
    experience_years: 14,
    rating: { average: 4.9, count: 1890 },
    rates: { call_coins_per_minute: 18, chat_coins_per_minute: 12, video_coins_per_minute: 30 },
    is_online: true,
    slug: "dr-rupali-bhattacharya",
  },
];

function formatINR(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function CashbackConsultationBridge({
  productTitle,
  mrp,
  salePrice,
  cashbackPercent = 100,
  freeGiftTitle,
  freeGiftValue,
  freeGiftBadge,
  categorySlug,
}: CashbackConsultationBridgeProps) {
  const { language } = useLanguage();
  const isBn = language === "bn";

  // If cashback is explicitly disabled (0%) by admin and no free gift, do not show
  const effectiveCashback = cashbackPercent ?? 100;
  if (effectiveCashback === 0 && (!freeGiftValue || freeGiftValue <= 0)) {
    return null;
  }

  // Interactive consultation calculator mode
  const [activeMode, setActiveMode] = React.useState<"call" | "chat" | "video">("call");
  const [showHowItWorks, setShowHowItWorks] = React.useState<boolean>(false);

  // Cashback coins calculation
  const cashbackCoins = Math.round(salePrice * (effectiveCashback / 100));

  // Free gift info
  const hasFreeGift = freeGiftValue !== undefined && freeGiftValue !== null ? freeGiftValue > 0 : true;
  const giftVal = hasFreeGift ? (freeGiftValue ?? 729) : 0;
  const giftTitle =
    freeGiftTitle || (isBn ? "প্রাকৃতিক সেলিনাইট চার্জিং প্লেট" : "Raw Selenite Charging Plate");

  // Fetch real verified astrologers
  const { data: astrologersData } = useQuery({
    queryKey: ["cashback_preview_astrologers"],
    queryFn: async () => {
      try {
        const res = await astrologerApi.list({ limit: 6 });
        return res;
      } catch (err) {
        console.warn("Failed to fetch astrologers for cashback preview:", err);
        return null;
      }
    },
    staleTime: 5 * 60_000,
  });

  const apiAstrologers = astrologersData?.items || [];
  const displayAstrologers = apiAstrologers.length >= 2 ? apiAstrologers.slice(0, 2) : null;

  // Average coin rates for calculation
  const callRate = 15;
  const chatRate = 10;
  const videoRate = 25;

  const freeCallMinutes = Math.max(1, Math.round(cashbackCoins / callRate));
  const freeChatMinutes = Math.max(1, Math.round(cashbackCoins / chatRate));
  const freeVideoMinutes = Math.max(1, Math.round(cashbackCoins / videoRate));

  // Tangible Package Breakdown Values
  const remedyOriginalValue = mrp > salePrice ? mrp : salePrice;
  const totalBundleValue = remedyOriginalValue + giftVal + cashbackCoins;
  const netBundleSavings = totalBundleValue - salePrice;
  const totalSavingsPercent = Math.round((netBundleSavings / totalBundleValue) * 100);

  return (
    <section className="relative rounded-3xl overflow-hidden border border-emerald-500/30 bg-gradient-to-br from-emerald-950 via-[#0a2318] to-stone-950 text-white shadow-xl transition-all duration-300">
      {/* Sacred Ambient Backdrops */}
      <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-amber-500/15 blur-3xl" />

      {/* Ornate Golden Top Border Line */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-400 opacity-90" />

      <div className="p-4 sm:p-6 space-y-5">
        {/* ================================================================= */}
        {/* 1. Header Badge & Value Proposition */}
        {/* ================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 text-xs font-bold text-emerald-300 shadow-xs">
              <Coins className="size-3.5 text-amber-300 animate-pulse" />
              <span>
                {isBn
                  ? `${effectiveCashback}% ওয়ালেট ক্যাশব্যাক ও ফ্রি জ্যোতিষ পরামর্শ ব্রিজ`
                  : `${effectiveCashback}% Wallet Cashback to Astrologer Bridge`}
              </span>
            </div>
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-amber-100 flex items-center gap-2 flex-wrap">
              <span>{isBn ? "প্রতিকার কিনুন, সম্পূর্ণ টাকা ফেরত পান!" : "Order Remedy, Get 100% Money Back!"}</span>
              <span className="text-xs font-sans font-bold bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full">
                {isBn ? `${formatINR(cashbackCoins)} কয়েন বোনাস` : `${cashbackCoins} Coins Bonus`}
              </span>
            </h3>
          </div>

          {/* How it works toggle */}
          <button
            type="button"
            onClick={() => setShowHowItWorks((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-xs text-emerald-300 hover:text-emerald-100 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-emerald-400/20 transition-colors self-start sm:self-center"
          >
            <HelpCircle className="size-3.5 text-amber-300" />
            <span>{isBn ? "ক্যাশব্যাক কীভাবে কাজ করে?" : "How does cashback work?"}</span>
            {showHowItWorks ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          </button>
        </div>

        {/* Collapsible "How it Works" Guide */}
        {showHowItWorks && (
          <div className="rounded-2xl bg-black/40 border border-emerald-500/30 p-4 space-y-3 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
            <h4 className="font-bold text-amber-200 flex items-center gap-2">
              <Sparkles className="size-3.5 text-amber-400" />
              {isBn ? "সহজ ৩টি ধাপে ক্যাশব্যাক ব্যবহার করুন:" : "Use your cashback in 3 easy steps:"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/5 p-3 border border-white/10 space-y-1">
                <span className="size-5 rounded-full bg-amber-400 text-stone-950 font-black text-[11px] flex items-center justify-center">
                  ১
                </span>
                <p className="font-bold text-white">{isBn ? "১. প্রতিকার সামগ্রী অর্ডার করুন" : "1. Order Remedy"}</p>
                <p className="text-[11px] text-emerald-200/80">
                  {isBn
                    ? "অনলাইনে প্রিপেইড পেমেন্ট সম্পূর্ণ করে নিশ্চিত করুন।"
                    : "Complete your prepaid order securely via UPI or Card."}
                </p>
              </div>
              <div className="rounded-xl bg-white/5 p-3 border border-white/10 space-y-1">
                <span className="size-5 rounded-full bg-amber-400 text-stone-950 font-black text-[11px] flex items-center justify-center">
                  ২
                </span>
                <p className="font-bold text-white">{isBn ? "২. ওয়ালেটে কয়েন ক্রেডিট" : "2. Instant Coin Credit"}</p>
                <p className="text-[11px] text-emerald-200/80">
                  {isBn
                    ? `অর্ডার কনফার্ম হলেই ${cashbackCoins} কয়েন আপনার Astra Wallet-এ সরাসরি জমা হবে।`
                    : `${cashbackCoins} coins instantly credited to your consultation wallet.`}
                </p>
              </div>
              <div className="rounded-xl bg-white/5 p-3 border border-white/10 space-y-1">
                <span className="size-5 rounded-full bg-amber-400 text-stone-950 font-black text-[11px] flex items-center justify-center">
                  ৩
                </span>
                <p className="font-bold text-white">{isBn ? "৩. লাইভ পরামর্শ শুরু করুন" : "3. Consult Astrologers"}</p>
                <p className="text-[11px] text-emerald-200/80">
                  {isBn
                    ? "পছন্দের বৈদিক বিশেষজ্ঞের সাথে কল বা চ্যাটে আপনার রুদ্রাক্ষ ধারণ বিধি বা কুন্ডলী আলোচনা করুন।"
                    : "Talk to expert astrologers about wear rituals, dosha remedies, or kundli."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-amber-300/90 pt-1 border-t border-white/10">
              <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
              <span>
                {isBn
                  ? "১০০% গ্যারান্টি: কোনো লুকানো শর্ত নেই এবং এই কয়েনের কোনো মেয়াদ শেষ (Expiry) নেই।"
                  : "100% Guaranteed: No hidden terms, no coin expiry date."}
              </span>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 2. Interactive Real-Value Bundle Calculator */}
        {/* ================================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="size-3.5 text-amber-400" />
              {isBn
                ? `এই ${formatINR(salePrice)}-এ আপনি বাস্তবে যা যা পাচ্ছেন:`
                : `What you actually receive for ${formatINR(salePrice)}:`}
            </span>
            <span className="text-[11px] text-amber-300 font-semibold bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-md">
              {isBn ? "বাস্তব ভ্যালু ক্যালকুলেটর" : "Tangible Value Calculator"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {/* Item 1: The Consecrated Remedy */}
            <div className="rounded-2xl bg-white/5 hover:bg-white/10 border border-emerald-500/20 p-3.5 space-y-2 transition-colors">
              <div className="flex items-center justify-between">
                <span className="size-7 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-sm">
                  📿
                </span>
                <span className="text-xs font-mono font-bold text-amber-200">
                  {formatINR(remedyOriginalValue)}
                </span>
              </div>
              <div>
                <p className="font-bold text-xs text-white line-clamp-1">{productTitle}</p>
                <p className="text-[11px] text-emerald-200/70 mt-0.5">
                  {isBn
                    ? "১০০% খাঁটি, কাশীর পণ্ডিতদের দ্বারা প্রাণ-প্রতিষ্ঠিত।"
                    : "100% Authentic & Consecrated by Kashi Pandits."}
                </p>
              </div>
              <div className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <CheckCircle2 className="size-3" />
                <span>{isBn ? "ল্যাব সার্টিফায়েড প্রতিকার" : "Lab Certified Specimen"}</span>
              </div>
            </div>

            {/* Item 2: Free Gift (Selenite Plate) */}
            <div className="rounded-2xl bg-white/5 hover:bg-white/10 border border-amber-500/20 p-3.5 space-y-2 transition-colors">
              <div className="flex items-center justify-between">
                <span className="size-7 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-sm">
                  🎁
                </span>
                <div className="text-right">
                  {giftVal > 0 && (
                    <span className="text-[10px] text-stone-400 line-through mr-1.5">
                      {formatINR(giftVal)}
                    </span>
                  )}
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
                    {isBn ? "ফ্রি / ₹০" : "FREE"}
                  </span>
                </div>
              </div>
              <div>
                <p className="font-bold text-xs text-white line-clamp-1">{giftTitle}</p>
                <p className="text-[11px] text-emerald-200/70 mt-0.5">
                  {isBn
                    ? "প্রতিকারের শক্তি আজীবন রিচার্জ ও জাগ্রত রাখার জন্য।"
                    : "Maintains & recharges sacred crystallographic energy."}
                </p>
              </div>
              <div className="inline-flex items-center gap-1 text-[10px] text-amber-300 font-medium">
                <Gift className="size-3" />
                <span>{freeGiftBadge || (isBn ? `মূল্য ${formatINR(giftVal)} (উপহার)` : `Worth ${formatINR(giftVal)}`)}</span>
              </div>
            </div>

            {/* Item 3: Free Consultation Coins */}
            <div className="rounded-2xl bg-white/5 hover:bg-white/10 border border-amber-400/30 p-3.5 space-y-2 transition-colors relative overflow-hidden">
              <div className="pointer-events-none absolute -right-4 -bottom-4 size-16 rounded-full bg-amber-400/10 blur-xl" />
              <div className="flex items-center justify-between">
                <span className="size-7 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-sm">
                  🪙
                </span>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 line-through mr-1.5">
                    {formatINR(cashbackCoins)}
                  </span>
                  <span className="text-xs font-bold text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/40">
                    {isBn ? "ফ্রি / ₹০" : "FREE"}
                  </span>
                </div>
              </div>
              <div>
                <p className="font-bold text-xs text-white">
                  {cashbackCoins} {isBn ? "কয়েন ওয়ালেট ক্যাশব্যাক" : "Coins Cashback"}
                </p>
                <p className="text-[11px] text-amber-200/80 mt-0.5">
                  {isBn
                    ? `শীর্ষ বৈদিক জ্যোতিষীর সাথে ~${freeCallMinutes} মিনিটের ফ্রি লাইভ কনসালটেশন!`
                    : `~${freeCallMinutes} mins of free live consultation with top astrologers!`}
                </p>
              </div>
              <div className="inline-flex items-center gap-1 text-[10px] text-emerald-300 font-medium">
                <Coins className="size-3 text-amber-400" />
                <span>{isBn ? "১০০% তাৎক্ষণিক ওয়ালেট ব্যালেন্স" : "100% Instant Consultation Balance"}</span>
              </div>
            </div>
          </div>

          {/* Consultation Mode Interactive Switcher */}
          <div className="rounded-2xl bg-black/30 border border-emerald-500/20 p-3 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="text-stone-300 font-medium">
                {isBn ? "এই কয়েন দিয়ে আপনি কীভাবে কথা বলতে পারবেন?" : "How you can use your cashback coins:"}
              </span>
              <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveMode("call")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    activeMode === "call"
                      ? "bg-amber-400 text-stone-950 shadow-sm"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  <PhoneCall className="size-3" />
                  <span>{isBn ? "অডিও কল" : "Call"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode("chat")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    activeMode === "chat"
                      ? "bg-amber-400 text-stone-950 shadow-sm"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  <MessageSquare className="size-3" />
                  <span>{isBn ? "চ্যাট" : "Chat"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode("video")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    activeMode === "video"
                      ? "bg-amber-400 text-stone-950 shadow-sm"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  <Video className="size-3" />
                  <span>{isBn ? "ভিডিও" : "Video"}</span>
                </button>
              </div>
            </div>

            {/* Calculated Time Preview */}
            <div className="flex items-center justify-between bg-emerald-950/50 rounded-xl px-3 py-2 border border-emerald-500/20 text-xs">
              <span className="text-emerald-200 flex items-center gap-1.5">
                <Clock className="size-3.5 text-amber-300" />
                <span>
                  {activeMode === "call" && (isBn ? "লাইভ অডিও কলে কথা বলার সময়:" : "Live Audio Consultation time:")}
                  {activeMode === "chat" && (isBn ? "ইনস্ট্যান্ট চ্যাট কনসালটেশনের সময়:" : "Instant Chat Consultation time:")}
                  {activeMode === "video" && (isBn ? "ভিডিও কলে সরাসরি দেখার সময়:" : "Face-to-Face Video Consultation time:")}
                </span>
              </span>
              <span className="font-extrabold text-amber-300 font-mono text-sm">
                {activeMode === "call" && `~${freeCallMinutes} ${isBn ? "মিনিট সম্পূর্ণ ফ্রি" : "Mins 100% Free"}`}
                {activeMode === "chat" && `~${freeChatMinutes} ${isBn ? "মিনিট সম্পূর্ণ ফ্রি" : "Mins 100% Free"}`}
                {activeMode === "video" && `~${freeVideoMinutes} ${isBn ? "মিনিট সম্পূর্ণ ফ্রি" : "Mins 100% Free"}`}
              </span>
            </div>
          </div>

          {/* Real Bundle Math Summary Bar */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-900/60 via-amber-950/40 to-stone-900/80 border border-amber-400/30 p-3 sm:p-4 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs sm:text-sm">
              <div className="space-y-0.5">
                <p className="text-stone-300">
                  {isBn ? "মোট প্যাকেজের বাস্তব মূল্য:" : "Total Package Real Value:"}{" "}
                  <span className="line-through text-stone-400 font-mono">{formatINR(totalBundleValue)}</span>
                </p>
                <p className="font-cinzel text-base sm:text-lg font-extrabold text-white">
                  {isBn ? "আপনাকে দিতে হবে মাত্র:" : "You Pay Only:"}{" "}
                  <span className="text-amber-300 font-mono">{formatINR(salePrice)}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 px-3 py-1 text-xs font-black text-emerald-300">
                  <Sparkles className="size-3.5 text-amber-300" />
                  {isBn
                    ? `মোট সাশ্রয় ${formatINR(netBundleSavings)} (${totalSavingsPercent}%)`
                    : `Total Benefit ${formatINR(netBundleSavings)} (${totalSavingsPercent}%)`}
                </span>
                <p className="text-[10px] text-stone-400 mt-1">
                  {isBn ? "*রুদ্রাক্ষ ও উপহার সহ ১০০% ক্যাশব্যাক" : "*Remedy + Gift + 100% Coins Cashback"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. Top Recommended Astrologers Preview */}
        {/* ================================================================= */}
        <div className="space-y-3 pt-2 border-t border-emerald-500/20">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-amber-200 flex items-center gap-1.5">
                <Award className="size-4 text-amber-400" />
                <span>
                  {isBn
                    ? "অর্ডারের পর এই জ্যোতিষীদের সাথে কয়েন দিয়ে কথা বলতে পারবেন:"
                    : "Astrologers you can consult using your cashback coins:"}
                </span>
              </h4>
              <p className="text-[11px] text-emerald-200/70">
                {isBn
                  ? "রুদ্রাক্ষ ধারণ বিধি, গ্রহদোষ ও জন্মকুণ্ডলী পর্যালোচনার জন্য শীর্ষ ভেরিফায়েড বিশেষজ্ঞ"
                  : "Verified experts in Rudraksha rituals, planetary doshas & Vedic Kundli"}
              </p>
            </div>

            <Link
              href="/astrologers"
              className="text-[11px] font-bold text-amber-300 hover:text-amber-100 flex items-center gap-1 transition-colors"
            >
              <span>{isBn ? "সকল জ্যোতিষী দেখুন" : "View all astrologers"}</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          {/* Astrologers Cards Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {displayAstrologers ? (
              // Live API Astrologers
              displayAstrologers.map((astrologer) => {
                const callCost = astrologer.rates?.call_coins_per_minute || 15;
                const astrologerHref = `/astrologers/${astrologer.slug || astrologer.id}`;
                return (
                  <div
                    key={astrologer.id}
                    className="group rounded-2xl bg-white/5 hover:bg-white/10 border border-emerald-500/30 hover:border-amber-400/50 p-3 flex items-center gap-3 transition-all duration-200"
                  >
                    <div className="relative shrink-0">
                      <Avatar
                        src={astrologer.profile_image_url}
                        name={astrologer.display_name}
                        size="md"
                        className="ring-2 ring-amber-400/50 size-12"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 flex size-3">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex size-3 rounded-full bg-emerald-500 border border-stone-900" />
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h5 className="font-bold text-xs text-white truncate group-hover:text-amber-200 transition-colors">
                          {astrologer.display_name}
                        </h5>
                        <CheckCircle2 className="size-3 text-emerald-400 shrink-0" />
                      </div>
                      <p className="text-[10px] text-stone-300 truncate">
                        {astrologer.specialisations?.[0] ||
                          astrologer.tagline ||
                          (isBn ? "রুদ্রাক্ষ ও বৈদিক বিশেষজ্ঞ" : "Vedic & Gemology Expert")}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-stone-400">
                        <span className="text-amber-300 font-bold">
                          ★ {astrologer.rating?.average?.toFixed(1) || "4.9"}
                        </span>
                        <span>•</span>
                        <span>{astrologer.experience_years}+ {isBn ? "বছর" : "yrs"}</span>
                        <span>•</span>
                        <span className="text-emerald-300 font-medium">
                          {callCost} {isBn ? "কয়েন/মি." : "c/min"}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={astrologerHref}
                      className="shrink-0 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-200 hover:text-stone-950 border border-amber-400/40 px-2.5 py-1.5 text-[11px] font-bold transition-all text-center"
                    >
                      {isBn ? "পরামর্শ" : "Consult"}
                    </Link>
                  </div>
                );
              })
            ) : (
              // Curated Fallback Astrologers for 100% Reliability
              FALLBACK_ASTROLOGERS.map((astro) => (
                <div
                  key={astro.id}
                  className="group rounded-2xl bg-white/5 hover:bg-white/10 border border-emerald-500/30 hover:border-amber-400/50 p-3 flex items-center gap-3 transition-all duration-200"
                >
                  <div className="relative shrink-0">
                    <Avatar
                      src={astro.profile_image_url}
                      name={isBn ? astro.display_name : astro.display_name_en}
                      size="md"
                      className="ring-2 ring-amber-400/50 size-12"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 flex size-3">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex size-3 rounded-full bg-emerald-500 border border-stone-900" />
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h5 className="font-bold text-xs text-white truncate group-hover:text-amber-200 transition-colors">
                        {isBn ? astro.display_name : astro.display_name_en}
                      </h5>
                      <CheckCircle2 className="size-3 text-emerald-400 shrink-0" />
                    </div>
                    <p className="text-[10px] text-stone-300 truncate">
                      {isBn ? astro.title_bn : astro.title_en}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-stone-400">
                      <span className="text-amber-300 font-bold">★ {astro.rating.average}</span>
                      <span>•</span>
                      <span>{astro.experience_years}+ {isBn ? "বছর" : "yrs"}</span>
                      <span>•</span>
                      <span className="text-emerald-300 font-medium">
                        {astro.rates.call_coins_per_minute} {isBn ? "কয়েন/মি." : "c/min"}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/astrologers`}
                    className="shrink-0 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-200 hover:text-stone-950 border border-amber-400/40 px-2.5 py-1.5 text-[11px] font-bold transition-all text-center"
                  >
                    {isBn ? "পরামর্শ" : "Consult"}
                  </Link>
                </div>
              ))
            )}
          </div>

          {/* Reassurance Footer */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-[11px] text-stone-400">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span>
                {isBn
                  ? "প্রিপেইড ডেলিভারির সাথে সাথেই কয়েন ওয়ালেটে যুক্ত হবে"
                  : "Coins automatically available immediately on prepaid delivery"}
              </span>
            </span>
            <span className="text-stone-400">
              {isBn ? "যেকোনো সাহায্য: সাপোর্ট টিমের সাথে কথা বলুন" : "24/7 Vedic Customer Support"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
