import { HomePageClient } from "@/components/home/home-page-client";
import type { HomePageCMSData } from "@/lib/api";
import { apiBase } from "@/lib/env";
import type { CourseListItem, PaginatedAstrologers } from "@/types";

// Revalidate homepage ISR snapshot in the background every 2 minutes
export const revalidate = 120;

async function fetchPublicJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${apiBase}${path}`, {
      next: { revalidate: 120 },
      signal: AbortSignal.timeout(2500),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const envelope = (await res.json()) as { success?: boolean; data?: T };
    return envelope?.data ?? null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [cmsRes, astroRes, coursesRes] = await Promise.allSettled([
    fetchPublicJson<HomePageCMSData>("/cms/homepage"),
    fetchPublicJson<PaginatedAstrologers>("/astrologers?limit=12"),
    fetchPublicJson<CourseListItem[]>("/courses?limit=6"),
  ]);

  const initialCms = cmsRes.status === "fulfilled" ? cmsRes.value : null;
  const initialAstrologers = astroRes.status === "fulfilled" ? astroRes.value : null;
  const initialCourses = coursesRes.status === "fulfilled" ? coursesRes.value : null;

  return (
    <HomePageClient
      initialCms={initialCms}
      initialAstrologers={initialAstrologers}
      initialCourses={initialCourses}
    />
  );
}
