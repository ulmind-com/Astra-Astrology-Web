"use client";

/**
 * The astrologer's face in the chat — the animated mark, not a flat icon.
 *
 * Three things here are about not making the page worse to load.
 *
 * The player is imported dynamically with `ssr: false`. `lottie-web` reaches
 * for `document` as it initialises, so rendering it on the server throws; and
 * it is a heavy dependency that nothing on first paint needs.
 *
 * The animation JSON is fetched once and shared. The avatar appears beside
 * every assistant message, and letting each copy fetch and hold its own 25 KB
 * of keyframes would be twenty copies in a long conversation.
 *
 * It falls back to a static mark. If the fetch fails, or the player cannot
 * load, or the reader has asked for reduced motion, the chat still has a
 * perfectly good avatar rather than a hole where one should be.
 */

import dynamic from "next/dynamic";
import { Bot } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => null,
});

/** Shared across every avatar on the page: fetched once, held once. */
let cached: unknown | null = null;
let inFlight: Promise<unknown | null> | null = null;

function loadAnimation(): Promise<unknown | null> {
  if (cached) return Promise.resolve(cached);
  if (!inFlight) {
    inFlight = fetch("/ai-logo.json")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        cached = data;
        return data;
      })
      .catch(() => null)
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
}

/** Whether this reader has asked the system not to animate things. */
//
//  Read through `useSyncExternalStore` rather than an effect: the value exists
//  before the first paint in the browser and not at all on the server, which
//  is exactly the case that API is for. Setting it from an effect would mean a
//  frame of animation playing before it was switched off, for the one reader
//  who asked for no animation.
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function readMotionPreference(): boolean {
  return window.matchMedia(REDUCED_MOTION).matches;
}

export function AiAvatar({
  size = 44,
  className,
  /** Animate only while the astrologer is actually saying something. */
  active = true,
}: {
  size?: number;
  className?: string;
  active?: boolean;
}) {
  const [animation, setAnimation] = React.useState<unknown | null>(null);
  const still = React.useSyncExternalStore(
    subscribeToMotionPreference,
    readMotionPreference,
    // The server cannot know, and guessing "animate" matches what every other
    // reader gets.
    () => false,
  );

  React.useEffect(() => {
    let alive = true;
    loadAnimation().then((data) => {
      if (alive && data) setAnimation(data);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl",
        "bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 shadow-[0_4px_14px_rgba(217,119,6,0.35)] ring-1 ring-amber-300/50",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {animation ? (
        <Lottie
          animationData={animation}
          loop={active && !still}
          autoplay={!still}
          // The mark is drawn on its own background; letting it bleed to the
          // edges of the tile reads as part of the bubble rather than a sticker
          // sitting on it.
          style={{ width: "118%", height: "118%" }}
        />
      ) : (
        <Bot className="text-white" style={{ width: size * 0.5, height: size * 0.5 }} />
      )}
    </span>
  );
}
