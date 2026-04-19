"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useViewMode } from "@/components/ViewModeProvider";

const navLinks = [
  { href: "/#about", label: "About", isSection: true },
  { href: "/#how-it-works", label: "How It Works", isSection: true },
  { href: "/hub", label: "Harold", isSection: false },
];

export default function Navbar() {
  const pathname = usePathname();
  const { mode } = useViewMode();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDesktop = mode === "desktop";

  return (
    <nav
      className={`${
        isDesktop ? "fixed" : "absolute"
      } top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "shadow-sm"
          : "bg-transparent"
      }`}
      style={
        scrolled
          ? {
              background: "rgba(245,240,232,0.85)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderBottom: "1px solid rgba(180,165,140,0.25)",
            }
          : undefined
      }
    >
      <div
        className={`${
          isDesktop ? "max-w-6xl mx-auto px-6 h-16" : "px-4 h-14"
        } flex items-center justify-between`}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
        >
          <Image
            src="/mascots/harold-peaceful.png"
            alt="Harold"
            width={34}
            height={34}
            className="object-contain"
          />
          <span
            className="text-lg tracking-tight font-serif italic"
            style={{
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontStyle: "italic",
              color: "var(--accent)",
            }}
          >
            Harold &amp; Crew
          </span>
        </Link>

        {isDesktop && (
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = !link.isSection && pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm px-3.5 py-1.5 rounded-lg transition-all duration-200"
                  style={{
                    color: isActive ? "var(--foreground)" : "var(--muted)",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/onboarding"
              className="ml-2 text-sm px-5 py-2 rounded-full font-medium transition-all"
              style={{ background: "#3D3529", color: "#F5F0E8" }}
            >
              Get Started
            </Link>
          </div>
        )}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`flex flex-col gap-1.5 p-2 ${isDesktop ? "md:hidden" : ""}`}
        >
          <span
            className="w-5 h-0.5 transition-all duration-300 origin-center"
            style={{ background: "var(--foreground)", transform: menuOpen ? "rotate(45deg) translateY(8px)" : undefined }}
          />
          <span
            className="w-5 h-0.5 transition-all duration-200"
            style={{ background: "var(--foreground)", opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="w-5 h-0.5 transition-all duration-300 origin-center"
            style={{ background: "var(--foreground)", transform: menuOpen ? "rotate(-45deg) translateY(-8px)" : undefined }}
          />
        </button>
      </div>

      <div
        className={`${isDesktop ? "md:hidden" : ""} overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className="px-4 py-3 space-y-1"
          style={{
            background: "rgba(245,240,232,0.95)",
            backdropFilter: "blur(24px)",
            borderTop: "1px solid rgba(180,165,140,0.2)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm px-3 py-2.5 rounded-lg transition-all"
              style={{ color: "var(--muted)" }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/onboarding"
            onClick={() => setMenuOpen(false)}
            className="block text-sm font-medium text-center py-2.5 rounded-full mt-2"
            style={{ background: "#3D3529", color: "#F5F0E8" }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
