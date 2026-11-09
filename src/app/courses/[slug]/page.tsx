"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  GraduationCap,
  HelpCircle,
  Lock,
  Play,
  PlayCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  EmptyState,
  LoadingBlock,
  Modal,
} from "@/components/ui";
import { courseApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/providers/auth-provider";
import type { CourseDetail, CourseLesson, CourseSection } from "@/types";

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if ((window as any).Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CHECKOUT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isSignedIn } = useAuth();
  const slug = String(params.slug);

  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({});
  const [previewLesson, setPreviewLesson] = React.useState<CourseLesson | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);
  const [avatarError, setAvatarError] = React.useState(false);
  const [thumbError, setThumbError] = React.useState(false);

  const {
    data: course,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["course-detail", slug],
    queryFn: () => courseApi.getCourseDetail(slug),
    enabled: Boolean(slug),
  });

  // Auto-expand first 2 sections on load
  React.useEffect(() => {
    if (course?.sections) {
      const initial: Record<string, boolean> = {};
      course.sections.slice(0, 2).forEach((sec) => {
        initial[sec.id] = true;
      });
      setExpandedSections(initial);
    }
  }, [course]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Find first lesson for "Start / Continue" link
  const firstLessonId = React.useMemo(() => {
    if (!course?.sections) return null;
    for (const sec of course.sections) {
      if (sec.lessons && sec.lessons.length > 0) {
        return sec.lessons[0].id;
      }
    }
    return null;
  }, [course]);

  const handleEnrollOrBuy = async () => {
    if (!isSignedIn) {
      toast.info("Please sign in or create an account to enroll.");
      router.push(`/login?next=/courses/${slug}`);
      return;
    }

    if (!course) return;

    try {
      setIsProcessingPayment(true);
      const order = await courseApi.createOrder(course.id);

      // Scenario 1: Free Course (Instant enrollment)
      if (order.free_enrolled) {
        toast.success("Enrolled successfully! Welcome to the Masterclass.");
        await queryClient.invalidateQueries({ queryKey: ["course-detail", slug] });
        if (firstLessonId) {
          router.push(`/courses/${slug}/learn/${firstLessonId}`);
        } else {
          router.push("/account/courses");
        }
        return;
      }

      // Scenario 2: Razorpay Paid Checkout
      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded || !(window as any).Razorpay) {
        toast.error("Failed to load payment gateway. Please check your internet connection.");
        setIsProcessingPayment(false);
        return;
      }

      const rzp = new (window as any).Razorpay({
        key: order.key_id,
        order_id: order.order_id,
        amount: order.amount_paise,
        currency: order.currency || "INR",
        name: "Astra Cosmic Gurukul",
        description: course.title,
        image: "/icon.png",
        prefill: {
          name: user?.full_name || "",
          email: user?.email || "",
          contact: (user as any)?.phone || "",
        },
        theme: {
          color: "#7c3aed",
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            toast.loading("Verifying payment...", { id: "rzp-verify" });
            const verifyRes = await courseApi.verifyPayment(course.id, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success("Payment verified! Welcome to DivinLink Gurukul.", { id: "rzp-verify" });
            await queryClient.invalidateQueries({ queryKey: ["course-detail", slug] });
            if (firstLessonId) {
              router.push(`/courses/${slug}/learn/${firstLessonId}`);
            } else {
              router.push("/account/courses");
            }
          } catch (err) {
            toast.error(
              err instanceof ApiError ? err.message : "Payment verification failed. Please contact support.",
              { id: "rzp-verify" }
            );
          } finally {
            setIsProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(false);
            toast.message("Payment cancelled.");
          },
        },
      });

      rzp.open();
    } catch (err) {
      setIsProcessingPayment(false);
      toast.error(
        err instanceof ApiError ? err.message : "Failed to initiate enrollment. Please try again."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 py-20">
          <LoadingBlock label="Retrieving course curriculum and syllabus…" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-4xl flex-1 px-4 py-20 text-center">
          <EmptyState
            icon={GraduationCap}
            title="Masterclass Not Found"
            description="The course you are looking for does not exist or may have been unlisted."
            action={
              <Link href="/courses">
                <Button>Browse Gurukul Catalog</Button>
              </Link>
            }
          />
        </main>
        <SiteFooter />
      </div>
    );
  }

  const isFree = course.price === 0;

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-brand-500/20">
      <SiteHeader />

      <main className="flex-1 pb-20">
        {/* Navigation Breadcrumb */}
        <div className="border-b border-border/60 bg-surface/50 px-4 py-3 sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="size-3" />
            <Link href="/courses" className="hover:text-foreground">
              Gurukul
            </Link>
            <ChevronRight className="size-3" />
            <span className="truncate font-medium text-foreground">{course.title}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-brand-950/20 via-surface to-background px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
              {/* Left Column: Course Info */}
              <div className="lg:col-span-8">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-md bg-brand-500/10 px-2.5 py-0.5 font-semibold uppercase tracking-wider text-brand-600">
                    {course.category.replace(/_/g, " ")}
                  </span>
                  <span className="rounded-md bg-surface-muted px-2.5 py-0.5 font-medium text-muted-foreground capitalize">
                    {course.level} Level
                  </span>
                  <span className="rounded-md bg-surface-muted px-2.5 py-0.5 font-medium text-muted-foreground uppercase">
                    {course.language}
                  </span>
                </div>

                <h1 className="mt-4 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {course.title}
                </h1>

                {course.subtitle && (
                  <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                    {course.subtitle}
                  </p>
                )}

                {/* Rating & Stats */}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1 font-semibold text-amber-500">
                    <Star className="size-4 fill-amber-500" />
                    <span>{course.average_rating > 0 ? course.average_rating.toFixed(1) : "4.9"}</span>
                    <span className="font-normal text-muted-foreground">
                      ({course.rating_count > 0 ? course.rating_count : "120+"} ratings)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="size-3.5" />
                    <span>{course.total_students} students enrolled</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    <span>{course.duration_hours} hours on-demand video</span>
                  </div>
                </div>

                {/* Instructor Block */}
                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border/80 bg-surface p-4">
                  {course.instructor_avatar && !avatarError ? (
                    <Image
                      src={course.instructor_avatar}
                      alt={course.instructor_name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover ring-2 ring-brand-500/20"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="flex size-12 items-center justify-center rounded-full bg-brand-500/10 text-base font-bold text-brand-600">
                      {course.instructor_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">Created by Master</p>
                    <p className="text-sm font-bold text-foreground">{course.instructor_name}</p>
                    <p className="text-xs text-muted-foreground">{course.instructor_title}</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Sticky Purchase & Enrollment Card */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 overflow-hidden rounded-2xl border border-border bg-surface shadow-elevation">
                  {/* Thumbnail / Trailer */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    {course.thumbnail_url && !thumbError ? (
                      <Image
                        src={course.thumbnail_url}
                        alt={course.title}
                        fill
                        className="object-cover opacity-90"
                        onError={() => setThumbError(true)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-amber-950 via-neutral-900 to-black text-amber-500">
                        <span className="text-3xl mb-1">☸</span>
                        <span className="text-[11px] font-serif font-bold tracking-widest text-amber-400/80 uppercase">DivinLink Gurukul</span>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      {firstLessonId && (
                        <div className="flex size-14 items-center justify-center rounded-full bg-white/90 text-brand-900 shadow-xl transition-transform hover:scale-110">
                          <Play className="size-6 fill-brand-900 pl-0.5" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    {/* Enrollment Status or Price */}
                    {course.is_enrolled ? (
                      <div className="space-y-4">
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-center">
                          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                            Enrolled Student
                          </p>
                          <p className="mt-1 text-sm font-bold text-foreground">
                            Course Progress: {Math.round(course.user_progress_percent)}%
                          </p>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-emerald-950/20">
                            <div
                              className="h-full bg-emerald-500 transition-all duration-500"
                              style={{ width: `${Math.min(100, course.user_progress_percent)}%` }}
                            />
                          </div>
                        </div>

                        {firstLessonId ? (
                          <Link
                            href={`/courses/${course.slug}/learn/${firstLessonId}`}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white shadow-soft transition-all hover:bg-brand-700"
                          >
                            <PlayCircle className="size-4" />
                            <span>Continue Learning</span>
                          </Link>
                        ) : (
                          <p className="text-center text-xs text-muted-foreground">
                            Curriculum is being updated.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        {/* Price Display */}
                        <div className="flex items-baseline gap-3">
                          {isFree ? (
                            <span className="text-3xl font-extrabold text-emerald-600">
                              Free Access
                            </span>
                          ) : (
                            <>
                              <span className="text-3xl font-extrabold text-foreground">
                                ₹{course.price.toLocaleString("en-IN")}
                              </span>
                              {course.mrp > course.price && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ₹{course.mrp.toLocaleString("en-IN")}
                                </span>
                              )}
                              {course.discount_percent > 0 && (
                                <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-700">
                                  {course.discount_percent}% OFF
                                </span>
                              )}
                            </>
                          )}
                        </div>

                        {/* CTA Button */}
                        <div className="mt-5">
                          <Button
                            className="w-full py-6 text-base font-bold shadow-soft"
                            onClick={handleEnrollOrBuy}
                            disabled={isProcessingPayment}
                          >
                            {isProcessingPayment ? (
                              "Processing Enrollment..."
                            ) : isFree ? (
                              "Enroll Now for Free"
                            ) : (
                              "Enroll Now • Instant Access"
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Value Highlights */}
                    <div className="mt-6 space-y-3 border-t border-border/60 pt-5 text-xs text-muted-foreground">
                      <p className="font-semibold text-foreground">This masterclass includes:</p>
                      <div className="flex items-center gap-2.5">
                        <Video className="size-4 text-brand-600" />
                        <span>{course.duration_hours} hours HD video streaming</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="size-4 text-brand-600" />
                        <span>{course.total_lessons} lessons & structured modules</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="size-4 text-brand-600" />
                        <span>Full lifetime access on web & mobile</span>
                      </div>
                      {course.certificate_enabled && (
                        <div className="flex items-center gap-2.5 text-emerald-600 font-medium">
                          <Award className="size-4" />
                          <span>Verified Certificate of Completion</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Details Content */}
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="space-y-10 lg:col-span-8">
              {/* What you will learn */}
              {course.what_you_will_learn && course.what_you_will_learn.length > 0 && (
                <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-6 sm:p-8">
                  <h2 className="font-serif text-xl font-bold text-foreground">
                    What You Will Master
                  </h2>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {course.what_you_will_learn.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-sm text-foreground">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-600" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Curriculum Accordion */}
              <div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    Course Curriculum
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {course.sections.length} modules • {course.total_lessons} lessons •{" "}
                    {course.duration_hours}h total length
                  </p>
                </div>

                <div className="mt-4 space-y-3">
                  {course.sections.map((section: CourseSection) => {
                    const isExpanded = Boolean(expandedSections[section.id]);
                    return (
                      <div
                        key={section.id}
                        className="overflow-hidden rounded-xl border border-border bg-surface"
                      >
                        <button
                          type="button"
                          onClick={() => toggleSection(section.id)}
                          className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-surface-muted"
                        >
                          <div className="flex items-center gap-3">
                            <ChevronDown
                              className={`size-4 text-muted-foreground transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                            <div>
                              <h3 className="text-sm font-bold text-foreground">
                                {section.title}
                              </h3>
                              {section.description && (
                                <p className="text-xs text-muted-foreground">
                                  {section.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {section.lessons.length} lessons
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="border-t border-border/60 divide-y divide-border/60 bg-background/50">
                            {section.lessons.map((lesson: CourseLesson) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between px-5 py-3 text-xs"
                              >
                                <div className="flex items-center gap-3">
                                  {course.is_enrolled ? (
                                    <PlayCircle className="size-4 text-brand-600" />
                                  ) : lesson.is_free_preview ? (
                                    <PlayCircle className="size-4 text-emerald-600" />
                                  ) : (
                                    <Lock className="size-4 text-muted-foreground/60" />
                                  )}
                                  <span className="font-medium text-foreground">
                                    {lesson.title}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3">
                                  {lesson.duration_minutes > 0 && (
                                    <span className="text-muted-foreground">
                                      {lesson.duration_minutes} min
                                    </span>
                                  )}

                                  {lesson.is_free_preview && !course.is_enrolled && (
                                    <button
                                      type="button"
                                      onClick={() => setPreviewLesson(lesson)}
                                      className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-semibold text-emerald-600 hover:bg-emerald-500/20"
                                    >
                                      Preview
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
                <h2 className="font-serif text-xl font-bold text-foreground">
                  About this Masterclass
                </h2>
                <div className="prose prose-sm dark:prose-invert mt-4 max-w-none text-muted-foreground whitespace-pre-line leading-relaxed">
                  {course.description}
                </div>
              </div>

              {/* Prerequisites */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
                  <h2 className="font-serif text-xl font-bold text-foreground">Prerequisites</h2>
                  <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
                    {course.prerequisites.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Free Lesson Preview Modal */}
      {previewLesson && (
        <Modal
          open={Boolean(previewLesson)}
          onClose={() => setPreviewLesson(null)}
          title={`Preview: ${previewLesson.title}`}
        >
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Watch this preview lesson to experience the teaching depth before enrolling.
            </p>
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
              {previewLesson.video_provider === "bunny_stream" && previewLesson.video_id ? (
                <iframe
                  src={`https://iframe.mediadelivery.net/embed/803267/${previewLesson.video_id}?autoplay=true&preload=true`}
                  loading="lazy"
                  className="h-full w-full border-0"
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  Video preview unavailable
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setPreviewLesson(null)}>
                Close Preview
              </Button>
              <Button onClick={() => { setPreviewLesson(null); handleEnrollOrBuy(); }}>
                Enroll in Masterclass
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <SiteFooter />
    </div>
  );
}

