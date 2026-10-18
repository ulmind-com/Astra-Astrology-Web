"use client";

/**
 * Asks for a review once a consultation is over.
 *
 * Which consultation is decided by the server, not by whichever page happened
 * to be open: it returns the sessions this person has finished and not yet
 * reviewed. That is what makes the prompt survive a closed tab — someone who
 * hangs up and immediately shuts the browser is asked the next time they come
 * back, rather than never.
 *
 * It also means a review written on a phone stops the prompt appearing on a
 * laptop, because the answer comes from the same place both times.
 *
 * "Not now" is remembered for this browser only, per consultation, so the
 * prompt does not reappear on every navigation — but it does come back on a
 * later visit, since a review is worth asking for twice and not ten times.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { toast } from "sonner";

import { Stars } from "@/components/reviews/stars";
import { Avatar, Button, Modal, Textarea } from "@/components/ui";
import { reviewApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/providers/auth-provider";
import { REVIEW_KIND_LABELS, type PendingReview } from "@/types";

const DISMISSED_KEY = "astra.review.dismissed";

function dismissedSet(): Set<string> {
  try {
    const raw = window.localStorage.getItem(DISMISSED_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    // Private windows and blocked storage both land here. Losing the list
    // just means asking again, which is survivable.
    return new Set();
  }
}

function remember(key: string) {
  try {
    const next = dismissedSet();
    next.add(key);
    window.localStorage.setItem(DISMISSED_KEY, JSON.stringify([...next]));
  } catch {
    /* nothing to do */
  }
}

export function ReviewPrompt() {
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const { data: pending } = useQuery({
    queryKey: ["reviews", "pending"],
    queryFn: () => reviewApi.pending(),
    enabled: isSignedIn,
    // A session that just ended should raise the prompt without a reload.
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  const [dismissed, setDismissed] = React.useState<Set<string>>(new Set());
  React.useEffect(() => setDismissed(dismissedSet()), []);

  const subject: PendingReview | undefined = React.useMemo(
    () => (pending ?? []).find((p) => !dismissed.has(`${p.kind}:${p.session_id}`)),
    [pending, dismissed],
  );

  const [stars, setStars] = React.useState(0);
  const [text, setText] = React.useState("");

  // A fresh consultation gets a fresh form.
  React.useEffect(() => {
    setStars(0);
    setText("");
  }, [subject?.session_id]);

  const leave = useMutation({
    mutationFn: () =>
      reviewApi.leave({
        kind: subject!.kind,
        session_id: subject!.session_id,
        stars,
        text: text.trim() || null,
      }),
    onSuccess: () => {
      toast.success("Thanks — your review is up.");
      void queryClient.invalidateQueries({ queryKey: ["reviews"] });
      void queryClient.invalidateQueries({ queryKey: ["astrologer"] });
      void queryClient.invalidateQueries({ queryKey: ["astrologers"] });
    },
    onError: (e: ApiError) => toast.error(e.message),
  });

  if (!isSignedIn || !subject) return null;

  const key = `${subject.kind}:${subject.session_id}`;
  const close = () => {
    remember(key);
    setDismissed((current) => new Set(current).add(key));
  };

  return (
    <Modal
      open
      onClose={close}
      title="How was it?"
      description={`Your ${REVIEW_KIND_LABELS[subject.kind].toLowerCase()} with ${subject.astrologer_name} has finished.`}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={close} disabled={leave.isPending}>
            Not now
          </Button>
          <Button
            onClick={() => leave.mutate()}
            loading={leave.isPending}
            disabled={stars === 0}
          >
            Post review
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center gap-5 py-2 text-center">
        <Avatar
          src={subject.astrologer_avatar_url}
          name={subject.astrologer_name}
          size="xl"
        />

        <div>
          <p className="font-semibold">{subject.astrologer_name}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your rating is shown publicly, with your first name.
          </p>
        </div>

        <Stars value={stars} onChange={setStars} size="lg" />

        <Textarea
          rows={3}
          maxLength={2000}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Say a little about it (optional)"
          className="text-left"
        />
      </div>
    </Modal>
  );
}
