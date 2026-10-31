import type { Metadata, Viewport } from "next";
import { Cinzel, Cinzel_Decorative, Geist_Mono, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";

import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { ReviewPrompt } from "@/components/reviews/review-prompt";
import { AuthProvider } from "@/providers/auth-provider";
import { LanguageProvider } from "@/providers/language-provider";
import { QueryProvider } from "@/providers/query-provider";
import { RealtimeProvider } from "@/providers/realtime-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fff8d9",
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${geistMono.variable} ${cinzel.variable} ${cinzelDecorative.variable} h-full`}
    >
      <body className="min-h-full pb-[104px] md:pb-0">
        <ThemeProvider>
          <QueryProvider>
            <RealtimeProvider>
              <AuthProvider signInPath="/login">
                <LanguageProvider>
                  {children}
                  <ReviewPrompt />
                  <MobileBottomNav />
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
