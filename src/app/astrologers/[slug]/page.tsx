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
  CardHeader,
  CardTitle,
  EmptyState,
  LoadingBlock,
  StatusDot,
} from "@/components/ui";
import { astrologerApi, callApi, chatApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import {
  baseRate,
  cn,
  effectiveRate,
  formatCurrency,
  formatNumber,
  hasDiscount,
} from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import {
  MODE_LABELS,
  SKILL_LABELS,
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
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
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
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardBody className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="relative shrink-0">
                    <Avatar
                      src={astrologer.profile_image_url}
                      name={astrologer.display_name}
                      size="xl"
                    />
                    <span className="absolute right-1 bottom-1 rounded-full bg-surface p-1">
                      <StatusDot
                        online={astrologer.availability.is_online}
                        busy={astrologer.availability.is_busy}
                      />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-bold tracking-tight">
                        {astrologer.display_name}
                      </h1>
                      {astrologer.is_featured && <Badge tone="gold">Featured</Badge>}
                      <Badge tone={astrologer.availability.is_online ? "green" : "neutral"}>
                        {astrologer.availability.is_busy
                          ? "Busy"
                          : astrologer.availability.is_online
                            ? "Online"
                            : "Offline"}
                      </Badge>
                    </div>

                    {astrologer.tagline && (
                      <p className="mt-1 text-muted-foreground">{astrologer.tagline}</p>
                    )}

                    <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      {astrologer.rating.count > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Star className="size-4 fill-gold-400 text-gold-400" />
                          <dd className="font-semibold">
                            {astrologer.rating.average.toFixed(1)}
                          </dd>
                          <dt className="text-muted-foreground">
                            ({formatNumber(astrologer.rating.count)} reviews)
                          </dt>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Award className="size-4 text-brand-500" />
                        <dd className="font-semibold">{astrologer.experience_years}</dd>
                        <dt className="text-muted-foreground">years experience</dt>
                      </div>
                      {astrologer.total_consultations > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="size-4 text-brand-500" />
                          <dd className="font-semibold">
                            {formatNumber(astrologer.total_consultations)}
                          </dd>
                          <dt className="text-muted-foreground">consultations</dt>
                        </div>
                      )}
                    </dl>

                    {astrologer.languages.length > 0 && (
                      <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <Languages className="size-4 shrink-0" />
                        {astrologer.languages.join(", ")}
                      </p>
                    )}
                  </div>
                </CardBody>
              </Card>

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
                          <Award className="mt-0.5 size-4 shrink-0 text-brand-500" />
                          {qualification}
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              )}

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
  const [error, setError] = React.useState<string | null>(null);

  const start = useMutation({
    // Chat opens a conversation; a call opens a room. Different endpoints,
    // same button.
    mutationFn: (mode: ConsultationMode) =>
      mode === "chat"
        ? chatApi.start(astrologer.id).then((s) => `/chat/${s.chat.id}`)
        : callApi.start(astrologer.id, mode).then((s) => `/call/${s.call.id}`),
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
      {error && <Alert tone="error">{error}</Alert>}

      {modes.map((mode: ConsultationMode) => {
        const Icon = MODE_ICONS[mode];
        const price = effectiveRate(astrologer.rates, mode);
        const discounted = hasDiscount(astrologer.rates, mode);
        const base = baseRate(astrologer.rates, mode);
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
              start.mutate(mode);
            }}
            className={cn(
              "flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors",
              disabled
                ? "cursor-not-allowed border-border opacity-60"
                : "border-border hover:border-brand-400 hover:bg-brand-50/60 dark:hover:bg-brand-950/40",
            )}
          >
            <span className="flex items-center gap-2.5 text-sm font-medium">
              <span className="flex size-8 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200">
                <Icon className="size-4" />
              </span>
              <span>
                {MODE_LABELS[mode]}
                {paused && (
                  <span className="block text-xs font-normal text-muted-foreground">
                    {paused}
                  </span>
                )}
              </span>
            </span>

            <span className="text-right">
              {discounted && (
                <span className="mr-1.5 text-xs text-muted-foreground line-through">
                  {formatCurrency(base)}
                </span>
              )}
              <span className="font-semibold">
                {price > 0 ? formatCurrency(price) : "Free"}
              </span>
              <span className="text-xs text-muted-foreground">/min</span>
            </span>
          </button>
        );
      })}

      {!user && (
        <p className="pt-1 text-center text-xs text-muted-foreground">
          You will be asked to sign in first.
        </p>
      )}
    </>
  );
}
