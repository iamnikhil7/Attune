"use client";

import Link from "next/link";

const archetypes = [
  {
    name: "The Burnt-Out Professional",
    description: "High-achiever drowning in deadlines, surviving on delivery apps and caffeine.",
    color: "from-amber-500/20 to-amber-600/5",
    borderColor: "border-amber-500/30",
    icon: "\u{1F525}",
  },
  {
    name: "The Former Athlete",
    description: "Once fit, now struggling as metabolism slows and old habits don't work.",
    color: "from-olive-500/20 to-green-600/5",
    borderColor: "border-green-500/30",
    icon: "\u{1F3C3}",
  },
  {
    name: "The Overwhelmed Parent",
    description: "Putting everyone else first, grabbing whatever food is fast and easy.",
    color: "from-rose-500/20 to-rose-600/5",
    borderColor: "border-rose-500/30",
    icon: "\u{1F49B}",
  },
  {
    name: "The Night Owl",
    description: "Comes alive after dark, makes worst decisions between 10pm\u20132am.",
    color: "from-indigo-500/20 to-indigo-600/5",
    borderColor: "border-indigo-500/30",
    icon: "\u{1F319}",
  },
  {
    name: "The Emotional Eater",
    description: "Food is comfort, reward, and coping mechanism all in one.",
    color: "from-pink-500/20 to-pink-600/5",
    borderColor: "border-pink-500/30",
    icon: "\u{1FAC6}",
  },
  {
    name: "The Serial Starter",
    description: "Has tried every diet, app, and program. Starts strong, fades fast.",
    color: "from-orange-500/20 to-orange-600/5",
    borderColor: "border-orange-500/30",
    icon: "\u{1F680}",
  },
];

const features = [
  {
    title: "Ambient Sensing",
    description: "Passively monitors movement, nutrition, screen time, spending, sleep, social patterns, and work stress.",
    iconPath: "M9.348 14.652a3.75 3.75 0 010-5.304m5.304 0a3.75 3.75 0 010 5.304m-7.425 2.121a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z",
  },
  {
    title: "Context Engine",
    description: "Combines your signals with goals, identity, and time of day to detect vulnerability moments.",
    iconPath: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5",
  },
  {
    title: "Three-Layer Pause",
    description: "A cooldown, your own words, and a witness nudge \u2014 three layers of clarity when you need it.",
    iconPath: "M15.75 5.25v13.5m-7.5-13.5v13.5",
  },
  {
    title: "Identity Archetypes",
    description: "Discover which of 10 behavioral archetypes fits you \u2014 from Burnt-Out Professional to Mindful Aspirant.",
    iconPath: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  },
  {
    title: "Adaptive Learning",
    description: "Every response \u2014 resisted, snoozed, or overridden \u2014 makes the next suggestion smarter. Zero shame.",
    iconPath: "M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5",
  },
  {
    title: "Graduation System",
    description: "Build sustained behavior change over time. Graduate from habits and evolve \u2014 PAUSE grows with you.",
    iconPath: "M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-5.54 0",
  },
];

const pauseLayers = [
  { number: "01", title: "Cooldown", description: "A mandatory moment of stillness. You can't skip it. The app creates space between impulse and action.", duration: "30\u201345 seconds", color: "text-cyan-400", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500/20" },
  { number: "02", title: "Your Why", description: "Your own words \u2014 the reason you wrote during onboarding \u2014 shown back to you at the exact moment you need it most.", duration: "Your words", color: "text-violet-400", bgColor: "bg-violet-500/10", borderColor: "border-violet-500/20" },
  { number: "03", title: "Witness Nudge", description: "A silent presence. No lecture, no guilt. Just the app acknowledging the pattern \u2014 only when you've overridden before.", duration: "Repeat patterns only", color: "text-amber-400", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/20" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">PAUSE</span>
          </div>
          <Link href="/onboarding" className="text-sm font-medium px-5 py-2 rounded-full bg-accent text-white hover:bg-accent-soft transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-breathe" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl animate-breathe" style={{ animationDelay: "2s" }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-light border border-white/10 text-sm text-muted mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Your behavioral intelligence layer
            </div>
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.1] animate-fade-in-up-delay-1">
            The moment between{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-400">impulse</span>{" "}
            and{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-accent">action</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted max-w-xl mx-auto leading-relaxed animate-fade-in-up-delay-2">
            PAUSE detects your vulnerability moments and delivers a signature three-layer pause — so you can respond as the person you want to be, not the person your habits have made you.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up-delay-3">
            <Link href="/onboarding" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-accent text-white animate-pulse-glow hover:bg-accent-soft transition-all">
              Get Started
            </Link>
            <a href="#how-it-works" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full border border-white/10 text-foreground hover:bg-surface-light transition-all">
              How It Works
            </a>
          </div>
          <p className="mt-4 text-sm text-muted/60">No email required. Start the questionnaire instantly.</p>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              The Three-Layer{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-400">Pause</span>
            </h2>
            <p className="mt-4 text-muted max-w-lg mx-auto text-lg">Not a block. Not a lecture. A moment of clarity — designed with three layers that work together.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pauseLayers.map((layer) => (
              <div key={layer.number} className={`relative p-8 rounded-2xl ${layer.bgColor} border ${layer.borderColor} backdrop-blur-sm`}>
                <div className={`text-sm font-mono ${layer.color} mb-4`}>Layer {layer.number}</div>
                <h3 className="text-2xl font-bold mb-3">{layer.title}</h3>
                <p className="text-muted leading-relaxed">{layer.description}</p>
                <div className={`mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${layer.bgColor} ${layer.color}`}>{layer.duration}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-surface/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              Intelligence that{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-400">adapts</span>
            </h2>
            <p className="mt-4 text-muted max-w-lg mx-auto text-lg">Seven signal categories. Pattern-based detection. Zero shame.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 rounded-2xl bg-surface border border-white/5 hover:border-accent/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.iconPath} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              Which one are{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-400">you</span>?
            </h2>
            <p className="mt-4 text-muted max-w-lg mx-auto text-lg">10 identity archetypes — not diagnoses, but mirrors. Find yourself in 14 questions.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {archetypes.map((archetype) => (
              <div key={archetype.name} className={`p-5 rounded-2xl bg-gradient-to-br ${archetype.color} border ${archetype.borderColor} backdrop-blur-sm hover:scale-[1.02] transition-transform`}>
                <div className="text-2xl mb-3">{archetype.icon}</div>
                <h3 className="text-base font-semibold mb-1">{archetype.name}</h3>
                <p className="text-muted text-sm leading-relaxed">{archetype.description}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-muted text-sm mt-8">+ 4 more archetypes revealed during onboarding</p>
        </div>
      </section>

      <section className="py-24 px-6 bg-surface/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">Built on a different philosophy</h2>
          <div className="grid gap-8 text-left sm:grid-cols-2">
            <div>
              <h3 className="font-semibold text-red-400 mb-1">Not this</h3>
              <ul className="space-y-3 text-muted text-sm">
                <li className="flex items-start gap-2"><span className="text-red-400/60 mt-0.5">{"\u2715"}</span>Calorie counting and macro tracking</li>
                <li className="flex items-start gap-2"><span className="text-red-400/60 mt-0.5">{"\u2715"}</span>Guilt-based notifications</li>
                <li className="flex items-start gap-2"><span className="text-red-400/60 mt-0.5">{"\u2715"}</span>One-size-fits-all advice</li>
                <li className="flex items-start gap-2"><span className="text-red-400/60 mt-0.5">{"\u2715"}</span>Hard blocks that frustrate you</li>
                <li className="flex items-start gap-2"><span className="text-red-400/60 mt-0.5">{"\u2715"}</span>Random timing that feels intrusive</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-accent mb-1">This instead</h3>
              <ul className="space-y-3 text-muted text-sm">
                <li className="flex items-start gap-2"><span className="text-accent mt-0.5">{"\u2713"}</span>Pattern recognition across 7 signal categories</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-0.5">{"\u2713"}</span>Zero-shame override — always your choice</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-0.5">{"\u2713"}</span>Identity-anchored, personalized to who you are</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-0.5">{"\u2713"}</span>Gentle mirrors that reflect your own intentions</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-0.5">{"\u2713"}</span>Pattern-based timing that learns your rhythms</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl animate-breathe" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6">Ready to meet yourself?</h2>
          <p className="text-muted text-lg mb-10 max-w-md mx-auto">14 questions. No email required. Discover your archetype and start building behavioral intelligence today.</p>
          <Link href="/onboarding" className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-full bg-accent text-white animate-pulse-glow hover:bg-accent-soft transition-all">
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent/20 flex items-center justify-center">
              <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
            </div>
            <span>PAUSE</span>
          </div>
          <p>Your behavioral intelligence layer.</p>
        </div>
      </footer>
    </div>
  );
}
