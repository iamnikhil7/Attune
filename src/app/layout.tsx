import type { Metadata } from "next";
import "./globals.css";
import ViewModeProvider from "@/components/ViewModeProvider";

export const metadata: Metadata = {
  title: "Harold & Crew — Regain Your Rhythm",
  description: "A companion who helps you understand your patterns, connect with your community, and restore balance to your life.",
  icons: {
    icon: "/Attune_Logo_White_png.png",
    apple: "/Attune_Logo_White_png.png",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full flex items-center justify-center bg-[#050507]">
        <ViewModeProvider>{children}</ViewModeProvider>
      </body>
    </html>
  );
}
