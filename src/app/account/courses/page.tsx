"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  GraduationCap,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Button, Card, CardBody, EmptyState, LoadingBlock } from "@/components/ui";
import { courseApi } from "@/lib/api";
import type { CourseEnrollment } from "@/types";

export default function MyCoursesPage() {
  const {
    data: enrollments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-enrolled-courses"],
    queryFn: () => courseApi.getMyEnrolledCourses(),
  });

  if (isLoading) {
    return (
      <div className="py-16">
        <LoadingBlock label="Loading your enrolled courses…" />
      </div>
    );
  }

  const completedCount = enrollments?.filter((e) => e.progress_percent >= 100).length ?? 0;
  const inProgressCount = (enrollments?.length ?? 0) - completedCount;

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            My Gurukul Courses
          </h1>
          <p className="text-xs text-muted-foreground">
            Track your study progress, watch recorded sessions, and earn sacred certificates.
          </p>
        </div>

        {enrollments && enrollments.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-border bg-surface px-3 py-1.5 text-center shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                In Progress
              </span>
              <p className="text-sm font-bold text-brand-600">{inProgressCount}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface px-3 py-1.5 text-center shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Completed
              </span>
              <p className="text-sm font-bold text-emerald-600">{completedCount}</p>
            </div>
          </div>
        )}
      </div>

      {/* Courses List */}
      {!enrollments || enrollments.length === 0 ? (
        <Card>
          <CardBody className="py-14">
            <EmptyState
              icon={GraduationCap}
              title="No Masterclasses Enrolled Yet"
              description="Begin your spiritual study journey in Vedic Astrology, Tarot, and Vastu sciences."
              action={
                <Link href="/courses">
                  <Button>Explore Gurukul Catalog</Button>
                </Link>
              }
            />
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {enrollments.map((item: CourseEnrollment) => (
            <EnrolledCourseCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function EnrolledCourseCard({ item }: { item: CourseEnrollment }) {
  const [thumbError, setThumbError] = React.useState(false);
  const isCompleted = item.progress_percent >= 100;
  const progress = Math.min(100, Math.round(item.progress_percent));

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-soft transition-all hover:border-brand-500/40">
      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-12 sm:items-center">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-surface-muted sm:col-span-4">
          {item.thumbnail_url && !thumbError ? (
            <Image
              src={item.thumbnail_url}
              alt={item.course_title || "Course"}
              fill
              className="object-cover"
              onError={() => setThumbError(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-amber-950/80 via-neutral-900 to-amber-950/40 text-amber-500 p-3 text-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-1">
                <span className="text-xl">☸</span>
              </div>
              <span className="text-[10px] font-serif font-bold uppercase tracking-wider text-amber-300/90">DivinLink Gurukul</span>
            </div>
          )}
          {isCompleted && (
            <div className="absolute right-2 top-2 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
              COMPLETED
            </div>
          )}
        </div>

        {/* Metadata & Progress */}
        <div className="sm:col-span-8 flex flex-col justify-between h-full space-y-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="size-3.5" />
              <span>Enrolled on {new Date(item.enrolled_at).toLocaleDateString()}</span>
              {item.instructor_name && (
                <>
                  <span>•</span>
                  <span className="font-medium text-foreground">
                    {item.instructor_name}
                  </span>
                </>
              )}
            </div>

            <h3 className="mt-1 font-serif text-base font-bold text-foreground sm:text-lg">
              {item.course_title || "Sacred Masterclass"}
            </h3>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">
                {isCompleted ? "All lessons completed" : "Course Progress"}
              </span>
              <span className="font-bold text-foreground">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className={`h-full transition-all duration-500 ${
                  isCompleted ? "bg-emerald-500" : "bg-brand-600"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/courses/${item.course_slug || item.course_id}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-soft transition-colors hover:bg-brand-700"
            >
              <PlayCircle className="size-4" />
              <span>{isCompleted ? "Review Masterclass" : "Continue Learning"}</span>
            </Link>

            {isCompleted && (
              <Link
                href={
                  item.certificate_url ||
                  (item.certificate_id
                    ? `/verify/certificate/${item.certificate_id}`
                    : `/courses/${item.course_slug || item.course_id}`)
                }
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 px-3.5 py-2 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:from-amber-500/20 hover:to-yellow-500/20 shadow-xs transition-all"
              >
                <Award className="size-4 text-amber-600 dark:text-amber-400" />
                <span>View Gurukul Certificate</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

