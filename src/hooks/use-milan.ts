"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";

import { milanApi } from "@/lib/api";
import { isCallLive } from "@/types";
import type { MilanRoom, MilanRoomSession } from "@/types/milan";

export const MILAN_KEY = ["milan"] as const;

/** Poll fast enough that an arriving guest shows up, slow enough to be cheap. */
const POLL_MS = 4000;
const HEARTBEAT_MS = 20_000;

export function useMilanRoom(id: string | null) {
  return useQuery({
    queryKey: [...MILAN_KEY, id],
    queryFn: () => milanApi.get(id!),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const data = query.state.data as MilanRoomSession | undefined;
      return data && !isCallLive(data.room.status) ? false : POLL_MS;
    },
    refetchIntervalInBackground: true,
  });
}

export function useActiveMilanRoom(enabled = true) {
  return useQuery({
    queryKey: [...MILAN_KEY, "active"],
    queryFn: milanApi.active,
    enabled,
    refetchInterval: POLL_MS,
    refetchIntervalInBackground: true,
  });
}

/**
 * Tells the server the host or the astrologer is still here.
 *
 * This is also what charges the minutes, so it must keep running for as long
 * as the chamber is live — and must stop the moment it is not, or a closed
 * chamber would keep being poked.
 */
export function useMilanHeartbeat(id: string | null, active: boolean) {
  React.useEffect(() => {
    if (!id || !active) return;
    const send = () => void milanApi.heartbeat(id).catch(() => {});
    send();
    const timer = setInterval(send, HEARTBEAT_MS);
    return () => clearInterval(timer);
  }, [id, active]);
}

export function useMilanActions() {
  const queryClient = useQueryClient();
  const refresh = () => void queryClient.invalidateQueries({ queryKey: MILAN_KEY });

  return {
    addSeat: useMutation({
      mutationFn: ({ id, label }: { id: string; label: string }) =>
        milanApi.addSeat(id, label),
      onSuccess: refresh,
    }),
    revokeSeat: useMutation({
      mutationFn: ({ id, seatId }: { id: string; seatId: string }) =>
        milanApi.revokeSeat(id, seatId),
      onSuccess: refresh,
    }),
    extend: useMutation({
      mutationFn: ({ id, minutes }: { id: string; minutes: number }) =>
        milanApi.extend(id, minutes),
      onSuccess: refresh,
    }),
    end: useMutation({
      mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
        milanApi.end(id, reason),
      onSuccess: refresh,
    }),
  };
}

// ----------------------------------------------------------------- guests
/**
 * A guest's side of the chamber.
 *
 * The invitation code is the whole credential, so it is the query key and
 * the only thing passed to the server. Nothing here assumes an account.
 */
export function useGuestMilanRoom(joinCode: string | null, displayName?: string) {
  return useQuery({
    queryKey: [...MILAN_KEY, "guest", joinCode],
    queryFn: () => milanApi.guestJoin(joinCode!, displayName),
    enabled: Boolean(joinCode),
    // Joining is not idempotent from the server's point of view — it claims
    // the seat — so this must not be retried into a "seat taken" of its own.
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}

/** Keeps a guest's seat. Does not keep the chamber alive: that is the host's. */
export function useGuestHeartbeat(joinCode: string | null, active: boolean) {
  React.useEffect(() => {
    if (!joinCode || !active) return;
    const send = () => void milanApi.guestHeartbeat(joinCode).catch(() => {});
    send();
    const timer = setInterval(send, HEARTBEAT_MS);
    return () => clearInterval(timer);
  }, [joinCode, active]);
}

/** Frees the seat on the way out, so the host can re-issue it. */
export function useGuestLeave(joinCode: string | null) {
  return React.useCallback(() => {
    if (!joinCode) return;
    void milanApi.guestLeave(joinCode).catch(() => {});
  }, [joinCode]);
}

export function milanIsLive(room: MilanRoom | undefined | null): boolean {
  return Boolean(room && isCallLive(room.status));
}
