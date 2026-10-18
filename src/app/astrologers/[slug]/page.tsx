"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Award,
  Languages,
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
  StatusDot,
} from "@/components/ui";
import { astrologerApi, callApi, chatApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { cn, coinsPerMinute, formatNumber } from "@/lib/utils";
import { DurationPicker } from "@/components/consult/duration-picker";
import { ReviewList } from "@/components/reviews/review-list";
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
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data: astrologer, isLoading, error } = useQuery({
    queryKey: ["astrologer", slug],
    queryFn: () => astrologerApi.detail(slug),
    enabled: Boolean(slug),
  });

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
          All astrologers
        </Link>

        {isLoading ? (
          <LoadingBlock label="Loading profile…" />
        ) : apiError?.status === 404 ? (
          <EmptyState
            icon={UserX}
            title="This astrologer is not available"
            description="They may have been taken off the directory. Browse the others instead."
            action={
              <Link href="/astrologers">
                <Button>Browse astrologers</Button>
              </Link>
            }
          />
        ) : apiError ? (
          <Alert tone="error" title="Could not load this profile">
            {apiError.message}
          </Alert>
        ) : astrologer ? (
          <article className="grid gap-6 lg:grid-cols-3">
            {/* ------------------------------------------------- main */}
            <div className="space-y-5 lg:col-span-2">
              {/* Profile hero card */}
              <div className="card-surface overflow-hidden">
                {/* Gradient top strip based on online status */}
                <div className={cn(
                  "h-1",
                  astrologer.availability.is_online && !astrologer.availability.is_busy
                    ? "bg-gradient-to-r from-transparent via-success to-transparent"
                    : astrologer.availability.is_busy
                    ? "bg-gradient-to-r from-transparent via-gold-400 to-transparent"
                    : "bg-gradient-to-r from-transparent via-brand-400/40 to-transparent",
                )} />
                <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start">
                  <div className="relative shrink-0">
                    <div className="ring-2 ring-brand-500/30 rounded-full">
                      <Avatar
                        src={astrologer.profile_image_url}
                        name={astrologer.display_name}
                        size="xl"
                      />
                    </div>
                    <span className="absolute right-1 bottom-1 rounded-full bg-surface-solid p-1.5 shadow-md">
                      <StatusDot
                        online={astrologer.availability.is_online}
                        busy={astrologer.availability.is_busy}
                      />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                        {astrologer.display_name}
                      </h1>
                      {astrologer.is_featured && <Badge tone="gold">✦ Featured</Badge>}
                      <Badge
                        tone={
                          astrologer.availability.is_busy
                            ? "gold"
                            : astrologer.availability.is_online
                            ? "green"
                            : "neutral"
                        }
                      >
                        {astrologer.availability.is_busy
                          ? "◉ In Session"
                          : astrologer.availability.is_online
                          ? "● Online"
                          : "○ Offline"}
                      </Badge>
                    </div>

                    {astrologer.tagline && (
                      <p className="mt-1.5 leading-relaxed text-muted-foreground">{astrologer.tagline}</p>
                    )}

                    {/* Stats pills */}
                    <div className="mt-4 flex flex-wrap gap-2.5 text-sm">
                      {astrologer.rating.count > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 border border-gold-400/40">
                          <Star className="size-3.5 fill-gold-500 text-gold-600" />
                          <span className="font-semibold text-gold-600">{astrologer.rating.average.toFixed(1)}</span>
                          <span className="text-muted-foreground text-xs">({formatNumber(astrologer.rating.count)})</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 border border-brand-500/30">
                        <Award className="size-3.5 text-brand-700" />
                        <span className="font-semibold text-foreground">{astrologer.experience_years}</span>
                        <span className="text-muted-foreground text-xs">yrs exp</span>
                      </span>
                      {astrologer.total_consultations > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 border border-brand-500/30">
                          <Sparkles className="size-3.5 text-brand-700" />
                          <span className="font-semibold text-foreground">{formatNumber(astrologer.total_consultations)}</span>
                          <span className="text-muted-foreground text-xs">consults</span>
                        </span>
                      )}
                    </div>

                    {astrologer.languages.length > 0 && (
                      <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <Languages className="size-3.5 shrink-0 text-brand-700" />
                        <span>{astrologer.languages.join(" · ")}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {astrologer.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Specialities</CardTitle>
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
                    <CardTitle>About</CardTitle>
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
                    <CardTitle>Qualifications</CardTitle>
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
                  <CardTitle>Reviews</CardTitle>
                  <CardDescription>
                    From people who have actually consulted them.
                  </CardDescription>
                </CardHeader>
                <CardBody className="pt-0">
                  <ReviewList astrologerId={astrologer.id} />
                </CardBody>
              </Card>

              {astrologer.gallery.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Gallery</CardTitle>
                  </CardHeader>
                  <CardBody className="grid grid-cols-2 gap-3 pt-0 sm:grid-cols-3">
                    {astrologer.gallery.map((image) => (
                      <div
                        key={image.public_id}
                        className="relative aspect-square overflow-hidden rounded-xl bg-surface-muted"
                      >
                        <Image
                          src={image.url}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 50vw, 200px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ))}
                  </CardBody>
                </Card>
              )}
            </div>

            {/* ------------------------------------------------ aside */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <Card>
                <CardHeader>
                  <CardTitle>Start a consultation</CardTitle>
                </CardHeader>
                <CardBody className="space-y-3 pt-0">
                  <ConsultationOptions astrologer={astrologer} />
                </CardBody>
              </Card>
            </aside>
          </article>
        ) : null}
      </main>

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
function ConsultationOptions({ astrologer }: { astrologer: AstrologerPublic }) {
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

  const online = astrologer.availability.is_online;
  const modes = astrologer.modes_enabled;

  if (modes.length === 0) {
    return (
      <Alert tone="info">
        {astrologer.display_name} is not taking consultations yet.
      </Alert>
    );
  }

  function pausedReason(mode: ConsultationMode): string | null {
    if (!online) return "Offline right now";
    const a = astrologer.availability;
    if (mode === "chat" && !a.is_available_for_chat) return "Chat paused";
    if (mode === "call" && !a.is_available_for_call) return "Calls paused";
    if (mode === "video" && !a.is_available_for_video) return "Video paused";
    return null;
  }

  return (
    <>
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
                ? "cursor-not-allowed border-border/50 opacity-55"
                : "border-border hover:border-brand-500/55 hover:bg-brand-500/8 hover:shadow-soft",
            )}
          >
            <span className="flex items-center gap-3 text-sm font-medium">
              <span className={cn(
                "icon-box flex size-9 items-center justify-center rounded-xl icon-box-brand transition-all duration-200",
                !disabled && "group-hover:shadow-soft",
              )}>
                <Icon className="size-4" />
              </span>
              <span>
                <span className="font-semibold text-foreground">{MODE_LABELS[mode]}</span>
                {paused && (
                  <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                    {paused}
                  </span>
                )}
              </span>
            </span>

            <span className="text-right">
              <span className="text-base font-bold text-foreground">{formatCoins(rate)}</span>
              <span className="block text-xs text-muted-foreground">{coinWord(rate)}/min</span>
            </span>
          </button>
        );
      })}

      {!user && (
        <p className="pt-1 text-center text-xs text-muted-foreground">
          You will be asked to sign in first.
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
