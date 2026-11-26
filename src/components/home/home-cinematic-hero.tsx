"use client";

import * as React from "react";
import Image from "next/image";

import {
  CLOUD_IMAGE,
  HERO_SLIDES,
  mapCmsToHeroSlides,
  RAIL_ORDER,
  tr,
} from "@/components/home/home-cinematic-data";
import type { AstrologyLanguage } from "@/types";
import type { CinematicHeroSlideCMS } from "@/lib/api";

const WIPE_MS = 1250;
const AUTO_MS = 5200;
const CAPTION_DELAY_MS = 650;
const INTRO_MS = 250;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function clamp(min: number, v: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

interface RailLayout {
  thumbs: { slide: number; left: number; top: number; size: number }[];
  cx: number;
  cy: number;
  r1: number;
  r2: number;
  connector: { left: number; top: number; width: number };
  caption: { left: number; top: number; bar: number };
}

function computeRail(W: number, H: number, active: number, railOrder: number[] = RAIL_ORDER): RailLayout {
  const A = clamp(96, 0.113 * W, 190);
  const I = clamp(46, 0.054 * W, 92);
  const G = Math.max(8, 0.009 * W);
  const cx = 0.855 * W;
  let y = 74 + 0.085 * H;

  const thumbs = railOrder.map((slide) => {
    const size = slide === active ? A : I;
    const t = { slide, left: cx - size / 2, top: y, size };
    y += size + G;
    return t;
  });

  const act = thumbs.find((t) => t.slide === active) ?? thumbs[0];
  const cy = act.top + A / 2;
  const length = Math.max(40, 0.047 * W);
  const connectorRight = act.left - 0.008 * W;
  const connectorLeft = connectorRight - length;

  return {
    thumbs,
    cx,
    cy,
    r1: A / 2 + 0.05 * W,
    r2: A / 2 + 0.108 * W,
    connector: { left: connectorLeft, top: cy - 1.5, width: length },
    caption: { left: connectorLeft - 16, top: cy, bar: Math.max(84, 0.065 * W) },
  };
}

interface HeroProps {
  language: AstrologyLanguage;
  /** Pauses the render loop while the detail page covers the hero. */
  paused?: boolean;
  slides?: CinematicHeroSlideCMS[];
  children?: React.ReactNode;
}

export function CinematicHero({ language, paused = false, slides, children }: HeroProps) {
  const heroSlides = React.useMemo(() => mapCmsToHeroSlides(slides), [slides]);
  const railOrder = React.useMemo(
    () => heroSlides.map((_, idx) => idx).reverse(),
    [heroSlides],
  );

  const heroRef = React.useRef<HTMLElement>(null);
  const stackRef = React.useRef<HTMLDivElement>(null);
  const mistRef = React.useRef<HTMLDivElement>(null);
  const cloudsRef = React.useRef<HTMLDivElement>(null);
  const cloudsTopRef = React.useRef<HTMLDivElement>(null);
  const railRef = React.useRef<HTMLDivElement>(null);
  const slideRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const photoRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const [isIn, setIsIn] = React.useState(false);
  const [railTarget, setRailTarget] = React.useState(0);
  const [captionIdx, setCaptionIdx] = React.useState(0);
  const [captionShown, setCaptionShown] = React.useState(false);
  const [size, setSize] = React.useState<{ w: number; h: number } | null>(null);

  const pausedRef = React.useRef(paused);
  React.useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const engine = React.useRef({
    cur: 0,
    from: 0,
    to: 0,
    start: 0,
    animating: false,
    settledAt: 0,
    outBaseScale: 1.04,
    px: 0,
    py: 0,
    tx: 0,
    ty: 0,
    lastSy: -1,
    lastAnimWrite: -1,
  });
  const autoTimer = React.useRef<number | null>(null);
  const captionTimer = React.useRef<number | null>(null);

  /* ---------- size ---------- */
  React.useEffect(() => {
    const measure = () => {
      const h = heroRef.current?.offsetHeight ?? window.innerHeight;
      setSize({ w: window.innerWidth, h });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const layout = React.useMemo(
    () => (size ? computeRail(size.w, size.h, railTarget, railOrder) : null),
    [size, railTarget, railOrder],
  );

  /* ---------- slide change ---------- */
  const goTo = React.useCallback(
    (next: number) => {
      const e = engine.current;
      if (e.animating || next === e.cur) return;
      const incoming = slideRefs.current[next];
      const outgoing = slideRefs.current[e.cur];
      if (!incoming || !outgoing) return;

      if (autoTimer.current) window.clearTimeout(autoTimer.current);

      const kb = Math.min(12, (performance.now() - e.settledAt) / 1000) * 0.0035;
      e.outBaseScale = 1.04 + kb;
      e.from = e.cur;
      e.to = next;
      e.start = performance.now();
      e.animating = true;

      // Clip-path hardware scissor wipe avoids Chromium/Android GPU mask-image
      // texture re-allocation and tile dropouts during slide transitions.
      incoming.style.clipPath = "inset(0 0 0 100%)";
      incoming.classList.add("is-incoming");
      outgoing.classList.remove("is-current");
      outgoing.classList.add("is-outgoing");

      setRailTarget(next);
      setCaptionShown(false);
      if (captionTimer.current) window.clearTimeout(captionTimer.current);
      captionTimer.current = window.setTimeout(() => {
        setCaptionIdx(next);
        setCaptionShown(true);
      }, CAPTION_DELAY_MS);
    },
    [],
  );
  const scheduleAuto = React.useCallback(
    (delay: number) => {
      if (autoTimer.current) window.clearTimeout(autoTimer.current);
      const attempt = () => {
        if (document.hidden || pausedRef.current) {
          autoTimer.current = window.setTimeout(attempt, 1000);
          return;
        }
        const e = engine.current;
        goTo((e.cur + 1) % heroSlides.length);
      };
      autoTimer.current = window.setTimeout(attempt, delay);
    },
    [goTo, heroSlides.length],
  );


  /* ---------- intro ---------- */
  React.useEffect(() => {
    engine.current.settledAt = performance.now();
    const t1 = window.setTimeout(() => setIsIn(true), INTRO_MS);
    const t2 = window.setTimeout(() => setCaptionShown(true), 900);
    scheduleAuto(INTRO_MS + AUTO_MS);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      if (autoTimer.current) window.clearTimeout(autoTimer.current);
      if (captionTimer.current) window.clearTimeout(captionTimer.current);
    };
  }, [scheduleAuto]);

  /* ---------- pointer parallax ---------- */
  React.useEffect(() => {
    const onMove = (ev: PointerEvent) => {
      if (ev.pointerType === "touch") return;
      const e = engine.current;
      e.tx = (ev.clientX / window.innerWidth) * 2 - 1;
      e.ty = (ev.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  /* ---------- render loop ---------- */
  React.useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (pausedRef.current || document.hidden) return;

      const e = engine.current;
      const sy = window.scrollY;
      const vh = window.innerHeight;
      const W = window.innerWidth;

      // Scroll choreography (updated only when scrollY actually changes).
      const clampedSy = Math.min(sy, vh * 1.6);
      if (sy !== e.lastSy) {
        e.lastSy = sy;
        if (stackRef.current) stackRef.current.style.transform = `translate3d(0, ${clampedSy * 0.42}px, 0)`;
        if (cloudsTopRef.current) {
          cloudsTopRef.current.style.opacity = String(Math.min(1, clampedSy / (0.45 * vh)));
          cloudsTopRef.current.style.transform = `translate3d(0, ${-0.25 * clampedSy}px, 0)`;
        }
        if (railRef.current) {
          railRef.current.style.transform = `translate3d(0, ${0.2 * clampedSy}px, 0)`;
          railRef.current.style.opacity = String(Math.max(0, 1 - clampedSy / (0.5 * vh)));
        }
      }

      // If scrolled completely past the hero and not wiping, skip per-frame hero photo math.
      if (!e.animating && sy > vh * 1.2) return;

      // Smoothed pointer parallax.
      e.px += (e.tx - e.px) * 0.05;
      e.py += (e.ty - e.py) * 0.05;
      const parX = e.px * 0.6;
      const parY = e.py * 0.5;

      // 2.5D Holographic inverse cloud parallax response
      const pointerSettled = Math.abs(e.tx - e.px) < 0.001 && Math.abs(e.ty - e.py) < 0.001;
      if (cloudsRef.current && (!pointerSettled || sy !== e.lastSy)) {
        const cloudParX = parX * -0.75;
        const cloudParY = parY * -0.4;
        const scrollScale = 1 + (0.35 * clampedSy) / vh;
        cloudsRef.current.style.transform = `translate3d(${cloudParX}%, ${-0.38 * clampedSy + cloudParY * 12}px, 0) scale(${scrollScale})`;
      }

      if (e.animating) {
        const t = Math.min(1, (now - e.start) / WIPE_MS);
        const p = easeInOutCubic(t);
        const edgePct = (1 - p) * 100;
        const incoming = slideRefs.current[e.to];
        const outgoing = slideRefs.current[e.from];
        const inPhoto = photoRefs.current[e.to];
        const outPhoto = photoRefs.current[e.from];

        if (incoming) {
          incoming.style.clipPath = `inset(0 0 0 ${edgePct}%)`;
        }
        if (inPhoto)
          inPhoto.style.transform = `translate3d(${2 * (1 - p) + parX * p}%, ${parY * p}%, 0) scale(${1.12 - 0.08 * p})`;
        if (outPhoto)
          outPhoto.style.transform = `translate3d(${parX - 2 * p}%, ${parY}%, 0) scale(${e.outBaseScale + 0.05 * p})`;

        if (mistRef.current) {
          const edgeX = W * (1 - p);
          mistRef.current.style.transform = `translate3d(${edgeX - W * 0.17}px, 0, 0)`;
          mistRef.current.style.opacity = String(0.95 * Math.sin(Math.PI * t));
        }

        if (t >= 1) {
          if (incoming) {
            incoming.style.clipPath = "";
            incoming.classList.remove("is-incoming");
            incoming.classList.add("is-current");
          }
          if (outgoing) outgoing.classList.remove("is-outgoing");
          if (outPhoto) outPhoto.style.transform = "";
          if (mistRef.current) mistRef.current.style.opacity = "0";
          e.cur = e.to;
          e.animating = false;
          e.settledAt = now;
          scheduleAuto(AUTO_MS);
        }
      } else {
        const elapsedSec = (now - e.settledAt) / 1000;
        const pointerSettled = Math.abs(e.tx - e.px) < 0.001 && Math.abs(e.ty - e.py) < 0.001;
        // Skip redundant style writes once Ken Burns hits its 12s cap and pointer is idle.
        if (elapsedSec <= 12.1 || !pointerSettled || e.lastAnimWrite < e.settledAt) {
          e.lastAnimWrite = now;
          const kb = Math.min(12, elapsedSec) * 0.0035;
          const photo = photoRefs.current[e.cur];
          if (photo) photo.style.transform = `translate3d(${parX}%, ${parY}%, 0) scale(${1.04 + kb})`;
        }
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scheduleAuto]);

  const onThumb = (slide: number) => {
    goTo(slide);
  };

  const caption = heroSlides[captionIdx] ?? heroSlides[0];

  return (
    <div className={`dl-hero-wrap${isIn ? " is-in" : ""}`}>
      <section ref={heroRef} className="dl-hero" aria-roledescription="carousel">
        <div ref={stackRef} className="dl-stack">
          {heroSlides.map((slide, i) => {
            const lines = (slide.title[language] ?? slide.title.en).map((l) => l.split(" "));
            const offsets = lines.map((_, li) => lines.slice(0, li).reduce((n, w) => n + w.length, 0));
            return (
              <div
                key={slide.id}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                className={i === 0 ? "dl-slide is-current" : "dl-slide"}
                aria-hidden={i !== railTarget}
              >
                <div
                  ref={(el) => {
                    photoRefs.current[i] = el;
                  }}
                  className="dl-photo"
                >
                  <Image
                    src={slide.photo}
                    alt=""
                    fill
                    loading={i === 0 ? undefined : "eager"}
                    decoding="sync"
                    priority={i === 0}
                    sizes="100vw"
                    unoptimized
                    draggable={false}
                    className="dl-photo-img"
                    style={{ objectPosition: slide.position }}
                  />
                </div>
                <div className="dl-tint" />
                {React.createElement(
                  i === 0 ? "h1" : "p",
                  { className: `dl-title${slide.layout === "two" ? " is-two" : ""}` },
                  lines.map((line, li) => (
                    <span key={li} className="dl-title-line">
                      {line.map((word, wi) => {
                        const idx = offsets[li] + wi;
                        return (
                          <span key={wi} className="dl-word">
                            <span className="dl-word-in" style={{ "--i": idx } as React.CSSProperties}>
                              {word}
                            </span>
                          </span>
                        );
                      })}
                    </span>
                  )),
                )}
              </div>
            );
          })}
          <div ref={mistRef} className="dl-mist" aria-hidden />
        </div>

        <div ref={cloudsTopRef} className="dl-clouds-top" aria-hidden>
          <div className="dl-cloud" style={{ backgroundImage: `url(${CLOUD_IMAGE})` }} />
        </div>

        <div ref={cloudsRef} className="dl-clouds" aria-hidden>
          <div className="dl-cloud-glow" />
          <div className="dl-cloud dl-cloud--deep" style={{ backgroundImage: `url(${CLOUD_IMAGE})` }} />
          <div className="dl-cloud dl-cloud--mid" style={{ backgroundImage: `url(${CLOUD_IMAGE})` }} />
          <div className="dl-cloud dl-cloud--front" style={{ backgroundImage: `url(${CLOUD_IMAGE})` }} />
          <div className="dl-cloud-shimmer" />
        </div>

        <div className="dl-fade" aria-hidden />

        <div ref={railRef} className="dl-rail">
          {layout && (
            <>
              {[layout.r1, layout.r2].map((r, i) => (
                <span
                  key={i}
                  className="dl-ring"
                  aria-hidden
                  style={{ left: layout.cx - r, top: layout.cy - r, width: r * 2, height: r * 2 }}
                />
              ))}

              <span
                className={`dl-connector${captionShown ? " is-shown" : ""}`}
                aria-hidden
                style={{
                  left: layout.connector.left,
                  top: layout.connector.top,
                  width: layout.connector.width,
                }}
              />

              <div
                className={`dl-caption${captionShown ? " is-shown" : ""}`}
                style={{ left: layout.caption.left, top: layout.caption.top }}
                aria-live="polite"
              >
                <span className="dl-caption-bar" style={{ height: layout.caption.bar }} />
                <div className="dl-caption-text">
                  <p className="dl-caption-heading">{tr(caption.heading, language)}</p>
                  <p className="dl-caption-desc">{tr(caption.description, language)}</p>
                </div>
              </div>

              {layout.thumbs.map((t, order) => {
                const slide = heroSlides[t.slide] ?? heroSlides[0];
                return (
                  <button
                    key={slide.id}
                    type="button"
                    className={`dl-thumb${t.slide === railTarget ? " is-active" : ""}`}
                    style={{ left: t.left, top: t.top, width: t.size, height: t.size }}
                    onClick={() => onThumb(t.slide)}
                    aria-label={tr(slide.heading, language)}
                    aria-pressed={t.slide === railTarget}
                  >
                    <span className="dl-thumb-pop" style={{ "--i": order } as React.CSSProperties}>
                      <span className="dl-thumb-halo" />
                      <span className="dl-thumb-face" style={{ backgroundImage: `url(${slide.thumb})` }} />
                    </span>
                  </button>
                );
              })}
            </>
          )}
        </div>
      </section>
      {children}
    </div>
  );
}
