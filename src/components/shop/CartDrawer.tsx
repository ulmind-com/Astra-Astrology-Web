"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { toast } from "sonner";
import { Drawer } from "vaul";
import { useCartStore } from "@/lib/stores/use-cart-store";
import { useLanguage } from "@/providers/language-provider";

export function CartDrawer() {
  const router = useRouter();
  const { language } = useLanguage();
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getCashbackCoins,
    getBundledGifts,
    couponCode,
    discountAmount,
    setCoupon,
  } = useCartStore();

  const [couponInput, setCouponInput] = React.useState("");
  const subtotal = getSubtotal();
  const freeShippingThreshold = 499;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const cashbackCoins = getCashbackCoins();
  const bundledGifts = getBundledGifts();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (code === "ASTRA100" || code === "ASTRO10") {
      const disc = Math.round(subtotal * 0.1);
      setCoupon(code, disc);
      toast.success(`Coupon ${code} applied! ₹${disc} discount added.`);
    } else {
      toast.error("Invalid or expired coupon code.");
    }
    setCouponInput("");
  };

  const handleProceedToCheckout = () => {
    closeCart();
    router.push("/shop/checkout");
  };

  if (!isOpen) return null;

  const renderContent = () => (
    <div className="flex flex-col h-full justify-between overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-amber-900/10 bg-white/90 backdrop-blur-xs flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-700">
            <ShoppingBag className="size-5" />
          </div>
          <div>
            <h3 className="font-cinzel font-bold text-base text-stone-900">
              {language === "bn" ? "আপনার শপিং কার্ট" : "Your AstroStore Cart"}
            </h3>
            <span className="text-xs text-stone-500 font-medium">
              {items.length} {items.length === 1 ? "remedy" : "remedies"} selected
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={closeCart}
          className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Free Shipping & Gift Progress Bar */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-orange-500/15 p-3.5 border-b border-amber-500/20 shrink-0">
        <div className="flex items-center justify-between text-xs font-semibold text-amber-950 mb-1.5">
          <span className="flex items-center gap-1.5">
            <Gift className="size-4 text-amber-600" />
            {remainingForFreeShipping > 0
              ? language === "bn"
                ? `আর ₹${remainingForFreeShipping} যোগ করলেই ফ্রি ডেলিভারি!`
                : `Add ₹${remainingForFreeShipping} more for FREE Delivery!`
              : language === "bn"
              ? "🎉 অভিনন্দন! আপনি ফ্রি এক্সপ্রেস ডেলিভারি আনলক করেছেন!"
              : "🎉 Free Express Delivery Unlocked!"}
          </span>
          <span className="text-amber-800 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full bg-amber-200/50 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 100% Wallet Cashback Notification Strip */}
      {cashbackCoins > 0 && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-2.5 text-white flex items-center justify-between text-xs font-semibold shadow-xs shrink-0">
          <span className="flex items-center gap-1.5">
            <Coins className="size-4 text-amber-300 animate-bounce" />
            <span>
              {language === "bn"
                ? `১০০% ক্যাশব্যাক: ₹${subtotal} কয়েন ওয়ালেটে জমা হবে!`
                : `100% Cashback: Earn ${cashbackCoins} Coins in Astra Wallet!`}
            </span>
          </span>
          <span className="bg-white/20 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Prepaid
          </span>
        </div>
      )}

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {items.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="size-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto text-amber-700">
              <ShoppingBag className="size-8" />
            </div>
            <h4 className="font-cinzel font-bold text-stone-800 text-base">
              {language === "bn" ? "কার্টটি বর্তমানে খালি" : "Your cart is currently empty"}
            </h4>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              {language === "bn"
                ? "পবিত্র রুদ্রাক্ষ, বৈদিক রত্ন বা ক্রিস্টাল ব্রেসলেট বেছে নিয়ে আপনার জীবনের গ্রহপীড়া প্রশমন করুন।"
                : "Explore authentic Siddh Rudraksha, Certified Gemstones & Pyrite to attract wealth & peace."}
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors cursor-pointer"
            >
              <span>{language === "bn" ? "প্রতিকার দেখুন" : "Explore Remedies"}</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-stone-200 bg-white p-3.5 shadow-2xs space-y-3 relative group"
            >
              <div className="flex gap-3">
                {/* Thumbnail */}
                <div className="relative size-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-100 shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center text-stone-400">
                      <ShoppingBag className="size-6" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/shop/products/${item.slug}`}
                      onClick={closeCart}
                      className="font-bold text-xs text-stone-900 line-clamp-2 hover:text-amber-700 transition-colors"
                    >
                      {item.title}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="font-extrabold text-sm text-stone-900">
                      ₹{item.price.toLocaleString("en-IN")}
                    </span>
                    {item.mrp > item.price && (
                      <span className="text-xs text-stone-400 line-through">
                        ₹{item.mrp.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  {/* Free Gift Badge on Item */}
                  {item.free_gift_title && (
                    <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-md px-2 py-0.5 text-[10px] font-bold">
                      <Gift className="size-3 text-amber-600 shrink-0" />
                      <span className="truncate">{item.free_gift_badge || `Includes ${item.free_gift_title}`}</span>
                    </div>
                  )}

                  {/* Sankalpa Indicator */}
                  {item.sankalpa?.devotee_name && (
                    <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Flame className="size-3 text-amber-500 fill-current" />
                      <span>
                        Sankalp: {item.sankalpa.devotee_name} ({item.sankalpa.gotra || "Kashyap"})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                <span className="text-stone-500 font-medium">Quantity:</span>
                <div className="flex items-center gap-2 border border-stone-200 rounded-lg bg-stone-50 p-0.5">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:bg-white rounded text-stone-600 transition-colors cursor-pointer"
                  >
                    <Minus className="size-3" />
                  </button>
                  <span className="w-6 text-center font-bold text-stone-900 text-xs">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-white rounded text-stone-600 transition-colors cursor-pointer"
                  >
                    <Plus className="size-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Free Bundled Gifts Showcase Strip */}
        {bundledGifts.length > 0 && (
          <div className="rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
              <Gift className="size-4 text-amber-600" />
              <span>Free Vedic Gifts Added to Your Order:</span>
            </div>
            {bundledGifts.map((gift, gIdx) => (
              <div key={gIdx} className="flex items-center justify-between text-xs bg-white/80 p-2 rounded-xl border border-amber-200">
                <span className="font-semibold text-stone-800">{gift.title}</span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  FREE (Worth ₹{gift.value})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer & Checkout Area */}
      {items.length > 0 && (
        <div className="p-4 sm:p-5 bg-white border-t border-amber-900/10 space-y-3.5 shrink-0 shadow-lg">
          {/* Coupon Code Input */}
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Coupon (e.g. ASTRA100)"
              className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs uppercase font-semibold placeholder:normal-case placeholder:font-normal focus:outline-none focus:border-amber-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Apply
            </button>
          </form>

          {couponCode && (
            <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
              <span className="font-semibold flex items-center gap-1">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                Coupon {couponCode} Applied
              </span>
              <span className="font-bold">-₹{discountAmount}</span>
            </div>
          )}

          {/* Pricing Summary */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-stone-900">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount:</span>
                <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Estimated Shipping:</span>
              <span className="font-semibold text-stone-900">
                {subtotal >= freeShippingThreshold ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  "₹70"
                )}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-100">
              <span>Grand Total:</span>
              <span className="text-amber-700">
                ₹{(subtotal - discountAmount + (subtotal >= freeShippingThreshold ? 0 : 70)).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Checkout CTA Button */}
          <button
            type="button"
            onClick={handleProceedToCheckout}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white font-bold text-sm shadow-md hover:from-amber-700 hover:to-amber-900 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Lock className="size-4 text-amber-200" />
            <span>
              {language === "bn" ? "নিরাপদ চেকআউটে এগিয়ে যান" : "Proceed to Secure Checkout"}
            </span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center justify-center gap-3 text-[10px] text-stone-500 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-emerald-600" /> 100% Authentic
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Flame className="size-3.5 text-amber-600" /> Vedic Energized
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Coins className="size-3.5 text-amber-600" /> 100% Wallet Cashback
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Vaul Drawer with native swipe-down spring physics */}
      <div className="md:hidden">
        <Drawer.Root open={isOpen} onOpenChange={(open) => !open && closeCart()}>
          <Drawer.Portal>
            <Drawer.Overlay
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
              onClick={closeCart}
            />
            <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92vh] flex-col rounded-t-[28px] bg-[#faf7f2] focus:outline-none border-t border-amber-900/10 shadow-2xl">
              <Drawer.Title className="sr-only">AstroStore Shopping Cart</Drawer.Title>
              <Drawer.Description className="sr-only">Items in your cart</Drawer.Description>
              <Drawer.Handle className="my-2.5 mx-auto h-1.5 w-12 rounded-full bg-stone-300 shrink-0" />
              <div className="flex-1 overflow-hidden flex flex-col">
                {renderContent()}
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>

      {/* Desktop Slide-Over Side Drawer */}
      <div className="hidden md:block">
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={closeCart}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#faf7f2] text-stone-900 shadow-2xl flex flex-col justify-between border-l border-amber-900/10 animate-in slide-in-from-right duration-300">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
