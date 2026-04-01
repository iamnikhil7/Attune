"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Avatar from "@/components/Avatar";
import Link from "next/link";
import { pauseQuestions } from "@/lib/pause/questions";
import { scoreArchetype, type PauseArchetype } from "@/lib/pause/archetypes";
import { generateGoals } from "@/lib/pause/goals";

type Phase = "intro" | "safety" | "safety_confirm" | "onboarding" | "goals" | "reveal" | "priorities" | "connect_apps" | "dashboard" | "your_why" | "witness" | "result";

const hexToColorName: Record<string, string> = {
  "#E85D3A": "orange", "#3A8FE8": "blue", "#E8A83A": "amber",
  "#C23AE8": "purple", "#3A3AE8": "indigo", "#E83A6F": "pink",
  "#3AE8A8": "teal", "#E8D43A": "yellow", "#FF6B6B": "red", "#6BE8A0": "green",
};

const APP_CATEGORIES = [
  {
    id: "health", label: "Health Trackers", sub: "Movement, sleep, and recovery data",
    apps: [
      { id: "apple_health", name: "Apple Health", desc: "Steps, heart rate, activity rings", badge: "safe", badgeColor: "#6BE8A0" },
      { id: "whoop", name: "Whoop", desc: "Sleep score, HRV, recovery", badge: "safe", badgeColor: "#6BE8A0" },
      { id: "oura", name: "Oura", desc: "Sleep, readiness, activity", badge: "safe", badgeColor: "#6BE8A0" },
      { id: "strava", name: "Strava", desc: "Workouts, runs, cycling", badge: "safe", badgeColor: "#6BE8A0" },
    ],
  },
  {
    id: "delivery", label: "Delivery & Food", sub: "Order patterns and timing",
    apps: [
      { id: "doordash", name: "DoorDash", desc: "Order history, time of orders", badge: "trigger", badgeColor: "#E85D3A" },
      { id: "ubereats", name: "UberEats", desc: "Order history, time of orders", badge: "trigger", badgeColor: "#E85D3A" },
      { id: "instacart", name: "Instacart", desc: "Order patterns, grocery habits", badge: "watch", badgeColor: "#E8A83A" },
    ],
  },
  {
    id: "social", label: "Social & Screen", sub: "Screen time and attention patterns",
    apps: [
      { id: "instagram", name: "Instagram", desc: "Usage time, session data", badge: "trigger", badgeColor: "#E85D3A" },
      { id: "tiktok", name: "TikTok", desc: "Watch time, session data", badge: "trigger", badgeColor: "#E85D3A" },
      { id: "youtube", name: "YouTube", desc: "Watch time, session data", badge: "watch", badgeColor: "#E8A83A" },
    ],
  },
  {
    id: "spending", label: "Spending", sub: "Purchase patterns and impulse buying",
    apps: [
      { id: "bank", name: "Bank (via Plaid)", desc: "Transaction patterns", badge: "watch", badgeColor: "#E8A83A" },
      { id: "amazon", name: "Amazon", desc: "Order history, patterns", badge: "trigger", badgeColor: "#E85D3A" },
    ],
  },
];

const AMBIENT_CATEGORIES = [
  { id: "movement", label: "Movement" },
  { id: "nutrition", label: "Nutrition" },
  { id: "screen_time", label: "Screen Time" },
  { id: "sleep", label: "Sleep" },
  { id: "spending", label: "Spending" },
  { id: "social", label: "Social" },
  { id: "work_stress", label: "Work Stress" },
];

export default function PausePage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [sensitivityChoice, setSensitivityChoice] = useState<string | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [personalWhy, setPersonalWhy] = useState("");
  const [archetype, setArchetype] = useState<PauseArchetype | null>(null);
  const [avatarColor, setAvatarColor] = useState("green");
  const [suggestedGoals, setSuggestedGoals] = useState<string[]>([]);
  const [activeGoals, setActiveGoals] = useState<boolean[]>([]);
  const [priorities, setPriorities] = useState<Set<string>>(new Set());
  const [connectedApps, setConnectedApps] = useState<Set<string>>(new Set());
  const [problemApps, setProblemApps] = useState<Set<string>>(new Set());
  const [flagExpanded, setFlagExpanded] = useState(false);
  const [points, setPoints] = useState(0);
  const [resisted, setResisted] = useState(0);
  const [totalPauses, setTotalPauses] = useState(0);
  const [outcome, setOutcome] = useState<"resisted" | "overrode" | "modified" | null>(null);
  const [overrideCount, setOverrideCount] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (phase === "reveal") {
      const t = setTimeout(() => setRevealed(true), 300);
      return () => clearTimeout(t);
    } else {
      setRevealed(false);
    }
  }, [phase]);

  const q = pauseQuestions[qIndex];

  const handleCardSelect = (val: string) => {
    if (q.type === "single") {
      setAnswers((p) => ({ ...p, [q.id]: val }));
      setTimeout(() => {
        if (qIndex < pauseQuestions.length - 1) setQIndex((i) => i + 1);
        else finishOnboarding();
      }, 300);
    }
  };

  const handleMultiToggle = (val: string) => {
    setAnswers((p) => {
      const current = (p[q.id] as string[]) || [];
      const next = current.includes(val) ? current.filter((v) => v !== val) : [...current, val];
      return { ...p, [q.id]: next };
    });
  };

  const finishOnboarding = () => {
    const a = scoreArchetype((answers[1] as string) || "", (answers[2] as string) || "", (answers[3] as string[]) || []);
    setArchetype(a);
    setAvatarColor(hexToColorName[a.color] || "green");
    const goals = generateGoals(a.id, (answers[3] as string[]) || []);
    setSuggestedGoals(goals);
    setActiveGoals(goals.map(() => true));
    setPhase("goals");
  };

  const handleResist = () => {
    setOutcome("resisted"); setResisted((r) => r + 1);
    setTotalPauses((t) => t + 1); setPoints((p) => p + 15);
    setOverrideCount(0); setPhase("result");
  };
  const handleModify = () => {
    setOutcome("modified"); setResisted((r) => r + 1);
    setTotalPauses((t) => t + 1); setPoints((p) => p + 10);
    setPhase("result");
  };
  const handleOverride = () => {
    if (overrideCount >= 2) { setPhase("witness"); return; }
    setOutcome("overrode"); setTotalPauses((t) => t + 1);
    setOverrideCount((c) => c + 1); setPhase("result");
  };

  // ===== INTRO =====
  if (phase === "intro") return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="max-w-sm text-center animate-in">
          <p className="text-xs uppercase tracking-widest text-muted/40 mb-8">Behavioral Intelligence</p>
          <h1 className="text-4xl sm:text-5xl leading-[1.15] mb-6" style={{ color: "#E85D3A" }}>PAUSE</h1>
          <p className="text-lg text-foreground/90 mb-2">You don&apos;t need more willpower.</p>
          <p className="text-muted/50 text-sm mb-12">You need awareness at the right moment.</p>
          <button onClick={() => setPhase("safety")} className="px-8 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all hover:opacity-90 animate-glow" style={{ background: "#E85D3A", color: "#0A0A0F" }}>
            Begin
          </button>
          <div className="mt-8">
            <Link href="/" className="text-xs text-muted/20 hover:text-muted/40 transition-colors">&larr; Back to Attune</Link>
          </div>
        </div>
      </div>
    </div>
  );

  // ===== SAFETY GATE =====
  if (phase === "safety") return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="max-w-sm animate-in">
          <p className="text-xs uppercase tracking-widest text-muted/40 mb-6">Before we begin</p>
          <p className="text-xl leading-relaxed mb-6 text-foreground/90">Some of what we explore touches on food, body image, and health habits.</p>
          <p className="text-sm text-muted/50 mb-6">Do any of these feel sensitive right now?</p>
          <div className="space-y-2">
            <button onClick={() => { setSensitivityChoice("gentle"); setPhase("safety_confirm"); }} className={`w-full text-left px-5 py-4 rounded-2xl border text-sm transition-all ${sensitivityChoice === "gentle" ? "border-pause-orange/30 bg-pause-orange/[0.05]" : "border-border hover:border-white/10"}`}>
              Yes, please be gentle
            </button>
            <button onClick={() => { setSensitivityChoice("okay"); setPhase("safety_confirm"); }} className={`w-full text-left px-5 py-4 rounded-2xl border text-sm transition-all ${sensitivityChoice === "okay" ? "border-pause-orange/30 bg-pause-orange/[0.05]" : "border-border hover:border-white/10"}`}>
              I&apos;m okay — continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ===== SAFETY CONFIRMATION =====
  if (phase === "safety_confirm") return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="max-w-sm animate-in">
          <div className="p-5 rounded-2xl border border-border bg-surface mb-6">
            <p className="text-[0.625rem] uppercase tracking-wider text-muted/40 mb-3">Attune</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {sensitivityChoice === "gentle"
                ? "We'll use softer language throughout. You can change this anytime. Nothing here is meant to pressure you."
                : "Great. We'll proceed normally. If anything feels off at any point, you can always go back."
              }
            </p>
          </div>
          <button onClick={() => setPhase("onboarding")} className="w-full py-3.5 rounded-full text-sm font-medium tracking-wide hover:opacity-90 transition-all" style={{ background: "#E85D3A", color: "#0A0A0F" }}>
            Continue to questions
          </button>
          <button onClick={() => setPhase("safety")} className="w-full mt-3 py-2 text-xs text-muted/30 hover:text-muted/50 transition-colors">
            Go back
          </button>
        </div>
      </div>
    </div>
  );

  // ===== ONBOARDING =====
  if (phase === "onboarding") return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted/30 tracking-wide">{qIndex + 1} / {pauseQuestions.length}</span>
          <span className="text-xs text-muted/30 tracking-wide">{q.section}</span>
        </div>
        <div className="flex gap-1 mb-12">
          {pauseQuestions.map((_, i) => (
            <div key={i} className={`h-[2px] flex-1 rounded-full transition-all duration-500 ${i < qIndex ? "bg-pause-orange" : i === qIndex ? "bg-pause-orange/40" : "bg-white/[0.04]"}`} />
          ))}
        </div>

        <h2 className="text-2xl sm:text-3xl leading-snug mb-2">{q.text}</h2>
        <p className="text-sm text-muted/40 mb-10">{q.subtitle}</p>

        {q.type === "single" && q.options && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 stagger">
            {q.options.map((opt) => {
              const sel = answers[q.id] === opt.value;
              return (
                <button key={opt.value} onClick={() => handleCardSelect(opt.value)} className={`text-left p-5 rounded-2xl border card-hover hover:scale-[1.02] active:scale-[0.98] transition-all ${sel ? "border-pause-orange/30 bg-pause-orange/[0.07]" : "border-border bg-surface-light/50 hover:border-white/10"}`}>
                  <span className="text-2xl block mb-3">{opt.emoji}</span>
                  <p className="text-sm font-medium leading-tight">{opt.label}</p>
                  <p className="text-xs text-muted/50 mt-1.5 leading-snug">{opt.subtitle}</p>
                </button>
              );
            })}
          </div>
        )}

        {q.type === "multi" && q.options && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 stagger">
              {q.options.map((opt) => {
                const sel = ((answers[q.id] as string[]) || []).includes(opt.value);
                return (
                  <button key={opt.value} onClick={() => handleMultiToggle(opt.value)} className={`text-left p-5 rounded-2xl border card-hover hover:scale-[1.02] active:scale-[0.98] transition-all ${sel ? "border-pause-orange/30 bg-pause-orange/[0.07]" : "border-border bg-surface-light/50 hover:border-white/10"}`}>
                    <span className="text-2xl block mb-3">{opt.emoji}</span>
                    <p className="text-sm font-medium leading-tight">{opt.label}</p>
                    <p className="text-xs text-muted/50 mt-1.5 leading-snug">{opt.subtitle}</p>
                  </button>
                );
              })}
            </div>
            <button onClick={() => { if (qIndex < pauseQuestions.length - 1) setQIndex((i) => i + 1); else finishOnboarding(); }} disabled={!answers[q.id] || (answers[q.id] as string[]).length === 0} className={`w-full py-3.5 rounded-full text-sm font-medium tracking-wide transition-all ${answers[q.id] && (answers[q.id] as string[]).length > 0 ? "hover:opacity-90" : "bg-white/[0.03] text-muted/15 cursor-not-allowed"}`} style={answers[q.id] && (answers[q.id] as string[]).length > 0 ? { background: "#E85D3A", color: "#0A0A0F" } : {}}>
              Continue
            </button>
          </>
        )}

        {q.type === "text" && (
          <>
            <textarea value={personalWhy} onChange={(e) => setPersonalWhy(e.target.value)} placeholder="Because I want to…" rows={4} className="w-full bg-transparent border-b border-border px-0 py-4 text-xl serif text-foreground placeholder:text-muted/15 focus:outline-none focus:border-pause-orange/30 resize-none mb-6" />
            <button onClick={() => { setAnswers((p) => ({ ...p, [q.id]: personalWhy })); finishOnboarding(); }} disabled={personalWhy.trim().length < 5} className={`w-full py-3.5 rounded-full text-sm font-medium tracking-wide transition-all ${personalWhy.trim().length >= 5 ? "hover:opacity-90" : "bg-white/[0.03] text-muted/15 cursor-not-allowed"}`} style={personalWhy.trim().length >= 5 ? { background: "#E85D3A", color: "#0A0A0F" } : {}}>
              Seal it
            </button>
          </>
        )}

        {qIndex > 0 && (
          <button onClick={() => setQIndex((i) => i - 1)} className="mt-4 text-xs text-muted/20 hover:text-muted/40 transition-colors">
            &larr; Previous question
          </button>
        )}
      </div>
    </div>
  );

  // ===== GOALS =====
  if (phase === "goals" && archetype) return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="max-w-lg mx-auto px-6 pt-24 pb-16 animate-in">
        <h2 className="text-2xl mb-3">Your identity anchors</h2>
        <p className="text-sm text-muted/50 mb-8">These are personalized to you. Toggle off any that don't resonate.</p>
        <div className="space-y-3 mb-8">
          {suggestedGoals.map((goal, i) => (
            <div key={i} className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${activeGoals[i] ? "bg-pause-orange/[0.07] border-pause-orange/30" : "bg-surface border-border opacity-50"}`}>
              <button onClick={() => setActiveGoals((p) => { const n = [...p]; n[i] = !n[i]; return n; })} className={`mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors ${activeGoals[i] ? "bg-pause-orange border-pause-orange text-white" : "border-white/20 text-transparent"}`}>
                {activeGoals[i] && "✓"}
              </button>
              <p className={`text-sm leading-relaxed ${activeGoals[i] ? "text-foreground" : "text-muted/50"}`}>{goal}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setPhase("reveal")} disabled={!activeGoals.some(Boolean)} className={`w-full py-3.5 rounded-full text-sm font-medium tracking-wide transition-all ${activeGoals.some(Boolean) ? "hover:opacity-90" : "bg-white/[0.03] text-muted/15 cursor-not-allowed"}`} style={activeGoals.some(Boolean) ? { background: "#E85D3A", color: "#0A0A0F" } : {}}>
          Continue
        </button>
      </div>
    </div>
  );

  // ===== ARCHETYPE REVEAL =====
  if (phase === "reveal" && archetype) return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="max-w-md mx-auto px-6 pt-24 pb-16 text-center">
        <div className={`transition-all duration-1000 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="mb-6 flex justify-center">
            <Avatar archetypeColor={avatarColor} state={revealed ? "celebrating" : "neutral"} size="xl" />
          </div>

          <div className="relative w-24 h-24 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="5" />
              <circle cx="60" cy="60" r="54" fill="none" stroke={archetype.color} strokeWidth="5" strokeLinecap="round" strokeDasharray={2 * Math.PI * 54} strokeDashoffset={revealed ? 2 * Math.PI * 54 * (1 - archetype.baseline / 100) : 2 * Math.PI * 54} style={{ transition: "stroke-dashoffset 1.5s ease-out" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-semibold">{archetype.baseline}%</span>
              <span className="text-[0.5rem] text-muted/40">baseline</span>
            </div>
          </div>

          <h1 className="text-3xl mb-3" style={{ color: archetype.color }}>{archetype.name}</h1>
          <p className="text-sm text-muted/70 leading-relaxed mb-6 max-w-xs mx-auto">{archetype.description}</p>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {archetype.traits.map((t) => (
              <span key={t} className="px-3 py-1 rounded-full text-xs border border-border text-muted/50">{t}</span>
            ))}
          </div>

          {personalWhy && (
            <div className="p-5 rounded-2xl bg-surface border border-border mb-8 text-left">
              <p className="text-[0.625rem] uppercase tracking-wider text-muted/30 mb-2">Your why</p>
              <p className="serif text-foreground/90">&ldquo;{personalWhy}&rdquo;</p>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-surface-light/50 border border-border mb-8 text-left">
            <p className="text-[0.625rem] uppercase tracking-wider text-muted/30 mb-2">What happens now</p>
            <p className="text-xs text-muted/50 leading-relaxed">
              7 days of silent observation. After that, PAUSE activates when recurring vulnerabilities are detected.
            </p>
          </div>

          <button onClick={() => setPhase("priorities")} className="w-full py-3.5 rounded-full text-sm font-medium tracking-wide hover:opacity-90 transition-all" style={{ background: archetype.color, color: "#0A0A0F" }}>
            Set your priorities
          </button>
        </div>
      </div>
    </div>
  );

  // ===== PRIORITIES =====
  if (phase === "priorities") return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="max-w-sm mx-auto px-6 pt-24 pb-16 animate-in">
        <h2 className="text-2xl mb-8">What matters most to you?</h2>
        <div className="space-y-3 mb-8">
          {[
            { id: "physical", label: "Physical Health", sub: "Movement, fitness, recovery" },
            { id: "nutrition", label: "Nutritional Health", sub: "Eating patterns, delivery habits" },
            { id: "digital", label: "Digital Wellness", sub: "Screen time, scrolling, attention" },
          ].map((p) => {
            const active = priorities.has(p.id);
            return (
              <button key={p.id} onClick={() => setPriorities((prev) => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; })} className={`w-full text-left px-5 py-4 rounded-2xl border transition-all card-hover hover:scale-[1.01] ${active ? "border-pause-orange/30 bg-pause-orange/[0.07]" : "border-border hover:border-white/10"}`}>
                <p className="text-sm font-medium">{p.label}</p>
                <p className="text-xs text-muted/40 mt-0.5">{p.sub}</p>
              </button>
            );
          })}
        </div>
        <button onClick={() => setPhase("connect_apps")} disabled={priorities.size === 0} className={`w-full py-3.5 rounded-full text-sm font-medium tracking-wide transition-all ${priorities.size > 0 ? "hover:opacity-90" : "bg-white/[0.03] text-muted/15 cursor-not-allowed"}`} style={priorities.size > 0 ? { background: "#E85D3A", color: "#0A0A0F" } : {}}>
          Continue
        </button>
      </div>
    </div>
  );

  // ===== CONNECT APPS =====
  if (phase === "connect_apps") {
    const connectedCount = connectedApps.size;
    const connectedAppNames = APP_CATEGORIES.flatMap(c => c.apps).filter(a => connectedApps.has(a.id));
    return (
      <div className="min-h-screen bg-background"><Navbar />
        <div className="max-w-xl mx-auto px-6 pt-24 pb-16 animate-in">
          <h2 className="text-2xl mb-2">Connect your apps</h2>
          <p className="text-sm text-muted/50 mb-10">PAUSE uses data from your apps to learn your patterns. Connect what you&apos;re comfortable with — you can always change this later.</p>

          {APP_CATEGORIES.map((cat) => (
            <div key={cat.id} className="mb-8">
              <p className="text-sm font-semibold mb-1">{cat.label}</p>
              <p className="text-xs text-muted/40 mb-3">{cat.sub}</p>
              <div className="space-y-2">
                {cat.apps.map((app) => {
                  const active = connectedApps.has(app.id);
                  return (
                    <button key={app.id} onClick={() => setConnectedApps((prev) => { const n = new Set(prev); n.has(app.id) ? n.delete(app.id) : n.add(app.id); return n; })} className={`w-full text-left px-5 py-4 rounded-2xl border transition-all ${active ? "border-white/15 bg-white/[0.04]" : "border-border hover:border-white/10"}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium flex items-center gap-2">
                            {app.name}
                            <span className="text-[0.6rem] px-2 py-0.5 rounded-full font-medium" style={{ background: `${app.badgeColor}20`, color: app.badgeColor }}>{app.badge}</span>
                          </p>
                          <p className="text-xs text-muted/40 mt-0.5">{app.desc}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${active ? "border-pause-orange bg-pause-orange" : "border-white/15"}`}>
                          {active && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 4" stroke="#0A0A0F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Flag problem apps */}
          {connectedCount > 0 && (
            <div className="p-5 rounded-2xl border border-border bg-surface mb-8">
              <button onClick={() => setFlagExpanded(!flagExpanded)} className="w-full flex items-center justify-between">
                <div className="text-left">
                  <p className="text-sm font-semibold">Flag your problem apps</p>
                  <p className="text-xs text-muted/40 mt-0.5">Which connected apps do you consider your problem apps? These will be monitored more closely.</p>
                </div>
                <span className={`text-muted/30 transition-transform ${flagExpanded ? "rotate-180" : ""}`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </span>
              </button>
              {flagExpanded && (
                <div className="mt-4 space-y-2">
                  {connectedAppNames.map((app) => (
                    <button key={app.id} onClick={() => setProblemApps((prev) => { const n = new Set(prev); n.has(app.id) ? n.delete(app.id) : n.add(app.id); return n; })} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${problemApps.has(app.id) ? "bg-white/[0.06]" : "bg-white/[0.02] hover:bg-white/[0.04]"}`}>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${problemApps.has(app.id) ? "border-pause-orange bg-pause-orange" : "border-white/20"}`}>
                        {problemApps.has(app.id) && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 4" stroke="#0A0A0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span className="text-sm text-muted/70">{app.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <button onClick={() => setPhase("dashboard")} className="w-full py-3.5 rounded-full text-sm font-medium tracking-wide hover:opacity-90 transition-all" style={{ background: "#E8A83A", color: "#0A0A0F" }}>
            {connectedCount > 0 ? `Continue with ${connectedCount} app${connectedCount > 1 ? "s" : ""}` : "Skip for now"}
          </button>
          <p className="text-xs text-muted/30 text-center mt-3">You can connect apps anytime from settings.</p>
        </div>
      </div>
    );
  }

  // ===== DASHBOARD =====
  if (phase === "dashboard") {
    const connectedAppNames = APP_CATEGORIES.flatMap(c => c.apps).filter(a => connectedApps.has(a.id));
    const selectedGoals = suggestedGoals.filter((_, i) => activeGoals[i]);
    const priorityLabels: Record<string, string> = { physical: "Physical Health", nutrition: "Nutritional Health", digital: "Digital Wellness" };
    const activeAmbient = new Set<string>();
    if (connectedApps.has("apple_health") || connectedApps.has("whoop") || connectedApps.has("oura") || connectedApps.has("strava")) { activeAmbient.add("movement"); activeAmbient.add("sleep"); }
    if (connectedApps.has("doordash") || connectedApps.has("ubereats") || connectedApps.has("instacart")) activeAmbient.add("nutrition");
    if (connectedApps.has("instagram") || connectedApps.has("tiktok") || connectedApps.has("youtube")) activeAmbient.add("screen_time");

    return (
      <div className="min-h-screen bg-background"><Navbar />
        <div className="max-w-xl mx-auto px-6 pt-20 pb-16">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <span className="text-pause-orange text-lg">⏸</span>
              <span className="text-sm font-semibold tracking-wide">PAUSE</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted/40">Progress</span>
              <span className="text-xs flex items-center gap-1.5" style={{ color: archetype?.color }}>
                <Avatar archetypeColor={avatarColor} state="neutral" size="sm" />
                {archetype?.name}
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[{ v: points, l: "Points", c: "#6BE8A0" }, { v: resisted, l: "Resisted", c: "#6BE8A0" }, { v: totalPauses, l: "Total pauses", c: "#6BE8A0" }].map((s) => (
              <div key={s.l} className="p-4 rounded-2xl bg-surface border border-border text-center">
                <p className="text-xl font-semibold" style={{ color: s.c }}>{s.v}</p>
                <p className="text-[0.65rem] text-muted/40 mt-1">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Observation phase */}
          <div className="p-5 rounded-2xl bg-surface border border-border mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#E8A83A]" />
              <p className="text-sm font-semibold">Observation phase</p>
            </div>
            <p className="text-xs text-muted/50 leading-relaxed mb-4">PAUSE is learning your patterns. During this phase, you can trigger a demo pause to see how it works.</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: "14%", background: "#E8A83A" }} />
              </div>
              <span className="text-xs text-muted/40 flex-shrink-0">Day 1 of 7</span>
            </div>
            <button onClick={() => { setOutcome(null); setPhase("your_why"); }} className="w-full py-3 rounded-xl text-sm font-medium tracking-wide transition-all border border-pause-orange/20 hover:bg-pause-orange/[0.05]" style={{ color: "#E85D3A" }}>
              Try a demo pause
            </button>
          </div>

          {/* Your Why card */}
          {personalWhy && (
            <div className="p-5 rounded-2xl bg-surface border border-border mb-6">
              <p className="text-[0.625rem] uppercase tracking-wider text-muted/30 mb-3">Your Why</p>
              <p className="serif text-lg text-foreground/90 italic">&ldquo;{personalWhy}&rdquo;</p>
            </div>
          )}

          {/* Priorities + Goals side by side */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-5 rounded-2xl bg-surface border border-border">
              <p className="text-[0.625rem] uppercase tracking-wider text-muted/30 mb-3">Priorities</p>
              <div className="space-y-2">
                {Array.from(priorities).map((p) => (
                  <p key={p} className="text-sm flex items-center gap-2" style={{ color: "#E85D3A" }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#E85D3A" }} />
                    {priorityLabels[p] || p}
                  </p>
                ))}
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-surface border border-border">
              <p className="text-[0.625rem] uppercase tracking-wider text-muted/30 mb-3">Goals</p>
              <div className="space-y-2">
                {selectedGoals.slice(0, 4).map((g, i) => (
                  <p key={i} className="text-xs text-muted/60 leading-relaxed">· {g}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Ambient Sensing */}
          <div className="p-5 rounded-2xl bg-surface border border-border mb-6">
            <p className="text-[0.625rem] uppercase tracking-wider text-muted/30 mb-4">Ambient Sensing</p>
            <div className="grid grid-cols-4 gap-2">
              {AMBIENT_CATEGORIES.map((cat) => {
                const isActive = activeAmbient.has(cat.id);
                return (
                  <div key={cat.id} className={`p-3 rounded-xl text-center border transition-all ${isActive ? "border-white/10 bg-white/[0.03]" : "border-border bg-white/[0.01]"}`}>
                    <p className={`text-xs font-medium ${isActive ? "text-pause-orange" : "text-muted/40"}`}>{cat.label}</p>
                    <p className={`text-[0.6rem] mt-0.5 ${isActive ? "text-muted/50" : "text-muted/20"}`}>{isActive ? "Active" : "Pending"}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connected Apps */}
          <div className="p-5 rounded-2xl bg-surface border border-border mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[0.625rem] uppercase tracking-wider text-muted/30">Connected Apps</p>
              <button onClick={() => setPhase("connect_apps")} className="text-xs text-pause-orange hover:opacity-80 transition-colors">Manage</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {connectedAppNames.length > 0 ? connectedAppNames.map((app) => (
                <span key={app.id} className="px-3 py-1.5 rounded-full text-xs border border-border text-muted/50">{app.name}</span>
              )) : (
                <p className="text-xs text-muted/20">No apps connected yet</p>
              )}
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-xs text-muted/20 hover:text-muted/40 transition-colors">&larr; Back to Attune</Link>
          </div>
        </div>
      </div>
    );
  }

  // ===== YOUR WHY =====
  if (phase === "your_why") return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6"><Navbar />
      <div className="max-w-md w-full text-center animate-in">
        <p className="text-[0.625rem] uppercase tracking-[0.25em] text-muted/30 mb-6">Layer 02 — Your Why</p>

        <p className="text-lg leading-relaxed mb-8" style={{ color: "#E8A83A" }}>
          You&apos;ve been scrolling for 28 minutes. This is usually when the pattern starts.
        </p>

        <div className="p-6 rounded-2xl bg-surface border border-border mb-10">
          <p className="serif text-xl text-foreground/90 italic leading-relaxed">&ldquo;{personalWhy}&rdquo;</p>
          <p className="text-xs text-muted/30 mt-3">— You wrote this</p>
        </div>

        <div className="space-y-3 w-full">
          <button onClick={handleResist} className="w-full py-4 rounded-2xl text-sm font-medium tracking-wide transition-all card-hover" style={{ background: "rgba(107,232,160,0.12)", color: "#6BE8A0" }}>
            I&apos;m going to resist
          </button>
          <button onClick={handleModify} className="w-full py-4 rounded-2xl text-sm font-medium tracking-wide transition-all card-hover" style={{ background: "rgba(232,168,58,0.12)", color: "#E8A83A" }}>
            I&apos;ll modify what I was going to do
          </button>
          <button onClick={handleOverride} className="w-full py-4 rounded-2xl text-sm transition-all card-hover bg-white/[0.03] text-muted/30 hover:text-muted/50">
            I&apos;m going to proceed anyway
          </button>
        </div>

        <button onClick={() => setPhase("dashboard")} className="mt-8 text-xs text-muted/20 hover:text-muted/40 transition-colors">&larr; Back to dashboard</button>
      </div>
    </div>
  );

  // ===== WITNESS =====
  if (phase === "witness") return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6"><Navbar />
      <div className="max-w-sm text-center animate-in">
        <div className="w-4 h-4 rounded-full border border-white/10 mx-auto mb-10 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white/20" /></div>
        <p className="text-xl text-muted/50 mb-10">Noted. No judgment. Just witnessing.</p>
        <div className="space-y-2.5 w-full">
          <button onClick={handleResist} className="w-full py-3 rounded-full text-sm font-medium transition-all card-hover" style={{ background: "rgba(107,232,160,0.08)", color: "#6BE8A0" }}>Actually, I'll resist</button>
          <button onClick={() => { setOutcome("overrode"); setTotalPauses((t) => t + 1); setOverrideCount((c) => c + 1); setPhase("result"); }} className="w-full py-3 rounded-full text-sm text-muted/15 hover:text-muted/30 transition-colors card-hover">Continue anyway</button>
        </div>
      </div>
    </div>
  );

  // ===== RESULT =====
  if (phase === "result") return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6"><Navbar />
      <div className="max-w-sm text-center animate-in">
        {outcome === "resisted" && (<><div className="mb-6 flex justify-center"><Avatar archetypeColor={avatarColor} state="glowing" size="lg" /></div><h2 className="text-2xl mb-2">You resisted.</h2><p className="text-sm text-muted/40">+15 points</p></>)}
        {outcome === "modified" && (<><div className="mb-6 flex justify-center"><Avatar archetypeColor={avatarColor} state="celebrating" size="lg" /></div><h2 className="text-2xl mb-2">Modified. That counts.</h2><p className="text-sm text-muted/40">+10 points</p></>)}
        {outcome === "overrode" && (<><h2 className="text-2xl mb-2">Noted.</h2><p className="text-sm text-muted/20">No judgment. Every response helps.</p></>)}
        <button onClick={() => setPhase("dashboard")} className="mt-8 px-8 py-3 rounded-full text-sm font-medium tracking-wide hover:opacity-90 transition-all card-hover" style={{ background: "#E85D3A", color: "#0A0A0F" }}>
          Back to dashboard
        </button>
        <div className="mt-4">
          <Link href="/" className="text-xs text-muted/15 hover:text-muted/30 transition-colors">Home</Link>
        </div>
      </div>
    </div>
  );

  return null;
}
