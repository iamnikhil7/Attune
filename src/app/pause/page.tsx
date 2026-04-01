"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Avatar from "@/components/Avatar";
import { pauseQuestions } from "@/lib/pause/questions";
import { scoreArchetype, type PauseArchetype } from "@/lib/pause/archetypes";

type Phase = "intro" | "safety" | "onboarding" | "reveal" | "priorities" | "dashboard" | "your_why" | "witness" | "result";

// Map archetype color hex to Avatar color name
const hexToColorName: Record<string, string> = {
  "#E85D3A": "orange", "#3A8FE8": "green", "#E8A83A": "amber",
  "#C23AE8": "pink", "#3A3AE8": "indigo", "#E83A6F": "rose",
  "#3AE8A8": "teal", "#E8D43A": "yellow", "#FF6B6B": "rose",
  "#6BE8A0": "teal",
};

export default function PausePage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [personalWhy, setPersonalWhy] = useState("");
  const [archetype, setArchetype] = useState<PauseArchetype | null>(null);
  const [avatarColor, setAvatarColor] = useState("teal");
  const [priorities, setPriorities] = useState<Set<string>>(new Set());
  const [points, setPoints] = useState(0);
  const [resisted, setResisted] = useState(0);
  const [totalPauses, setTotalPauses] = useState(0);
  const [outcome, setOutcome] = useState<"resisted" | "overrode" | "modified" | null>(null);
  const [overrideCount, setOverrideCount] = useState(0);
  const [revealed, setRevealed] = useState(false);

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
    const a = scoreArchetype(
      (answers[1] as string) || "",
      (answers[2] as string) || "",
      (answers[3] as string[]) || []
    );
    setArchetype(a);
    setAvatarColor(hexToColorName[a.color] || "teal");
    setPhase("reveal");
    setTimeout(() => setRevealed(true), 400);
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
        <div className="max-w-md text-center animate-in">
          <p className="text-xs uppercase tracking-[0.2em] text-muted mb-8">Behavioral Intelligence</p>
          <h1 className="font-serif text-4xl sm:text-5xl italic leading-[1.15] mb-6" style={{ color: "#E85D3A" }}>PAUSE</h1>
          <p className="text-lg text-foreground/90 mb-2">You don&apos;t need more willpower.</p>
          <p className="text-muted text-sm mb-12">You need awareness at the right moment.</p>
          <button onClick={() => setPhase("safety")} className="px-8 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all hover:opacity-90" style={{ background: "#E85D3A", color: "#0A0A0F" }}>
            Begin
          </button>
        </div>
      </div>
    </div>
  );

  // ===== SAFETY =====
  if (phase === "safety") return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="max-w-sm animate-in">
          <p className="text-xs uppercase tracking-[0.2em] text-muted mb-6">Before we begin</p>
          <p className="font-serif text-xl leading-relaxed mb-8">Some of what we explore touches on food, body image, and health habits.</p>
          <p className="text-sm text-muted mb-6">Do any of these feel sensitive right now?</p>
          <div className="space-y-2">
            <button onClick={() => setPhase("onboarding")} className="w-full text-left px-5 py-3.5 rounded-xl border border-border text-sm hover:border-white/15 transition-colors">Yes, please be gentle</button>
            <button onClick={() => setPhase("onboarding")} className="w-full text-left px-5 py-3.5 rounded-xl border border-border text-sm hover:border-white/15 transition-colors">I&apos;m okay — continue</button>
          </div>
        </div>
      </div>
    </div>
  );

  // ===== ONBOARDING =====
  if (phase === "onboarding") return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-muted/30 tracking-wide">{qIndex + 1} / {pauseQuestions.length}</span>
          <span className="text-[11px] text-muted/30 tracking-wide">{q.section}</span>
        </div>
        <div className="flex gap-1 mb-12">
          {pauseQuestions.map((_, i) => (
            <div key={i} className={`h-[2px] flex-1 rounded-full transition-all duration-500 ${i < qIndex ? "bg-pause-orange" : i === qIndex ? "bg-pause-orange/40" : "bg-white/[0.04]"}`} />
          ))}
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl italic leading-snug mb-2">{q.text}</h2>
        <p className="text-sm text-muted/40 mb-10">{q.subtitle}</p>

        {q.type === "single" && q.options && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {q.options.map((opt) => {
              const sel = answers[q.id] === opt.value;
              return (
                <button key={opt.value} onClick={() => handleCardSelect(opt.value)} className={`text-left p-5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${sel ? "border-pause-orange/30 bg-pause-orange/[0.07]" : "border-border bg-surface-light/50 hover:border-white/10"}`}>
                  <span className="text-2xl block mb-3">{opt.emoji}</span>
                  <p className="text-[13px] font-medium leading-tight">{opt.label}</p>
                  <p className="text-[11px] text-muted/50 mt-1.5 leading-snug">{opt.subtitle}</p>
                </button>
              );
            })}
          </div>
        )}

        {q.type === "multi" && q.options && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {q.options.map((opt) => {
                const sel = ((answers[q.id] as string[]) || []).includes(opt.value);
                return (
                  <button key={opt.value} onClick={() => handleMultiToggle(opt.value)} className={`text-left p-5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${sel ? "border-pause-orange/30 bg-pause-orange/[0.07]" : "border-border bg-surface-light/50 hover:border-white/10"}`}>
                    <span className="text-2xl block mb-3">{opt.emoji}</span>
                    <p className="text-[13px] font-medium leading-tight">{opt.label}</p>
                    <p className="text-[11px] text-muted/50 mt-1.5 leading-snug">{opt.subtitle}</p>
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
            <textarea value={personalWhy} onChange={(e) => setPersonalWhy(e.target.value)} placeholder="Because I want to\u2026" rows={4} className="w-full bg-transparent border-b border-border px-0 py-4 text-xl font-serif italic text-foreground placeholder:text-muted/15 focus:outline-none focus:border-pause-orange/30 resize-none mb-6" />
            <button onClick={() => { setAnswers((p) => ({ ...p, [q.id]: personalWhy })); finishOnboarding(); }} disabled={personalWhy.trim().length < 5} className={`w-full py-3.5 rounded-full text-sm font-medium tracking-wide transition-all ${personalWhy.trim().length >= 5 ? "hover:opacity-90" : "bg-white/[0.03] text-muted/15 cursor-not-allowed"}`} style={personalWhy.trim().length >= 5 ? { background: "#E85D3A", color: "#0A0A0F" } : {}}>
              Seal it
            </button>
          </>
        )}
      </div>
    </div>
  );

  // ===== ARCHETYPE REVEAL (with animated avatar) =====
  if (phase === "reveal" && archetype) return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="max-w-md mx-auto px-6 pt-24 pb-16 text-center">
        <div className={`transition-all duration-1000 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {/* Animated Avatar */}
          <div className="mb-6 flex justify-center">
            <Avatar archetypeColor={avatarColor} state={revealed ? "celebrating" : "neutral"} size="xl" />
          </div>

          {/* Wellness ring */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="5" />
              <circle cx="60" cy="60" r="54" fill="none" stroke={archetype.color} strokeWidth="5" strokeLinecap="round" strokeDasharray={2 * Math.PI * 54} strokeDashoffset={revealed ? 2 * Math.PI * 54 * (1 - archetype.baseline / 100) : 2 * Math.PI * 54} style={{ transition: "stroke-dashoffset 1.5s ease-out" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-semibold">{archetype.baseline}%</span>
              <span className="text-[9px] text-muted">baseline</span>
            </div>
          </div>

          <h1 className="font-serif text-3xl italic mb-3" style={{ color: archetype.color }}>{archetype.name}</h1>
          <p className="text-sm text-muted leading-relaxed mb-6 max-w-xs mx-auto">{archetype.description}</p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {archetype.traits.map((t) => (
              <span key={t} className="px-3 py-1 rounded-full text-[11px] border border-border text-muted/60">{t}</span>
            ))}
          </div>

          {personalWhy && (
            <div className="p-5 rounded-2xl bg-surface border border-border mb-8 text-left">
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted/40 mb-2">Your why</p>
              <p className="font-serif italic text-foreground/90">&ldquo;{personalWhy}&rdquo;</p>
            </div>
          )}

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
        <p className="text-xs uppercase tracking-[0.2em] text-muted mb-3">Focus areas</p>
        <h2 className="font-serif text-2xl italic mb-8">What matters most to you?</h2>
        <div className="space-y-3 mb-8">
          {[
            { id: "physical", label: "Physical Health", sub: "Movement, fitness, recovery" },
            { id: "nutrition", label: "Nutritional Health", sub: "Eating patterns, delivery habits" },
            { id: "digital", label: "Digital Wellness", sub: "Screen time, scrolling, attention" },
          ].map((p) => {
            const active = priorities.has(p.id);
            return (
              <button key={p.id} onClick={() => setPriorities((prev) => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; })} className={`w-full text-left px-5 py-4 rounded-2xl border transition-all ${active ? "border-pause-orange/30 bg-pause-orange/[0.07]" : "border-border hover:border-white/10"}`}>
                <p className="text-sm font-medium">{p.label}</p>
                <p className="text-[11px] text-muted/50 mt-0.5">{p.sub}</p>
              </button>
            );
          })}
        </div>
        <button onClick={() => setPhase("dashboard")} disabled={priorities.size === 0} className={`w-full py-3.5 rounded-full text-sm font-medium tracking-wide transition-all ${priorities.size > 0 ? "hover:opacity-90" : "bg-white/[0.03] text-muted/15 cursor-not-allowed"}`} style={priorities.size > 0 ? { background: "#E85D3A", color: "#0A0A0F" } : {}}>
          Start observing
        </button>
      </div>
    </div>
  );

  // ===== DASHBOARD =====
  if (phase === "dashboard") return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="max-w-lg mx-auto px-6 pt-24 pb-16">
        {/* Header with avatar */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar archetypeColor={avatarColor} state={resisted > 3 ? "glowing" : resisted > 0 ? "celebrating" : "neutral"} size="md" />
          <div>
            <p className="font-serif italic text-lg" style={{ color: archetype?.color }}>{archetype?.name}</p>
            <p className="text-[11px] text-muted">{points} points &middot; {resisted} resisted</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { v: points, l: "Points", c: "#E85D3A" },
            { v: resisted, l: "Resisted", c: "#6BE8A0" },
            { v: totalPauses, l: "Pauses", c: undefined },
          ].map((s) => (
            <div key={s.l} className="p-3 rounded-xl bg-surface border border-border text-center">
              <p className="text-lg font-semibold" style={s.c ? { color: s.c } : {}}>{s.v}</p>
              <p className="text-[10px] text-muted/40">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Your Why */}
        {personalWhy && (
          <div className="p-5 rounded-2xl bg-surface border border-border mb-6">
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted/40 mb-2">Your why</p>
            <p className="font-serif italic text-foreground/90">&ldquo;{personalWhy}&rdquo;</p>
          </div>
        )}

        {/* Graduation */}
        <div className="p-4 rounded-2xl bg-surface border border-border mb-6">
          <div className="flex justify-between text-[11px] text-muted/40 mb-2">
            <span>Graduation</span>
            <span>{points} / 200</span>
          </div>
          <div className="w-full h-1 bg-white/[0.03] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (points / 200) * 100)}%`, background: "#E85D3A" }} />
          </div>
        </div>

        {/* Trigger pause */}
        <button onClick={() => { setOutcome(null); setPhase("your_why"); }} className="w-full py-3.5 rounded-full border text-sm font-medium tracking-wide transition-all" style={{ borderColor: "rgba(232,93,58,0.2)", color: "#E85D3A" }}>
          Simulate a Pause
        </button>
      </div>
    </div>
  );

  // ===== YOUR WHY (direct, no cooldown) =====
  if (phase === "your_why") return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <Navbar />
      <div className="max-w-sm text-center animate-in">
        <div className="mb-6 flex justify-center">
          <Avatar archetypeColor={avatarColor} state="concerned" size="md" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted/40 mb-4">You said this mattered</p>
        <p className="font-serif text-2xl italic leading-relaxed mb-6">&ldquo;{personalWhy}&rdquo;</p>
        <p className="text-sm mb-10" style={{ color: archetype?.color }}>Pattern detected &middot; This is a recurring moment.</p>
        <div className="space-y-2.5 w-full">
          <button onClick={handleResist} className="w-full py-3 rounded-full text-sm font-medium transition-all" style={{ background: "rgba(107,232,160,0.08)", color: "#6BE8A0" }}>I&apos;ll resist</button>
          <button onClick={handleModify} className="w-full py-3 rounded-full border text-sm font-medium transition-all" style={{ borderColor: "rgba(232,168,58,0.15)", color: "rgba(232,168,58,0.7)" }}>Modify choice</button>
          <button onClick={handleOverride} className="w-full py-3 rounded-full text-sm text-muted/30 hover:text-muted/60 transition-colors">Override</button>
        </div>
      </div>
    </div>
  );

  // ===== WITNESS =====
  if (phase === "witness") return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <Navbar />
      <div className="max-w-sm text-center animate-in">
        <div className="w-4 h-4 rounded-full border border-white/10 mx-auto mb-10 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        </div>
        <p className="font-serif text-xl italic text-muted/60 mb-10">Noted. No judgment. Just witnessing.</p>
        <div className="space-y-2.5 w-full">
          <button onClick={handleResist} className="w-full py-3 rounded-full text-sm font-medium" style={{ background: "rgba(107,232,160,0.08)", color: "#6BE8A0" }}>Actually, I&apos;ll resist</button>
          <button onClick={() => { setOutcome("overrode"); setTotalPauses((t) => t + 1); setOverrideCount((c) => c + 1); setPhase("result"); }} className="w-full py-3 rounded-full text-sm text-muted/20 hover:text-muted/40 transition-colors">Continue anyway</button>
        </div>
      </div>
    </div>
  );

  // ===== RESULT =====
  if (phase === "result") return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <Navbar />
      <div className="max-w-sm text-center animate-in">
        {outcome === "resisted" && (
          <>
            <div className="mb-6 flex justify-center"><Avatar archetypeColor={avatarColor} state="glowing" size="lg" /></div>
            <h2 className="font-serif text-2xl italic mb-2">You resisted.</h2>
            <p className="text-sm text-muted mb-2">+15 points</p>
          </>
        )}
        {outcome === "modified" && (
          <>
            <div className="mb-6 flex justify-center"><Avatar archetypeColor={avatarColor} state="celebrating" size="lg" /></div>
            <h2 className="font-serif text-2xl italic mb-2">Modified. That counts.</h2>
            <p className="text-sm text-muted mb-2">+10 points</p>
          </>
        )}
        {outcome === "overrode" && (
          <>
            <h2 className="font-serif text-2xl italic mb-2">Noted.</h2>
            <p className="text-sm text-muted/40 mb-2">No judgment. Every response helps.</p>
          </>
        )}
        <button onClick={() => setPhase("dashboard")} className="mt-8 px-8 py-3 rounded-full text-sm font-medium tracking-wide hover:opacity-90 transition-all" style={{ background: "#E85D3A", color: "#0A0A0F" }}>
          Dashboard
        </button>
      </div>
    </div>
  );

  return null;
}
