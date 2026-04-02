import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Attune — Health Awareness That Fits Your Life",
  description: "Attune transforms your health data into moments of awareness — delivered when you're actually ready to notice.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
