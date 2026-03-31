"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const stats = [
  { number: "35,000", label: "decisions you make every day" },
  { number: "90%", label: "of daily actions are habitual" },
  { number: "66", label: "days to form a new habit" },
  { number: "1", label: "moment of awareness to change" },
];

const stories = [
  {
    quote: "I used to order DoorDash at 11pm every night without thinking. PAUSE didn't block me — it just showed me my own words. That was enough.",
    archetype: "Night Owl",
  },
  {
    quote: "I knew what I should do. I just never did it. PAUSE caught the exact moment I needed to hear from myself.",
    archetype: "Serial Starter",
  },
  {
    quote: "I stopped running three years ago and didn't even notice. PAUSE helped me see the drift before it became permanent.",
    archetype: "Former Athlete",
  },
];

const archetypes = [
  { name: "The Burnt-Out Professional", icon: "\u{1F525}", color: "from-amber-500/20 to-amber-600/5", border: "border-amber-500/20" },
  { name: "The Former Athlete", icon: "\u{1F3C3}", color: "from-green-500/20 to-green-600/5", border: "border-green-500/20" },
  { name: "The Overwhelmed Parent", icon: "\u{1F49B}", color: "from-rose-500/20 to-rose-600/5", border: "border-rose-500/20" },
  { name: "The Night Owl", icon: "\u{1F319}", color: "from-indigo-500/20 to-indigo-600/5", border: "border-indigo-500/20" },
  { name: "The Emotional Eater", icon: "\u{1FAC6}", color: "from-pink-500/20 to-pink-600/5", border: "border-pink-500/20" },
  { name: "The Serial Starter", icon: "\u{1F680}", color: "from-orange-500/20 to-orange-600/5", border: "border-orange-500/20" },
];

const pauseLayers = [
  { number: "01", title: "Cooldown", time: "30\u201345s", description: "A mandatory moment of stillness. Space between impulse and action.", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/15" },
  { number: "02", title: "Your Why", time: "Your words", description: "Your own reason \u2014 written by you, shown to you at the exact moment you need it.", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/15" },
  { number: "03", title: "Witness", time: "Repeat patterns", description: "A silent presence. No lecture, no guilt. Just the app acknowledging what it sees.", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/15" },
];

export default function Home() {
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyFading, setStoryFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setStoryFading(true);
      setTimeout(() => {
        setStoryIndex((prev) => (prev + 1) % stories.length);
        setStoryFading(false);
      }, 400);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
            </div>
            <span className="font-semibold tracking-tight">PAUSE</span>
          </div>
          <Link href="/auth" className="text-sm font-medium px-4 py-1.5 rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-14 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-accent/6 rounded-full blur-3xl animate-breathe" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p className="text-accent text-sm font-medium tracking-wide uppercase mb-6 animate-fade-in-up">Behavioral Intelligence</p>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1] mb-6 animate-fade-in-up-delay-1">
            You already know what to do.
            <br />
            <span className="text-muted">You just need the right moment to remember.</span>
          </h1>

          <p className="text-lg text-muted/80 max-w-md mx-auto leading-relaxed mb-10 animate-fade-in-up-delay-2">
            PAUSE learns your patterns, detects vulnerability moments, and creates space between impulse and action — using your own words, not ours.
          </p>

          <div className="animate-fade-in-up-delay-3">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-accent text-white hover:bg-accent-soft active:scale-[0.98] transition-all"
            >
              Begin the Questionnaire
            </Link>
            <p className="text-xs text-muted/40 mt-3">14 questions. 3 minutes. No account needed.</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-accent mb-1">{stat.number}</p>
              <p className="text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-accent text-sm font-medium tracking-wide uppercase mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Three layers. One moment of clarity.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {pauseLayers.map((layer) => (
              <div key={layer.number} className={`p-6 rounded-2xl ${layer.bg} border ${layer.border}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-mono ${layer.color} bg-background/50 px-2 py-0.5 rounded-full`}>{layer.number}</span>
                  <span className={`text-xs ${layer.color}`}>{layer.time}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{layer.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{layer.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="py-24 px-6 bg-surface/30">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-accent text-sm font-medium tracking-wide uppercase mb-3">What it feels like</p>
          <div className="h-32 flex items-center justify-center">
            <div className={`transition-opacity duration-400 ${storyFading ? "opacity-0" : "opacity-100"}`}>
              <p className="text-xl sm:text-2xl font-medium leading-relaxed text-foreground/90 italic mb-4">
                &ldquo;{stories[storyIndex].quote}&rdquo;
              </p>
              <p className="text-sm text-muted">&mdash; {stories[storyIndex].archetype}</p>
            </div>
          </div>
          <div className="flex justify-center gap-1.5 mt-6">
            {stories.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === storyIndex ? "bg-accent" : "bg-white/10"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy — what we're not */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-accent text-sm font-medium tracking-wide uppercase mb-3">Our philosophy</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Not another tracking app.
            </h2>
            <p className="text-muted mt-3 max-w-md mx-auto">We don&apos;t count your calories, shame your choices, or pretend we know you better than you know yourself.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10">
              <h3 className="font-semibold text-red-400/80 text-sm mb-3">PAUSE doesn&apos;t</h3>
              <ul className="space-y-2.5 text-muted text-sm">
                <li className="flex gap-2"><span className="text-red-400/50 shrink-0">{"\u2715"}</span>Count calories or track macros</li>
                <li className="flex gap-2"><span className="text-red-400/50 shrink-0">{"\u2715"}</span>Send guilt-based notifications</li>
                <li className="flex gap-2"><span className="text-red-400/50 shrink-0">{"\u2715"}</span>Block apps or restrict access</li>
                <li className="flex gap-2"><span className="text-red-400/50 shrink-0">{"\u2715"}</span>Give generic one-size-fits-all advice</li>
              </ul>
            </div>
            <div className="p-5 rounded-2xl bg-accent/5 border border-accent/10">
              <h3 className="font-semibold text-accent/80 text-sm mb-3">PAUSE does</h3>
              <ul className="space-y-2.5 text-muted text-sm">
                <li className="flex gap-2"><span className="text-accent/70 shrink-0">{"\u2713"}</span>Learn your unique patterns over time</li>
                <li className="flex gap-2"><span className="text-accent/70 shrink-0">{"\u2713"}</span>Show you your own words when it matters</li>
                <li className="flex gap-2"><span className="text-accent/70 shrink-0">{"\u2713"}</span>Create space — never force a choice</li>
                <li className="flex gap-2"><span className="text-accent/70 shrink-0">{"\u2713"}</span>Adapt to who you are, not who you should be</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Archetypes */}
      <section className="py-24 px-6 bg-surface/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-accent text-sm font-medium tracking-wide uppercase mb-3">Identity archetypes</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Which one sounds like you?
            </h2>
            <p className="text-muted mt-3">10 archetypes. Not diagnoses — mirrors.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {archetypes.map((a) => (
              <div key={a.name} className={`p-4 rounded-xl bg-gradient-to-br ${a.color} border ${a.border} hover:scale-[1.02] transition-transform`}>
                <span className="text-xl">{a.icon}</span>
                <p className="text-sm font-medium mt-2">{a.name}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-muted text-xs mt-6">+ 4 more discovered through the questionnaire</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/8 rounded-full blur-3xl animate-breathe" />
        </div>
        <div className="relative z-10 max-w-lg mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Ready to meet yourself?
          </h2>
          <p className="text-muted mb-8">
            The questionnaire takes 3 minutes. What it reveals might change everything.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-accent text-white hover:bg-accent-soft active:scale-[0.98] transition-all"
          >
            Begin the Questionnaire
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-muted/50">
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-accent/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
            </svg>
            PAUSE
          </div>
          <p>Your behavioral intelligence layer</p>
        </div>
      </footer>
    </div>
  );
}
