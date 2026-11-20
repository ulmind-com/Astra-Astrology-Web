"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Flame,
  Coins,
  Crown,
  Compass,
  Shield,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { shopApi, type ShopProductCategory } from "@/lib/api";
import { useLanguage } from "@/providers/language-provider";

interface Props {
  categories?: ShopProductCategory[];
  selectedCategory?: string;
  onSelectCategory?: (slug: string) => void;
}

/** Authentic live production categories from DivinLink Admin Panel */
const DEFAULT_ACTIVE_CATEGORIES: ShopProductCategory[] = [
  {
    id: "6afca247f7be8e3d1da69c4b",
    name: "Rudraksh",
    slug: "rudraksh",
    description: "Top Quality Rudraksh",
    icon_url: "https://res.cloudinary.com/hdzb1lc5/image/upload/v1794941496/astra-astrology/products/mcrmghsie2qdisdrixli.jpg",
    banner_url: null,
    category_type: "other",
    product_count: 1,
  },
  {
    id: "6afd5ae069c34ac75fc2bb44",
    name: "Zodiac Collection",
    slug: "zodiac",
    description: "Handcrafted 925 sterling silver zodiac rings and gemstone talisman jewelry.",
    icon_url: null,
    banner_url: null,
    category_type: "other",
    product_count: 4,
  },
  {
    id: "6afd5ae069c34ac75fc2bb45",
    name: "Bracelets & Rings",
    slug: "bracelets",
    description: "Dhan Yog abundance bands, pyrite stud rings, and numerology crystal bracelets.",
    icon_url: null,
    banner_url: null,
    category_type: "other",
    product_count: 4,
  },
  {
    id: "6afd5ae069c34ac75fc2bb46",
    name: "Nepali Rudraksha",
    slug: "rudraksha",
    description: "100% lab-certified 1 to 14 Mukhi divine Himalayan beads consecrated at Varanasi.",
    icon_url: null,
    banner_url: null,
    category_type: "other",
    product_count: 2,
  },
  {
    id: "6afd5ae069c34ac75fc2bb47",
    name: "Original Karungali",
    slug: "karungali",
    description: "Pure black ebony wood malas and bracelets for negative energy and evil eye defense.",
    icon_url: null,
    banner_url: null,
    category_type: "other",
    product_count: 2,
  },
  {
    id: "6afd5ae069c34ac75fc2bb48",
    name: "Vastu & Home",
    slug: "vastu-home",
    description: "Consecrated Sri Yantras, raw selenite charging plates, and positive aura remedies.",
    icon_url: null,
    banner_url: null,
    category_type: "other",
    product_count: 3,
  },
];

const CATEGORY_META: Record<
  string,
  {
    icon: LucideIcon;
    color: string;
    label_bn: string;
    label_hi: string;
    badge_en: string;
    badge_bn: string;
  }
> = {
  rudraksh: {
    icon: Flame,
    color: "from-red-600 to-amber-700",
    label_bn: "রুদ্রাক্ষ",
    label_hi: "रुद्राक्ष",
    badge_en: "Top Quality",
    badge_bn: "টপ কোয়ালিটি",
  },
  zodiac: {
    icon: Sparkles,
    color: "from-amber-500 to-yellow-600",
    label_bn: "রাশি কালেকশন",
    label_hi: "राशि संग्रह",
    badge_en: "925 Silver",
    badge_bn: "৯২৫ রূপা",
  },
  bracelets: {
    icon: Coins,
    color: "from-amber-600 to-orange-600",
    label_bn: "ব্রেসলেট ও আংটি",
    label_hi: "ब्रेसलेट व रिंग्स",
    badge_en: "Dhan Yog",
    badge_bn: "ধন যোগ",
  },
  rudraksha: {
    icon: Crown,
    color: "from-orange-600 to-red-700",
    label_bn: "নেপালি রুদ্রাক্ষ",
    label_hi: "नेपाली रुद्राक्ष",
    badge_en: "1-14 Mukhi",
    badge_bn: "১-১৪ মুখী",
  },
  karungali: {
    icon: Shield,
    color: "from-stone-700 to-stone-900",
    label_bn: "আসল করুঙ্গালি",
    label_hi: "ओरिजिनल करुंगली",
    badge_en: "Ebony Wood",
    badge_bn: "কালো কাঠ",
  },
  "vastu-home": {
    icon: Compass,
    color: "from-teal-600 to-cyan-700",
    label_bn: "বাস্তু ও গৃহ",
    label_hi: "वास्तु व गृह",
    badge_en: "Positive Aura",
    badge_bn: "পবিত্র আভা",
  },
};

export function ShopCategoryPills({
  categories: propsCategories,
  selectedCategory,
  onSelectCategory,
}: Props) {
  const { language } = useLanguage();

  const { data: serverCategories = DEFAULT_ACTIVE_CATEGORIES } = useQuery<ShopProductCategory[]>({
    queryKey: ["shop_public_categories"],
    queryFn: async () => {
      try {
        const res = await shopApi.getCategories();
        return res && res.length > 0 ? res : DEFAULT_ACTIVE_CATEGORIES;
      } catch {
        return DEFAULT_ACTIVE_CATEGORIES;
      }
    },
    initialData: DEFAULT_ACTIVE_CATEGORIES,
    staleTime: 1000 * 60 * 30,
  });

  const categories =
    propsCategories && propsCategories.length > 0 ? propsCategories : serverCategories;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
          <Layers className="size-4 text-amber-700" />
          <span>
            {language === "bn"
              ? "প্রতিকার ক্যাটাগরি ব্রাউজ করুন"
              : language === "hi"
              ? "पवित्र श्रेणी चुनें"
              : "Browse by Sacred Category"}
          </span>
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
            {categories.length} Categories
          </span>
        </h3>
        <span className="text-xs text-amber-800 font-semibold hidden sm:inline-block">
          100% Consecrated • Lab Tested
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((c) => {
          const meta = CATEGORY_META[c.slug] || {
            icon: Sparkles,
            color: "from-amber-600 to-orange-700",
            label_bn: c.name,
            label_hi: c.name,
            badge_en: "Lab Tested",
            badge_bn: "ল্যাব সার্টিফাইড",
          };
          const Icon = meta.icon;
          const isSelected = selectedCategory === c.slug;

          const label =
            language === "bn"
              ? meta.label_bn || c.name
              : language === "hi"
              ? meta.label_hi || c.name
              : c.name;

          const badge = language === "bn" ? meta.badge_bn : meta.badge_en;

          const pillContent = (
            <div
              className={`flex flex-col items-center text-center group cursor-pointer p-2 rounded-2xl transition-all duration-300 ${
                isSelected
                  ? "bg-amber-100/70 ring-2 ring-amber-500 scale-102"
                  : "hover:bg-amber-50/50"
              }`}
            >
              {/* Circular Badge */}
              <div className="relative mb-2">
                <div
                  className={`size-14 sm:size-16 rounded-full bg-gradient-to-br ${meta.color} p-0.5 shadow-md group-hover:scale-108 group-hover:shadow-lg transition-all duration-300 flex items-center justify-center`}
                >
                  <div className="size-full rounded-full bg-[#1c120c] flex items-center justify-center text-amber-200 group-hover:bg-transparent group-hover:text-white transition-colors">
                    <Icon className="size-6 sm:size-7" />
                  </div>
                </div>

                {badge && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-amber-500 text-stone-950 text-[9px] font-black px-1.5 py-0.2 rounded-full whitespace-nowrap shadow-xs uppercase tracking-tighter">
                    {badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className="text-[11px] sm:text-xs font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                {label}
              </span>
              <span className="text-[10px] text-stone-500">
                {c.product_count} {language === "bn" ? "পণ্য" : "items"}
              </span>
            </div>
          );

          if (onSelectCategory) {
            return (
              <button
                key={c.id || c.slug}
                type="button"
                onClick={() => onSelectCategory(isSelected ? "" : c.slug)}
                className="text-left w-full cursor-pointer"
              >
                {pillContent}
              </button>
            );
          }

          return (
            <Link
              key={c.id || c.slug}
              href={`/shop?category=${c.slug}#all-products`}
              className="text-left w-full cursor-pointer"
            >
              {pillContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
