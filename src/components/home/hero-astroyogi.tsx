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
    image_url: "/images/hero-couple.jpg",
    bg_gradient: "from-[#fffbf0] via-[#fff8dc] to-[#fceeb5]",
    border_color: "border-[#ebd881]",
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
    image_url: "/images/readings-kundli.jpg",
    bg_gradient: "from-[#fff9e6] via-[#fff3cc] to-[#fde5a3]",
    border_color: "border-[#e8ce6b]",
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
    image_url: "/images/readings-matchmaking.jpg",
    bg_gradient: "from-[#fff6f0] via-[#ffeedd] to-[#ffdcb8]",
    border_color: "border-[#f2b992]",
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
    image_url: "/images/readings-spirituality.jpg",
    bg_gradient: "from-[#f3faf6] via-[#e2f5ec] to-[#c7eedb]",
    border_color: "border-[#93dab7]",
  },
  {
    id: "slide-5",
    title: "Discover your true potential",
    subtitle: "via Samudrika Shastra face scan",
    description: "Biometric facial feature analysis revealing hidden personality traits, career paths & wealth.",
    cta_text: "Scan Your Face",
    cta_link: "/face-reading",
    badge_text: "Instant AI Physiognomy",
    badge_rating: "Camera Scan",
    image_url: "/images/readings-tarot.jpg",
    bg_gradient: "from-[#faf5ff] via-[#f3e8ff] to-[#e4ceff]",
    border_color: "border-[#cfa7f7]",
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
    image_url: "/images/readings-vastu.jpg",
    bg_gradient: "from-[#fffdf0] via-[#fdf6cc] to-[#fce48b]",
    border_color: "border-[#ebd36a]",
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
    if (cmsData?.hero_slides && cmsData.hero_slides.length > 0) {
      return cmsData.hero_slides;
    }
    return DEFAULT_SLIDES;
  }, [cmsData]);

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
        {/* Main Hero Slider Container */}
        <div
          className="relative group/slider overflow-hidden rounded-[26px] sm:rounded-3xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Active Banner Slide */}
          <div
            className={`relative overflow-hidden rounded-[26px] sm:rounded-3xl border ${
              currentSlide.border_color || "border-[#ebd881]"
            } bg-gradient-to-r ${
              currentSlide.bg_gradient || "from-[#fffbf0] via-[#fff8dc] to-[#fceeb5]"
            } shadow-[0_20px_50px_-20px_rgba(240,210,80,0.55)] transition-all duration-700 min-h-[340px] sm:min-h-[380px] lg:min-h-[400px] flex flex-col justify-center`}
          >
            {/* Ambient background glows */}
            <div
              className="pointer-events-none absolute -left-12 -top-12 size-64 rounded-full bg-white/70 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute right-1/3 bottom-0 size-72 rounded-full bg-gold-300/30 blur-3xl"
              aria-hidden
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 items-center h-full">
              {/* LEFT COLUMN: Headline + Consult CTA + Official Badge */}
              <div className="lg:col-span-7 p-6 sm:p-10 lg:pl-12 lg:pr-6 z-10 flex flex-col justify-center">
                <Link href={currentSlide.cta_link} className="block group">
                  <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-[#1a1208] leading-[1.12]">
                    {currentSlide.title}
                    <br />
                    <span className="font-medium text-[#4a3b2c] block mt-1 text-2xl sm:text-3xl md:text-4xl">
                      {currentSlide.subtitle}
                    </span>
                  </h1>
                </Link>

                {currentSlide.description && (
                  <p className="mt-3 text-xs sm:text-sm text-[#6b5f4d] max-w-lg leading-relaxed line-clamp-2">
                    {currentSlide.description}
                  </p>
                )}

                {/* Action row with CTA & Badge */}
                <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4 sm:gap-7">
                  {/* Yellow Big Pill CTA */}
                  <Link href={currentSlide.cta_link}>
                    <button
                      type="button"
                      className="group relative inline-flex items-center gap-3 rounded-full bg-[#fcd404] hover:bg-[#f5c700] px-7 sm:px-9 py-3.5 sm:py-4 text-base sm:text-lg font-bold text-[#1c1304] shadow-[0_12px_28px_-6px_rgba(245,199,0,0.85)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-[#e2b600]"
                    >
                      <span>{currentSlide.cta_text}</span>
                      <span className="flex size-7 items-center justify-center rounded-full bg-[#1c1304] text-[#fcd404] transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowRight className="size-4" strokeWidth={2.5} />
                      </span>
                    </button>
                  </Link>

                  {/* Badge */}
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ffd700] to-[#e69500] text-white shadow-md">
                      <span className="font-cinzel text-xl font-black">#1</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-xs sm:text-sm text-[#1a1208] leading-tight">
                        {currentSlide.badge_text}
                      </span>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="size-3 fill-[#e08c12] text-[#e08c12]"
                          />
                        ))}
                        {currentSlide.badge_rating && (
                          <span className="text-[10px] font-bold text-ink-700 ml-1">
                            {currentSlide.badge_rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Slide Image with direct link */}
              <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[300px] lg:min-h-[400px] w-full overflow-hidden flex items-end justify-center lg:justify-end">
                <Link
                  href={currentSlide.cta_link}
                  className="relative w-full h-full block group"
                  aria-label={currentSlide.title}
                >
                  <Image
                    key={currentSlide.image_url}
                    src={currentSlide.image_url}
                    alt={currentSlide.title}
                    fill
                    priority
                    className="object-cover object-[center_top] lg:object-[right_center] transition-transform duration-700 group-hover:scale-103"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                  {/* Soft edge blend for smooth integration */}
                  <div className="hidden lg:block absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#fff8dc]/90 via-[#fff8dc]/40 to-transparent pointer-events-none" />
                  <div className="lg:hidden absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#fceeb5] to-transparent pointer-events-none" />
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation Arrows (Prev / Next) */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-white/80 hover:bg-white text-ink-900 border border-[#ebd881] shadow-md transition-all duration-200 hover:scale-110 active:scale-95 opacity-80 sm:opacity-0 group-hover/slider:opacity-100 z-20"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-white/80 hover:bg-white text-ink-900 border border-[#ebd881] shadow-md transition-all duration-200 hover:scale-110 active:scale-95 opacity-80 sm:opacity-0 group-hover/slider:opacity-100 z-20"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Bottom Slider Dots Indicator */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-full">
            {slides.map((slide, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={slide.id || index}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-7 bg-[#fcd404] shadow-[0_0_8px_rgba(252,212,4,0.8)]"
                      : "w-2 bg-white/70 hover:bg-white"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* 4 Quick Action Cards (Astroyogi Signature Bar) */}
        <div className="mt-5 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {QUICK_ACTIONS.map((action) => {
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
