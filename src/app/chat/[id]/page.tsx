"use client";

import { ChevronLeft, MessageCircle, Phone } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";

import { ChatRoom } from "@/components/chat/chat-room";
import { OutOfCoins, SessionMeter } from "@/components/consult/session-meter";
import { Alert, Avatar, Button, LoadingBlock } from "@/components/ui";
import { useChat, useChatActions, useChatHeartbeat, useChatTimer } from "@/hooks/use-chat";
import { ApiError } from "@/lib/api/client";
import { useRequireAuth } from "@/providers/auth-provider";
import { CHAT_STATUS_LABELS, formatDuration, isChatLive } from "@/types";
import { useAuth } from "@/providers/auth-provider";

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { ready } = useRequireAuth();

  const { user } = useAuth();
  const { data, isLoading, error, refetch } = useChat(ready ? id : null);
  const { end } = useChatActions();
  const [confirming, setConfirming] = React.useState(false);

  const chat = data?.chat;
  const live = chat ? isChatLive(chat.status) : false;
  const active = chat?.status === "active";

  useChatHeartbeat(id, live);
  const seconds = useChatTimer(chat?.started_at);

  if (!ready || isLoading) return <LoadingBlock label="Opening the chat…" />;
  if (error) {
    return (
      <div className="mx-auto max-w-md p-6">
        <Alert tone="error">{(error as ApiError).message}</Alert>
      </div>
    );
  }
  if (!chat) return null;

  return (
    <div className="flex h-dvh flex-col bg-surface">
      {/* --------------------------------------------------------- header */}
      <header className="flex items-center gap-2 border-b border-border bg-surface px-2 py-2.5 sm:px-4">
        <button
          type="button"
          onClick={() => router.push("/astrologers")}
          aria-label="Back"
          className="flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-surface-muted"
        >
          <ChevronLeft className="size-5" />
        </button>

        <Avatar src={chat.peer?.avatar_url} name={chat.peer?.name} size="sm" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-tight">
            {chat.peer?.name ?? "Astrologer"}
          </p>
          <p className="flex items-center gap-1.5 text-xs leading-tight text-muted-foreground">
            {active ? (
              <>
                <span className="size-1.5 rounded-full bg-success" />
                {formatDuration(seconds)}
              </>
            ) : (
              CHAT_STATUS_LABELS[chat.status]
            )}
          </p>
        </div>

        {live && (
          <Button
            size="sm"
            variant={confirming ? "primary" : "secondary"}
            onClick={() => {
              // One tap arms it, the second ends it — a mis-tap should not end
              // a consultation someone is paying for.
              if (!confirming) {
                setConfirming(true);
                setTimeout(() => setConfirming(false), 4000);
                return;
              }
              end.mutate({ id });
            }}
            disabled={end.isPending}
            className={confirming ? "bg-rose-600 text-brand-950 hover:bg-rose-500" : undefined}
          >
            {confirming ? "Tap to confirm" : "End"}
          </Button>
        )}
      </header>

      {/* ----------------------------------------------------------- body */}
      <div className="flex-1 overflow-hidden">
        {chat.status === "requested" ? (
          <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
            <span className="relative flex size-20 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-brand-200/70" />
              <span className="relative flex size-16 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-100 dark:text-ink-800">
                <MessageCircle className="size-7" />
              </span>
            </span>
            <div>
              <p className="font-semibold">{chat.peer?.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Waiting for them to accept…
              </p>
            </div>
            <p className="max-w-xs text-xs text-muted-foreground">
              You can send your first message the moment they join. We will keep
              this open for a couple of minutes.
            </p>
          </div>
        ) : live ? (
          <div className="flex h-full flex-col">
            {chat.billing && active && (
              <div className="border-b border-border bg-surface px-3 py-2">
                <SessionMeter
                  sessionId={id}
                  kind="chat"
                  billing={chat.billing}
                  elapsedSeconds={seconds}
                  onExtended={() => refetch()}
                />
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <ChatRoom
                sessionId={chat.id}
                myUserId={user?.id ?? ""}
                canSend={active}
                peerName={chat.peer?.name}
              />
            </div>
          </div>
        ) : (
          <ChatEnded chat={chat} onBack={() => router.push("/astrologers")} />
        )}
      </div>
    </div>
  );
}

function ChatEnded({
  chat,
  onBack,
}: {
  chat: NonNullable<ReturnType<typeof useChat>["data"]>["chat"];
  onBack: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      {chat.end_reason === "Ran out of coins" ? (
        <OutOfCoins onBack={onBack} />
      ) : (
        <>
      <span className="flex size-16 items-center justify-center rounded-full bg-surface-muted">
        <Phone className="size-6 text-muted-foreground" />
      </span>
      <div>
        <p className="text-lg font-semibold">{CHAT_STATUS_LABELS[chat.status]}</p>
        {chat.duration_seconds > 0 && (
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDuration(chat.duration_seconds)} · {chat.message_count}{" "}
            {chat.message_count === 1 ? "message" : "messages"}
          </p>
        )}
        {chat.end_reason && (
          <p className="mt-1 text-xs text-muted-foreground">{chat.end_reason}</p>
        )}
      </div>
      <Button variant="secondary" onClick={onBack}>
        Back to astrologers
      </Button>
        </>
      )}
    </div>
  );
}