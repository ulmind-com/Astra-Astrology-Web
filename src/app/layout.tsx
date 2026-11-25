import type { Metadata, Viewport } from "next";
import * as React from "react";
import {
  Cinzel,
  Cinzel_Decorative,
  Geist_Mono,
  Gilda_Display,
  Poppins,
  Urbanist,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";

import { DivinLinkMotion } from "@/components/layout/divinlink-motion";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { RouteProgressBar } from "@/components/layout/route-progress-bar";
import { ReviewPrompt } from "@/components/reviews/review-prompt";
import { AuthProvider } from "@/providers/auth-provider";
import { LanguageProvider } from "@/providers/language-provider";
import { QueryProvider } from "@/providers/query-provider";
import { RealtimeProvider } from "@/providers/realtime-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";
import "./divinlink.css";

const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});
const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: ["700", "900"],
});
const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});
const gildaDisplay = Gilda_Display({
  variable: "--font-gilda",
  subsets: ["latin"],
  weight: ["400"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: {
    default: "DivinLink — Talk to verified astrologers",
    template: "%s · DivinLink",
  },
  description:
    "Consult verified astrologers for kundli, matchmaking, numerology and vastu guidance. Chat or call, whenever you need clarity.",
  openGraph: {
    title: "DivinLink",
    description: "Consult verified astrologers for kundli, numerology and vastu guidance.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${geistMono.variable} ${cinzel.variable} ${cinzelDecorative.variable} ${urbanist.variable} ${gildaDisplay.variable} h-full`}
    >
      <body suppressHydrationWarning className="min-h-full pb-[104px] md:pb-0">
        <ThemeProvider>
          <QueryProvider>
            <RealtimeProvider>
              <AuthProvider signInPath="/login">
                <LanguageProvider>
                  <React.Suspense fallback={null}>
                    <RouteProgressBar />
                  </React.Suspense>
                  {children}
                  <ReviewPrompt />
                  <MobileBottomNav />
                  <DivinLinkMotion />
                  <Toaster
                    theme="light"
                    position="top-center"
                    richColors
                    closeButton
                    toastOptions={{ className: "font-sans" }}
                  />
                  <Analytics />
                  <SpeedInsights />
                </LanguageProvider>
              </AuthProvider>
            </RealtimeProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
