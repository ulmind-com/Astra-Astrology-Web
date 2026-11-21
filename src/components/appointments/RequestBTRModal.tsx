"use client";

/**
 * Astrologer's Request Birth Time Rectification (BTR) Modal.
 *
 * Allows astrologers to formally request birth time clarification / rectification
 * from the client, with customizable presets (Cusp Lagna, Navamsha D9, Hospital slip).
 */

import { Clock, Info, Loader2, Sparkles } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button, Modal } from "@/components/ui";
import { appointmentApi } from "@/lib/api";

const BTR_PRESET_NOTES = [
  "লগ্ন প্রান্তিক (Cusp Lagna) — সঠিক মিনিট ও প্রধান জীবন ঘটনার সময় প্রয়োজন।",
  "নবাংশ ডি৯ ও দশা সূক্ষ্ম গণনার জন্য প্রধান ৩-৪টি ঐতিহাসিক ঘটনার তারিখ দিন।",
  "হাসপাতাল ডিসচার্জ স্লিপ বা পরিবারের কোষ্ঠি অনুযায়ী সুনির্দিষ্ট মিনিট যাচাই করুন।",
  "জন্ম সময় রাউন্ড ফিগারে থাকায় (যেমন: ১২:০০ বা ৫:৩০) সূক্ষ্ম সংশোধনের অনুরোধ।",
];

export interface RequestBTRModalProps {
  appointmentId: string | null;
  isOpen: boolean;
  onClose: () => void;
  language?: string;
  onSuccess?: () => void;
}

export function RequestBTRModal({
  appointmentId,
  isOpen,
  onClose,
  language = "bn",
  onSuccess,
}: RequestBTRModalProps) {
  const isBn = language === "bn";
  const [note, setNote] = React.useState(BTR_PRESET_NOTES[0]);
  const [submitting, setSubmitting] = React.useState(false);

  if (!isOpen || !appointmentId) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!appointmentId) return;

    setSubmitting(true);
    try {
      await appointmentApi.requestBtr(appointmentId, note.trim() || undefined);
      toast.success(
        isBn
          ? "বার্থ টাইম রেকটিফিকেশন (BTR) অনুরোধ ক্লায়েন্টকে সফলভাবে পাঠানো হয়েছে।"
          : "Birth Time Rectification (BTR) request sent to seeker successfully.",
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || (isBn ? "BTR অনুরোধ পাঠানো যায়নি।" : "Failed to request BTR."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={
        isBn
          ? "বার্থ টাইম রেকটিফিকেশন (BTR) অনুরোধ পাঠান"
          : "Request Birth Time Rectification (BTR)"
      }
      footer={
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 w-full">
          <Button variant="secondary" onClick={onClose} disabled={submitting} className="w-full sm:w-auto">
            {isBn ? "বাতিল" : "Cancel"}
          </Button>
          <Button
            onClick={() => handleSubmit()}
            disabled={submitting}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                {isBn ? "অনুরোধ পাঠানো হচ্ছে..." : "Sending..."}
              </>
            ) : (
              <>
                <Sparkles className="size-4 mr-2" />
                {isBn ? "BTR অনুরোধ পাঠান" : "Send BTR Request"}
              </>
            )}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-1 text-xs">
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 dark:border-indigo-500/20 dark:bg-indigo-950/20 p-3 text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            {isBn
              ? "ক্লায়েন্টকে ইমেইল ও অ্যাপ ড্যাশবোর্ডে একটি প্রম্পট পাঠানো হবে যেখানে তারা তাদের জীবনের ৪-৫টি প্রধান ঐতিহাসিক ঘটনা (বিয়ে, প্রথম চাকরি, দুর্ঘটনা, ভাই-বোনের জন্ম ইত্যাদি) লিখে সাবমিট করতে পারবেন।"
              : "The client will receive an email and in-app prompt to submit 4-5 major life milestones and exact hospital timing records."}
          </p>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-foreground mb-1.5">
            {isBn ? "দ্রুত প্রিসেট কারণ নির্বাচন করুন:" : "Quick Preset Reasons:"}
          </label>
          <div className="flex flex-col gap-1.5">
            {BTR_PRESET_NOTES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setNote(p)}
                className={`text-left rounded-xl border p-2.5 transition-all text-[11px] ${
                  note === p
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 font-semibold text-indigo-950 dark:text-indigo-200"
                    : "border-border hover:bg-muted/50 text-muted-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-foreground mb-1">
            {isBn ? "কাস্টম নির্দেশনা / নোট:" : "Custom Note for Seeker:"}
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder={isBn ? "যেমন: আপনার লগ্ন মিথুন ও কর্কটের সংযোগস্থলে..." : "Custom note..."}
          />
        </div>
      </form>
    </Modal>
  );
}
