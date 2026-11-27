"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Coins,
  Flame,
  Flower2,
  HeartHandshake,
  Info,
  Maximize2,
  Mic,
  MicOff,
  PhoneOff,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Sun,
  User,
  Volume2,
  VolumeX,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { CallRoom } from "@/components/call/call-room";
import { Badge, Button, LoadingBlock } from "@/components/ui";
import { purohitApi, type PujaBookingData } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { useRequireAuth } from "@/providers/auth-provider";
import { useRealtime } from "@/providers/realtime-provider";

export default function DevoteePujaVideoRoomPage() {
  const params = useParams<{ bookingId: string }>();
  const router = useRouter();
  const { ready, user } = useRequireAuth();
  const queryClient = useQueryClient();
  const bookingId = params?.bookingId || "";

  // UI state
  const [showSankalpaDrawer, setShowSankalpaDrawer] = React.useState(true);
  const [vedicAudioMode, setVedicAudioMode] = React.useState(true);
  const [pushpanjaliPetals, setPushpanjaliPetals] = React.useState<{ id: number; left: number }[]>([]);
  const [consecratedModalOpen, setConsecratedModalOpen] = React.useState(false);
  const [remainingSeconds, setRemainingSeconds] = React.useState<number | null>(null);
  const { onPujaEvent } = useRealtime();

  // Fetch Booking Details & Video Token (waits for auth hydration so user_id matches token)
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
    refetchOnWindowFocus: true,
    refetchInterval: (q) => (q.state.data?.status === "confirmed" ? 3000 : false),
    staleTime: 10 * 1000,
  });

  // Complete Puja Mutation (For Purohit)
  const completeMutation = useMutation({
    mutationFn: async () => {
      return await purohitApi.completeBooking(bookingId);
    },
    onSuccess: () => {
      setConsecratedModalOpen(true);
      toast.success("পবিত্র পূজা সফলভাবে সম্পন্ন ও প্রতিষ্ঠিত হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["purohit_booking_token", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["purohits_list"] });
    },
    onError: (err) => {
      const msg = err instanceof ApiError ? err.message : "Failed to mark puja completed";
      toast.error(msg);
    },
  });

  React.useEffect(() => {
    return onPujaEvent((msg) => {
      if (String(msg.data.booking?.id) !== bookingId) return;
      if (msg.data.event === "puja_accepted") {
        toast.success("পুরোহিতজী লাইভ রুমে যুক্ত হচ্ছেন!");
        void refetch();
      } else if (msg.data.event === "puja_declined") {
        toast.error("পুরোহিতজী এই মুহূর্তে ব্যস্ত — আপনার টাকা ১০০% রিফান্ড করা হয়েছে।");
        void refetch();
      } else if (msg.data.event === "puja_ended") {
        setConsecratedModalOpen(true);
        void queryClient.invalidateQueries({ queryKey: ["purohit_booking_token", bookingId] });
      }
    });
  }, [bookingId, onPujaEvent, queryClient, refetch]);

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

  // Handle Offer Pushpanjali (Devotee flower offering animation)
  const handleOfferPushpanjali = () => {
    const newPetals = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 80 + 10, // 10% to 90%
    }));
    setPushpanjaliPetals((prev) => [...prev, ...newPetals]);
    toast.success("🌸 যজ্ঞের বেদীতে ও দেবতার শ্রীচরণে পুষ্পাঞ্জলি নিবেদন সফল হয়েছে!");

    setTimeout(() => {
      setPushpanjaliPetals((prev) => prev.filter((p) => !newPetals.some((np) => np.id === p.id)));
    }, 3500);
  };

  const handleLeaveRoom = () => {
    toast.info("আপনি পূজার ভার্চুয়াল মন্দির চেম্বার থেকে প্রস্থান করেছেন।");
    router.push("/purohits");
  };

  if (!ready || isLoading) {
    return (
      <div className="min-h-screen bg-[#070B12] flex items-center justify-center text-white p-4">
        <LoadingBlock label="পবিত্র ভার্চুয়াল মন্দির ও হোম চেম্বারে সংযোগ স্থাপন করা হচ্ছে..." />
      </div>
    );
  }

  if (error || !booking || !booking.zego_token || !booking.zego_app_id || !user?.id) {
    return (
      <div className="min-h-screen bg-[#070B12] flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="size-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 animate-pulse">
          <Flame className="size-8" />
        </div>
        <h2 className="text-xl font-bold font-serif text-amber-200">
          ভার্চুয়াল পূজা চেম্বারে প্রবেশ করা যায়নি
        </h2>
        <p className="text-xs text-stone-400 mt-2 max-w-md leading-relaxed">
          {error instanceof Error
            ? error.message
            : "টোকেনের মেয়াদ শেষ হয়েছে অথবা আপনি এই পূজা বুকিংয়ের অনুমোদিত ব্যক্তি নন।"}
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/purohits">
            <Button variant="outline" size="sm" className="bg-stone-900 text-white border-stone-700">
              <ArrowLeft className="size-4 mr-1.5" />
              পুরোহিত তালিকায় ফিরুন
            </Button>
          </Link>
          <Button variant="primary" size="sm" onClick={() => refetch()} className="bg-amber-600 text-white font-bold">
            পুনরায় চেষ্টা করুন
          </Button>
        </div>
      </div>
    );
  }

  const isPurohit = user?.id === booking.purohit_id || (user as any)?.role === "purohit";
  const isCompleted = booking.status === "completed";

  // Waiting for Purohit to accept incoming live request (for Devotee)
  if (booking.status === "confirmed" && !isPurohit) {
    return (
      <div className="min-h-screen bg-[#070B12] flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="max-w-md w-full rounded-3xl bg-stone-900/90 border border-amber-500/40 p-7 space-y-5 shadow-2xl">
          <div className="size-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-amber-300 animate-pulse">
            <Flame className="size-8" />
          </div>
          <div className="space-y-2">
            <Badge tone="neutral" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs font-bold">
              পেমেন্ট সম্পন্ন · ₹{booking.amount_inr}
            </Badge>
            <h2 className="text-xl font-bold font-serif text-amber-200">
              {booking.purohit_name}-কে পূজার অনুরোধ পাঠানো হয়েছে
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed">
              পুরোহিতজী অনুরোধটি গ্রহণ করলেই <b>{booking.puja_name} ({booking.puja_duration_minutes} মিনিট)</b> লাইভ ভিডিও রুম শুরু হবে। পুরোহিতজী ২ মিনিটের মধ্যে যুক্ত না হলে সম্পূর্ণ টাকা অটো-রিফান্ড হবে।
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-stone-800 text-xs text-stone-300 text-left space-y-1">
            <div><span className="text-stone-500">সংকল্প নাম:</span> <b>{booking.sankalpa_name}</b></div>
            <div><span className="text-stone-500">গোত্র:</span> <b>{booking.sankalpa_gotra || "Kashyapa"}</b></div>
            <div><span className="text-stone-500">বুকিং নম্বর:</span> <span className="font-mono">{booking.booking_number}</span></div>
          </div>
          <div className="flex justify-center gap-3 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="border-amber-500/40 text-amber-200 hover:bg-amber-950/50 text-xs"
            >
              স্ট্যাটাস রিফ্রেশ করুন
            </Button>
            <Link href="/purohits">
              <Button variant="ghost" size="sm" className="text-stone-400 hover:text-white text-xs">
                তালিকায় ফিরুন
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const credentials = {
    app_id: booking.zego_app_id,
    token: booking.zego_token,
    room_id: booking.room_id,
    user_id: user.id,
    user_name: user.full_name || (isPurohit ? `Purohit ${booking.purohit_name}` : booking.sankalpa_name || "ভক্ত"),
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070B12] text-white flex flex-col overflow-hidden select-none font-sans">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP SACRED TEMPLE HEADER                                   */}
      {/* ------------------------------------------------------------- */}
      <header className="bg-gradient-to-r from-stone-950 via-[#0E1524] to-stone-950 border-b border-amber-500/30 px-3 sm:px-6 py-2.5 flex items-center justify-between z-20 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/purohits">
            <Button
              variant="ghost"
              size="sm"
              className="text-stone-400 hover:text-white hover:bg-stone-800 p-1.5 rounded-xl"
              title="প্রস্থান করুন"
            >
              <ArrowLeft className="size-4" />
            </Button>
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <Flame className="size-3.5 text-amber-400 animate-pulse" />
              </div>
              <h2 className="font-serif font-bold text-sm sm:text-base text-amber-200 tracking-wide">
                {booking.puja_name}
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE HAVAN & ALTAR
              </span>
            </div>

            <p className="text-[11px] text-stone-400 flex items-center gap-1.5">
              <span>পুরোহিত: <b className="text-amber-100 font-semibold">{booking.purohit_name}</b></span>
              <span>•</span>
              <span>বুকিং: <b className="font-mono text-stone-300">#{booking.booking_number}</b></span>
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {remainingSeconds !== null && !isCompleted && (
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-extrabold ${
                remainingSeconds <= 120
                  ? "bg-rose-500/20 border-rose-400/60 text-rose-200 animate-pulse"
                  : "bg-emerald-500/20 border-emerald-400/40 text-emerald-200"
              }`}
              title="লাইভ পূজার বাকি সময়"
            >
              <Clock className="size-3.5" />
              <span>
                {String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:
                {String(remainingSeconds % 60).padStart(2, "0")}
              </span>
            </div>
          )}

          {/* Vedic Audio Mode Pill */}
          <button
            type="button"
            onClick={() => {
              setVedicAudioMode(!vedicAudioMode);
              toast.info(
                !vedicAudioMode
                  ? "🕉️ বৈদিক মন্ত্র মোড সক্রিয় — শঙ্খ ও মন্দিরের ঘণ্টা স্পষ্ট শোনা যাবে।"
                  : "🎙️ স্ট্যান্ডার্ড স্পিচ অডিও মোড সক্রিয়।"
              );
            }}
            className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              vedicAudioMode
                ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm shadow-amber-500/20"
                : "bg-stone-900 border-stone-700 text-stone-400 hover:text-white"
            }`}
            title="বৈদিক মন্ত্র ও শঙ্খ ধ্বনি অডিও অপ্টিমাইজেশন"
          >
            <Sparkles className="size-3.5 text-amber-400" />
            <span>{vedicAudioMode ? "Vedic Chanting Audio: ON" : "Vedic Audio: OFF"}</span>
          </button>

          {/* Toggle Sankalpa Card Drawer */}
          <button
            type="button"
            onClick={() => setShowSankalpaDrawer(!showSankalpaDrawer)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              showSankalpaDrawer
                ? "bg-amber-950/60 border-amber-500/40 text-amber-200"
                : "bg-stone-900/80 border-stone-700 text-stone-300 hover:text-white"
            }`}
          >
            <ScrollText className="size-3.5 text-amber-400" />
            <span className="hidden sm:inline">যজমানের সংকল্প</span>
            {showSankalpaDrawer ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </button>

          {/* Complete Puja Button (For Purohit) */}
          {isPurohit && !isCompleted && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (confirm("আপনি কি নিশ্চিত যে বৈদিক পূজা ও সংকল্প সম্পন্ন হয়েছে? এটি দক্ষিণা নিশ্চিত করবে।")) {
                  completeMutation.mutate();
                }
              }}
              loading={completeMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 border border-emerald-400/40"
            >
              <CheckCircle2 className="size-3.5 mr-1 text-white" />
              <span className="hidden sm:inline">Complete Sacred Puja & Mark Consecrated</span>
              <span className="sm:hidden">Complete</span>
            </Button>
          )}

          {/* Exit / Leave Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLeaveRoom}
            className="border-rose-900/60 bg-rose-950/30 text-rose-300 hover:bg-rose-900/50 text-xs font-bold"
          >
            <PhoneOff className="size-3.5 mr-1" />
            <span className="hidden sm:inline">রুম ত্যাগ</span>
          </Button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN VIRTUAL TEMPLE CHAMBER & HAVAN FEED                   */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 relative w-full h-full overflow-hidden bg-black flex flex-col md:flex-row">
        {/* Large Havan / Deity Video Stream Viewport */}
        <div className="flex-1 relative w-full h-full bg-stone-950 flex flex-col justify-center">
          {/* Subtle Golden Temple Frame Aura */}
          <div className="absolute inset-0 pointer-events-none border-2 border-amber-500/20 z-10" />

          {/* ZEGOCLOUD Interactive Call Room */}
          <div className="w-full h-full relative">
            <CallRoom
              credentials={credentials}
              onLeave={handleLeaveRoom}
              className="w-full h-full object-cover"
              audioOnly={false}
              group={false}
              stayInRoomOnPeerLeave={true}
            />
          </div>

          {/* Top Left Floating Temple Seal / Havan Indicator */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
            <div className="px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-amber-500/40 text-amber-300 flex items-center gap-2 text-xs font-bold shadow-lg">
              <span className="size-2 rounded-full bg-red-500 animate-ping" />
              <span>শ্রী হোমকুণ্ড ও প্রধান বিগ্রহ (Havan & Deity Altar Feed)</span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-stone-800 text-[11px] text-stone-300">
              <Sparkles className="size-3 text-amber-400" />
              <span>48kHz Hi-Fi Vedic Audio</span>
            </div>
          </div>

          {/* Floating Pushpanjali (Flower Rain) Animation Container */}
          {pushpanjaliPetals.map((petal) => (
            <div
              key={petal.id}
              className="absolute top-0 z-30 pointer-events-none text-2xl animate-fall"
              style={{
                left: `${petal.left}%`,
                animationDuration: "3s",
                animationTimingFunction: "ease-in-out",
              }}
            >
              🌸
            </div>
          ))}

          {/* Bottom Floating Spiritual Controls Bar */}
          <div className="absolute bottom-5 inset-x-0 z-20 flex items-center justify-center gap-3 px-4 pointer-events-none">
            <div className="pointer-events-auto flex flex-wrap items-center gap-2.5 p-2 rounded-2xl bg-black/85 backdrop-blur-md border border-amber-500/30 shadow-2xl">
              {/* Pushpanjali Button */}
              <button
                type="button"
                onClick={handleOfferPushpanjali}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-transform active:scale-95"
              >
                <Flower2 className="size-4 text-amber-200" />
                <span>পুষ্পাঞ্জলি নিবেদন (Offer Flowers)</span>
              </button>

              {/* Vedic Chanting Info Pill */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900/90 border border-stone-800 text-xs text-stone-300">
                <Sun className="size-3.5 text-amber-400" />
                <span>শ্রী গণেশ ও রুদ্র আশীর্বাদ প্রবহমান</span>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3. YAJAMANA SANKALPA DETAILS CARD (যজমানের সংকল্প কার্ড)     */}
        {/* ------------------------------------------------------------- */}
        {showSankalpaDrawer && (
          <aside className="w-full md:w-96 bg-[#0B101D] border-t md:border-t-0 md:border-l border-amber-500/30 flex flex-col z-20 shadow-2xl max-h-[45vh] md:max-h-full overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 border-b border-amber-500/20 bg-stone-950/80 flex items-center justify-between sticky top-0 backdrop-blur-md z-10">
              <div className="flex items-center gap-2">
                <ScrollText className="size-4 text-amber-400" />
                <h3 className="font-serif font-bold text-sm text-amber-100">
                  যজমানের বৈদিক সংকল্প (Sacred Sankalpa)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSankalpaDrawer(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <ChevronDown className="size-4 md:hidden" />
                <span className="hidden md:inline text-xs text-amber-400 hover:underline">হাইড</span>
              </button>
            </div>

            <div className="p-4 space-y-4 text-xs">
              {/* Primary Sankalpa Credentials Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 via-stone-900 to-amber-950/20 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    যজ্ঞ কর্তা / যজমান
                  </span>
                  <Badge tone="green" className="text-[10px] font-bold">
                    PAID (₹{booking.amount_inr})
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-[11px] text-stone-400 block">নাম (Devotee Name):</span>
                    <strong className="text-base font-bold text-amber-200">
                      {booking.sankalpa_name}
                    </strong>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-800">
                    <div>
                      <span className="text-[11px] text-stone-400 block">গোত্র (Gotra):</span>
                      <strong className="text-stone-200 font-semibold">
                        {booking.sankalpa_gotra || "কশ্যপ (Kashyapa)"}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[11px] text-stone-400 block">জন্ম নক্ষত্র (Nakshatra):</span>
                      <strong className="text-stone-200 font-semibold">
                        {booking.sankalpa_nakshatra || "রোহিণী / হস্তা (স্বাভাবিক গোত্র)"}
                      </strong>
                    </div>
                  </div>

                  {booking.sankalpa_wish && (
                    <div className="pt-2 border-t border-stone-800">
                      <span className="text-[11px] text-stone-400 block">বিশেষ মনস্কামনা ও প্রার্থনা:</span>
                      <p className="mt-0.5 text-stone-300 italic bg-black/40 p-2 rounded-xl border border-stone-800 leading-relaxed">
                        "{booking.sankalpa_wish}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Chant-Along Vedic Sankalpa Shloka Prompter */}
              <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                  <Sparkles className="size-3.5" />
                  <span>পবিত্র সংকল্প শ্লোক (Chant Along Shloka):</span>
                </div>

                <div className="font-serif text-[11px] text-amber-100/90 bg-black/50 p-3 rounded-xl border border-amber-500/20 leading-relaxed italic">
                  "ॐ विष्णुर्विष्णुर्विष्णुः श्रीमद्भगवतो महापुरुषस्य विष्णोराज्ञया प्रवर्तमानस्य ब्रह्मणो द्वितीयपरार्धे श्रीश्वेतवाराहकल्पे... <span className="text-amber-300 font-bold">[{booking.sankalpa_gotra}]</span> गोत्रोत्पन्नस्य <span className="text-amber-300 font-bold">[{booking.sankalpa_name}]</span> शर्मणः मम सकलदुरितोपशमनार्थं শ্রী <span className="text-amber-300 font-bold">[{booking.puja_name}]</span> कर्म सम्पादयामि।"
                </div>

                <p className="text-[10px] text-stone-400 leading-tight">
                  পুরোহিতজী যখন সংকল্প মন্ত্র উচ্চারণ করবেন, তখন হাতে সামান্য জল ও ফুল নিয়ে এই শ্লোকে নিজের নাম ও গোত্র স্মরণ করুন।
                </p>
              </div>

              {/* Ritual Guidance Card */}
              <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1.5 text-[11px] text-stone-300">
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-emerald-400" />
                  <span>পবিত্র বৈদিক পরিবেশ নির্দেশিকা:</span>
                </span>
                <ul className="space-y-1 text-stone-400 pl-4 list-disc">
                  <li>পূজাস্থলে ঘৃত প্রদীপ ও ধূপ জ্বালিয়ে পূর্ব বা উত্তর মুখে বসুন।</li>
                  <li>মহামন্ত্র পাঠের সময় মোবাইল নিঃশব্দে রাখুন এবং একমনে শ্রবণ করুন।</li>
                  <li>পূজা শেষে পুরোহিতজীর আশীর্বাদ পুষ্প ও পবিত্র তিলক গ্রহণ করুন।</li>
                </ul>
              </div>

              {/* Purohit Complete Puja Action inside drawer */}
              {isPurohit && !isCompleted && (
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (confirm("আপনি কি নিশ্চিত যে পূজা সম্পূর্ণ হয়েছে? এটি ভক্তের জন্য সার্টিফিকেট ও পুরোহিতের দক্ষিণা নিশ্চিত করবে।")) {
                        completeMutation.mutate();
                      }
                    }}
                    loading={completeMutation.isPending}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 shadow-lg shadow-emerald-600/30"
                  >
                    <CheckCircle2 className="size-4 mr-1.5" />
                    Complete Sacred Puja & Mark Consecrated
                  </Button>
                </div>
              )}
            </div>
          </aside>
        )}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* 4. CONSECRATION COMPLETION BENEDICTION MODAL                  */}
      {/* ------------------------------------------------------------- */}
      {consecratedModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-gradient-to-b from-[#131B2E] to-stone-950 border-2 border-amber-500/50 p-6 text-center shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="size-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="size-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-amber-200">
                পবিত্র পূজা সফলভাবে প্রতিষ্ঠিত ও সমর্পিত!
              </h3>
              <p className="text-xs text-stone-300">
                {booking.sankalpa_name}-এর উদ্দেশ্যে অনুষ্ঠিত {booking.puja_name} সম্পূর্ণ হয়েছে। দেব-দেবীর অনন্ত আশীর্বাদ ভক্তের জীবনে বর্ষিত হোক।
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-black/50 border border-amber-500/20 text-xs text-amber-300 font-serif">
              "ॐ द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिरापः शान्तिरोषधयः शान्तिः। वनस्पतयः शान्तिर्विश्वेदेवाः शान्तिर्ब्रह्म शान्तिः सर्वं शान्तिः शान्तिरेव शान्तिः सा मा शान्तिरेधि॥ ॐ शान्तिः शान्तिः शान्तिः॥"
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push(isPurohit ? "/purohit-dashboard/bookings" : "/purohits")}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2"
              >
                {isPurohit ? "ড্যাশবোর্ডে ফিরুন" : "আশীর্বাদ গ্রহণ করুন ও সমাপ্ত করুন"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS for flower petal falling animation */}
      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(85vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </div>
  );
}
