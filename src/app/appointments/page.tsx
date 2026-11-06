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
  Zap,
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

  // 4. BookMyShow Horizontal Date Strip State (21 Days)
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
    queryKey: ["appointments", "quote", selectedAstrologer?.id, minutes, selectedSlot?.toISOString()],
    queryFn: () =>
      appointmentApi.quote(
        selectedAstrologer!.id,
        minutes,
        undefined,
        selectedSlot?.toISOString()
      ),
    enabled: Boolean(selectedAstrologer?.id) && isSignedIn,
  });

  // 6b. Query: Cosmic Resonance Compatibility Index
  const { data: cosmicSynergy } = useQuery({
    queryKey: ["appointments", "synergy", selectedAstrologer?.id],
    queryFn: () => appointmentApi.synergy(selectedAstrologer!.id),
    enabled: Boolean(selectedAstrologer?.id),
  });

  // Query: Existing user appointments to enforce single active appointment rule (Rule 1)
  const { data: myAppointments } = useQuery({
    queryKey: ["appointments", "mine", "upcoming"],
    queryFn: () => appointmentApi.mine(true),
    enabled: isSignedIn,
  });

  const activeAppointment = React.useMemo(() => {
    return (myAppointments ?? []).find(
      (a) => a.status === "booked" && new Date(a.ends_at).getTime() >= Date.now(),
    );
  }, [myAppointments]);

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
      const amount = direction === "left" ? -320 : 320;
      el.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <>
      <SiteHeader />

      <main className="relative min-h-screen bg-[#FDFBF7] pb-36 overflow-hidden">
        {/* =========================================================================
            COSMIC AMBIENT AURAS & SACRED GEOMETRY (Atmospheric Background)
        ========================================================================= */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Warm upper golden aura */}
          <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-amber-200/40 via-orange-100/25 to-transparent blur-3xl opacity-80" />
          
          {/* Subtle rotating celestial yantra disc */}
          <div className="absolute top-12 -right-24 w-96 h-96 opacity-[0.04] animate-celestial-spin">
            <svg viewBox="0 0 100 100" className="w-full h-full stroke-amber-900 fill-none stroke-[0.5]">
              <circle cx="50" cy="50" r="48" />
              <circle cx="50" cy="50" r="36" />
              <polygon points="50,2 93,75 7,75" />
              <polygon points="50,98 93,25 7,25" />
              <circle cx="50" cy="50" r="20" />
            </svg>
          </div>

          {/* Left subtle cosmic wheel */}
          <div className="absolute top-80 -left-24 w-80 h-80 opacity-[0.03] animate-celestial-spin" style={{ animationDirection: "reverse" }}>
            <svg viewBox="0 0 100 100" className="w-full h-full stroke-amber-900 fill-none stroke-[0.4]">
              <circle cx="50" cy="50" r="45" strokeDasharray="3 3" />
              <polygon points="50,5 95,50 50,95 5,50" />
              <circle cx="50" cy="50" r="15" />
            </svg>
          </div>
        </div>

        {/* =========================================================================
            TOP EXPERIENCE SHOWCASE / HERO HEADER (BookMyShow / District Style)
        ========================================================================= */}
        <section className="relative border-b border-amber-900/10 bg-gradient-to-b from-[#FFFDF9]/90 via-[#FAF6EE]/80 to-[#F5EEDD]/30 pt-6 pb-8 backdrop-blur-xs">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 space-y-6">
            
            {/* Top Navigation & Live Radar Pulse */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-amber-950/80">
                <Link href="/" className="hover:text-amber-700 transition-colors flex items-center gap-1.5">
                  <Compass className="size-3.5 text-amber-600" />
                  <span>Astra Home</span>
                </Link>
                <span className="text-amber-900/30">/</span>
                <span className="text-slate-900 font-bold">Vedic Consultation Chamber</span>
                
                {/* Live Radar Pulse Tag */}
                <div className="ml-2 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 shadow-2xs">
                  <span className="relative flex size-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                    {language === "bn" ? "লাইভ বুকিং ম্যাট্রিক্স" : "Live Booking Matrix"}
                  </span>
                </div>
              </div>

              {/* My Appointments Quick Button */}
              <div className="flex items-center gap-3">
                <Link
                  href="/account/appointments"
                  className="group inline-flex items-center gap-2 rounded-2xl border border-amber-900/15 bg-white/90 backdrop-blur-md px-4 py-2 text-xs font-bold text-slate-800 shadow-2xs hover:bg-white hover:border-amber-500 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <CalendarCheck className="size-4 text-amber-600 group-hover:scale-110 transition-transform" />
                  <span>{language === "bn" ? "আমার অ্যাপয়েন্টমেন্ট তালিকা" : "My Appointments"}</span>
                </Link>
              </div>
            </div>

            {/* Astrologer Selector Carousel / Switcher (If multiple exist) */}
            {bookableAstrologers.length > 1 && (
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-950/70 flex items-center gap-1.5">
                    <Users className="size-3.5 text-amber-600" />
                    <span>Select Master Astrologer ({bookableAstrologers.length} Available)</span>
                  </span>
                </div>
                <div className="flex items-center gap-3 overflow-x-auto pb-1.5 scrollbar-none">
                  {bookableAstrologers.map((astro) => {
                    const isSelected = astro.id === selectedAstrologer?.id;
                    return (
                      <button
                        key={astro.id}
                        type="button"
                        onClick={() => setSelectedAstrologerId(astro.id)}
                        className={cn(
                          "relative flex items-center gap-3 rounded-2xl px-4 py-2.5 transition-all border shrink-0 text-xs font-bold cursor-pointer group",
                          isSelected
                            ? "bg-gradient-to-r from-[#D97706] to-[#EA580C] text-white border-[#B45309] shadow-[0_6px_20px_-2px_rgba(217,119,6,0.4)] scale-[1.02]"
                            : "bg-white/95 text-slate-800 border-amber-900/15 hover:border-amber-400 hover:bg-white hover:-translate-y-0.5 shadow-2xs",
                        )}
                      >
                        <div className="relative">
                          <Avatar
                            src={astro.profile_image_url}
                            name={astro.display_name}
                            size="sm"
                            className={cn(
                              "ring-2 transition-all",
                              isSelected ? "ring-white" : "ring-amber-500/30 group-hover:ring-amber-500",
                            )}
                          />
                          {astro.availability?.is_online && (
                            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                          )}
                        </div>
                        <div className="text-left">
                          <p className="truncate max-w-[150px] font-bold tracking-tight">{astro.display_name}</p>
                          <p className={cn("text-[10px] font-semibold", isSelected ? "text-amber-100" : "text-amber-700")}>
                            ₹{rupees(astro.appointment.price_paise)} / {astro.appointment.block_minutes}m
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active Appointment Notice (Rule 1: Limit 1 active appointment at a time) */}
            {activeAppointment && (
              <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 p-4 sm:p-5 backdrop-blur-md shadow-[0_8px_30px_rgba(217,119,6,0.12)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shrink-0">
                      <CalendarCheck className="size-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display font-bold text-sm sm:text-base text-amber-950">
                          {language === "bn"
                            ? "আপনার একটি সক্রিয় অ্যাপয়েন্টমেন্ট ইতোমধ্যে সংরক্ষিত রয়েছে"
                            : "You Have an Active Appointment Scheduled"}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-950 border border-amber-500/40">
                          {language === "bn" ? "নীতিমালা: ১টি সক্রিয় সেশন সীমা" : "Policy: Max 1 Active Booking"}
                        </span>
                      </div>
                      <p className="text-xs text-amber-950/80 mt-1 leading-relaxed max-w-3xl">
                        {language === "bn"
                          ? `আপনি ${new Date(activeAppointment.starts_at).toLocaleDateString("bn-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} তারিখে ${new Date(activeAppointment.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} সময়ে জ্যোতিষীর সাথে একটি সেশন নিশ্চিত করেছেন। বৈদিক পরামর্শের পূর্ণ মনোযোগ বজায় রাখতে একই সাথে ১টির বেশি অ্যাপয়েন্টমেন্ট সক্রিয় রাখা যাবে না।`
                          : `You have an active confirmed consultation booked for ${new Date(activeAppointment.starts_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}. To ensure undivided spiritual attention, users may hold only 1 active appointment at a time.`}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/account/appointments"
                    className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
                  >
                    <span>{language === "bn" ? "সক্রিয় অ্যাপয়েন্টমেন্ট দেখুন" : "View Active Appointment"}</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Selected Astrologer Master Experience Card (District Showcase) */}
            {selectedAstrologer ? (
              <div className="relative overflow-hidden rounded-3xl border border-amber-900/15 bg-white/95 backdrop-blur-md p-6 sm:p-8 shadow-[0_16px_48px_rgba(180,83,9,0.08)] ring-1 ring-amber-400/20 group">
                {/* Subtle card interior shimmer background */}
                <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-gradient-to-br from-amber-200/30 via-orange-100/20 to-transparent blur-2xl" />

                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Avatar & Core Bio */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
                    <div className="relative group/avatar">
                      <div className="size-24 sm:size-28 rounded-3xl overflow-hidden ring-4 ring-amber-400/30 group-hover/avatar:ring-amber-500 shadow-lg transition-all duration-300">
                        <Avatar
                          src={selectedAstrologer.profile_image_url}
                          name={selectedAstrologer.display_name}
                          size="xl"
                          className="size-full object-cover group-hover/avatar:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <span className="absolute -bottom-2 -right-2 flex size-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-2 ring-white">
                        <Check className="size-4 stroke-[3]" />
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                          {selectedAstrologer.display_name}
                        </h2>
                        <span className="rounded-full bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 px-3 py-0.5 text-xs font-bold text-amber-950 flex items-center gap-1 shadow-2xs">
                          <Sparkles className="size-3 text-amber-600" />
                          <span>{SKILL_LABELS[selectedAstrologer.skills[0] || "vedic_astrology"]}</span>
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 font-medium flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-semibold text-slate-700">{selectedAstrologer.experience_years}+ Years Experience</span>
                        <span className="text-amber-400">•</span>
                        <span className="flex items-center gap-1 font-bold text-amber-800">
                          <Star className="size-4 fill-amber-400 text-amber-400" />
                          <span>{selectedAstrologer.rating?.average ? selectedAstrologer.rating.average.toFixed(1) : "5.0"}</span>
                          <span className="text-slate-400 font-normal">({selectedAstrologer.rating?.count || 28} verified sessions)</span>
                        </span>
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50/70 border border-amber-200/80 px-3 py-1 font-semibold text-amber-950 shadow-2xs">
                          <GraduationCap className="size-3.5 text-amber-600" />
                          <span>{selectedAstrologer.qualifications?.[0] || "Jyotish Praveen & Research"}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100/90 border border-slate-200 px-3 py-1 font-semibold text-slate-700 shadow-2xs">
                          <Award className="size-3.5 text-amber-600" />
                          <span>{selectedAstrologer.specialisations?.[0] || "Council of Astrological Research"}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100/90 border border-slate-200 px-2.5 py-1 font-semibold text-slate-600">
                          <Languages className="size-3 text-amber-600" />
                          <span>English, বাংলা, हिन्दी</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Consultation Mode & Fee Summary */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right space-y-0.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Consultation Session Rate
                      </p>
                      <p className="font-display text-3xl font-black text-slate-900 tabular-nums">
                        ₹{rupees(selectedAstrologer.appointment.price_paise)}
                        <span className="text-xs font-normal text-slate-500 ml-1.5">
                          / {selectedAstrologer.appointment.block_minutes} mins
                        </span>
                      </p>
                      <p className="text-xs font-semibold text-emerald-700 flex items-center lg:justify-end gap-1">
                        <Zap className="size-3 text-emerald-600" />
                        <span>~₹{((selectedAstrologer.appointment.price_paise / 100) / (selectedAstrologer.appointment.block_minutes || 30)).toFixed(2)}/min · 1-on-1 Dedicated Chamber</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 text-xs font-bold text-amber-950 shadow-2xs">
                        <Video className="size-3.5 text-amber-600" />
                        <span>Ultra-HD Video</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-2xs">
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
            BOOKMYSHOW SIGNATURE 21-DAY HORIZONTAL DATE STRIP RIBBON
        ========================================================================= */}
        <section className="sticky top-0 z-30 border-b border-amber-900/10 bg-white/95 backdrop-blur-md shadow-xs">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-3.5">
            <div className="flex items-center justify-between gap-3">
              {/* Left arrow scroll */}
              <button
                type="button"
                onClick={() => scrollDateStrip("left")}
                aria-label="Scroll dates left"
                className="hidden sm:flex size-9 shrink-0 items-center justify-center rounded-2xl border border-slate-200/90 bg-white text-slate-700 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-900 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
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
                        "relative flex flex-col items-center justify-center min-w-[76px] sm:min-w-[84px] py-2.5 px-2 rounded-2xl transition-all border cursor-pointer shrink-0 group select-none",
                        isSelected
                          ? "bg-gradient-to-b from-[#EA580C] via-[#D97706] to-[#B45309] text-white border-[#B45309] shadow-[0_8px_20px_rgba(217,119,6,0.35)] scale-[1.04]"
                          : "bg-white text-slate-700 border-slate-200/90 hover:border-amber-400 hover:bg-amber-50/60 hover:-translate-y-0.5 shadow-2xs",
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
                          "absolute -top-2 rounded-full px-2 py-0.2 text-[9px] font-black uppercase tracking-wider shadow-xs",
                          isSelected ? "bg-white text-amber-950 font-black" : "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                        )}>
                          TODAY
                        </span>
                      )}

                      {item.isTomorrow && (
                        <span className={cn(
                          "absolute -top-2 rounded-full px-2 py-0.2 text-[9px] font-black uppercase tracking-wider shadow-xs",
                          isSelected ? "bg-white text-amber-950 font-black" : "bg-sky-600 text-white"
                        )}>
                          TOMORROW
                        </span>
                      )}

                      {isSelected && (
                        <span className="absolute -bottom-1 size-1.5 rounded-full bg-white shadow-xs" />
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
                className="hidden sm:flex size-9 shrink-0 items-center justify-center rounded-2xl border border-slate-200/90 bg-white text-slate-700 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-900 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
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
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 rounded-3xl border border-amber-900/10 bg-white/95 backdrop-blur-md p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] ring-1 ring-amber-400/10">
            {/* Session Duration Selector */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="size-3.5 text-amber-600" />
                <span>Select Consultation Duration</span>
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {[
                  { m: 15, label: "15 Mins", badge: "Quick Q&A" },
                  { m: 30, label: "30 Mins", badge: "Standard (Popular)", highlight: true },
                  { m: 60, label: "60 Mins", badge: "Deep Kundli" },
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
                        "rounded-2xl px-4 py-2.5 text-xs font-bold transition-all border cursor-pointer flex items-center gap-2 group shadow-2xs",
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]"
                          : "bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300",
                      )}
                    >
                      <span>{dur.label}</span>
                      <span className={cn("text-[10px] font-bold", isSelected ? "text-amber-400" : "text-amber-700")}>
                        ₹{rupees(price)}
                      </span>
                      {dur.highlight && (
                        <span className={cn(
                          "rounded-full px-1.5 py-0.2 text-[9px] uppercase font-black",
                          isSelected ? "bg-amber-500 text-slate-900" : "bg-amber-100 text-amber-900",
                        )}>
                          Popular
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time of Day & Auspicious Filter */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-amber-600" />
                <span>Filter By Showtimes & Vedic Muhurat</span>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTimeFilter("all")}
                  className={cn(
                    "rounded-xl px-3.5 py-2 text-xs font-bold transition-all border cursor-pointer shadow-2xs",
                    timeFilter === "all"
                      ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100",
                  )}
                >
                  All Day
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFilter("morning")}
                  className={cn(
                    "rounded-xl px-3.5 py-2 text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 shadow-2xs",
                    timeFilter === "morning"
                      ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100",
                  )}
                >
                  <Sunrise className="size-3.5 text-amber-600" />
                  <span>Morning</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFilter("afternoon")}
                  className={cn(
                    "rounded-xl px-3.5 py-2 text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 shadow-2xs",
                    timeFilter === "afternoon"
                      ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100",
                  )}
                >
                  <Sun className="size-3.5 text-amber-600" />
                  <span>Afternoon</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFilter("evening")}
                  className={cn(
                    "rounded-xl px-3.5 py-2 text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 shadow-2xs",
                    timeFilter === "evening"
                      ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100",
                  )}
                >
                  <Sunset className="size-3.5 text-amber-600" />
                  <span>Evening</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFilter("night")}
                  className={cn(
                    "rounded-xl px-3.5 py-2 text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 shadow-2xs",
                    timeFilter === "night"
                      ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100",
                  )}
                >
                  <Moon className="size-3.5 text-amber-600" />
                  <span>Night</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOnlyAuspiciousSlots((p) => !p)}
                  className={cn(
                    "rounded-xl px-3.5 py-2 text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 shadow-2xs",
                    onlyAuspiciousSlots
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-md ring-2 ring-amber-400/30"
                      : "bg-white text-amber-950 border-amber-300/80 hover:bg-amber-50/70",
                  )}
                >
                  <span>⭐️</span>
                  <span>{language === "bn" ? "শুধুমাত্র শুভ মুহূর্ত" : "Auspicious Slots Only"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================================
              THE SHOWTIMES MATRIX (BookMyShow Movie/Showtimes Layout)
          ========================================================================= */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                  <span>Available Showtimes & Consultation Slots</span>
                  <span className="rounded-full bg-amber-500/15 text-amber-950 text-xs px-3 py-0.5 font-bold border border-amber-500/25">
                    {filteredSlots.length} Open Slots
                  </span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {selectedDateLabel} · Vedic Choghadiya & Abhijit Muhurat Calibrated
                </p>
              </div>
            </div>

            {loadingDayView ? (
              <div className="py-20 text-center rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm">
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
                  <div className="rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-amber-950">
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
                  <div className="rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-amber-950">
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
                  <div className="rounded-3xl border border-amber-300/80 bg-gradient-to-b from-white via-amber-50/25 to-white p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-amber-200/60">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-950">
                        <Sunset className="size-4 text-amber-600" />
                        <span>Evening Peak Sessions · সন্ধ্যা (05:00 PM – 09:00 PM)</span>
                      </div>
                      <span className="rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-950 text-[10px] font-black px-2.5 py-0.5 border border-amber-400/40">
                        High Demand Window 🔥
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {groupedSlots.evening.map(({ slot, muhurat }) => renderSlotButton(slot, muhurat))}
                    </div>
                  </div>
                )}

                {/* 4. Night Showtimes */}
                {groupedSlots.night.length > 0 && (
                  <div className="rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-6 shadow-xs space-y-4">
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
            <div className="rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-xs">
              <h4 className="font-display text-lg font-bold text-slate-900">
                About {selectedAstrologer.display_name} & Consultations
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="rounded-2xl bg-amber-50/40 p-4 border border-amber-100 space-y-2">
                  <p className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="size-4 text-amber-600" />
                    <span>Vedic Astrological Principles</span>
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Consultations are calibrated using Lahiri Ayanamsha, KP Sub-Lord systems, and classical Parashari Muhurat to ensure maximum astrological precision.
                  </p>
                </div>

                <div className="rounded-2xl bg-amber-50/40 p-4 border border-amber-100 space-y-2">
                  <p className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Video className="size-4 text-amber-600" />
                    <span>Private Video Chamber</span>
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    End-to-end encrypted 1-on-1 audio/video sessions directly in your browser. No external third-party apps needed.
                  </p>
                </div>

                <div className="rounded-2xl bg-amber-50/40 p-4 border border-amber-100 space-y-2">
                  <p className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
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
            className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-amber-300/80 shadow-[0_-16px_50px_rgba(217,119,6,0.18)] transition-all animate-in slide-in-from-bottom duration-300"
          >
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Left: Selected Slot Information */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative">
                  <Avatar
                    src={selectedAstrologer.profile_image_url}
                    name={selectedAstrologer.display_name}
                    size="md"
                    className="size-12 ring-2 ring-amber-400"
                  />
                  <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                    <Check className="size-2.5 stroke-[3]" />
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-slate-900 text-sm sm:text-base truncate">
                      {selectedAstrologer.display_name}
                    </h4>
                    <span className="rounded-full bg-amber-500/15 text-amber-950 px-2 py-0.5 text-[10px] font-black uppercase">
                      {minutes} mins session
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                    <span className="font-bold text-slate-900">{selectedDateLabel}</span>
                    <span>•</span>
                    <span className="font-extrabold text-amber-800 tabular-nums">{clock(selectedSlot)}</span>
                    {selectedSlotMuhurat && (
                      <>
                        <span>•</span>
                        <span className="font-bold text-amber-950 flex items-center gap-1">
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

                {activeAppointment ? (
                  <Link
                    href="/account/appointments"
                    className="rounded-2xl px-6 sm:px-8 py-3.5 font-bold text-xs sm:text-sm text-amber-950 bg-amber-100/90 border border-amber-300 shadow-xs hover:bg-amber-200 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <CalendarCheck className="size-4 text-amber-700" />
                    <span>{language === "bn" ? "সক্রিয় অ্যাপয়েন্টমেন্ট রয়েছে (১টি সীমা)" : "Active Booking Exists (Limit 1)"}</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsConfirmModalOpen(true)}
                    className="rounded-2xl px-6 sm:px-8 py-3.5 font-bold text-sm text-white bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#F59E0B] shadow-[0_8px_25px_-4px_rgba(217,119,6,0.5)] hover:shadow-[0_12px_32px_-4px_rgba(217,119,6,0.6)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2 animate-pulse-subtle"
                  >
                    <span>{language === "bn" ? "স্লট নিশ্চিত করুন ও বুক করুন" : "Confirm Slot & Book"}</span>
                    <ArrowRight className="size-4" />
                  </button>
                )}
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
              <div className="flex items-center gap-3.5 rounded-2xl bg-amber-50/70 p-4 border border-amber-200">
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
                  <p className="font-display text-base font-black text-slate-900">
                    ₹{rupees(quote?.price_paise ?? computedPricePaise)}
                  </p>
                  <p className="text-[10px] text-slate-500">{minutes} minutes</p>
                </div>
              </div>

              {/* VIP Tatkal Notice if applicable */}
              {quote?.is_tatkal && (
                <div className="rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-500/10 via-yellow-500/15 to-amber-500/10 p-3 flex items-center justify-between gap-3 text-amber-950">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Zap className="size-4 fill-amber-600 text-amber-600 shrink-0" />
                    <span>
                      {language === "bn"
                        ? "তাত্ক্ষণিক জরুরি স্লট (VIP Tatkal Window)"
                        : "Instant Priority Tatkal Window"}
                    </span>
                  </div>
                  <span className="rounded-full bg-amber-200/90 border border-amber-400 px-2 py-0.5 text-[10px] font-black uppercase text-amber-950">
                    {quote.tatkal_multiplier ? `${quote.tatkal_multiplier}x Rate` : "VIP"}
                  </span>
                </div>
              )}

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

                {cosmicSynergy && (
                  <div className="rounded-xl border border-amber-300/80 bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 p-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-amber-600" />
                        <span>মহাজাগতিক সংযোগ (Cosmic Resonance)</span>
                      </span>
                      <span className="text-[10px] font-black text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                        {cosmicSynergy.score}% {cosmicSynergy.harmony_tier}
                      </span>
                    </div>
                    <p className="text-[10px] text-amber-800/80 leading-tight">
                      {(cosmicSynergy.resonance_factors || []).join(" • ")}
                    </p>
                  </div>
                )}

                {quote && (
                  <>
                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 text-slate-600">
                      <span className="font-medium">Total Consultation Fee</span>
                      <span className="font-bold text-slate-900 tabular-nums">
                        ₹{rupees(quote.price_paise)} ({quote.total_coins || Math.round(quote.price_paise / 100)} coins)
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <span>Upfront Slot Deposit ({quote.commission_percent}%)</span>
                        <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-semibold border border-amber-200/50">Debited now</span>
                      </span>
                      <span className="font-bold text-amber-800 tabular-nums">
                        ₹{rupees(quote.deposit_paise)} · {quote.deposit_coins} coins
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <span>Escrow Held Balance</span>
                        <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-semibold border border-indigo-200/50">Blocked in escrow</span>
                      </span>
                      <span className="font-bold text-indigo-900 tabular-nums">
                        ₹{rupees(quote.balance_due_paise)} · {quote.balance_due_coins ?? Math.max(0, (quote.total_coins || Math.round(quote.price_paise / 100)) - quote.deposit_coins)} coins
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200 text-xs">
                      <span className="text-slate-500 font-medium">Your Spendable Balance</span>
                      <span className="font-extrabold text-emerald-700 tabular-nums">
                        {quote.available_coins ?? quote.balance_coins} coins
                      </span>
                    </div>

                    {/* Escrow & Grace Window Explanation Card */}
                    <div className="mt-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 p-3 text-[11px] space-y-1.5 text-amber-950">
                      <div className="flex items-center justify-between font-bold text-amber-900">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3 text-amber-700" />
                          <span>
                            {language === "bn" ? "বাতিল ও রিফান্ড নীতিমালা" : "Cancellation & Escrow Policy"}
                          </span>
                        </span>
                        <span className="text-[10px] bg-amber-200/70 px-2 py-0.5 rounded-full font-bold">
                          {selectedAstrologer?.appointment?.cancellation_window_minutes ?? 30} mins grace window
                        </span>
                      </div>
                      <p className="text-[10.5px] leading-relaxed text-amber-900/85">
                        {language === "bn"
                          ? `বুকিংয়ের পর ${selectedAstrologer?.appointment?.cancellation_window_minutes ?? 30} মিনিটের মধ্যে আপনি নিজে বাতিল করলে ব্লক করা ব্যালেন্স কয়েন তৎক্ষণাৎ ফেরত পাবেন (আমানত কয়েন ফেরতযোগ্য নয়)। জ্যোতিষী বাতিল করলে সম্পূর্ণ ১০০% কয়েন রিফান্ড পাবেন। সেশন সম্পন্ন হলে ব্লক করা ব্যালেন্স রিলিজ হবে।`
                          : `The session balance is locked safely in escrow. If you cancel within ${selectedAstrologer?.appointment?.cancellation_window_minutes ?? 30} minutes after booking, your held coins are released back. If the astrologer cancels, 100% full refund is issued.`}
                      </p>
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
              ) : activeAppointment ? (
                <div className="space-y-3 pt-2">
                  <Alert tone="warning">
                    <CalendarCheck className="mr-1.5 inline size-4" />
                    {language === "bn"
                      ? "আপনার একটি সক্রিয় অ্যাপয়েন্টমেন্ট ইতোমধ্যে রয়েছে। নতুন বুকিং করার আগে পূর্বের সেশনটি সমাপ্ত করুন।"
                      : "You already have an active appointment. Astra policy permits only 1 active booking at a time."}
                  </Alert>
                  <Link href="/account/appointments" className="block w-full">
                    <Button size="lg" variant="secondary" className="w-full text-xs font-bold">
                      {language === "bn" ? "আমার অ্যাপয়েন্টমেন্ট দেখুন" : "View My Appointments"}
                    </Button>
                  </Link>
                </div>
              ) : quote && !quote.can_afford ? (
                <div className="space-y-3 pt-2">
                  <Alert tone="warning">
                    <Wallet className="mr-1.5 inline size-4" />
                    {language === "bn"
                      ? `আপনার খরচযোগ্য ব্যালেন্স আছে ${quote.available_coins ?? quote.balance_coins} কয়েন। এই অ্যাপয়েন্টমেন্টের মোট ফি ${quote.total_coins || Math.round(quote.price_paise / 100)} কয়েন (আমানত + সেশন ব্যালেন্স)। বুক করতে পর্যাপ্ত ব্যালেন্স প্রয়োজন।`
                      : `You have ${quote.available_coins ?? quote.balance_coins} spendable coins. You need ${quote.total_coins || Math.round(quote.price_paise / 100)} total coins (deposit + session escrow hold) to confirm this slot.`}
                  </Alert>
                  <Link href="/account/wallet" className="block w-full">
                    <Button size="lg" variant="secondary" className="w-full text-xs font-bold">
                      {language === "bn" ? "ওয়ালেটে কয়েন রিচার্জ করুন" : "Add coins to wallet"}
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
                    Deposit is debited immediately and session balance is held safely in escrow.
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

    const matchingTatkalWindow = dayView?.windows?.find((w: any) => {
      if (!w.is_tatkal) return false;
      const ws = new Date(w.starts_at).getTime();
      const we = new Date(w.ends_at).getTime();
      const st = slot.getTime();
      const en = st + minutes * 60_000;
      return ws <= st && en <= we;
    });
    const isTatkal = Boolean(matchingTatkalWindow);
    const tatkalMultiplier = matchingTatkalWindow?.tatkal_multiplier ?? 1.5;
    const slotPrice = matchingTatkalWindow?.tatkal_fixed_paise ?? Math.round(computedPricePaise * (isTatkal ? tatkalMultiplier : 1));

    return (
      <button
        key={slot.toISOString()}
        type="button"
        onClick={() => setSelectedSlot(slot)}
        className={cn(
          "relative flex flex-col items-center justify-between rounded-2xl p-3.5 transition-all text-center border shadow-2xs cursor-pointer group select-none",
          isSelected
            ? "bg-gradient-to-b from-[#EA580C] via-[#D97706] to-[#B45309] text-white border-[#B45309] shadow-[0_8px_20px_rgba(217,119,6,0.35)] ring-4 ring-amber-500/25 scale-[1.04]"
            : isTatkal
            ? "bg-gradient-to-b from-amber-50/80 via-yellow-50/50 to-white hover:bg-amber-100/60 border-amber-400 hover:border-amber-500 text-amber-950 shadow-[0_4px_12px_rgba(217,119,6,0.15)] ring-1 ring-amber-400/30 hover:scale-[1.02] hover:-translate-y-0.5"
            : isAuspicious
            ? "bg-white hover:bg-amber-50/70 border-amber-300 hover:border-amber-500 text-slate-900 hover:scale-[1.02] hover:-translate-y-0.5"
            : isRahuKaal
            ? "bg-slate-50/70 hover:bg-rose-50/50 border-slate-200 hover:border-rose-300 text-slate-700 hover:scale-[1.01]"
            : "bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-900 hover:scale-[1.02] hover:-translate-y-0.5",
        )}
      >
        {isTatkal && (
          <span className="absolute -top-2.5 inset-x-2 flex items-center justify-center gap-1 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 px-2 py-0.5 text-[9px] font-black uppercase text-white shadow-xs tracking-wider">
            <Zap className="size-2.5 fill-white" />
            <span>VIP Tatkal</span>
          </span>
        )}

        <span className="text-sm font-extrabold tabular-nums tracking-tight">
          {clock(slot)}
        </span>

        <span
          className={cn(
            "mt-1.5 rounded-full px-2 py-0.5 text-[9.5px] font-bold leading-none uppercase tracking-wider flex items-center gap-1 transition-colors",
            isSelected
              ? "bg-white/20 text-white"
              : isTatkal
              ? "bg-amber-200/80 text-amber-950 font-black"
              : isAuspicious
              ? "bg-amber-100 text-amber-950 border border-amber-300/60"
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
            isSelected
              ? "text-amber-100"
              : isTatkal
              ? "text-amber-900 font-black"
              : "text-amber-700",
          )}
        >
          ₹{rupees(slotPrice)}
        </span>

        {isSelected && (
          <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-white text-amber-900 shadow-md">
            <Check className="size-3 stroke-[3]" />
          </span>
        )}
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
