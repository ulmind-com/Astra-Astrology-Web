"use client";

import * as React from "react";
import { Flame, ShieldCheck, Gem, Sparkles, CheckCircle2, Coins } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

export function AstraPromiseSection() {
  const { language } = useLanguage();

  const promises = [
    {
      num: "01",
      title_bn: "শীর্ষ বৈদিক পণ্ডিতদের দ্বারা প্রাণ-প্রতিষ্ঠা",
      title_en: "Charged by Top Astrologers & Pandits",
      desc_bn:
        "কাশীর গঙ্গাতীরে শাস্ত্রীয় বৈদিক রীতি ও ১০৮ বার মহামৃত্যুঞ্জয়/গায়ত্রী মন্ত্রোচ্চারণে প্রতিটি সামগ্রী প্রাণ-প্রতিষ্ঠা ও শোধন করা হয়।",
      desc_en:
        "Every single bead, crystal and yantra is consecrated with authentic Vedic rituals and personalized Sankalpa before dispatch.",
      icon: Flame,
    },
    {
      num: "02",
      title_bn: "১০০% খাঁটি ও প্রাকৃতিক উপাদান",
      title_en: "100% Natural & Authentic",
      desc_bn:
        "নেপালের আদি রুদ্রাক্ষ, ইতালীয় রক্তপ্রবাল ও উচ্চমানের প্রাকৃতিক ক্রিস্টাল — কোনো নকল বা সিন্থেটিক রত্নের স্থান নেই।",
      desc_en:
        "Genuine untreated stones, high-altitude Nepali beads, and sacred woods selected with utmost Vedic precision.",
      icon: Gem,
    },
    {
      num: "03",
      title_bn: "সরকারি অনুমোদিত ল্যাব টেস্ট সার্টিফিকেট",
      title_en: "Certified by Govt. Approved Labs",
      desc_bn:
        "প্রতিটি প্রিমিয়াম রত্ন ও রুদ্রাক্ষের সাথে দেওয়া হয় স্বতন্ত্র ল্যাব সার্টিফিকেট কার্ড, যা আপনি অনলাইনে কিউআর কোড দিয়ে যাচাই করতে পারবেন।",
      desc_en:
        "Eligible gemstones and sacred beads come with an individual laboratory authenticity certificate with QR verification.",
      icon: ShieldCheck,
    },
    {
      num: "04",
      title_bn: "১০০% ওয়ালেট ক্যাশব্যাক সুবিধা",
      title_en: "100% Wallet Consultation Cashback",
      desc_bn:
        "প্রিপেইড অর্ডারে প্রদেয় সম্পূর্ণ মূল্য ওয়ালেটে কয়েন হিসেবে ফেরত দেওয়া হয়, যা দিয়ে যেকোনো সময় শীর্ষ জ্যোতিষীদের সাথে ফ্রি লাইভ পরামর্শ করা যায়।",
      desc_en:
        "Get 100% of your prepaid order value back as wallet consultation coins to consult with top verified astrologers for free.",
      icon: Coins,
    },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
          <ShieldCheck className="size-4 text-amber-600" />
          <span>The Astra Astrology Promise</span>
        </div>
        <h2 className="font-cinzel text-xl sm:text-3xl font-bold text-stone-900">
          {language === "bn" ? "প্রতিটি প্রতিকারে পবিত্রতা ও আস্থার অঙ্গীকার" : "Quality & Sacred Divinity in Every Piece"}
        </h2>
        <p className="text-xs sm:text-sm text-stone-500">
          {language === "bn"
            ? "ভারতের অন্যতম শীর্ষ নির্ভরযোগ্য জ্যোতিষ প্ল্যাটফর্মের গ্যারান্টি সহ কেনাকাটা করুন।"
            : "Shop with the trust of India's leading astrology ecosystem. Tested, consecrated and delivered with care."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {promises.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.num}
              className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
                  <Icon className="size-5" />
                </div>
                <span className="font-cinzel font-black text-xl text-stone-300 group-hover:text-amber-300 transition-colors">
                  {p.num}
                </span>
              </div>

              <h4 className="font-bold text-sm text-stone-900 group-hover:text-amber-800 transition-colors">
                {language === "bn" ? p.title_bn : p.title_en}
              </h4>

              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                {language === "bn" ? p.desc_bn : p.desc_en}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
