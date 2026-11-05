"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  CreditCard,
  FileText,
  HelpCircle,
  LifeBuoy,
  Mail,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import React, { useState } from "react";

import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { useProfile } from "@/hooks/use-profile";
import { session } from "@/lib/session";

interface SupportTicket {
  id: string;
  ticket_number: string;
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: string;
  admin_notes?: string | null;
  created_at: string;
}

const CATEGORIES = [
  { id: "wallet_billing", label: "Wallet & Coin Recharge", icon: "💰" },
  { id: "consultation", label: "Astrologer Calls & Bookings", icon: "📞" },
  { id: "readings", label: "Tarot, Kundli & Tools", icon: "🔮" },
  { id: "account", label: "Account, Security & Passkeys", icon: "🔐" },
  { id: "technical", label: "Technical Issue or Bug", icon: "⚡" },
  { id: "general", label: "General Feedback or Inquiry", icon: "✨" },
];

const FAQS = [
  {
    q: "How does the 100% Escrow deposit protection work?",
    a: "When you book a scheduled appointment, your coins are held securely in Escrow. The astrologer is only paid after your consultation concludes. If the appointment is cancelled or missed, 100% of your deposit is immediately unlocked and returned to your spendable balance.",
  },
  {
    q: "What if my audio/video call gets disconnected?",
    a: "Calls are billed strictly per second of connected time. If a disconnection occurs due to network issues, your unused coins remain intact in your wallet. If you believe there was a billing discrepancy, select 'Wallet & Coin Recharge' below with the astrologer's name.",
  },
  {
    q: "How do I sign in with Fingerprint or Face ID passkeys?",
    a: "Go to Account > Security and tap 'Add Fingerprint' or 'Register Passkey'. Your device's biometric sensor will link seamlessly for 1-click passwordless sign in across mobile and web.",
  },
  {
    q: "Where can I find my astrologer's prescription?",
    a: "After an appointment finishes, the digital Vedic prescription with prescribed gemstones, mantras, and remedies will appear under your Bookings chamber with 1-tap copy access.",
  },
];

export default function SupportPage() {
  const { data: profile } = useProfile();
  const isSignedIn = Boolean(session.accessToken);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("wallet_billing");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [createdTicket, setCreatedTicket] = useState<SupportTicket | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Sync logged in user if state loads
  React.useEffect(() => {
    if (profile) {
      const full = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
      if (full && !name) setName(full);
      if (profile.email && !email) setEmail(profile.email);
      if (profile.phone && !phone) setPhone(profile.phone);
    }
  }, [profile, name, email, phone]);

  // Fetch my tickets if signed in
  const { data: myTickets = [], refetch: refetchMine } = useQuery<SupportTicket[]>({
    queryKey: ["support", "mine"],
    enabled: Boolean(isSignedIn),
    queryFn: () => api.get<SupportTicket[]>(endpoints.support.mine),
  });

  // Ticket creation mutation
  const submitMutation = useMutation({
    mutationFn: (body: any) =>
      api.post<SupportTicket>(endpoints.support.contact, body, {
        auth: Boolean(isSignedIn),
      }),
    onSuccess: (data: SupportTicket) => {
      setCreatedTicket(data);
      setSubject("");
      setMessage("");
      refetchMine();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) return;

    submitMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      category,
      subject: subject.trim(),
      message: message.trim(),
      source: "web",
    });
  };

  const copyTicket = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground pb-24">
      {/* ── Background Glow ── */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(217,119,6,0.15),rgba(255,255,255,0))]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 pt-12 sm:pt-16">
        {/* ── Header ── */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-300">
            <LifeBuoy className="size-3.5" />
            24/7 DivinLink Client Support
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            How can our temple guide you today?
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Whether you have questions about wallet balances, appointment rescheduling, or tarot readings, our team is directly at your service.
          </p>
        </div>

        {/* ── Main Content Grid ── */}
        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          {/* ── Left Column: Contact Form & Success Card (7 cols) ── */}
          <div className="lg:col-span-7 space-y-6">
            {createdTicket ? (
              <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/[0.08] to-surface p-8 shadow-xl">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/40">
                  <CheckCircle2 className="size-7" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-foreground">
                  Support Request Received!
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Your inquiry has been directly logged into our Admin Support Chamber. Our specialists will review your issue and reach out to you via email shortly.
                </p>

                <div className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-surface p-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Reference Ticket ID</p>
                    <p className="font-mono text-base font-bold text-amber-600 dark:text-amber-400">
                      {createdTicket.ticket_number}
                    </p>
                  </div>
                  <button
                    onClick={() => copyTicket(createdTicket.ticket_number)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                  >
                    <Copy className="size-3.5" />
                    {copiedId ? "Copied!" : "Copy ID"}
                  </button>
                </div>

                <button
                  onClick={() => setCreatedTicket(null)}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
                <h2 className="font-display text-xl font-bold text-foreground">Submit a Support Ticket</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Fill out the form below. Tickets are routed directly to our operations panel.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  {/* Category Selection */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Inquiry Category
                    </label>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {CATEGORIES.map((cat) => {
                        const isSelected = category === cat.id;
                        return (
                          <button
                            type="button"
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition-all ${
                              isSelected
                                ? "border-amber-500 bg-amber-500/10 font-semibold text-foreground ring-1 ring-amber-500/40"
                                : "border-border bg-background text-muted-foreground hover:border-amber-500/40 hover:text-foreground"
                            }`}
                          >
                            <span className="text-sm">{cat.icon}</span>
                            <span className="truncate">{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name & Email Row */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Phone (Optional) */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g., Query regarding appointment refund or call drop"
                      className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Describe your issue or query
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please include any astrologer name, transaction ID, or appointment date to help us resolve this swiftly..."
                      className="mt-1.5 w-full rounded-xl border border-border bg-background p-3.5 text-sm text-foreground placeholder-muted-foreground focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {submitMutation.isError && (
                    <div className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-500">
                      <AlertCircle className="size-4 shrink-0" />
                      <span>{(submitMutation.error as any)?.message || "Could not submit ticket. Please check your network and try again."}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 py-3 text-sm font-bold text-black transition-all hover:bg-amber-400 disabled:opacity-50"
                  >
                    {submitMutation.isPending ? (
                      "Transmitting to Support..."
                    ) : (
                      <>
                        <Send className="size-4" />
                        Submit Support Ticket
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Signed-in User Ticket History */}
            {isSignedIn && myTickets.length > 0 && (
              <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="font-display text-base font-bold text-foreground">My Submitted Inquiries</h3>
                  <span className="text-xs text-muted-foreground">{myTickets.length} tickets</span>
                </div>
                <div className="divide-y divide-border mt-2">
                  {myTickets.map((t) => (
                    <div key={t.id} className="py-3 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{t.ticket_number}</span>
                        <span className={`capitalize rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          t.status === "resolved"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : t.status === "in_progress"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}>
                          {t.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="font-medium text-foreground">{t.subject}</p>
                      <p className="text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</p>
                      {t.admin_notes && (
                        <div className="mt-2 rounded-lg bg-muted/60 p-2.5 text-[11px] text-foreground border border-border">
                          <span className="font-semibold text-amber-600 dark:text-amber-400">Admin Response: </span>
                          {t.admin_notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right Column: FAQ & Direct Channels (5 cols) ── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact Info */}
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm space-y-4">
              <h3 className="font-display text-base font-bold text-foreground">Direct Assistance</h3>
              <p className="text-xs text-muted-foreground">
                Our support team operates 7 days a week from 09:00 AM to 11:00 PM IST.
              </p>

              <div className="space-y-3 pt-1">
                <a
                  href="mailto:support@divinlink.com"
                  className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3 text-xs text-foreground transition-colors hover:border-amber-500"
                >
                  <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Mail className="size-4" />
                  </div>
                  <div>
                    <p className="font-semibold">Official Email</p>
                    <p className="text-muted-foreground">support@divinlink.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3 text-xs text-foreground">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <p className="font-semibold">100% Escrow Guarantee</p>
                    <p className="text-muted-foreground">Protected payments & instant auto-refunds</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instant FAQs */}
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="font-display text-base font-bold text-foreground">Frequently Asked Questions</h3>
              <div className="divide-y divide-border mt-3">
                {FAQS.map((faq, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div key={i} className="py-3">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="flex w-full items-center justify-between text-left text-xs font-semibold text-foreground transition-colors hover:text-amber-500"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isOpen && (
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed animate-in fade-in duration-150">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
