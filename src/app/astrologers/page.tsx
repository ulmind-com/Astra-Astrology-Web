"use client";

import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import * as React from "react";

import {
  AstrologerCard,
  AstrologerCardSkeleton,
} from "@/components/astrologers/astrologer-card";
import {
  ActiveFilterChips,
  DirectoryFilters,
  EMPTY_FILTERS,
  type Filters,
} from "@/components/astrologers/directory-filters";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Alert, Button, EmptyState, Pagination } from "@/components/ui";
import { astrologerApi, type DirectoryFilters as ApiFilters } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import type { ConsultationMode, Skill } from "@/types";

/** Form state is all strings; the API wants numbers and omitted keys. */
function toQuery(filters: Filters, page: number): ApiFilters {
  return {
    search: filters.search.trim() || undefined,
    skill: (filters.skill || undefined) as Skill | undefined,
    language: filters.language || undefined,
    mode: (filters.mode || undefined) as ConsultationMode | undefined,
    online_only: filters.online_only || undefined,
    featured_only: filters.featured_only || undefined,
    min_experience: filters.min_experience ? Number(filters.min_experience) : undefined,
    max_coins_per_minute: filters.max_rate ? Number(filters.max_rate) : undefined,
    page,
    limit: 12,
  };
}

function DirectoryInner() {
  const [filters, setFilters] = React.useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = React.useState(1);

  // Typing should not fire a request per keystroke.
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 350);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const query = toQuery({ ...filters, search: debouncedSearch }, page);

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["astrologers", query],
    queryFn: () => astrologerApi.list(query),
    // Keeps the previous page on screen while the next one loads.
    placeholderData: (previous) => previous,
  });

  function applyFilters(next: Filters) {
    setFilters(next);
    setPage(1); // a changed filter invalidates the page number
  }

  const apiError = error as ApiError | null;

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Astrologers</h1>
          <p className="mt-2 text-muted-foreground">
            Verified practitioners, ready when you are. Whoever is online shows first.
          </p>
        </header>

        <div className="space-y-4">
          <DirectoryFilters
            filters={filters}
            onChange={applyFilters}
            total={data?.meta.total}
          />
          <ActiveFilterChips filters={filters} onChange={applyFilters} />
        </div>

        <div className="mt-8">
          {apiError ? (
            <Alert tone="error" title="Could not load astrologers">
              {apiError.message}
              <div className="mt-3">
                <Button size="sm" variant="secondary" onClick={() => refetch()}>
                  Try again
                </Button>
              </div>
            </Alert>
          ) : isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <AstrologerCardSkeleton key={index} />
              ))}
            </div>
          ) : !data || data.items.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No astrologers match that"
              description="Try removing a filter, or search for something broader."
              action={
                <Button variant="secondary" onClick={() => applyFilters(EMPTY_FILTERS)}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <>
              <div
                className={`grid gap-5 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${
                  isFetching ? "opacity-60" : ""
                }`}
              >
                {data.items.map((astrologer) => (
                  <AstrologerCard key={astrologer.id} astrologer={astrologer} />
                ))}
              </div>

              <div className="mt-8">
                <Pagination meta={data.meta} onPage={setPage} />
              </div>
            </>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

export default function AstrologersPage() {
  return <DirectoryInner />;
}
