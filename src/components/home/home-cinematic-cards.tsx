"use client";

import * as React from "react";
import { Heart, MapPin, Star } from "lucide-react";

import { COPY, formatPrice, tr, type Reading } from "@/components/home/home-cinematic-data";
import type { AstrologyLanguage } from "@/types";

export function HeartButton({
  liked,
  onToggle,
  label,
}: {
  liked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className={`dl-heart${liked ? " is-liked" : ""}`}
      aria-pressed={liked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <Heart strokeWidth={1.8} />
    </button>
  );
}

interface CardProps {
  reading: Reading;
  language: AstrologyLanguage;
  column: number;
  liked: boolean;
  onToggleLike: (id: string) => void;
  onOpen: (reading: Reading, photoEl: HTMLElement) => void;
}

export function ReadingCard({ reading, language, column, liked, onToggleLike, onOpen }: CardProps) {
  const ref = React.useRef<HTMLElement>(null);
  const photoRef = React.useRef<HTMLDivElement>(null);
  const name = tr(reading.name, language);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const open = () => {
    if (ref.current) onOpen(reading, ref.current);
  };

  return (
    <article
      ref={ref}
      className="dl-card"
      style={{ "--col": column } as React.CSSProperties}
      role="link"
      tabIndex={0}
      aria-label={name}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
    >
      <div ref={photoRef} className="dl-card-photo" style={{ backgroundImage: `url(${reading.image})` }} />
      <div className="dl-card-shade" />
      <span className="dl-price">
        {formatPrice(reading.price)}
        <span>{tr(COPY.perSession, language)}</span>
      </span>
      <HeartButton liked={liked} onToggle={() => onToggleLike(reading.id)} label={name} />
      <div className="dl-card-info">
        <h3 className="dl-card-name">{name}</h3>
        <div className="dl-card-place">
          <MapPin strokeWidth={1.7} />
          {tr(reading.place, language)}
        </div>
        <div className="dl-card-rating" aria-label={`${reading.rating} / 5`}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} strokeWidth={0} />
          ))}
          <span>{reading.rating.toFixed(1)}</span>
        </div>
      </div>
    </article>
  );
}

export function ReadingGrid({
  readings,
  ...rest
}: Omit<CardProps, "reading" | "column" | "liked"> & {
  readings: Reading[];
  likedIds: Set<string>;
}) {
  const { likedIds, ...cardProps } = rest;
  return (
    <div className="dl-grid">
      {readings.map((r, i) => (
        <ReadingCard
          key={r.id}
          reading={r}
          column={i % 4}
          liked={likedIds.has(r.id)}
          {...cardProps}
        />
      ))}
    </div>
  );
}
