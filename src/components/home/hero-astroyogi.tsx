"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  Heart,
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

const QUICK_ACTIONS = [
  {
    title: "Talk",
    subtitle: "Instant Consultation",
    href: "/astrologers",
    icon: Phone,
  },
  {
    title: "Love",
    subtitle: "Relationship Clarity",
    href: "/kundli-matching",
    icon: Heart,
  },
  {
    title: "Horoscope",
    subtitle: "Daily & Yearly 2026",
    href: "/daily-horoscope",
    icon: Sparkles,
  },
  {
    title: "Kundli",
    subtitle: "Free Birth Chart",
    href: "/kundli",
    icon: Compass,
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
    return QUICK_ACTIONS.map((action, idx) => {
      const trans = loc.quickActions[idx];
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
    <section className="relative overflow-hidden bg-white pt-4 pb-8 sm:pt-6 sm:pb-10">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Main Hero Slider Container — Full card 3:1 aspect ratio with user's custom images */}
        <div
          className="relative group/slider overflow-hidden rounded-[26px] sm:rounded-3xl min-h-[350px] sm:min-h-[380px] lg:h-[400px] shadow-[0_16px_40px_-16px_rgba(26,18,8,0.12)] border border-[#eadf9a]/60 bg-[#fffdf5]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* 1. Full-Bleed 100% Brightness & Opacity Background Image (Exact Card Ratio) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <Image
              key={currentSlide.image_url}
              src={currentSlide.image_url}
              alt={currentSlide.title}
              fill
              priority
              className="object-cover object-right sm:object-center transition-all duration-700"
              sizes="(max-width: 1360px) 100vw, 1360px"
              quality={95}
            />
          </div>

          {/* 2. Overlaid Interactive Content Layer — Placed cleanly on the left */}
          <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-10 lg:pl-12 lg:pr-8 min-h-[350px] sm:min-h-[380px] lg:h-[400px]">
            {/* Top Bar inside Card: Pill Badge + Slide Counter */}
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 shadow-xs bg-white/85 border border-[#eadf9a] text-[#1a1208] backdrop-blur-xs">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ffd700] to-[#e69500] text-[#1a1208] text-[10px] font-black">
                  #1
                </div>
                <span className="text-xs sm:text-sm font-bold tracking-wide">
                  {currentSlide.badge_text}
                </span>
                {currentSlide.badge_rating && (
                  <div className="flex items-center gap-1 border-l border-[#ebd881] pl-2 ml-1">
                    <Star className="size-3 fill-[#e08c12] text-[#e08c12]" />
                    <span className="text-xs font-bold text-[#8b5e0a]">
                      {currentSlide.badge_rating}
                    </span>
                  </div>
                )}
              </div>

              {/* Slide Counter */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-extrabold tracking-wider px-3 py-1 rounded-full bg-white/85 text-[#1a1208]/80 border border-[#eadf9a] backdrop-blur-xs">
                <span className="text-[#e08c12]">0{currentIndex + 1}</span>
                <span className="opacity-40">/</span>
                <span className="opacity-60">0{slides.length}</span>
              </div>
            </div>

            {/* Middle: Headline, Subtitle, Description & Action Button */}
            <div className="my-auto py-2 sm:py-4 max-w-xl lg:max-w-2xl">
              <Link href={currentSlide.cta_link} className="block group/link">
                <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[42px] font-black tracking-tight leading-[1.12] text-[#1a1208]">
                  {currentSlide.title}
                  <span className="block mt-1 font-bold text-2xl sm:text-3xl md:text-4xl text-[#4a3b2c]">
                    {currentSlide.subtitle}
                  </span>
                </h1>
              </Link>

              {currentSlide.description && (
                <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 max-w-lg text-[#5a4c3c]">
                  {currentSlide.description}
                </p>
              )}

              {/* Action Row */}
              <div className="mt-5 sm:mt-7 flex flex-wrap items-center gap-4">
                <Link href={currentSlide.cta_link}>
                  <button
                    type="button"
                    className="group/btn relative inline-flex items-center gap-3 rounded-full bg-[#fcd404] hover:bg-[#f5c700] px-7 sm:px-9 py-3.5 sm:py-4 text-base sm:text-lg font-extrabold text-[#1c1304] shadow-[0_10px_28px_-6px_rgba(245,199,0,0.7)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] border border-[#e2b600]"
                  >
                    <span>{currentSlide.cta_text}</span>
                    <span className="flex size-7 items-center justify-center rounded-full bg-[#1c1304] text-[#fcd404] transition-transform duration-300 group-hover/btn:translate-x-1">
                      <ArrowRight className="size-4" strokeWidth={2.5} />
                    </span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Bottom Bar: Slide Dots & Arrow Navigation */}
            <div className="flex items-center justify-between pt-1">
              {/* Slide Indicators */}
              <div className="flex items-center gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full ${
                      currentIndex === idx
                        ? "w-8 sm:w-10 h-2 bg-[#fcd404] shadow-[0_0_10px_rgba(252,212,4,0.8)]"
                        : "w-2 sm:w-2.5 h-2 bg-[#1a1208]/25 hover:bg-[#1a1208]/50"
                    }`}
                  />
                ))}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  className="flex size-9 sm:size-10 items-center justify-center rounded-full bg-white/90 hover:bg-white text-[#1a1208] border border-[#eadf9a] shadow-xs transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="flex size-9 sm:size-10 items-center justify-center rounded-full bg-white/90 hover:bg-white text-[#1a1208] border border-[#eadf9a] shadow-xs transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Quick Action Cards (Astroyogi Signature Bar) */}
        <div className="mt-5 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group flex items-center justify-between rounded-2xl border border-[#eadf9a] bg-white px-4 sm:px-6 py-4 sm:py-4.5 shadow-[0_4px_16px_-4px_rgba(26,18,8,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#fcd404] hover:shadow-[0_12px_28px_-10px_rgba(245,199,0,0.6)]"
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
