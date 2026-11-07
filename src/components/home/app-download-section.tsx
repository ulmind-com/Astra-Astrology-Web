"use client";

import React from "react";
import Image from "next/image";
import { MessageCircle, ShieldCheck, Check, Phone, ChevronLeft, Send } from "lucide-react";

// Chat bubbles that animate in one by one (same as the video).
type ChatMsg = {
  from: "user" | "astrologer";
  text: string;
  time?: string;
};

const CHAT_SCRIPT: ChatMsg[] = [
  { from: "user", text: "Aryan ji, when will I get married? My family is asking." },
  { from: "astrologer", text: "Hi Priya ji, Share your date of birth & time first." },
  { from: "user", text: "14 March 1998, 4:25 AM, Lucknow" },
];

const REVEAL_MS = 1400;

function AppStoreBadge() {
  return (
    <a
      href="#"
      aria-label="Download on the App Store"
      className="inline-flex items-center gap-3 rounded-xl bg-black px-4.5 py-2 text-white shadow-md hover:bg-zinc-900 transition-all duration-200 hover:scale-[1.02] border border-white/15"
    >
      <Image
        src="/images/badges/apple-store-icon-white.png"
        alt="Apple App Store"
        width={28}
        height={28}
        className="size-7 shrink-0 object-contain"
      />
      <span className="flex flex-col text-left">
        <span className="text-[10px] font-medium tracking-tight text-zinc-300 leading-tight">Download on the</span>
        <span className="text-[16px] font-bold tracking-tight text-white leading-snug">App Store</span>
      </span>
    </a>
  );
}

function GooglePlayBadge() {
  return (
    <a
      href="#"
      aria-label="Get it on Google Play"
      className="inline-flex items-center gap-3 rounded-xl bg-black px-4.5 py-2 text-white shadow-md hover:bg-zinc-900 transition-all duration-200 hover:scale-[1.02] border border-white/15"
    >
      <Image
        src="/images/badges/google-play-icon.png"
        alt="Google Play"
        width={26}
        height={26}
        className="size-[26px] shrink-0 object-contain"
      />
      <span className="flex flex-col text-left">
        <span className="text-[10px] font-medium tracking-tight text-zinc-300 leading-tight">GET IT ON</span>
        <span className="text-[16px] font-bold tracking-tight text-white leading-snug">Google Play</span>
      </span>
    </a>
  );
}

export function AppDownloadSection() {
  const [visible, setVisible] = React.useState<number>(0);
  const [typing, setTyping] = React.useState<boolean>(false);

  // Reveal chat bubbles one by one, with a typing pause, then loop.
  React.useEffect(() => {
    let active = true;
    const timers: number[] = [];

    const run = () => {
      if (!active) return;
      setVisible(0);
      CHAT_SCRIPT.forEach((_, i) => {
        timers.push(
          window.setTimeout(() => {
            if (!active) return;
            setTyping(true);
            timers.push(
              window.setTimeout(() => {
                if (!active) return;
                setTyping(false);
                setVisible(i + 1);
              }, 500)
            );
          }, i * REVEAL_MS)
        );
      });
      // typing indicator after last message, then restart
      timers.push(
        window.setTimeout(() => {
          if (!active) return;
          setTyping(true);
        }, CHAT_SCRIPT.length * REVEAL_MS)
      );
      timers.push(
        window.setTimeout(() => {
          if (!active) return;
          setTyping(false);
          run();
        }, CHAT_SCRIPT.length * REVEAL_MS + 2200)
      );
    };

    run();
    return () => {
      active = false;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fdf4b8] to-[#fbeea0] py-14 sm:py-20 border-b border-[#f2e9b0]/60">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* LEFT: copy + features + store badges */}
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#c2410c]">
              The DivinLink App
            </span>
            <h2 className="mt-3 text-4xl font-bold leading-[1.08] tracking-tight text-[#1a1208] sm:text-5xl">
              Astrology made simpler,
              <br />
              and available to you{" "}
              <span className="text-[#e2561f]">24×7</span>.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#5f5640] sm:text-base">
              Connect with an astrologer anytime, and find the solutions to all your love,
              marriage, career, and finance related problems instantly.
            </p>

            <ul className="mt-7 space-y-4">
              <li className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-white text-[#c2410c] shadow-xs">
                  <MessageCircle className="size-[18px]" />
                </span>
                <span className="text-sm font-medium text-[#3b3425] sm:text-base">
                  Instant chats, notifications, and alerts
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-white text-[#15803d] shadow-xs">
                  <ShieldCheck className="size-[18px]" />
                </span>
                <span className="text-sm font-medium text-[#3b3425] sm:text-base">
                  Secure payments, UPI, cards &amp; wallet, all encrypted
                </span>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <AppStoreBadge />
              <GooglePlayBadge />
            </div>
          </div>

          {/* RIGHT: phone chat mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-[300px] rounded-[2.75rem] border-[10px] border-[#1c1c1e] bg-[#1c1c1e] shadow-[0_30px_70px_-30px_rgba(60,40,0,0.55)] sm:w-[330px]">
              {/* notch */}
              <div className="absolute left-1/2 top-0 z-10 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-[#1c1c1e]" />
              {/* screen */}
              <div className="flex h-[560px] flex-col overflow-hidden rounded-[2.1rem] bg-[#f4f3f2] sm:h-[600px]">
                {/* status bar */}
                <div className="flex items-center justify-between px-5 pt-3 text-[11px] font-semibold text-[#1a1208]">
                  <span>9:41</span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2.5 w-3.5 rounded-sm bg-[#1a1208]/80" />
                    <span className="inline-block h-2.5 w-2 rounded-sm bg-[#1a1208]/60" />
                  </span>
                </div>

                {/* chat header */}
                <div className="flex items-center gap-2.5 border-b border-black/5 bg-white px-4 py-2.5">
                  <ChevronLeft className="size-5 text-[#6b5f4d]" />
                  <Image
                    src="/images/astrologers/avatar-chat.png"
                    alt="Astro Aryan"
                    width={36}
                    height={36}
                    className="size-9 rounded-full object-cover"
                    priority
                  />
                  <div className="flex-1 leading-tight">
                    <div className="flex items-center gap-1 text-sm font-bold text-[#1a1208]">
                      Astro Aryan
                      <Check className="size-3.5 rounded-full bg-[#1d9bf0] p-0.5 text-white" />
                    </div>
                    <div className="text-[11px] font-medium text-[#8b7d63]">
                      <span className="text-[#15803d]">online</span> · ₹18/min
                    </div>
                  </div>
                  <span className="flex size-8 items-center justify-center rounded-full bg-[#fcd404] text-[#1c1304]">
                    <Phone className="size-4" />
                  </span>
                </div>

                {/* messages */}
                <div className="flex flex-1 flex-col gap-2.5 overflow-hidden bg-[#f4f3f2] px-3.5 py-4">
                  <div className="mx-auto rounded-full bg-black/5 px-2.5 py-0.5 text-[10px] font-medium text-[#8b7d63]">
                    Today · 9:38 AM
                  </div>

                  {CHAT_SCRIPT.map((m, i) => {
                    if (i >= visible) return null;
                    const isUser = m.from === "user";
                    return (
                      <div
                        key={i}
                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[78%] rounded-2xl px-3 py-2 text-[12.5px] leading-snug shadow-xs ${
                            isUser
                              ? "rounded-br-sm bg-[#fdf3a6] text-[#3b3425]"
                              : "rounded-bl-sm bg-white text-[#3b3425]"
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    );
                  })}

                  {typing && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-3 py-2.5 shadow-xs">
                        <span className="size-1.5 animate-bounce rounded-full bg-[#b8ab8f] [animation-delay:-0.2s]" />
                        <span className="size-1.5 animate-bounce rounded-full bg-[#b8ab8f] [animation-delay:-0.1s]" />
                        <span className="size-1.5 animate-bounce rounded-full bg-[#b8ab8f]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* input bar */}
                <div className="flex items-center gap-2 border-t border-black/5 bg-white px-3 py-2.5">
                  <div className="flex-1 rounded-full bg-[#f0efed] px-3.5 py-2 text-[12px] text-[#9a8f78]">
                    Type a message…
                  </div>
                  <span className="flex size-9 items-center justify-center rounded-full bg-[#fcd404] text-[#1c1304]">
                    <Send className="size-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
