"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Flame,
  Star,
  ShoppingBag,
  Gift,
  Coins,
  ShieldCheck,
  Check,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { type ShopProduct } from "@/lib/api";
import { useCartStore } from "@/lib/stores/use-cart-store";
import { useLanguage } from "@/providers/language-provider";
import { CardTilt } from "@/components/ui/card-tilt";

interface Props {
  products: ShopProduct[];
}

export function ShopBestsellers({ products }: Props) {
  const { language } = useLanguage();
  const { addItem } = useCartStore();
  const [filter, setFilter] = React.useState<string>("all");
  const [addedId, setAddedId] = React.useState<string | null>(null);

  if (!products || products.length === 0) {
    return null;
  }

  const filterTabs = [
    { id: "all", label_bn: "সব বেস্টসেলার", label_en: "All Bestsellers" },
    { id: "zodiac", label_bn: "রাশি ব্রেসলেট", label_en: "Zodiac Bracelets" },
    { id: "wealth", label_bn: "ধন যোগ ও পায়রাইট", label_en: "Wealth & Pyrite" },
    { id: "rudraksha", label_bn: "সিদ্ধ রুদ্রাক্ষ ও করুঙ্গালি", label_en: "Rudraksha & Karungali" },
  ];

  const filtered = products.filter((p) => {
    if (filter === "all") return true;
    if (filter === "zodiac") {
      return (
        p.category_slug?.includes("zodiac") ||
        p.title.toLowerCase().includes("zodiac") ||
        p.title.toLowerCase().includes("bracelet")
      );
    }
    if (filter === "wealth") {
      return (
        p.title.toLowerCase().includes("pyrite") ||
        p.title.toLowerCase().includes("dhan") ||
        p.title.toLowerCase().includes("gomti") ||
        p.benefits?.some((b) => b.includes("অর্থ") || b.includes("ধন"))
      );
    }
    if (filter === "rudraksha") {
      return (
        p.category_slug?.includes("rudraksha") ||
        p.title.toLowerCase().includes("rudraksha") ||
        p.title.toLowerCase().includes("karungali")
      );
    }
    return true;
  });

  const handleQuickAdd = (p: ShopProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(p, 1);
    setAddedId(p.id);
    toast.success(`${p.title} added to cart! Free gift included.`);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <Flame className="size-3.5 text-amber-600 fill-current" />
            <span>Most Loved by Devotees</span>
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-stone-900">
            {language === "bn" ? "সর্বাধিক বিক্রিত ও জনপ্রিয় সিদ্ধ প্রতিকার" : "Bestsellers & High-Spiritual Remedies"}
          </h2>
          <p className="text-xs text-stone-500">
            {language === "bn"
              ? "প্রতিটি সামগ্রীতে ১০০% ওয়ালেট ক্যাশব্যাক এবং ফ্রি সেলিনাইট চার্জিং প্লেট অন্তর্ভুক্ত।"
              : "Every sacred order includes 100% Wallet Cashback & Free Raw Selenite Plate worth ₹729."}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilter(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filter === t.id
                  ? "bg-amber-700 text-white shadow-xs"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              {language === "bn" ? t.label_bn : t.label_en}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.slice(0, 8).map((p) => {
          const discount = p.discount_percent || Math.round(((p.mrp - p.sale_price) / p.mrp) * 100);
          const freeGiftBadge = p.free_gift_badge || "FREE Raw Selenite Plate worth ₹729";
          const cashbackPct = p.cashback_percent ?? 100;

          return (
            <CardTilt key={p.id} rotationFactor={6} className="h-full">
              <div className="h-full rounded-3xl border-2 border-stone-200/90 bg-white p-3.5 shadow-xs hover:border-amber-500/70 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative">
                <div className="space-y-3">
                  {/* Image Container */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-100">
                    <Link href={`/shop/products/${p.slug}`}>
                      {p.featured_image ? (
                        <Image
                          src={p.featured_image}
                          alt={p.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover group-hover:scale-106 transition-transform duration-500"
                          unoptimized
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center text-stone-300">
                          <ShoppingBag className="size-12" />
                        </div>
                      )}
                    </Link>

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                      {discount > 0 && (
                        <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                          {discount}% OFF
                        </span>
                      )}
                      {cashbackPct > 0 && (
                        <span className="inline-flex items-center gap-1 bg-emerald-700 text-emerald-100 text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                          <Coins className="size-2.5 text-amber-300" />
                          <span>100% Cashback</span>
                        </span>
                      )}
                    </div>

                    {p.is_energized && (
                      <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 bg-stone-900/85 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                        <Flame className="size-2.5 text-amber-400 fill-current" />
                        <span>{language === "bn" ? "প্রাণ-প্রতিষ্ঠিত" : "Consecrated"}</span>
                      </span>
                    )}
                  </div>

                {/* Free Gift Strip */}
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 flex items-center gap-1.5 text-[10px] font-bold text-amber-900">
                  <Gift className="size-3 text-amber-600 shrink-0" />
                  <span className="truncate">{freeGiftBadge}</span>
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="flex text-amber-500">
                    <Star className="size-3.5 fill-current" />
                  </div>
                  <span className="font-bold text-stone-800">{p.average_rating || 4.9}</span>
                  <span className="text-stone-400 text-[11px]">({p.review_count || 120}+ reviews)</span>
                </div>

                {/* Title */}
                <Link
                  href={`/shop/products/${p.slug}`}
                  className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-2 hover:text-amber-700 transition-colors block"
                >
                  {p.title}
                </Link>
              </div>

              {/* Bottom Price & CTA */}
              <div className="pt-3 mt-3 border-t border-stone-100 space-y-2">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-extrabold text-base sm:text-lg text-stone-900">
                      ₹{p.sale_price.toLocaleString("en-IN")}
                    </span>
                    {p.mrp > p.sale_price && (
                      <span className="text-xs text-stone-400 line-through">
                        ₹{p.mrp.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-extrabold uppercase">
                    In Stock
                  </span>
                </div>

                {/* Quick Add Button */}
                <button
                  type="button"
                  onClick={(e) => handleQuickAdd(p, e)}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    addedId === p.id
                      ? "bg-emerald-600 text-white"
                      : "bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                  }`}
                >
                  {addedId === p.id ? (
                    <>
                      <Check className="size-3.5" />
                      <span>{language === "bn" ? "কার্টে যোগ হয়েছে!" : "Added to Cart!"}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="size-3.5" />
                      <span>{language === "bn" ? "কার্টে যোগ করুন" : "Add to Cart"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </CardTilt>
        );
      })}
    </div>
  </div>
);
}
