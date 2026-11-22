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
  Gem,
  Gift,
  Globe,
  GraduationCap,
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
  Radio,
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
import { createPortal } from "react-dom";

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

interface NavDropdownItem {
  label: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconUrl?: string | null;
  badge?: string;
}

interface NavCategory {
  label: string;
  href: string;
  badge?: string;
  isLive?: boolean;
  dropdown?: NavDropdownItem[];
}

export function AstroyogiHeader() {
  const pathname = usePathname();
  const { user, isSignedIn, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { data: walletData, isLoading: walletLoading } = useWallet(Boolean(isSignedIn));
  const coinsBalance = walletData?.wallet?.balance_coins;
  const { openCart, getItemCount } = useCartStore();
  const cartItemCount = getItemCount();

  const [hoveredCategory, setHoveredCategory] = React.useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = React.useState<string | null>(null);
  const [langDropdownOpen, setLangDropdownOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  // The drawer is portalled to <body>, so it must only render after mount
  // (document is unavailable during SSR).
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Hide the header on scroll down, reveal it on scroll up.
  const [headerHidden, setHeaderHidden] = React.useState(false);
  React.useEffect(() => {
    let last = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const delta = y - last;
      // Ignore tiny jitters; always show near the very top.
      if (Math.abs(delta) > 6) {
        setHeaderHidden(delta > 0 && y > 80);
        last = y;
      } else if (y <= 80) {
        setHeaderHidden(false);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep the header visible whenever a menu is open, so it never hides mid-use.
  const anyMenuOpen = mobileMenuOpen || langDropdownOpen || profileDropdownOpen || Boolean(hoveredCategory);

  // Lock the page behind the open drawer, and restore on close.
  React.useEffect(() => {
    if (!mobileMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileMenuOpen]);

  // Close menus on path change
  React.useEffect(() => {
    setMobileMenuOpen(false);
    setHoveredCategory(null);
    setLangDropdownOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  // Fetch real-time active categories with 0ms pre-hydration
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

  const navCategories = React.useMemo<NavCategory[]>(() => {
    // Dynamically build category dropdown items matching Kundli-style
    const shopDropdownItems: NavDropdownItem[] = (dynamicCategories || []).map((c: any) => {
      const slug = (c.slug || "").toLowerCase();
      let icon = ShoppingBag;
      if (slug.includes("rudraksh")) icon = Sparkles;
      else if (slug.includes("zodiac")) icon = Moon;
      else if (slug.includes("bracelet") || slug.includes("ring")) icon = Gem;
      else if (slug.includes("karungali")) icon = ShieldCheck;
      else if (slug.includes("vastu") || slug.includes("home")) icon = Compass;

      let label = c.name;
      let description = c.description || "";
      if (language === "bn") {
        if (slug === "rudraksh") {
          label = "রুদ্রাক্ষ (Rudraksh)";
          description = "শীর্ষ মানের ল্যাব সার্টিফাইড পবিত্র রুদ্রাক্ষ";
        } else if (slug === "zodiac") {
          label = "রাশি কালেকশন (Zodiac Collection)";
          description = "৯২৫ রূপার রাশি রিং ও গ্রহরত্ন তাবিজ গহনা";
        } else if (slug === "bracelets") {
          label = "ব্রেসলেট ও আংটি (Bracelets & Rings)";
          description = "ধন যোগ অ্যাবান্ডেন্স ব্যান্ড, পায়রাইট আংটি ও ক্রিস্টাল";
        } else if (slug === "rudraksha") {
          label = "সিদ্ধ নেপালি রুদ্রাক্ষ (Nepali Rudraksha)";
          description = "১-১৪ মুখী কাশীর মহাদেবের প্রাণ-প্রতিষ্ঠিত রুদ্রাক্ষ";
        } else if (slug === "karungali") {
          label = "আসল করুঙ্গলি (Original Karungali)";
          description = "কালো আবলুস কাঠের মালা ও ব্রেসলেট নজরদোষ সুরক্ষায়";
        } else if (slug === "vastu-home") {
          label = "বাস্তু ও গৃহ শান্তি (Vastu & Home)";
          description = "শ্রীযন্ত্র, মরোক্কান সেলিনাইট টাওয়ার ও গৃহশান্তি প্রতিকার";
        }
      } else if (language === "hi") {
        if (slug === "rudraksh") {
          label = "रुद्राक्ष (Rudraksh)";
          description = "उच्च गुणवत्ता एवं लैब प्रमाणित पवित्र रुद्राक्ष";
        } else if (slug === "zodiac") {
          label = "राशि कलेक्शन (Zodiac Collection)";
          description = "925 शुद्ध चांदी राशि रिंग्स एवं रत्न आभूषण";
        } else if (slug === "bracelets") {
          label = "कंगन और अंगूठियां (Bracelets & Rings)";
          description = "धन योग समृद्धि बैंड, पाइराइट रिंग्स व ब्रेसलेट";
        } else if (slug === "rudraksha") {
          label = "सिद्ध नेपाली रुद्राक्ष (Nepali Rudraksha)";
          description = "1 से 14 मुखी काशी प्राण-प्रतिष्ठित हिमालयी रुद्राक्ष";
        } else if (slug === "karungali") {
          label = "ओरिजिनल करुंगली (Original Karungali)";
          description = "शुद्ध काली आबनूस लकड़ी माला व कड़ा सुरक्षा हेतु";
        } else if (slug === "vastu-home") {
          label = "वास्तु एवं गृह शांति (Vastu & Home)";
          description = "श्री यंत्र, सेलेनाइट चार्जिंग टॉवर व वास्तु उपाय";
        }
      }

      const count = c.product_count ?? 0;
      const countLabel = language === "bn" ? `${count}টি সামগ্রী` : language === "hi" ? `${count} आइटम` : `${count} items`;

      return {
        label,
        href: `/shop?category=${c.slug}#products`,
        description: description || countLabel,
        icon,
        iconUrl: c.icon_url || null,
        badge: countLabel,
      };
    });
    if (language === "bn") {
      return [
        {
          label: "পরামর্শ",
          href: "/astrologers",
          dropdown: [
            {
              label: "জ্যোতিষীর সাথে কল",
              href: "/astrologers",
              description: "ভেরিফাইড শীর্ষ জ্যোতিষীদের সাথে সরাসরি ভয়েস কলে কথা বলুন",
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
            {
              label: "জ্যোতিষী হিসেবে যুক্ত হন",
              href: "/become-an-astrologer",
              description: "আমাদের বৈদিক প্যানেলে জ্যোতিষী হিসেবে আবেদন করুন ও জাতকদের পরামর্শ দিন",
              icon: Award,
              badge: "আবেদন",
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
              href: "/annual-horoscope",
              description: "প্রেম, ক্যারিয়ার, অর্থ ও স্বাস্থ্যের বার্ষিক ভবিষ্যৎবাণী ও লাল কিতাব মহাউপায়",
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
          label: "পঞ্জিকা ও উৎসব",
          href: "/festivals",
          badge: "২০২৬",
          dropdown: [
            {
              label: "উৎসব ও ব্রত পঞ্জিকা ২০২৬",
              href: "/festivals",
              description: "সনাতন হিন্দু উৎসব, ব্রত, একাদশী, অমাবস্যা ও পূর্ণিমা সূচী",
              icon: Flame,
              badge: "২০২৬",
            },
            {
              label: "আজকের পঞ্চাঙ্গ ও কাল-নির্ণয়",
              href: "/panchang",
              description: "সুইস এফিমেরিস ভিত্তিক তিথি, নক্ষত্র, যোগ, করণ ও বারের সমন্বয়",
              icon: Compass,
              badge: "আজ",
            },
            {
              label: "১৬ বৈদিক চোঘড়িয়া মুহূর্ত",
              href: "/panchang?tab=choghadiya",
              description: "অমৃত, শুভ, লাভ সহ জরুরি কর্ম শুরুর প্রশস্ত সময়সূচী",
              icon: Clock,
            },
            {
              label: "শুভ মুহূর্ত নির্দেশিকা",
              href: "/muhurat",
              description: "বিবাহ, গৃহপ্রবেশ, বাহন ক্রয় ও শুভ উদ্যোগের লগ্ন",
              icon: Star,
            },
          ],
        },
        {
          label: "কোর্স",
          href: "/courses",
          dropdown: [
            {
              label: "সমস্ত মাস্টারক্লাস",
              href: "/courses",
              description: "বৈদিক জ্যোতিষ, লাল কিতাব, নিউমেরোলজি ও কেপি প্রফেশনাল কোর্স",
              icon: GraduationCap,
              badge: "গুরুকুল",
            },
            {
              label: "আমার অধ্যয়ন ও ক্লাস",
              href: "/account/courses",
              description: "আপনার নথিভুক্ত কোর্স, ভিডিও ক্লাসরুম ও স্টাডি নোট",
              icon: BookOpen,
              badge: "এনরোল্ড",
            },
            {
              label: "সার্টিফিকেট যাচাই",
              href: "/verify/certificate/sample",
              description: "অনলাইন আইডি ও কিউআর দ্বারা কোর্স সনদপত্র যাচাই করুন",
              icon: Award,
            },
          ],
        },
        {
          label: "শপ",
          href: "/shop",
          dropdown: shopDropdownItems,
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
        {
          label: "অনলাইন পূজা",
          href: "/purohits",
          dropdown: [
            {
              label: "অনলাইন পুরোহিত বুকিং",
              href: "/purohits",
              description: "বৈদিক আচার্য ও পুরোহিতদের সাথে সরাসরি লাইভ পূজা ও সংকল্প",
              icon: Flame,
              badge: "নতুন",
            },
            {
              label: "অনলাইন পুরোহিত তালিকা",
              href: "/purohits?online=true",
              description: "এই মুহূর্তে যেসব পুরোহিত পূজার জন্য অনলাইন আছেন",
              icon: Radio,
              badge: "অনলাইন",
            },
            {
              label: "আমার পূজার রেকর্ড",
              href: "/account/purohit-bookings",
              description: "আপনার বুক করা পূজা ও সরাসরি ভিডিও রুমে প্রবেশের লিঙ্ক",
              icon: ScrollText,
            },
            {
              label: "বৈদিক পুরোহিত হিসেবে যুক্ত হন",
              href: "/become-a-purohit",
              description: "আমাদের বৈদিক প্ল্যাটফর্মে পুরোহিত হিসেবে আবেদন করুন ও পূজা সম্পন্ন করুন",
              icon: Award,
              badge: "আবেদন",
            },
          ],
        },
        { label: "ফ্রি ভাগ্যফল", href: "/free-readings" },
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
              description: "सत्यापित शीर्ष ज्योतिषाचार्यों से सीधे फोन पर बात करें",
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
            {
              label: "ज्योतिषी के रूप में जुड़ें",
              href: "/become-an-astrologer",
              description: "हमारे वैदिक मंच से ज्योतिषी के रूप में जुड़कर सेवा प्रदान करें",
              icon: Award,
              badge: "आवेदन",
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
          label: "पंचांग व व्रत",
          href: "/festivals",
          badge: "2026",
          dropdown: [
            {
              label: "उत्सव व व्रत पंचांग 2026",
              href: "/festivals",
              description: "सनातन हिन्दू त्यौहार, व्रत, एकादशी, पूर्णिमा व अमावस्या",
              icon: Flame,
              badge: "2026",
            },
            {
              label: "दैनिक वैदिक पंचांग",
              href: "/panchang",
              description: "प्रामाणिक तिथि, नक्षत्र, योग, करण व सूर्योदय-सूर्यास्त",
              icon: Compass,
              badge: "आज",
            },
            {
              label: "चौघड़िया मुहूर्त",
              href: "/panchang?tab=choghadiya",
              description: "अमृत, शुभ, लाभ आदि तात्कालिक कार्य सिद्धि मुहूर्त",
              icon: Clock,
            },
            {
              label: "शुभ मुहूर्त",
              href: "/muhurat",
              description: "विवाह, गृह प्रवेश, वाहन क्रय एवं व्यापार आरंभ लग्न",
              icon: Star,
            },
          ],
        },
        {
          label: "कोर्स",
          href: "/courses",
          dropdown: [
            {
              label: "सभी मास्टरक्लास",
              href: "/courses",
              description: "वैदिक ज्योतिष, लाल किताब, न्यूमरोलॉजी एवं केपी प्रोफेशनल कोर्स",
              icon: GraduationCap,
              badge: "गुरुकुल",
            },
            {
              label: "मेरी पढ़ाई और कक्षाएं",
              href: "/account/courses",
              description: "आपके नामांकित कोर्स, वीडियो क्लासरूम व स्टडी नोट्स",
              icon: BookOpen,
              badge: "नामांकित",
            },
            {
              label: "सर्टिफिकेट सत्यापन",
              href: "/verify/certificate/sample",
              description: "ऑनलाइन आईडी और क्यूआर द्वारा कोर्स प्रमाण पत्र सत्यापित करें",
              icon: Award,
            },
          ],
        },
        {
          label: "शॉप",
          href: "/shop",
          dropdown: shopDropdownItems,
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
        {
          label: "ऑनलाइन पूजा",
          href: "/purohits",
          dropdown: [
            {
              label: "ऑनलाइन पुरोहित बुकिंग",
              href: "/purohits",
              description: "वैदिक पंडितों के साथ सीधे लाइव वीडियो पूजा व संकल्प",
              icon: Flame,
              badge: "नया",
            },
            {
              label: "ऑनलाइन पंडित सूची",
              href: "/purohits?online=true",
              description: "वर्तमान में पूजा हेतु उपलब्ध लाइव पुरोहित",
              icon: Radio,
              badge: "ऑनलाइन",
            },
            {
              label: "मेरी पूजा बुकिंग",
              href: "/account/purohit-bookings",
              description: "आपकी बुक की गई पूजा और वीडियो रूम का सीधा लिंक",
              icon: ScrollText,
            },
            {
              label: "वैदिक पुरोहित के रूप में जुड़ें",
              href: "/become-a-purohit",
              description: "हमारे वैदिक मंच से पुरोहित के रूप में जुड़कर सेवा प्रदान करें",
              icon: Award,
              badge: "आवेदन",
            },
          ],
        },
        { label: "मुफ़्त फलादेश", href: "/free-readings" },
      ];
    }

    // Default English (Clean, Concise, Astrotalk-style single-word labels)
    return [
      {
        label: "Consult",
        href: "/astrologers",
        dropdown: [
          {
            label: "Talk to Astrologer",
            href: "/astrologers",
            description: "Instant voice consultation with verified Vedic experts",
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
          {
            label: "Become an Astrologer",
            href: "/become-an-astrologer",
            description: "Apply as a certified Astrologer & consult seekers globally",
            icon: Award,
            badge: "Join Us",
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
        label: "Panchang",
        href: "/festivals",
        badge: "2026",
        dropdown: [
          {
            label: "Festivals & Vrat Almanac 2026",
            href: "/festivals",
            description: "Complete Hindu festival calendar, Ekadashi, Purnima & Amavasya",
            icon: Flame,
            badge: "2026",
          },
          {
            label: "Daily Vedic Panchang",
            href: "/panchang",
            description: "Swiss Ephemeris Tithi, Nakshatra, Yoga, Karana & Day Lord",
            icon: Compass,
            badge: "Today",
          },
          {
            label: "16 Choghadiya Muhurat",
            href: "/panchang?tab=choghadiya",
            description: "Amrit, Shubh, Labh windows for immediate venture timing",
            icon: Clock,
          },
          {
            label: "Shubh Muhurat Guide",
            href: "/muhurat",
            description: "Auspicious timings for weddings, Griha Pravesh & purchases",
            icon: Star,
          },
        ],
      },
      {
        label: "Courses",
        href: "/courses",
        dropdown: [
          {
            label: "All Masterclasses",
            href: "/courses",
            description: "Vedic Astrology, Lal Kitab, Numerology & KP Professional Courses",
            icon: GraduationCap,
            badge: "Gurukul",
          },
          {
            label: "My Enrolled Courses",
            href: "/account/courses",
            description: "Your enrolled video classrooms, lessons & study notes",
            icon: BookOpen,
            badge: "Enrolled",
          },
          {
            label: "Verify Certificate",
            href: "/verify/certificate/sample",
            description: "Verify authentic tamper-proof certificate by ID & QR",
            icon: Award,
          },
        ],
      },
      {
        label: "Shop",
        href: "/shop",
        dropdown: shopDropdownItems,
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
        {
          label: "Purohits",
          href: "/purohits",
          dropdown: [
            {
              label: "Book Online Vedic Purohit",
              href: "/purohits",
              description: "Live 1-on-1 two-way video puja & personalized Vedic Sankalpa",
              icon: Flame,
              badge: "New",
            },
            {
              label: "Live Online Pandits",
              href: "/purohits?online=true",
              description: "Purohits available immediately for instant auspicious rituals",
              icon: Radio,
              badge: "Online",
            },
            {
              label: "My Puja Bookings",
              href: "/account/purohit-bookings",
              description: "View booked rituals, sankalpa details & join live video room",
              icon: ScrollText,
            },
            {
              label: "Become a Vedic Purohit",
              href: "/become-a-purohit",
              description: "Apply as a certified Vedic Acharya & perform online live pujas",
              icon: Award,
              badge: "Join Us",
            },
          ],
        },
      { label: "Free Readings", href: "/free-readings" },
    ];
  }, [language, dynamicCategories]);

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
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-white/95 dark:bg-[#140f0c]/95 backdrop-blur-md border-b border-stone-200/80 shadow-[0_2px_15px_-4px_rgba(26,18,8,0.06)]",
        "transition-transform duration-300 ease-out will-change-transform",
        headerHidden && !anyMenuOpen ? "-translate-y-full" : "translate-y-0",
      )}
    >
      {/* Astrotalk-Style Unified Single Row Navigation Bar */}
      <div className="mx-auto max-w-[1600px] w-full px-2 sm:px-4 xl:px-3 2xl:px-6">
        <div className="flex h-16 sm:h-[68px] items-center justify-between gap-1 xl:gap-1.5 2xl:gap-3 overflow-visible">
          {/* ================= LEFT: Brand Logo + Name ================= */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 whitespace-nowrap">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="xl:hidden flex size-9 items-center justify-center rounded-xl border border-stone-200 text-stone-900 hover:bg-stone-50 transition-colors"
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
              <span className="font-display hidden sm:inline whitespace-nowrap text-[17px] sm:text-[18px] font-bold tracking-wide text-foreground group-hover:text-amber-700 transition-colors">
                DivinLink
              </span>
            </Link>
          </div>

          {/* ================= CENTER: Single-Row Luxury Navigation Links ================= */}
          <nav className="hidden xl:flex items-center gap-0.5 xl:gap-0.5 2xl:gap-1 whitespace-nowrap shrink-0 overflow-visible">
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
                    onClick={() => setHoveredCategory(null)}
                    className={`whitespace-nowrap shrink-0 inline-flex items-center gap-0.5 xl:gap-1 px-1.5 xl:px-2 2xl:px-2.5 py-1.5 rounded-full text-[12px] xl:text-[12.5px] 2xl:text-[13.5px] font-semibold tracking-normal transition-all duration-150 select-none ${
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

                    {cat.badge && (
                      <span className="rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-300 text-[9px] font-bold px-1.5 py-0.5 leading-none shrink-0 border border-amber-400/30">
                        {cat.badge}
                      </span>
                    )}

                    {hasDropdown && (
                      <ChevronDown
                        className={cn(
                          "size-3 2xl:size-3.5 text-stone-400 transition-transform duration-200 shrink-0",
                          isHovered && "rotate-180 text-amber-700"
                        )}
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu Popup */}
                  {hasDropdown && isHovered && (
                    <div
                      className={cn(
                        "absolute left-0 top-full pt-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150",
                        cat.href === "/shop" ? "w-[440px] sm:w-[480px] max-w-[calc(100vw-24px)]" : "w-80"
                      )}
                    >
                      <div className="overflow-hidden rounded-2xl border border-amber-200/90 bg-white p-2 shadow-[0_18px_45px_-10px_rgba(26,18,8,0.18)] ring-1 ring-black/5">
                        <div className="space-y-1">
                          {cat.dropdown?.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setHoveredCategory(null)}
                                className="group/item flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-amber-50/80"
                              >
                                <div className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100/90 text-amber-800 group-hover/item:bg-amber-200 transition-colors overflow-hidden border border-amber-200 shadow-2xs">
                                  {item.iconUrl ? (
                                    <Image
                                      src={item.iconUrl}
                                      alt={item.label}
                                      fill
                                      sizes="40px"
                                      className="object-cover"
                                      unoptimized
                                    />
                                  ) : (
                                    <Icon className="size-5" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-2.5 min-w-0">
                                    <span className="font-bold text-xs sm:text-[13px] text-stone-900 group-hover/item:text-amber-800 leading-tight truncate">
                                      {item.label}
                                    </span>
                                    {item.badge && (
                                      <span className="shrink-0 rounded-full bg-amber-100 text-amber-950 text-[10px] font-bold px-2 py-0.5 border border-amber-300/80 whitespace-nowrap shadow-2xs ml-auto">
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="mt-0.5 text-[11px] text-stone-500 leading-snug line-clamp-1">
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
          <div className="flex items-center gap-1.5 xl:gap-2 2xl:gap-2.5 shrink-0 whitespace-nowrap">
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

            {/* Cart Button: Appears on Shop pages or whenever items are added */}
            {(pathname.startsWith("/shop") || cartItemCount > 0) && (
              <button
                type="button"
                onClick={openCart}
                className="relative inline-flex size-9 sm:size-[38px] items-center justify-center rounded-full border border-stone-200 hover:border-amber-400 bg-white hover:bg-amber-50/50 text-stone-700 hover:text-amber-800 transition-all cursor-pointer shrink-0 shadow-2xs animate-in fade-in duration-200"
                title={language === "bn" ? "কার্ট দেখুন" : language === "hi" ? "कार्ट देखें" : "View Cart"}
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="size-4 sm:size-4.5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-extrabold text-white shadow-xs animate-in zoom-in-75 duration-150">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </button>
            )}

            {/* User Profile Dropdown or Sign In */}
            {isSignedIn ? (
              <div className="relative shrink-0 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((v) => !v)}
                  className="flex size-8.5 sm:size-9 items-center justify-center rounded-full border-2 border-amber-400 hover:border-amber-500 overflow-hidden shrink-0 shadow-2xs hover:scale-105 transition-all cursor-pointer ring-2 ring-amber-100"
                  aria-expanded={profileDropdownOpen}
                  aria-label="User account menu"
                >
                  <Avatar
                    src={user?.avatar_url}
                    name={user?.full_name || user?.first_name || "User"}
                    size="sm"
                    className="size-full"
                  />
                </button>

                {profileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setProfileDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-2.5 z-50 w-72 rounded-3xl border border-stone-200 bg-white p-3 shadow-[0_20px_50px_rgba(26,18,8,0.18)] animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5">
                      {/* User Header Profile Card */}
                      <div className="flex items-center gap-3 p-2 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/50">
                        <Avatar
                          src={user?.avatar_url}
                          name={user?.full_name || user?.first_name || "User"}
                          size="md"
                          className="size-11 border-2 border-amber-400 shadow-sm shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-sm text-stone-900 truncate leading-tight">
                            {user?.full_name || user?.first_name || "User"}
                          </h4>
                          <p className="text-[11px] text-stone-500 truncate mt-0.5">
                            {user?.email || (user as { phone_number?: string })?.phone_number || (language === "bn" ? "অ্যাস্ট্রা ভক্ত" : language === "hi" ? "एस्ट्रा भक्त" : "Astra Devotee")}
                          </p>
                        </div>
                      </div>

                      <div className="my-2 border-t border-stone-100" />

                      {/* 4 Profile-related menu items */}
                      <div className="space-y-1">
                        {/* Notifications */}
                        <Link
                          href="/account"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-stone-50 text-stone-700 hover:text-stone-950 transition-colors group cursor-pointer"
                        >
                          <div className="size-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
                            <Bell className="size-4" />
                          </div>
                          <span className="text-xs font-semibold">
                            {language === "bn" ? "বিজ্ঞপ্তি" : language === "hi" ? "सूचनाएं" : "Notifications"}
                          </span>
                        </Link>

                        {/* Wallet Transactions / Coins (Dynamic live balance) */}
                        <Link
                          href="/account/wallet"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-amber-50/80 text-stone-700 hover:text-amber-950 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 group-hover:bg-amber-200 transition-colors">
                              <Coins className="size-4 text-amber-600" />
                            </div>
                            <span className="text-xs font-semibold">
                              {language === "bn" ? "ওয়ালেট কয়েন" : language === "hi" ? "वॉलेट कॉइन" : "Wallet Transactions"}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300/80 tabular-nums shadow-2xs">
                            🪙 {coinsBalance !== undefined ? formatCoins(coinsBalance) : walletLoading ? "..." : "0"}
                          </span>
                        </Link>

                        {/* Order History */}
                        <Link
                          href="/account/orders"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-stone-50 text-stone-700 hover:text-stone-950 transition-colors group cursor-pointer"
                        >
                          <div className="size-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
                            <FileText className="size-4" />
                          </div>
                          <span className="text-xs font-semibold">
                            {language === "bn" ? "অর্ডারের ইতিহাস" : language === "hi" ? "ऑर्डर इतिहास" : "Order History"}
                          </span>
                        </Link>

                        {/* Customer Support Chat */}
                        <Link
                          href="/support"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-stone-50 text-stone-700 hover:text-stone-950 transition-colors group cursor-pointer"
                        >
                          <div className="size-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
                            <MessageSquare className="size-4" />
                          </div>
                          <span className="text-xs font-semibold">
                            {language === "bn" ? "কাস্টমার সাপোর্ট চ্যাট" : language === "hi" ? "कस्टमर सपोर्ट चैट" : "Customer Support Chat"}
                          </span>
                        </Link>
                      </div>

                      <div className="my-2 border-t border-stone-100" />

                      {/* Logout Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-rose-50 text-rose-600 font-bold transition-colors group cursor-pointer text-xs"
                      >
                        <div className="size-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 group-hover:bg-rose-200 transition-colors">
                          <LogOut className="size-4 text-rose-600" />
                        </div>
                        <span>{language === "bn" ? "লগআউট" : language === "hi" ? "लॉग आउट" : "Logout"}</span>
                      </button>
                    </div>
                  </>
                )}
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
                className="group relative inline-flex h-9 sm:h-[38px] items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 px-3 xl:px-3.5 2xl:px-4 text-stone-950 font-bold text-xs sm:text-[12.5px] tracking-tight shadow-[0_3px_12px_-2px_rgba(245,158,11,0.5)] hover:shadow-[0_5px_16px_-2px_rgba(245,158,11,0.7)] transition-all hover:scale-[1.02] active:scale-[0.98] border border-amber-300 whitespace-nowrap cursor-pointer leading-none"
              >
                <Phone className="size-3 text-stone-950 fill-stone-950/20 shrink-0" />
                <span className="leading-none">{ctaPart1}</span>
                <ArrowRight className="size-3 stroke-[2.5] text-stone-900 transition-transform duration-200 group-hover:translate-x-0.5 shrink-0" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= Mobile Navigation Drawer ================= */}
      {/* Portalled to <body>: the header's backdrop-filter would otherwise make
          it the containing block and trap this fixed overlay inside the 64px bar. */}
      {mounted &&
        mobileMenuOpen &&
        createPortal(
          <div className="fixed inset-0 z-[60] xl:hidden">
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
                            <span className="flex items-center gap-2">
                              <span>{cat.label}</span>
                              {cat.badge && (
                                <span className="rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 border border-amber-300/60">
                                  {cat.badge}
                                </span>
                              )}
                            </span>
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
                                    className="flex items-center justify-between py-2 px-2.5 rounded-lg text-xs font-semibold text-stone-700 hover:bg-amber-50"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <Icon className="size-4 text-amber-600 shrink-0" />
                                      <span className="truncate">{sub.label}</span>
                                    </div>
                                    {sub.badge && (
                                      <span className="shrink-0 text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300/60 whitespace-nowrap">
                                        {sub.badge}
                                      </span>
                                    )}
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
                          <span className="flex items-center gap-2">
                            <span>{cat.label}</span>
                            {cat.badge && (
                              <span className="rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 border border-amber-300/60">
                                {cat.badge}
                              </span>
                            )}
                          </span>
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
              {isSignedIn ? (
                <div className="pt-2 border-t border-stone-200/60 space-y-2">
                  <div className="flex items-center justify-between px-1 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar
                        src={user?.avatar_url}
                        name={user?.full_name || user?.first_name || "User"}
                        size="sm"
                        className="size-7 border border-amber-300 shrink-0"
                      />
                      <span className="font-semibold text-stone-700 truncate max-w-[130px]">
                        {user?.full_name || user?.first_name || (language === "bn" ? "ব্যবহারকারী" : language === "hi" ? "यूज़र" : "User")}
                      </span>
                    </div>
                    <Link
                      href="/account/wallet"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-bold"
                    >
                      <span>🪙</span>
                      <span>{coinsBalance !== undefined ? formatCoins(coinsBalance) : walletLoading ? "..." : "0"}</span>
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50/70 text-rose-600 font-semibold text-sm py-2 hover:bg-rose-100 transition-colors"
                  >
                    <LogOut className="size-4 stroke-[2]" />
                    <span>{language === "bn" ? "লগআউট" : language === "hi" ? "लॉग आउट" : "Logout"}</span>
                  </button>
                </div>
              ) : (
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
          </div>,
          document.body,
        )}

      {/* Universal Cart Drawer accessible across all pages */}
      <CartDrawer />
    </header>
  );
}
