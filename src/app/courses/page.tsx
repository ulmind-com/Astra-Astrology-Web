"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Filter,
  GraduationCap,
  PlayCircle,
  Search,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge, Button, EmptyState, LoadingBlock, Reveal } from "@/components/ui";
import { courseApi } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import type { CourseListItem } from "@/types";

const CATEGORIES = [
  { id: "all", label: "All Masterclasses" },
  { id: "vedic_astrology", label: "Vedic Astrology" },
  { id: "numerology", label: "Numerology" },
  { id: "tarot", label: "Tarot Mastery" },
  { id: "vastu", label: "Vastu Shastra" },
  { id: "palmistry", label: "Palmistry" },
  { id: "kp_astrology", label: "KP Astrology" },
];

const LEVELS = [
  { id: "all", label: "All Levels" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "mastery", label: "Mastery" },
];

const INITIAL_GURUKUL_COURSES: CourseListItem[] = [
  {
    id: "6b02f5f19fcbb771ba60c40b",
    title: "সম্পূর্ণ বৈদিক জ্যোতিষ ও কুণ্ডলী বিচার মাস্টারক্লাস",
    slug: "complete-vedic-astrology-masterclass",
    subtitle: "লগ্ন, ১২টি ভাব, গ্রহের কারকত্ব এবং দশা-অন্তর্দশার নিখুঁত বিচার পদ্ধতি",
    category: "vedic_astrology",
    level: "all_levels",
    language: "bn",
    instructor_name: "পণ্ডিত আচার্য রাহুল শর্মা",
    instructor_title: "প্রধান বৈদিক জ্যোতিষাচার্য ও স্বর্ণপদকপ্রাপ্ত গবেষক",
    instructor_avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=300&auto=format&fit=crop",
    thumbnail_url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop",
    price: 999,
    mrp: 2999,
    discount_percent: 67,
    currency: "INR",
    duration_hours: 12.5,
    total_lessons: 18,
    total_students: 248,
    average_rating: 4.9,
    rating_count: 89,
    is_featured: true,
    certificate_enabled: true,
    is_enrolled: false,
    user_progress_percent: 0,
  },
  {
    id: "6b02f5f29fcbb771ba60c413",
    title: "রাইডার ওয়েট ট্যারো রিডিং ও ভবিষ্যৎ সংকেত পাঠ",
    slug: "rider-waite-tarot-reading-mastery",
    subtitle: "৭৮টি কার্ডের আধ্যাত্মিক অর্থ, স্প্রেড পদ্ধতি ও সাইকিক রিডিং কলা",
    category: "tarot",
    level: "beginner",
    language: "bn",
    instructor_name: "অদিত্যা রায় (ট্যারো বিশারদ)",
    instructor_title: "আন্তর্জাতিক সার্টিফায়েড ট্যারো রিডার ও সাইকিক কোচ",
    instructor_avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
    thumbnail_url: "https://images.unsplash.com/photo-1633493752763-71a25a9adfc5?q=80&w=800&auto=format&fit=crop",
    price: 1299,
    mrp: 3499,
    discount_percent: 63,
    currency: "INR",
    duration_hours: 9,
    total_lessons: 14,
    total_students: 182,
    average_rating: 4.8,
    rating_count: 64,
    is_featured: true,
    certificate_enabled: true,
    is_enrolled: false,
    user_progress_percent: 0,
  },
  {
    id: "6b02f5f39fcbb771ba60c41b",
    title: "মহাবাস্তু ও বৈদিক দিকশোধন বিজ্ঞান",
    slug: "mahavastu-and-vedic-space-energy-science",
    subtitle: "ভাঙচুর ছাড়াই ১৬টি জোনের ভারসাম্য রক্ষা ও ধন-সমৃদ্ধি বৃদ্ধি",
    category: "vastu",
    level: "all_levels",
    language: "bn",
    instructor_name: "বাস্তুাচার্য সমীরণ রায়",
    instructor_title: "সার্টিফায়েড মহাবাস্তু এক্সপার্ট ও ইনটেরিয়র কনসালট্যান্ট",
    instructor_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    thumbnail_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    price: 1499,
    mrp: 3999,
    discount_percent: 63,
    currency: "INR",
    duration_hours: 10,
    total_lessons: 15,
    total_students: 164,
    average_rating: 4.9,
    rating_count: 51,
    is_featured: true,
    certificate_enabled: true,
    is_enrolled: false,
    user_progress_percent: 0,
  },
  {
    id: "6b02f5f49fcbb771ba60c423",
    title: "কেপি জ্যোতিষ (KP Astrology) ও সাব-লর্ড গণনা",
    slug: "kp-astrology-sub-lord-prediction-mastery",
    subtitle: "কৃষ্ণমূর্তি পদ্ধতির গাণিতিক নির্ভুলতা ও সুনির্দিষ্ট সময়ের ফল বিচার",
    category: "kp_astrology",
    level: "mastery",
    language: "bn",
    instructor_name: "ড. সুরেশ বন্দ্যোপাধ্যায়",
    instructor_title: "কেপি জ্যোতিষ গবেষক ও সিনিয়র গাণিতিক বিশ্লেষক",
    instructor_avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop",
    thumbnail_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    price: 1999,
    mrp: 4999,
    discount_percent: 60,
    currency: "INR",
    duration_hours: 14,
    total_lessons: 20,
    total_students: 118,
    average_rating: 5.0,
    rating_count: 42,
    is_featured: true,
    certificate_enabled: true,
    is_enrolled: false,
    user_progress_percent: 0,
  },
  {
    id: "6b02f5f29fcbb771ba60c417",
    title: "কালডিয়ান ও পাইথাগোরিয়ান সংখ্যাতত্ত্ব (Numerology)",
    slug: "chaldean-pythagorean-numerology-secrets",
    subtitle: "মূলাঙ্ক, ভাগ্যাঙ্ক, নামের বানান সংশোধন ও লকি নম্বর নির্বাচন",
    category: "numerology",
    level: "intermediate",
    language: "bn",
    instructor_name: "ড. দেবব্রত মুখোপাধ্যায়",
    instructor_title: "সংখ্যাতত্ত্ববিদ ও বাস্তু পরামর্শদাতা",
    instructor_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    thumbnail_url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop",
    price: 799,
    mrp: 2499,
    discount_percent: 68,
    currency: "INR",
    duration_hours: 8,
    total_lessons: 12,
    total_students: 195,
    average_rating: 4.9,
    rating_count: 72,
    is_featured: false,
    certificate_enabled: true,
    is_enrolled: false,
    user_progress_percent: 0,
  },
  {
    id: "6b02f5f49fcbb771ba60c41f",
    title: "সামুদ্রিক শাস্ত্র ও হস্তরেখা বিচার বিজ্ঞান (Palmistry)",
    slug: "samudrika-shastra-hand-reading-secrets",
    subtitle: "হাতের রেখা, পর্বত, চিহ্ন এবং আয়ু-ক্যারিয়ার-বিবাহের নিখুঁত সংকেত",
    category: "palmistry",
    level: "beginner",
    language: "bn",
    instructor_name: "পণ্ডিত নারায়ণ চক্রবর্তী",
    instructor_title: "সামুদ্রিক শাস্ত্রবিদ ও হস্তরেখা বিশেষজ্ঞ",
    instructor_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop",
    thumbnail_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    price: 899,
    mrp: 2799,
    discount_percent: 68,
    currency: "INR",
    duration_hours: 7.5,
    total_lessons: 11,
    total_students: 142,
    average_rating: 4.8,
    rating_count: 48,
    is_featured: false,
    certificate_enabled: true,
    is_enrolled: false,
    user_progress_percent: 0,
  },
];

export default function CoursesPage() {
  const { isSignedIn } = useAuth();
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [selectedLevel, setSelectedLevel] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const isDefaultQuery =
    selectedCategory === "all" && selectedLevel === "all" && !debouncedSearch.trim();

  // If user is signed in, fetch enrolled courses in parallel to overlay enrollment status
  const { data: myEnrolledList } = useQuery({
    queryKey: ["myEnrolledCourses"],
    queryFn: () => courseApi.getMyEnrolledCourses(),
    enabled: isSignedIn,
    staleTime: 5 * 60 * 1000,
  });

  const enrolledCourseIds = React.useMemo(() => {
    if (!myEnrolledList || !Array.isArray(myEnrolledList)) return new Set<string>();
    return new Set(myEnrolledList.map((e) => String(e.course_id)));
  }, [myEnrolledList]);

  const {
    data: fetchedCourses = (isDefaultQuery ? INITIAL_GURUKUL_COURSES : undefined),
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["courses", selectedCategory, selectedLevel, debouncedSearch],
    queryFn: async () => {
      const res = await courseApi.getCourses({
        category: selectedCategory === "all" ? undefined : selectedCategory,
        level: selectedLevel === "all" ? undefined : selectedLevel,
        search: debouncedSearch.trim() || undefined,
        limit: 50,
      });
      if (Array.isArray(res) && res.length > 0) return res;
      return isDefaultQuery ? INITIAL_GURUKUL_COURSES : (res || []);
    },
    initialData: isDefaultQuery ? INITIAL_GURUKUL_COURSES : undefined,
    placeholderData: (previous) => previous,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  // Dynamically overlay enrolled state
  const courses = React.useMemo(() => {
    if (!fetchedCourses) return [];
    if (enrolledCourseIds.size === 0) return fetchedCourses;
    return fetchedCourses.map((c) => ({
      ...c,
      is_enrolled: c.is_enrolled || enrolledCourseIds.has(String(c.id)),
    }));
  }, [fetchedCourses, enrolledCourseIds]);

  return (
    <div className="flex min-h-screen flex-col bg-[#fafaf9]/70 text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      <SiteHeader />

      <main className="flex-1 pb-20">
        {/* Sacred Hero Banner */}
        <section className="relative overflow-hidden border-b border-amber-200/60 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 px-4 py-10 sm:px-6 sm:py-14">
          {/* Faint rotating zodiac wheel in background */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/zodiac-wheel-gold.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 size-[280px] sm:size-[360px] select-none opacity-[0.14] mix-blend-multiply animate-spin [animation-duration:120s] motion-reduce:animate-none"
          />
          
          <div className="relative mx-auto max-w-6xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-900 shadow-2xs">
              <Sparkles className="size-3.5 text-amber-600" />
              <span>DivinLink Gurukul</span>
            </div>

            <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-5xl">
              Sacred Occult Wisdom, <span className="text-amber-800">Modern Mastery</span>
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-base text-stone-600 sm:text-lg">
              Learn authentic Vedic Jyotish, Tarot Reading, Numerology, and Vastu directly
              from revered astrologers and masters. Comprehensive curriculum, practical chart reading, and certified degrees.
            </p>

            {isSignedIn && (
              <div className="mt-6 flex justify-center">
                <Link
                  href="/account/courses"
                  className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-[#fcd404] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-[#1c1304] transition-all hover:bg-[#e6be00] shadow-sm"
                >
                  <GraduationCap className="size-4" />
                  <span>Go to My Enrolled Courses &rarr;</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Filter and Catalog Section */}
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          {/* Search & Level Filter Row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search masterclasses, topics, or gurus…"
                className="w-full rounded-2xl border border-stone-200 bg-white pl-10 pr-10 py-2.5 text-xs sm:text-sm text-stone-900 shadow-xs placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setDebouncedSearch("");
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Level Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    selectedLevel === lvl.id
                      ? "bg-[#fcd404] text-[#1c1304] border border-[#d9af00] shadow-2xs"
                      : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200/80">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-[#fcd404] text-[#1c1304] border border-[#d9af00] shadow-xs"
                      : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Course Grid */}
          <div className="mt-8 relative min-h-[300px]">
            {isFetching && !isLoading && (
              <div className="absolute -top-5 right-0 flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60 animate-pulse">
                <span className="size-1.5 rounded-full bg-amber-500 animate-ping" />
                <span>Syncing live masterclasses…</span>
              </div>
            )}
            {isLoading && (!courses || courses.length === 0) ? (
              <div className="py-20">
                <LoadingBlock label="Loading sacred masterclasses…" />
              </div>
            ) : isError && (!courses || courses.length === 0) ? (
              <div className="py-12 text-center text-danger">
                Failed to load courses. Please try again later.
              </div>
            ) : !courses || courses.length === 0 ? (
              <div className="py-16">
                <EmptyState
                  icon={GraduationCap}
                  title="No Masterclasses Found"
                  description="We couldn't find any courses matching your criteria. Try resetting filters or search keywords."
                  action={
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedCategory("all");
                        setSelectedLevel("all");
                        setSearch("");
                      }}
                    >
                      Reset All Filters
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200 ${isFetching && !isLoading ? "opacity-90" : "opacity-100"}`}>
                {courses.map((course: CourseListItem) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function CourseCard({ course }: { course: CourseListItem }) {
  const isFree = course.price === 0;
  const [avatarError, setAvatarError] = React.useState(false);
  const [thumbError, setThumbError] = React.useState(false);

  return (
    <Reveal>
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-elevation">
        {/* Thumbnail with 16:9 Aspect Ratio */}
        <Link href={`/courses/${course.slug}`} className="relative aspect-video w-full overflow-hidden bg-surface-muted block">
          {course.thumbnail_url && !thumbError ? (
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setThumbError(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-neutral-950 via-amber-950/60 to-neutral-950 text-amber-500 p-4 text-center border-b border-amber-500/20">
              <div className="flex size-14 items-center justify-center rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 mb-2 shadow-inner">
                <span className="text-2xl drop-shadow-md">☸</span>
              </div>
              <span className="text-[11px] font-serif font-bold uppercase tracking-[2px] text-amber-300 drop-shadow-sm">DivinLink Gurukul</span>
              <span className="text-[10px] text-amber-200/80 line-clamp-1 mt-0.5">{course.title}</span>
            </div>
          )}

          {/* Enrolled, Free, or Discount Badge */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5 flex-wrap">
            {course.is_enrolled && (
              <span className="flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm ring-1 ring-emerald-400/40">
                <CheckCircle2 className="size-3" />
                ENROLLED
              </span>
            )}
            {!course.is_enrolled && isFree ? (
              <span className="rounded-md bg-emerald-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
                FREE
              </span>
            ) : !course.is_enrolled && course.discount_percent > 0 ? (
              <span className="rounded-md bg-amber-500 px-2 py-0.5 text-xs font-bold text-ink-900 shadow-sm">
                {course.discount_percent}% OFF
              </span>
            ) : null}
            {course.is_featured && (
              <span className="rounded-md bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
                Featured
              </span>
            )}
          </div>

          <div className="absolute right-3 top-3">
            <span className="rounded-md bg-black/60 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-white/90 capitalize">
              {course.level}
            </span>
          </div>
        </Link>

        {/* Card Body */}
        <div className="flex flex-1 flex-col p-5">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium uppercase tracking-wider text-brand-600">
              {course.category.replace(/_/g, " ")}
            </span>
            {course.rating_count > 0 ? (
              <div className="flex items-center gap-1 text-amber-500 font-semibold">
                <Star className="size-3.5 fill-amber-500" />
                <span>{course.average_rating.toFixed(1)}</span>
                <span className="text-muted-foreground font-normal">
                  ({course.rating_count})
                </span>
              </div>
            ) : (
              <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
                নতুন কোর্স
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/courses/${course.slug}`}>
            <h3 className="mt-2 line-clamp-2 font-serif text-lg font-bold text-foreground transition-colors group-hover:text-brand-600">
              {course.title}
            </h3>
          </Link>

          {/* Subtitle / Description */}
          {course.subtitle && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {course.subtitle}
            </p>
          )}

          {/* Instructor Row */}
          <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-3">
            {course.instructor_avatar && !avatarError ? (
              <Image
                src={course.instructor_avatar}
                alt={course.instructor_name}
                width={28}
                height={28}
                unoptimized
                className="rounded-full object-cover ring-1 ring-border"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="flex size-7 items-center justify-center rounded-full bg-brand-500/10 text-xs font-bold text-brand-600">
                {course.instructor_name.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">
                {course.instructor_name}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                {course.instructor_title}
              </p>
            </div>
          </div>

          {/* Meta stats */}
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="size-3.5 text-muted-foreground" />
              <span>{course.duration_hours} hrs</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="size-3.5 text-muted-foreground" />
              <span>{course.total_lessons} lessons</span>
            </div>
            {course.certificate_enabled && (
              <div className="flex items-center gap-1 text-emerald-600 font-medium">
                <Award className="size-3.5" />
                <span>Certificate</span>
              </div>
            )}
          </div>

          <div className="flex-1" />

          {/* Price & Action Button (with Enrolled state detection) */}
          <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
            <div>
              {course.is_enrolled ? (
                <div>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="size-3" />
                    {course.user_progress_percent && course.user_progress_percent >= 100
                      ? "Completed (100%)"
                      : `${Math.round(course.user_progress_percent || 0)}% Completed`}
                  </span>
                  <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-emerald-950/20 dark:bg-emerald-500/20">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, Math.max(0, course.user_progress_percent || 0))}%`,
                      }}
                    />
                  </div>
                </div>
              ) : isFree ? (
                <span className="text-lg font-bold text-emerald-600">Free Access</span>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground">
                    ₹{course.price.toLocaleString("en-IN")}
                  </span>
                  {course.mrp > course.price && (
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{course.mrp.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              )}
            </div>

            <Link
              href={`/courses/${course.slug}`}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold shadow-soft transition-all ${
                course.is_enrolled
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 hover:shadow-emerald-900/20"
                  : isFree
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-brand-600 text-white hover:bg-brand-700"
              }`}
            >
              <span>
                {course.is_enrolled
                  ? "Continue Learning"
                  : isFree
                    ? "Enroll Free"
                    : "Enroll Now"}
              </span>
              {course.is_enrolled ? (
                <ArrowRight className="size-3.5" />
              ) : (
                <Sparkles className="size-3.5" />
              )}
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

