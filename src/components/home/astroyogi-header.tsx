"use client";

import {
  ArrowRight,
  Bell,
  Bot,
  CalendarDays,
  ChevronDown,
  Coins,
  Compass,
  Globe,
  Hand,
  HeartHandshake,
  Hourglass,
  Layers,
  Menu,
  MessageCircle,
  Moon,
  Orbit,
  Phone,
  Radio,
  ScanFace,
  ScrollText,
  Sparkles,
  Star,
  Sun,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Avatar } from "@/components/ui";
import { useWallet } from "@/hooks/use-wallet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";
import { formatCoins, type AstrologyLanguage } from "@/types";

interface NavDropdownItem {
  label: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavCategory {
  label: string;
  href: string;
  isLive?: boolean;
  dropdown?: NavDropdownItem[];
}

export function AstroyogiHeader() {
  const pathname = usePathname();
  const { user, isSignedIn } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { data: walletData } = useWallet(Boolean(isSignedIn));
  const coinsBalance = walletData?.wallet?.balance_coins;

  const [hoveredCategory, setHoveredCategory] = React.useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = React.useState<string | null>(null);
  const [langDropdownOpen, setLangDropdownOpen] = React.useState(false);

  // Close menus on path change
  React.useEffect(() => {
    setMobileMenuOpen(false);
    setHoveredCategory(null);
    setLangDropdownOpen(false);
  }, [pathname]);

  const navCategories = React.useMemo<NavCategory[]>(() => {
    if (language === "bn") {
      return [
        {
          label: "পরামর্শ",
          href: "/astrologers",
          dropdown: [
            {
              label: "জ্যোতিষীর সাথে কল",
              href: "/astrologers",
              description: "৫০০+ ভেরিফাইড জ্যোতিষীর সাথে সরাসরি ভয়েস কলে কথা বলুন",
              icon: Phone,
              badge: "তাৎক্ষণিক",
            },
            {
              label: "জ্যোতিষীর সাথে চ্যাট",
              href: "/astrologers",
              description: "গোপনীয় ও ব্যক্তিগত তাৎক্ষণিক চ্যাট মেসেজিং",
              icon: MessageCircle,
              badge: "জনপ্রিয়",
            },
            {
              label: "ভিডিও অ্যাপয়েন্টমেন্ট",
              href: "/appointments",
              description: "ব্যক্তিগত ১-অন-১ লাইভ ভিডিও সেশন বুক করুন",
              icon: CalendarDays,
            },
            {
              label: "২৪/৭ এআই জ্যোতিষী",
              href: "/ai-astrologer",
              description: "বৈদিক এআই বুদ্ধিমত্তা দ্বারা তাৎক্ষণিক সঠিক উত্তর",
              icon: Bot,
              badge: "ফ্রি",
            },
          ],
        },
        {
          label: "রাশিফল",
          href: "/daily-horoscope",
          dropdown: [
            {
              label: "আজকের রাশিফল",
              href: "/daily-horoscope",
              description: "১২টি রাশির জন্য দৈনিক নির্ভুল ব্যক্তিগত ভাগ্যফল",
              icon: Sparkles,
            },
            {
              label: "বর্ষফল ২০২৬",
              href: "/daily-horoscope",
              description: "প্রেম, ক্যারিয়ার, অর্থ ও স্বাস্থ্যের বার্ষিক ভবিষ্যৎবাণী",
              icon: Sun,
            },
            {
              label: "রাশি ক্যালকুলেটর",
              href: "/rashi-calculator",
              description: "আপনার বৈদিক চন্দ্র রাশি ও সূর্য রাশি জানুন",
              icon: Moon,
            },
          ],
        },
        {
          label: "কুন্ডলী",
          href: "/kundli",
          dropdown: [
            {
              label: "ফ্রি জন্ম কুন্ডলী",
              href: "/kundli",
              description: "নির্ভুল লগ্ন ছক, গ্রহের অবস্থান ও দোষ বিশ্লেষণ",
              icon: ScrollText,
              badge: "১০০% ফ্রি",
            },
            {
              label: "কুন্ডলী মিলন (৩৬ গুণ)",
              href: "/kundli-matching",
              description: "অষ্টকূটের ৩৬ গুণ মিলন ও মাঙ্গলিক বিচার",
              icon: HeartHandshake,
            },
            {
              label: "বিংশোত্তরী দশা",
              href: "/dasha-calculator",
              description: "মহাদশা ও অন্তর্দশা সময়সীমা বিশ্লেষণ",
              icon: Hourglass,
            },
            {
              label: "কেপি জ্যোতিষ",
              href: "/kp-calculator",
              description: "কৃষ্ণমূর্তি পদ্ধতি সাব-লর্ড ও কাস্প হিসাব",
              icon: Orbit,
            },
          ],
        },
        {
          label: "এআই রিডিং",
          href: "/palm-reading",
          dropdown: [
            {
              label: "হস্তরেখা বিচার (৩ডি এআই)",
              href: "/palm-reading",
              description: "৩ডি ক্যামেরা স্ক্যানে হৃদয়, শিরো ও জীবন রেখার বিশ্লেষণ",
              icon: Hand,
              badge: "৩ডি",
            },
            {
              label: "মুখমণ্ডল বিচার (সামুদ্রিক)",
              href: "/face-reading",
              description: "এআই ফেসিয়াল স্ক্যানে ব্যক্তিত্ব ও ভাগ্য বিচার",
              icon: ScanFace,
              badge: "এআই স্ক্যান",
            },
          ],
        },
        {
          label: "ক্যালকুলেটর",
          href: "/panchang",
          dropdown: [
            {
              label: "বৈদিক পঞ্জিকা ও মুহূর্ত",
              href: "/panchang",
              description: "তিথি, নক্ষত্র, রাহু কাল ও শুভ মুহূর্তের হিসাব",
              icon: Compass,
            },
            {
              label: "সংখ্যাতত্ত্ব (নিউমেরোলজি)",
              href: "/numerology",
              description: "মূলাঙ্ক, ভাগ্যাঙ্ক ও শুভ সংখ্যার বিশদ বিশ্লেষণ",
              icon: Sparkles,
            },
            {
              label: "বাস্তু কম্পাস ও টিপস",
              href: "/vastu",
              description: "১৬-জোনের শক্তি ভারসাম্য ও গৃহশান্তির প্রতিকার",
              icon: Layers,
            },
            {
              label: "নক্ষত্র ক্যালকুলেটর",
              href: "/nakshatra-calculator",
              description: "জন্ম নক্ষত্র, চরণ, আরাধ্য দেবতা ও শুভ বৃক্ষ",
              icon: Star,
            },
          ],
        },
        { label: "ফ্রি ভাগ্যফল", href: "/#readings" },
        { label: "লাইভ", href: "/#live-experts", isLive: true },
      ];
    }

    if (language === "hi") {
      return [
        {
          label: "परामर्श",
          href: "/astrologers",
          dropdown: [
            {
              label: "ज्योतिषी से कॉल करें",
              href: "/astrologers",
              description: "500+ सत्यापित ज्योतिषाचार्यों से सीधे फोन पर बात करें",
              icon: Phone,
              badge: "तुरंत",
            },
            {
              label: "ज्योतिषी से चैट",
              href: "/astrologers",
              description: "सुरक्षित और निजी ऑनलाइन चैट परामर्श",
              icon: MessageCircle,
              badge: "लोकप्रिय",
            },
            {
              label: "वीडियो अपॉइंटमेंट",
              href: "/appointments",
              description: "विस्तृत मार्गदर्शन के लिए 1-on-1 वीडियो सत्र बुक करें",
              icon: CalendarDays,
            },
            {
              label: "24/7 एआई ज्योतिषी",
              href: "/ai-astrologer",
              description: "वैदिक एआई ज्ञान से तुरंत अपनी समस्याओं का समाधान पाएं",
              icon: Bot,
              badge: "मुफ़्त",
            },
          ],
        },
        {
          label: "राशिफल",
          href: "/daily-horoscope",
          dropdown: [
            {
              label: "आज का राशिफल",
              href: "/daily-horoscope",
              description: "सभी 12 राशियों के लिए सटीक दैनिक भविष्यवाणी",
              icon: Sparkles,
            },
            {
              label: "वार्षिक राशिफल 2026",
              href: "/daily-horoscope",
              description: "प्रेम, करियर, धन एवं स्वास्थ्य का वार्षिक फलादेश",
              icon: Sun,
            },
            {
              label: "राशि कैलकुलेटर",
              href: "/rashi-calculator",
              description: "अपनी सटीक चंद्र एवं सूर्य राशि जानें",
              icon: Moon,
            },
          ],
        },
        {
          label: "कुंडली",
          href: "/kundli",
          dropdown: [
            {
              label: "मुफ़्त जन्म कुंडली",
              href: "/kundli",
              description: "लग्न चार्ट, नवमांश, ग्रह स्थिति व दोष विश्लेषण",
              icon: ScrollText,
              badge: "100% फ्री",
            },
            {
              label: "कुंडली मिलान (36 गुण)",
              href: "/kundli-matching",
              description: "अष्टकूट मिलान व वैवाहिक अनुकूलता परीक्षण",
              icon: HeartHandshake,
            },
            {
              label: "विंशोत्तरी महादशा",
              href: "/dasha-calculator",
              description: "महादशा, अंतर्दशा व वर्तमान ग्रह काल समयरेखा",
              icon: Hourglass,
            },
            {
              label: "केपी ज्योतिष",
              href: "/kp-calculator",
              description: "कृष्णमूर्ति पद्धति कस्प व सब-लॉर्ड गणना",
              icon: Orbit,
            },
          ],
        },
        {
          label: "एआई रीडिंग",
          href: "/palm-reading",
          dropdown: [
            {
              label: "हस्तरेखा परीक्षण (3D AI)",
              href: "/palm-reading",
              description: "3D हैंड स्कैन द्वारा रेखाओं का विश्लेषण",
              icon: Hand,
              badge: "3D AI",
            },
            {
              label: "सामुद्रिक मुख परीक्षण",
              href: "/face-reading",
              description: "एआई कैमरा स्कैन से चेहरे के लक्षण व भाग्य जानें",
              icon: ScanFace,
              badge: "AI स्कैन",
            },
          ],
        },
        {
          label: "कैलकुलेटर",
          href: "/panchang",
          dropdown: [
            {
              label: "वैदिक पंचांग व मुहूर्त",
              href: "/panchang",
              description: "तिथि, नक्षत्र, राहुकाल व चौघड़िया मुहूर्त",
              icon: Compass,
            },
            {
              label: "अंकशास्त्र (न्यूमरोलॉजी)",
              href: "/numerology",
              description: "मूलांक, भाग्यांक व भाग्यशाली अंकों का रहस्य",
              icon: Sparkles,
            },
            {
              label: "वास्तु शास्त्र",
              href: "/vastu",
              description: "16-दिशाओं का वास्तु दोष निवारण व उपाय",
              icon: Layers,
            },
            {
              label: "नक्षत्र कैलकुलेटर",
              href: "/nakshatra-calculator",
              description: "जन्म नक्षत्र, चरण, आराध्य देव व वृक्ष जानें",
              icon: Star,
            },
          ],
        },
        { label: "मुफ़्त फलादेश", href: "/#readings" },
        { label: "लाइव", href: "/#live-experts", isLive: true },
      ];
    }

    // Default English (Clean, Concise, Astrotalk-style single-word labels)
    return [
      {
        label: "Consultations",
        href: "/astrologers",
        dropdown: [
          {
            label: "Talk to Astrologer",
            href: "/astrologers",
            description: "Instant voice consultation with 500+ verified Vedic experts",
            icon: Phone,
            badge: "Instant",
          },
          {
            label: "Chat with Astrologer",
            href: "/astrologers",
            description: "Private end-to-end encrypted instant messaging",
            icon: MessageCircle,
            badge: "Popular",
          },
          {
            label: "Video Appointments",
            href: "/appointments",
            description: "Schedule deep-dive 1-on-1 private video chamber consultations",
            icon: CalendarDays,
          },
          {
            label: "24/7 AI Astrologer",
            href: "/ai-astrologer",
            description: "Instant Vedic planetary intelligence trained on sacred texts",
            icon: Bot,
            badge: "Free",
          },
        ],
      },
      {
        label: "Horoscope",
        href: "/daily-horoscope",
        dropdown: [
          {
            label: "Today's Horoscope",
            href: "/daily-horoscope",
            description: "Daily personalized planetary transit forecast for all 12 signs",
            icon: Sparkles,
          },
          {
            label: "Year 2026 Predictions",
            href: "/daily-horoscope",
            description: "Annual roadmap for love, career, wealth & wellness",
            icon: Sun,
          },
          {
            label: "Rashi Calculator",
            href: "/rashi-calculator",
            description: "Calculate your exact Vedic Moon Sign (Chandra Rashi)",
            icon: Moon,
          },
        ],
      },
      {
        label: "Kundli",
        href: "/kundli",
        dropdown: [
          {
            label: "Free Janam Kundli",
            href: "/kundli",
            description: "Detailed Lagna (D1), Navamsha (D9) & planetary dosha analysis",
            icon: ScrollText,
            badge: "100% Free",
          },
          {
            label: "Kundli Matching (36 Gunas)",
            href: "/kundli-matching",
            description: "Ashtakoot Milan & comprehensive marriage compatibility score",
            icon: HeartHandshake,
          },
          {
            label: "Vimshottari Dasha",
            href: "/dasha-calculator",
            description: "Mahadasha, Antardasha & sub-period timeline breakdown",
            icon: Hourglass,
          },
          {
            label: "KP Astrology",
            href: "/kp-calculator",
            description: "Krishnamurti Paddhati sub-lords & planetary cusps",
            icon: Orbit,
          },
        ],
      },
      {
        label: "AI Reading",
        href: "/palm-reading",
        dropdown: [
          {
            label: "Palm Reading (3D AI)",
            href: "/palm-reading",
            description: "3D camera scan of heart, head & life lines with depth estimation",
            icon: Hand,
            badge: "3D AI",
          },
          {
            label: "Face Reading (Samudrika)",
            href: "/face-reading",
            description: "AI facial features & planetary marks for fortune analysis",
            icon: ScanFace,
            badge: "AI Scan",
          },
        ],
      },
      {
        label: "Calculators",
        href: "/panchang",
        dropdown: [
          {
            label: "Vedic Panchang & Muhurat",
            href: "/panchang",
            description: "Daily Tithi, Nakshatra, Rahu Kaal & auspicious timings",
            icon: Compass,
          },
          {
            label: "Numerology Report",
            href: "/numerology",
            description: "Mulank, Bhagyank, destiny numbers & name correction",
            icon: Sparkles,
          },
          {
            label: "16-Zone Vastu Guide",
            href: "/vastu",
            description: "Directional energy balance & remedies for home & office",
            icon: Layers,
          },
          {
            label: "Nakshatra Calculator",
            href: "/nakshatra-calculator",
            description: "Determine your birth star, deity & ruling planet",
            icon: Star,
          },
        ],
      },
      { label: "Free Readings", href: "/#readings" },
      { label: "Live", href: "/#live-experts", isLive: true },
    ];
  }, [language]);

  const ctaPart1 =
    language === "bn"
      ? "পরামর্শ নিন"
      : language === "hi"
      ? "बात करें"
      : "Talk now";

  const ctaPart2 =
    language === "bn"
      ? "ফ্রি কুন্ডলী"
      : language === "hi"
      ? "मुफ़्त कुंडली"
      : "Free Kundli";

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#140f0c]/95 backdrop-blur-md border-b border-[#f0e8b8]/80 shadow-[0_2px_15px_-4px_rgba(26,18,8,0.06)]">
      {/* Astrotalk-Style Unified Single Row Navigation Bar */}
      <div className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-[68px] items-center justify-between gap-2 xl:gap-4 overflow-visible">
          {/* ================= LEFT: Brand Logo + Name ================= */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 whitespace-nowrap">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden flex size-9 items-center justify-center rounded-xl border border-[#eadf9a] text-stone-900 hover:bg-[#fffdf2] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="relative flex size-9 sm:size-9.5 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-soft transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="DivinLink"
                  width={38}
                  height={38}
                  className="size-full object-contain"
                  priority
                />
              </span>
              <span className="font-display whitespace-nowrap text-[17px] sm:text-[18px] font-bold tracking-wide text-foreground group-hover:text-amber-700 transition-colors">
                DivinLink
              </span>
            </Link>
          </div>

          {/* ================= CENTER: Single-Row Luxury Navigation Links ================= */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 whitespace-nowrap shrink-0 overflow-visible">
            {navCategories.map((cat) => {
              const isActive = cat.href === pathname || (cat.label === "Home" && pathname === "/");
              const hasDropdown = Boolean(cat.dropdown && cat.dropdown.length > 0);
              const isHovered = hoveredCategory === cat.label;

              return (
                <div
                  key={cat.label}
                  className="relative group shrink-0 py-1"
                  onMouseEnter={() => setHoveredCategory(cat.label)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <Link
                    href={cat.href}
                    className={`whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[14px] font-semibold tracking-normal transition-all duration-150 select-none ${
                      isActive
                        ? "text-amber-950 font-bold bg-amber-100/90 shadow-2xs"
                        : "text-stone-700 hover:text-stone-950 hover:bg-stone-100/80"
                    }`}
                  >
                    {cat.isLive && (
                      <span className="relative flex size-2 shrink-0 mr-0.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex size-2 rounded-full bg-red-500" />
                      </span>
                    )}

                    <span className="whitespace-nowrap leading-normal">{cat.label}</span>

                    {cat.isLive && (
                      <span className="ml-0.5 rounded-full bg-red-500 px-1.5 py-0.5 text-[8.5px] font-extrabold text-white uppercase tracking-wider shrink-0 leading-none">
                        Live
                      </span>
                    )}

                    {hasDropdown && (
                      <ChevronDown
                        className={cn(
                          "size-3.5 text-stone-400 transition-transform duration-200 shrink-0",
                          isHovered && "rotate-180 text-amber-700"
                        )}
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu Popup */}
                  {hasDropdown && isHovered && (
                    <div className="absolute left-0 top-full pt-1.5 z-50 w-80 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="overflow-hidden rounded-2xl border border-amber-200/90 bg-white p-2 shadow-[0_18px_45px_-10px_rgba(26,18,8,0.18)] ring-1 ring-black/5">
                        <div className="space-y-1">
                          {cat.dropdown?.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.label}
                                href={item.href}
                                className="group/item flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-amber-50/80"
                              >
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800 group-hover/item:bg-amber-200 transition-colors">
                                  <Icon className="size-4.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-xs text-stone-900 group-hover/item:text-amber-800">
                                      {item.label}
                                    </span>
                                    {item.badge && (
                                      <span className="rounded-full bg-amber-100 text-amber-900 text-[9px] font-bold px-1.5 py-0.2 border border-amber-300/60">
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="mt-0.5 text-[11px] text-stone-500 leading-snug line-clamp-2">
                                    {item.description}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* ================= RIGHT: Language, Profile & Astrotalk-Style CTA Button ================= */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 whitespace-nowrap">
            {/* Language Selector Dropdown */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setLangDropdownOpen((v) => !v)}
                className="inline-flex items-center gap-1 rounded-full border border-stone-200 hover:border-amber-400 bg-white px-2.5 py-1.5 text-xs font-bold text-stone-700 transition-colors hover:bg-stone-50 cursor-pointer whitespace-nowrap"
                title="Change language / ভাষা পরিবর্তন"
                aria-expanded={langDropdownOpen}
              >
                <Globe className="size-3.5 text-amber-600 shrink-0" />
                <span>{language === "bn" ? "বাং" : language === "hi" ? "हिन्दी" : "EN"}</span>
                <ChevronDown
                  className={cn(
                    "size-3 text-stone-400 transition-transform duration-200 shrink-0",
                    langDropdownOpen && "rotate-180"
                  )}
                />
              </button>

              {langDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setLangDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-40 w-40 rounded-2xl border border-amber-200 bg-white p-1.5 shadow-2xl animate-in fade-in duration-150">
                    {[
                      { code: "bn", label: "বাংলা", badge: "বাং" },
                      { code: "hi", label: "हिन्दी", badge: "हिन्दी" },
                      { code: "en", label: "English", badge: "EN" },
                    ].map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          setLanguage(l.code as AstrologyLanguage);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                          language === l.code
                            ? "bg-amber-100 text-amber-900 font-bold"
                            : "text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        <span>{l.label}</span>
                        <span className="text-[10px] text-stone-400 font-bold">{l.badge}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* User Profile / Wallet or Sign In */}
            {isSignedIn ? (
              <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                <Link
                  href="/account/wallet"
                  className="flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-950 hover:bg-amber-100 transition-colors shrink-0"
                >
                  <Coins className="size-3.5 text-amber-600 shrink-0" />
                  <span className="tabular-nums">
                    {coinsBalance !== undefined ? formatCoins(coinsBalance) : "—"}
                  </span>
                </Link>
                <Link
                  href="/account"
                  className="flex size-8 sm:size-9 items-center justify-center rounded-full border border-amber-400/80 overflow-hidden shrink-0"
                >
                  <Avatar
                    src={user?.avatar_url}
                    name={user?.full_name || user?.first_name || "User"}
                    size="sm"
                    className="size-full"
                  />
                </Link>
              </div>
            ) : (
              <Link href="/login" className="hidden sm:inline-flex shrink-0">
                <button
                  type="button"
                  className="rounded-full px-3.5 py-1.5 text-xs font-bold text-stone-700 hover:text-stone-950 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {language === "bn" ? "সাইন ইন" : language === "hi" ? "लॉग इन" : "Sign In"}
                </button>
              </Link>
            )}

            {/* Astrotalk-Style Signature Golden Pill Button */}
            <Link href="/astrologers" className="shrink-0 group">
              <button
                type="button"
                className="group relative inline-flex h-9 sm:h-[38px] items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 px-4 text-stone-950 font-semibold text-xs sm:text-[13px] tracking-tight shadow-[0_4px_14px_-2px_rgba(245,158,11,0.55)] hover:shadow-[0_6px_18px_-2px_rgba(245,158,11,0.75)] transition-all hover:scale-[1.02] active:scale-[0.98] border border-amber-300 whitespace-nowrap cursor-pointer leading-normal"
              >
                <span className="leading-normal">{ctaPart1}</span>
                <span className="opacity-40 font-light leading-normal">|</span>
                <span className="leading-normal">{ctaPart2}</span>
                <ArrowRight className="size-3.5 stroke-[2] text-stone-900 transition-transform duration-200 group-hover:translate-x-0.5 shrink-0" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= Mobile Navigation Drawer ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                    <Image
                      src="/logo.png"
                      alt="DivinLink"
                      width={32}
                      height={32}
                      className="size-full object-contain"
                    />
                  </span>
                  <span className="font-display text-[16px] font-bold tracking-wide text-foreground">
                    DivinLink
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl p-2 text-stone-500 hover:bg-stone-100"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="p-3 space-y-1">
                {navCategories.map((cat) => {
                  const hasDropdown = Boolean(cat.dropdown && cat.dropdown.length > 0);
                  const isExpanded = mobileExpandedSection === cat.label;

                  return (
                    <div key={cat.label} className="border-b border-stone-100 pb-1">
                      {hasDropdown ? (
                        <div>
                          <button
                            type="button"
                            onClick={() =>
                              setMobileExpandedSection(isExpanded ? null : cat.label)
                            }
                            className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-bold text-stone-800 hover:bg-stone-50"
                          >
                            <span>{cat.label}</span>
                            <ChevronDown
                              className={cn(
                                "size-4 text-stone-400 transition-transform duration-200",
                                isExpanded && "rotate-180"
                              )}
                            />
                          </button>
                          {isExpanded && (
                            <div className="pl-3 pr-1 py-1 space-y-1">
                              {cat.dropdown?.map((sub) => {
                                const Icon = sub.icon;
                                return (
                                  <Link
                                    key={sub.label}
                                    href={sub.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2.5 py-2 px-2.5 rounded-lg text-xs font-semibold text-stone-700 hover:bg-amber-50"
                                  >
                                    <Icon className="size-4 text-amber-600" />
                                    <span>{sub.label}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={cat.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-bold text-stone-800 hover:bg-stone-50"
                        >
                          <span>{cat.label}</span>
                          {cat.isLive && (
                            <span className="rounded-full bg-red-500 px-2 py-0.5 text-[9px] font-extrabold text-white uppercase">
                              Live
                            </span>
                          )}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 border-t border-stone-100 bg-stone-50 space-y-3">
              <Link href="/astrologers" onClick={() => setMobileMenuOpen(false)}>
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-950 font-semibold text-sm py-2.5 shadow-sm"
                >
                  <span>{ctaPart1}</span>
                  <span className="opacity-35 font-light">|</span>
                  <span>{ctaPart2}</span>
                  <ArrowRight className="size-4 stroke-[2.5]" />
                </button>
              </Link>
              {!isSignedIn && (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button
                    type="button"
                    className="w-full mt-2 rounded-full border border-stone-300 bg-white text-stone-800 font-bold text-sm py-2 hover:bg-stone-50"
                  >
                    {language === "bn" ? "সাইন ইন" : language === "hi" ? "लॉग इन" : "Sign In"}
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
