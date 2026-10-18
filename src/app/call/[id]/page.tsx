"use client";

import { PhoneOff, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";

import { CallRoom } from "@/components/call/call-room";
import { Alert, Button, LoadingBlock, Spinner } from "@/components/ui";
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

  useCallHeartbeat(id, live);
  const seconds = useCallTimer(call?.started_at);

  // The server may end the call (the other side hung up, or it timed out).
  // Once that happens there is nothing to show, so step back to the directory.
  React.useEffect(() => {
    if (call && !isCallLive(call.status)) {
      const timer = setTimeout(() => router.replace("/astrologers"), 2500);
      return () => clearTimeout(timer);
    }
  }, [call, router]);

  const hangUp = React.useCallback(() => {
    end.mutate({ id });
  }, [end, id]);

  if (!ready || isLoading) return <LoadingBlock label="Connecting…" />;
  if (error) {
    return (
      <div className="mx-auto max-w-md p-6">
        <Alert tone="error">{(error as ApiError).message}</Alert>
      </div>
    );
  }
  if (!call) return null;

  return (
    <div className="flex min-h-dvh flex-col bg-night-950 text-white">
      {/* --------------------------------------------------------- header */}
      <header className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {call.peer?.name ?? "Astrologer"}
          </p>
          <p className="text-xs text-white/60">
            {connected ? formatDuration(seconds) : CALL_STATUS_LABELS[call.status]}
          </p>
        </div>
        {live && (
          <Button
            size="sm"
            onClick={hangUp}
            disabled={end.isPending}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            <PhoneOff className="size-4" />
            End
          </Button>
        )}
      </header>

      {/* ----------------------------------------------------------- room */}
      <div className="relative flex-1">
        {connected && data?.credentials ? (
          <CallRoom
            credentials={data.credentials}
            onLeave={hangUp}
            className="absolute inset-0"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
            {live ? (
              <>
                <span className="flex size-20 items-center justify-center rounded-full bg-white/10">
                  <Video className="size-8 animate-pulse" />
                </span>
                <div>
                  <p className="text-lg font-semibold">{call.peer?.name}</p>
                  <p className="mt-1 flex items-center justify-center gap-2 text-sm text-white/60">
                    <Spinner className="size-3" />
                    Ringing…
                  </p>
                </div>
                <p className="max-w-xs text-xs text-white/40">
                  We will connect you as soon as they pick up.
                </p>
              </>
            ) : (
              <>
                <span className="flex size-20 items-center justify-center rounded-full bg-white/10">
                  <PhoneOff className="size-8" />
                </span>
                <div>
                  <p className="text-lg font-semibold">
                    {CALL_STATUS_LABELS[call.status]}
                  </p>
                  {call.duration_seconds > 0 && (
                    <p className="mt-1 text-sm text-white/60">
                      Lasted {formatDuration(call.duration_seconds)}
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
