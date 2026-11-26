"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Award,
  Heart,
  Languages,
  Maximize2,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
  UserX,
  Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  LoadingBlock,
  Modal,
  StatusDot,
} from "@/components/ui";
import { MilanLauncher } from "@/components/call/milan-launcher";
import { appointmentApi, astrologerApi, callApi, chatApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { cn, coinsPerMinute, formatNumber } from "@/lib/utils";
import { DurationPicker } from "@/components/consult/duration-picker";
import { ReviewList } from "@/components/reviews/review-list";
import { useLanguage } from "@/providers/language-provider";
import { useLiveAstrologer } from "@/providers/realtime-provider";
import { isPresent } from "@/lib/realtime";
import { ASTROLOGERS_I18N } from "@/lib/astrologers-translations";
import { useAuth } from "@/providers/auth-provider";
import {
  MODE_LABELS,
  SKILL_LABELS,
  coinWord,
  formatCoins,
  type AstrologerPublic,
  type ConsultationMode,
} from "@/types";

const MODE_ICONS = { chat: MessageCircle, call: Phone, video: Video } as const;

export default function AstrologerDetailPage() {
  const { language } = useLanguage();
  const t = ASTROLOGERS_I18N[language] || ASTROLOGERS_I18N.en;
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: astrologer, isLoading, error } = useQuery({
    queryKey: ["astrologer", slug],
    queryFn: () => astrologerApi.detail(slug),
    enabled: Boolean(slug),
    refetchInterval: 15000,
  });

  const liveAstrologer = useLiveAstrologer(astrologer?.id);
  const isOnline = liveAstrologer
    ? isPresent(liveAstrologer)
    : (astrologer?.availability.is_online ?? false);
  const isBusy = liveAstrologer
    ? liveAstrologer.availability.is_busy
    : (astrologer?.availability.is_busy ?? false);

  const { data: favData } = useQuery({
    queryKey: ["astrologer-favorite", slug],
    queryFn: () => astrologerApi.favoriteStatus(slug),
    enabled: Boolean(slug),
  });

  const { data: synergyData } = useQuery({
    queryKey: ["astrologer-synergy", astrologer?.id],
    queryFn: () => appointmentApi.synergy(astrologer!.id),
    enabled: Boolean(user && astrologer?.id),
    staleTime: 5 * 60_000,
  });

  const [isFav, setIsFav] = React.useState(false);
  const [favCount, setFavCount] = React.useState(0);
  const [showBigHeart, setShowBigHeart] = React.useState(false);
  const heartTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (favData) {
      setIsFav(favData.is_favorite);
      setFavCount(favData.favorites_count);
    } else if (astrologer?.followers_count !== undefined) {
      setFavCount(astrologer.followers_count);
    }
  }, [favData, astrologer?.followers_count]);

  const toggleFavMutation = useMutation({
    mutationFn: () => astrologerApi.toggleFavorite(slug),
    onMutate: async () => {
      const nextIsFav = !isFav;
      const nextCount = nextIsFav ? favCount + 1 : Math.max(0, favCount - 1);
      setIsFav(nextIsFav);
      setFavCount(nextCount);

      if (nextIsFav) {
        if (heartTimerRef.current) clearTimeout(heartTimerRef.current);
        setShowBigHeart(true);
        heartTimerRef.current = setTimeout(() => {
          setShowBigHeart(false);
        }, 900);
      }
    },
    onSuccess: (data) => {
      setIsFav(data.is_favorite);
      setFavCount(data.favorites_count);
      queryClient.invalidateQueries({ queryKey: ["astrologer-favorite", slug] });
      queryClient.invalidateQueries({ queryKey: ["astrologer", slug] });
    },
    onError: () => {
      // Revert on error
      setIsFav(!isFav);
      setFavCount(favCount);
    },
  });

  const handleToggleFavorite = () => {
    if (!user) {
      router.push(`/login?redirect=/astrologers/${slug}`);
      return;
    }
    toggleFavMutation.mutate();
  };

  const [selectedPhotoUrl, setSelectedPhotoUrl] = React.useState<string | null>(null);

  const apiError = error as ApiError | null;

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Link
          href="/astrologers"
          className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-surface/50 px-3.5 py-1.5 text-sm text-muted-foreground backdrop-blur transition-all hover:border-brand-500/40 hover:bg-surface-muted hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          {t.backAll}
        </Link>

        {isLoading ? (
          <LoadingBlock label={t.loadingProfile} />
        ) : apiError?.status === 404 ? (
          <EmptyState
            icon={UserX}
            title={t.notAvailableTitle}
            description={t.notAvailableDesc}
            action={
              <Link href="/astrologers">
                <Button>{t.browseOthersBtn}</Button>
              </Link>
            }
          />
        ) : apiError ? (
          <Alert tone="error" title={t.errorTitle}>
            {apiError.message}
          </Alert>
        ) : astrologer ? (
          <article className="grid gap-6 lg:grid-cols-3">
            {/* 1. Profile hero card (spans 2 cols on desktop) */}
            <div className="lg:col-span-2">
              <div className="card-surface overflow-hidden">
                {/* Gradient top strip based on online status */}
                <div className={cn(
                  "h-1",
                  isOnline && !isBusy
                    ? "bg-gradient-to-r from-transparent via-success to-transparent"
                    : isBusy
                    ? "bg-gradient-to-r from-transparent via-gold-400 to-transparent"
                    : "bg-gradient-to-r from-transparent via-slate-300 to-transparent",
                )} />
                <div className="flex flex-col gap-5 p-5 sm:p-6 sm:flex-row sm:items-start">
                  <div className="relative shrink-0">
                    <div className={cn(
                      "rounded-full p-0.5 ring-2",
                      isOnline ? "ring-emerald-500/80" : "ring-slate-300/80"
                    )}>
                      <Avatar
                        src={astrologer.profile_image_url}
                        name={astrologer.display_name}
                        size="xl"
                      />
                    </div>
                    <span className="absolute right-1 bottom-1 rounded-full bg-surface-solid p-1.5 shadow-md">
                      <StatusDot
                        online={isOnline}
                        busy={isBusy}
                      />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                        {astrologer.display_name}
                      </h1>
                      {astrologer.is_featured && <Badge tone="gold">{t.featuredBadge}</Badge>}
                      <Badge
                        tone={
                          isBusy
                            ? "gold"
                            : isOnline
                            ? "green"
                            : "neutral"
                        }
                      >
                        {isBusy
                          ? t.inSessionBadge
                          : isOnline
                          ? t.onlineBadge
                          : t.offlineBadge}
                      </Badge>

                      {/* Interactive Heart Favorite Button */}
                      <button
                        type="button"
                        onClick={handleToggleFavorite}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 cursor-pointer shadow-xs active:scale-95",
                          isFav
                            ? "bg-rose-50 text-rose-600 border border-rose-300 hover:bg-rose-100"
                            : "bg-surface text-muted-foreground border border-border/80 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50/50"
                        )}
                        title={isFav ? "Saved in favorites" : "Add to favorites"}
                      >
                        <Heart
                          className={cn(
                            "size-3.5 transition-transform duration-300",
                            isFav ? "fill-rose-500 text-rose-500 scale-110" : "text-muted-foreground"
                          )}
                        />
                        <span>{isFav ? "Favorited" : "Add to Favorites"}</span>
                        <span className="font-bold">({favCount})</span>
                      </button>
                    </div>

                    {astrologer.tagline && (
                      <p className="mt-1.5 text-sm sm:text-base leading-relaxed text-muted-foreground">{astrologer.tagline}</p>
                    )}

                    {/* Stats pills */}
                    <div className="mt-4 flex flex-wrap gap-2 text-xs sm:text-sm">
                      {astrologer.rating.count > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-2.5 py-1 sm:px-3 border border-gold-400/40">
                          <Star className="size-3.5 fill-gold-500 text-gold-600" />
                          <span className="font-semibold text-gold-600">{astrologer.rating.average.toFixed(1)}</span>
                          <span className="text-muted-foreground text-[11px] sm:text-xs">({formatNumber(astrologer.rating.count)})</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-2.5 py-1 sm:px-3 border border-brand-500/30">
                        <Award className="size-3.5 text-brand-700" />
                        <span className="font-semibold text-foreground">{astrologer.experience_years}</span>
                        <span className="text-muted-foreground text-[11px] sm:text-xs">{t.expYrsLabel}</span>
                      </span>
                      {astrologer.total_consultations > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-2.5 py-1 sm:px-3 border border-brand-500/30">
                          <Sparkles className="size-3.5 text-brand-700" />
                          <span className="font-semibold text-foreground">{formatNumber(astrologer.total_consultations)}</span>
                          <span className="text-muted-foreground text-[11px] sm:text-xs">{t.consultsCountLabel}</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 sm:px-3 border border-rose-200/80 text-rose-800">
                        <Heart className="size-3.5 fill-rose-500 text-rose-500" />
                        <span className="font-semibold text-rose-900">{formatNumber(favCount)}</span>
                        <span className="text-rose-700/80 text-[11px] sm:text-xs">favorites</span>
                      </span>
                    </div>

                    {astrologer.languages.length > 0 && (
                      <p className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Languages className="size-3.5 shrink-0 text-brand-700" />
                        <span>{astrologer.languages.join(" · ")}</span>
                      </p>
                    )}

                    {/* Cosmic Resonance Compatibility Meter (AUD-012) */}
                    {synergyData ? (
                      <div className="mt-4 rounded-2xl border border-amber-300/70 bg-gradient-to-r from-amber-50/90 via-yellow-50/70 to-orange-50/70 p-3.5 shadow-2xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="flex size-8 items-center justify-center rounded-xl bg-amber-500 text-white text-xs font-black shadow-xs">
                              {synergyData.score}%
                            </span>
                            <div>
                              <p className="text-xs font-extrabold text-amber-950">
                                {language === "bn"
                                  ? `কসমিক সিনার্জি স্কোর: ${synergyData.harmony_tier}`
                                  : `Cosmic Synergy: ${synergyData.harmony_tier}`}
                              </p>
                              <p className="text-[11px] text-amber-800/90">
                                {language === "bn" ? "শুভ মুহূর্ত: " : "Recommended Muhurat: "}
                                {synergyData.recommended_muhurat}
                              </p>
                            </div>
                          </div>
                          <Badge tone="gold">{synergyData.harmony_tier}</Badge>
                        </div>
                        {synergyData.resonance_factors?.length > 0 && (
                          <ul className="mt-2 space-y-1 border-t border-amber-200/70 pt-2 text-[11px] text-amber-900">
                            {synergyData.resonance_factors.slice(0, 2).map((factor, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <Sparkles className="size-3 mt-0.5 shrink-0 text-amber-600" />
                                <span>{factor}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : !user ? (
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-200/70 bg-amber-50/50 px-3.5 py-2.5 text-xs">
                        <span className="flex items-center gap-1.5 text-amber-900 font-medium">
                          <Sparkles className="size-3.5 text-amber-600" />
                          {language === "bn"
                            ? "এই জ্যোতিষীর সাথে আপনার কসমিক সিনার্জি স্কোর দেখতে সাইন ইন করুন।"
                            : "Sign in to view your personalized Cosmic Resonance score with this astrologer."}
                        </span>
                        <Link
                          href={`/login?redirect=/astrologers/${slug}`}
                          className="font-bold text-amber-800 underline hover:text-amber-950"
                        >
                          {language === "bn" ? "সাইন ইন" : "Sign in"}
                        </Link>
                      </div>
                    ) : null}

                    {/* Dynamic Realtime Service Duration Delivery */}
                    {(() => {
                      const sd = astrologer.service_duration;
                      const videoMinutes = sd?.video_minutes ?? (sd?.video_hours ? Math.round(sd.video_hours * 60) : 0);
                      const chatMinutes = sd?.chat_minutes ?? (sd?.chat_hours ? Math.round(sd.chat_hours * 60) : 0);
                      const callMinutes = sd?.call_minutes ?? (sd?.call_hours ? Math.round(sd.call_hours * 60) : 0);
                      const totalMinutes = sd?.total_minutes ?? (videoMinutes + chatMinutes + callMinutes);

                      return (
                        <div className="mt-4 rounded-2xl bg-gradient-to-r from-purple-50/80 via-amber-50/80 to-emerald-50/80 border border-brand-500/20 p-3 sm:p-3.5 shadow-2xs">
                          <div className="flex items-center justify-between text-xs font-semibold text-ink-950 mb-2">
                            <span className="flex items-center gap-1.5 text-brand-950">
                              <Sparkles className="size-3.5 text-brand-600" />
                              <span>{t.serviceDeliveryTitle}</span>
                            </span>
                            <span className="text-[11px] font-bold text-muted-foreground bg-white/80 px-2.5 py-0.5 rounded-full border border-black/[0.06] shadow-2xs">
                              {t.totalDurationDelivered(totalMinutes)}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="flex flex-col items-center justify-center rounded-xl bg-white/95 p-2 border border-purple-200/60 shadow-2xs">
                              <div className="flex items-center gap-1 text-purple-700 font-bold">
                                <Video className="size-3.5" />
                                <span className="tabular-nums">{t.formatDurationBadge(videoMinutes)}</span>
                              </div>
                              <span className="text-[10px] sm:text-[11px] font-medium text-purple-900 mt-0.5 truncate max-w-full px-1">{t.videoCallDuration(videoMinutes)}</span>
                            </div>
                            <div className="flex flex-col items-center justify-center rounded-xl bg-white/95 p-2 border border-amber-200/60 shadow-2xs">
                              <div className="flex items-center gap-1 text-amber-700 font-bold">
                                <MessageCircle className="size-3.5" />
                                <span className="tabular-nums">{t.formatDurationBadge(chatMinutes)}</span>
                              </div>
                              <span className="text-[10px] sm:text-[11px] font-medium text-amber-900 mt-0.5 truncate max-w-full px-1">{t.chatDuration(chatMinutes)}</span>
                            </div>
                            <div className="flex flex-col items-center justify-center rounded-xl bg-white/95 p-2 border border-emerald-200/60 shadow-2xs">
                              <div className="flex items-center gap-1 text-emerald-700 font-bold">
                                <Phone className="size-3.5" />
                                <span className="tabular-nums">{t.formatDurationBadge(callMinutes)}</span>
                              </div>
                              <span className="text-[10px] sm:text-[11px] font-medium text-emerald-900 mt-0.5 truncate max-w-full px-1">{t.callDuration(callMinutes)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Consultation options (Right on desktop, right below hero on mobile) */}
            <aside className="lg:col-span-1 lg:row-span-2 lg:sticky lg:top-24 lg:self-start">
              <Card className="border-brand-500/30 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">{t.startConsultationTitle}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {t.startConsultationDesc}
                  </CardDescription>
                </CardHeader>
                <CardBody className="space-y-3 pt-0">
                  <ConsultationOptions
                    astrologer={astrologer}
                    isOnline={isOnline}
                    isBusy={isBusy}
                  />
                </CardBody>
              </Card>
            </aside>

            {/* 3. Main details: Specialities, Bio, Qualifications, Reviews, Gallery */}
            <div className="space-y-5 lg:col-span-2">
              {astrologer.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t.specialitiesTitle}</CardTitle>
                  </CardHeader>
                  <CardBody className="flex flex-wrap gap-2 pt-0">
                    {astrologer.skills.map((skill) => (
                      <Badge key={skill} tone="brand">
                        {SKILL_LABELS[skill]}
                      </Badge>
                    ))}
                    {astrologer.specialisations.map((item) => (
                      <Badge key={item}>{item}</Badge>
                    ))}
                  </CardBody>
                </Card>
              )}

              {astrologer.bio && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t.aboutTitle}</CardTitle>
                  </CardHeader>
                  <CardBody className="pt-0">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                      {astrologer.bio}
                    </p>
                  </CardBody>
                </Card>
              )}

              {astrologer.qualifications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t.qualificationsTitle}</CardTitle>
                  </CardHeader>
                  <CardBody className="pt-0">
                    <ul className="space-y-2">
                      {astrologer.qualifications.map((qualification) => (
                        <li
                          key={qualification}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Award className="mt-0.5 size-4 shrink-0 text-brand-700" />
                          {qualification}
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>{t.reviewsTitle}</CardTitle>
                  <CardDescription>
                    {t.reviewsDesc}
                  </CardDescription>
                </CardHeader>
                <CardBody className="pt-0">
                  <ReviewList astrologerId={astrologer.id} />
                </CardBody>
              </Card>

              {astrologer.gallery.length > 0 && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>{t.galleryTitle || "Portfolio & Gallery"}</CardTitle>
                      <CardDescription>
                        Puja ceremonies, certifications, and consultation sanctuary.
                      </CardDescription>
                    </div>
                    <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-700">
                      {astrologer.gallery.length}{" "}
                      {astrologer.gallery.length === 1 ? "Photo" : "Photos"}
                    </span>
                  </CardHeader>
                  <CardBody className="grid grid-cols-2 gap-3.5 pt-0 sm:grid-cols-3">
                    {astrologer.gallery.map((image, idx) => (
                      <div
                        key={image.public_id}
                        onClick={() => setSelectedPhotoUrl(image.url)}
                        className="group relative aspect-square overflow-hidden rounded-2xl bg-surface-muted cursor-pointer border border-border/80 shadow-xs hover:shadow-md hover:scale-[1.02] transition-all"
                      >
                        <Image
                          src={image.url}
                          alt={`Astrologer Gallery Photo ${idx + 1}`}
                          fill
                          sizes="(max-width: 640px) 50vw, 200px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="rounded-xl bg-white/90 p-2 text-slate-900 shadow-md">
                            <Maximize2 className="size-4" />
                          </span>
                        </div>
                        <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </CardBody>
                </Card>
              )}
            </div>
          </article>
        ) : null}
      </main>

      {/* Lightbox Modal */}
      <Modal
        open={Boolean(selectedPhotoUrl)}
        onClose={() => setSelectedPhotoUrl(null)}
        title="Portfolio Photo Preview"
        size="lg"
      >
        {selectedPhotoUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black my-2">
            <Image
              src={selectedPhotoUrl}
              alt="Astrologer photo"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        )}
      </Modal>

      {/* Floating Love Heart Burst in front */}
      {showBigHeart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="relative flex items-center justify-center animate-in fade-in zoom-in-50 duration-200">
            <div className="absolute size-40 rounded-full bg-rose-500/25 blur-xl animate-pulse" />
            <Heart className="size-28 text-rose-500 fill-rose-500 drop-shadow-[0_12px_30px_rgba(239,68,68,0.5)] transition-all" />
          </div>
        </div>
      )}

      <SiteFooter />
    </>
  );
}

/**
 * The three ways to consult, each a real button.
 *
 * A mode the astrologer does not offer is simply absent — showing a price for
 * something nobody can book is worse than showing nothing. A mode they offer
 * but have paused is shown disabled with the reason, so the person knows to
 * come back rather than assuming the app is broken.
 */
function ConsultationOptions({
  astrologer,
  isOnline,
  isBusy,
}: {
  astrologer: AstrologerPublic;
  isOnline?: boolean;
  isBusy?: boolean;
}) {
  const { language } = useLanguage();
  const t = ASTROLOGERS_I18N[language] || ASTROLOGERS_I18N.en;
  const router = useRouter();
  const { user } = useAuth();
  const [picking, setPicking] = React.useState<ConsultationMode | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const start = useMutation({
    mutationFn: ({ mode, minutes }: { mode: ConsultationMode; minutes: number }) =>
      mode === "chat"
        ? chatApi.start(astrologer.id, minutes).then((s) => `/chat/${s.chat.id}`)
        : callApi.start(astrologer.id, mode, minutes).then((s) => `/call/${s.call.id}`),
    onSuccess: (href) => router.push(href),
    onError: (e: ApiError) => setError(e.message),
  });

  const online = isOnline !== undefined ? isOnline : astrologer.availability.is_online;
  const busy = isBusy !== undefined ? isBusy : astrologer.availability.is_busy;
  const modes = astrologer.modes_enabled;

  if (modes.length === 0) {
    return (
      <Alert tone="info">
        {t.notTakingYet(astrologer.display_name)}
      </Alert>
    );
  }

  function pausedReason(mode: ConsultationMode): string | null {
    if (!online) return t.offlineRightNow;
    const a = astrologer.availability;
    if (busy || a.is_busy) return t.inSessionBadge;
    if (mode === "chat" && !a.is_available_for_chat) return t.chatPaused;
    if (mode === "call" && !a.is_available_for_call) return t.callPaused;
    if (mode === "video" && !a.is_available_for_video) return t.videoPaused;
    return null;
  }

  return (
    <>
      {!online && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-50/70 dark:bg-amber-950/20 p-3 text-xs text-muted-foreground flex items-start gap-2.5 mb-1 shadow-2xs">
          <span className="size-2 rounded-full bg-slate-400 mt-1 shrink-0" />
          <div className="space-y-0.5">
            <p className="font-semibold text-amber-950 dark:text-amber-200">
              {language === "bn"
                ? `${astrologer.display_name} বর্তমানে অফলাইন আছেন`
                : language === "hi"
                ? `${astrologer.display_name} अभी ऑफ़लाइन हैं`
                : `${astrologer.display_name} is currently offline`}
            </p>
            <p className="text-[11px] leading-relaxed text-amber-900/80 dark:text-amber-300/80">
              {language === "bn"
                ? "জ্যোতিষী অনলাইনে এলে সরাসরি লাইভ চ্যাট, কল বা ভিডিও কল নিতে পারবেন।"
                : language === "hi"
                ? "ज्योतिषी के ऑनलाइन आने पर आप लाइव चैट, कॉल या वीडियो शुरू कर सकेंगे।"
                : "Live chat, audio call and video consultation will activate once the astrologer comes online."}
            </p>
          </div>
        </div>
      )}

      {modes.map((mode: ConsultationMode) => {
        const Icon = MODE_ICONS[mode];
        const rate = coinsPerMinute(astrologer.rates, mode);
        const paused = pausedReason(mode);
        const disabled = Boolean(paused) || start.isPending;

        return (
          <button
            key={mode}
            type="button"
            disabled={disabled}
            onClick={() => {
              setError(null);
              if (!user) {
                router.push(`/login?next=/astrologers/${astrologer.slug}`);
                return;
              }
              setPicking(mode);
            }}
            className={cn(
              "flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition-all duration-200 group",
              disabled
                ? "cursor-not-allowed border-border/40 bg-surface-muted/60 opacity-60"
                : "border-border hover:border-brand-500/55 hover:bg-brand-500/8 hover:shadow-soft",
            )}
          >
            <span className="flex items-center gap-3 text-sm font-medium">
              <span className={cn(
                "icon-box flex size-9 items-center justify-center rounded-xl transition-all duration-200",
                disabled
                  ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                  : "icon-box-brand group-hover:shadow-soft",
              )}>
                <Icon className="size-4" />
              </span>
              <span>
                <span className={cn("font-semibold", disabled ? "text-muted-foreground" : "text-foreground")}>
                  {MODE_LABELS[mode]}
                </span>
                {paused && (
                  <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                    {paused}
                  </span>
                )}
              </span>
            </span>

            <span className="text-right">
              <span className={cn("text-base font-bold", disabled ? "text-muted-foreground" : "text-foreground")}>
                {formatCoins(rate)}
              </span>
              <span className="block text-xs text-muted-foreground">{coinWord(rate)}{t.perMinute}</span>
            </span>
          </button>
        );
      })}

      {/* A family consultation is its own thing, not a fourth "mode": it is
          booked with the guests named up front. */}
      <MilanLauncher astrologer={astrologer} isOnline={online} />

      {!user && (
        <p className="pt-1 text-center text-xs text-muted-foreground">
          {t.signInNotice}
        </p>
      )}

      <DurationPicker
        astrologerId={astrologer.id}
        astrologerName={astrologer.display_name}
        mode={picking}
        open={picking !== null}
        onClose={() => {
          setPicking(null);
          setError(null);
        }}
        onConfirm={(minutes) => picking && start.mutate({ mode: picking, minutes })}
        starting={start.isPending}
        error={error}
      />
    </>
  );
}
