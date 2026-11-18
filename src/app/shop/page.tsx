"use client";

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
  Play,
  Heart,
  Share2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { shopApi, type ShopProduct, type ShopProductCategory, type ShopBannerSettings } from "@/lib/api";
import { useLanguage } from "@/providers/language-provider";
import { useCartStore } from "@/lib/stores/use-cart-store";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { ShopAnnouncementMarquee } from "@/components/shop/ShopAnnouncementMarquee";
import { ShopHeroSlider } from "@/components/shop/ShopHeroSlider";
import { ShopCategoryPills } from "@/components/shop/ShopCategoryPills";
import { ShopByWhatMatters } from "@/components/shop/ShopByWhatMatters";
import { ShopBestsellers } from "@/components/shop/ShopBestsellers";
import { CashbackPromoBanner } from "@/components/shop/CashbackPromoBanner";
import { AstraPromiseSection } from "@/components/shop/AstraPromiseSection";
import { ShopFaqAccordion } from "@/components/shop/ShopFaqAccordion";
import { CardTilt } from "@/components/ui/card-tilt";
import { ShopFilterDrawer } from "@/components/shop/ShopFilterDrawer";
import { CUSTOMER_REELS, type CustomerReel } from "@/lib/shop-data";

function ShopInner() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const initialPlanet = searchParams.get("planet") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialPurpose = searchParams.get("purpose") || "";

  const [selectedPlanet, setSelectedPlanet] = React.useState<string>(initialPlanet);
  const [selectedCategory, setSelectedCategory] = React.useState<string>(initialCategory);
  const [selectedPurpose, setSelectedPurpose] = React.useState<string>(initialPurpose);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [activeReelModal, setActiveReelModal] = React.useState<CustomerReel | null>(null);
  const [likedReels, setLikedReels] = React.useState<Record<string, boolean>>({});

  const { openCart, getItemCount } = useCartStore();
  const cartItemCount = getItemCount();

  React.useEffect(() => {
    if (initialPlanet) setSelectedPlanet(initialPlanet);
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialPurpose) setSelectedPurpose(initialPurpose);
  }, [initialPlanet, initialCategory, initialPurpose]);

  // Fetch Public Banners
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
  });

  // Fetch Public Products
  const { data: serverProductData, isLoading } = useQuery({
    queryKey: ["shop_public_products", selectedPlanet, selectedCategory, searchTerm],
    queryFn: async () => {
      try {
        const res = await shopApi.getProducts({
          ruling_planet: selectedPlanet || undefined,
          category_id: selectedCategory || undefined,
          search: searchTerm || undefined,
          limit: 30,
        });
        return res;
      } catch {
        return { items: [], total: 0 };
      }
    },
  });

  // Fetch Public Categories
  const { data: categories = [] } = useQuery<ShopProductCategory[]>({
    queryKey: ["shop_public_categories"],
    queryFn: async () => {
      try {
        const res = await shopApi.getCategories();
        return res;
      } catch {
        return [];
      }
    },
  });

  const rawProducts: ShopProduct[] =
    serverProductData && serverProductData.items && Array.isArray(serverProductData.items)
      ? serverProductData.items
      : [];

  const products: ShopProduct[] = selectedPurpose
    ? rawProducts.filter((p) => p.purpose_tags?.includes(selectedPurpose))
    : rawProducts;

  const customerReels: CustomerReel[] =
    (bannerSettings as any)?.reels && (bannerSettings as any).reels.length > 0
      ? (bannerSettings as any).reels
      : CUSTOMER_REELS;

  const resetAllFilters = () => {
    setSelectedPlanet("");
    setSelectedCategory("");
    setSelectedPurpose("");
    setSearchTerm("");
  };

  const hasActiveFilter = Boolean(selectedPlanet || selectedCategory || selectedPurpose || searchTerm);

  return (
    <div className="min-h-screen bg-[#faf6f0] text-stone-900 selection:bg-amber-200 selection:text-amber-950 font-sans">
      <SiteHeader />
      <CartDrawer />

      {/* 1. Top Announcement Marquee */}
      <ShopAnnouncementMarquee
        announcementText={bannerSettings?.announcement_bar_text}
        announcementLink={bannerSettings?.announcement_bar_link}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12 sm:space-y-16">
        {/* 2. Hero Section: Astrotalk-Style 5-Slide Luxury Carousel */}
        <ShopHeroSlider banners={bannerSettings?.hero_banners} />

        {/* 3. Category Quick Filter Strip */}
        <ShopCategoryPills />

        {/* 4. Shop By What Matters (Life Purpose, Planets, Crystals) */}
        <ShopByWhatMatters
          onSelectFilter={(type, value) => {
            if (type === "purpose") setSelectedPurpose(value);
            if (type === "planet") setSelectedPlanet(value);
          }}
        />

        {/* 5. Most Loved By Customers (Bestsellers Section) */}
        <ShopBestsellers products={rawProducts} />

        {/* 6. Promotional 100% Wallet Cashback Strip */}
        <CashbackPromoBanner />

        {/* 7. Loved by You, Shared by You: Video Reels Section */}
        <section className="rounded-3xl bg-[#1c140e] text-white p-6 sm:p-10 space-y-8 border border-amber-500/20 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-amber-900/40 pb-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-400">
                <Sparkles className="size-3.5" />
                <span>COMMUNITY STORIES</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-black text-amber-50 tracking-tight">
                Loved by You, Shared by You
              </h2>
              <p className="text-xs sm:text-sm text-stone-300">
                Real customer unboxings, temple consecrations, and life transformation stories.
              </p>
            </div>
            <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
              ✦ 100% Verified Devotee Reviews
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {customerReels.map((reel) => {
              const isLiked = likedReels[reel.id];
              return (
                <div
                  key={reel.id}
                  className="group relative rounded-2xl overflow-hidden aspect-[9/16] bg-stone-900 border border-amber-500/20 shadow-md hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-3 select-none"
                >
                  <Image
                    src={reel.thumbnail_url}
                    alt={reel.user_name}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 group-hover:via-black/20 transition-all" />

                  {/* Play Button Overlay */}
                  <button
                    type="button"
                    onClick={() => setActiveReelModal(reel)}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
                    aria-label={`Play story from ${reel.user_name}`}
                  >
                    <div className="size-11 sm:size-13 rounded-full bg-amber-500/90 text-stone-950 flex items-center justify-center pl-0.5 shadow-xl group-hover:scale-110 group-hover:bg-amber-400 transition-all duration-300">
                      <Play className="size-5 sm:size-6 fill-current" />
                    </div>
                  </button>

                  {/* Top user tag */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-200 drop-shadow-sm truncate max-w-[110px]">
                      {reel.user_handle}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLikedReels((prev) => ({ ...prev, [reel.id]: !prev[reel.id] }));
                      }}
                      className="text-white hover:text-rose-400 p-1 transition-colors cursor-pointer"
                    >
                      <Heart className={`size-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                    </button>
                  </div>

                  {/* Bottom product title & quote */}
                  <div className="relative z-10 space-y-1">
                    <p className="text-[11px] text-stone-200 line-clamp-2 italic drop-shadow-sm leading-tight">
                      &ldquo;{reel.quote}&rdquo;
                    </p>
                    <div className="pt-1 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-300 truncate max-w-[100px]">
                        ₹{reel.tagged_product_price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[9px] text-stone-300 bg-black/40 px-1.5 py-0.5 rounded">
                        {reel.likes_count}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 8. Main Catalog Grid with Search & Filters */}
        <section id="all-products" className="space-y-6 pt-4">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  {language === "bn" ? "সমস্ত বৈদিক প্রতিকার ও পণ্য" : "All Consecrated Remedies & Products"}
                </h3>
                <p className="text-xs text-stone-500">
                  {language === "bn"
                    ? `মোট ${products.length}টি প্রতিকার সামগ্রী প্রদর্শিত হচ্ছে`
                    : `Showing ${products.length} lab-certified products ready to ship`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <ShopFilterDrawer
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
                    (selectedPurpose ? 1 : 0)
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
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Search Input */}
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
                className="w-full rounded-2xl border border-stone-300 bg-stone-50 pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:border-amber-600 focus:bg-white focus:outline-hidden transition-colors"
              />
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <RotateCcw className="size-8 text-amber-600 animate-spin mx-auto" />
              <p className="text-xs text-stone-500 font-medium">
                {language === "bn" ? "পবিত্র রত্ন ও রুদ্রাক্ষ লোড হচ্ছে..." : "Loading consecrated remedies..."}
              </p>
            </div>
          ) : products.length === 0 ? (
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
                {rawProducts.length === 0
                  ? language === "bn"
                    ? "অ্যাডমিন প্যানেল থেকে শীঘ্রই নতুন প্রাণ-প্রতিষ্ঠিত বৈদিক প্রতিকার ও রত্ন সামগ্রী যুক্ত করা হবে।"
                    : "New consecrated Vedic remedies and crystals will be uploaded shortly via Admin Panel."
                  : language === "bn"
                  ? "অন্য কোনো গ্রহ, রাশি বা সামগ্রীর নাম লিখে অনুসন্ধান করুন।"
                  : "Try clearing filters or searching another keyword."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((p) => {
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
                          className="font-bold text-xs text-stone-900 line-clamp-2 hover:text-amber-700 transition-colors block"
                        >
                          {p.title}
                        </Link>

                        <p className="text-[11px] text-stone-500 line-clamp-2">
                          {p.short_description}
                        </p>
                      </div>

                      {/* Pricing & Add */}
                      <div className="pt-3 mt-2 border-t border-stone-100 space-y-2">
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
                          <span className="text-[9px] text-emerald-700 font-extrabold uppercase">
                            In Stock
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href={`/shop/products/${p.slug}`}
                            className="py-2 px-2 rounded-xl border border-stone-200 text-stone-700 font-bold text-[11px] hover:bg-stone-50 transition-colors text-center"
                          >
                            Details
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              useCartStore.getState().addItem(p, 1);
                              toast.success(`${p.title} added to cart! Free gift included.`);
                            }}
                            className="py-2 px-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <ShoppingBag className="size-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardTilt>
                );
              })}
            </div>
          )}
        </section>

        {/* 9. The Astra Promise Section */}
        <AstraPromiseSection />

        {/* 10. FAQs */}
        <ShopFaqAccordion />
      </main>

      {/* Floating Cart Trigger on Mobile / Desktop */}
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
          <span>View Cart</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-black">
            ₹{useCartStore.getState().getSubtotal().toLocaleString("en-IN")}
          </span>
        </button>
      )}

      {/* Video Reel Player Modal */}
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
        <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
          <div className="size-8 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <ShopInner />
    </React.Suspense>
  );
}
