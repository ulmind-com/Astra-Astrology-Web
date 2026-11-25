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
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Video,
  Zap,
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
  Modal,
} from "@/components/ui";
import { appointmentApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";
import { APPOINTMENT_STATUS_LABELS, type Appointment, type VedicPrescription } from "@/types";
import { GoogleCalendarIntegrationCard } from "@/components/appointments/GoogleCalendarIntegrationCard";
import { AuspiciousDaySurgeCard } from "@/components/appointments/AuspiciousDaySurgeCard";
import { BrahmaPauseControlCard } from "@/components/appointments/BrahmaPauseControlCard";
import { BTRLifeEventsModal } from "@/components/appointments/BTRLifeEventsModal";
import { RequestBTRModal } from "@/components/appointments/RequestBTRModal";
import { PrivateLinksManager } from "@/components/appointments/PrivateLinksManager";
import { BlockedSeekersCard } from "@/components/appointments/BlockedSeekersCard";
import { useAuth } from "@/providers/auth-provider";

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

function VedicRemedyFollowUpCard({
  appointment,
  language,
  currentUser,
  onMessageSent,
}: {
  appointment: Appointment;
  language: "bn" | "hi" | "en";
  currentUser?: any;
  onMessageSent: () => void;
}) {
  const [questionText, setQuestionText] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const isAstrologer =
    currentUser?.role === "astrologer" || currentUser?.id === appointment.astrologer_user_id;

  const isExpired = appointment.follow_up_expires_at
    ? new Date() > new Date(appointment.follow_up_expires_at)
    : false;
  const maxMessages = appointment.follow_up_max_messages || 2;
  const usedMessages = appointment.follow_up_messages_used || 0;
  const remainingQuestions = Math.max(0, maxMessages - usedMessages);
  const isExhausted = remainingQuestions <= 0;

  const remainingHours = appointment.follow_up_expires_at
    ? Math.max(0, Math.ceil((new Date(appointment.follow_up_expires_at).getTime() - Date.now()) / (3600 * 1000)))
    : 24;

  const handleSend = async () => {
    if (!questionText.trim()) return;
    setSending(true);
    try {
      await appointmentApi.sendFollowUpMessage(appointment.id, questionText.trim());
      setQuestionText("");
      toast.success(
        isAstrologer
          ? (language === "bn" ? "ক্লায়েন্টের কাছে উত্তর পাঠানো হয়েছে!" : "Answer delivered to client!")
          : (language === "bn"
              ? "পণ্ডিতজীর কাছে প্রতিকার স্পষ্টীকরণ প্রশ্ন পাঠানো হয়েছে!"
              : "Remedy clarification question sent to Panditji!")
      );
      onMessageSent();
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit follow-up message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-4 rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-emerald-500/10 p-4 sm:p-5 shadow-xs">
      {/* Header Banner & Green Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-emerald-500/20">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30">
            <Sparkles className="size-4.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-display font-bold text-sm text-foreground">
                {language === "bn"
                  ? "পরিপূরক রেমিডি স্পষ্টীকরণ পাস"
                  : language === "hi"
                  ? "निःशुल्क उपाय स्पष्टीकरण पास"
                  : "Complimentary Remedy Clarification"}
              </h4>
              {/* Requested Green Badge */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-[10px] font-bold shadow-xs">
                <span className="size-1.5 rounded-full bg-white animate-pulse" />
                <span>
                  {remainingHours <= 24
                    ? (language === "bn" ? "মেয়াদ ২৪ ঘণ্টা (Valid for 24h)" : "Complimentary Remedy Clarification (Valid for 24h)")
                    : (language === "bn" ? `মেয়াদ ${Math.ceil(remainingHours / 24)} দিন` : `Valid for ${Math.ceil(remainingHours / 24)}d`)}
                </span>
              </span>
            </div>
            <p className="text-[10.5px] text-muted-foreground mt-0.5">
              {language === "bn"
                ? "প্রেসক্রিপশন বুঝতে সমস্যা হলে (রত্ন ধারণের দিন, মন্ত্র জপের নিয়ম ইত্যাদি) সরাসরি পণ্ডিতজীকে প্রশ্ন করুন।"
                : "Ask Panditji quick clarification questions regarding your prescribed remedies or sacred mantras."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isExpired ? (
            <span className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 text-[11px] font-bold text-rose-700 dark:text-rose-300">
              {language === "bn" ? "মেয়াদ উত্তীর্ণ (Expired)" : "Expired"}
            </span>
          ) : isExhausted && !isAstrologer ? (
            <span className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[11px] font-bold text-amber-800 dark:text-amber-300">
              {language === "bn" ? "কোটা সমাপ্ত (All questions used)" : "All questions used"}
            </span>
          ) : (
            <span className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-200">
              {remainingQuestions} {language === "bn" ? "টি প্রশ্ন বাকি" : "Questions left"}
            </span>
          )}
        </div>
      </div>

      {appointment.follow_up_expires_at && !isExpired && (
        <div className="text-[11px] text-emerald-900 dark:text-emerald-200 font-medium mt-2.5 flex items-center justify-between bg-emerald-500/10 rounded-xl px-3 py-1.5 border border-emerald-500/20">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>
              {language === "bn" ? "অবশিষ্ট সময়:" : "Time Remaining:"}{" "}
              <strong className="text-emerald-800 dark:text-emerald-100">
                {remainingHours <= 24 ? `${remainingHours} ঘণ্টা (hours)` : `${Math.ceil(remainingHours / 24)} দিন (days)`}
              </strong>
            </span>
          </span>
          <span>
            {usedMessages}/{maxMessages} {language === "bn" ? "প্রশ্ন ব্যবহৃত" : "questions used"}
          </span>
        </div>
      )}

      {/* Messages Thread */}
      {appointment.follow_up_thread && appointment.follow_up_thread.length > 0 && (
        <div className="mt-3 space-y-2.5 rounded-xl bg-card/90 p-3.5 border border-emerald-500/20 max-h-60 overflow-y-auto">
          {appointment.follow_up_thread.map((msg) => {
            const isSeeker = msg.sender_role === "user";
            return (
              <div
                key={msg.id}
                className={cn(
                  "rounded-2xl p-3 text-xs max-w-[88%] shadow-2xs",
                  isSeeker
                    ? "ml-auto bg-emerald-600 text-white rounded-br-xs"
                    : "mr-auto bg-surface border border-emerald-500/30 text-foreground rounded-bl-xs"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-between gap-2 text-[10px] mb-1 font-bold",
                    isSeeker ? "text-emerald-100" : "text-emerald-700 dark:text-emerald-300"
                  )}
                >
                  <span className="flex items-center gap-1">
                    {isSeeker ? (
                      language === "bn" ? "👤 আপনি (Seeker)" : "👤 You"
                    ) : (
                      <>
                        <Sparkles className="size-3 text-amber-500" />
                        <span>{language === "bn" ? "পণ্ডিতজী (Panditji)" : msg.sender_name}</span>
                      </>
                    )}
                  </span>
                  <span className="opacity-80">
                    {new Date(msg.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Question / Reply Submission Input */}
      {(!isExpired && (!isExhausted || isAstrologer)) ? (
        <div className="mt-3.5 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={
                isAstrologer
                  ? (language === "bn"
                      ? "ক্লায়েন্টকে প্রতিকার নির্দেশিকা বা উত্তর লিখুন..."
                      : "Write remedy guidance or answer to client...")
                  : (language === "bn"
                      ? "পণ্ডিতজীকে প্রতিকার বিষয়ে প্রশ্ন লিখুন (e.g. রত্নটি কোন আঙুলে এবং কোন দিন পরব?)..."
                      : "Ask Panditji a clarification question about your remedies...")
              }
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSend();
                }
              }}
              className="flex-1 rounded-xl border-2 border-emerald-400 dark:border-emerald-600 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            />
            <Button
              size="sm"
              disabled={sending || !questionText.trim()}
              onClick={handleSend}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 px-4 py-2.5 rounded-xl shadow-xs cursor-pointer"
            >
              {sending
                ? (language === "bn" ? "পাঠানো হচ্ছে..." : "Sending...")
                : isAstrologer
                ? (language === "bn" ? "উত্তর পাঠান" : "Send Answer")
                : (language === "bn" ? "প্রশ্ন পাঠান" : "Ask Question")}
            </Button>
          </div>
          <p className="text-[10.5px] text-muted-foreground italic flex items-center gap-1">
            <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              {language === "bn"
                ? "১০০% পরিপূরক ফলো-আপ সুবিধা — আপনার ওয়ালেট থেকে কোনো কয়েন কাটা হবে না।"
                : "100% complimentary follow-up — zero coins deducted from your wallet."}
            </span>
          </p>
        </div>
      ) : (
        <div className="mt-3 p-3 rounded-xl bg-muted/60 border border-border text-center text-xs text-muted-foreground">
          {isExpired
            ? (language === "bn"
                ? "এই সেশনের ২৪ ঘণ্টার পরিপূরক স্পষ্টীকরণ উইন্ডো সমাপ্ত হয়েছে।"
                : "The complimentary clarification window for this consultation has closed.")
            : (language === "bn"
                ? "আপনি আপনার নির্ধারিত পরিপূরক প্রশ্নের কোটা সম্পন্ন করেছেন।"
                : "You have used all complimentary questions for this consultation.")}
        </div>
      )}
    </div>
  );
}

export default function MyAppointmentsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const { user } = useAuth();
  const isAstrologerUser =
    user?.role === "astrologer" ||
    user?.role === "admin" ||
    user?.role === "super_admin";

  const [selectedTab, setSelectedTab] = React.useState<"appointments" | "private-links" | "blacklist">(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("tab") === "blacklist") return "blacklist";
      if (sp.get("tab") === "private-links") return "private-links";
    }
    return "appointments";
  });

  const [cancelling, setCancelling] = React.useState<string | null>(null);
  const [joiningChamberId, setJoiningChamberId] = React.useState<string | null>(null);
  const [rescueModalOpen, setRescueModalOpen] = React.useState(false);
  const [rescueAppointment, setRescueAppointment] = React.useState<Appointment | null>(null);
  const [rescueNewTime, setRescueNewTime] = React.useState("");
  const [rescuingId, setRescuingId] = React.useState<string | null>(null);

  // Complimentary Follow-up Pass issuance state
  const [issuingPassAppointment, setIssuingPassAppointment] = React.useState<Appointment | null>(null);
  const [passHours, setPassHours] = React.useState<number>(24);
  const [passMaxMessages, setPassMaxMessages] = React.useState<number>(2);
  const [passNotes, setPassNotes] = React.useState<string>("");
  const [issuingPass, setIssuingPass] = React.useState<boolean>(false);

  const handleIssuePass = async () => {
    if (!issuingPassAppointment) return;
    setIssuingPass(true);
    try {
      await appointmentApi.issueFollowUpPass(issuingPassAppointment.id, {
        window_hours: passHours,
        max_messages: passMaxMessages,
        notes: passNotes.trim() || undefined,
      });
      toast.success(
        language === "bn"
          ? "ক্লায়েন্টকে পরিপূরক ফলো-আপ পাস সফলভাবে ইস্যু করা হয়েছে!"
          : "Complimentary remedy clarification pass issued successfully!"
      );
      setIssuingPassAppointment(null);
      void queryClient.invalidateQueries({ queryKey: KEY });
    } catch (err: any) {
      toast.error(err?.message || "Failed to issue follow-up pass.");
    } finally {
      setIssuingPass(false);
    }
  };

  // Birth Time Rectification (BTR) state
  const [btrAppt, setBtrAppt] = React.useState<Appointment | null>(null);
  const [requestBtrApptId, setRequestBtrApptId] = React.useState<string | null>(null);

  const handleBrahmaPauseRefund = async (appointmentId: string) => {
    setRescuingId(appointmentId);
    try {
      await appointmentApi.brahmaPauseAction(appointmentId, {
        action: "refund",
        reason: "Seeker opted for 100% instant refund during Brahma Pause",
      });
      void queryClient.invalidateQueries({ queryKey: KEY });
      toast.success(
        language === "bn"
          ? "১০০% অর্থ সফলভাবে আপনার ওয়ালেটে ফেরত দেওয়া হয়েছে।"
          : "100% refund successfully credited to your wallet.",
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to process refund.");
    } finally {
      setRescuingId(null);
    }
  };

  const handleBrahmaPauseReschedule = async () => {
    if (!rescueAppointment || !rescueNewTime) return;
    setRescuingId(rescueAppointment.id);
    try {
      await appointmentApi.brahmaPauseAction(rescueAppointment.id, {
        action: "reschedule",
        new_starts_at: new Date(rescueNewTime).toISOString(),
        reason: "Seeker complimentary reschedule during Brahma Pause",
      });
      void queryClient.invalidateQueries({ queryKey: KEY });
      setRescueModalOpen(false);
      setRescueAppointment(null);
      toast.success(
        language === "bn"
          ? "অ্যাপয়েন্টমেন্ট সফলভাবে নতুন স্লটে স্থানান্তরিত করা হয়েছে।"
          : "Appointment rescheduled successfully at no extra fee.",
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to reschedule. Please pick a slot within astrologer's open schedule.");
    } finally {
      setRescuingId(null);
    }
  };

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

      {/* Astrologer Portal Navigation Tabs */}
      {isAstrologerUser && (
        <div className="flex items-center gap-2 border-b border-border/80 pb-3">
          <button
            type="button"
            onClick={() => {
              setSelectedTab("appointments");
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                url.searchParams.delete("tab");
                window.history.replaceState({}, "", url.toString());
              }
            }}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer",
              selectedTab === "appointments"
                ? "bg-brand-600 text-white shadow-xs"
                : "bg-surface-muted text-muted-foreground hover:bg-surface hover:text-foreground border border-border/50"
            )}
          >
            <CalendarDays className="size-3.5" />
            <span>{language === "bn" ? "পরামর্শ সেশন ও বুকিং" : "Consultations & Schedule"}</span>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.2 text-[10px] font-black",
                selectedTab === "appointments" ? "bg-white/20 text-white" : "bg-muted text-foreground"
              )}
            >
              {data?.length ?? 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedTab("private-links");
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                url.searchParams.set("tab", "private-links");
                window.history.replaceState({}, "", url.toString());
              }
            }}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer",
              selectedTab === "private-links"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-surface-muted text-muted-foreground hover:bg-surface hover:text-foreground border border-border/50"
            )}
          >
            <Lock className="size-3.5" />
            <span>{language === "bn" ? "ভিআইপি প্রাইভেট লিংক" : "Private Links"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedTab("blacklist");
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                url.searchParams.set("tab", "blacklist");
                window.history.replaceState({}, "", url.toString());
              }
            }}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer",
              selectedTab === "blacklist"
                ? "bg-red-600 text-white shadow-xs"
                : "bg-surface-muted text-muted-foreground hover:bg-surface hover:text-foreground border border-border/50"
            )}
          >
            <ShieldAlert className="size-3.5" />
            <span>{language === "bn" ? "ব্লক করা ক্লায়েন্ট (Blocked Seekers)" : "Blocked Seekers"}</span>
          </button>
        </div>
      )}

      {selectedTab === "blacklist" ? (
        <BlockedSeekersCard language={language} />
      ) : selectedTab === "private-links" ? (
        <PrivateLinksManager />
      ) : (
        <>
          {/* Two-Way Google Calendar 2-Way Sync Integration */}
          <GoogleCalendarIntegrationCard />

          {/* Auspicious Transit Tatkal Surge Pricing (Amavasya, Purnima, Pradosh, Grahan) */}
          <AuspiciousDaySurgeCard />

          {/* 1-Click Tatkal VIP Emergency 15-Min Window (AUD-006) */}
          {user?.role === "astrologer" && <TatkalQuickWindowCard language={language} />}

          {/* Astrologer Emergency Break & Seeker Auto-Rescue Engine */}
          <BrahmaPauseControlCard />

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
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-display font-bold text-base text-foreground">
                          {a.peer?.name ?? "Astrologer"}
                        </p>
                        <Badge tone={a.status === "booked" ? "green" : "neutral"}>
                          {APPOINTMENT_STATUS_LABELS[a.status]}
                        </Badge>
                        {(a.follow_up_pass_active || (a.follow_up_pass_enabled && a.follow_up_expires_at && new Date(a.follow_up_expires_at) > new Date())) && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 shadow-2xs">
                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>
                              {(() => {
                                const remainingHours = a.follow_up_expires_at
                                  ? Math.max(0, Math.ceil((new Date(a.follow_up_expires_at).getTime() - Date.now()) / (3600 * 1000)))
                                  : 24;
                                if (language === "bn") {
                                  return remainingHours <= 24
                                    ? "Complimentary Remedy Clarification (Valid for 24h)"
                                    : `পরিপূরক রেমিডি স্পষ্টীকরণ পাস (${Math.ceil(remainingHours / 24)} দিন বাকি)`;
                                }
                                return remainingHours <= 24
                                  ? "Complimentary Remedy Clarification (Valid for 24h)"
                                  : `Complimentary Remedy Clarification (Valid for ${Math.ceil(remainingHours / 24)}d)`;
                              })()}
                            </span>
                          </span>
                        )}
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

                  {a.btr_fulfilled && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-200 border border-emerald-500/30">
                      <Clock className="size-3 text-emerald-600" />
                      <span>{language === "bn" ? "জন্মসময় সংশোধিত ✓" : "Birth Time Rectified ✓"}</span>
                    </span>
                  )}

                  {a.abuse_flagged && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-800 dark:text-rose-300 border border-rose-500/30">
                      <AlertCircle className="size-3 text-rose-600" />
                      <span>{language === "bn" ? "নীতিমালার কারণে সমাপ্ত" : "Flagged Policy Misconduct"}</span>
                    </span>
                  )}
                </div>

                {/* Brahma Pause Seeker Rescue Action Alert */}
                {a.brahma_pause_affected && a.status === "booked" && (
                  <div className="mt-3.5 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-orange-500/15 p-4 text-xs shadow-2xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-sm">
                          ⏸
                        </span>
                        <div>
                          <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                            <span>{language === "bn" ? "জ্যোতিষীর জরুরি ব্রহ্ম বিরতি (Brahma Pause)" : "Astrologer Emergency Brahma Pause"}</span>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/40">
                              Action Required
                            </span>
                          </h4>
                          <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
                            {language === "bn"
                              ? `আপনার জ্যোতিষী বর্তমানে একটি জরুরি ব্রহ্মা পজে আছেন${a.brahma_pause_reason ? ` ("${a.brahma_pause_reason}")` : ""}। আপনি কি অন্য স্লটে ফ্রিতে রিশিডিউল করতে চান নাকি ১০০% ইনস্ট্যান্ট রিফান্ড চান?`
                              : `Your astrologer is currently on an emergency Brahma Pause${a.brahma_pause_reason ? ` ("${a.brahma_pause_reason}")` : ""}. Would you like to reschedule for free to another slot or receive a 100% instant refund?`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Button
                        size="sm"
                        disabled={rescuingId === a.id}
                        onClick={() => {
                          setRescueAppointment(a);
                          const t = new Date(a.starts_at);
                          t.setDate(t.getDate() + 1);
                          const pad = (n: number) => String(n).padStart(2, "0");
                          const localIso = `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}T${pad(t.getHours())}:${pad(t.getMinutes())}`;
                          setRescueNewTime(localIso);
                          setRescueModalOpen(true);
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs"
                      >
                        <CalendarDays className="size-3.5 mr-1.5" />
                        {language === "bn" ? "1-Click Free Reschedule (ফ্রিতে রিশিডিউল)" : "1-Click Free Reschedule"}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={rescuingId === a.id}
                        onClick={() => handleBrahmaPauseRefund(a.id)}
                        className="border-rose-500/40 text-rose-700 dark:text-rose-300 hover:bg-rose-500/10 font-semibold text-xs"
                      >
                        {rescuingId === a.id
                          ? (language === "bn" ? "প্রসেস হচ্ছে..." : "Refunding...")
                          : (language === "bn" ? "100% Instant Refund (তাৎক্ষণিক রিফান্ড)" : "100% Instant Refund")}
                      </Button>
                    </div>

                    <p className="text-[10.5px] text-muted-foreground/80 italic">
                      {language === "bn"
                        ? "💡 কোনো বিকল্প বেছে না নিলে সেশনের ১০ মিনিট পূর্বে স্বয়ংক্রিয়ভাবে ১০০% সম্পূর্ণ রিফান্ড আপনার অ্যাকাউন্টে জমা হয়ে যাবে।"
                        : "💡 If unresponded, an automatic 100% full refund will be processed 10 minutes prior to session time."}
                    </p>
                  </div>
                )}

                {/* Birth Time Rectification (BTR) Request Alert */}
                {a.btr_requested && !a.btr_fulfilled && a.status === "booked" && (
                  <div className="mt-3.5 rounded-2xl border border-sky-500/40 bg-gradient-to-r from-sky-500/15 via-sky-500/10 to-indigo-500/15 p-4 text-xs shadow-2xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-sky-700 dark:text-sky-300 font-bold text-sm">
                          ⏳
                        </span>
                        <div>
                          <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                            <span>
                              {language === "bn"
                                ? "সঠিক জন্মসময় নিশ্চিতকরণের অনুরোধ (BTR Request)"
                                : "Birth Time Rectification (BTR) Requested"}
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-800 dark:text-sky-200 border border-sky-500/40">
                              Action Recommended
                            </span>
                          </h4>
                          <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
                            {language === "bn"
                              ? `জ্যোতিষী আপনার কুষ্ঠি ও নবাংশ বিচারের সর্বোচ্চ নির্ভুলতার জন্য সঠিক জন্মসময় স্পষ্ট করার অনুরোধ জানিয়েছেন${a.btr_request_note ? `: "${a.btr_request_note}"` : "।"}`
                              : `The astrologer requested precision verification of your birth time${a.btr_request_note ? `: "${a.btr_request_note}"` : "."}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        size="sm"
                        onClick={() => setBtrAppt(a)}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-xs"
                      >
                        <Clock className="size-3.5 mr-1.5" />
                        {language === "bn" ? "সঠিক জন্ম বিবরণ ও জীবন ঘটনা আপডেট করুন" : "Update Exact Birth & Life Events"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Abuse Flag Notice */}
                {a.abuse_flagged && (
                  <div className="mt-3.5 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs space-y-1">
                    <div className="flex items-center gap-2 font-bold text-rose-900 dark:text-rose-200">
                      <AlertCircle className="size-4 text-rose-600" />
                      <span>{language === "bn" ? "পরামর্শ আচরণবিধি ও নীতিমালা নোটিশ" : "Consultation Conduct Notice"}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {language === "bn"
                        ? `নীতিমালা লঙ্ঘনের কারণে জ্যোতিষী কর্তৃক এই অধিবেশনটি সমাপ্ত করা হয়েছে (${a.abuse_reason || "অশোভন আচরণ"})। প্ল্যাটফর্মের সুরক্ষার স্বার্থে ঘটনাটি অডিট লগে সংরক্ষণ করা হয়েছে।`
                        : `This session was terminated by the astrologer due to conduct violation (${a.abuse_reason || "Misconduct"}).`}
                    </p>
                  </div>
                )}

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

                {/* Complimentary Remedy Follow-up Window */}
                {(Boolean(a.follow_up_pass_active) || Boolean(a.follow_up_pass_enabled)) && (
                  <VedicRemedyFollowUpCard
                    appointment={a}
                    language={language}
                    currentUser={user}
                    onMessageSent={() => void queryClient.invalidateQueries({ queryKey: KEY })}
                  />
                )}

                {/* Astrologer Issue Follow-up Pass Action */}
                {(user?.role === "astrologer" || user?.id === a.astrologer_user_id) && a.status === "completed" && (
                  <div className="mt-3 flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setPassHours(24);
                        setPassMaxMessages(2);
                        setPassNotes("");
                        setIssuingPassAppointment(a);
                      }}
                      className="border-emerald-500/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/10 text-xs font-bold"
                    >
                      <Sparkles className="size-3.5 mr-1.5 text-emerald-600" />
                      {a.follow_up_pass_enabled
                        ? (language === "bn" ? "ফলো-আপ পাস বৃদ্ধি / পরিবর্তন করুন" : "Extend / Adjust Follow-Up Pass")
                        : (language === "bn" ? "২৪ ঘণ্টার ফলো-আপ পাস ইস্যু করুন" : "Issue 24h Remedy Follow-Up Pass")}
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

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-xs"
                        onClick={() => setBtrAppt(a)}
                      >
                        <Clock className="size-3.5 mr-1 text-amber-500" />
                        {a.btr_fulfilled
                          ? (language === "bn" ? "BTR ও জীবন ঘটনা দেখুন" : "View BTR Events")
                          : (language === "bn" ? "BTR ও জীবন ঘটনা" : "BTR & Life Events")}
                      </Button>

                      {user?.role === "astrologer" && !a.btr_fulfilled && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-xs text-indigo-600 hover:text-indigo-700"
                          onClick={() => setRequestBtrApptId(a.id)}
                        >
                          <Clock className="size-3.5 mr-1 text-indigo-500" />
                          {language === "bn" ? "BTR অনুরোধ পাঠান" : "Request BTR"}
                        </Button>
                      )}

                      {a.can_cancel && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-danger hover:bg-danger/10"
                          onClick={() => setCancelling(a.id)}
                        >
                          {language === "bn" ? "স্লট বাতিল করুন" : "Cancel Appointment"}
                        </Button>
                      )}
                    </div>
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

      {rescueModalOpen && rescueAppointment && (
        <Modal
          open={rescueModalOpen}
          onClose={() => {
            setRescueModalOpen(false);
            setRescueAppointment(null);
          }}
          title={language === "bn" ? "বিনামূল্যে নতুন সময় নির্ধারণ" : "Complimentary Reschedule"}
        >
          <div className="space-y-4 text-xs">
            <p className="text-muted-foreground leading-relaxed">
              {language === "bn"
                ? "জ্যোতিষীর জরুরি বিরতির কারণে কোনো অতিরিক্ত ফি ছাড়াই আপনার সুবিধাজনক নতুন তারিখ ও সময় বেছে নিতে পারেন।"
                : "Select a new available date and time with zero rescheduling fees."}
            </p>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                {language === "bn" ? "নতুন অধিবেশনের সময়" : "New Consultation Date & Time"}
              </label>
              <input
                type="datetime-local"
                value={rescueNewTime}
                onChange={(e) => setRescueNewTime(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setRescueModalOpen(false);
                  setRescueAppointment(null);
                }}
              >
                {language === "bn" ? "বাতিল" : "Cancel"}
              </Button>
              <Button
                size="sm"
                disabled={!rescueNewTime || Boolean(rescuingId)}
                onClick={handleBrahmaPauseReschedule}
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold"
              >
                {rescuingId === rescueAppointment.id
                  ? (language === "bn" ? "সংরক্ষণ করা হচ্ছে..." : "Rescheduling...")
                  : (language === "bn" ? "নতুন সময় নিশ্চিত করুন" : "Confirm New Schedule")}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Birth Time Rectification (BTR) & Life Events Modal */}
      <BTRLifeEventsModal
        appointment={btrAppt}
        isOpen={Boolean(btrAppt)}
        onClose={() => setBtrAppt(null)}
        language={language}
        onSuccess={() => {
          void queryClient.invalidateQueries({ queryKey: KEY });
        }}
      />

      {/* Astrologer Request BTR Modal */}
      <RequestBTRModal
        appointmentId={requestBtrApptId}
        isOpen={Boolean(requestBtrApptId)}
        onClose={() => setRequestBtrApptId(null)}
        language={language}
        onSuccess={() => {
          void queryClient.invalidateQueries({ queryKey: KEY });
        }}
      />

      {/* Astrologer Issue Follow-Up Pass Modal */}
      {issuingPassAppointment && (
        <Modal
          open={Boolean(issuingPassAppointment)}
          onClose={() => setIssuingPassAppointment(null)}
          title={
            language === "bn"
              ? "পরিপূরক রেমিডি স্পষ্টীকরণ পাস ইস্যু করুন"
              : "Issue Complimentary Remedy Follow-Up Pass"
          }
        >
          <div className="space-y-4 text-xs">
            <p className="text-muted-foreground leading-relaxed">
              {language === "bn"
                ? "পরামর্শ অধিবেশন শেষে ক্লায়েন্টকে নির্ধারিত সময়ের জন্য কোনো ফি ছাড়াই ১ বা ২টি প্রতিকার স্পষ্টীকরণ প্রশ্ন করার অনুমতি প্রদান করুন।"
                : "Grant seeker permission to ask 1 or 2 complimentary remedy clarification queries within a specified grace window."}
            </p>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                {language === "bn" ? "পাসের সময়সীমা (ঘণ্টায়)" : "Active Window (Hours)"}
              </label>
              <select
                value={passHours}
                onChange={(e) => setPassHours(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={24}>{language === "bn" ? "২৪ ঘণ্টা (প্রস্তাবিত)" : "24 Hours (Standard)"}</option>
                <option value={48}>{language === "bn" ? "৪৮ ঘণ্টা (২ দিন)" : "48 Hours (2 Days)"}</option>
                <option value={72}>{language === "bn" ? "৭২ ঘণ্টা (৩ দিন)" : "72 Hours (3 Days)"}</option>
                <option value={168}>{language === "bn" ? "৭ দিন (১ সপ্তাহ)" : "7 Days (1 Week)"}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                {language === "bn" ? "সর্বোচ্চ অনুমোদিত প্রশ্ন" : "Maximum Allowed Clarifications"}
              </label>
              <select
                value={passMaxMessages}
                onChange={(e) => setPassMaxMessages(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={1}>{language === "bn" ? "১টি প্রশ্ন" : "1 Question"}</option>
                <option value={2}>{language === "bn" ? "২টি প্রশ্ন (স্ট্যান্ডার্ড)" : "2 Questions (Standard)"}</option>
                <option value={3}>{language === "bn" ? "৩টি প্রশ্ন" : "3 Questions"}</option>
                <option value={5}>{language === "bn" ? "৫টি প্রশ্ন" : "5 Questions"}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                {language === "bn" ? "জ্যোতিষীর বিশেষ বার্তা বা নোট (ঐচ্ছিক)" : "Special Note or Directives (Optional)"}
              </label>
              <textarea
                value={passNotes}
                onChange={(e) => setPassNotes(e.target.value)}
                placeholder={
                  language === "bn"
                    ? "যেমন: রত্ন ধারণের নিয়ম বা মহামৃত্যুঞ্জয় জপ সংক্রান্ত যেকোনো প্রশ্নের উত্তর দেওয়া হবে।"
                    : "e.g. Feel free to ask about gem energization or recitation rituals."
                }
                rows={3}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIssuingPassAppointment(null)}
              >
                {language === "bn" ? "বাতিল" : "Cancel"}
              </Button>
              <Button
                size="sm"
                disabled={issuingPass}
                onClick={handleIssuePass}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                {issuingPass
                  ? (language === "bn" ? "ইস্যু করা হচ্ছে..." : "Issuing...")
                  : (language === "bn" ? "পাস সক্রিয় করুন" : "Activate Pass")}
              </Button>
            </div>
          </div>
        </Modal>
      )}
        </>
      )}
    </div>
  );
}

function TatkalQuickWindowCard({ language }: { language: string }) {
  const queryClient = useQueryClient();
  const [multiplier, setMultiplier] = React.useState<number>(1.5);
  const [activeUntil, setActiveUntil] = React.useState<number | null>(null);
  const [now, setNow] = React.useState<number>(() => Date.now());

  React.useEffect(() => {
    if (!activeUntil) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [activeUntil]);

  const mutation = useMutation({
    mutationFn: () =>
      appointmentApi.openTatkalWindow({
        starts_at: new Date().toISOString(),
        minutes: 15,
        multiplier,
        custom_title: "VIP Emergency Tatkal Slot (15m)",
        is_private: false,
      }),
    onSuccess: (win) => {
      const endsMs = new Date(win.ends_at).getTime();
      setActiveUntil(Number.isFinite(endsMs) ? endsMs : Date.now() + 15 * 60_000);
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success(
        language === "bn"
          ? `১৫ মিনিটের তৎকাল ভিআইপি স্লট (${multiplier}x) চালু হয়েছে!`
          : `15-Minute Tatkal VIP Window (${multiplier}x) is now LIVE!`
      );
    },
    onError: (err: any) => toast.error(err?.message || "Could not open Tatkal emergency slot."),
  });

  const remainingMs = activeUntil ? Math.max(0, activeUntil - now) : 0;
  const isLive = remainingMs > 0;
  const mins = Math.floor(remainingMs / 60_000);
  const secs = Math.floor((remainingMs % 60_000) / 1000);

  return (
    <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50 via-yellow-50/70 to-white p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Zap className="size-5 fill-white" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-sm text-stone-900">
              {language === "bn"
                ? "১-ক্লিক তৎকাল জরুরি স্লট (১৫ মিনিট)"
                : "1-Click Tatkal Emergency Window (15m)"}
            </h3>
            {isLive && (
              <Badge tone="gold">
                LIVE · {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
              </Badge>
            )}
          </div>
          <p className="text-xs text-stone-600 mt-0.5">
            {language === "bn"
              ? "তাৎক্ষণিক ১৫ মিনিটের প্রিমিয়াম ভিআইপি কনসাল্টেশন স্লট খুলুন।"
              : "Instantly open a 15-minute urgent VIP booking window at priority surge rates."}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <div className="inline-flex rounded-xl border border-amber-300 bg-white p-0.5 text-xs">
          {[1.5, 2.0].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMultiplier(m)}
              className={cn(
                "rounded-lg px-2.5 py-1 font-bold transition-colors cursor-pointer",
                multiplier === m ? "bg-amber-500 text-white" : "text-stone-600 hover:bg-amber-50"
              )}
            >
              {m}x
            </button>
          ))}
        </div>
        <Button
          size="sm"
          loading={mutation.isPending}
          onClick={() => mutation.mutate()}
          className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold"
        >
          <Zap className="size-3.5" />
          <span>
            {isLive
              ? language === "bn"
                ? "নতুন তৎকাল স্লট"
                : "Extend / Open New"
              : language === "bn"
              ? "তৎকাল চালু করুন"
              : "Start Tatkal (15m)"}
          </span>
        </Button>
      </div>
    </div>
  );
}
