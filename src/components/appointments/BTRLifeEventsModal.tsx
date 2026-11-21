"use client";

/**
 * Birth Time Rectification (BTR) Life-Events Modal.
 *
 * Allows clients to submit exact birth time along with 4-5 major historical
 * life events (marriage, career, illness/surgery, siblings, higher education)
 * so that the consulting astrologer can verify and rectify the exact degree of
 * the Lagna (Ascendant) and Navamsha (D9) chart before/during consultation.
 */

import {
  AlertCircle,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  GraduationCap,
  Heart,
  HelpCircle,
  Info,
  Loader2,
  MapPin,
  ShieldAlert,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button, Modal } from "@/components/ui";
import { appointmentApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/types";

const POPULAR_CITIES = [
  "Kolkata",
  "Howrah",
  "Siliguri",
  "Dhaka",
  "New Delhi",
  "Mumbai",
  "Bengaluru",
  "Patna",
  "Guwahati",
];

export interface BTRLifeEventsModalProps {
  appointment?: Appointment | null;
  appointmentId?: string | null;
  initialBirthDetails?: {
    date_of_birth?: string;
    time_of_birth?: string;
    place_of_birth?: string;
    client_btr_notes?: string;
  };
  requestNote?: string | null;
  isOpen: boolean;
  onClose: () => void;
  language?: string;
  onSuccess?: () => void;
}

export function BTRLifeEventsModal({
  appointment,
  appointmentId,
  initialBirthDetails,
  requestNote,
  isOpen,
  onClose,
  language = "bn",
  onSuccess,
}: BTRLifeEventsModalProps) {
  const isBn = language === "bn";
  const targetId = appointment?.id || appointmentId;

  const [birthDate, setBirthDate] = React.useState("");
  const [birthTime, setBirthTime] = React.useState("");
  const [birthPlace, setBirthPlace] = React.useState("");

  // 5 Major Historical Life Events for Vedic Rectification
  const [eventMarriage, setEventMarriage] = React.useState("");
  const [eventCareer, setEventCareer] = React.useState("");
  const [eventAccident, setEventAccident] = React.useState("");
  const [eventSibling, setEventSibling] = React.useState("");
  const [eventEducation, setEventEducation] = React.useState("");
  const [additionalNotes, setAdditionalNotes] = React.useState("");

  const [submitting, setSubmitting] = React.useState(false);

  // Initialize form when appointment or initialBirthDetails change
  React.useEffect(() => {
    const b = appointment?.birth_details || initialBirthDetails || {};
    setBirthDate(b.date_of_birth || (b as any).dob || "");
    setBirthTime(b.time_of_birth || (b as any).tob || "");
    setBirthPlace(b.place_of_birth || (b as any).pob || (b as any).place || "");

    const rawNotes = b.client_btr_notes || "";
    if (rawNotes.includes("[BTR Life Events]")) {
      const extract = (label: string) => {
        const match = rawNotes.match(new RegExp(`• ${label}:\\s*(.*?)(?=\\n•|\\nঅতিরিক্ত|$)`));
        return match ? match[1].trim() : "";
      };
      setEventMarriage(extract("বিবাহ/সম্পর্ক") || extract("Marriage"));
      setEventCareer(extract("প্রথম চাকরি/ক্যারিয়ার") || extract("First Job"));
      setEventAccident(extract("দুর্ঘটনা/অস্ত্রোপচার") || extract("Accident/Surgery"));
      setEventSibling(extract("ভাই/বোনের জন্ম") || extract("Sibling"));
      setEventEducation(extract("উচ্চশিক্ষা/বিদেশ") || extract("Education"));

      const addlMatch = rawNotes.match(/(?:অতিরিক্ত বিবরণ|Additional Notes):\s*([\s\S]*)$/);
      setAdditionalNotes(addlMatch ? addlMatch[1].trim() : "");
    } else {
      setAdditionalNotes(rawNotes);
    }
  }, [appointment, initialBirthDetails]);

  if (!isOpen || !targetId) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!birthDate.trim()) {
      toast.error(isBn ? "দয়া করে জন্মতারিখ নির্বাচন করুন।" : "Please enter birth date.");
      return;
    }
    if (!birthTime.trim()) {
      toast.error(isBn ? "দয়া করে আনুমানিক বা সঠিক জন্মসময় লিখুন।" : "Please enter birth time.");
      return;
    }
    if (!birthPlace.trim()) {
      toast.error(isBn ? "দয়া করে জন্মস্থান লিখুন।" : "Please enter birth place.");
      return;
    }

    // Build structured notes
    const events: string[] = [];
    if (eventMarriage.trim()) {
      events.push(`• ${isBn ? "বিবাহ/সম্পর্ক" : "Marriage"}: ${eventMarriage.trim()}`);
    }
    if (eventCareer.trim()) {
      events.push(`• ${isBn ? "প্রথম চাকরি/ক্যারিয়ার" : "First Job"}: ${eventCareer.trim()}`);
    }
    if (eventAccident.trim()) {
      events.push(`• ${isBn ? "দুর্ঘটনা/অস্ত্রোপচার" : "Accident/Surgery"}: ${eventAccident.trim()}`);
    }
    if (eventSibling.trim()) {
      events.push(`• ${isBn ? "ভাই/বোনের জন্ম" : "Sibling"}: ${eventSibling.trim()}`);
    }
    if (eventEducation.trim()) {
      events.push(`• ${isBn ? "উচ্চশিক্ষা/বিদেশ" : "Education"}: ${eventEducation.trim()}`);
    }

    let compiledNotes = "";
    if (events.length > 0) {
      compiledNotes = `[BTR Life Events]\n${events.join("\n")}`;
      if (additionalNotes.trim()) {
        compiledNotes += `\n${isBn ? "অতিরিক্ত বিবরণ" : "Additional Notes"}: ${additionalNotes.trim()}`;
      }
    } else {
      compiledNotes = additionalNotes.trim();
    }

    setSubmitting(true);
    try {
      await appointmentApi.updateBtr(targetId, {
        birth_date: birthDate.trim(),
        birth_time: birthTime.trim(),
        birth_place: birthPlace.trim(),
        notes: compiledNotes || undefined,
      });

      toast.success(
        isBn
          ? "সঠিক জন্ম বিবরণ ও জীবন ঘটনাবলী সফলভাবে সংরক্ষণ হয়েছে! জ্যোতিষী অবগত হয়েছেন।"
          : "Rectified birth details and life events saved successfully. Astrologer notified.",
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || (isBn ? "আপডেট করা সম্ভব হয়নি।" : "Failed to update BTR."));
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
          ? "সঠিক জন্ম সময় ও ঐতিহাসিক ঘটনাপঞ্জি (BTR)"
          : "Birth Time Rectification (BTR) & Life Events"
      }
      footer={
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 w-full">
          <Button variant="secondary" onClick={onClose} disabled={submitting} className="w-full sm:w-auto">
            {isBn ? "বাতিল" : "Cancel"}
          </Button>
          <Button
            onClick={() => handleSubmit()}
            disabled={submitting}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                {isBn ? "সংরক্ষণ করা হচ্ছে..." : "Saving..."}
              </>
            ) : (
              <>
                <Sparkles className="size-4 mr-2" />
                {isBn ? "BTR ও ঘটনাপঞ্জি নিশ্চিত করুন" : "Confirm BTR Details"}
              </>
            )}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1 py-1 text-xs">
        {/* Astrologer Request Note Banner */}
        {(appointment?.btr_request_note || requestNote) && (
          <div className="rounded-2xl border border-sky-400/40 bg-sky-50/80 dark:bg-sky-950/40 p-3.5 space-y-1">
            <div className="flex items-center gap-2 text-sky-800 dark:text-sky-200 font-bold">
              <Info className="size-4 shrink-0 text-sky-600 dark:text-sky-400" />
              <span>{isBn ? "জ্যোতিষীর বিশেষ অনুরোধ" : "Astrologer's Guidance Note"}</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px] pl-6">
              “{appointment?.btr_request_note || requestNote}”
            </p>
          </div>
        )}

        {/* Explanatory Box */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 dark:border-amber-500/20 dark:bg-amber-950/20 p-3 text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            {isBn
              ? "বৈদিক জ্যোতিষে লগ্ন প্রান্তিক (Cusp) ও নবাংশ ডি৯ নির্ভুলতার জন্য মিনিটের পার্থক্যও গুরুত্বপূর্ণ। আপনার জীবনের ৪-৫টি প্রধান ঐতিহাসিক ঘটনার সময়কাল জানালে জ্যোতিষী মহাদশা ও অন্তর্দশা ক্রস-ভেরিফাই করে সঠিক লগ্ন ও জন্ম সময় নিশ্চিত করতে পারবেন।"
              : "In Vedic astrology, even a few minutes can shift divisional charts. Submitting significant life events allows the astrologer to cross-verify your Dasha timeline and pinpoint your exact ascendant degree."}
          </p>
        </div>

        {/* Section 1: Basic Rectified Parameters */}
        <div className="space-y-3 rounded-2xl border border-border p-3.5 bg-background">
          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider text-amber-700 dark:text-amber-400">
            <Compass className="size-3.5" />
            <span>{isBn ? "১. মূল জন্ম বিবরণী" : "1. Primary Birth Parameters"}</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                {isBn ? "জন্ম তারিখ *" : "Date of Birth *"}
              </label>
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                {isBn ? "সঠিক / আনুমানিক জন্ম সময় *" : "Exact / Approx Birth Time *"}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 06:45 AM or 18:45"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-foreground mb-1">
              {isBn ? "জন্মস্থান (শহর, জেলা, দেশ) *" : "Birthplace (City, District, Country) *"}
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kolkata, West Bengal, India"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {/* Quick city suggestions */}
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {POPULAR_CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setBirthPlace(c)}
                  className="rounded-full border border-amber-300/60 bg-amber-50/40 dark:border-white/10 dark:bg-white/5 px-2 py-0.5 text-[10px] text-slate-700 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-white/10"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Historical Life Events */}
        <div className="space-y-3 rounded-2xl border border-amber-500/30 bg-amber-50/30 dark:bg-amber-950/20 p-3.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="size-3.5 text-amber-500" />
              <span>
                {isBn
                  ? "২. প্রধান ঐতিহাসিক জীবন ঘটনাবলী (৪-৫টি ইভেন্ট)"
                  : "2. Key Historical Life Events (4-5 Events)"}
              </span>
            </h4>
            <span className="text-[10px] text-amber-700/80 dark:text-amber-400 font-medium">
              {isBn ? "লগ্ন নির্ধারণে সহায়ক" : "Aids Lagna Verification"}
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Event 1: Marriage / Relationship */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                <Heart className="size-3 text-rose-500" />
                <span>
                  {isBn
                    ? "ইভেন্ট ১: বিবাহের তারিখ বা প্রধান সম্পর্কের সূচনা"
                    : "Event 1: Marriage / Major Relationship Period"}
                </span>
              </label>
              <input
                type="text"
                placeholder={isBn ? "যেমন: ১২ ডিসেম্বর ২০১৮ (বা বছর/মাস)" : "e.g. 12 Dec 2018 or Nov 2018"}
                value={eventMarriage}
                onChange={(e) => setEventMarriage(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Event 2: Career / First Job */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                <Briefcase className="size-3 text-indigo-500" />
                <span>
                  {isBn
                    ? "ইভেন্ট ২: প্রথম চাকরি বা ক্যারিয়ার টার্নিং পয়েন্ট"
                    : "Event 2: First Job / Major Career Breakthrough"}
                </span>
              </label>
              <input
                type="text"
                placeholder={isBn ? "যেমন: আগস্ট ২০১৬ তে প্রথম জয়েনিং" : "e.g. Joined first job in Aug 2016"}
                value={eventCareer}
                onChange={(e) => setEventCareer(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Event 3: Major Illness / Surgery / Accident */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                <ShieldAlert className="size-3 text-amber-500" />
                <span>
                  {isBn
                    ? "ইভেন্ট ৩: বড় দুর্ঘটনা, অস্ত্রোপচার বা গুরুতর অসুস্থতা"
                    : "Event 3: Major Accident, Surgery, or Critical Illness"}
                </span>
              </label>
              <input
                type="text"
                placeholder={isBn ? "যেমন: মে ২০১১ তে হাড় ফ্র্যাকচার / অ্যাপেনডিক্স" : "e.g. May 2012 fracture or surgery"}
                value={eventAccident}
                onChange={(e) => setEventAccident(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Event 4: Sibling Birth / Major Family Milestone */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                <Users className="size-3 text-emerald-500" />
                <span>
                  {isBn
                    ? "ইভেন্ট ৪: ভাই বা বোনের জন্ম / পারিবারিক বড় পরিবর্তন"
                    : "Event 4: Sibling Birth / Major Family Milestone"}
                </span>
              </label>
              <input
                type="text"
                placeholder={isBn ? "যেমন: ১৫ মার্চ ১৯৯৮ ছোট ভাইয়ের জন্ম" : "e.g. Younger brother born 15 Mar 1998"}
                value={eventSibling}
                onChange={(e) => setEventSibling(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Event 5: Higher Education / Foreign Travel */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                <GraduationCap className="size-3 text-cyan-500" />
                <span>
                  {isBn
                    ? "ইভেন্ট ৫: উচ্চশিক্ষা ডিগ্রি বা প্রথম বিদেশ যাত্রা"
                    : "Event 5: Higher Education Degree / Foreign Relocation"}
                </span>
              </label>
              <input
                type="text"
                placeholder={isBn ? "যেমন: ২০২০ তে মাস্টার্স সমাপন / ২০২২ এ বিদেশ যাত্রা" : "e.g. Completed Masters 2020"}
                value={eventEducation}
                onChange={(e) => setEventEducation(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Additional Notes / Source */}
        <div>
          <label className="block text-[11px] font-semibold text-foreground mb-1">
            {isBn
              ? "অতিরিক্ত তথ্য ও বিবরণ (যেমন: হাসপাতাল রেকর্ড, আনুমানিক সময়সীমা)"
              : "Additional Notes / Source (Hospital card, approx window)"}
          </label>
          <textarea
            rows={2}
            placeholder={
              isBn
                ? "যেমন: পরিবারের কোষ্ঠি বা হাসপাতাল স্লিপ অনুযায়ী ভোর ৫:৩০ থেকে ৫:৪৫ এর মধ্যে।"
                : "e.g. As per hospital birth record, born between 5:30 AM and 5:45 AM."
            }
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          />
        </div>
      </form>
    </Modal>
  );
}
