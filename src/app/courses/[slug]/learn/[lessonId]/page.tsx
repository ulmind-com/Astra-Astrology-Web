"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  ListVideo,
  Lock,
  Menu,
  PartyPopper,
  PlayCircle,
  Share2,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Alert, Badge, Button, EmptyState, LoadingBlock, Modal } from "@/components/ui";
import { courseApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/providers/auth-provider";
import type { CourseDetail, CourseLesson, CourseSection, LessonStreamData } from "@/types";

export default function LessonClassroomPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isSignedIn } = useAuth();

  const slug = String(params.slug);
  const lessonId = String(params.lessonId);

  const [activeTab, setActiveTab] = React.useState<"notes" | "resources">("notes");
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({});
  const [watermarkPos, setWatermarkPos] = React.useState<{ top: string; left: string }>({
    top: "15%",
    left: "15%",
  });
  const [showCertificateModal, setShowCertificateModal] = React.useState(false);
  const [isUpdatingProgress, setIsUpdatingProgress] = React.useState(false);

  // 1. Fetch Course Detail for curriculum syllabus
  const {
    data: course,
    isLoading: isCourseLoading,
    isError: isCourseError,
  } = useQuery({
    queryKey: ["course-detail", slug],
    queryFn: () => courseApi.getCourseDetail(slug),
    enabled: Boolean(slug),
  });

  // 2. Fetch Lesson Stream with signed token & dynamic watermark
  const {
    data: streamData,
    isLoading: isStreamLoading,
    isError: isStreamError,
    error: streamError,
  } = useQuery({
    queryKey: ["lesson-stream", course?.id, lessonId],
    queryFn: () => {
      if (!course) throw new Error("Course not loaded");
      return courseApi.getLessonStream(course.id, lessonId);
    },
    enabled: Boolean(course?.id && lessonId),
  });

  // Expand all sections initially
  React.useEffect(() => {
    if (course?.sections) {
      const initial: Record<string, boolean> = {};
      course.sections.forEach((s) => {
        initial[s.id] = true;
      });
      setExpandedSections(initial);
    }
  }, [course]);

  // Anti-Piracy Watermark Movement (Subtle floating reposition every 12 seconds)
  React.useEffect(() => {
    const timer = setInterval(() => {
      const randomTop = Math.floor(Math.random() * 65) + 15; // 15% to 80%
      const randomLeft = Math.floor(Math.random() * 65) + 10; // 10% to 75%
      setWatermarkPos({ top: `${randomTop}%`, left: `${randomLeft}%` });
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  // Compute Flattened Lessons for Prev / Next
  const flattenedLessons = React.useMemo(() => {
    if (!course?.sections) return [];
    const list: (CourseLesson & { sectionTitle: string })[] = [];
    course.sections.forEach((sec) => {
      sec.lessons.forEach((les) => {
        list.push({ ...les, sectionTitle: sec.title });
      });
    });
    return list;
  }, [course]);

  const currentIndex = flattenedLessons.findIndex((l) => l.id === lessonId);
  const currentLesson = flattenedLessons[currentIndex];
  const prevLesson = currentIndex > 0 ? flattenedLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < flattenedLessons.length - 1
      ? flattenedLessons[currentIndex + 1]
      : null;

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMarkComplete = async () => {
    if (!course || isUpdatingProgress) return;
    try {
      setIsUpdatingProgress(true);
      const res = await courseApi.updateProgress(course.id, lessonId, {
        watched_seconds: 3600,
        total_seconds: 3600,
        mark_completed: true,
      });

      toast.success("Lesson completed!");
      await queryClient.invalidateQueries({ queryKey: ["course-detail", slug] });

      if (res.certificate_issued) {
        setShowCertificateModal(true);
      } else if (nextLesson) {
        router.push(`/courses/${slug}/learn/${nextLesson.id}`);
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save lesson progress.");
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  if (isCourseLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <LoadingBlock label="Entering Astra Gurukul classroom…" />
      </div>
    );
  }

  if (isCourseError || !course) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-6 text-center">
        <EmptyState
          icon={GraduationCap}
          title="Masterclass Not Found"
          description="Unable to load this course room."
          action={
            <Link href="/courses">
              <Button>Back to Courses</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const overallProgress = Math.round(course.user_progress_percent);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Top Classroom Bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/70 bg-surface px-4 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/courses/${slug}`}
            className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:bg-surface-muted hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            <span className="hidden sm:inline">Course Overview</span>
          </Link>
          <div className="h-4 w-px bg-border/60" />
          <h1 className="truncate font-serif text-sm font-bold text-foreground">
            {course.title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress Indicator */}
          <div className="hidden items-center gap-2 md:flex">
            <span className="text-xs text-muted-foreground font-medium">Progress</span>
            <div className="h-2 w-24 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full bg-brand-600 transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span className="text-xs font-bold text-foreground tabular-nums">
              {overallProgress}%
            </span>
          </div>

          {/* Toggle Sidebar Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-muted"
          >
            <ListVideo className="size-4 text-brand-600" />
            <span className="hidden sm:inline">{sidebarOpen ? "Hide Syllabus" : "View Syllabus"}</span>
          </button>
        </div>
      </header>

      {/* Main Classroom Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Video Player & Study Tabs */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Player Container */}
          <div className="relative aspect-video w-full max-h-[68vh] bg-black">
            {isStreamLoading ? (
              <div className="flex h-full w-full items-center justify-center">
                <LoadingBlock label="Preparing secure video stream…" />
              </div>
            ) : isStreamError || !streamData ? (
              <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-white">
                <Lock className="size-12 text-brand-400 opacity-60 mb-2" />
                <p className="text-base font-semibold">Protected Lesson</p>
                <p className="text-xs text-white/70 max-w-sm mt-1">
                  {streamError instanceof ApiError && streamError.status === 403
                    ? "You need to enroll in this course to access this lesson."
                    : "Unable to load video stream. Please ensure you are enrolled."}
                </p>
                <Link href={`/courses/${slug}`} className="mt-4">
                  <Button size="sm">Enroll Now to Unlock</Button>
                </Link>
              </div>
            ) : (
              <div className="relative h-full w-full overflow-hidden">
                {/* Bunny Stream Secure Iframe Player */}
                <iframe
                  src={streamData.embed_url}
                  loading="eager"
                  className="h-full w-full border-0 select-none"
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                  allowFullScreen
                />

                {/* Dynamic Anti-Piracy Watermark */}
                {streamData.watermark_text && (
                  <div
                    className="pointer-events-none absolute select-none text-[11px] font-mono font-bold tracking-wider text-white/35 backdrop-blur-[0.5px] transition-all duration-1000"
                    style={{
                      top: watermarkPos.top,
                      left: watermarkPos.left,
                      textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                    }}
                  >
                    {streamData.watermark_text}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lesson Navigation & Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 bg-surface px-6 py-3.5">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                {currentLesson?.sectionTitle || "Module Lesson"}
              </p>
              <h2 className="font-serif text-lg font-bold text-foreground">
                {currentLesson?.title || "Lesson"}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {prevLesson && (
                <Link
                  href={`/courses/${slug}/learn/${prevLesson.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-muted"
                >
                  <ChevronLeft className="size-4" />
                  <span>Previous</span>
                </Link>
              )}

              <Button
                size="sm"
                className="gap-1.5 shadow-soft"
                onClick={handleMarkComplete}
                disabled={isUpdatingProgress}
              >
                <CheckCircle2 className="size-4" />
                <span>{currentLesson?.is_completed ? "Completed (Next)" : "Mark Complete & Next"}</span>
              </Button>

              {nextLesson && (
                <Link
                  href={`/courses/${slug}/learn/${nextLesson.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-muted"
                >
                  <span>Next</span>
                  <ChevronRight className="size-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Tabs: Notes & Resources */}
          <div className="flex-1 p-6">
            <div className="flex items-center gap-4 border-b border-border/60 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab("notes")}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-colors ${
                  activeTab === "notes"
                    ? "border-b-2 border-brand-600 text-brand-600"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="size-4" />
                <span>Lesson Notes</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("resources")}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-colors ${
                  activeTab === "resources"
                    ? "border-b-2 border-brand-600 text-brand-600"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Download className="size-4" />
                <span>Study Resources ({streamData?.resources?.length ?? 0})</span>
              </button>
            </div>

            <div className="mt-5">
              {activeTab === "notes" ? (
                <div>
                  {streamData?.notes_markdown ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line text-muted-foreground leading-relaxed">
                      {streamData.notes_markdown}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      No custom study notes posted for this lesson yet. Follow along with the video instruction.
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  {!streamData?.resources || streamData.resources.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">
                      No downloadable resources attached to this lesson.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {streamData.resources.map((res, idx) => (
                        <a
                          key={idx}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-xl border border-border bg-surface p-3.5 transition-colors hover:border-brand-500/40"
                        >
                          <div className="flex items-center gap-2.5">
                            <FileText className="size-4 text-brand-600" />
                            <div>
                              <p className="text-xs font-bold text-foreground">{res.title}</p>
                              <span className="text-[10px] uppercase text-muted-foreground">
                                {res.type}
                              </span>
                            </div>
                          </div>
                          <Download className="size-4 text-muted-foreground" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Curriculum Drawer */}
        {sidebarOpen && (
          <aside className="w-80 shrink-0 border-l border-border/70 bg-surface/50 overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 bg-surface">
              <h3 className="font-serif text-sm font-bold text-foreground">
                Course Curriculum
              </h3>
              <span className="text-xs text-muted-foreground">
                {course.total_lessons} lessons
              </span>
            </div>

            <div className="flex-1 divide-y divide-border/60">
              {course.sections.map((section: CourseSection) => {
                const isExpanded = expandedSections[section.id] !== false;
                return (
                  <div key={section.id}>
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="flex w-full items-center justify-between bg-surface-muted/60 px-4 py-2.5 text-left hover:bg-surface-muted"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <ChevronDown
                          className={`size-3.5 text-muted-foreground shrink-0 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                        <span className="truncate text-xs font-bold text-foreground">
                          {section.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {section.lessons.length}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="divide-y divide-border/40">
                        {section.lessons.map((lesson: CourseLesson) => {
                          const isCurrent = lesson.id === lessonId;
                          return (
                            <Link
                              key={lesson.id}
                              href={`/courses/${slug}/learn/${lesson.id}`}
                              className={`flex items-start gap-3 px-4 py-3 text-xs transition-colors ${
                                isCurrent
                                  ? "bg-brand-500/10 border-l-2 border-brand-600 text-brand-600 font-semibold"
                                  : "hover:bg-surface-muted text-foreground"
                              }`}
                            >
                              <div className="mt-0.5 shrink-0">
                                {lesson.is_completed ? (
                                  <CheckCircle2 className="size-4 text-emerald-600" />
                                ) : isCurrent ? (
                                  <PlayCircle className="size-4 text-brand-600 animate-pulse" />
                                ) : (
                                  <Circle className="size-3.5 text-muted-foreground/60" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="line-clamp-2 leading-snug">{lesson.title}</p>
                                {lesson.duration_minutes > 0 && (
                                  <span className="text-[10px] text-muted-foreground mt-0.5 block">
                                    {lesson.duration_minutes} min
                                  </span>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        )}
      </div>

      {/* Graduation Certificate Congratulatory Modal */}
      {showCertificateModal && (
        <Modal
          open={showCertificateModal}
          onClose={() => setShowCertificateModal(false)}
          title="Congratulations, Vedic Scholar!"
        >
          <div className="space-y-4 py-3 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-8 ring-emerald-500/5">
              <Award className="size-8" />
            </div>

            <h3 className="font-serif text-xl font-bold text-foreground">
              You Have Mastered the Entire Course!
            </h3>

            <p className="text-xs text-muted-foreground">
              You have completed 100% of the lessons in{" "}
              <span className="font-semibold text-foreground">{course.title}</span>. Your official
              degree certificate has been issued.
            </p>

            <div className="flex justify-center gap-3 pt-3">
              <Button
                variant="outline"
                onClick={() => setShowCertificateModal(false)}
              >
                Close
              </Button>
              <Link href="/account/courses">
                <Button className="gap-2">
                  <Award className="size-4" />
                  <span>View in My Certificates</span>
                </Button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
