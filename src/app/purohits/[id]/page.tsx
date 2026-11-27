"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Globe,
  HeartHandshake,
  MapPin,
  Phone,
  Radio,
  ScrollText,
  Sparkles,
  Star,
  User,
  Video,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Avatar, Badge, Button, Card, CardBody, CardHeader, CardTitle, LoadingBlock, Modal } from "@/components/ui";
import { purohitApi, walletApi, type PujaBookingData, type PurohitData, type PurohitPujaItem } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/providers/auth-provider";
import { usePlatform } from "@/providers/realtime-provider";

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

export default function PurohitDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isSignedIn } = useAuth();

  const idOrSlug = params.id;
  const platform = usePlatform();
  const coinsPerRupee = platform?.coins_per_rupee ?? 1;

  // Selected puja for booking modal
  const [selectedPuja, setSelectedPuja] = React.useState<PurohitPujaItem | null>(null);
  const [sankalpaName, setSankalpaName] = React.useState(user?.full_name || "");
  const [sankalpaGotra, setSankalpaGotra] = React.useState("Kashyapa");
  const [sankalpaWish, setSankalpaWish] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState<"razorpay" | "wallet">("razorpay");
  const [isVerifyingPayment, setIsVerifyingPayment] = React.useState(false);

  const { data: walletSummary } = useQuery({
    queryKey: ["wallet", "summary"],
    queryFn: () => walletApi.summary(),
    enabled: isSignedIn,
  });
  const walletBalanceCoins = walletSummary?.wallet?.balance_coins ?? 0;

  // Update devotee name once user auth loads
  React.useEffect(() => {
    if (user?.full_name && !sankalpaName) {
      setSankalpaName(user.full_name);
    }
  }, [user, sankalpaName]);

  // Fetch Purohit Profile
  const { data: purohit, isLoading, error } = useQuery<PurohitData>({
    queryKey: ["purohit_detail", idOrSlug],
    queryFn: async () => {
      const res = await purohitApi.get(idOrSlug);
      return (res as any)?.data || res;
    },
    enabled: Boolean(idOrSlug),
  });

  // Booking Mutation
  const bookMutation = useMutation({
    mutationFn: async (payload: {
      purohit_id: string;
      puja_item_id: string;
      sankalpa_name: string;
      sankalpa_gotra: string;
      sankalpa_wish?: string;
      payment_method: "razorpay" | "wallet";
    }) => {
      const res = await purohitApi.book(payload);
      return (res as any)?.data || res;
    },
    onSuccess: async (booking: PujaBookingData) => {
      if (booking.payment_status === "paid") {
        toast.success("পূজা বুকিং ও পেমেন্ট সফল হয়েছে! ভিডিও রুমে প্রবেশ করা হচ্ছে...");
        setSelectedPuja(null);
        router.push(`/purohit-booking/${booking.id}/room`);
        return;
      }

      if (!booking.razorpay_order_id || !booking.razorpay_key_id) {
        toast.error("পেমেন্ট গেটওয়ে অর্ডার শুরু করা যায়নি। অনুগ্রহ করে পরে চেষ্টা করুন।");
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded || !(window as any).Razorpay) {
        toast.error("পেমেন্ট গেটওয়ে লোড ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।");
        return;
      }

      setIsVerifyingPayment(true);
      const rzp = new (window as any).Razorpay({
        key: booking.razorpay_key_id,
        order_id: booking.razorpay_order_id,
        amount: Math.round(booking.amount_inr * 100),
        currency: "INR",
        name: "DivinLink Vedic Purohit",
        description: `${booking.puja_name} (${booking.booking_number})`,
        image: "/icon.png",
        prefill: {
          name: sankalpaName.trim() || user?.full_name || "",
          email: user?.email || "",
          contact: (user as any)?.phone || "",
        },
        theme: { color: "#d97706" },
        handler: async (response: {
          razorpay_order_id?: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            toast.loading("পেমেন্ট যাচাই হচ্ছে...", { id: "puja-rzp-verify" });
            const verified = await purohitApi.verifyPayment(booking.id, {
              razorpay_order_id: response.razorpay_order_id || booking.razorpay_order_id || "",
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.dismiss("puja-rzp-verify");
            if (verified?.status === "cancelled" || verified?.payment_status === "refunded") {
              toast.error(
                verified?.cancel_reason ||
                  "পুরোহিতজী এই মুহূর্তে অন্য পূজায় ব্যস্ত হয়ে গেছেন। আপনার টাকা ১০০% রিফান্ড করা হয়েছে।"
              );
              setSelectedPuja(null);
              return;
            }
            if (verified?.payment_status !== "paid") {
              toast.error("পেমেন্ট নিশ্চিত করা যায়নি।");
              return;
            }
            toast.success("পেমেন্ট সম্পন্ন! পুরোহিতজীর সাথে লাইভ রুমে সংযুক্ত হচ্ছেন...");
            setSelectedPuja(null);
            router.push(`/purohit-booking/${booking.id}/room`);
          } catch (err) {
            toast.dismiss("puja-rzp-verify");
            const msg = err instanceof ApiError ? err.message : "পেমেন্ট যাচাই ব্যর্থ হয়েছে";
            toast.error(msg);
          } finally {
            setIsVerifyingPayment(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsVerifyingPayment(false);
            toast.info("পেমেন্ট বাতিল করা হয়েছে। আমার বুকিং পেজ থেকে পরে সম্পূর্ণ করতে পারবেন।");
          },
        },
      });
      rzp.on("payment.failed", (resp: any) => {
        setIsVerifyingPayment(false);
        toast.error(resp?.error?.description || "পেমেন্ট ব্যর্থ হয়েছে।");
      });
      rzp.open();
    },
    onError: (err) => {
      setIsVerifyingPayment(false);
      const msg = err instanceof ApiError ? err.message : "পূজা বুকিং করতে সমস্যা হয়েছে";
      toast.error(msg);
    },
  });

  const handleOpenBooking = (puja: PurohitPujaItem) => {
    if (!isSignedIn) {
      toast.info("পূজা বুক করার আগে লগইন করুন");
      router.push(`/login?redirect=/purohits/${idOrSlug}`);
      return;
    }
    void loadRazorpay();
    setSelectedPuja(puja);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purohit || !selectedPuja) return;

    if (!sankalpaName.trim()) {
      toast.error("ভক্তের নাম প্রদান করুন");
      return;
    }
    if (!sankalpaGotra.trim()) {
      toast.error("গোত্র প্রদান করুন (অজানা থাকলে কাশ্যপ লিখুন)");
      return;
    }
    const coinsRequired = Math.max(1, Math.round(selectedPuja.price_inr * coinsPerRupee));
    if (paymentMethod === "wallet" && walletBalanceCoins < coinsRequired) {
      toast.error(`ওয়ালেটে পর্যাপ্ত কয়েন নেই (প্রয়োজন: ${coinsRequired} কয়েন)`);
      return;
    }

    bookMutation.mutate({
      purohit_id: purohit.id,
      puja_item_id: selectedPuja.id,
      sankalpa_name: sankalpaName.trim(),
      sankalpa_gotra: sankalpaGotra.trim(),
      sankalpa_wish: sankalpaWish.trim() || undefined,
      payment_method: paymentMethod,
    });
  };

  if (isLoading && !purohit) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center">
        <LoadingBlock label="পুরোহিতের প্রোফাইল ও পূজার তালিকা লোড হচ্ছে..." />
      </div>
    );
  }

  if (error || !purohit) {
    return (
      <div className="min-h-screen py-24 px-4 text-center max-w-md mx-auto">
        <Flame className="size-12 text-stone-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-stone-800 dark:text-white">পুরোহিত খুঁজে পাওয়া যায়নি</h2>
        <p className="text-xs text-stone-500 mt-1 mb-4">অনুরোধকৃত পুরোহিতের প্রোফাইল বর্তমানে অনুপলব্ধ।</p>
        <Link href="/purohits">
          <Button variant="outline" size="sm">
            <ArrowLeft className="size-4 mr-1.5" />
            সব পুরোহিতদের তালিকায় ফিরে যান
          </Button>
        </Link>
      </div>
    );
  }

  const activePujas = (purohit.pujas || []).filter((p: PurohitPujaItem) => p.is_active);

  return (
    <div className="min-h-screen bg-stone-50/50 dark:bg-stone-950 pb-24">
      {/* ------------------------------------------------------------- */}
      {/* BREADCRUMB & BACK NAV                                         */}
      {/* ------------------------------------------------------------- */}
      <div className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link
            href="/purohits"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>সমস্ত পুরোহিতদের তালিকা</span>
          </Link>

          {purohit.is_busy ? (
            <Badge tone="neutral" className="bg-amber-100 text-amber-900 border-amber-300 font-bold text-xs">
              🟡 অন্য লাইভ পূজায় ব্যস্ত (Busy Now)
            </Badge>
          ) : purohit.is_online ? (
            <Badge tone="neutral" className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold text-xs">
              🟢 লাইভ অনলাইন (পূজার জন্য প্রস্তুত)
            </Badge>
          ) : (
            <Badge tone="neutral" className="bg-stone-100 text-stone-500 border-stone-200 text-xs">
              ⚪ অফলাইন
            </Badge>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PUROHIT PROFILE HERO CARD                                     */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xl shadow-stone-200/40 dark:shadow-none">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="relative">
                <Avatar
                  src={purohit.avatar_url || undefined}
                  name={purohit.display_name}
                  size="xl"
                  className="ring-4 ring-amber-400/40 size-24 sm:size-28"
                />
                {purohit.is_online && (
                  <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-white dark:ring-stone-900">
                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
                    {purohit.display_name}
                  </h1>
                  {purohit.is_verified && (
                    <CheckCircle2 className="size-5 text-emerald-600" />
                  )}
                </div>

                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Flame className="size-4" />
                  <span>{purohit.title || "Vedic Acharya & Senior Purohit"}</span>
                </p>

                <div className="flex items-center gap-3 text-xs text-stone-500 pt-1">
                  <div className="flex items-center gap-1">
                    <Star className="size-3.5 fill-amber-400 text-amber-500" />
                    <span className="font-bold text-stone-900 dark:text-white">
                      {purohit.rating && purohit.rating > 0 ? purohit.rating.toFixed(1) : "নতুন"}
                    </span>
                    <span>({purohit.total_reviews ?? 0} রিভিউ)</span>
                  </div>
                  <span>•</span>
                  <span>{purohit.experience_years} বছরের অভিজ্ঞতা</span>
                  {purohit.city && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="size-3" />
                        {purohit.city}, {purohit.state || "India"}
                      </span>
                    </>
                  )}
                </div>

                {purohit.languages?.length > 0 && (
                  <p className="text-xs text-stone-500 flex items-center gap-1 pt-1">
                    <Globe className="size-3.5 text-stone-400" />
                    <span>ভাষা: <b>{purohit.languages.join(", ")}</b></span>
                  </p>
                )}
              </div>
            </div>

            {/* Quick Stats Block */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 w-full md:w-auto justify-around md:justify-start">
              <div className="text-center px-3">
                <span className="block text-xl font-black text-amber-900 dark:text-amber-200">
                  {purohit.total_pujas_performed || 48}+
                </span>
                <span className="text-[11px] text-stone-500 font-medium">সম্পন্ন পূজা</span>
              </div>
              <div className="h-8 w-px bg-amber-200 dark:bg-amber-800" />
              <div className="text-center px-3">
                <span className="block text-xl font-black text-emerald-600 dark:text-emerald-400">
                  ₹{purohit.starting_price_inr}
                </span>
                <span className="text-[11px] text-stone-500 font-medium">দক্ষিণা শুরু</span>
              </div>
            </div>
          </div>

          {/* Bio text if present */}
          {purohit.bio && (
            <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              <p>{purohit.bio}</p>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PUJA & DAKSHINA CATALOG                                       */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2">
              <BookOpen className="size-5 text-amber-600" />
              <span>পূজা ও দক্ষিণা ক্যাটালগ (Puja Catalog)</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              পুরোহিতের নির্ধারিত দক্ষিণা ও সময়কাল অনুসারে আপনার পছন্দের পূজা নির্বাচন করে সরাসরি লাইভ সংকল্প গ্রহণ করুন।
            </p>
          </div>
          <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-300">
            {activePujas.length} টি পূজা সেবা উপলব্ধ
          </span>
        </div>

        {activePujas.length === 0 ? (
          <Card className="p-10 text-center border-dashed border-stone-300 dark:border-stone-700">
            <p className="text-sm font-bold text-stone-700 dark:text-stone-300">
              এই পুরোহিতের ক্যাটালগে বর্তমানে কোনো সক্রিয় পূজা নেই।
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activePujas.map((puja: PurohitPujaItem) => (
              <Card
                key={puja.id}
                className="border-2 border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-600 transition-all rounded-2xl overflow-hidden bg-white dark:bg-stone-900 flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-lg text-stone-900 dark:text-white">
                        {puja.puja_name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                        <Clock className="size-3.5 text-amber-600" />
                        <span>সময়সীমা: <b>{puja.duration_minutes} মিনিট</b></span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block">
                        ₹{puja.price_inr}
                      </span>
                      <span className="text-[10px] text-stone-400 font-bold uppercase">Dakshina</span>
                    </div>
                  </div>

                  {puja.description && (
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      {puja.description}
                    </p>
                  )}

                  {puja.samagri_notes && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
                      <div className="font-bold flex items-center gap-1">
                        <Sparkles className="size-3 text-amber-600" />
                        <span>ভক্তের প্রয়োজনীয় সামগ্রী:</span>
                      </div>
                      <p className="leading-relaxed">{puja.samagri_notes}</p>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-stone-50/80 dark:bg-stone-900/40 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
                  <div className="text-xs text-stone-500">
                    <span>
                      {purohit.is_busy
                        ? "পুরোহিতজী এখন অন্য পূজায় ব্যস্ত"
                        : purohit.is_online
                        ? "ভিডিওতে ২-ওয়ে লাইভ সংযোগ"
                        : "পুরোহিতজী এখন অফলাইন"}
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    disabled={!purohit.is_online || Boolean(purohit.is_busy)}
                    onClick={() => handleOpenBooking(puja)}
                    className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 shadow-md shadow-amber-600/20"
                  >
                    <Video className="size-3.5 mr-1.5" />
                    {purohit.is_busy
                      ? "এখন ব্যস্ত"
                      : !purohit.is_online
                      ? "অফলাইন"
                      : `এখনই বুক করুন (₹${puja.price_inr})`}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* VEDIC SANKALPA BOOKING MODAL                                  */}
      {/* ------------------------------------------------------------- */}
      {selectedPuja && (
        <Modal
          open={Boolean(selectedPuja)}
          onClose={() => setSelectedPuja(null)}
          title={`বৈদিক সংকল্প ও পূজা বুকিং`}
        >
          <form onSubmit={handleConfirmBooking} className="space-y-4 p-1">
            {/* Selected Puja Summary Card */}
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                  নির্বাচিত পূজা
                </span>
                <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                  {selectedPuja.puja_name}
                </h4>
                <span className="text-xs text-stone-500">{selectedPuja.duration_minutes} মিনিট লাইভ সেশন</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-emerald-600">₹{selectedPuja.price_inr}</span>
                <span className="text-[10px] text-stone-500 block">নির্ধারিত দক্ষিণা</span>
              </div>
            </div>

            <p className="text-xs text-stone-500">
              পূজার সময় আচার্য আপনার নাম ও গোত্র উচ্চারণ করে বৈদিক বিধি অনুসারে সংকল্প পাঠ করবেন। অনুগ্রহ করে সঠিক তথ্য প্রদান করুন:
            </p>

            {/* Devotee Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                <User className="size-3.5 text-amber-600" />
                <span>ভক্তের পূর্ণ নাম (Name for Sankalpa) *</span>
              </label>
              <input
                type="text"
                required
                value={sankalpaName}
                onChange={(e) => setSankalpaName(e.target.value)}
                placeholder="আপনার বা পরিবারের প্রধানের নাম লিখুন"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Gotra */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                <ScrollText className="size-3.5 text-amber-600" />
                <span>গোত্র (Gotra) *</span>
              </label>
              <input
                type="text"
                required
                value={sankalpaGotra}
                onChange={(e) => setSankalpaGotra(e.target.value)}
                placeholder="যেমন: কাশ্যপ (Kashyapa), ভরদ্বাজ, শাণ্ডিল্য..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[10px] text-stone-400">গোত্র জানা না থাকলে শাস্ত্রীয় নিয়মানুযায়ী 'কাশ্যপ' লিখুন।</span>
            </div>

            {/* Special Wish / Sankalpa Purpose */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                <HeartHandshake className="size-3.5 text-amber-600" />
                <span>বিশেষ মনস্কামনা বা উদ্দেশ্য (Optional)</span>
              </label>
              <textarea
                rows={2}
                value={sankalpaWish}
                onChange={(e) => setSankalpaWish(e.target.value)}
                placeholder="যেমন: আরোগ্য লাভ, পারিবারিক শান্তি, ব্যবসায়িক সাফল্য, গৃহপ্রবেশ শুভকামনা..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                <Wallet className="size-3.5 text-amber-600" />
                <span>পেমেন্ট পদ্ধতি নির্বাচন করুন *</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`rounded-xl border px-3 py-2 text-left text-xs transition-all cursor-pointer ${
                    paymentMethod === "razorpay"
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40 font-bold text-amber-900 dark:text-amber-100"
                      : "border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300"
                  }`}
                >
                  <div>UPI / Card (Razorpay)</div>
                  <div className="text-[10px] font-normal opacity-75">₹{selectedPuja.price_inr}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("wallet")}
                  className={`rounded-xl border px-3 py-2 text-left text-xs transition-all cursor-pointer ${
                    paymentMethod === "wallet"
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40 font-bold text-amber-900 dark:text-amber-100"
                      : "border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300"
                  }`}
                >
                  <div>Wallet Coins</div>
                  <div className="text-[10px] font-normal opacity-75">
                    ব্যালেন্স: {walletBalanceCoins} / প্রয়োজন:{" "}
                    {Math.max(1, Math.round(selectedPuja.price_inr * coinsPerRupee))}
                  </div>
                </button>
              </div>
            </div>

            {/* Submit Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200 dark:border-stone-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedPuja(null)}
              >
                বাতিল করুন
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={bookMutation.isPending || isVerifyingPayment}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                <Video className="size-3.5 mr-1" />
                {isVerifyingPayment
                  ? "পেমেন্ট যাচাই ও রুম খুলছে..."
                  : paymentMethod === "wallet"
                  ? `ওয়ালেট থেকে পে ও রুমে যান (${Math.max(1, Math.round(selectedPuja.price_inr * coinsPerRupee))} কয়েন)`
                  : `পেমেন্ট করুন ও রুমে যান (₹${selectedPuja.price_inr})`}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {isVerifyingPayment && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 text-white">
          <div className="rounded-2xl bg-stone-900 border border-amber-500/40 px-6 py-5 text-center space-y-2 shadow-2xl max-w-xs w-full">
            <Flame className="size-8 text-amber-400 animate-pulse mx-auto" />
            <p className="text-sm font-bold text-amber-200">পেমেন্ট যাচাই চলছে...</p>
            <p className="text-xs text-stone-400">আপনাকে সরাসরি পুরোহিতজীর লাইভ পূজা রুমে নেওয়া হচ্ছে।</p>
          </div>
        </div>
      )}
    </div>
  );
}
