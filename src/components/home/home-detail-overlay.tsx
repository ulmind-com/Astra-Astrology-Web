"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Check,
  ChevronRight,
  FileText,
  Flame,
  Lock,
  MessageCircle,
  RefreshCw,
  Star,
} from "lucide-react";

import { HeartButton, ReadingGrid } from "@/components/home/home-cinematic-cards";
import {
  COPY,
  DETAIL_GALLERY,
  HOST_AVATAR,
  READINGS,
  REVIEWER_AVATARS,
  formatPrice,
  tr,
  type Reading,
} from "@/components/home/home-cinematic-data";
import {
  formatBirthDate,
  formatBirthTime,
  type BirthState,
} from "@/components/home/home-cinematic-search";
import type { AstrologyLanguage } from "@/types";

const AMENITIES = [
  { icon: MessageCircle, label: COPY.incChat },
  { icon: BadgeCheck, label: COPY.incVerified },
  { icon: FileText, label: COPY.incReport },
  { icon: Flame, label: COPY.incRemedies },
  { icon: Lock, label: COPY.incPrivate },
  { icon: RefreshCw, label: COPY.incFollowUp },
];

interface DetailProps {
  reading: Reading;
  language: AstrologyLanguage;
  shown: boolean;
  closing: boolean;
  mainHidden: boolean;
  mainRef: React.RefObject<HTMLDivElement | null>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  /** What the visitor typed into the hero's birth bar, if anything. */
  birth: BirthState;
  likedIds: Set<string>;
  onToggleLike: (id: string) => void;
  onHome: () => void;
  onOpen: (reading: Reading, fromEl: HTMLElement) => void;
}

export function HomeDetailOverlay({
  reading,
  language,
  shown,
  closing,
  mainHidden,
  mainRef,
  scrollRef,
  birth,
  likedIds,
  onToggleLike,
  onHome,
  onOpen,
}: DetailProps) {
  const router = useRouter();
  const [bookingId, setBookingId] = React.useState<string | null>(null);
  const booking = bookingId === reading.id;
  const [mode, setMode] = React.useState<"chat" | "call" | "video">("chat");
  const birthSummary = [
    birth.name.trim(),
    birth.dob ? formatBirthDate(birth.dob, language) : null,
    birth.dob ? formatBirthTime(birth, language) : null,
    birth.place?.place.split(",")[0] ?? null,
  ]
    .filter(Boolean)
    .join(" · ");
  const name = tr(reading.name, language);

  const idx = READINGS.findIndex((r) => r.id === reading.id);
  const similar = [1, 2, 3, 4].map((k) => READINGS[(idx + k) % READINGS.length]);

  const book = () => {
    setBookingId(reading.id);
    const sep = reading.href.includes("?") ? "&" : "?";
    window.setTimeout(() => router.push(`${reading.href}${sep}mode=${encodeURIComponent(mode)}`), 650);
  };

  let d = 0;
  const rise = () => ({ "--d": d++ }) as React.CSSProperties;

  return (
    <div
      ref={scrollRef}
      className={`dl-detail${shown ? " is-open" : ""}${closing ? " is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={name}
    >
      <div className="dl-detail-inner">
        <nav className="dl-crumbs dl-rise" style={rise()} aria-label="Breadcrumb">
          <button type="button" onClick={onHome}>
            {tr(COPY.home, language)}
          </button>
          <ChevronRight size={13} strokeWidth={1.6} />
          <span>{tr(COPY.readings, language)}</span>
          <ChevronRight size={13} strokeWidth={1.6} />
          <span>{tr(reading.category, language)}</span>
          <ChevronRight size={13} strokeWidth={1.6} />
          <span className="is-muted">
            {name}, {tr(reading.place, language)}
          </span>
        </nav>

        <div className="dl-detail-cols">
          <div>
            <div
              ref={mainRef}
              className={`dl-main-photo${mainHidden ? " is-hidden" : ""}`}
              style={{ backgroundImage: `url(${reading.image})` }}
            >
              <HeartButton
                liked={likedIds.has(reading.id)}
                onToggle={() => onToggleLike(reading.id)}
                label={name}
              />
            </div>
            <div className="dl-gallery">
              {DETAIL_GALLERY.map((src, i) => (
                <div
                  key={src}
                  className="dl-gallery-item dl-rise"
                  style={{ ...rise(), backgroundImage: `url(${src})` }}
                >
                  {i === DETAIL_GALLERY.length - 1 && (
                    <span className="dl-gallery-more">{tr(COPY.morePhotos, language)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h1 className="dl-detail-name dl-rise" style={rise()}>
              {name}
            </h1>
            <div className="dl-host dl-rise" style={rise()}>
              {tr(COPY.guidedBy, language)}
              <img src={HOST_AVATAR} alt="" />
              <strong>{tr(COPY.verifiedAstrologers, language)}</strong>
            </div>

            <h2 className="dl-h3 dl-rise" style={rise()}>
              {tr(COPY.about, language)} {name}
            </h2>
            <p className="dl-about dl-rise" style={rise()}>
              {tr(reading.about, language)}
            </p>

            <div className="dl-book dl-rise" style={rise()}>
              <div className="dl-book-price">
                {formatPrice(reading.price)} <span>{tr(COPY.perSession, language)}</span>
              </div>
              <div className="dl-book-dates">
                <div>
                  <div className="dl-book-label">{tr(COPY.consultVia, language)}</div>
                  <div className="dl-seg dl-seg--book" role="radiogroup" aria-label={tr(COPY.consultVia, language)}>
                    {(["chat", "call", "video"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        role="radio"
                        aria-checked={mode === m}
                        className={mode === m ? "is-on" : ""}
                        onClick={() => setMode(m)}
                      >
                        {tr(COPY[m], language)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="dl-book-label">{tr(COPY.duration, language)}</div>
                  <div className="dl-book-value">{tr(COPY.minutes30, language)}</div>
                </div>
              </div>
              <div className="dl-book-row">
                <div className="min-w-0">
                  <div className="dl-book-label">{tr(COPY.birthDetails, language)}</div>
                  <div className={`dl-book-value${birthSummary ? "" : " is-muted"}`}>
                    {birthSummary || tr(COPY.birthDetailsLater, language)}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className={`dl-book-cta${booking ? " is-booked" : ""}`}
                onClick={book}
                disabled={booking}
              >
                {booking && <Check strokeWidth={2.4} />}
                {tr(COPY.bookNow, language)}
              </button>
            </div>

            <div className="dl-rating-row dl-rise" style={rise()}>
              <div className="dl-rating-score">
                <strong>{reading.rating.toFixed(1)}</strong>
                <span>
                  ({reading.reviews} {tr(COPY.reviews, language)})
                </span>
                <span className="dl-red-stars" aria-hidden>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} strokeWidth={0} />
                  ))}
                </span>
              </div>
              <div className="dl-reviewers" aria-hidden>
                {REVIEWER_AVATARS.map((src) => (
                  <img key={src} src={src} alt="" />
                ))}
              </div>
              <button type="button" className="dl-rate-now" onClick={() => router.push(reading.href)}>
                {tr(COPY.rateNow, language)}
              </button>
            </div>

            <h2 className="dl-h3 dl-rise" style={rise()}>
              {tr(COPY.included, language)}
            </h2>
            <div className="dl-amenities dl-rise" style={rise()}>
              {AMENITIES.map(({ icon: Icon, label }) => (
                <div key={label.en} className="dl-amenity">
                  <Icon strokeWidth={1.3} />
                  {tr(label, language)}
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="dl-similar">
          <h2 className="dl-h2">{tr(COPY.similar, language)}</h2>
          <ReadingGrid
            key={reading.id}
            readings={similar}
            language={language}
            likedIds={likedIds}
            onToggleLike={onToggleLike}
            onOpen={onOpen}
          />
        </section>
      </div>
    </div>
  );
}
