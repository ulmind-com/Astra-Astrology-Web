"use client";

import { useQuery } from "@tanstack/react-query";

import { callApi } from "@/lib/api";

export const COPILOT_KEY = ["copilot"] as const;

/** The dasha moves by days, not seconds. Refreshed only on a long interval so
 *  a panel left open through a whole session cannot hammer the backend. */
const REFRESH_MS = 5 * 60 * 1000;

/**
 * The Co-Pilot summary for a live call.
 *
 * `enabled` is the caller's judgement about whether this viewer is an active
 * participant on a live call; nothing is requested while it is false, so a
 * session where the panel is never opened costs nothing.
 */
export function useCoPilot(callId: string | null | undefined, enabled: boolean, language?: string) {
  return useQuery({
    queryKey: [...COPILOT_KEY, callId, language],
    queryFn: () => callApi.copilot(callId!, language),
    enabled: Boolean(callId) && enabled,
    refetchInterval: REFRESH_MS,
    staleTime: REFRESH_MS,
    retry: 1,
  });
}
