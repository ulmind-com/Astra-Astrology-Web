"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  ExternalLink,
  GraduationCap,
  Languages,
  MessageSquare,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Video,
  Wallet,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  StatusDot,
  Textarea,
} from "@/components/ui";
import { appointmentApi, astrologerApi, reviewApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { cn, timeAgo } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";
import { getSlotMuhurat, type SlotMuhuratInfo } from "@/lib/muhurat-helper";
import {
  SKILL_LABELS,
  type AstrologerPublic,
  type Review,
  type Skill,
} from "@/types";

export const CONSULTATION_PILLARS = [
  {
    id: "career_wealth",
    labelEn: "Career & Wealth",
    labelBn: "কর্মজীবন ও ধনসম্পদ",
    labelHi: "करियर और धन",
    icon: "💼",
    descEn: "Job promotions, business growth, financial prosperity & timing.",
    descBn: "চাকরির পদোন্নতি, আর্থিক সমৃদ্ধি, ব্যবসায়িক লাভ ও শুভ সময়কাল।",
    descHi: "नौकरी पदोन्नति, वित्तीय लाभ, व्यापार वृद्धि व अनुकूल समय।",
  },
  {
    id: "love_marriage",
    labelEn: "Love & Kundali Milan",
    labelBn: "প্রেম ও বিবাহ মিলন",
    labelHi: "विवाह व प्रेम संबंध",
    icon: "💍",
    descEn: "Compatibility, marriage timing, Ashtakoot Gun Milan, Manglik remedies.",
    descBn: "যোটক বিচার, বিবাহের শুভ মুহূর্ত, মাঙ্গলিক দোষ ও দাম্পত্য সুখ।",
    descHi: "गुण मिलान, विवाह का समय, मांगलिक दोष निवारण व दांपत्य सुख।",
  },
  {
    id: "health_longevity",
    labelEn: "Health & Vitality",
    labelBn: "স্বাস্থ্য ও দীর্ঘায়ু",
    labelHi: "स्वास्थ्य व आरोग्यता",
    icon: "🌿",
    descEn: "Planetary affliction on physical & mental well-being, Vedic remedies.",
    descBn: "শারীরিক ও মানসিক গ্রহদোষ, আয়ু বিচার এবং বৈদিক রোগ প্রতিকার।",
    descHi: "ग्रह जनित स्वास्थ्य समस्या, मानसिक शांति व वैदिक उपचार।",
  },
  {
    id: "dosha_graha_shanti",
    labelEn: "Graha Shanti & Doshas",
    labelBn: "গ্রহশান্তি ও কালসর্প দোষ",
    labelHi: "दोष निवारण व शांति",
    icon: "🔥",
    descEn: "Kalsarpa, Sade Sati, Pitra Dosha, Rahu-Ketu mitigation.",
    descBn: "কালসর্প, সাড়ে সাতি, পিতৃ দোষ এবং রাহু-কেতু শান্তির বৈদিক প্রতিবিধান।",
    descHi: "कालसर्प, साढ़े साती, पितृ दोष व राहु-केतु निवारण।",
  },
  {
    id: "business_expansion",
    labelEn: "Business & Investments",
    labelBn: "ব্যবসা ও বাণিজ্য বিস্তার",
    labelHi: "व्यापार व निवेश",
    icon: "📈",
    descEn: "Partnership compatibility, auspicious launch dates, growth strategies.",
    descBn: "ব্যবসায়িক অংশীদারি, নতুন উদ্যোগের শুভ দিন ও অর্থনৈতিক সমৃদ্ধি।",
    descHi: "साझेदारी, नए कार्य का शुभारंभ व व्यावसायिक समृद्धि।",
  },
  {
    id: "spiritual_guidance",
    labelEn: "Spiritual Path & Moksha",
    labelBn: "আধ্যাত্মিক সাধনা ও জ্ঞান",
    labelHi: "अध्यात्म व मोक्ष मार्ग",
    icon: "🕉️",
    descEn: "Ishta Devata, soul purpose, mantra sadhana, karmic liberation.",
    descBn: "ইষ্ট দেবতা নির্ণয়, আত্মার উদ্দেশ্য, সিদ্ধ মন্ত্র সাধনা ও কর্মফল শোধন।",
    descHi: "इष्ट देवता, जीवन का उद्देश्य, मंत्र साधना व कर्म शुद्धि।",
  },
] as const;

function rupees(paise: number): string {
  return (paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function clock(d: Date): string {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

type Range = { starts_at: string; ends_at: string };

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

const CATEGORIES: { label: string; skill: Skill | "all" }[] = [
  { label: "All Specializations", skill: "all" },
  { label: "Vedic Astrology", skill: "vedic_astrology" },
  { label: "Kundali & Relationship", skill: "love_relationship" },
  { label: "Tarot Reading", skill: "tarot" },
  { label: "Numerology", skill: "numerology" },
  { label: "Career & Business", skill: "career_business" },
  { label: "KP Astrology", skill: "kp_astrology" },
  { label: "Vastu Shastra", skill: "vastu" },
  { label: "Palmistry", skill: "palmistry" },
  { label: "Face Reading", skill: "face_reading" },
];

function AppointmentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { isSignedIn, user } = useAuth();
  const { language } = useLanguage();

  // 1. Data fetching: Bookable astrologers
  const {
    data: astrologersData,
    isLoading: loadingAstrologers,
    error: astrologersError,
    refetch: refetchAstrologers,
  } = useQuery({
    queryKey: ["astrologers", { appointments: true }],
    queryFn: () => astrologerApi.list({ limit: 50 }),
  });

  const bookableAstrologers = React.useMemo(
    () => (astrologersData?.items ?? []).filter((a) => a.appointment?.enabled && a.appointment.price_paise > 0),
    [astrologersData],
  );

  // 2. Category & Search filtering
  const [selectedCategory, setSelectedCategory] = React.useState<Skill | "all">("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredAstrologers = React.useMemo(() => {
    let list = bookableAstrologers;
    if (selectedCategory !== "all") {
      list = list.filter((a) => a.skills.includes(selectedCategory));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.display_name.toLowerCase().includes(q) ||
          (a.tagline && a.tagline.toLowerCase().includes(q)) ||
          a.skills.some((s) => s.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [bookableAstrologers, selectedCategory, searchQuery]);

  // 3. Selected Astrologer State
  const [selectedAstrologerId, setSelectedAstrologerId] = React.useState<string | null>(null);

  // Sync with URL param or default to first astrologer
  React.useEffect(() => {
    const fromUrl = searchParams.get("astrologer");
    if (fromUrl && bookableAstrologers.some((a) => a.id === fromUrl || a.slug === fromUrl)) {
      const match = bookableAstrologers.find((a) => a.id === fromUrl || a.slug === fromUrl);
      if (match) setSelectedAstrologerId(match.id);
    } else if (!selectedAstrologerId && bookableAstrologers.length > 0) {
      setSelectedAstrologerId(bookableAstrologers[0].id);
    }
  }, [bookableAstrologers, searchParams, selectedAstrologerId]);

  // Ensure selected astrologer remains valid when filtering
  React.useEffect(() => {
    if (filteredAstrologers.length > 0) {
      const exists = filteredAstrologers.some((a) => a.id === selectedAstrologerId);
      if (!exists) {
        setSelectedAstrologerId(filteredAstrologers[0].id);
      }
    }
  }, [filteredAstrologers, selectedAstrologerId]);

  const selectedAstrologer = React.useMemo(
    () => bookableAstrologers.find((a) => a.id === selectedAstrologerId) ?? null,
    [bookableAstrologers, selectedAstrologerId],
  );

  // 4. Date & Calendar State
  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [visibleMonth, setVisibleMonth] = React.useState<Date>(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const pad = (n: number) => String(n).padStart(2, "0");
  const todayKey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const tomorrow = React.useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return d;
  }, [today]);
  const tomorrowKey = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;

  const quickDays = React.useMemo(() => {
    const list: { key: string; label: string; date: Date; isToday: boolean; isTomorrow: boolean }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const k = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const label =
        i === 0
          ? "Today"
          : i === 1
          ? "Tomorrow"
          : d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
      list.push({ key: k, label, date: d, isToday: i === 0, isTomorrow: i === 1 });
    }
    return list;
  }, [today]);

  const [selectedDayKey, setSelectedDayKey] = React.useState<string>(todayKey);
  const [selectedSlot, setSelectedSlot] = React.useState<Date | null>(null);
  const [minutes, setMinutes] = React.useState<number>(30);
  const [userNote, setUserNote] = React.useState("");
  const [onlyAuspiciousSlots, setOnlyAuspiciousSlots] = React.useState(false);
  const [selectedPillar, setSelectedPillar] = React.useState<string>("career_wealth");
  const [birthDetails, setBirthDetails] = React.useState({
    name: "",
    date_of_birth: "",
    time_of_birth: "",
    place_of_birth: "",
    gender: "male",
  });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);

  React.useEffect(() => {
    const defaultName = user ? (user.full_name || user.first_name || "") : "";
    if (defaultName && !birthDetails.name) {
      setBirthDetails((prev) => ({ ...prev, name: defaultName }));
    }
  }, [user, birthDetails.name]);

  const handleSelectDay = (key: string) => {
    setSelectedDayKey(key);
    try {
      const [y, m] = key.split("-").map(Number);
      if (visibleMonth.getFullYear() !== y || visibleMonth.getMonth() !== m - 1) {
        const vm = new Date(y, m - 1, 1);
        setVisibleMonth(vm);
      }
    } catch {}
  };

  // Sync minutes to astrologer's default slot duration if configured
  React.useEffect(() => {
    if (selectedAstrologer?.appointment?.block_minutes) {
      setMinutes(selectedAstrologer.appointment.block_minutes);
    }
  }, [selectedAstrologer?.id, selectedAstrologer?.appointment?.block_minutes]);

  // Reset selected slot when astrologer, day or minutes change
  React.useEffect(() => {
    setSelectedSlot(null);
  }, [selectedAstrologerId, selectedDayKey, minutes]);

  // 5. Query: Day View (available windows and booked slots)
  const { data: dayView, isLoading: loadingDayView } = useQuery({
    queryKey: ["appointments", "day", selectedAstrologer?.id, selectedDayKey],
    queryFn: () => appointmentApi.day(selectedAstrologer!.id, selectedDayKey),
    enabled: Boolean(selectedAstrologer?.id),
  });

  // Calculate available start times & enrich with Vedic Muhurat
  const rawSlots = React.useMemo(() => {
    if (!dayView) return [];
    return startsThatFit(dayView.windows, dayView.booked, minutes, dayView.slot_minutes, selectedDayKey);
  }, [dayView, minutes, selectedDayKey]);

  const slotsWithMuhurat = React.useMemo(() => {
    return rawSlots.map((slot) => {
      const muhurat = getSlotMuhurat(slot, language);
      return { slot, muhurat };
    });
  }, [rawSlots, language]);

  const availableSlots = React.useMemo(() => {
    if (!onlyAuspiciousSlots) return slotsWithMuhurat;
    return slotsWithMuhurat.filter(
      (item) => item.muhurat.quality === "super_auspicious" || item.muhurat.quality === "auspicious",
    );
  }, [slotsWithMuhurat, onlyAuspiciousSlots]);

  // 6. Query: Quote for booking
  const { data: quote, isLoading: loadingQuote } = useQuery({
    queryKey: ["appointments", "quote", selectedAstrologer?.id, minutes],
    queryFn: () => appointmentApi.quote(selectedAstrologer!.id, minutes),
    enabled: Boolean(selectedAstrologer?.id) && isSignedIn,
  });

  // 7. Query: Astrologer Reviews
  const { data: reviewsData, isLoading: loadingReviews } = useQuery({
    queryKey: ["reviews", "astrologer", selectedAstrologer?.id],
    queryFn: () => reviewApi.forAstrologer(selectedAstrologer!.id, { limit: 5 }),
    enabled: Boolean(selectedAstrologer?.id),
  });

  // 8. Mutation: Book Appointment
  const bookMutation = useMutation({
    mutationFn: () =>
      appointmentApi.book({
        astrologer_id: selectedAstrologer!.id,
        starts_at: selectedSlot!.toISOString(),
        minutes,
        note: userNote.trim() || null,
        consultation_pillar: selectedPillar,
        birth_details: birthDetails.date_of_birth ? birthDetails : undefined,
      }),
    onSuccess: (appointment) => {
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
      void queryClient.invalidateQueries({ queryKey: ["wallet"] });
      setIsConfirmModalOpen(false);
      toast.success(
        language === "bn"
          ? "অ্যাপয়েন্টমেন্ট স্লট সফলভাবে সংরক্ষিত হয়েছে!"
          : language === "hi"
          ? "अपॉइंटमेंट स्लॉट सफलतापूर्वक बुक हो गया!"
          : "Appointment slot reserved successfully!",
        {
          description: `${new Date(appointment.starts_at).toLocaleString()} · ${appointment.minutes} minutes session`,
        },
      );
      router.push("/account/appointments");
    },
    onError: (e: ApiError) => {
      toast.error(e.message || "Failed to book appointment. Please try again.");
    },
  });

  // Calendar month navigation
  const prevMonth = () => {
    const next = new Date(visibleMonth);
    next.setMonth(next.getMonth() - 1);
    // Don't navigate to past months
    if (next.getFullYear() < today.getFullYear() || (next.getFullYear() === today.getFullYear() && next.getMonth() < today.getMonth())) {
      return;
    }
    setVisibleMonth(next);
  };

  const nextMonth = () => {
    const next = new Date(visibleMonth);
    next.setMonth(next.getMonth() + 1);
    setVisibleMonth(next);
  };

  const monthYearLabel = visibleMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Generate calendar days for visibleMonth
  const calendarDays = React.useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Monday-based day of week (0=Mon, 6=Sun)
    const startDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days: { key: string; date: Date; dayNum: number; isCurrentMonth: boolean; isPast: boolean }[] = [];

    // Leading padding from prev month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      const k = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      days.push({ key: k, date: d, dayNum: prevMonthLastDay - i, isCurrentMonth: false, isPast: d < today });
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      const k = `${year}-${pad(month + 1)}-${pad(i)}`;
      days.push({ key: k, date: d, dayNum: i, isCurrentMonth: true, isPast: d < today });
    }

    // Trailing padding to complete grid (multiples of 7)
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(year, month + 1, i);
        const k = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        days.push({ key: k, date: d, dayNum: i, isCurrentMonth: false, isPast: d < today });
      }
    }

    return days;
  }, [visibleMonth, today]);

  // Mobile active view tab: "astrologers" | "profile" | "calendar"
  const [mobileTab, setMobileTab] = React.useState<"astrologers" | "profile" | "calendar">("astrologers");

  const handleSelectAstrologer = (astrologer: AstrologerPublic) => {
    setSelectedAstrologerId(astrologer.id);
    // On mobile, auto-switch to profile/schedule view
    setMobileTab("profile");
  };

  const selectedDateObj = React.useMemo(() => {
    try {
      const parts = selectedDayKey.split("-");
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    } catch {
      return today;
    }
  }, [selectedDayKey, today]);

  const selectedDateLabel = selectedDateObj.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-surface-muted/30 pb-16">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-8">
          {/* =========================================================================
              HEADER SECTION (Matching reference screenshot)
          ========================================================================= */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Book Appointment
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Find an expert astrologer and book a dedicated 1-on-1 consultation slot.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link
                href="/account/appointments"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-2xs hover:bg-surface-muted hover:border-brand-500/30 press transition-all"
              >
                <CalendarCheck className="size-3.5 text-brand-600 dark:text-brand-400" />
                <span>My Appointments</span>
              </Link>
            </div>
          </div>

          {/* =========================================================================
              HORIZONTAL CATEGORY SELECTOR (Matching reference screenshot)
          ========================================================================= */}
          <div className="mb-6 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-2 min-w-max">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.skill;
                return (
                  <button
                    key={cat.skill}
                    type="button"
                    onClick={() => setSelectedCategory(cat.skill)}
                    className={cn(
                      "rounded-full px-4 py-2 text-xs font-medium transition-all shadow-2xs",
                      isActive
                        ? "bg-brand-600 text-white font-semibold shadow-xs"
                        : "bg-card text-muted-foreground border border-border/80 hover:text-foreground hover:border-brand-500/40",
                    )}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Tab Stepper (Only on mobile/tablet screens) */}
          <div className="lg:hidden mb-6 flex rounded-2xl border border-border bg-card p-1 text-xs font-semibold shadow-2xs">
            <button
              type="button"
              onClick={() => setMobileTab("astrologers")}
              className={cn(
                "flex-1 rounded-xl py-2 transition-all text-center",
                mobileTab === "astrologers"
                  ? "bg-brand-600 text-white shadow-2xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              1. Astrologers ({filteredAstrologers.length})
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("profile")}
              className={cn(
                "flex-1 rounded-xl py-2 transition-all text-center",
                mobileTab === "profile"
                  ? "bg-brand-600 text-white shadow-2xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              2. Profile
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("calendar")}
              className={cn(
                "flex-1 rounded-xl py-2 transition-all text-center",
                mobileTab === "calendar"
                  ? "bg-brand-600 text-white shadow-2xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              3. Slots & Book
            </button>
          </div>

          {/* =========================================================================
              MAIN THREE-COLUMN WORKSPACE (Matching reference screenshot)
          ========================================================================= */}
          {loadingAstrologers ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-3 space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="rounded-2xl border border-border/80 bg-card p-5 animate-pulse h-40" />
                ))}
              </div>
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-2xl border border-border/80 bg-card p-6 animate-pulse h-96" />
              </div>
              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-2xl border border-border/80 bg-card p-6 animate-pulse h-96" />
              </div>
            </div>
          ) : astrologersError ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-12 text-center my-8">
              <AlertTriangle className="mx-auto size-12 text-red-500/80 mb-3" />
              <h3 className="font-display text-lg font-bold text-foreground">Failed to load astrologers</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                {(astrologersError as Error)?.message || "Something went wrong while fetching appointment availability."}
              </p>
              <div className="mt-5">
                <Button size="sm" onClick={() => refetchAstrologers()}>
                  Retry Loading
                </Button>
              </div>
            </div>
          ) : bookableAstrologers.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center my-8">
              <CalendarDays className="mx-auto size-12 text-brand-600/70 mb-3" />
              <h3 className="font-display text-lg font-bold">Nobody is taking appointments yet</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                Astrologers open their calendars from their panel. Check back shortly or browse the live consultation directory.
              </p>
              <div className="mt-5">
                <Link href="/astrologers">
                  <Button size="sm">Explore live astrologers</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* ---------------------------------------------------------------------
                  LEFT COLUMN: CHOOSE ASTROLOGER
              --------------------------------------------------------------------- */}
              <div
                className={cn(
                  "lg:col-span-3 space-y-4",
                  mobileTab !== "astrologers" && "hidden lg:block",
                )}
              >
                <div className="flex items-center justify-between pb-1">
                  <h2 className="font-display text-base font-bold text-foreground">
                    Choose Astrologer
                  </h2>
                  <span className="text-xs text-muted-foreground font-medium">
                    {filteredAstrologers.length} available
                  </span>
                </div>

                {/* Quick Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search astrologer..."
                    className="w-full rounded-xl border border-border bg-card pl-9 pr-7 py-2 text-xs placeholder:text-muted-foreground/70 focus:outline-hidden focus:ring-1 focus:ring-brand-500 focus:border-brand-500 shadow-2xs"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>

                {/* Astrologers List */}
                <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 scrollbar-none">
                  {filteredAstrologers.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-card p-6 text-center text-xs text-muted-foreground">
                      No astrologers found in this category.
                    </div>
                  ) : (
                    filteredAstrologers.map((astrologer) => {
                      const isSelected = selectedAstrologerId === astrologer.id;
                      const primarySkill = astrologer.skills[0] || "vedic_astrology";
                      const skillLabel = SKILL_LABELS[primarySkill] || primarySkill.replace(/_/g, " ");

                      return (
                        <div
                          key={astrologer.id}
                          onClick={() => handleSelectAstrologer(astrologer)}
                          className={cn(
                            "cursor-pointer rounded-2xl border bg-card p-4 transition-all duration-200 shadow-2xs",
                            isSelected
                              ? "border-brand-500 ring-2 ring-brand-500/20 bg-brand-500/[0.03]"
                              : "border-border/80 hover:border-brand-500/40 hover:bg-surface-muted/40",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <Avatar src={astrologer.profile_image_url} name={astrologer.display_name} size="md" />
                              <span className="absolute -bottom-0.5 -right-0.5 rounded-full bg-card p-0.5 shadow-2xs">
                                <StatusDot
                                  online={astrologer.availability.is_online}
                                  busy={astrologer.availability.is_busy}
                                />
                              </span>
                            </div>

                            <div className="min-w-0 flex-1">
                              <h3 className="truncate font-display text-sm font-bold text-foreground">
                                {astrologer.display_name}
                              </h3>
                              <p className="truncate text-[11px] text-muted-foreground">
                                Specialist · {astrologer.experience_years} years experience
                              </p>

                              <div className="mt-1 flex items-center justify-between gap-1">
                                <span className="inline-block rounded-md bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-foreground/80 border border-border/40 truncate">
                                  {skillLabel}
                                </span>
                                {astrologer.rating?.count > 0 && (
                                  <span className="flex items-center gap-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 shrink-0">
                                    <Star className="size-3 fill-amber-400 text-amber-400" />
                                    <span>{astrologer.rating.average.toFixed(1)}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3.5 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectAstrologer(astrologer);
                              }}
                              className={cn(
                                "flex-1 rounded-xl py-2 text-xs font-semibold transition-all duration-200 text-center shadow-2xs",
                                isSelected
                                  ? "bg-brand-600 text-white shadow-xs"
                                  : "bg-surface-muted text-foreground hover:bg-brand-600 hover:text-white border border-border/60",
                              )}
                            >
                              {isSelected ? "Selected" : "Book an appointment"}
                            </button>
                            <Link
                              href={`/appointments/${astrologer.slug ?? astrologer.id}`}
                              onClick={(e) => e.stopPropagation()}
                              title="Open dedicated booking page"
                              className="rounded-xl p-2 text-muted-foreground hover:text-brand-600 hover:bg-surface-muted border border-border/60 press transition-all shrink-0"
                            >
                              <ExternalLink className="size-3.5" />
                            </Link>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* ---------------------------------------------------------------------
                  CENTER COLUMN: SELECTED ASTROLOGER PROFILE
              --------------------------------------------------------------------- */}
              <div
                className={cn(
                  "lg:col-span-5 space-y-5",
                  mobileTab !== "profile" && "hidden lg:block",
                )}
              >
                {selectedAstrologer ? (
                  <div className="space-y-5">
                    {/* Main Profile Header Card */}
                    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xs">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="relative shrink-0">
                            <Avatar src={selectedAstrologer.profile_image_url} name={selectedAstrologer.display_name} size="xl" />
                            <span className="absolute -bottom-1 -right-1 rounded-full bg-card p-1 shadow-2xs">
                              <StatusDot
                                online={selectedAstrologer.availability.is_online}
                                busy={selectedAstrologer.availability.is_busy}
                              />
                            </span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h2 className="font-display text-lg sm:text-xl font-bold text-foreground truncate">
                                {selectedAstrologer.display_name}
                              </h2>
                              <ShieldCheck className="size-4 text-amber-500 fill-amber-500/20 shrink-0" />
                            </div>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                              Specialist · {selectedAstrologer.experience_years} years experience
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className="inline-block rounded-md bg-brand-500/10 px-2.5 py-0.5 text-xs font-semibold text-brand-700 dark:text-brand-300 border border-brand-500/20">
                                {SKILL_LABELS[selectedAstrologer.skills[0] || "vedic_astrology"]}
                              </span>
                              {selectedAstrologer.rating?.count > 0 && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                                  <span>{selectedAstrologer.rating.average.toFixed(1)}</span>
                                  <span className="text-muted-foreground text-[11px]">({selectedAstrologer.rating.count})</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Top-Right CTA */}
                        <div className="shrink-0 self-end sm:self-center flex flex-col items-end gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => {
                              setMobileTab("calendar");
                              // Smooth scroll to scheduling on desktop
                              const el = document.getElementById("scheduling-panel");
                              if (el) el.scrollIntoView({ behavior: "smooth" });
                            }}
                          >
                            Book an appointment
                          </Button>
                          <Link
                            href={`/appointments/${selectedAstrologer.slug ?? selectedAstrologer.id}`}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                          >
                            Dedicated booking page <ExternalLink className="size-3" />
                          </Link>
                        </div>
                      </div>

                      {/* Education & Certificates (Matching reference screenshot) */}
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-5 border-t border-border/60 text-xs">
                        <div>
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <GraduationCap className="size-3.5 text-brand-600 dark:text-brand-400" />
                            Education / Lineage
                          </p>
                          <p className="mt-1 font-medium text-foreground">
                            {selectedAstrologer.qualifications?.[0] || "Jyotish Praveen & Vedic Astrological Studies"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <Award className="size-3.5 text-amber-600 dark:text-amber-400" />
                            Certifications
                          </p>
                          <p className="mt-1 font-medium text-foreground">
                            {selectedAstrologer.specialisations?.[0] || "Council of Astrological Research & Practice"}
                          </p>
                        </div>
                      </div>

                      {/* Available Consultation Modes (Matching reference screenshot) */}
                      <div className="mt-4 pt-4 border-t border-border/60">
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Available Consultation Modes
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-muted px-3 py-1.5 font-medium text-foreground border border-border/50">
                            <Video className="size-3.5 text-brand-600 dark:text-brand-400" />
                            <span>1-on-1 Online Consultation</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-muted px-3 py-1.5 font-medium text-foreground border border-border/50">
                            <Phone className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Direct Audio Consultation</span>
                          </span>
                        </div>
                      </div>

                      {/* Working Hours / Rate Summary */}
                      <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                        <div>
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Consultation Hours
                          </p>
                          <p className="mt-0.5 font-medium text-foreground">
                            Monday – Saturday · 10:00 – 19:00
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Session Rate
                          </p>
                          <p className="mt-0.5 font-bold font-display text-sm text-foreground">
                            ₹{rupees(selectedAstrologer.appointment.price_paise)}{" "}
                            <span className="font-normal text-muted-foreground text-xs">
                              / {selectedAstrologer.appointment.block_minutes} min
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Focus Areas & Specialties (Matching symptoms/procedures in screenshot) */}
                      <div className="mt-4 pt-4 border-t border-border/60">
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Areas of Expertise & Consultation
                        </p>
                        <div className="flex flex-wrap gap-1.5 text-xs">
                          {selectedAstrologer.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-lg bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground/90 border border-border/40"
                            >
                              • {SKILL_LABELS[skill] || skill.replace(/_/g, " ")}
                            </span>
                          ))}
                          <span className="rounded-lg bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground/90 border border-border/40">
                            • Kundali Milan & Matchmaking
                          </span>
                          <span className="rounded-lg bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground/90 border border-border/40">
                            • Career & Business Predictions
                          </span>
                          <span className="rounded-lg bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground/90 border border-border/40">
                            • Vedic Gemstones & Remedies
                          </span>
                        </div>
                      </div>

                      {/* Bio */}
                      {selectedAstrologer.bio && (
                        <div className="mt-4 pt-4 border-t border-border/60">
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                            About Practitioner
                          </p>
                          <p className="text-xs leading-relaxed text-muted-foreground">
                            {selectedAstrologer.bio}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Reviews Card (Matching reference screenshot) */}
                    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xs">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display text-base font-bold text-foreground">
                          Reviews
                        </h3>
                        {selectedAstrologer.rating?.count > 0 && (
                          <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
                            <Star className="size-3.5 fill-amber-400 text-amber-400" />
                            <span>{selectedAstrologer.rating.average.toFixed(1)}</span>
                            <span className="text-muted-foreground font-normal">
                              ({selectedAstrologer.rating.count} total reviews)
                            </span>
                          </div>
                        )}
                      </div>

                      {loadingReviews ? (
                        <div className="space-y-3">
                          {[1, 2].map((n) => (
                            <div key={n} className="rounded-xl border border-border/50 bg-surface-muted/30 p-3 animate-pulse h-20" />
                          ))}
                        </div>
                      ) : reviewsData?.items && reviewsData.items.length > 0 ? (
                        <div className="space-y-3.5">
                          {reviewsData.items.map((review: Review) => (
                            <div
                              key={review.id}
                              className="rounded-xl border border-border/50 bg-surface-muted/40 p-3.5 space-y-1.5"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-500/15 font-semibold text-xs text-brand-700 dark:text-brand-300">
                                    {(review.author_name || "User")[0].toUpperCase()}
                                  </div>
                                  <span className="font-semibold text-xs text-foreground">
                                    {review.author_name || "Verified Seeker"}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="flex items-center text-amber-400">
                                    {[...Array(review.stars || 5)].map((_, i) => (
                                      <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
                                    ))}
                                  </div>
                                  <span className="text-[10px] text-muted-foreground">
                                    {timeAgo(review.created_at)}
                                  </span>
                                </div>
                              </div>

                              <p className="text-xs leading-relaxed text-muted-foreground">
                                {review.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-border/40 bg-surface-muted/30 p-4 text-center">
                          <p className="text-xs text-muted-foreground">
                            ✦ 5.0 Rating based on verified consultations · No written reviews left yet.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border bg-card p-12 text-center text-sm text-muted-foreground">
                    Please select an astrologer from the left panel.
                  </div>
                )}
              </div>

              {/* ---------------------------------------------------------------------
                  RIGHT COLUMN: CALENDAR AND AVAILABLE TIME SLOTS (Matching screenshot)
              --------------------------------------------------------------------- */}
              <div
                id="scheduling-panel"
                className={cn(
                  "lg:col-span-4 space-y-5",
                  mobileTab !== "calendar" && "hidden lg:block",
                )}
              >
                {selectedAstrologer ? (
                  <>
                    {/* Top Box: Calendar */}
                    <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs">
                      {/* Calendar Header with Month & Controls */}
                      <div className="flex items-center justify-between pb-4 border-b border-border/60">
                        <div>
                          <h3 className="font-display text-base font-bold text-foreground">
                            Calendar
                          </h3>
                          <p className="text-xs font-semibold text-muted-foreground">
                            {monthYearLabel}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={prevMonth}
                            aria-label="Previous month"
                            className="flex size-7 items-center justify-center rounded-lg border border-border hover:bg-surface-muted text-muted-foreground hover:text-foreground press transition-all"
                          >
                            <ChevronLeft className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={nextMonth}
                            aria-label="Next month"
                            className="flex size-7 items-center justify-center rounded-lg border border-border hover:bg-surface-muted text-muted-foreground hover:text-foreground press transition-all"
                          >
                            <ChevronRight className="size-4" />
                          </button>
                        </div>
                      </div>

                      {/* Weekday Labels (Mon - Sun) */}
                      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-muted-foreground">
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                        <div>Sun</div>
                      </div>

                      {/* Month Days Grid */}
                      <div className="mt-2 grid grid-cols-7 gap-1 text-center">
                        {calendarDays.map(({ key, date, dayNum, isCurrentMonth, isPast }) => {
                          const isSelected = key === selectedDayKey;
                          const isToday = key === todayKey;

                          return (
                            <button
                              key={key}
                              type="button"
                              disabled={isPast || !isCurrentMonth}
                              onClick={() => {
                                handleSelectDay(key);
                              }}
                              className={cn(
                                "relative flex size-8 sm:size-9 items-center justify-center mx-auto rounded-full text-xs font-medium transition-all",
                                !isCurrentMonth && "text-muted-foreground/30 pointer-events-none",
                                isPast && isCurrentMonth && "text-muted-foreground/40 cursor-not-allowed",
                                !isPast && isCurrentMonth && !isSelected && "text-foreground hover:bg-surface-muted cursor-pointer",
                                isToday && !isSelected && "font-bold text-brand-600 ring-1 ring-brand-500/40",
                                isSelected && "bg-brand-600 text-white font-bold shadow-xs hover:bg-brand-700",
                              )}
                            >
                              <span>{dayNum}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Quick Upcoming Days Strip */}
                      <div className="mt-4 pt-3 border-t border-border/60">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Quick Date Select
                        </p>
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                          {quickDays.map((qd) => {
                            const isSelected = qd.key === selectedDayKey;
                            return (
                              <button
                                key={qd.key}
                                type="button"
                                onClick={() => handleSelectDay(qd.key)}
                                className={cn(
                                  "shrink-0 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all border shadow-2xs",
                                  isSelected
                                    ? "bg-brand-600 text-white border-brand-600 shadow-xs"
                                    : "bg-surface-muted text-muted-foreground hover:text-foreground border-border/70 hover:border-brand-500/40",
                                )}
                              >
                                {qd.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Box: Visit Hours / Available Time Slots */}
                    <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/60">
                        <div>
                          <h3 className="font-display text-base font-bold text-foreground">
                            {language === "bn" ? "উপলব্ধ সময়সূচী ও মুহূর্ত" : language === "hi" ? "उपलब्ध समय व मुहूर्त" : "Visit Hours & Muhurat"}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {selectedDateLabel}
                          </p>
                        </div>

                        {selectedSlot && (
                          <span className="rounded-md bg-brand-500/10 px-2 py-0.5 text-[11px] font-semibold text-brand-700 dark:text-brand-300">
                            {clock(selectedSlot)}
                          </span>
                        )}
                      </div>

                      {/* Auspicious Muhurat Filter Banner */}
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface-muted/60 p-2.5 border border-border/60 text-xs">
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          <Sparkles className="size-3.5 text-amber-500" />
                          <span className="text-[11px]">
                            {language === "bn"
                              ? "বৈদিক চোঘড়িয়া ও অভিজিৎ মুহূর্ত"
                              : language === "hi"
                              ? "वैदिक चौघड़िया व अभिजित मुहूर्त"
                              : "Vedic Choghadiya & Abhijit Engine"}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setOnlyAuspiciousSlots((prev) => !prev)}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all border",
                            onlyAuspiciousSlots
                              ? "bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500/60 shadow-xs"
                              : "bg-card text-muted-foreground hover:text-foreground border-border/70 hover:border-amber-500/40",
                          )}
                        >
                          <span>⭐️</span>
                          <span>
                            {onlyAuspiciousSlots
                              ? (language === "bn" ? "শুধুমাত্র শুভ মুহূর্ত" : language === "hi" ? "केवल शुभ मुहूर्त" : "Auspicious Only")
                              : (language === "bn" ? "সব স্লট দেখুন" : language === "hi" ? "सभी स्लॉट देखें" : "All Slots")}
                          </span>
                        </button>
                      </div>

                      {/* Loading Day State */}
                      {loadingDayView ? (
                        <div className="py-8 text-center">
                          <LoadingBlock label="Checking available slots…" />
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <div className="rounded-xl border border-border/60 bg-surface-muted/30 p-5 text-center space-y-2">
                          <Clock className="mx-auto size-7 text-muted-foreground/70 mb-1" />
                          <p className="text-xs font-semibold text-foreground">
                            {onlyAuspiciousSlots
                              ? (language === "bn" ? "এই তারিখে কোনো শুভ মুহূর্তের খালি স্লট নেই" : "No auspicious slots found on this date")
                              : `No slots available on ${selectedDateLabel}`}
                          </p>
                          <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                            {onlyAuspiciousSlots ? (
                              <button
                                type="button"
                                onClick={() => setOnlyAuspiciousSlots(false)}
                                className="text-brand-600 font-semibold hover:underline"
                              >
                                {language === "bn" ? "সব সাধারণ স্লট দেখতে ক্লিক করুন" : "Click to view all standard open slots"}
                              </button>
                            ) : selectedDayKey === todayKey
                              ? "Today's consultation hours are closed or fully booked."
                              : "The astrologer has no open availability windows on this date. Please pick another date above."}
                          </p>
                          {selectedDayKey === todayKey && !onlyAuspiciousSlots && (
                            <div className="pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSelectDay(tomorrowKey)}
                                className="text-xs font-semibold"
                              >
                                View Tomorrow&apos;s Slots ({tomorrow.toLocaleDateString("en-US", { month: "short", day: "numeric" })}) →
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                          {availableSlots.map(({ slot, muhurat }) => {
                            const isSelected = selectedSlot?.getTime() === slot.getTime();
                            const isAuspicious = muhurat.quality === "super_auspicious" || muhurat.quality === "auspicious";
                            const isRahuKaal = muhurat.is_rahu_kaal;
                            return (
                              <button
                                key={slot.toISOString()}
                                type="button"
                                onClick={() => setSelectedSlot(slot)}
                                className={cn(
                                  "flex flex-col items-center justify-center rounded-xl p-2.5 text-xs font-semibold tabular-nums transition-all border shadow-2xs group relative",
                                  isSelected
                                    ? "bg-brand-600 text-white border-brand-600 shadow-sm scale-[1.02]"
                                    : isAuspicious
                                    ? "bg-amber-500/10 border-amber-500/40 text-foreground hover:border-amber-500 hover:bg-amber-500/15"
                                    : isRahuKaal
                                    ? "bg-surface-muted/60 text-muted-foreground border-rose-500/30 hover:border-rose-500/60"
                                    : "bg-surface-muted text-foreground border-border/70 hover:border-brand-500/50 hover:bg-surface-muted/80",
                                )}
                              >
                                <span className="text-xs font-bold">{clock(slot)}</span>
                                <span
                                  className={cn(
                                    "mt-1 inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9.5px] font-medium leading-none",
                                    isSelected
                                      ? "bg-white/20 text-white"
                                      : isAuspicious
                                      ? "bg-amber-500/20 text-amber-800 dark:text-amber-200"
                                      : isRahuKaal
                                      ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                                      : "bg-border/60 text-muted-foreground",
                                  )}
                                >
                                  {isAuspicious && <span>⭐️</span>}
                                  {isRahuKaal && <span>⚠️</span>}
                                  <span>{muhurat.badge}</span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Primary CTA: Book an appointment */}
                      <div className="pt-2">
                        <Button
                          size="lg"
                          disabled={!selectedSlot}
                          onClick={() => setIsConfirmModalOpen(true)}
                          className="w-full text-xs font-bold"
                        >
                          {language === "bn" ? "অ্যাপয়েন্টমেন্ট নিশ্চিত করুন" : language === "hi" ? "अपॉइंटमेंट बुक करें" : "Book an appointment"}
                        </Button>
                        {!selectedSlot && availableSlots.length > 0 && (
                          <p className="mt-2 text-center text-[11px] text-muted-foreground">
                            {language === "bn" ? "এগিয়ে যেতে উপরে একটি সময় স্লট নির্বাচন করুন।" : "Please select a time slot above to proceed."}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            BOOKING CONFIRMATION MODAL WITH VEDIC PILLARS & KUNDLI ATTACHMENT
        ========================================================================= */}
        <Modal
          open={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          title={language === "bn" ? "অ্যাপয়েন্টমেন্ট ও বৈদিক পরিকাঠামো বুকিং" : language === "hi" ? "अपॉइंटमेंट व वैदिक विवरण पुष्टि" : "Confirm Appointment Booking"}
          size="lg"
        >
          {selectedAstrologer && selectedSlot && (
            <div className="space-y-4 pt-2 text-xs max-h-[75vh] overflow-y-auto pr-1">
              {/* Astrologer preview */}
              <div className="flex items-center gap-3 rounded-2xl bg-surface-muted p-3.5 border border-border/60">
                <Avatar src={selectedAstrologer.profile_image_url} name={selectedAstrologer.display_name} size="md" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-display font-bold text-sm text-foreground truncate">
                    {selectedAstrologer.display_name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    {SKILL_LABELS[selectedAstrologer.skills[0] || "vedic_astrology"]} · {selectedAstrologer.experience_years} years experience
                  </p>
                </div>
              </div>

              {/* Vedic Muhurat Intelligence Box */}
              {(() => {
                const sm = getSlotMuhurat(selectedSlot, language);
                const isAuspicious = sm.quality === "super_auspicious" || sm.quality === "auspicious";
                const isRahuKaal = sm.is_rahu_kaal;
                const desc = language === "bn" ? sm.descriptionBn : language === "hi" ? sm.descriptionHi : sm.descriptionEn;
                return (
                  <div
                    className={cn(
                      "rounded-2xl p-3 border text-xs space-y-1",
                      isAuspicious
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-100"
                        : isRahuKaal
                        ? "bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-100"
                        : "bg-surface-muted border-border/70 text-foreground",
                    )}
                  >
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-amber-600" />
                        <span>
                          {sm.badge}{" "}
                          {language === "bn" ? "চোঘড়িয়া মুহূর্ত" : language === "hi" ? "चौघड़िया मुहूर्त" : "Choghadiya Muhurat"}
                        </span>
                      </span>
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300">
                        {isAuspicious
                          ? (language === "bn" ? "⭐️ পরম শুভ সময়" : language === "hi" ? "⭐️ अत्यंत शुभ समय" : "⭐️ Auspicious")
                          : isRahuKaal
                          ? (language === "bn" ? "⚠️ রাহুকাল" : language === "hi" ? "⚠️ राहुकाल" : "⚠️ Rahu Kaal")
                          : (language === "bn" ? "সাধারণ মুহূর্ত" : language === "hi" ? "सामान्य मुहूर्त" : "Neutral")}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-90 leading-relaxed">{desc}</p>
                  </div>
                );
              })()}

              {/* Consultation Focus Pillar Selector */}
              <div>
                <label className="block text-[11px] font-bold text-foreground mb-1.5 flex items-center justify-between">
                  <span>
                    {language === "bn"
                      ? "পরামর্শের প্রধান বিষয় (Consultation Focus Pillar)"
                      : language === "hi"
                      ? "परामर्श का मुख्य विषय (Focus Pillar)"
                      : "Consultation Focus Pillar"}
                  </span>
                  <span className="text-[10px] text-brand-600 font-semibold">*Required</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CONSULTATION_PILLARS.map((p) => {
                    const isSelected = selectedPillar === p.id;
                    const title = language === "bn" ? p.labelBn : language === "hi" ? p.labelHi : p.labelEn;
                    const desc = language === "bn" ? p.descBn : language === "hi" ? p.descHi : p.descEn;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPillar(p.id)}
                        className={cn(
                          "flex flex-col text-left p-2.5 rounded-xl border text-xs transition-all",
                          isSelected
                            ? "bg-brand-500/10 border-brand-500 text-foreground ring-1 ring-brand-500/40"
                            : "bg-surface-muted/50 border-border/70 text-muted-foreground hover:border-brand-500/30 hover:text-foreground",
                        )}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-foreground">
                          <span>{p.icon}</span>
                          <span className="truncate">{title}</span>
                        </div>
                        <span className="text-[10px] line-clamp-1 mt-0.5 text-muted-foreground opacity-90">
                          {desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Birth Details Snapshot for Kundli pre-reading */}
              <div className="rounded-2xl border border-border/80 bg-surface-muted/40 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                    <Compass className="size-3.5 text-brand-600" />
                    <span>
                      {language === "bn"
                        ? "জন্ম কুণ্ডলী বিবরণী (ঐচ্ছিক কিন্তু বাঞ্ছনীয়)"
                        : language === "hi"
                        ? "जन्म कुंडली विवरण (वैकल्पिक)"
                        : "Birth Details for Kundli Preparation (Optional)"}
                    </span>
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {language === "bn" ? "জ্যোতিষীর আগাম বিশ্লেষণের জন্য" : "For astrologer pre-analysis"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground">
                      {language === "bn" ? "জন্ম তারিখ (Date of Birth)" : "Date of Birth"}
                    </label>
                    <input
                      type="date"
                      value={birthDetails.date_of_birth}
                      onChange={(e) => setBirthDetails((prev) => ({ ...prev, date_of_birth: e.target.value }))}
                      className="w-full mt-0.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground">
                      {language === "bn" ? "জন্ম সময় (Time of Birth)" : "Time of Birth"}
                    </label>
                    <input
                      type="time"
                      value={birthDetails.time_of_birth}
                      onChange={(e) => setBirthDetails((prev) => ({ ...prev, time_of_birth: e.target.value }))}
                      className="w-full mt-0.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-foreground"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-medium text-muted-foreground">
                      {language === "bn" ? "জন্মস্থান (City, State)" : "Place of Birth (City, State)"}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kolkata, West Bengal, India"
                      value={birthDetails.place_of_birth}
                      onChange={(e) => setBirthDetails((prev) => ({ ...prev, place_of_birth: e.target.value }))}
                      className="w-full mt-0.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Slot Details */}
              <div className="space-y-2 rounded-2xl border border-border/80 bg-card p-4">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CalendarDays className="size-3.5 text-brand-600" /> Date
                  </span>
                  <span className="font-semibold text-foreground">{selectedDateLabel}</span>
                </div>

                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="size-3.5 text-brand-600" /> Time Slot
                  </span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {clock(selectedSlot)} – {clock(new Date(selectedSlot.getTime() + minutes * 60_000))} ({minutes} mins)
                  </span>
                </div>

                {quote && (
                  <>
                    <div className="flex justify-between items-center pt-2 border-t border-border/60 text-muted-foreground">
                      <span>Total Consultation Fee</span>
                      <span className="font-bold text-foreground tabular-nums">₹{rupees(quote.price_paise)}</span>
                    </div>

                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>Hold Deposit ({quote.commission_percent}%)</span>
                      <span className="font-bold text-brand-600 dark:text-brand-400 tabular-nums">
                        ₹{rupees(quote.deposit_paise)} · {quote.deposit_coins} coins
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>Due at Appointment</span>
                      <span className="font-medium text-foreground tabular-nums">₹{rupees(quote.balance_due_paise)}</span>
                    </div>
                  </>
                )}
              </div>

              {/* User Note / Questions */}
              <div>
                <label className="block text-[11px] font-semibold text-foreground mb-1">
                  {language === "bn" ? "বিশেষ প্রশ্ন বা বিবরণ (ঐচ্ছিক)" : "Specific Questions / Notes (Optional)"}
                </label>
                <Textarea
                  rows={2}
                  maxLength={500}
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  placeholder="e.g. Specific career transition, marriage questions, or gemstone requirements..."
                  className="text-xs"
                />
              </div>

              {/* Authentication & Wallet Check */}
              {!isSignedIn ? (
                <div className="pt-2">
                  <Link href="/login" className="block w-full">
                    <Button size="lg" className="w-full text-xs font-bold">
                      Sign in to book appointment
                    </Button>
                  </Link>
                </div>
              ) : quote && !quote.can_afford ? (
                <div className="space-y-3 pt-2">
                  <Alert tone="warning">
                    <Wallet className="mr-1.5 inline size-4" />
                    You have {quote.balance_coins} coins. You need {quote.deposit_coins} coins to reserve this slot.
                  </Alert>
                  <Link href="/account/wallet" className="block w-full">
                    <Button size="lg" variant="secondary" className="w-full text-xs font-bold">
                      Add coins to wallet
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="pt-2">
                  <Button
                    size="lg"
                    loading={bookMutation.isPending}
                    onClick={() => bookMutation.mutate()}
                    className="w-full text-xs font-bold"
                  >
                    <CheckCircle2 className="size-4" />
                    {language === "bn" ? "বুকিং ও স্লট নিশ্চিত করুন" : language === "hi" ? "बुकिंग व स्लॉट सुरक्षित करें" : "Confirm & Reserve Slot"}
                  </Button>
                  <p className="mt-2 text-center text-[10px] text-muted-foreground">
                    What you pay now holds the slot and confirms your booking immediately.
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal>
      </main>

      <SiteFooter />
    </>
  );
}

export default function AppointmentsPage() {
  return (
    <React.Suspense
      fallback={
        <>
          <SiteHeader />
          <main className="min-h-screen bg-surface-muted/30 py-16">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
              <LoadingBlock label="Loading appointment booking..." />
            </div>
          </main>
          <SiteFooter />
        </>
      }
    >
      <AppointmentsContent />
    </React.Suspense>
  );
}
