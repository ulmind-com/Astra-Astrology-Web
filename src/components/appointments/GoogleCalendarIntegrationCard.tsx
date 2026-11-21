"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { appointmentApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";

export function GoogleIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

function formatRelativeTime(isoString: string | null | undefined, isBn: boolean): string {
  if (!isoString) return isBn ? "কখনো সিঙ্ক হয়নি" : "Never synced";
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);

    if (diffMin < 1) {
      return isBn ? "এইমাত্র" : "Just now";
    }
    if (diffMin < 60) {
      return isBn ? `${diffMin} মিনিট আগে` : `${diffMin}m ago`;
    }
    if (diffHour < 24) {
      return isBn ? `${diffHour} ঘণ্টা আগে` : `${diffHour}h ago`;
    }
    return new Date(isoString).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isBn ? "সম্প্রতি" : "Recently";
  }
}

export function GoogleCalendarIntegrationCard() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === "bn";
  const queryClient = useQueryClient();

  const [isConnecting, setIsConnecting] = React.useState(false);
  const [disconnectConfirmOpen, setDisconnectConfirmOpen] = React.useState(false);

  // Status Query: automatically checks if the astrologer has calendar linked
  const {
    data: googleSync,
    isLoading: statusLoading,
    error: statusError,
  } = useQuery({
    queryKey: ["google_calendar_status"],
    queryFn: async () => {
      try {
        return await appointmentApi.getGoogleCalendarStatus();
      } catch (err: any) {
        // If 403 Forbidden, user is a seeker without an astrologer profile
        if (err instanceof ApiError && err.status === 403) {
          return null;
        }
        throw err;
      }
    },
    staleTime: 60 * 1000,
    retry: false,
  });

  // Handle OAuth Redirect Callback (?code=... or ?error=...)
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");

    if (error) {
      toast.error(
        isBn
          ? "গুগল অথেনটিকেশন বাতিল করা হয়েছে।"
          : "Google Calendar authorization was cancelled."
      );
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      url.searchParams.delete("error_description");
      window.history.replaceState({}, document.title, url.pathname);
      return;
    }

    if (code) {
      setIsConnecting(true);
      const redirectUri = `${window.location.origin}/account/appointments`;
      toast.loading(
        isBn ? "গুগল ক্যালেন্ডার সংযুক্ত হচ্ছে..." : "Connecting Google Calendar...",
        { id: "gcal-connecting" }
      );

      appointmentApi
        .googleCalendarCallback(code, redirectUri)
        .then((res) => {
          toast.success(
            isBn
              ? `✅ গুগল ক্যালেন্ডার সফলভাবে যুক্ত হয়েছে (${res.email})! দ্বিমুখী সিঙ্ক সক্রিয়।`
              : `✅ Google Calendar connected (${res.email})! 2-way sync is active.`,
            { id: "gcal-connecting" }
          );
          void queryClient.invalidateQueries({ queryKey: ["google_calendar_status"] });
          void queryClient.invalidateQueries({ queryKey: ["appointments", "mine"] });
        })
        .catch((err: any) => {
          toast.error(
            err?.message ||
              (isBn
                ? "গুগল ক্যালেন্ডার কানেক্ট করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।"
                : "Could not connect Google Calendar. Please try again."),
            { id: "gcal-connecting" }
          );
        })
        .finally(() => {
          setIsConnecting(false);
          const url = new URL(window.location.href);
          url.searchParams.delete("code");
          url.searchParams.delete("scope");
          url.searchParams.delete("state");
          window.history.replaceState({}, document.title, url.pathname);
        });
    }
  }, [isBn, queryClient]);

  // Connect click handler
  const handleConnectGoogle = async () => {
    setIsConnecting(true);
    try {
      const redirectUri =
        typeof window !== "undefined"
          ? `${window.location.origin}/account/appointments`
          : undefined;
      const res = await appointmentApi.getGoogleCalendarAuthUrl(redirectUri);
      if (res?.auth_url) {
        window.location.href = res.auth_url;
      } else {
        toast.error(
          isBn
            ? "গুগল অথেনটিকেশন লিংক তৈরি করা যায়নি।"
            : "Could not obtain Google authentication URL."
        );
        setIsConnecting(false);
      }
    } catch (err: any) {
      toast.error(
        err?.message ||
          (isBn
            ? "সংযোগ স্থাপন করতে সমস্যা হয়েছে।"
            : "Failed to initiate Google Calendar connection.")
      );
      setIsConnecting(false);
    }
  };

  // Manual Sync Mutation
  const syncMutation = useMutation({
    mutationFn: () => appointmentApi.syncGoogleCalendar(),
    onSuccess: (data) => {
      toast.success(
        data.message ||
          (isBn
            ? `✅ গুগল ক্যালেন্ডার সিঙ্ক সম্পন্ন! ${data.busy_count}টি বাহ্যিক ইভেন্ট সুরক্ষিত রাখা হয়েছে।`
            : `✅ Google Calendar synced! ${data.busy_count} external commitments shielded.`)
      );
      void queryClient.invalidateQueries({ queryKey: ["google_calendar_status"] });
      void queryClient.invalidateQueries({ queryKey: ["appointments", "mine"] });
    },
    onError: (err: any) => {
      toast.error(
        err?.message ||
          (isBn ? "সিঙ্ক করতে ব্যর্থ হয়েছে।" : "Failed to sync with Google Calendar.")
      );
    },
  });

  // Disconnect Mutation
  const disconnectMutation = useMutation({
    mutationFn: () => appointmentApi.disconnectGoogleCalendar(),
    onSuccess: () => {
      toast.success(
        isBn
          ? "গুগল ক্যালেন্ডারের সংযোগ বিচ্ছিন্ন করা হয়েছে।"
          : "Google Calendar disconnected successfully."
      );
      setDisconnectConfirmOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["google_calendar_status"] });
      void queryClient.invalidateQueries({ queryKey: ["appointments", "mine"] });
    },
    onError: (err: any) => {
      toast.error(
        err?.message ||
          (isBn
            ? "সংযোগ বিচ্ছিন্ন করা সম্ভব হয়নি।"
            : "Failed to disconnect Google Calendar.")
      );
    },
  });

  // Do not render if the user is definitely a seeker without astrologer/admin privileges
  const isAstrologerRole =
    user?.role === "astrologer" ||
    user?.role === "admin" ||
    user?.role === "super_admin";

  if (!isAstrologerRole && googleSync === null && !statusLoading) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/70 via-white to-sky-50/50 p-4 sm:p-5 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left Info Column */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-white border border-indigo-100 shadow-2xs shrink-0">
              <GoogleIcon className="size-4" />
            </div>

            <h3 className="font-cinzel text-sm sm:text-base font-bold text-stone-900 tracking-tight flex items-center gap-1.5">
              <span>{isBn ? "গুগল ক্যালেন্ডার ২-ওয়ে অটো-সিঙ্ক" : "Google Calendar 2-Way Sync"}</span>
            </h3>

            {googleSync?.connected ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 text-[11px] font-bold text-emerald-900 shadow-2xs">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isBn ? "স্বয়ংক্রিয় সিঙ্ক সক্রিয়" : "Auto-Sync Enabled"}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/80 border border-amber-300 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900 shadow-2xs">
                <Zap className="size-3 text-amber-600" />
                <span>{isBn ? "ডাবল-বুকিং প্রতিরোধ" : "Double-Booking Shield"}</span>
              </span>
            )}
          </div>

          <p className="text-xs text-stone-600 leading-relaxed max-w-2xl">
            {googleSync?.connected
              ? isBn
                ? "আপনার গুগল ক্যালেন্ডারের যেকোনো ব্যক্তিগত সময় আস্ট্রায় স্বয়ংক্রিয়ভাবে ব্লক থাকে এবং আস্ট্রার বুকিংগুলো সরাসরি আপনার গুগল ক্যালেন্ডারে যুক্ত হয়।"
                : "Your personal doctor visits, family events, and external appointments automatically block Astra consultation slots to prevent double-booking."
              : isBn
              ? "ব্যক্তিগত কাজ, ডাক্তার বা পারিবারিক অ্যাপয়েন্টমেন্টের সময় আস্ট্রার বুকিং স্লট স্বয়ংক্রিয়ভাবে বন্ধ রাখতে গুগল ক্যালেন্ডার যুক্ত করুন (ডাবল-বুকিং প্রতিরোধ)।"
              : "Connect your Google Calendar to automatically block Astra consultation slots during your personal appointments, doctor visits, and commitments."}
          </p>

          {/* Connected Details Pill Strip */}
          {googleSync?.connected && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-medium text-stone-600">
              {googleSync.email && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-white/90 border border-stone-200 px-2 py-0.5 text-stone-800 shadow-2xs">
                  <span className="text-stone-400">Google:</span>
                  <strong className="font-semibold">{googleSync.email}</strong>
                </span>
              )}

              <span className="inline-flex items-center gap-1 rounded-lg bg-purple-100/80 border border-purple-200 px-2 py-0.5 text-purple-900 font-semibold shadow-2xs">
                <ShieldCheck className="size-3 text-purple-700" />
                <span>
                  {isBn
                    ? `${googleSync.busy_count}টি বাহ্যিক ইভেন্ট সুরক্ষিত (Blocked)`
                    : `${googleSync.busy_count} External Events Shielded`}
                </span>
              </span>

              <span className="inline-flex items-center gap-1 text-[11px] text-stone-500">
                <Clock className="size-3 text-stone-400" />
                <span>
                  {isBn ? "সর্বশেষ সিঙ্ক:" : "Last Synced:"}{" "}
                  <strong>{formatRelativeTime(googleSync.last_synced_at, isBn)}</strong>
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Right Actions Column */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 sm:self-center">
          {statusLoading || isConnecting ? (
            <div className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white/80 px-4 py-2 text-xs font-semibold text-stone-600 shadow-2xs">
              <Loader2 className="size-4 animate-spin text-amber-600" />
              <span>{isBn ? "সংযোগ পরীক্ষা হচ্ছে..." : "Checking sync..."}</span>
            </div>
          ) : googleSync?.connected ? (
            <>
              {/* Sync Now Button */}
              <button
                type="button"
                onClick={() => syncMutation.mutate()}
                disabled={syncMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-indigo-200 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50 hover:text-indigo-900 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                title="Refresh busy periods from Google Calendar"
              >
                <RefreshCw
                  className={cn("size-3.5 text-indigo-600", syncMutation.isPending && "animate-spin")}
                />
                <span>
                  {syncMutation.isPending
                    ? isBn
                      ? "সিঙ্ক হচ্ছে..."
                      : "Syncing..."
                    : isBn
                    ? "এখনই সিঙ্ক করুন (Sync)"
                    : "Sync Now"}
                </span>
              </button>

              {/* Disconnect Button */}
              <button
                type="button"
                onClick={() => setDisconnectConfirmOpen(true)}
                disabled={disconnectMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-rose-200 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                title="Disconnect Google Calendar"
              >
                <Trash2 className="size-3 text-rose-500" />
                <span>{isBn ? "সংযোগ বিচ্ছিন্ন" : "Disconnect"}</span>
              </button>
            </>
          ) : (
            /* Connect Button */
            <button
              type="button"
              onClick={handleConnectGoogle}
              disabled={isConnecting}
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-xs cursor-pointer hover:shadow-md disabled:opacity-60"
            >
              <GoogleIcon className="size-4" />
              <span>
                {isConnecting
                  ? isBn
                    ? "সংযোগ স্থাপন হচ্ছে..."
                    : "Connecting..."
                  : isBn
                  ? "গুগল ক্যালেন্ডার যুক্ত করুন"
                  : "Connect with Google Calendar"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Disconnect Confirmation Modal */}
      {disconnectConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="size-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="size-5" />
              </div>
              <div>
                <h4 className="font-cinzel text-base font-bold text-stone-900">
                  {isBn ? "সংযোগ বিচ্ছিন্ন নিশ্চিতকরণ" : "Disconnect Google Calendar"}
                </h4>
                <p className="text-xs text-stone-500">
                  {isBn ? "দ্বিমুখী সিঙ্ক নিষ্ক্রিয় হবে" : "2-Way sync will be deactivated"}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {isBn
                ? "আপনি কি নিশ্চিত যে গুগল ক্যালেন্ডারের সংযোগ বিচ্ছিন্ন করতে চান? সংযোগ বিচ্ছিন্ন করলে আপনার ব্যক্তিগত ইভেন্টগুলো আর আস্ট্রার স্লট ব্লক করবে না, যার ফলে ডাবল-বুকিংয়ের ঝুঁকি তৈরি হতে পারে।"
                : "Are you sure you want to disconnect Google Calendar? External commitments will no longer automatically shield Astra consultation slots, which may lead to double-bookings."}
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDisconnectConfirmOpen(false)}
                disabled={disconnectMutation.isPending}
                className="rounded-xl border border-stone-200 px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                {isBn ? "বাতিল" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => disconnectMutation.mutate()}
                disabled={disconnectMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {disconnectMutation.isPending && <Loader2 className="size-3.5 animate-spin" />}
                <span>{isBn ? "হ্যাঁ, বিচ্ছিন্ন করুন" : "Yes, Disconnect"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
