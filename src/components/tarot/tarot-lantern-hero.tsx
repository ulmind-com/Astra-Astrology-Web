"use client";

import * as React from "react";

import "./tarot-lantern-hero.css";

const SKY_IMG =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261127_092842_21c23a83-852d-488c-be8e-09434b6bc970.png&w=2688&q=85";
const ARCADE_IMG =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261127_092851_636d2bca-adf5-470e-ad78-aeba2b9a59b9.png&w=2688&q=85";
const STATUE_IMG =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261127_092859_29381ed5-b5f0-4343-8606-3fc0734faea9.png&w=2048&q=85";

interface TarotLanternHeroProps {
  title: string;
}

function measureBaseRatio(fontShorthand: string, fallback: number): number {
  if (typeof document === "undefined") return fallback;
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return fallback;
    ctx.font = fontShorthand;
    const m = ctx.measureText("Hxg");
    const a = m.fontBoundingBoxAscent;
    const d = m.fontBoundingBoxDescent;
    if (typeof a === "number" && typeof d === "number" && a + d > 0) {
      return ((100 - (a + d)) / 2 + a) / 100;
    }
  } catch {
    /* canvas metrics unavailable */
  }
  return fallback;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function TarotLanternHero({ title }: TarotLanternHeroProps) {
  const stageRef = React.useRef<HTMLElement>(null);
  const frameRef = React.useRef<HTMLDivElement>(null);
  const orbRef = React.useRef<HTMLDivElement>(null);
  const monogramRef = React.useRef<HTMLAnchorElement>(null);
  const litChakraHostRef = React.useRef<HTMLDivElement>(null);
  const layerRefs = React.useRef<{
    sky: HTMLDivElement[];
    chakra: HTMLDivElement[];
    arcade: HTMLDivElement[];
    statue: HTMLDivElement[];
  }>({ sky: [], chakra: [], arcade: [], statue: [] });

  const [ready, setReady] = React.useState(false);
  const [hasPointer, setHasPointer] = React.useState(false);
  const [glowLogoReady, setGlowLogoReady] = React.useState(false);

  const metricsRef = React.useRef({
    u: 1,
    fx: 0,
    fy: 0,
    halfVis: 720,
    vw: 1440,
    vh: 720,
    italBase: 0.68,
  });

  const motionRef = React.useRef({
    targetX: 720,
    targetY: 470,
    posX: 720,
    posY: 470,
    par: 0,
    inView: true,
    reducedMotion: false,
  });

  // Compute responsive 1440x960 architecture metrics & monogram baseline
  const runLayout = React.useCallback(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    if (!stage || !frame) return;

    const rect = stage.getBoundingClientRect();
    const vw = Math.max(320, rect.width || window.innerWidth);
    const vh = Math.max(460, rect.height || window.innerHeight);

    const extra = Math.min(250, Math.max(0, (vw / vh - 1.6) * 400));
    const u = Math.max(vw / (1440 + extra), vh / 960);
    const fx = (vw - 1440 * u) / 2;
    const fy = Math.min(0, Math.max(vh - 960 * u, vh - 900 * u, -42 * u));
    const halfVis = vw / (2 * u);

    const italBase = measureBaseRatio('normal 400 100px "Italianno", Georgia, serif', 0.68);

    metricsRef.current = { u, fx, fy, halfVis, vw, vh, italBase };

    stage.style.setProperty("--u", String(u));
    frame.style.transform = `translate3d(${fx}px, ${fy}px, 0)`;

    const radius = Math.min(320 * u, 0.45 * Math.min(vw, 1.2 * vh));
    stage.style.setProperty("--r", `${radius.toFixed(2)}px`);

    const mono = monogramRef.current;
    if (mono) {
      const qfs = Math.max(vh < 420 ? 30 : 34, 44 * u);
      mono.style.fontSize = `${qfs.toFixed(2)}px`;
      mono.style.left = `${(fx + 720 * u).toFixed(2)}px`;
      const monoTop = Math.min(fy + 782 * u + 0.5 * qfs - italBase * qfs, vh - qfs - 66);
      mono.style.top = `${monoTop.toFixed(2)}px`;
    }
  }, []);

  // Mount glowdots GPU particle DivinLink logo inside the central arch chakra halo
  React.useEffect(() => {
    const host = litChakraHostRef.current;
    if (!host) return;

    let cancelled = false;
    let instance: { destroy: () => void } | null = null;

    void import("glowdots")
      .then(({ logo }) => {
        if (cancelled || !litChakraHostRef.current) return;
        instance = logo(litChakraHostRef.current, {
          source: "/logo.png",
          preserveColors: true,
          bloom: 0.45,
          bloomRadius: 9,
          count: 34000,
          size: 1.55,
          intensity: 1.38,
          softness: 0.32,
          dust: 0.12,
          depth: 0.04,
          scale: 0.94,
          tilt: 0,
          rotationSpeed: 0,
          pointerTilt: 0,
          orbit: false,
          interaction: "repel",
          interactionRadius: 0.28,
          interactionStrength: 0.4,
          trailMemory: 0.3,
          clickBurst: true,
          entranceDuration: 0.85,
          pauseOffscreen: true,
          respectReducedMotion: true,
          adaptive: true,
          maxDpr: 2,
          pointerTarget: "window",
          on: {
            "asset:loaded": () => {
              if (!cancelled) setGlowLogoReady(true);
            },
            "asset:error": () => {
              if (!cancelled) setGlowLogoReady(false);
            },
            unsupported: () => {
              if (!cancelled) setGlowLogoReady(false);
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) setGlowLogoReady(false);
      });

    return () => {
      cancelled = true;
      try {
        instance?.destroy();
      } catch {
        /* ignore cleanup race */
      }
      instance = null;
    };
  }, []);

  // SSR-safe image readiness detection + 2.5s failsafe
  React.useEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      setReady(true);
      return;
    }

    const imgs = Array.from(frame.querySelectorAll("img"));
    if (imgs.length === 0) {
      setReady(true);
      return;
    }

    let remaining = 0;
    const done = () => {
      remaining -= 1;
      if (remaining <= 0) setReady(true);
    };

    const listeners: Array<() => void> = [];
    for (const img of imgs) {
      if (img.complete) continue;
      remaining += 1;
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
      listeners.push(() => {
        img.removeEventListener("load", done);
        img.removeEventListener("error", done);
      });
    }

    if (remaining === 0) {
      setReady(true);
    }

    const failsafe = window.setTimeout(() => setReady(true), 2500);
    return () => {
      window.clearTimeout(failsafe);
      listeners.forEach((off) => off());
    };
  }, []);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionRef.current.reducedMotion = mq.matches;
    const onMqChange = () => {
      motionRef.current.reducedMotion = mq.matches;
    };
    mq.addEventListener?.("change", onMqChange);

    runLayout();
    window.addEventListener("resize", runLayout);
    void document.fonts?.ready?.then(() => runLayout());

    const stageEl = stageRef.current;
    let io: IntersectionObserver | null = null;
    if (stageEl && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => {
          motionRef.current.inView = Boolean(entry?.isIntersecting);
        },
        { threshold: 0.01 },
      );
      io.observe(stageEl);
    }

    const lastMouseRef = { x: -1, y: -1 };

    const onPointerMove = (e: PointerEvent) => {
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const { u, fx, fy } = metricsRef.current;
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;

      if (localY >= -20 && localY <= rect.height + 20) {
        motionRef.current.targetX = (localX - fx) / u;
        motionRef.current.targetY = (localY - fy) / u;
      }

      if (e.pointerType === "mouse") {
        lastMouseRef.x = e.clientX;
        lastMouseRef.y = e.clientY;
        const insideHero =
          localX >= 0 && localX <= rect.width && localY >= 0 && localY <= rect.height;
        setHasPointer(insideHero);
        if (orbRef.current) {
          orbRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        }
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;
      const { u, fx, fy } = metricsRef.current;
      motionRef.current.targetX = (e.clientX - rect.left - fx) / u;
      motionRef.current.targetY = (e.clientY - rect.top - fy) / u;
    };

    const onScroll = () => {
      const stage = stageRef.current;
      if (!stage || lastMouseRef.x < 0) return;
      const rect = stage.getBoundingClientRect();
      const inside =
        lastMouseRef.x >= rect.left &&
        lastMouseRef.x <= rect.right &&
        lastMouseRef.y >= rect.top &&
        lastMouseRef.y <= rect.bottom;
      setHasPointer(inside);
    };

    const onLeave = () => setHasPointer(false);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("mouseleave", onLeave);

    let rafId = 0;
    let lastTs = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTs) / 1000));
      lastTs = now;

      const m = motionRef.current;
      const { u, halfVis } = metricsRef.current;
      const stage = stageRef.current;

      if (stage && m.inView) {
        if (m.reducedMotion) {
          m.posX = m.targetX;
          m.posY = m.targetY;
          m.par = 0;
        } else {
          const k = 1 - Math.exp(-dt / 0.13);
          m.posX += (m.targetX - m.posX) * k;
          m.posY += (m.targetY - m.posY) * k;

          const kp = 1 - Math.exp(-dt / 0.18);
          m.par += (m.posX - 720 - m.par) * kp;
        }

        stage.style.setProperty("--mx", `${((m.posX + 400) * u).toFixed(2)}px`);
        stage.style.setProperty("--my", `${(m.posY * u).toFixed(2)}px`);

        const setLayerShift = (els: HTMLDivElement[], gain: number, halfWidth: number) => {
          const lim = Number.isFinite(halfWidth) ? Math.max(0, halfWidth - halfVis) : Infinity;
          const shiftUnits = m.reducedMotion ? 0 : clamp(gain * m.par, -lim, lim);
          const tx = `${(shiftUnits * u).toFixed(2)}px`;
          for (const el of els) {
            if (el) el.style.setProperty("--tx", tx);
          }
        };

        setLayerShift(layerRefs.current.sky, -0.28, 1120);
        setLayerShift(layerRefs.current.chakra, -0.14, 1120);
        setLayerShift(layerRefs.current.arcade, 0.175, 848.85);
        setLayerShift(layerRefs.current.statue, 0.079, Infinity);
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    let ro: ResizeObserver | null = null;
    if (stageEl && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => runLayout());
      ro.observe(stageEl);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", runLayout);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("mouseleave", onLeave);
      mq.removeEventListener?.("change", onMqChange);
      io?.disconnect();
      ro?.disconnect();
    };
  }, [runLayout]);

  const registerLayer =
    (key: "sky" | "chakra" | "arcade" | "statue", stackIdx: 0 | 1) => (el: HTMLDivElement | null) => {
      if (el) layerRefs.current[key][stackIdx] = el;
    };

  const renderStack = (id: "dark" | "lit", stackIdx: 0 | 1) => (
    <div id={id} className={`tarot-stack tarot-stack--${id}`}>
      <div className="L sky" data-k="-0.28" ref={registerLayer("sky", stackIdx)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SKY_IMG} alt="" fetchPriority={id === "dark" ? "high" : undefined} />
      </div>
      <div
        id={id === "lit" ? "brand" : undefined}
        className="L chakra"
        data-k="-0.14"
        ref={(el) => {
          registerLayer("chakra", stackIdx)(el);
          if (id === "lit") {
            litChakraHostRef.current = el;
          }
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt=""
          data-hidden={id === "lit" && glowLogoReady ? "true" : "false"}
          fetchPriority={id === "dark" ? "high" : undefined}
          className="transition-opacity duration-500"
        />
      </div>
      <div className="L arcade" data-k="0.175" ref={registerLayer("arcade", stackIdx)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ARCADE_IMG} alt="" fetchPriority={id === "dark" ? "high" : undefined} />
      </div>
      <div className="L statue" data-k="0.079" ref={registerLayer("statue", stackIdx)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={STATUE_IMG} alt="" fetchPriority={id === "dark" ? "high" : undefined} />
      </div>
    </div>
  );

  return (
    <section
      ref={stageRef}
      className="tarot-lantern-stage"
      data-ready={ready ? "true" : "false"}
      data-has-pointer={hasPointer ? "true" : "false"}
      aria-label={title}
    >
      <h1 className="sr-only">{title}</h1>

      <div ref={frameRef} className="tarot-lantern-frame" aria-hidden="true">
        {renderStack("dark", 0)}
        {renderStack("lit", 1)}
        <div className="tarot-lantern-glow" />
      </div>

      <div className="tarot-hero-notch-scrim" aria-hidden="true" />
      <div className="tarot-hero-cream-fade" aria-hidden="true" />

      {/* Italianno calligraphic DivinLink wordmark resting at the oasis pool edge */}
      <a
        ref={monogramRef}
        href="#tarot-workspace"
        aria-label="Enter DivinLink Tarot Oracle"
        className="tarot-monogram"
      >
        DivinLink
      </a>

      {/* Instant magnetic diya cursor orb */}
      <div ref={orbRef} className="tarot-cursor-orb" aria-hidden="true" />
    </section>
  );
}
