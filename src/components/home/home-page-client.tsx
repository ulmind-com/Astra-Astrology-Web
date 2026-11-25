"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";

import "@/components/home/home-cinematic.css";
import { AppDownloadSection } from "@/components/home/app-download-section";
import { AstrologyPredictionZodiac } from "@/components/home/astrology-prediction-zodiac";
import { AstroyogiHeader } from "@/components/home/astroyogi-header";
import { CoursesSection } from "@/components/home/courses-section";
import { FreeAstrologyReadings } from "@/components/home/free-astrology-readings";
import { HeroAstroyogi } from "@/components/home/hero-astroyogi";
import { HomeMarquee } from "@/components/home/home-marquee";
import { HomeBottomCta, HomeTrustSections } from "@/components/home/home-trust-sections";
import { OurServicesSection } from "@/components/home/our-services-section";
import { ToolRail } from "@/components/home/tool-rail";
import { INITIAL_TOP_ASTROLOGERS, TopAstrologersSection } from "@/components/home/top-astrologers-section";
import { VedicFestivalsSection } from "@/components/home/vedic-festivals-section";
import { ReadingGrid } from "@/components/home/home-cinematic-cards";
import { COPY, READINGS, tr, type Reading } from "@/components/home/home-cinematic-data";
import { CinematicHero } from "@/components/home/home-cinematic-hero";
import { CinematicSearch, EMPTY_BIRTH, type BirthState } from "@/components/home/home-cinematic-search";
import { HomeDetailOverlay } from "@/components/home/home-detail-overlay";
import { SiteFooter } from "@/components/layout/site-footer";
import { saveKundliPrefill } from "@/lib/kundli-prefill";
import { astrologerApi, cmsApi, type HomePageCMSData } from "@/lib/api";
import { useLanguage } from "@/providers/language-provider";
import type { CourseListItem, PaginatedAstrologers } from "@/types";

const FirstChatFreeModal = dynamic(
  () => import("@/components/home/first-chat-free-modal").then((m) => m.FirstChatFreeModal),
  { ssr: false },
);

const FLIGHT_MS = 900;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

interface HomePageClientProps {
  initialCms?: HomePageCMSData | null;
  initialAstrologers?: PaginatedAstrologers | null;
  initialCourses?: CourseListItem[] | null;
}

export function HomePageClient({
  initialCms = null,
  initialAstrologers = null,
  initialCourses = null,
}: HomePageClientProps) {
  const { language } = useLanguage();

  // Same queries and keys as the sections use, so the cache is shared and the
  // server snapshot (ISR, 2 min) renders first with no loading flash.
  const { data: cmsData } = useQuery({
    queryKey: ["cms", "homepage"],
    queryFn: cmsApi.getHomepage,
    initialData: initialCms ?? undefined,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  const hasServerAstrologers = Boolean(initialAstrologers?.items?.length);
  const { data: astrologersData } = useQuery({
    queryKey: ["astrologers", { home: true, limit: 12 }],
    queryFn: async () => {
      try {
        const res = await astrologerApi.list({ limit: 12 });
        if (res?.items && res.items.length > 0) return res;
        return initialAstrologers ?? INITIAL_TOP_ASTROLOGERS;
      } catch {
        return initialAstrologers ?? INITIAL_TOP_ASTROLOGERS;
      }
    },
    initialData: initialAstrologers ?? INITIAL_TOP_ASTROLOGERS,
    initialDataUpdatedAt: hasServerAstrologers ? undefined : 0,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
  const liveAstrologerCount = astrologersData?.items?.length ?? 2;

  const router = useRouter();
  const [birth, setBirth] = React.useState<BirthState>(EMPTY_BIRTH);
  const likedIdsRaw = React.useSyncExternalStore(
    React.useCallback((onStoreChange: () => void) => {
      window.addEventListener("storage", onStoreChange);
      window.addEventListener("divinlink_likes_updated", onStoreChange);
      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener("divinlink_likes_updated", onStoreChange);
      };
    }, []),
    () => {
      try {
        return window.localStorage.getItem("divinlink_liked_readings_v1") || "[]";
      } catch {
        return "[]";
      }
    },
    () => "[]",
  );
  const likedIds = React.useMemo(() => {
    try {
      const parsed = JSON.parse(likedIdsRaw);
      return new Set<string>(Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : []);
    } catch {
      return new Set<string>();
    }
  }, [likedIdsRaw]);

  const [detail, setDetail] = React.useState<Reading | null>(null);
  const [detailShown, setDetailShown] = React.useState(false);
  const [detailClosing, setDetailClosing] = React.useState(false);
  const [mainHidden, setMainHidden] = React.useState(false);
  const mainRef = React.useRef<HTMLDivElement>(null);
  const detailScrollRef = React.useRef<HTMLDivElement>(null);
  const pendingFlight = React.useRef<{ rect: DOMRect; image: string } | null>(null);

  // Lock the page behind the detail view.
  React.useEffect(() => {
    if (!detail) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [detail]);

  const toggleLike = React.useCallback((id: string) => {
    try {
      const saved = window.localStorage.getItem("divinlink_liked_readings_v1") || "[]";
      const parsed = JSON.parse(saved);
      const next = new Set<string>(Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : []);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      window.localStorage.setItem("divinlink_liked_readings_v1", JSON.stringify(Array.from(next)));
      window.dispatchEvent(new Event("divinlink_likes_updated"));
    } catch {
      // Ignore storage failures
    }
  }, []);

  const openReading = React.useCallback((reading: Reading, fromEl: HTMLElement) => {
    pendingFlight.current = { rect: fromEl.getBoundingClientRect(), image: reading.image };
    setMainHidden(true);
    setDetailClosing(false);
    setDetail(reading);
  }, []);

  // Shared-element flight: runs after the detail page has laid out.
  React.useLayoutEffect(() => {
    const flight = pendingFlight.current;
    if (!detail || !flight) return;
    pendingFlight.current = null;

    if (detailScrollRef.current) detailScrollRef.current.scrollTop = 0;
    if (!detailShown) requestAnimationFrame(() => setDetailShown(true));

    const target = mainRef.current?.getBoundingClientRect();
    if (!target) {
      setMainHidden(false);
      return;
    }

    const from = flight.rect;
    const el = document.createElement("div");
    el.className = "dl-flight";
    el.style.backgroundImage = `url(${flight.image})`;
    document.body.appendChild(el);

    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / FLIGHT_MS);
      const e = easeInOutCubic(t);
      el.style.left = `${from.left + (target.left - from.left) * e}px`;
      el.style.top = `${from.top + (target.top - from.top) * e}px`;
      el.style.width = `${from.width + (target.width - from.width) * e}px`;
      el.style.height = `${from.height + (target.height - from.height) * e}px`;
      el.style.borderRadius = `${12 - 2 * e}px`;
      if (t < 1) raf = requestAnimationFrame(step);
      else {
        setMainHidden(false);
        requestAnimationFrame(() => el.remove());
      }
    };
    step(start);
    return () => {
      cancelAnimationFrame(raf);
      el.remove();
    };
    // detailShown intentionally omitted: the flight starts once per opened reading.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);

  const closeDetail = React.useCallback(() => {
    if (!detail) return;
    setDetailClosing(true);
    window.setTimeout(() => {
      setDetail(null);
      setDetailShown(false);
      setDetailClosing(false);
    }, 450);
  }, [detail]);

  const onLogo = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (detail) closeDetail();
      else window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [detail, closeDetail],
  );

  const generateKundli = () => {
    if (!birth.dob) return;
    saveKundliPrefill({
      name: birth.name.trim(),
      gender: birth.gender,
      day: birth.dob.getDate(),
      month: birth.dob.getMonth() + 1,
      year: birth.dob.getFullYear(),
      time:
        birth.timeUnknown || birth.hour === null
          ? null
          : { hour: birth.hour, minute: birth.minute, period: birth.period },
      place: birth.place,
    });
    router.push("/kundli");
  };

  return (
    <div className="dl-home">
      <AstroyogiHeader overlay forceSolid={Boolean(detail)} onLogoClick={onLogo} />

      <main>
        <CinematicHero language={language} paused={Boolean(detail) && detailShown}>
          <CinematicSearch
            language={language}
            value={birth}
            onChange={setBirth}
            onSubmit={generateKundli}
          />
        </CinematicHero>

        <section id="recommended" className="dl-stays" style={{ scrollMarginTop: 96 }}>
          <div className="dl-stays-head">
            <h2 className="dl-h2">{tr(COPY.recommended, language)}</h2>
            <Link className="dl-see-all" href="/astrologers">
              {tr(COPY.seeAll, language)}
            </Link>
          </div>
          <ReadingGrid
            readings={READINGS}
            language={language}
            likedIds={likedIds}
            onToggleLike={toggleLike}
            onOpen={openReading}
          />
        </section>

        <HomeMarquee language={language} />

        <div className="dl-legacy">
          <ToolRail />
          <TopAstrologersSection initialAstrologers={initialAstrologers} />
          <HeroAstroyogi initialCms={initialCms} />
          <AstrologyPredictionZodiac />
          <FreeAstrologyReadings />
          <div id="services">
            <OurServicesSection />
          </div>
          <CoursesSection initialCourses={initialCourses} />
          <VedicFestivalsSection />
          <HomeTrustSections language={language} liveAstrologerCount={liveAstrologerCount} />
          <AppDownloadSection />
          <HomeBottomCta language={language} cms={cmsData} />
        </div>
      </main>

      <div className="dl-home-footer">
        <SiteFooter />
      </div>

      {detail && (
        <HomeDetailOverlay
          reading={detail}
          language={language}
          shown={detailShown}
          closing={detailClosing}
          mainHidden={mainHidden}
          mainRef={mainRef}
          scrollRef={detailScrollRef}
          birth={birth}
          likedIds={likedIds}
          onToggleLike={toggleLike}
          onHome={closeDetail}
          onOpen={openReading}
        />
      )}

      <FirstChatFreeModal />
    </div>
  );
}
