"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
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
import { INITIAL_TOP_ASTROLOGERS, TopAstrologersSection } from "@/components/home/top-astrologers-section";
import { VedicFestivalsSection } from "@/components/home/vedic-festivals-section";
import { CinematicHero } from "@/components/home/home-cinematic-hero";
import {
  CinematicSearch,
  EMPTY_BIRTH,
  type BirthState,
  type SearchMode,
} from "@/components/home/home-cinematic-search";
import { SiteFooter } from "@/components/layout/site-footer";
import { saveKundliPrefill, saveRashiPrefill } from "@/lib/kundli-prefill";
import { astrologerApi, cmsApi, type HomePageCMSData } from "@/lib/api";
import { useLanguage } from "@/providers/language-provider";
import type { CourseListItem, PaginatedAstrologers } from "@/types";

const FirstChatFreeModal = dynamic(
  () => import("@/components/home/first-chat-free-modal").then((m) => m.FirstChatFreeModal),
  { ssr: false },
);

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

  const onLogo = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [],
  );

  const [searchMode, setSearchMode] = React.useState<SearchMode>("kundli");

  const handleSearchSubmit = (mode: SearchMode) => {
    if (!birth.dob) return;
    const prefillData = {
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
    };

    if (mode === "rashi") {
      saveRashiPrefill(prefillData);
      router.push("/rashi-calculator");
    } else {
      saveKundliPrefill(prefillData);
      router.push("/kundli");
    }
  };

  return (
    <div className="dl-home">
      <AstroyogiHeader overlay onLogoClick={onLogo} />

      <main>
        <CinematicHero
          language={language}
          paused={false}
          slides={cmsData?.cinematic_hero_slides}
        >
          <CinematicSearch
            language={language}
            value={birth}
            onChange={setBirth}
            mode={searchMode}
            onModeChange={setSearchMode}
            onSubmit={handleSearchSubmit}
          />
        </CinematicHero>

        <HomeMarquee language={language} />

        <div className="dl-legacy">
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

      <FirstChatFreeModal />
    </div>
  );
}
