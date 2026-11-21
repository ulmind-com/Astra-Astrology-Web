"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles,
  Search,
  Filter,
  Flame,
  CheckCircle2,
  Package,
  ShieldCheck,
  ShoppingBag,
  Coins,
  Gift,
  ArrowRight,
  RotateCcw,
  Share2,
  X,
  Moon,
  Gem,
  Compass,
  Tag,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { shopApi, type ShopProduct, type ShopProductCategory, type ShopBannerSettings } from "@/lib/api";
import { useLanguage } from "@/providers/language-provider";
import { useCartStore } from "@/lib/stores/use-cart-store";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { ShopHeroSlider } from "@/components/shop/ShopHeroSlider";
import { ShopByWhatMatters } from "@/components/shop/ShopByWhatMatters";
import { ShopBestsellers } from "@/components/shop/ShopBestsellers";
import { CashbackPromoBanner } from "@/components/shop/CashbackPromoBanner";
import { AstraPromiseSection } from "@/components/shop/AstraPromiseSection";
import { ShopFaqAccordion } from "@/components/shop/ShopFaqAccordion";
import { CardTilt } from "@/components/ui/card-tilt";
import { ShopFilterDrawer } from "@/components/shop/ShopFilterDrawer";
import { ShopTrustMarquee } from "@/components/shop/ShopTrustMarquee";
import initialProductsData from "@/lib/initial-shop-products.json";
import initialCategoriesData from "@/lib/initial-shop-categories.json";

function getCategoryIcon(slug: string) {
  const s = (slug || "").toLowerCase();
  if (s.includes("rudraksh")) return Sparkles;
  if (s.includes("zodiac")) return Moon;
  if (s.includes("bracelet") || s.includes("ring")) return Gem;
  if (s.includes("karungali")) return ShieldCheck;
  if (s.includes("vastu") || s.includes("home")) return Compass;
  return ShoppingBag;
}

function getCategoryLocalizedName(cat: ShopProductCategory, language: string) {
  const slug = (cat.slug || "").toLowerCase();
  if (language === "bn") {
    if (slug === "rudraksh") return "রুদ্রাক্ষ (Rudraksh)";
    if (slug === "zodiac") return "রাশি কালেকশন (Zodiac Collection)";
    if (slug === "bracelets") return "ব্রেসলেট ও আংটি (Bracelets & Rings)";
    if (slug === "rudraksha") return "সিদ্ধ নেপালি রুদ্রাক্ষ (Nepali Rudraksha)";
    if (slug === "karungali") return "আসল করুঙ্গলি (Original Karungali)";
    if (slug === "vastu-home") return "বাস্তু ও গৃহ শান্তি (Vastu & Home)";
  } else if (language === "hi") {
    if (slug === "rudraksh") return "रुद्राक्ष (Rudraksh)";
    if (slug === "zodiac") return "राशि कलेक्शन (Zodiac Collection)";
    if (slug === "bracelets") return "कंगन और अंगूठियां (Bracelets & Rings)";
    if (slug === "rudraksha") return "सिद्ध नेपाली रुद्राक्ष (Nepali Rudraksha)";
    if (slug === "karungali") return "ओरिजिनल करुंगली (Original Karungali)";
    if (slug === "vastu-home") return "वास्तु एवं गृह शांति (Vastu & Home)";
  }
  return cat.name;
}

function ProductCard({ p, language }: { p: ShopProduct; language: string }) {
  const discount = p.discount_percent || Math.round(((p.mrp - p.sale_price) / p.mrp) * 100);
  const freeGiftBadge = p.free_gift_badge || "FREE Raw Selenite Plate worth ₹729";

  return (
    <CardTilt key={p.id} className="h-full">
      <div className="h-full rounded-3xl border-2 border-stone-200/90 bg-white p-3.5 shadow-xs hover:border-amber-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
        <div className="space-y-2.5">
          {/* Image */}
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

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
              {discount > 0 && (
                <span className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-xs">
                  {discount}% OFF
                </span>
              )}
              <span className="inline-flex items-center gap-1 bg-emerald-700 text-emerald-100 text-[9px] font-black px-2 py-0.5 rounded shadow-xs">
                <Coins className="size-2.5 text-amber-300" />
                <span>100% Cashback</span>
              </span>
            </div>
          </div>

          {/* Gift Badge */}
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 flex items-center gap-1.5 text-[9px] font-bold text-amber-900 truncate">
            <Gift className="size-2.5 text-amber-600 shrink-0" />
            <span className="truncate">{freeGiftBadge}</span>
          </div>

          {/* Title */}
          <Link
            href={`/shop/products/${p.slug}`}
            className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-2 hover:text-amber-700 transition-colors block leading-snug"
          >
            {p.title}
          </Link>

          <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
            {p.short_description}
          </p>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-3 mt-3 border-t border-stone-100 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-sm sm:text-base text-stone-900">
                ₹{p.sale_price.toLocaleString("en-IN")}
              </span>
              {p.mrp > p.sale_price && (
                <span className="text-[11px] text-stone-400 line-through">
                  ₹{p.mrp.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <span className="text-[9px] text-emerald-700 font-extrabold uppercase tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              In Stock
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/shop/products/${p.slug}`}
              className="py-2 px-2 rounded-xl border border-stone-200 text-stone-700 font-bold text-[11px] hover:bg-stone-50 transition-colors text-center flex items-center justify-center"
            >
              {language === "bn" ? "বিস্তারিত" : language === "hi" ? "विवरण" : "Details"}
            </Link>
            <button
              type="button"
              onClick={() => {
                useCartStore.getState().addItem(p, 1);
                toast.success(`${p.title} added to cart! Free gift included.`);
              }}
              className="py-2 px-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs active:scale-98"
            >
              <ShoppingBag className="size-3" />
              <span>{language === "bn" ? "কার্ট" : language === "hi" ? "कार्ट" : "Add"}</span>
            </button>
          </div>
        </div>
      </div>
    </CardTilt>
  );
}

function ShopInner() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const initialPlanet = searchParams.get("planet") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialPurpose = searchParams.get("purpose") || "";

  const [selectedPlanet, setSelectedPlanet] = React.useState<string>(initialPlanet);
  const [selectedCategory, setSelectedCategory] = React.useState<string>(initialCategory);
  const [selectedPurpose, setSelectedPurpose] = React.useState<string>(initialPurpose);
  const [selectedZodiac, setSelectedZodiac] = React.useState<string>("");
  const [selectedCrystal, setSelectedCrystal] = React.useState<string>("");
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  const { openCart, getItemCount } = useCartStore();
  const cartItemCount = getItemCount();

  React.useEffect(() => {
    if (initialPlanet) setSelectedPlanet(initialPlanet);
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialPurpose) setSelectedPurpose(initialPurpose);
  }, [initialPlanet, initialCategory, initialPurpose]);

  // Fetch Public Banners with instant caching & pre-hydration
  const { data: bannerSettings } = useQuery<ShopBannerSettings | null>({
    queryKey: ["shop_public_banners"],
    queryFn: async () => {
      try {
        const res = await shopApi.getBanners();
        return res;
      } catch {
        return null;
      }
    },
    initialData: {
      hero_banners: [
        {
          id: "banner-1",
          badge_text: "100% Authentic & Lab Certified",
          title: "Sacred Certified Nepali Rudraksha",
          subtitle: "Consecrated with Vedic Pran-Pratishtha by Vedic Pandits for spiritual protection & prosperity.",
          cta_text: "Explore Rudraksha",
          cta_link: "/shop?category=rudraksha",
          image_url: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=80",
          is_active: true,
        },
        {
          id: "banner-2",
          badge_text: "925 Sterling Silver & Certified",
          title: "Sacred Zodiac Collection",
          subtitle: "Handcrafted 925 sterling silver zodiac rings & planetary talisman jewelry.",
          cta_text: "Explore Zodiac",
          cta_link: "/shop?category=zodiac",
          image_url: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80",
          is_active: true,
        },
      ] as any,
    } as any,
    staleTime: 1000 * 30,
  });

  // Fetch Public Categories with 0ms pre-hydration
  const { data: categories = (initialCategoriesData as any) } = useQuery<ShopProductCategory[]>({
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
    placeholderData: (prev) => prev ?? (initialCategoriesData as any),
    staleTime: 1000 * 60 * 30,
  });

  // Fetch Public Products with 0ms pre-hydration
  const { data: serverProductData, isLoading } = useQuery({
    queryKey: ["shop_public_products"],
    queryFn: async () => {
      try {
        const res = await shopApi.getProducts({ limit: 50 });
        return res;
      } catch {
        return initialProductsData as any;
      }
    },
    initialData: initialProductsData as any,
    placeholderData: (prev) => prev ?? (initialProductsData as any),
    staleTime: 1000 * 60 * 10,
  });

  const rawProducts: ShopProduct[] =
    serverProductData && serverProductData.items && Array.isArray(serverProductData.items)
      ? serverProductData.items
      : ((initialProductsData as any)?.items || []);

  // Match active category if selectedCategory is set
  const activeCategory = React.useMemo(() => {
    if (!selectedCategory) return null;
    return (
      categories.find(
        (c: ShopProductCategory) =>
          c.slug.toLowerCase() === selectedCategory.toLowerCase() ||
          c.id === selectedCategory ||
          c.name.toLowerCase() === selectedCategory.toLowerCase()
      ) || null
    );
  }, [categories, selectedCategory]);

  // Comprehensive client-side filtering on rawProducts
  const filteredProducts = React.useMemo(() => {
    return rawProducts.filter((p) => {
      // 1. Category Filter
      if (selectedCategory) {
        const matchesCategory =
          (p.category_slug && p.category_slug.toLowerCase() === selectedCategory.toLowerCase()) ||
          (activeCategory && p.category_id === activeCategory.id) ||
          (p.category_type && p.category_type.toLowerCase() === selectedCategory.toLowerCase());
        if (!matchesCategory) return false;
      }

      // 2. Purpose Filter
      if (selectedPurpose) {
        const purp = selectedPurpose.toLowerCase();
        const matchesPurpose =
          p.purpose_tags?.some((t) => t.toLowerCase().includes(purp)) ||
          p.title?.toLowerCase().includes(purp) ||
          p.short_description?.toLowerCase().includes(purp);
        if (!matchesPurpose) return false;
      }

      // 3. Planet Filter
      if (selectedPlanet) {
        const pl = selectedPlanet.toLowerCase();
        const matchesPlanet =
          (p.ruling_planet && p.ruling_planet.toLowerCase().includes(pl)) ||
          p.title?.toLowerCase().includes(pl) ||
          p.short_description?.toLowerCase().includes(pl);
        if (!matchesPlanet) return false;
      }

      // 4. Zodiac / Rashi Filter
      if (selectedZodiac) {
        const z = selectedZodiac.toLowerCase();
        const matchesZodiac =
          p.recommended_for_rashis?.some((r) => r.toLowerCase().includes(z)) ||
          p.title?.toLowerCase().includes(z) ||
          p.short_description?.toLowerCase().includes(z) ||
          (z === "aries" &&
            (p.title?.toLowerCase().includes("aries") ||
              p.title?.toLowerCase().includes("red coral"))) ||
          (z === "taurus" &&
            (p.title?.toLowerCase().includes("taurus") ||
              p.title?.toLowerCase().includes("rose quartz"))) ||
          (z === "leo" &&
            (p.title?.toLowerCase().includes("leo") ||
              p.title?.toLowerCase().includes("sunstone") ||
              p.title?.toLowerCase().includes("pyrite"))) ||
          (z === "scorpio" &&
            (p.title?.toLowerCase().includes("scorpio") ||
              p.title?.toLowerCase().includes("black tourmaline"))) ||
          (z === "capricorn" &&
            (p.title?.toLowerCase().includes("capricorn") ||
              p.title?.toLowerCase().includes("7-mukhi") ||
              p.title?.toLowerCase().includes("shani")));
        if (!matchesZodiac) return false;
      }

      // 5. Crystal Filter
      if (selectedCrystal) {
        const cry = selectedCrystal.toLowerCase().replace("_", " ");
        const cryKey = selectedCrystal.toLowerCase();
        const matchesCrystal =
          (p.crystal_type && p.crystal_type.toLowerCase().includes(cryKey)) ||
          p.title?.toLowerCase().includes(cryKey) ||
          p.title?.toLowerCase().includes(cry) ||
          p.short_description?.toLowerCase().includes(cryKey) ||
          p.short_description?.toLowerCase().includes(cry);
        if (!matchesCrystal) return false;
      }

      // 6. Search Term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const matchesSearch =
          p.title?.toLowerCase().includes(term) ||
          p.short_description?.toLowerCase().includes(term) ||
          p.sku?.toLowerCase().includes(term) ||
          p.ruling_planet?.toLowerCase().includes(term) ||
          p.purpose_tags?.some((t) => t.toLowerCase().includes(term));
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [
    rawProducts,
    selectedCategory,
    activeCategory,
    selectedPurpose,
    selectedPlanet,
    selectedZodiac,
    selectedCrystal,
    searchTerm,
  ]);

  const resetAllFilters = () => {
    setSelectedPlanet("");
    setSelectedCategory("");
    setSelectedPurpose("");
    setSelectedZodiac("");
    setSelectedCrystal("");
    setSearchTerm("");
  };

  const handleSelectFilter = (type: string, value: string) => {
    resetAllFilters();
    if (type === "purpose") setSelectedPurpose(value);
    else if (type === "planet") setSelectedPlanet(value);
    else if (type === "rashi") setSelectedZodiac(value);
    else if (type === "crystal") setSelectedCrystal(value);
    else if (type === "category") setSelectedCategory(value);

    // Smooth scroll to products section
    setTimeout(() => {
      const el = document.getElementById("products");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const hasActiveFilter = Boolean(
    selectedPlanet ||
      selectedCategory ||
      selectedPurpose ||
      selectedZodiac ||
      selectedCrystal ||
      searchTerm
  );

  return (
    <div className="min-h-screen bg-[#faf6f0] text-stone-900 selection:bg-amber-200 selection:text-amber-950 font-sans">
      {/* 1. Astrotalk-Style Unified Header (No Extra Top Strip) */}
      <SiteHeader />
      <CartDrawer />

      {/* 2. Continuous Scrolling Reassurance Bar (Directly Under Navbar) */}
      <ShopTrustMarquee />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-10 sm:space-y-14">
        {/* 3. Hero Section: Luxury Verified Carousel from Admin */}
        <ShopHeroSlider banners={bannerSettings?.hero_banners} />

        {/* 4. Shop By What Matters (Life Purpose, Planets, Crystals, Rashi) */}
        <ShopByWhatMatters onSelectFilter={handleSelectFilter} />

        {/* 5. Most Loved By Customers (Bestsellers Section) */}
        <ShopBestsellers products={rawProducts} />

        {/* 6. Promotional 100% Wallet Cashback Strip */}
        <CashbackPromoBanner />

        {/* 7. Category-Wise Product Catalog (#products) */}
        <section id="products" className="space-y-8 pt-4 scroll-mt-24">
          {/* Header & Filter Controls Bar */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                  <Sparkles className="size-3.5 text-amber-600" />
                  <span>
                    {language === "bn"
                      ? "পবিত্র প্রতিকার সম্ভার"
                      : "Consecrated Sacred Catalog"}
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  {selectedCategory && activeCategory
                    ? getCategoryLocalizedName(activeCategory, language)
                    : language === "bn"
                    ? "ক্যাটাগরি অনুযায়ী বৈদিক প্রতিকার"
                    : "Consecrated Remedies By Category"}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  {selectedCategory && activeCategory
                    ? activeCategory.description ||
                      (language === "bn"
                        ? `এই ক্যাটাগরিতে মোট ${filteredProducts.length}টি প্রতিকার সামগ্রী প্রদর্শিত হচ্ছে`
                        : `Showing ${filteredProducts.length} items in this sacred category`)
                    : language === "bn"
                    ? `অ্যাডমিন প্যানেলের ৬টি ক্যাটাগরির অধীনে মোট ${filteredProducts.length}টি প্রাণ-প্রতিষ্ঠিত প্রতিকার`
                    : `Showing ${filteredProducts.length} lab-certified products across sacred categories`}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {selectedCategory && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("")}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-2xs border border-amber-300/80"
                  >
                    <span>← {language === "bn" ? "সমস্ত ক্যাটাগরি দেখুন" : "View All Categories"}</span>
                  </button>
                )}

                <ShopFilterDrawer
                  categories={categories}
                  selectedPlanet={selectedPlanet}
                  selectedCategory={selectedCategory}
                  selectedPurpose={selectedPurpose}
                  onSelectPlanet={setSelectedPlanet}
                  onSelectCategory={setSelectedCategory}
                  onSelectPurpose={setSelectedPurpose}
                  onResetFilters={resetAllFilters}
                  activeCount={
                    (selectedPlanet ? 1 : 0) +
                    (selectedCategory ? 1 : 0) +
                    (selectedPurpose ? 1 : 0) +
                    (selectedZodiac ? 1 : 0) +
                    (selectedCrystal ? 1 : 0)
                  }
                  language={language as any}
                />

                {hasActiveFilter && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <RotateCcw className="size-3.5" />
                    <span>{language === "bn" ? "রিসেট" : "Reset"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  language === "bn"
                    ? "রুদ্রাক্ষ, নীলম, রক্তপ্রবাল, গোমতী চক্র বা উদ্দেশ্য লিখে খুঁজুন..."
                    : "Search Siddh Rudraksha, Blue Sapphire, Red Coral, Pyrite, Gomti Chakra..."
                }
                className="w-full rounded-2xl border border-stone-300 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:border-amber-600 focus:outline-hidden transition-colors shadow-2xs"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Active Filters Strip */}
            {hasActiveFilter && (
              <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                <span className="text-stone-500 font-bold">
                  {language === "bn" ? "সক্রিয় ফিল্টার:" : "Active Filters:"}
                </span>

                {selectedCategory && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                    <span>
                      {language === "bn" ? "ক্যাটাগরি:" : "Category:"}{" "}
                      {activeCategory ? getCategoryLocalizedName(activeCategory, language) : selectedCategory}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("")}
                      className="hover:text-rose-700"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )}

                {selectedPurpose && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-900 font-bold border border-orange-300">
                    <span>
                      {language === "bn" ? "উদ্দেশ্য:" : "Purpose:"} {selectedPurpose}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedPurpose("")}
                      className="hover:text-rose-700"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )}

                {selectedPlanet && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 font-bold border border-indigo-300">
                    <span>
                      {language === "bn" ? "গ্রহ:" : "Planet:"} {selectedPlanet}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedPlanet("")}
                      className="hover:text-rose-700"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )}

                {selectedZodiac && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 font-bold border border-purple-300">
                    <span>
                      {language === "bn" ? "রাশি:" : "Zodiac:"} {selectedZodiac}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedZodiac("")}
                      className="hover:text-rose-700"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )}

                {selectedCrystal && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                    <span>
                      {language === "bn" ? "ক্রিস্টাল:" : "Crystal:"} {selectedCrystal}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedCrystal("")}
                      className="hover:text-rose-700"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )}

                {searchTerm && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200 text-stone-800 font-bold border border-stone-300">
                    <span>&ldquo;{searchTerm}&rdquo;</span>
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="hover:text-rose-700"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Catalog Content */}
          {isLoading && filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <RotateCcw className="size-8 text-amber-600 animate-spin mx-auto" />
              <p className="text-xs text-stone-500 font-medium">
                {language === "bn" ? "পবিত্র রত্ন ও রুদ্রাক্ষ লোড হচ্ছে..." : "Loading consecrated remedies..."}
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center space-y-3">
              <Package className="size-12 text-stone-300 mx-auto" />
              <h4 className="font-bold text-base text-stone-800">
                {rawProducts.length === 0
                  ? language === "bn"
                    ? "কোনো প্রতিকার সামগ্রী উপলব্ধ নেই"
                    : "No remedies available currently"
                  : language === "bn"
                  ? "কোনো প্রতিকার খুঁজে পাওয়া যায়নি"
                  : "No remedies matched your filter"}
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {language === "bn"
                  ? "ফিল্টার রিসেট করে অন্য কোনো ক্যাটাগরি বা গ্রহ নির্বাচন করুন।"
                  : "Try clearing filters or searching another keyword."}
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-3 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>{language === "bn" ? "সমস্ত ফিল্টার মুছুন" : "Reset All Filters"}</span>
              </button>
            </div>
          ) : selectedCategory ? (
            /* Single Category View */
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} p={p} language={language} />
                ))}
              </div>
            </div>
          ) : (
            /* Category-Wise Multi-Section View */
            <div className="space-y-12">
              {categories.map((cat: ShopProductCategory) => {
                const Icon = getCategoryIcon(cat.slug);
                const catProducts = filteredProducts.filter(
                  (p) =>
                    (p.category_slug &&
                      p.category_slug.toLowerCase() === cat.slug.toLowerCase()) ||
                    p.category_id === cat.id
                );

                if (catProducts.length === 0) return null;

                return (
                  <section
                    key={cat.id}
                    id={`category-${cat.slug}`}
                    className="space-y-5 rounded-3xl border border-amber-900/10 bg-white/70 p-5 sm:p-7 shadow-xs backdrop-blur-xs"
                  >
                    {/* Category Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/60 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                          <Icon className="size-5.5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif text-lg sm:text-xl font-black text-stone-900">
                              {getCategoryLocalizedName(cat, language)}
                            </h4>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300/80">
                              {catProducts.length} {language === "bn" ? "টি সামগ্রী" : "items"}
                            </span>
                          </div>
                          {cat.description && (
                            <p className="text-xs text-stone-500 mt-0.5 line-clamp-1 max-w-xl">
                              {cat.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.slug);
                          window.scrollTo({ top: 500, behavior: "smooth" });
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 transition-colors self-start sm:self-auto group"
                      >
                        <span>
                          {language === "bn"
                            ? "শুধুমাত্র এই ক্যাটাগরি দেখুন"
                            : "Filter this category"}
                        </span>
                        <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                    {/* Category Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {catProducts.map((p) => (
                        <ProductCard key={p.id} p={p} language={language} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </section>

        {/* 8. The Astra Promise Section */}
        <AstraPromiseSection />

        {/* 9. FAQs */}
        <ShopFaqAccordion />
      </main>

      {/* Floating Cart Trigger */}
      {cartItemCount > 0 && (
        <button
          type="button"
          onClick={openCart}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2 hover:scale-105 transition-all cursor-pointer border-2 border-amber-300"
        >
          <div className="relative">
            <ShoppingBag className="size-5" />
            <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-black size-4 rounded-full flex items-center justify-center shadow-xs">
              {cartItemCount}
            </span>
          </div>
          <span>{language === "bn" ? "কার্ট দেখুন" : "View Cart"}</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-black">
            ₹{useCartStore.getState().getSubtotal().toLocaleString("en-IN")}
          </span>
        </button>
      )}

      <SiteFooter />
    </div>
  );
}

export default function ShopPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
          <div className="size-8 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <ShopInner />
    </React.Suspense>
  );
}
