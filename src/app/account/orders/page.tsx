"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Sparkles,
  Flame,
  Plane,
  ShieldCheck,
  Coins,
  Gift,
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ShoppingBag,
  MapPin,
  FileText,
  MessageSquare,
  HelpCircle,
  XCircle,
  Check,
  ArrowRight,
  PhoneCall,
} from "lucide-react";
import { toast } from "sonner";

import { shopApi, type ShopOrder } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { useLanguage } from "@/providers/language-provider";
import { useRequireAuth } from "@/providers/auth-provider";
import { LoadingBlock } from "@/components/ui";

function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

type FilterTab = "all" | "active" | "delivered" | "cancelled";

const STATUS_CONFIG: Record<
  string,
  { label_bn: string; label_en: string; badgeClass: string; stepIndex: number }
> = {
  placed: {
    label_bn: "অর্ডার গৃহীত",
    label_en: "Order Placed",
    badgeClass: "bg-stone-100 text-stone-800 border-stone-300",
    stepIndex: 1,
  },
  confirmed: {
    label_bn: "নিশ্চিত ও সংরক্ষিত",
    label_en: "Order Confirmed",
    badgeClass: "bg-blue-100 text-blue-900 border-blue-300",
    stepIndex: 1,
  },
  sanctifying: {
    label_bn: "কাশীতে প্রাণ-প্রতিষ্ঠা চলছে",
    label_en: "Consecration in Kashi",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
    stepIndex: 2,
  },
  packed: {
    label_bn: "পবিত্র মোম সিলমোহরকৃত",
    label_en: "Wax Sealed & Packed",
    badgeClass: "bg-indigo-100 text-indigo-900 border-indigo-300",
    stepIndex: 2,
  },
  shipped: {
    label_bn: "এয়ার এক্সপ্রেস কার্গোতে ডিসপ্যাচ",
    label_en: "Dispatched via Air Cargo",
    badgeClass: "bg-purple-100 text-purple-900 border-purple-300",
    stepIndex: 3,
  },
  out_for_delivery: {
    label_bn: "ডেলিভারির পথে",
    label_en: "Out for Delivery",
    badgeClass: "bg-teal-100 text-teal-900 border-teal-300",
    stepIndex: 4,
  },
  delivered: {
    label_bn: "সফলভাবে দরজায় অর্পিত",
    label_en: "Delivered",
    badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300",
    stepIndex: 5,
  },
  cancelled: {
    label_bn: "অর্ডার বাতিল",
    label_en: "Cancelled",
    badgeClass: "bg-rose-100 text-rose-900 border-rose-300",
    stepIndex: 0,
  },
  returned: {
    label_bn: "রিটার্ন সম্পন্ন",
    label_en: "Returned",
    badgeClass: "bg-stone-200 text-stone-700 border-stone-400",
    stepIndex: 0,
  },
};

export default function MyOrdersPage() {
  const { ready, user } = useRequireAuth();
  const { language } = useLanguage();
  const isBn = language === "bn";
  const queryClient = useQueryClient();

  // Filters & State
  const [activeFilter, setActiveFilter] = React.useState<FilterTab>("all");
  const [page, setPage] = React.useState(1);
  const [expandedSankalpa, setExpandedSankalpa] = React.useState<Record<string, boolean>>({});
  const [cancellingOrderId, setCancellingOrderId] = React.useState<string | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = React.useState<boolean>(false);

  // Fetch My Orders
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["shop_orders_mine", page],
    queryFn: async () => {
      const res = await shopApi.getMyOrders(page, 20);
      return res;
    },
    enabled: ready,
  });

  const orders = data?.items || [];

  // Filter orders
  const filteredOrders = React.useMemo(() => {
    if (activeFilter === "all") return orders;
    if (activeFilter === "active") {
      return orders.filter(
        (o) => !["delivered", "cancelled", "returned"].includes(o.order_status)
      );
    }
    if (activeFilter === "delivered") {
      return orders.filter((o) => o.order_status === "delivered");
    }
    if (activeFilter === "cancelled") {
      return orders.filter((o) => ["cancelled", "returned"].includes(o.order_status));
    }
    return orders;
  }, [orders, activeFilter]);

  // Cancel order mutation
  const cancelMutation = useMutation({
    mutationFn: async (orderId: string) => {
      return await shopApi.cancelOrder(orderId);
    },
    onSuccess: (updated) => {
      toast.success(
        isBn
          ? `অর্ডার #${updated.order_number} সফলভাবে বাতিল করা হয়েছে।`
          : `Order #${updated.order_number} cancelled successfully.`
      );
      setCancelModalOpen(false);
      setCancellingOrderId(null);
      queryClient.invalidateQueries({ queryKey: ["shop_orders_mine"] });
    },
    onError: (err) => {
      const msg = err instanceof ApiError ? err.message : "অর্ডার বাতিল করা সম্ভব হয়নি।";
      toast.error(msg, { duration: 6000 });
      setCancelModalOpen(false);
      setCancellingOrderId(null);
    },
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(isBn ? "কপি করা হয়েছে!" : "Copied to clipboard!");
  };

  const toggleSankalpa = (id: string) => {
    setExpandedSankalpa((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!ready || isLoading) {
    return <LoadingBlock label={isBn ? "আপনার অর্ডার লোড হচ্ছে..." : "Loading your orders..."} />;
  }

  // Summary counts
  const totalOrdersCount = orders.length;
  const activeOrdersCount = orders.filter(
    (o) => !["delivered", "cancelled", "returned"].includes(o.order_status)
  ).length;
  const totalCashbackCredited = orders.reduce(
    (acc, o) => acc + (o.cashback_coins_credited || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 1. Header Banner */}
      {/* ------------------------------------------------------------------- */}
      <div className="rounded-2xl border border-amber-200 bg-linear-to-r from-amber-50/80 via-white to-stone-50 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Package className="size-5" />
            </div>
            <div>
              <h1 className="font-cinzel text-lg sm:text-xl font-bold text-stone-900">
                {isBn ? "আমার প্রতিকার অর্ডারসমূহ" : "My Sacred Remedy Orders"}
              </h1>
              <p className="text-xs text-stone-500">
                {isBn
                  ? "কাশীর বিশ্বনাথ ঘাটে সংকল্প, এয়ার এক্সপ্রেস কার্গো ও লাইভ ডেলিভারি ট্র্যাকিং"
                  : "Vedic Consecration, Priority Air Cargo & Real-time Doorstep Tracking"}
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs shrink-0"
        >
          <ShoppingBag className="size-3.5 text-amber-300" />
          <span>{isBn ? "স্টোর ব্রাউজ করুন" : "Browse AstroStore"}</span>
        </Link>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Summary Metric Cards */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-stone-200 bg-white p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="size-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
            <Package className="size-5" />
          </div>
          <div>
            <span className="text-[11px] text-stone-500 font-medium">
              {isBn ? "মোট অর্ডার" : "Total Orders"}
            </span>
            <div className="text-base font-bold text-stone-900">{totalOrdersCount}</div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="size-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
            <Flame className="size-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] text-amber-900 font-medium">
              {isBn ? "প্রক্রিয়াধীন / ট্রানজিট" : "Active / In-Transit"}
            </span>
            <div className="text-base font-bold text-amber-900">{activeOrdersCount}</div>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="size-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
            <Coins className="size-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-[11px] text-emerald-900 font-medium">
              {isBn ? "প্রাপ্ত ক্যাশব্যাক কয়েন" : "Cashback Coins Earned"}
            </span>
            <div className="text-base font-bold text-emerald-900">
              +{totalCashbackCredited} Coins
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. Filter Navigation Tabs */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === "all"
              ? "bg-amber-600 text-white shadow-2xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          {isBn ? `সব অর্ডার (${orders.length})` : `All Orders (${orders.length})`}
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter("active")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === "active"
              ? "bg-amber-600 text-white shadow-2xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          {isBn ? `সক্রিয় / কাশীতে সংকল্প (${activeOrdersCount})` : `Active (${activeOrdersCount})`}
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter("delivered")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === "delivered"
              ? "bg-amber-600 text-white shadow-2xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          {isBn ? "ডেলিভারড" : "Delivered"}
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter("cancelled")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === "cancelled"
              ? "bg-amber-600 text-white shadow-2xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          {isBn ? "বাতিলকৃত" : "Cancelled"}
        </button>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4. Orders List or Empty State */}
      {/* ------------------------------------------------------------------- */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center space-y-4">
          <div className="size-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
            <Package className="size-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-cinzel text-base font-bold text-stone-900">
              {isBn ? "কোনো অর্ডার পাওয়া যায়নি" : "No Orders Found"}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {isBn
                ? "আপনি এখনও কোনো পবিত্র প্রতিকার সামগ্রী অর্ডার করেননি। আপনার রাশি ও গ্রহদোষ অনুযায়ী খাঁটি সামগ্রী অর্ডার করুন।"
                : "You have not placed any remedy orders yet. Explore our energised collection tailored for your Kundli."}
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <ShoppingBag className="size-4" />
            <span>{isBn ? "প্রতিকার স্টোর দেখুন" : "Explore Remedies"}</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const statusCfg = STATUS_CONFIG[order.order_status] || {
              label_bn: order.order_status,
              label_en: order.order_status,
              badgeClass: "bg-stone-100 text-stone-800",
              stepIndex: 1,
            };
            const isCancelled = order.order_status === "cancelled";
            const canCancel =
              !isCancelled && ["placed", "confirmed"].includes(order.order_status);

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-stone-200 bg-white shadow-xs overflow-hidden transition-all hover:border-amber-300 space-y-4 p-4 sm:p-5"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-stone-900 flex items-center gap-1">
                        #{order.order_number}
                        <button
                          type="button"
                          onClick={() => handleCopy(order.order_number)}
                          className="text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
                          title="Copy Order ID"
                        >
                          <Copy className="size-3" />
                        </button>
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${statusCfg.badgeClass}`}
                      >
                        {isBn ? statusCfg.label_bn : statusCfg.label_en}
                      </span>

                      {/* Payment Method Badge */}
                      <span className="text-[10px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                        {order.payment_method === "razorpay"
                          ? isBn
                            ? "অনলাইন পেইড"
                            : "Online Paid"
                          : isBn
                          ? "ক্যাশ অন ডেলিভারি (COD)"
                          : "Cash on Delivery"}
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-500">
                      {isBn ? "অর্ডার তারিখ:" : "Placed on:"}{" "}
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-sm font-extrabold text-stone-900">
                      {formatINR(order.grand_total)}
                    </div>
                    <div className="text-[10px] text-stone-500">
                      {order.items?.length || 0} {isBn ? "আইটেম" : "items"}
                    </div>
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* 5-Step Sacred Consecration & Logistics Progress Bar */}
                {/* ------------------------------------------------------------- */}
                {!isCancelled && (
                  <div className="rounded-xl bg-linear-to-b from-amber-50/50 to-stone-50/80 border border-amber-200/70 p-3 sm:p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                      <span className="flex items-center gap-1.5 text-amber-900">
                        <Flame className="size-4 text-orange-600 animate-pulse" />
                        {isBn ? "লাইভ বৈদিক ডিসপ্যাচ ও ট্র্যাকিং অগ্রগতি" : "Live Consecration & Cargo Progress"}
                      </span>
                      {order.estimated_delivery_date && (
                        <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-md">
                          {isBn ? "আনুমানিক ডেলিভারি:" : "Est. Delivery:"}{" "}
                          {order.estimated_delivery_date}
                        </span>
                      )}
                    </div>

                    {/* Progress Step Nodes */}
                    <div className="relative pt-2 pb-1">
                      <div className="grid grid-cols-5 gap-1 relative z-10 text-center">
                        {/* Step 1: Placed */}
                        <div className="space-y-1">
                          <div
                            className={`size-7 sm:size-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              statusCfg.stepIndex >= 1
                                ? "bg-amber-600 text-white shadow-xs"
                                : "bg-stone-200 text-stone-500"
                            }`}
                          >
                            <Check className="size-3.5" />
                          </div>
                          <span className="block text-[9px] sm:text-[10px] font-bold text-stone-800 leading-tight">
                            {isBn ? "অর্ডার নিশ্চিত" : "Confirmed"}
                          </span>
                        </div>

                        {/* Step 2: Kashi Consecration */}
                        <div className="space-y-1">
                          <div
                            className={`size-7 sm:size-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              statusCfg.stepIndex >= 2
                                ? "bg-amber-600 text-white shadow-xs"
                                : "bg-stone-200 text-stone-500"
                            }`}
                          >
                            <Flame className="size-3.5" />
                          </div>
                          <span className="block text-[9px] sm:text-[10px] font-bold text-stone-800 leading-tight">
                            {isBn ? "কাশীতে সংকল্প" : "Kashi Pooja"}
                          </span>
                        </div>

                        {/* Step 3: Shipped */}
                        <div className="space-y-1">
                          <div
                            className={`size-7 sm:size-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              statusCfg.stepIndex >= 3
                                ? "bg-indigo-600 text-white shadow-xs"
                                : "bg-stone-200 text-stone-500"
                            }`}
                          >
                            <Plane className="size-3.5" />
                          </div>
                          <span className="block text-[9px] sm:text-[10px] font-bold text-stone-800 leading-tight">
                            {isBn ? "এয়ার কার্গো" : "Air Cargo"}
                          </span>
                        </div>

                        {/* Step 4: Out for Delivery */}
                        <div className="space-y-1">
                          <div
                            className={`size-7 sm:size-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              statusCfg.stepIndex >= 4
                                ? "bg-teal-600 text-white shadow-xs"
                                : "bg-stone-200 text-stone-500"
                            }`}
                          >
                            <Truck className="size-3.5" />
                          </div>
                          <span className="block text-[9px] sm:text-[10px] font-bold text-stone-800 leading-tight">
                            {isBn ? "ডেলিভারির পথে" : "Out for Handover"}
                          </span>
                        </div>

                        {/* Step 5: Delivered */}
                        <div className="space-y-1">
                          <div
                            className={`size-7 sm:size-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              statusCfg.stepIndex >= 5
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "bg-stone-200 text-stone-500"
                            }`}
                          >
                            <ShieldCheck className="size-3.5" />
                          </div>
                          <span className="block text-[9px] sm:text-[10px] font-bold text-stone-800 leading-tight">
                            {isBn ? "দরজায় অর্পণ" : "Delivered"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* Items List */}
                {/* ------------------------------------------------------------- */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    {isBn ? "অর্ডারকৃত প্রতিকার সামগ্রী:" : "Consecrated Items:"}
                  </span>
                  <div className="space-y-2">
                    {order.items?.map((it: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-stone-100 bg-stone-50/60"
                      >
                        <div className="flex items-center gap-3">
                          {it.featured_image ? (
                            <div className="relative size-12 rounded-lg overflow-hidden border border-stone-200 shrink-0">
                              <Image
                                src={it.featured_image}
                                alt={it.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="size-12 rounded-lg bg-stone-200 flex items-center justify-center text-stone-500 shrink-0">
                              <Package className="size-5" />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-xs text-stone-900">{it.title}</div>
                            <div className="text-[10px] text-stone-500">
                              {isBn ? "পরিমাণ:" : "Qty:"} {it.quantity} • {formatINR(it.unit_sale_price || 0)}
                            </div>
                          </div>
                        </div>
                        <div className="font-bold text-xs text-stone-900">
                          {formatINR(it.line_total || it.unit_sale_price * it.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* Free Gifts & Cashback Rewards */}
                {/* ------------------------------------------------------------- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* Complimentary Gifts */}
                  {order.free_gifts && order.free_gifts.length > 0 && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-2.5 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                        <Gift className="size-3.5 text-amber-600" />
                        {isBn ? "বিনামূল্যে প্রাপ্ত উপহার:" : "Free Sacred Gifts:"}
                      </span>
                      {order.free_gifts.map((g: any, i: number) => (
                        <p key={i} className="text-xs font-semibold text-amber-950">
                          🎁 {g.title || g.badge}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* 100% Wallet Cashback Status */}
                  {order.cashback_coins_eligible > 0 && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-2.5 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                        <Coins className="size-3.5 text-emerald-600" />
                        {isBn ? "১০০% ওয়ালেট ক্যাশব্যাক কয়েন:" : "100% Wallet Cashback:"}
                      </span>
                      {order.cashback_coins_credited > 0 ? (
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-emerald-950">
                            ✅ +{order.cashback_coins_credited} কয়েন ওয়ালেটে যোগ হয়েছে!
                          </p>
                          <Link
                            href="/astrologers"
                            className="text-[10px] text-emerald-800 underline font-bold flex items-center gap-0.5"
                          >
                            <span>পরামর্শ নিন</span>
                            <ArrowRight className="size-2.5" />
                          </Link>
                        </div>
                      ) : (
                        <p className="text-[11px] text-emerald-900 font-medium">
                          ⏳ +{order.cashback_coins_eligible} কয়েন সংরক্ষিত (সফল ডেলিভারির পর আনলক হবে)
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* ------------------------------------------------------------- */}
                {/* Devotee Vedic Sankalpa Card (Expandable) */}
                {/* ------------------------------------------------------------- */}
                {order.sankalpa && order.sankalpa.devotee_name && (
                  <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-2.5 text-xs space-y-2">
                    <button
                      type="button"
                      onClick={() => toggleSankalpa(order.id)}
                      className="w-full flex items-center justify-between text-left font-bold text-stone-800 cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5 text-amber-800">
                        <Sparkles className="size-3.5 text-amber-600" />
                        {isBn ? "কাশীর পূজার সংকল্প বিবরণ (নাম ও গোত্র)" : "Vedic Devotee Sankalpa Details"}
                      </span>
                      {expandedSankalpa[order.id] ? (
                        <ChevronUp className="size-4 text-stone-500" />
                      ) : (
                        <ChevronDown className="size-4 text-stone-500" />
                      )}
                    </button>

                    {expandedSankalpa[order.id] && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-200/80 animate-in fade-in">
                        <div>
                          <span className="text-[10px] text-stone-500 block">
                            {isBn ? "ভক্তের নাম:" : "Devotee Name:"}
                          </span>
                          <span className="font-bold text-stone-800">
                            {order.sankalpa.devotee_name}
                          </span>
                        </div>
                        {order.sankalpa.gotra && (
                          <div>
                            <span className="text-[10px] text-stone-500 block">
                              {isBn ? "গোত্র:" : "Gotra:"}
                            </span>
                            <span className="font-bold text-stone-800">
                              {order.sankalpa.gotra}
                            </span>
                          </div>
                        )}
                        {order.sankalpa.birth_nakshatra && (
                          <div>
                            <span className="text-[10px] text-stone-500 block">
                              {isBn ? "জন্ম নক্ষত্র:" : "Nakshatra:"}
                            </span>
                            <span className="font-bold text-stone-800">
                              {order.sankalpa.birth_nakshatra}
                            </span>
                          </div>
                        )}
                        {order.sankalpa.specific_wish && (
                          <div className="col-span-2">
                            <span className="text-[10px] text-stone-500 block">
                              {isBn ? "বিশেষ সংকল্প প্রার্থনা:" : "Prayer Intention:"}
                            </span>
                            <span className="font-medium text-stone-700 italic">
                              "{order.sankalpa.specific_wish}"
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* Actions & Live Courier Tracking Button */}
                {/* ------------------------------------------------------------- */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-3.5 text-stone-400" />
                    <span className="text-xs text-stone-600">
                      {order.shipping_address?.city}, {order.shipping_address?.state} ({order.shipping_address?.pincode})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Live AWB Tracking Button */}
                    {order.tracking_id && (
                      <a
                        href={order.tracking_url || `https://www.delhivery.com/track/package/${order.tracking_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-2xs"
                      >
                        <Plane className="size-3.5" />
                        <span>
                          {order.courier_partner || "Delhivery Air"} ({order.tracking_id})
                        </span>
                        <ExternalLink className="size-3" />
                      </a>
                    )}

                    {/* WhatsApp Support Button */}
                    <a
                      href={`https://wa.me/919876543210?text=Hello%20DivinLink%20Support,%20I%20need%20an%20update%20on%20my%20Order%20${order.order_number}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-all"
                    >
                      <MessageSquare className="size-3.5 text-emerald-600" />
                      <span>{isBn ? "সহায়তা" : "Support"}</span>
                    </a>

                    {/* Cancel Order Button */}
                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => {
                          setCancellingOrderId(order.id);
                          setCancelModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-all cursor-pointer"
                      >
                        <XCircle className="size-3.5" />
                        <span>{isBn ? "অর্ডার বাতিল" : "Cancel"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* 5. Cancellation Confirmation Modal */}
      {/* ------------------------------------------------------------------- */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 space-y-4 shadow-xl border border-stone-200">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <AlertCircle className="size-6" />
              </div>
              <div>
                <h3 className="font-cinzel text-base font-bold text-stone-900">
                  {isBn ? "অর্ডার বাতিল করতে চান?" : "Cancel this order?"}
                </h3>
                <p className="text-xs text-stone-500">
                  {isBn
                    ? "শিপিংয়ের পূর্বে বাতিল করলে সম্পূর্ণ মূল্য রিফান্ড পাবেন।"
                    : "Cancelling before dispatch will refund the full amount."}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-semibold">
                {isBn
                  ? "⚠️ গুরুত্বপূর্ণ নিয়মাবলী:"
                  : "⚠️ Important Policy:"}
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-800">
                <li>
                  {isBn
                    ? "এই অর্ডারের জন্য সংরক্ষিত ক্যাশব্যাক কয়েন বাতিল হবে।"
                    : "Reserved cashback coins for this order will be revoked."}
                </li>
                <li>
                  {isBn
                    ? "যদি আপনি ইতিমধ্যে ক্যাশব্যাক কয়েন কোনো পরামর্শে ব্যবহার করে থাকেন, তবে সরাসরি অর্ডার বাতিল সম্ভব হবে না।"
                    : "If cashback coins have already been spent on astrologers, online cancellation is strictly locked."}
                </li>
              </ul>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCancelModalOpen(false);
                  setCancellingOrderId(null);
                }}
                disabled={cancelMutation.isPending}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 font-bold text-xs text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                {isBn ? "না, ফিরে যান" : "Keep Order"}
              </button>
              <button
                type="button"
                onClick={() => cancellingOrderId && cancelMutation.mutate(cancellingOrderId)}
                disabled={cancelMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                {cancelMutation.isPending
                  ? isBn
                    ? "বাতিল হচ্ছে..."
                    : "Cancelling..."
                  : isBn
                  ? "হ্যাঁ, বাতিল করুন"
                  : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
