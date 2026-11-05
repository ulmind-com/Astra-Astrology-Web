"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CalendarDays,
  Clock,
  Compass,
  Copy,
  ExternalLink,
  FileText,
  Flame,
  Gem,
  Lock,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

function getGoogleCalendarUrl(a: Appointment): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const toUtcStr = (date: Date) =>
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(
      date.getUTCHours(),
    )}${pad(date.getUTCMinutes())}00Z`;

  const start = toUtcStr(new Date(a.starts_at));
  const end = toUtcStr(new Date(a.ends_at));
  const astroName = a.peer?.name || "Astrologer";
  const pillar = a.consultation_pillar ? PILLAR_LABELS[a.consultation_pillar]?.en : "Vedic Astrology";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Sacred Astrology Consultation: ${astroName}`,
    dates: `${start}/${end}`,
    details: `1-on-1 Consultation on ${pillar} with ${astroName}. Sacred Chamber: https://astra-astrology-web.vercel.app/account/appointments`,
    location: "DivinLink Sacred Chamber",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const [cancelling, setCancelling] = React.useState<string | null>(null);
  const [joiningChamberId, setJoiningChamberId] = React.useState<string | null>(null);

  const handleEnterChamber = async (appointmentId: string) => {
    setJoiningChamberId(appointmentId);
    try {
      const res = await appointmentApi.joinChamber(appointmentId);
      if (res?.call_id) {
        router.push(`/call/${res.call_id}`);
      } else {
        toast.error("Could not initialize consultation chamber.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to enter chamber. Please try again.");
    } finally {
      setJoiningChamberId(null);
    }
  };

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

                    {upcoming && (
                      <a
                        href={getGoogleCalendarUrl(a)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-surface-muted/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-muted hover:border-amber-500/40 transition-all cursor-pointer shadow-2xs"
                        title="Add to Google Calendar"
                      >
                        <span>📅 Add to GCal</span>
                      </a>
                    )}

                    {isLiveWindow && (
                      <Button
                        size="sm"
                        disabled={joiningChamberId === a.id}
                        onClick={() => handleEnterChamber(a.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md cursor-pointer"
                      >
                        <Video className="size-3.5 mr-1" />
                        {joiningChamberId === a.id
                          ? (language === "bn" ? "প্রবেশ করা হচ্ছে..." : "Connecting...")
                          : (language === "bn" ? "মহাজাগতিক চেম্বারে প্রবেশ করুন" : "Enter Consultation Chamber")}
                      </Button>
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

                  <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/15 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                    <Sparkles className="size-3 text-amber-500" />
                    <span>{a.cosmic_synergy_score || 88}% Cosmic Synergy</span>
                  </span>

                  {Boolean(a.rescheduled_count && a.rescheduled_count > 0) && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-800 dark:text-sky-200 border border-sky-500/30">
                      <CalendarDays className="size-3 text-sky-600" />
                      <span>{language === "bn" ? "সৌজন্যমূলক রি-শিডিউল" : "Courtesy Rescheduled"}</span>
                    </span>
                  )}

                  {a.is_no_show && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-800 dark:text-rose-300 border border-rose-500/30">
                      <AlertCircle className="size-3 text-rose-600" />
                      <span>{language === "bn" ? "অনুপস্থিত (No-Show)" : "Missed (No-Show)"}</span>
                    </span>
                  )}
                </div>

                {/* Financial & Escrow Summary */}
                <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 rounded-xl bg-surface-muted/60 p-3.5 text-xs border border-border/50">
                  <div className="flex items-center gap-1.5">
                    <dt className="text-muted-foreground">Total Fee:</dt>
                    <dd className="font-bold tabular-nums text-foreground">₹{rupees(a.price_paise)}</dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <dt className="text-muted-foreground">Upfront Deposit:</dt>
                    <dd className="font-semibold tabular-nums text-brand-600 dark:text-brand-400">
                      ₹{rupees(a.deposit_paise)} ({a.deposit_coins} coins)
                    </dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <dt className="text-muted-foreground">Escrow Reserved:</dt>
                    <dd className="font-bold tabular-nums text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                      <span>{a.held_coins ?? 0} coins</span>
                      {a.held_status === "held" && (
                        <span className="text-[9.5px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-700 border border-indigo-500/20">
                          Locked
                        </span>
                      )}
                      {a.held_status === "captured" && (
                        <span className="text-[9.5px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                          Paid
                        </span>
                      )}
                      {a.held_status === "released" && (
                        <span className="text-[9.5px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-500/10 text-slate-700 border border-slate-500/20">
                          Refunded
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>

                {/* Post-Consultation Sacred Vedic Prescription */}
                {a.prescription && (
                  <VedicPrescriptionCard prescription={a.prescription} language={language} />
                )}

                {/* Divya Paramarsha Official Sacred Certificate */}
                {a.status === "completed" && (
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 p-4 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-lg border border-amber-500/30">
                        ॐ
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground">
                          {language === "bn" ? "দিব্য পরামর্শ পবিত্র সনদপত্র" : "Divya Paramarsha Sacred Certificate"}
                        </h4>
                        <p className="text-[11px] text-muted-foreground">
                          {language === "bn"
                            ? "অধিবেশনের অনুমোদিত বৈদিক বিধান ও রত্ন/মন্ত্রের ডিজিটাল সনদ"
                            : "Official consecrated certificate with Vedic directives & digital seal"}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        window.open(appointmentApi.getCertificateHtmlUrl(a.id), "_blank");
                      }}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm shrink-0"
                    >
                      <FileText className="size-3.5 mr-1.5" />
                      {language === "bn" ? "সনদপত্র দেখুন ও প্রিন্ট করুন" : "View & Print Certificate"}
                    </Button>
                  </div>
                )}

                {/* Missed Consultation (Client No-Show) Alert */}
                {a.is_no_show && (
                  <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4 text-xs space-y-1">
                    <div className="flex items-center gap-2 font-bold text-rose-900 dark:text-rose-200">
                      <AlertCircle className="size-4 text-rose-600" />
                      <span>{language === "bn" ? "অধিবেশনে অনুপস্থিতি সংক্রান্ত নোটিশ (Missed Session)" : "Missed Consultation Notice (No-Show)"}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {language === "bn"
                        ? `জ্যোতিষী মহাজাগতিক চেম্বারে প্রবেশ করে ${a.no_show_wait_minutes || 15} মিনিট অপেক্ষা করেছিলেন। অ্যাপয়েন্টমেন্টের নীতি অনুসারে অধিবেশনটি সমাপ্ত করা হয়েছে এবং নির্ধারিত ফি নিষ্পন্ন করা হয়েছে।`
                        : `The consulting astrologer waited in the chamber for ${a.no_show_wait_minutes || 15} minutes. As per consultation policy, the session was closed.`}
                    </p>
                  </div>
                )}

                {/* Cancellation Grace Window & Policy Trigger */}
                {upcoming && (
                  <div className="mt-3.5 pt-3 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                      {a.can_cancel ? (
                        <>
                          <Clock className="size-3.5 text-amber-600 shrink-0" />
                          <span>
                            {language === "bn"
                              ? `বাতিলের সময়সীমা: ${a.cancel_deadline ? new Date(a.cancel_deadline).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : `${a.cancellation_window_minutes ?? 30} মিনিট`} পর্যন্ত বাতিল করলে এসক্রো কয়েন ফেরত পাবেন।`
                              : `Grace Window: Can cancel until ${a.cancel_deadline ? new Date(a.cancel_deadline).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : `${a.cancellation_window_minutes ?? 30}m`}. Held coins are refunded.`}
                          </span>
                        </>
                      ) : (
                        <>
                          <Lock className="size-3.5 text-slate-400 shrink-0" />
                          <span className="text-slate-500">
                            {language === "bn"
                              ? `বাতিলের অনুমোদিত সময় (${a.cancellation_window_minutes ?? 30} মিনিট) উত্তীর্ণ হয়েছে। স্লটটি এখন নিশ্চিত ও সংরক্ষিত।`
                              : `Cancellation grace window (${a.cancellation_window_minutes ?? 30} mins) has passed. Slot is firmly locked.`}
                          </span>
                        </>
                      )}
                    </div>

                    {a.can_cancel && (
                      <div className="shrink-0">
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
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {(() => {
        const cancellingAppt = data?.find((x: Appointment) => x.id === cancelling);
        return (
          <ConfirmModal
            open={Boolean(cancelling)}
            onClose={() => setCancelling(null)}
            onConfirm={() => cancelling && cancel.mutate(cancelling)}
            title={language === "bn" ? "অ্যাপয়েন্টমেন্ট বাতিল করবেন?" : "Cancel this appointment?"}
            description={
              language === "bn"
                ? `আপনি কি নিশ্চিত? এই অ্যাপয়েন্টমেন্ট বাতিল করলে আপনার ব্লক করা ${cancellingAppt?.held_coins ?? 0} কয়েন সাথে সাথে মূল ওয়ালেটে ফেরত (আনব্লক) দেওয়া হবে। তবে স্লট সংরক্ষণের অগ্রিম ${cancellingAppt?.deposit_coins ?? 0} কয়েন আমানত ফেরতযোগ্য নয়।`
                : `Are you sure? Cancelling will immediately release and refund your ${cancellingAppt?.held_coins ?? 0} escrow-held coins back to your spendable wallet. The upfront deposit of ${cancellingAppt?.deposit_coins ?? 0} coins is non-refundable.`
            }
            confirmLabel={language === "bn" ? "হ্যাঁ, বাতিল করুন" : "Yes, cancel slot"}
            loading={cancel.isPending}
          />
        );
      })()}
    </div>
  );
}
