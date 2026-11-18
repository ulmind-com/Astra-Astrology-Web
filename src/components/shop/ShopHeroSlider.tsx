"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
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
}

interface Props {
  banners?: BannerItem[];
}

export function ShopHeroSlider({ banners }: Props) {
  const { language } = useLanguage();

  const defaultBanners: BannerItem[] = [
    {
      id: "b1",
      title: "WEAR YOUR ZODIAC",
      subtitle: "DISCOVER THE NEW ZODIAC RING COLLECTION.",
      cta_text: "SHOP NOW",
      cta_link: "/shop?purpose=zodiac",
      badge_text: "NEW LAUNCH",
      image_url: "/images/banners/banner-zodiac.jpg",
      is_active: true,
    },
    {
      id: "b2",
      title: "SACRED NEPALI RUDRAKSHA",
      subtitle: "100% LAB-CERTIFIED & ENERGISED BY TOP ASTROLOGERS.",
      cta_text: "EXPLORE MALAS",
      cta_link: "/shop?purpose=peace",
      badge_text: "PRANA-PRATISHTHIT",
      image_url: "/images/banners/banner-rudraksha.jpg",
      is_active: true,
    },
    {
      id: "b3",
      title: "SUPER DHAN YOG BAND",
      subtitle: "ATTRACT ABUNDANCE, REMOVE DEBT & ACTIVATE LAKSHMI YOG.",
      cta_text: "ORDER NOW",
      cta_link: "/shop?purpose=wealth",
      badge_text: "BESTSELLER",
      image_url: "/images/banners/banner-dhanyog.jpg",
      is_active: true,
    },
    {
      id: "b4",
      title: "ORIGINAL KARUNGALI MALA",
      subtitle: "NATURAL BLACK EBONY WOOD CONSECRATED FOR TOTAL PROTECTION.",
      cta_text: "VIEW KARUNGALI",
      cta_link: "/shop?purpose=protection",
      badge_text: "DIVINE SHIELD",
      image_url: "/images/banners/banner-karungali.jpg",
      is_active: true,
    },
    {
      id: "b5",
      title: "PRAN-PRATISHTHIT RATNA",
      subtitle: "GOVERNMENT LAB CERTIFIED YELLOW SAPPHIRE, BLUE SAPPHIRE & CORAL.",
      cta_text: "CONSULT & BUY",
      cta_link: "/shop?purpose=zodiac",
      badge_text: "LAB CERTIFIED",
      image_url: "/images/banners/banner-gemstones.jpg",
      is_active: true,
    },
  ];

  const slides = banners && banners.length > 0 ? banners.filter((b) => b.is_active) : defaultBanners;
  const [current, setCurrent] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const activeSlide = slides[current] || slides[0];

  return (
    <section
      className="relative w-full overflow-hidden rounded-[26px] sm:rounded-[34px] shadow-xl bg-[#f5ede0] border border-[#e8dfcf] select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slide Container */}
      <div className="relative aspect-[16/10] sm:aspect-[21/9] lg:aspect-[2.35/1] w-full min-h-[380px] sm:min-h-[460px] lg:min-h-[500px]">
        {activeSlide && (
          <Image
            src={activeSlide.image_url}
            alt={activeSlide.title}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center transform transition-transform duration-1000 ease-out group-hover:scale-102"
            unoptimized
          />
        )}

        {/* Subtle Luxury Warm Gradients for High Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fbf8f3]/85 via-[#f8f3ea]/35 to-transparent h-[65%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

        {/* Sacred Faint Horoscope Wheel Background Watermark */}
        <div className="pointer-events-none absolute left-1/2 -top-24 -translate-x-1/2 size-[520px] rounded-full border border-amber-800/10 opacity-30 blur-[0.5px] animate-spin-slow" />

        {/* Banner Centered Text Content (Exact Astrotalk Luxury Style) */}
        <div className="absolute top-6 sm:top-10 lg:top-12 inset-x-0 flex flex-col items-center text-center px-4 sm:px-8 space-y-2.5 sm:space-y-3 z-10">
          {activeSlide?.badge_text && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#7a4823] text-white shadow-xs text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase">
              <Sparkles className="size-3 text-amber-200" />
              <span>{activeSlide.badge_text}</span>
            </div>
          )}

          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-black text-[#452b18] tracking-wider uppercase drop-shadow-xs">
            {activeSlide?.title}
          </h1>

          <div className="flex items-center justify-center gap-2 text-[#8b5a2b]">
            <div className="h-px w-8 sm:w-12 bg-[#8b5a2b]/35" />
            <span className="text-xs">✦</span>
            <div className="h-px w-8 sm:w-12 bg-[#8b5a2b]/35" />
          </div>

          <p className="text-[11px] sm:text-xs lg:text-sm text-[#5d3b24] font-semibold tracking-[0.16em] uppercase max-w-2xl px-2">
            {activeSlide?.subtitle}
          </p>

          <div className="pt-1.5 sm:pt-2">
            <Link
              href={activeSlide?.cta_link || "/shop?purpose=zodiac"}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-full border border-[#8b5a2b] bg-white/70 hover:bg-[#7a4823] text-[#4a2c16] hover:text-white backdrop-blur-xs font-bold text-xs sm:text-[13px] tracking-widest uppercase transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer"
            >
              <span>{activeSlide?.cta_text || "SHOP NOW"}</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 size-9 sm:size-11 rounded-full bg-white/80 hover:bg-white text-[#4a2c16] border border-[#e5dcce] flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-md z-10"
            >
              <ChevronLeft className="size-5 sm:size-6" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 size-9 sm:size-11 rounded-full bg-white/80 hover:bg-white text-[#4a2c16] border border-[#e5dcce] flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-md z-10"
            >
              <ChevronRight className="size-5 sm:size-6" />
            </button>
          </>
        )}

        {/* Bottom-Left Pagination Dots (Exact Astrotalk Screenshot) */}
        <div className="absolute bottom-4 sm:bottom-6 left-5 sm:left-10 flex items-center gap-1.5 z-10 bg-white/50 backdrop-blur-xs px-2.5 py-1.5 rounded-full border border-[#e0d6c4]/60">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 cursor-pointer ${
                current === idx
                  ? "w-6 h-1.5 rounded-full bg-[#4a2c16] shadow-xs"
                  : "size-1.5 rounded-full bg-[#4a2c16]/30 hover:bg-[#4a2c16]/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
