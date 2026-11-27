"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, Clock, CreditCard, Flame, Flower2, ScrollText, ShieldCheck, Wallet } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { BentoVideoStudio } from "@/components/call/bento-video-studio";
import { Badge, Button, LoadingBlock } from "@/components/ui";
import { purohitApi, walletApi, type PujaBookingData } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { useRequireAuth } from "@/providers/auth-provider";
import { usePlatform, useRealtime } from "@/providers/realtime-provider";

const RZP_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if ((window as any).Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${RZP_SRC}"]`);
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

export default function DevoteePujaVideoRoomPage() {
  const params = useParams<{ bookingId: string }>();
  const router = useRouter();
  const { ready, user } = useRequireAuth();
  const queryClient = useQueryClient();
  const bookingId = params?.bookingId || "";
  const platform = usePlatform();
  const coinsPerRupee = platform?.coins_per_rupee ?? 1;

  const [showSankalpaDrawer, setShowSankalpaDrawer] = React.useState(false);
  const [pushpanjaliPetals, setPushpanjaliPetals] = React.useState<{ id: number; left: number }[]>([]);
  const [consecratedModalOpen, setConsecratedModalOpen] = React.useState(false);
  const [remainingSeconds, setRemainingSeconds] = React.useState<number | null>(null);
  const [slaSeconds, setSlaSeconds] = React.useState<number | null>(null);
  const [isPayingRazorpay, setIsPayingRazorpay] = React.useState(false);
  const { onPujaEvent } = useRealtime();

  const {
    data: booking,
    isLoading,
    error,
    refetch,
  } = useQuery<PujaBookingData>({
    queryKey: ["purohit_booking_token", bookingId],
    queryFn: async () => {
      const res = await purohitApi.getRoomToken(bookingId);
      return ((res as any)?.data !== undefined ? (res as any).data : res) as PujaBookingData;
    },
    enabled: ready && Boolean(bookingId),
    refetchOnWindowFocus: false,
    refetchInterval: (q) => {
      const st = q.state.data?.status;
      return st === "awaiting_acceptance" || st === "awaiting_payment" || st === "confirmed" ? 2500 : false;
    },
    staleTime: 5 * 1000,
  });

  const { data: walletSummary } = useQuery({
    queryKey: ["wallet", "summary"],
    queryFn: () => walletApi.summary(),
    enabled: ready && booking?.status === "awaiting_payment",
  });
  const walletBalanceCoins = walletSummary?.wallet?.balance_coins ?? 0;

  // Preload Razorpay script while awaiting acceptance/payment
  React.useEffect(() => {
    if (booking?.status === "awaiting_acceptance" || booking?.status === "awaiting_payment") {
      void loadRazorpay();
    }
  }, [booking?.status]);

  const cancelMutation = useMutation({
    mutationFn: async () => purohitApi.cancelBooking(bookingId),
    onSuccess: (updated) => {
      toast.info(updated?.cancel_reason || "অনুরোধ বাতিল করা হয়েছে।");
      void refetch();
      router.replace("/purohits");
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to cancel booking");
    },
  });

  const walletPayMutation = useMutation({
    mutationFn: async () => {
      const res = await purohitApi.payWallet(bookingId);
      return ((res as any)?.data !== undefined ? (res as any).data : res) as PujaBookingData;
    },
    onSuccess: () => {
      toast.success("ওয়ালেট পেমেন্ট সম্পন্ন! লাইভ পূজা রুমে প্রবেশ করা হচ্ছে...");
      void queryClient.invalidateQueries({ queryKey: ["wallet", "summary"] });
      void refetch();
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "ওয়ালেট পেমেন্ট ব্যর্থ হয়েছে");
      void refetch();
    },
  });

  const handleRazorpayPay = async () => {
    if (!booking || slaSeconds === 0) return;
    setIsPayingRazorpay(true);
    try {
      const orderRes = await purohitApi.createPaymentOrder(booking.id);
      const orderBooking = ((orderRes as any)?.data !== undefined ? (orderRes as any).data : orderRes) as PujaBookingData;
      if (!orderBooking?.razorpay_order_id || !orderBooking?.razorpay_key_id) {
        toast.error("পেমেন্ট অর্ডার তৈরি করা যায়নি।");
        setIsPayingRazorpay(false);
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded || !(window as any).Razorpay) {
        toast.error("Razorpay লোড ব্যর্থ হয়েছে। ইন্টারনেট পরীক্ষা করুন।");
        setIsPayingRazorpay(false);
        return;
      }

      const rzp = new (window as any).Razorpay({
        key: orderBooking.razorpay_key_id,
        order_id: orderBooking.razorpay_order_id,
        amount: Math.round(orderBooking.amount_inr * 100),
        currency: "INR",
        name: "DivinLink Vedic Purohit",
        description: `${orderBooking.puja_name} (${orderBooking.booking_number})`,
        image: "/icon.png",
        prefill: {
          name: orderBooking.sankalpa_name || user?.full_name || "",
          email: user?.email || "",
          contact: (user as any)?.phone || "",
        },
        theme: { color: "#059669" },
        handler: async (response: {
          razorpay_order_id?: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            toast.loading("পেমেন্ট যাচাই হচ্ছে...", { id: "puja-pay-verify" });
            const verifiedRes = await purohitApi.verifyPayment(orderBooking.id, {
              razorpay_order_id: response.razorpay_order_id || orderBooking.razorpay_order_id || "",
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            const verified = ((verifiedRes as any)?.data !== undefined ? (verifiedRes as any).data : verifiedRes) as PujaBookingData;
            toast.dismiss("puja-pay-verify");
            if (verified?.status === "cancelled" || verified?.payment_status === "refunded") {
              toast.error(
                verified?.cancel_reason || "সময়সীমা শেষ হয়ে যাওয়ায় আপনার টাকা ১০০% রিফান্ড করা হয়েছে।",
              );
            } else {
              toast.success("পেমেন্ট সম্পন্ন! পুরোহিতজীর লাইভ রুমে প্রবেশ করছেন...");
            }
            void refetch();
          } catch (err) {
            toast.dismiss("puja-pay-verify");
            toast.error(err instanceof ApiError ? err.message : "পেমেন্ট যাচাই ব্যর্থ হয়েছে");
            void refetch();
          } finally {
            setIsPayingRazorpay(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPayingRazorpay(false);
          },
        },
      });
      rzp.on("payment.failed", (resp: any) => {
        setIsPayingRazorpay(false);
        toast.error(resp?.error?.description || "পেমেন্ট ব্যর্থ হয়েছে।");
      });
      rzp.open();
    } catch (err) {
      setIsPayingRazorpay(false);
      toast.error(err instanceof ApiError ? err.message : "পেমেন্ট শুরু করা যায়নি");
      void refetch();
    }
  };

  const completeMutation = useMutation({
    mutationFn: async () => purohitApi.completeBooking(bookingId),
    onSuccess: () => {
      setConsecratedModalOpen(true);
      toast.success("পবিত্র পূজা সফলভাবে সম্পন্ন ও প্রতিষ্ঠিত হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["purohit_booking_token", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["purohits_list"] });
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to complete puja");
    },
  });

  React.useEffect(() => {
    return onPujaEvent((msg) => {
      if (String(msg.data.booking?.id) !== bookingId) return;
      if (msg.data.event === "puja_accepted_for_payment") {
        toast.success("পুরোহিতজী অনুরোধ গ্রহণ করেছেন! ৯০ সেকেন্ডের মধ্যে পেমেন্ট করে রুমে ঢুকুন।");
        void refetch();
      } else if (msg.data.event === "puja_accepted") {
        toast.success("লাইভ পূজা রুম শুরু হচ্ছে!");
        void refetch();
      } else if (msg.data.event === "puja_declined" || msg.data.event === "puja_expired") {
        toast.error(msg.data.booking?.cancel_reason || "পুরোহিত অনুরোধটি গ্রহণ করতে পারেননি বা সময় শেষ হয়েছে।");
        void refetch();
      } else if (msg.data.event === "puja_ended") {
        setConsecratedModalOpen(true);
        void queryClient.invalidateQueries({ queryKey: ["purohit_booking_token", bookingId] });
      }
    });
  }, [bookingId, onPujaEvent, queryClient, refetch]);

  // Countdown for 45s Accept SLA & 90s Payment Window
  React.useEffect(() => {
    const targetIso =
      booking?.status === "awaiting_acceptance"
        ? booking.accept_expires_at
        : booking?.status === "awaiting_payment"
        ? booking.payment_expires_at
        : null;
    if (!targetIso) {
      setSlaSeconds(null);
      return;
    }
    const ms = Date.parse(targetIso);
    if (Number.isNaN(ms)) return;
    const tick = () => {
      const s = Math.max(0, Math.floor((ms - Date.now()) / 1000));
      setSlaSeconds(s);
      if (s === 0) void refetch();
    };
    tick();
    const t = window.setInterval(tick, 1000);
    return () => window.clearInterval(t);
  }, [booking?.status, booking?.accept_expires_at, booking?.payment_expires_at, refetch]);

  React.useEffect(() => {
    if (!booking?.expires_at || booking.status !== "in_progress") return;
    const expiryMs = Date.parse(booking.expires_at);
    if (Number.isNaN(expiryMs)) return;

    const tick = () => {
      const secs = Math.max(0, Math.floor((expiryMs - Date.now()) / 1000));
      setRemainingSeconds(secs);
      if (secs === 0 && !consecratedModalOpen) {
        setConsecratedModalOpen(true);
        toast.info("নির্ধারিত পূজার সময় সম্পূর্ণ হয়েছে।");
      }
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [booking?.expires_at, booking?.status, consecratedModalOpen]);

  const handleOfferPushpanjali = () => {
    const newPetals = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 80 + 10,
    }));
    setPushpanjaliPetals((prev) => [...prev, ...newPetals]);
    toast.success("🌸 যজ্ঞের বেদীতে ও দেবতার শ্রীচরণে পুষ্পাঞ্জলি নিবেদন সফল হয়েছে!");
    setTimeout(() => {
      setPushpanjaliPetals((prev) => prev.filter((p) => !newPetals.some((np) => np.id === p.id)));
    }, 3500);
  };

  if (!ready || isLoading) {
    return (
      <div className="min-h-screen bg-[#061311] flex items-center justify-center text-white p-4">
        <LoadingBlock label="পবিত্র ভার্চুয়াল মন্দির ও হোম চেম্বারে সংযোগ স্থাপন করা হচ্ছে..." />
      </div>
    );
  }

  const preLiveState =
    booking?.status === "awaiting_acceptance" || booking?.status === "awaiting_payment";

  if (error || !booking || (!preLiveState && booking.status !== "confirmed" && (!booking.zego_token || !booking.zego_app_id)) || !user?.id) {
    return (
      <div className="min-h-screen bg-[#061311] flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="max-w-md w-full rounded-3xl bg-[#0B1E1B] border border-[#1E3B36] p-7 space-y-4 shadow-2xl">
          <div className="size-16 rounded-full bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300 mx-auto">
            <Flame className="size-8" />
          </div>
          <h2 className="text-xl font-bold font-serif text-emerald-200">
            অনুরোধ বাতিল বা সমাপ্ত হয়েছে
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed">
            {error instanceof Error
              ? error.message
              : "এই পূজার অনুরোধ বা সময়সীমা শেষ হয়েছে। কোনো টাকা কাটা হয়ে থাকলে ১০০% অটো-রিফান্ড নিশ্চিত করা হয়েছে।"}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/purohits">
              <Button variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                অন্য অনলাইন পুরোহিত দেখুন &rarr;
              </Button>
            </Link>
            <Link href="/account/purohit-bookings">
              <Button variant="outline" size="sm" className="bg-[#0E2421] text-white border-[#1E3B36]">
                <ArrowLeft className="size-4 mr-1.5" />
                আমার বুকিং
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isPurohit =
    user.id === booking.purohit_user_id ||
    user.id === booking.purohit_id ||
    (user as any)?.role === "purohit";
  const isCompleted = booking.status === "completed";

  // Pay-After-Accept Phase 1: Waiting for Purohit acceptance (₹0 charged yet)
  if (booking.status === "awaiting_acceptance" && !isPurohit) {
    const secs = slaSeconds ?? 45;
    return (
      <div className="min-h-screen bg-[#061311] flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="max-w-md w-full rounded-3xl bg-[#0B1E1B] border border-[#1E3B36] p-7 space-y-5 shadow-2xl">
          <div className="size-16 rounded-full bg-emerald-500/15 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-300 animate-pulse">
            <Flame className="size-8" />
          </div>
          <div className="space-y-2">
            <Badge tone="neutral" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs font-bold font-mono">
              <Clock className="size-3.5 mr-1 inline" />
              অপেক্ষা: {secs} সেকেন্ড · ₹0 কাটা হয়েছে
            </Badge>
            <h2 className="text-xl font-bold font-serif text-emerald-200">
              {booking.purohit_name}-কে অনুরোধ পাঠানো হয়েছে
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed">
              পুরোহিতজী অনুরোধ গ্রহণ করলে তবেই এখানে <b>₹{booking.amount_inr}</b> পেমেন্ট করার অপশন আসবে। তিনি ব্যস্ত থাকলে কোনো টাকা কাটা ছাড়াই অনুরোধ বাতিল হবে।
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-[#0E2421] border border-[#1E3B36] text-xs text-stone-300 text-left space-y-1">
            <div><span className="text-stone-400">পূজা:</span> <b>{booking.puja_name} ({booking.puja_duration_minutes} মি.)</b></div>
            <div><span className="text-stone-400">সংকল্প নাম:</span> <b>{booking.sankalpa_name}</b></div>
            <div><span className="text-stone-400">গোত্র:</span> <b>{booking.sankalpa_gotra || "Kashyapa"}</b></div>
            <div><span className="text-stone-400">অনুরোধ নম্বর:</span> <span className="font-mono">{booking.booking_number}</span></div>
          </div>
          <div className="flex justify-center gap-3 pt-1">
            <Button
              variant="outline"
              size="sm"
              loading={cancelMutation.isPending}
              onClick={() => cancelMutation.mutate()}
              className="border-rose-500/40 text-rose-300 hover:bg-rose-950/40 text-xs font-bold"
            >
              অনুরোধ বাতিল করুন
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="border-emerald-500/40 text-emerald-200 hover:bg-emerald-950/50 text-xs"
            >
              রিফ্রেশ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Pay-After-Accept Phase 2: Purohit ACCEPTED -> 90s Checkout Screen
  if (booking.status === "awaiting_payment" && !isPurohit) {
    const secs = slaSeconds ?? 90;
    const mm = String(Math.floor(secs / 60)).padStart(2, "0");
    const ss = String(secs % 60).padStart(2, "0");
    const coinsRequired = Math.max(1, Math.round(booking.amount_inr * coinsPerRupee));
    const canAffordWallet = walletBalanceCoins >= coinsRequired;
    const windowClosed = secs === 0;

    return (
      <div className="min-h-screen bg-[#061311] flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="max-w-md w-full rounded-3xl bg-[#0B1E1B] border-2 border-emerald-400/50 p-7 space-y-5 shadow-2xl">
          <div className="size-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-300">
            <ShieldCheck className="size-8" />
          </div>
          <div className="space-y-2">
            <Badge
              tone="neutral"
              className={`text-xs font-extrabold font-mono ${
                secs <= 20
                  ? "bg-rose-500/25 text-rose-200 border-rose-400 animate-pulse"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-400/50"
              }`}
            >
              <Clock className="size-3.5 mr-1 inline" />
              পেমেন্ট সময়: {mm}:{ss} বাকি
            </Badge>
            <h2 className="text-xl font-bold font-serif text-emerald-200">
              {booking.purohit_name} প্রস্তুত আছেন!
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed">
              {windowClosed
                ? "৯০ সেকেন্ডের পেমেন্ট সময়সীমা শেষ হয়েছে।"
                : `এখনই ₹${booking.amount_inr} দক্ষিণা পেমেন্ট করে ${booking.puja_name} (${booking.puja_duration_minutes} মিনিট) লাইভ রুমে প্রবেশ করুন।`}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0E2421] border border-[#1E3B36] text-xs text-stone-300 text-left space-y-1">
            <div className="flex justify-between">
              <span className="text-stone-400">পূজা:</span>
              <b>{booking.puja_name} ({booking.puja_duration_minutes} মি.)</b>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">দক্ষিণা:</span>
              <b className="text-amber-300 text-sm">₹{booking.amount_inr}</b>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">সংকল্প নাম:</span>
              <b>{booking.sankalpa_name} ({booking.sankalpa_gotra || "Kashyapa"})</b>
            </div>
          </div>

          <div className="space-y-2.5">
            <Button
              variant="primary"
              size="md"
              disabled={windowClosed || isPayingRazorpay || walletPayMutation.isPending}
              loading={isPayingRazorpay}
              onClick={handleRazorpayPay}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#061311] font-extrabold text-sm py-3 shadow-lg shadow-emerald-500/25"
            >
              <CreditCard className="size-4 mr-2" />
              {windowClosed ? "সময় শেষ হয়েছে" : `UPI / Card দিয়ে পে করুন (₹${booking.amount_inr})`}
            </Button>

            <Button
              variant="outline"
              size="md"
              disabled={windowClosed || !canAffordWallet || isPayingRazorpay || walletPayMutation.isPending}
              loading={walletPayMutation.isPending}
              onClick={() => walletPayMutation.mutate()}
              className="w-full border-emerald-500/40 bg-[#0E2421] hover:bg-[#14332E] text-emerald-200 font-bold text-xs py-2.5"
            >
              <Wallet className="size-4 mr-2 text-amber-300" />
              Wallet Coins দিয়ে পে করুন ({coinsRequired} কয়েন · ব্যালেন্স: {walletBalanceCoins})
            </Button>

            <Button
              variant="ghost"
              size="sm"
              loading={cancelMutation.isPending}
              onClick={() => cancelMutation.mutate()}
              className="w-full text-stone-400 hover:text-rose-300 text-xs"
            >
              বাতিল করুন ও তালিকায় ফিরুন
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Legacy pre-paid waiting screen while awaiting Purohit to accept
  if (booking.status === "confirmed" && !isPurohit) {
    return (
      <div className="min-h-screen bg-[#061311] flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="max-w-md w-full rounded-3xl bg-[#0B1E1B] border border-[#1E3B36] p-7 space-y-5 shadow-2xl">
          <div className="size-16 rounded-full bg-emerald-500/15 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-300 animate-pulse">
            <Flame className="size-8" />
          </div>
          <div className="space-y-2">
            <Badge tone="neutral" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs font-bold">
              পেমেন্ট সম্পন্ন · ₹{booking.amount_inr}
            </Badge>
            <h2 className="text-xl font-bold font-serif text-emerald-200">
              {booking.purohit_name}-কে পূজার অনুরোধ পাঠানো হয়েছে
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed">
              পুরোহিতজী অনুরোধটি গ্রহণ করলেই <b>{booking.puja_name} ({booking.puja_duration_minutes} মিনিট)</b> লাইভ ভিডিও রুম শুরু হবে। পুরোহিতজী যুক্ত না হলে সম্পূর্ণ টাকা অটো-রিফান্ড হবে।
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-1">
            <Button
              variant="outline"
              size="sm"
              loading={cancelMutation.isPending}
              onClick={() => cancelMutation.mutate()}
              className="border-rose-500/40 text-rose-300 hover:bg-rose-950/40 text-xs font-bold"
            >
              বাতিল ও রিফান্ড নিন
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="border-emerald-500/40 text-emerald-200 hover:bg-emerald-950/50 text-xs"
            >
              রিফ্রেশ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const credentials = {
    app_id: booking.zego_app_id ?? 0,
    token: booking.zego_token ?? "",
    room_id: booking.room_id,
    user_id: user.id,
    user_name: user.full_name || (isPurohit ? `Purohit ${booking.purohit_name}` : booking.sankalpa_name || "ভক্ত"),
  };

  const timerText =
    remainingSeconds !== null && !isCompleted
      ? `${String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:${String(remainingSeconds % 60).padStart(2, "0")}`
      : isCompleted
      ? "CONSECRATED"
      : `${booking.puja_duration_minutes}:00`;

  const peerUserId = isPurohit ? booking.user_id : booking.purohit_user_id;
  const peerName = isPurohit ? booking.sankalpa_name || booking.user_name : booking.purohit_name;
  const peerRoleLabel = isPurohit ? "যজমান / ভক্ত" : "বৈদিক পুরোহিত (Presiding Purohit)";

  return (
    <>
      <BentoVideoStudio
        credentials={credentials}
        sessionId={booking.id}
        peerUserId={peerUserId}
        peerName={peerName}
        peerRoleLabel={peerRoleLabel}
        selfName={user.full_name || booking.sankalpa_name || "You"}
        selfRoleLabel={isPurohit ? "Presiding Purohit" : "যজমান (Devotee)"}
        selfAvatarUrl={user.avatar_url}
        title={booking.puja_name}
        subtitle={`পুরোহিত: ${booking.purohit_name} · বুকিং #${booking.booking_number}`}
        timerText={timerText}
        timerWarning={remainingSeconds !== null && remainingSeconds <= 120}
        onLeave={() => router.push("/purohits")}
        checklistTitle="ভক্তের পূজা প্রস্তুতি (Puja Preparation)"
        initialTasks={[
          { id: "seat", label: "পূর্ব বা উত্তর মুখে শুদ্ধ আসনে বসা", defaultDone: true },
          { id: "diya", label: "ঘৃত প্রদীপ ও ধূপ প্রজ্বলন করা" },
          { id: "water", label: "আচমনীয় জল ও পুষ্প-পাত্র প্রস্তুত রাখা" },
          { id: "sankalpa", label: `সংকল্প গ্রহণ (${booking.sankalpa_name})` },
          { id: "aarti", label: "পুষ্পাঞ্জলি ও আশীর্বাদ গ্রহণ" },
        ]}
        leftExtra={
          <div className="space-y-1 text-[11px] text-emerald-100/80">
            <p><span className="text-emerald-300 font-bold">সংকল্প নাম:</span> {booking.sankalpa_name}</p>
            <p><span className="text-emerald-300 font-bold">গোত্র:</span> {booking.sankalpa_gotra || "Kashyapa"}</p>
          </div>
        }
        headerActions={
          <div className="flex items-center gap-2">
            {!isPurohit && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleOfferPushpanjali}
                className="border-pink-400/40 bg-pink-500/15 text-pink-200 hover:bg-pink-500/25 text-xs font-bold"
              >
                <Flower2 className="size-3.5 mr-1 text-pink-300" />
                পুষ্পাঞ্জলি
              </Button>
            )}
            {isPurohit && !isCompleted && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (confirm("আপনি কি নিশ্চিত যে বৈদিক পূজা সম্পূর্ণ হয়েছে?")) {
                    completeMutation.mutate();
                  }
                }}
                loading={completeMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                <CheckCircle2 className="size-3.5 mr-1" />
                Complete
              </Button>
            )}
          </div>
        }
        sideActions={[
          {
            id: "pushpanjali",
            icon: <Flower2 className="size-4 text-pink-300" />,
            title: "পুষ্পাঞ্জলি নিবেদন",
            onClick: handleOfferPushpanjali,
          },
          {
            id: "sankalpa",
            icon: <ScrollText className="size-4" />,
            title: "সংকল্প ও মন্ত্র বিবরণ",
            active: showSankalpaDrawer,
            onClick: () => setShowSankalpaDrawer((v) => !v),
          },
        ]}
        onToggleToolsDrawer={() => setShowSankalpaDrawer((v) => !v)}
        toolsDrawerActive={showSankalpaDrawer}
        bottomBannerText={`"ॐ सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके..." — ${booking.purohit_name} আপনার নাম [${booking.sankalpa_name}] ও গোত্র [${booking.sankalpa_gotra || "Kashyapa"}]-এ লাইভ ${booking.puja_name} পরিচালনা করছেন।`}
        stageOverlay={
          pushpanjaliPetals.length > 0 ? (
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
              {pushpanjaliPetals.map((petal) => (
                <div
                  key={petal.id}
                  style={{
                    left: `${petal.left}%`,
                    animationDuration: `${2 + (petal.id % 10) / 10}s`,
                  }}
                  className="absolute -top-6 text-xl animate-fall"
                >
                  🌸
                </div>
              ))}
            </div>
          ) : undefined
        }
        rightDrawer={
          showSankalpaDrawer ? (
            <aside className="absolute right-0 top-0 bottom-0 w-full sm:w-80 bg-[#0A1A18]/95 backdrop-blur-xl border-l border-[#1E3B36] p-4 z-30 flex flex-col gap-3 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#1E3B36] pb-2">
                <span className="text-xs font-bold text-emerald-300">বৈদিক সংকল্প ও তথ্য</span>
                <button
                  type="button"
                  onClick={() => setShowSankalpaDrawer(false)}
                  className="text-xs text-stone-400 hover:text-white cursor-pointer"
                >
                  Close &times;
                </button>
              </div>
              <div className="rounded-xl bg-[#0F2623] border border-[#244741] p-3 text-xs space-y-1.5">
                <p><span className="text-stone-400">যজমান:</span> <b className="text-amber-200">{booking.sankalpa_name}</b></p>
                <p><span className="text-stone-400">গোত্র:</span> <b>{booking.sankalpa_gotra || "Kashyapa"}</b></p>
                {booking.sankalpa_wish && <p className="italic text-emerald-200/80">"{booking.sankalpa_wish}"</p>}
              </div>
            </aside>
          ) : undefined
        }
      />

      {consecratedModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-[#0B1E1B] border-2 border-emerald-500/50 p-6 text-center shadow-2xl space-y-4 text-white">
            <div className="size-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="size-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-emerald-200">
                পবিত্র পূজা সফলভাবে প্রতিষ্ঠিত ও সমর্পিত!
              </h3>
              <p className="text-xs text-stone-300">
                {booking.sankalpa_name}-এর উদ্দেশ্যে অনুষ্ঠিত {booking.puja_name} সম্পূর্ণ হয়েছে। দেব-দেবীর অনন্ত আশীর্বাদ ভক্তের জীবনে বর্ষিত হোক।
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/20 text-xs text-amber-200 font-serif">
              "ॐ द्यौः शान्तिरन्तरिक्षं शान्तिः... ॐ शान्तिः शान्तिः शान्तिः॥"
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push(isPurohit ? "/purohit-dashboard/bookings" : "/purohits")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2"
            >
              {isPurohit ? "ড্যাশবোর্ডে ফিরুন" : "আশীর্বাদ গ্রহণ করুন ও সমাপ্ত করুন"}
            </Button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(85vh) rotate(360deg); opacity: 0; }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </>
  );
}
