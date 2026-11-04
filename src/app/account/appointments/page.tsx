"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  Clock,
  Compass,
  Copy,
  ExternalLink,
  FileText,
  Flame,
  Gem,
  MessageSquare,
  Sparkles,
  Video,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

import {
  Avatar,
  Badge,
  Button,
  ConfirmModal,
  EmptyState,
  LoadingBlock,
} from "@/components/ui";
import { appointmentApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";
import { APPOINTMENT_STATUS_LABELS, type Appointment, type VedicPrescription } from "@/types";

const KEY = ["appointments", "mine"] as const;

function rupees(paise: number): string {
  return (paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

const PILLAR_LABELS: Record<string, { bn: string; hi: string; en: string; icon: string }> = {
  career_wealth: { bn: "কর্মজীবন ও ধনসম্পদ", hi: "करियर और धन", en: "Career & Wealth", icon: "💼" },
  love_marriage: { bn: "প্রেম ও বিবাহ মিলন", hi: "विवाह व प्रेम संबंध", en: "Love & Kundali Milan", icon: "💍" },
  health_longevity: { bn: "স্বাস্থ্য ও দীর্ঘায়ু", hi: "स्वास्थ्य व आरोग्यता", en: "Health & Vitality", icon: "🌿" },
  dosha_graha_shanti: { bn: "গ্রহশান্তি ও কালসর্প দোষ", hi: "दोष निवारण व शांति", en: "Graha Shanti & Doshas", icon: "🔥" },
  business_expansion: { bn: "ব্যবসা ও বাণিজ্য বিস্তার", hi: "व्यापार व निवेश", en: "Business & Investments", icon: "📈" },
  spiritual_guidance: { bn: "আধ্যাত্মিক সাধনা ও জ্ঞান", hi: "अध्यात्म व मोक्ष", en: "Spiritual Path & Moksha", icon: "🕉️" },
};

function formatCountdown(targetTime: number, now: number): { label: string; isLive: boolean } {
  const diff = targetTime - now;
  if (diff <= 0) {
    // If started within last 60 minutes
    if (diff > -60 * 60_000) {
      return { label: "🔴 লাইভ চলছে / Live Session Now", isLive: true };
    }
    return { label: "Completed", isLive: false };
  }
  const hours = Math.floor(diff / 3600_000);
  const minutes = Math.floor((diff % 3600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return { label: `${days}d ${hours % 24}h remaining`, isLive: false };
  }
  if (hours > 0) {
    return { label: `${hours}h ${minutes}m left`, isLive: false };
  }
  return { label: `Starts in ${minutes}m ${seconds}s`, isLive: minutes <= 15 };
}

function SessionTimer({ startsAt }: { startsAt: string }) {
  const target = React.useMemo(() => new Date(startsAt).getTime(), [startsAt]);
  const [now, setNow] = React.useState(Date.now());

  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { label, isLive } = formatCountdown(target, now);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums shadow-2xs",
        isLive
          ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/30 animate-pulse"
          : "bg-amber-500/10 text-amber-800 dark:text-amber-200 border border-amber-500/30",
      )}
    >
      <Clock className="size-3" />
      <span>{label}</span>
    </span>
  );
}

function VedicPrescriptionCard({ prescription, language }: { prescription: VedicPrescription; language: "bn" | "hi" | "en" }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const text = `--- ASTRA VEDIC PRESCRIPTION ---
Gemstone: ${prescription.gemstone || "None"}
Rudraksha: ${prescription.rudraksha || "None"}
Mantra: ${prescription.mantra || "None"} (${prescription.mantra_count || 108} times)
Daan/Remedy: ${prescription.daan_remedy || "None"}
Notes: ${prescription.astrologer_notes || "None"}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Vedic prescription copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-amber-500/10 to-orange-500/5 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300">
            <FileText className="size-4" />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-foreground">
              {language === "bn"
                ? "পবিত্র বৈদিক প্রেসক্রিপশন ও প্রতিকার নির্দেশিকা"
                : language === "hi"
                ? "पवित्र वैदिक परामर्श व उपाय पत्र"
                : "Sacred Vedic Prescription & Remedial Sheet"}
            </h4>
            <p className="text-[10px] text-muted-foreground">
              {language === "bn"
                ? "জ্যোতিষীর অনুমোদিত দৈব প্রতিকার ও মন্ত্র নির্দেশনা"
                : "Official Vedic remedies prescribed by your consulting astrologer"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-surface-muted transition-all shadow-2xs cursor-pointer"
        >
          <Copy className="size-3 text-muted-foreground" />
          <span>{copied ? "Copied" : "Copy Sheet"}</span>
        </button>
      </div>

      <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {prescription.gemstone && (
          <div className="rounded-xl border border-amber-500/20 bg-card/80 p-3">
            <p className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
              <Gem className="size-3" />
              <span>{language === "bn" ? "রত্ন প্রতিকার (Gemstone)" : "Prescribed Gemstone"}</span>
            </p>
            <p className="mt-1 font-semibold text-foreground text-xs">{prescription.gemstone}</p>
          </div>
        )}

        {prescription.rudraksha && (
          <div className="rounded-xl border border-amber-500/20 bg-card/80 p-3">
            <p className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
              <Sparkles className="size-3" />
              <span>{language === "bn" ? "রুদ্রাক্ষ প্রতিকার (Rudraksha)" : "Prescribed Rudraksha"}</span>
            </p>
            <p className="mt-1 font-semibold text-foreground text-xs">{prescription.rudraksha}</p>
          </div>
        )}

        {prescription.mantra && (
          <div className="sm:col-span-2 rounded-xl border border-amber-500/20 bg-card/80 p-3">
            <p className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Flame className="size-3" />
                <span>{language === "bn" ? "সিদ্ধ বৈদিক মন্ত্র (Sacred Mantra)" : "Sacred Mantra"}</span>
              </span>
              {prescription.mantra_count && (
                <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-200">
                  {prescription.mantra_count} {language === "bn" ? "বার জপ" : "times Japa"}
                </span>
              )}
            </p>
            <p className="mt-1.5 font-display font-medium text-amber-900 dark:text-amber-100 text-xs italic bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
              “{prescription.mantra}”
            </p>
          </div>
        )}

        {prescription.daan_remedy && (
          <div className="sm:col-span-2 rounded-xl border border-amber-500/20 bg-card/80 p-3">
            <p className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300">
              {language === "bn" ? "দান ও লোককল্যাণ প্রতিবিধান (Charity / Daan)" : "Vedic Daan & Charitable Rituals"}
            </p>
            <p className="mt-1 font-medium text-foreground text-xs">{prescription.daan_remedy}</p>
          </div>
        )}

        {prescription.astrologer_notes && (
          <div className="sm:col-span-2 rounded-xl border border-amber-500/20 bg-card/80 p-3">
            <p className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300">
              {language === "bn" ? "জ্যোতিষীর বিশেষ নির্দেশিকা (Astrologer Guidance)" : "Astrologer's Custom Guidance"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
              {prescription.astrologer_notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyAppointmentsPage() {
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const [cancelling, setCancelling] = React.useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: KEY,
    queryFn: () => appointmentApi.mine(false),
  });

  const cancel = useMutation({
    mutationFn: (id: string) => appointmentApi.cancel(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: KEY });
      setCancelling(null);
      toast.success(
        language === "bn" ? "অ্যাপয়েন্টমেন্ট সফলভাবে বাতিল করা হয়েছে।" : "Appointment cancelled successfully.",
      );
    },
    onError: (e: ApiError) => {
      setCancelling(null);
      toast.error(e.message);
    },
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            {language === "bn"
              ? "আমার পরামর্শ অ্যাপয়েন্টমেন্ট"
              : language === "hi"
              ? "मेरे परामर्श अपॉइंटमेंट"
              : "My Appointments"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {language === "bn"
              ? "আপনার বুক করা সকল জ্যোতিষ পরামর্শের তালিকা ও রিয়েলটাইম সময়সূচী।"
              : "What you have booked, soonest first with real-time consultation status."}
          </p>
        </div>

        <Link href="/appointments">
          <Button size="sm" className="text-xs font-semibold">
            <Sparkles className="size-3.5 mr-1" />
            {language === "bn" ? "নতুন স্লট বুক করুন" : "Book New Slot"}
          </Button>
        </Link>
      </header>

      {isLoading ? (
        <LoadingBlock label="Loading appointments..." />
      ) : !data?.length ? (
        <EmptyState
          icon={CalendarDays}
          title={language === "bn" ? "কোনো অ্যাপয়েন্টমেন্ট বুকিং নেই" : "No appointments yet"}
          description={
            language === "bn"
              ? "সেরা বৈদিক জ্যোতিষীর সাথে সরাসরি ১-অন-১ পরামর্শের জন্য এখনই সময় নির্ধারণ করুন।"
              : "Book a dedicated consultation time with an expert astrologer instead of waiting in line."
          }
          action={
            <Link href="/appointments">
              <Button>{language === "bn" ? "পরামর্শদাতা খুঁজুন" : "Find an Astrologer"}</Button>
            </Link>
          }
        />
      ) : (
        <ul className="space-y-4">
          {data.map((a: Appointment) => {
            const starts = new Date(a.starts_at);
            const now = Date.now();
            const startsMs = starts.getTime();
            const endsMs = startsMs + a.minutes * 60_000;
            const upcoming = a.status === "booked" && endsMs > now;
            const isLiveWindow = a.status === "booked" && startsMs - now <= 15 * 60_000 && endsMs >= now;

            const pillar = a.consultation_pillar ? PILLAR_LABELS[a.consultation_pillar] : null;
            const pillarText = pillar
              ? language === "bn"
                ? pillar.bn
                : language === "hi"
                ? pillar.hi
                : pillar.en
              : null;

            return (
              <li
                key={a.id}
                className={cn(
                  "rounded-2xl border bg-card p-5 shadow-2xs transition-all",
                  isLiveWindow
                    ? "border-brand-500/60 ring-2 ring-brand-500/20 bg-brand-500/[0.02]"
                    : "border-border/80",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <Avatar src={a.peer?.avatar_url} name={a.peer?.name} size="lg" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-display font-bold text-base text-foreground">
                          {a.peer?.name ?? "Astrologer"}
                        </p>
                        <Badge tone={a.status === "booked" ? "green" : "neutral"}>
                          {APPOINTMENT_STATUS_LABELS[a.status]}
                        </Badge>
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                        <span>
                          {starts.toLocaleDateString([], {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-foreground tabular-nums">
                          {starts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span>•</span>
                        <span>{a.minutes} min session</span>
                      </p>
                    </div>
                  </div>

                  {/* Realtime Status / Countdown / Enter Chamber Action */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {upcoming && <SessionTimer startsAt={a.starts_at} />}

                    {isLiveWindow && (
                      <Link href={`/call/${a.peer?.id || a.id}`}>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md">
                          <Video className="size-3.5 mr-1" />
                          {language === "bn" ? "মহাজাগতিক চেম্বারে প্রবেশ করুন" : "Enter Consultation Chamber"}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Consultation Details Badges */}
                <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-3 border-t border-border/60 text-xs">
                  {pillar && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-muted px-2.5 py-1 font-medium text-foreground border border-border/50">
                      <span>{pillar.icon}</span>
                      <span>{pillarText}</span>
                    </span>
                  )}

                  {a.muhurat_type && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 py-1 font-semibold text-amber-800 dark:text-amber-200 border border-amber-500/30">
                      <Sparkles className="size-3 text-amber-600" />
                      <span>{a.muhurat_type}</span>
                    </span>
                  )}
                </div>

                {/* Financial Summary */}
                <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 rounded-xl bg-surface-muted/50 p-3 text-xs border border-border/40">
                  <div className="flex gap-1.5">
                    <dt className="text-muted-foreground">Total Fee:</dt>
                    <dd className="font-bold tabular-nums text-foreground">₹{rupees(a.price_paise)}</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="text-muted-foreground">Paid Deposit:</dt>
                    <dd className="font-semibold tabular-nums text-brand-600 dark:text-brand-400">
                      ₹{rupees(a.deposit_paise)} ({a.deposit_coins} coins)
                    </dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="text-muted-foreground">
                      {a.status === "cancelled" ? "Cancelled" : "Due at Session:"}
                    </dt>
                    <dd className="font-bold tabular-nums text-foreground">
                      ₹{rupees(a.balance_due_paise)}
                    </dd>
                  </div>
                </dl>

                {/* Post-Consultation Sacred Vedic Prescription */}
                {a.prescription && (
                  <VedicPrescriptionCard prescription={a.prescription} language={language} />
                )}

                {/* Cancellation trigger */}
                {upcoming && (
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-danger hover:bg-danger/10"
                      onClick={() => setCancelling(a.id)}
                    >
                      {language === "bn" ? "স্লট বাতিল করুন" : "Cancel Appointment"}
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmModal
        open={Boolean(cancelling)}
        onClose={() => setCancelling(null)}
        onConfirm={() => cancelling && cancel.mutate(cancelling)}
        title={language === "bn" ? "অ্যাপয়েন্টমেন্ট বাতিল করবেন?" : "Cancel this appointment?"}
        description={
          language === "bn"
            ? "স্লট নিশ্চিত করার জন্য জমা দেওয়া অগ্রিম কয়েন ফেরতযোগ্য নয়।"
            : "The amount you paid to hold the slot is not refunded."
        }
        confirmLabel={language === "bn" ? "হ্যাঁ, বাতিল করুন" : "Cancel it"}
        loading={cancel.isPending}
      />
    </div>
  );
}
