"use client";

/**
 * Opening a multi-party Vedic chamber.
 *
 * Kundali matching is rarely one person, so this asks up front who else is
 * coming and creates a seat for each of them. The seats are named rather
 * than numbered because the host has to know which link to send to whom,
 * and because "Bride's father" is what they will be called in the room.
 *
 * Only the host pays, and the rate is the astrologer's ordinary per-minute
 * rate however many people sit in — which is stated here rather than left
 * to be discovered on the wallet screen.
 */

import { Plus, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useMutation } from "@tanstack/react-query";

import { Alert, Button, Field, Input, Modal, Select } from "@/components/ui";
import { milanApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";
import type { AstrologerPublic, ConsultationMode } from "@/types";
import type { MilanPurpose } from "@/types/milan";

type Strings = {
  open: string; blurb: string; title: string; purpose: string;
  matching: string; vastu: string; other: string; minutes: string;
  who: string; whoHelp: string; addGuest: string; guestPlaceholder: string;
  rate: string; start: string; max: string; needName: string;
};

const COPY: Record<"en" | "bn" | "hi", Strings> = {
  en: {
    open: "Open a family chamber",
    blurb: "Bride, groom and guardians in one video room",
    title: "Multi-party chamber",
    purpose: "What is this for?",
    matching: "Kundali matching",
    vastu: "Family vastu",
    other: "Something else",
    minutes: "How long?",
    who: "Who else is joining?",
    whoHelp:
      "Each person gets their own link. You can add or cancel them during the session too.",
    addGuest: "Add another",
    guestPlaceholder: "e.g. Bride's father",
    rate: "You pay the usual per-minute rate — the others join free.",
    start: "Open the chamber",
    max: "That is as many as this chamber seats.",
    needName: "Give each seat a name.",
  },
  bn: {
    open: "পারিবারিক চেম্বার খুলুন",
    blurb: "বর, কনে ও অভিভাবক — এক ভিডিও ঘরে",
    title: "মাল্টি-পার্টি চেম্বার",
    purpose: "কী বিষয়ে?",
    matching: "কুণ্ডলী মিলন",
    vastu: "পারিবারিক বাস্তু",
    other: "অন্য কিছু",
    minutes: "কতক্ষণ?",
    who: "আর কারা যোগ দেবেন?",
    whoHelp:
      "প্রত্যেকে নিজের আলাদা লিংক পাবেন। সেশনের মাঝেও যোগ করা বা বাতিল করা যাবে।",
    addGuest: "আরও একজন",
    guestPlaceholder: "যেমন কনের বাবা",
    rate: "আপনি স্বাভাবিক প্রতি-মিনিট হারেই দেবেন — বাকিরা বিনামূল্যে যোগ দেবেন।",
    start: "চেম্বার খুলুন",
    max: "এই চেম্বারে এর বেশি আসন নেই।",
    needName: "প্রতিটি আসনের একটি নাম দিন।",
  },
  hi: {
    open: "पारिवारिक चैंबर खोलें",
    blurb: "वर, वधू और अभिभावक — एक ही वीडियो कक्ष में",
    title: "मल्टी-पार्टी चैंबर",
    purpose: "किस विषय पर?",
    matching: "कुंडली मिलान",
    vastu: "पारिवारिक वास्तु",
    other: "कुछ और",
    minutes: "कितनी देर?",
    who: "और कौन जुड़ेगा?",
    whoHelp:
      "हर व्यक्ति को अपना अलग लिंक मिलेगा। सत्र के दौरान भी जोड़ या रद्द कर सकते हैं।",
    addGuest: "एक और जोड़ें",
    guestPlaceholder: "जैसे वधू के पिता",
    rate: "आप सामान्य प्रति-मिनट दर ही देंगे — बाकी निःशुल्क जुड़ेंगे।",
    start: "चैंबर खोलें",
    max: "इस चैंबर में इससे अधिक स्थान नहीं है।",
    needName: "हर आसन को एक नाम दें।",
  },
};

// The ceiling the API enforces. The configured limit may be lower, and the
// server is what decides — this only stops the form growing past any of it.
const MAX_GUESTS = 8;
const MINUTES = [15, 20, 30, 45, 60];

export function MilanLauncher({ astrologer }: { astrologer: AstrologerPublic }) {
  const router = useRouter();
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = COPY[language as "en" | "bn" | "hi"] ?? COPY.en;

  const [open, setOpen] = React.useState(false);
  const [purpose, setPurpose] = React.useState<MilanPurpose>("kundali_matching");
  const [minutes, setMinutes] = React.useState(30);
  const [guests, setGuests] = React.useState<string[]>(["Bride", "Groom"]);
  const [error, setError] = React.useState<string | null>(null);

  // A chamber is a video session; a voice one is the same room with the
  // cameras off, so either mode being offered is enough.
  const mode: ConsultationMode = astrologer.modes_enabled.includes("video")
    ? "video"
    : "call";
  const offered =
    astrologer.modes_enabled.includes("video") ||
    astrologer.modes_enabled.includes("call");
  const online = astrologer.availability.is_online;

  const create = useMutation({
    mutationFn: () =>
      milanApi.create({
        astrologer_id: astrologer.id,
        mode,
        purpose,
        requested_minutes: minutes,
        guests: guests.map((g) => g.trim()).filter(Boolean),
      }),
    onSuccess: (session) => router.push(`/milan/${session.room.id}`),
    onError: (e: ApiError) => setError(e.message),
  });

  if (!offered) return null;

  const submit = () => {
    setError(null);
    if (guests.some((g) => !g.trim())) {
      setError(t.needName);
      return;
    }
    create.mutate();
  };

  return (
    <>
      <button
        type="button"
        disabled={!online}
        onClick={() => {
          if (!user) {
            router.push(`/login?next=/astrologers/${astrologer.slug}`);
            return;
          }
          setError(null);
          setOpen(true);
        }}
        className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition-all duration-200 ${
          online
            ? "border-border hover:border-brand-500/55 hover:bg-brand-500/8 hover:shadow-soft"
            : "cursor-not-allowed border-border/50 opacity-55"
        }`}
      >
        <span className="flex items-center gap-3 text-sm font-medium">
          <span className="icon-box flex size-9 items-center justify-center rounded-xl icon-box-brand">
            <Users className="size-4" />
          </span>
          <span>
            <span className="block font-semibold text-foreground">{t.open}</span>
            <span className="block text-xs font-normal text-muted-foreground">
              {t.blurb}
            </span>
          </span>
        </span>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={t.title}>
        <div className="space-y-4">
          <Field label={t.purpose} htmlFor="milan-purpose">
            <Select
              id="milan-purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value as MilanPurpose)}
            >
              <option value="kundali_matching">{t.matching}</option>
              <option value="family_vastu">{t.vastu}</option>
              <option value="other">{t.other}</option>
            </Select>
          </Field>

          <Field label={t.minutes} htmlFor="milan-minutes">
            <Select
              id="milan-minutes"
              value={String(minutes)}
              onChange={(e) => setMinutes(Number(e.target.value))}
            >
              {MINUTES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </Field>

          <Field label={t.who} hint={t.whoHelp}>
            <div className="space-y-2">
              {guests.map((g, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={g}
                    placeholder={t.guestPlaceholder}
                    maxLength={60}
                    onChange={(e) =>
                      setGuests((prev) =>
                        prev.map((v, j) => (j === i ? e.target.value : v)),
                      )
                    }
                  />
                  <button
                    type="button"
                    aria-label="Remove"
                    onClick={() => setGuests((prev) => prev.filter((_, j) => j !== i))}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
              {guests.length < MAX_GUESTS ? (
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setGuests((prev) => [...prev, ""])}
                >
                  <Plus className="size-4" />
                  {t.addGuest}
                </Button>
              ) : (
                <p className="text-xs text-muted-foreground">{t.max}</p>
              )}
            </div>
          </Field>

          <p className="text-xs text-muted-foreground">{t.rate}</p>
          {error && <Alert tone="error">{error}</Alert>}

          <Button className="w-full" onClick={submit} disabled={create.isPending}>
            {t.start}
          </Button>
        </div>
      </Modal>
    </>
  );
}
