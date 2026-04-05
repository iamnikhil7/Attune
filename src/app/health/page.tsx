"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { generateWeek, type HealthDay, type SimProfile } from "@/lib/health/simulator";
import { detectPatterns, type DetectedPattern } from "@/lib/health/patterns";

export default function HealthPage() {
  const [profile, setProfile] = useState<SimProfile>("declining");
  const [days, setDays] = useState<HealthDay[]>([]);
  const [patterns, setPatterns] = useState<DetectedPattern[]>([]);
  const [manualMode, setManualMode] = useState(false);
  const [manualDay, setManualDay] = useState({ rhr: 65, sleepHours: 7, sleepQuality: 70, steps: 6000, activeMinutes: 30, screenTime: 180 });

  useEffect(() => {
    const week = generateWeek(profile);
    setDays(week);
    setPatterns(detectPatterns(week));
    // Store for Harold
    localStorage.setItem("attune_health_data", JSON.stringify(week));
    localStorage.setItem("attune_patterns", JSON.stringify(detectPatterns(week)));
  }, [profile]);

  const addManualDay = () => {
    const today = new Date().toISOString().split("T")[0];
    const newDay: HealthDay = {
      date: today,
      rhr: manualDay.rhr,
      hrv: Math.round(120 - manualDay.rhr), // rough inverse correlation
      sleepHours: manualDay.sleepHours,
      sleepQuality: manualDay.sleepQuality,
      deepSleepPct: Math.round(manualDay.sleepQuality * 0.25),
      steps: manualDay.steps,
      activeMinutes: manualDay.activeMinutes,
      screenTimeMinutes: manualDay.screenTime,
      lateBedtime: false,
      stressScore: 0,
    };
    // Recalculate stress
    const rhrS = Math.min(100, Math.max(0, (newDay.rhr - 55) / 30 * 100));
    const sleepS = Math.min(100, Math.max(0, (8 - newDay.sleepHours) / 4 * 100));
    const moveS = Math.min(100, Math.max(0, (60 - newDay.activeMinutes) / 60 * 100));
    newDay.stressScore = Math.round(rhrS * 0.3 + sleepS * 0.35 + moveS * 0.35);

    const updated = [...days.slice(1), newDay];
    setDays(updated);
    const newPatterns = detectPatterns(updated);
    setPatterns(newPatterns);
    localStorage.setItem("attune_health_data", JSON.stringify(updated));
    localStorage.setItem("attune_patterns", JSON.stringify(newPatterns));
    setManualMode(false);
  };

  const severityColor = { mild: "text-yellow-400", moderate: "text-orange-400", significant: "text-red-400" };
  const trendArrow = { up: "\u2191", down: "\u2193", flat: "\u2192" };
  const trendColor = { up: "text-red-400", down: "text-emerald-400", flat: "text-muted/40" };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-muted/40 mb-1">Health Data</p>
            <h1 className="text-2xl">Your week at a glance</h1>
          </div>
          <Link href="/harold" className="px-4 py-2 rounded-full text-xs font-medium" style={{ background: "#FF8897", color: "#0B0B0B" }}>
            Ask Harold
          </Link>
        </div>

        {/* Simulation profile selector */}
        <div className="p-4 rounded-2xl bg-surface border border-border mb-6">
          <p className="text-xs text-muted/40 mb-3">Simulate a health profile (demo)</p>
          <div className="flex flex-wrap gap-2">
            {(["healthy", "stressed", "declining", "recovering"] as SimProfile[]).map((p) => (
              <button key={p} onClick={() => setProfile(p)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${profile === p ? "bg-white text-background" : "border border-border text-muted hover:text-foreground"}`}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Detected Patterns */}
        {patterns.length > 0 && (
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.15em] text-muted/40 mb-4">Detected patterns</p>
            <div className="space-y-3">
              {patterns.map((p, i) => (
                <div key={i} className="p-5 rounded-2xl bg-surface border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-medium ${severityColor[p.severity]}`}>{p.severity}</span>
                    <span className="text-xs text-muted/20">&middot;</span>
                    <span className="text-sm font-medium">{p.title}</span>
                  </div>
                  <p className="text-sm text-muted/60 leading-relaxed mb-3">{p.caption}</p>
                  <div className="flex flex-wrap gap-3">
                    {p.dataPoints.map((dp, j) => (
                      <div key={j} className="flex items-center gap-1.5">
                        <span className="text-xs text-muted/30">{dp.label}:</span>
                        <span className="text-xs font-medium">{dp.value}</span>
                        <span className={`text-xs ${trendColor[dp.trend]}`}>{trendArrow[dp.trend]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {patterns.length === 0 && (
          <div className="p-6 rounded-2xl bg-surface border border-border mb-8 text-center">
            <p className="text-sm text-emerald-400 mb-1">All clear</p>
            <p className="text-xs text-muted/40">No concerning patterns detected this week.</p>
          </div>
        )}

        {/* Daily Data Grid */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.15em] text-muted/40 mb-4">Daily metrics</p>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 gap-2 min-w-[600px]">
              {days.map((d) => {
                const dayName = new Date(d.date).toLocaleDateString("en-US", { weekday: "short" });
                const stressColor = d.stressScore > 70 ? "border-red-500/20 bg-red-500/[0.03]" : d.stressScore > 50 ? "border-orange-500/20 bg-orange-500/[0.03]" : "border-border";
                return (
                  <div key={d.date} className={`p-3 rounded-xl bg-surface border ${stressColor} text-center`}>
                    <p className="text-[10px] text-muted/40 mb-2">{dayName}</p>
                    <p className="text-xs font-medium mb-1">{d.rhr} <span className="text-muted/30">bpm</span></p>
                    <p className="text-xs text-muted/50">{d.sleepHours}h sleep</p>
                    <p className="text-xs text-muted/50">{d.steps.toLocaleString()} steps</p>
                    <div className="mt-2 w-full h-1 bg-white/[0.03] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${d.stressScore}%`, background: d.stressScore > 70 ? "#ef4444" : d.stressScore > 50 ? "#f97316" : "#22c55e" }} />
                    </div>
                    <p className="text-[9px] text-muted/30 mt-1">stress: {d.stressScore}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Manual Entry */}
        {!manualMode ? (
          <button onClick={() => setManualMode(true)} className="w-full py-3 rounded-2xl border border-dashed border-border text-sm text-muted/40 hover:text-muted/60 hover:border-white/10 transition-all">
            + Log today&apos;s data manually
          </button>
        ) : (
          <div className="p-5 rounded-2xl bg-surface border border-border">
            <p className="text-sm font-medium mb-4">Log today&apos;s health data</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {[
                { label: "Resting HR (bpm)", key: "rhr", min: 40, max: 100 },
                { label: "Sleep (hours)", key: "sleepHours", min: 0, max: 12 },
                { label: "Sleep quality (%)", key: "sleepQuality", min: 0, max: 100 },
                { label: "Steps", key: "steps", min: 0, max: 30000 },
                { label: "Active min", key: "activeMinutes", min: 0, max: 180 },
                { label: "Screen time (min)", key: "screenTime", min: 0, max: 600 },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-[10px] text-muted/40 block mb-1">{field.label}</label>
                  <input
                    type="number"
                    min={field.min}
                    max={field.max}
                    value={manualDay[field.key as keyof typeof manualDay]}
                    onChange={(e) => setManualDay((p) => ({ ...p, [field.key]: Number(e.target.value) }))}
                    className="w-full bg-surface-light border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent/30"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={addManualDay} className="flex-1 py-2.5 rounded-full text-sm font-medium" style={{ background: "#E85D3A", color: "#0B0B0B" }}>Save</button>
              <button onClick={() => setManualMode(false)} className="px-4 py-2.5 rounded-full text-sm text-muted/40 hover:text-muted transition-colors">Cancel</button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/hub" className="text-xs text-muted/20 hover:text-muted/40 transition-colors">&larr; Back to Hub</Link>
        </div>
      </div>
    </div>
  );
}
