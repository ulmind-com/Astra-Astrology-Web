"use client";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  MessageCircle,
  Radio,
  Send,
  Sparkles,
  Users,
  Video,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface LiveExpert {
  id: string;
  name: string;
  avatarUrl: string;
  topic: string;
  viewers: number;
  category: string;
}

const LIVE_EXPERTS: LiveExpert[] = [
  {
    id: "shivanjali",
    name: "Tarot Shivanjali",
    avatarUrl: "/images/experts/expert-shivanjali-photo.jpg",
    topic: "Get your Ex Back?",
    viewers: 1420,
    category: "Love & Relationship",
  },
  {
    id: "daisy",
    name: "Tarot Daisy",
    avatarUrl: "/images/experts/expert-daisy-photo.jpg",
    topic: "Abundance Reading...",
    viewers: 980,
    category: "Career & Wealth",
  },
  {
    id: "dua",
    name: "Tarot Dua",
    avatarUrl: "/images/experts/expert-dua-photo.jpg",
    topic: "What does your card...",
    viewers: 1845,
    category: "Destiny & Life Path",
  },
  {
    id: "shivshakti",
    name: "Tarot Shivshakti",
    avatarUrl: "/images/experts/expert-shivshakti-photo.jpg",
    topic: "Is it 100% love?",
    viewers: 2130,
    category: "Soulmate Connection",
  },
  {
    id: "hridesh",
    name: "Astro Hridesh",
    avatarUrl: "/images/experts/expert-hridesh-photo.jpg",
    topic: "Sitaroon ki chaal",
    viewers: 1650,
    category: "Vedic Planetary Shifts",
  },
];

export function FreeLiveExperts() {
  const [followedIds, setFollowedIds] = useState<Record<string, boolean>>({});
  const [activeModalExpert, setActiveModalExpert] = useState<LiveExpert | null>(null);
  const [userComment, setUserComment] = useState("");
  const [comments, setComments] = useState<Array<{ name: string; text: string }>>([
    { name: "Pooja S.", text: "Namaste ma'am! When will my promotion happen?" },
    { name: "Rahul V.", text: "Please tell me about my marriage timing." },
    { name: "Ananya M.", text: "Your reading last week was so accurate! ❤️" },
  ]);

  const toggleFollow = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFollowedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;
    setComments((prev) => [...prev, { name: "You", text: userComment.trim() }]);
    setUserComment("");
  };

  return (
    <section id="live-experts" className="relative bg-white py-8 sm:py-12 border-b border-[#f2e9b0]/60">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl lg:text-[1.75rem] font-bold tracking-tight text-[#1a1208]">
              Free Live Experts
            </h2>
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-red-500" />
            </span>
          </div>

          <Link
            href="/astrologers"
            className="rounded-full border border-[#eadf9a] bg-[#fffdf5] px-4 py-1.5 text-xs sm:text-sm font-bold text-[#8b5e0a] hover:bg-[#fff7d1] hover:border-brand-400 transition-colors shadow-2xs"
          >
            View All
          </Link>
        </div>

        {/* 5 Live Cards Grid / Horizontal Scroll */}
        <div className="scrollbar-none grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
          {LIVE_EXPERTS.map((expert) => {
            const isFollowed = followedIds[expert.id];

            return (
              <div
                key={expert.id}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#1e1730] via-[#161026] to-[#0d0917] border border-[#ffdb4d]/40 shadow-[0_8px_24px_-6px_rgba(20,10,40,0.4)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-[#ffdb4d] hover:shadow-[0_16px_32px_-8px_rgba(255,219,77,0.3)]"
              >
                {/* Background astrological pattern overlay */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-15 bg-[radial-gradient(#ffdb4d_1px,transparent_1px)] [background-size:16px_16px]"
                  aria-hidden
                />

                {/* Top Badge: • LIVE */}
                <div className="relative p-3.5 pb-2 flex justify-end">
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-600/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ring-1 ring-white/20">
                    <span className="size-1.5 rounded-full bg-white animate-pulse" />
                    LIVE
                  </span>
                </div>

                {/* Center Content: Avatar + Follow + Name + Topic Bubble */}
                <div className="relative px-3.5 flex flex-col items-center text-center">
                  {/* Circular Avatar with Glowing Ring */}
                  <div className="relative size-16 sm:size-18 rounded-full p-0.5 bg-gradient-to-tr from-[#ffd700] via-[#ff9900] to-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.4)]">
                    <div className="relative size-full rounded-full overflow-hidden bg-stone-900">
                      <Image
                        src={expert.avatarUrl}
                        alt={expert.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  </div>

                  {/* Follow Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleFollow(expert.id, e)}
                    className={`mt-2 rounded-full px-3 py-0.5 text-[10px] font-bold transition-all shadow-xs ${
                      isFollowed
                        ? "bg-emerald-500 text-white"
                        : "bg-white/95 text-[#1a1208] hover:bg-white hover:scale-105"
                    }`}
                  >
                    {isFollowed ? "Following" : "+ Follow"}
                  </button>

                  {/* Name */}
                  <h3 className="mt-2 font-bold text-sm sm:text-[15px] text-white tracking-wide truncate w-full">
                    {expert.name}
                  </h3>

                  {/* Speech Bubble / Topic Pill */}
                  <div className="mt-2 mb-3.5 w-full">
                    <span className="inline-block w-full truncate rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-[#1a1208] shadow-xs">
                      {expert.topic}
                    </span>
                  </div>
                </div>

                {/* Bottom Full-Width Bold Button: WATCH NOW > */}
                <button
                  type="button"
                  onClick={() => setActiveModalExpert(expert)}
                  className="w-full bg-gradient-to-r from-[#ff4747] to-[#ff6b6b] hover:from-[#e53535] hover:to-[#f25252] py-2.5 text-center text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white shadow-md transition-all duration-200 flex items-center justify-center gap-1 group-hover:tracking-widest"
                >
                  <span>WATCH NOW</span>
                  <span className="text-base leading-none">›</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Live Stream Modal */}
      {activeModalExpert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-[#140e24] border border-[#ffdb4d]/40 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
                  <span className="size-1.5 rounded-full bg-white animate-pulse" />
                  LIVE
                </span>
                <span className="text-sm font-bold text-white">
                  {activeModalExpert.name}
                </span>
                <span className="text-xs text-white/60">
                  • {activeModalExpert.viewers.toLocaleString()} watching
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalExpert(null)}
                className="rounded-full bg-white/10 p-1.5 text-white/80 hover:bg-white/20 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Video Stage Simulation */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              <Image
                src={activeModalExpert.avatarUrl}
                alt={activeModalExpert.name}
                fill
                className="object-cover opacity-60 filter blur-xs"
              />
              <div className="relative z-10 flex flex-col items-center text-center p-6 bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="size-20 rounded-full border-2 border-gold-400 overflow-hidden mb-3 shadow-lg">
                  <Image
                    src={activeModalExpert.avatarUrl}
                    alt={activeModalExpert.name}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <h4 className="text-lg font-bold text-white">
                  {activeModalExpert.name} is Live!
                </h4>
                <p className="text-xs text-gold-300 font-medium mt-1">
                  Topic: &quot;{activeModalExpert.topic}&quot;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Link href={`/astrologers`}>
                    <button
                      type="button"
                      className="rounded-full bg-[#fcd404] hover:bg-[#e6be00] text-[#1c1304] font-bold text-xs px-5 py-2 shadow-md transition-transform hover:scale-105"
                    >
                      Call / Chat Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Live Chat Comments Strip */}
            <div className="p-4 bg-[#1a1230] border-t border-white/10">
              <div className="max-h-28 overflow-y-auto space-y-1.5 scrollbar-none text-xs text-white/90">
                {comments.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="font-bold text-gold-400">{c.name}:</span>
                    <span className="text-white/80">{c.text}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendComment} className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask a question in live session..."
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  className="flex-1 rounded-full bg-white/10 px-4 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-gold-400"
                />
                <button
                  type="submit"
                  className="rounded-full bg-gold-500 hover:bg-gold-600 p-2 text-white transition-colors"
                >
                  <Send className="size-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
