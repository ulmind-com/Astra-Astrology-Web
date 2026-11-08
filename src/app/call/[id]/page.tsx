"use client";

import { Clock, Coins, Moon, Phone, PhoneOff, Sparkles, Sun, Video } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { CallRoom } from "@/components/call/call-room";
import { CosmicWhiteboard } from "@/components/call/cosmic-whiteboard";
import { OutOfCoins, SessionMeter } from "@/components/consult/session-meter";
import { Alert, Avatar, Button, LoadingBlock, Modal } from "@/components/ui";
import { useCall, useCallActions, useCallHeartbeat, useCallTimer } from "@/hooks/use-call";
import { useLoopingSound } from "@/hooks/use-sound";
import { useWallet } from "@/hooks/use-wallet";
import { appointmentApi, whiteboardApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { useRequireAuth } from "@/providers/auth-provider";
import { useWhiteboardEvents } from "@/providers/realtime-provider";
import { CALL_STATUS_LABELS, formatDuration, isCallLive } from "@/types";

export default function CallPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { ready } = useRequireAuth();

  const { data, isLoading, error, refetch } = useCall(ready ? id : null);
  const { end } = useCallActions();

  const call = data?.call;
  const live = call ? isCallLive(call.status) : false;
  const connected = call?.status === "active";
  const isVideo = call?.mode === "video";

  useCallHeartbeat(id, live);
  const seconds = useCallTimer(call?.started_at);

  const { data: walletData } = useWallet(Boolean(ready));
  const [extensionActionLoading, setExtensionActionLoading] = React.useState(false);
  const [extensionDismissed, setExtensionDismissed] = React.useState(false);

  const extensionOffer = call?.extension_offer;
  const isExtensionPending = Boolean(
    call?.appointment_id &&
    extensionOffer?.status === "pending" &&
    !extensionDismissed
  );

  const balanceCoins = walletData?.wallet?.available_coins ?? call?.billing?.balance_coins ?? 0;
  const neededCoins = extensionOffer?.cost_coins ?? 0;
  const canAfford = balanceCoins >= neededCoins;

  const [whiteboardOpen, setWhiteboardOpen] = React.useState(false);

  // Theme State (Supports Ultra Pro Light & Dark)
  const [theme, setTheme] = React.useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("astra_call_theme");
      if (saved === "light" || saved === "dark") return saved;
    }
    return "light";
  });

  const toggleTheme = React.useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        localStorage.setItem("astra_call_theme", next);
        localStorage.setItem("astra_whiteboard_theme", next);
      }
      return next;
    });
  }, []);

  useWhiteboardEvents(
    React.useCallback(
      (event) => {
        if (event.type === "whiteboard_event" || event.type === "whiteboard_sync") {
          const payload = event.data;
          if (payload.call_id === id && typeof payload.is_open === "boolean") {
            setWhiteboardOpen(payload.is_open);
            if (payload.is_open) {
              toast.info("Astrologer opened the Cosmic Whiteboard ✨");
            }
          }
        }
      },
      [id],
    ),
  );

  // The caller hears the same tone while they wait, so "ringing…" on screen is
  // backed by something audible. It stops the moment the astrologer answers.
  useLoopingSound("ring", call?.status === "ringing");

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
    <div
      className={cn(
        "relative flex h-dvh flex-col transition-colors duration-300",
        theme === "dark"
          ? "bg-night-950 text-white"
          : "bg-gradient-to-br from-[#fcf9f2] via-[#f7f2e4] to-[#ede3cf] text-[#1a1208]",
      )}
    >
      {/* The SDK fills the frame once connected; everything else floats over. */}
      {connected && data?.credentials ? (
        <CallRoom
          credentials={data.credentials}
          onLeave={hangUp}
          className="absolute inset-0"
          audioOnly={!isVideo}
        />
      ) : (
        <div
          className={cn(
            "absolute inset-0 transition-opacity",
            theme === "dark"
              ? "bg-cosmos"
              : "bg-[radial-gradient(ellipse_at_center,rgba(250,204,21,0.18)_0%,rgba(245,235,215,0.85)_60%,rgba(237,227,207,1)_100%)]",
          )}
        />
      )}

      {connected && (
        <CosmicWhiteboard
          callId={id}
          peerUserId={call.astrologer_user_id}
          role="seeker"
          isOpen={whiteboardOpen}
          onClose={() => setWhiteboardOpen(false)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {/* ------------------------------------------------- connected chrome */}
      {connected && call.billing && (
        <div className="pointer-events-auto absolute inset-x-0 top-16 z-10 px-3">
          <SessionMeter
            sessionId={id}
            kind="call"
            billing={call.billing}
            elapsedSeconds={seconds}
            onDark={theme === "dark"}
            onExtended={() => refetch()}
          />
        </div>
      )}

      {connected ? (
        <header
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center gap-3 px-4 py-3 transition-colors",
            theme === "dark"
              ? "bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white"
              : "bg-white/85 border-b border-[#ebdca5] text-[#1a1208] shadow-xs backdrop-blur-md",
          )}
        >
          <div className="min-w-0 flex-1">
            <p className={cn("truncate text-sm font-bold", theme === "dark" ? "text-white" : "text-[#1a1208]")}>
              {call.peer?.name}
            </p>
            <p
              className={cn(
                "flex items-center gap-1.5 text-xs font-semibold",
                theme === "dark" ? "text-white/70" : "text-[#766545]",
              )}
            >
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              {formatDuration(seconds)}
            </p>
          </div>
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Theme Toggle (Light / Dark) */}
            <button
              type="button"
              onClick={toggleTheme}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-all border shadow-xs pointer-events-auto",
                theme === "dark"
                  ? "bg-night-900/90 border-white/20 text-amber-300 hover:bg-night-800"
                  : "bg-white/95 border-[#ecd57c] text-amber-900 hover:bg-[#fff7d6]",
              )}
              title={theme === "dark" ? "Switch to Sacred Light Mode" : "Switch to Celestial Dark Mode"}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="size-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="size-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </button>

            <Button
              size="sm"
              onClick={() => setWhiteboardOpen((v) => !v)}
              className={cn(
                "text-xs font-bold transition-all shadow-sm",
                whiteboardOpen
                  ? "bg-amber-400 text-slate-950 border border-amber-300 ring-2 ring-amber-400/50"
                  : theme === "dark"
                    ? "bg-amber-950/70 hover:bg-amber-900 text-amber-200 border border-amber-500/40"
                    : "bg-white/95 hover:bg-[#fff7d6] text-amber-900 border border-[#ecd57c] shadow-xs",
              )}
              title="Open interactive Kundali cosmic whiteboard"
            >
              <Sparkles className="size-3.5 mr-1 text-amber-400" />
              Cosmic Whiteboard
            </Button>
            <Button
              size="sm"
              onClick={hangUp}
              disabled={end.isPending}
              className="bg-rose-600 text-white hover:bg-rose-500 shadow-sm font-bold"
            >
              <PhoneOff className="size-4 mr-1" />
              End
            </Button>
          </div>
        </header>
      ) : (
        /* ------------------------------------------ ringing / finished */
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
          {live ? (
            <>
              <span className="relative flex size-32 items-center justify-center">
                <span
                  className={cn(
                    "absolute inset-0 animate-ping rounded-full",
                    theme === "dark" ? "bg-white/10" : "bg-amber-400/25",
                  )}
                />
                <Avatar
                  src={call.peer?.avatar_url}
                  name={call.peer?.name}
                  size="xl"
                  className={cn(
                    "relative",
                    theme === "light" && "ring-4 ring-amber-400/40 shadow-xl",
                  )}
                />
              </span>

              <div>
                <p className={cn("text-xl font-bold", theme === "dark" ? "text-white" : "text-[#1a1208]")}>
                  {call.peer?.name}
                </p>
                <p
                  className={cn(
                    "mt-1.5 flex items-center justify-center gap-2 text-sm font-semibold",
                    theme === "dark" ? "text-white/60" : "text-[#8b5e0a]",
                  )}
                >
                  <Icon className="size-4" />
                  {isVideo ? "Video call" : "Voice call"} · ringing…
                </p>
              </div>

              <p className={cn("max-w-xs text-xs", theme === "dark" ? "text-white/40" : "text-[#766545] font-medium")}>
                We will connect you the moment they answer. Keep this screen open.
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all border shadow-xs",
                    theme === "dark"
                      ? "bg-night-900/90 border-white/20 text-amber-300 hover:bg-night-800"
                      : "bg-white/95 border-[#ecd57c] text-amber-900 hover:bg-[#fff7d6]",
                  )}
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="size-3.5 text-amber-400" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="size-3.5 text-indigo-600" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>

                <Button
                  onClick={hangUp}
                  disabled={end.isPending}
                  className="bg-rose-600 text-white hover:bg-rose-500 shadow-sm font-bold"
                >
                  <PhoneOff className="size-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            call.end_reason === "Ran out of coins" ? (
              <div className={cn("rounded-2xl p-6", theme === "dark" ? "bg-white/5" : "bg-white/90 border border-[#e2d5a3] shadow-md")}>
                <OutOfCoins onBack={() => router.replace("/astrologers")} />
              </div>
            ) : (
            <>
              <span
                className={cn(
                  "flex size-20 items-center justify-center rounded-full",
                  theme === "dark" ? "bg-white/10 text-white" : "bg-amber-100 text-amber-900 border border-amber-300/60 shadow-md",
                )}
              >
                <PhoneOff className="size-8 text-rose-500" />
              </span>
              <div>
                <p className={cn("text-xl font-bold", theme === "dark" ? "text-white" : "text-[#1a1208]")}>
                  {CALL_STATUS_LABELS[call.status]}
                </p>
                {call.duration_seconds > 0 && (
                  <p
                    className={cn(
                      "mt-1 text-sm font-semibold",
                      theme === "dark" ? "text-white/60" : "text-[#766545]",
                    )}
                  >
                    {formatDuration(call.duration_seconds)}
                  </p>
                )}
                {call.end_reason && (
                  <p className={cn("mt-1 text-xs", theme === "dark" ? "text-white/40" : "text-[#8b6a1a]")}>
                    {call.end_reason}
                  </p>
                )}
              </div>
              <Button
                variant="secondary"
                onClick={() => router.replace("/astrologers")}
                className={cn(
                  "font-bold shadow-xs",
                  theme === "light" && "bg-white border-[#ecd57c] text-amber-950 hover:bg-[#fff7d6]",
                )}
              >
                Back to Astrologers
              </Button>
            </>
            )
          )}
        </div>
      )}

      {/* In-Chamber Consultation Extension Offer Modal */}
      {isExtensionPending && extensionOffer && (
        <Modal
          open={isExtensionPending}
          onClose={() => setExtensionDismissed(true)}
          title="সেশন বৃদ্ধির প্রস্তাব (Consultation Extension)"
          description={`${call.peer?.name || "জ্যোতিষী"} আলোচনার গভীরতার জন্য সেশনটি আরও ${extensionOffer.extra_minutes || 10} মিনিট বৃদ্ধি করতে চান।`}
          footer={
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 w-full">
              <Button
                variant="secondary"
                disabled={extensionActionLoading}
                onClick={async () => {
                  setExtensionActionLoading(true);
                  try {
                    await appointmentApi.extensionAction(call.appointment_id!, "decline");
                    setExtensionDismissed(true);
                    toast.info("এক্সটেনশন প্রস্তাব বাতিল করা হয়েছে। বর্তমান সময়েই শেষ হবে।");
                    refetch();
                  } catch (err: any) {
                    toast.error(err?.message || "Failed to decline extension.");
                  } finally {
                    setExtensionActionLoading(false);
                  }
                }}
                className="w-full sm:w-auto"
              >
                না, বর্তমান সময়েই শেষ হোক
              </Button>

              {canAfford ? (
                <Button
                  variant="primary"
                  disabled={extensionActionLoading}
                  onClick={async () => {
                    setExtensionActionLoading(true);
                    try {
                      await appointmentApi.extensionAction(call.appointment_id!, "accept");
                      toast.success(`সেশনটি সফলভাবে +${extensionOffer.extra_minutes || 10} মিনিট বৃদ্ধি করা হয়েছে!`);
                      refetch();
                    } catch (err: any) {
                      toast.error(err?.message || "এক্সটেনশন নিশ্চিত করা যায়নি।");
                    } finally {
                      setExtensionActionLoading(false);
                    }
                  }}
                  className="w-full sm:w-auto font-bold bg-amber-500 hover:bg-amber-400 text-slate-950"
                >
                  <Sparkles className="size-3.5 mr-1 text-slate-950" />
                  {extensionActionLoading ? "যুক্ত হচ্ছে..." : `একমত ও +${extensionOffer.extra_minutes || 10} মি. বৃদ্ধি করুন`}
                </Button>
              ) : (
                <Link
                  href="/account/wallet"
                  target="_blank"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
                >
                  <Coins className="size-3.5 mr-1" />
                  ওয়ালেট রিচার্জ করুন ({neededCoins} Coins)
                </Link>
              )}
            </div>
          }
        >
          <div className="space-y-3.5 py-2 text-xs text-slate-800">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-amber-200/60">
                <span className="text-slate-600">অতিরিক্ত সময় (Extra Time):</span>
                <span className="font-extrabold text-amber-950 text-sm">+{extensionOffer.extra_minutes || 10} Minutes</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-amber-200/60">
                <span className="text-slate-600">ফি (Extension Fee):</span>
                <span className="font-extrabold text-amber-950">{extensionOffer.cost_coins} Coins (₹{Math.round(extensionOffer.cost_paise / 100)})</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2">
                <span className="text-slate-600">আপনার উপলব্ধ ব্যালেন্স:</span>
                <span className={cn("font-bold", canAfford ? "text-emerald-700" : "text-rose-600")}>
                  {balanceCoins} Coins {canAfford ? "✓ পর্যাপ্ত" : "✗ অপর্যাপ্ত"}
                </span>
              </div>
            </div>

            {!canAfford && (
              <Alert tone="warning">
                আপনার ওয়ালেটে পর্যাপ্ত কয়েন নেই। নতুন ট্যাবে ওয়ালেট রিচার্জ করে এসে "একমত" বাটনে ক্লিক করুন অথবা বর্তমান সময়েই শেষ করতে ডিক্লাইন করুন।
              </Alert>
            )}

            <p className="text-[11px] text-slate-500 italic">
              * সম্মতি দিলে কলটি কোনো বিরতি ছাড়া চলমান থাকবে এবং স্বয়ংক্রিয়ভাবে ঘড়িতে অতিরিক্ত সময় যুক্ত হবে।
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
