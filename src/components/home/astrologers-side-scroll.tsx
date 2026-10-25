"use client";

/**
 * "Verified Astrologers Online Now" on the home page.
 *
 * Every card here is a real astrologer out of MongoDB, and the green Online
 * badge is the live one. The list is fetched once over REST and then kept true
 * by the live socket: `RealtimeProvider` patches any query cached under a key
 * beginning "astrologer", so the moment someone opens or closes their panel the
 * badge here follows, with no refetch and no polling.
 *
 * Presence is fetched *unfiltered* on purpose. Asking the API for online-only
 * would give a list that cannot grow — somebody coming online later would not
 * be in it to be patched, and the section would stay wrong until a reload. So
 * the whole top slice is fetched and the sorting is done here against live
 * presence, which is also what makes going offline instant.
 *
 * The backend already orders the directory online-first, so the top slice is
 * where the online astrologers are.
 */

import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo, useRef, useState } from "react";

import { Avatar, Button } from "@/components/ui";
import { astrologerApi } from "@/lib/api";
import { cn, coinsPerMinute, formatNumber } from "@/lib/utils";
import { usePlatform } from "@/providers/realtime-provider";
import { SKILL_LABELS, type AstrologerPublic } from "@/types";

/** How many to pull. The directory is sorted online-first, so this is the top of it. */
const POOL_SIZE = 24;

/**
 * Initials, for an astrologer who has not uploaded a photo. `Avatar` already
 * derives these, but the card wants them on its own coloured tile.
 */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * A stable colour per astrologer.
 *
 * Chosen from the id rather than the list position, so a card does not change
 * colour when someone else goes online and the order shifts.
 */
const TILE_GRADIENTS = [
  "from-amber-600 to-amber-800",
  "from-purple-600 to-indigo-800",
  "from-orange-600 to-red-800",
  "from-rose-600 to-pink-800",
  "from-teal-600 to-emerald-800",
  "from-sky-600 to-blue-800",
];

function gradientFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return TILE_GRADIENTS[Math.abs(hash) % TILE_GRADIENTS.length];
}

type Status = "online" | "busy" | "offline";

function statusOf(astrologer: AstrologerPublic): Status {
  if (!astrologer.availability.is_online) return "offline";
  return astrologer.availability.is_busy ? "busy" : "online";
}

/** Online first, then busy, then everyone else — keeping the server's order within each. */
const STATUS_RANK: Record<Status, number> = { online: 0, busy: 1, offline: 2 };

function AstrologerCardSkeleton() {
  return (
    <div className="shrink-0 w-[290px] sm:w-[320px] rounded-2xl border border-[#ebd7c8] bg-[#fdfaf5] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="size-14 sm:size-16 rounded-2xl bg-[#f0e2d5] animate-pulse" />
        <div className="h-6 w-16 rounded-full bg-[#f0e2d5] animate-pulse" />
      </div>
      <div className="mt-4 h-5 w-3/4 rounded bg-[#f0e2d5] animate-pulse" />
      <div className="mt-2 h-3.5 w-2/3 rounded bg-[#f4e9de] animate-pulse" />
      <div className="mt-3.5 flex gap-1.5">
        <div className="h-5 w-16 rounded-md bg-[#f4e9de] animate-pulse" />
        <div className="h-5 w-20 rounded-md bg-[#f4e9de] animate-pulse" />
      </div>
      <div className="mt-3 h-3.5 w-1/2 rounded bg-[#f4e9de] animate-pulse" />
      <div className="mt-5 pt-3.5 border-t border-[#f0e2d5] flex items-center justify-between">
        <div className="h-8 w-20 rounded bg-[#f0e2d5] animate-pulse" />
        <div className="h-9 w-24 rounded bg-[#f0e2d5] animate-pulse" />
      </div>
    </div>
  );
}

export function AstrologersSideScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Keyed under "astrologers" so RealtimeProvider finds and patches it.
  const { data, isLoading, isError } = useQuery({
    queryKey: ["astrologers", { home: true, limit: POOL_SIZE }],
    queryFn: () => astrologerApi.list({ limit: POOL_SIZE }),
    // The socket keeps this fresh, so there is nothing to gain from refetching
    // on every focus — and a refetch would briefly show the REST snapshot's
    // stale presence over the live one.
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  const platform = usePlatform();
  // Rates are held in coins; the card shows rupees. 1 is the platform default
  // and the live value lands within the first socket message.
  const coinsPerRupee = platform?.coins_per_rupee ?? 1;

  const astrologers = useMemo(() => {
    const items = data?.items ?? [];
    return [...items].sort((a, b) => STATUS_RANK[statusOf(a)] - STATUS_RANK[statusOf(b)]);
  }, [data]);

  const onlineCount = useMemo(
    () => astrologers.filter((a) => statusOf(a) === "online").length,
    [astrologers],
  );

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

  // Nothing to show at all is better said plainly than papered over with a
  // section that looks broken.
  if (!isLoading && (isError || astrologers.length === 0)) {
    return null;
  }

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
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-cinzel text-2xl sm:text-4xl font-bold tracking-tight text-[#4D4664]">
                Verified Astrologers Online Now
              </h2>
              {onlineCount > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/10 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-600/20">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-600" />
                  </span>
                  {onlineCount} online
                </span>
              )}
            </div>
            <p className="mt-2 text-xs sm:text-sm text-[#665e75] max-w-xl">
              {onlineCount > 0
                ? "Connect instantly via real-time private chat or audio call. Rigorously vetted with transparent per-minute rates."
                : "Nobody is at their desk this minute. Browse their profiles and book a time that suits you."}
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
          {isLoading
            ? Array.from({ length: 4 }, (_, i) => <AstrologerCardSkeleton key={i} />)
            : astrologers.map((astro) => {
                const status = statusOf(astro);
                const href = `/astrologers/${astro.slug ?? astro.id}`;
                const primaryMode = astro.modes_enabled.includes("chat")
                  ? "chat"
                  : (astro.modes_enabled[0] ?? "chat");
                const rupeesPerMinute = Math.round(
                  coinsPerMinute(astro.rates, primaryMode) / coinsPerRupee,
                );
                const chips = astro.skills.slice(0, 3).map((s) => SKILL_LABELS[s] ?? s);
                const canCall = astro.modes_enabled.includes("call");

                return (
                  <div
                    key={astro.id}
                    className="group shrink-0 snap-start w-[290px] sm:w-[320px] rounded-2xl border border-[#ebd7c8] bg-[#fdfaf5] p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_28px_-6px_rgba(176,109,78,0.2)] flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: Avatar & Status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="relative">
                          {/* One tile either way, so a photo and a set of
                              initials sit in exactly the same shape. */}
                          <div
                            className={cn(
                              "flex size-14 sm:size-16 items-center justify-center overflow-hidden rounded-2xl shadow-sm",
                              !astro.profile_image_url &&
                                `bg-gradient-to-tr ${gradientFor(astro.id)}`,
                            )}
                          >
                            {astro.profile_image_url ? (
                              <Avatar
                                src={astro.profile_image_url}
                                name={astro.display_name}
                                size="lg"
                                className="size-full rounded-none ring-0 shadow-none"
                              />
                            ) : (
                              <span className="font-cinzel text-lg font-bold text-white sm:text-xl">
                                {initialsOf(astro.display_name)}
                              </span>
                            )}
                          </div>

                          {/* Live status badge — this is the real one. */}
                          <span
                            className={cn(
                              "absolute -bottom-1 -right-1 flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm ring-2 ring-white transition-colors duration-300",
                              status === "online" && "bg-emerald-600",
                              status === "busy" && "bg-amber-500",
                              status === "offline" && "bg-stone-400",
                            )}
                          >
                            {status === "online" && (
                              <span className="size-1.5 rounded-full bg-emerald-200 animate-pulse" />
                            )}
                            {status === "online"
                              ? "Online"
                              : status === "busy"
                                ? "Busy"
                                : "Offline"}
                          </span>
                        </div>

                        <div className="text-right">
                          {astro.rating.count > 0 && (
                            <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-500/20">
                              <Star className="size-3.5 fill-amber-500 text-amber-500" />
                              <span>{astro.rating.average.toFixed(2)}</span>
                            </div>
                          )}
                          {astro.total_consultations > 0 && (
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              {formatNumber(astro.total_consultations)}+ orders
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Name & Title */}
                      <div className="mt-4">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#4D4664] group-hover:text-[#b06d4e] transition-colors line-clamp-1">
                            {astro.display_name}
                          </h3>
                          <span title="Verified Astrologer">
                            <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                          </span>
                        </div>
                        {astro.tagline && (
                          <p className="mt-0.5 text-xs text-[#716580] line-clamp-1 font-medium">
                            {astro.tagline}
                          </p>
                        )}
                      </div>

                      {/* Skills Chips */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {chips.map((s) => (
                          <span
                            key={s}
                            className="rounded-md bg-[#f4e9de] px-2 py-0.5 text-[10px] font-semibold text-[#5a4c66]"
                          >
                            {s}
                          </span>
                        ))}
                        {astro.experience_years > 0 && (
                          <span className="rounded-md bg-[#fdf3e7] border border-[#ebd7c8] px-2 py-0.5 text-[10px] font-medium text-[#7d6f85]">
                            {astro.experience_years} yrs exp
                          </span>
                        )}
                      </div>

                      {/* Languages */}
                      {astro.languages.length > 0 && (
                        <p className="mt-3 text-[11px] text-[#867b90] line-clamp-1">
                          <span className="font-medium text-[#5c4f69]">Languages: </span>
                          {astro.languages.join(", ")}
                        </p>
                      )}
                    </div>

                    {/* Bottom: Pricing & Call to Action */}
                    <div className="mt-5 pt-3.5 border-t border-[#f0e2d5] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                          Rate
                        </span>
                        <div className="text-sm sm:text-base font-bold text-[#b06d4e]">
                          ₹{formatNumber(rupeesPerMinute)}
                          <span className="text-xs font-normal text-muted-foreground">/min</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={href}>
                          <Button
                            size="sm"
                            className="h-9 px-3.5 text-xs font-semibold bg-[#b06d4e] hover:bg-[#97583c] text-white shadow-sm flex items-center gap-1.5"
                          >
                            <MessageSquare className="size-3.5" />
                            Chat
                          </Button>
                        </Link>
                        {canCall && (
                          <Link href={href}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-9 px-3 text-xs font-semibold border-[#d6b7a2] text-[#4D4664] hover:bg-[#faebd9]"
                            >
                              <Phone className="size-3.5 text-[#b06d4e]" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

      </div>
    </section>
  );
}
