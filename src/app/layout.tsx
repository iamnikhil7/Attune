import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PAUSE — Your Behavioral Intelligence Layer",
  description:
    "PAUSE detects your vulnerability moments and delivers a signature three-layer pause to help you resist unwanted habits. Build behavioral intelligence, not willpower.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
