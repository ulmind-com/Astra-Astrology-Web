"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowRight,
  CalendarCheck,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Lock,
  ShieldCheck,
  Sparkles,
  Unlock,
  Wallet,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  LoadingBlock,
  Modal,
  Textarea,
} from "@/components/ui";
import { appointmentApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";
import type { Range } from "@/types";

function rupees(paise: number): string {
  return (paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function clock(d: Date): string {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
}

function startsThatFit(
  windows: Range[],
  booked: Range[],
  minutes: number,
  slotMinutes: number,
  dayKey: string,
): Date[] {
  const starts: Date[] = [];
  const now = Date.now();
  const taken = booked.map((b) => [
    new Date(b.starts_at).getTime(),
    new Date(b.ends_at).getTime(),
  ]);

  for (const w of windows) {
    const windowStart = new Date(w.starts_at).getTime();
    const windowEnd = new Date(w.ends_at).getTime();
    const step = slotMinutes * 60_000;
    const length = minutes * 60_000;

    for (let t = windowStart; t + length <= windowEnd; t += step) {
      if (t <= now) continue;

      const asDate = new Date(t);
      const pad = (n: number) => String(n).padStart(2, "0");
      const key = `${asDate.getFullYear()}-${pad(asDate.getMonth() + 1)}-${pad(asDate.getDate())}`;
      if (key !== dayKey) continue;

      const clashes = taken.some(([s, e]) => t < e && s < t + length);
      if (!clashes) starts.push(asDate);
    }
  }
  return starts;
}

const CONSULTATION_PILLARS = [
  {
    id: "career_wealth",
    labelEn: "Career & Wealth",
    labelBn: "কর্মজীবন ও ধনসম্পদ",
    icon: "💼",
    descEn: "Financial breakthroughs, promotion timing, business pivots.",
  },
  {
    id: "love_marriage",
    labelEn: "Love & Marriage",
    labelBn: "বিবাহ ও দাম্পত্য সুখ",
    icon: "💍",
    descEn: "Kundali Milan, relationship harmony, marriage muhurat.",
  },
  {
    id: "health_longevity",
    labelEn: "Health & Vitality",
    labelBn: "স্বাস্থ্য ও দীর্ঘায়ু",
    icon: "🌿",
    descEn: "Planetary affliction on well-being, Vedic remedies.",
  },
  {
    id: "dosha_graha_shanti",
    labelEn: "Graha Shanti & Doshas",
    labelBn: "গ্রহশান্তি ও দোষ নিবারণ",
    icon: "🔥",
    descEn: "Kalsarpa, Sade Sati, Pitra Dosha mitigation.",
  },
  {
    id: "business_expansion",
    labelEn: "Business & Investments",
    labelBn: "ব্যবসা ও বাণিজ্য বিস্তার",
    icon: "📈",
    descEn: "Partnership compatibility, auspicious launch dates.",
  },
  {
    id: "spiritual_guidance",
    labelEn: "Spiritual Path & Moksha",
    labelBn: "আধ্যাত্মিক সাধনা ও জ্ঞান",
    icon: "🕉️",
    descEn: "Ishta Devata, soul purpose, mantra sadhana.",
  },
] as const;

function PrivateBookingContent() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const inviteCode = String(params?.code || "");
  const { isSignedIn, user } = useAuth();
  const { language } = useLanguage();

  const [enteredPasscode, setEnteredPasscode] = React.useState("");
  const [isUnlocked, setIsUnlocked] = React.useState(false);
  const [verifiedPasscode, setVerifiedPasscode] = React.useState<string | null>(null);

  // Booking states
  const [selectedDayKey, setSelectedDayKey] = React.useState(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  });
  const [selectedSlot, setSelectedSlot] = React.useState<Date | null>(null);
  const [minutes, setMinutes] = React.useState(30);
  const [selectedPillar, setSelectedPillar] = React.useState<string>("career_wealth");
  const [userNote, setUserNote] = React.useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);

  // 1. Validate invite link
  const { data: invite, isLoading: validatingInvite, isError } = useQuery({
    queryKey: ["appointments", "private_link", inviteCode],
    queryFn: () => appointmentApi.validatePrivateInvite(inviteCode),
    enabled: Boolean(inviteCode),
    retry: false,
  });

  // Automatically mark as unlocked if link has no passcode
  React.useEffect(() => {
    if (invite && !invite.has_passcode) {
      setIsUnlocked(true);
    }
  }, [invite]);

  // Passcode verification mutation
  const verifyPasscodeMutation = useMutation({
    mutationFn: (passcode: string) =>
      appointmentApi.verifyPrivatePasscode(inviteCode, passcode),
    onSuccess: () => {
      setIsUnlocked(true);
      setVerifiedPasscode(enteredPasscode.trim());
      toast.success("Passcode verified. Private access granted!");
    },
    onError: (e: ApiError) => {
      toast.error(e.message || "Invalid passcode. Please verify with your astrologer.");
    },
  });

  // 2. Query Day View for astrologer with invite_code
  const { data: dayView, isLoading: loadingDayView } = useQuery({
    queryKey: ["appointments", "day", invite?.astrologer_id, selectedDayKey, inviteCode],
    queryFn: () => appointmentApi.day(invite!.astrologer_id, selectedDayKey, inviteCode),
    enabled: Boolean(invite?.astrologer_id) && isUnlocked,
  });

  // Calculate slots that fit
  const availableSlots = React.useMemo(() => {
    if (!dayView) return [];
    return startsThatFit(
      dayView.windows,
      dayView.booked,
      minutes,
      dayView.slot_minutes || 30,
      selectedDayKey,
    );
  }, [dayView, minutes, selectedDayKey]);

  // 3. Query Quote
  const { data: quote, isLoading: loadingQuote } = useQuery({
    queryKey: [
      "appointments",
      "quote",
      invite?.astrologer_id,
      minutes,
      inviteCode,
      selectedSlot?.toISOString(),
    ],
    queryFn: () =>
      appointmentApi.quote(
        invite!.astrologer_id,
        minutes,
        inviteCode,
        selectedSlot?.toISOString(),
      ),
    enabled: Boolean(invite?.astrologer_id) && isUnlocked && isSignedIn,
  });

  // 4. Booking mutation
  const bookMutation = useMutation({
    mutationFn: async () => {
      if (!selectedSlot || !invite) throw new Error("No slot selected");
      return appointmentApi.book({
        astrologer_id: invite.astrologer_id,
        starts_at: selectedSlot.toISOString(),
        minutes,
        note: userNote || null,
        consultation_pillar: selectedPillar,
        invite_code: inviteCode,
        invite_passcode: verifiedPasscode || undefined,
      });
    },
    onSuccess: (booking) => {
      toast.success("VIP Appointment reserved successfully!");
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
      setIsConfirmModalOpen(false);
      router.push("/account/appointments");
    },
    onError: (e: ApiError) => toast.error(e.message),
  });

  // 7-day date strip
  const dateStrip = React.useMemo(() => {
    const list: Array<{ key: string; label: string; weekday: string; dayNum: number }> = [];
    const pad = (n: number) => String(n).padStart(2, "0");
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const weekday = d.toLocaleDateString("en-IN", { weekday: "short" });
      const dayNum = d.getDate();
      const label = i === 0 ? "Today" : i === 1 ? "Tomorrow" : weekday;
      list.push({ key, label, weekday, dayNum });
    }
    return list;
  }, []);

  if (validatingInvite) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] py-20">
        <div className="mx-auto max-w-xl px-4">
          <LoadingBlock label="Verifying private VIP invitation..." />
        </div>
      </main>
    );
  }

  if (isError || !invite || !invite.valid) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] py-20">
        <div className="mx-auto max-w-md px-4 text-center space-y-6">
          <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-rose-100 text-rose-700 shadow-sm">
            <Lock className="size-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-black text-slate-900">
              Private Invite Unavailable
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              This private booking link is invalid, has reached its maximum reservations, or has expired. Please contact the astrologer for an updated invite.
            </p>
          </div>
          <Link href="/appointments" className="inline-block">
            <Button size="lg" className="text-xs font-bold bg-slate-900 text-white">
              Browse Public Astrologer Calendar
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  // Passcode Gate View
  if (invite.has_passcode && !isUnlocked) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] py-20">
        <div className="mx-auto max-w-md px-4">
          <div className="rounded-3xl border border-amber-200/90 bg-white p-8 shadow-[0_20px_50px_rgba(217,119,6,0.08)] space-y-6">
            <div className="text-center space-y-3">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-500 text-white shadow-md">
                <Lock className="size-7" />
              </div>
              <div className="space-y-1">
                <Badge tone="gold" className="uppercase tracking-wider text-[10px]">
                  Passcode-Protected VIP Session
                </Badge>
                <h2 className="font-display text-xl font-black text-slate-900">
                  {invite.title}
                </h2>
                {invite.client_name && (
                  <p className="text-xs text-amber-900 font-semibold">
                    Reserved exclusively for <span className="underline">{invite.client_name}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Astrologer mini pill */}
            <div className="flex items-center gap-3 rounded-2xl bg-amber-50/70 p-3.5 border border-amber-200/80">
              <Avatar src={invite.astrologer_avatar} name={invite.astrologer_name || "Astrologer"} size="md" />
              <div>
                <p className="font-bold text-xs text-slate-900">{invite.astrologer_name}</p>
                <p className="text-[11px] text-slate-500">
                  {invite.astrologer_experience_years} years Vedic experience
                </p>
              </div>
            </div>

            {/* Passcode entry form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!enteredPasscode.trim()) {
                  toast.error("Please enter the secret passcode");
                  return;
                }
                verifyPasscodeMutation.mutate(enteredPasscode.trim());
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Enter Secret PIN / Passcode *
                </label>
                <input
                  type="password"
                  required
                  value={enteredPasscode}
                  onChange={(e) => setEnteredPasscode(e.target.value)}
                  placeholder="Enter passcode provided by astrologer"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50/80 px-4 py-3 text-center text-lg font-mono tracking-widest text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                loading={verifyPasscodeMutation.isPending}
                className="w-full text-xs font-bold bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md hover:shadow-lg"
              >
                <Unlock className="size-4 mr-1.5" />
                Unlock Private Calendar
              </Button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // Unlocked Booking Workspace View
  return (
    <main className="min-h-screen bg-[#FDFBF7] py-12 pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-8">
        {/* VIP Invite Header Banner */}
        <div className="rounded-3xl border border-amber-300 bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-amber-500/20 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 border border-amber-300 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amber-950">
                <ShieldCheck className="size-3.5 text-amber-700" />
                <span>Verified Private Consultation</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {invite.title}
              </h1>
              {invite.client_name && (
                <p className="text-xs text-amber-900 font-bold">
                  Exclusive appointment arranged for: <span className="underline">{invite.client_name}</span>
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {invite.custom_price_paise ? (
                <span className="rounded-2xl bg-white/90 border border-amber-300 px-3 py-2 text-center shadow-xs">
                  <span className="block text-[10px] font-bold uppercase text-slate-500">Private Rate</span>
                  <span className="font-display text-base font-black text-slate-900">
                    ₹{rupees(invite.custom_price_paise)}
                  </span>
                </span>
              ) : invite.discount_percent ? (
                <span className="rounded-2xl bg-emerald-50 border border-emerald-300 px-3 py-2 text-center shadow-xs">
                  <span className="block text-[10px] font-bold uppercase text-emerald-700">VIP Courtesy</span>
                  <span className="font-display text-base font-black text-emerald-900">
                    {invite.discount_percent}% Discount
                  </span>
                </span>
              ) : null}

              {invite.is_tatkal && (
                <span className="rounded-2xl bg-amber-600 text-white px-3 py-2 text-center shadow-xs">
                  <span className="block text-[10px] font-bold uppercase opacity-90">Priority</span>
                  <span className="font-display text-sm font-black flex items-center gap-1 justify-center">
                    <Zap className="size-3.5 fill-white" />
                    Tatkal
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Astrologer preview card */}
          <div className="flex items-center gap-4 rounded-2xl bg-white/80 backdrop-blur-sm p-4 border border-amber-200">
            <Avatar src={invite.astrologer_avatar} name={invite.astrologer_name || "Astrologer"} size="lg" />
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-bold text-base text-slate-900">
                {invite.astrologer_name}
              </h3>
              <p className="text-xs text-slate-600">
                Vedic Specialist · {invite.astrologer_experience_years} years experience
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-bold">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Slots Unlocked
              </span>
            </div>
          </div>
        </div>

        {/* 1. Date Selector Strip */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            1. Select Consultation Date
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {dateStrip.map((day) => {
              const isSelected = selectedDayKey === day.key;
              return (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => {
                    setSelectedDayKey(day.key);
                    setSelectedSlot(null);
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-2xl p-3 border transition-all cursor-pointer text-center",
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-md scale-105"
                      : "bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50"
                  )}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                    {day.label}
                  </span>
                  <span className="font-display text-base font-black mt-0.5">{day.dayNum}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Slot Selection Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              2. Select Time Slot
            </label>
            <span className="text-xs text-slate-500 font-medium">
              Duration: {minutes} minutes
            </span>
          </div>

          {loadingDayView ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <LoadingBlock label="Loading unlocked slots..." />
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center space-y-2">
              <p className="font-bold text-sm text-slate-800">No Open Slots for Selected Date</p>
              <p className="text-xs text-slate-500">
                Please select another date on the calendar above to view available consultation slots.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {availableSlots.map((slot) => {
                const isSelected = selectedSlot?.getTime() === slot.getTime();
                return (
                  <button
                    key={slot.toISOString()}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-2xl p-4 border transition-all cursor-pointer relative",
                      isSelected
                        ? "bg-gradient-to-b from-[#EA580C] via-[#D97706] to-[#B45309] text-white border-[#B45309] shadow-md scale-105"
                        : "bg-white text-slate-900 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50"
                    )}
                  >
                    <span className="font-extrabold text-sm tabular-nums">{clock(slot)}</span>
                    <span
                      className={cn(
                        "text-[10px] font-bold mt-1",
                        isSelected ? "text-amber-100" : "text-amber-700"
                      )}
                    >
                      {invite.custom_price_paise
                        ? `₹${rupees(invite.custom_price_paise)}`
                        : quote?.price_paise
                        ? `₹${rupees(quote.price_paise)}`
                        : "VIP Slot"}
                    </span>
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-white text-amber-900 shadow-sm">
                        <Check className="size-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Focus Pillar Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            3. Consultation Focus
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {CONSULTATION_PILLARS.map((p) => {
              const isSelected = selectedPillar === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPillar(p.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl p-3.5 border transition-all cursor-pointer text-left",
                    isSelected
                      ? "bg-amber-50 border-amber-500 shadow-xs ring-1 ring-amber-500/20"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  )}
                >
                  <span className="text-xl shrink-0 mt-0.5">{p.icon}</span>
                  <div>
                    <p className="font-bold text-xs text-slate-900">{p.labelEn}</p>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{p.descEn}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Notes input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            4. Private Notes & Questions for the Astrologer (Optional)
          </label>
          <Textarea
            rows={2}
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            placeholder="e.g. Detailed birth time background, specific queries regarding upcoming venture..."
            className="rounded-2xl border-slate-200 text-xs"
          />
        </div>

        {/* Booking action bar */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500 font-medium">Session Fee</p>
            <p className="font-display text-2xl font-black text-slate-900">
              {quote ? `₹${rupees(quote.price_paise)}` : invite.custom_price_paise ? `₹${rupees(invite.custom_price_paise)}` : "Calculating..."}
            </p>
            {quote && (
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Deposit + Escrow Balance: {quote.total_coins} coins
              </p>
            )}
          </div>

          {!isSignedIn ? (
            <Link href={`/login?redirect=/appointments/private/${inviteCode}`}>
              <Button size="lg" className="text-xs font-bold bg-slate-900 text-white">
                Sign In to Reserve Private Slot
              </Button>
            </Link>
          ) : !selectedSlot ? (
            <Button size="lg" disabled className="text-xs font-bold opacity-60">
              Select a Slot to Continue
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={() => setIsConfirmModalOpen(true)}
              className="text-xs font-bold bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              <span>Confirm & Lock VIP Reservation</span>
              <ArrowRight className="size-4 ml-1.5" />
            </Button>
          )}
        </div>

        {/* Confirmation Modal */}
        <Modal
          open={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          title="Confirm VIP Consultation Reservation"
        >
          {selectedSlot && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="rounded-2xl bg-amber-50/80 p-4 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
                  <span>{invite.title}</span>
                  <span className="font-black text-amber-900">
                    {quote ? `₹${rupees(quote.price_paise)}` : ""}
                  </span>
                </div>
                <p className="text-slate-600">
                  📅 {selectedSlot.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} • {clock(selectedSlot)}
                </p>
                <p className="text-slate-500 text-[11px]">
                  Practitioner: {invite.astrologer_name} · Duration: {minutes} mins
                </p>
              </div>

              {quote && !quote.can_afford ? (
                <div className="space-y-3">
                  <Alert tone="warning">
                    <Wallet className="size-4 mr-1.5 inline" />
                    <span>
                      Insufficient spendable coins ({quote.available_coins ?? quote.balance_coins} coins). Total coins required: {quote.total_coins} coins.
                    </span>
                  </Alert>
                  <Link href="/account/wallet" className="block w-full">
                    <Button size="lg" variant="secondary" className="w-full text-xs font-bold">
                      Add Coins to Wallet
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="pt-2">
                  <Button
                    size="lg"
                    loading={bookMutation.isPending}
                    onClick={() => bookMutation.mutate()}
                    className="w-full text-xs font-bold bg-gradient-to-r from-amber-600 to-orange-600 text-white"
                  >
                    <CheckCircle2 className="size-4 mr-1.5" />
                    Confirm Private Booking
                  </Button>
                  <p className="text-center text-[10px] text-slate-400 mt-2">
                    Held securely in escrow until consultation completion.
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </main>
  );
}

export default function PrivateBookingPage() {
  return (
    <>
      <SiteHeader />
      <React.Suspense
        fallback={
          <main className="min-h-screen bg-[#FDFBF7] py-20">
            <div className="mx-auto max-w-xl px-4">
              <LoadingBlock label="Loading VIP reservation..." />
            </div>
          </main>
        }
      >
        <PrivateBookingContent />
      </React.Suspense>
      <SiteFooter />
    </>
  );
}
