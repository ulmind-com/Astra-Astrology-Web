"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Award,
  BookOpen,
  Clock,
  Filter,
  GraduationCap,
  PlayCircle,
  Search,
  Sparkles,
  Star,
  Users,
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

export default function CoursesPage() {
  const { isSignedIn } = useAuth();
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [selectedLevel, setSelectedLevel] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: courses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["courses", selectedCategory, selectedLevel, debouncedSearch],
    queryFn: () =>
      courseApi.getCourses({
        category: selectedCategory === "all" ? undefined : selectedCategory,
        level: selectedLevel === "all" ? undefined : selectedLevel,
        search: debouncedSearch.trim() || undefined,
        limit: 50,
      }),
  });

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-brand-500/20">
      <SiteHeader />

      <main className="flex-1 pb-20">
        {/* Sacred Hero Banner */}
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-brand-950/20 via-surface to-background px-4 py-12 sm:px-6 sm:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(217,119,6,0.15),rgba(255,255,255,0))]" />
          
          <div className="relative mx-auto max-w-6xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold-dark shadow-soft">
              <Sparkles className="size-3.5 text-gold" />
              <span>Astra Vedic Gurukul</span>
            </div>

            <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              Sacred Occult Wisdom, <span className="text-brand-600">Modern Mastery</span>
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Learn authentic Vedic Jyotish, Tarot Reading, Numerology, and Vastu directly
              from revered astrologers and masters. Comprehensive curriculum, practical chart reading, and certified degrees.
            </p>

            {isSignedIn && (
              <div className="mt-6 flex justify-center">
                <Link
                  href="/account/courses"
                  className="inline-flex items-center gap-2 rounded-xl border border-brand-500/40 bg-brand-500/10 px-4 py-2 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-500/20"
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
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search masterclasses, topics, or gurus…"
                className="w-full rounded-xl border border-border bg-surface px-10 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            {/* Level Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedLevel === lvl.id
                      ? "bg-foreground text-background shadow-sm"
                      : "bg-surface-muted text-muted-foreground hover:bg-surface-muted/80 hover:text-foreground"
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border/60">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? "bg-brand-600 text-white shadow-soft"
                      : "bg-surface text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Course Grid */}
          <div className="mt-8">
            {isLoading ? (
              <div className="py-20">
                <LoadingBlock label="Loading sacred masterclasses…" />
              </div>
            ) : isError ? (
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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

  return (
    <Reveal>
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-elevation">
        {/* Thumbnail with 16:9 Aspect Ratio */}
        <Link href={`/courses/${course.slug}`} className="relative aspect-video w-full overflow-hidden bg-surface-muted block">
          {course.thumbnail_url ? (
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-brand-950/20 text-brand-500">
              <GraduationCap className="size-12 opacity-40" />
            </div>
          )}

          {/* Free or Discount Badge */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            {isFree ? (
              <span className="rounded-md bg-emerald-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
                FREE
              </span>
            ) : course.discount_percent > 0 ? (
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
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="size-3.5 fill-amber-500" />
              <span>{course.average_rating > 0 ? course.average_rating.toFixed(1) : "4.9"}</span>
              <span className="text-muted-foreground font-normal">
                ({course.rating_count > 0 ? course.rating_count : "120+"})
              </span>
            </div>
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
            {course.instructor_avatar ? (
              <Image
                src={course.instructor_avatar}
                alt={course.instructor_name}
                width={28}
                height={28}
                className="rounded-full object-cover ring-1 ring-border"
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

          {/* Price & Action Button */}
          <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
            <div>
              {isFree ? (
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-soft transition-all hover:bg-brand-700"
            >
              <span>Explore</span>
              <PlayCircle className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

