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
  Clock,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  HelpCircle,
  ListVideo,
  Lock,
  Menu,
  MessageSquare,
  MessageSquareQuote,
  PartyPopper,
  PlayCircle,
  Send,
  Share2,
  ShieldCheck,
  ThumbsUp,
  UserCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Alert, Avatar, Badge, Button, EmptyState, LoadingBlock, Modal } from "@/components/ui";
import { courseApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/providers/auth-provider";
import type { CourseDetail, CourseLesson, CourseQuestion, CourseQuestionAnswer, CourseSection, LessonStreamData } from "@/types";

export default function LessonClassroomPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isSignedIn } = useAuth();

  const slug = String(params.slug);
  const lessonId = String(params.lessonId);

  const [activeTab, setActiveTab] = React.useState<"notes" | "resources" | "jigyasa">("notes");
  const [qaSort, setQaSort] = React.useState<"newest" | "timestamp" | "upvotes">("newest");
  const [isAskingQuestion, setIsAskingQuestion] = React.useState(false);
  const [qTitle, setQTitle] = React.useState("");
  const [qContent, setQContent] = React.useState("");
  const [qUseTimestamp, setQUseTimestamp] = React.useState(true);
  const [qMinutes, setQMinutes] = React.useState(0);
  const [qSeconds, setQSeconds] = React.useState(0);
  const [replyingToQId, setReplyingToQId] = React.useState<string | null>(null);
  const [replyContent, setReplyContent] = React.useState("");
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({});
  const [watermarkPos, setWatermarkPos] = React.useState<{ top: string; left: string }>({
    top: "15%",
    left: "15%",
  });
  const [showCertificateModal, setShowCertificateModal] = React.useState(false);
  const [issuedCertId, setIssuedCertId] = React.useState<string | null>(null);
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

  // 3. Fetch Lesson Questions (Gurukul Jigyasa Forum)
  const {
    data: questions = [],
    isLoading: isQuestionsLoading,
    refetch: refetchQuestions,
  } = useQuery({
    queryKey: ["lesson-questions", course?.id, lessonId, qaSort],
    queryFn: () => {
      if (!course?.id) return [];
      return courseApi.getQuestions(course.id, lessonId, { sort: qaSort });
    },
    enabled: Boolean(course?.id && lessonId),
  });

  // Q&A Mutations
  const askQuestionMutation = useMutation({
    mutationFn: async () => {
      if (!course?.id) throw new Error("Course not loaded");
      if (!qTitle.trim()) throw new Error("Please enter a question title");
      if (!qContent.trim()) throw new Error("Please describe your question");

      const totalSecs = qUseTimestamp ? Math.max(0, qMinutes * 60 + qSeconds) : 0;
      return courseApi.askQuestion(course.id, lessonId, {
        title: qTitle.trim(),
        content: qContent.trim(),
        timestamp_seconds: totalSecs,
      });
    },
    onSuccess: () => {
      toast.success("Question posted to Gurukul Jigyasa!");
      setQTitle("");
      setQContent("");
      setIsAskingQuestion(false);
      queryClient.invalidateQueries({ queryKey: ["lesson-questions", course?.id, lessonId] });
    },
    onError: (err: any) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to post question.");
    },
  });

  const upvoteMutation = useMutation({
    mutationFn: async (questionId: string) => courseApi.upvoteQuestion(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-questions", course?.id, lessonId] });
    },
    onError: (err: any) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to upvote.");
    },
  });

  const answerMutation = useMutation({
    mutationFn: async (questionId: string) => {
      if (!replyContent.trim()) throw new Error("Please write a reply before posting");
      return courseApi.answerQuestion(questionId, replyContent.trim());
    },
    onSuccess: () => {
      toast.success("Reply submitted to discussion thread!");
      setReplyContent("");
      setReplyingToQId(null);
      queryClient.invalidateQueries({ queryKey: ["lesson-questions", course?.id, lessonId] });
    },
    onError: (err: any) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to post reply.");
    },
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

  const handleMarkComplete = React.useCallback(async () => {
    if (!course || isUpdatingProgress) return;
    try {
      setIsUpdatingProgress(true);
      const res = await courseApi.updateProgress(course.id, lessonId, {
        watched_seconds: 3600,
        total_seconds: 3600,
        mark_completed: true,
      });

      // Optimistically update React Query cache so progress bar & lesson checkmarks jump immediately
      queryClient.setQueryData(["course-detail", slug], (old: any) => {
        if (!old) return old;
        const newSections = old.sections?.map((sec: any) => ({
          ...sec,
          lessons: sec.lessons?.map((les: any) =>
            les.id === lessonId ? { ...les, is_completed: true } : les
          ),
        }));
        return {
          ...old,
          user_progress_percent: res.progress_percent ?? old.user_progress_percent,
          sections: newSections,
        };
      });

      toast.success("Lesson completed!");
      await queryClient.invalidateQueries({ queryKey: ["course-detail", slug] });

      if (res.certificate_issued) {
        if (res.certificate_id) {
          setIssuedCertId(res.certificate_id);
        }
        setShowCertificateModal(true);
      } else if (nextLesson) {
        router.push(`/courses/${slug}/learn/${nextLesson.id}`);
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save lesson progress.");
    } finally {
      setIsUpdatingProgress(false);
    }
  }, [course, isUpdatingProgress, lessonId, nextLesson, queryClient, router, slug]);

  // Listen for Bunny Stream player 'ended' events to automatically mark lesson complete
  React.useEffect(() => {
    const handleBunnyMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.event === "ended" || data?.type === "ended" || data?.name === "ended") {
          if (currentLesson && !currentLesson.is_completed) {
            handleMarkComplete();
          }
        }
      } catch {
        // Ignore non-JSON postMessages
      }
    };
    window.addEventListener("message", handleBunnyMessage);
    return () => window.removeEventListener("message", handleBunnyMessage);
  }, [currentLesson, handleMarkComplete]);

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

  const totalLessonsCount = flattenedLessons.length;
  const completedLessonsCount = flattenedLessons.filter((l) => l.is_completed).length;
  const computedProgressPercent =
    totalLessonsCount > 0
      ? Math.round((completedLessonsCount / totalLessonsCount) * 100)
      : 0;
  const overallProgress = Math.min(
    100,
    Math.max(Math.round(course.user_progress_percent || 0), computedProgressPercent)
  );

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

              <button
                type="button"
                onClick={() => setActiveTab("jigyasa")}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-colors ${
                  activeTab === "jigyasa"
                    ? "border-b-2 border-brand-600 text-brand-600"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MessageSquareQuote className="size-4" />
                <span>গুরুকুল জিজ্ঞাসা ({questions.length})</span>
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
              ) : activeTab === "resources" ? (
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
              ) : (
                /* GURUKUL JIGYASA (Q&A FORUM) TAB */
                <div className="space-y-6">
                  {/* Top Bar: Title, Sort & Ask Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
                    <div>
                      <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
                        <MessageSquareQuote className="size-5 text-amber-600" />
                        গুরুকুল জিজ্ঞাসা (Lesson Q&A Forum)
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        ভিডিওর নির্দিষ্ট মিনিট/সেকেন্ডে বুঝতে অসুবিধা হলে প্রশ্ন করুন, আচার্য ও জ্যোতিষীরা সরাসরি উত্তর দেবেন।
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {/* Sort Selector */}
                      <select
                        value={qaSort}
                        onChange={(e) => setQaSort(e.target.value as any)}
                        className="rounded-xl border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-foreground outline-none focus:border-brand-500"
                      >
                        <option value="newest">সর্বশেষ প্রশ্ন (Newest)</option>
                        <option value="timestamp">ভিডিও টাইমস্ট্যাম্প অনুযায়ী (By Video Time)</option>
                        <option value="upvotes">জনপ্রিয় প্রশ্ন (Most Upvoted)</option>
                      </select>

                      <Button
                        size="sm"
                        onClick={() => setIsAskingQuestion(!isAskingQuestion)}
                        className="gap-1.5 text-xs shadow-soft"
                      >
                        <HelpCircle className="size-3.5" />
                        <span>{isAskingQuestion ? "বাতিল করুন" : "প্রশ্ন করুন"}</span>
                      </Button>
                    </div>
                  </div>

                  {/* Ask Question Collapsible Card */}
                  {isAskingQuestion && (
                    <div className="rounded-2xl border-2 border-brand-500/30 bg-brand-500/5 p-5 space-y-4 shadow-sm animate-in fade-in-50 duration-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                          <HelpCircle className="size-4 text-brand-600" />
                          আপনার জিজ্ঞাসা ও সংশয় লিখুন
                        </h4>
                        <span className="text-[11px] text-muted-foreground font-medium">
                          সহপাঠী ও গুরুকুল আচার্যরা আলোচনা করবেন
                        </span>
                      </div>

                      {/* Question Title */}
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1">
                          প্রশ্নের মূল বিষয় / শিরোনাম *
                        </label>
                        <input
                          type="text"
                          value={qTitle}
                          onChange={(e) => setQTitle(e.target.value)}
                          placeholder="e.g. ৭ম ভাবে রাহু ও বৃহস্পতির দৃষ্টি থাকলে বৈবাহিক জীবনে কী প্রভাব পড়বে?"
                          className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-brand-500"
                        />
                      </div>

                      {/* Question Description */}
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1">
                          বিস্তারিত ব্যাখ্যা / আপনার জিজ্ঞাসা *
                        </label>
                        <textarea
                          rows={3}
                          value={qContent}
                          onChange={(e) => setQContent(e.target.value)}
                          placeholder="ভিডিওর কোন বিষয়টি আপনার বুঝতে অস্পষ্ট লেগেছে তা সংক্ষেপে বিস্তারিত লিখুন..."
                          className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-brand-500 resize-y"
                        />
                      </div>

                      {/* Video Timestamp Binding */}
                      <div className="rounded-xl border border-border/80 bg-surface/80 p-3.5">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-foreground">
                            <input
                              type="checkbox"
                              checked={qUseTimestamp}
                              onChange={(e) => setQUseTimestamp(e.target.checked)}
                              className="rounded border-border text-brand-600 focus:ring-brand-500"
                            />
                            <span>ভিডিওর নির্দিষ্ট মিনিট/সেকেন্ডের সাথে যুক্ত করুন (Timestamped)</span>
                          </label>
                        </div>

                        {qUseTimestamp && (
                          <div className="mt-3 flex items-center gap-3 pt-2 border-t border-border/50 text-xs">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={0}
                                max={300}
                                value={qMinutes}
                                onChange={(e) => setQMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-16 rounded-lg border border-border bg-surface px-2 py-1 text-xs text-center font-mono font-bold"
                              />
                              <span className="text-muted-foreground font-medium">মিনিট</span>
                            </div>
                            <span className="font-bold text-muted-foreground">:</span>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={0}
                                max={59}
                                value={qSeconds}
                                onChange={(e) => setQSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                                className="w-16 rounded-lg border border-border bg-surface px-2 py-1 text-xs text-center font-mono font-bold"
                              />
                              <span className="text-muted-foreground font-medium">সেকেন্ড</span>
                            </div>

                            <span className="text-muted-foreground text-[11px] ml-auto">
                              ট্যাগ: ⏱️ {String(qMinutes).padStart(2, "0")}:{String(qSeconds).padStart(2, "0")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsAskingQuestion(false)}
                          disabled={askQuestionMutation.isPending}
                        >
                          বাতিল
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => askQuestionMutation.mutate()}
                          disabled={askQuestionMutation.isPending || !qTitle.trim() || !qContent.trim()}
                          className="bg-brand-600 hover:bg-brand-700 text-white gap-1.5"
                        >
                          <Send className="size-3.5" />
                          <span>{askQuestionMutation.isPending ? "জমা হচ্ছে..." : "প্রশ্ন জমা দিন"}</span>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Question Feed */}
                  {isQuestionsLoading ? (
                    <LoadingBlock label="লোড হচ্ছে গুরুকুল জিজ্ঞাসা..." />
                  ) : questions.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center bg-surface/40">
                      <MessageSquareQuote className="size-10 text-muted-foreground/40 mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-foreground">এই ভিডিও লেসনে এখনো কোনো প্রশ্ন করা হয়নি</h4>
                      <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
                        ভিডিওর কোনো গণনা বা শ্লোক বুঝতে অসুবিধা হলে উপরের "প্রশ্ন করুন" বোতামে ক্লিক করে প্রথম প্রশ্নটি আপনিই জিজ্ঞাসা করুন।
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsAskingQuestion(true)}
                        className="mt-4 gap-1.5 text-xs text-brand-600"
                      >
                        <HelpCircle className="size-3.5" />
                        <span>প্রথম প্রশ্ন জিজ্ঞাসা করুন</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {questions.map((q: CourseQuestion) => (
                        <div
                          key={q.id}
                          className="rounded-2xl border border-border/80 bg-surface p-5 shadow-soft transition-all duration-200 hover:border-brand-500/40"
                        >
                          {/* Header: Timestamp Tag, Badges & Author */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
                            <div className="flex flex-wrap items-center gap-2">
                              {q.timestamp_seconds > 0 ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-mono font-bold text-amber-600 border border-amber-500/20">
                                  <Clock className="size-3" />
                                  <span>{q.timestamp_formatted}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                  সাধারণ জিজ্ঞাসা
                                </span>
                              )}

                              {q.has_official_answer && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 border border-emerald-500/20">
                                  <ShieldCheck className="size-3.5 text-emerald-600" />
                                  <span>আচার্য উত্তর প্রদান করেছেন</span>
                                </span>
                              )}

                              {q.is_resolved && (
                                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                                  ✓ সমাধান হয়েছে
                                </span>
                              )}
                            </div>

                            {/* Author & Date */}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Avatar
                                src={q.user_avatar}
                                name={q.user_name}
                                className="size-5 text-[10px]"
                              />
                              <span className="font-semibold text-foreground">{q.user_name}</span>
                              <span>•</span>
                              <span className="text-[11px]">
                                {new Date(q.created_at).toLocaleDateString("bn-IN", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>

                          {/* Question Body */}
                          <div className="py-3 space-y-1.5">
                            <h4 className="text-sm font-bold text-foreground leading-snug">
                              {q.title}
                            </h4>
                            <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                              {q.content}
                            </p>
                          </div>

                          {/* Footer Action Bar: Upvote, Reply Toggle, Answer Count */}
                          <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                            <div className="flex items-center gap-3">
                              {/* Upvote Button */}
                              <button
                                type="button"
                                onClick={() => upvoteMutation.mutate(q.id)}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                                  q.is_upvoted_by_me
                                    ? "bg-brand-600 text-white"
                                    : "bg-surface-muted text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                <ThumbsUp className="size-3.5" />
                                <span>{q.upvote_count}</span>
                              </button>

                              {/* Reply Button */}
                              <button
                                type="button"
                                onClick={() =>
                                  setReplyingToQId(replyingToQId === q.id ? null : q.id)
                                }
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-brand-600 transition-colors"
                              >
                                <MessageSquare className="size-3.5" />
                                <span>উত্তর দিন ({q.answers?.length || 0})</span>
                              </button>
                            </div>
                          </div>

                          {/* Discussion Answers Thread */}
                          {q.answers && q.answers.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-border/60 space-y-3 pl-2 sm:pl-4">
                              {q.answers.map((ans: CourseQuestionAnswer) => (
                                <div
                                  key={ans.id}
                                  className={`rounded-xl p-3.5 transition-colors ${
                                    ans.is_official
                                      ? "border-2 border-emerald-500/30 bg-emerald-500/5 shadow-sm"
                                      : "border border-border/60 bg-surface-muted/40"
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                      <Avatar
                                        src={ans.user_avatar}
                                        name={ans.user_name}
                                        className="size-5 text-[10px]"
                                      />
                                      <span className="text-xs font-bold text-foreground">
                                        {ans.user_name}
                                      </span>
                                      {ans.is_official ? (
                                        <span className="inline-flex items-center gap-1 rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white tracking-wider">
                                          <ShieldCheck className="size-2.5" />
                                          আচার্য গুরু উত্তর
                                        </span>
                                      ) : (
                                        <span className="rounded bg-muted px-1.5 py-0.2 text-[9px] font-medium text-muted-foreground">
                                          সহপাঠী
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">
                                      {new Date(ans.created_at).toLocaleDateString("bn-IN", {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-xs text-foreground whitespace-pre-line leading-relaxed">
                                    {ans.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply Input Box */}
                          {replyingToQId === q.id && (
                            <div className="mt-4 pt-3 border-t border-border/60 space-y-2 animate-in fade-in-50">
                              <textarea
                                rows={2}
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="এই প্রশ্নের আপনার উত্তর বা মতামত লিখুন..."
                                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-brand-500 resize-y"
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setReplyingToQId(null);
                                    setReplyContent("");
                                  }}
                                  className="text-xs"
                                >
                                  বাতিল
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => answerMutation.mutate(q.id)}
                                  disabled={answerMutation.isPending || !replyContent.trim()}
                                  className="bg-brand-600 hover:bg-brand-700 text-white text-xs gap-1"
                                >
                                  <Send className="size-3" />
                                  <span>{answerMutation.isPending ? "পোস্ট হচ্ছে..." : "উত্তর জমা দিন"}</span>
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
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
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500/20 via-yellow-500/30 to-amber-600/20 text-amber-600 ring-8 ring-amber-500/10 shadow-lg">
              <Award className="size-10 animate-pulse text-amber-500" />
            </div>

            <div className="space-y-1">
              <span className="inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                Astra Gurukul Consecrated Award
              </span>
              <h3 className="font-serif text-2xl font-bold text-foreground">
                You Have Mastered the Entire Course!
              </h3>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
              You have completed 100% of the lessons in{" "}
              <strong className="text-foreground">{course.title}</strong>. Your official
              degree certificate has been consecrated and issued with verified cryptographic seal.
            </p>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 justify-center">
              <span className="text-base">✉️</span>
              <span>
                আপনার রেজিস্টার্ড ইমেলে শংসাপত্র ও ভেরিফিকেশন লিঙ্ক পাঠিয়ে দেওয়া হয়েছে।
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-2 pt-2">
              <Link
                href={`/verify/certificate/${issuedCertId || course.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full sm:w-auto gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md">
                  <Award className="size-4" />
                  <span>View & Print Certificate</span>
                </Button>
              </Link>
              <Link href="/account/courses">
                <Button variant="outline" className="w-full sm:w-auto gap-2">
                  <span>My Enrolled Courses</span>
                </Button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

