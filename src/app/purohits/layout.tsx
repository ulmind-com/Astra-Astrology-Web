import type { Metadata } from "next";
import * as React from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "অনলাইন পুরোহিত ও লাইভ বৈদিক পূজা সেবা",
  description:
    "ঘরে বসেই সরাসরি লাইভ ভিডিওতে অভিজ্ঞ বৈদিক পুরোহিত ও শাস্ত্রজ্ঞ আচার্যদের সাথে লাইভ পূজা, রুদ্রাভিষেক, সত্যনারায়ণ ব্রত কথা ও বিশেষ মনস্কামনা সংকল্প সেবা।",
};

export default function PurohitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
