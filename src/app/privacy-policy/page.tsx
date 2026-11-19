"use client";

import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Building,
  Camera,
  CheckCircle2,
  Clock,
  CreditCard,
  Database,
  ExternalLink,
  Eye,
  FileText,
  HardDrive,
  HeartHandshake,
  HelpCircle,
  Lock,
  Mail,
  MapPin,
  Mic,
  PhoneCall,
  Scale,
  ScrollText,
  Server,
  Shield,
  ShieldCheck,
  Smartphone,
  Trash2,
  UserCheck,
  Video,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge, Button, Card } from "@/components/ui";

export default function PrivacyPolicyPage() {
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
              <ShieldCheck className="size-4 text-amber-600" />
              <span>Google Play Developer Policy & DPDPA 2023 Compliant</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 dark:text-white tracking-tight">
              Privacy Policy (গোপনীয়তা নীতি)
            </h1>

            <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              This Privacy Policy explains how <b>DivinLink</b> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;, operated by <b>ULMIND / DivinLink Technologies</b>) collects, uses, protects, and discloses your personal and astrological information when you use our mobile application (Android), website (<a href="https://www.divinlink.com" className="text-amber-600 hover:underline">divinlink.com</a>), and associated Vedic astrology consultation and online puja services.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-stone-500">
              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-stone-400" />
                <span>Last Updated: <b>November 19, 2026</b></span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                <span>Effective Date: <b>January 1, 2026</b></span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Smartphone className="size-3.5 text-amber-600" />
                <span>Applicable to: <b>Android App & Web Platform</b></span>
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
            <Lock className="size-5 text-emerald-600 mb-2" />
            <h3 className="font-bold text-xs text-stone-900 dark:text-white">256-Bit SSL Encryption</h3>
            <p className="text-[11px] text-stone-500 mt-1 leading-normal">
              All live consultations, birth details, and payments are transmitted over TLS 1.3 / HTTPS.
            </p>
          </Card>

          <Card className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md">
            <CreditCard className="size-5 text-amber-600 mb-2" />
            <h3 className="font-bold text-xs text-stone-900 dark:text-white">Zero Card Storage</h3>
            <p className="text-[11px] text-stone-500 mt-1 leading-normal">
              Raw card details or CVVs are never stored. Managed by PCI-DSS certified gateways (Razorpay / Google Play).
            </p>
          </Card>

          <Card className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md">
            <Eye className="size-5 text-blue-600 mb-2" />
            <h3 className="font-bold text-xs text-stone-900 dark:text-white">No Data Selling</h3>
            <p className="text-[11px] text-stone-500 mt-1 leading-normal">
              We never sell or rent your personal, astrological, or contact data to third-party advertisers.
            </p>
          </Card>

          <Card className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md">
            <Trash2 className="size-5 text-rose-600 mb-2" />
            <h3 className="font-bold text-xs text-stone-900 dark:text-white">Right to Erasure</h3>
            <p className="text-[11px] text-stone-500 mt-1 leading-normal">
              Full in-app and web-based account and data deletion available anytime upon request.
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
              <span className="font-bold text-stone-900 dark:text-white uppercase tracking-wider block text-[10px] text-stone-400">
                Table of Contents
              </span>
              <ul className="space-y-1.5 font-medium text-stone-600 dark:text-stone-400">
                <li><a href="#section-1" className="hover:text-amber-600 block py-0.5">1. Overview & Identity</a></li>
                <li><a href="#section-2" className="hover:text-amber-600 block py-0.5">2. Information We Collect</a></li>
                <li><a href="#section-3" className="hover:text-amber-600 block py-0.5">3. Android Permissions & Use</a></li>
                <li><a href="#section-4" className="hover:text-amber-600 block py-0.5">4. How We Use Data</a></li>
                <li><a href="#section-5" className="hover:text-amber-600 block py-0.5">5. Third-Party SDK Disclosures</a></li>
                <li><a href="#section-6" className="hover:text-amber-600 block py-0.5">6. Security & Storage</a></li>
                <li><a href="#section-7" className="hover:text-amber-600 block py-0.5">7. Data Retention</a></li>
                <li><a href="#section-8" className="hover:text-amber-600 font-bold text-amber-700 dark:text-amber-400 block py-0.5">8. Account & Data Deletion</a></li>
                <li><a href="#section-9" className="hover:text-amber-600 block py-0.5">9. Children's Privacy</a></li>
                <li><a href="#section-10" className="hover:text-amber-600 block py-0.5">10. User Rights (DPDPA/GDPR)</a></li>
                <li><a href="#section-11" className="hover:text-amber-600 block py-0.5">11. Grievance Officer</a></li>
              </ul>
            </div>
          </aside>

          {/* Detailed Document Text */}
          <div className="lg:col-span-3 space-y-10 text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-stone-300">
            {/* 1. Overview */}
            <section id="section-1" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <Building className="size-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  1. Overview & Identity of Data Controller
                </h2>
              </div>
              <p>
                DivinLink (&quot;Platform&quot;) is operated by <b>ULMIND / DivinLink Technologies</b> (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). We provide a sacred Vedic astrology and spiritual consultation ecosystem that connects devotees and users with certified astrologers, numerologists, palmists, tarot readers, and Vedic purohits for personalized horoscope calculations, live one-on-one audio/video consultations, and sacred online puja ceremonies.
              </p>
              <p>
                We value your trust and are strictly committed to safeguarding your privacy in compliance with the <b>Google Play Developer Distribution Agreement</b>, Google Play User Data policies, the <b>Information Technology Act, 2000</b> (India), the <b>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</b>, the <b>Digital Personal Data Protection Act, 2023 (DPDPA)</b>, and international privacy standards such as the <b>General Data Protection Regulation (GDPR)</b> where applicable.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section id="section-2" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <FileText className="size-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  2. Information We Collect
                </h2>
              </div>
              <p>
                To provide accurate planetary calculations, generate Vedic Kundlis, and facilitate consultation calls, we collect the following categories of data:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
                  <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <UserCheck className="size-4 text-amber-600" />
                    <span>A. Personal Information You Provide</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600 dark:text-stone-400">
                    <li><b>Account Details:</b> Full Name, Email address, Phone number, and Profile image.</li>
                    <li><b>Vedic Astrological Data:</b> Exact Date of Birth, Time of Birth, Place of Birth (City, State, Country, Latitude, Longitude), Gender, Gotra, and Marital Status. These details are required mathematically to compute your Ascendant (Lagna), Rashi, Nakshatra, and Vimshottari Dasha cycles.</li>
                    <li><b>Sankalpa Information for Pujas:</b> Devotee name, family member names, Gotra, and specific prayer/wish for Vedic puja rituals.</li>
                    <li><b>Physical Delivery Address:</b> When ordering sanctified spiritual items (such as Nepali Rudraksha, energized Gemstones, or Yantras) from our Astro Shop, we collect recipient name, contact phone, delivery address, and pincode.</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
                  <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Smartphone className="size-4 text-amber-600" />
                    <span>B. Automatically Collected Technical & Device Data</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600 dark:text-stone-400">
                    <li><b>Device Identifiers:</b> Device manufacturer, hardware model, Android OS version, App build version, and unique installation IDs.</li>
                    <li><b>Log & Diagnostic Data:</b> IP address, mobile network carrier, connection status, crash reports (via Firebase Crashlytics), and app performance metrics to detect crashes and ensure stability.</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
                  <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <PhoneCall className="size-4 text-amber-600" />
                    <span>C. Communication & Consultation Content</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600 dark:text-stone-400">
                    <li><b>Chat Messages:</b> Text messages exchanged between you and astrologers during chat sessions are stored encrypted in our secure database so that you can re-read consultation advice, remedies, and mantras at any time.</li>
                    <li><b>Live Voice & Video Consultations:</b> Live audio and video streams between you and practitioners are transmitted peer-to-peer/real-time over WebRTC (powered by ZEGOCLOUD). <b>We do NOT record, intercept, or store live consultation video or voice streams without your prior explicit affirmative consent.</b></li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
                  <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <CreditCard className="size-4 text-amber-600" />
                    <span>D. Payment & Financial Data</span>
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    When you purchase wallet recharge coins, book pujas, or order remedies, payments are processed directly by certified third-party payment gateways (Razorpay, Google Play Billing). <b>DivinLink never receives, collects, or stores raw credit card numbers, debit card numbers, CVVs, or online banking passwords on our servers.</b> We only store payment status tokens, transaction IDs, timestamps, and rupee amounts for tax and order fulfillment records.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Android Permissions & Disclosures (CRITICAL GOOGLE PLAY AUDIT) */}
            <section id="section-3" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <Smartphone className="size-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  3. Android Device Permissions & Explicit Disclosures
                </h2>
              </div>
              <p>
                In strict compliance with the <b>Google Play Store Permissions Policy</b>, our Android application only requests device permissions that are strictly necessary to deliver core application features. We never access your hardware without explicit user-prompted consent:
              </p>

              <div className="divide-y divide-stone-200 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden bg-white dark:bg-stone-900">
                <div className="p-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <Camera className="size-4 text-amber-600" />
                    <span className="font-bold text-stone-900 dark:text-white text-xs">
                      Camera Permission (<code>android.permission.CAMERA</code>)
                    </span>
                    <Badge tone="neutral" className="text-[10px] bg-amber-100 text-amber-900 border-amber-300">
                      User Prompted
                    </Badge>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    <b>Why it is needed:</b> Used only when you initiate or join a two-way live video consultation with an astrologer, participate in a live online Vedic Puja with a Purohit, capture an image of your palm for AI Palmistry analysis, or take a selfie for AI Face Reading (Samudrika Shastra). Camera feeds are never accessed in the background.
                  </p>
                </div>

                <div className="p-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <Mic className="size-4 text-emerald-600" />
                    <span className="font-bold text-stone-900 dark:text-white text-xs">
                      Microphone Permission (<code>android.permission.RECORD_AUDIO</code>)
                    </span>
                    <Badge tone="neutral" className="text-[10px] bg-emerald-100 text-emerald-900 border-emerald-300">
                      User Prompted
                    </Badge>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    <b>Why it is needed:</b> Required to capture and transmit your voice in real time during live 1-on-1 audio calls, video consultations, and live Vedic prayer sessions with verified astrologers and priests. The microphone is active only while an active consultation call is in progress.
                  </p>
                </div>

                <div className="p-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <HardDrive className="size-4 text-blue-600" />
                    <span className="font-bold text-stone-900 dark:text-white text-xs">
                      Storage / Photos & Media (<code>READ_MEDIA_IMAGES</code>)
                    </span>
                    <Badge tone="neutral" className="text-[10px] bg-blue-100 text-blue-900 border-blue-300">
                      Optional
                    </Badge>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    <b>Why it is needed:</b> Used only when you choose to upload a profile avatar photo from your gallery, attach an existing Kundli/birth chart picture inside a consultation chat, or download generated Kundli PDF reports, course certificates, and astrologer remedy sheets to your device.
                  </p>
                </div>

                <div className="p-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <Bell className="size-4 text-purple-600" />
                    <span className="font-bold text-stone-900 dark:text-white text-xs">
                      Post Notifications (<code>android.permission.POST_NOTIFICATIONS</code>)
                    </span>
                    <Badge tone="neutral" className="text-[10px] bg-purple-100 text-purple-900 border-purple-300">
                      User Granted
                    </Badge>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    <b>Why it is needed:</b> Required on Android 13+ to send you real-time alerts when an astrologer accepts your call, when your turn arrives in the waiting queue, incoming video call rings, chat message alerts, and daily horoscope updates. You may disable notifications at any time via Android Settings.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. How We Use Data */}
            <section id="section-4" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <ScrollText className="size-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  4. How We Use Your Information
                </h2>
              </div>
              <p>We process your personal and astrological information solely for legitimate purposes, including:</p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600 dark:text-stone-400">
                <li><b>Astrological Calculations:</b> Using astronomical ephemeris to generate accurate Vedic natal charts, divisional charts (D9 Navamsha, etc.), planetary dashas, and Kundli Milan compatibility scores.</li>
                <li><b>Facilitating Consultations:</b> Connecting you in real time with astrologers and purohits of your choice via text chat, audio, or video.</li>
                <li><b>Account Management & Authentication:</b> Enabling secure login via Email OTP or Google Sign-In, and maintaining your consultation history.</li>
                <li><b>Order Processing & Delivery:</b> Processing Astro Shop remedy orders, generating invoices, and sharing delivery addresses with verified logistics partners (such as DTDC / BlueDart) solely for parcel delivery.</li>
                <li><b>Security & Abuse Prevention:</b> Detecting fraudulent COD orders, preventing spam, and protecting practitioners and users from abusive behavior.</li>
              </ul>
            </section>

            {/* 5. Third-Party SDK Disclosures (MANDATORY GOOGLE PLAY REQUIREMENT) */}
            <section id="section-5" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <Server className="size-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  5. Third-Party Services & SDK Disclosures
                </h2>
              </div>
              <p>
                In compliance with Google Play Store User Data disclosure policies, we disclose that DivinLink integrates reliable, industry-standard third-party Software Development Kits (SDKs) and APIs to deliver core functionality. Each provider adheres to strict privacy and encryption practices:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-start justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-stone-900 dark:text-white">Google Play Services & Google In-App Billing</h5>
                    <p className="text-stone-500 mt-0.5">Used for core Android app runtime, authentication, and in-app purchase processing.</p>
                  </div>
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline flex items-center gap-1 shrink-0">
                    <span>Policy</span> <ExternalLink className="size-3" />
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-start justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-stone-900 dark:text-white">Firebase (Google LLC)</h5>
                    <p className="text-stone-500 mt-0.5">Used for secure user authentication, push notification delivery (Firebase Cloud Messaging), and crash reporting.</p>
                  </div>
                  <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline flex items-center gap-1 shrink-0">
                    <span>Policy</span> <ExternalLink className="size-3" />
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-start justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-stone-900 dark:text-white">Razorpay Software Private Limited</h5>
                    <p className="text-stone-500 mt-0.5">RBI-authorized, PCI-DSS Level 1 compliant payment gateway for processing UPI, debit/credit cards, and net banking.</p>
                  </div>
                  <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline flex items-center gap-1 shrink-0">
                    <span>Policy</span> <ExternalLink className="size-3" />
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-start justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-stone-900 dark:text-white">ZEGOCLOUD (Zego Technology Pte. Ltd.)</h5>
                    <p className="text-stone-500 mt-0.5">Provides encrypted real-time audio and video streaming infrastructure (WebRTC) for live consultations and puja sessions.</p>
                  </div>
                  <a href="https://www.zegocloud.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline flex items-center gap-1 shrink-0">
                    <span>Policy</span> <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
            </section>

            {/* 6. Security & Storage */}
            <section id="section-6" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <Lock className="size-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  6. Data Security & Storage Standards
                </h2>
              </div>
              <p>
                We employ comprehensive technical and organizational security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600 dark:text-stone-400">
                <li><b>Encryption in Transit:</b> All client-server communications use HTTPS with modern TLS 1.3 encryption protocols.</li>
                <li><b>Encryption at Rest:</b> Database storage instances are encrypted using industry-standard AES-256 algorithms.</li>
                <li><b>Access Controls:</b> Access to backend production databases is restricted to authorized engineers on a strict need-to-know basis protected by multi-factor authentication (MFA).</li>
                <li><b>Practitioner Confidentiality:</b> Verified astrologers and purohits are bound by non-disclosure agreements prohibiting them from sharing or publishing devotee birth details or personal consultation queries.</li>
              </ul>
            </section>

            {/* 7. Data Retention */}
            <section id="section-7" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <Database className="size-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  7. Data Retention Policy
                </h2>
              </div>
              <p>
                We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy or as required by applicable statutory laws:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600 dark:text-stone-400">
                <li><b>Active Accounts:</b> Profile, birth details, and chat records remain accessible while your account is active so you can review astrological remedies and consult seamlessly.</li>
                <li><b>Temporary Cart Reservations:</b> Abandoned checkout reservations are automatically released within 30 minutes.</li>
                <li><b>Statutory Financial Records:</b> Invoice, tax, and payment records are maintained for up to 7 years in compliance with Indian taxation (GST) and corporate audit regulations.</li>
              </ul>
            </section>

            {/* 8. Account & Data Deletion (CRITICAL GOOGLE PLAY STORE REQUIREMENT) */}
            <section id="section-8" className="scroll-mt-24 space-y-4 p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30">
              <div className="flex items-center gap-2 border-b border-amber-500/30 pb-2">
                <Trash2 className="size-5 text-rose-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  8. Account & Personal Data Deletion Policy
                </h2>
              </div>
              <p className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200">
                In full compliance with <b>Google Play Store User Data Policy (Account Deletion Requirement)</b>, DivinLink provides both an <b>In-App Deletion Path</b> and a <b>Public Web-Based Deletion Mechanism</b> so you can request permanent deletion of your account and associated personal data at any time without restriction:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                  <h4 className="font-bold text-xs text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Smartphone className="size-4 text-amber-600" />
                    <span>Method 1: In-App Account Deletion</span>
                  </h4>
                  <ol className="list-decimal pl-4 space-y-1 text-xs text-stone-600 dark:text-stone-400">
                    <li>Open the DivinLink Android App or Web App.</li>
                    <li>Go to <b>Account / Profile</b> &rarr; <b>Security</b>.</li>
                    <li>Select <b>Delete Account</b> and confirm your choice.</li>
                    <li>Your account and active sessions will be terminated immediately.</li>
                  </ol>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                  <h4 className="font-bold text-xs text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Mail className="size-4 text-emerald-600" />
                    <span>Method 2: Web / Email Deletion Request</span>
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    If you have uninstalled the app or cannot log in, submit a deletion request via our web support desk or by emailing:
                  </p>
                  <p className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                    support@divinlink.com / privacy@divinlink.com
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Subject: <i>&quot;Request Account and Data Deletion&quot;</i>. Please include your registered phone number or email address.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-amber-200/80 text-xs text-stone-600 dark:text-stone-400 space-y-1">
                <span className="font-bold text-stone-900 dark:text-white block">What happens when you delete your account?</span>
                <p>
                  Within <b>30 days</b> of receiving a verified deletion request, your profile details, phone number, email, birth charts, saved Kundlis, Gotra, and chat records will be permanently purged from our active databases. Non-identifiable financial transaction tokens (required by taxation laws) will be retained solely for statutory audits.
                </p>
              </div>
            </section>

            {/* 9. Children's Privacy */}
            <section id="section-9" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <UserCheck className="size-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  9. Children&apos;s Privacy (COPPA & DPDPA Compliance)
                </h2>
              </div>
              <p>
                Our services are strictly directed to individuals who are at least <b>18 years of age</b> (or 13 years of age with verifiable parental consent). We do not knowingly solicit or collect personal identifiable information from children under 13. If you become aware that a child has provided us with personal data without parental consent, please contact us immediately at <a href="mailto:privacy@divinlink.com" className="text-amber-600 hover:underline">privacy@divinlink.com</a>, and we will delete the data without delay.
              </p>
            </section>

            {/* 10. User Rights */}
            <section id="section-10" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <Scale className="size-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  10. Your Legal Rights (DPDPA 2023 & GDPR)
                </h2>
              </div>
              <p>Under applicable Indian and international data protection laws, you possess the following rights:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                <li><b>Right to Access:</b> You can view your stored profile details and consultation history anytime directly inside the app.</li>
                <li><b>Right to Correction:</b> You can update inaccurate personal or birth details in your Profile Settings.</li>
                <li><b>Right to Erasure:</b> You have the right to request deletion of your account and personal data as described in Section 8.</li>
                <li><b>Right to Withdraw Consent:</b> You can revoke device permissions (camera, mic, notifications) at any time through your Android System Settings.</li>
                <li><b>Right to Grievance Redressal:</b> You can file a complaint with our designated Grievance Officer regarding data processing concerns.</li>
              </ul>
            </section>

            {/* 11. Grievance Officer & Contact Information */}
            <section id="section-11" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <Mail className="size-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  11. Grievance Officer & Contact Information
                </h2>
              </div>
              <p>
                In accordance with the <b>Information Technology Act, 2000</b> and the <b>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</b>, the name and contact details of our Grievance Officer are published below:
              </p>

              <Card className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="font-bold text-stone-900 dark:text-white text-sm">
                  Grievance & Privacy Officer
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-400 space-y-1">
                  <p><b>Company:</b> DivinLink Technologies / ULMIND</p>
                  <p>
                    <b>Official Support Email:</b>{" "}
                    <a href="mailto:support@divinlink.com" className="text-amber-600 hover:underline">
                      support@divinlink.com
                    </a>
                  </p>
                  <p>
                    <b>Privacy & Grievance Email:</b>{" "}
                    <a href="mailto:privacy@divinlink.com" className="text-amber-600 hover:underline">
                      privacy@divinlink.com
                    </a>
                  </p>
                  <p>
                    <b>Online Helpdesk:</b>{" "}
                    <Link href="/support" className="text-amber-600 hover:underline">
                      https://www.divinlink.com/support
                    </Link>
                  </p>
                  <p><b>Country:</b> India</p>
                </div>
                <p className="text-[11px] text-stone-500 pt-2 border-t border-stone-100 dark:border-stone-800">
                  We acknowledge all grievance complaints within <b>24 hours</b> and resolve them within <b>15 business days</b> as mandated by Indian IT Rules.
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
