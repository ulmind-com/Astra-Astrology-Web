"use client";

import { Phone, PhoneOff, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";

import { CallRoom } from "@/components/call/call-room";
import { OutOfCoins, SessionMeter } from "@/components/consult/session-meter";
import { Alert, Avatar, Button, LoadingBlock } from "@/components/ui";
import { useCall, useCallActions, useCallHeartbeat, useCallTimer } from "@/hooks/use-call";
import { ApiError } from "@/lib/api/client";
import { useRequireAuth } from "@/providers/auth-provider";
import { CALL_STATUS_LABELS, formatDuration, isCallLive } from "@/types";

export default function CallPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { ready } = useRequireAuth();

  const { data, isLoading, error } = useCall(ready ? id : null);
  const { end } = useCallActions();

  const call = data?.call;
  const live = call ? isCallLive(call.status) : false;
  const connected = call?.status === "active";
  const isVideo = call?.mode === "video";

  useCallHeartbeat(id, live);
  const seconds = useCallTimer(call?.started_at);

  // The other side may hang up, or the call may time out. Once it is over
  // there is nothing left on this screen worth looking at.
  React.useEffect(() => {
    if (call && !isCallLive(call.status)) {
      const timer = setTimeout(() => router.replace("/astrologers"), 3000);
      return () => clearTimeout(timer);
    }
  }, [call, router]);

  const hangUp = React.useCallback(() => end.mutate({ id }), [end, id]);

  if (!ready || isLoading) return <LoadingBlock label="Connecting…" />;
  if (error) {
    return (
      <div className="mx-auto max-w-md p-6">
        <Alert tone="error">{(error as ApiError).message}</Alert>
      </div>
    );
  }
  if (!call) return null;

  const Icon = isVideo ? Video : Phone;

  return (
    <div className="relative flex h-dvh flex-col bg-night-950 text-white">
      {/* The SDK fills the frame once connected; everything else floats over. */}
      {connected && data?.credentials ? (
        <CallRoom
          credentials={data.credentials}
          onLeave={hangUp}
          className="absolute inset-0"
          audioOnly={!isVideo}
        />
      ) : (
        <div className="absolute inset-0 bg-cosmos" />
      )}

      {/* ------------------------------------------------- connected chrome */}
      {connected && call.billing && (
        <div className="pointer-events-auto absolute inset-x-0 top-16 z-10 px-3">
          <SessionMeter billing={call.billing} onDark />
        </div>
      )}

      {connected ? (
        <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center gap-3 bg-gradient-to-b from-black/70 to-transparent px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{call.peer?.name}</p>
            <p className="flex items-center gap-1.5 text-xs text-white/70">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              {formatDuration(seconds)}
            </p>
          </div>
          <Button
            size="sm"
            onClick={hangUp}
            disabled={end.isPending}
            className="pointer-events-auto bg-red-600 text-white hover:bg-red-700"
          >
            <PhoneOff className="size-4" />
            End
          </Button>
        </header>
      ) : (
        /* ------------------------------------------ ringing / finished */
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
          {live ? (
            <>
              <span className="relative flex size-32 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-white/10" />
                <Avatar
                  src={call.peer?.avatar_url}
                  name={call.peer?.name}
                  size="xl"
                  className="relative"
                />
              </span>

              <div>
                <p className="text-xl font-semibold">{call.peer?.name}</p>
                <p className="mt-1.5 flex items-center justify-center gap-2 text-sm text-white/60">
                  <Icon className="size-4" />
                  {isVideo ? "Video call" : "Voice call"} · ringing…
                </p>
              </div>

              <p className="max-w-xs text-xs text-white/40">
                We will connect you the moment they answer. Keep this screen open.
              </p>

              <Button
                onClick={hangUp}
                disabled={end.isPending}
                className="mt-2 bg-red-600 text-white hover:bg-red-700"
              >
                <PhoneOff className="size-4" />
                Cancel
              </Button>
            </>
          ) : (
            call.end_reason === "Ran out of coins" ? (
              <div className="rounded-2xl bg-white/5 p-6">
                <OutOfCoins onBack={() => router.replace("/astrologers")} />
              </div>
            ) : (
            <>
              <span className="flex size-20 items-center justify-center rounded-full bg-white/10">
                <PhoneOff className="size-8" />
              </span>
              <div>
                <p className="text-xl font-semibold">{CALL_STATUS_LABELS[call.status]}</p>
                {call.duration_seconds > 0 && (
                  <p className="mt-1 text-sm text-white/60">
                    {formatDuration(call.duration_seconds)}
                  </p>
                )}
                {call.end_reason && (
                  <p className="mt-1 text-xs text-white/40">{call.end_reason}</p>
                )}
              </div>
              <Button variant="secondary" onClick={() => router.replace("/astrologers")}>
                Back to astrologers
              </Button>
            </>
            )
          )}
        </div>
      )}
    </div>
  );
}
