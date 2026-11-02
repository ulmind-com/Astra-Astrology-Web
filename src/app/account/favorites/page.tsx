"use client";

import { useQuery } from "@tanstack/react-query";
import { Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import {
  AstrologerCard,
  AstrologerCardSkeleton,
} from "@/components/astrologers/astrologer-card";
import { Button, EmptyState, Reveal } from "@/components/ui";
import { astrologerApi } from "@/lib/api";

const KEY = ["astrologers", "favorites", "my"] as const;

export default function MyFavoritesPage() {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: KEY,
    queryFn: () => astrologerApi.myFavorites(),
  });

  const favorites = data ?? [];

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Favorite Astrologers
            </h1>
            {favorites.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-rose-300/60 bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                <Heart className="size-3 fill-rose-500 text-rose-500" />
                {favorites.length}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Your sacred circle of trusted astrologers for quick consultations.
          </p>
        </div>

        <Link
          href="/astrologers"
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border/80 bg-surface px-4 py-2 text-xs font-semibold text-foreground shadow-2xs hover:bg-surface-muted transition-colors sm:self-auto self-start"
        >
          <Sparkles className="size-3.5 text-brand-600" />
          <span>Explore More</span>
        </Link>
      </header>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <AstrologerCardSkeleton key={index} />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No Favorite Astrologers Yet"
          description="Keep your trusted guides close. Click the Heart / Love icon on any astrologer's profile to add them to your sacred circle."
          action={
            <Link href="/astrologers">
              <Button variant="secondary">Browse Astrologers</Button>
            </Link>
          }
        />
      ) : (
        <Reveal
          stagger
          className={`grid gap-5 sm:grid-cols-2 transition-opacity duration-300 ${
            isFetching ? "opacity-60" : "opacity-100"
          }`}
        >
          {favorites.map((astrologer) => (
            <AstrologerCard key={astrologer.id} astrologer={astrologer} />
          ))}
        </Reveal>
      )}
    </div>
  );
}
