"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, MessageSquare, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui";

interface FeaturedAstrologer {
  id: string;
  name: string;
  title: string;
  skills: string[];
  experience: number;
  languages: string[];
  rating: number;
  reviewsCount: number;
  pricePerMinute: number;
  isOnline: boolean;
  avatarBg: string;
  initials: string;
}

const FEATURED_ASTROLOGERS: FeaturedAstrologer[] = [
  {
    id: "pandit-sharma",
    name: "Acharya R. K. Sharma",
    title: "Vedic Astrology & Vastu Gold Medalist",
    skills: ["Vedic", "Kundli", "Vastu"],
    experience: 18,
    languages: ["Hindi", "English", "Sanskrit"],
    rating: 4.98,
    reviewsCount: 3420,
    pricePerMinute: 25,
    isOnline: true,
    avatarBg: "from-amber-600 to-amber-800",
    initials: "AS",
  },
  {
    id: "dr-priya-mukherjee",
    name: "Dr. Priya Mukherjee",
    title: "KP System & Marriage Compatibility Specialist",
    skills: ["KP System", "Matchmaking", "Prashna"],
    experience: 14,
    languages: ["Bengali", "English", "Hindi"],
    rating: 4.95,
    reviewsCount: 2890,
    pricePerMinute: 22,
    isOnline: true,
    avatarBg: "from-purple-600 to-indigo-800",
    initials: "PM",
  },
  {
    id: "swami-anand",
    name: "Swami Anand Shastri",
    title: "Nakshatra Dasha & Gemstone Consultant",
    skills: ["Nakshatra", "Dasha", "Numerology"],
    experience: 22,
    languages: ["Hindi", "English"],
    rating: 4.99,
    reviewsCount: 4510,
    pricePerMinute: 30,
    isOnline: true,
    avatarBg: "from-orange-600 to-red-800",
    initials: "SA",
  },
  {
    id: "tarot-ananya",
    name: "Ananya Roy",
    title: "Tarot Reader & Intuitive Life Coach",
    skills: ["Tarot", "Love & Career", "Face Reading"],
    experience: 9,
    languages: ["English", "Hindi", "Bengali"],
    rating: 4.92,
    reviewsCount: 1740,
    pricePerMinute: 18,
    isOnline: true,
    avatarBg: "from-rose-600 to-pink-800",
    initials: "AR",
  },
  {
    id: "guruji-venkat",
    name: "Pt. Venkatramana Rao",
    title: "South Indian Jathakam & Prashna Astrologer",
    skills: ["Vedic", "Jathakam", "Remedies"],
    experience: 25,
    languages: ["Telugu", "Tamil", "English", "Hindi"],
    rating: 4.97,
    reviewsCount: 3980,
    pricePerMinute: 28,
    isOnline: true,
    avatarBg: "from-amber-700 to-stone-900",
    initials: "VR",
  },
  {
    id: "meera-kapoor",
    name: "Meera Kapoor",
    title: "Chaldean Numerology & Career Astrologer",
    skills: ["Numerology", "Career", "Kundli"],
    experience: 11,
    languages: ["Hindi", "English"],
    rating: 4.91,
    reviewsCount: 1530,
    pricePerMinute: 20,
    isOnline: true,
    avatarBg: "from-teal-600 to-emerald-800",
    initials: "MK",
  },
];

export function AstrologersSideScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 360;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden py-14 sm:py-20 bg-[#fffaf5]">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[#b06d4e] mb-2">
              <Sparkles className="size-4" />
              <span className="text-xs sm:text-sm font-serif italic tracking-wide font-medium">
                Live Consultations
              </span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold tracking-tight text-[#4D4664]">
              Verified Astrologers Online Now
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#665e75] max-w-xl">
              Connect instantly via real-time private chat or audio call. Rigorously vetted with transparent per-minute rates.
            </p>
          </div>

          {/* Right Navigation & View All Link */}
          <div className="flex items-center gap-3">
            <Link
              href="/astrologers"
              className="text-xs sm:text-sm font-semibold text-[#b06d4e] hover:underline mr-2"
            >
              View All Astrologers →
            </Link>

            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous Astrologer"
              className={`flex size-10 items-center justify-center rounded-full border border-[#d6b7a2] bg-[#fbf1e7] text-[#4D4664] transition-all duration-200 hover:bg-[#faebd9] hover:scale-105 active:scale-95 ${
                !canScrollLeft ? "opacity-40 cursor-not-allowed" : "shadow-sm"
              }`}
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Next Astrologer"
              className={`flex size-10 items-center justify-center rounded-full border border-[#d6b7a2] bg-[#fbf1e7] text-[#4D4664] transition-all duration-200 hover:bg-[#faebd9] hover:scale-105 active:scale-95 ${
                !canScrollRight ? "opacity-40 cursor-not-allowed" : "shadow-sm"
              }`}
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {/* Side-Scroll Track with Cards */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="scrollbar-none flex gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory"
          style={{ scrollBehavior: "smooth" }}
        >
          {FEATURED_ASTROLOGERS.map((astro) => (
            <div
              key={astro.id}
              className="group shrink-0 snap-start w-[290px] sm:w-[320px] rounded-2xl border border-[#ebd7c8] bg-[#fdfaf5] p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_28px_-6px_rgba(176,109,78,0.2)] flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Avatar & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="relative">
                    <div
                      className={`flex size-14 sm:size-16 items-center justify-center rounded-2xl bg-gradient-to-tr ${astro.avatarBg} text-white font-cinzel text-lg sm:text-xl font-bold shadow-sm`}
                    >
                      {astro.initials}
                    </div>
                    {/* Live Online Badge */}
                    {astro.isOnline && (
                      <span className="absolute -bottom-1 -right-1 flex items-center gap-1 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                        <span className="size-1.5 rounded-full bg-emerald-200 animate-pulse" />
                        Online
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-500/20">
                      <Star className="size-3.5 fill-amber-500 text-amber-500" />
                      <span>{astro.rating}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {astro.reviewsCount.toLocaleString()}+ orders
                    </p>
                  </div>
                </div>

                {/* Name & Title */}
                <div className="mt-4">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#4D4664] group-hover:text-[#b06d4e] transition-colors">
                      {astro.name}
                    </h3>
                    <span title="Verified Astrologer">
                      <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#716580] line-clamp-1 font-medium">
                    {astro.title}
                  </p>
                </div>

                {/* Skills Chips */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {astro.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-[#f4e9de] px-2 py-0.5 text-[10px] font-semibold text-[#5a4c66]"
                    >
                      {s}
                    </span>
                  ))}
                  <span className="rounded-md bg-[#fdf3e7] border border-[#ebd7c8] px-2 py-0.5 text-[10px] font-medium text-[#7d6f85]">
                    {astro.experience} yrs exp
                  </span>
                </div>

                {/* Languages */}
                <p className="mt-3 text-[11px] text-[#867b90] line-clamp-1">
                  <span className="font-medium text-[#5c4f69]">Languages: </span>
                  {astro.languages.join(", ")}
                </p>
              </div>

              {/* Bottom: Pricing & Call to Action */}
              <div className="mt-5 pt-3.5 border-t border-[#f0e2d5] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    Rate
                  </span>
                  <div className="text-sm sm:text-base font-bold text-[#b06d4e]">
                    ₹{astro.pricePerMinute}
                    <span className="text-xs font-normal text-muted-foreground">/min</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/astrologers/${astro.id}`}>
                    <Button
                      size="sm"
                      className="h-9 px-3.5 text-xs font-semibold bg-[#b06d4e] hover:bg-[#97583c] text-white shadow-sm flex items-center gap-1.5"
                    >
                      <MessageSquare className="size-3.5" />
                      Chat
                    </Button>
                  </Link>
                  <Link href={`/astrologers/${astro.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 px-3 text-xs font-semibold border-[#d6b7a2] text-[#4D4664] hover:bg-[#faebd9]"
                    >
                      <Phone className="size-3.5 text-[#b06d4e]" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
