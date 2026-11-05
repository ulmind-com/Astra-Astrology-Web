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
import { AstroyogiHeader } from "@/components/home/astroyogi-header";
import { CelebrityVideosSection } from "@/components/home/celebrity-videos-section";
import { ConsultRightAstrologer } from "@/components/home/consult-right-astrologer";
import { FreeAstrologyReadings } from "@/components/home/free-astrology-readings";
import { FreeLiveExperts } from "@/components/home/free-live-experts";
import { HeroAstroyogi } from "@/components/home/hero-astroyogi";
import { TopAstrologersSection } from "@/components/home/top-astrologers-section";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui";

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
  const [isChineseModalOpen, setIsChineseModalOpen] = React.useState(false);

  return (
    <>
      {/* Main Astroyogi Top Header & Category Navigation */}
      <AstroyogiHeader />

      <main className="min-h-screen bg-white">
        {/* 1. HERO BANNER & QUICK ACTION TILES */}
        <HeroAstroyogi />

        {/* 2. TOP ONLINE ASTROLOGERS */}
        <TopAstrologersSection />

        {/* 3. FREE LIVE EXPERTS */}
        <FreeLiveExperts />

        {/* 4. TODAY'S ASTROLOGY PREDICTION (12 ZODIAC SIGNS) */}
        <AstrologyPredictionZodiac />

        {/* 5. FREE ASTROLOGY READINGS (12 RICH 3D TILES) */}
        <FreeAstrologyReadings />

        {/* 6. CONSULT THE RIGHT ASTROLOGER FOR YOU */}
        <ConsultRightAstrologer />

        {/* 7. CELEBRITY VIDEOS */}
        <CelebrityVideosSection />

        {/* 8. HOW IT WORKS: 3 STEPS TO CLARITY */}
        <section className="bg-[#fffdf5] py-12 sm:py-16 border-b border-[#f2e9b0]/60">
          <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-block rounded-full bg-brand-200/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#8b5e0a] border border-brand-400/40 mb-3">
                Simple & Seamless
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1a1208] tracking-tight">
                Three Steps to Clarity
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#6b5f4d]">
                Get instant guidance on your life, love, and destiny in under 2 minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {STEPS.map((step, idx) => (
                <div
                  key={step.num}
                  className="relative rounded-2xl border border-[#eadf9a] bg-white p-6 sm:p-7 shadow-[0_4px_16px_-4px_rgba(26,18,8,0.04)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-brand-300 font-cinzel text-lg font-black text-ink-900 shadow-sm">
                        {step.num}
                      </span>
                      <span className="text-xs font-bold text-[#8b5e0a] uppercase tracking-wider">
                        Step {idx + 1}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#1a1208]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-[#6b5f4d] leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. WHY TRUST DIVINLINK */}
        <section className="bg-white py-12 sm:py-16 border-b border-[#f2e9b0]/60">
          <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a1208] tracking-tight">
                Why Millions Trust DivinLink
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#6b5f4d]">
                Rigorously vetted Vedic scholars, transparent pricing, and complete privacy guaranteed.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {TRUST_FEATURES.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-[#eadf9a] bg-[#fffdf5] p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-400 hover:shadow-md"
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

        {/* 10. BOTTOM CALL TO ACTION BANNER */}
        <section className="bg-[#fffdf7] py-12 sm:py-16">
          <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-[#ebd881] bg-gradient-to-r from-[#fff9e6] via-[#fff3cc] to-[#ffecaa] p-8 sm:p-12 text-center shadow-[0_16px_40px_-16px_rgba(240,210,80,0.6)]">
              <div className="relative z-10 max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#8b5e0a] shadow-xs mb-4">
                  <Sparkles className="size-3.5" /> Start With Confidence
                </span>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1a1208] tracking-tight">
                  Ready to Consult with an Expert?
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[#524436] leading-relaxed">
                  Join over 500,000 seekers who found clarity in love, career, marriage, and health. First consultation starts at just ₹12/Min.
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
                  <Link href="/astrologers">
                    <button
                      type="button"
                      className="rounded-full bg-[#fcd404] hover:bg-[#e6be00] text-[#1c1304] font-extrabold text-sm sm:text-base px-8 py-3.5 shadow-md transition-transform hover:scale-105 flex items-center gap-2 border border-[#d9af00]"
                    >
                      <span>Consult for FREE</span>
                      <ArrowRight className="size-4" />
                    </button>
                  </Link>

                  <Link href="/kundli">
                    <button
                      type="button"
                      className="rounded-full bg-white/90 hover:bg-white text-[#1a1208] font-bold text-sm sm:text-base px-7 py-3.5 border border-[#eadf9a] shadow-xs transition-colors"
                    >
                      Generate Free Kundli
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
      </main>

      <SiteFooter />
    </>
  );
}
