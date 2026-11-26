"use client";

/**
 * DivinLink motion layer, mounted once in the root layout.
 *
 * 1. The grey dot cursor from the home page, on every page, for fine pointers.
 *    It moves with `transform` only and listens passively, so it costs one
 *    composited layer and no layout.
 *
 * 2. Scroll reveals for every page without editing every page: sections and
 *    grid items that start below the fold rise 26px and fade in when they
 *    scroll into view, grid items staggered 90ms per column like the home
 *    grid. Anything already on screen is left alone, so server-rendered
 *    content never flashes. The reveal uses the individual `translate`
 *    property, never `transform`, so it composes with whatever transform an
 *    element already has and leaves nothing behind once it finishes.
 *
 * 3. A short entrance for the page content on client-side navigation.
 */

import { usePathname } from "next/navigation";
import * as React from "react";

const CLICKABLE =
  "a, button, [role='button'], [role='link'], [role='tab'], [role='option'], input, select, textarea, label, summary";

const SKIP_ROUTES = ["/call", "/chat"];

/** Containers whose contents are never auto-revealed. */
const EXCLUDED =
  "header, nav, footer, [role='dialog'], [aria-modal='true'], .dl-hero-wrap, .dl-stays, .dl-detail, .dl-steps, .dl-spot-frame, .dl-marquee, [data-no-reveal], .reveal, .stagger-group, .reveal-cascade, [data-site-rail]";

const MAX_PER_SCAN = 400;

function useFinePointer(): boolean {
  const [fine, setFine] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine;
}

function Cursor() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const html = document.documentElement;
    html.classList.add("dl-cursor-on");
    if (new URLSearchParams(window.location.search).has("rec")) el.classList.add("is-rec");

    let x = -100;
    let y = -100;
    let raf = 0;
    const paint = () => {
      raf = 0;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
      el.classList.add("is-visible");
      const target = e.target as Element | null;
      el.classList.toggle("is-hover", Boolean(target?.closest?.(CLICKABLE)));
    };
    const onDown = () => el.classList.add("is-down");
    const onUp = () => el.classList.remove("is-down");
    const onLeave = () => el.classList.remove("is-visible");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("blur", onLeave);
    html.addEventListener("pointerleave", onLeave);
    return () => {
      html.classList.remove("dl-cursor-on");
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onLeave);
      html.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ref} className="dl-cursor" aria-hidden />;
}

function columnsOf(parent: Element): number {
  const cols = getComputedStyle(parent).gridTemplateColumns;
  if (!cols || cols === "none") return 1;
  return Math.max(1, cols.split(" ").filter(Boolean).length);
}

function useScrollReveal(pathname: string) {
  React.useEffect(() => {
    if (SKIP_ROUTES.some((r) => pathname.startsWith(r))) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const seen = new WeakSet<Element>();
    const pending = new Set<Element>();

    const finish = (el: HTMLElement) => {
      el.classList.remove("dl-rv", "dl-rv-in");
      el.style.removeProperty("--dl-rv-delay");
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          pending.delete(el);
          el.classList.add("dl-rv-in");
          const done = () => finish(el);
          el.addEventListener("transitionend", done, { once: true });
          // Fallback in case no transition fires (display changes, etc.).
          window.setTimeout(done, 1600);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.01 },
    );

    const insidePending = (el: Element): boolean => {
      for (const p of pending) if (p !== el && p.contains(el)) return true;
      return false;
    };

    const scan = () => {
      const vh = window.innerHeight;
      const candidates = document.querySelectorAll<HTMLElement>(
        "body section, body [class*='grid'] > *",
      );
      let count = 0;
      for (const el of candidates) {
        if (count >= MAX_PER_SCAN) break;
        if (seen.has(el)) continue;
        seen.add(el);
        if (el.closest(EXCLUDED)) continue;

        const rect = el.getBoundingClientRect();
        // Already visible, or not laid out: leave it exactly as rendered.
        if (rect.top < vh * 0.94 || rect.height === 0) continue;
        if (insidePending(el)) continue;

        const cs = getComputedStyle(el);
        if (cs.position === "fixed" || cs.position === "sticky") continue;
        if (cs.translate !== "none" && cs.translate !== "") continue;
        if (cs.opacity === "0" || cs.display === "contents") continue;

        const parent = el.parentElement;
        if (parent && el.tagName !== "SECTION" && getComputedStyle(parent).display.includes("grid")) {
          const cols = columnsOf(parent);
          const index = Array.prototype.indexOf.call(parent.children, el) as number;
          el.style.setProperty("--dl-rv-delay", `${(index % cols) * 90}ms`);
        } else if (parent && el.tagName !== "SECTION") {
          // A child of something whose class merely mentions "grid" but is
          // not laid out as one: not a card, skip it.
          continue;
        }

        el.classList.add("dl-rv");
        pending.add(el);
        io.observe(el);
        count++;
      }
    };

    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        scan();
      });
    };

    // First pass after the route has painted, then whenever content arrives.
    const t = window.setTimeout(schedule, 60);
    const mo = new MutationObserver(schedule);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(t);
      if (raf) cancelAnimationFrame(raf);
      mo.disconnect();
      io.disconnect();
      for (const el of pending) finish(el as HTMLElement);
      pending.clear();
    };
  }, [pathname]);
}

function usePageEntrance(pathname: string) {
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (SKIP_ROUTES.some((r) => pathname.startsWith(r))) return;
    const html = document.documentElement;
    html.classList.remove("dl-page-in");
    // Force a restart of the entrance for consecutive navigations.
    void html.offsetWidth;
    html.classList.add("dl-page-in");
    const t = window.setTimeout(() => html.classList.remove("dl-page-in"), 900);
    return () => window.clearTimeout(t);
  }, [pathname]);
}

export function DivinLinkMotion() {
  const pathname = usePathname() ?? "/";
  useScrollReveal(pathname);
  usePageEntrance(pathname);
  // Custom circle cursor removed per user request - standard native OS cursor restored
  return null;
}
