"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Heart,
  MessageSquare,
  Phone,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { cmsApi, type HeroSlide, type HomePageCMSData } from "@/lib/api";
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
    badge_text: "Top Vedic Jyotish Acharyas",
    badge_rating: "Certified",
    image_url: "/images/hero/hero-couple-exploring.png",
  },
  {
    id: "slide-2",
    title: "Know your destiny & future",
    subtitle: "with free Vedic Janam Kundli",
    description: "Accurate planetary calculations, dosha analysis, and personalized remedies by Vedic experts.",
    cta_text: "Generate Free Kundli",
    cta_link: "/kundli",
    badge_text: "100% Free Janam Kundli",
    badge_rating: "Swiss Ephemeris",
    image_url: "/images/hero/hero-parchment-kundli.png",
  },
  {
    id: "slide-3",
    title: "Check marriage compatibility",
    subtitle: "find your perfect soulmate",
    description: "Detailed 36-Gun Milan, Manglik Dosha report & life-long harmony analysis for bride & groom.",
    cta_text: "Match Kundli Now",
    cta_link: "/kundli-matching",
    badge_text: "Vedic Ashtakoot Matchmaking",
    badge_rating: "36 Gunas",
    image_url: "/images/hero/hero-indian-wedding.png",
  },
  {
    id: "slide-4",
    title: "Unlock secrets in your palm",
    subtitle: "with modern 3D AI biometrics",
    description: "Explore heart, head & life lines with interactive real-time 3D hand visualization.",
    cta_text: "Start Palm Reading",
    cta_link: "/palm-reading",
    badge_text: "Vedic Hastarekha Biometrics",
    badge_rating: "3D Palmistry",
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

export function HeroAstroyogi({
  initialCms,
}: {
  initialCms?: HomePageCMSData | null;
} = {}) {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState<Set<number>>(() => new Set([0]));
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const { data: cmsData } = useQuery({
    queryKey: ["cms", "homepage"],
    queryFn: cmsApi.getHomepage,
    initialData: initialCms ?? undefined,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  const slides = useMemo<HeroSlide[]>(() => {
    const baseSlides =
      cmsData?.hero_slides && cmsData.hero_slides.length > 0
        ? cmsData.hero_slides
        : DEFAULT_SLIDES;

    const loc = HERO_SLIDES_TRANSLATIONS[language] || HERO_SLIDES_TRANSLATIONS.en;
    return baseSlides.map((slide, idx) => {
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
  }, [language, cmsData]);

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

  useEffect(() => {
    setLoadedSlides((prev) => {
      const nextIdx = (currentIndex + 1) % Math.max(slides.length, 1);
      if (prev.has(currentIndex) && prev.has(nextIdx)) return prev;
      const next = new Set(prev);
      next.add(currentIndex);
      next.add(nextIdx);
      return next;
    });
  }, [currentIndex, slides.length]);

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

  return (
    <section className="relative overflow-hidden bg-[#0a080d] sm:bg-gradient-to-b sm:from-[#060508] sm:via-[#0c0a12] sm:to-[#08070b] pt-4 pb-6 sm:pt-6 sm:pb-10 border-b border-amber-500/15">
      {/* Left rotating celestial gold zodiac wheel */}
      <Image
        src="/celestial-wheel-gold.webp"
        alt=""
        width={480}
        height={480}
        loading="lazy"
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 sm:-left-24 md:-left-32 lg:-left-40 top-1/2 -translate-y-1/2 size-[240px] sm:size-[320px] md:size-[400px] lg:size-[480px] select-none opacity-20 sm:opacity-25 mix-blend-screen filter drop-shadow-[0_0_25px_rgba(245,139,0,0.25)] animate-[spin_120s_linear_infinite_reverse] motion-reduce:animate-none"
      />

      {/* Right rotating celestial gold zodiac wheel */}
      <Image
        src="/zodiac-wheel-gold.webp"
        alt=""
        width={480}
        height={480}
        loading="lazy"
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 sm:-right-24 md:-right-32 lg:-right-40 top-1/2 -translate-y-1/2 size-[240px] sm:size-[320px] md:size-[400px] lg:size-[480px] select-none opacity-20 sm:opacity-25 mix-blend-screen filter drop-shadow-[0_0_25px_rgba(245,139,0,0.25)] animate-spin [animation-duration:120s] motion-reduce:animate-none"
      />

      {/* Subtle celestial stars and ambient cosmic radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,139,0,0.09)_0%,rgba(194,65,12,0.04)_40%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          backgroundImage: `radial-gradient(1.5px 1.5px at 8% 18%, rgba(255,255,255,0.8) 50%, transparent 100%),
            radial-gradient(1px 1px at 22% 35%, rgba(253,224,71,0.7) 50%, transparent 100%),
            radial-gradient(1.5px 1.5px at 38% 12%, rgba(255,255,255,0.7) 50%, transparent 100%),
            radial-gradient(2px 2px at 52% 28%, rgba(253,224,71,0.9) 50%, transparent 100%),
            radial-gradient(1px 1px at 68% 15%, rgba(255,255,255,0.6) 50%, transparent 100%),
            radial-gradient(1.5px 1.5px at 82% 32%, rgba(253,224,71,0.8) 50%, transparent 100%),
            radial-gradient(1.5px 1.5px at 93% 20%, rgba(255,255,255,0.8) 50%, transparent 100%),
            radial-gradient(1px 1px at 15% 75%, rgba(255,255,255,0.6) 50%, transparent 100%),
            radial-gradient(2px 2px at 30% 88%, rgba(253,224,71,0.7) 50%, transparent 100%),
            radial-gradient(1.5px 1.5px at 45% 72%, rgba(255,255,255,0.7) 50%, transparent 100%),
            radial-gradient(1px 1px at 60% 85%, rgba(253,224,71,0.6) 50%, transparent 100%),
            radial-gradient(1.5px 1.5px at 75% 78%, rgba(255,255,255,0.8) 50%, transparent 100%),
            radial-gradient(2px 2px at 88% 82%, rgba(253,224,71,0.8) 50%, transparent 100%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Hero Slider with Crisp White Frame (Matching Reference Design) */}
        <div
          className="relative group/slider overflow-hidden rounded-2xl sm:rounded-3xl border-2 sm:border-[3px] border-white/95 shadow-[0_20px_55px_-12px_rgba(0,0,0,0.85),0_0_35px_rgba(245,139,0,0.18)]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Sliding Track */}
          <div
            className="flex w-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides.map((slide, idx) => {
              const shouldRenderImage =
                idx === 0 || idx === currentIndex || loadedSlides.has(idx);
              return (
              <div
                key={slide.id || idx}
                className="relative w-full shrink-0 aspect-[16/9] sm:aspect-[2.4/1] overflow-hidden bg-[#120d1a]"
              >
                {/* Full-bleed background image */}
                {shouldRenderImage && (
                  <>
                    <Image
                      src={MOBILE_HERO_IMAGES[slide.id ?? ""] ?? slide.image_url}
                      alt={slide.title}
                      fill
                      priority={idx === 0}
                      className="object-cover object-top sm:hidden"
                      sizes="100vw"
                      quality={80}
                    />
                    <Image
                      src={slide.image_url}
                      alt={slide.title}
                      fill
                      priority={idx === 0}
                      className="hidden object-cover object-center sm:block"
                      sizes="(max-width: 1360px) 100vw, 1360px"
                      quality={82}
                    />
                  </>
                )}

                {/* Left gradient scrim for text readability */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent sm:from-black/50 sm:via-black/20" />

                {/* Content overlay */}
                <div className="relative z-10 flex flex-col justify-end sm:justify-center h-full p-6 sm:p-10 lg:pl-14 lg:pr-8">
                  <div className="max-w-lg lg:max-w-xl">
                    {/* Subtitle / brand line */}
                    {slide.badge_text && (
                      <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-white/70 mb-2 sm:mb-3">
                        {slide.badge_text}
                      </p>
                    )}

                    {/* Main headline */}
                    <Link href={slide.cta_link} className="block group/link">
                      <h1 className="font-sans text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-black tracking-tight leading-[1.1] text-white">
                        {slide.title}
                      </h1>
                      {slide.subtitle && (
                        <p className="mt-1 sm:mt-2 text-lg sm:text-2xl md:text-3xl font-semibold text-white/80">
                          {slide.subtitle}
                        </p>
                      )}
                    </Link>

                    {/* Description */}
                    {slide.description && (
                      <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed line-clamp-2 text-white/70 max-w-md">
                        {slide.description}
                      </p>
                    )}

                    {/* CTA Button */}
                    <div className="mt-5 sm:mt-7">
                      <Link href={slide.cta_link}>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2.5 rounded-full bg-white hover:bg-gray-100 px-7 sm:px-9 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-gray-900 shadow-md transition-all duration-200 hover:shadow-lg active:scale-[0.97] cursor-pointer"
                        >
                          <span>{slide.cta_text}</span>
                          <ArrowRight className="size-4" strokeWidth={2.5} />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          {/* Bottom bar: dot indicators */}
          <div className="absolute bottom-4 sm:bottom-6 left-6 sm:left-10 z-20 flex items-center">
            {/* Dot indicators */}
            <div className="flex items-center gap-1.5 sm:gap-2">
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
                      ? "w-7 sm:w-9 h-2 bg-white shadow-sm"
                      : "w-2 sm:w-2.5 h-2 bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 4 Quick Action Cards */}
        <div className="mt-5 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group flex items-center justify-between rounded-2xl border border-amber-400/40 bg-white/95 px-4 sm:px-6 py-4 sm:py-4.5 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#f39419] hover:shadow-[0_14px_35px_-8px_rgba(245,139,0,0.55)]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-full bg-[#ffc375]/70 text-[#8b5e0a] border border-[#f5aa47]/90 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:bg-[#ffc375]">
                    <Icon className="size-5 sm:size-5.5" strokeWidth={2} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm sm:text-base text-[#1d1a1c] group-hover:text-[#8b5e0a] transition-colors">
                      {action.title}
                    </span>
                    <span className="text-[11px] sm:text-xs text-[#5c5156] truncate hidden sm:inline-block">
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
