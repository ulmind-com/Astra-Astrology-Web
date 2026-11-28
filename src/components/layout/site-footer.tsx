"use client";

import * as React from "react";
import { FaApple, FaFacebookF, FaGooglePlay, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import Image from "next/image";
import "./site-footer.css";
import Link from "next/link";
import { Year } from "@/components/ui";
import { APP_STORE_URL, AppWaitlistModal, PLAY_STORE_URL } from "@/components/home/app-waitlist-modal";
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
          { href: "/annual-horoscope", label: "বার্ষিক বর্ষফল" },
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
          { href: "/become-an-astrologer", label: "জ্যোতিষী আবেদন" },
          { href: "/purohits", label: "অনলাইন পুরোহিত ও পূজা" },
          { href: "/become-a-purohit", label: "বৈদিক পুরোহিত আবেদন" },
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
          { href: "/annual-horoscope", label: "वार्षिक वर्षफल" },
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
          { href: "/become-an-astrologer", label: "ज्योतिषी आवेदन" },
          { href: "/purohits", label: "ऑनलाइन पुरोहित व पूजा" },
          { href: "/become-a-purohit", label: "वैदिक पुरोहित आवेदन" },
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
        { href: "/annual-horoscope", label: "Annual Varshphal" },
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
        { href: "/become-an-astrologer", label: "Become an Astrologer" },
        { href: "/purohits", label: "Online Purohits & Puja" },
        { href: "/become-a-purohit", label: "Become a Purohit" },
        { href: "/courses", label: "Courses" },
        { href: "/shop", label: "Astro Shop" },
        { href: "/support", label: "Help & Support" },
      ],
    },
  ];
}

const VIDEO_SRC =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/4d01c727-d9c5-47c8-a778-35a451ffd39f.mp4";
const VIDEO_POSTER =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261014_121838_c97d0940-f430-4304-8573-4f47ee44f447.png";

function pick(lang: AstrologyLanguage, en: string, bn: string, hi: string): string {
  return lang === "bn" ? bn : lang === "hi" ? hi : en;
}

/** The corporate links and the astrologer login, as a fifth column. */
function companyColumn(lang: AstrologyLanguage): Column {
  return {
    title: pick(lang, "Corporate Info", "কর্পোরেট তথ্য", "कॉर्पोरेट जानकारी"),
    links: [
      { href: "/privacy", label: pick(lang, "Privacy Policy", "গোপনীয়তা নীতি", "गोपनीयता नीति") },
      { href: "/terms-condition#refund-policy", label: pick(lang, "Refund & Cancellation Policy", "রিফান্ড ও বাতিল নীতি", "रिफंड एवं रद्दीकरण नीति") },
      { href: "/terms-condition", label: pick(lang, "Terms & Conditions", "শর্তাবলী", "नियम एवं शर्तें") },
      { href: "/terms-condition#disclaimer", label: pick(lang, "Disclaimer", "দাবিত্যাগ", "अस्वीकरण") },
      { href: "/support", label: pick(lang, "About Us", "আমাদের সম্পর্কে", "हमारे बारे में") },
      { href: "/login", label: pick(lang, "Astrologer Login", "জ্যোতিষী লগইন", "ज्योतिषी लॉगिन") },
    ],
  };
}

/**
 * The meadow video is about a megabyte a loop, so it is only fetched once the
 * footer comes near the viewport, and it pauses whenever the footer is off
 * screen. Visitors who ask for reduced motion keep the still poster frame.
 */
function useMeadowVideo() {
  const ref = React.useRef<HTMLVideoElement>(null);
  React.useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") {
      video.src = VIDEO_SRC;
      void video.play().catch(() => {});
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          if (!video.src) video.src = VIDEO_SRC;
          void video.play().catch(() => {});
        } else if (video.src) {
          video.pause();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);
  return ref;
}

export function SiteFooter() {
  const { language } = useLanguage();
  const columns = [...getFooterColumns(language), companyColumn(language)];
  const [waitlistStore, setWaitlistStore] = React.useState<"android" | "ios" | null>(null);
  const videoRef = useMeadowVideo();

  const socials = [
    { label: "Facebook", Icon: FaFacebookF, href: process.env.NEXT_PUBLIC_FACEBOOK_URL || "/support" },
    { label: "Instagram", Icon: FaInstagram, href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "/support" },
    { label: "LinkedIn", Icon: FaLinkedinIn, href: process.env.NEXT_PUBLIC_LINKEDIN_URL || "/support" },
    { label: "YouTube", Icon: FaYoutube, href: process.env.NEXT_PUBLIC_YOUTUBE_URL || "/support" },
  ];

  const storeButton = (platform: "android" | "ios") => {
    const url = platform === "android" ? PLAY_STORE_URL : APP_STORE_URL;
    const Icon = platform === "android" ? FaGooglePlay : FaApple;
    const label = platform === "android" ? "Google Play" : "App Store";
    const aria = platform === "android" ? "Get it on Google Play" : "Download on the App Store";
    return url ? (
      <a key={platform} href={url} target="_blank" rel="noopener noreferrer" aria-label={aria} className="dlf-btn">
        <Icon aria-hidden />
        {label}
      </a>
    ) : (
      <button key={platform} type="button" onClick={() => setWaitlistStore(platform)} aria-label={aria} className="dlf-btn">
        <Icon aria-hidden />
        {label}
      </button>
    );
  };

  return (
    <footer className="dlf">
      <div className="dlf__stage" aria-hidden="true">
        <video
          ref={videoRef}
          className="dlf__video"
          poster={VIDEO_POSTER}
          muted
          loop
          playsInline
          preload="none"
        />
        <span className="dlf__grade" />
        <span className="dlf__warm" />
      </div>
      <p className="dlf__wordmark" aria-hidden="true">
        DivinLink
      </p>
      <div className="dlf__fog" aria-hidden="true" />

      <div className="dlf__content">
        <div className="dlf-brand">
          <Link href="/" className="dlf-brand__logo" aria-label="DivinLink home">
            <span className="dlf-brand__mark">
              <Image src="/logo.png" alt="" width={30} height={30} />
            </span>
            <span className="font-voyage text-[30px] sm:text-[34px] font-normal leading-none tracking-[0.01em] text-[#1c1613] select-none inline-flex items-center pt-0.5">
              DivinLink
            </span>
          </Link>
          <h2 className="dlf-brand__title">
            {pick(language, "Talk to verified astrologers", "যাচাই করা জ্যোতিষীর সঙ্গে কথা বলুন", "सत्यापित ज्योतिषियों से बात करें")}
          </h2>
          <p className="dlf-brand__text">
            {pick(
              language,
              "Guidance from verified astrologers — kundli, matchmaking, numerology and vastu, whenever you need clarity.",
              "বিশ্বস্ত বৈদিক জ্যোতিষীদের কাছ থেকে সঠিক পরামর্শ — কুণ্ডলী, যোটক বিচার, সংখ্যাতত্ত্ব ও বাস্তু, যখনই আপনার প্রয়োজন।",
              "सत्यापित वैदिक विद्वानों से सही मार्गदर्शन — कुंडली, गुण मिलान, अंकशास्त्र एवं वास्तु समाधान।",
            )}
          </p>
          <div className="dlf-brand__actions">
            <Link href="/astrologers" className="dlf-btn dlf-btn--cta">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 21l2.1-5.7A8.4 8.4 0 1 1 21 11.5Z" />
              </svg>
              {pick(language, "Consult for Free", "ফ্রি পরামর্শ নিন", "फ्री परामर्श लें")}
            </Link>
            {storeButton("android")}
            {storeButton("ios")}
          </div>
          <p className="dlf-brand__copy">
            © <Year /> DivinLink. {pick(language, "All rights reserved.", "সর্বস্বত্ব সংরক্ষিত।", "सर्वाधिकार सुरक्षित।")}
          </p>
          <p className="dlf-brand__note">
            {pick(
              language,
              "Astrological guidance is offered for personal reflection and is not a substitute for professional medical, legal or financial advice.",
              "জ্যোতিষ সংক্রান্ত পরামর্শ ব্যক্তিগত চিন্তাভাবনা ও দিকনির্দেশনার জন্য এবং এটি কোনো পেশাদার চিকিৎসা, আইনি বা আর্থিক পরামর্শের বিকল্প নয়।",
              "ज्योतिषीय मार्गदर्शन व्यक्तिगत चिंतन हेतु है और यह किसी पेशेवर चिकित्सा, कानूनी या वित्तीय सलाह का विकल्प नहीं है।",
            )}
          </p>
          <p className="dlf-brand__by">
            Designed &amp; developed with <span className="dlf-brand__heart" aria-label="love">🧡</span> by
            <a href="https://ulmind.com" target="_blank" rel="noopener noreferrer" className="dlf-brand__author">
              <Image src="/ulmind.png" alt="ULMiND" width={480} height={162} />
            </a>
          </p>
          <ul className="dlf-brand__status" aria-label={pick(language, "Why DivinLink", "কেন ডিভিনলিংক", "क्यों डिवाइनलिंक")}>
            <li>
              <Link href="/support" className="dlf-chip">
                <span className="dlf-chip__dot" aria-hidden="true" />
                {pick(language, "24x7 on chat support", "চ্যাট সাপোর্টে ২৪x৭", "चैट सपोर्ट पर 24x7")}
              </Link>
            </li>
            <li className="dlf-chip">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              {pick(language, "Private & Confidential", "গোপনীয় ও সুরক্ষিত", "निजी एवं गोपनीय")}
            </li>
            <li className="dlf-chip">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6Z" />
                <path d="m9 12 2.2 2.2L15.5 10" />
              </svg>
              {pick(language, "Verified Astrologers", "যাচাইকৃত জ্যোতিষী", "सत्यापित ज्योतिषी")}
            </li>
            <li className="dlf-chip">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="6" width="18" height="13" rx="2.5" />
                <path d="M3 10h18M16 14.5h2" />
              </svg>
              {pick(language, "Secure Payments", "নিরাপদ পেমেন্ট", "सुरक्षित भुगतान")}
            </li>
            {socials.map(({ label, Icon, href }) => (
              <li key={label}>
                {href.startsWith("http") ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="dlf-chip dlf-chip--icon">
                    <Icon aria-hidden />
                  </a>
                ) : (
                  <Link href={href} aria-label={label} className="dlf-chip dlf-chip--icon">
                    <Icon aria-hidden />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {columns.map((column, i) => (
          <nav key={column.title} className={i === 0 ? "dlf-col dlf-col--menu" : "dlf-col"} aria-label={column.title}>
            <h3 className="dlf-col__title">{column.title}</h3>
            <ul className="dlf-col__list">
              {column.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <AppWaitlistModal
        open={Boolean(waitlistStore)}
        platform={waitlistStore}
        onClose={() => setWaitlistStore(null)}
      />
    </footer>
  );
}
