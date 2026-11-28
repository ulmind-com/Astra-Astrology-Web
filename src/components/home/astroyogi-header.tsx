"use client";

import {
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  Bot,
  CalendarDays,
  ChevronDown,
  Clock,
  Coins,
  Compass,
  FileText,
  Flame,
  Globe,
  Hand,
  HeartHandshake,
  Hourglass,
  Layers,
  LogOut,
  Menu,
  MessageCircle,
  MessageSquare,
  Moon,
  Orbit,
  Phone,
  ScanFace,
  ScrollText,
  ShieldCheck,
  ShoppingBag,
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
import { useCartStore } from "@/lib/stores/use-cart-store";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";
import { formatCoins, type AstrologyLanguage } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { shopApi, type ShopProductCategory } from "@/lib/api";
import initialCategoriesData from "@/lib/initial-shop-categories.json";

function GoldCoinIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" className="fill-amber-400 stroke-amber-600" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="7.2" className="fill-yellow-300 stroke-amber-500/80" strokeWidth="1" strokeDasharray="1.5 1.5" />
      <path d="M12 7v10M9.5 9.5h5a1.8 1.8 0 0 1 0 3.6h-5" stroke="#78350f" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export interface AstroyogiHeaderProps {
  /** Home hero mode: fixed, transparent overlay over cinematic hero until scrolled. */
  overlay?: boolean;
  /** Keep the bar solid and pinned. */
  forceSolid?: boolean;
  /** Runs before the logo navigates home; call preventDefault to stay put. */
  onLogoClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function AstroyogiHeader({ overlay = false, forceSolid = false, onLogoClick }: AstroyogiHeaderProps = {}) {
  const pathname = usePathname();
  const { user, isSignedIn, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { data: walletData, isLoading: walletLoading } = useWallet(Boolean(isSignedIn));
  const coinsBalance = walletData?.wallet?.balance_coins;
  const { openCart, getItemCount } = useCartStore();
  const cartItemCount = getItemCount();

  // iOS Notch Expand State
  const [isHovered, setIsHovered] = React.useState(false);
  const [isManualExpanded, setIsManualExpanded] = React.useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  // Sliding Magnetic Pill Indicator (Apple Fluid Physics)
  const navRef = React.useRef<HTMLElement | null>(null);
  const pillRefs = React.useRef<Map<string, HTMLElement>>(new Map());

  interface PillIndicatorStyle {
    left: number;
    top: number;
    width: number;
    height: number;
    opacity: number;
  }
  const [indicatorStyle, setIndicatorStyle] = React.useState<PillIndicatorStyle | null>(null);

  const leaveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const isExpanded = isHovered || isManualExpanded;

  const updateIndicator = React.useCallback((el: HTMLElement | null, opacity = 1) => {
    if (!el || !navRef.current) {
      setIndicatorStyle((prev) => (prev ? { ...prev, opacity: 0 } : null));
      return;
    }
    const parentRect = navRef.current.getBoundingClientRect();
    const itemRect = el.getBoundingClientRect();
    setIndicatorStyle({
      left: itemRect.left - parentRect.left,
      top: itemRect.top - parentRect.top,
      width: itemRect.width,
      height: itemRect.height,
      opacity,
    });
  }, []);

  // Handle smooth mouse enter/leave with debounce grace period
  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      setIsManualExpanded(false);
      setLangDropdownOpen(false);
      setProfileDropdownOpen(false);
    }, 240);
  };

  // Close menus on path change
  React.useEffect(() => {
    setIsHovered(false);
    setIsManualExpanded(false);
    setLangDropdownOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  // Close on Escape key
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsHovered(false);
        setIsManualExpanded(false);
        setLangDropdownOpen(false);
        setProfileDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Fetch real-time active shop categories
  const { data: dynamicCategories = (initialCategoriesData as any) } = useQuery<ShopProductCategory[]>({
    queryKey: ["shop_public_categories"],
    queryFn: async () => {
      try {
        const res = await shopApi.getCategories();
        return res && res.length > 0 ? res : (initialCategoriesData as any);
      } catch {
        return initialCategoriesData as any;
      }
    },
    initialData: initialCategoriesData as any,
    staleTime: 1000 * 60 * 30,
  });

  // Multilingual Navigation Definitions for the 4 Notch Mega Columns
  const menuData = React.useMemo(() => {
    if (language === "bn") {
      return {
        col1Title: "পরামর্শ ও সেবা",
        col1Icon: Phone,
        col1Badge: "লাইভ",
        col1Items: [
          {
            label: "জ্যোতিষীর সাথে কল",
            href: "/astrologers",
            desc: "ভেরিফাইড শীর্ষ জ্যোতিষীদের সাথে সরাসরি কথা বলুন",
            icon: Phone,
            badge: "তাৎক্ষণিক",
          },
          {
            label: "জ্যোতিষীর সাথে চ্যাট",
            href: "/astrologers",
            desc: "গোপনীয় ও ব্যক্তিগত তাৎক্ষণিক চ্যাট বার্তা",
            icon: MessageCircle,
            badge: "জনপ্রিয়",
          },
          {
            label: "১-অন-১ ভিডিও চেম্বার",
            href: "/appointments",
            desc: "ব্যক্তিগত লাইভ ভিডিও সেশন বুকিং",
            icon: CalendarDays,
          },
          {
            label: "২৪/৭ এআই বৈদিক গুরু",
            href: "/ai-astrologer",
            desc: "৩ডি রোবট অ্যাসিস্ট্যান্ট দ্বারা সঠিক উত্তর",
            icon: Bot,
            badge: "ফ্রি",
          },
          {
            label: "অনলাইন পুরোহিত বুকিং",
            href: "/purohits",
            desc: "কাশীর বৈদিক আচার্যদের সাথে লাইভ পূজা ও সংকল্প",
            icon: Flame,
            badge: "নতুন",
          },
          {
            label: "জ্যোতিষী হিসেবে যুক্ত হন",
            href: "/become-an-astrologer",
            desc: "আমাদের বৈদিক প্যানেলে যুক্ত হয়ে জাতকদের সেবা দিন",
            icon: Award,
          },
        ],
        col2Title: "কুন্ডলী ও গণনা",
        col2Icon: ScrollText,
        col2Badge: "বৈদিক",
        col2Items: [
          {
            label: "ফ্রি জন্ম কুন্ডলী",
            href: "/kundli",
            desc: "নির্ভুল লগ্ন ছক, নবমাংশ ও দোষ বিশ্লেষণ",
            icon: ScrollText,
            badge: "১০০% ফ্রি",
          },
          {
            label: "কুন্ডলী মিলন (৩৬ গুণ)",
            href: "/kundli-matching",
            desc: "অষ্টকূটের ৩৬ গুণ মিলন ও মাঙ্গলিক বিচার",
            icon: HeartHandshake,
            badge: "৩৬ গুণ",
          },
          {
            label: "বিংশোত্তরী মহাদশা",
            href: "/dasha-calculator",
            desc: "মহাদশা, অন্তর্দশা ও প্রত্যন্তর দশা টাইমলাইন",
            icon: Hourglass,
          },
          {
            label: "কেপি জ্যোতিষ পদ্ধতি",
            href: "/kp-calculator",
            desc: "কৃষ্ণমূর্তি পদ্ধতি সাব-লর্ড ও কাস্প হিসাব",
            icon: Orbit,
          },
          {
            label: "নক্ষত্র ক্যালকুলেটর",
            href: "/nakshatra-calculator",
            desc: "জন্ম নক্ষত্র, চরণ, আরাধ্য দেবতা ও শুভ বৃক্ষ",
            icon: Star,
          },
          {
            label: "সংখ্যাতত্ত্ব (নিউমেরোলজি)",
            href: "/numerology",
            desc: "মূলাঙ্ক, ভাগ্যাঙ্ক ও শুভ সংখ্যার বিশদ বিশ্লেষণ",
            icon: Sparkles,
          },
        ],
        col3Title: "দৈনিক ও পঞ্জিকা",
        col3Icon: Sun,
        col3Badge: "২০২৬",
        col3Items: [
          {
            label: "আজকের রাশিফল",
            href: "/daily-horoscope",
            desc: "১২টি রাশির জন্য দৈনিক নির্ভুল ব্যক্তিগত ভাগ্যফল",
            icon: Sparkles,
            badge: "আজ",
          },
          {
            label: "বর্ষফল ২০২৬",
            href: "/annual-horoscope",
            desc: "প্রেম, ক্যারিয়ার ও লাল কিতাব মহাউপায়",
            icon: Sun,
            badge: "২০২৬",
          },
          {
            label: "আজকের বৈদিক পঞ্চাঙ্গ",
            href: "/panchang",
            desc: "তিথি, নক্ষত্র, যোগ, করণ ও শুভ মুহূর্ত",
            icon: Compass,
          },
          {
            label: "১৬ চোঘড়িয়া মুহূর্ত",
            href: "/panchang?tab=choghadiya",
            desc: "অমৃত, শুভ, লাভ সহ জরুরি কর্ম শুরুর সময়",
            icon: Clock,
          },
          {
            label: "উৎসব ও ব্রত পঞ্জিকা",
            href: "/festivals",
            desc: "সনাতন হিন্দু উৎসব, একাদশী ও পূর্ণিমা সূচী",
            icon: Flame,
          },
          {
            label: "বাস্তু কম্পাস ও ১৬-জোন",
            href: "/vastu",
            desc: "১৬-জোনের শক্তি ভারসাম্য ও গৃহশান্তির প্রতিকার",
            icon: Layers,
          },
        ],
        col4Title: "ডিভিনলিংক শপ",
        col4Icon: ShoppingBag,
        col4Badge: "প্রতিকার",
        col4Items: [
          {
            label: "সিদ্ধ নেপালি রুদ্রাক্ষ",
            href: "/shop?category=rudraksha#products",
            desc: "১-১৪ মুখী কাশীর মহাদেবের প্রাণ-প্রতিষ্ঠিত রুদ্রাক্ষ",
            icon: Sparkles,
            badge: "সার্টিফাইড",
          },
          {
            label: "আসল করুঙ্গলি কালেকশন",
            href: "/shop?category=karungali#products",
            desc: "কালো আবলুস কাঠের মালা ও ব্রেসলেট নজরদোষ সুরক্ষায়",
            icon: ShieldCheck,
            badge: "আসল কাঠ",
          },
          {
            label: "রাশি রিং ও গ্রহরত্ন",
            href: "/shop?category=zodiac#products",
            desc: "৯২৫ রূপার রাশি রিং ও গ্রহরত্ন তাবিজ গহনা",
            icon: Moon,
          },
          {
            label: "শ্রীযন্ত্র ও সেলিনাইট টাওয়ার",
            href: "/shop?category=vastu-home#products",
            desc: "ব্রাস মেরু শ্রীযন্ত্র ও মরোক্কান সেলিনাইট টাওয়ার",
            icon: Compass,
          },
          {
            label: "৩ডি হস্তরেখা বিচার (এআই)",
            href: "/palm-reading",
            desc: "৩ডি ক্যামেরা স্ক্যানে হস্তরেখা বিচার ও বিশ্লেষণ",
            icon: Hand,
            badge: "৩ডি এআই",
          },
          {
            label: "সমস্ত সামগ্রী দেখুন",
            href: "/shop",
            desc: "১০০+ ল্যাব ভেরিফাইড পবিত্র সামগ্রী এক্সপ্লোর করুন",
            icon: ShoppingBag,
            badge: "১০০+ আইটেম",
          },
        ],
        quickPills: [
          { label: "পরামর্শ", href: "/astrologers", badge: "লাইভ" },
          { label: "কুন্ডলী", href: "/kundli", badge: "ফ্রি" },
          { label: "রাশিফল", href: "/daily-horoscope" },
          { label: "পঞ্জিকা", href: "/panchang" },
          { label: "শপ", href: "/shop" },
          { label: "এআই গুরু", href: "/ai-astrologer", isAi: true },
        ],
        talkCta: "পরামর্শ নিন",
        statusText: "৫৪+ ভেরিফাইড জ্যোতিষী এখন সরাসরি লাইভ কলে উপস্থিত",
        walletText: "ওয়ালেট কয়েন",
        supportText: "কাস্টমার সাপোর্ট",
        verifyText: "কিউআর সনদপত্র যাচাই",
      };
    }

    if (language === "hi") {
      return {
        col1Title: "परामर्श एवं सेवाएं",
        col1Icon: Phone,
        col1Badge: "लाइव",
        col1Items: [
          {
            label: "ज्योतिषी से कॉल करें",
            href: "/astrologers",
            desc: "सत्यापित शीर्ष ज्योतिषाचार्यों से सीधे फोन पर बात करें",
            icon: Phone,
            badge: "तुरंत",
          },
          {
            label: "ज्योतिषी से चैट",
            href: "/astrologers",
            desc: "सुरक्षित और निजी ऑनलाइन चैट परामर्श",
            icon: MessageCircle,
            badge: "लोकप्रिय",
          },
          {
            label: "1-on-1 वीडियो अपॉइंटमेंट",
            href: "/appointments",
            desc: "गहन व्यक्तिगत मार्गदर्शन हेतु वीडियो सत्र बुक करें",
            icon: CalendarDays,
          },
          {
            label: "24/7 एआई वैदिक गुरु",
            href: "/ai-astrologer",
            desc: "3D रोबोट एआई द्वारा तत्काल सटीक वैदिक उत्तर",
            icon: Bot,
            badge: "फ्री",
          },
          {
            label: "ऑनलाइन पुरोहित बुकिंग",
            href: "/purohits",
            desc: "वैदिक आचार्यों के साथ लाइव ऑनलाइन पूजा व संकल्प",
            icon: Flame,
            badge: "नया",
          },
          {
            label: "ज्योतिषी के रूप में जुड़ें",
            href: "/become-an-astrologer",
            desc: "हमारे वैदिक मंच से ज्योतिषी बनकर सेवा प्रदान करें",
            icon: Award,
          },
        ],
        col2Title: "कुंडली एवं गणना",
        col2Icon: ScrollText,
        col2Badge: "वैदिक",
        col2Items: [
          {
            label: "मुफ़्त जन्म कुंडली",
            href: "/kundli",
            desc: "लग्न चार्ट, नवमांश, ग्रह स्थिति व दोष विश्लेषण",
            icon: ScrollText,
            badge: "100% फ्री",
          },
          {
            label: "कुंडली मिलान (36 गुण)",
            href: "/kundli-matching",
            desc: "अष्टकूट मिलान व वैवाहिक अनुकूलता परीक्षण",
            icon: HeartHandshake,
            badge: "36 गुण",
          },
          {
            label: "विंशोत्तरी महादशा",
            href: "/dasha-calculator",
            desc: "महादशा, अंतर्दशा व वर्तमान ग्रह काल समयरेखा",
            icon: Hourglass,
          },
          {
            label: "केपी ज्योतिष पद्धति",
            href: "/kp-calculator",
            desc: "कृष्णमूर्ति पद्धति कस्प व सब-लॉर्ड गणना",
            icon: Orbit,
          },
          {
            label: "नक्षत्र कैलकुलेटर",
            href: "/nakshatra-calculator",
            desc: "जन्म नक्षत्र, चरण, आराध्य देवता व शुभ वृक्ष",
            icon: Star,
          },
          {
            label: "अंकशास्त्र (न्यूमरोलॉजी)",
            href: "/numerology",
            desc: "मूलांक, भाग्यांक व शुभ अंक विस्तृत रिपोर्ट",
            icon: Sparkles,
          },
        ],
        col3Title: "दैनिक एवं पंचांग",
        col3Icon: Sun,
        col3Badge: "2026",
        col3Items: [
          {
            label: "आज का राशिफल",
            href: "/daily-horoscope",
            desc: "सभी 12 राशियों के लिए सटीक दैनिक भविष्यवाणी",
            icon: Sparkles,
            badge: "आज",
          },
          {
            label: "वार्षिक राशिफल 2026",
            href: "/annual-horoscope",
            desc: "प्रेम, करियर, धन एवं स्वास्थ्य का वार्षिक फलादेश",
            icon: Sun,
            badge: "2026",
          },
          {
            label: "दैनिक वैदिक पंचांग",
            href: "/panchang",
            desc: "तिथि, नक्षत्र, योग, करण एवं शुभ मुहूर्त",
            icon: Compass,
          },
          {
            label: "16 चौघड़िया मुहूर्त",
            href: "/panchang?tab=choghadiya",
            desc: "अमृत, शुभ, लाभ सहित मांगलिक कार्य समय",
            icon: Clock,
          },
          {
            label: "त्योहार एवं व्रत पंचांग",
            href: "/festivals",
            desc: "सनातन हिंदू पर्व, एकादशी, पूर्णिमा सूची 2026",
            icon: Flame,
          },
          {
            label: "वास्तु कंपास एवं 16 ज़ोन",
            href: "/vastu",
            desc: "16 दिशाओं का ऊर्जा संतुलन व गृह शांति उपाय",
            icon: Layers,
          },
        ],
        col4Title: "डिविनलिंक शॉप",
        col4Icon: ShoppingBag,
        col4Badge: "उपाय",
        col4Items: [
          {
            label: "सिद्ध नेपाली रुद्राक्ष",
            href: "/shop?category=rudraksha#products",
            desc: "1 से 14 मुखी काशी प्राण-प्रतिष्ठित हिमालयी रुद्राक्ष",
            icon: Sparkles,
            badge: "प्रमाणित",
          },
          {
            label: "ओरिजिनल करुंगली संग्रह",
            href: "/shop?category=karungali#products",
            desc: "शुद्ध काली आबनूस लकड़ी माला व कड़ा सुरक्षा हेतु",
            icon: ShieldCheck,
            badge: "शुद्ध काष्ठ",
          },
          {
            label: "राशि रिंग्स एवं रत्न",
            href: "/shop?category=zodiac#products",
            desc: "925 शुद्ध चांदी राशि रिंग्स एवं ग्रह रत्न",
            icon: Moon,
          },
          {
            label: "श्री यंत्र एवं सेलेनाइट टॉवर",
            href: "/shop?category=vastu-home#products",
            desc: "पीतल मेरु श्री यंत्र व सेलेनाइट चार्जिंग टॉवर",
            icon: Compass,
          },
          {
            label: "3D हस्तरेखा विश्लेषण (एआई)",
            href: "/palm-reading",
            desc: "3D कैमरा स्कैन से हस्तरेखा विश्लेषण",
            icon: Hand,
            badge: "3D एआई",
          },
          {
            label: "सभी पवित्र उत्पाद देखें",
            href: "/shop",
            desc: "100+ प्राण-प्रतिष्ठित वैदिक समाधान एक्सप्लोर करें",
            icon: ShoppingBag,
            badge: "100+ आइटम",
          },
        ],
        quickPills: [
          { label: "परामर्श", href: "/astrologers", badge: "लाइव" },
          { label: "कुंडली", href: "/kundli", badge: "फ्री" },
          { label: "राशिफल", href: "/daily-horoscope" },
          { label: "पंचांग", href: "/panchang" },
          { label: "शॉप", href: "/shop" },
          { label: "एआई गुरु", href: "/ai-astrologer", isAi: true },
        ],
        talkCta: "बात करें",
        statusText: "54+ सत्यापित ज्योतिषी अभी लाइव परामर्श हेतु ऑनलाइन हैं",
        walletText: "वॉलेट कॉइन",
        supportText: "कस्टमर सपोर्ट चैट",
        verifyText: "सर्टिफिकेट क्यूआर जांचें",
      };
    }

    // Default English
    return {
      col1Title: "Consultations",
      col1Icon: Phone,
      col1Badge: "Live",
      col1Items: [
        {
          label: "Talk to Astrologer",
          href: "/astrologers",
          desc: "Instant live voice consultations with verified experts",
          icon: Phone,
          badge: "Instant",
        },
        {
          label: "Chat with Astrologer",
          href: "/astrologers",
          desc: "Private end-to-end encrypted chat guidance",
          icon: MessageCircle,
          badge: "Popular",
        },
        {
          label: "1-on-1 Video Chamber",
          href: "/appointments",
          desc: "Deep-dive 1-on-1 private video chamber consultations",
          icon: CalendarDays,
        },
        {
          label: "24/7 AI Vedic Guru",
          href: "/ai-astrologer",
          desc: "Instant Vedic planetary intelligence via 3D mascot",
          icon: Bot,
          badge: "Free",
        },
        {
          label: "Book Online Purohit",
          href: "/purohits",
          desc: "Live 1-on-1 video puja & personalized Vedic Sankalpa",
          icon: Flame,
          badge: "New",
        },
        {
          label: "Become an Astrologer",
          href: "/become-an-astrologer",
          desc: "Join our verified global panel of certified Vedic experts",
          icon: Award,
        },
      ],
      col2Title: "Kundli & Tools",
      col2Icon: ScrollText,
      col2Badge: "Vedic",
      col2Items: [
        {
          label: "Free Janam Kundli",
          href: "/kundli",
          desc: "Detailed Lagna (D1), Navamsha (D9) & planetary dosha analysis",
          icon: ScrollText,
          badge: "100% Free",
        },
        {
          label: "Kundli Matching (36 Gunas)",
          href: "/kundli-matching",
          desc: "Ashtakoot Milan & comprehensive marriage compatibility",
          icon: HeartHandshake,
          badge: "36 Gunas",
        },
        {
          label: "Vimshottari Mahadasha",
          href: "/dasha-calculator",
          desc: "Mahadasha, Antardasha & sub-period timeline breakdown",
          icon: Hourglass,
        },
        {
          label: "KP Astrology Method",
          href: "/kp-calculator",
          desc: "Krishnamurti Paddhati sub-lords & planetary cusps",
          icon: Orbit,
        },
        {
          label: "Nakshatra Calculator",
          href: "/nakshatra-calculator",
          desc: "Determine your birth star, deity & ruling planet",
          icon: Star,
        },
        {
          label: "Numerology Report",
          href: "/numerology",
          desc: "Mulank, Bhagyank, destiny numbers & name correction",
          icon: Sparkles,
        },
      ],
      col3Title: "Horoscope & Almanac",
      col3Icon: Sun,
      col3Badge: "2026",
      col3Items: [
        {
          label: "Today's Horoscope",
          href: "/daily-horoscope",
          desc: "Daily personalized planetary transit forecast for 12 signs",
          icon: Sparkles,
          badge: "Daily",
        },
        {
          label: "Year 2026 Predictions",
          href: "/annual-horoscope",
          desc: "Annual roadmap for love, career, wealth & wellness",
          icon: Sun,
          badge: "2026",
        },
        {
          label: "Daily Vedic Panchang",
          href: "/panchang",
          desc: "Swiss Ephemeris Tithi, Nakshatra, Yoga, Karana & Day Lord",
          icon: Compass,
        },
        {
          label: "16 Choghadiya Muhurat",
          href: "/panchang?tab=choghadiya",
          desc: "Amrit, Shubh, Labh windows for immediate venture timing",
          icon: Clock,
        },
        {
          label: "Festivals & Vrat Almanac",
          href: "/festivals",
          desc: "Complete Hindu festival calendar, Ekadashi, Purnima",
          icon: Flame,
        },
        {
          label: "16-Zone Vastu Guide",
          href: "/vastu",
          desc: "Directional energy balance & remedies for home & office",
          icon: Layers,
        },
      ],
      col4Title: "DivinLink Shop",
      col4Icon: ShoppingBag,
      col4Badge: "Remedies",
      col4Items: [
        {
          label: "Siddh Nepali Rudraksha",
          href: "/shop?category=rudraksha#products",
          desc: "Authentic 1-14 Mukhi energized Himalayan beads",
          icon: Sparkles,
          badge: "Certified",
        },
        {
          label: "Original Karungali Wood",
          href: "/shop?category=karungali#products",
          desc: "Pure black ebony wood malas & kada bracelets",
          icon: ShieldCheck,
          badge: "Pure Ebony",
        },
        {
          label: "925 Silver Zodiac Rings",
          href: "/shop?category=zodiac#products",
          desc: "Energized astrological birthstone gemstone rings",
          icon: Moon,
        },
        {
          label: "Meru Sri Yantra & Selenite",
          href: "/shop?category=vastu-home#products",
          desc: "3D brass pyramids & Moroccan selenite charging towers",
          icon: Compass,
        },
        {
          label: "3D Palm Reading (AI)",
          href: "/palm-reading",
          desc: "3D camera scan of heart, head & life lines with depth AI",
          icon: Hand,
          badge: "3D AI",
        },
        {
          label: "Explore All Products",
          href: "/shop",
          desc: "Discover 100+ lab-certified energized spiritual items",
          icon: ShoppingBag,
          badge: "100+ items",
        },
      ],
      quickPills: [
        { label: "Consult", href: "/astrologers", badge: "Live" },
        { label: "Kundli", href: "/kundli", badge: "Free" },
        { label: "Horoscope", href: "/daily-horoscope" },
        { label: "Panchang", href: "/panchang" },
        { label: "Shop", href: "/shop" },
        { label: "AI Guru", href: "/ai-astrologer", isAi: true },
      ],
      talkCta: "Talk now",
      statusText: "54+ verified astrologers online right now for consultation",
      walletText: "Wallet Coins",
      supportText: "Customer Support",
      verifyText: "Verify QR Certificate",
    };
  }, [language]);

  // Find active pill element for the current pathname
  const getActivePillElement = React.useCallback(() => {
    for (const item of menuData.quickPills) {
      if (item.href === pathname || (item.href !== "/" && pathname.startsWith(item.href))) {
        return pillRefs.current.get(item.label) || null;
      }
    }
    return null;
  }, [menuData.quickPills, pathname]);

  // Sync indicator on pathname, language change or mount
  React.useEffect(() => {
    const activeEl = getActivePillElement();
    if (activeEl) {
      updateIndicator(activeEl, 1);
    } else {
      updateIndicator(null, 0);
    }
  }, [pathname, language, getActivePillElement, updateIndicator]);

  const handleNavLeave = () => {
    const activeEl = getActivePillElement();
    if (activeEl) {
      updateIndicator(activeEl, 1);
    } else {
      setIndicatorStyle((prev) => (prev ? { ...prev, opacity: 0 } : null));
    }
  };

  const nameOf = user?.full_name || user?.first_name || (language === "bn" ? "ব্যবহারকারী" : language === "hi" ? "यूज़र" : "User");
  const signInLabel = language === "bn" ? "লগ ইন" : language === "hi" ? "लॉग ইন" : "Sign In";

  // Warm surface color for the notch body & matching SVG ears
  const notchBgColor = "#fffbf7"; // Warm Sanctuary Ivory/Cream matching site theme

  return (
    <>
      {/* Spacer to prevent page content jump on non-overlay pages */}
      {!overlay && <div className="h-[54px] w-full shrink-0" aria-hidden="true" />}

      {/* =========================================================================
          iOS Dynamic Notch Container — Warm Vedic Sanctuary Theme
          Anchored flush at top center of screen with smooth spring expansion on hover/tap
          ========================================================================= */}
      <div className="fixed top-0 left-0 right-0 z-[120] pointer-events-none flex justify-center">
        <header
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "pointer-events-auto relative isolate mx-auto transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "bg-[#fffbf7]/95 text-[#1d1a1c] backdrop-blur-2xl -webkit-backdrop-blur-2xl",
            "border-b border-x border-amber-900/10 shadow-[0_16px_40px_-10px_rgba(114,63,19,0.15),0_2px_12px_rgba(114,63,19,0.06)]",
            // Collapsed vs Expanded Dimensions & Corners
            !isExpanded
              ? "w-[min(96vw,1080px)] rounded-b-[22px] max-h-[52px]"
              : "w-[min(96vw,1260px)] rounded-b-[30px] max-h-[min(640px,88vh)] shadow-[0_24px_56px_-12px_rgba(114,63,19,0.22),0_4px_18px_rgba(114,63,19,0.08)]",
          )}
          aria-expanded={isExpanded}
          role="navigation"
          aria-label="Cosmic Navigation Notch"
        >
          {/* ===================================================================
              Outer Concave Notch Ears (Wings)
              Seamlessly blends the vertical notch sides into the top edge of screen
              Color matches the warm cream #fffbf7 notch surface exactly!
              =================================================================== */}
          {/* Left Concave Ear */}
          <svg
            className="pointer-events-none absolute top-0 right-full select-none"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M 0 0 C 11.04 0 20 8.96 20 20 L 20 0 Z" fill={notchBgColor} />
            <path
              d="M 0 0 C 11.04 0 20 8.96 20 20"
              stroke="rgba(114, 63, 19, 0.12)"
              strokeWidth="1"
              fill="none"
            />
          </svg>

          {/* Right Concave Ear */}
          <svg
            className="pointer-events-none absolute top-0 left-full select-none"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M 0 20 C 0 8.96 8.96 0 20 0 L 0 0 Z" fill={notchBgColor} />
            <path
              d="M 0 20 C 0 8.96 8.96 0 20 0"
              stroke="rgba(114, 63, 19, 0.12)"
              strokeWidth="1"
              fill="none"
            />
          </svg>

          {/* Subtle Inner Warm Highlight Rim */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"
            aria-hidden="true"
          />

          {/* ===================================================================
              Top Bar (Always Visible at 50px Height) — Warm DivinLink Styling
              =================================================================== */}
          <div className="flex h-[50px] items-center justify-between gap-2 px-3 sm:px-4">
            {/* BRAND: Logo Mark + Wordmark */}
            <Link
              href="/"
              onClick={(e) => {
                if (onLogoClick) onLogoClick(e);
                setIsHovered(false);
                setIsManualExpanded(false);
              }}
              className="group flex items-center gap-2.5 shrink-0"
              aria-label="DivinLink Home"
            >
              <span className="relative flex size-7 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-[0_2px_8px_rgba(243,148,25,0.35)] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-6deg]">
                <Image
                  src="/logo.png"
                  alt=""
                  width={28}
                  height={28}
                  className="size-full object-contain"
                  priority
                />
              </span>
              <span className="font-voyage text-[30px] sm:text-[34px] font-normal leading-none tracking-[0.01em] text-[#1c1613] group-hover:text-amber-800 transition-colors select-none inline-flex items-center pt-0.5">
                DivinLink
              </span>
            </Link>

            {/* CENTER: Quick Nav Pills with Sliding Magnetic Pill Indicator (Desktop) */}
            <nav
              ref={navRef}
              onMouseLeave={handleNavLeave}
              className="relative hidden lg:flex items-center gap-1 xl:gap-1.5 p-1 rounded-full"
            >
              {/* Fluid Magnetic Pill Highlight (Apple Fluid Spring Physics) */}
              <div
                className="pointer-events-none absolute z-0 rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                style={{
                  transform: indicatorStyle
                    ? `translate3d(${indicatorStyle.left}px, ${indicatorStyle.top}px, 0)`
                    : "translate3d(0, 0, 0)",
                  width: indicatorStyle ? `${indicatorStyle.width}px` : 0,
                  height: indicatorStyle ? `${indicatorStyle.height}px` : 0,
                  opacity: indicatorStyle ? indicatorStyle.opacity : 0,
                  background:
                    "linear-gradient(135deg, rgba(243, 148, 25, 0.16) 0%, rgba(251, 191, 36, 0.10) 100%)",
                  border: "1px solid rgba(243, 148, 25, 0.35)",
                  boxShadow:
                    "0 2px 10px -2px rgba(217, 119, 6, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(6px)",
                }}
                aria-hidden="true"
              />

              {menuData.quickPills.map((item) => {
                const isActive =
                  item.href === pathname ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.label}
                    ref={(node) => {
                      if (node) pillRefs.current.set(item.label, node);
                      else pillRefs.current.delete(item.label);
                    }}
                    href={item.href}
                    onMouseEnter={(e) => updateIndicator(e.currentTarget, 1)}
                    onClick={() => {
                      setIsHovered(false);
                      setIsManualExpanded(false);
                    }}
                    className={cn(
                      "relative z-10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-medium transition-colors duration-200 select-none",
                      isActive
                        ? "text-[#1d1a1c] font-bold"
                        : "text-[#3d3235] hover:text-[#1d1a1c]",
                      item.isAi && !isActive && "text-amber-950 font-semibold",
                    )}
                  >
                    {item.isAi && (
                      <span className="relative flex size-2 shrink-0">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-500 opacity-75" />
                        <span className="relative inline-flex size-2 rounded-full bg-amber-600" />
                      </span>
                    )}
                    <span>{item.label}</span>
                    {item.badge && !item.isAi && (
                      <span className="rounded-full bg-amber-100 text-amber-900 border border-amber-300/60 px-1.5 py-0.2 text-[9px] font-bold leading-none">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Dynamic Expand Hint Icon */}
              <button
                type="button"
                ref={(node) => {
                  if (node) pillRefs.current.set("explore_menu_btn", node);
                  else pillRefs.current.delete("explore_menu_btn");
                }}
                onMouseEnter={(e) => updateIndicator(e.currentTarget, 1)}
                onClick={() => setIsManualExpanded((prev) => !prev)}
                className="relative z-10 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold text-amber-900 transition-colors ml-0.5 cursor-pointer select-none"
                title={isExpanded ? "Collapse Menu" : "Explore Mega Menu"}
                aria-label="Toggle Cosmic Menu"
              >
                <span>
                  {isExpanded
                    ? language === "bn"
                      ? "সংক্ষেপ"
                      : language === "hi"
                      ? "संक्षिप्त"
                      : "Close"
                    : language === "bn"
                    ? "মেনু"
                    : language === "hi"
                    ? "मेन्यू"
                    : "Explore"}
                </span>
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform duration-300 text-amber-700",
                    isExpanded && "rotate-180",
                  )}
                />
              </button>
            </nav>

            {/* RIGHT: Language, Cart, Profile & Talk CTA */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Language Switcher Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangDropdownOpen((v) => !v)}
                  className="inline-flex items-center gap-1 rounded-full bg-amber-50/90 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 text-[12px] font-medium text-[#1d1a1c] transition-colors"
                  aria-label="Change language"
                  aria-expanded={langDropdownOpen}
                >
                  <Globe className="size-3.5 text-amber-600" />
                  <span className="font-semibold">{language === "bn" ? "বাং" : language === "hi" ? "हि" : "EN"}</span>
                </button>

                {langDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setLangDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 z-40 w-36 rounded-2xl border border-amber-200 bg-[#fffdfa] p-1.5 shadow-xl backdrop-blur-xl">
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
                          className={cn(
                            "w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium text-[#3a3235] hover:bg-[#fbeee5] hover:text-[#1d1a1c] transition-colors",
                            language === l.code && "bg-[#fbe4d6] text-[#78350f] font-bold",
                          )}
                        >
                          <span>{l.label}</span>
                          <span className="text-[10px] text-[#8a7f83]">{l.badge}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Shopping Bag Button (Cart) */}
              <button
                type="button"
                onClick={openCart}
                className="relative inline-flex size-8 items-center justify-center rounded-full bg-amber-50/90 hover:bg-amber-100 border border-amber-200 text-[#1d1a1c] transition-colors"
                title={language === "bn" ? "কার্ট দেখুন" : language === "hi" ? "कार्ट देखें" : "View Cart"}
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="size-4 text-amber-700" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-[#f39419] text-[9px] font-bold text-white shadow-xs">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </button>

              {/* User Avatar / Profile Dropdown */}
              <div className="relative">
                {isSignedIn ? (
                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen((v) => !v)}
                    className="relative flex size-8 items-center justify-center rounded-full ring-2 ring-amber-400/80 overflow-hidden hover:ring-amber-500 transition-all cursor-pointer shadow-xs"
                    aria-label="User Account Menu"
                    aria-expanded={profileDropdownOpen}
                  >
                    <Avatar src={user?.avatar_url} name={nameOf} size="sm" className="size-full" />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => {
                      setIsHovered(false);
                      setIsManualExpanded(false);
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-amber-50/90 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 text-[12px] font-semibold text-[#1d1a1c] transition-colors"
                    title={signInLabel}
                  >
                    <User className="size-3.5 text-amber-700" />
                    <span className="hidden sm:inline">{signInLabel}</span>
                  </Link>
                )}

                {/* Profile Popup Card */}
                {isSignedIn && profileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 z-40 w-72 rounded-2xl border border-amber-200 bg-[#fffdfa] p-3 shadow-2xl backdrop-blur-2xl text-[#1d1a1c]">
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#fbeee5] border border-amber-200/60">
                        <Avatar
                          src={user?.avatar_url}
                          name={nameOf}
                          size="md"
                          className="size-10 border-2 border-white shadow-xs shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm text-[#1d1a1c] truncate leading-tight">{nameOf}</p>
                          <p className="text-[11.5px] text-[#8a7f83] truncate mt-0.5">
                            {user?.email || (user as { phone_number?: string })?.phone_number || (language === "bn" ? "অ্যাস্ট্রা ভক্ত" : language === "hi" ? "एस्ट्रा भक्त" : "Astra Devotee")}
                          </p>
                        </div>
                      </div>

                      <div className="my-2 h-px bg-amber-200/60" />

                      <div className="space-y-0.5">
                        <Link
                          href="/account"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-[#3a3235] hover:bg-[#fbeee5] hover:text-[#1d1a1c] transition-colors"
                        >
                          <Bell className="size-4 text-amber-600 shrink-0" />
                          <span>{language === "bn" ? "বিজ্ঞপ্তি" : language === "hi" ? "सूचनाएं" : "Notifications"}</span>
                        </Link>
                        <Link
                          href="/account/wallet"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium text-[#3a3235] hover:bg-[#fbeee5] hover:text-[#1d1a1c] transition-colors"
                        >
                          <span className="flex items-center gap-2.5">
                            <Coins className="size-4 text-amber-600 shrink-0" />
                            <span>{language === "bn" ? "ওয়ালেট কয়েন" : language === "hi" ? "वॉलेट कॉइन" : "Wallet Coins"}</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1d1a1c] bg-[#fbe4d6] border border-amber-300/60 px-2.5 py-0.5 rounded-full tabular-nums">
                            <GoldCoinIcon className="size-3.5 shrink-0" />
                            <span>{coinsBalance !== undefined ? formatCoins(coinsBalance) : walletLoading ? "..." : "0"}</span>
                          </span>
                        </Link>
                        <Link
                          href="/account/orders"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-[#3a3235] hover:bg-[#fbeee5] hover:text-[#1d1a1c] transition-colors"
                        >
                          <FileText className="size-4 text-amber-600 shrink-0" />
                          <span>{language === "bn" ? "অর্ডারের ইতিহাস" : language === "hi" ? "ऑर्डर इतिहास" : "Order History"}</span>
                        </Link>
                        <Link
                          href="/support"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-[#3a3235] hover:bg-[#fbeee5] hover:text-[#1d1a1c] transition-colors"
                        >
                          <MessageSquare className="size-4 text-amber-600 shrink-0" />
                          <span>{language === "bn" ? "কাস্টমার সাপোর্ট চ্যাট" : language === "hi" ? "कस्टमर सपोर्ट चैट" : "Customer Support"}</span>
                        </Link>
                      </div>

                      <div className="my-2 h-px bg-amber-200/60" />

                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="size-4 text-rose-500 shrink-0" />
                        <span>{language === "bn" ? "লগআউট" : language === "hi" ? "लॉग आउट" : "Logout"}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Talk Now CTA Saffron Pill */}
              <Link
                href="/astrologers"
                onClick={() => {
                  setIsHovered(false);
                  setIsManualExpanded(false);
                }}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#f6a650] via-[#f39419] to-[#d97706] px-3.5 py-1.5 text-[12.5px] font-bold text-white shadow-[0_4px_14px_rgba(217,119,6,0.4)] hover:brightness-105 hover:shadow-[0_4px_18px_rgba(217,119,6,0.6)] transition-all shrink-0"
              >
                <Phone className="size-3.5 stroke-[2.2]" />
                <span>{menuData.talkCta}</span>
                <ArrowRight className="size-3.5 stroke-[2.5]" />
              </Link>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setIsManualExpanded((prev) => !prev)}
                className="lg:hidden inline-flex size-8 items-center justify-center rounded-full bg-amber-100/80 text-[#1d1a1c] hover:bg-amber-200 transition-colors"
                aria-label="Toggle Navigation"
              >
                {isExpanded ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>
            </div>
          </div>

          {/* ===================================================================
              Expanded Cosmic Mega Menu (Smooth Slide-Down on Hover/Click)
              Warm Sanctuary Ivory/Cream Theme matching DivinLink design language
              =================================================================== */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
              isExpanded
                ? "opacity-100 max-h-[min(580px,84vh)] visible"
                : "opacity-0 max-h-0 invisible pointer-events-none",
            )}
          >
            {/* Hairline Divider */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />

            {/* 4-Column Mega Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4 lg:p-6 overflow-y-auto max-h-[min(480px,70vh)]">
              {/* Column 1: Consultations */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 pb-1.5 border-b border-amber-200/60">
                  <span className="flex size-6 items-center justify-center rounded-lg bg-[#fbe7da] text-[#b45309]">
                    <menuData.col1Icon className="size-3.5" />
                  </span>
                  <span className="text-[13px] font-bold text-[#1d1a1c] tracking-wide">
                    {menuData.col1Title}
                  </span>
                  <span className="ml-auto rounded-full bg-[#fbe4d6] px-2 py-0.5 text-[9px] font-bold text-[#78350f]">
                    {menuData.col1Badge}
                  </span>
                </div>
                <div className="space-y-1">
                  {menuData.col1Items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => {
                          setIsHovered(false);
                          setIsManualExpanded(false);
                        }}
                        className="group flex items-start gap-2.5 rounded-xl p-2 bg-white/70 hover:bg-white border border-amber-100 hover:border-amber-300/80 shadow-2xs hover:shadow-xs transition-all"
                      >
                        <span className="mt-0.5 flex size-6.5 shrink-0 items-center justify-center rounded-lg bg-[#fdf2e9] text-[#d97706] group-hover:bg-[#fbe7da] group-hover:scale-105 transition-all">
                          <Icon className="size-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="text-[12.5px] font-semibold text-[#1d1a1c] group-hover:text-[#b45309] transition-colors truncate">
                              {item.label}
                            </span>
                            {item.badge && (
                              <span className="shrink-0 rounded-full bg-[#fef3c7] text-[#92400e] border border-amber-300/50 text-[9px] font-bold px-1.5 py-0.2">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#73676c] line-clamp-1 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Column 2: Kundli & Tools */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 pb-1.5 border-b border-amber-200/60">
                  <span className="flex size-6 items-center justify-center rounded-lg bg-[#fbe7da] text-[#b45309]">
                    <menuData.col2Icon className="size-3.5" />
                  </span>
                  <span className="text-[13px] font-bold text-[#1d1a1c] tracking-wide">
                    {menuData.col2Title}
                  </span>
                  <span className="ml-auto rounded-full bg-[#fbe4d6] px-2 py-0.5 text-[9px] font-bold text-[#78350f]">
                    {menuData.col2Badge}
                  </span>
                </div>
                <div className="space-y-1">
                  {menuData.col2Items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => {
                          setIsHovered(false);
                          setIsManualExpanded(false);
                        }}
                        className="group flex items-start gap-2.5 rounded-xl p-2 bg-white/70 hover:bg-white border border-amber-100 hover:border-amber-300/80 shadow-2xs hover:shadow-xs transition-all"
                      >
                        <span className="mt-0.5 flex size-6.5 shrink-0 items-center justify-center rounded-lg bg-[#fdf2e9] text-[#d97706] group-hover:bg-[#fbe7da] group-hover:scale-105 transition-all">
                          <Icon className="size-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="text-[12.5px] font-semibold text-[#1d1a1c] group-hover:text-[#b45309] transition-colors truncate">
                              {item.label}
                            </span>
                            {item.badge && (
                              <span className="shrink-0 rounded-full bg-[#fef3c7] text-[#92400e] border border-amber-300/50 text-[9px] font-bold px-1.5 py-0.2">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#73676c] line-clamp-1 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Column 3: Horoscope & Almanac */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 pb-1.5 border-b border-amber-200/60">
                  <span className="flex size-6 items-center justify-center rounded-lg bg-[#fbe7da] text-[#b45309]">
                    <menuData.col3Icon className="size-3.5" />
                  </span>
                  <span className="text-[13px] font-bold text-[#1d1a1c] tracking-wide">
                    {menuData.col3Title}
                  </span>
                  <span className="ml-auto rounded-full bg-[#fbe4d6] px-2 py-0.5 text-[9px] font-bold text-[#78350f]">
                    {menuData.col3Badge}
                  </span>
                </div>
                <div className="space-y-1">
                  {menuData.col3Items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => {
                          setIsHovered(false);
                          setIsManualExpanded(false);
                        }}
                        className="group flex items-start gap-2.5 rounded-xl p-2 bg-white/70 hover:bg-white border border-amber-100 hover:border-amber-300/80 shadow-2xs hover:shadow-xs transition-all"
                      >
                        <span className="mt-0.5 flex size-6.5 shrink-0 items-center justify-center rounded-lg bg-[#fdf2e9] text-[#d97706] group-hover:bg-[#fbe7da] group-hover:scale-105 transition-all">
                          <Icon className="size-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="text-[12.5px] font-semibold text-[#1d1a1c] group-hover:text-[#b45309] transition-colors truncate">
                              {item.label}
                            </span>
                            {item.badge && (
                              <span className="shrink-0 rounded-full bg-[#fef3c7] text-[#92400e] border border-amber-300/50 text-[9px] font-bold px-1.5 py-0.2">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#73676c] line-clamp-1 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Column 4: DivinLink Shop */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 pb-1.5 border-b border-amber-200/60">
                  <span className="flex size-6 items-center justify-center rounded-lg bg-[#fbe7da] text-[#b45309]">
                    <menuData.col4Icon className="size-3.5" />
                  </span>
                  <span className="text-[13px] font-bold text-[#1d1a1c] tracking-wide">
                    {menuData.col4Title}
                  </span>
                  <span className="ml-auto rounded-full bg-[#fbe4d6] px-2 py-0.5 text-[9px] font-bold text-[#78350f]">
                    {menuData.col4Badge}
                  </span>
                </div>
                <div className="space-y-1">
                  {menuData.col4Items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => {
                          setIsHovered(false);
                          setIsManualExpanded(false);
                        }}
                        className="group flex items-start gap-2.5 rounded-xl p-2 bg-white/70 hover:bg-white border border-amber-100 hover:border-amber-300/80 shadow-2xs hover:shadow-xs transition-all"
                      >
                        <span className="mt-0.5 flex size-6.5 shrink-0 items-center justify-center rounded-lg bg-[#fdf2e9] text-[#d97706] group-hover:bg-[#fbe7da] group-hover:scale-105 transition-all">
                          <Icon className="size-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="text-[12.5px] font-semibold text-[#1d1a1c] group-hover:text-[#b45309] transition-colors truncate">
                              {item.label}
                            </span>
                            {item.badge && (
                              <span className="shrink-0 rounded-full bg-[#fef3c7] text-[#92400e] border border-amber-300/50 text-[9px] font-bold px-1.5 py-0.2">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#73676c] line-clamp-1 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Status & Quick Links Strip inside Notch */}
            <div className="border-t border-amber-200/70 bg-[#f8ede3] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Left Live Status */}
              <div className="flex items-center gap-2 text-[#1d1a1c]">
                <span className="relative flex size-2 shrink-0">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-600" />
                </span>
                <span className="text-[11.5px] font-semibold text-emerald-800">{menuData.statusText}</span>
              </div>

              {/* Right Utility Links */}
              <div className="flex items-center gap-3 ml-auto text-[11.5px] text-[#6b5f63]">
                <Link
                  href="/palm-reading"
                  onClick={() => {
                    setIsHovered(false);
                    setIsManualExpanded(false);
                  }}
                  className="hover:text-amber-800 transition-colors flex items-center gap-1 font-medium"
                >
                  <Hand className="size-3 text-amber-600" />
                  <span>3D Palm AI</span>
                </Link>
                <span>•</span>
                <Link
                  href="/verify/certificate/sample"
                  onClick={() => {
                    setIsHovered(false);
                    setIsManualExpanded(false);
                  }}
                  className="hover:text-amber-800 transition-colors flex items-center gap-1 font-medium"
                >
                  <ShieldCheck className="size-3 text-amber-600" />
                  <span>{menuData.verifyText}</span>
                </Link>
                <span>•</span>
                <Link
                  href="/support"
                  onClick={() => {
                    setIsHovered(false);
                    setIsManualExpanded(false);
                  }}
                  className="hover:text-amber-800 transition-colors flex items-center gap-1 font-medium"
                >
                  <MessageSquare className="size-3 text-amber-600" />
                  <span>{menuData.supportText}</span>
                </Link>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Universal Cart Drawer */}
      <CartDrawer />
    </>
  );
}
