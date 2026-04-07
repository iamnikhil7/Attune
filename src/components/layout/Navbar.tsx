"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/#about", label: "About", isSection: true },
  { href: "/#how-it-works", label: "How It Works", isSection: true },
  { href: "/hub", label: "Harold", isSection: false },
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
    <nav className={`absolute top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass-strong shadow-lg shadow-black/20" : "bg-transparent"}`}>
      <div className="px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <Image src="/harold-mascot.png" alt="Harold" width={32} height={32} className="rounded-full" />
          <span className="text-lg font-bold tracking-tight">Harold <span className="text-muted">&amp;</span> Crew</span>
        </Link>
        <button onClick={() => setMenuOpen(!menuOpen)} className="flex flex-col gap-1.5 p-2">
          <span className={`w-5 h-0.5 bg-foreground transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-5 h-0.5 bg-foreground transition-all duration-200 ${menuOpen ? "opacity-0 scale-0" : ""}`} />
          <span className={`w-5 h-0.5 bg-foreground transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="glass-strong px-4 py-3 space-y-1 border-t border-white/5">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="block text-sm text-muted hover:text-foreground hover:bg-white/[0.04] px-3 py-2.5 rounded-lg transition-all">{link.label}</Link>
          ))}
          <Link href="/onboarding" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-center py-2.5 rounded-lg bg-gradient-primary text-white mt-2">Get Started</Link>
        </div>
      </div>
    </nav>
  );
}
