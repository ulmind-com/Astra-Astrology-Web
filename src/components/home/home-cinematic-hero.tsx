"use client";

import * as React from "react";

import {
  CLOUD_IMAGE,
  HERO_SLIDES,
  RAIL_ORDER,
  tr,
} from "@/components/home/home-cinematic-data";
import type { AstrologyLanguage } from "@/types";

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

function computeRail(W: number, H: number, active: number): RailLayout {
  const A = clamp(96, 0.113 * W, 190);
  const I = clamp(46, 0.054 * W, 92);
  const G = Math.max(8, 0.009 * W);
  const cx = 0.855 * W;
  let y = 74 + 0.085 * H;

  const thumbs = RAIL_ORDER.map((slide) => {
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
  paused: boolean;
  children?: React.ReactNode;
}

export function CinematicHero({ language, paused, children }: HeroProps) {
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
    () => (size ? computeRail(size.w, size.h, railTarget) : null),
    [size, railTarget],
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

      const mask = "linear-gradient(to left, transparent 0%, transparent 100%)";
      incoming.style.webkitMaskImage = mask;
      incoming.style.maskImage = mask;
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
  const scheduleAuto = React.useCallback((delay: number) => {
    if (autoTimer.current) window.clearTimeout(autoTimer.current);
    autoTimer.current = window.setTimeout(() => {
      const e = engine.current;
      goTo((e.cur + 1) % HERO_SLIDES.length);
    }, delay);
  }, [goTo]);


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
      if (pausedRef.current) return;

      const e = engine.current;
      const sy = window.scrollY;
      const vh = window.innerHeight;
      const W = window.innerWidth;

      // Scroll choreography (skipped once the hero is far off screen).
      if (sy < vh * 1.6) {
        if (stackRef.current) stackRef.current.style.transform = `translate3d(0, ${sy * 0.42}px, 0)`;
        if (cloudsRef.current)
          cloudsRef.current.style.transform = `translate3d(0, ${-0.38 * sy}px, 0) scale(${1 + (0.35 * sy) / vh})`;
        if (cloudsTopRef.current) {
          cloudsTopRef.current.style.opacity = String(Math.min(1, sy / (0.45 * vh)));
          cloudsTopRef.current.style.transform = `translate3d(0, ${-0.25 * sy}px, 0)`;
        }
        if (railRef.current) {
          railRef.current.style.transform = `translate3d(0, ${0.2 * sy}px, 0)`;
          railRef.current.style.opacity = String(Math.max(0, 1 - sy / (0.5 * vh)));
        }
      }

      // Smoothed pointer parallax.
      e.px += (e.tx - e.px) * 0.05;
      e.py += (e.ty - e.py) * 0.05;
      const parX = e.px * 0.6;
      const parY = e.py * 0.5;

      if (e.animating) {
        const t = Math.min(1, (now - e.start) / WIPE_MS);
        const p = easeInOutCubic(t);
        const b = p * 135;
        const a = b - 35;
        const mid = b - 17.5;
        const incoming = slideRefs.current[e.to];
        const outgoing = slideRefs.current[e.from];
        const inPhoto = photoRefs.current[e.to];
        const outPhoto = photoRefs.current[e.from];

        if (incoming) {
          const mask = `linear-gradient(to left, #000 ${a}%, rgba(0,0,0,0.6) ${mid}%, transparent ${b}%)`;
          incoming.style.webkitMaskImage = mask;
          incoming.style.maskImage = mask;
        }
        if (inPhoto)
          inPhoto.style.transform = `translate(${2 * (1 - p) + parX * p}%, ${parY * p}%) scale(${1.12 - 0.08 * p})`;
        if (outPhoto)
          outPhoto.style.transform = `translate(${parX - 2 * p}%, ${parY}%) scale(${e.outBaseScale + 0.05 * p})`;

        if (mistRef.current) {
          const edgeX = W * (1 - mid / 100);
          mistRef.current.style.transform = `translate3d(${edgeX - W * 0.17}px, 0, 0)`;
          mistRef.current.style.opacity = String(0.95 * Math.sin(Math.PI * t));
        }

        if (t >= 1) {
          if (incoming) {
            incoming.style.webkitMaskImage = "";
            incoming.style.maskImage = "";
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
        const kb = Math.min(12, (now - e.settledAt) / 1000) * 0.0035;
        const photo = photoRefs.current[e.cur];
        if (photo) photo.style.transform = `translate(${parX}%, ${parY}%) scale(${1.04 + kb})`;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scheduleAuto]);

  const onThumb = (slide: number) => {
    goTo(slide);
  };

  const caption = HERO_SLIDES[captionIdx];

  return (
    <div className={`dl-hero-wrap${isIn ? " is-in" : ""}`}>
      <section ref={heroRef} className="dl-hero" aria-roledescription="carousel">
        <div ref={stackRef} className="dl-stack">
          {HERO_SLIDES.map((slide, i) => {
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
                  style={{ backgroundImage: `url(${slide.photo})`, backgroundPosition: slide.position }}
                />
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
          <div className="dl-cloud dl-cloud--back" style={{ backgroundImage: `url(${CLOUD_IMAGE})` }} />
          <div className="dl-cloud dl-cloud--front" style={{ backgroundImage: `url(${CLOUD_IMAGE})` }} />
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
                const slide = HERO_SLIDES[t.slide];
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
