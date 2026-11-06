"use client";

import { useQuery } from "@tanstack/react-query";
import {
  MessageCircle,
  Phone,
  Radio,
  Send,
  Sparkles,
  Users,
  Video,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";

import { astrologerApi } from "@/lib/api";
import { useLanguage } from "@/providers/language-provider";
import { SKILL_LABELS } from "@/types";

interface DisplayLiveExpert {
  id: string;
  name: string;
  avatarUrl?: string | null;
  topic: string;
  viewers: number;
  category: string;
  isOnline: boolean;
  slug: string;
  canCall: boolean;
  canChat: boolean;
}

export function FreeLiveExperts() {
  const { language } = useLanguage();
  const [followedIds, setFollowedIds] = useState<Record<string, boolean>>({});
  const [activeModalExpert, setActiveModalExpert] = useState<DisplayLiveExpert | null>(null);
  const [userComment, setUserComment] = useState("");
  const [comments, setComments] = useState<Array<{ name: string; text: string }>>([
    { name: "Pooja S.", text: "Namaste! When will my career shift happen?" },
    { name: "Rahul V.", text: "Please tell me about marriage yog in my kundli." },
    { name: "Ananya M.", text: "Your reading was so accurate! ❤️" },
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

  const { data, isLoading } = useQuery({
    queryKey: ["astrologers", { liveExperts: true, limit: 10 }],
    queryFn: () => astrologerApi.list({ limit: 10 }),
    staleTime: 60_000,
  });

  const liveExperts = useMemo<DisplayLiveExpert[]>(() => {
    const items = data?.items ?? [];
    return items.map((astro) => {
      const skills = (astro.skills ?? []).map((s) => SKILL_LABELS[s] ?? s);
      const category = skills[0] || "Vedic Astrology";
      const topic =
        astro.tagline ||
        (skills.length > 0
          ? `${skills.slice(0, 2).join(" & ")} Guidance`
          : "Live Q&A & Remedies");
      const viewers = Math.max(
        120,
        astro.total_consultations * 24 ||
          (astro.rating?.count ? astro.rating.count * 18 : 280),
      );

      return {
        id: astro.id,
        name: astro.display_name,
        avatarUrl: astro.profile_image_url,
        topic,
        viewers,
        category,
        isOnline: Boolean(astro.availability?.is_online),
        slug: astro.slug ?? astro.id,
        canCall: astro.modes_enabled?.includes("call") ?? false,
        canChat: astro.modes_enabled?.includes("chat") ?? false,
      };
    });
  }, [data]);

  return (
    <section id="live-experts" className="relative bg-transparent py-8 sm:py-12 border-b border-[#f2e9b0]/60">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl lg:text-[1.75rem] font-bold tracking-tight text-[#1a1208]">
              {language === "bn" ? "অ্যাস্ট্রা লাইভ বিশেষজ্ঞ" : language === "hi" ? "एस्ट्रा लाइव विशेषज्ञ" : "Free Live Experts"}
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
            {language === "bn" ? "সব দেখুন" : language === "hi" ? "सभी देखें" : "View All"}
          </Link>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-gradient-to-b from-[#1e1730] to-[#0d0917] border border-[#ffdb4d]/20 p-4 h-64 animate-pulse flex flex-col items-center justify-between"
              >
                <div className="size-16 rounded-full bg-white/10" />
                <div className="w-3/4 h-4 bg-white/10 rounded" />
                <div className="w-full h-8 bg-white/10 rounded-full" />
              </div>
            ))}
          </div>
        ) : liveExperts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#eadf9a] bg-[#fffdf5] p-8 text-center">
            <p className="text-sm font-semibold text-[#1a1208]">
              {language === "bn"
                ? "এই মুহূর্তে কোনো বিশেষজ্ঞ সরাসরি সম্প্রচার করছেন না।"
                : language === "hi"
                ? "इस समय कोई विशेषज्ञ लाइव नहीं हैं।"
                : "No live experts broadcasting at this moment."}
            </p>
            <p className="text-xs text-[#6b5f4d] mt-1">
              {language === "bn"
                ? "জ্যোতিষীরা অনলাইনে এলে এখানে স্বয়ংক্রিয়ভাবে প্রদর্শিত হবেন।"
                : language === "hi"
                ? "ऑनलाइन आने पर ज्योतिषी यहां दिखाई देंगे।"
                : "Astrologers appear here once added in the admin panel and online."}
            </p>
          </div>
        ) : (
          /* Live Cards Grid */
          <div className="scrollbar-none grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
            {liveExperts.map((expert) => {
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

                  {/* Top Badge: LIVE or UPCOMING */}
                  <div className="relative p-3.5 pb-2 flex justify-end">
                    {expert.isOnline ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-600/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ring-1 ring-white/20">
                        <span className="size-1.5 rounded-full bg-white animate-pulse" />
                        LIVE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-stone-700/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/80 shadow-sm ring-1 ring-white/10">
                        ONLINE
                      </span>
                    )}
                  </div>

                  {/* Center Content: Avatar + Follow + Name + Topic Bubble */}
                  <div className="relative px-3.5 flex flex-col items-center text-center">
                    {/* Circular Avatar with Glowing Ring */}
                    <div className="relative size-16 sm:size-18 rounded-full p-0.5 bg-gradient-to-tr from-[#ffd700] via-[#ff9900] to-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.4)]">
                      <div className="relative size-full rounded-full overflow-hidden bg-stone-900 flex items-center justify-center">
                        {expert.avatarUrl ? (
                          <Image
                            src={expert.avatarUrl}
                            alt={expert.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <span className="font-extrabold text-xl text-[#ffd700]">
                            {expert.name.charAt(0).toUpperCase()}
                          </span>
                        )}
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
                    <span>
                      {language === "bn" ? "এখনই দেখুন" : language === "hi" ? "अभी देखें" : "WATCH NOW"}
                    </span>
                    <span className="text-base leading-none">›</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
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
              {activeModalExpert.avatarUrl ? (
                <Image
                  src={activeModalExpert.avatarUrl}
                  alt={activeModalExpert.name}
                  fill
                  className="object-cover opacity-60 filter blur-xs"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-[#25183d] to-[#0c0717]" />
              )}
              <div className="relative z-10 flex flex-col items-center text-center p-6 bg-black/50 backdrop-blur-sm rounded-2xl border border-white/10 max-w-md mx-4">
                <div className="size-20 rounded-full border-2 border-gold-400 overflow-hidden mb-3 shadow-lg bg-stone-800 flex items-center justify-center">
                  {activeModalExpert.avatarUrl ? (
                    <Image
                      src={activeModalExpert.avatarUrl}
                      alt={activeModalExpert.name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  ) : (
                    <span className="font-bold text-2xl text-gold-400">
                      {activeModalExpert.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <h4 className="text-lg font-bold text-white">
                  {activeModalExpert.name} is Live!
                </h4>
                <p className="text-xs text-gold-300 font-medium mt-1">
                  Topic: &quot;{activeModalExpert.topic}&quot;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Link href={`/chat/${activeModalExpert.id}`}>
                    <button
                      type="button"
                      className="rounded-full bg-[#fcd404] hover:bg-[#e6be00] text-[#1c1304] font-bold text-xs px-5 py-2 shadow-md transition-transform hover:scale-105 flex items-center gap-1.5"
                    >
                      <MessageCircle className="size-3.5" />
                      <span>Chat Now</span>
                    </button>
                  </Link>
                  {activeModalExpert.canCall && (
                    <Link href={`/call/${activeModalExpert.id}`}>
                      <button
                        type="button"
                        className="rounded-full border border-teal-400 bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 font-bold text-xs px-5 py-2 shadow-md transition-colors flex items-center gap-1.5"
                      >
                        <Phone className="size-3.5" />
                        <span>Call Now</span>
                      </button>
                    </Link>
                  )}
                  <Link href={`/astrologers/${activeModalExpert.slug}`}>
                    <button
                      type="button"
                      className="rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs px-4 py-2 transition-colors"
                    >
                      View Profile
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
