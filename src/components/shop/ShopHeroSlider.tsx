"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  badge_text?: string | null;
  image_url: string;
  is_active: boolean;
  hide_text_overlay?: boolean;
}

interface Props {
  banners?: BannerItem[];
}

export function ShopHeroSlider({ banners }: Props) {
  const { language } = useLanguage();

  const defaultBanners: BannerItem[] = [
    {
      id: "b-lumus",
      badge_text: "LUMUS × ASTROTALK",
      title: "Discover India's First Crystal-Infused Perfumes",
      subtitle: "Where every fragrance meets the energy of crystals.",
      cta_text: "Shop Now",
      cta_link: "/shop?category=perfumes",
      image_url: "/images/banners/banner-lumus-clean.jpg",
      hide_text_overlay: true,
      is_active: true,
    },
    {
      id: "b-zodiac",
      badge_text: "ASTRA × ZODIAC",
      title: "Wear Your Zodiac Collection",
      subtitle: "Discover India's finest 925 sterling silver zodiac rings infused with authentic planetary gemstone energies.",
      cta_text: "Shop Now",
      cta_link: "/shop?category=zodiac",
      image_url: "/images/banners/banner-zodiac.jpg",
      is_active: true,
    },
    {
      id: "b-rudraksha",
      badge_text: "DIVINE RUDRAKSHA × VARANASI",
      title: "Sacred Nepali Siddh Rudraksha",
      subtitle: "100% lab-certified 1 to 14 Mukhi divine beads consecrated with Maha Mrityunjaya Vedic rituals.",
      cta_text: "Shop Now",
      cta_link: "/shop?category=rudraksha",
      image_url: "/images/banners/banner-rudraksha.jpg",
      is_active: true,
    },
    {
      id: "b-dhanyog",
      badge_text: "DHAN YOG × ABUNDANCE",
      title: "Super Dhan Yog Abundance Band",
      subtitle: "Attract wealth, dissolve debt & activate Lakshmi vibrations with certified Pyrite, Tiger's Eye & Citrine.",
      cta_text: "Shop Now",
      cta_link: "/shop?category=bracelets",
      image_url: "/images/banners/banner-dhanyog.jpg",
      is_active: true,
    },
    {
      id: "b-karungali",
      badge_text: "KARUNGALI × TOTAL SHIELD",
      title: "Original Karungali Ebony Mala",
      subtitle: "Pure black ebony wood beads energized for negative energy protection, evil eye defense & planetary peace.",
      cta_text: "Shop Now",
      cta_link: "/shop?category=karungali",
      image_url: "/images/banners/banner-karungali-landscape.jpg",
      is_active: true,
    },
    {
      id: "b-gemstones",
      badge_text: "GOVT. LAB CERTIFIED RATNA",
      title: "Pran-Pratishthit Natural Gemstones",
      subtitle: "Unheated, untreated Yellow Sapphire, Blue Sapphire, Emerald & Red Coral with certificate of authenticity.",
      cta_text: "Shop Now",
      cta_link: "/shop?category=gemstones",
      image_url: "/images/banners/banner-gemstones-landscape.jpg",
      is_active: true,
    },
  ];

  const slides = banners && banners.length > 0 ? banners.filter((b) => b.is_active) : defaultBanners;
  const [current, setCurrent] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  // Swipe / touch handling for mobile and desktop drag
  const [touchStartX, setTouchStartX] = React.useState<number | null>(null);
  const [touchEndX, setTouchEndX] = React.useState<number | null>(null);

  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  React.useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prevIdx) => (prevIdx + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > 50) next();
    if (distance < -50) prev();
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Trust items for the ticker strip directly below hero slider (exact Astrotalk design)
  const trustItems = [
    "7-Day Easy Returns",
    "Energised by Top Astrologers",
    "100% Natural & Authentic",
    "Certified by Govt. Labs",
    "100% Cashback On All Prepaid Orders",
  ];

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      {/* 1. Main Hero Carousel Container (Exact Astrotalk Screenshot Layout) */}
      <section
        className="relative w-full overflow-hidden rounded-[24px] sm:rounded-[32px] md:rounded-[36px] shadow-2xl bg-[#faf6f0] border border-amber-900/10 select-none group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-roledescription="carousel"
        aria-label="Shop featured collections"
      >
        {/* Aspect Ratio Frame */}
        <div className="relative aspect-[16/10] sm:aspect-[21/9] lg:aspect-[2.35/1] w-full min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] overflow-hidden">
          {/* Horizontal Slide Track with Smooth CSS Animation */}
          <div
            className="flex w-full h-full transition-transform duration-600 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide, idx) => {
              const isCurrent = current === idx;
              return (
                <div
                  key={slide.id || idx}
                  className="relative w-full h-full shrink-0 flex-none overflow-hidden select-none"
                  aria-hidden={!isCurrent}
                >
                  {/* Background Image */}
                  <Image
                    src={slide.image_url}
                    alt={slide.title}
                    fill
                    priority={idx < 2}
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="object-cover object-center transform transition-transform duration-1000 ease-out group-hover:scale-102"
                    unoptimized
                  />

                  {/* Pre-designed Graphic Banner (like Lumus Perfumes from Screenshot) */}
                  {slide.hide_text_overlay ? (
                    <Link
                      href={slide.cta_link || "/shop"}
                      className="absolute inset-0 z-10 cursor-pointer"
                      aria-label={slide.title}
                    />
                  ) : (
                    /* Dynamic Astrotalk Left-and-Right Split Layout */
                    <>
                      {/* Soft Left Vignette Gradient for Ultra-Crisp Typography Legibility */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent pointer-events-none" />

                      {/* Left Side Content Block */}
                      <div className="absolute inset-0 flex flex-col justify-center px-7 sm:px-12 lg:px-16 max-w-xl text-white space-y-3 sm:space-y-4 z-10 pointer-events-none">
                        {/* Luxury Eyebrow: LUMUS × ASTROTALK */}
                        {slide.badge_text && (
                          <div className="inline-flex items-center gap-1.5 self-start text-xs sm:text-sm font-medium tracking-[0.22em] text-white/95 uppercase drop-shadow-sm">
                            {slide.badge_text.includes("×") ? (
                              <>
                                <span className="font-serif tracking-[0.25em] font-normal">
                                  {slide.badge_text.split("×")[0].trim()}
                                </span>
                                <span className="text-white/60 mx-1">×</span>
                                <span className="font-sans font-medium tracking-wider">
                                  {slide.badge_text.split("×")[1].trim()}
                                </span>
                              </>
                            ) : (
                              <span>{slide.badge_text}</span>
                            )}
                          </div>
                        )}

                        {/* Main Headline */}
                        <h2 className="font-sans text-2xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-bold text-white tracking-tight leading-[1.12] drop-shadow-sm whitespace-pre-line">
                          {slide.title}
                        </h2>

                        {/* Subtitle */}
                        <p className="text-xs sm:text-sm lg:text-base text-stone-100/90 font-normal leading-relaxed max-w-md drop-shadow-sm">
                          {slide.subtitle}
                        </p>

                        {/* White Rounded-XL Shop Now Button */}
                        <div className="pt-2 sm:pt-3 pointer-events-auto">
                          <Link
                            href={slide.cta_link || "/shop"}
                            className="inline-flex items-center justify-center px-7 sm:px-8 py-2.5 sm:py-3.5 rounded-xl bg-white text-stone-950 hover:bg-stone-50 font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 active:scale-98 cursor-pointer select-none"
                          >
                            <span>{slide.cta_text || "Shop Now"}</span>
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom-Left Slide Indicator Dots (Exact Astrotalk Screenshot: Active Dark Pill + Dots) */}
          <div className="absolute bottom-5 sm:bottom-7 left-6 sm:left-12 flex items-center gap-2 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrent(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 cursor-pointer ${
                  current === idx
                    ? "w-7 sm:w-8 h-2 rounded-full bg-stone-900 shadow-sm border border-black/10"
                    : "size-2 rounded-full bg-stone-900/35 hover:bg-stone-900/70"
                }`}
              />
            ))}
          </div>

          {/* Bottom-Right Circular Frosted Glass Navigation Arrows (Exact Astrotalk Screenshot) */}
          {slides.length > 1 && (
            <div className="absolute bottom-5 sm:bottom-7 right-6 sm:right-12 flex items-center gap-2 sm:gap-2.5 z-20">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous slide"
                className="size-9 sm:size-10 rounded-full bg-black/25 hover:bg-black/50 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
              >
                <ChevronLeft className="size-4 sm:size-5 stroke-[2]" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next slide"
                className="size-9 sm:size-10 rounded-full bg-black/25 hover:bg-black/50 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
              >
                <ChevronRight className="size-4 sm:size-5 stroke-[2]" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 2. Dark Trust Badge Strip Directly Below Hero Slider (Exact Astrotalk Screenshot Match) */}
      <div className="w-full rounded-xl sm:rounded-2xl bg-[#141414] text-white py-3 sm:py-3.5 px-4 shadow-md overflow-hidden select-none border border-stone-800">
        {/* Desktop View: Centered Horizontal Row */}
        <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 text-xs sm:text-[13px] font-medium tracking-wide">
          {trustItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              <span className="text-amber-400 font-bold text-sm">✦</span>
              <span className="text-stone-100">{item}</span>
            </div>
          ))}
          <div className="flex items-center gap-2.5">
            <span className="text-amber-400 font-bold text-sm">✦</span>
            <span className="text-stone-100">{trustItems[0]}</span>
          </div>
        </div>

        {/* Mobile & Tablet View: Smooth Continuous Auto-Marquee */}
        <div className="flex lg:hidden w-max animate-marquee space-x-6 items-center whitespace-nowrap text-xs font-medium tracking-wide">
          {[...trustItems, ...trustItems, ...trustItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-amber-400 font-bold text-xs">✦</span>
              <span className="text-stone-100">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
