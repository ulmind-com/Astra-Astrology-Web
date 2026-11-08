"use client";

import {
  Play,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useLanguage } from "@/providers/language-provider";

interface CelebrityVideo {
  id: string;
  name: string;
  role: string;
  title: string;
  duration: string;
  gradient: string;
  views: string;
}

const CELEBRITY_VIDEOS: CelebrityVideo[] = [
  {
    id: "rajkummar",
    name: "Rajkummar Rao",
    role: "National Award-winning Actor",
    title: "How Vedic Kundli Guidance Helped My Biggest Film Decisions",
    duration: "02:45",
    gradient: "from-[#241838] via-[#1c122e] to-[#0f091a]",
    views: "240K views",
  },
  {
    id: "shraddha",
    name: "Shraddha Kapoor",
    role: "Bollywood Actress",
    title: "Finding Balance & Inner Peace with Personal Horoscope Insights",
    duration: "03:12",
    gradient: "from-[#381c2b] via-[#26101c] to-[#12060d]",
    views: "385K views",
  },
  {
    id: "kartik",
    name: "Kartik Aaryan",
    role: "Bollywood Star",
    title: "Astrology & Timing: The Secret Power of Auspicious Beginnings",
    duration: "01:58",
    gradient: "from-[#1d263b] via-[#101826] to-[#070c14]",
    views: "195K views",
  },
];

export function CelebrityVideosSection() {
  const { language } = useLanguage();
  const [activeVideo, setActiveVideo] = useState<CelebrityVideo | null>(null);

  return (
    <section className="relative bg-transparent py-8 sm:py-12 border-b border-stone-200/80">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 border border-brand-300 px-3 py-1 text-xs font-bold text-[#8b5e0a] mb-2">
            <Sparkles className="size-3.5" />
            <span>
              {language === "bn"
                ? "তারকাদের দ্বারা বিশ্বস্ত"
                : language === "hi"
                ? "सेलिब्रिटीज का भरोसा"
                : "Trusted by Celebrities"}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-[1.75rem] font-bold tracking-tight text-[#1a1208]">
            {language === "bn"
              ? "সেলিব্রিটিদের অভিজ্ঞতা"
              : language === "hi"
              ? "सेलिब्रिटी अनुभव"
              : "Celebrity Videos"}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#6b5f4d]">
            {language === "bn"
              ? "দেখুন ভারতের বিশিষ্ট ব্যক্তিবর্গ কীভাবে জ্যোতিষীয় পরামর্শে জীবনে সঠিক পথ খুঁজে পেয়েছেন।"
              : language === "hi"
              ? "देखें भारत के जाने-माने व्यक्तित्वों ने कैसे पाया ज्योतिष से सही मार्गदर्शन।"
              : "Watch India's celebrated personalities talk about their life-changing consultations."}
          </p>
        </div>

        {/* 3 Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {CELEBRITY_VIDEOS.map((video) => (
            <div
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="group cursor-pointer relative overflow-hidden rounded-2xl border border-[#ebd881]/80 shadow-[0_6px_20px_-6px_rgba(26,18,8,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#fcd404] hover:shadow-[0_16px_36px_-10px_rgba(240,210,80,0.55)]"
            >
              {/* Video Backdrop Stage */}
              <div
                className={`relative aspect-[16/9] w-full bg-gradient-to-br ${video.gradient} flex items-center justify-center p-6`}
              >
                {/* Subtle cosmic stars effect */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(#ffdb4d_1px,transparent_1px)] [background-size:12px_12px]"
                  aria-hidden
                />

                {/* Top Duration Badge */}
                <div className="absolute top-3 right-3 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-xs">
                  {video.duration}
                </div>

                {/* Centered Glowing Play Button */}
                <div className="relative size-14 sm:size-16 rounded-full bg-[#fcd404] text-[#1c1304] flex items-center justify-center shadow-[0_0_25px_rgba(252,212,4,0.7)] transition-transform duration-300 group-hover:scale-115">
                  <Play className="size-6 sm:size-7 fill-current ml-0.5" />
                </div>

                {/* Bottom Left Celebrity Name Badge */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white drop-shadow-md">
                      {video.name}
                    </span>
                    <span className="text-[11px] text-gold-300 font-semibold drop-shadow-md">
                      {video.views}
                    </span>
                  </div>
                </div>
              </div>

              {/* Title & Description under video */}
              <div className="p-4 bg-white border-t border-stone-200/80">
                <span className="text-[11px] font-bold text-[#8b5e0a] uppercase tracking-wider block">
                  {video.role}
                </span>
                <h3 className="mt-1 font-bold text-sm sm:text-[15px] text-[#1a1208] group-hover:text-[#8b5e0a] transition-colors line-clamp-2 leading-snug">
                  &quot;{video.title}&quot;
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Playback Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-[#140e24] border border-[#ffdb4d]/40 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
              <div>
                <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">
                  {activeVideo.role}
                </span>
                <h4 className="text-base font-bold text-white">{activeVideo.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="rounded-full bg-white/10 p-1.5 text-white/80 hover:bg-white/20 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Video Canvas Simulation */}
            <div
              className={`relative aspect-video w-full bg-gradient-to-br ${activeVideo.gradient} flex flex-col items-center justify-center p-8 text-center`}
            >
              <div className="size-20 rounded-full bg-[#fcd404] text-[#1c1304] flex items-center justify-center shadow-glow mb-4">
                <Volume2 className="size-8" />
              </div>
              <p className="text-lg font-bold text-white max-w-md">
                &quot;{activeVideo.title}&quot;
              </p>
              <p className="mt-2 text-xs text-white/70">
                Exclusive celebrity testimonial for DivinLink Astrology Platform.
              </p>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="mt-5 rounded-full bg-[#fcd404] hover:bg-[#e6be00] text-[#1c1304] font-bold text-xs px-6 py-2.5 transition-transform hover:scale-105"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
