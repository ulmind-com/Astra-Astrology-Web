"use client";

import { Lock, ShieldCheck, Wallet } from "lucide-react";
import { FaApple, FaFacebookF, FaGooglePlay, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { Year } from "@/components/ui";
import { UlmindCredit } from "@/components/ulmind-credit";
import { useLanguage } from "@/providers/language-provider";
import type { AstrologyLanguage } from "@/types";

type Column = { title: string; links: { href: string; label: string }[] };

// Only real routes that exist in the app are linked here.
function getFooterColumns(lang: AstrologyLanguage): Column[] {
  if (lang === "bn") {
    return [
      {
        title: "রাশিফল ও পঞ্চাঙ্গ",
        links: [
          { href: "/daily-horoscope", label: "দৈনিক রাশিফল" },
          { href: "/panchang", label: "আজকের পঞ্চাঙ্গ" },
          { href: "/muhurat", label: "শুভ মুহূর্ত" },
          { href: "/festivals", label: "উৎসব ও তিথি" },
        ],
      },
      {
        title: "ফ্রি টুলস",
        links: [
          { href: "/kundli", label: "ফ্রি কুণ্ডলী" },
          { href: "/kundli-matching", label: "কুণ্ডলী মিলন" },
          { href: "/numerology", label: "সংখ্যাতত্ত্ব" },
          { href: "/tarot", label: "ট্যারো রিডিং" },
          { href: "/vastu", label: "বাস্তু কম্পাস" },
        ],
      },
      {
        title: "ক্যালকুলেটর",
        links: [
          { href: "/dasha-calculator", label: "দশা ক্যালকুলেটর" },
          { href: "/kp-calculator", label: "কেপি ক্যালকুলেটর" },
          { href: "/nakshatra-calculator", label: "নক্ষত্র নির্ণয়" },
          { href: "/rashi-calculator", label: "রাশি নির্ণয়" },
          { href: "/face-reading", label: "ফেস রিডিং" },
          { href: "/palm-reading", label: "হস্তরেখা" },
        ],
      },
      {
        title: "পরামর্শ ও শপ",
        links: [
          { href: "/astrologers", label: "সকল জ্যোতিষী" },
          { href: "/ai-astrologer", label: "এআই জ্যোতিষী" },
          { href: "/courses", label: "কোর্স" },
          { href: "/shop", label: "অ্যাস্ট্রো শপ" },
          { href: "/support", label: "সাহায্য ও সহায়তা" },
        ],
      },
    ];
  }
  if (lang === "hi") {
    return [
      {
        title: "राशिफल एवं पंचांग",
        links: [
          { href: "/daily-horoscope", label: "दैनिक राशिफल" },
          { href: "/panchang", label: "आज का पंचांग" },
          { href: "/muhurat", label: "शुभ मुहूर्त" },
          { href: "/festivals", label: "त्योहार एवं तिथि" },
        ],
      },
      {
        title: "फ्री टूल्स",
        links: [
          { href: "/kundli", label: "फ्री कुंडली" },
          { href: "/kundli-matching", label: "कुंडली मिलान" },
          { href: "/numerology", label: "अंकशास्त्र" },
          { href: "/tarot", label: "टैरो रीडिंग" },
          { href: "/vastu", label: "वास्तु कम्पास" },
        ],
      },
      {
        title: "कैलकुलेटर",
        links: [
          { href: "/dasha-calculator", label: "दशा कैलकुलेटर" },
          { href: "/kp-calculator", label: "केपी कैलकुलेटर" },
          { href: "/nakshatra-calculator", label: "नक्षत्र खोजें" },
          { href: "/rashi-calculator", label: "राशि खोजें" },
          { href: "/face-reading", label: "फेस रीडिंग" },
          { href: "/palm-reading", label: "हस्तरेखा" },
        ],
      },
      {
        title: "परामर्श एवं शॉप",
        links: [
          { href: "/astrologers", label: "सभी ज्योतिषी" },
          { href: "/ai-astrologer", label: "एआई ज्योतिषी" },
          { href: "/courses", label: "कोर्स" },
          { href: "/shop", label: "एस्ट्रो शॉप" },
          { href: "/support", label: "सहायता केंद्र" },
        ],
      },
    ];
  }
  return [
    {
      title: "Horoscope & Panchang",
      links: [
        { href: "/daily-horoscope", label: "Daily Horoscope" },
        { href: "/panchang", label: "Today's Panchang" },
        { href: "/muhurat", label: "Shubh Muhurat" },
        { href: "/festivals", label: "Festivals & Tithi" },
      ],
    },
    {
      title: "Free Tools",
      links: [
        { href: "/kundli", label: "Free Kundli" },
        { href: "/kundli-matching", label: "Kundli Matching" },
        { href: "/numerology", label: "Numerology" },
        { href: "/tarot", label: "Tarot Reading" },
        { href: "/vastu", label: "Vastu Compass" },
      ],
    },
    {
      title: "Calculators",
      links: [
        { href: "/dasha-calculator", label: "Dasha Calculator" },
        { href: "/kp-calculator", label: "KP Calculator" },
        { href: "/nakshatra-calculator", label: "Nakshatra Finder" },
        { href: "/rashi-calculator", label: "Rashi Calculator" },
        { href: "/face-reading", label: "Face Reading" },
        { href: "/palm-reading", label: "Palm Reading" },
      ],
    },
    {
      title: "Consult & Shop",
      links: [
        { href: "/astrologers", label: "All Astrologers" },
        { href: "/ai-astrologer", label: "AI Astrologer" },
        { href: "/courses", label: "Courses" },
        { href: "/shop", label: "Astro Shop" },
        { href: "/support", label: "Help & Support" },
      ],
    },
  ];
}

export function SiteFooter() {
  const { language } = useLanguage();
  const columns = getFooterColumns(language);

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-[#efe3c0] bg-gradient-to-b from-[#fffdf5] to-[#fdf6e3] print:hidden">
      {/* Faint rotating zodiac wheel at the very bottom */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/zodiac-wheel-gold.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 left-1/2 size-[560px] -translate-x-1/2 select-none opacity-[0.08] mix-blend-multiply animate-spin [animation-duration:140s] motion-reduce:animate-none"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-6">
          {/* Brand block */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 font-semibold">
              <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#eadf9a]">
                <Image src="/logo.png" alt="DivinLink" width={40} height={40} className="size-full object-contain" />
              </span>
              <span className="font-display text-lg tracking-wide text-[#1a1208]">DivinLink</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#6b5f4d]">
              {language === "bn"
                ? "বিশ্বস্ত বৈদিক জ্যোতিষীদের কাছ থেকে সঠিক পরামর্শ — কুণ্ডলী, যোটক বিচার, সংখ্যাতত্ত্ব ও বাস্তু, যখনই আপনার প্রয়োজন।"
                : language === "hi"
                ? "सत्यापित वैदिक विद्वानों से सही मार्गदर्शन — कुंडली, गुण मिलान, अंकशास्त्र एवं वास्तु समाधान।"
                : "Guidance from verified astrologers — kundli, matchmaking, numerology and vastu, whenever you need clarity."}
            </p>
            <Link
              href="/astrologers"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#fcd404] px-5 py-2.5 text-sm font-extrabold text-[#1c1304] shadow-sm transition-transform hover:scale-105"
            >
              {language === "bn" ? "ফ্রি পরামর্শ নিন" : language === "hi" ? "फ्री परामर्श लें" : "Consult for Free"}
            </Link>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-bold tracking-tight text-[#1a1208]">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-[#6b5f4d] transition-colors hover:text-[#8b5e0a]"
                    >
                      <span className="size-1 rounded-full bg-[#d9b64a] opacity-0 transition-opacity group-hover:opacity-100" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Secondary row: corporate, astrologer/contact, secure, app */}
        <div className="mt-12 grid gap-10 border-t border-[#efe3c0] pt-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Corporate Info */}
          <div>
            <p className="text-sm font-bold text-[#1a1208]">
              {language === "bn" ? "কর্পোরেট তথ্য" : language === "hi" ? "कॉर्पोरेट जानकारी" : "Corporate Info"}
            </p>
            <ul className="mt-4 space-y-2.5">
              {[
                language === "bn" ? "রিফান্ড ও বাতিল নীতি" : language === "hi" ? "रिफंड एवं रद्दीकरण नीति" : "Refund & Cancellation Policy",
                language === "bn" ? "শর্তাবলী" : language === "hi" ? "नियम एवं शर्तें" : "Terms & Conditions",
                language === "bn" ? "গোপনীয়তা নীতি" : language === "hi" ? "गोपनीयता नीति" : "Privacy Policy",
                language === "bn" ? "দাবিত্যাগ" : language === "hi" ? "अस्वीकरण" : "Disclaimer",
                language === "bn" ? "আমাদের সম্পর্কে" : language === "hi" ? "हमारे बारे में" : "About Us",
                language === "bn" ? "মূল্য নীতি" : language === "hi" ? "मूल्य नीति" : "Pricing Policy",
              ].map((label) => (
                <li key={label}>
                  <Link href="#" className="text-sm text-[#6b5f4d] transition-colors hover:text-[#8b5e0a]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Astrologer + Contact */}
          <div>
            <p className="text-sm font-bold text-[#1a1208]">
              {language === "bn" ? "জ্যোতিষী" : language === "hi" ? "ज्योतिषी" : "Astrologer"}
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="#" className="text-sm text-[#6b5f4d] transition-colors hover:text-[#8b5e0a]">
                  {language === "bn" ? "জ্যোতিষী লগইন" : language === "hi" ? "ज्योतिषी लॉगिन" : "Astrologer Login"}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-[#6b5f4d] transition-colors hover:text-[#8b5e0a]">
                  {language === "bn" ? "জ্যোতিষী নিবন্ধন" : language === "hi" ? "ज्योतिषी पंजीकरण" : "Astrologer Registration"}
                </Link>
              </li>
            </ul>
            <p className="mt-6 text-sm font-bold text-[#1a1208]">
              {language === "bn" ? "যোগাযোগ" : language === "hi" ? "संपर्क करें" : "Contact us"}
            </p>
            <p className="mt-3 text-sm text-[#6b5f4d]">
              {language === "bn" ? "চ্যাট সাপোর্টে ২৪x৭ উপলব্ধ" : language === "hi" ? "चैट सपोर्ट पर 24x7 उपलब्ध" : "We are available 24x7 on chat support"}
            </p>
            <Link href="/support" className="mt-1.5 inline-block text-sm font-semibold text-[#8b5e0a] hover:underline">
              {language === "bn" ? "সাহায্য কেন্দ্র" : language === "hi" ? "सहायता केंद्र" : "Help & Support"}
            </Link>
          </div>

          {/* Secure + social */}
          <div>
            <p className="text-sm font-bold text-[#1a1208]">
              {language === "bn" ? "সুরক্ষিত" : language === "hi" ? "सुरक्षित" : "Secure"}
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-[#6b5f4d]">
                <Lock className="size-4 text-[#8b5e0a]" />
                {language === "bn" ? "গোপনীয় ও সুরক্ষিত" : language === "hi" ? "निजी एवं गोपनीय" : "Private & Confidential"}
              </li>
              <li className="flex items-center gap-2.5 text-sm text-[#6b5f4d]">
                <ShieldCheck className="size-4 text-[#8b5e0a]" />
                {language === "bn" ? "যাচাইকৃত জ্যোতিষী" : language === "hi" ? "सत्यापित ज्योतिषी" : "Verified Astrologers"}
              </li>
              <li className="flex items-center gap-2.5 text-sm text-[#6b5f4d]">
                <Wallet className="size-4 text-[#8b5e0a]" />
                {language === "bn" ? "নিরাপদ পেমেন্ট" : language === "hi" ? "सुरक्षित भुगतान" : "Secure Payments"}
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-3">
              {[
                { label: "Facebook", Icon: FaFacebookF },
                { label: "Instagram", Icon: FaInstagram },
                { label: "LinkedIn", Icon: FaLinkedinIn },
                { label: "YouTube", Icon: FaYoutube },
              ].map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-[#eadf9a] bg-white text-[#6b5f4d] shadow-2xs transition-colors hover:border-[#d9b64a] hover:text-[#8b5e0a]"
                >
                  <Icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Download the App */}
          <div>
            <p className="text-sm font-bold text-[#1a1208]">
              {language === "bn" ? "অ্যাপ ডাউনলোড করুন" : language === "hi" ? "ऐप डाउनलोड करें" : "Download the App"}
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <a href="#" aria-label="Get it on Google Play" className="inline-flex w-44 items-center gap-2.5 rounded-xl bg-[#1a1208] px-4 py-2.5 text-white transition-transform hover:scale-[1.02]">
                <FaGooglePlay className="size-6 shrink-0" />
                <span className="flex flex-col leading-tight">
                  <span className="text-[9px] uppercase tracking-wide opacity-80">Get it on</span>
                  <span className="text-sm font-bold">Google Play</span>
                </span>
              </a>
              <a href="#" aria-label="Download on the App Store" className="inline-flex w-44 items-center gap-2.5 rounded-xl bg-[#1a1208] px-4 py-2.5 text-white transition-transform hover:scale-[1.02]">
                <FaApple className="size-6 shrink-0" />
                <span className="flex flex-col leading-tight">
                  <span className="text-[9px] uppercase tracking-wide opacity-80">Download on the</span>
                  <span className="text-sm font-bold">App Store</span>
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#efe3c0] pt-6">
          <UlmindCredit />
        </div>

        <div className="mt-6 flex flex-col gap-3 text-xs text-[#8b7d63] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <Year /> DivinLink.{" "}
            {language === "bn" ? "সর্বস্বত্ব সংরক্ষিত।" : language === "hi" ? "सर्वाधिकार सुरक्षित।" : "All rights reserved."}
          </p>
          <p className="max-w-md sm:text-right">
            {language === "bn"
              ? "জ্যোতিষ সংক্রান্ত পরামর্শ ব্যক্তিগত চিন্তাভাবনা ও দিকনির্দেশনার জন্য এবং এটি কোনো পেশাদার চিকিৎসা, আইনি বা আর্থিক পরামর্শের বিকল্প নয়।"
              : language === "hi"
              ? "ज्योतिषीय मार्गदर्शन व्यक्तिगत चिंतन हेतु है और यह किसी पेशेवर चिकित्सा, कानूनी या वित्तीय सलाह का विकल्प नहीं है।"
              : "Astrological guidance is offered for personal reflection and is not a substitute for professional medical, legal or financial advice."}
          </p>
        </div>
      </div>
    </footer>
  );
}
