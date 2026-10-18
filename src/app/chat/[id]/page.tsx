"use client";

import { MessageCircle, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";

import { ChatRoom } from "@/components/chat/chat-room";
import { Alert, Avatar, Button, LoadingBlock, Spinner } from "@/components/ui";
import { useChat, useChatActions, useChatHeartbeat, useChatTimer } from "@/hooks/use-chat";
import { ApiError } from "@/lib/api/client";
import { useRequireAuth } from "@/providers/auth-provider";
import { CHAT_STATUS_LABELS, formatDuration, isChatLive } from "@/types";

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { ready } = useRequireAuth();

  const { data, isLoading, error } = useChat(ready ? id : null);
  const { end } = useChatActions();

  const chat = data?.chat;
  const live = chat ? isChatLive(chat.status) : false;
  const active = chat?.status === "active";

  useChatHeartbeat(id, live);
  const seconds = useChatTimer(chat?.started_at);

  const leave = React.useCallback(() => end.mutate({ id }), [end, id]);

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
    <div className="flex min-h-dvh flex-col bg-surface">
      {/* --------------------------------------------------------- header */}
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Avatar src={chat.peer?.avatar_url} name={chat.peer?.name} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {chat.peer?.name ?? "Astrologer"}
          </p>
          <p className="text-xs text-muted-foreground">
            {active ? formatDuration(seconds) : CHAT_STATUS_LABELS[chat.status]}
          </p>
        </div>
        {live ? (
          <Button size="sm" variant="secondary" onClick={leave} disabled={end.isPending}>
            <X className="size-4" />
            End
          </Button>
        ) : (
          <Button size="sm" variant="secondary" onClick={() => router.replace("/astrologers")}>
            Back
          </Button>
        )}
      </header>

      {/* ----------------------------------------------------------- body */}
      <div className="flex-1">
        {chat.status === "requested" ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200">
              <MessageCircle className="size-7 animate-pulse" />
            </span>
            <div>
              <p className="font-semibold">{chat.peer?.name}</p>
              <p className="mt-1 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Spinner className="size-3" />
                Waiting for them to accept…
              </p>
            </div>
            <p className="max-w-xs text-xs text-muted-foreground">
              You can send your first message as soon as they join.
            </p>
          </div>
        ) : data?.firebase ? (
          <ChatRoom
            conversationId={chat.conversation_id}
            firebase={data.firebase}
            canSend={active}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="font-semibold">{CHAT_STATUS_LABELS[chat.status]}</p>
            {chat.duration_seconds > 0 && (
              <p className="text-sm text-muted-foreground">
                Lasted {formatDuration(chat.duration_seconds)} · {chat.message_count} messages
              </p>
            )}
            {chat.end_reason && (
              <p className="text-xs text-muted-foreground">{chat.end_reason}</p>
            )}
            <Button variant="secondary" onClick={() => router.replace("/astrologers")}>
              Back to astrologers
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
