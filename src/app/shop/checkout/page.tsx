"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Coins,
  CreditCard,
  Gift,
  Loader2,
  Lock,
  MapPin,
  Package,
  Phone,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  User,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { CouponOfferSelector } from "@/components/shop/CouponOfferSelector";
import {
  shopApi,
  type PincodeResult,
  type ShopCheckoutPayload,
  type ShopCheckoutResult,
} from "@/lib/api";
import { useCartStore, type CartItem } from "@/lib/stores/use-cart-store";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";

// ---------------------------------------------------------------------------
// Razorpay Script Loader
// ---------------------------------------------------------------------------
const RZP_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if ((window as any).Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${RZP_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const s = document.createElement("script");
    s.src = RZP_SRC;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ShippingFormData {
  recipient_name: string;
  phone_number: string;
  alternate_phone: string;
  address_line1: string;
  address_line2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  address_type: "home" | "office";
}

interface SankalpaFormData {
  devotee_name: string;
  gotra: string;
  date_of_birth: string;
  birth_time: string;
  birth_place: string;
  special_prayer_wish: string;
}

type PaymentMethod = "razorpay" | "cod";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli",
  "Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep",
  "Puducherry",
];

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function CheckoutPage() {
  const router = useRouter();
  const { user, isSignedIn, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const isBn = language === "bn";
  const {
    items,
    getSubtotal,
    getCashbackCoins,
    couponCode,
    discountAmount,
    setCoupon,
    clearCart,
  } = useCartStore();

  // ---- Redirect if not signed in
  React.useEffect(() => {
    if (!authLoading && !isSignedIn) {
      toast.info(
        isBn
          ? "চেকআউট করতে দয়া করে প্রথমে সাইন ইন করুন।"
          : "Please sign in to proceed to checkout.",
      );
      router.push("/login?next=/shop/checkout");
    }
  }, [authLoading, isSignedIn, router, isBn]);

  // ---- State
  const [shipping, setShipping] = React.useState<ShippingFormData>({
    recipient_name: "",
    phone_number: "",
    alternate_phone: "",
    address_line1: "",
    address_line2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    address_type: "home",
  });

  const [sankalpa, setSankalpa] = React.useState<SankalpaFormData>({
    devotee_name: "",
    gotra: "",
    date_of_birth: "",
    birth_time: "",
    birth_place: "",
    special_prayer_wish: "",
  });

  const [showSankalpa, setShowSankalpa] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("razorpay");
  const [pincodeResult, setPincodeResult] = React.useState<PincodeResult | null>(null);
  const [pincodeLoading, setPincodeLoading] = React.useState(false);
  const [pincodeError, setPincodeError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [orderSuccess, setOrderSuccess] = React.useState<ShopCheckoutResult | null>(null);
  const [activeOrder, setActiveOrder] = React.useState<ShopCheckoutResult | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const paymentStartedRef = React.useRef(false);
  const paymentCompletedRef = React.useRef(false);

  // ---- Pre-fill name from auth
  React.useEffect(() => {
    if (user?.full_name && !shipping.recipient_name) {
      setShipping((prev) => ({
        ...prev,
        recipient_name: user.full_name,
      }));
    }
  }, [user, shipping.recipient_name]);

  // ---- Store settings (shipping + threshold-based complimentary gift)
  const { data: shopSettings } = useQuery({
    queryKey: ["shop_public_banners"],
    queryFn: () => shopApi.getBanners(),
    staleTime: 5 * 60 * 1000,
  });

  // ---- Computed
  const subtotal = getSubtotal();
  const cashbackCoins = getCashbackCoins();
  const freeShippingThreshold = shopSettings?.free_shipping_threshold ?? 499;
  const standardShippingFee = shopSettings?.standard_shipping_fee ?? 70;
  const giftMinValue = shopSettings?.free_gift_min_cart_value ?? 499;
  const giftEnabled = shopSettings?.free_gift_enabled !== false;
  const freeGifts =
    giftEnabled && shopSettings?.free_gift_default_title && subtotal >= giftMinValue
      ? [
          {
            title: shopSettings.free_gift_default_title,
            value: shopSettings.free_gift_default_value ?? 0,
            badge: shopSettings.free_gift_default_badge,
          },
        ]
      : [];
  const shippingFee = subtotal >= freeShippingThreshold ? 0 : standardShippingFee;
  const grandTotal = subtotal - discountAmount + shippingFee;

  // ---- Pincode debounced lookup
  const pincodeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const lookupPincode = React.useCallback(
    async (pin: string, phone?: string) => {
      if (pin.length !== 6) return;
      setPincodeLoading(true);
      try {
        const res = await shopApi.checkPincode(pin, phone || shipping.phone_number);
        setPincodeResult(res);
        if (!res.is_serviceable) {
          setPincodeError(
            isBn
              ? "দুঃখিত, এই পিনকোডে ডেলিভারি এই মুহূর্তে উপলব্ধ নয়।"
              : "Sorry, delivery is not available to this pincode.",
          );
        } else {
          // Auto-fill city/state from pincode
          setShipping((prev) => ({
            ...prev,
            city: res.city || prev.city,
            state: res.state || prev.state,
          }));
          if (!res.cod_available && paymentMethod === "cod") {
            setPaymentMethod("razorpay");
          }
        }
      } catch {
        setPincodeError(
          isBn ? "পিনকোড যাচাই করা যায়নি।" : "Could not verify pincode.",
        );
      } finally {
        setPincodeLoading(false);
      }
    },
    [isBn, paymentMethod, shipping.phone_number],
  );

  const handlePincodeChange = React.useCallback(
    (val: string) => {
      const cleaned = val.replace(/\D/g, "").slice(0, 6);
      setShipping((prev) => ({ ...prev, pincode: cleaned }));
      setPincodeResult(null);
      setPincodeError(null);

      if (pincodeTimerRef.current) clearTimeout(pincodeTimerRef.current);

      if (cleaned.length === 6) {
        pincodeTimerRef.current = setTimeout(() => {
          lookupPincode(cleaned, shipping.phone_number);
        }, 500);
      }
    },
    [lookupPincode, shipping.phone_number],
  );

  // ---- Validation
  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    const req = (k: keyof ShippingFormData, label: string) => {
      if (!shipping[k]?.trim()) errors[k] = `${label} is required`;
    };

    req("recipient_name", isBn ? "নাম" : "Name");
    req("phone_number", isBn ? "ফোন নম্বর" : "Phone number");
    req("address_line1", isBn ? "ঠিকানা" : "Address");
    req("city", isBn ? "শহর" : "City");
    req("state", isBn ? "রাজ্য" : "State");
    req("pincode", isBn ? "পিনকোড" : "Pincode");

    if (shipping.phone_number && !/^[6-9]\d{9}$/.test(shipping.phone_number)) {
      errors.phone_number = isBn ? "সঠিক ১০ সংখ্যার ভারতীয় নম্বর দিন" : "Enter a valid 10-digit Indian number";
    }

    if (shipping.pincode && shipping.pincode.length !== 6) {
      errors.pincode = isBn ? "৬ সংখ্যার পিনকোড দিন" : "Enter a 6-digit pincode";
    }

    if (pincodeResult && !pincodeResult.is_serviceable) {
      errors.pincode = isBn ? "এই পিনকোডে ডেলিভারি নেই" : "Delivery unavailable at this pincode";
    }

    if (paymentMethod === "cod" && pincodeResult && !pincodeResult.cod_available) {
      errors.pincode = isBn ? "COD এই পিনকোডে উপলব্ধ নয়" : "COD not available at this pincode";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ---- Place Order
  const handlePlaceOrder = async () => {
    if (!validate()) {
      toast.error(
        isBn
          ? "দয়া করে সব প্রয়োজনীয় তথ্য পূরণ করুন।"
          : "Please fill in all required fields.",
      );
      return;
    }

    if (items.length === 0) {
      toast.error(isBn ? "আপনার কার্ট খালি।" : "Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    paymentStartedRef.current = false;
    paymentCompletedRef.current = false;

    try {
      const payload: ShopCheckoutPayload = {
        items: items.map((it) => ({
          product_id: it.id,
          quantity: it.quantity,
        })),
        shipping_address: {
          recipient_name: shipping.recipient_name.trim(),
          phone_number: shipping.phone_number.trim(),
          alternate_phone: shipping.alternate_phone.trim() || undefined,
          address_line1: shipping.address_line1.trim(),
          address_line2: shipping.address_line2.trim() || undefined,
          landmark: shipping.landmark.trim() || undefined,
          city: shipping.city.trim(),
          state: shipping.state.trim(),
          pincode: shipping.pincode.trim(),
          address_type: shipping.address_type,
        },
        sankalpa: showSankalpa
          ? {
              devotee_name: sankalpa.devotee_name.trim() || undefined,
              gotra: sankalpa.gotra.trim() || undefined,
              date_of_birth: sankalpa.date_of_birth || undefined,
              birth_time: sankalpa.birth_time || undefined,
              birth_place: sankalpa.birth_place.trim() || undefined,
              special_prayer_wish: sankalpa.special_prayer_wish.trim() || undefined,
            }
          : undefined,
        payment_method: paymentMethod,
        coupon_code: couponCode || undefined,
      };

      const result = await shopApi.checkout(payload);
      setActiveOrder(result);

      // ---- COD: immediate success
      if (paymentMethod === "cod") {
        clearCart();
        setOrderSuccess(result);
        setActiveOrder(null);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        toast.success(
          isBn
            ? "✅ অর্ডার সফলভাবে গৃহীত হয়েছে!"
            : "✅ Order placed successfully!",
        );
        return;
      }

      // ---- Razorpay online payment
      if (!result.razorpay_order_id || !result.razorpay_key_id) {
        toast.error(
          isBn
            ? "পেমেন্ট গেটওয়ে থেকে অর্ডার আইডি পাওয়া যায়নি।"
            : "Could not get payment gateway order ID.",
        );
        setIsSubmitting(false);
        setActiveOrder(null);
        return;
      }

      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded || !(window as any).Razorpay) {
        toast.error(
          isBn
            ? "পেমেন্ট গেটওয়ে লোড হয়নি। ইন্টারনেট চেক করুন।"
            : "Failed to load payment gateway. Check your connection.",
        );
        setIsSubmitting(false);
        setActiveOrder(null);
        return;
      }

      const rzp = new (window as any).Razorpay({
        key: result.razorpay_key_id,
        order_id: result.razorpay_order_id,
        amount: Math.round(result.grand_total * 100),
        currency: "INR",
        name: "DivinLink AstroStore",
        description: `Order ${result.order_number}`,
        image: "/icon.png",
        prefill: {
          name: shipping.recipient_name,
          email: user?.email || "",
          contact: shipping.phone_number,
        },
        theme: { color: "#b45309" },
        handler: async (response: {
          razorpay_order_id?: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          paymentStartedRef.current = true;
          try {
            toast.loading(
              isBn ? "পেমেন্ট যাচাই হচ্ছে..." : "Verifying payment...",
              { id: "rzp-verify" },
            );
            const rzpOrderId =
              response.razorpay_order_id || result.razorpay_order_id || "";
            await shopApi.verifyPayment({
              order_id: result.order_id,
              razorpay_order_id: rzpOrderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            paymentCompletedRef.current = true;
            clearCart();
            setOrderSuccess(result);
            setActiveOrder(null);
            confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
            toast.success(
              isBn
                ? "✅ পেমেন্ট সফল! ১০০% ক্যাশব্যাক কয়েন আপনার ওয়ালেটে জমা হবে।"
                : "✅ Payment confirmed! 100% cashback coins will be credited.",
              { id: "rzp-verify" },
            );
          } catch (err: any) {
            console.error("[ShopCheckout] Payment verification error:", err);
            // Fallback check: Did the webhook or backend already confirm it?
            try {
              const checked = await shopApi.getOrderDetail(result.order_id);
              if (
                checked &&
                (checked.payment_status === "paid" ||
                  checked.order_status === "confirmed")
              ) {
                paymentCompletedRef.current = true;
                clearCart();
                setOrderSuccess(result);
                setActiveOrder(null);
                toast.success(
                  isBn
                    ? "✅ পেমেন্ট নিশ্চিত হয়েছে! অর্ডার প্রক্রিয়াধীন।"
                    : "✅ Payment confirmed! Your order is being processed.",
                  { id: "rzp-verify" },
                );
                return;
              }
            } catch {
              // Ignore fallback check failure and surface primary error
            }

            const errMsg =
              err?.message ||
              (isBn
                ? "পেমেন্ট যাচাই ব্যর্থ। সাপোর্টে যোগাযোগ করুন।"
                : "Payment verification failed. Please contact support.");
            toast.error(errMsg, { id: "rzp-verify", duration: 6000 });
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            // Guard: If payment was completed or verification started, do NOT abort!
            if (paymentCompletedRef.current || paymentStartedRef.current) {
              return;
            }
            // Immediately inform backend to cancel the uncompleted checkout and release reserved stock
            const orderIdToAbort = result?.order_id;
            if (orderIdToAbort) {
              shopApi.abortCheckout(orderIdToAbort).catch((abortErr) => {
                console.warn("[ShopCheckout] Background abort failed:", abortErr);
              });
            }
            toast.info(
              isBn
                ? "পেমেন্ট বাতিল হয়েছে। আপনার কার্টের সামগ্রী সংরক্ষিত আছে, আপনি পুনরায় চেষ্টা করতে পারেন বা COD বেছে নিতে পারেন।"
                : "Payment was not completed. Your cart items are preserved, you can retry or choose Cash on Delivery.",
            );
            setIsSubmitting(false);
            setActiveOrder(null);
          },
        },
      });

      rzp.open();
    } catch (err: any) {
      const msg =
        err?.message ||
        (isBn ? "অর্ডার প্লেস করা যায়নি।" : "Could not place order.");
      toast.error(msg);
      setIsSubmitting(false);
      setActiveOrder(null);
    }
  };

  // ---- Input change helper
  const handleShippingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "pincode") {
      handlePincodeChange(value);
    } else if (name === "phone_number") {
      const cleanPhone = value.replace(/\D/g, "").slice(0, 10);
      setShipping((prev) => ({ ...prev, phone_number: cleanPhone }));
      if (cleanPhone.length === 10 && shipping.pincode.length === 6) {
        if (pincodeTimerRef.current) clearTimeout(pincodeTimerRef.current);
        pincodeTimerRef.current = setTimeout(() => {
          lookupPincode(shipping.pincode, cleanPhone);
        }, 300);
      }
    } else if (name === "alternate_phone") {
      setShipping((prev) => ({ ...prev, alternate_phone: value.replace(/\D/g, "").slice(0, 10) }));
    } else {
      setShipping((prev) => ({ ...prev, [name]: value }));
    }
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSankalpaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setSankalpa((prev) => ({ ...prev, [name]: value }));
  };

  // ---- Loading or not signed in
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="size-8 text-amber-600 animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) return null;

  // =========================================================================
  // ✅ ORDER SUCCESS VIEW
  // =========================================================================
  if (orderSuccess) {
    return (
      <>
        <SiteHeader />
        <CartDrawer />
        <main className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
          <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/50 p-6 sm:p-10 text-center space-y-6 shadow-sm">
            {/* Success icon */}
            <div className="mx-auto size-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="size-10 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-stone-900">
                {isBn ? "🎉 অর্ডার সফল!" : "🎉 Order Placed!"}
              </h1>
              <p className="text-sm text-stone-600">
                {isBn
                  ? "আপনার পবিত্র প্রতিকার সামগ্রী শীঘ্রই প্রেরণ করা হবে।"
                  : "Your consecrated remedies will be dispatched soon."}
              </p>
            </div>

            {/* Order details */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">{isBn ? "অর্ডার নম্বর" : "Order Number"}</span>
                <span className="font-bold text-stone-900">{orderSuccess.order_number}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">{isBn ? "মোট" : "Grand Total"}</span>
                <span className="font-bold text-stone-900">{formatINR(orderSuccess.grand_total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">{isBn ? "পেমেন্ট পদ্ধতি" : "Payment Method"}</span>
                <span className="font-semibold text-stone-800 uppercase">
                  {orderSuccess.payment_method === "razorpay" ? "Online (Razorpay)" : "Cash on Delivery"}
                </span>
              </div>
              {orderSuccess.cashback_coins_eligible > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500 flex items-center gap-1">
                    <Coins className="size-3.5 text-amber-500" />
                    {isBn ? "ক্যাশব্যাক কয়েন" : "Cashback Coins"}
                  </span>
                  <span className="font-bold text-emerald-700">
                    +{orderSuccess.cashback_coins_eligible} Coins
                  </span>
                </div>
              )}
            </div>

            {/* Free gifts */}
            {orderSuccess.free_gifts && orderSuccess.free_gifts.length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 text-left">
                <p className="text-xs font-bold text-amber-800 flex items-center gap-1 mb-2">
                  <Gift className="size-3.5 text-amber-600" />
                  {isBn ? "আপনার ফ্রি উপহার:" : "Your Free Gifts:"}
                </p>
                {orderSuccess.free_gifts.map((g: any, i: number) => (
                  <p key={i} className="text-sm text-amber-900">
                    🎁 {g.title || g.badge}{" "}
                    {g.value ? (
                      <span className="text-xs text-amber-700">(Worth {formatINR(g.value)})</span>
                    ) : null}
                  </p>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/shop"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-amber-600 px-6 py-3 text-sm font-bold text-white hover:bg-amber-700 transition-colors"
              >
                <ShoppingBag className="size-4" />
                {isBn ? "আরও প্রতিকার কিনুন" : "Continue Shopping"}
              </Link>
              <Link
                href="/account/orders"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-bold text-stone-800 hover:bg-stone-50 transition-colors"
              >
                <Package className="size-4" />
                {isBn ? "আমার অর্ডার দেখুন" : "Track My Orders"}
              </Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  // =========================================================================
  // 🛒 EMPTY CART VIEW
  // =========================================================================
  if (items.length === 0 && !orderSuccess && !isSubmitting && !activeOrder) {
    return (
      <>
        <SiteHeader />
        <CartDrawer />
        <main className="max-w-xl mx-auto px-4 py-16 text-center space-y-5">
          <ShoppingBag className="size-16 text-stone-300 mx-auto" />
          <h1 className="font-cinzel text-xl font-bold text-stone-800">
            {isBn ? "আপনার কার্ট খালি" : "Your Cart is Empty"}
          </h1>
          <p className="text-sm text-stone-500">
            {isBn
              ? "প্রথমে শপ থেকে পবিত্র প্রতিকার সামগ্রী যোগ করুন।"
              : "Add consecrated remedies from the shop first."}
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-6 py-3 text-sm font-bold text-white hover:bg-amber-700 transition-colors"
          >
            <ArrowLeft className="size-4" />
            {isBn ? "শপে ফিরে যান" : "Back to Shop"}
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  // =========================================================================
  // 🧾 CHECKOUT FORM
  // =========================================================================
  return (
    <>
      <SiteHeader />
      <CartDrawer />

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <Link href="/shop" className="hover:text-amber-700 transition-colors">
            {isBn ? "শপ" : "Shop"}
          </Link>
          <span>/</span>
          <span className="text-stone-800 font-semibold">
            {isBn ? "চেকআউট" : "Checkout"}
          </span>
        </nav>

        <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
          <Lock className="size-5 text-amber-700" />
          {isBn ? "নিরাপদ চেকআউট" : "Secure Checkout"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* ============ LEFT COLUMN – Forms ============ */}
          <div className="lg:col-span-2 space-y-6">
            {/* ---- SECTION 1: Shipping Address ---- */}
            <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 space-y-4 shadow-xs">
              <h2 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <MapPin className="size-4 text-amber-700" />
                {isBn ? "ডেলিভারি ঠিকানা" : "Delivery Address"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Recipient Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">
                    {isBn ? "প্রাপকের নাম *" : "Recipient Name *"}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                    <input
                      name="recipient_name"
                      value={shipping.recipient_name}
                      onChange={handleShippingChange}
                      placeholder={isBn ? "পূর্ণ নাম" : "Full name"}
                      className={`w-full rounded-xl border ${fieldErrors.recipient_name ? "border-rose-400 bg-rose-50" : "border-stone-300 bg-stone-50"} pl-10 pr-3 py-2.5 text-sm focus:border-amber-600 focus:bg-white focus:outline-none transition-colors`}
                    />
                  </div>
                  {fieldErrors.recipient_name && (
                    <p className="text-[11px] text-rose-600">{fieldErrors.recipient_name}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">
                    {isBn ? "ফোন নম্বর *" : "Phone Number *"}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                    <input
                      name="phone_number"
                      value={shipping.phone_number}
                      onChange={handleShippingChange}
                      placeholder="9876543210"
                      inputMode="numeric"
                      maxLength={10}
                      className={`w-full rounded-xl border ${fieldErrors.phone_number ? "border-rose-400 bg-rose-50" : "border-stone-300 bg-stone-50"} pl-10 pr-3 py-2.5 text-sm focus:border-amber-600 focus:bg-white focus:outline-none transition-colors`}
                    />
                  </div>
                  {fieldErrors.phone_number && (
                    <p className="text-[11px] text-rose-600">{fieldErrors.phone_number}</p>
                  )}
                </div>

                {/* Alternate Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">
                    {isBn ? "বিকল্প ফোন (ঐচ্ছিক)" : "Alternate Phone (Optional)"}
                  </label>
                  <input
                    name="alternate_phone"
                    value={shipping.alternate_phone}
                    onChange={handleShippingChange}
                    placeholder="Optional"
                    inputMode="numeric"
                    maxLength={10}
                    className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm focus:border-amber-600 focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Address Type */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">
                    {isBn ? "ঠিকানার ধরন" : "Address Type"}
                  </label>
                  <div className="flex gap-3">
                    {(["home", "office"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setShipping((p) => ({ ...p, address_type: t }))}
                        className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                          shipping.address_type === t
                            ? "border-amber-500 bg-amber-50 text-amber-800"
                            : "border-stone-300 bg-stone-50 text-stone-600 hover:bg-stone-100"
                        }`}
                      >
                        {t === "home" ? (isBn ? "🏠 বাড়ি" : "🏠 Home") : (isBn ? "🏢 অফিস" : "🏢 Office")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Address Line 1 */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">
                  {isBn ? "ঠিকানা (রাস্তা, বাড়ি নং) *" : "Address (Street, House No.) *"}
                </label>
                <input
                  name="address_line1"
                  value={shipping.address_line1}
                  onChange={handleShippingChange}
                  placeholder={isBn ? "বাড়ি নং, রাস্তার নাম, পাড়া" : "House no., Street, Area"}
                  className={`w-full rounded-xl border ${fieldErrors.address_line1 ? "border-rose-400 bg-rose-50" : "border-stone-300 bg-stone-50"} px-3 py-2.5 text-sm focus:border-amber-600 focus:bg-white focus:outline-none transition-colors`}
                />
                {fieldErrors.address_line1 && (
                  <p className="text-[11px] text-rose-600">{fieldErrors.address_line1}</p>
                )}
              </div>

              {/* Address Line 2 + Landmark */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">
                    {isBn ? "ঠিকানা লাইন ২ (ঐচ্ছিক)" : "Address Line 2 (Optional)"}
                  </label>
                  <input
                    name="address_line2"
                    value={shipping.address_line2}
                    onChange={handleShippingChange}
                    placeholder={isBn ? "তলা, ফ্ল্যাট নং ইত্যাদি" : "Floor, Flat no., etc."}
                    className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm focus:border-amber-600 focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">
                    {isBn ? "ল্যান্ডমার্ক (ঐচ্ছিক)" : "Landmark (Optional)"}
                  </label>
                  <input
                    name="landmark"
                    value={shipping.landmark}
                    onChange={handleShippingChange}
                    placeholder={isBn ? "কাছের মসজিদ / স্কুল / বাজার" : "Near mosque / school / market"}
                    className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm focus:border-amber-600 focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Pincode, City, State */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Pincode */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">
                    {isBn ? "পিনকোড *" : "Pincode *"}
                  </label>
                  <div className="relative">
                    <input
                      name="pincode"
                      value={shipping.pincode}
                      onChange={handleShippingChange}
                      placeholder="700001"
                      inputMode="numeric"
                      maxLength={6}
                      className={`w-full rounded-xl border ${fieldErrors.pincode || pincodeError ? "border-rose-400 bg-rose-50" : "border-stone-300 bg-stone-50"} px-3 py-2.5 text-sm focus:border-amber-600 focus:bg-white focus:outline-none transition-colors`}
                    />
                    {pincodeLoading && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-amber-600 animate-spin" />
                    )}
                  </div>
                  {pincodeError && <p className="text-[11px] text-rose-600">{pincodeError}</p>}
                  {fieldErrors.pincode && !pincodeError && (
                    <p className="text-[11px] text-rose-600">{fieldErrors.pincode}</p>
                  )}
                  {pincodeResult?.is_serviceable && (
                    <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                      <Truck className="size-3" />
                      <span>
                        {isBn
                          ? `${pincodeResult.estimated_delivery_days} দিনে ডেলিভারি (${pincodeResult.estimated_delivery_date})`
                          : `Delivery in ${pincodeResult.estimated_delivery_days} days (by ${pincodeResult.estimated_delivery_date})`}
                      </span>
                    </div>
                  )}
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">
                    {isBn ? "শহর *" : "City *"}
                  </label>
                  <input
                    name="city"
                    value={shipping.city}
                    onChange={handleShippingChange}
                    placeholder={isBn ? "কলকাতা" : "Kolkata"}
                    className={`w-full rounded-xl border ${fieldErrors.city ? "border-rose-400 bg-rose-50" : "border-stone-300 bg-stone-50"} px-3 py-2.5 text-sm focus:border-amber-600 focus:bg-white focus:outline-none transition-colors`}
                  />
                  {fieldErrors.city && (
                    <p className="text-[11px] text-rose-600">{fieldErrors.city}</p>
                  )}
                </div>

                {/* State */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">
                    {isBn ? "রাজ্য *" : "State *"}
                  </label>
                  <select
                    name="state"
                    value={shipping.state}
                    onChange={handleShippingChange}
                    className={`w-full rounded-xl border ${fieldErrors.state ? "border-rose-400 bg-rose-50" : "border-stone-300 bg-stone-50"} px-3 py-2.5 text-sm focus:border-amber-600 focus:bg-white focus:outline-none transition-colors appearance-none`}
                  >
                    <option value="">{isBn ? "রাজ্য নির্বাচন করুন" : "Select state"}</option>
                    {indianStates.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.state && (
                    <p className="text-[11px] text-rose-600">{fieldErrors.state}</p>
                  )}
                </div>
              </div>
            </section>

            {/* ---- SECTION 2: Vedic Sankalpa (Optional Collapsible) ---- */}
            <section className="rounded-2xl border border-amber-200/70 bg-amber-50/30 overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => setShowSankalpa((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-amber-50/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-amber-700" />
                  <span className="font-bold text-sm text-stone-900">
                    {isBn ? "বৈদিক সংকল্প তথ্য (ঐচ্ছিক)" : "Vedic Sankalpa Details (Optional)"}
                  </span>
                </div>
                {showSankalpa ? (
                  <ChevronUp className="size-4 text-stone-500" />
                ) : (
                  <ChevronDown className="size-4 text-stone-500" />
                )}
              </button>
              {showSankalpa && (
                <div className="px-5 pb-5 space-y-4 border-t border-amber-200/50">
                  <p className="text-xs text-stone-500 pt-3">
                    {isBn
                      ? "প্রতিটি সামগ্রী আপনার নামে প্রাণ-প্রতিষ্ঠা করে পাঠানো হয়। সংকল্প তথ্য পূরণ করলে গুরুজী আপনার নামে বিশেষ প্রার্থনা করবেন।"
                      : "Each remedy is consecrated in your name. Provide Sankalpa details for personalized Vedic prayers."}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">
                        {isBn ? "ভক্তের নাম" : "Devotee Name"}
                      </label>
                      <input
                        name="devotee_name"
                        value={sankalpa.devotee_name}
                        onChange={handleSankalpaChange}
                        placeholder={isBn ? "যার নামে সংকল্প হবে" : "Name for the Sankalpa"}
                        className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-amber-600 focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">
                        {isBn ? "গোত্র" : "Gotra"}
                      </label>
                      <input
                        name="gotra"
                        value={sankalpa.gotra}
                        onChange={handleSankalpaChange}
                        placeholder={isBn ? "যেমন: কাশ্যপ" : "e.g., Kashyap"}
                        className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-amber-600 focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">
                        {isBn ? "জন্ম তারিখ" : "Date of Birth"}
                      </label>
                      <input
                        type="date"
                        name="date_of_birth"
                        value={sankalpa.date_of_birth}
                        onChange={handleSankalpaChange}
                        className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-amber-600 focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">
                        {isBn ? "জন্ম সময়" : "Birth Time"}
                      </label>
                      <input
                        type="time"
                        name="birth_time"
                        value={sankalpa.birth_time}
                        onChange={handleSankalpaChange}
                        className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-amber-600 focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700">
                        {isBn ? "জন্মস্থান" : "Birth Place"}
                      </label>
                      <input
                        name="birth_place"
                        value={sankalpa.birth_place}
                        onChange={handleSankalpaChange}
                        placeholder={isBn ? "যেমন: কলকাতা, পশ্চিমবঙ্গ" : "e.g., Kolkata, West Bengal"}
                        className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-amber-600 focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-stone-700">
                        {isBn ? "বিশেষ প্রার্থনা / ইচ্ছা" : "Special Prayer Wish"}
                      </label>
                      <textarea
                        name="special_prayer_wish"
                        value={sankalpa.special_prayer_wish}
                        onChange={handleSankalpaChange}
                        rows={2}
                        placeholder={isBn ? "আপনার বিশেষ প্রার্থনা বা মনোকামনা লিখুন..." : "Write your special prayer or wish..."}
                        className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-amber-600 focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* ---- SECTION 3: Payment Method ---- */}
            <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 space-y-4 shadow-xs">
              <h2 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <CreditCard className="size-4 text-amber-700" />
                {isBn ? "পেমেন্ট পদ্ধতি নির্বাচন করুন" : "Select Payment Method"}
              </h2>

              <div className="space-y-3">
                {/* Online */}
                <label
                  className={`flex items-start gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    paymentMethod === "razorpay"
                      ? "border-amber-500 bg-amber-50/50 shadow-sm"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => setPaymentMethod("razorpay")}
                    className="mt-1 accent-amber-600"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-stone-900">
                        {isBn ? "অনলাইন পেমেন্ট (Razorpay)" : "Online Payment (Razorpay)"}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                        <Coins className="size-2.5" />
                        {isBn ? "১০০% ক্যাশব্যাক" : "100% CASHBACK"}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      {isBn
                        ? "UPI, ক্রেডিট/ডেবিট কার্ড, নেটব্যাংকিং — সম্পূর্ণ কয়েন ক্যাশব্যাক ওয়ালেটে জমা হবে।"
                        : "UPI, Card, Netbanking — full coin cashback credited to your wallet."}
                    </p>
                  </div>
                </label>

                {/* COD */}
                <label
                  className={`flex items-start gap-3 rounded-xl border-2 p-4 transition-all ${
                    paymentMethod === "cod"
                      ? "border-stone-500 bg-stone-50 shadow-sm"
                      : "border-stone-200 hover:border-stone-300"
                  } ${pincodeResult && !pincodeResult.cod_available ? "opacity-60 cursor-not-allowed bg-stone-50/50" : "cursor-pointer"}`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => {
                      if (pincodeResult && !pincodeResult.cod_available) return;
                      setPaymentMethod("cod");
                    }}
                    disabled={pincodeResult ? !pincodeResult.cod_available : false}
                    className="mt-1 accent-stone-700"
                  />
                  <div className="flex-1 space-y-1">
                    <span className="font-bold text-sm text-stone-900">
                      {isBn ? "ক্যাশ অন ডেলিভারি (COD)" : "Cash on Delivery (COD)"}
                    </span>
                    <p className="text-xs text-stone-500">
                      {pincodeResult && !pincodeResult.cod_available
                        ? pincodeResult.cod_disabled_reason || (isBn
                            ? "এই পিনকোডে COD উপলব্ধ নয়।"
                            : "COD is not available at this pincode.")
                        : isBn
                        ? "ডেলিভারির সময় নগদ পেমেন্ট করুন। ক্যাশব্যাক প্রযোজ্য নয়।"
                        : "Pay cash on delivery. Cashback not applicable."}
                    </p>
                    {pincodeResult && !pincodeResult.cod_available && pincodeResult.cod_disabled_reason && (
                      <div className="mt-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 leading-relaxed font-medium">
                        🛡️ {pincodeResult.cod_disabled_reason}
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* ============ RIGHT COLUMN – Order Summary ============ */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Summary card */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
                <h2 className="font-bold text-base text-stone-900 flex items-center gap-2">
                  <ShoppingBag className="size-4 text-amber-700" />
                  {isBn ? "অর্ডার সারাংশ" : "Order Summary"}
                  <span className="text-xs text-stone-500 font-normal">
                    ({items.length} {isBn ? "আইটেম" : items.length === 1 ? "item" : "items"})
                  </span>
                </h2>

                {/* Items list */}
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {items.map((item: CartItem) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-stone-100 last:border-0 last:pb-0">
                      <div className="relative size-16 shrink-0 rounded-lg overflow-hidden bg-stone-100 border border-stone-100">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="size-full flex items-center justify-center">
                            <Package className="size-5 text-stone-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <p className="text-xs font-semibold text-stone-800 line-clamp-2 leading-tight">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          Qty: {item.quantity}
                        </p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-bold text-stone-900">
                            {formatINR(item.price * item.quantity)}
                          </span>
                          {item.mrp > item.price && (
                            <span className="text-[11px] text-stone-400 line-through">
                              {formatINR(item.mrp * item.quantity)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Free gifts */}
                {freeGifts.length > 0 && (
                  <div className="rounded-xl bg-amber-50/70 border border-amber-200/60 p-3 space-y-1.5">
                    <p className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                      <Gift className="size-3 text-amber-600" />
                      {isBn ? "ফ্রি উপহার অন্তর্ভুক্ত:" : "Free Vedic Gifts Included:"}
                    </p>
                    {freeGifts.map((g, i) => (
                      <div key={i} className="flex items-center justify-between gap-2 pl-4">
                        <span className="text-xs text-amber-900">{g.title}</span>
                        <span className="shrink-0 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          FREE · {formatINR(g.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Smart Best-Offer Coupon Selector */}
                <div className="pt-2">
                  <CouponOfferSelector
                    subtotal={subtotal}
                    appliedCouponCode={couponCode}
                    appliedDiscount={discountAmount}
                    onApplyCoupon={(code, disc) => setCoupon(code, disc)}
                    onRemoveCoupon={() => {
                      setCoupon(null, 0);
                      toast.info(isBn ? "কুপন সরানো হয়েছে" : "Coupon removed");
                    }}
                    compact={false}
                  />
                </div>

                {/* Price breakdown */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">{isBn ? "সাবটোটাল" : "Subtotal"}</span>
                    <span className="font-semibold text-stone-800">{formatINR(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-700">
                        {isBn ? "কুপন ছাড়" : "Coupon Discount"}
                        {couponCode && <span className="text-[10px] ml-1 text-stone-400">({couponCode})</span>}
                      </span>
                      <span className="font-semibold text-emerald-700">
                        -{formatINR(discountAmount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">{isBn ? "ডেলিভারি" : "Shipping"}</span>
                    <span className={`font-semibold ${shippingFee === 0 ? "text-emerald-700" : "text-stone-800"}`}>
                      {shippingFee === 0 ? "FREE" : formatINR(shippingFee)}
                    </span>
                  </div>

                  <div className="h-px bg-stone-200" />

                  <div className="flex justify-between text-base">
                    <span className="font-bold text-stone-900">{isBn ? "সর্বমোট" : "Grand Total"}</span>
                    <span className="font-extrabold text-stone-900">{formatINR(grandTotal)}</span>
                  </div>

                  {/* Cashback highlight */}
                  {paymentMethod === "razorpay" && cashbackCoins > 0 && (
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5">
                      <Wallet className="size-4 text-emerald-600 shrink-0" />
                      <p className="text-xs text-emerald-800 font-medium">
                        {isBn
                          ? `অনলাইন পেমেন্টে ${cashbackCoins} কয়েন (₹${cashbackCoins}) ওয়ালেটে ক্যাশব্যাক!`
                          : `Earn ${cashbackCoins} coins (₹${cashbackCoins}) wallet cashback with online payment!`}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Place order button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting || items.length === 0}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-3.5 text-sm font-bold text-white hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {isBn ? "প্রক্রিয়াকরণ হচ্ছে..." : "Processing..."}
                  </>
                ) : (
                  <>
                    <Lock className="size-4" />
                    {paymentMethod === "razorpay"
                      ? isBn
                        ? `${formatINR(grandTotal)} পে করুন`
                        : `Pay ${formatINR(grandTotal)}`
                      : isBn
                      ? "অর্ডার প্লেস করুন (COD)"
                      : "Place Order (COD)"}
                  </>
                )}
              </button>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-stone-500">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="size-3 text-emerald-600" />
                  100% Authentic
                </span>
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="size-3 text-amber-600" />
                  Vedic Energized
                </span>
                <span className="inline-flex items-center gap-1">
                  <Shield className="size-3 text-blue-600" />
                  Secure Checkout
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
