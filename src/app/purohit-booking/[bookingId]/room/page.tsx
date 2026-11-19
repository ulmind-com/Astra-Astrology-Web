"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, Flame, HeartHandshake, PhoneOff, ScrollText, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { CallRoom } from "@/components/call/call-room";
import { Badge, Button, LoadingBlock } from "@/components/ui";
import { purohitApi, type PujaBookingData } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";

export default function DevoteePujaVideoRoomPage() {
  const params = useParams<{ bookingId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const bookingId = params.bookingId;

  // Fetch Booking Details & Video Token
  const {
    data: booking,
    isLoading,
    error,
  } = useQuery<PujaBookingData>({
    queryKey: ["purohit_booking_token", bookingId],
    queryFn: async () => {
      const res = await purohitApi.getRoomToken(bookingId);
      return (res as any)?.data || res;
    },
    enabled: Boolean(bookingId),
    refetchOnWindowFocus: false,
  });

  const handleLeaveRoom = () => {
    toast.info("আপনি পূজার ভিডিও রুম থেকে প্রস্থান করেছেন।");
    router.push("/purohits");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center text-white">
        <LoadingBlock label="বৈদিক পূজার পবিত্র ভিডিও রুমে সংযোগ স্থাপন করা হচ্ছে..." />
      </div>
    );
  }

  if (error || !booking || !booking.zego_token || !booking.zego_app_id) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 text-center text-white">
        <Flame className="size-16 text-amber-500 mb-4 animate-bounce" />
        <h2 className="text-xl font-bold">ভিডিও রুমে প্রবেশ করতে সমস্যা হচ্ছে</h2>
        <p className="text-xs text-stone-400 mt-2 max-w-md">
          {error instanceof Error
            ? error.message
            : "সেশনের মেয়াদ শেষ অথবা আপনি এই পূজা বুকিংয়ের উপযুক্ত ভক্ত নন।"}
        </p>
        <Link href="/purohits" className="mt-6">
          <Button variant="outline" size="sm" className="bg-stone-800 text-white border-stone-700">
            <ArrowLeft className="size-4 mr-1.5" />
            ফিরে যান
          </Button>
        </Link>
      </div>
    );
  }

  const credentials = {
    app_id: booking.zego_app_id,
    token: booking.zego_token,
    room_id: booking.room_id,
    user_id: user?.id || `devotee_${booking.id.slice(0, 8)}`,
    user_name: user?.full_name || booking.sankalpa_name || "ভক্ত",
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950 flex flex-col">
      {/* ------------------------------------------------------------- */}
      {/* TOP HEADER: PUJA & SANKALPA BANNER                            */}
      {/* ------------------------------------------------------------- */}
      <header className="bg-stone-900/95 backdrop-blur-md border-b border-amber-900/40 px-4 py-2.5 flex items-center justify-between text-white z-10">
        <div className="flex items-center gap-3">
          <Link href="/purohits">
            <Button variant="ghost" size="sm" className="text-stone-300 hover:text-white p-1.5">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <Flame className="size-4 text-amber-500" />
              <h2 className="font-bold text-sm sm:text-base text-amber-200">
                {booking.puja_name}
              </h2>
              <Badge tone="neutral" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold text-[10px]">
                LIVE PUJA
              </Badge>
            </div>
            <p className="text-xs text-stone-400">
              পুরোহিত: <b className="text-stone-200">{booking.purohit_name}</b> | বুকিং #{booking.booking_number}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Devotee Sankalpa Details pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200">
            <ScrollText className="size-3.5 text-amber-400" />
            <span>সংকল্প: <b>{booking.sankalpa_name}</b> ({booking.sankalpa_gotra})</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLeaveRoom}
            className="border-rose-800 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 text-xs font-bold"
          >
            <PhoneOff className="size-3.5 mr-1" />
            রুম ত্যাগ করুন
          </Button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* LIVE 2-WAY VIDEO CALL ROOM                                    */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 relative w-full h-full overflow-hidden bg-black">
        <CallRoom
          credentials={credentials}
          onLeave={handleLeaveRoom}
          className="w-full h-full"
          audioOnly={false}
          group={false}
        />
      </main>

      {/* ------------------------------------------------------------- */}
      {/* FLOATING VEDIC SANKALPA FOOTER ON MOBILE                      */}
      {/* ------------------------------------------------------------- */}
      <footer className="md:hidden bg-stone-900/90 border-t border-stone-800 p-2 text-center text-[11px] text-amber-300">
        <span>সংকল্প: <b>{booking.sankalpa_name}</b> (গোত্র: {booking.sankalpa_gotra})</span>
        {booking.sankalpa_wish && <span className="block text-stone-400 truncate text-[10px]">"{booking.sankalpa_wish}"</span>}
      </footer>
    </div>
  );
}
