"use client";

import {
  AlertTriangle,
  Ban,
  Building,
  CheckCircle2,
  Coins,
  FileText,
  Flame,
  Gavel,
  Globe,
  HelpCircle,
  Mail,
  RefreshCcw,
  Scale,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserCheck,
  Video,
  Clock,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-stone-50/60 dark:bg-stone-950 text-stone-800 dark:text-stone-200">
      <SiteHeader />

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION                                                  */}
      {/* ------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent pt-12 pb-12 border-b border-amber-200/50 dark:border-amber-900/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="space-y-4 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold tracking-wide uppercase shadow-xs">
              <Scale className="size-4 text-amber-600" />
              <span>Google Play Developer Policy & Indian IT Rules 2021 Compliant</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 dark:text-white tracking-tight">
              Terms &amp; Conditions (শর্তাবলী ও নীতিমালা)
            </h1>

            <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              These Terms &amp; Conditions (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User&quot;, &quot;Devotee&quot;, or &quot;Subscriber&quot;) and{" "}
              <b>DivinLink</b> (operated by <b>ULMIND / DivinLink Technologies</b>) governing your access to and use of the <b>DivinLink</b> Android mobile application, website (
              <a href="https://www.divinlink.com" className="text-amber-600 hover:underline">
                www.divinlink.com
              </a>
              ), live Vedic astrology consultations, live on-demand Purohit video pujas, AI guidance, spiritual courses, and online store.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-stone-500">
              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-stone-400" />
                <span>
                  Last Updated: <b>November 27, 2026</b>
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                <span>
                  Effective Date: <b>January 1, 2026</b>
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Smartphone className="size-3.5 text-amber-600" />
                <span>
                  Applicable to: <b>Google Play Android App &amp; Web Platform</b>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* QUICK COMPLIANCE SUMMARY TILES                                */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md">
            <UserCheck className="size-5 text-emerald-600 mb-2" />
            <h3 className="font-bold text-xs text-stone-900 dark:text-white">18+ Eligibility</h3>
            <p className="text-[11px] text-stone-500 mt-1 leading-normal">
              Paid consultations, wallet recharges, and puja bookings require users to be 18+ years of age.
            </p>
          </Card>

          <Card className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md">
            <RefreshCcw className="size-5 text-amber-600 mb-2" />
            <h3 className="font-bold text-xs text-stone-900 dark:text-white">100% Fair Auto-Refunds</h3>
            <p className="text-[11px] text-stone-500 mt-1 leading-normal">
              Pay-after-accept flow with automatic Razorpay refunds on provider no-show or timeout race conditions.
            </p>
          </Card>

          <Card className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md">
            <ShieldAlert className="size-5 text-rose-600 mb-2" />
            <h3 className="font-bold text-xs text-stone-900 dark:text-white">Zero Abuse Tolerance</h3>
            <p className="text-[11px] text-stone-500 mt-1 leading-normal">
              Strict safety rules for live video/audio calls with instant in-room reporting and moderation.
            </p>
          </Card>

          <Card className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md">
            <AlertTriangle className="size-5 text-blue-600 mb-2" />
            <h3 className="font-bold text-xs text-stone-900 dark:text-white">Guidance Only</h3>
            <p className="text-[11px] text-stone-500 mt-1 leading-normal">
              Vedic readings &amp; pujas are spiritual guidance—not medical, legal, or financial advice.
            </p>
          </Card>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT BODY                                             */}
      {/* ------------------------------------------------------------- */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Quick Table of Contents Sidebar */}
          <aside className="lg:col-span-1 hidden lg:block sticky top-24 self-start space-y-2 text-xs">
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
              <span className="font-bold uppercase tracking-wider block text-[10px] text-stone-400">
                Table of Contents
              </span>
              <ul className="space-y-1.5 font-medium text-stone-600 dark:text-stone-400">
                <li><a href="#acceptance" className="hover:text-amber-600 block py-0.5">1. Acceptance &amp; Eligibility</a></li>
                <li><a href="#services" className="hover:text-amber-600 block py-0.5">2. Scope of Services</a></li>
                <li><a href="#accounts" className="hover:text-amber-600 block py-0.5">3. User Accounts &amp; Security</a></li>
                <li><a href="#payments" className="hover:text-amber-600 block py-0.5">4. Wallet, Payments &amp; Pricing</a></li>
                <li><a href="#refund-policy" className="hover:text-amber-600 font-bold text-amber-700 dark:text-amber-400 block py-0.5">5. Refund &amp; Cancellation</a></li>
                <li><a href="#conduct" className="hover:text-amber-600 block py-0.5">6. Conduct &amp; Live Room Safety</a></li>
                <li><a href="#disclaimer" className="hover:text-amber-600 font-bold text-amber-700 dark:text-amber-400 block py-0.5">7. Spiritual &amp; Service Disclaimer</a></li>
                <li><a href="#ip" className="hover:text-amber-600 block py-0.5">8. Intellectual Property</a></li>
                <li><a href="#third-party" className="hover:text-amber-600 block py-0.5">9. Third-Party Services &amp; Play Store</a></li>
                <li><a href="#liability" className="hover:text-amber-600 block py-0.5">10. Limitation of Liability</a></li>
                <li><a href="#termination" className="hover:text-amber-600 block py-0.5">11. Termination &amp; Data Deletion</a></li>
                <li><a href="#governing-law" className="hover:text-amber-600 block py-0.5">12. Governing Law &amp; Grievance</a></li>
              </ul>
            </div>
          </aside>

          {/* Detailed Legal Sections */}
          <div className="lg:col-span-3 space-y-10 text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-stone-300">
            {/* 1. Acceptance & Eligibility */}
            <section id="acceptance" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <Building className="size-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  1. Acceptance of Terms &amp; Eligibility
                </h2>
              </div>
              <p>
                By accessing, downloading, installing, registering an account on, or using the <b>DivinLink</b> mobile application (distributed via Google Play Store) or web platform (
                <a href="https://www.divinlink.com" className="text-amber-600 hover:underline">
                  https://www.divinlink.com
                </a>
                ), you confirm that you have read, understood, and agree to be bound by these Terms &amp; Conditions and our{" "}
                <Link href="/privacy-policy" className="text-amber-600 font-semibold hover:underline">
                  Privacy Policy
                </Link>
                , which is incorporated herein by reference.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                <li>
                  <b>Minimum Age Requirement:</b> You must be at least <b>18 years of age</b> and legally capable of entering into a binding contract under the Indian Contract Act, 1872 (or applicable local law) to make wallet recharges, book paid consultations, or purchase items. Users between 13 and 17 years may only browse free educational content under the direct supervision of a parent or legal guardian.
                </li>
                <li>
                  <b>Revisions to Terms:</b> We reserve the right to update these Terms periodically to reflect regulatory, Google Play policy, or feature changes. Continued use after updated Terms are published constitutes your acceptance.
                </li>
              </ul>
            </section>

            {/* 2. Scope of Services */}
            <section id="services" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <Sparkles className="size-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  2. Description &amp; Scope of DivinLink Services
                </h2>
              </div>
              <p>
                DivinLink operates as an interactive digital platform connecting users with independent verified Vedic practitioners alongside algorithmic and AI-assisted Vedic tools:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900 dark:text-white">
                    <Video className="size-4 text-amber-600" />
                    <span>Live Astrologer Consultations</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Real-time audio/video calls, live text chats, interactive shared Kundli whiteboard sessions, and scheduled appointments with independent astrologers.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900 dark:text-white">
                    <Flame className="size-4 text-emerald-600" />
                    <span>Live Online Purohit &amp; Puja Rooms</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    On-demand live video rituals conducted by verified Purohits based on transparent duration and Dakshina catalogs, including Sankalpa personalization.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900 dark:text-white">
                    <ScrollText className="size-4 text-indigo-600" />
                    <span>Vedic Calculators &amp; AI Reports</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Kundli generation, Ashtakoot Milan, KP/Dasha calculators, Vastu compass, Palmistry/Face analysis, and personalized Horoscope/Lal Kitab reports.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900 dark:text-white">
                    <Globe className="size-4 text-rose-600" />
                    <span>Spiritual Store &amp; Vedic Courses</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Educational video courses and sacred pooja samagri / spiritual products delivered within serviceable Indian PIN codes.
                  </p>
                </div>
              </div>
              <p className="text-xs text-stone-500">
                <b>Intermediary Status:</b> Astrologers and Purohits listed on DivinLink are independent professionals—not employees, agents, or legal representatives of DivinLink. While we verify identity and qualifications prior to onboarding, each practitioner is solely responsible for their spoken advice, mantra recitation, and conduct during live sessions.
              </p>
            </section>

            {/* 3. User Accounts & Security */}
            <section id="accounts" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <UserCheck className="size-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  3. User Accounts, Accuracy &amp; Fair Usage
                </h2>
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                <li>
                  <b>Accurate Registration:</b> You agree to provide true, accurate, and up-to-date details (name, email, phone number, birth information, and Sankalpa/Gotra details) and safeguard your login credentials, OTPs, and passkeys.
                </li>
                <li>
                  <b>Account Responsibility:</b> All activities, bookings, wallet transactions, and messages originating from your authenticated session are your responsibility. Notify{" "}
                  <a href="mailto:support@divinlink.com" className="text-amber-600 hover:underline">
                    support@divinlink.com
                  </a>{" "}
                  immediately upon suspecting unauthorized access.
                </li>
                <li>
                  <b>Anti-Griefing &amp; Request Abuse Prevention:</b> Live Purohit and consultation queues rely on real-time availability locks. Automated bots, sending spam booking requests, or repeatedly failing to complete payment after a Purohit accepts your request will automatically trigger temporary booking cooldowns or permanent account suspension to protect live practitioners and genuine devotees.
                </li>
              </ul>
            </section>

            {/* 4. Wallet, Payments & Pricing */}
            <section id="payments" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <Coins className="size-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  4. Wallet Coins, Direct Puja Payments, Pricing &amp; Taxes
                </h2>
              </div>
              <p>
                All pricing is displayed transparently in Indian Rupees (INR / ₹) or Astro-Coins before you confirm any paid transaction:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                <li>
                  <b>Astro-Coins Wallet:</b> Wallet recharges are used for per-minute voice/video/chat consultations, scheduled appointments, and unlocking premium reports. Wallet balances do not earn interest, are non-transferable between accounts, and cannot be redeemed for cash outside statutory refund obligations.
                </li>
                <li>
                  <b>Pay-After-Accept Live Puja Bookings:</b> No amount is charged when you submit a live Puja request. Only after the selected Purohit explicitly accepts your request within the <b>45-second acceptance window</b> are you prompted to pay the specified Dakshina within a strict <b>90-second payment timer</b> via Razorpay / Google Play Billing (where applicable).
                </li>
                <li>
                  <b>Payment Gateways:</b> Payments are processed securely through PCI-DSS compliant partners (Razorpay / Google Play Billing). DivinLink does not store your raw credit/debit card numbers, CVV, or UPI PINs.
                </li>
                <li>
                  <b>Taxes:</b> Displayed prices are subject to applicable Goods and Services Tax (GST) or statutory levies as required by Indian law.
                </li>
              </ul>
            </section>

            {/* 5. Refund & Cancellation Policy */}
            <section id="refund-policy" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <RefreshCcw className="size-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  5. Refund &amp; Cancellation Policy
                </h2>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-2 text-xs">
                <p className="font-bold text-emerald-900 dark:text-emerald-200">
                  Automatic 100% Protection Guarantees:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-emerald-900/90 dark:text-emerald-200/90">
                  <li>
                    <b>Unaccepted / Expired Requests:</b> Requests declined or timed out prior to payment incur ₹0 charge.
                  </li>
                  <li>
                    <b>Late Payment / Purohit Offline Race Condition:</b> If your UPI/card payment completes right after the 90-second payment window expires or after the Purohit goes offline, our server immediately initiates a <b>100% automatic refund</b> to your original payment method.
                  </li>
                  <li>
                    <b>60-Second Purohit No-Show Guarantee:</b> If you pay for an accepted Puja and enter the live room, but the Purohit fails to join within <b>60 seconds</b>, the session automatically aborts with a <b>100% full refund</b>.
                  </li>
                </ul>
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                <li>
                  <b>Completed Sessions &amp; Digital Reports:</b> Once a live consultation, Puja session, or AI/horoscope report has been substantially delivered or joined by both parties, Dakshina or consultation charges deducted are non-refundable unless a verified server/platform technical defect prevented the service.
                </li>
                <li>
                  <b>Scheduled Appointments:</b> Rescheduling or cancellation refunds follow the window shown on your booking card prior to the scheduled slot start time.
                </li>
                <li>
                  <b>Shop Orders:</b> Physical spiritual items are eligible for return or replacement within <b>7 days</b> of delivery only if damaged in transit, defective, or incorrect (unboxing video recommended).
                </li>
                <li>
                  <b>Refund Settlement Timeline:</b> Verified bank/UPI refunds initiated via Razorpay typically settle within <b>5–7 business days</b> depending on your issuing bank. Duplicate wallet debits or billing issues may be reported to{" "}
                  <a href="mailto:support@divinlink.com" className="text-amber-600 hover:underline">
                    support@divinlink.com
                  </a>{" "}
                  with your Booking ID / Razorpay Payment ID.
                </li>
              </ul>
            </section>

            {/* 6. Conduct & Live Room Safety */}
            <section id="conduct" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <Ban className="size-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  6. Acceptable Use, Live Video Etiquette &amp; User Safety
                </h2>
              </div>
              <p>
                To keep DivinLink safe for devotees, astrologers, and Purohits—and in full compliance with <b>Google Play User-Generated Content (UGC)</b> and safety standards—you agree <b>NOT</b> to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                <li>
                  Engage in harassment, abusive language, hate speech, threats, nudity, or sexually explicit behavior during any live video call, audio call, or chat session.
                </li>
                <li>
                  Solicit personal phone numbers, bank details, or off-platform payments from Astrologers, Purohits, or devotees.
                </li>
                <li>
                  Secretly record, screenshot, stream, or publicly publish private consultation or Puja video/audio streams without explicit prior consent of the other participant.
                </li>
                <li>
                  Request, promote, or perform illegal acts, self-harm, coercive rituals, or fraudulent black-magic/superstitious exploitation.
                </li>
                <li>
                  Attempt to reverse-engineer, scrape, overload, or bypass authentication, rate limits, or WebSocket/WebRTC infrastructure.
                </li>
              </ul>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                <b>In-App Reporting &amp; Moderation:</b> Live consultation rooms include a dedicated <b>Report / Red-Flag</b> tool allowing participants to report misconduct or technical abuse immediately. Verified violations result in immediate session termination, account suspension, and forfeiture of abusive balances.
              </p>
            </section>

            {/* 7. Spiritual & Service Disclaimer */}
            <section id="disclaimer" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <AlertTriangle className="size-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  7. Spiritual Guidance &amp; Limitation Disclaimer
                </h2>
              </div>
              <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-300/70 dark:border-amber-800/50 space-y-2 text-xs text-stone-700 dark:text-stone-300">
                <p className="font-bold text-stone-900 dark:text-white">
                  Important Notice Regarding Astrology, Vastu, Palmistry, AI Readings &amp; Pujas:
                </p>
                <p>
                  All astrological interpretations, Kundli charts, horoscopes, numerology, Vastu recommendations, palmistry/face readings, AI responses, and Vedic Puja offerings on DivinLink are strictly intended for{" "}
                  <b>traditional, cultural, spiritual, and personal reflection purposes only</b>.
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    DivinLink services do <b>NOT</b> constitute medical, psychiatric, psychological, legal, investment, tax, or financial advice. Always consult qualified, licensed professionals for health, legal, or financial decisions.
                  </li>
                  <li>
                    We do <b>NOT</b> guarantee specific outcomes, miraculous cures, lottery/trading profits, or deterministic predictions. Results and satisfaction vary by individual belief and life circumstances.
                  </li>
                  <li>
                    DivinLink strictly prohibits fear-mongering, black-magic claims, or coercive remedies.
                  </li>
                </ul>
              </div>
            </section>

            {/* 8. Intellectual Property */}
            <section id="ip" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <FileText className="size-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  8. Intellectual Property &amp; Limited License
                </h2>
              </div>
              <p>
                All software, source code, UI designs, DivinLink logos, Vedic calculation engines, recorded courses, written articles, and visual assets are the exclusive property of <b>DivinLink Technologies / ULMIND</b> or its licensors and are protected under applicable copyright and trademark laws.
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to install and use the DivinLink mobile app and download your personal generated Kundli/Horoscope reports solely for personal, non-commercial use. Reselling, redistributing course videos, or automated extraction is strictly prohibited.
              </p>
            </section>

            {/* 9. Third-Party Services */}
            <section id="third-party" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <ShieldCheck className="size-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  9. Third-Party Services &amp; Google Play Store Terms
                </h2>
              </div>
              <p>
                DivinLink integrates trusted third-party infrastructure providers—including Google Play Services, Firebase Authentication, Razorpay, ZEGOCLOUD / WebRTC real-time media servers, and cloud hosting. Your use of payment or authentication flows is also governed by their respective terms of service and our{" "}
                <Link href="/privacy-policy#section-5" className="text-amber-600 hover:underline">
                  Third-Party SDK Disclosures
                </Link>
                .
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                When downloading the DivinLink app from Google Play, you acknowledge that Google LLC is not responsible for the app&apos;s content, maintenance, customer support, or warranty claims, and that you will comply with the Google Play Terms of Service.
              </p>
            </section>

            {/* 10. Limitation of Liability */}
            <section id="liability" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <Gavel className="size-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  10. Disclaimer of Warranties &amp; Limitation of Liability
                </h2>
              </div>
              <p>
                The DivinLink app and website are provided on an <b>&quot;AS IS&quot;</b> and <b>&quot;AS AVAILABLE&quot;</b> basis. Because live audio/video sessions depend on user internet bandwidth, device camera/microphone hardware, and regional telecom networks, uninterrupted zero-latency connectivity cannot be guaranteed on every network.
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                To the maximum extent permitted by applicable law, DivinLink Technologies / ULMIND, its founders, employees, and affiliates shall not be liable for any indirect, incidental, consequential, or punitive damages, emotional distress, or financial losses arising from reliance on spiritual advice or temporary service interruptions. Our maximum aggregate liability for any claim relating to a paid transaction shall not exceed the actual amount paid by you to DivinLink for that specific transaction (or total fees paid in the preceding three (3) months, whichever is lower).
              </p>
            </section>

            {/* 11. Termination & Account Deletion */}
            <section id="termination" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <HelpCircle className="size-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  11. Suspension, Termination &amp; Account Deletion
                </h2>
              </div>
              <p>
                You may stop using DivinLink and permanently delete your account at any time either inside the app (<b>Account &rarr; Security &rarr; Delete Account</b>) or via our public deletion process described in{" "}
                <Link href="/privacy-policy#section-8" className="text-amber-600 font-semibold hover:underline">
                  Privacy Policy Section 8 (Account &amp; Data Deletion)
                </Link>
                .
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                We may suspend or terminate access without prior notice if we reasonably determine a violation of these Terms, payment fraud/chargeback abuse, harassment during live sessions, or compliance obligations under Indian law.
              </p>
            </section>

            {/* 12. Governing Law & Grievance */}
            <section id="governing-law" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <Mail className="size-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  12. Governing Law, Jurisdiction &amp; Grievance Contact
                </h2>
              </div>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of <b>India</b>, including the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023. Subject to mandatory arbitration or consumer protection rights under law, courts in India shall have jurisdiction over disputes arising from these Terms.
              </p>

              <Card className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="font-bold text-stone-900 dark:text-white text-sm">
                  Legal, Support &amp; Grievance Desk
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-400 space-y-1">
                  <p>
                    <b>Operator:</b> DivinLink Technologies / ULMIND
                  </p>
                  <p>
                    <b>Official Support Email:</b>{" "}
                    <a href="mailto:support@divinlink.com" className="text-amber-600 hover:underline">
                      support@divinlink.com
                    </a>
                  </p>
                  <p>
                    <b>Legal &amp; Privacy Email:</b>{" "}
                    <a href="mailto:privacy@divinlink.com" className="text-amber-600 hover:underline">
                      privacy@divinlink.com
                    </a>
                  </p>
                  <p>
                    <b>Terms URL (Google Play Reference):</b>{" "}
                    <Link href="/terms-condition" className="text-amber-600 hover:underline">
                      https://www.divinlink.com/terms-condition
                    </Link>
                  </p>
                  <p>
                    <b>Help Center:</b>{" "}
                    <Link href="/support" className="text-amber-600 hover:underline">
                      https://www.divinlink.com/support
                    </Link>
                  </p>
                </div>
                <p className="text-[11px] text-stone-500 pt-2 border-t border-stone-100 dark:border-stone-800">
                  In compliance with Indian IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, grievances are acknowledged within <b>24 hours</b> and resolved within <b>15 business days</b>.
                </p>
              </Card>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
