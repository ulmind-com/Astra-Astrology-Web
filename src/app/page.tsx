"use client";

import {
  ArrowRight,
  CheckCircle2,
  Lock,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { ChineseZodiacModal } from "@/components/astrology/chinese-zodiac-modal";
import { AstrologyPredictionZodiac } from "@/components/home/astrology-prediction-zodiac";
import { AppDownloadSection } from "@/components/home/app-download-section";
import { AstroyogiHeader } from "@/components/home/astroyogi-header";
import { CelebrityVideosSection } from "@/components/home/celebrity-videos-section";
import { FirstChatFreeModal } from "@/components/home/first-chat-free-modal";
import { FreeAstrologyReadings } from "@/components/home/free-astrology-readings";
import { HeroAstroyogi } from "@/components/home/hero-astroyogi";
import { OurServicesSection } from "@/components/home/our-services-section";
import { TopAstrologersSection } from "@/components/home/top-astrologers-section";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui";
import { HOME_STEPS_AND_TRUST_TRANSLATIONS } from "@/lib/home-translations";
import { useLanguage } from "@/providers/language-provider";

const STEPS = [
  {
    num: "01",
    title: "Tell us when you were born",
    body: "Date, time, and birthplace. Saved once, used automatically by every calculation.",
  },
  {
    num: "02",
    title: "Pick your verified astrologer",
    body: "Filter by Vedic, Tarot, Numerology, or language. See real-time online status and genuine reviews.",
  },
  {
    num: "03",
    title: "Instant chat or call",
    body: "Ask what is on your heart in 100% private consultation. Pay only for the minutes you use.",
  },
];

const TRUST_FEATURES = [
  {
    icon: Shield,
    title: "100% Verified Astrologers",
    body: "Every single astrologer undergoes rigorous 4-stage background vetting and expertise test.",
  },
  {
    icon: Lock,
    title: "Completely Private & Confidential",
    body: "End-to-end encrypted chats and phone calls. Your birth data and questions remain strictly secure.",
  },
  {
    icon: Zap,
    title: "Per-Minute Transparent Billing",
    body: "No hidden charges, no forced bundles. Clear rates in Rupees per minute with money-back guarantee.",
  },
  {
    icon: Star,
    title: "Rated 4.9/5 by 500,000+ Users",
    body: "Authentic unedited post-consultation reviews help you connect with the right guide instantly.",
  },
];

export default function HomePage() {
  const { language } = useLanguage();
  const [isChineseModalOpen, setIsChineseModalOpen] = React.useState(false);
  const t = HOME_STEPS_AND_TRUST_TRANSLATIONS[language] || HOME_STEPS_AND_TRUST_TRANSLATIONS.en;

  const steps = React.useMemo(() => {
    return t.steps.map((st, i) => ({
      num: st.num,
      title: st.title,
      body: st.body,
    }));
  }, [t]);

  const trustFeatures = React.useMemo(() => {
    const icons = [Shield, Lock, Zap, Star];
    return t.trust.map((item, i) => ({
      icon: icons[i] || Shield,
      title: item.title,
      body: item.body,
    }));
  }, [t]);

  return (
    <>
      {/* Main Astroyogi Top Header & Category Navigation */}
      <AstroyogiHeader />

      <main className="min-h-screen bg-white">
        {/* 1. HERO BANNER & QUICK ACTION TILES */}
        <HeroAstroyogi />

        {/* 2. TOP ONLINE ASTROLOGERS */}
        <TopAstrologersSection />

        {/* 4. TODAY'S ASTROLOGY PREDICTION (12 ZODIAC SIGNS) */}
        <AstrologyPredictionZodiac />

        {/* 5. FREE ASTROLOGY READINGS (12 RICH 3D TILES) */}
        <FreeAstrologyReadings />

        {/* 5b. OUR SERVICES (horizontal premium rail) */}
        <OurServicesSection />

        {/* 7. CELEBRITY VIDEOS */}
        <CelebrityVideosSection />

        {/* 8. HOW IT WORKS: 3 STEPS TO CLARITY */}
        <section className="relative overflow-hidden bg-transparent py-12 sm:py-16 border-b border-stone-200/80">
          {/* Slowly rotating yellow celestial ring above the section */}
          <div className="pointer-events-none absolute left-1/2 -top-20 sm:-top-24 -translate-x-1/2 z-0">
            <div className="animate-celestial-spin size-48 sm:size-64 rounded-full border-2 border-dashed border-[#facc15]/35">
              <div className="absolute inset-4 rounded-full border border-[#facc15]/25" />
              <span className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#facc15] shadow-[0_0_12px_4px_rgba(250,204,21,0.6)]" />
              <span className="absolute left-1/2 bottom-0 size-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#fde047] shadow-[0_0_8px_3px_rgba(253,224,71,0.5)]" />
            </div>
          </div>

          <div className="relative z-10 mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-block rounded-full bg-brand-200/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#8b5e0a] border border-brand-400/40 mb-3">
                {language === "bn" ? "সহজ ও নির্ভরযোগ্য" : language === "hi" ? "सरल एवं सहज" : "Simple & Seamless"}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1a1208] tracking-tight">
                {language === "bn"
                  ? "স্পষ্টতা ও দিকনির্দেশনার ৩টি সহজ ধাপ"
                  : language === "hi"
                  ? "मार्गदर्शन के 3 सरल चरण"
                  : "Three Steps to Clarity"}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#6b5f4d]">
                {language === "bn"
                  ? "মাত্র ২ মিনিটে জীবন, প্রেম এবং ভবিষ্যতের নির্ভুল দিকনির্দেশনা পান।"
                  : language === "hi"
                  ? "मात्र 2 मिनट में अपने जीवन, प्रेम एवं भविष्य का मार्गदर्शन प्राप्त करें।"
                  : "Get instant guidance on your life, love, and destiny in under 2 minutes."}
              </p>
            </div>

            <div className="flex flex-col md:flex-row md:items-stretch gap-3 md:gap-0">
              {steps.map((step, idx) => (
                <React.Fragment key={step.num}>
                  <div className="group relative flex flex-1 flex-col overflow-hidden rounded-[18px] sm:rounded-[26px] border border-stone-200 bg-white p-4 sm:p-7 shadow-[0_8px_26px_-14px_rgba(26,18,8,0.1)] transition-all duration-300 hover:-translate-y-2 hover:border-brand-400 hover:shadow-lg">
                    {/* Giant watermark number */}
                    <span className="pointer-events-none absolute -right-1 -top-3 sm:-right-2 sm:-top-4 font-cinzel text-[64px] sm:text-[96px] font-black leading-none text-[#fcef9a]/40 select-none">
                      {step.num}
                    </span>

                    <div className="relative">
                      <div className="flex items-center justify-between mb-3 sm:mb-5">
                        {/* Dark number badge with neon ring */}
                        <span className="relative flex size-10 sm:size-12 items-center justify-center rounded-xl sm:rounded-2xl bg-[#1a1412] font-cinzel text-base sm:text-lg font-black text-[#fde047] ring-1 ring-[#facc15]/60 shadow-[0_0_18px_-2px_rgba(250,204,21,0.7)]">
                          {step.num}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-bold text-[#a07a16] uppercase tracking-[0.15em]">
                          {language === "bn" ? `ধাপ ${idx + 1}` : language === "hi" ? `चरण ${idx + 1}` : `Step ${idx + 1}`}
                        </span>
                      </div>

                      <h3 className="text-[15px] sm:text-lg font-extrabold tracking-tight text-[#1a1208]">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-[#6b5f4d] leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                  </div>

                  {/* Neon yellow connector arrow between cards */}
                  {idx < steps.length - 1 && (
                    <div className="flex shrink-0 items-center justify-center md:px-3 lg:px-4 py-1 md:py-0">
                      <ArrowRight
                        className={`size-7 sm:size-8 text-[#facc15] rotate-90 md:rotate-0 ${
                          idx === 0 ? "animate-neon-arrow" : "animate-neon-arrow-2"
                        }`}
                        strokeWidth={2.6}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* 9. WHY TRUST DIVINLINK */}
        <section className="bg-transparent py-12 sm:py-16 border-b border-stone-200/80">
          <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a1208] tracking-tight">
                {language === "bn"
                  ? "কেন লক্ষ লক্ষ মানুষ ডিভিনলিংক-এ আস্থা রাখেন"
                  : language === "hi"
                  ? "लाखों लोग डिविनलिंक पर क्यों भरोसा करते हैं"
                  : "Why Millions Trust DivinLink"}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#6b5f4d]">
                {language === "bn"
                  ? "শাস্ত্রজ্ঞ বৈদিক পন্ডিত, স্বচ্ছ মূল্য এবং ১০০% নির্ভরযোগ্য গোপনীয়তা।"
                  : language === "hi"
                  ? "सत्यापित वैदिक विद्वान, पारदर्शी शुल्क और पूर्ण गोपनीयता की गारंटी।"
                  : "Rigorously vetted Vedic scholars, transparent pricing, and complete privacy guaranteed."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {trustFeatures.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-400 hover:shadow-md"
                  >
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-300 text-ink-900 shadow-sm mb-4">
                      <Icon className="size-6 text-[#8b5e0a]" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-[#1a1208]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-[#6b5f4d] leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 9b. DOWNLOAD THE DIVINLINK APP */}
        <AppDownloadSection />

        {/* 10. BOTTOM CALL TO ACTION BANNER */}
        <section className="bg-transparent py-12 sm:py-16">
          <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-gradient-to-br from-stone-50 via-white to-amber-50/40 p-8 sm:p-12 text-center shadow-lg">
              <div className="relative z-10 max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#8b5e0a] shadow-xs mb-4">
                  <Sparkles className="size-3.5" />{" "}
                  {language === "bn"
                    ? "আত্মবিশ্বাসের সাথে শুরু করুন"
                    : language === "hi"
                    ? "विश्वास के साथ शुरुआत करें"
                    : "Start With Confidence"}
                </span>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1a1208] tracking-tight">
                  {language === "bn"
                    ? "অভিজ্ঞ জ্যোতিষীর সাথে পরামর্শ করতে প্রস্তুত?"
                    : language === "hi"
                    ? "विशेषज्ञ से परामर्श के लिए तैयार हैं?"
                    : "Ready to Consult with an Expert?"}
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[#524436] leading-relaxed">
                  {language === "bn"
                    ? "৫ লাখেরও বেশি মানুষের সাথে যুক্ত হন যারা প্রেম, ক্যারিয়ার, বিয়ে ও স্বাস্থ্যে স্পষ্টতা পেয়েছেন। মাত্র ₹১২/মিনিট থেকে শুরু।"
                    : language === "hi"
                    ? "5 लाख से अधिक लोगों से जुड़ें जिन्होंने प्रेम, करियर और विवाह में मार्गदर्शन पाया। मात्र ₹12/मिनट से शुरू।"
                    : "Join over 500,000 seekers who found clarity in love, career, marriage, and health. First consultation starts at just ₹12/Min."}
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
                  <Link href="/astrologers">
                    <button
                      type="button"
                      className="rounded-full bg-[#fcd404] hover:bg-[#e6be00] text-[#1c1304] font-extrabold text-sm sm:text-base px-8 py-3.5 shadow-md transition-transform hover:scale-105 flex items-center gap-2 border border-[#d9af00]"
                    >
                      <span>
                        {language === "bn"
                          ? "ফ্রি পরামর্শ নিন"
                          : language === "hi"
                          ? "मुफ़्त परामर्श लें"
                          : "Consult for FREE"}
                      </span>
                      <ArrowRight className="size-4" />
                    </button>
                  </Link>

                  <Link href="/kundli">
                    <button
                      type="button"
                      className="rounded-full bg-white/90 hover:bg-white text-[#1a1208] font-bold text-sm sm:text-base px-7 py-3.5 border border-[#eadf9a] shadow-xs transition-colors"
                    >
                      {language === "bn"
                        ? "ফ্রি কুণ্ডলী তৈরি করুন"
                        : language === "hi"
                        ? "मुफ़्त कुंडली बनाएं"
                        : "Generate Free Kundli"}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chinese Zodiac Modal */}
        <ChineseZodiacModal
          isOpen={isChineseModalOpen}
          onClose={() => setIsChineseModalOpen(false)}
        />

        {/* First Chat Free Welcome Pop-up */}
        <FirstChatFreeModal />
      </main>

      <SiteFooter />
    </>
  );
}
