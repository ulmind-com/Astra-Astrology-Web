"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles,
  Search,
  CheckCircle2,
  Package,
  ShieldCheck,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Heart,
  Share2,
  Play,
  X,
  Coins,
  Zap,
  Award,
  Gift,
  Compass,
  Flame,
  Sun,
  Moon,
  Star,
  ArrowRight,
  Plus,
  Minus,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { shopApi, type ShopProduct, type ShopProductCategory } from "@/lib/api";
import { useLanguage } from "@/providers/language-provider";
import {
  DEFAULT_HERO_BANNERS,
  MARQUEE_TRUST_ITEMS,
  BESTSELLER_CATEGORIES,
  BESTSELLER_PRODUCTS,
  SHOP_BY_WHAT_MATTERS,
  CUSTOMER_REELS,
  type BestsellerProduct,
  type ShopHeroBanner,
  type CustomerReel,
} from "@/lib/shop-data";

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

function ShopInner() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";

  // State
  const [activeCategory, setActiveCategory] = React.useState<string>(initialCategory);
  const [searchTerm, setSearchTerm] = React.useState<string>(initialSearch);
  const [activeWhatMattersTab, setActiveWhatMattersTab] = React.useState<"purpose" | "crystal" | "planet">("purpose");
  const [heroSlideIndex, setHeroSlideIndex] = React.useState<number>(0);
  const [isHeroPaused, setIsHeroPaused] = React.useState<boolean>(false);
  const [announcementDismissed, setAnnouncementDismissed] = React.useState<boolean>(false);
  const [selectedProductModal, setSelectedProductModal] = React.useState<BestsellerProduct | null>(null);
  const [activeReelModal, setActiveReelModal] = React.useState<CustomerReel | null>(null);
  const [likedReels, setLikedReels] = React.useState<Record<string, boolean>>({});
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState<boolean>(false);

  // Sync query params
  React.useEffect(() => {
    if (initialCategory) setActiveCategory(initialCategory);
    if (initialSearch) setSearchTerm(initialSearch);
  }, [initialCategory, initialSearch]);

  // Fetch Public Banners from Backend CMS
  const { data: serverBannerData } = useQuery({
    queryKey: ["shop_public_banners"],
    queryFn: async () => {
      try {
        const res = await shopApi.getBanners();
        return res;
      } catch {
        return null;
      }
    },
  });

  const heroBanners: ShopHeroBanner[] =
    serverBannerData?.hero_banners && serverBannerData.hero_banners.length > 0
      ? serverBannerData.hero_banners
      : DEFAULT_HERO_BANNERS;

  const customerReels: CustomerReel[] =
    serverBannerData?.reels && serverBannerData.reels.length > 0
      ? (serverBannerData.reels as CustomerReel[])
      : CUSTOMER_REELS;

  const announcementText =
    serverBannerData?.announcement_bar_text ||
    "🛍️ Discover Sacred Jewellery & Energised Remedies Based on Your Mulank & Kundli ✨";

  const showAnnouncement =
    !announcementDismissed && (serverBannerData?.announcement_bar_active ?? true);

  // Hero Carousel Autoplay
  React.useEffect(() => {
    if (isHeroPaused || heroBanners.length <= 1) return;
    const interval = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHeroPaused, heroBanners.length]);

  const nextHeroSlide = () => {
    setHeroSlideIndex((prev) => (prev + 1) % heroBanners.length);
  };

  const prevHeroSlide = () => {
    setHeroSlideIndex((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  };

  // Cart operations
  const addToCart = (product: BestsellerProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.sale_price,
          image: product.image,
          quantity: 1,
        },
      ];
    });
    toast.success(
      language === "bn"
        ? `"${product.title.slice(0, 24)}..." কার্টে যুক্ত হয়েছে!`
        : `"${product.title.slice(0, 24)}..." added to cart!`
    );
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const totalCartCount = cartItems.reduce((acc, cur) => acc + cur.quantity, 0);
  const totalCartAmount = cartItems.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);

  // Filter products
  const filteredProducts = BESTSELLER_PRODUCTS.filter((prod) => {
    if (activeCategory !== "all" && prod.category !== activeCategory) {
      return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        prod.title.toLowerCase().includes(term) ||
        prod.description.toLowerCase().includes(term) ||
        prod.benefits.some((b) => b.toLowerCase().includes(term))
      );
    }
    return true;
  });

  // Handle Reel Like
  const toggleLikeReel = (id: string) => {
    setLikedReels((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const shareReel = (reel: CustomerReel) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + "/shop#" + reel.id);
      toast.success(language === "bn" ? "ভিডিও লিঙ্ক কপি করা হয়েছে!" : "Reel link copied to clipboard!");
    }
  };

  const currentBanner = heroBanners[heroSlideIndex] || heroBanners[0];

  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#1c1917] selection:bg-amber-200 selection:text-amber-900 font-sans">
      <SiteHeader />

      {/* 1. Top Running Announcement Bar */}
      {showAnnouncement && (
        <aside
          aria-label="Store announcement"
          className="relative bg-gradient-to-r from-[#201c18] via-[#2c2217] to-[#1c1917] text-white px-4 py-2.5 text-xs font-semibold tracking-wide border-b border-amber-500/30"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1 text-center flex items-center justify-center gap-2 overflow-hidden">
              <Sparkles className="size-3.5 text-amber-400 shrink-0 animate-pulse" />
              <Link
                href={serverBannerData?.announcement_bar_link || "/shop?category=zodiac"}
                className="hover:underline hover:text-amber-200 transition-colors truncate font-medium text-amber-100"
              >
                {announcementText}
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setAnnouncementDismissed(true)}
              className="text-stone-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss announcement"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </aside>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12">
        {/* 2. Hero Section: Large Rounded Carousel Banner */}
        <section
          className="relative overflow-hidden rounded-[28px] sm:rounded-[34px] shadow-2xl bg-stone-900 border border-stone-200/40 select-none group"
          onMouseEnter={() => setIsHeroPaused(true)}
          onMouseLeave={() => setIsHeroPaused(false)}
        >
          {/* Slide Background Image */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.4/1] w-full min-h-[360px] sm:min-h-[460px]">
            {currentBanner && (
              <Image
                src={currentBanner.image_url}
                alt={currentBanner.title}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover object-center transform transition-transform duration-1000 ease-out group-hover:scale-105"
                unoptimized
              />
            )}

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

            {/* Sacred Faint Horoscope Wheel Background Watermark */}
            <div className="pointer-events-none absolute -right-20 -top-20 size-96 rounded-full border border-amber-400/10 opacity-30 blur-[1px] animate-spin-slow" />
            <div className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 size-72 rounded-full border border-amber-300/10 opacity-20" />

            {/* Banner Text Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-14 lg:px-20 max-w-2xl text-white space-y-3 sm:space-y-4">
              {currentBanner?.badge_text && (
                <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-[11px] font-bold text-amber-200 tracking-wider uppercase">
                  <Sparkles className="size-3 text-amber-300 animate-pulse" />
                  <span>{currentBanner.badge_text}</span>
                </div>
              )}

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-amber-50 tracking-tight leading-[1.08] drop-shadow-md">
                {currentBanner?.title}
              </h1>

              <div className="flex items-center gap-2 text-amber-400/90 text-sm">
                <span>✦</span>
                <div className="h-px w-12 bg-amber-400/40" />
              </div>

              <p className="text-xs sm:text-base text-stone-200/95 font-medium leading-relaxed max-w-lg drop-shadow-sm">
                {currentBanner?.subtitle}
              </p>

              <div className="pt-2">
                <Link
                  href={currentBanner?.cta_link || "/shop?category=zodiac"}
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full border-2 border-amber-400/80 bg-amber-500/20 hover:bg-amber-400 hover:text-stone-950 backdrop-blur-md text-amber-100 font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-lg cursor-pointer"
                >
                  <span>{currentBanner?.cta_text || "SHOP NOW"}</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              type="button"
              onClick={prevHeroSlide}
              aria-label="Previous slide"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 size-10 sm:size-12 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-lg"
            >
              <ChevronLeft className="size-5 sm:size-6" />
            </button>
            <button
              type="button"
              onClick={nextHeroSlide}
              aria-label="Next slide"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 size-10 sm:size-12 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-lg"
            >
              <ChevronRight className="size-5 sm:size-6" />
            </button>

            {/* Bottom-Left Pagination Dots (Matching Astrotalk Screenshot 1) */}
            <div className="absolute bottom-5 sm:bottom-8 left-6 sm:left-14 flex items-center gap-2 z-10">
              {heroBanners.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setHeroSlideIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 cursor-pointer ${
                    heroSlideIndex === idx
                      ? "w-8 h-2.5 rounded-full bg-amber-400 shadow-md"
                      : "size-2.5 rounded-full bg-white/40 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 3. Marquee / Running Trust Strip (Directly beneath Hero) */}
        <section aria-label="Astra Trust Guarantees" className="overflow-hidden rounded-2xl bg-black text-white py-3.5 px-4 shadow-md border border-stone-800">
          <div className="flex items-center overflow-hidden whitespace-nowrap">
            <div className="inline-flex items-center gap-6 sm:gap-10 animate-marquee text-xs sm:text-sm font-bold tracking-wider uppercase text-stone-200">
              {[...MARQUEE_TRUST_ITEMS, ...MARQUEE_TRUST_ITEMS, ...MARQUEE_TRUST_ITEMS].map(
                (item, index) => (
                  <span key={index} className="inline-flex items-center gap-4 shrink-0">
                    <span className="text-amber-400 font-serif">✦</span>
                    <span>{item}</span>
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        {/* 4. "Most Loved By Customers" (Bestsellers Section) */}
        <section className="space-y-6">
          {/* Section Header with Category Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-amber-600">
                <span>✦</span>
                <span>BESTSELLERS</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
                Most Loved By Customers
              </h2>
            </div>

            {/* Category Pills Switcher (Matching Astrotalk Screenshot 2) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {BESTSELLER_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-black text-white shadow-md"
                      : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center space-y-3">
              <Package className="size-10 text-stone-400 mx-auto" />
              <h3 className="font-bold text-base text-stone-700">No products found in this category</h3>
              <p className="text-xs text-stone-500">Try switching to &quot;All Bestsellers&quot; or search another term.</p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("all");
                  setSearchTerm("");
                }}
                className="px-4 py-2 rounded-full bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl border border-stone-200 bg-white p-3.5 shadow-xs hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Aspect-Square Image Container */}
                    <div
                      className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-100 cursor-pointer"
                      onClick={() => setSelectedProductModal(product)}
                    >
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        unoptimized
                      />

                      {/* Top Badges */}
                      {product.badge && (
                        <div className="absolute top-2.5 left-2.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold tracking-wide uppercase ${
                              product.badge_type === "offer"
                                ? "bg-red-600 text-white shadow-sm"
                                : product.badge_type === "numerology"
                                ? "bg-stone-900 text-amber-200 border border-amber-400/40 shadow-sm"
                                : "bg-amber-500 text-stone-950 font-black shadow-sm"
                            }`}
                          >
                            {product.badge}
                          </span>
                        </div>
                      )}

                      {/* Quick Inspect View Icon */}
                      <div className="absolute bottom-2.5 right-2.5 size-8 rounded-full bg-white/90 backdrop-blur-md text-stone-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
                        <Sparkles className="size-3.5 text-amber-600" />
                      </div>
                    </div>

                    {/* Metadata & Title */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                        {product.category_label}
                      </span>
                      <h3
                        onClick={() => setSelectedProductModal(product)}
                        className="font-bold text-sm text-stone-900 hover:text-amber-800 transition-colors line-clamp-1 cursor-pointer"
                        title={product.title}
                      >
                        {product.title}
                      </h3>
                      {product.subtitle_tag && (
                        <p className="text-[11px] text-stone-500 truncate">{product.subtitle_tag}</p>
                      )}
                    </div>
                  </div>

                  {/* Pricing & ADD TO CART Button */}
                  <div className="pt-3 mt-2 border-t border-stone-100 space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="font-black text-stone-900 text-base sm:text-lg">
                        ₹{product.sale_price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-stone-400 line-through">
                        ₹{product.mrp.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        {product.discount_percent}% off
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="w-full py-2.5 rounded-xl bg-black text-white hover:bg-stone-800 active:scale-[0.98] font-bold text-xs tracking-wider uppercase transition-all shadow-sm cursor-pointer text-center flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="size-3.5" />
                      <span>ADD TO CART</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Center Link (Matching Screenshot 2) */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                window.scrollTo({ top: 400, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-stone-900 hover:text-amber-700 underline underline-offset-4 cursor-pointer transition-colors"
            >
              <span>View all All Bestsellers</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </section>

        {/* 5. "Shop by What Matters" Section (Matching Screenshot 3) */}
        <section className="rounded-3xl border border-[#ebdcc9] bg-[#fbf8f2] p-6 sm:p-10 shadow-sm space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-amber-700">
              <span>✦</span>
              <span>Shop by What Matters</span>
              <span>✦</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
              Tell us what you want to attract.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              We&apos;ll show you what authentic Vedic remedies &amp; sacred stones work best for it.
            </p>

            {/* 3 Tab Switcher */}
            <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-white/80 border border-stone-200 mt-4 shadow-xs">
              {(["purpose", "crystal", "planet"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveWhatMattersTab(tab)}
                  className={`px-5 py-1.5 rounded-full text-xs font-bold capitalize transition-all duration-200 cursor-pointer ${
                    activeWhatMattersTab === tab
                      ? "bg-stone-900 text-white shadow-xs"
                      : "text-stone-600 hover:text-stone-950"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* 2-Column Grid (8 Cards Matching Screenshot 3) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SHOP_BY_WHAT_MATTERS[activeWhatMattersTab].map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setActiveCategory(item.query);
                  toast.info(`Filtering products for: ${item.title}`);
                  const el = document.getElementById("search-anchor");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-2xl border border-stone-200/90 bg-white p-4 shadow-xs hover:border-amber-400 hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    {item.iconName === "Coins" && <Coins className="size-5" />}
                    {item.iconName === "Heart" && <Heart className="size-5" />}
                    {item.iconName === "Shield" && <ShieldCheck className="size-5" />}
                    {item.iconName === "Zap" && <Zap className="size-5" />}
                    {item.iconName === "Sparkles" && <Sparkles className="size-5" />}
                    {item.iconName === "Award" && <Award className="size-5" />}
                    {item.iconName === "Gift" && <Gift className="size-5" />}
                    {item.iconName === "Compass" && <Compass className="size-5" />}
                    {item.iconName === "Flame" && <Flame className="size-5" />}
                    {item.iconName === "Sun" && <Sun className="size-5" />}
                    {item.iconName === "Moon" && <Moon className="size-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900 group-hover:text-amber-800 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 line-clamp-1">{item.desc}</p>
                  </div>
                </div>

                <div className="size-7 rounded-full bg-stone-50 group-hover:bg-amber-50 flex items-center justify-center text-stone-400 group-hover:text-amber-700 transition-all shrink-0">
                  <ArrowRight className="size-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          <div id="search-anchor" className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                toast.success("Showing complete sacred store catalog");
              }}
              className="px-6 py-2.5 rounded-full border border-stone-800 text-stone-900 hover:bg-stone-900 hover:text-white font-bold text-xs tracking-wider uppercase transition-all cursor-pointer"
            >
              Explore all {activeWhatMattersTab}s
            </button>
          </div>
        </section>

        {/* 6. "Loved by You, Shared by You" (Customer Reels Showcase) */}
        <section className="rounded-3xl bg-[#121015] text-white p-6 sm:p-10 shadow-2xl border border-amber-950/40 relative overflow-hidden space-y-8">
          <div className="pointer-events-none absolute -top-24 -left-24 size-80 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full bg-amber-600/10 blur-3xl" />

          {/* Section Header */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-amber-400">
                <span>✦</span>
                <span>REAL STORIES, REAL EXPERIENCES</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-black text-amber-50 tracking-tight">
                Loved by You, Shared by You
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 max-w-xl">
                Real reviews, unboxings and everyday spiritual rituals from our verified community.
              </p>
            </div>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-300 hover:text-amber-200 transition-colors self-start md:self-auto"
            >
              <span>Follow on Instagram</span>
              <ArrowRight className="size-3.5" />
            </a>
          </div>

          {/* 5 Vertical Reel Cards (9:16 Aspect Ratio) */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {customerReels.map((reel) => {
              const isLiked = likedReels[reel.id] || false;
              return (
                <div
                  key={reel.id}
                  id={reel.id}
                  className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 group shadow-lg flex flex-col justify-between p-3 select-none"
                >
                  {/* Thumbnail Image */}
                  <Image
                    src={reel.thumbnail_url}
                    alt={reel.user_handle}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    unoptimized
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/30" />

                  {/* Center Play Button Overlay */}
                  <div
                    onClick={() => setActiveReelModal(reel)}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  >
                    <div className="size-11 sm:size-12 rounded-full bg-black/50 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-black transition-all duration-300 shadow-xl">
                      <Play className="size-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Top Bar: Handle & Rating */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white/90 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 truncate max-w-[120px]">
                      {reel.user_handle}
                    </span>
                    <div className="flex items-center text-amber-400 text-[10px]">
                      {"★".repeat(reel.rating)}
                    </div>
                  </div>

                  {/* Bottom Bar: Quote & Like/Share Action Buttons */}
                  <div className="relative z-10 space-y-2">
                    <p
                      onClick={() => setActiveReelModal(reel)}
                      className="text-xs text-white/95 font-medium line-clamp-2 leading-snug drop-shadow-md cursor-pointer hover:text-amber-200 transition-colors"
                    >
                      &ldquo;{reel.quote}&rdquo;
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-white/15">
                      {/* Like Action */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLikeReel(reel.id);
                        }}
                        className="flex items-center gap-1 text-[11px] font-bold text-white/90 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Heart
                          className={`size-3.5 transition-transform ${
                            isLiked ? "fill-rose-500 text-rose-500 scale-125" : ""
                          }`}
                        />
                        <span>{reel.likes_count}</span>
                      </button>

                      {/* Share Action */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          shareReel(reel);
                        }}
                        className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                        title="Share reel"
                      >
                        <Share2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Floating Quick Cart Pill */}
      {totalCartCount > 0 && (
        <aside
          aria-label="Floating quick cart"
          className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-6"
        >
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 px-5 py-3 rounded-full bg-black text-white shadow-2xl hover:bg-stone-900 border border-amber-400/50 transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="size-5 text-amber-400" />
              <span className="absolute -top-2 -right-2 size-4 rounded-full bg-amber-500 text-black text-[10px] font-black flex items-center justify-center">
                {totalCartCount}
              </span>
            </div>
            <div className="text-left">
              <span className="text-[11px] uppercase tracking-wider block font-bold text-stone-400">
                Astra Cart
              </span>
              <span className="text-sm font-extrabold text-white">
                ₹{totalCartAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <ChevronRight className="size-4 text-stone-400 ml-1" />
          </button>
        </aside>
      )}

      {/* Cart Slide-Over Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="size-5 text-amber-600" />
                  <h3 className="font-bold text-lg text-stone-900">Your Consecrated Cart ({totalCartCount})</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-md text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="py-20 text-center space-y-2">
                  <Package className="size-12 text-stone-300 mx-auto" />
                  <p className="text-sm font-semibold text-stone-500">Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-3 divide-y divide-stone-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="pt-3 flex items-center gap-3">
                      <div className="relative size-16 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 truncate">{item.title}</h4>
                        <span className="text-xs font-extrabold text-stone-900 block mt-0.5">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="size-6 rounded-md bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 cursor-pointer"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="text-xs font-bold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="size-6 rounded-md bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 cursor-pointer"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-stone-600">Total Consecrated Order</span>
                  <span className="font-extrabold text-stone-900 text-lg">
                    ₹{totalCartAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toast.success(
                      language === "bn"
                        ? "অর্ডার প্রক্রিয়া শুরু হয়েছে! বৈদিক আচার্য অবিলম্বে যোগাযোগ করবেন।"
                        : "Order placed successfully! A Vedic Acharya will contact you shortly."
                    );
                    setCartItems([]);
                    setIsCartOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-black text-white hover:bg-stone-800 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer text-center"
                >
                  Proceed to Consecrated Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Quick-View Modal */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 text-stone-900 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 uppercase">
                  {selectedProductModal.category_label}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 mt-1">
                  {selectedProductModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProductModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              <Image
                src={selectedProductModal.image}
                alt={selectedProductModal.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                {language === "bn" ? "বৈদিক শাস্ত্রীয় বিবরণ:" : "Sacred Vedic Description:"}
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                {selectedProductModal.description}
              </p>
            </div>

            {selectedProductModal.benefits.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 space-y-1.5">
                <span className="text-[11px] font-bold text-amber-900 block">
                  ✦ {language === "bn" ? "প্রধান শুভ ফল ও প্রভাব:" : "Key Astrological Influences:"}
                </span>
                <ul className="text-xs text-stone-700 space-y-1 list-disc list-inside">
                  {selectedProductModal.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-stone-900">
                    ₹{selectedProductModal.sale_price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-stone-400 line-through">
                    ₹{selectedProductModal.mrp.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    {selectedProductModal.discount_percent}% off
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="size-3" />
                  <span>100% Authentic with Govt. Lab Guarantee</span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  addToCart(selectedProductModal);
                  setSelectedProductModal(null);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-black text-white hover:bg-stone-800 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reel Video Player Modal */}
      {activeReelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-stone-950 text-white shadow-2xl border border-stone-800 space-y-4 p-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-full bg-amber-500 text-black font-bold text-xs flex items-center justify-center">
                  ✦
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{activeReelModal.user_handle}</span>
                  <span className="text-[10px] text-stone-400">{activeReelModal.user_name}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveReelModal(null)}
                className="text-stone-400 hover:text-white p-1 rounded-md cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Video preview / player */}
            <div className="relative aspect-[9/14] w-full rounded-2xl overflow-hidden bg-black border border-stone-800">
              <video
                src={activeReelModal.video_url}
                poster={activeReelModal.thumbnail_url}
                autoPlay
                loop
                muted
                playsInline
                className="size-full object-cover"
              />
            </div>

            <p className="text-xs text-stone-300 italic px-1">
              &ldquo;{activeReelModal.quote}&rdquo;
            </p>

            {/* Tagged product banner */}
            <div className="rounded-xl bg-stone-900 border border-stone-800 p-3 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  Tagged Sacred Item
                </span>
                <span className="text-xs font-bold text-white block truncate max-w-[180px]">
                  {activeReelModal.tagged_product_title}
                </span>
                <span className="text-xs font-black text-amber-300">
                  ₹{activeReelModal.tagged_product_price.toLocaleString("en-IN")}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  toast.success(`Opening ${activeReelModal.tagged_product_title}`);
                  setActiveReelModal(null);
                  setActiveCategory("all");
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}

export default function ShopPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
          <RotateCcw className="size-8 text-amber-600 animate-spin" />
        </div>
      }
    >
      <ShopInner />
    </React.Suspense>
  );
}
