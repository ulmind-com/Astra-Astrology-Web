"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Coins,
  Copy,
  Flame,
  Gift,
  Heart,
  HelpCircle,
  Info,
  Loader2,
  Lock,
  MapPin,
  Minus,
  Package,
  Plus,
  RefreshCw,
  Share2,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { SacredImageGallery } from "@/components/shop/SacredImageGallery";
import { CashbackConsultationBridge } from "@/components/shop/CashbackConsultationBridge";
import { SacredSpecificationsGrid } from "@/components/shop/SacredSpecificationsGrid";
import { LivePincodeLogisticsTracker } from "@/components/shop/LivePincodeLogisticsTracker";
import { AstraPromiseSection } from "@/components/shop/AstraPromiseSection";
import { SacredDevoteeReviews } from "@/components/shop/SacredDevoteeReviews";
import { CardTilt } from "@/components/ui/card-tilt";
import { shopApi, type ShopProduct } from "@/lib/api";
import { useCartStore } from "@/lib/stores/use-cart-store";
import { useLanguage } from "@/providers/language-provider";

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const isBn = language === "bn";

  const rawSlug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";
  let slug = rawSlug;
  try {
    slug = decodeURIComponent(rawSlug);
  } catch {}

  const { addItem, openCart } = useCartStore();

  // State
  const [quantity, setQuantity] = React.useState<number>(1);
  const [activeTab, setActiveTab] = React.useState<"description" | "rituals" | "certificate">("description");

  // Fetch product detail from API with resilient fallback
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<ShopProduct | null>({
    queryKey: ["shop_product_detail", slug],
    queryFn: async () => {
      if (!slug) return null;
      try {
        const res = await shopApi.getProductDetail(slug);
        if (res && (res.id || res.title)) return res;
      } catch (err) {
        console.warn("Direct getProductDetail failed, attempting fallback:", err);
      }
      try {
        const catalog = await shopApi.getProducts({ limit: 100 });
        const cleanSlug = slug.toLowerCase().trim();
        const match = (catalog.items || []).find(
          (item) =>
            item.slug?.toLowerCase() === cleanSlug ||
            item.id === slug ||
            item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === cleanSlug
        );
        if (match) return match;
      } catch (err2) {
        console.warn("Catalog fallback search failed:", err2);
      }
      return null;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
    enabled: Boolean(slug),
  });

  // Fetch related products
  const { data: relatedData } = useQuery({
    queryKey: ["shop_related_products", product?.category_id],
    queryFn: async () => {
      if (!product?.category_id) return null;
      try {
        const res = await shopApi.getProducts({
          category_id: product.category_id,
          limit: 4,
        });
        return res;
      } catch {
        return null;
      }
    },
    enabled: Boolean(product?.category_id),
  });

  const relatedProducts = (relatedData?.items || []).filter((p) => p.id !== product?.id).slice(0, 4);

  // Pricing calculations
  const mrp = product?.mrp || 0;
  const salePrice = product?.sale_price || 0;
  const discountPercent =
    product?.discount_percent ||
    (mrp > salePrice ? Math.round(((mrp - salePrice) / mrp) * 100) : 0);
  const savings = mrp > salePrice ? mrp - salePrice : 0;
  const freeGiftBadge = product?.free_gift_badge || "";
  const effectiveCashback = product?.cashback_percent ?? 100;
  const cashbackCoins = Math.round(salePrice * (effectiveCashback / 100));

  // Add to cart handler
  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    toast.success(
      isBn
        ? `${product.title} কার্টে যোগ করা হয়েছে!`
        : `${product.title} added to cart!`
    );
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } catch {}
  };

  // Buy now handler
  const handleBuyNow = () => {
    if (!product) return;
    addItem(product, quantity);
    router.push("/shop/checkout");
  };

  // Share handler
  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title || "DivinLink Remedy",
          text: product?.short_description || "Check out this consecrated Vedic remedy at DivinLink!",
          url,
        });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success(isBn ? "লিঙ্ক কপি করা হয়েছে!" : "Product link copied to clipboard!");
    } catch {
      toast.info(url);
    }
  };

  // ---------------------------------------------------------------------------
  // Loading & 404 Not Found States
  // ---------------------------------------------------------------------------
  if (isLoading && !product) {
    return (
      <>
        <SiteHeader />
        <CartDrawer />
        <main className="max-w-6xl mx-auto px-4 py-20 text-center space-y-4">
          <Loader2 className="size-10 text-amber-600 animate-spin mx-auto" />
          <h2 className="font-cinzel text-lg font-bold text-stone-800">
            {isBn ? "পবিত্র প্রতিকারের বিবরণ লোড হচ্ছে..." : "Loading Sacred Remedy Details..."}
          </h2>
          <p className="text-xs text-stone-500">
            {isBn ? "অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন।" : "Please wait a moment."}
          </p>
        </main>
        <SiteFooter />
      </>
    );
  }

  if (!product || isError) {
    return (
      <>
        <SiteHeader />
        <CartDrawer />
        <main className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
          <div className="size-20 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
            <Package className="size-10 text-amber-600" />
          </div>
          <h1 className="font-cinzel text-2xl font-bold text-stone-900">
            {isBn ? "প্রতিকার সামগ্রীটি খুঁজে পাওয়া যায়নি" : "Remedy Not Found"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
            {isBn
              ? "আপনি যে রত্ন বা প্রতিকারটি খুঁজছেন তা বর্তমানে উপলব্ধ নেই অথবা সরিয়ে নেওয়া হয়েছে।"
              : "The consecrated remedy or crystal you are looking for is either unavailable or has been removed."}
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 text-sm transition-colors shadow-sm"
            >
              <ArrowLeft className="size-4" />
              <span>{isBn ? "সমস্ত প্রতিকার দেখুন (শপ)" : "Return to AstroStore"}</span>
            </Link>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  // ---------------------------------------------------------------------------
  // Main Product Detail View
  // ---------------------------------------------------------------------------
  return (
    <>
      <SiteHeader />
      <CartDrawer />

      <main className="max-w-6xl mx-auto px-4 py-4 sm:py-8 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 overflow-x-auto whitespace-nowrap py-1">
          <Link href="/" className="hover:text-amber-700 transition-colors">
            {isBn ? "হোম" : "Home"}
          </Link>
          <ChevronRight className="size-3 text-stone-400 shrink-0" />
          <Link href="/shop" className="hover:text-amber-700 transition-colors">
            {isBn ? "শপ" : "Shop"}
          </Link>
          {product.category_slug && (
            <>
              <ChevronRight className="size-3 text-stone-400 shrink-0" />
              <Link
                href={`/shop?category=${product.category_slug}`}
                className="hover:text-amber-700 transition-colors capitalize"
              >
                {product.category_slug.replace(/-/g, " ")}
              </Link>
            </>
          )}
          <ChevronRight className="size-3 text-stone-400 shrink-0" />
          <span className="text-stone-900 font-semibold truncate max-w-[200px] sm:max-w-xs">
            {product.title}
          </span>
        </nav>

        {/* ================================================================= */}
        {/* Main Product Showcase: Left Gallery + Right Purchase Box */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* ================= Left: Sacred Image Gallery ================= */}
          <div className="lg:col-span-6 space-y-4">
            <SacredImageGallery
              title={product.title}
              images={product.images || []}
              featuredImage={product.featured_image}
              discountPercent={discountPercent}
              cashbackPercent={effectiveCashback}
              isEnergized={product.is_energized}
              freeGiftBadge={freeGiftBadge}
              onShare={handleShare}
            />

            {/* Trust Guarantee Micro-Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="rounded-2xl border border-stone-200 bg-white p-2.5 text-center space-y-1 shadow-2xs">
                <ShieldCheck className="size-4 text-emerald-600 mx-auto" />
                <p className="text-[10px] font-bold text-stone-800">{isBn ? "১০০% খাঁটি" : "100% Genuine"}</p>
                <p className="text-[9px] text-stone-500">{isBn ? "প্রাকৃতিক উপাদান" : "Lab Certified"}</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-2.5 text-center space-y-1 shadow-2xs">
                <Flame className="size-4 text-amber-600 mx-auto" />
                <p className="text-[10px] font-bold text-stone-800">{isBn ? "প্রাণ-প্রতিষ্ঠিত" : "Consecrated"}</p>
                <p className="text-[9px] text-stone-500">{isBn ? "কাশীর পুরোহিত দ্বারা" : "Kashi Pandits"}</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-2.5 text-center space-y-1 shadow-2xs">
                <Truck className="size-4 text-blue-600 mx-auto" />
                <p className="text-[10px] font-bold text-stone-800">{isBn ? "ফ্রি ডেলিভারি" : "Free Shipping"}</p>
                <p className="text-[9px] text-stone-500">{isBn ? "₹৪৯৯ এর উপরে" : "Orders > ₹499"}</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-2.5 text-center space-y-1 shadow-2xs">
                <RefreshCw className="size-4 text-purple-600 mx-auto" />
                <p className="text-[10px] font-bold text-stone-800">{isBn ? "সুরক্ষিত প্যাকেজিং" : "Safe Transit"}</p>
                <p className="text-[9px] text-stone-500">{isBn ? "ক্ষতিহীন রিপ্লেসমেন্ট" : "Transit Insured"}</p>
              </div>
            </div>

            {/* QR Code Authenticity & Kashi Consecration Card */}
            <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50/70 via-stone-50 to-white p-3.5 sm:p-4 shadow-xs space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="size-16 rounded-xl bg-white border border-stone-200 p-1.5 shadow-2xs shrink-0 flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Visual QR Code Representation */}
                  <div className="size-full bg-stone-900 rounded-sm p-1 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="size-3 bg-white rounded-xs flex items-center justify-center">
                        <div className="size-1.5 bg-stone-900" />
                      </div>
                      <div className="size-3 bg-white rounded-xs flex items-center justify-center">
                        <div className="size-1.5 bg-stone-900" />
                      </div>
                    </div>
                    <div className="flex justify-center items-center">
                      <Sparkles className="size-2.5 text-amber-300 animate-spin" />
                    </div>
                    <div className="flex justify-between">
                      <div className="size-3 bg-white rounded-xs flex items-center justify-center">
                        <div className="size-1.5 bg-stone-900" />
                      </div>
                      <div className="size-1.5 bg-amber-400 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-stone-900">
                      {isBn ? "QR কোড দিয়ে আসল প্রতিকার যাচাই" : "Scan QR for 100% Authenticity"}
                    </span>
                    <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300">
                      ✓ {isBn ? "ল্যাব ভেরিফায়েড" : "Lab Verified"}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    {isBn
                      ? "প্রতিটি পার্সেলের বাক্সে থাকবে সরকারি ল্যাব সার্টিফাইড হলোগ্রাফিক কিউআর কোড সিলমোহর।"
                      : "Each parcel comes with a govt-approved lab certified holographic tamper-evident seal."}
                  </p>
                  <p className="text-[10px] font-mono text-amber-900 font-semibold">
                    {isBn ? "সার্টিফিকেট আইডি:" : "Cert ID:"} #{product.sku || "ASTR-7089"} • {isBn ? "কাশীর প্রাণ-প্রতিষ্ঠা" : "Kashi Energized"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= Right: Product Information & Purchase Box ================= */}
          <div className="lg:col-span-6 space-y-4">
            {/* Rating & SKU Header */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <a
                href="#devotee-reviews"
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 hover:border-amber-400 px-3 py-1 text-xs font-bold text-amber-900 transition-colors"
              >
                {product.review_count && product.review_count > 0 ? (
                  <>
                    <Star className="size-3.5 fill-amber-500 text-amber-500" />
                    <span>{(product.average_rating || 5.0).toFixed(1)}</span>
                    <span className="text-stone-400 font-normal">|</span>
                    <span className="text-stone-600 font-medium">
                      {product.review_count} {isBn ? "ভক্ত রিভিউ" : "reviews"}
                    </span>
                  </>
                ) : (
                  <span className="text-amber-800 font-semibold">
                    {isBn ? "নতুন প্রতিকার (প্রথম রিভিউ দিন)" : "New Remedy (Be first to review)"}
                  </span>
                )}
              </a>
              <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-md">
                SKU: {product.sku}
              </span>
            </div>

            {/* Product Title */}
            <div className="space-y-1">
              <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                {product.title}
              </h1>
              {product.short_description && (
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                  {product.short_description}
                </p>
              )}
            </div>

            {/* Price Box */}
            <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/70 via-stone-50 to-white p-3.5 sm:p-4 space-y-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-extrabold text-2xl sm:text-3xl text-stone-950">
                  {formatINR(salePrice)}
                </span>
                {mrp > salePrice && (
                  <span className="text-sm sm:text-base text-stone-400 line-through">
                    {formatINR(mrp)}
                  </span>
                )}
                {savings > 0 && (
                  <span className="rounded-md bg-rose-100 border border-rose-200 px-2 py-0.5 text-xs font-black text-rose-800">
                    {discountPercent}% OFF • {isBn ? `বাঁচান ${formatINR(savings)}` : `Save ${formatINR(savings)}`}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500">
                {isBn
                  ? "সকল কর অন্তর্ভুক্ত • ₹৪৯৯+ অর্ডারে ফ্রি এক্সপ্রেস ডেলিভারি"
                  : "Inclusive of all taxes • Free express shipping on orders over ₹499"}
              </p>
            </div>

            {/* PRIMARY PURCHASE SECTION: Prominently Above The Fold */}
            <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-50/20 p-4 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-stone-700">{isBn ? "পরিমাণ:" : "Quantity:"}</span>
                  <div className="inline-flex items-center rounded-xl border border-stone-300 bg-white shadow-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="p-2 text-stone-600 hover:text-amber-800 disabled:opacity-30 transition-colors cursor-pointer"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-9 text-center font-bold text-xs text-stone-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(product.stock_quantity || 10, q + 1))}
                      disabled={quantity >= (product.stock_quantity || 10)}
                      className="p-2 text-stone-600 hover:text-amber-800 disabled:opacity-30 transition-colors cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-[11px] font-medium">
                  {product.in_stock ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      {isBn ? "স্টক উপলব্ধ (In Stock)" : "In Stock • Ships in 24h"}
                    </span>
                  ) : (
                    <span className="text-rose-600 font-bold bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                      {isBn ? "স্টক শেষ (Out of Stock)" : "Out of Stock"}
                    </span>
                  )}
                </div>
              </div>

              {/* Main Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-amber-600 bg-white hover:bg-amber-50 text-amber-900 font-bold py-3.5 px-4 text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                >
                  <ShoppingBag className="size-4 text-amber-700" />
                  <span>{isBn ? "কার্টে যোগ করুন" : "Add to Cart"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!product.in_stock}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-700 hover:from-amber-700 hover:to-yellow-800 text-white font-extrabold py-3.5 px-4 text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                >
                  <Zap className="size-4 fill-amber-300 text-amber-300" />
                  <span>{isBn ? "এখনই কিনুন (সরাসরি চেকআউট)" : "Buy Now (Fast Checkout)"}</span>
                </button>
              </div>

              {/* Free Gift Assurance Pill */}
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 flex items-center gap-2 text-xs font-bold text-amber-950">
                <Gift className="size-4 text-amber-600 shrink-0" />
                <span className="truncate">
                  {freeGiftBadge || (isBn ? "সাথে ফ্রি উপহার: খাঁটি সেলিনাইট ক্রিস্টাল প্লেট (মূল্য ₹৭২৯)" : "Includes Free Gift: Selenite Plate")}
                </span>
              </div>
            </div>

            {/* Live Pincode & Real-Time Logistics Tracker */}
            <LivePincodeLogisticsTracker
              salePrice={salePrice}
              cashbackPercent={effectiveCashback}
              freeGiftTitle={product.free_gift_title}
              freeGiftValue={product.free_gift_value}
            />

            {/* Value Proposition: 100% Wallet Cashback to Astrologer Bridge */}
            <CashbackConsultationBridge
              productTitle={product.title}
              mrp={mrp}
              salePrice={salePrice}
              cashbackPercent={effectiveCashback}
              freeGiftTitle={product.free_gift_title}
              freeGiftValue={product.free_gift_value}
              freeGiftBadge={product.free_gift_badge}
              categorySlug={product.category_slug}
            />
          </div>
        </div>

        {/* ================================================================= */}
        {/* Full-Width Section: Sacred Vedic & Astrological Specifications */}
        {/* ================================================================= */}
        <section className="space-y-4">
          <div className="border-b border-amber-200/80 pb-3">
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="size-5 text-amber-600" />
              <span>{isBn ? "শাস্ত্রীয় শক্তিসূচক ও জ্যোতিষ পরিচয়" : "Sacred Vedic Shakti & Astrological Identity"}</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              {isBn
                ? "বৈদিক ধর্মশাস্ত্র অনুযায়ী গ্রহ, রাশি, মন্ত্র এবং শক্তিতত্ত্বের বিস্তারিত বিশ্লেষণ।"
                : "Canonical scriptural analysis of planetary resonance, Beej Mantra, and zodiac affinity."}
            </p>
          </div>

          <SacredSpecificationsGrid
            rulingPlanet={product.ruling_planet}
            deity={product.deity}
            crystalType={product.crystal_type}
            beejMantra={product.beej_mantra}
            recommendedRashis={product.recommended_for_rashis}
            productTitle={product.title}
            categorySlug={product.category_slug}
          />
        </section>

        {/* ================================================================= */}
        {/* Middle Section: Detailed Information & Ritual Tabs */}
        {/* ================================================================= */}
        <section className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-8 shadow-xs space-y-6">
          {/* Tabs Navigation */}
          <div className="flex border-b border-stone-200 gap-6 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === "description"
                  ? "border-amber-600 text-amber-900"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              {isBn ? "বিস্তারিত বিবরণ (About Remedy)" : "About Remedy"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("rituals")}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === "rituals"
                  ? "border-amber-600 text-amber-900"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              {isBn ? "ধারণ বিধি ও পবিত্র নিয়ম (Rituals)" : "Wearing Rituals & Guidelines"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("certificate")}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === "certificate"
                  ? "border-amber-600 text-amber-900"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              {isBn ? "ল্যাব সার্টিফিকেট ও বিশুদ্ধতা (Authenticity)" : "Authenticity & Lab Certificate"}
            </button>
          </div>

          {/* Tab 1: Detailed Description */}
          {activeTab === "description" && (
            <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <div className="prose prose-stone max-w-none">
                <p className="whitespace-pre-line font-medium">
                  {product.detailed_description || product.short_description}
                </p>
              </div>

              {/* Core Benefits List */}
              {product.benefits && product.benefits.length > 0 && (
                <div className="rounded-2xl bg-amber-50/50 border border-amber-200/70 p-4 space-y-2.5 mt-4">
                  <h4 className="font-bold text-xs sm:text-sm text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="size-4 text-amber-600" />
                    <span>{isBn ? "প্রধান সুফল ও আধ্যাত্মিক প্রভাব:" : "Key Benefits & Spiritual Influence:"}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {product.benefits.map((b, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-stone-800">
                        <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Rashis */}
              {product.recommended_for_rashis && product.recommended_for_rashis.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-xs text-stone-800">
                    {isBn ? "উপযুক্ত রাশি ও লগ্ন:" : "Recommended for Zodiac Signs:"}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {product.recommended_for_rashis.map((r, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-stone-100 border border-stone-200 px-2.5 py-1 text-xs font-semibold text-stone-700 capitalize"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Wearing Rituals & Guidelines */}
          {activeTab === "rituals" && (
            <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <div className="rounded-2xl bg-stone-50 border border-stone-200 p-4 space-y-3">
                <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <Flame className="size-4 text-amber-700" />
                  <span>{isBn ? "শাস্ত্রীয় ধারণ বিধি ও প্রণালী" : "Canonical Vedic Wearing Method"}</span>
                </h4>
                <p className="text-xs text-stone-600">
                  {product.wear_instructions ||
                    (isBn
                      ? "১. শুভ তিথি বা সোমবার/মঙ্গলবার প্রাতঃকালে স্নান সেরে শুদ্ধ বস্ত্র পরিধান করুন।\n২. গঙ্গাজল অথবা কাঁচা দুধে ধুয়ে শিবলিঙ্গ বা ইষ্টদেবতার চরণে স্পর্শ করান।\n৩. প্রদীপ ও ধূপ জ্বালিয়ে ১০৮ বার বীজ মন্ত্র জপ করে ধারণ করুন।\n৪. রাতে ঘুমানোর সময় বা অপবিত্র স্থানে যাওয়ার সময় খুলে রাখা শ্রেয়।"
                      : "1. Bathe and wear clean clothes on an auspicious morning (Monday/Tuesday).\n2. Purify with Gangajal or raw milk and offer prayers to Lord Shiva or your Ishta Devata.\n3. Chant the Beej Mantra 108 times before wearing.\n4. Store safely in a clean sacred pouch or altar when not in use.")}
                </p>
              </div>

              {/* Cleansing & Purity Maintenance */}
              <div className="rounded-2xl bg-amber-50/60 border border-amber-200 p-4 space-y-2">
                <h5 className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-amber-700" />
                  <span>{isBn ? "প্রতিকার পবিত্র ও জাগ্রত রাখার নিয়ম" : "Maintaining Sacred Purity & Divine Energy"}</span>
                </h5>
                <p className="text-xs text-stone-600">
                  {isBn
                    ? "প্রতি অমাবস্যা ও পূর্ণিমার রাতে প্রতিকারটি পূর্ণিমার চাঁদের আলোয় রেখে দিলে অথবা গঙ্গাজল ও ধূপ-দীপের পবিত্র ধোঁয়ায় স্পর্শ করালে এর নেতিবাচক শক্তি দূর হয় এবং ইতিবাচক তেজ পুনঃস্থাপিত হয়।"
                    : "Place your sacred crystal or rudraksha under overnight Full Moon light or cleanse with Gangajal and sacred incense smoke to dispel stagnant energies and sustain divine resonance."}
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Lab Certificate & Authenticity */}
          {activeTab === "certificate" && (
            <div className="space-y-4 text-xs sm:text-sm text-stone-700">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="size-6 text-emerald-700" />
                  <div>
                    <h4 className="font-bold text-sm text-emerald-950">
                      {product.lab_certificate_name || "Govt. Approved Gemological Laboratory Certified"}
                    </h4>
                    <p className="text-[11px] text-emerald-800">
                      {isBn
                        ? "১০০% খাঁটি ও প্রকৃত আদি উৎস থেকে সংগৃহীত। প্রতিটি সামগ্রী ল্যাবে পরীক্ষিত।"
                        : "100% genuine and verified. Sourced from natural geographical origins."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="rounded-xl bg-white border border-emerald-200 p-3">
                    <p className="text-[10px] text-stone-500 font-semibold">{isBn ? "সার্টিফিকেট স্টেটাস" : "Certificate Status"}</p>
                    <p className="font-extrabold text-emerald-800 text-sm">✓ {isBn ? "প্রমাণিত ও সিলমোহরযুক্ত" : "Certified & Sealed"}</p>
                  </div>
                  <div className="rounded-xl bg-white border border-emerald-200 p-3">
                    <p className="text-[10px] text-stone-500 font-semibold">{isBn ? "পরীক্ষাগার" : "Testing Lab"}</p>
                    <p className="font-bold text-stone-800 text-xs truncate">{product.lab_certificate_name || "Govt. Approved Lab"}</p>
                  </div>
                  <div className="rounded-xl bg-white border border-emerald-200 p-3">
                    <p className="text-[10px] text-stone-500 font-semibold">{isBn ? "প্রাণ-প্রতিষ্ঠা" : "Consecration"}</p>
                    <p className="font-bold text-stone-800 text-xs">{isBn ? "কাশীর পুরোহিত দ্বারা" : "Kashi Ghat Energized"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ================================================================= */}
        {/* DivinLink Sacred Promise Guarantee */}
        {/* ================================================================= */}
        <AstraPromiseSection />

        {/* ================================================================= */}
        {/* Verified Devotee Reviews & Ratings */}
        {/* ================================================================= */}
        <SacredDevoteeReviews product={product} />

        {/* ================================================================= */}
        {/* Related / Recommended Remedies Grid */}
        {/* ================================================================= */}
        {relatedProducts.length > 0 && (
          <section className="space-y-5 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-stone-900">
                  {isBn ? "সম্পর্কিত অন্যান্য বৈদিক প্রতিকার" : "You May Also Benefit From"}
                </h3>
                <p className="text-xs text-stone-500">
                  {isBn
                    ? "একই গ্রহ ও শক্তির সাথে সামঞ্জস্যপূর্ণ প্রাণ-প্রতিষ্ঠিত সামগ্রী।"
                    : "Consecrated remedies aligned with similar spiritual vibrations."}
                </p>
              </div>
              <Link
                href="/shop"
                className="text-xs font-bold text-amber-800 hover:text-amber-900 inline-flex items-center gap-1"
              >
                <span>{isBn ? "সব দেখুন" : "View All"}</span>
                <ChevronRight className="size-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => {
                const relHref = `/shop/products/${encodeURIComponent(p.slug || p.id)}`;
                return (
                  <CardTilt key={p.id} className="h-full">
                    <div className="h-full rounded-3xl border border-stone-200 bg-white p-3.5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group">
                      <div className="space-y-2">
                        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-100">
                          <Link href={relHref}>
                            {p.featured_image ? (
                              <Image
                                src={p.featured_image}
                                alt={p.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                unoptimized
                              />
                            ) : (
                              <div className="size-full flex items-center justify-center text-stone-300">
                                <ShoppingBag className="size-8" />
                              </div>
                            )}
                          </Link>
                          {p.discount_percent > 0 && (
                            <span className="absolute top-2 left-2 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                              {p.discount_percent}% OFF
                            </span>
                          )}
                        </div>

                        <Link
                          href={relHref}
                          className="font-bold text-xs text-stone-900 line-clamp-2 hover:text-amber-700 transition-colors block pt-1"
                        >
                          {p.title}
                        </Link>
                      </div>

                      <div className="pt-2 mt-2 border-t border-stone-100 flex items-center justify-between">
                        <div className="flex items-baseline gap-1">
                          <span className="font-extrabold text-sm text-stone-900">{formatINR(p.sale_price)}</span>
                          {p.mrp > p.sale_price && (
                            <span className="text-[10px] text-stone-400 line-through">{formatINR(p.mrp)}</span>
                          )}
                        </div>
                        <Link
                          href={relHref}
                          className="rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold px-3 py-1 text-[11px] transition-colors"
                        >
                          {isBn ? "দেখুন" : "View"}
                        </Link>
                      </div>
                    </div>
                  </CardTilt>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* =================================================================== */}
      {/* Mobile Sticky Bottom CTA Bar */}
      {/* =================================================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 sm:hidden shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-stone-500 font-medium truncate">{product.title}</p>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-base text-stone-900">{formatINR(salePrice)}</span>
              {mrp > salePrice && (
                <span className="text-xs text-stone-400 line-through">{formatINR(mrp)}</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!product.in_stock}
            className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 text-xs shadow-md transition-colors disabled:opacity-50 shrink-0"
          >
            {isBn ? "এখনই কিনুন" : "Buy Now"}
          </button>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
