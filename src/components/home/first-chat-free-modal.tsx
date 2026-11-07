"use client";

import { ArrowRight, CheckCircle2, Lock, Sparkles, User, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import type { AstrologyLanguage } from "@/types";

interface FirstChatFreeModalProps {
  /** Optional manual trigger override */
  isOpen?: boolean;
  onClose?: () => void;
}

type TopicKey = "career" | "love" | "wealth";

interface TopicContent {
  id: TopicKey;
  label: string;
  userQuery: string;
  userTime: string;
  astroReply1: string;
  astroReply1Time: string;
  astroReply2: string;
  astroReply2Time: string;
}

interface ModalTranslation {
  brand: string;
  offerBadge: string;
  heading: string;
  freeBadge: string;
  description: string;
  cta: string;
  trustPrivacy: string;
  trustVerified: string;
  topics: Record<TopicKey, TopicContent>;
}

const MODAL_DATA: Record<AstrologyLanguage, ModalTranslation> = {
  en: {
    brand: "DivinLink",
    offerBadge: "WELCOME SPECIAL",
    heading: "Your First Consultation is",
    freeBadge: "100% FREE",
    description:
      "Consult India's top verified Vedic Acharyas and instant 24/7 AI. Authentic planetary guidance for life's biggest questions.",
    cta: "Start Free Consultation",
    trustPrivacy: "100% Confidential",
    trustVerified: "Certified Vedic Astrologers",
    topics: {
      career: {
        id: "career",
        label: "💼 Career",
        userQuery: "Will my upcoming job switch bring growth and promotion?",
        userTime: "11:24 AM",
        astroReply1: "Yes, Jupiter transiting your 10th house creates an exceptional breakthrough.",
        astroReply1Time: "11:25 AM",
        astroReply2: "Favorable dasha confirms a high-growth offer within 45 days.",
        astroReply2Time: "11:25 AM",
      },
      love: {
        id: "love",
        label: "❤️ Love",
        userQuery: "When will I meet my compatible life partner?",
        userTime: "11:24 AM",
        astroReply1: "Venus aligns in your 7th house—indicating an auspicious soul connection.",
        astroReply1Time: "11:25 AM",
        astroReply2: "Strong planetary yoga for marriage talks starting this quarter.",
        astroReply2Time: "11:25 AM",
      },
      wealth: {
        id: "wealth",
        label: "✨ Wealth",
        userQuery: "Will my financial stability and new investments prosper?",
        userTime: "11:24 AM",
        astroReply1: "Dhan Yoga activates in your 2nd house with strong planetary backing.",
        astroReply1Time: "11:25 AM",
        astroReply2: "Expect steady financial expansion starting this lunar cycle.",
        astroReply2Time: "11:25 AM",
      },
    },
  },
  bn: {
    brand: "ডিভিনলিংক",
    offerBadge: "স্বাগত বিশেষ অফার",
    heading: "আপনার প্রথম বৈদিক পরামর্শ",
    freeBadge: "১০০% ফ্রি",
    description:
      "শীর্ষস্থানীয় সার্টিফাইড বৈদিক জ্যোতিষী এবং ২৪/৭ এআইয়ের সাথে কথা বলুন। ক্যারিয়ার, প্রেম ও ভাগ্যের নির্ভুল দিকনির্দেশনা।",
    cta: "ফ্রি চ্যাট শুরু করুন",
    trustPrivacy: "সম্পূর্ণ গোপনীয়",
    trustVerified: "ভেরিফাইড বৈদিক পণ্ডিত",
    topics: {
      career: {
        id: "career",
        label: "💼 ক্যারিয়ার",
        userQuery: "আসন্ন চাকরির পরিবর্তন কি আমার জন্য শুভ ও পদোন্নতি আনবে?",
        userTime: "১১:২৪ AM",
        astroReply1: "হ্যাঁ, দশম ভাবে বৃহস্পতির শুভ গোচরে আগামী মাস থেকেই দারুণ অগ্রগতির যোগ।",
        astroReply1Time: "১১:২৫ AM",
        astroReply2: "শুভ গ্রহের প্রভাবে আগামী ৪৫ দিনের মধ্যেই ভালো অফার পাবেন।",
        astroReply2Time: "১১:২৫ AM",
      },
      love: {
        id: "love",
        label: "❤️ প্রেম",
        userQuery: "আমার শুভ বিবাহ ও মনের মতো জীবনসঙ্গী পাওয়ার সময় কখন?",
        userTime: "১১:২৪ AM",
        astroReply1: "সপ্তম ভাবে শুক্রের শুভ অবস্থানে শীঘ্রই মনের মতো সম্পর্কের সূচনা হবে।",
        astroReply1Time: "১১:২৫ AM",
        astroReply2: "আসন্ন ৩ মাসের মধ্যেই শুভ বিবাহের প্রস্তাব ইতিবাচক রূপ নেবে।",
        astroReply2Time: "১১:২৫ AM",
      },
      wealth: {
        id: "wealth",
        label: "✨ অর্থ",
        userQuery: "আমার আর্থিক অবস্থা এবং নতুন বিনিয়োগে কি উন্নতি হবে?",
        userTime: "১১:২৪ AM",
        astroReply1: "আপনার জন্মছকে শক্তিশালী ধনযোগ জাগ্রত হচ্ছে, আর্থিক লাভ নিশ্চিত।",
        astroReply1Time: "১১:২৫ AM",
        astroReply2: "আসন্ন অমাবস্যার পর থেকেই ব্যবসায় নতুন আয়ের পথ খুলে যাবে।",
        astroReply2Time: "১১:২৫ AM",
      },
    },
  },
  hi: {
    brand: "DivinLink",
    offerBadge: "विशेष स्वागत ऑफ़र",
    heading: "आपका पहला वैदिक परामर्श",
    freeBadge: "100% FREE",
    description:
      "भारत के शीर्ष प्रमाणित ज्योतिषाचार्यों और 24/7 एआई से जुड़ें। करियर, प्रेम व भाग्य पर पाएं सटीक और गोपनीय मार्गदर्शन।",
    cta: "मुफ़्त परामर्श शुरू करें",
    trustPrivacy: "100% सुरक्षित एवं गोपनीय",
    trustVerified: "प्रमाणित ज्योतिषाचार्य",
    topics: {
      career: {
        id: "career",
        label: "💼 करियर",
        userQuery: "क्या आगामी नौकरी परिवर्तन मेरे लिए पदोन्नति और वृद्धि लाएगा?",
        userTime: "11:24 AM",
        astroReply1: "हाँ, दशम भाव में गुरु का गोचर अत्यंत फलदायी राजयोग बना रहा है।",
        astroReply1Time: "11:25 AM",
        astroReply2: "शुभ ग्रह दशा से 45 दिनों में शानदार अवसर प्राप्त होने के प्रबल संकेत हैं।",
        astroReply2Time: "11:25 AM",
      },
      love: {
        id: "love",
        label: "❤️ प्रेम",
        userQuery: "मेरा विवाह कब तक होगा और जीवनसाथी कैसा मिलेगा?",
        userTime: "11:24 AM",
        astroReply1: "सप्तम भाव में शुक्र की स्थिति शीघ्र ही अनुकूल जीवनसाथी मिलने का संकेत देती है।",
        astroReply1Time: "11:25 AM",
        astroReply2: "अगले 3 महीनों में विवाह की बातचीत में सकारात्मक परिणाम मिलेंगे।",
        astroReply2Time: "11:25 AM",
      },
      wealth: {
        id: "wealth",
        label: "✨ धन",
        userQuery: "क्या मेरी आर्थिक स्थिति सुधरेगी और नया निवेश लाभकारी रहेगा?",
        userTime: "11:24 AM",
        astroReply1: "द्वितीय भाव में प्रबल धनयोग सक्रिय हो रहा है, उत्तम वित्तीय लाभ होगा।",
        astroReply1Time: "11:25 AM",
        astroReply2: "आगामी गोचर के बाद से वित्तीय स्थिरता और व्यापार में वृद्धि के स्पष्ट संकेत हैं।",
        astroReply2Time: "11:25 AM",
      },
    },
  },
};

export function FirstChatFreeModal({
  isOpen: manualIsOpen,
  onClose: manualOnClose,
}: FirstChatFreeModalProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState<TopicKey>("career");

  const t = MODAL_DATA[language] || MODAL_DATA.en;
  const currentTopic = t.topics[activeTopic] || t.topics.career;

  // Auto-pop on mount after a subtle natural delay (~900ms)
  useEffect(() => {
    if (manualIsOpen !== undefined) {
      setIsOpen(manualIsOpen);
      return;
    }

    try {
      // Check if dismissed in current tab session
      const dismissed = sessionStorage.getItem("divinlink_first_chat_modal_dismissed");
      if (!dismissed) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 900);
        return () => clearTimeout(timer);
      }
    } catch {
      // Storage unavailable, pop gently
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [manualIsOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (manualOnClose) {
      manualOnClose();
    }
    try {
      sessionStorage.setItem("divinlink_first_chat_modal_dismissed", "true");
    } catch {}
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const topicList: TopicKey[] = ["career", "love", "wealth"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* 1. Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* 2. Main Modal Card */}
      <div className="relative w-full max-w-[720px] overflow-hidden rounded-[28px] sm:rounded-[36px] border border-[#f0de96] bg-gradient-to-br from-[#fffdf6] via-[#fffcee] to-[#fff6dc] shadow-[0_25px_60px_-15px_rgba(26,18,8,0.3),0_0_50px_rgba(255,215,0,0.25)] p-6 sm:p-8 md:p-9 z-10 animate-in zoom-in-95 duration-200">
        {/* Subtle decorative gold sheen */}
        <div className="pointer-events-none absolute -top-24 -left-24 size-64 rounded-full bg-radial from-[#ffe98a]/50 via-transparent to-transparent blur-2xl" />

        {/* Close Button (X in top right) */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 flex size-8 sm:size-9 items-center justify-center rounded-full bg-[#faeed1]/80 hover:bg-[#f5e2b0] text-[#786134] hover:text-[#1a1208] transition-colors z-20 shadow-xs cursor-pointer"
        >
          <X className="size-4 sm:size-4.5 stroke-[2.2]" />
        </button>

        {/* Two-Column Grid: Left Offer + Right Simulated Chat */}
        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-7 items-center">
          {/* Left Column: Branding, Big FREE, Description & CTA */}
          <div className="md:col-span-6 flex flex-col items-start text-left z-10">
            {/* Logo + Brand Pill */}
            <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
              <div className="flex size-7 sm:size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#ffd700] via-[#f7d028] to-[#e6be00] text-[#1c1304] shadow-[0_3px_10px_-2px_rgba(255,215,0,0.8)] ring-1 ring-[#d4ab00]">
                <Sparkles className="size-3.5 sm:size-4 fill-current" />
              </div>
              <span className="font-cinzel text-base sm:text-lg font-bold tracking-tight text-[#1a1208]">
                {t.brand}
              </span>
              <span className="ml-1 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#faeed1] text-[#7c631a] border border-[#ecd58e]">
                {t.offerBadge}
              </span>
            </div>

            {/* Heading: Your First Consultation is */}
            <h3 className="font-display text-base sm:text-lg font-semibold tracking-tight text-[#3b2a0b] leading-tight mt-1">
              {t.heading}
            </h3>

            {/* Giant Bold 100% FREE */}
            <h2 className="text-4xl sm:text-5xl md:text-[3.6rem] font-black tracking-tight text-[#1a1208] leading-none mt-1 sm:mt-1.5 font-sans drop-shadow-xs">
              {t.freeBadge}
            </h2>

            {/* Subtitle */}
            <p className="mt-2.5 sm:mt-3 text-xs sm:text-[13px] text-[#63533b] leading-relaxed max-w-[290px]">
              {t.description}
            </p>

            {/* CTA Button: Start Free Consultation -> */}
            <Link
              href="/astrologers"
              onClick={handleClose}
              className="mt-4 sm:mt-5 inline-flex"
            >
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#ffd700] to-[#f7ce18] hover:from-[#f5cc00] hover:to-[#ebc100] text-[#1c1304] font-extrabold text-sm sm:text-[15px] px-6 sm:px-7 py-3 shadow-[0_8px_20px_-6px_rgba(255,215,0,0.8)] transition-all duration-200 hover:scale-105 active:scale-95 border border-[#e6be00] cursor-pointer"
              >
                <span>{t.cta}</span>
                <ArrowRight className="size-4 stroke-[2.5]" />
              </button>
            </Link>

            {/* Trust Badges */}
            <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] font-medium text-[#7d6840]">
              <span className="inline-flex items-center gap-1">
                <Lock className="size-3 text-[#d4a000]" />
                {t.trustPrivacy}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="size-3 text-[#1f8745]" />
                {t.trustVerified}
              </span>
            </div>
          </div>

          {/* Right Column: Astrological Radar Chart & Interactive Floating Chat */}
          <div className="md:col-span-6 relative flex flex-col items-center justify-center min-h-[260px] sm:min-h-[290px] overflow-visible">
            {/* 1. Astrological Circular Chart / Radar Background */}
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 size-64 sm:size-80 opacity-40">
              {/* Outer circle */}
              <div className="absolute inset-0 rounded-full border border-[#e3cb78]/60" />
              {/* Middle circle 1 */}
              <div className="absolute inset-7 rounded-full border border-[#e3cb78]/50" />
              {/* Middle circle 2 */}
              <div className="absolute inset-14 rounded-full border border-[#e3cb78]/40" />
              {/* Inner circle */}
              <div className="absolute inset-21 rounded-full border border-[#e3cb78]/30" />
              {/* Center point with gold glow */}
              <div className="absolute inset-[46%] rounded-full bg-[#fcd404]/30 blur-xs" />

              {/* Radial spokes (12 Zodiac Houses lines) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-px bg-[#e3cb78]/40 rotate-0" />
                <div className="w-full h-px bg-[#e3cb78]/35 rotate-30" />
                <div className="w-full h-px bg-[#e3cb78]/35 rotate-60" />
                <div className="w-full h-px bg-[#e3cb78]/40 rotate-90" />
                <div className="w-full h-px bg-[#e3cb78]/35 rotate-120" />
                <div className="w-full h-px bg-[#e3cb78]/35 rotate-150" />
              </div>
            </div>

            {/* 2. Interactive Topic Selector Pills */}
            <div className="relative flex flex-nowrap items-center justify-center gap-1.5 mb-4 z-10 w-full rounded-full bg-[#fffaed]/70 p-1 border border-[#efe0ad]/70 shadow-inner backdrop-blur-sm">
              {topicList.map((key) => {
                const topic = t.topics[key];
                const isActive = activeTopic === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTopic(key)}
                    className={`cursor-pointer flex-1 whitespace-nowrap px-2 py-1.5 rounded-full text-[11px] sm:text-[11.5px] font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-b from-[#ffd700] to-[#f2c200] text-[#1c1304] shadow-[0_3px_8px_-2px_rgba(240,194,0,0.7)] ring-1 ring-[#e6be00]"
                        : "text-[#8a7340] hover:text-[#5f4d22]"
                    }`}
                  >
                    {topic.label}
                  </button>
                );
              })}
            </div>

            {/* 3. Floating Chat Simulation */}
            <div className="relative w-full flex flex-col items-stretch gap-3 z-10 transition-all duration-300">
              {/* Bubble 1: User Question — aligned RIGHT (sent by user) */}
              <div className="flex items-end justify-end gap-2 max-w-full">
                {/* Dark Bubble */}
                <div className="relative max-w-[210px] rounded-2xl rounded-tr-xs bg-[#1a1412] px-3.5 py-2 shadow-lg text-left">
                  {/* Tail pointing right toward avatar */}
                  <span className="absolute -right-1 top-2 size-2.5 rotate-45 rounded-[2px] bg-[#1a1412]" />
                  <p className="relative text-xs sm:text-[12.5px] font-bold text-white tracking-wide leading-tight">
                    {currentTopic.userQuery}
                  </p>
                  <p className="relative text-[9px] font-medium text-stone-400 text-right mt-1 leading-none">
                    {currentTopic.userTime}
                  </p>
                </div>

                {/* User Avatar */}
                <div className="relative size-8 sm:size-9 shrink-0">
                  <div className="flex size-full items-center justify-center rounded-full bg-gradient-to-br from-[#4a3f6b] via-[#6b5a8f] to-[#8f7bb0] text-white shadow-[0_3px_10px_-2px_rgba(74,63,107,0.55)] ring-2 ring-white">
                    <User className="size-4 sm:size-4.5 stroke-[2.2]" />
                  </div>
                  {/* Online status dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-[#22c55e] ring-2 ring-white" />
                </div>
              </div>

              {/* Bubble 2: Astrologer Reply 1 — aligned LEFT */}
              <div className="flex items-start justify-start gap-2 max-w-full">
                {/* Astrology Logo Badge Icon */}
                <div className="relative size-6 sm:size-7 shrink-0 mt-0.5 rounded-full bg-gradient-to-br from-[#ffd700] via-[#f7d028] to-[#e6be00] flex items-center justify-center text-[#1c1304] shadow-xs ring-1 ring-[#d4ab00]">
                  <Sparkles className="size-3 sm:size-3.5 fill-current" />
                </div>

                {/* Yellow Bubble 1 */}
                <div className="relative max-w-[215px] rounded-2xl rounded-tl-xs bg-gradient-to-br from-[#fff4b0] to-[#fbe577] border border-[#f3d85f] px-3.5 py-2 shadow-[0_4px_16px_-4px_rgba(240,200,30,0.4)] text-left">
                  {/* Tail pointing left toward badge */}
                  <span className="absolute -left-1 top-2 size-2.5 rotate-45 rounded-[2px] bg-[#fff4b0] border-l border-b border-[#f3d85f]" />
                  <p className="relative text-xs sm:text-[12px] font-semibold text-[#291d06] leading-snug">
                    {currentTopic.astroReply1}
                  </p>
                  <p className="relative text-[9px] font-bold text-[#8a681d] text-right mt-1 leading-none">
                    {currentTopic.astroReply1Time}
                  </p>
                </div>
              </div>

              {/* Bubble 3: Astrologer Reply 2 — aligned LEFT */}
              <div className="flex items-start justify-start gap-2 max-w-full">
                {/* Astrology Logo Badge Icon */}
                <div className="relative size-6 sm:size-7 shrink-0 mt-0.5 rounded-full bg-gradient-to-br from-[#ffd700] via-[#f7d028] to-[#e6be00] flex items-center justify-center text-[#1c1304] shadow-xs ring-1 ring-[#d4ab00]">
                  <Sparkles className="size-3 sm:size-3.5 fill-current" />
                </div>

                {/* Yellow Bubble 2 */}
                <div className="relative max-w-[215px] rounded-2xl rounded-tl-xs bg-gradient-to-br from-[#fff4b0] to-[#fbe577] border border-[#f3d85f] px-3.5 py-1.5 shadow-[0_4px_14px_-4px_rgba(240,200,30,0.4)] text-left">
                  {/* Tail pointing left toward badge */}
                  <span className="absolute -left-1 top-2 size-2.5 rotate-45 rounded-[2px] bg-[#fff4b0] border-l border-b border-[#f3d85f]" />
                  <p className="relative text-xs sm:text-[12px] font-semibold text-[#291d06] leading-tight">
                    {currentTopic.astroReply2}
                  </p>
                  <p className="relative text-[9px] font-bold text-[#8a681d] text-right mt-0.5 leading-none">
                    {currentTopic.astroReply2Time}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
