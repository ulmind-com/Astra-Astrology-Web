"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
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
      badge_text: "ASTRA × ZODIAC",
      title: "Wear Your Zodiac Collection",
      subtitle: "Discover India's finest 925 sterling silver zodiac rings infused with authentic planetary gemstone energies.",
      cta_text: "Shop Now",
      cta_link: "/shop?category=zodiac",
      image_url: "/images/banners/banner-zodiac.jpg",
      is_active: true,
    },
    {
      id: "b2",
      badge_text: "DIVINE RUDRAKSHA × VARANASI",
      title: "Sacred Nepali Siddh Rudraksha",
      subtitle: "100% lab-certified 1 to 14 Mukhi divine beads consecrated with Maha Mrityunjaya Vedic rituals.",
      cta_text: "Shop Now",
      cta_link: "/shop?category=karungali",
      image_url: "/images/banners/banner-rudraksha.jpg",
      is_active: true,
    },
    {
      id: "b3",
      badge_text: "DHAN YOG × ABUNDANCE",
      title: "Super Dhan Yog Abundance Band",
      subtitle: "Attract wealth, dissolve debt & activate Lakshmi vibrations with certified Pyrite, Tiger's Eye & Citrine.",
      cta_text: "Shop Now",
      cta_link: "/shop?category=bracelets",
      image_url: "/images/banners/banner-dhanyog.jpg",
      is_active: true,
    },
    {
      id: "b4",
      badge_text: "KARUNGALI × TOTAL SHIELD",
      title: "Original Karungali Ebony Mala",
      subtitle: "Pure black ebony wood beads energized for negative energy protection, evil eye defense & planetary peace.",
      cta_text: "Shop Now",
      cta_link: "/shop?category=karungali",
      image_url: "/images/banners/banner-karungali.jpg",
      is_active: true,
    },
    {
      id: "b5",
      badge_text: "GOVT. LAB CERTIFIED RATNA",
      title: "Pran-Pratishthit Natural Gemstones",
      subtitle: "Unheated, untreated Yellow Sapphire, Blue Sapphire, Emerald & Red Coral with certificate of authenticity.",
      cta_text: "Shop Now",
      cta_link: "/shop?category=zodiac",
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
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const activeSlide = slides[current] || slides[0];

  return (
    <section
      className="relative w-full overflow-hidden rounded-[26px] sm:rounded-[36px] shadow-2xl bg-[#1c140d] border border-amber-900/20 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slide Container */}
      <div className="relative aspect-[16/10] sm:aspect-[21/9] lg:aspect-[2.35/1] w-full min-h-[400px] sm:min-h-[480px] lg:min-h-[520px]">
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

        {/* Cinematic Gradient Overlays (Astrotalk Screenshot Match) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Faint Sacred Background Watermark */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-[500px] rounded-full border border-amber-300/10 opacity-25 blur-[0.5px] animate-spin-slow" />

        {/* Left Side Slide Content (Matching Astrotalk Screenshot 2) */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-16 max-w-2xl text-white space-y-3 sm:space-y-4 z-10">
          {/* Brand Eyebrow Tag */}
          <div className="inline-flex items-center gap-2 self-start font-serif text-xs sm:text-sm lg:text-base font-bold tracking-[0.2em] text-amber-200/95 drop-shadow-sm uppercase">
            <Sparkles className="size-3.5 text-amber-400" />
            <span>{activeSlide?.badge_text || "ASTRA × STORE"}</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] drop-shadow-md">
            {activeSlide?.title}
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-base text-stone-200/95 font-medium leading-relaxed max-w-lg drop-shadow-sm">
            {activeSlide?.subtitle}
          </p>

          {/* White Pill CTA Button (Exact Astrotalk Style) */}
          <div className="pt-2 sm:pt-3">
            <Link
              href={activeSlide?.cta_link || "/shop?category=zodiac"}
              className="inline-flex items-center justify-center px-8 sm:px-9 py-3 sm:py-3.5 rounded-full bg-white text-stone-950 hover:bg-stone-100 font-bold text-xs sm:text-sm tracking-wide shadow-xl transition-all duration-300 hover:scale-105 active:scale-98 cursor-pointer select-none"
            >
              <span>{activeSlide?.cta_text || "Shop Now"}</span>
            </Link>
          </div>
        </div>

        {/* Bottom-Left Pagination Dots (Exact Astrotalk Screenshot: Active Pill + Round Dots) */}
        <div className="absolute bottom-5 sm:bottom-7 left-6 sm:left-12 flex items-center gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 cursor-pointer ${
                current === idx
                  ? "w-8 h-2 rounded-full bg-white shadow-md"
                  : "size-2 rounded-full bg-white/40 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* Bottom-Right Circular Glass Navigation Arrows (Exact Astrotalk Screenshot 2) */}
        {slides.length > 1 && (
          <div className="absolute bottom-5 sm:bottom-7 right-6 sm:right-12 flex items-center gap-2 z-20">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="size-9 sm:size-10 rounded-full bg-black/30 hover:bg-black/60 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-105 cursor-pointer shadow-lg"
            >
              <ChevronLeft className="size-4 sm:size-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="size-9 sm:size-10 rounded-full bg-black/30 hover:bg-black/60 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-105 cursor-pointer shadow-lg"
            >
              <ChevronRight className="size-4 sm:size-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
