"use client";

/**
 * The multi-party Vedic chamber, from the host's side.
 *
 * The host opened it and the host pays for it, so this page is also where
 * the invitations live: one code per seat, copied and sent to the person it
 * is for. A code admits one person at a time and can be cancelled, which is
 * why they are never shown to anyone else in the room.
 */

import { Check, Copy, Link2, Loader2, PhoneOff, Plus, Users, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { CallRoom } from "@/components/call/call-room";
import { Alert, Avatar, Button, Field, Input, LoadingBlock, Modal } from "@/components/ui";
import {
  useMilanActions,
  useMilanHeartbeat,
  useMilanRoom,
} from "@/hooks/use-milan";
import { ApiError } from "@/lib/api/client";
import { useLanguage } from "@/providers/language-provider";
import { useRequireAuth } from "@/providers/auth-provider";
import { formatDuration, isCallLive } from "@/types";
import { MILAN_PURPOSE_LABELS, type MilanSeat } from "@/types/milan";

type Strings = {
  connecting: string; waiting: string; guests: string; invite: string;
  inviteHelp: string; copy: string; copied: string; cancel: string;
  addSeat: string; addLabel: string; addPlaceholder: string; add: string;
  present: string; away: string; cancelled: string; end: string;
  endTitle: string; endBody: string; endConfirm: string; keep: string;
  over: string; back: string; full: string;
};

const COPY: Record<"en" | "bn" | "hi", Strings> = {
  en: {
    connecting: "Opening the chamber…",
    waiting: "Waiting for the astrologer to join",
    guests: "Who is in the chamber",
    invite: "Invitations",
    inviteHelp:
      "Send each person their own link. One link seats one person, and you can cancel any of them.",
    copy: "Copy link",
    copied: "Link copied",
    cancel: "Cancel",
    addSeat: "Invite someone else",
    addLabel: "Who is this seat for?",
    addPlaceholder: "e.g. Bride's father",
    add: "Create invitation",
    present: "In the chamber",
    away: "Not joined yet",
    cancelled: "Cancelled",
    end: "End chamber",
    endTitle: "End this chamber?",
    endBody: "Everyone will be disconnected and the invitations will stop working.",
    endConfirm: "End it",
    keep: "Stay",
    over: "This chamber is over.",
    back: "Back to astrologers",
    full: "This chamber is full.",
  },
  bn: {
    connecting: "চেম্বার খোলা হচ্ছে…",
    waiting: "জ্যোতিষীর যোগ দেওয়ার অপেক্ষায়",
    guests: "চেম্বারে কারা আছেন",
    invite: "আমন্ত্রণ",
    inviteHelp:
      "প্রত্যেককে তাঁর নিজের লিংকটি পাঠান। একটি লিংকে একজনই বসতে পারেন, আর যেকোনোটি বাতিল করা যায়।",
    copy: "লিংক কপি করুন",
    copied: "লিংক কপি হয়েছে",
    cancel: "বাতিল",
    addSeat: "আরও কাউকে আমন্ত্রণ",
    addLabel: "এই আসনটি কার জন্য?",
    addPlaceholder: "যেমন কনের বাবা",
    add: "আমন্ত্রণ তৈরি করুন",
    present: "চেম্বারে আছেন",
    away: "এখনো যোগ দেননি",
    cancelled: "বাতিল",
    end: "চেম্বার শেষ করুন",
    endTitle: "চেম্বারটি শেষ করবেন?",
    endBody: "সবাই সংযোগ হারাবেন এবং আমন্ত্রণের লিংকগুলো আর কাজ করবে না।",
    endConfirm: "শেষ করুন",
    keep: "থাকুন",
    over: "এই চেম্বারটি শেষ হয়ে গেছে।",
    back: "জ্যোতিষীদের তালিকায়",
    full: "চেম্বারে আর আসন নেই।",
  },
  hi: {
    connecting: "चैंबर खोला जा रहा है…",
    waiting: "ज्योतिषी के जुड़ने की प्रतीक्षा",
    guests: "चैंबर में कौन है",
    invite: "आमंत्रण",
    inviteHelp:
      "हर व्यक्ति को उनका अपना लिंक भेजें। एक लिंक पर एक ही व्यक्ति बैठ सकता है, और कोई भी रद्द किया जा सकता है।",
    copy: "लिंक कॉपी करें",
    copied: "लिंक कॉपी हो गया",
    cancel: "रद्द",
    addSeat: "किसी और को आमंत्रित करें",
    addLabel: "यह आसन किसके लिए है?",
    addPlaceholder: "जैसे वधू के पिता",
    add: "आमंत्रण बनाएं",
    present: "चैंबर में हैं",
    away: "अभी तक नहीं जुड़े",
    cancelled: "रद्द",
    end: "चैंबर समाप्त करें",
    endTitle: "यह चैंबर समाप्त करें?",
    endBody: "सभी का संपर्क टूट जाएगा और आमंत्रण लिंक काम करना बंद कर देंगे।",
    endConfirm: "समाप्त करें",
    keep: "रुकें",
    over: "यह चैंबर समाप्त हो चुका है।",
    back: "ज्योतिषियों पर लौटें",
    full: "इस चैंबर में और स्थान नहीं है।",
  },
};

function inviteUrl(code: string): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/milan/join?code=${encodeURIComponent(code)}`;
}

function SeatRow({
  seat,
  t,
  onRevoke,
  revoking,
}: {
  seat: MilanSeat;
  t: Strings;
  onRevoke: () => void;
  revoking: boolean;
}) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl(seat.join_code));
      setCopied(true);
      toast.success(t.copied);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused; show the link so it can be copied
      // by hand rather than failing silently.
      toast.info(inviteUrl(seat.join_code));
    }
  };

  return (
    <li className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">
          {seat.display_name || seat.label}
        </p>
        <p className="text-xs text-white/55">
          {seat.is_revoked ? t.cancelled : seat.is_present ? t.present : t.away}
          {seat.display_name && seat.display_name !== seat.label ? ` · ${seat.label}` : ""}
        </p>
      </div>
      {!seat.is_revoked && (
        <>
          <button
            type="button"
            onClick={copy}
            title={t.copy}
            aria-label={t.copy}
            className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
          </button>
          <button
            type="button"
            onClick={onRevoke}
            disabled={revoking}
            title={t.cancel}
            aria-label={t.cancel}
            className="rounded-lg p-2 text-white/50 transition-colors hover:bg-rose-500/20 hover:text-rose-300 disabled:opacity-50"
          >
            <X className="size-4" />
          </button>
        </>
      )}
    </li>
  );
}

export default function MilanChamberPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { ready } = useRequireAuth();
  const { language } = useLanguage();
  const t = COPY[language as "en" | "bn" | "hi"] ?? COPY.en;

  const { data, isLoading, error } = useMilanRoom(ready ? id : null);
  const { addSeat, revokeSeat, end } = useMilanActions();

  const room = data?.room;
  const credentials = data?.credentials ?? null;
  const live = room ? isCallLive(room.status) : false;
  const connected = room?.status === "active";

  useMilanHeartbeat(id, live);

  const [elapsed, setElapsed] = React.useState(0);
  React.useEffect(() => {
    if (!room?.started_at) return;
    const started = new Date(room.started_at).getTime();
    const tick = () => setElapsed(Math.max(0, Math.floor((Date.now() - started) / 1000)));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [room?.started_at]);

  const [panelOpen, setPanelOpen] = React.useState(true);
  const [addOpen, setAddOpen] = React.useState(false);
  const [newLabel, setNewLabel] = React.useState("");
  const [endOpen, setEndOpen] = React.useState(false);

  // Once it is over there is nothing left on this screen worth looking at.
  React.useEffect(() => {
    if (room && !isCallLive(room.status)) {
      const timer = setTimeout(() => router.replace("/astrologers"), 3000);
      return () => clearTimeout(timer);
    }
  }, [room, router]);

  if (!ready || isLoading) return <LoadingBlock label={t.connecting} />;
  if (error) {
    return (
      <div className="mx-auto max-w-md p-6">
        <Alert tone="error">{(error as ApiError).message}</Alert>
      </div>
    );
  }
  if (!room) return null;

  const activeSeats = room.seats.filter((s) => !s.is_revoked);
  const canInvite = activeSeats.length < room.max_guests;

  const submitSeat = () => {
    const label = newLabel.trim();
    if (!label) return;
    addSeat.mutate(
      { id, label },
      {
        onSuccess: () => {
          setNewLabel("");
          setAddOpen(false);
        },
        onError: (e) => toast.error((e as ApiError).message),
      },
    );
  };

  return (
    <div className="relative flex h-dvh flex-col bg-night-950 text-white">
      {connected && credentials ? (
        <CallRoom
          credentials={credentials}
          onLeave={() => end.mutate({ id })}
          className="absolute inset-0"
          audioOnly={room.mode !== "video"}
          group
        />
      ) : (
        <div className="absolute inset-0 bg-cosmos" />
      )}

      {/* ------------------------------------------------- header */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center gap-3 bg-gradient-to-b from-black/70 to-transparent px-4 py-3">
        <Avatar
          src={room.astrologer_avatar_url}
          name={room.astrologer_name ?? undefined}
          size="sm"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{room.astrologer_name}</p>
          <p className="text-xs text-white/70">
            {MILAN_PURPOSE_LABELS[room.purpose][language as "en" | "bn" | "hi"] ??
              MILAN_PURPOSE_LABELS[room.purpose].en}
            {connected ? ` · ${formatDuration(elapsed)}` : ""}
          </p>
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setPanelOpen((v) => !v)}
            aria-label={t.guests}
          >
            <Users className="size-4" />
            {room.occupants.filter((o) => o.is_present).length + 1}
          </Button>
          <Button size="sm" variant="danger" onClick={() => setEndOpen(true)}>
            <PhoneOff className="size-4" />
          </Button>
        </div>
      </header>

      {!connected && (
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <Avatar
            src={room.astrologer_avatar_url}
            name={room.astrologer_name ?? undefined}
            size="xl"
          />
          <p className="text-lg font-semibold">{room.astrologer_name}</p>
          <p className="flex items-center gap-2 text-sm text-white/60">
            {live ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t.waiting}
              </>
            ) : (
              t.over
            )}
          </p>
          {!live && (
            <Button variant="secondary" onClick={() => router.replace("/astrologers")}>
              {t.back}
            </Button>
          )}
        </div>
      )}

      {/* ------------------------------------------- invitations panel */}
      {live && panelOpen && (
        <aside className="absolute bottom-4 right-3 top-20 z-20 flex w-[320px] max-w-[calc(100%-1.5rem)] flex-col overflow-hidden rounded-2xl border border-brand-300/25 bg-night-950/95 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Link2 className="size-4 text-brand-300" />
              {t.invite}
            </p>
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              aria-label={t.cancel}
              className="rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
            <p className="text-xs leading-snug text-white/55">{t.inviteHelp}</p>
            <ul className="space-y-2">
              {room.seats.map((seat) => (
                <SeatRow
                  key={seat.seat_id}
                  seat={seat}
                  t={t}
                  revoking={revokeSeat.isPending}
                  onRevoke={() =>
                    revokeSeat.mutate(
                      { id, seatId: seat.seat_id },
                      { onError: (e) => toast.error((e as ApiError).message) },
                    )
                  }
                />
              ))}
            </ul>

            {canInvite ? (
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setAddOpen(true)}
              >
                <Plus className="size-4" />
                {t.addSeat}
              </Button>
            ) : (
              <p className="text-center text-xs text-white/45">{t.full}</p>
            )}
          </div>
        </aside>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={t.addSeat}>
        <div className="space-y-3">
          <Field label={t.addLabel} htmlFor="milan-seat-label">
            <Input
              id="milan-seat-label"
              placeholder={t.addPlaceholder}
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              maxLength={60}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitSeat();
              }}
            />
          </Field>
          <Button
            className="w-full"
            onClick={submitSeat}
            disabled={!newLabel.trim() || addSeat.isPending}
          >
            {t.add}
          </Button>
        </div>
      </Modal>

      <Modal
        open={endOpen}
        onClose={() => setEndOpen(false)}
        title={t.endTitle}
        description={t.endBody}
      >
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setEndOpen(false)}>
            {t.keep}
          </Button>
          <Button
            variant="danger"
            disabled={end.isPending}
            onClick={() => end.mutate({ id }, { onSuccess: () => setEndOpen(false) })}
          >
            {t.endConfirm}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
