"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  ShieldCheck,
  Flame,
  ArrowRight,
  Gift,
  Coins,
  CheckCircle2,
  Lock,
  Tag,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { shopApi } from "@/lib/api";
import { useCartStore } from "@/lib/stores/use-cart-store";
import { useLanguage } from "@/providers/language-provider";
import { CouponOfferSelector } from "@/components/shop/CouponOfferSelector";

export function CartDrawer() {
  const router = useRouter();
  const { language } = useLanguage();
  const [mounted, setMounted] = React.useState(false);

  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getCashbackCoins,
    couponCode,
    discountAmount,
    setCoupon,
  } = useCartStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when cart is open
  React.useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeCart]);

  const subtotal = getSubtotal();
  // Store settings drive shipping + the threshold-based complimentary gift (no hardcoded promo).
  const { data: shopSettings } = useQuery({
    queryKey: ["shop_public_banners"],
    queryFn: () => shopApi.getBanners(),
    staleTime: 5 * 60 * 1000,
  });
  const freeShippingThreshold = shopSettings?.free_shipping_threshold ?? 499;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const cashbackCoins = getCashbackCoins();
  const isFreeShipping = subtotal >= freeShippingThreshold || items.length === 0;
  const shippingFee = isFreeShipping ? 0 : 70;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleProceedToCheckout = () => {
    closeCart();
    router.push("/shop/checkout");
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Right-Side Luxury Slide-Over Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative z-10 flex h-full w-full max-w-full sm:max-w-[460px] flex-col bg-[#fffdf9] text-stone-900 shadow-[-16px_0_48px_rgba(26,18,8,0.28)] border-l border-amber-900/10 focus:outline-none"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Cart"
          >
            {/* ================= Header ================= */}
            <div className="flex items-center justify-between border-b border-amber-900/10 bg-white/95 px-5 py-4 backdrop-blur-xs shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 shadow-sm">
                  <ShoppingBag className="size-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-base font-bold text-stone-950">
                      {language === "bn"
                        ? "আপনার শপিং কার্ট"
                        : language === "hi"
                        ? "आपकी शॉपिंग कार्ट"
                        : "AstroStore Cart"}
                    </h2>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-extrabold text-amber-900 border border-amber-300/60">
                      {items.reduce((acc, i) => acc + i.quantity, 0)}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-medium">
                    {language === "bn"
                      ? "কাশীর পণ্ডিতদের দ্বারা সিদ্ধ প্রতিকার"
                      : "Siddh & Energized Vedic Remedies"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeCart}
                className="flex size-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 hover:border-amber-400 hover:bg-amber-50 hover:text-stone-900 transition-colors cursor-pointer"
                aria-label="Close Cart"
              >
                <X className="size-4.5" />
              </button>
            </div>

            {/* ================= Unified Free Shipping & Rewards Strip ================= */}
            <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-orange-500/15 border-b border-amber-500/20 px-5 py-3 shrink-0">
              <div className="flex items-center justify-between text-xs font-semibold text-amber-950 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="size-4 text-amber-700 shrink-0" />
                  <span>
                    {remainingForFreeShipping > 0
                      ? language === "bn"
                        ? `আর ₹${remainingForFreeShipping} যোগ করলেই ফ্রি ডেলিভারি!`
                        : `Add ₹${remainingForFreeShipping} more for FREE Express Delivery!`
                      : language === "bn"
                      ? "🎉 ফ্রি এক্সপ্রেস ডেলিভারি আনলক হয়েছে!"
                      : "🎉 Free Express Delivery Unlocked!"}
                  </span>
                </span>
                <span className="text-[11px] font-extrabold text-amber-800">{progressPercent}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-amber-200/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {cashbackCoins > 0 && (
                <div className="mt-2 flex items-center justify-between rounded-lg bg-emerald-600/10 px-2.5 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-500/20">
                  <span className="flex items-center gap-1.5">
                    <Coins className="size-3.5 text-amber-600 shrink-0" />
                    <span>
                      {language === "bn"
                        ? `১০০% ক্যাশব্যাক: ₹${subtotal} কয়েন ওয়ালেটে জমা হবে`
                        : `100% Cashback: ₹${subtotal} Coins back to wallet`}
                    </span>
                  </span>
                  <span className="uppercase text-[9px] tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-extrabold">
                    Prepaid
                  </span>
                </div>
              )}
            </div>

            {/* ================= Cart Items List ================= */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-16 text-center space-y-4">
                  <div className="flex size-20 items-center justify-center rounded-2xl bg-amber-100/70 text-amber-700 shadow-inner">
                    <ShoppingBag className="size-9 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display text-base font-bold text-stone-900">
                      {language === "bn" ? "কার্টটি বর্তমানে খালি" : "Your cart is empty"}
                    </h3>
                    <p className="max-w-[260px] text-xs text-stone-500 leading-relaxed">
                      {language === "bn"
                        ? "পবিত্র রুদ্রাক্ষ, বৈদিক রত্ন বা ক্রিস্টাল ব্রেসলেট বেছে নিয়ে আপনার জীবনের গ্রহপীড়া প্রশমন করুন।"
                        : "Discover authentic Siddh Rudraksha, Certified Gemstones & Pyrite to attract peace and abundance."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:from-amber-600 hover:to-amber-700 transition-all cursor-pointer"
                  >
                    <span>{language === "bn" ? "প্রতিকার দেখুন" : "Explore Sacred Remedies"}</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const discountPercent =
                    item.mrp > item.price ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0;

                  return (
                    <div
                      key={item.id}
                      className="group relative flex gap-3.5 rounded-2xl border border-stone-200/90 bg-white p-3.5 shadow-2xs hover:border-amber-300/80 transition-colors"
                    >
                      {/* Product Thumbnail */}
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-stone-100 bg-stone-50">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            unoptimized
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-stone-400">
                            <ShoppingBag className="size-6" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex flex-1 min-w-0 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1.5">
                            <Link
                              href={`/shop/products/${item.slug}`}
                              onClick={closeCart}
                              className="font-bold text-xs text-stone-900 leading-snug line-clamp-2 hover:text-amber-700 transition-colors"
                            >
                              {item.title}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="rounded-lg p-1 text-stone-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                              title="Remove item"
                              aria-label="Remove item"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>

                          {/* Price & Savings */}
                          <div className="mt-1 flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-sm text-stone-950">
                              ₹{item.price.toLocaleString("en-IN")}
                            </span>
                            {item.mrp > item.price && (
                              <span className="text-xs text-stone-400 line-through">
                                ₹{item.mrp.toLocaleString("en-IN")}
                              </span>
                            )}
                            {discountPercent > 0 && (
                              <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                                {discountPercent}% OFF
                              </span>
                            )}
                          </div>

                          {/* Sankalpa Indicator */}
                          {item.sankalpa?.devotee_name && (
                            <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-emerald-800">
                              <Flame className="size-3 text-amber-500 fill-current shrink-0" />
                              <span className="truncate">
                                Sankalp: {item.sankalpa.devotee_name} ({item.sankalpa.gotra || "Kashyap"})
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Bottom Stepper Row */}
                        <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-stone-100">
                          <span className="text-[11px] text-stone-500 font-medium">Quantity:</span>
                          <div className="flex items-center rounded-lg border border-stone-200 bg-stone-50 p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="flex size-6 items-center justify-center rounded text-stone-600 hover:bg-white hover:text-stone-950 transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-stone-950">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex size-6 items-center justify-center rounded text-stone-600 hover:bg-white hover:text-stone-950 transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* ================= Footer & Checkout Area ================= */}
            {items.length > 0 && (
              <div className="border-t border-amber-900/10 bg-white p-5 space-y-3.5 shrink-0 shadow-[0_-8px_24px_rgba(26,18,8,0.06)]">
                {/* Smart Best-Offer Coupon Selector */}
                <CouponOfferSelector
                  subtotal={subtotal}
                  appliedCouponCode={couponCode}
                  appliedDiscount={discountAmount}
                  onApplyCoupon={(code, disc) => setCoupon(code, disc)}
                  onRemoveCoupon={() => {
                    setCoupon(null, 0);
                    toast.info(language === "bn" ? "কুপন সরানো হয়েছে" : "Coupon removed");
                  }}
                  compact={true}
                />

                {/* Price Breakdown */}
                <div className="space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-950">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Coupon Discount</span>
                      <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Express Shipping</span>
                    <span>
                      {isFreeShipping ? (
                        <span className="font-bold text-emerald-600">FREE</span>
                      ) : (
                        <span className="font-semibold text-stone-950">₹70</span>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-amber-800 font-semibold">
                    <span className="flex items-center gap-1">
                      <Coins className="size-3.5 text-amber-600" />
                      <span>100% Coins Cashback</span>
                    </span>
                    <span className="font-bold text-amber-900">+{cashbackCoins} Coins</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-2.5 border-t border-stone-200 text-stone-950">
                    <span className="text-sm font-bold">Grand Total</span>
                    <span className="font-display text-lg font-extrabold text-amber-800">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 py-3.5 px-4 text-stone-950 font-bold text-sm shadow-[0_6px_20px_-3px_rgba(245,158,11,0.5)] hover:shadow-[0_8px_25px_-3px_rgba(245,158,11,0.7)] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <Lock className="size-4 text-stone-900" />
                  <span>
                    {language === "bn"
                      ? "নিরাপদ চেকআউটে এগিয়ে যান"
                      : language === "hi"
                      ? "सुरक्षित चेकआउट पर जाएं"
                      : "Proceed to Secure Checkout"}
                  </span>
                  <ArrowRight className="size-4 stroke-[2.2] transition-transform group-hover:translate-x-1" />
                </button>

                {/* Trust Badges Row */}
                <div className="flex items-center justify-center gap-3 text-[10px] text-stone-500 font-semibold pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="size-3.5 text-emerald-600" /> 100% Authentic
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Flame className="size-3.5 text-amber-600" /> Vedic Energized
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Coins className="size-3.5 text-amber-600" /> 100% Cashback
                  </span>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
