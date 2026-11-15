"use client";

import * as React from "react";
import Link from "next/link";
import { Coins, PhoneCall, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { MovingBorderContainer } from "@/components/ui/moving-border";

export function CashbackPromoBanner() {
  const { language } = useLanguage();

  return (
    <MovingBorderContainer
      borderRadius="1.75rem"
      duration={4000}
      borderClassName="bg-[radial-gradient(#fcd404_40%,#10b981_60%,transparent_80%)] size-28"
      containerClassName="w-full"
      className="p-0"
    >
      <div className="relative w-full overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-[#0c241b] via-[#123326] to-[#081812] p-6 sm:p-10 text-white shadow-2xl">
      <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-4 right-8 text-8xl font-serif text-emerald-500/10 select-none">
        ₹
      </div>

      <div className="relative z-10 max-w-3xl space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-200">
          <Coins className="size-4 text-amber-300 animate-bounce" />
          <span>{language === "bn" ? "অদ্বিতীয় অফার • ১০০% ওয়ালেট ক্যাশব্যাক" : "FESTIVE CASHBACK OFFER • 100% In Wallet"}</span>
        </div>

        <h2 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-emerald-100 tracking-tight leading-tight">
          {language === "bn"
            ? "প্রতিটি প্রিপেইড অর্ডারে ১০০% টাকা আপনার ওয়ালেটে ফেরত পান!"
            : "Get 100% Cashback in Your Astra Wallet on All Prepaid Orders!"}
        </h2>

        <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed font-medium">
          {language === "bn"
            ? "আপনি যে মূল্যের রুদ্রাক্ষ বা রত্ন কিনবেন, সেই সমমূল্যের কয়েন সরাসরি আপনার Astra Consultation Wallet-এ জমা হবে। যা দিয়ে আপনি ভারতের শীর্ষ জ্যোতিষীদের সাথে লাইভ কল বা চ্যাট করতে পারবেন!"
            : "Every rupee you spend on sacred remedies is 100% credited back to your Astra Wallet as coins. Use them freely to talk or chat with top certified Vedic astrologers!"}
        </p>

        {/* 3 Step Process */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="rounded-2xl bg-white/10 backdrop-blur-xs p-3.5 border border-white/10 space-y-1">
            <span className="size-6 rounded-full bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center">
              1
            </span>
            <h4 className="font-bold text-xs text-white">
              {language === "bn" ? "পণ্য পছন্দ করুন" : "Shop Sacred Remedy"}
            </h4>
            <p className="text-[11px] text-emerald-200/70">
              {language === "bn" ? "রুদ্রাক্ষ, পায়রাইট বা ব্রেসলেট কার্টে যোগ করুন।" : "Select authentic energized crystals & gemstones."}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 backdrop-blur-xs p-3.5 border border-white/10 space-y-1">
            <span className="size-6 rounded-full bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center">
              2
            </span>
            <h4 className="font-bold text-xs text-white">
              {language === "bn" ? "অনলাইনে পে করুন" : "Pay Online at Checkout"}
            </h4>
            <p className="text-[11px] text-emerald-200/70">
              {language === "bn" ? "UPI, GPay বা কার্ডের মাধ্যমে সম্পূর্ণ নিরাপদ পেমেন্ট।" : "Pay securely via UPI, Cards, or Net Banking."}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 backdrop-blur-xs p-3.5 border border-white/10 space-y-1">
            <span className="size-6 rounded-full bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center">
              3
            </span>
            <h4 className="font-bold text-xs text-white">
              {language === "bn" ? "১০০% ক্যাশব্যাক পান" : "Instant 100% Cashback"}
            </h4>
            <p className="text-[11px] text-emerald-200/70">
              {language === "bn" ? "ওয়ালেটের কয়েন দিয়ে সরাসরি অ্যাস্ট্রোলজারের সাথে কথা বলুন।" : "Consult top astrologers using credited wallet balance."}
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-4 flex-wrap">
          <Link
            href="/astrologers"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-2 transition-transform hover:scale-102"
          >
            <PhoneCall className="size-3.5" />
            <span>{language === "bn" ? "আমাদের জ্যোতিষীদের দেখুন" : "Meet Our Astrologers"}</span>
          </Link>
          <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-400" />
            <span>{language === "bn" ? "স্বয়ংক্রিয় ও তাৎক্ষণিক ক্রেডিট" : "Automatic & Instant Credit"}</span>
          </span>
        </div>
      </div>
    </div>
  </MovingBorderContainer>
);
}
