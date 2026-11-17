"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Flame, ShieldCheck, Coins, Truck, RotateCcw } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

interface Props {
  announcementText?: string | null;
  announcementLink?: string | null;
  marqueeItems?: string[];
}

export function ShopAnnouncementMarquee({
  announcementText,
  announcementLink = "/shop",
  marqueeItems = [],
}: Props) {
  const { language } = useLanguage();

  const defaultMarquee = [
    "⚡ 100% Cashback in Astra Wallet on All Prepaid Orders",
    "🔱 Consecrated & Energised by Vedic Pandits in Varanasi",
    "💎 100% Natural & Govt. Lab Certified Gemstones & Rudraksha",
    "✨ FREE Raw Selenite Charging Plate worth ₹729 with Zodiac Bracelets",
    "🚚 Free Express Shipping across India on orders above ₹499",
    "🛡️ 7-Day Easy Replacement Guarantee • Cash on Delivery Available",
  ];

  const items = marqueeItems && marqueeItems.length > 0 ? marqueeItems : defaultMarquee;

  return (
    <div className="w-full space-y-0 select-none">
      {/* 1. Top Announcement Header Bar */}
      <div className="bg-[#1f1610] border-b border-amber-900/30 text-amber-100 text-[11px] sm:text-xs py-2 px-4 text-center font-semibold">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
          <Sparkles className="size-3.5 text-amber-400 animate-pulse shrink-0" />
          <Link
            href={announcementLink || "/shop"}
            className="hover:text-amber-300 transition-colors hover:underline line-clamp-1"
          >
            {announcementText ||
              (language === "bn"
                ? "⚡ বৈদিক শুভ মুহূর্ত: সমস্ত প্রিপেইড অর্ডারে ১০০% ওয়ালেট ক্যাশব্যাক ও ফ্রি সেলিনাইট প্লেট!"
                : "⚡ Special Consecration: 100% Cashback in Astra Wallet on All Prepaid Orders!")}
          </Link>
        </div>
      </div>

      {/* 2. Running Infinite Marquee Bar */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white py-2 overflow-hidden shadow-inner border-y border-amber-600/30 relative">
        <div className="flex w-max animate-marquee space-x-8 items-center whitespace-nowrap text-xs font-bold tracking-wide">
          {[...items, ...items, ...items].map((text, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="size-1.5 rounded-full bg-amber-300" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
