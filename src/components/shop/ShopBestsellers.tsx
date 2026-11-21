"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { type ShopProduct } from "@/lib/api";
import { useCartStore } from "@/lib/stores/use-cart-store";
import { useLanguage } from "@/providers/language-provider";

interface Props {
  products?: ShopProduct[];
}

export function ShopBestsellers({ products = [] }: Props) {
  const { language } = useLanguage();
  const { addItem } = useCartStore();
  const [activeTab, setActiveTab] = React.useState<string>("all");
  const [addedId, setAddedId] = React.useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Bestsellers" },
    { id: "zodiac", label: "Zodiac" },
    { id: "bracelets", label: "Bracelets" },
    { id: "vastu-home", label: "Vastu & Home" },
    { id: "karungali", label: "Karungali" },
  ];

  // Map real database products to Bestseller display items (Zero Dummy Data)
  const displayItems = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    return products.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: (p.category_slug?.includes("zodiac")
        ? "zodiac"
        : p.category_slug?.includes("bracelet") || p.title.toLowerCase().includes("ring")
        ? "bracelets"
        : p.category_slug?.includes("karungali") || p.category_slug?.includes("rudraksha")
        ? "karungali"
        : p.category_slug?.includes("vastu") || p.category_slug?.includes("yantra")
        ? "vastu-home"
        : "bracelets") as any,
      category_label: p.category_type || p.category_slug || "Astro Remedy",
      badge: p.discount_percent && p.discount_percent > 0 ? `${p.discount_percent}% OFF` : undefined,
      sale_price: p.sale_price,
      mrp: p.mrp,
      discount_percent: p.discount_percent || (p.mrp > p.sale_price ? Math.round(((p.mrp - p.sale_price) / p.mrp) * 100) : 0),
      image: p.featured_image || (p.images && p.images[0]) || "/images/banners/banner-zodiac.jpg",
      description: p.short_description || "",
    }));
  }, [products]);

  const filtered = displayItems.filter((p) => {
    if (activeTab === "all") return true;
    return p.category === activeTab;
  });

  const handleAddToCart = (item: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Find actual product object from real API items
    const realProd = products.find((p) => p.id === item.id);
    if (!realProd) return;
    addItem(realProd, 1);

    setAddedId(item.id);
    toast.success(
      language === "bn"
        ? `"${item.title.slice(0, 22)}..." কার্টে যুক্ত হয়েছে!`
        : `"${item.title.slice(0, 22)}..." added to cart!`
    );
    setTimeout(() => setAddedId(null), 1500);
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6 select-none">
      {/* Header and Category Pills (Exact Astrotalk Screenshot 1) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#d97706]">
            <span className="size-2 rounded-full bg-amber-500 inline-block" />
            <span>BESTSELLERS</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Most Loved By Customers
          </h2>
        </div>

        {/* Category Pill Switcher (Exact Astrotalk Screenshot 1) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeTab === cat.id
                  ? "bg-black text-white shadow-md"
                  : "bg-white text-stone-800 hover:bg-stone-50 border border-stone-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Cards Grid (Exact Astrotalk Screenshot 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filtered.slice(0, 8).map((product) => {
          const isAdded = addedId === product.id;

          return (
            <div
              key={product.id}
              className="rounded-2xl border border-stone-200 bg-white p-3.5 sm:p-4 shadow-xs hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Image Box */}
                <Link
                  href={`/shop/products/${product.slug}`}
                  className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#f7f5ed] block cursor-pointer"
                >
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    unoptimized
                  />

                  {/* Red FREE Badge (Top-Left, matching Astrotalk Screenshot 1) */}
                  {product.badge && (
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-sm bg-[#d93829] text-white text-[9px] font-black tracking-wider uppercase shadow-xs">
                        {product.badge}
                      </span>
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="space-y-1">
                  <span className="text-xs text-stone-400 font-medium block">
                    {product.category_label || "Astro Product"}
                  </span>
                  <Link
                    href={`/shop/products/${product.slug}`}
                    className="text-sm font-bold text-stone-900 line-clamp-1 hover:text-amber-700 transition-colors block"
                  >
                    {product.title}
                  </Link>

                  {/* Price Row: Bold Sale Price, Gray Strikethrough MRP, Green Discount */}
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base font-extrabold text-stone-900">
                      ₹{product.sale_price.toLocaleString("en-IN")}
                    </span>
                    {product.mrp > product.sale_price && (
                      <span className="text-xs text-stone-400 line-through">
                        ₹{product.mrp.toLocaleString("en-IN")}
                      </span>
                    )}
                    {product.discount_percent > 0 && (
                      <span className="text-xs font-bold text-emerald-600">
                        {product.discount_percent}% off
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Full Width Black Button: ADD TO CART (Exact Astrotalk Screenshot 1) */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={(e) => handleAddToCart(product, e)}
                  disabled={isAdded}
                  className={`w-full py-2.5 sm:py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                    isAdded
                      ? "bg-emerald-600 text-white"
                      : "bg-black text-white hover:bg-stone-800 active:scale-98"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="size-3.5" />
                      <span>Added</span>
                    </>
                  ) : (
                    <span>ADD TO CART</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Centered Link (Exact Astrotalk Screenshot 1) */}
      <div className="pt-2 text-center">
        <Link
          href="#all-products"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-stone-900 hover:text-amber-800 underline underline-offset-4 transition-colors"
        >
          <span>View all All Bestsellers</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
