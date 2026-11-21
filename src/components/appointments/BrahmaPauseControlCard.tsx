"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Clock,
  ShieldAlert,
  CalendarDays,
  Sparkles,
  Info,
  CheckCircle2,
  X,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button, Modal } from "@/components/ui";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";
import { appointmentApi, astrologerApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { AstrologerProfile } from "@/types";

interface BrahmaPauseOption {
  hours: number;
  label_bn: string;
  label_en: string;
  desc_bn: string;
  desc_en: string;
}

const PAUSE_OPTIONS: BrahmaPauseOption[] = [
  {
    hours: 0.5,
    label_bn: "৩০ মিনিট",
    label_en: "30 Mins",
    desc_bn: "জরুরি সংক্ষিপ্ত বিরতি",
    desc_en: "Quick emergency break",
  },
  {
    hours: 1,
    label_bn: "১ ঘণ্টা",
    label_en: "1 Hour",
    desc_bn: "সংক্ষিপ্ত জরুরি বিরতি",
    desc_en: "Short emergency",
  },
  {
    hours: 2,
    label_bn: "২ ঘণ্টা",
    label_en: "2 Hours",
    desc_bn: "ব্যক্তিগত জরুরি কাজ",
    desc_en: "Urgent personal task",
  },
  {
    hours: 3,
    label_bn: "৩ ঘণ্টা (ডিফল্ট)",
    label_en: "3 Hours (Default)",
    desc_bn: "স্ট্যান্ডার্ড জরুরি বিরতি",
    desc_en: "Standard pause",
  },
  {
    hours: 4,
    label_bn: "৪ ঘণ্টা",
    label_en: "4 Hours",
    desc_bn: "অর্ধ দিবস / বিশেষ পুজো",
    desc_en: "Half-day break",
  },
  {
    hours: 6,
    label_bn: "৬ ঘণ্টা",
    label_en: "6 Hours",
    desc_bn: "দীক্ষা বা পুজো অনুষ্ঠান",
    desc_en: "Spiritual rites",
  },
  {
    hours: 12,
    label_bn: "১২ ঘণ্টা",
    label_en: "12 Hours",
    desc_bn: "পূর্ণ দিবস স্থগিত",
    desc_en: "Full daytime pause",
  },
  {
    hours: 24,
    label_bn: "২৪ ঘণ্টা",
    label_en: "24 Hours",
    desc_bn: "পূর্ণ দিন ও রাত",
    desc_en: "Full day & night",
  },
];

export function BrahmaPauseControlCard() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === "bn";
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = React.useState(false);
  const [selectedDuration, setSelectedDuration] = React.useState<number>(3);
  const [pauseReason, setPauseReason] = React.useState("");

  const isAstrologerRole =
    user?.role === "astrologer" ||
    user?.role === "admin" ||
    user?.role === "super_admin";

  const { data: profile, isLoading } = useQuery<AstrologerProfile | null>({
    queryKey: ["astrologer", "me"],
    queryFn: async () => {
      try {
        return await astrologerApi.me();
      } catch (err: any) {
        if (err instanceof ApiError && (err.status === 403 || err.status === 404)) {
          return null;
        }
        throw err;
      }
    },
    enabled: Boolean(isAstrologerRole),
    staleTime: 30 * 1000,
    retry: false,
  });

  const isPaused = Boolean(
    profile?.brahma_pause_until &&
      new Date(profile.brahma_pause_until).getTime() > Date.now()
  );

  const activateMutation = useMutation({
    mutationFn: () =>
      appointmentApi.activateBrahmaPause({
        duration_hours: selectedDuration,
        reason: pauseReason.trim() || null,
      }),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: ["astrologer", "me"] });
      void queryClient.invalidateQueries({ queryKey: ["appointments", "mine"] });
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
      setOpenModal(false);
      setPauseReason("");
      const untilStr = new Date(res.pause_until).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "short",
      });
      toast.success(
        isBn
          ? `🕊️ ব্রহ্মা পজ সক্রিয় হয়েছে (${untilStr} পর্যন্ত)। ${res.affected_appointments_count} জন বুকড ক্লায়েন্টকে অটো-রেসকিউ অপশন সহ নোটিফাই করা হয়েছে।`
          : `🕊️ Brahma Pause activated until ${untilStr}. ${res.affected_appointments_count} affected client(s) notified with 1-click rescue options.`
      );
    },
    onError: (err: any) => {
      toast.error(
        err?.message ||
          (isBn
            ? "ব্রহ্মা পজ সক্রিয় করতে ব্যর্থ হয়েছে।"
            : "Failed to activate Brahma Pause.")
      );
    },
  });

  const resumeMutation = useMutation({
    mutationFn: () => appointmentApi.resumeBrahmaPause(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["astrologer", "me"] });
      void queryClient.invalidateQueries({ queryKey: ["appointments", "mine"] });
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success(
        isBn
          ? "✅ ব্রহ্মা পজ সমাপ্ত হয়েছে! আপনার নিয়মিত সময়সূচী পুনরায় সক্রিয় করা হয়েছে।"
          : "✅ Brahma Pause ended successfully. Normal schedule restored!"
      );
    },
    onError: (err: any) => {
      toast.error(
        err?.message ||
          (isBn
            ? "বিরতি সমাপ্ত করতে ব্যর্থ হয়েছে।"
            : "Failed to end Brahma Pause.")
      );
    },
  });

  // Non-astrologer devotees do not see astrologer break controls
  if (!isAstrologerRole || (!profile && !isLoading)) {
    return null;
  }

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* Active Brahma Pause Banner (Emergency Offline State)          */}
      {/* ------------------------------------------------------------- */}
      {isPaused ? (
        <div className="rounded-2xl sm:rounded-3xl border-2 border-purple-400 bg-gradient-to-r from-purple-100/90 via-amber-50/80 to-purple-100/90 p-4 sm:p-6 shadow-md animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-purple-700 text-white shadow-md">
                <span className="text-xl">🕊️</span>
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-cinzel text-sm sm:text-base font-bold text-purple-950">
                    {isBn
                      ? "জরুরি ব্রহ্মা পজ (Brahma Pause) সক্রিয় রয়েছে"
                      : "Brahma Pause Emergency Break is Active"}
                  </h3>
                  <span className="rounded-full bg-purple-200 border border-purple-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-purple-950 animate-pulse">
                    {isBn ? "লাইভ অফলাইন" : "Live Offline"}
                  </span>
                </div>

                <p className="text-xs text-purple-900 leading-relaxed font-medium max-w-2xl">
                  {isBn
                    ? `সক্রিয় থাকবে: ${new Date(
                        profile!.brahma_pause_until!
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "numeric",
                        month: "short",
                      })} পর্যন্ত। এই বিরতিকালীন সময়ে পূর্বনির্ধারিত ক্লায়েন্টদের স্বয়ংক্রিয়ভাবে ১-ক্লিক ফ্রি রিশিডিউল অথবা ১০০% ওয়ালেট রিফান্ডের সুযোগ দেওয়া হয়েছে।`
                    : `Emergency shield active until ${new Date(
                        profile!.brahma_pause_until!
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "numeric",
                        month: "short",
                      })}. Booked clients have been notified with complimentary 1-click reschedule or 100% refund.`}
                  {profile?.brahma_pause_reason ? (
                    <span className="block mt-1 font-semibold text-purple-950">
                      {isBn ? "কারণ: " : "Reason: "} &ldquo;{profile.brahma_pause_reason}&rdquo;
                    </span>
                  ) : null}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              disabled={resumeMutation.isPending}
              onClick={() => resumeMutation.mutate()}
              className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shrink-0 shadow-sm cursor-pointer self-start sm:self-center"
            >
              <PlayCircle className="size-4 mr-1.5" />
              {resumeMutation.isPending
                ? isBn
                  ? "চালু করা হচ্ছে..."
                  : "Resuming..."
                : isBn
                ? "বিরতি শেষ করে শিডিউল চালু করুন"
                : "End Pause & Resume Schedule"}
            </Button>
          </div>
        </div>
      ) : (
        /* ----------------------------------------------------------- */
        /* Normal Standby Card (Trigger Button to Activate Break)      */
        /* ----------------------------------------------------------- */
        <div className="rounded-2xl border border-purple-200/90 bg-gradient-to-br from-purple-50/70 via-white to-pink-50/40 p-4 sm:p-5 shadow-xs transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700 border border-purple-200 shadow-2xs shrink-0">
                  <PauseCircle className="size-4" />
                </div>

                <h3 className="font-cinzel text-sm sm:text-base font-bold text-stone-900 tracking-tight flex items-center gap-1.5">
                  <span>
                    {isBn
                      ? "ব্রহ্মা পজ ও ক্লায়েন্ট অটো-রেসকিউ ইঞ্জিন"
                      : "Brahma Pause & Seeker Auto-Rescue Engine"}
                  </span>
                </h3>

                <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 border border-purple-200 px-2.5 py-0.5 text-[10px] font-bold text-purple-900 shadow-2xs">
                  <ShieldAlert className="size-3 text-purple-600" />
                  <span>{isBn ? "জরুরি ব্রেক কন্ট্রোল" : "Emergency Break Control"}</span>
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed max-w-2xl">
                {isBn
                  ? "জরুরি পারিবারিক পরিস্থিতি, অসুস্থতা বা বিশেষ আধ্যাত্মিক সাধনার কারণে ৩০ মিনিট থেকে ৪+ ঘণ্টার তাৎক্ষণিক ব্রেক সক্রিয় করুন। এই সময়ে কোনো সেশন থাকলে ক্লায়েন্টদের স্বয়ংক্রিয়ভাবে ১-ক্লিক ফ্রি রিশিডিউল অথবা ১০০% ইনস্ট্যান্ট ওয়ালেট রিফান্ডের ব্যবস্থা করবে আমাদের সিস্টেম।"
                  : "Activate an emergency pause from 30 mins up to 24 hours. Impacted clients are automatically shielded and offered 1-click complimentary rescheduling or 100% instant wallet refund."}
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => setOpenModal(true)}
              className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shrink-0 shadow-xs cursor-pointer self-start sm:self-center"
            >
              <PauseCircle className="size-4 mr-1.5" />
              <span>{isBn ? "🚨 Brahma Pause সক্রিয় করুন" : "🚨 Activate Brahma Pause"}</span>
            </Button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Brahma Pause Modal (Duration & Reason Selector)               */}
      {/* ------------------------------------------------------------- */}
      {openModal && (
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          title={
            isBn
              ? "🚨 ব্রহ্মা পজ সক্রিয় করুন (Brahma Pause Emergency Break)"
              : "🚨 Activate Brahma Pause (Emergency Break)"
          }
        >
          <div className="space-y-4 py-1 text-xs">
            <p className="text-stone-600 leading-relaxed">
              {isBn
                ? "জরুরি পরিস্থিতিতে আপনার সেশন স্থগিত রাখতে সময় বেছে নিন। এই সময়ে আপনার লাইভ কল অফলাইনে চলে যাবে এবং বুকড ক্লায়েন্টদের স্বয়ংক্রিয়ভাবে বিকল্প অপশন পাঠানো হবে।"
                : "Select the emergency pause duration. Your live status will go offline and impacted seekers will automatically receive complimentary rescue options."}
            </p>

            {/* Duration Selector */}
            <div>
              <label className="block text-[11px] font-bold text-stone-800 mb-2">
                {isBn ? "বিরতির সময়কাল নির্বাচন করুন *" : "Select Pause Duration *"}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PAUSE_OPTIONS.map((opt) => {
                  const isSelected = selectedDuration === opt.hours;
                  return (
                    <button
                      key={opt.hours}
                      type="button"
                      onClick={() => setSelectedDuration(opt.hours)}
                      className={`rounded-xl p-2.5 text-center transition-all border cursor-pointer ${
                        isSelected
                          ? "bg-purple-50 border-purple-500 ring-2 ring-purple-500/20 text-purple-950 font-bold"
                          : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      <p className="text-xs font-bold">
                        {isBn ? opt.label_bn : opt.label_en}
                      </p>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        {isBn ? opt.desc_bn : opt.desc_en}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reason Textarea */}
            <div>
              <label className="block text-[11px] font-bold text-stone-800 mb-1">
                {isBn
                  ? "কারণ বা ক্লায়েন্টের জন্য বার্তা (ঐচ্ছিক)"
                  : "Reason / Note for Clients (Optional)"}
              </label>
              <textarea
                rows={2}
                placeholder={
                  isBn
                    ? "যেমন: জরুরি পারিবারিক পরিস্থিতি / বিশেষ মন্দির পূজা ও সাধনা"
                    : "e.g. Unforeseen personal emergency / Sacred temple rites"
                }
                value={pauseReason}
                onChange={(e) => setPauseReason(e.target.value)}
                maxLength={200}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <p className="text-[10px] text-stone-400 text-right mt-0.5">
                {pauseReason.length}/200
              </p>
            </div>

            {/* Auto-Rescue Explanatory Box */}
            <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-3 space-y-1.5 text-amber-950">
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                <Sparkles className="size-3.5 text-amber-600 shrink-0" />
                <span>
                  {isBn ? "ক্লায়েন্ট অটো-রেসকিউ প্রোটোকল:" : "Client Auto-Rescue Protocol:"}
                </span>
              </div>
              <ul className="text-[11px] space-y-1 list-disc pl-4 text-stone-700">
                <li>
                  {isBn
                    ? "বুকড ক্লায়েন্টদের তৎক্ষণাৎ ইমেইল ও রিয়েলটাইম নোটিফিকেশন পাঠানো হবে।"
                    : "Affected clients instantly receive an email and in-app notification."}
                </li>
                <li>
                  {isBn
                    ? "তারা ১-ক্লিকে অন্য যেকোনো উন্মুক্ত স্লটে ফ্রিতে রিশিডিউল করতে পারবেন।"
                    : "Clients can shift to another slot for free with 1-click reschedule."}
                </li>
                <li>
                  {isBn
                    ? "অথবা তাৎক্ষণিক ১০০% রিফান্ড গ্রহণ করে ওয়ালেটে কয়েন ফেরত নিতে পারবেন।"
                    : "Or receive a 100% instant full refund back to their wallet balance."}
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpenModal(false)}
                disabled={activateMutation.isPending}
              >
                {isBn ? "বাতিল" : "Cancel"}
              </Button>
              <Button
                size="sm"
                disabled={activateMutation.isPending}
                onClick={() => activateMutation.mutate()}
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs"
              >
                {activateMutation.isPending
                  ? isBn
                    ? "সক্রিয় করা হচ্ছে..."
                    : "Activating..."
                  : isBn
                  ? "ব্রহ্মা পজ নিশ্চিত করুন"
                  : "Confirm & Activate"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
