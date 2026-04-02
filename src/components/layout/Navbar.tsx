"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AttuneLogo from "@/components/ui/AttuneLogo";

const navLinks = [
  { href: "/#about", label: "About Us", isSection: true },
  { href: "/#features", label: "Features", isSection: true },
  { href: "/#how-it-works", label: "How It Works", isSection: true },
  { href: "/#team", label: "Team", isSection: true },
  { href: "/harold", label: "Harold", isSection: false },
  { href: "/crew", label: "Crew", isSection: false },
  { href: "/pause", label: "Pause", isSection: false },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/90 backdrop-blur-xl border-b border-white/5 py-0" : "bg-transparent py-1"}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity duration-200">
          <AttuneLogo size={22} />
          <span className="text-lg font-medium tracking-tight">Attune</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = !link.isSection && pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm px-3 py-1.5 rounded-full transition-all duration-200 relative ${
                  isActive
                    ? "text-foreground bg-white/[0.06]"
                    : "text-muted hover:text-foreground hover:bg-white/[0.03]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 p-2">
          <span className={`w-5 h-0.5 bg-foreground transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-5 h-0.5 bg-foreground transition-all duration-200 ${menuOpen ? "opacity-0 scale-0" : ""}`} />
          <span className={`w-5 h-0.5 bg-foreground transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-background/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 space-y-1">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm text-muted hover:text-foreground hover:bg-white/[0.03] px-3 py-2.5 rounded-lg transition-all duration-200"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
