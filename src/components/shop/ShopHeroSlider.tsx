"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Flame } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  badge_text?: string | null;
  image_url: string;
  is_active: boolean;
}

interface Props {
  banners?: BannerItem[];
}

export function ShopHeroSlider({ banners }: Props) {
  const { language } = useLanguage();

  const defaultBanners: BannerItem[] = [
    {
      id: "b1",
      title: language === "bn" ? "আদি ও বিশুদ্ধ নেপালি সিদ্ধ রুদ্রাক্ষ" : "Authentic Nepali Siddh Rudraksha",
      subtitle:
        language === "bn"
          ? "বারাণসীর গঙ্গাতীরে বৈদিক মন্ত্রে প্রাণ-প্রতিষ্ঠিত • ১০০% ওয়ালেট ক্যাশব্যাক ও ফ্রি সেলিনাইট প্লেট!"
          : "Consecrated by Vedic Priests at Varanasi • 100% Wallet Cashback on all prepaid orders!",
      cta_text: language === "bn" ? "রুদ্রাক্ষ কালেকশন দেখুন" : "Explore Rudraksha",
      cta_link: "/shop?purpose=peace",
      badge_text: "100% Wallet Cashback",
      image_url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
      is_active: true,
    },
    {
      id: "b2",
      title: language === "bn" ? "ধন আকর্ষক খাঁটি পায়রাইট ও ধন যোগ কবচ" : "Money Attracting Pyrite & Dhan Yog Collection",
      subtitle:
        language === "bn"
          ? "আটকে থাকা টাকা উদ্ধার ও ব্যবসা বৃদ্ধিতে প্রত্যক্ষ ফলদায়ী • সরকারি ল্যাব টেস্ট সার্টিফিকেট সহ।"
          : "Stimulates financial abundance and career success • Certified by Government Approved Labs.",
      cta_text: language === "bn" ? "ধন যোগ সামগ্রী দেখুন" : "Shop Wealth Remedies",
      cta_link: "/shop?purpose=wealth",
      badge_text: "Govt. Lab Certified",
      image_url: "https://images.unsplash.com/photo-1611591475879-166258f33cf2?auto=format&fit=crop&w=1200&q=80",
      is_active: true,
    },
    {
      id: "b3",
      title: language === "bn" ? "ব্যক্তিগত রাশিফল ও মূলাঙ্ক ক্রিস্টাল ব্রেসলেট" : "Personalized Zodiac & Mulank Bracelets",
      subtitle:
        language === "bn"
          ? "প্রতিটি ব্রেসলেটের সাথে সম্পূর্ণ বিনামূল্যে পান ₹৭২৯ মূল্যের Raw Selenite Plate!"
          : "Includes FREE Raw Selenite Plate worth ₹729 + 100% Wallet Cashback to consult astrologers!",
      cta_text: language === "bn" ? "আপনার রাশি বেছে নিন" : "Shop by Your Rashi",
      cta_link: "/shop?purpose=zodiac",
      badge_text: "FREE Selenite Plate worth ₹729",
      image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
      is_active: true,
    },
  ];

  const slides = banners && banners.length > 0 ? banners.filter((b) => b.is_active) : defaultBanners;
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-[#1c120c] shadow-2xl">
      {/* Background Slides */}
      <div className="relative aspect-16/9 sm:aspect-21/9 min-h-[360px] w-full">
        {slides.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={s.image_url}
                alt={s.title}
                fill
                priority={idx === 0}
                className="object-cover object-center brightness-[0.38]"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#170e08]/95 via-[#1c120c]/75 to-transparent" />
            </div>

            {/* Slide Content */}
            <div className="relative z-10 h-full max-w-3xl flex flex-col justify-center px-6 sm:px-12 py-8 space-y-4 text-white">
              {s.badge_text && (
                <div className="inline-flex items-center gap-2 self-start rounded-full border border-amber-400/50 bg-amber-500/20 backdrop-blur-xs px-3.5 py-1 text-xs font-bold text-amber-200 shadow-xs">
                  <Sparkles className="size-3.5 text-amber-300 animate-pulse" />
                  <span>{s.badge_text}</span>
                </div>
              )}

              <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-extrabold text-amber-100 tracking-tight leading-tight">
                {s.title}
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-amber-200/85 leading-relaxed max-w-xl font-medium">
                {s.subtitle}
              </p>

              <div className="pt-2 flex items-center gap-3 flex-wrap">
                <Link
                  href={s.cta_link}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white text-xs sm:text-sm font-bold shadow-lg shadow-amber-900/30 flex items-center gap-2 transition-all hover:scale-102"
                >
                  <span>{s.cta_text}</span>
                  <ArrowRight className="size-4" />
                </Link>

                <div className="flex items-center gap-4 text-[11px] sm:text-xs text-amber-300/80 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-emerald-400" />
                    <span>Lab Tested</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Flame className="size-4 text-amber-400" />
                    <span>Consecrated</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Navigation Controls */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === current ? "w-6 bg-amber-400" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
