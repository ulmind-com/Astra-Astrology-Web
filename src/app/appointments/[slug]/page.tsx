"use client";

import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { LoadingBlock } from "@/components/ui";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function BookAppointmentSlugPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  React.useEffect(() => {
    if (slug) {
      router.replace(`/appointments?astrologer=${encodeURIComponent(slug)}`);
    } else {
      router.replace("/appointments");
    }
  }, [slug, router]);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center py-24">
        <div className="text-center">
          <LoadingBlock label="Opening Vedic booking chamber..." />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
