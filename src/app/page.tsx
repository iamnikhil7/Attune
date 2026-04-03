"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import AttuneLogo from "@/components/ui/AttuneLogo";

const features = [
  { name: "Harold", status: "Active", tagline: "Your Heart Insight Agent", desc: "Watches your data and surfaces what you'd miss. Conversational, contextual, rare enough to matter.", color: "#FF8897", href: "/harold" },
  { name: "PAUSE", status: "Active", tagline: "Your Behavioral Intelligence Layer", desc: "Identity-anchored interventions at the moment you need them. Mirrors, not blocks. Zero shame.", color: "#E85D3A", href: "/pause" },
  { name: "Crew", status: "Coming Soon", tagline: "A New Kind of Lifestyle Agent", desc: "Something different is being built. Stay tuned.", color: "#9DB0FF", href: "/crew" },
];

const steps = [
  { n: "01", title: "Connect your data", desc: "Wearables, apps, trackers" },
  { n: "02", title: "Attune learns silently", desc: "No dashboards, no effort" },
  { n: "03", title: "Harold surfaces insights", desc: "During downtime, like content" },
  { n: "04", title: "PAUSE intervenes", desc: "With your own words" },
  { n: "05", title: "Awareness builds", desc: "Behavior shifts over time" },
];

const team = [
  {
    name: "Nikhil Khanal",
    role: "Founder & Developer",
    bio: "Passionate about building technology that meets people where they are, not where they should be.",
    initials: "NK",
    color: "#E85D3A",
    photo: "/Nikhil.jpg",
  },
  {
    name: "Andy Igwe",
    role: "Founder & Researcher",
    bio: "Focused on creating experiences that feel human-first, not tech-first.",
    initials: "AI",
    color: "#FF8897",
    photo: "/Andy.png",
  },
  {
    name: "Mariana Alonso",
    role: "Founder & Designer",
    bio: "Bridging the gap between behavioral psychology and everyday digital experiences.",
    initials: "MA",
    color: "#9DB0FF",
    photo: "/Mariana.png",
  },
  {
    name: "Neel Pendse",
    role: "Founder, Designer & Researcher",
    bio: "Driven by the belief that great engineering can make complex things feel effortless.",
    initials: "NP",
    color: "#7ED8A6",
    photo: "/Neel.png",
  },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      localStorage.setItem("attune_waitlist_email", email);
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="min-h-[90vh] flex items-center justify-center px-6 pt-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-harold/[0.03] rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          {/* Logo mark */}
          <div className="flex items-center justify-center gap-2.5 mb-8 animate-in">
            <AttuneLogo size={36} className="text-foreground" />
            <span className="text-2xl font-medium tracking-tight">Attune</span>
          </div>

          <h1 className="text-5xl sm:text-7xl leading-[1.05] tracking-tight mb-6 animate-in">
            Health awareness<br />that fits your life
          </h1>
          <p className="text-muted text-base max-w-lg mx-auto leading-relaxed mb-10 animate-in-d1">
            Attune transforms your health data into moments of awareness — delivered when you&apos;re actually ready to notice. No guilt. No lectures. Just you, seen clearly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-in-d2">
            <Link href="/harold" className="px-7 py-3 rounded-full text-sm font-medium transition-all hover:opacity-90" style={{ background: "#FF8897", color: "#0B0B0B" }}>
              Meet Harold
            </Link>
            <Link href="/pause" className="px-7 py-3 rounded-full border border-white/10 text-sm font-medium hover:bg-white/[0.03] transition-all">
              Explore PAUSE
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-8 sm:p-12 rounded-2xl bg-surface border border-border relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-30">
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-accent/10 rounded-full blur-[60px]" />
              <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-harold/10 rounded-full blur-[60px]" />
            </div>
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-wider text-accent/60 mb-4">Our Mission</p>
              <p className="text-xl sm:text-2xl leading-relaxed text-foreground/90">
                To close the gap between health data and self-awareness by delivering the right insight, at the right moment, in a way that feels like looking in a mirror — not being told what to do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-wider text-muted/50 mb-6">About Attune</p>
          <h2 className="text-3xl sm:text-4xl leading-[1.15] mb-8">
            Closing the gap between data and awareness
          </h2>
          <div className="space-y-5 text-muted leading-relaxed">
            <p>
              People don&apos;t lack knowledge about what they should do — they lack awareness at the exact moment they need it. Existing apps focus on tracking metrics and use guilt-based notifications, which fail because they treat symptoms, not patterns.
            </p>
            <p>
              Attune is different. Rather than asking users to change, it meets them where they already are — creating a more realistic and sustainable approach to health awareness through identity-anchored, zero-shame interventions.
            </p>
            <blockquote className="text-foreground/80 text-xl leading-relaxed pl-5 border-l-2 border-accent/30 my-8">
              Behavior change is not driven by instruction, but by perception.
            </blockquote>
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-wider text-muted/40 mb-4 text-center">A look at life, awareness, and the moments in between</p>
          <div className="aspect-video rounded-2xl bg-surface border border-border flex items-center justify-center card-hover group cursor-pointer">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full border border-white/[0.06] flex items-center justify-center mx-auto mb-3 group-hover:border-white/15 transition-all" style={{ animation: "breathe-circle 4s ease-in-out infinite" }}>
                <svg className="w-5 h-5 text-white/15 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
              <p className="text-sm text-muted/30">Coming Soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-wider text-harold/50 mb-3">Features</p>
          <h2 className="text-3xl mb-12">Three agents, one mission</h2>
          <div className="grid sm:grid-cols-3 gap-4 stagger">
            {features.map((f) => (
              <Link key={f.name} href={f.href} className={`group p-6 rounded-2xl bg-surface border border-border card-hover hover:border-white/[0.08] ${f.status === "Coming Soon" ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-medium" style={{ color: f.color }}>{f.name}</span>
                  <span className="text-[0.625rem] px-2 py-0.5 rounded-full bg-white/[0.04] text-muted/40">{f.status}</span>
                </div>
                <p className="text-sm font-medium mb-2">{f.tagline}</p>
                <p className="text-sm text-muted/50 leading-relaxed">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-wider text-accent/50 mb-3">How it works</p>
          <h2 className="text-3xl mb-12">Five steps to awareness</h2>
          <div className="grid sm:grid-cols-5 gap-3 stagger">
            {steps.map((s) => (
              <div key={s.n} className="p-5 rounded-2xl bg-surface border border-border card-hover animate-shimmer">
                <span className="text-xs font-mono text-accent/50">{s.n}</span>
                <h3 className="text-sm font-medium mt-3 mb-1">{s.title}</h3>
                <p className="text-xs text-muted/40">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-wider text-muted/50 mb-3">The Team</p>
          <h2 className="text-3xl mb-4">Built by people who get it</h2>
          <p className="text-muted leading-relaxed mb-12 max-w-xl">
            We&apos;ve all experienced identity drift — slowly becoming someone we didn&apos;t fully recognize. Attune is the tool we wished existed.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((member) => (
              <div key={member.name} className="p-6 rounded-2xl bg-surface border border-border card-hover text-center">
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-background overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}88)` }}
                >
                    {member.photo ? (
                    <Image src={member.photo} alt={member.name} width={80} height={80} className="w-full h-full object-cover" />
                  ) : (
                    member.initials
                  )}
                </div>
                <h3 className="text-sm font-semibold mb-1">{member.name}</h3>
                <p className="text-xs text-accent/70 mb-3">{member.role}</p>
                <p className="text-xs text-muted/50 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign Up / Waitlist CTA */}
      <section className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-xl mx-auto text-center">
          <div className="p-8 sm:p-12 rounded-2xl bg-surface border border-border relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px]" style={{ background: "radial-gradient(circle, rgba(232,93,58,0.08) 0%, transparent 70%)" }} />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl mb-3">Join the community</h2>
              <p className="text-sm text-muted mb-8 max-w-md mx-auto">
                Be among the first to experience health awareness that actually works. Sign up to get early access and updates.
              </p>

              {submitted ? (
                <div className="py-4 px-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-emerald-400 text-sm font-medium">You&apos;re on the list! We&apos;ll be in touch soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSignup} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-4 py-3 rounded-xl bg-background border border-white/10 text-sm text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent/40 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90 whitespace-nowrap"
                    style={{ background: "#E85D3A", color: "#0B0B0B" }}
                  >
                    Sign Up
                  </button>
                </form>
              )}

              <p className="text-xs text-muted/30 mt-4">No spam. Just awareness.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AttuneLogo size={18} className="text-foreground" />
              <span className="text-sm font-medium">Attune</span>
            </div>
            <span className="text-xs text-muted/25">Health awareness that fits your life</span>
            <span className="text-xs text-muted/25">&copy; {new Date().getFullYear()} Attune. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
