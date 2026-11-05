"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Award,
  Calendar as CalendarIcon,
  CalendarCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  ExternalLink,
  Flame,
  Gem,
  GraduationCap,
  Heart,
  HelpCircle,
  Info,
  Languages,
  MessageSquare,
  Moon,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Sunset,
  Sunrise,
  User,
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
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
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

type TimeOfDayFilter = "all" | "morning" | "afternoon" | "evening" | "night";

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
    () =>
      (astrologersData?.items ?? []).filter((a) => {
        const price = a.appointment?.price_paise ?? 0;
        if (price <= 0) return false;
        return a.appointment?.enabled !== false;
      }),
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

  React.useEffect(() => {
    const fromUrl = searchParams.get("astrologer");
    if (fromUrl && bookableAstrologers.some((a) => a.id === fromUrl || a.slug === fromUrl)) {
      const match = bookableAstrologers.find((a) => a.id === fromUrl || a.slug === fromUrl);
      if (match) setSelectedAstrologerId(match.id);
    } else if (!selectedAstrologerId && bookableAstrologers.length > 0) {
      setSelectedAstrologerId(bookableAstrologers[0].id);
    }
  }, [bookableAstrologers, searchParams, selectedAstrologerId]);

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

  // 4. BookMyShow Horizontal Date Strip State
  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const todayKey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const dateStrip = React.useMemo(() => {
    const days = [];
    for (let i = 0; i < 21; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
      const dayNumber = d.getDate();
      const monthName = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
      days.push({
        key,
        date: d,
        dayName,
        dayNumber,
        monthName,
        isToday: i === 0,
        isTomorrow: i === 1,
      });
    }
    return days;
  }, [today]);

  const [selectedDayKey, setSelectedDayKey] = React.useState<string>(todayKey);
  const [selectedSlot, setSelectedSlot] = React.useState<Date | null>(null);
  const [minutes, setMinutes] = React.useState<number>(30);
  const [timeFilter, setTimeFilter] = React.useState<TimeOfDayFilter>("all");
  const [onlyAuspiciousSlots, setOnlyAuspiciousSlots] = React.useState(false);
  const [selectedPillar, setSelectedPillar] = React.useState<string>("career_wealth");
  const [userNote, setUserNote] = React.useState("");
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

  React.useEffect(() => {
    if (selectedAstrologer?.appointment?.block_minutes) {
      setMinutes(selectedAstrologer.appointment.block_minutes);
    }
  }, [selectedAstrologer?.id, selectedAstrologer?.appointment?.block_minutes]);

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

  // Filter by Auspicious & Time of Day
  const filteredSlots = React.useMemo(() => {
    let list = slotsWithMuhurat;
    if (onlyAuspiciousSlots) {
      list = list.filter(
        (item) => item.muhurat.quality === "super_auspicious" || item.muhurat.quality === "auspicious",
      );
    }
    if (timeFilter !== "all") {
      list = list.filter((item) => {
        const hours = item.slot.getHours();
        if (timeFilter === "morning") return hours >= 6 && hours < 12;
        if (timeFilter === "afternoon") return hours >= 12 && hours < 17;
        if (timeFilter === "evening") return hours >= 17 && hours < 21;
        if (timeFilter === "night") return hours >= 21 || hours < 6;
        return true;
      });
    }
    return list;
  }, [slotsWithMuhurat, onlyAuspiciousSlots, timeFilter]);

  // Group slots into BookMyShow Time-of-Day Shows
  const groupedSlots = React.useMemo(() => {
    const morning: typeof slotsWithMuhurat = [];
    const afternoon: typeof slotsWithMuhurat = [];
    const evening: typeof slotsWithMuhurat = [];
    const night: typeof slotsWithMuhurat = [];

    for (const item of filteredSlots) {
      const hours = item.slot.getHours();
      if (hours >= 6 && hours < 12) {
        morning.push(item);
      } else if (hours >= 12 && hours < 17) {
        afternoon.push(item);
      } else if (hours >= 17 && hours < 21) {
        evening.push(item);
      } else {
        night.push(item);
      }
    }

    return { morning, afternoon, evening, night };
  }, [filteredSlots]);

  // Pricing calculation
  const computedPricePaise = React.useMemo(() => {
    if (!selectedAstrologer?.appointment) return 0;
    const basePrice = selectedAstrologer.appointment.price_paise;
    const baseBlock = selectedAstrologer.appointment.block_minutes || 30;
    return Math.round((basePrice * minutes) / baseBlock);
  }, [selectedAstrologer, minutes]);

  // 6. Query: Quote for booking
  const { data: quote } = useQuery({
    queryKey: ["appointments", "quote", selectedAstrologer?.id, minutes],
    queryFn: () => appointmentApi.quote(selectedAstrologer!.id, minutes),
    enabled: Boolean(selectedAstrologer?.id) && isSignedIn,
  });

  // 7. Query: Astrologer Reviews
  const { data: reviewsData } = useQuery({
    queryKey: ["reviews", "astrologer", selectedAstrologer?.id],
    queryFn: () => reviewApi.forAstrologer(selectedAstrologer!.id, { limit: 6 }),
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

  const selectedDateObj = React.useMemo(() => {
    try {
      const parts = selectedDayKey.split("-");
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    } catch {
      return today;
    }
  }, [selectedDayKey, today]);

  const selectedDateLabel = selectedDateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const selectedSlotMuhurat = React.useMemo(() => {
    if (!selectedSlot) return null;
    return getSlotMuhurat(selectedSlot, language);
  }, [selectedSlot, language]);

  // Date strip horizontal scroll handler
  const scrollDateStrip = (direction: "left" | "right") => {
    const el = document.getElementById("bms-date-strip");
    if (el) {
      const amount = direction === "left" ? -280 : 280;
      el.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-[#FDFBF7] pb-32">
        {/* =========================================================================
            TOP EXPERIENCE SHOWCASE / HERO HEADER (BookMyShow / District Style)
        ========================================================================= */}
        <section className="border-b border-amber-900/10 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EEDD]/40 pt-6 pb-8">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Top Navigation & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-900/70">
                <Link href="/" className="hover:text-amber-900 transition-colors">Home</Link>
                <span>/</span>
                <span className="text-amber-900">Vedic Consultation Chamber</span>
                <span className="rounded-full bg-amber-500/15 text-amber-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Live Booking Matrix
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/account/appointments"
                  className="inline-flex items-center gap-2 rounded-2xl border border-amber-900/15 bg-white/90 backdrop-blur-md px-4 py-2 text-xs font-bold text-slate-800 shadow-2xs hover:bg-white hover:border-amber-500/50 transition-all cursor-pointer"
                >
                  <CalendarCheck className="size-4 text-amber-600" />
                  <span>{language === "bn" ? "আমার অ্যাপয়েন্টমেন্ট তালিকা" : "My Appointments"}</span>
                </Link>
              </div>
            </div>

            {/* Astrologer Selector Carousel / Chips (If multiple practitioners exist) */}
            {bookableAstrologers.length > 1 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900/60">
                  Select Astrologer ({bookableAstrologers.length} Masters Available)
                </span>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                  {bookableAstrologers.map((astro) => {
                    const isSelected = astro.id === selectedAstrologer?.id;
                    return (
                      <button
                        key={astro.id}
                        type="button"
                        onClick={() => setSelectedAstrologerId(astro.id)}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl px-4 py-2.5 transition-all border shrink-0 text-xs font-bold cursor-pointer shadow-2xs",
                          isSelected
                            ? "bg-[#D97706] text-white border-[#B45309] shadow-md scale-[1.02]"
                            : "bg-white text-slate-800 border-amber-900/10 hover:border-amber-400 hover:bg-amber-50/40",
                        )}
                      >
                        <Avatar src={astro.profile_image_url} name={astro.display_name} size="sm" />
                        <div className="text-left">
                          <p className="truncate max-w-[150px] font-bold">{astro.display_name}</p>
                          <p className={cn("text-[10px]", isSelected ? "text-amber-100" : "text-amber-700")}>
                            ₹{rupees(astro.appointment.price_paise)} / {astro.appointment.block_minutes}m
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected Astrologer Master Experience Card */}
            {selectedAstrologer ? (
              <div className="relative overflow-hidden rounded-3xl border border-amber-900/15 bg-white p-6 sm:p-8 shadow-[0_12px_36px_rgba(180,83,9,0.06)]">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Avatar & Core Bio */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div className="relative">
                      <div className="size-24 sm:size-28 rounded-3xl overflow-hidden ring-4 ring-amber-500/20 shadow-md">
                        <Avatar
                          src={selectedAstrologer.profile_image_url}
                          name={selectedAstrologer.display_name}
                          size="xl"
                          className="size-full object-cover"
                        />
                      </div>
                      <span className="absolute -bottom-2 -right-2 flex size-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                        <Check className="size-4 stroke-[3]" />
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                          {selectedAstrologer.display_name}
                        </h2>
                        <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-0.5 text-xs font-bold text-amber-900">
                          {SKILL_LABELS[selectedAstrologer.skills[0] || "vedic_astrology"]}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 font-medium flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>{selectedAstrologer.experience_years}+ Years Professional Experience</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-bold text-amber-700">
                          <Star className="size-4 fill-amber-400 text-amber-400" />
                          <span>{selectedAstrologer.rating?.average ? selectedAstrologer.rating.average.toFixed(1) : "5.0"}</span>
                          <span className="text-slate-400 font-normal">({selectedAstrologer.rating?.count || 25} verified reviews)</span>
                        </span>
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                          <GraduationCap className="size-3.5 text-amber-600" />
                          <span>{selectedAstrologer.qualifications?.[0] || "Jyotish Praveen & Research"}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                          <Award className="size-3.5 text-amber-600" />
                          <span>{selectedAstrologer.specialisations?.[0] || "Vedic Astrological Council"}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Consultation Mode & Fee Engine Summary */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right space-y-0.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Consultation Session Fee
                      </p>
                      <p className="font-display text-3xl font-black text-slate-900 tabular-nums">
                        ₹{rupees(selectedAstrologer.appointment.price_paise)}
                        <span className="text-xs font-normal text-slate-500 ml-1.5">
                          / {selectedAstrologer.appointment.block_minutes} mins
                        </span>
                      </p>
                      <p className="text-xs font-semibold text-emerald-700">
                        ~₹{((selectedAstrologer.appointment.price_paise / 100) / (selectedAstrologer.appointment.block_minutes || 30)).toFixed(2)}/min · 1-on-1 Dedicated Chamber
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-900">
                        <Video className="size-3.5 text-amber-600" />
                        <span>Ultra-HD Video</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-800">
                        <Phone className="size-3.5 text-emerald-600" />
                        <span>Direct Audio</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* =========================================================================
            BOOKMYSHOW / DISTRICT SIGNATURE DATE SELECTOR RIBBON
        ========================================================================= */}
        <section className="sticky top-0 z-30 border-b border-amber-900/10 bg-white/95 backdrop-blur-md shadow-xs">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-3.5">
            <div className="flex items-center justify-between gap-3">
              {/* Left arrow scroll */}
              <button
                type="button"
                onClick={() => scrollDateStrip("left")}
                aria-label="Scroll dates left"
                className="hidden sm:flex size-9 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all shadow-2xs cursor-pointer"
              >
                <ChevronLeft className="size-4" />
              </button>

              {/* Horizontal Date Pills Scroller */}
              <div
                id="bms-date-strip"
                className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-1 scroll-smooth"
              >
                {dateStrip.map((item) => {
                  const isSelected = item.key === selectedDayKey;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setSelectedDayKey(item.key)}
                      className={cn(
                        "relative flex flex-col items-center justify-center min-w-[76px] sm:min-w-[84px] py-2.5 px-2 rounded-2xl transition-all border cursor-pointer shrink-0 shadow-2xs group",
                        isSelected
                          ? "bg-[#D97706] text-white border-[#B45309] shadow-md scale-[1.03]"
                          : "bg-white text-slate-700 border-slate-200/90 hover:border-amber-400 hover:bg-amber-50/50",
                      )}
                    >
                      <span className={cn("text-[11px] font-black uppercase tracking-wider", isSelected ? "text-amber-100" : "text-slate-400")}>
                        {item.dayName}
                      </span>
                      <span className="font-display text-xl font-black tabular-nums my-0.5">
                        {item.dayNumber}
                      </span>
                      <span className={cn("text-[10px] font-bold uppercase", isSelected ? "text-amber-100" : "text-slate-500")}>
                        {item.monthName}
                      </span>

                      {item.isToday && (
                        <span className={cn(
                          "absolute -top-1.5 rounded-full px-2 py-0.2 text-[9px] font-black uppercase tracking-wider shadow-2xs",
                          isSelected ? "bg-white text-amber-900" : "bg-amber-500 text-white"
                        )}>
                          TODAY
                        </span>
                      )}

                      {item.isTomorrow && (
                        <span className={cn(
                          "absolute -top-1.5 rounded-full px-2 py-0.2 text-[9px] font-black uppercase tracking-wider shadow-2xs",
                          isSelected ? "bg-white text-amber-900" : "bg-sky-600 text-white"
                        )}>
                          TOMORROW
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right arrow scroll */}
              <button
                type="button"
                onClick={() => scrollDateStrip("right")}
                aria-label="Scroll dates right"
                className="hidden sm:flex size-9 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all shadow-2xs cursor-pointer"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SESSION CONTROLS & TIME-OF-DAY FILTER BAR (District by Zomato Style)
        ========================================================================= */}
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-3xl border border-amber-900/10 bg-white p-5 sm:p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03)]">
            {/* Session Duration Selector */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="size-3.5 text-amber-600" />
                <span>Select Consultation Duration</span>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { m: 15, label: "15 Mins", badge: "Quick Q&A" },
                  { m: 30, label: "30 Mins", badge: "Standard (Popular)" },
                  { m: 60, label: "60 Mins", badge: "In-depth Kundli" },
                ].map((dur) => {
                  const isSelected = minutes === dur.m;
                  const price = selectedAstrologer?.appointment
                    ? Math.round((selectedAstrologer.appointment.price_paise * dur.m) / (selectedAstrologer.appointment.block_minutes || 30))
                    : 0;
                  return (
                    <button
                      key={dur.m}
                      type="button"
                      onClick={() => setMinutes(dur.m)}
                      className={cn(
                        "rounded-2xl px-4 py-2 text-xs font-bold transition-all border cursor-pointer flex items-center gap-2 shadow-2xs",
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
                      )}
                    >
                      <span>{dur.label}</span>
                      <span className={cn("text-[10px] font-bold", isSelected ? "text-amber-400" : "text-amber-700")}>
                        ₹{rupees(price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time of Day & Auspicious Filter */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-amber-600" />
                <span>Filter By Showtimes & Muhurat</span>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTimeFilter("all")}
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-xs font-bold transition-all border cursor-pointer",
                    timeFilter === "all"
                      ? "bg-amber-100 text-amber-900 border-amber-300"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100",
                  )}
                >
                  All Day
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFilter("morning")}
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-xs font-bold transition-all border cursor-pointer flex items-center gap-1",
                    timeFilter === "morning"
                      ? "bg-amber-100 text-amber-900 border-amber-300"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100",
                  )}
                >
                  <Sunrise className="size-3 text-amber-600" />
                  <span>Morning</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFilter("afternoon")}
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-xs font-bold transition-all border cursor-pointer flex items-center gap-1",
                    timeFilter === "afternoon"
                      ? "bg-amber-100 text-amber-900 border-amber-300"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100",
                  )}
                >
                  <Sun className="size-3 text-amber-600" />
                  <span>Afternoon</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFilter("evening")}
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-xs font-bold transition-all border cursor-pointer flex items-center gap-1",
                    timeFilter === "evening"
                      ? "bg-amber-100 text-amber-900 border-amber-300"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100",
                  )}
                >
                  <Sunset className="size-3 text-amber-600" />
                  <span>Evening</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFilter("night")}
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-xs font-bold transition-all border cursor-pointer flex items-center gap-1",
                    timeFilter === "night"
                      ? "bg-amber-100 text-amber-900 border-amber-300"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100",
                  )}
                >
                  <Moon className="size-3 text-amber-600" />
                  <span>Night</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOnlyAuspiciousSlots((p) => !p)}
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 shadow-2xs",
                    onlyAuspiciousSlots
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-xs"
                      : "bg-white text-amber-900 border-amber-300/80 hover:bg-amber-50/70",
                  )}
                >
                  <span>⭐️</span>
                  <span>{language === "bn" ? "শুধুমাত্র শুভ মুহূর্ত" : "Auspicious Slots Only"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================================
              THE SHOWTIMES MATRIX (BookMyShow Movie/Event Showtimes Matrix)
          ========================================================================= */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Available Showtimes & Consultation Slots</span>
                  <span className="rounded-full bg-amber-500/10 text-amber-800 text-xs px-3 py-0.5 font-bold">
                    {filteredSlots.length} Open Slots
                  </span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {selectedDateLabel} · Vedic Choghadiya & Abhijit Muhurat Calibrated
                </p>
              </div>
            </div>

            {loadingDayView ? (
              <div className="py-16 text-center rounded-3xl border border-slate-200/80 bg-white">
                <LoadingBlock label="Calculating Vedic slots & availability matrix…" />
              </div>
            ) : filteredSlots.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-amber-900/15 bg-white p-12 text-center space-y-4 shadow-sm">
                <div className="size-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                  <Clock className="size-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-lg font-bold text-slate-900">
                    {onlyAuspiciousSlots
                      ? "No auspicious slots found in this time window"
                      : `No slots available on ${selectedDateLabel}`}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {onlyAuspiciousSlots
                      ? "You have filtered by auspicious muhurats only. Try viewing all open slots or pick another date."
                      : "The astrologer has no open consultation windows for this date. Check upcoming dates in the date ribbon above."}
                  </p>
                </div>
                {onlyAuspiciousSlots ? (
                  <Button size="sm" onClick={() => setOnlyAuspiciousSlots(false)}>
                    View All Standard Slots
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      // Switch to tomorrow
                      const tom = dateStrip[1]?.key;
                      if (tom) setSelectedDayKey(tom);
                    }}
                  >
                    View Tomorrow&apos;s Slots →
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* 1. Morning Showtimes */}
                {groupedSlots.morning.length > 0 && (
                  <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-amber-900">
                      <Sunrise className="size-4 text-amber-600" />
                      <span>Morning Sessions · সকাল (06:00 AM – 12:00 PM)</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {groupedSlots.morning.map(({ slot, muhurat }) => renderSlotButton(slot, muhurat))}
                    </div>
                  </div>
                )}

                {/* 2. Afternoon Showtimes */}
                {groupedSlots.afternoon.length > 0 && (
                  <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-amber-900">
                      <Sun className="size-4 text-amber-600" />
                      <span>Afternoon Sessions · দুপুর (12:00 PM – 05:00 PM)</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {groupedSlots.afternoon.map(({ slot, muhurat }) => renderSlotButton(slot, muhurat))}
                    </div>
                  </div>
                )}

                {/* 3. Evening Showtimes (Peak Consulting Hours) */}
                {groupedSlots.evening.length > 0 && (
                  <div className="rounded-3xl border border-amber-300/80 bg-gradient-to-b from-white via-amber-50/20 to-white p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-amber-200/60">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
                        <Sunset className="size-4 text-amber-600" />
                        <span>Evening Peak Sessions · সন্ধ্যা (05:00 PM – 09:00 PM)</span>
                      </div>
                      <span className="rounded-full bg-amber-500/15 text-amber-900 text-[10px] font-black px-2.5 py-0.5">
                        High Demand Window
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {groupedSlots.evening.map(({ slot, muhurat }) => renderSlotButton(slot, muhurat))}
                    </div>
                  </div>
                )}

                {/* 4. Night Showtimes */}
                {groupedSlots.night.length > 0 && (
                  <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-indigo-950">
                      <Moon className="size-4 text-indigo-600" />
                      <span>Night Sessions · রাত্রি (09:00 PM – 12:00 AM)</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {groupedSlots.night.map(({ slot, muhurat }) => renderSlotButton(slot, muhurat))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* =========================================================================
              PRACTITIONER PHILOSOPHY & REVIEWS ACCORDION (Below Matrix)
          ========================================================================= */}
          {selectedAstrologer && (
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-6">
              <h4 className="font-display text-lg font-bold text-slate-900">
                About {selectedAstrologer.display_name} & Consultations
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2">
                  <p className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="size-4 text-amber-600" />
                    <span>Vedic Astrological Principles</span>
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Consultations are calibrated using Lahiri Ayanamsha, KP Sub-Lord systems, and classical Parashari Muhurat to ensure maximum astrological precision.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2">
                  <p className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Video className="size-4 text-amber-600" />
                    <span>Private Video Chamber</span>
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    End-to-end encrypted 1-on-1 audio/video sessions directly in your browser. No external third-party apps needed.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2">
                  <p className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="size-4 text-amber-600" />
                    <span>Sacred Vedic Prescription</span>
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Receive consecrated gemstone advice, authentic rudraksha, and powerful mantras directly into your account immediately after the session.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* =========================================================================
            DISTRICT-STYLE STICKY BOTTOM CHECKOUT SUMMARY BAR
        ========================================================================= */}
        {selectedSlot && selectedAstrologer && (
          <aside
            aria-label="Booking summary"
            className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-300/80 shadow-[0_-12px_40px_rgba(0,0,0,0.12)] transition-all animate-in slide-in-from-bottom duration-300"
          >
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Left: Selected Slot Information */}
              <div className="flex items-center gap-4 min-w-0">
                <Avatar
                  src={selectedAstrologer.profile_image_url}
                  name={selectedAstrologer.display_name}
                  size="md"
                  className="size-12 ring-2 ring-amber-400"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-slate-900 text-sm sm:text-base truncate">
                      {selectedAstrologer.display_name}
                    </h4>
                    <span className="rounded-full bg-amber-500/15 text-amber-900 px-2 py-0.5 text-[10px] font-black uppercase">
                      {minutes} mins session
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                    <span className="font-bold text-slate-900">{selectedDateLabel}</span>
                    <span>•</span>
                    <span className="font-extrabold text-amber-700 tabular-nums">{clock(selectedSlot)}</span>
                    {selectedSlotMuhurat && (
                      <>
                        <span>•</span>
                        <span className="font-bold text-amber-900 flex items-center gap-1">
                          <span>⭐️</span>
                          <span>{selectedSlotMuhurat.badge}</span>
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Right: Price & Grand Action Button */}
              <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-left sm:text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Consultation Fee</p>
                  <p className="font-display text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
                    ₹{rupees(computedPricePaise)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(true)}
                  className="rounded-2xl px-6 sm:px-8 py-3.5 font-bold text-sm text-white bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#F59E0B] shadow-[0_8px_25px_-4px_rgba(217,119,6,0.5)] hover:shadow-[0_12px_32px_-4px_rgba(217,119,6,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>{language === "bn" ? "স্লট নিশ্চিত করুন ও বুক করুন" : "Confirm Slot & Book"}</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* =========================================================================
            DISTRICT-STYLE CHECKOUT MODAL (Vedic Pillars + Kundli Snapshot)
        ========================================================================= */}
        <Modal
          open={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          title={language === "bn" ? "অ্যাপয়েন্টমেন্ট ও বৈদিক পরিকাঠামো বুকিং" : "Confirm Consultation Booking"}
          size="lg"
        >
          {selectedAstrologer && selectedSlot && (
            <div className="space-y-4 pt-2 text-xs max-h-[75vh] overflow-y-auto pr-1">
              {/* Astrologer preview */}
              <div className="flex items-center gap-3.5 rounded-2xl bg-amber-50/50 p-4 border border-amber-200">
                <Avatar src={selectedAstrologer.profile_image_url} name={selectedAstrologer.display_name} size="md" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-display font-bold text-sm text-slate-900 truncate">
                    {selectedAstrologer.display_name}
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    {SKILL_LABELS[selectedAstrologer.skills[0] || "vedic_astrology"]} · {selectedAstrologer.experience_years} years experience
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-base font-black text-slate-900">₹{rupees(computedPricePaise)}</p>
                  <p className="text-[10px] text-slate-500">{minutes} minutes</p>
                </div>
              </div>

              {/* Vedic Muhurat Intelligence Box */}
              {selectedSlotMuhurat && (
                <div
                  className={cn(
                    "rounded-2xl p-3.5 border text-xs space-y-1",
                    selectedSlotMuhurat.quality === "super_auspicious" || selectedSlotMuhurat.quality === "auspicious"
                      ? "bg-amber-50 border-amber-300 text-amber-950"
                      : selectedSlotMuhurat.is_rahu_kaal
                      ? "bg-rose-50 border-rose-300 text-rose-950"
                      : "bg-slate-50 border-slate-200 text-slate-800",
                  )}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-amber-600" />
                      <span>
                        {selectedSlotMuhurat.badge}{" "}
                        {language === "bn" ? "চোঘড়িয়া মুহূর্ত" : "Choghadiya Muhurat"}
                      </span>
                    </span>
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] uppercase font-bold text-amber-800">
                      {selectedSlotMuhurat.quality === "super_auspicious" || selectedSlotMuhurat.quality === "auspicious"
                        ? "⭐️ পরম শুভ সময়"
                        : selectedSlotMuhurat.is_rahu_kaal
                        ? "⚠️ রাহুকাল"
                        : "সাধারণ মুহূর্ত"}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-90 leading-relaxed">
                    {language === "bn" ? selectedSlotMuhurat.descriptionBn : selectedSlotMuhurat.descriptionEn}
                  </p>
                </div>
              )}

              {/* Consultation Focus Pillar Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-900 mb-1.5 flex items-center justify-between">
                  <span>
                    {language === "bn"
                      ? "পরামর্শের প্রধান বিষয় (Consultation Focus Pillar)"
                      : "Consultation Focus Pillar"}
                  </span>
                  <span className="text-[10px] text-amber-600 font-semibold">*Required</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CONSULTATION_PILLARS.map((p) => {
                    const isSelected = selectedPillar === p.id;
                    const title = language === "bn" ? p.labelBn : p.labelEn;
                    const desc = language === "bn" ? p.descBn : p.descEn;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPillar(p.id)}
                        className={cn(
                          "flex flex-col text-left p-3 rounded-2xl border text-xs transition-all cursor-pointer",
                          isSelected
                            ? "bg-amber-500/10 border-amber-500 text-slate-900 ring-2 ring-amber-500/30"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:border-amber-300 hover:text-slate-900",
                        )}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <span>{p.icon}</span>
                          <span className="truncate">{title}</span>
                        </div>
                        <span className="text-[10px] line-clamp-1 mt-0.5 text-slate-500">
                          {desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Birth Details Snapshot for Kundli pre-reading */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5">
                    <Compass className="size-3.5 text-amber-600" />
                    <span>
                      {language === "bn"
                        ? "জন্ম কুণ্ডলী বিবরণী (ঐচ্ছিক কিন্তু বাঞ্ছনীয়)"
                        : "Birth Details for Kundli Preparation (Optional)"}
                    </span>
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {language === "bn" ? "জ্যোতিষীর আগাম বিশ্লেষণের জন্য" : "For astrologer pre-analysis"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] font-medium text-slate-500">
                      {language === "bn" ? "জন্ম তারিখ (Date of Birth)" : "Date of Birth"}
                    </label>
                    <input
                      type="date"
                      value={birthDetails.date_of_birth}
                      onChange={(e) => setBirthDetails((prev) => ({ ...prev, date_of_birth: e.target.value }))}
                      className="w-full mt-0.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-slate-500">
                      {language === "bn" ? "জন্ম সময় (Time of Birth)" : "Time of Birth"}
                    </label>
                    <input
                      type="time"
                      value={birthDetails.time_of_birth}
                      onChange={(e) => setBirthDetails((prev) => ({ ...prev, time_of_birth: e.target.value }))}
                      className="w-full mt-0.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-medium text-slate-500">
                      {language === "bn" ? "জন্মস্থান (City, State)" : "Place of Birth (City, State)"}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kolkata, West Bengal, India"
                      value={birthDetails.place_of_birth}
                      onChange={(e) => setBirthDetails((prev) => ({ ...prev, place_of_birth: e.target.value }))}
                      className="w-full mt-0.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Slot Details Breakdown */}
              <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CalendarDays className="size-3.5 text-amber-600" /> Date
                  </span>
                  <span className="font-semibold text-slate-900">{selectedDateLabel}</span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="size-3.5 text-amber-600" /> Time Slot
                  </span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {clock(selectedSlot)} – {clock(new Date(selectedSlot.getTime() + minutes * 60_000))} ({minutes} mins)
                  </span>
                </div>

                {quote && (
                  <>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-slate-600">
                      <span>Total Consultation Fee</span>
                      <span className="font-bold text-slate-900 tabular-nums">₹{rupees(quote.price_paise)}</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-600">
                      <span>Hold Deposit ({quote.commission_percent}%)</span>
                      <span className="font-bold text-amber-700 tabular-nums">
                        ₹{rupees(quote.deposit_paise)} · {quote.deposit_coins} coins
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-600">
                      <span>Due at Appointment</span>
                      <span className="font-medium text-slate-900 tabular-nums">₹{rupees(quote.balance_due_paise)}</span>
                    </div>
                  </>
                )}
              </div>

              {/* User Note / Questions */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-800 mb-1">
                  {language === "bn" ? "বিশেষ প্রশ্ন বা বিবরণ (ঐচ্ছিক)" : "Specific Questions / Notes (Optional)"}
                </label>
                <Textarea
                  rows={2}
                  maxLength={500}
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  placeholder="e.g. Specific career transition, marriage questions, or gemstone requirements..."
                  className="text-xs rounded-xl border-slate-200"
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
                    className="w-full text-xs font-bold bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white shadow-sm"
                  >
                    <CheckCircle2 className="size-4 mr-1.5" />
                    {language === "bn" ? "বুকিং ও স্লট নিশ্চিত করুন" : "Confirm & Reserve Slot"}
                  </Button>
                  <p className="mt-2 text-center text-[10px] text-slate-400">
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

  // Helper render function for Slot Button (BookMyShow Movie/Event Showtime pill style)
  function renderSlotButton(slot: Date, muhurat: SlotMuhuratInfo) {
    const isSelected = selectedSlot?.getTime() === slot.getTime();
    const isAuspicious = muhurat.quality === "super_auspicious" || muhurat.quality === "auspicious";
    const isRahuKaal = muhurat.is_rahu_kaal;

    return (
      <button
        key={slot.toISOString()}
        type="button"
        onClick={() => setSelectedSlot(slot)}
        className={cn(
          "relative flex flex-col items-center justify-between rounded-2xl p-3.5 transition-all text-center border shadow-2xs cursor-pointer group",
          isSelected
            ? "bg-[#D97706] text-white border-[#B45309] shadow-md ring-4 ring-amber-500/25 scale-[1.03]"
            : isAuspicious
            ? "bg-white hover:bg-amber-50/70 border-amber-300 hover:border-amber-500 text-slate-900 hover:scale-[1.02]"
            : isRahuKaal
            ? "bg-slate-50/70 hover:bg-rose-50/50 border-slate-200 hover:border-rose-300 text-slate-700"
            : "bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-900",
        )}
      >
        <span className="text-sm font-extrabold tabular-nums tracking-tight">
          {clock(slot)}
        </span>

        <span
          className={cn(
            "mt-1.5 rounded-full px-2 py-0.5 text-[9.5px] font-bold leading-none uppercase tracking-wider flex items-center gap-1",
            isSelected
              ? "bg-white/20 text-white"
              : isAuspicious
              ? "bg-amber-100 text-amber-900 border border-amber-300/60"
              : isRahuKaal
              ? "bg-rose-100 text-rose-800"
              : "bg-slate-100 text-slate-600",
          )}
        >
          {isAuspicious && <span>⭐️</span>}
          {isRahuKaal && <span>⚠️</span>}
          <span>{muhurat.badge}</span>
        </span>

        <span
          className={cn(
            "mt-2 text-[10px] font-bold tabular-nums",
            isSelected ? "text-amber-100" : "text-amber-700",
          )}
        >
          ₹{rupees(computedPricePaise)}
        </span>
      </button>
    );
  }
}

export default function AppointmentsPage() {
  return (
    <React.Suspense
      fallback={
        <>
          <SiteHeader />
          <main className="min-h-screen bg-[#FDFBF7] py-16">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
              <LoadingBlock label="Loading Vedic booking experience..." />
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
