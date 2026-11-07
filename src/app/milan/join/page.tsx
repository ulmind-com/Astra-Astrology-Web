"use client";

/**
 * Joining a Vedic chamber as a guest.
 *
 * A bride's father in another country should not have to register before a
 * consultation that starts in ten minutes, so this page asks for nothing but
 * a name to show in the room. The invitation code in the URL is the whole
 * credential, which is why it is never rendered, never stored, and why the
 * seat is released the moment the page is closed.
 */

import { Loader2, PhoneOff, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { CallRoom } from "@/components/call/call-room";
import { Alert, Avatar, Button, Field, Input, LoadingBlock } from "@/components/ui";
import { useGuestHeartbeat, useGuestLeave, useGuestMilanRoom } from "@/hooks/use-milan";
import { ApiError } from "@/lib/api/client";
import { useLanguage } from "@/providers/language-provider";
import { formatDuration, isCallLive } from "@/types";
import { MILAN_PURPOSE_LABELS } from "@/types/milan";

type Strings = {
  title: string; nameLabel: string; namePlaceholder: string; join: string;
  joining: string; waiting: string; noCode: string; leave: string;
  over: string; inRoom: string; home: string;
};

const COPY: Record<"en" | "bn" | "hi", Strings> = {
  en: {
    title: "Join the consultation",
    nameLabel: "Your name",
    namePlaceholder: "The name the others will see",
    join: "Join",
    joining: "Joining the chamber…",
    waiting: "Waiting for the astrologer to join",
    noCode: "This link is incomplete. Please use the invitation you were sent.",
    leave: "Leave",
    over: "This consultation is over.",
    inRoom: "In the chamber",
    home: "Go to DivinLink",
  },
  bn: {
    title: "পরামর্শে যোগ দিন",
    nameLabel: "আপনার নাম",
    namePlaceholder: "যে নামটি অন্যরা দেখবেন",
    join: "যোগ দিন",
    joining: "চেম্বারে ঢোকা হচ্ছে…",
    waiting: "জ্যোতিষীর যোগ দেওয়ার অপেক্ষায়",
    noCode: "লিংকটি অসম্পূর্ণ। আপনাকে পাঠানো আমন্ত্রণটি ব্যবহার করুন।",
    leave: "বেরিয়ে যান",
    over: "এই পরামর্শটি শেষ হয়ে গেছে।",
    inRoom: "চেম্বারে",
    home: "DivinLink-এ যান",
  },
  hi: {
    title: "परामर्श में शामिल हों",
    nameLabel: "आपका नाम",
    namePlaceholder: "वह नाम जो दूसरे देखेंगे",
    join: "शामिल हों",
    joining: "चैंबर में प्रवेश हो रहा है…",
    waiting: "ज्योतिषी के जुड़ने की प्रतीक्षा",
    noCode: "यह लिंक अधूरा है। कृपया आपको भेजा गया आमंत्रण उपयोग करें।",
    leave: "बाहर जाएं",
    over: "यह परामर्श समाप्त हो चुका है।",
    inRoom: "चैंबर में",
    home: "DivinLink पर जाएं",
  },
};

function GuestChamber({ code, t }: { code: string; t: Strings }) {
  const router = useRouter();
  // Asked before joining, because the seat is claimed by the join itself and
  // the others should see a name rather than "Guest 2".
  const [name, setName] = React.useState("");
  const [confirmed, setConfirmed] = React.useState(false);

  const { data, isLoading, error } = useGuestMilanRoom(
    confirmed ? code : null,
    name.trim() || undefined,
  );

  const room = data?.room;
  const credentials = data?.credentials ?? null;
  const live = room ? isCallLive(room.status) : false;
  const connected = room?.status === "active";

  useGuestHeartbeat(code, live);
  const leave = useGuestLeave(code);

  // Frees the seat when the tab goes, so the host can re-issue it instead of
  // waiting out the grace period.
  React.useEffect(() => {
    if (!confirmed) return;
    const release = () => leave();
    window.addEventListener("pagehide", release);
    return () => {
      window.removeEventListener("pagehide", release);
      release();
    };
  }, [confirmed, leave]);

  const [elapsed, setElapsed] = React.useState(0);
  React.useEffect(() => {
    if (!room?.started_at) return;
    const started = new Date(room.started_at).getTime();
    const tick = () => setElapsed(Math.max(0, Math.floor((Date.now() - started) / 1000)));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [room?.started_at]);

  if (!confirmed) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-5 p-6">
        <div className="space-y-1 text-center">
          <Users className="mx-auto size-8 text-brand-500" />
          <h1 className="text-xl font-semibold">{t.title}</h1>
        </div>
        <Field label={t.nameLabel} htmlFor="milan-guest-name">
          <Input
            id="milan-guest-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.namePlaceholder}
            maxLength={60}
            onKeyDown={(e) => {
              if (e.key === "Enter" && name.trim()) setConfirmed(true);
            }}
          />
        </Field>
        <Button disabled={!name.trim()} onClick={() => setConfirmed(true)}>
          {t.join}
        </Button>
      </div>
    );
  }

  if (isLoading) return <LoadingBlock label={t.joining} />;
  if (error) {
    return (
      <div className="mx-auto max-w-md space-y-4 p-6">
        <Alert tone="error">{(error as ApiError).message}</Alert>
        <Button variant="secondary" onClick={() => router.replace("/")}>
          {t.home}
        </Button>
      </div>
    );
  }
  if (!room) return null;

  return (
    <div className="relative flex h-dvh flex-col bg-night-950 text-white">
      {connected && credentials ? (
        <CallRoom
          credentials={credentials}
          onLeave={() => {
            leave();
            router.replace("/");
          }}
          className="absolute inset-0"
          audioOnly={room.mode !== "video"}
          group
        />
      ) : (
        <div className="absolute inset-0 bg-cosmos" />
      )}

      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center gap-3 bg-gradient-to-b from-black/70 to-transparent px-4 py-3">
        <Avatar
          src={room.astrologer_avatar_url}
          name={room.astrologer_name ?? undefined}
          size="sm"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{room.astrologer_name}</p>
          <p className="text-xs text-white/70">
            {MILAN_PURPOSE_LABELS[room.purpose].en}
            {connected ? ` · ${formatDuration(elapsed)}` : ""}
          </p>
        </div>
        <div className="pointer-events-auto">
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              leave();
              router.replace("/");
            }}
          >
            <PhoneOff className="size-4" />
            {t.leave}
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
          {room.occupants.some((o) => o.is_present) && (
            <p className="text-xs text-white/45">
              {t.inRoom}:{" "}
              {room.occupants
                .filter((o) => o.is_present)
                .map((o) => o.display_name || o.label)
                .join(", ")}
            </p>
          )}
          {!live && (
            <Button variant="secondary" onClick={() => router.replace("/")}>
              {t.home}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function JoinInner() {
  const params = useSearchParams();
  const { language } = useLanguage();
  const t = COPY[language as "en" | "bn" | "hi"] ?? COPY.en;
  const code = params.get("code");

  if (!code) {
    return (
      <div className="mx-auto max-w-md p-6">
        <Alert tone="error">{t.noCode}</Alert>
      </div>
    );
  }
  return <GuestChamber code={code} t={t} />;
}

export default function MilanJoinPage() {
  // useSearchParams needs a Suspense boundary for a statically rendered route.
  return (
    <React.Suspense fallback={<LoadingBlock />}>
      <JoinInner />
    </React.Suspense>
  );
}
