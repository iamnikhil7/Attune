"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent/15 flex items-center justify-center">
              <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
            </div>
            <span className="font-semibold text-sm">PAUSE</span>
          </div>
          <Link href="/auth" className="text-sm font-medium px-4 py-1.5 rounded-lg border border-white/10 text-foreground hover:bg-surface-light transition-colors">Log in</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 sm:py-28 px-6 border-b border-white/5">
        <div className="max-w-3xl mx-auto animate-in">
          <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-6">
            Behavioral Intelligence
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight mb-5">
            The moment between impulse
            <br className="hidden sm:block" />
            and action — that&apos;s where you change.
          </h1>
          <p className="text-muted text-lg max-w-xl leading-relaxed mb-8">
            PAUSE learns your behavioral patterns, detects when you&apos;re most vulnerable, and gives you back your own words at the exact moment you need them.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/auth" className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg bg-accent text-background hover:bg-accent-soft transition-colors">
              Get started
            </Link>
            <a href="#how-it-works" className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg border border-white/10 text-foreground hover:bg-surface-light transition-colors">
              See how it works
            </a>
          </div>
          <p className="text-xs text-muted/50 mt-3">14 questions. 3 minutes. No account required.</p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-10 px-6 border-b border-white/5 bg-surface/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { n: "35,000", l: "Daily decisions" },
            { n: "90%", l: "Actions on autopilot" },
            { n: "66 days", l: "To build a habit" },
            { n: "3 layers", l: "Between impulse & action" },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-2xl font-bold text-accent">{s.n}</p>
              <p className="text-xs text-muted mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-medium text-accent uppercase tracking-wider mb-2">How it works</p>
            <h2 className="text-2xl sm:text-3xl font-bold">Four steps to behavioral intelligence</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                step: "01",
                title: "Answer 14 questions",
                desc: "Not about goals — about who you were before life shifted. Your routines, your rhythms, the things you quietly stopped doing.",
              },
              {
                step: "02",
                title: "Discover your archetype",
                desc: "One of ten behavioral patterns — from the Burnt-Out Professional to the Night Owl. Not a diagnosis. A mirror.",
              },
              {
                step: "03",
                title: "Write your why",
                desc: "In your own words. This becomes what you see at 11pm when you're about to open the delivery app or pick up your phone.",
              },
              {
                step: "04",
                title: "PAUSE shows up when it matters",
                desc: "A cooldown, your words, a quiet nudge. Three layers between impulse and action — only when the pattern repeats.",
              },
            ].map((item) => (
              <div key={item.step} className="p-5 rounded-xl bg-surface border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded">{item.step}</span>
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Three-Layer Pause */}
      <section className="py-20 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-medium text-accent uppercase tracking-wider mb-2">The signature interaction</p>
            <h2 className="text-2xl sm:text-3xl font-bold">The Three-Layer Pause</h2>
            <p className="text-muted mt-2 max-w-lg">Not a block. Not a lecture. A moment of clarity designed with three layers that work together.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { n: "01", title: "Cooldown", time: "30–45 sec", desc: "A mandatory moment of stillness. You can't skip it. Space between impulse and action.", color: "border-cyan-800/30 bg-cyan-950/20" },
              { n: "02", title: "Your Why", time: "Your words", desc: "Your own reason — written by you during onboarding — shown at the exact moment you need it.", color: "border-amber-800/30 bg-amber-950/20" },
              { n: "03", title: "Witness", time: "Repeat patterns", desc: "A silent presence. No lecture, no guilt. Just the app acknowledging the pattern it sees.", color: "border-purple-800/30 bg-purple-950/20" },
            ].map((l) => (
              <div key={l.n} className={`p-5 rounded-xl border ${l.color}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-muted">Layer {l.n}</span>
                  <span className="text-xs text-muted/50">{l.time}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{l.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{l.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What makes this different */}
      <section className="py-20 px-6 border-b border-white/5 bg-surface/50">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-medium text-accent uppercase tracking-wider mb-2">Philosophy</p>
            <h2 className="text-2xl sm:text-3xl font-bold">Not another tracking app</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-surface border border-white/5">
              <h3 className="text-sm font-semibold text-red-400/70 mb-4">What we don&apos;t do</h3>
              <ul className="space-y-3">
                {[
                  "Count your calories or track macros",
                  "Send guilt-based notifications",
                  "Block apps or force restrictions",
                  "Give generic advice that ignores your context",
                  "Punish you for overriding a pause",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-muted">
                    <span className="text-red-400/40 shrink-0 mt-0.5">{"\u2715"}</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 rounded-xl bg-surface border border-white/5">
              <h3 className="text-sm font-semibold text-accent/70 mb-4">What we do instead</h3>
              <ul className="space-y-3">
                {[
                  "Learn your unique patterns across 7 signal types",
                  "Show you your own words at the right moment",
                  "Create space — never force a decision",
                  "Adapt to your archetype, schedule, and behavior",
                  "Treat every response as data, never as failure",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-muted">
                    <span className="text-accent/60 shrink-0 mt-0.5">{"\u2713"}</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Archetypes */}
      <section className="py-20 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-medium text-accent uppercase tracking-wider mb-2">Identity archetypes</p>
            <h2 className="text-2xl sm:text-3xl font-bold">10 patterns. Which one is you?</h2>
            <p className="text-muted mt-2">Not diagnoses — mirrors. Find yours in 14 questions.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { name: "Burnt-Out Professional", emoji: "\u{1F525}" },
              { name: "Former Athlete", emoji: "\u{1F3C3}" },
              { name: "Overwhelmed Parent", emoji: "\u{1F49B}" },
              { name: "Social Butterfly", emoji: "\u{1F60E}" },
              { name: "Night Owl", emoji: "\u{1F319}" },
              { name: "Emotional Eater", emoji: "\u{1FAC6}" },
              { name: "Serial Starter", emoji: "\u{1F680}" },
              { name: "Mindless Grazer", emoji: "\u{1F32C}\u{FE0F}" },
              { name: "Perfectionist Quitter", emoji: "\u{1F4A0}" },
              { name: "Mindful Aspirant", emoji: "\u{1F9D8}" },
            ].map((a) => (
              <div key={a.name} className="p-3 rounded-lg bg-surface border border-white/5 text-center hover:border-accent/20 transition-colors">
                <span className="text-lg">{a.emoji}</span>
                <p className="text-xs text-muted mt-1.5 leading-tight">{a.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* End note */}
      <section className="py-20 px-6">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-muted text-sm">14 questions. 3 minutes. That&apos;s all it takes to start.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-muted/40">
          <span>PAUSE</span>
          <span>Behavioral intelligence layer</span>
        </div>
      </footer>
    </div>
  );
}
