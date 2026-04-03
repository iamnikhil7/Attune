"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function PausePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="min-h-[90vh] flex items-center justify-center px-6 pt-16">
        <div className="max-w-md mx-auto text-center">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #E85D3A, #E85D3A88)" }}
          >
            <span className="text-2xl font-bold text-background">P</span>
          </div>
          <h1 className="text-3xl font-medium mb-3">PAUSE</h1>
          <p className="text-sm text-accent/70 mb-4">Your Behavioral Intelligence Layer</p>
          <p className="text-muted leading-relaxed mb-8">
            Identity-anchored interventions at the moment you need them. Mirrors, not blocks. Zero shame.
          </p>
          <div className="inline-block px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm text-muted/60 mb-8">
            Coming Soon
          </div>
          <p className="text-xs text-muted/40 mb-8">
            We&apos;re focusing on Harold right now. PAUSE is next.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-full border border-white/10 text-sm font-medium hover:bg-white/[0.03] transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
