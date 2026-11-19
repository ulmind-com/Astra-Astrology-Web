"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Ticket,
  Sparkles,
  CheckCircle2,
  Tag,
  Copy,
  ChevronDown,
  ChevronUp,
  X,
  ArrowRight,
  Gift,
  Clock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { shopApi, type ShopCouponRecommendation } from "@/lib/api";
import { useLanguage } from "@/providers/language-provider";

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

interface CouponOfferSelectorProps {
  subtotal: number;
  appliedCouponCode: string | null;
  appliedDiscount: number;
  onApplyCoupon: (code: string, discount: number, message?: string) => void;
  onRemoveCoupon: () => void;
  compact?: boolean;
}

export function CouponOfferSelector({
  subtotal,
  appliedCouponCode,
  appliedDiscount,
  onApplyCoupon,
  onRemoveCoupon,
  compact = false,
}: CouponOfferSelectorProps) {
  const { language } = useLanguage();
  const isBn = language === "bn";

  const [inputCode, setInputCode] = React.useState("");
  const [isValidating, setIsValidating] = React.useState(false);
  const [showAllOffers, setShowAllOffers] = React.useState(false);

  // Fetch smart recommended coupons for current cart subtotal
  const { data: recData, isLoading: recLoading } = useQuery({
    queryKey: ["shop_coupon_recommendations", subtotal],
    queryFn: async () => {
      if (subtotal <= 0) return null;
      try {
        const res = await shopApi.getCouponRecommendations(subtotal);
        return res;
      } catch {
        return null;
      }
    },
    enabled: subtotal > 0,
    staleTime: 60 * 1000,
  });

  const recommendations = recData?.items || [];
  const bestCouponCode = recData?.best_coupon_code;

  // Handle manual input apply
  const handleManualApply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = inputCode.trim().toUpperCase();
    if (!code) {
      toast.error(isBn ? "অনুগ্রহ করে একটি কুপন কোড লিখুন" : "Please enter a coupon code");
      return;
    }

    setIsValidating(true);
    try {
      const res = await shopApi.validateCoupon(code, subtotal);
      if (res.is_valid && res.discount_amount > 0) {
        onApplyCoupon(res.code, res.discount_amount, res.message);
        toast.success(
          res.message ||
            (isBn
              ? `কুপন '${res.code}' সফলভাবে প্রয়োগ হয়েছে! ₹${res.discount_amount} ছাড় পেয়েছেন।`
              : `Coupon '${res.code}' applied! ₹${res.discount_amount} saved.`)
        );
        setInputCode("");
      } else {
        toast.error(res.message || (isBn ? "কুপনটি সঠিক নয়।" : "Invalid coupon code."));
      }
    } catch (err: any) {
      const msg = err?.message || (isBn ? "কুপন যাচাই করা সম্ভব হয়নি।" : "Failed to validate coupon.");
      toast.error(msg);
    } finally {
      setIsValidating(false);
    }
  };

  // Handle 1-click apply from recommendation card
  const handleSelectRecommendation = (coupon: ShopCouponRecommendation) => {
    if (!coupon.is_applicable) {
      if (coupon.reason_if_inapplicable) {
        toast.error(coupon.reason_if_inapplicable);
      }
      return;
    }
    onApplyCoupon(
      coupon.code,
      coupon.discount_amount,
      isBn
        ? `কুপন '${coupon.code}' সফলভাবে প্রয়োগ হয়েছে! ₹${coupon.discount_amount} ছাড় পেয়েছেন।`
        : `Coupon '${coupon.code}' applied! You saved ₹${coupon.discount_amount}.`
    );
    toast.success(
      isBn
        ? `কুপন '${coupon.code}' প্রয়োগ করা হয়েছে! (সাশ্রয়: ₹${coupon.discount_amount})`
        : `Applied '${coupon.code}'! Saved ₹${coupon.discount_amount}`
    );
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(isBn ? "কোড কপি করা হয়েছে!" : "Code copied!");
  };

  return (
    <div className="space-y-3">
      {/* 1. Applied Coupon Card (If active) */}
      {appliedCouponCode && appliedDiscount > 0 ? (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50/80 p-3 flex items-center justify-between gap-3 shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <CheckCircle2 className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-black text-emerald-950 tracking-wider">
                  {appliedCouponCode}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900">
                  {isBn ? "প্রযুক্ত" : "APPLIED"}
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 font-medium">
                {isBn
                  ? `আপনি এই অর্ডারে ${formatINR(appliedDiscount)} ছাড় পেয়েছেন!`
                  : `You are saving ${formatINR(appliedDiscount)} on this order!`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRemoveCoupon}
            className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 rounded-md hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
          >
            {isBn ? "বাতিল করুন" : "Remove"}
          </button>
        </div>
      ) : (
        /* 2. Manual Coupon Input Box */
        <form onSubmit={handleManualApply} className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-stone-400" />
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder={isBn ? "কুপন বা প্রোমো কোড লিখুন..." : "Enter promo or coupon code..."}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono uppercase bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={isValidating || !inputCode.trim()}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1"
          >
            {isValidating ? (
              <>
                <Loader2 className="size-3 animate-spin" />
                <span>{isBn ? "যাচাই হচ্ছে..." : "Applying..."}</span>
              </>
            ) : (
              <span>{isBn ? "প্রয়োগ করুন" : "Apply"}</span>
            )}
          </button>
        </form>
      )}

      {/* 3. Smart Recommended Offers Section */}
      {recommendations.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
              <Sparkles className="size-3.5 text-amber-600" />
              <span>{isBn ? "সেরা উপলব্ধ অফারসমূহ:" : "Available Offers for Your Cart:"}</span>
            </span>

            {recommendations.length > 2 && (
              <button
                type="button"
                onClick={() => setShowAllOffers(!showAllOffers)}
                className="text-[10px] text-amber-800 hover:text-amber-950 font-bold flex items-center gap-0.5 cursor-pointer"
              >
                <span>
                  {showAllOffers
                    ? isBn
                      ? "কম দেখুন"
                      : "Show less"
                    : isBn
                    ? `আরও দেখুন (${recommendations.length})`
                    : `View all (${recommendations.length})`}
                </span>
                {showAllOffers ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
              </button>
            )}
          </div>

          <div className="space-y-2">
            {(showAllOffers ? recommendations : recommendations.slice(0, 2)).map((coupon) => {
              const isApplied = appliedCouponCode === coupon.code;
              const isBest = coupon.is_best_offer;
              const remainingToUnlock =
                coupon.min_order_amount > subtotal ? coupon.min_order_amount - subtotal : 0;

              return (
                <div
                  key={coupon.code}
                  className={`relative rounded-xl border p-3 transition-all ${
                    isApplied
                      ? "border-emerald-400 bg-emerald-50/50"
                      : isBest
                      ? "border-amber-300 bg-linear-to-r from-amber-50/80 via-white to-amber-50/30 shadow-2xs"
                      : "border-stone-200 bg-white hover:border-amber-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      {/* Badge Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-xs font-black text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200">
                          {coupon.code}
                        </span>

                        {isBest && (
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-2xs">
                            🌟 {isBn ? "সর্বোচ্চ সাশ্রয়" : "Best Value"}
                          </span>
                        )}

                        {coupon.is_first_order_deal && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                            🎁 {isBn ? "প্রথম অর্ডার অফার" : "1st Order Only"}
                          </span>
                        )}
                      </div>

                      <h5 className="font-bold text-xs text-stone-900 leading-snug">
                        {coupon.title}
                      </h5>

                      {coupon.description && (
                        <p className="text-[10px] text-stone-500 line-clamp-1 italic">
                          {coupon.description}
                        </p>
                      )}

                      {/* Applicable savings vs Locked condition */}
                      {coupon.is_applicable && coupon.discount_amount > 0 ? (
                        <p className="text-[11px] font-bold text-emerald-700">
                          {isBn
                            ? `এই কুপনে আপনার ${formatINR(coupon.discount_amount)} সাশ্রয় হবে!`
                            : `Save ${formatINR(coupon.discount_amount)} on this order!`}
                        </p>
                      ) : remainingToUnlock > 0 ? (
                        <p className="text-[10px] text-amber-800 font-medium">
                          {isBn
                            ? `আর মাত্র ${formatINR(remainingToUnlock)} এর সামগ্রী যোগ করলেই এই অফারটি আনলক হবে!`
                            : `Add ${formatINR(remainingToUnlock)} more to unlock this deal!`}
                        </p>
                      ) : (
                        coupon.reason_if_inapplicable && (
                          <p className="text-[10px] text-stone-400">
                            {coupon.reason_if_inapplicable}
                          </p>
                        )
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 pt-0.5">
                      {isApplied ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="size-3" />
                          <span>{isBn ? "প্রযুক্ত" : "Applied"}</span>
                        </span>
                      ) : coupon.is_applicable ? (
                        <button
                          type="button"
                          onClick={() => handleSelectRecommendation(coupon)}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                        >
                          <span>{isBn ? "প্রয়োগ করুন" : "Apply"}</span>
                          <ArrowRight className="size-3" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleCopy(coupon.code)}
                          className="px-2.5 py-1 rounded-lg border border-stone-200 text-stone-500 hover:text-stone-800 text-[10px] font-semibold cursor-pointer flex items-center gap-1"
                          title="Copy Code"
                        >
                          <Copy className="size-2.5" />
                          <span>{isBn ? "কপি" : "Copy"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
