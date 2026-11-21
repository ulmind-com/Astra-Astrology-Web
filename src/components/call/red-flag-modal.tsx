"use client";

import { AlertTriangle, Flag, Loader2, ShieldAlert, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button, Modal } from "@/components/ui";
import { appointmentApi, callApi } from "@/lib/api";
import { cn } from "@/lib/utils";

interface RedFlagModalProps {
  isOpen: boolean;
  onClose: () => void;
  callId: string;
  appointmentId?: string | null;
  clientName?: string | null;
  onSuccess?: () => void;
  theme?: "light" | "dark";
}

const RED_FLAG_REASONS = [
  { id: "Abusive or vulgar language", label: "Abusive or vulgar language (অকথ্য ভাষা বা গালিগালাজ)" },
  { id: "Harassment or inappropriate behavior", label: "Harassment or inappropriate behavior (অসদাচরণ বা হেনস্থা)" },
  { id: "Threats or intimidation", label: "Threats or intimidation (হুমকি বা ভীতি প্রদর্শন)" },
  { id: "Fraudulent or suspicious caller", label: "Fraudulent or suspicious caller (প্রতারণামূলক বা ভুয়ো কলার)" },
  { id: "Other terms of service violation", label: "Other terms of service violation (অন্যান্য নীতি লঙ্ঘন)" },
];

export function RedFlagModal({
  isOpen,
  onClose,
  callId,
  appointmentId,
  clientName,
  onSuccess,
  theme = "light",
}: RedFlagModalProps) {
  const [selectedReason, setSelectedReason] = React.useState(RED_FLAG_REASONS[0].id);
  const [notes, setNotes] = React.useState("");
  const [blacklistClient, setBlacklistClient] = React.useState(true);
  const [terminateCall, setTerminateCall] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      reason: selectedReason,
      notes: notes.trim() || undefined,
      blacklist_client: blacklistClient,
      terminate_call: terminateCall,
    };

    try {
      if (appointmentId) {
        await appointmentApi.redFlag(appointmentId, payload);
      } else {
        await callApi.redFlag(callId, payload);
      }

      toast.error("Session terminated and red-flagged. Escrow compensation secured.", {
        description: blacklistClient
          ? `${clientName || "Client"} has been permanently added to your personal blacklist.`
          : "Trust & Safety incident report filed.",
        duration: 5000,
      });

      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit red-flag report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Report & Red-Flag Session">
      <div
        className={cn(
          "relative max-w-lg w-full rounded-2xl p-6 shadow-2xl transition-all border",
          theme === "dark"
            ? "bg-neutral-900 border-red-900/40 text-neutral-100"
            : "bg-white border-red-200 text-neutral-900",
        )}
      >
        {/* Header Badge & Title */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
              <ShieldAlert className="size-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase">
                  Zero Tolerance
                </span>
                <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                  Trust & Safety Protection
                </span>
              </div>
              <h3 className="text-lg font-bold font-serif mt-0.5">
                Report & Red-Flag Session
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* Protection Guarantee Advisory */}
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-800 dark:text-red-200 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="size-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <strong className="font-semibold">Astrologer Protection Protocol:</strong>
              <p className="mt-0.5 text-red-700/90 dark:text-red-300/90 text-[11px]">
                Upon confirming this report, the live consultation room closes immediately. Your consultation escrow fee is <strong>100% captured as guaranteed earned compensation</strong>, an audit case is logged, and this client is permanently blocked from booking your schedule.
              </p>
            </div>
          </div>
        </div>

        {/* Reporting Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
              Primary Misconduct Reason *
            </label>
            <div className="space-y-2">
              {RED_FLAG_REASONS.map((r) => (
                <label
                  key={r.id}
                  className={cn(
                    "flex items-center gap-3 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all",
                    selectedReason === r.id
                      ? "border-red-500 bg-red-500/10 text-red-900 dark:text-red-100 font-semibold"
                      : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300",
                  )}
                >
                  <input
                    type="radio"
                    name="red_flag_reason"
                    value={r.id}
                    checked={selectedReason === r.id}
                    onChange={() => setSelectedReason(r.id)}
                    className="accent-red-600 size-3.5"
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
              Incident Context / Notes (Confidential)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe what occurred (e.g. repeated profanity, inappropriate visual conduct, intimidation)..."
              className={cn(
                "w-full rounded-xl border p-2.5 text-xs transition-colors outline-none",
                theme === "dark"
                  ? "bg-neutral-950 border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus:border-red-500"
                  : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-red-500",
              )}
            />
          </div>

          {/* Action Checkboxes */}
          <div className="space-y-2 pt-1 border-t border-neutral-200 dark:border-neutral-800">
            <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={blacklistClient}
                onChange={(e) => setBlacklistClient(e.target.checked)}
                className="accent-red-600 size-4 rounded"
              />
              <span className="text-neutral-800 dark:text-neutral-200">
                Permanently add {clientName ? <strong>{clientName}</strong> : "this seeker"} to personal Blacklist
              </span>
            </label>

            <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={terminateCall}
                onChange={(e) => setTerminateCall(e.target.checked)}
                className="accent-red-600 size-4 rounded"
              />
              <span className="text-neutral-800 dark:text-neutral-200">
                Terminate live call room immediately on submission
              </span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={submitting}
              className="text-xs"
            >
              Cancel / Stay in Session
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                  Red-Flagging Session…
                </>
              ) : (
                <>
                  <Flag className="size-3.5 mr-1.5" />
                  Confirm Red-Flag & Terminate
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
