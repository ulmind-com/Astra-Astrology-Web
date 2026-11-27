import type { Metadata } from "next";
import * as React from "react";

export const metadata: Metadata = {
  title: "Terms & Conditions | DivinLink",
  description:
    "Official Terms and Conditions, Refund & Cancellation Policy, Live Video Code of Conduct, and Legal Disclaimers for the DivinLink Android App and Web Platform.",
  alternates: {
    canonical: "https://www.divinlink.com/terms-condition",
  },
};

export default function TermsConditionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
