"use client";

/**
 * Reading the astrologer's reply as it is written, and sending a spoken one.
 *
 * Waiting ten seconds at an empty bubble is most of what made this feel like a
 * form rather than a conversation. The answer takes exactly as long either
 * way; it just stops being invisible while it happens.
 */

import { apiBase } from "@/lib/env";
import { session } from "@/lib/session";

export type AiStreamEvent =
  | { type: "status"; message: string }
  | { type: "delta"; text: string }
  | {
      type: "done";
      reply: string;
      tools_called?: string[];
      citations?: unknown[];
      suggested_followups?: string[];
      answered?: boolean;
      session_id?: string;
    }
  | { type: "error"; message: string };

export type AskBody = {
  message: string;
  session_id?: string;
  preferred_language?: string;
  birth_date?: string;
  birth_time?: string;
  birth_place?: string;
  latitude?: number;
  longitude?: number;
};

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = session.accessToken;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/**
 * Ask, and yield each event as it arrives.
 *
 * Server-sent events are parsed by hand rather than with `EventSource`,
 * because `EventSource` can only issue GET requests and this is a POST with a
 * body. The parsing itself is small: split on the blank line that terminates
 * an event, and read the `data:` line out of each.
 *
 * `signal` lets the page abandon a reply — a user who asks something else
 * mid-answer should not have two streams writing into the same bubble.
 */
export async function* askAstrologer(
  body: AskBody,
  signal?: AbortSignal,
): AsyncGenerator<AiStreamEvent> {
  const response = await fetch(`${apiBase}/ai-astrologer/chat/stream`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error("The astrologer could not be reached. Please try again.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // Events are separated by a blank line. Anything after the last one is a
    // partial event and stays in the buffer until the rest of it arrives.
    let boundary = buffer.indexOf("\n\n");
    while (boundary !== -1) {
      const raw = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      boundary = buffer.indexOf("\n\n");

      for (const line of raw.split("\n")) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload) continue;
        try {
          yield JSON.parse(payload) as AiStreamEvent;
        } catch {
          // A malformed event is skipped rather than killing the stream; the
          // next one is usually fine and the answer keeps arriving.
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Voice
// ---------------------------------------------------------------------------
/**
 * Whether this browser can record at all.
 *
 * Checked before the microphone button is shown, so nobody presses something
 * that cannot work. `getUserMedia` is absent on plain HTTP origins other than
 * localhost, which is the usual reason this comes back false.
 */
export function canRecord(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== "undefined"
  );
}

/** The best container this browser will actually produce. */
function pickMimeType(): string | undefined {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
  ];
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported?.(type)) return type;
  }
  return undefined;
}

export type Recorder = {
  /** Stop recording and return what was captured. */
  stop: () => Promise<Blob>;
  /** Abandon the recording and release the microphone. */
  cancel: () => void;
};

/**
 * Start recording from the microphone.
 *
 * The caller holds the returned handle for as long as the button is held down.
 * Both `stop` and `cancel` release the microphone track — leaving it open
 * keeps the browser's recording indicator lit, which people reasonably find
 * alarming.
 */
export async function startRecording(): Promise<Recorder> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mimeType = pickMimeType();
  const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
  const chunks: BlobPart[] = [];

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  };
  recorder.start();

  const release = () => stream.getTracks().forEach((track) => track.stop());

  return {
    stop: () =>
      new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          release();
          resolve(new Blob(chunks, { type: mimeType || "audio/webm" }));
        };
        if (recorder.state !== "inactive") recorder.stop();
        else {
          release();
          resolve(new Blob(chunks, { type: mimeType || "audio/webm" }));
        }
      }),
    cancel: () => {
      try {
        if (recorder.state !== "inactive") recorder.stop();
      } finally {
        release();
      }
    },
  };
}

/** Send a recording to be transcribed, and get the words back. */
export async function transcribe(audio: Blob): Promise<string> {
  const form = new FormData();
  // The extension tells the service how to open the bytes; webm is what
  // MediaRecorder produces in the browsers that matter here.
  form.append("file", audio, "speech.webm");

  const headers: Record<string, string> = {};
  const token = session.accessToken;
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${apiBase}/ai-astrologer/transcribe`, {
    method: "POST",
    headers,
    body: form,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || "That recording could not be read.");
  }
  const text = (data?.data?.text || "").trim();
  if (!text) throw new Error("Nothing was heard in that recording.");
  return text;
}
