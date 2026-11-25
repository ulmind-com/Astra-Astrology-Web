"use client";

import * as React from "react";
import { Smartphone, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button, Field, Input, Modal } from "@/components/ui";
import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL?.trim() || "";
export const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL?.trim() || "";

interface AppWaitlistModalProps {
  open: boolean;
  platform: "android" | "ios" | null;
  onClose: () => void;
}

/**
 * Waitlist modal opened when store download URLs are not yet configured in env.
 * Submits notification requests via the existing /support/contact endpoint.
 */
export function AppWaitlistModal({ open, platform, onClose }: AppWaitlistModalProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setSubmitting(true);
    try {
      const storeLabel = platform === "ios" ? "Apple App Store (iOS)" : "Google Play Store (Android)";
      await api.post(
        endpoints.support.contact,
        {
          name: name.trim() || "App Waitlist Seeker",
          email: email.trim(),
          subject: `Mobile App Waitlist — ${storeLabel}`,
          message: `User requested early access notification for the DivinLink ${storeLabel} release.`,
        },
        { auth: false },
      );
      toast.success("You're on the VIP waitlist! We will notify you as soon as the app goes live.");
      setName("");
      setEmail("");
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Could not join waitlist right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const storeTitle = platform === "ios" ? "DivinLink for iOS (App Store)" : "DivinLink for Android (Google Play)";

  return (
    <Modal open={open} onClose={onClose} title={storeTitle}>
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900">
          <Smartphone className="size-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-bold">Mobile App Early Access</p>
            <p className="mt-0.5 text-amber-800/90 leading-relaxed">
              Our native mobile app is finishing final store review. Leave your email to get an instant download link and bonus welcome coins at launch.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Field label="Your Name" htmlFor="waitlist-name">
            <Input
              id="waitlist-name"
              placeholder="e.g. Aarav Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label="Email Address" htmlFor="waitlist-email" required>
            <Input
              id="waitlist-email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting} className="gap-1.5">
              <Sparkles className="size-4" />
              Notify Me at Launch
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
