"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const features = [
  { name: "Harold", status: "Active", tagline: "Your Heart Insight Agent", desc: "Watches your data and surfaces what you'd miss. Conversational, contextual, rare enough to matter.", color: "#FF8897", href: "/harold" },
  { name: "PAUSE", status: "Active", tagline: "Your Behavioral Intelligence Layer", desc: "Identity-anchored interventions at the moment you need them. Mirrors, not blocks. Zero shame.", color: "#E85D3A", href: "/pause" },
  { name: "Crew", status: "Coming Soon", tagline: "A New Kind of Lifestyle Agent", desc: "Something different is being built. Stay tuned.", color: "#9DB0FF", href: "/crew" },
];

const steps = [
  { n: "01", title: "Connect your data sources", desc: "Wearables, apps, trackers" },
  { n: "02", title: "Attune learns silently", desc: "No dashboards, no effort" },
  { n: "03", title: "Harold surfaces insights", desc: "During downtime, like content" },
  { n: "04", title: "PAUSE intervenes at the right moment", desc: "With your own words" },
  { n: "05", title: "Awareness builds naturally", desc: "Behavior shifts over time" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* About — first section */}
      <section id="about" className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted/40 mb-6">About Attune</p>
          <p className="font-serif text-2xl sm:text-3xl italic leading-[1.4] mb-8 text-foreground/90">
            There&apos;s a growing gap between the amount of health data available and the ability of individuals to meaningfully use it.
          </p>
          <div className="space-y-5 text-[15px] text-muted leading-relaxed">
            <p>
              Attune addresses that gap by transforming data into accessible, contextual, and personally relevant content. By meeting users where they already are — rather than asking them to change — it creates a more realistic and sustainable approach to health awareness.
            </p>
            <p className="font-serif text-foreground/80 text-xl italic">
              &ldquo;Behavior change is not driven by instruction, but by perception.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="py-24 sm:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-harold/[0.04] rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h1 className="font-serif text-4xl sm:text-6xl italic leading-[1.1] tracking-tight mb-6 animate-in">
            Health awareness
            <br />that fits your life
          </h1>
          <p className="text-muted text-[15px] max-w-md mx-auto leading-relaxed mb-10 animate-in-d1">
            Attune transforms your health data into moments of awareness — delivered when you&apos;re actually ready to notice.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-in-d2">
            <Link href="/harold" className="px-6 py-3 rounded-full bg-harold text-background font-medium text-sm hover:opacity-90 transition-all">
              Meet Harold
            </Link>
            <Link href="/pause" className="px-6 py-3 rounded-full border border-white/10 text-foreground font-medium text-sm hover:bg-surface-light transition-all">
              Explore PAUSE
            </Link>
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted/40 mb-4 text-center">A look at life, awareness, and the moments in between</p>
          <div className="aspect-video rounded-2xl bg-surface border border-border flex items-center justify-center relative overflow-hidden">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-3" style={{ animation: "breathe-circle 4s ease-in-out infinite" }}>
                <svg className="w-5 h-5 text-white/20 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
              <p className="text-sm text-muted/40">Coming Soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.2em] text-harold/60 mb-3">Features</p>
          <h2 className="font-serif text-3xl italic mb-10">Three agents, one mission</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {features.map((f) => (
              <Link key={f.name} href={f.href} className={`p-6 rounded-2xl bg-surface border border-border hover:border-white/10 transition-all ${f.status === "Coming Soon" ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-serif text-lg italic" style={{ color: f.color }}>{f.name}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.05] text-muted/40">{f.status}</span>
                </div>
                <p className="text-sm font-medium mb-2">{f.tagline}</p>
                <p className="text-xs text-muted/50 leading-relaxed">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6 border-y border-white/[0.03]">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent/60 mb-3">How it works</p>
          <h2 className="font-serif text-3xl italic mb-10">Five steps to awareness</h2>
          <div className="grid sm:grid-cols-5 gap-3">
            {steps.map((s) => (
              <div key={s.n} className="p-4 rounded-2xl bg-surface border border-border">
                <span className="text-[11px] font-mono text-accent/60">{s.n}</span>
                <h3 className="text-[13px] font-medium mt-2 mb-1">{s.title}</h3>
                <p className="text-[11px] text-muted/40">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.03] py-8 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-[11px] text-muted/20">
          <span className="font-serif italic">Attune</span>
          <span>Health awareness that fits your life</span>
        </div>
      </footer>
    </div>
  );
}
