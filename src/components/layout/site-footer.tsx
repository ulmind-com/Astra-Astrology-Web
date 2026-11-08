"use client";

import Image from "next/image";
import Link from "next/link";
import { Year } from "@/components/ui";
import { UlmindCredit } from "@/components/ulmind-credit";
import { useLanguage } from "@/providers/language-provider";
import type { AstrologyLanguage } from "@/types";

function getFooterColumns(lang: AstrologyLanguage) {
  if (lang === "bn") {
    return [
      {
        title: "বৈদিক মাধ্যম",
        links: [
          { href: "/numerology", label: "সংখ্যাতত্ত্ব ও লো শু" },
          { href: "/vastu", label: "বাস্তু ১৬-দিক কম্পাস" },
          { href: "/tarot", label: "ট্যারোট কার্ড গণনা" },
          { href: "/kundli", label: "জন্ম কুণ্ডলী তৈরি" },
          { href: "/kundli-matching", label: "বিবাহ যোটক বিচার" },
          { href: "/daily-horoscope", label: "দৈনিক রাশিফল" },
        ],
      },
      {
        title: "পরামর্শ",
        links: [
          { href: "/astrologers", label: "সকল জ্যোতিষী" },
          { href: "/astrologers?online_only=true", label: "এখন অনলাইন" },
          { href: "/astrologers?skill=vedic_astrology", label: "বৈদিক জ্যোতিষ" },
          { href: "/astrologers?skill=numerology", label: "সংখ্যাতত্ত্ব" },
        ],
      },
      {
        title: "অ্যাকাউন্ট",
        links: [
          { href: "/account", label: "আমার প্রোফাইল" },
          { href: "/account/birth-details", label: "জন্ম বিবরণ" },
          { href: "/account/addresses", label: "ঠিকানা" },
          { href: "/account/security", label: "নিরাপত্তা" },
          { href: "/support", label: "সাহায্য ও সহায়তা" },
        ],
      },
    ];
  }
  if (lang === "hi") {
    return [
      {
        title: "वैदिक टूल्स",
        links: [
          { href: "/numerology", label: "अंकशास्त्र एवं लो शू" },
          { href: "/vastu", label: "वास्तु 16-दिशा कम्पास" },
          { href: "/tarot", label: "टैरो कार्ड विचार" },
          { href: "/kundli", label: "जन्म कुंडली कैलकुलेटर" },
          { href: "/kundli-matching", label: "कुंडली मिलान" },
          { href: "/daily-horoscope", label: "दैनिक राशिफल" },
        ],
      },
      {
        title: "परामर्श",
        links: [
          { href: "/astrologers", label: "सभी ज्योतिषी" },
          { href: "/astrologers?online_only=true", label: "अभी ऑनलाइन" },
          { href: "/astrologers?skill=vedic_astrology", label: "वैदिक ज्योतिष" },
          { href: "/astrologers?skill=numerology", label: "अंकशास्त्र" },
        ],
      },
      {
        title: "अकाउंट",
        links: [
          { href: "/account", label: "मेरी प्रोफ़ाइल" },
          { href: "/account/birth-details", label: "जन्म विवरण" },
          { href: "/account/addresses", label: "पता" },
          { href: "/account/security", label: "सुरक्षा" },
          { href: "/support", label: "सहायता केंद्र" },
        ],
      },
    ];
  }
  return [
    {
      title: "Vedic Tools",
      links: [
        { href: "/numerology", label: "Numerology & Lo Shu" },
        { href: "/vastu", label: "Vastu 16-Zone Compass" },
        { href: "/tarot", label: "Tarot Card Reading" },
        { href: "/kundli", label: "Kundli Calculator" },
        { href: "/kundli-matching", label: "Kundli Matching" },
        { href: "/daily-horoscope", label: "Daily Horoscope" },
      ],
    },
    {
      title: "Consult",
      links: [
        { href: "/astrologers", label: "All astrologers" },
        { href: "/astrologers?online_only=true", label: "Online now" },
        { href: "/astrologers?skill=vedic_astrology", label: "Vedic astrology" },
        { href: "/astrologers?skill=numerology", label: "Numerology" },
      ],
    },
    {
      title: "Account",
      links: [
        { href: "/account", label: "My profile" },
        { href: "/account/birth-details", label: "Birth details" },
        { href: "/account/addresses", label: "Addresses" },
        { href: "/account/security", label: "Security" },
        { href: "/support", label: "Help & Support" },
      ],
    },
  ];
}

export function SiteFooter() {
  const { language } = useLanguage();
  const columns = getFooterColumns(language);

  return (
    <footer className="relative mt-20 bg-surface print:hidden">
      <div className="hairline absolute inset-x-0 top-0 h-px" aria-hidden />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-semibold">
              <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl">
                <Image
                  src="/logo.png"
                  alt="DivinLink"
                  width={36}
                  height={36}
                  className="size-full object-contain"
                />
              </span>
              <span className="font-display tracking-wide">DivinLink</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              {language === "bn"
                ? "বিশ্বস্ত বৈদিক জ্যোতিষীদের কাছ থেকে সঠিক পরামর্শ — কুণ্ডলী, যোটক বিচার, সংখ্যাতত্ত্ব ও বাস্তু, যখনই আপনার প্রয়োজন।"
                : language === "hi"
                ? "सत्यापित वैदिक विद्वानों से सही मार्गदर्शन — कुंडली, गुण मिलान, अंकशास्त्र एवं वास्तु समाधान।"
                : "Guidance from verified astrologers — kundli, matchmaking, numerology and vastu, whenever you need clarity."}
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold text-foreground">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-9 items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <UlmindCredit />
        </div>

        <div className="mt-6 flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <Year /> DivinLink.{" "}
            {language === "bn"
              ? "সর্বস্বত্ব সংরক্ষিত।"
              : language === "hi"
              ? "सर्वाधिकार सुरक्षित।"
              : "All rights reserved."}
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
