"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Heart,
  MessageSquare,
  Phone,
  Sparkles,
} from "lucide-react";
import { getImageProps } from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { cmsApi, type HeroSlide, type HomePageCMSData } from "@/lib/api";
import { HERO_SLIDES_TRANSLATIONS } from "@/lib/home-translations";
import { useLanguage } from "@/providers/language-provider";

const SPOT_INTERVAL_MS = 6000;

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

/**
 * One <picture> per slide: phones download only the portrait crop and wider
 * screens only the landscape one. Two separate <Image> elements, one hidden
 * with CSS, would make every visitor download both.
 */
function SpotlightPicture({
  desktopSrc,
  mobileSrc,
  alt,
  priority,
}: {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  priority: boolean;
}) {
  const common = { alt, fill: true, priority, quality: 80 } as const;
  const {
    props: { srcSet: desktopSet },
  } = getImageProps({
    ...common,
    src: desktopSrc,
    sizes: "(max-width: 1440px) 82vw, 1400px",
  });
  const {
    props: { srcSet: mobileSet, ...rest },
  } = getImageProps({
    ...common,
    src: mobileSrc,
    sizes: "100vw",
  });
  return (
    <picture>
      <source media="(min-width: 640px)" srcSet={desktopSet} sizes="(max-width: 1440px) 82vw, 1400px" />
      <img {...rest} srcSet={mobileSet} alt={alt} className="dl-spot-img object-cover object-top sm:object-center" />
    </picture>
  );
}

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

  // Keep the current and the next slide's images mounted, so a slide is
  // already decoded by the time it arrives. Adjusted during render (React's
  // "storing information from previous renders" pattern), not in an effect.
  const [seenIndex, setSeenIndex] = useState(-1);
  if (seenIndex !== currentIndex) {
    setSeenIndex(currentIndex);
    const nextIdx = (currentIndex + 1) % Math.max(slides.length, 1);
    if (!loadedSlides.has(currentIndex) || !loadedSlides.has(nextIdx)) {
      const next = new Set(loadedSlides);
      next.add(currentIndex);
      next.add(nextIdx);
      setLoadedSlides(next);
    }
  }

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // A timeout restarted on every slide change, so a manual jump gets a full
    // interval before the next advance (the progress dot restarts with it).
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, SPOT_INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [isPaused, slides.length, currentIndex]);

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

  const spotTitle =
    language === "bn" ? "আজকের বিশেষ" : language === "hi" ? "आज का विशेष" : "Today's Spotlight";
  const spotKicker =
    language === "bn" ? "বাছাই করা পরামর্শ" : language === "hi" ? "चुने हुए परामर्श" : "Handpicked for you";

  return (
    <section id="spotlight" className="dl-spot" aria-roledescription="carousel" aria-label={spotTitle}>
      <div className="dl-sec-inner">
        <header className="dl-sec-head">
          <div>
            <p className="dl-kicker">{spotKicker}</p>
            <h2 className="dl-sec-title">{spotTitle}</h2>
          </div>
          <div className="dl-spot-arrows">
            <button type="button" className="dl-round-btn" onClick={prevSlide} aria-label="Previous slide">
              <ArrowRight className="size-4 rotate-180" strokeWidth={2} />
            </button>
            <button type="button" className="dl-round-btn" onClick={nextSlide} aria-label="Next slide">
              <ArrowRight className="size-4" strokeWidth={2} />
            </button>
          </div>
        </header>

        <div
          className="dl-spot-frame"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Sliding Track */}
          <div
            className="dl-spot-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides.map((slide, idx) => {
              const shouldRenderImage =
                idx === 0 || idx === currentIndex || loadedSlides.has(idx);
              return (
              <div
                key={slide.id || idx}
                className={`dl-spot-slide${idx === currentIndex ? " is-active" : ""}`}
                aria-hidden={idx !== currentIndex}
              >
                {/* Full-bleed background image */}
                {shouldRenderImage && (
                  <SpotlightPicture
                    desktopSrc={slide.image_url}
                    mobileSrc={MOBILE_HERO_IMAGES[slide.id ?? ""] ?? slide.image_url}
                    alt={slide.title}
                    priority={idx === 0}
                  />
                )}

                {/* Left gradient scrim for text readability */}
                <div className="dl-spot-scrim" />

                {/* Content overlay */}
                <div className="dl-spot-copy">
                  <div className="dl-spot-copy-in">
                    {/* Subtitle / brand line */}
                    {slide.badge_text && (
                      <p className="dl-spot-badge">
                        {slide.badge_text}
                      </p>
                    )}

                    {/* Main headline */}
                    <Link href={slide.cta_link} className="block" tabIndex={idx === currentIndex ? 0 : -1}>
                      <h3 className="dl-spot-title">
                        {slide.title}
                      </h3>
                      {slide.subtitle && (
                        <p className="dl-spot-sub">
                          {slide.subtitle}
                        </p>
                      )}
                    </Link>

                    {/* Description */}
                    {slide.description && (
                      <p className="dl-spot-desc">
                        {slide.description}
                      </p>
                    )}

                    {/* CTA Button */}
                    <div className="mt-5 sm:mt-7">
                      <Link
                        href={slide.cta_link}
                        className="dl-spot-cta"
                        tabIndex={idx === currentIndex ? 0 : -1}
                      >
                        <span>{slide.cta_text}</span>
                        <ArrowRight className="size-4" strokeWidth={2.5} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          <div className="dl-spot-dots" role="tablist" aria-label="Slides">
            {slides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                role="tab"
                aria-selected={currentIndex === dotIdx}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(dotIdx);
                }}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`dl-spot-dot${currentIndex === dotIdx ? " is-active" : ""}`}
              >
                {currentIndex === dotIdx && (
                  <span
                    key={currentIndex}
                    className="dl-spot-dot-fill"
                    style={{ animationPlayState: isPaused ? "paused" : "running" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Quick Action Cards */}
        <div className="dl-quick">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group dl-quick-tile"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="dl-quick-icon">
                    <Icon className="size-5" strokeWidth={1.6} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="dl-quick-title">
                      {action.title}
                    </span>
                    <span className="dl-quick-sub">
                      {action.subtitle}
                    </span>
                  </div>
                </div>

                <ArrowRight className="dl-quick-arrow size-4 shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
