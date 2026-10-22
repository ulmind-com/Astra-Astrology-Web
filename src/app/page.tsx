"use client";

import {
  ArrowRight,
  Compass,
  Hash,
  Heart,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
  Users,
  Shield,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { ChineseZodiacModal } from "@/components/astrology/chinese-zodiac-modal";
import { ZodiacChakra } from "@/components/astrology/zodiac-chakra";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui";

const SERVICES = [
  {
    icon: Compass,
    title: "Kundli & Birth Chart",
    body: "Your planetary positions, dasha periods and what they point to — read by seasoned practitioners.",
    accent: "brand",
  },
  {
    icon: Heart,
    title: "Matchmaking",
    body: "Guna milan across all eight kootas, with the doshas read properly and explained clearly.",
    accent: "gold",
  },
  {
    icon: Hash,
    title: "Numerology",
    body: "Mulank, bhagyank, lucky numbers, and what your name adds up to in your life path.",
    accent: "brand",
  },
  {
    icon: Sparkles,
    title: "Vastu Shastra",
    body: "Room by room, on the sixteen-direction compass — bringing alignment to your spaces.",
    accent: "gold",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Tell us when you were born",
    body: "Date, time and place. Saved once, used by every reading that follows.",
    icon: Star,
  },
  {
    num: "02",
    title: "Pick an astrologer",
    body: "Filter by skill, language and experience. See who is online right now.",
    icon: Users,
  },
  {
    num: "03",
    title: "Chat or call",
    body: "Ask what is actually on your mind. Pay only for the minutes you use.",
    icon: MessageCircle,
  },
];

const TRUST_STATS = [
  { value: "500+", label: "Verified astrologers" },
  { value: "50K+", label: "Consultations completed" },
  { value: "4.9★", label: "Average rating" },
];

/* ─── Celestial Line-Art Icons for Hero Cards ─── */
function ZodiacStarIcon({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" className={className}>
      <circle cx="20" cy="20" r="18" strokeWidth="1.5" />
      <polygon points="20,6 32,27 8,27" strokeWidth="1.2" />
      <polygon points="20,34 32,13 8,13" strokeWidth="1.2" />
      <circle cx="20" cy="20" r="4" strokeWidth="1" />
      <circle cx="20" cy="20" r="1.5" fill="currentColor" />
    </svg>
  );
}

function YinYangIcon({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" className={className}>
      <circle cx="20" cy="20" r="18" strokeWidth="1.5" />
      <path
        d="M20,2 A18,18 0 0,1 20,38 A9,9 0 0,1 20,20 A9,9 0 0,0 20,2 Z"
        fill="currentColor"
        opacity="0.25"
      />
      <path
        d="M20,2 A9,9 0 0,1 20,20 A9,9 0 0,0 20,38"
        strokeWidth="1.5"
      />
      <circle cx="20" cy="11" r="2.5" fill="currentColor" />
      <circle cx="20" cy="29" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function SaturnPlanetIcon({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" className={className}>
      <circle cx="20" cy="20" r="18" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="7.5" strokeWidth="1.4" />
      <ellipse
        cx="20"
        cy="20"
        rx="15"
        ry="5"
        strokeWidth="1.4"
        transform="rotate(-25 20 20)"
      />
    </svg>
  );
}

function AstrologicalHouseIcon({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" className={className}>
      <circle cx="20" cy="20" r="18" strokeWidth="1.5" />
      <path
        d="M20 9L9 18V31H31V18L20 9Z"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M16 31V22H24V31" strokeWidth="1.3" />
      <path d="M20 13V16" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export default function HomePage() {
  const [isChineseModalOpen, setIsChineseModalOpen] = React.useState(false);

  return (
    <>
      <SiteHeader />

      <main>
        {/* ─────────────────────────────────────────── HERO (HOROSCOPE CHAKRA LAYOUT) */}
        <section className="relative overflow-hidden bg-[#fffaf5] border-b border-[#ebd7c8]/60 pt-6 pb-12 sm:pt-10 sm:pb-16 lg:py-16">
          {/* Subtle Celestial Background Watermarks */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-20" aria-hidden>
            {/* Top-left smiling celestial sun */}
            <svg
              className="absolute -top-6 -left-6 size-36 text-[#b06d4e]"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="50" cy="50" r="22" strokeWidth="1.2" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="16" strokeWidth="1" />
              <path d="M50 8V20M50 80V92M8 50H20M80 50H92M20 20L29 29M71 71L80 80M20 80L29 71M71 29L80 20" strokeWidth="1" />
            </svg>
            {/* Floating stars & sparkles */}
            <span className="absolute left-[8%] top-[45%] text-[#b06d4e] text-2xl font-serif">✦</span>
            <span className="absolute left-[38%] top-[15%] text-[#b06d4e] text-lg font-serif">✧</span>
            <span className="absolute left-[28%] bottom-[12%] text-[#b06d4e] text-xl font-serif">✦</span>
            <span className="absolute right-[12%] top-[8%] text-[#b06d4e] text-2xl font-serif">✦</span>
            <span className="absolute right-[45%] bottom-[8%] text-[#b06d4e] text-lg font-serif">✧</span>
            {/* Soft decorative background tint */}
            <div className="absolute -top-40 right-[-10%] size-[600px] rounded-full bg-gradient-to-bl from-[#faecd9]/40 via-[#fcf1e5]/20 to-transparent blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
              
              {/* LEFT COLUMN: Typography & 4 Feature Cards */}
              <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
                
                {/* 1. Explore the Horoscope Eyebrow */}
                <div className="inline-flex items-center gap-2 text-[#b06d4e]">
                  <span className="text-xs sm:text-sm font-serif italic tracking-wide font-medium">
                    Explore the Horoscope
                  </span>
                  <div className="flex items-center gap-1.5 text-[#b06d4e]">
                    <span className="h-px w-12 sm:w-20 bg-gradient-to-r from-[#b06d4e] to-transparent" />
                    <span className="text-[9px] -rotate-45">◆</span>
                  </div>
                </div>

                {/* 2. Main Title: WELCOME TO THE WORLD OF ASTROLOGY */}
                <h1 className="mt-3 sm:mt-5 text-3xl sm:text-5xl xl:text-[3.75rem] font-black leading-[1.08] tracking-tight text-[#4D4664]">
                  WELCOME TO THE<br />
                  <span>WORLD OF </span>
                  <span className="relative inline-block font-cinzel-decorative font-bold text-stroke-terracotta tracking-wider">
                    ASTROLOGY
                    {/* Celestial Sparkle Badge */}
                    <span className="absolute -top-1 -right-6 sm:-right-8 text-[#b06d4e] text-xl sm:text-3xl select-none animate-pulse">
                      ✦
                    </span>
                  </span>
                </h1>

                {/* 3. Subtitle Paragraph */}
                <p className="mt-4 sm:mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-[#555062] font-normal">
                  Learn about astrology, zodiac signs, retrogrades, and more! Your world becomes clear once you understand how the universe influences it.
                </p>

                {/* 4. 2x2 Feature Cards Grid */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 max-w-xl">
                  
                  {/* Card 1: Zodiac Signs */}
                  <Link
                    href="/rashi-calculator"
                    className="group relative flex items-center gap-3.5 rounded-2xl border border-[#e5cebd] bg-[#fbf1e7]/90 hover:bg-[#faebd9] p-3.5 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_-6px_rgba(176,109,78,0.22)]"
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#d6b7a2] bg-[#fdf5ed] text-[#b06d4e] group-hover:scale-105 transition-transform duration-300">
                      <ZodiacStarIcon />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm sm:text-base text-[#4D4664] group-hover:text-[#b06d4e] transition-colors">
                        Zodiac Signs
                      </h3>
                      <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#b06d4e]">
                        READ MORE <span className="transition-transform duration-200 group-hover:translate-x-1">───────▶</span>
                      </span>
                    </div>
                  </Link>

                  {/* Card 2: Chinese Signs (Interactive Modal) */}
                  <button
                    type="button"
                    onClick={() => setIsChineseModalOpen(true)}
                    className="group relative flex items-center gap-3.5 rounded-2xl border border-[#e5cebd] bg-[#fbf1e7]/90 hover:bg-[#faebd9] p-3.5 sm:p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_-6px_rgba(176,109,78,0.22)]"
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#d6b7a2] bg-[#fdf5ed] text-[#b06d4e] group-hover:scale-105 transition-transform duration-300">
                      <YinYangIcon />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm sm:text-base text-[#4D4664] group-hover:text-[#b06d4e] transition-colors">
                        Chinese Signs
                      </h3>
                      <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#b06d4e]">
                        READ MORE <span className="transition-transform duration-200 group-hover:translate-x-1">───────▶</span>
                      </span>
                    </div>
                  </button>

                  {/* Card 3: Planets */}
                  <Link
                    href="/kundli"
                    className="group relative flex items-center gap-3.5 rounded-2xl border border-[#e5cebd] bg-[#fbf1e7]/90 hover:bg-[#faebd9] p-3.5 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_-6px_rgba(176,109,78,0.22)]"
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#d6b7a2] bg-[#fdf5ed] text-[#b06d4e] group-hover:scale-105 transition-transform duration-300">
                      <SaturnPlanetIcon />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm sm:text-base text-[#4D4664] group-hover:text-[#b06d4e] transition-colors">
                        Planets
                      </h3>
                      <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#b06d4e]">
                        READ MORE <span className="transition-transform duration-200 group-hover:translate-x-1">───────▶</span>
                      </span>
                    </div>
                  </Link>

                  {/* Card 4: Houses */}
                  <Link
                    href="/kp-calculator"
                    className="group relative flex items-center gap-3.5 rounded-2xl border border-[#e5cebd] bg-[#fbf1e7]/90 hover:bg-[#faebd9] p-3.5 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_-6px_rgba(176,109,78,0.22)]"
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#d6b7a2] bg-[#fdf5ed] text-[#b06d4e] group-hover:scale-105 transition-transform duration-300">
                      <AstrologicalHouseIcon />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm sm:text-base text-[#4D4664] group-hover:text-[#b06d4e] transition-colors">
                        Houses
                      </h3>
                      <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#b06d4e]">
                        READ MORE <span className="transition-transform duration-200 group-hover:translate-x-1">───────▶</span>
                      </span>
                    </div>
                  </Link>

                </div>

                {/* Quick Astrologer Consultation Row */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href="/astrologers">
                    <Button size="lg" className="h-11 sm:h-12 px-6 text-sm sm:text-base font-semibold shadow-glow">
                      Find an Astrologer
                      <ArrowRight className="size-4 ml-1 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Button>
                  </Link>
                  <Link href="/kundli-matching">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-11 sm:h-12 px-6 text-sm sm:text-base font-semibold border-[#d6b7a2] text-[#4D4664] hover:bg-[#faebd9]"
                    >
                      Kundli Matching
                    </Button>
                  </Link>
                </div>

              </div>

              {/* RIGHT COLUMN: Interactive Rotating Celestial Zodiac Chakra */}
              <div className="lg:col-span-6 xl:col-span-6 flex items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-[500px] sm:max-w-[580px] lg:max-w-[660px] xl:max-w-[740px] 2xl:max-w-[800px] flex items-center justify-center">
                  <ZodiacChakra speedSeconds={60} />
                </div>
              </div>

            </div>

            {/* Trust Stats Strip: Seamlessly bridging hero to services */}
            <div className="mt-12 lg:mt-16 pt-8 border-t border-[#ebd7c8]/50">
              <dl className="grid grid-cols-3 gap-2 sm:gap-6 max-w-3xl mx-auto">
                {TRUST_STATS.map(({ value, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center p-3 sm:p-4 text-center rounded-2xl bg-[#fcf5ed]/70 border border-[#ebd7c8]/60 transition-all hover:bg-[#faebd9]"
                  >
                    <dt className="font-cinzel text-xl sm:text-3xl font-bold text-[#b06d4e]">
                      {value}
                    </dt>
                    <dd className="mt-1 text-[10px] sm:text-xs font-semibold text-[#555062] tracking-wide">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

          </div>
        </section>

        {/* ─────────────────────────────────────────── CHINESE ZODIAC MODAL */}
        <ChineseZodiacModal
          isOpen={isChineseModalOpen}
          onClose={() => setIsChineseModalOpen(false)}
        />

        {/* ─────────────────────────────────────────── SERVICES */}
        <section id="services" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:py-24">
          <div className="mb-10 sm:mb-12 text-center">
            <span className="inline-block rounded-full bg-brand-500/12 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-700 border border-brand-500/30 mb-3 sm:mb-4">
              What we offer
            </span>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-4xl">
              What you can ask about
            </h2>
            <p className="mt-2.5 sm:mt-3 mx-auto max-w-lg text-sm sm:text-base text-muted-foreground leading-relaxed">
              Traditional methods, interpreted by people who practise them every day.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service, i) => (
              <div
                key={service.title}
                className="card-surface group relative flex flex-col items-center p-6 sm:p-7 text-center hover:card-glow hover:-translate-y-1.5 transition-all duration-300"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Soft background glow on hover */}
                <div className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-b from-brand-500/5 to-transparent" />

                <span
                  className={`medallion mx-auto flex size-14 sm:size-16 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow ${
                    service.accent === "gold" ? "medallion-gold" : ""
                  }`}
                >
                  <service.icon className="size-6 sm:size-7 text-ink-900" />
                </span>
                <h3 className="mt-4 sm:mt-5 font-display text-base font-semibold tracking-tight text-foreground">
                  {service.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {service.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─────────────────────────────────────────── HOW IT WORKS */}
        <section id="how-it-works" className="scroll-mt-20 px-4 py-2 sm:py-4">
          <div className="card-surface mx-auto max-w-6xl overflow-hidden">
            {/* Top section: heading */}
            <div className="bg-cosmos p-6 sm:px-12 sm:py-10">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="inline-block rounded-full bg-brand-200/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-700 border border-brand-500/30 mb-2 sm:mb-3">
                    How it works
                  </span>
                  <h2 className="font-display text-2xl font-bold tracking-tight sm:text-4xl">
                    Three steps to clarity
                  </h2>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-0">
                  <span className="inline-flex items-center gap-1.5 sm:gap-2">
                    <MessageCircle className="size-3.5 sm:size-4 text-brand-700" /> Chat
                  </span>
                  <span className="inline-flex items-center gap-1.5 sm:gap-2">
                    <Phone className="size-3.5 sm:size-4 text-brand-700" /> Call
                  </span>
                  <span className="inline-flex items-center gap-1.5 sm:gap-2">
                    <Star className="size-3.5 fill-gold-300 text-gold-600" /> Rated
                  </span>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="p-6 sm:px-12 sm:py-10">
              <ol className="grid gap-6 sm:gap-8 md:grid-cols-3">
                {STEPS.map((step, index) => (
                  <li key={step.title} className="relative flex flex-col gap-4">
                    {/* Connector line for desktop */}
                    {index < STEPS.length - 1 && (
                      <div className="hidden md:block absolute left-[calc(50%+2.5rem)] top-5 h-px w-[calc(100%_-_2.5rem)] bg-gradient-to-r from-brand-400/40 to-transparent" />
                    )}
                    <div className="flex items-start gap-3.5 sm:gap-4">
                      <span className="medallion flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-xl font-display text-base sm:text-lg font-bold text-ink-900">
                        {step.num}
                      </span>
                      <div className="pt-0.5 sm:pt-1">
                        <h3 className="font-semibold text-sm sm:text-base tracking-tight text-foreground">{step.title}</h3>
                        <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────── WHY US */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:py-24">
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Verified",
                body: "Every astrologer is reviewed and approved before they appear in our directory.",
                tone: "brand",
              },
              {
                icon: Zap,
                title: "Per minute billing",
                body: "Pay only for what you use. No hidden fees, no packages forced on you.",
                tone: "gold",
              },
              {
                icon: Star,
                title: "Rated after each session",
                body: "Honest reviews keep quality high and help you find the right fit fast.",
                tone: "brand",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="card-surface group flex flex-col gap-3.5 sm:gap-4 p-5 sm:p-7 hover:card-glow hover:-translate-y-1 transition-all duration-300"
              >
                <span
                  className={`medallion flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-xl ${
                    item.tone === "gold" ? "medallion-gold" : ""
                  }`}
                >
                  <item.icon className="size-4.5 sm:size-5 text-ink-900" />
                </span>
                <div>
                  <h3 className="font-display font-semibold text-sm sm:text-base tracking-tight text-foreground">{item.title}</h3>
                  <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─────────────────────────────────────────── CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-12 sm:pb-24">
          <div className="bg-stars card-glow relative overflow-hidden rounded-2xl bg-cosmos p-6 py-12 text-center sm:px-16 sm:py-20">
            {/* decorative orbs */}
            <span className="orb pointer-events-none absolute -left-16 -top-16 size-48 opacity-35 blur-[2px]" aria-hidden />
            <span className="orb-gold orb pointer-events-none absolute -right-10 -bottom-10 size-40 opacity-25 blur-[3px]" aria-hidden />

            <div className="relative">
              <span className="inline-block rounded-full bg-brand-200/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-700 border border-brand-500/30 mb-4 sm:mb-6">
                Get started today
              </span>
              <h2 className="glow-text font-display text-2xl font-bold tracking-tight text-brand-950 sm:text-5xl">
                Ready when you are
              </h2>
              <p className="mx-auto mt-4 max-w-md text-ink-500 leading-relaxed">
                Create an account, add your birth details once, and every reading after
                that is a click away.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link href="/register">
                  <Button size="lg" className="group w-full sm:w-auto">
                    Get started — it's free
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Button>
                </Link>
                <Link href="/astrologers">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-brand-300/30 text-ink-900 hover:bg-brand-100 sm:w-auto"
                  >
                    Browse astrologers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
