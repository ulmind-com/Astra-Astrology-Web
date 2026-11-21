"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Info,
  Loader2,
  Moon,
  Power,
  RefreshCw,
  Sparkles,
  Sun,
  TrendingUp,
  Zap,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Badge, Button } from "@/components/ui";
import { appointmentApi, astrologerApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";
import type { AuspiciousTransitInfo, AuspiciousTransitSurgeResult } from "@/types";

function getTodayString(): string {
  // Format as YYYY-MM-DD in local time
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function AuspiciousDaySurgeCard() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === "bn";
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = React.useState<string>(getTodayString);
  const [multiplier, setMultiplier] = React.useState<number>(1.5);
  const [customTitle, setCustomTitle] = React.useState<string>("");
  const [openSurgeWindow, setOpenSurgeWindow] = React.useState<boolean>(true);
  const [fromTime, setFromTime] = React.useState<string>("10:00");
  const [toTime, setToTime] = React.useState<string>("22:00");

  const isAstrologerRole =
    user?.role === "astrologer" ||
    user?.role === "admin" ||
    user?.role === "super_admin";

  // 1. Fetch transit details for selected date
  const {
    data: transit,
    isLoading: isTransitLoading,
    refetch: refetchTransit,
  } = useQuery<AuspiciousTransitInfo>({
    queryKey: ["auspicious-transit", selectedDate],
    queryFn: () => appointmentApi.getAuspiciousTransit(selectedDate),
    enabled: Boolean(isAstrologerRole),
    staleTime: 60 * 1000,
  });

  // 2. Fetch astrologer profile to inspect tatkal defaults
  const { data: astroProfile } = useQuery({
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
  });

  // 3. Fetch astrologer's day slots to see if surge is currently active for selected date
  const { data: daySlots, isLoading: isDaySlotsLoading } = useQuery({
    queryKey: ["appointments", "day-view", user?.id, selectedDate],
    queryFn: async () => {
      if (!user?.id) return null;
      try {
        return await appointmentApi.day(user.id, selectedDate);
      } catch {
        return null;
      }
    },
    enabled: Boolean(isAstrologerRole && user?.id),
    staleTime: 15 * 1000,
  });

  // Check if any tatkal window on this day currently has surge active
  const isSurgeCurrentlyActive = Boolean(
    daySlots?.tatkal_windows && daySlots.tatkal_windows.length > 0
  );

  const activeMultiplier = React.useMemo(() => {
    const tatkalWin = daySlots?.tatkal_windows?.[0];
    if (tatkalWin && tatkalWin.tatkal_multiplier) {
      return tatkalWin.tatkal_multiplier;
    }
    return multiplier;
  }, [daySlots, multiplier]);

  // Set recommended multiplier whenever transit changes
  React.useEffect(() => {
    if (transit?.recommended_multiplier && transit.recommended_multiplier > 1.0) {
      setMultiplier(transit.recommended_multiplier);
    }
  }, [transit]);

  // Activate Mutation
  const activateMutation = useMutation({
    mutationFn: () =>
      appointmentApi.activateAuspiciousSurge({
        day: selectedDate,
        multiplier,
        custom_title: customTitle.trim() || undefined,
        open_surge_window: openSurgeWindow,
        from_time: fromTime,
        to_time: toTime,
      }),
    onSuccess: (res: AuspiciousTransitSurgeResult) => {
      toast.success(
        res.message ||
          (isBn
            ? `তৎকাল সার্জ (${multiplier}x) সফলভাবে সক্রিয় করা হয়েছে!`
            : `Surge Pricing (${multiplier}x) activated successfully!`)
      );
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
      void queryClient.invalidateQueries({ queryKey: ["astrologer", "me"] });
      void queryClient.invalidateQueries({ queryKey: ["auspicious-transit", selectedDate] });
    },
    onError: (err: any) => {
      const msg = err?.message || (isBn ? "সার্জ সক্রিয় করতে ব্যর্থ হয়েছে।" : "Failed to activate surge pricing.");
      toast.error(msg);
    },
  });

  // Deactivate Mutation
  const deactivateMutation = useMutation({
    mutationFn: () => appointmentApi.deactivateAuspiciousSurge(selectedDate),
    onSuccess: (res) => {
      toast.success(
        res.message ||
          (isBn
            ? "তৎকাল সার্জ নিষ্ক্রিয় করা হয়েছে ও স্বাভাবিক রেট পুনঃস্থাপিত হয়েছে।"
            : "Surge pricing deactivated. Standard rates restored.")
      );
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
      void queryClient.invalidateQueries({ queryKey: ["astrologer", "me"] });
      void queryClient.invalidateQueries({ queryKey: ["auspicious-transit", selectedDate] });
    },
    onError: (err: any) => {
      const msg = err?.message || (isBn ? "সার্জ নিষ্ক্রিয় করতে ব্যর্থ হয়েছে।" : "Failed to deactivate surge pricing.");
      toast.error(msg);
    },
  });

  if (!isAstrologerRole) {
    return null;
  }

  const isAuspicious = Boolean(transit?.is_auspicious_transit_day);
  const isPending = activateMutation.isPending || deactivateMutation.isPending;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all duration-300 shadow-sm",
        isAuspicious
          ? "border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-purple-950/20 shadow-amber-500/5 ring-1 ring-amber-500/20"
          : "border-border bg-card/60"
      )}
    >
      {/* Background celestial glow decoration */}
      {isAuspicious && (
        <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-amber-500/10 blur-3xl" />
      )}

      {/* Header bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border/60">
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl",
              isAuspicious
                ? "bg-gradient-to-tr from-amber-500 to-amber-400 text-white shadow-md shadow-amber-500/20 animate-pulse"
                : "bg-surface-muted text-muted-foreground"
            )}
          >
            {transit?.event_key?.includes("grahan") ? (
              <Moon className="size-5" />
            ) : transit?.event_key?.includes("pushya") ? (
              <Sparkles className="size-5" />
            ) : isAuspicious ? (
              <Flame className="size-5" />
            ) : (
              <Sun className="size-5" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display font-bold text-base sm:text-lg text-foreground">
                {isBn ? "শুভ তিথিতে তৎকাল সার্জ প্রাইসিং" : "Auspicious Transit Tatkal Surge"}
              </h3>
              {isAuspicious ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30">
                  <Sparkles className="size-3" />
                  {transit?.demand_factor} {isBn ? "প্রতিকার চাহিদা সার্জ" : "Demand Surge"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {isBn ? "স্বাভাবিক তিথি" : "Regular Transit"}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isBn
                ? "অমাবস্যা, পূর্ণিমা, শনি প্রদোষ বা গ্রহণ লগ্নে ১-ক্লিকে ২৫% বা ৫০% প্রিমিয়াম রেট নির্ধারণ করুন"
                : "1-Click activate +25% or +50% sacred Tatkal consultation rates during peak spiritual demand"}
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs">
            <Calendar className="size-3.5 text-muted-foreground" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-foreground focus:outline-hidden text-xs cursor-pointer"
            />
          </div>
          <button
            type="button"
            onClick={() => refetchTransit()}
            disabled={isTransitLoading}
            className="rounded-lg border border-border bg-background p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh Transit Calculation"
          >
            <RefreshCw className={cn("size-3.5", isTransitLoading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Transit Insight Card */}
      <div className="mt-4">
        {isTransitLoading ? (
          <div className="flex items-center gap-2 py-3 text-xs text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-amber-500" />
            <span>{isBn ? "বৈদিক ট্রানজিট ও তিথি গণনা করা হচ্ছে..." : "Calculating Vedic planetary transit..."}</span>
          </div>
        ) : transit ? (
          <div
            className={cn(
              "rounded-xl p-3.5 sm:p-4 text-xs transition-colors",
              isAuspicious
                ? "bg-amber-500/10 border border-amber-500/20 text-amber-950 dark:text-amber-100"
                : "bg-surface-muted/50 border border-border/50 text-foreground"
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-amber-500/10">
              <div className="flex items-center gap-2 font-semibold">
                <span className="size-2 rounded-full bg-amber-500 animate-ping" />
                <span className="text-sm">
                  {isBn ? transit.event_name_bn || "শুভ লগ্ন" : transit.event_name_en || "Sacred Transit"}
                </span>
                <span className="text-muted-foreground font-normal">
                  ({transit.paksha_bn || transit.paksha_en} • তিথি {transit.tithi_num})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">
                  {isBn ? "সুপারিশকৃত রেট:" : "Recommended Surge:"}
                </span>
                <Badge tone="gold" className="font-bold">
                  {transit.recommended_multiplier}x
                </Badge>
              </div>
            </div>

            {transit.spiritual_reason_bn && (
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                <strong className="text-foreground">{isBn ? "আধ্যাত্মিক তাৎপর্য: " : "Spiritual Significance: "}</strong>
                {isBn ? transit.spiritual_reason_bn : transit.spiritual_reason_en}
              </p>
            )}

            {transit.remedy_focus_bn && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-medium text-foreground">
                  {isBn ? "উচ্চ চাহিদাসম্পন্ন প্রতিকারসমূহ:" : "High-Demand Remedies:"}
                </span>
                <span className="inline-block rounded-md bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:text-amber-200">
                  {transit.remedy_focus_bn}
                </span>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Surge Controls Form */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-3 border-t border-border/40">
        {/* Left Column: Multiplier Chips */}
        <div className="md:col-span-7 space-y-2">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <TrendingUp className="size-3.5 text-amber-600 dark:text-amber-400" />
            <span>{isBn ? "তৎকাল প্রিমিয়াম রেট সিলেক্ট করুন:" : "Select Tatkal Surge Multiplier:"}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { val: 1.25, label: "+25% (1.25x)", noteBn: "হালকা বৃদ্ধি" },
              { val: 1.5, label: "+50% (1.50x)", noteBn: "শাস্ত্রীয় মান (Recommended)" },
              { val: 2.0, label: "+100% (2.00x)", noteBn: "মহাযোগ প্রিমিয়াম" },
            ].map((opt) => {
              const isSelected = multiplier === opt.val;
              return (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setMultiplier(opt.val)}
                  className={cn(
                    "flex flex-col items-start rounded-xl px-3 py-2 text-left transition-all border cursor-pointer",
                    isSelected
                      ? "border-amber-500 bg-amber-500/15 text-amber-900 dark:text-amber-100 ring-2 ring-amber-500/30"
                      : "border-border bg-background hover:bg-surface-muted text-muted-foreground"
                  )}
                >
                  <span className="text-xs font-bold text-foreground">{opt.label}</span>
                  <span className="text-[10px] text-muted-foreground">{isBn ? opt.noteBn : `${opt.val}x standard rate`}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Options */}
          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={openSurgeWindow}
                onChange={(e) => setOpenSurgeWindow(e.target.checked)}
                className="size-3.5 rounded border-border text-amber-500 focus:ring-amber-500"
              />
              <span>
                {isBn
                  ? "স্লট না থাকলে তাৎক্ষণিক ইমার্জেন্সি উইন্ডো খুলুন (10:00 - 22:00 IST)"
                  : "Auto-open Tatkal availability window if none exists today"}
              </span>
            </label>
          </div>
        </div>

        {/* Right Column: 1-Click Action Buttons & Current Status */}
        <div className="md:col-span-5 flex flex-col justify-end gap-2.5 sm:border-l sm:border-border/40 sm:pl-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{isBn ? "সার্জ স্ট্যাটাস:" : "Surge Status:"}</span>
            {isSurgeCurrentlyActive ? (
              <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                <Zap className="size-3.5 fill-amber-500 text-amber-500" />
                {isBn ? `সক্রিয় (${activeMultiplier}x রেট)` : `Active (${activeMultiplier}x Rate)`}
              </span>
            ) : (
              <span className="text-muted-foreground font-medium">
                {isBn ? "স্বাভাবিক মূল্যমান (1.0x)" : "Standard Rate (1.0x)"}
              </span>
            )}
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant={isAuspicious ? "primary" : "secondary"}
              disabled={isPending}
              onClick={() => activateMutation.mutate()}
              className={cn(
                "flex-1 items-center justify-center gap-1.5 shadow-sm font-semibold",
                isAuspicious && "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white"
              )}
            >
              {activateMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Zap className="size-4 fill-current" />
              )}
              <span>
                {isBn
                  ? `১-ক্লিকে ${multiplier}x সার্জ চালু করুন`
                  : `1-Click Activate ${multiplier}x Surge`}
              </span>
            </Button>

            {isSurgeCurrentlyActive && (
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => deactivateMutation.mutate()}
                className="items-center justify-center gap-1 border-border hover:bg-surface-muted text-muted-foreground hover:text-foreground text-xs"
                title="Deactivate Surge and revert to 1.0x standard card rate"
              >
                {deactivateMutation.isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Power className="size-3.5 text-rose-500" />
                )}
                <span>{isBn ? "স্বাভাবিক রেটে ফেরান" : "Revert Standard"}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
