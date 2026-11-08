"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Compass,
  Heart,
  MessageSquare,
  Phone,
  Sparkles,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { cmsApi, type HeroSlide } from "@/lib/api";
import { HERO_SLIDES_TRANSLATIONS } from "@/lib/home-translations";
import { useLanguage } from "@/providers/language-provider";

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    title: "Enjoy your relationship",
    subtitle: "don't stress over it",
    description: "Talk to India's top Vedic astrologers & tarot readers for instant relationship clarity.",
    cta_text: "Consult for FREE",
    cta_link: "/astrologers",
    badge_text: "India's Best Astrology Platform",
    badge_rating: "4.9/5",
    image_url: "/images/hero/hero-couple-exploring.png",
  },
  {
    id: "slide-2",
    title: "Know your destiny & future",
    subtitle: "with free Vedic Janam Kundli",
    description: "Accurate planetary calculations, dosha analysis, and personalized remedies by Vedic experts.",
    cta_text: "Generate Free Kundli",
    cta_link: "/kundli",
    badge_text: "100% Free & Accurate Kundli",
    badge_rating: "500k+ Created",
    image_url: "/images/hero/hero-parchment-kundli.png",
  },
  {
    id: "slide-3",
    title: "Check marriage compatibility",
    subtitle: "find your perfect soulmate",
    description: "Detailed 36-Gun Milan, Manglik Dosha report & life-long harmony analysis for bride & groom.",
    cta_text: "Match Kundli Now",
    cta_link: "/kundli-matching",
    badge_text: "Trusted Matchmaking",
    badge_rating: "36 Gunas Score",
    image_url: "/images/hero/hero-indian-wedding.png",
  },
  {
    id: "slide-4",
    title: "Unlock secrets in your palm",
    subtitle: "with modern 3D AI biometrics",
    description: "Explore heart, head & life lines with interactive real-time 3D hand visualization.",
    cta_text: "Start Palm Reading",
    cta_link: "/palm-reading",
    badge_text: "Next-Gen 3D Biometrics",
    badge_rating: "99% Precision",
    image_url: "/images/hero/hero-mint-mandala.png",
  },
  {
    id: "slide-5",
    title: "Discover your true potential",
    subtitle: "via 78 Arcana Tarot guidance",
    description: "Daily forecasts, love spreads & career clarity synchronized with planetary dasha cycles.",
    cta_text: "Get Tarot Reading",
    cta_link: "/tarot",
    badge_text: "Sacred Arcana Cards",
    badge_rating: "78 Cards",
    image_url: "/images/hero/hero-mystical-tarot.png",
  },
  {
    id: "slide-6",
    title: "Harmonize your living space",
    subtitle: "attract wealth, peace & health",
    description: "Interactive 16-zone Vastu directional compass and elemental balance remedies for home & office.",
    cta_text: "Explore Vastu Guide",
    cta_link: "/vastu",
    badge_text: "Ancient Vedic Architecture",
    badge_rating: "16 Zones",
    image_url: "/images/hero/hero-golden-compass.png",
  },
];

// Portrait hero art for mobile (couple/scene at the bottom, cream space up top
// for the overlaid headline). Keyed by slide id; falls back to the landscape art.
const MOBILE_HERO_IMAGES: Record<string, string> = {
  "slide-1": "/images/hero/mobile/hero-couple-exploring.png",
  "slide-2": "/images/hero/mobile/hero-parchment-kundli.png",
  "slide-3": "/images/hero/mobile/hero-indian-wedding.png",
  "slide-4": "/images/hero/mobile/hero-mint-mandala.png",
  "slide-5": "/images/hero/mobile/hero-mystical-tarot.png",
  "slide-6": "/images/hero/mobile/hero-golden-compass.png",
};

const QUICK_ACTIONS = [
  {
    key: "talk",
    title: "Talk",
    subtitle: "Instant Consultation",
    href: "/astrologers",
    icon: Phone,
  },
  {
    key: "love",
    title: "Love",
    subtitle: "Relationship Clarity",
    href: "/kundli-matching",
    icon: Heart,
  },
  {
    key: "chat",
    title: "Chat",
    subtitle: "Private Messaging",
    href: "/astrologers",
    icon: MessageSquare,
  },
  {
    key: "horoscope",
    title: "Horoscope",
    subtitle: "Today's Prediction",
    href: "/daily-horoscope",
    icon: Sparkles,
  },
];

export function HeroAstroyogi() {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Fetch dynamic CMS data
  const { data: cmsData } = useQuery({
    queryKey: ["cms", "homepage"],
    queryFn: cmsApi.getHomepage,
    staleTime: 60_000,
  });

  const slides = useMemo<HeroSlide[]>(() => {
    const loc = HERO_SLIDES_TRANSLATIONS[language] || HERO_SLIDES_TRANSLATIONS.en;
    return DEFAULT_SLIDES.map((slide, idx) => {
      const trans = loc.slides[idx];
      if (!trans) return slide;
      return {
        ...slide,
        title: trans.title,
        subtitle: trans.subtitle,
        description: trans.description,
        cta_text: trans.cta_text,
        badge_text: trans.badge_text,
        badge_rating: trans.badge_rating,
      };
    });
  }, [language]);

  const quickActions = useMemo(() => {
    const loc = HERO_SLIDES_TRANSLATIONS[language] || HERO_SLIDES_TRANSLATIONS.en;
    const keyMap: Record<string, { title: string; subtitle: string } | undefined> = {
      talk: loc.quickActions[0],
      love: loc.quickActions[1],
      chat: loc.quickActions[2],
      horoscope: loc.quickActions[3],
      kundli: loc.quickActions[4],
      ai: loc.quickActions[5],
    };

    return QUICK_ACTIONS.map((action, idx) => {
      const trans = keyMap[action.key] || loc.quickActions[idx];
      return {
        ...action,
        title: trans?.title || action.title,
        subtitle: trans?.subtitle || action.subtitle,
      };
    });
  }, [language]);

  // Autoplay timer — slides every 5 seconds
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  const currentSlide = slides[currentIndex] || DEFAULT_SLIDES[0];

  return (
    <section className="relative overflow-hidden bg-[#0c0a08] pt-6 pb-8 sm:pt-8 sm:pb-12 border-b border-amber-900/35 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.7)]">
      {/* Background radial cosmic glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.08)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_50%,rgba(217,119,6,0.08)_0%,transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_50%,rgba(245,158,11,0.07)_0%,transparent_50%)]" />

      {/* LEFT CELESTIAL: Rotating Golden Zodiac Wheel (InstaAstro-Style) */}
      <div className="pointer-events-none absolute -left-20 sm:-left-16 top-1/2 -translate-y-1/2 z-0 size-[380px] sm:size-[480px] lg:size-[560px] opacity-25 select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/zodiac-wheel-yellow.webp"
          alt=""
          aria-hidden="true"
          className="size-full animate-[spin_110s_linear_infinite] [will-change:transform] motion-reduce:animate-none drop-shadow-[0_0_35px_rgba(245,158,11,0.2)]"
          draggable={false}
        />
      </div>

      {/* RIGHT CELESTIAL: Radiant Golden Sun Mandala & Celestial Rings */}
      <div className="pointer-events-none absolute -right-20 sm:-right-12 top-1/2 -translate-y-1/2 z-0 size-[360px] sm:size-[450px] lg:size-[540px] opacity-25 select-none">
        <svg
          viewBox="0 0 200 200"
          className="size-full animate-[spin_150s_linear_infinite] motion-reduce:animate-none drop-shadow-[0_0_30px_rgba(245,158,11,0.25)]"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1"
        >
          {/* Concentric astrological rings */}
          <circle cx="100" cy="100" r="92" strokeDasharray="3 3" opacity="0.6" />
          <circle cx="100" cy="100" r="76" opacity="0.45" />
          <circle cx="100" cy="100" r="58" strokeDasharray="6 3" opacity="0.75" />
          <circle cx="100" cy="100" r="38" opacity="0.85" fill="rgba(245,158,11,0.06)" />
          {/* 16 Radiant Sun Rays */}
          {Array.from({ length: 16 }).map((_, i) => (
            <line
              key={i}
              x1="100"
              y1="40"
              x2="100"
              y2="12"
              transform={`rotate(${i * 22.5} 100 100)`}
              stroke="#fbbf24"
              strokeWidth={i % 2 === 0 ? "1.6" : "0.9"}
              opacity="0.85"
            />
          ))}
          {/* Central Vedic Sun face motif */}
          <circle cx="92" cy="96" r="2.8" fill="#fbbf24" opacity="0.8" />
          <circle cx="108" cy="96" r="2.8" fill="#fbbf24" opacity="0.8" />
          <path
            d="M 93 107 Q 100 113 107 107"
            stroke="#fbbf24"
            strokeWidth="1.3"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Floating Constellation Stars */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <span className="absolute top-[16%] left-[26%] text-amber-300/40 text-xs animate-pulse">✦</span>
        <span className="absolute top-[76%] left-[20%] text-amber-300/35 text-[11px] animate-pulse [animation-delay:1s]">⋆</span>
        <span className="absolute top-[20%] right-[28%] text-amber-400/45 text-sm animate-pulse [animation-delay:1.5s]">✦</span>
        <span className="absolute top-[70%] right-[22%] text-amber-300/35 text-xs animate-pulse [animation-delay:0.5s]">✧</span>
        <span className="absolute top-[12%] right-[14%] text-amber-200/50 text-[11px] animate-pulse [animation-delay:2s]">⋆</span>
        <span className="absolute top-[82%] left-[42%] text-amber-400/30 text-xs animate-pulse [animation-delay:1.2s]">✦</span>
      </div>

      <div className="relative z-10 mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Main Hero Slider Container with Continuous Horizontal Sliding Track */}
        <div
          className="relative group/slider overflow-hidden rounded-[26px] sm:rounded-3xl shadow-[0_24px_65px_-15px_rgba(0,0,0,0.85)] border border-amber-400/25 bg-[#fffdf5]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Continuous Sliding Horizontal Track */}
          <div
            className="flex w-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                className="relative w-full shrink-0 aspect-[941/1672] sm:aspect-auto sm:min-h-[380px] lg:h-[400px] overflow-hidden"
              >
                {/* 1. Full-Bleed 100% Brightness Background Image */}
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Mobile: portrait card art (scene bottom, cream top for text). */}
                  <Image
                    src={MOBILE_HERO_IMAGES[slide.id ?? ""] ?? slide.image_url}
                    alt={slide.title}
                    fill
                    priority={idx === 0}
                    className="object-cover object-top sm:hidden"
                    sizes="100vw"
                    quality={85}
                  />
                  {/* Desktop: landscape banner. */}
                  <Image
                    src={slide.image_url}
                    alt={slide.title}
                    fill
                    priority={idx === 0}
                    className="hidden object-cover object-center sm:block"
                    sizes="(max-width: 1360px) 100vw, 1360px"
                    quality={90}
                  />
                </div>

                {/* Desktop legibility scrim: cream wash on the left behind the text,
                    fading to transparent so the banner stays visible on the right.
                    Mobile skips it — the portrait art already has a cream top. */}
                <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[#fffdf5] via-[#fffdf5]/70 to-transparent sm:block" />

                {/* 2. Overlaid Interactive Content Layer */}
                <div className="relative z-10 flex flex-col justify-start sm:justify-between h-full p-5 sm:p-10 lg:pl-12 lg:pr-8 sm:min-h-[380px] lg:h-[400px]">
                  {/* Top Bar inside Card: Pill Badge + Slide Counter */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 shadow-xs bg-white/90 border border-[#eadf9a] text-[#1a1208] backdrop-blur-xs">
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ffd700] to-[#e69500] text-[#1a1208] text-[10px] font-black">
                        #1
                      </div>
                      <span className="text-xs sm:text-sm font-bold tracking-wide">
                        {slide.badge_text}
                      </span>
                      {slide.badge_rating && (
                        <div className="flex items-center gap-1 border-l border-[#ebd881] pl-2 ml-1">
                          <Star className="size-3 fill-[#e08c12] text-[#e08c12]" />
                          <span className="text-xs font-bold text-[#8b5e0a]">
                            {slide.badge_rating}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Slide Counter */}
                    <div className="hidden sm:flex items-center gap-1.5 text-xs font-extrabold tracking-wider px-3 py-1 rounded-full bg-white/90 text-[#1a1208]/80 border border-[#eadf9a] backdrop-blur-xs">
                      <span className="text-[#e08c12]">0{idx + 1}</span>
                      <span className="opacity-40">/</span>
                      <span className="opacity-60">0{slides.length}</span>
                    </div>
                  </div>

                  {/* Middle: Headline, Subtitle, Description & Action Button */}
                  <div className="mt-2 sm:my-auto py-1 sm:py-4 max-w-xl lg:max-w-2xl">
                    <Link href={slide.cta_link} className="block group/link">
                      <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[42px] font-black tracking-tight leading-[1.12] text-[#1a1208]">
                        {slide.title}
                        <span className="block mt-1 font-bold text-2xl sm:text-3xl md:text-4xl text-[#4a3b2c]">
                          {slide.subtitle}
                        </span>
                      </h1>
                    </Link>

                    {slide.description && (
                      <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 max-w-lg text-[#5a4c3c]">
                        {slide.description}
                      </p>
                    )}

                    {/* Action Row */}
                    <div className="mt-5 sm:mt-7 flex flex-wrap items-center gap-4">
                      <Link href={slide.cta_link}>
                        <button
                          type="button"
                          className="group/btn relative inline-flex items-center gap-3 rounded-full bg-[#fcd404] hover:bg-[#f5c700] px-7 sm:px-9 py-3.5 sm:py-4 text-base sm:text-lg font-extrabold text-[#1c1304] shadow-[0_10px_28px_-6px_rgba(245,199,0,0.7)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] border border-[#e2b600] cursor-pointer"
                        >
                          <span>{slide.cta_text}</span>
                          <span className="flex size-7 items-center justify-center rounded-full bg-[#1c1304] text-[#fcd404] transition-transform duration-300 group-hover/btn:translate-x-1">
                            <ArrowRight className="size-4" strokeWidth={2.5} />
                          </span>
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Bottom Bar: Slide Indicators */}
                  <div className="mt-auto flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      {slides.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            goToSlide(dotIdx);
                          }}
                          aria-label={`Go to slide ${dotIdx + 1}`}
                          className={`transition-all duration-300 rounded-full cursor-pointer ${
                            currentIndex === dotIdx
                              ? "w-8 sm:w-10 h-2 bg-[#fcd404] shadow-[0_0_10px_rgba(252,212,4,0.8)]"
                              : "w-2 sm:w-2.5 h-2 bg-[#1a1208]/25 hover:bg-[#1a1208]/50"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Quick Action Cards (Elevated Floating Tiles) */}
        <div className="mt-5 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group flex items-center justify-between rounded-2xl border border-amber-400/35 bg-white/95 px-4 sm:px-6 py-4 sm:py-4.5 shadow-[0_8px_25px_-6px_rgba(0,0,0,0.65)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#fcd404] hover:shadow-[0_12px_28px_-10px_rgba(245,199,0,0.6)]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-full bg-[#ffea75]/60 text-[#8b5e0a] border border-[#f5d947]/70 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:bg-[#ffea75]">
                    <Icon className="size-5 sm:size-5.5" strokeWidth={2} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm sm:text-base text-[#1a1208] group-hover:text-[#8b5e0a] transition-colors">
                      {action.title}
                    </span>
                    <span className="text-[11px] sm:text-xs text-[#6b5f4d] truncate hidden sm:inline-block">
                      {action.subtitle}
                    </span>
                  </div>
                </div>

                <ArrowRight className="size-4 shrink-0 text-[#8b5e0a] transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
