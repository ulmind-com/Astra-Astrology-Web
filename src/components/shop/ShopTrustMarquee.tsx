"use client";

import * as React from "react";

const TRUST_ITEMS = [
  "7-Day Easy Returns",
  "Energised by Top Astrologers",
  "100% Natural & Authentic",
  "Certified by Govt. Labs",
  "100% Cashback On All Prepaid Orders",
  "Free Vedic Energization & Pran-Pratishtha",
];

export function ShopTrustMarquee() {
  return (
    <div className="w-full bg-[#111111] text-white py-2.5 sm:py-3 overflow-hidden select-none border-b border-stone-800/80 shadow-inner">
      <div className="flex w-max animate-marquee space-x-8 sm:space-x-12 items-center whitespace-nowrap text-xs sm:text-[13px] font-medium tracking-wide">
        {[...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5">
            <span className="text-amber-400 font-bold text-xs sm:text-sm">✦</span>
            <span className="text-stone-100 drop-shadow-xs">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
