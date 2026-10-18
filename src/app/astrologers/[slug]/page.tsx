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
import { astrologerApi, callApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { baseRate, effectiveRate, formatCurrency, formatNumber, hasDiscount } from "@/lib/utils";
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
                  {astrologer.modes_enabled.map((mode: ConsultationMode) => {
                    const Icon = MODE_ICONS[mode];
                    const price = effectiveRate(astrologer.rates, mode);
                    const discounted = hasDiscount(astrologer.rates, mode);
                    const base = baseRate(astrologer.rates, mode);

                    return (
                      <div
                        key={mode}
                        className="flex items-center justify-between rounded-xl border border-border p-3"
                      >
                        <span className="flex items-center gap-2.5 text-sm font-medium">
                          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200">
                            <Icon className="size-4" />
                          </span>
                          {MODE_LABELS[mode]}
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
                      </div>
                    );
                  })}

                  <VideoCallButton astrologer={astrologer} />
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
 * Starts a video call, or explains why it cannot start.
 *
 * The button is only live when the astrologer is online and actually offers
 * video — the backend refuses otherwise, and a button that always fails is
 * worse than one that says why.
 */
function VideoCallButton({ astrologer }: { astrologer: AstrologerPublic }) {
  const router = useRouter();
  const { user } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  const offersVideo = astrologer.modes_enabled.includes("video");
  const online = astrologer.availability.is_online;

  const start = useMutation({
    mutationFn: () => callApi.start(astrologer.id, "video"),
    onSuccess: (session) => router.push(`/call/${session.call.id}`),
    onError: (e: ApiError) => setError(e.message),
  });

  if (!user) {
    return (
      <>
        <Alert tone="info" className="mt-1">
          Sign in to start a video call with {astrologer.display_name}.
        </Alert>
        <Link href={`/login?next=/astrologers/${astrologer.slug}`} className="block">
          <Button className="w-full">Sign in to call</Button>
        </Link>
      </>
    );
  }

  if (!offersVideo) {
    return (
      <Alert tone="info" className="mt-1">
        {astrologer.display_name} does not take video calls yet.
      </Alert>
    );
  }

  return (
    <>
      {error && <Alert tone="error">{error}</Alert>}
      {!online && (
        <Alert tone="info" className="mt-1">
          {astrologer.display_name} is offline right now. Try again when they are online.
        </Alert>
      )}
      <Button
        className="w-full"
        disabled={!online || start.isPending}
        onClick={() => {
          setError(null);
          start.mutate();
        }}
      >
        <Video className="size-4" />
        {start.isPending ? "Calling…" : "Start video call"}
      </Button>
    </>
  );
}
