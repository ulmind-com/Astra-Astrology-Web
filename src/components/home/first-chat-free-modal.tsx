"use client";

import {
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  FileText,
  Lock,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import type { AstrologyLanguage } from "@/types";

interface FirstChatFreeModalProps {
  /** Optional manual trigger override */
  isOpen?: boolean;
  onClose?: () => void;
}

type KundliTab = "lagna" | "navamsha" | "yogas";

interface ModalTranslation {
  brand: string;
  offerBadge: string;
  heading: string;
  freeBadge: string;
  description: string;
  cta: string;
  trustPrivacy: string;
  trustAccuracy: string;
  trustInstant: string;
  highlights: string[];
  tabLagna: string;
  tabNavamsha: string;
  tabYogas: string;
  lagnaTitle: string;
  lagnaSub: string;
  navamshaTitle: string;
  navamshaSub: string;
  yogasTitle: string;
  ctaHint: string;
}

const MODAL_DATA: Record<AstrologyLanguage, ModalTranslation> = {
  en: {
    brand: "DivinLink",
    offerBadge: "100% FREE VEDIC REPORT",
    heading: "Complete Birth Chart & Kundli —",
    freeBadge: "100% FREE",
    description:
      "Unlock your cosmic blueprint with authentic Vedic calculations. Instant high-precision Lagna (D1), Navamsha (D9), Vimshottari Dasha, and Yog/Dosha analysis.",
    cta: "Generate Free Kundli",
    ctaHint: "No wallet coins or payment required • Instant access",
    trustPrivacy: "100% Confidential",
    trustAccuracy: "Lahiri Ayanamsha (Accurate)",
    trustInstant: "Instant Digital Kundli",
    highlights: [
      "Accurate Lagna (D1) & Navamsha (D9) Charts",
      "Vimshottari Dasha & Planetary Sub-periods",
      "Manglik, Kaal Sarp & Auspicious Raj Yogas",
    ],
    tabLagna: "Lagna (D1)",
    tabNavamsha: "Navamsha (D9)",
    tabYogas: "Yogas & Dosha",
    lagnaTitle: "Birth Ascendant: Leo (Simha ♌)",
    lagnaSub: "Surya in 1st House • Guru in 9th (Bhagya)",
    navamshaTitle: "D9 Navamsha: Soul & Destiny",
    navamshaSub: "Pushkar Navamsha • High Venus & Jupiter Harmony",
    yogasTitle: "Major Vedic Planetary Yogas",
  },
  bn: {
    brand: "ডিভিনলিংক",
    offerBadge: "১০০% সম্পূর্ণ ফ্রি বৈদিক রিপোর্ট",
    heading: "সম্পূর্ণ জন্মছক ও বৈদিক কুন্ডলী —",
    freeBadge: "১০০% সম্পূর্ণ ফ্রি",
    description:
      "নির্ভুল বৈদিক গণনায় আপনার সম্পূর্ণ ভাগ্যফল ও জন্মপত্রিকা জানুন। সঠিক লগ্ন কুন্ডলী (D1), নবাংশ (D9), বিংশোত্তরী দশা এবং শুভ রাজযোগ ও দোষের নিখুঁত বিশ্লেষণ।",
    cta: "ফ্রি কুন্ডলী তৈরি করুন",
    ctaHint: "কোনো কয়েন বা পেমেন্ট লাগবে না • সম্পূর্ণ ফ্রি",
    trustPrivacy: "সম্পূর্ণ গোপনীয়",
    trustAccuracy: "নির্ভুল লাহিড়ী অয়নংশ",
    trustInstant: "মুহূর্তেই ডিজিটাল রিপোর্ট",
    highlights: [
      "নির্ভুল লগ্ন (D1) ও নবাংশ (D9) কুন্ডলী",
      "বিংশোত্তরী মহাদশা ও অন্তর্দশার হিসাব",
      "মাঙ্গলিক দোষ ও শুভ রাজযোগ বিশ্লেষণ",
    ],
    tabLagna: "লগ্ন ছক (D1)",
    tabNavamsha: "নবাংশ (D9)",
    tabYogas: "রাজযোগ ও দোষ",
    lagnaTitle: "জন্ম লগ্ন: সিংহ লগ্ন (♌)",
    lagnaSub: "১ম ভাবে সূর্য • ৯ম ভাবে বৃহস্পতির শুভ অবস্থান",
    navamshaTitle: "নবাংশ কুন্ডলী (D9): ভাগ্য ও বিবাহ",
    navamshaSub: "পুষ্কর নবাংশ • শুক্র ও বৃহস্পতির চমৎকার শুভ মিলন",
    yogasTitle: "সক্রিয় বৈদিক রাজযোগ ও ফল",
  },
  hi: {
    brand: "DivinLink",
    offerBadge: "100% निःशुल्क वैदिक रिपोर्ट",
    heading: "सटीक जन्म कुंडली और ग्रह चक्र —",
    freeBadge: "100% निःशुल्क",
    description:
      "वैदिक ज्योतिष गणना द्वारा अपनी सटीक जन्म कुंडली और संपूर्ण जीवन चक्र जानें। लग्न (D1), नवमांश (D9), विंशोत्तरी महादशा और मांगलिक व राजयोग का विस्तृत विश्लेषण।",
    cta: "मुफ़्त जन्म कुंडली बनाएं",
    ctaHint: "कोई शुल्क या कॉइन्स नहीं • तुरंत ऑनलाइन रिपोर्ट",
    trustPrivacy: "100% सुरक्षित एवं गोपनीय",
    trustAccuracy: "सटीक लाहिड़ी अयनांश",
    trustInstant: "तुरंत डिजिटल जन्मपत्री",
    highlights: [
      "सटीक लग्न (D1) व नवमांश (D9) चक्र",
      "विंशोत्तरी महादशा व अंतर्दशा समयरेखा",
      "मांगलिक, कालसर्प व राजयोग परीक्षण",
    ],
    tabLagna: "लग्न कुंडली (D1)",
    tabNavamsha: "नवमांश (D9)",
    tabYogas: "योग व दोष",
    lagnaTitle: "जन्म लग्न: सिंह लग्न (♌)",
    lagnaSub: "प्रथम भाव में सूर्य • नवम भाव में गुरु की कृपा",
    navamshaTitle: "नवमांश (D9): जीवनसाथी व भाग्य",
    navamshaSub: "पुष्कर नवमांश • शुक्र और बृहस्पति की शुभ स्थिति",
    yogasTitle: "सक्रिय वैदिक राजयोग व प्रभाव",
  },
};

export function FirstChatFreeModal({
  isOpen: manualIsOpen,
  onClose: manualOnClose,
}: FirstChatFreeModalProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<KundliTab>("lagna");

  const isControlled = manualIsOpen !== undefined;
  const isVisible = isControlled ? manualIsOpen : isOpen;

  const t = MODAL_DATA[language] || MODAL_DATA.en;

  // Auto-pop on mount after a subtle natural delay (~800ms)
  useEffect(() => {
    if (isControlled) return;

    try {
      // Check if dismissed in current tab session
      const dismissed = sessionStorage.getItem("divinlink_kundli_free_modal_dismissed_v2");
      if (!dismissed) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // Storage unavailable, pop gently
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isControlled]);

  const handleClose = () => {
    setIsOpen(false);
    if (manualOnClose) {
      manualOnClose();
    }
    try {
      sessionStorage.setItem("divinlink_kundli_free_modal_dismissed_v2", "true");
    } catch {}
  };

  // Close on Escape key
  useEffect(() => {
    if (!isVisible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* 1. Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/65 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* 2. Main Modal Card */}
      <div className="relative w-full max-w-[840px] overflow-hidden rounded-[26px] sm:rounded-[32px] border border-amber-300/80 dark:border-amber-500/35 bg-gradient-to-br from-[#fffdf7] via-[#fffcee] to-[#fff5d8] dark:from-[#17110c] dark:via-[#1c1611] dark:to-[#120d09] shadow-[0_25px_70px_-15px_rgba(26,18,8,0.35),0_0_50px_rgba(245,158,11,0.22)] p-5 sm:p-7 md:p-8 z-10 animate-in zoom-in-95 duration-200 text-stone-900 dark:text-amber-50">
        {/* Glow orb accents */}
        <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-radial from-amber-300/40 dark:from-amber-500/20 via-transparent to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-radial from-yellow-400/35 dark:from-amber-600/15 via-transparent to-transparent blur-3xl" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 flex size-8 sm:size-9 items-center justify-center rounded-full bg-[#faeed1]/90 dark:bg-amber-950/60 hover:bg-[#f5e2b0] dark:hover:bg-amber-900/80 text-amber-900 dark:text-amber-200 border border-amber-300/60 dark:border-amber-500/40 transition-colors z-20 shadow-xs cursor-pointer"
        >
          <X className="size-4 sm:size-4.5 stroke-[2.3]" />
        </button>

        {/* Grid Container */}
        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 md:gap-7 items-center">
          {/* ================= LEFT COLUMN: Value Proposition & Action ================= */}
          <div className="md:col-span-6 flex flex-col items-start text-left z-10">
            {/* Brand + Vedic Pill */}
            <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
              <div className="flex size-7 sm:size-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 text-stone-950 shadow-[0_3px_10px_-2px_rgba(245,158,11,0.7)] ring-1 ring-amber-300">
                <Sun className="size-3.5 sm:size-4 stroke-[2.2]" />
              </div>
              <span className="font-cinzel text-base sm:text-lg font-bold tracking-tight text-stone-900 dark:text-amber-100">
                {t.brand}
              </span>
              <span className="ml-1 text-[9.5px] sm:text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-500/40">
                {t.offerBadge}
              </span>
            </div>

            {/* Sub-heading */}
            <h3 className="text-sm sm:text-base font-semibold tracking-tight text-amber-950/80 dark:text-amber-200/90 leading-tight">
              {t.heading}
            </h3>

            {/* Giant Gold Badge: 100% FREE */}
            <div className="flex items-baseline gap-2 mt-1 sm:mt-1.5">
              <h2 className="text-4xl sm:text-5xl md:text-[3.4rem] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 dark:from-amber-300 dark:via-yellow-300 dark:to-amber-400 leading-none font-sans drop-shadow-xs">
                {t.freeBadge}
              </h2>
            </div>

            {/* Description */}
            <p className="mt-2.5 sm:mt-3 text-xs sm:text-[13px] text-stone-700 dark:text-stone-300 leading-relaxed max-w-[340px]">
              {t.description}
            </p>

            {/* Highlights List */}
            <div className="mt-3.5 space-y-1.5 sm:space-y-2 w-full max-w-[340px]">
              {t.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-[11.5px] sm:text-xs font-medium text-stone-800 dark:text-amber-100/90"
                >
                  <div className="flex size-4 sm:size-4.5 shrink-0 items-center justify-center rounded-full bg-amber-200/80 dark:bg-amber-500/25 text-amber-800 dark:text-amber-300">
                    <CheckCircle2 className="size-3 sm:size-3.5 stroke-[2.5]" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Action CTA */}
            <div className="mt-4 sm:mt-5 flex flex-col items-start gap-1.5 w-full sm:w-auto">
              <Link
                href="/kundli"
                onClick={handleClose}
                className="w-full sm:w-auto"
              >
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-extrabold text-sm sm:text-[15px] px-6 sm:px-8 py-3 shadow-[0_8px_22px_-6px_rgba(245,158,11,0.75)] hover:shadow-[0_10px_26px_-4px_rgba(245,158,11,0.9)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-amber-300 cursor-pointer"
                >
                  <Sparkles className="size-4 fill-stone-950" />
                  <span>{t.cta}</span>
                  <ArrowRight className="size-4 stroke-[2.6]" />
                </button>
              </Link>
              <span className="text-[10px] text-amber-800/80 dark:text-amber-300/70 font-medium pl-1">
                {t.ctaHint}
              </span>
            </div>

            {/* Trust Badges */}
            <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] font-medium text-stone-600 dark:text-stone-400 pt-2 border-t border-amber-200/60 dark:border-amber-500/20 w-full max-w-[340px]">
              <span className="inline-flex items-center gap-1">
                <Lock className="size-3 text-amber-600 dark:text-amber-400" />
                {t.trustPrivacy}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Compass className="size-3 text-amber-600 dark:text-amber-400" />
                {t.trustAccuracy}
              </span>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: Interactive Kundli Preview ================= */}
          <div className="md:col-span-6 relative flex flex-col items-center justify-center min-h-[290px] sm:min-h-[320px]">
            {/* Tab Switchers */}
            <div className="flex items-center justify-center gap-1 w-full rounded-xl bg-amber-100/70 dark:bg-stone-900/80 p-1 border border-amber-200/80 dark:border-amber-500/30 mb-2.5 z-10 shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab("lagna")}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  activeTab === "lagna"
                    ? "bg-amber-400 dark:bg-amber-500 text-stone-950 shadow-xs font-bold"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-amber-200"
                }`}
              >
                {t.tabLagna}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("navamsha")}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  activeTab === "navamsha"
                    ? "bg-amber-400 dark:bg-amber-500 text-stone-950 shadow-xs font-bold"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-amber-200"
                }`}
              >
                {t.tabNavamsha}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("yogas")}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  activeTab === "yogas"
                    ? "bg-amber-400 dark:bg-amber-500 text-stone-950 shadow-xs font-bold"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-amber-200"
                }`}
              >
                {t.tabYogas}
              </button>
            </div>

            {/* Interactive Preview Container */}
            <div className="relative w-full rounded-2xl border border-amber-300/80 dark:border-amber-500/35 bg-[#fffef9]/90 dark:bg-[#15100c]/90 p-3 sm:p-4 shadow-[inset_0_2px_8px_rgba(245,158,11,0.06)] flex flex-col items-center justify-center">
              {activeTab === "lagna" && (
                <div className="w-full flex flex-col items-center animate-in fade-in duration-200">
                  {/* Chart Title Header */}
                  <div className="flex items-center justify-between w-full px-1 mb-2">
                    <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                      <Sun className="size-3.5 text-amber-500 fill-amber-400" />
                      {t.lagnaTitle}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-semibold border border-amber-300/60 dark:border-amber-500/30">
                      D1 Chart
                    </span>
                  </div>

                  {/* North Indian Diamond Chart SVG (Exact Geometry) */}
                  <div className="relative size-[210px] sm:size-[230px] my-1">
                    <svg
                      viewBox="0 0 300 300"
                      className="size-full stroke-amber-600 dark:stroke-amber-400/80 drop-shadow-xs"
                    >
                      {/* Outer boundary */}
                      <rect
                        x="6"
                        y="6"
                        width="288"
                        height="288"
                        fill="none"
                        strokeWidth="2"
                        className="stroke-amber-600 dark:stroke-amber-400/80"
                      />
                      {/* Diagonals */}
                      <line x1="6" y1="6" x2="294" y2="294" strokeWidth="1.5" />
                      <line x1="294" y1="6" x2="6" y2="294" strokeWidth="1.5" />
                      {/* Inner Diamond */}
                      <polygon
                        points="150,6 294,150 150,294 6,150"
                        fill="rgba(245, 158, 11, 0.05)"
                        strokeWidth="1.8"
                      />

                      {/* Kendra Houses Glow Highlight */}
                      {/* H1 Lagna Diamond (Center Top) */}
                      <polygon
                        points="150,6 222,78 150,150 78,78"
                        fill="rgba(251, 191, 36, 0.16)"
                      />

                      {/* Planetary Placements Text in North Chart */}
                      {/* H1: Lagna (Leo) -> Sun + Mercury */}
                      <g className="fill-amber-950 dark:fill-amber-100 font-bold select-none text-center">
                        <text x="150" y="55" fontSize="11" textAnchor="middle" fill="#d97706" fontWeight="bold">
                          1 (Lagna)
                        </text>
                        <text x="150" y="75" fontSize="12" textAnchor="middle" fontWeight="bold">
                          ☉ Su 14° • ☿ Me
                        </text>
                        <text x="150" y="92" fontSize="9.5" textAnchor="middle" fill="#78350f" className="dark:fill-amber-300 font-medium">
                          Simha ♌
                        </text>

                        {/* H2 (Top Left) */}
                        <text x="75" y="45" fontSize="10" textAnchor="middle">
                          2 ♍
                        </text>

                        {/* H3 (Upper Left) */}
                        <text x="40" y="80" fontSize="10" textAnchor="middle">
                          3 ♎
                        </text>

                        {/* H4 (Left Center Diamond): Moon */}
                        <text x="78" y="145" fontSize="10" textAnchor="middle" fill="#d97706">
                          4 ♏
                        </text>
                        <text x="78" y="162" fontSize="11" textAnchor="middle" fontWeight="bold">
                          ☽ Mo 22°
                        </text>

                        {/* H5 (Lower Left): Ketu */}
                        <text x="40" y="230" fontSize="10" textAnchor="middle">
                          5 ♐ ☋ Ke
                        </text>

                        {/* H6 (Bottom Left) */}
                        <text x="75" y="265" fontSize="10" textAnchor="middle">
                          6 ♑
                        </text>

                        {/* H7 (Bottom Center Diamond): Venus */}
                        <text x="150" y="215" fontSize="10" textAnchor="middle" fill="#d97706">
                          7 ♒
                        </text>
                        <text x="150" y="235" fontSize="11" textAnchor="middle" fontWeight="bold">
                          ♀ Ve 09°
                        </text>

                        {/* H8 (Bottom Right) */}
                        <text x="225" y="265" fontSize="10" textAnchor="middle">
                          8 ♓
                        </text>

                        {/* H9 (Lower Right): Jupiter Exalted */}
                        <text x="255" y="225" fontSize="10" textAnchor="middle" fontWeight="bold" fill="#b45309" className="dark:fill-amber-300">
                          9 ♈ ♃ Ju
                        </text>

                        {/* H10 (Right Center Diamond): Mars Digbala */}
                        <text x="222" y="145" fontSize="10" textAnchor="middle" fill="#d97706">
                          10 ♉
                        </text>
                        <text x="222" y="162" fontSize="11" textAnchor="middle" fontWeight="bold">
                          ♂ Ma 28°
                        </text>

                        {/* H11 (Upper Right): Saturn & Rahu */}
                        <text x="255" y="80" fontSize="10" textAnchor="middle" fontWeight="bold">
                          11 ♊ ♄ • ☊
                        </text>

                        {/* H12 (Top Right) */}
                        <text x="225" y="45" fontSize="10" textAnchor="middle">
                          12 ♋
                        </text>
                      </g>
                    </svg>
                  </div>

                  {/* Lagna Summary footer */}
                  <p className="text-[10.5px] text-stone-600 dark:text-stone-300 font-medium text-center mt-1">
                    {t.lagnaSub}
                  </p>
                </div>
              )}

              {activeTab === "navamsha" && (
                <div className="w-full flex flex-col items-center animate-in fade-in duration-200">
                  <div className="flex items-center justify-between w-full px-1 mb-2">
                    <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                      <Sparkles className="size-3.5 text-amber-500 fill-amber-400" />
                      {t.navamshaTitle}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-semibold border border-amber-300/60 dark:border-amber-500/30">
                      D9 Chart
                    </span>
                  </div>

                  {/* Navamsha Miniature Visual */}
                  <div className="w-full bg-amber-50/60 dark:bg-amber-950/20 rounded-xl p-3 border border-amber-200/60 dark:border-amber-500/20 space-y-2.5 my-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-stone-700 dark:text-stone-200">Navamsha Lagna</span>
                      <span className="text-amber-700 dark:text-amber-300 font-bold">Sagittarius (Dhanu ♐)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-stone-700 dark:text-stone-200">Venus Dignity</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">Pushkar Navamsha (Fortunate)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-stone-700 dark:text-stone-200">7th House (Spouse & Dharma)</span>
                      <span className="text-amber-700 dark:text-amber-300 font-bold">Exalted Jupiter Aspect</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-stone-700 dark:text-stone-200">Atmakaraka Position</span>
                      <span className="text-amber-700 dark:text-amber-300 font-bold">Sun in Kendra (Leadership)</span>
                    </div>
                  </div>

                  <p className="text-[10.5px] text-stone-600 dark:text-stone-300 font-medium text-center mt-2">
                    {t.navamshaSub}
                  </p>
                </div>
              )}

              {activeTab === "yogas" && (
                <div className="w-full flex flex-col items-center animate-in fade-in duration-200">
                  <div className="flex items-center justify-between w-full px-1 mb-2">
                    <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                      <Award className="size-3.5 text-amber-500" />
                      {t.yogasTitle}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-600/40">
                      High Auspiciousness
                    </span>
                  </div>

                  {/* Yoga Badges List */}
                  <div className="w-full space-y-2 my-1">
                    <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 flex items-start gap-2.5">
                      <div className="size-6 shrink-0 rounded-full bg-amber-200 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-xs mt-0.5">
                        👑
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-stone-900 dark:text-amber-100 flex items-center gap-1.5">
                          <span>Budhaditya Raj Yoga</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold">
                            Active
                          </span>
                        </div>
                        <p className="text-[10.5px] text-stone-600 dark:text-stone-300 mt-0.5 leading-snug">
                          Sun & Mercury in Lagna brings acute analytical intellect & societal authority.
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 flex items-start gap-2.5">
                      <div className="size-6 shrink-0 rounded-full bg-amber-200 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-xs mt-0.5">
                        🐘
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-stone-900 dark:text-amber-100 flex items-center gap-1.5">
                          <span>Gaja Kesari Yoga</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold">
                            Active
                          </span>
                        </div>
                        <p className="text-[10.5px] text-stone-600 dark:text-stone-300 mt-0.5 leading-snug">
                          Jupiter and Moon in Kendra confers lasting wealth, prestige & wisdom.
                        </p>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-700/50 flex items-center justify-between text-xs px-3">
                      <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                        <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        Manglik Dosha
                      </span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                        Cancelled / Neutralized
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Interactive Prompt */}
              <div className="mt-2 pt-2 border-t border-amber-200/60 dark:border-amber-500/20 w-full flex items-center justify-between text-[10px] text-amber-800/90 dark:text-amber-300/80">
                <span className="inline-flex items-center gap-1 font-medium">
                  <Zap className="size-3 text-amber-500 fill-amber-500" />
                  Calculated with Swiss Ephemeris
                </span>
                <Link
                  href="/kundli"
                  onClick={handleClose}
                  className="font-bold underline hover:text-amber-950 dark:hover:text-amber-100 cursor-pointer"
                >
                  View Full Chart →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
