import type { Metadata } from "next";
import { Cinzel, Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { AuthProvider } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";
import { RealtimeProvider } from "@/providers/realtime-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const display = Cinzel({ variable: "--font-display", subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: {
    default: "Astra Astrology — Talk to verified astrologers",
    template: "%s · Astra Astrology",
  },
  description:
    "Consult verified astrologers for kundli, matchmaking, numerology and vastu guidance. Chat or call, whenever you need clarity.",
  openGraph: {
    title: "Astra Astrology",
    description: "Consult verified astrologers for kundli, numerology and vastu guidance.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`dark ${geistSans.variable} ${geistMono.variable} ${display.variable} h-full`}>
      <body className="min-h-full">
        <ThemeProvider>
          <QueryProvider>
            <RealtimeProvider>
            <AuthProvider signInPath="/login">
              {children}
              <Toaster
                theme="dark"
                position="top-center"
                richColors
                closeButton
                toastOptions={{ className: "font-sans" }}
              />
            </AuthProvider>
            </RealtimeProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
