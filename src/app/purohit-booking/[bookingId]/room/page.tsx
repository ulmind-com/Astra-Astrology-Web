"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, Flame, Flower2, ScrollText } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { BentoVideoStudio } from "@/components/call/bento-video-studio";
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

  const [showSankalpaDrawer, setShowSankalpaDrawer] = React.useState(false);
  const [pushpanjaliPetals, setPushpanjaliPetals] = React.useState<{ id: number; left: number }[]>([]);
  const [consecratedModalOpen, setConsecratedModalOpen] = React.useState(false);
  const [remainingSeconds, setRemainingSeconds] = React.useState<number | null>(null);
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
    refetchOnWindowFocus: true,
    refetchInterval: (q) => (q.state.data?.status === "confirmed" ? 3000 : false),
    staleTime: 10 * 1000,
  });

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

  if (error || !booking || !booking.zego_token || !booking.zego_app_id || !user?.id) {
    return (
      <div className="min-h-screen bg-[#061311] flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="size-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 animate-pulse">
          <Flame className="size-8" />
        </div>
        <h2 className="text-xl font-bold font-serif text-emerald-200">
          ভার্চুয়াল পূজা চেম্বারে প্রবেশ করা যায়নি
        </h2>
        <p className="text-xs text-stone-400 mt-2 max-w-md leading-relaxed">
          {error instanceof Error
            ? error.message
            : "টোকেনের মেয়াদ শেষ হয়েছে অথবা আপনি এই পূজা বুকিংয়ের অনুমোদিত ব্যক্তি নন।"}
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/purohits">
            <Button variant="outline" size="sm" className="bg-[#0E2421] text-white border-[#1E3B36]">
              <ArrowLeft className="size-4 mr-1.5" />
              পুরোহিত তালিকায় ফিরুন
            </Button>
          </Link>
          <Button variant="primary" size="sm" onClick={() => refetch()} className="bg-emerald-600 text-white font-bold">
            পুনরায় চেষ্টা করুন
          </Button>
        </div>
      </div>
    );
  }

  const isPurohit =
    user.id === booking.purohit_user_id ||
    user.id === booking.purohit_id ||
    (user as any)?.role === "purohit";
  const isCompleted = booking.status === "completed";

  // Waiting Screen while awaiting Purohit to accept incoming live request
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
              পুরোহিতজী অনুরোধটি গ্রহণ করলেই <b>{booking.puja_name} ({booking.puja_duration_minutes} মিনিট)</b> লাইভ ভিডিও রুম শুরু হবে। পুরোহিতজী ২ মিনিটের মধ্যে যুক্ত না হলে সম্পূর্ণ টাকা অটো-রিফান্ড হবে।
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-[#0E2421] border border-[#1E3B36] text-xs text-stone-300 text-left space-y-1">
            <div><span className="text-stone-500">সংকল্প নাম:</span> <b>{booking.sankalpa_name}</b></div>
            <div><span className="text-stone-500">গোত্র:</span> <b>{booking.sankalpa_gotra || "Kashyapa"}</b></div>
            <div><span className="text-stone-500">বুকিং নম্বর:</span> <span className="font-mono">{booking.booking_number}</span></div>
          </div>
          <div className="flex justify-center gap-3 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="border-emerald-500/40 text-emerald-200 hover:bg-emerald-950/50 text-xs"
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
