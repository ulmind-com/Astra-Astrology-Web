"use client";

import {
  Bell,
  Bot,
  CalendarDays,
  ChevronDown,
  Coins,
  Compass,
  Globe,
  Hand,
  Hash,
  Heart,
  HeartHandshake,
  Home,
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
  Users,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Avatar, Button } from "@/components/ui";
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
        { label: "হোম", href: "/" },
        {
          label: "পরামর্শ নিন",
          href: "/astrologers",
          dropdown: [
            {
              label: "জ্যোতিষীর সাথে কথা বলুন",
              href: "/astrologers",
              description: "৫০০+ অভিজ্ঞ ও ভেরিফাইড জ্যোতিষীর সাথে কল বা চ্যাটে সরাসরি যুক্ত হন",
              icon: Phone,
              badge: "তাৎক্ষণিক",
            },
            {
              label: "অ্যাপয়েন্টমেন্ট বুক করুন",
              href: "/appointments",
              description: "ব্যক্তিগত ভিডিও কলে বিস্তারিত আলোচনার জন্য সময় নির্ধারণ করুন",
              icon: CalendarDays,
            },
            {
              label: "অ্যাস্ট্রা লাইভ সেশন",
              href: "/#live-experts",
              description: "শীর্ষ জ্যোতিষীদের সাথে ফ্রি লাইভ প্রশ্নোত্তর পর্ব",
              icon: Radio,
              badge: "লাইভ",
            },
            {
              label: "এআই জ্যোতিষী ২৪/৭",
              href: "/ai-astrologer",
              description: "রিয়েল-টাইম এআই বৈদিক বুদ্ধিমত্তা দ্বারা তাৎক্ষণিক সমাধান",
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
              description: "১২টি রাশির জন্য দৈনিক নির্ভুল ব্যক্তিগত রাশিফল",
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
              description: "আপনার সঠিক বৈদিক চন্দ্র রাশি ও সূর্য রাশি গণনা করুন",
              icon: Moon,
            },
          ],
        },
        {
          label: "কুণ্ডলী ও মিলন",
          href: "/kundli",
          dropdown: [
            {
              label: "ফ্রি জন্ম কুণ্ডলী",
              href: "/kundli",
              description: "বিস্তারিত জন্মছক, গ্রহের অবস্থান ও দোষ বিশ্লেষণ",
              icon: ScrollText,
              badge: "জনপ্রিয়",
            },
            {
              label: "যোটক বিচার (৩৬ গুণ)",
              href: "/kundli-matching",
              description: "অষ্টকূট মিলন, ৩৬ পয়েন্ট বিবাহ সামঞ্জস্য ও মাঙ্গলিক বিচার",
              icon: HeartHandshake,
            },
            {
              label: "কেপি জ্যোতিষ",
              href: "/kp-calculator",
              description: "কৃষ্ণমূর্তি পদ্ধতি, ভাব মধ্য এবং সাব-লর্ড ভিত্তিক বিশ্লেষণ",
              icon: Orbit,
            },
            {
              label: "দশা ক্যালকুলেটর",
              href: "/dasha-calculator",
              description: "বিংশোত্তরী মহাদশা, অন্তর্দশা ও প্রত্যন্তর্দশা সময়সীমা",
              icon: Hourglass,
            },
          ],
        },
        {
          label: "এআই ও বায়োমেট্রিক্স",
          href: "/ai-astrologer",
          dropdown: [
            {
              label: "হস্তরেখা বিচার (৩ডি)",
              href: "/palm-reading",
              description: "আয়ুরেখা, হৃদয়রেখা ও মস্তিস্করেখার ৩ডি ভিজ্যুয়াল স্ক্যান",
              icon: Hand,
              badge: "৩ডি",
            },
            {
              label: "মুখমণ্ডল বিচার (সামুদ্রিক)",
              href: "/face-reading",
              description: "এআই ক্যামেরা ফেস স্ক্যান দ্বারা ব্যক্তিত্ব ও ভাগ্য বিশ্লেষণ",
              icon: ScanFace,
              badge: "এআই স্ক্যান",
            },
            {
              label: "এআই জ্যোতিষী",
              href: "/ai-astrologer",
              description: "শাস্ত্রীয় বৈদিক গ্রন্থে প্রশিক্ষিত বুদ্ধিমান এআই-এর সাথে চ্যাট করুন",
              icon: Bot,
            },
          ],
        },
        { label: "পঞ্চাঙ্গ", href: "/nakshatra-calculator" },
        { label: "সংখ্যাতত্ত্ব", href: "/numerology" },
        { label: "বাস্তু", href: "/vastu" },
        { label: "ট্যারোট", href: "/astrologers" },
        {
          label: "ক্যালকুলেটরসমূহ",
          href: "/kp-calculator",
          dropdown: [
            {
              label: "কেপি ক্যালকুলেটর",
              href: "/kp-calculator",
              description: "নির্ভুল ভাব আরম্ভ এবং গ্রহের নক্ষত্র-উপপতি নির্ণয়",
              icon: Orbit,
            },
            {
              label: "দশা ক্যালকুলেটর",
              href: "/dasha-calculator",
              description: "বর্তমান সক্রিয় দশা ও ভবিষ্যৎ সময়চক্রের হিসাব",
              icon: Hourglass,
            },
            {
              label: "নক্ষত্র ক্যালকুলেটর",
              href: "/nakshatra-calculator",
              description: "জন্ম নক্ষত্র, পাদ, ইষ্টদেবতা ও বৃক্ষ নিরূপণ",
              icon: Star,
            },
            {
              label: "রাশি ক্যালকুলেটর",
              href: "/rashi-calculator",
              description: "চন্দ্র রাশি ও সূর্য রাশি এক ক্লিকেই গণনা করুন",
              icon: Moon,
            },
          ],
        },
        { label: "ফ্রি গণনা", href: "/#readings" },
        { label: "অ্যাস্ট্রা লাইভ", href: "/#live-experts", isLive: true },
      ];
    }

    if (language === "hi") {
      return [
        { label: "होम", href: "/" },
        {
          label: "परामर्श लें",
          href: "/astrologers",
          dropdown: [
            {
              label: "ज्योतिषी से बात करें",
              href: "/astrologers",
              description: "500+ सत्यापित ज्योतिषियों से कॉल या चैट पर तुरंत जुड़ें",
              icon: Phone,
              badge: "त्वरित",
            },
            {
              label: "अपॉइंटमेंट बुक करें",
              href: "/appointments",
              description: "निजी वीडियो परामर्श के लिए समय निर्धारित करें",
              icon: CalendarDays,
            },
            {
              label: "एस्ट्रा लाइव स्ट्रीम",
              href: "/#live-experts",
              description: "शीर्ष विशेषज्ञों के साथ निःशुल्क लाइव प्रश्नोत्तरी",
              icon: Radio,
              badge: "लाइव",
            },
            {
              label: "एआई ज्योतिषी 24/7",
              href: "/ai-astrologer",
              description: "वैदिक एआई द्वारा त्वरित जीवन प्रश्नों का समाधान",
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
              description: "सभी 12 राशियों के लिए दैनिक व्यक्तिगत राशिफल",
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
              description: "अपनी चंद्र राशि एवं सूर्य राशि तुरंत जानें",
              icon: Moon,
            },
          ],
        },
        {
          label: "कुंडली एवं मिलान",
          href: "/kundli",
          dropdown: [
            {
              label: "मुफ़्त जन्म कुंडली",
              href: "/kundli",
              description: "विस्तृत जन्म पत्रिका, ग्रह स्थिति एवं दोष विश्लेषण",
              icon: ScrollText,
              badge: "लोकप्रिय",
            },
            {
              label: "कुंडली मिलान (गुण मिलान)",
              href: "/kundli-matching",
              description: "अष्टकूट मिलान, 36 गुण एवं मांगलिक दोष विश्लेषण",
              icon: HeartHandshake,
            },
            {
              label: "केपी ज्योतिष",
              href: "/kp-calculator",
              description: "कृष्णमूर्ति पद्धति कस्प एवं उप-स्वामी गणनाएं",
              icon: Orbit,
            },
            {
              label: "दशा कैलकुलेटर",
              href: "/dasha-calculator",
              description: "विंशोत्तरी महादशा, अंतर्दशा एवं प्रत्यंतर्दशा समयरेखा",
              icon: Hourglass,
            },
          ],
        },
        {
          label: "एआई एवं बायोमेट्रिक्स",
          href: "/ai-astrologer",
          dropdown: [
            {
              label: "हस्तरेखा विश्लेषण (3D)",
              href: "/palm-reading",
              description: "जीवन, हृदय एवं मस्तिष्क रेखाओं का 3D विज़ुअल विश्लेषण",
              icon: Hand,
              badge: "3D",
            },
            {
              label: "सामुद्रिक मुख लक्षण",
              href: "/face-reading",
              description: "एआई कैमरा फेस स्कैन द्वारा व्यक्तित्व व भाग्य फलादेश",
              icon: ScanFace,
              badge: "एआई स्कैन",
            },
            {
              label: "एआई ज्योतिषी",
              href: "/ai-astrologer",
              description: "वैदिक शास्त्रों पर प्रशिक्षित एआई से सीधे संवाद करें",
              icon: Bot,
            },
          ],
        },
        { label: "पंचांग", href: "/nakshatra-calculator" },
        { label: "अंकशास्त्र", href: "/numerology" },
        { label: "वास्तु", href: "/vastu" },
        { label: "टैरो", href: "/astrologers" },
        {
          label: "कैलकुलेटर",
          href: "/kp-calculator",
          dropdown: [
            {
              label: "केपी कैलकुलेटर",
              href: "/kp-calculator",
              description: "सटीक भाव आरंभ एवं नक्षत्र उप-स्वामी",
              icon: Orbit,
            },
            {
              label: "दशा कैलकुलेटर",
              href: "/dasha-calculator",
              description: "सक्रिय दशा व भविष्य कालचक्र की गणना",
              icon: Hourglass,
            },
            {
              label: "नक्षत्र कैलकुलेटर",
              href: "/nakshatra-calculator",
              description: "जन्म नक्षत्र, चरण, आराध्य देव व वृक्ष जानें",
              icon: Star,
            },
            {
              label: "राशि कैलकुलेटर",
              href: "/rashi-calculator",
              description: "चंद्र राशि एवं सूर्य राशि तुरंत जानें",
              icon: Moon,
            },
          ],
        },
        { label: "मुफ़्त फलादेश", href: "/#readings" },
        { label: "एस्ट्रा लाइव", href: "/#live-experts", isLive: true },
      ];
    }

    return [
      { label: "Home", href: "/" },
      {
        label: "Consult Now",
        href: "/astrologers",
        dropdown: [
          {
            label: "Talk to Astrologers",
            href: "/astrologers",
            description: "Connect instantly via call or chat with 500+ vetted astrologers",
            icon: Phone,
            badge: "Instant",
          },
          {
            label: "Book Appointment",
            href: "/appointments",
            description: "Schedule deep-dive 1-on-1 private video consultations",
            icon: CalendarDays,
          },
          {
            label: "Astra Live Streams",
            href: "/#live-experts",
            description: "Free live interactive Q&A sessions with top experts",
            icon: Radio,
            badge: "Live",
          },
          {
            label: "AI Astrologer 24/7",
            href: "/ai-astrologer",
            description: "Real-time AI Vedic intelligence for instant life answers",
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
            description: "Daily personalized forecast for all 12 zodiac signs",
            icon: Sparkles,
          },
          {
            label: "Year 2026 Predictions",
            href: "/daily-horoscope",
            description: "Annual outlook on love, career, finance & wellness",
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
        label: "Kundli & Matching",
        href: "/kundli",
        dropdown: [
          {
            label: "Free Janam Kundli",
            href: "/kundli",
            description: "Detailed birth chart, planetary degrees & dosha analysis",
            icon: ScrollText,
            badge: "Popular",
          },
          {
            label: "Kundli Matching (Gun Milan)",
            href: "/kundli-matching",
            description: "Ashtakoot Milan & 36-point marriage compatibility check",
            icon: HeartHandshake,
          },
          {
            label: "KP Astrology",
            href: "/kp-calculator",
            description: "Krishnamurti Paddhati sub-lord & cusp calculations",
            icon: Orbit,
          },
          {
            label: "Dasha Calculator",
            href: "/dasha-calculator",
            description: "Vimshottari Dasha, Antardasha & Mahadasha timelines",
            icon: Hourglass,
          },
        ],
      },
      {
        label: "AI & Biometrics",
        href: "/ai-astrologer",
        dropdown: [
          {
            label: "Palm Reading (Hastarekha)",
            href: "/palm-reading",
            description: "3D interactive palm analysis for life, heart & head lines",
            icon: Hand,
            badge: "3D",
          },
          {
            label: "Face Reading (Samudrika)",
            href: "/face-reading",
            description: "AI camera face scan for personality, wealth & fortune",
            icon: ScanFace,
            badge: "AI Scan",
          },
          {
            label: "AI Astrologer",
            href: "/ai-astrologer",
            description: "Chat with an intelligent Vedic AI trained on classical texts",
            icon: Bot,
          },
        ],
      },
      { label: "Panchang", href: "/nakshatra-calculator" },
      { label: "Numerology", href: "/numerology" },
      { label: "Vastu", href: "/vastu" },
      { label: "Tarot", href: "/astrologers" },
      {
        label: "Calculators",
        href: "/kp-calculator",
        dropdown: [
          {
            label: "KP Calculator",
            href: "/kp-calculator",
            description: "Accurate planetary cusps & stellar sub-lords",
            icon: Orbit,
          },
          {
            label: "Dasha Calculator",
            href: "/dasha-calculator",
            description: "Planetary period breakdown & current active dasha",
            icon: Hourglass,
          },
          {
            label: "Nakshatra Calculator",
            href: "/nakshatra-calculator",
            description: "Determine your birth star, deity & ruling planet",
            icon: Star,
          },
          {
            label: "Rashi Calculator",
            href: "/rashi-calculator",
            description: "Calculate Moon sign and Sun sign instantly",
            icon: Moon,
          },
        ],
      },
      { label: "Free Readings", href: "/#readings" },
      { label: "Astra Live", href: "/#live-experts", isLive: true },
    ];
  }, [language]);

  return (
    <header className="relative z-40 w-full bg-white border-b border-[#f0e8b8]/80 shadow-[0_2px_12px_-4px_rgba(26,18,8,0.04)]">
      {/* Top brand & user account bar */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-[72px] items-center justify-between gap-4">
          {/* Left: Mobile hamburger + Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden flex size-9 items-center justify-center rounded-xl border border-[#eadf9a] text-ink-900 hover:bg-[#fffdf2]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>

            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex size-10 sm:size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-300 via-brand-400 to-gold-400 shadow-[0_8px_20px_-6px_rgba(242,229,74,0.9)] transition-transform duration-300 group-hover:scale-105">
                <Sparkles className="size-5 sm:size-6 text-ink-900" />
              </div>
              <div className="flex flex-col">
                <span className="font-cinzel text-lg sm:text-2xl font-bold tracking-tight text-ink-900 group-hover:text-gold-700 transition-colors">
                  DIVINLINK
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#8b5e0a] uppercase -mt-0.5 sm:-mt-1">
                  25 Years of Timeless Trust
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Controls & Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Language Dropdown Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#eadf9a] bg-[#fffdf5] px-3 py-1.5 text-xs font-bold text-ink-900 transition-colors hover:bg-brand-100 hover:border-brand-400"
                title="Change language / ভাষা পরিবর্তন"
                aria-expanded={langDropdownOpen}
              >
                <Globe className="size-3.5 text-gold-600" />
                <span>{language === "bn" ? "বাংলা" : language === "hi" ? "हिन्दी" : "Eng"}</span>
                <ChevronDown className={cn("size-3 text-ink-600 transition-transform duration-200", langDropdownOpen && "rotate-180")} />
              </button>

              {langDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setLangDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-40 w-44 rounded-2xl border border-[#eadf9a] bg-white p-1.5 shadow-2xl">
                    {[
                      { code: "bn", label: "বাংলা", badge: "Bengali", flag: "🇧🇩" },
                      { code: "en", label: "English", badge: "ENG", flag: "🌐" },
                      { code: "hi", label: "हिन्दी", badge: "Hindi", flag: "🇮🇳" },
                    ].map((opt) => (
                      <button
                        key={opt.code}
                        type="button"
                        onClick={() => {
                          void setLanguage(opt.code as any);
                          setLangDropdownOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors",
                          language === opt.code
                            ? "bg-brand-200/90 text-ink-950 font-bold"
                            : "text-ink-700 hover:bg-stone-50",
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <span>{opt.flag}</span>
                          <span className="font-semibold">{opt.label}</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground">{opt.badge}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              className="relative flex size-9 items-center justify-center rounded-full border border-[#eadf9a] bg-[#fffdf5] text-ink-700 transition-colors hover:bg-brand-100"
              title="Notifications"
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* User status / Sign in */}
            {isSignedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/account/wallet"
                  className="flex items-center gap-1.5 rounded-full border border-brand-400/60 bg-brand-200/60 px-3 py-1.5 text-xs font-bold text-ink-900 hover:bg-brand-300 transition-colors"
                >
                  <Coins className="size-3.5 text-gold-700" />
                  <span className="tabular-nums">
                    {coinsBalance !== undefined ? formatCoins(coinsBalance) : "—"}
                  </span>
                </Link>
                <Link
                  href="/account"
                  className="flex size-9 items-center justify-center rounded-full border border-brand-400/70 overflow-hidden"
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
              <Link href="/login">
                <Button
                  size="sm"
                  className="h-9 px-5 rounded-full font-bold text-xs sm:text-sm bg-[#ffd700] hover:bg-[#f5cc00] text-ink-900 shadow-[0_6px_18px_-4px_rgba(255,215,0,0.8)] border border-[#e6be00]"
                >
                  {language === "bn" ? "সাইন ইন" : language === "hi" ? "लॉग इन" : "Sign In"}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Category Navigation Strip with Rich Dropdowns */}
      <div className="border-t border-[#f2e9b0]/60 bg-[#fffdf7]">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <nav className="scrollbar-none hidden lg:flex items-center justify-between gap-1 py-1 text-[13px] font-semibold text-ink-700">
            {navCategories.map((cat) => {
              const isActive = cat.href === pathname || (cat.label === "Home" && pathname === "/");
              const hasDropdown = Boolean(cat.dropdown && cat.dropdown.length > 0);
              const isHovered = hoveredCategory === cat.label;

              return (
                <div
                  key={cat.label}
                  className="relative group py-2"
                  onMouseEnter={() => setHoveredCategory(cat.label)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <Link
                    href={cat.href}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "text-gold-700 font-bold bg-[#fff8d4]"
                        : "text-ink-800 hover:text-gold-700 hover:bg-[#fff9db]"
                    }`}
                  >
                    {cat.isLive && (
                      <span className="relative flex size-2 mr-0.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex size-2 rounded-full bg-red-500" />
                      </span>
                    )}

                    <span>{cat.label}</span>

                    {cat.isLive && (
                      <span className="ml-1 rounded bg-red-500 px-1.5 py-0.2 text-[9px] font-extrabold text-white uppercase tracking-wider">
                        Watch
                      </span>
                    )}

                    {hasDropdown && (
                      <ChevronDown
                        className={`size-3 text-ink-500 opacity-70 transition-transform duration-200 ${
                          isHovered ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu Popup */}
                  {hasDropdown && isHovered && (
                    <div className="absolute left-0 top-full pt-1 z-50 w-80 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="overflow-hidden rounded-2xl border border-[#ebd881] bg-white p-2 shadow-[0_16px_40px_-10px_rgba(26,18,8,0.15)] ring-1 ring-black/5">
                        <div className="space-y-1">
                          {cat.dropdown?.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.label}
                                href={item.href}
                                className="group/item flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-[#fffbe8]"
                              >
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-200/80 text-[#8b5e0a] group-hover/item:bg-brand-300 transition-colors">
                                  <Icon className="size-4.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-[#1a1208] group-hover/item:text-gold-700">
                                      {item.label}
                                    </span>
                                    {item.badge && (
                                      <span className="rounded-full bg-gold-100 text-gold-800 text-[9px] font-bold px-1.5 py-0.2">
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="mt-0.5 text-[11px] text-[#6b5f4d] leading-snug line-clamp-2">
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

          {/* Mobile Horizontal Quick Nav Strip */}
          <nav className="lg:hidden scrollbar-none flex items-center gap-4 overflow-x-auto py-2.5 text-xs font-semibold text-ink-700">
            {navCategories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="shrink-0 flex items-center gap-1 text-ink-800 hover:text-gold-700"
              >
                {cat.isLive && (
                  <span className="relative flex size-2 mr-0.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-red-500" />
                  </span>
                )}
                <span>{cat.label}</span>
                {cat.isLive && (
                  <span className="rounded bg-red-500 px-1 text-[8px] font-bold text-white uppercase">
                    Live
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer (When hamburger is clicked) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#f2e9b0]">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-xl bg-brand-300 text-ink-900">
                    <Sparkles className="size-4" />
                  </div>
                  <span className="font-cinzel text-lg font-bold text-ink-900">
                    DIVINLINK
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl p-2 text-ink-700 hover:bg-stone-100"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Language Selector Bar inside Drawer */}
              <div className="px-4 py-2.5 bg-[#fffdf5] border-b border-[#f2e9b0] flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-ink-800 flex items-center gap-1.5">
                  <Globe className="size-3.5 text-gold-600" />
                  <span>{language === "bn" ? "ভাষা:" : language === "hi" ? "भाषा:" : "Language:"}</span>
                </span>
                <div className="inline-flex rounded-xl bg-white p-0.5 border border-[#eadf9a] shadow-2xs">
                  {[
                    { code: "bn", label: "বাংলা" },
                    { code: "en", label: "ENG" },
                    { code: "hi", label: "हिन्दी" },
                  ].map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => void setLanguage(l.code as any)}
                      className={cn(
                        "rounded-lg px-2.5 py-1 text-xs font-bold transition-all",
                        language === l.code
                          ? "bg-brand-400 text-ink-950 shadow-2xs"
                          : "text-stone-600 hover:text-stone-900",
                      )}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drawer Links */}
              <div className="p-4 space-y-2">
                {navCategories.map((cat) => {
                  const hasDropdown = Boolean(cat.dropdown && cat.dropdown.length > 0);
                  const isExpanded = mobileExpandedSection === cat.label;

                  return (
                    <div key={cat.label} className="border-b border-stone-100 pb-2">
                      <div className="flex items-center justify-between">
                        <Link
                          href={cat.href}
                          onClick={() => !hasDropdown && setMobileMenuOpen(false)}
                          className="flex items-center gap-2 py-2 text-sm font-bold text-ink-900"
                        >
                          {cat.isLive && (
                            <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                          )}
                          <span>{cat.label}</span>
                        </Link>

                        {hasDropdown && (
                          <button
                            type="button"
                            onClick={() =>
                              setMobileExpandedSection(isExpanded ? null : cat.label)
                            }
                            className="p-2 text-ink-600"
                          >
                            <ChevronDown
                              className={`size-4 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Expanded Sub-items */}
                      {hasDropdown && isExpanded && (
                        <div className="mt-1 pl-3 space-y-2 pb-2">
                          {cat.dropdown?.map((sub) => {
                            const Icon = sub.icon;
                            return (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-2.5 py-1.5 text-xs text-ink-700 hover:text-gold-700"
                              >
                                <Icon className="size-4 text-gold-600" />
                                <span className="font-medium">{sub.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom account / appointments */}
            <div className="p-4 border-t border-[#f2e9b0] bg-[#fffdf5]">
              <Link
                href="/astrologers"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#fcd404] py-3 text-sm font-bold text-[#1c1304] shadow-sm"
              >
                <span>
                  {language === "bn"
                    ? "এখনই জ্যোতিষীর পরামর্শ নিন"
                    : language === "hi"
                    ? "अभी ज्योतिषी से परामर्श करें"
                    : "Consult Astrologer Now"}
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
