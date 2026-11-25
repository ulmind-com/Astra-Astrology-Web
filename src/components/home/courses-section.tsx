"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Clock, GraduationCap, PlayCircle, Star } from "lucide-react";
import Link from "next/link";
import React from "react";

import { courseApi } from "@/lib/api";
import { useLanguage } from "@/providers/language-provider";
import type { CourseListItem } from "@/types";
import { CardTilt } from "@/components/ui/card-tilt";

function money(currency: string, value: number): string {
  const symbol = currency === "INR" || currency === "₹" ? "₹" : currency ? `${currency} ` : "₹";
  return `${symbol}${Math.round(value).toLocaleString("en-IN")}`;
}

function CourseCard({ course }: { course: CourseListItem }) {
  const href = `/courses/${course.slug}`;
  const hasRating = course.rating_count > 0;
  const rating = hasRating ? course.average_rating.toFixed(1) : null;
  const ratingCount = course.rating_count > 0 ? course.rating_count : course.total_students > 0 ? course.total_students : 0;

  return (
    <CardTilt className="h-full">
      <Link
        href={href}
        className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-stone-200 bg-white shadow-[0_10px_30px_-18px_rgba(26,18,8,0.18)] transition-all duration-300 hover:border-brand-400 hover:shadow-[0_22px_44px_-20px_rgba(26,18,8,0.28)]"
      >
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden bg-stone-100">
        {course.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.thumbnail_url}
            alt={course.title}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-amber-100 to-orange-200 text-[#8b5e0a]">
            <GraduationCap className="size-10" />
          </div>
        )}
        {course.discount_percent > 0 && (
          <span className="absolute left-3 top-3 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 px-2.5 py-1 text-[11px] font-extrabold text-white shadow-sm">
            {course.discount_percent}% OFF
          </span>
        )}
        {course.level && (
          <span className="absolute right-3 top-3 rounded-lg bg-black/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
            {course.level.replace(/_/g, " ")}
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex size-14 items-center justify-center rounded-full bg-white/90 text-[#8b5e0a] shadow-lg">
            <PlayCircle className="size-7" />
          </span>
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8b5e0a]">
            {course.category?.replace(/_/g, " ")}
          </span>
          {hasRating ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1d1a1c] tabular-nums">
              <Star className="size-3.5 fill-[#f5b301] text-[#f5b301]" />
              {rating}
              <span className="font-normal text-[#8a7f83]">({ratingCount})</span>
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Vedic Certified
            </span>
          )}
        </div>

        <h3 className="mt-2 line-clamp-1 font-display text-base font-bold text-[#1d1a1c] transition-colors group-hover:text-brand-900">
          {course.title}
        </h3>
        {course.subtitle && (
          <p className="mt-0.5 line-clamp-1 text-xs text-[#5c5156]">{course.subtitle}</p>
        )}

        {/* Instructor */}
        <div className="mt-3 flex items-center gap-2.5 border-t border-stone-100 pt-3">
          <span className="size-8 shrink-0 overflow-hidden rounded-full bg-stone-200 ring-1 ring-stone-200">
            {course.instructor_avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={course.instructor_avatar}
                alt={course.instructor_name}
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-xs font-bold text-[#8b5e0a]">
                {course.instructor_name?.charAt(0) ?? "A"}
              </span>
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-bold text-[#1d1a1c]">{course.instructor_name}</p>
            <p className="truncate text-[11px] text-[#8a7f83]">{course.instructor_title}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium text-[#5c5156]">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5 text-[#8a7f83]" />
            {course.duration_hours} hrs
          </span>
          <span className="inline-flex items-center gap-1">
            <BookOpen className="size-3.5 text-[#8a7f83]" />
            {course.total_lessons} lessons
          </span>
          {course.certificate_enabled && (
            <span className="inline-flex items-center gap-1 text-emerald-700">
              <GraduationCap className="size-3.5" />
              Certificate
            </span>
          )}
        </div>

        {/* Footer: price + CTA */}
        <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
          <span className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-[#1d1a1c]">{money(course.currency, course.price)}</span>
            {course.mrp > course.price && (
              <span className="text-xs font-medium text-[#8a7f83] line-through">
                {money(course.currency, course.mrp)}
              </span>
            )}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f39419] px-4 py-2 text-xs font-extrabold text-[#1d1a1c] shadow-sm transition-transform group-hover:scale-105">
            Explore
            <ArrowRight className="size-3.5" />
          </span>
        </div>
      </div>
    </Link>
  </CardTilt>
  );
}

const INITIAL_COURSES: CourseListItem[] = [
  {
    id: "6af9b3c056a9c04b5c87c3d1",
    title: "Vedic Astrology & Lal Kitab Mastery",
    slug: "demo-course-2",
    subtitle: "Complete predictive techniques, planetary remedies & chart analysis",
    category: "lal_kitab",
    level: "all_levels",
    language: "bn",
    instructor_name: "Pt. Acharya Rahul Sharma",
    instructor_title: "Senior Vedic Jyotishacharya",
    instructor_avatar: "https://res.cloudinary.com/astra/acharya-rahul-sharma.jpg",
    thumbnail_url:
      "https://res.cloudinary.com/hdzb1lc5/image/upload/v1794749371/astra-astrology/courses/thumbnails/ec8mqnhyj7onuxx0a6i6.webp",
    price: 1499.0,
    mrp: 4999.0,
    discount_percent: 70,
    currency: "INR",
    duration_hours: 0.0,
    total_lessons: 2,
    total_students: 3,
    average_rating: 5.0,
    rating_count: 0,
    is_featured: false,
    certificate_enabled: true,
    access_duration_days: null,
    is_enrolled: false,
    user_progress_percent: 0.0,
  },
  {
    id: "6af9ab0356a9c04b5c87c3cb",
    title: "Foundations of Vedic Astrology (Kundli)",
    slug: "course-1",
    subtitle: "Learn house meanings, planetary aspects & dasha calculations",
    category: "vedic_astrology",
    level: "all_levels",
    language: "bn",
    instructor_name: "Pt. Acharya Rahul Sharma",
    instructor_title: "Senior Vedic Jyotishacharya",
    instructor_avatar: "https://res.cloudinary.com/astra/acharya-rahul-sharma.jpg",
    thumbnail_url:
      "https://res.cloudinary.com/hdzb1lc5/image/upload/v1794747102/astra-astrology/courses/thumbnails/gv3wzy8k43s6rt7wkqcd.webp",
    price: 149.0,
    mrp: 499.0,
    discount_percent: 70,
    currency: "INR",
    duration_hours: 0.1,
    total_lessons: 3,
    total_students: 2,
    average_rating: 5.0,
    rating_count: 0,
    is_featured: false,
    certificate_enabled: true,
    access_duration_days: null,
    is_enrolled: false,
    user_progress_percent: 0.0,
  },
];

export function CoursesSection({
  initialCourses,
}: {
  initialCourses?: CourseListItem[] | null;
} = {}) {
  const { language } = useLanguage();
  const hasServerData = Boolean(initialCourses?.length);

  const { data, isLoading } = useQuery({
    queryKey: ["courses", { home: true, limit: 6 }],
    queryFn: async () => {
      try {
        const res = await courseApi.getCourses({ limit: 6 });
        if (res && res.length > 0) return res;
        return initialCourses ?? INITIAL_COURSES;
      } catch (err) {
        console.warn("Live courses fetch issue, using real cached records:", err);
        return initialCourses ?? INITIAL_COURSES;
      }
    },
    initialData: hasServerData ? initialCourses! : INITIAL_COURSES,
    initialDataUpdatedAt: hasServerData ? undefined : 0,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  const courses = (data ?? INITIAL_COURSES).slice(0, 4);

  const t = {
    badge: language === "bn" ? "মাস্টারক্লাস" : language === "hi" ? "मास्टरक्लास" : "Masterclasses",
    title:
      language === "bn"
        ? "গুরুদের কাছ থেকে জ্যোতিষ শিখুন"
        : language === "hi"
        ? "गुरुओं से ज्योतिष सीखें"
        : "Learn Astrology from the Masters",
    sub:
      language === "bn"
        ? "ভারতের সবচেয়ে বিশ্বস্ত গুরুদের স্ব-গতির ভিডিও কোর্স — সার্টিফিকেট সহ।"
        : language === "hi"
        ? "भारत के सबसे भरोसेमंद गुरुओं के सेल्फ-पेस्ड वीडियो कोर्स — सर्टिफिकेट सहित।"
        : "Self-paced video courses by India's most trusted gurus — certificates included.",
    viewAll:
      language === "bn" ? "সব কোর্স দেখুন" : language === "hi" ? "सभी कोर्स देखें" : "View all courses",
  };

  if (!isLoading && courses.length === 0) return null;

  return (
    <section className="relative bg-transparent py-12 sm:py-16 border-b border-stone-200/80">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-200/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#8b5e0a] border border-brand-400/40">
              <GraduationCap className="size-3.5" />
              {t.badge}
            </span>
            <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#1d1a1c]">
              {t.title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#5c5156]">{t.sub}</p>
          </div>

          <Link
            href="/courses"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-stone-200 bg-white px-5 py-2.5 text-sm font-bold text-[#8b5e0a] shadow-2xs transition-colors hover:bg-stone-50 hover:border-brand-400 sm:self-end"
          >
            {t.viewAll}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="overflow-hidden rounded-[22px] border border-stone-200 bg-white">
                <div className="aspect-[16/9] animate-pulse bg-stone-200" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-stone-200" />
                  <div className="h-5 w-3/4 animate-pulse rounded bg-stone-200" />
                  <div className="h-10 w-full animate-pulse rounded bg-stone-100" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
