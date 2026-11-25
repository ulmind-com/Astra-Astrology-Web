"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Flame,
  Gift,
  Heart,
  Minus,
  Plus,
  RefreshCw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { CashbackConsultationBridge } from "@/components/shop/CashbackConsultationBridge";
import { SacredSpecificationsGrid } from "@/components/shop/SacredSpecificationsGrid";
import { ProductPincodeEstimator } from "@/components/shop/ProductPincodeEstimator";
import { AstraPromiseSection } from "@/components/shop/AstraPromiseSection";
import { SacredDevoteeReviews } from "@/components/shop/SacredDevoteeReviews";
import { CardTilt } from "@/components/ui/card-tilt";
import { DivinLinkQrCard } from "@/components/ui/divinlink-qr-card";
import { type ShopProduct } from "@/lib/api";
import { useCartStore } from "@/lib/stores/use-cart-store";

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

interface DetailProps {
  product: ShopProduct;
  language: string;
  shown: boolean;
  closing: boolean;
  mainHidden: boolean;
  mainRef: React.RefObject<HTMLDivElement | null>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onOpenProduct: (product: ShopProduct, fromEl: HTMLElement) => void;
  relatedProducts?: ShopProduct[];
}

export function ShopProductDetailOverlay({
  product,
  language,
  shown,
  closing,
  mainHidden,
  mainRef,
  scrollRef,
  onClose,
  onOpenProduct,
  relatedProducts = [],
}: DetailProps) {
  const router = useRouter();
  const isBn = language === "bn";
  const { addItem } = useCartStore();

  const [quantity, setQuantity] = React.useState<number>(1);
  const [activeTab, setActiveTab] = React.useState<"description" | "rituals" | "certificate">("description");
  const [selectedImage, setSelectedImage] = React.useState<string>(
    product.featured_image || (product.images && product.images[0]) || ""
  );
  const [isLiked, setIsLiked] = React.useState<boolean>(false);

  // Update selected image when product changes
  React.useEffect(() => {
    setSelectedImage(product.featured_image || (product.images && product.images[0]) || "");
    setQuantity(1);
  }, [product]);

  // Handle ESC key to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Pricing calculations
  const mrp = product.mrp || 0;
  const salePrice = product.sale_price || 0;
  const discountPercent =
    product.discount_percent ||
    (mrp > salePrice ? Math.round(((mrp - salePrice) / mrp) * 100) : 0);
  const savings = mrp > salePrice ? mrp - salePrice : 0;
  const freeGiftBadge = product.free_gift_badge || "";
  const effectiveCashback = product.cashback_percent ?? 100;

  // Gallery images list
  const allImages = React.useMemo(() => {
    const list = product.images && product.images.length > 0 ? [...product.images] : [];
    if (product.featured_image && !list.includes(product.featured_image)) {
      list.unshift(product.featured_image);
    }
    return list.length > 0 ? list : [product.featured_image || "/images/banners/banner-zodiac.jpg"];
  }, [product]);

  // Add to cart handler
  const handleAddToCart = () => {
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
    addItem(product, quantity);
    router.push("/shop/checkout");
  };

  // Share handler
  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/shop/products/${encodeURIComponent(product.slug || product.id)}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.short_description || "Check out this consecrated Vedic remedy at DivinLink!",
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

  let d = 0;
  const rise = () => ({ "--d": d++ }) as React.CSSProperties;

  return (
    <div
      ref={scrollRef}
      className={`dl-shop-overlay${shown ? " is-open" : ""}${closing ? " is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={product.title}
    >
      <div className="dl-shop-overlay-inner">
        {/* Top Control Bar: Breadcrumbs on Left, Close & Share on Right */}
        <div className="flex items-center justify-between gap-4 mb-6 dl-rise" style={rise()}>
          <nav className="dl-shop-crumbs mb-0" aria-label="Breadcrumb">
            <button type="button" onClick={onClose} className="hover:text-amber-800 transition-colors">
              {isBn ? "শপ" : "Shop"}
            </button>
            <ChevronRight size={13} strokeWidth={2} className="text-stone-400" />
            {product.category_slug && (
              <>
                <button type="button" onClick={onClose} className="hover:text-amber-800 transition-colors capitalize">
                  {product.category_slug.replace(/-/g, " ")}
                </button>
                <ChevronRight size={13} strokeWidth={2} className="text-stone-400" />
              </>
            )}
            <span className="is-current">{product.title}</span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Share Product"
            >
              <Share2 className="size-3.5" />
              <span className="hidden sm:inline">{isBn ? "শেয়ার" : "Share"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-stone-900 text-white hover:bg-stone-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              aria-label="Close detail view"
            >
              <X className="size-4" />
              <span className="hidden sm:inline">{isBn ? "বন্ধ করুন" : "Close"}</span>
              <kbd className="hidden md:inline-block text-[10px] bg-white/20 px-1 rounded font-mono">Esc</kbd>
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* Two-Column Grid: Left Gallery + Right Info Box                    */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ================= Left: Target Photo & Gallery ================= */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Animated Photo Target */}
            <div
              ref={mainRef}
              className={`dl-shop-main-photo${mainHidden ? " is-hidden" : ""}`}
              style={{ backgroundImage: `url(${selectedImage})` }}
            >
              {/* Badges Over Photo */}
              <div className="absolute top-3 left-3 flex flex-col gap-1 items-start pointer-events-none">
                {discountPercent > 0 && (
                  <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-md shadow-xs">
                    {discountPercent}% OFF
                  </span>
                )}
                <span className="inline-flex items-center gap-1 bg-emerald-700 text-emerald-100 text-[10px] font-black px-2.5 py-0.5 rounded-md shadow-xs">
                  <Sparkles className="size-3 text-amber-300" />
                  <span>100% Cashback</span>
                </span>
              </div>

              {/* Heart/Wishlist Button */}
              <button
                type="button"
                onClick={() => setIsLiked(!isLiked)}
                className={`absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-xs border border-stone-200 shadow-sm transition-transform active:scale-90 cursor-pointer ${
                  isLiked ? "text-rose-600" : "text-stone-700 hover:text-rose-600"
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`size-4.5 ${isLiked ? "fill-rose-600" : ""}`} />
              </button>
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="dl-shop-gallery dl-rise" style={rise()}>
                {allImages.map((src, i) => (
                  <div
                    key={src + i}
                    className={`dl-shop-gallery-thumb${selectedImage === src ? " is-active" : ""}`}
                    style={{ backgroundImage: `url(${src})` }}
                    onClick={() => setSelectedImage(src)}
                  />
                ))}
              </div>
            )}

            {/* Trust Guarantee Micro-Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 dl-rise" style={rise()}>
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

            {/* QR Code Authenticity Card */}
            <DivinLinkQrCard
              className="dl-rise"
              style={rise()}
              title={isBn ? "QR কোড দিয়ে আসল প্রতিকার যাচাই" : "Scan QR for 100% Authenticity"}
              badgeText={isBn ? "ল্যাব ভেরিফায়েড" : "Lab Verified"}
              description={
                isBn
                  ? "প্রতিটি পার্সেলের বাক্সে থাকবে সরকারি ল্যাব সার্টিফাইড হলোগ্রাফিক কিউআর কোড সিলমোহর।"
                  : "Each parcel comes with a govt-approved lab certified holographic tamper-evident seal."
              }
              metaText={`${isBn ? "সার্টিফিকেট আইডি:" : "Cert ID:"} #${product.sku || "ASTR-7089"} • ${isBn ? "কাশীর প্রাণ-প্রতিষ্ঠা" : "Kashi Energized"}`}
            />
          </div>

          {/* ================= Right: Product Details & Purchase ================= */}
          <div className="lg:col-span-6 space-y-4">
            {/* Rating & SKU Header */}
            <div className="flex items-center justify-between gap-2 flex-wrap dl-rise" style={rise()}>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-900">
                <Star className="size-3.5 fill-amber-500 text-amber-500" />
                <span>{(product.average_rating || 5.0).toFixed(1)}</span>
                <span className="text-stone-400 font-normal">|</span>
                <span className="text-stone-600 font-medium">
                  {product.review_count || 128} {isBn ? "ভক্ত রিভিউ" : "reviews"}
                </span>
              </div>
              <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-md">
                SKU: {product.sku}
              </span>
            </div>

            {/* Product Title */}
            <div className="space-y-1.5 dl-rise" style={rise()}>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 leading-tight">
                {product.title}
              </h1>
              {product.short_description && (
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                  {product.short_description}
                </p>
              )}
            </div>

            {/* Price Box */}
            <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/70 via-stone-50 to-white p-3.5 sm:p-4 space-y-2 dl-rise" style={rise()}>
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

            {/* Purchase Action Box */}
            <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-50/20 p-4 space-y-3.5 shadow-xs dl-rise" style={rise()}>
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

              {/* Pincode Delivery Estimator */}
              <ProductPincodeEstimator
                salePrice={salePrice}
                cashbackPercent={effectiveCashback}
                freeGiftTitle={product.free_gift_title}
                freeGiftValue={product.free_gift_value}
              />
            </div>

            {/* Canonical Vedic Specifications Grid */}
            <div className="dl-rise" style={rise()}>
              <SacredSpecificationsGrid
                rulingPlanet={product.ruling_planet}
                deity={product.deity}
                crystalType={product.crystal_type}
                beejMantra={product.beej_mantra}
                recommendedRashis={product.recommended_for_rashis}
                productTitle={product.title}
                categorySlug={product.category_slug}
              />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* Full-Width Section: 100% Wallet Cashback to Astrologer Bridge     */}
        {/* ================================================================= */}
        <div className="dl-rise mt-8" style={rise()}>
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

        {/* ================================================================= */}
        {/* Middle Section: Detailed Information & Ritual Tabs                */}
        {/* ================================================================= */}
        <section className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-8 shadow-xs space-y-6 dl-rise mt-8" style={rise()}>
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

          {activeTab === "description" && (
            <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <div className="prose prose-stone max-w-none">
                <p className="whitespace-pre-line font-medium">
                  {product.detailed_description || product.short_description}
                </p>
              </div>

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
            </div>
          )}

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
            </div>
          )}

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
              </div>
            </div>
          )}
        </section>

        {/* ================================================================= */}
        {/* DivinLink Sacred Promise Guarantee                                */}
        {/* ================================================================= */}
        <div className="dl-rise mt-8" style={rise()}>
          <AstraPromiseSection />
        </div>

        {/* ================================================================= */}
        {/* Verified Devotee Reviews & Ratings                                */}
        {/* ================================================================= */}
        <div className="dl-rise mt-8" style={rise()}>
          <SacredDevoteeReviews product={product} />
        </div>

        {/* ================================================================= */}
        {/* Related / Recommended Remedies Grid                               */}
        {/* ================================================================= */}
        {relatedProducts.length > 0 && (
          <section className="space-y-5 pt-8 border-t border-stone-200/80 dl-rise mt-8" style={rise()}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg sm:text-2xl font-bold text-stone-900">
                  {isBn ? "সম্পর্কিত অন্যান্য বৈদিক প্রতিকার" : "You May Also Benefit From"}
                </h3>
                <p className="text-xs text-stone-500">
                  {isBn
                    ? "একই গ্রহ ও শক্তির সাথে সামঞ্জস্যপূর্ণ প্রাণ-প্রতিষ্ঠিত সামগ্রী।"
                    : "Consecrated remedies aligned with similar spiritual vibrations."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => {
                const discount = p.discount_percent || (p.mrp > p.sale_price ? Math.round(((p.mrp - p.sale_price) / p.mrp) * 100) : 0);
                return (
                  <CardTilt key={p.id} className="h-full">
                    <div
                      onClick={(e) => onOpenProduct(p, e.currentTarget)}
                      className="h-full rounded-2xl border border-stone-200 bg-white p-3.5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                    >
                      <div className="space-y-2">
                        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-100">
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
                          {discount > 0 && (
                            <span className="absolute top-2 left-2 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                              {discount}% OFF
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-xs text-stone-900 line-clamp-2 hover:text-amber-700 transition-colors pt-1">
                          {p.title}
                        </h4>
                      </div>

                      <div className="pt-2 mt-2 border-t border-stone-100 flex items-center justify-between">
                        <div className="flex items-baseline gap-1">
                          <span className="font-extrabold text-sm text-stone-900">{formatINR(p.sale_price)}</span>
                          {p.mrp > p.sale_price && (
                            <span className="text-[10px] text-stone-400 line-through">{formatINR(p.mrp)}</span>
                          )}
                        </div>
                        <span className="rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold px-3 py-1 text-[11px] transition-colors">
                          {isBn ? "দেখুন" : "View"}
                        </span>
                      </div>
                    </div>
                  </CardTilt>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
