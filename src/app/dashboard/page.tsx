"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { archetypes } from "@/lib/archetypes";
import type { Archetype } from "@/lib/archetypes";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import type { AvatarState } from "@/components/Avatar";

export default function DashboardPage() {
  const router = useRouter();
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [goals, setGoals] = useState<string[]>([]);
  const [personalWhy, setPersonalWhy] = useState("");
  const [priorities, setPriorities] = useState<string[]>([]);
  const [connectedApps, setConnectedApps] = useState<string[]>([]);
  const [resistCount, setResistCount] = useState(0);
  const [overrideCount, setOverrideCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const archetypeId = parseInt(localStorage.getItem("pause_archetype_id") || "0");
    if (!archetypeId) { router.push("/auth"); return; }

    const found = archetypes.find((a) => a.id === archetypeId);
    if (found) setArchetype(found);
    setGoals(JSON.parse(localStorage.getItem("pause_goals") || "[]"));
    setPersonalWhy(localStorage.getItem("pause_why") || "");
    setPriorities(JSON.parse(localStorage.getItem("pause_priorities") || "[]"));
    setConnectedApps(JSON.parse(localStorage.getItem("pause_connected_apps") || "[]"));
    setResistCount(parseInt(localStorage.getItem("pause_resist_count") || "0"));
    setOverrideCount(parseInt(localStorage.getItem("pause_override_count") || "0"));
    setMounted(true);
  }, [router]);

  const pLabels: Record<string, { label: string; color: string; bg: string }> = {
    physical_health: { label: "Physical Health", color: "text-emerald-400", bg: "bg-emerald-400" },
    nutritional_health: { label: "Nutritional Health", color: "text-amber-400", bg: "bg-amber-400" },
    digital_wellness: { label: "Digital Wellness", color: "text-violet-400", bg: "bg-violet-400" },
  };

  if (!mounted || !archetype) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
    </div>
  );

  const totalPauses = resistCount + overrideCount;
  const points = resistCount * 10;
  const avatarState: AvatarState = resistCount > 3 ? "glowing" : resistCount > 0 ? "celebrating" : overrideCount > 2 ? "concerned" : "neutral";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent/15 flex items-center justify-center">
              <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
            </div>
            <span className="font-semibold text-sm">PAUSE</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/progress" className="text-xs text-muted hover:text-foreground transition-colors">Progress</Link>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <span>{archetype.icon}</span>
              <span>{archetype.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Avatar + Quick stats */}
        <div className="flex items-center gap-4 mb-6 p-5 rounded-xl bg-surface border border-white/5">
          <Avatar archetypeColor={archetype.color} state={avatarState} size="lg" />
          <div>
            <p className="text-sm font-semibold">{archetype.name}</p>
            <p className="text-xs text-muted mt-0.5">{
              avatarState === "glowing" ? "Your avatar is glowing — sustained resistance!" :
              avatarState === "celebrating" ? "Looking good — keep resisting!" :
              avatarState === "concerned" ? "Your avatar senses a pattern forming." :
              "Observing your patterns..."
            }</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-lg bg-surface border border-white/5 text-center">
            <p className="text-lg font-bold text-accent">{points}</p>
            <p className="text-[10px] text-muted">Points</p>
          </div>
          <div className="p-3 rounded-lg bg-surface border border-white/5 text-center">
            <p className="text-lg font-bold text-emerald-400">{resistCount}</p>
            <p className="text-[10px] text-muted">Resisted</p>
          </div>
          <div className="p-3 rounded-lg bg-surface border border-white/5 text-center">
            <p className="text-lg font-bold">{totalPauses}</p>
            <p className="text-[10px] text-muted">Total pauses</p>
          </div>
        </div>

        {/* Observation banner */}
        <div className="p-5 rounded-xl bg-surface border border-white/5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <h2 className="text-sm font-semibold">Observation phase</h2>
          </div>
          <p className="text-xs text-muted mb-3">PAUSE is learning your patterns. During this phase, you can trigger a demo pause to see how it works.</p>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-1.5 bg-surface-light rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: "14%" }} />
            </div>
            <span className="text-xs text-muted">Day 1 of 7</span>
          </div>
          <button
            onClick={() => router.push("/pause")}
            className="w-full py-2.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm font-medium hover:bg-accent/15 transition-all"
          >
            Try a demo pause
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Your Why */}
          {personalWhy && (
            <div className="p-5 rounded-xl bg-surface border border-white/5 md:col-span-2">
              <h3 className="text-xs text-muted uppercase tracking-wider mb-2">Your why</h3>
              <p className="text-lg italic leading-relaxed">&ldquo;{personalWhy}&rdquo;</p>
            </div>
          )}

          {/* Priorities */}
          <div className="p-5 rounded-xl bg-surface border border-white/5">
            <h3 className="text-xs text-muted uppercase tracking-wider mb-3">Priorities</h3>
            <div className="space-y-2">
              {priorities.map((p) => {
                const info = pLabels[p];
                return info ? (
                  <div key={p} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${info.bg}`} />
                    <span className={`text-sm font-medium ${info.color}`}>{info.label}</span>
                  </div>
                ) : null;
              })}
              {priorities.length === 0 && <p className="text-xs text-muted">None set</p>}
            </div>
          </div>

          {/* Goals */}
          <div className="p-5 rounded-xl bg-surface border border-white/5">
            <h3 className="text-xs text-muted uppercase tracking-wider mb-3">Goals</h3>
            <div className="space-y-1.5">
              {goals.slice(0, 4).map((g, i) => (
                <p key={i} className="text-sm text-foreground/80 leading-relaxed">{"\u2022"} {g}</p>
              ))}
              {goals.length > 4 && <p className="text-xs text-muted">+{goals.length - 4} more</p>}
              {goals.length === 0 && <p className="text-xs text-muted">No goals</p>}
            </div>
          </div>

          {/* Signal categories */}
          <div className="p-5 rounded-xl bg-surface border border-white/5 md:col-span-2">
            <h3 className="text-xs text-muted uppercase tracking-wider mb-3">Ambient sensing</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { name: "Movement", active: priorities.includes("physical_health") },
                { name: "Nutrition", active: priorities.includes("nutritional_health") },
                { name: "Screen Time", active: priorities.includes("digital_wellness") },
                { name: "Sleep", active: true },
                { name: "Spending", active: false },
                { name: "Social", active: false },
                { name: "Work Stress", active: false },
              ].map((s) => (
                <div key={s.name} className={`p-2.5 rounded-lg text-center ${s.active ? "bg-accent/5 border border-accent/10" : "bg-surface-light"}`}>
                  <p className={`text-xs font-medium ${s.active ? "text-accent" : "text-muted/40"}`}>{s.name}</p>
                  <p className="text-[10px] text-muted/40 mt-0.5">{s.active ? "Active" : "Pending"}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Connected apps */}
          <div className="p-5 rounded-xl bg-surface border border-white/5 md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs text-muted uppercase tracking-wider">Connected apps</h3>
              <Link href="/connect-apps" className="text-xs text-accent hover:text-accent-soft transition-colors">
                Manage
              </Link>
            </div>
            {connectedApps.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {connectedApps.map((app) => (
                  <span key={app} className="px-2.5 py-1 rounded-full bg-surface-light text-xs text-muted">{app}</span>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-muted mb-2">No apps connected yet.</p>
                <Link href="/connect-apps" className="text-xs text-accent hover:text-accent-soft transition-colors">
                  Connect apps
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
