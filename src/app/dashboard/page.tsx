"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { archetypes } from "@/lib/archetypes";
import type { Archetype } from "@/lib/archetypes";

export default function DashboardPage() {
  const router = useRouter();
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [goals, setGoals] = useState<string[]>([]);
  const [personalWhy, setPersonalWhy] = useState("");
  const [priorities, setPriorities] = useState<string[]>([]);
  const [obsDay, setObsDay] = useState(1);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/onboarding"); return; }
      const [aRes, gRes, uRes, pRes, oRes] = await Promise.all([
        supabase.from("user_archetypes").select("archetype_id").eq("user_id", user.id).single(),
        supabase.from("user_goals").select("goal_text").eq("user_id", user.id).eq("is_active", true),
        supabase.from("users").select("personal_why").eq("id", user.id).single(),
        supabase.from("user_priorities").select("priority_type").eq("user_id", user.id).eq("is_active", true),
        supabase.from("user_observation_status").select("started_at").eq("user_id", user.id).eq("is_active", true).single(),
      ]);
      if (aRes.data) { const f = archetypes.find((a) => a.id === aRes.data.archetype_id); if (f) setArchetype(f); }
      if (gRes.data) setGoals(gRes.data.map((g) => g.goal_text));
      if (uRes.data?.personal_why) setPersonalWhy(uRes.data.personal_why);
      if (pRes.data) setPriorities(pRes.data.map((p) => p.priority_type));
      if (oRes.data?.started_at) { const d = Math.min(7, Math.max(1, Math.ceil((Date.now() - new Date(oRes.data.started_at).getTime()) / 86400000))); setObsDay(d); }
    }
    load();
  }, [router]);

  const pLabels: Record<string, { label: string; color: string }> = { physical_health: { label: "Physical Health", color: "text-emerald-400" }, nutritional_health: { label: "Nutritional Health", color: "text-amber-400" }, digital_wellness: { label: "Digital Wellness", color: "text-violet-400" } };

  if (!archetype) return (<div className="min-h-screen flex flex-col items-center justify-center bg-background"><div className="w-12 h-12 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-4" /><p className="text-muted">Loading dashboard...</p></div>);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center"><svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" /></svg></div>
            <span className="text-lg font-semibold">PAUSE</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted"><span className="text-xl">{archetype.icon}</span><span>{archetype.name}</span></div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-accent/10 to-cyan-500/10 border border-accent/20 mb-8">
          <div className="flex items-center gap-3 mb-3"><div className="w-3 h-3 rounded-full bg-accent animate-pulse" /><h2 className="font-semibold">PAUSE is learning your patterns</h2></div>
          <p className="text-sm text-muted mb-4">During observation, PAUSE silently monitors and builds baseline patterns. No interventions yet.</p>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-surface-light rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-accent to-cyan-400 rounded-full transition-all" style={{ width: `${(obsDay / 7) * 100}%` }} /></div>
            <span className="text-sm text-muted whitespace-nowrap">Day {obsDay} of 7</span>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {personalWhy && (<div className="p-6 rounded-2xl bg-surface border border-white/5 md:col-span-2"><h3 className="text-sm text-muted mb-3 uppercase tracking-wide">Your Why</h3><p className="text-xl italic leading-relaxed">&ldquo;{personalWhy}&rdquo;</p></div>)}
          <div className="p-6 rounded-2xl bg-surface border border-white/5"><h3 className="text-sm text-muted mb-4 uppercase tracking-wide">Active Priorities</h3><div className="space-y-3">{priorities.map((p) => { const info = pLabels[p]; return info ? (<div key={p} className="flex items-center gap-3"><div className={`w-2 h-2 rounded-full ${info.color.replace("text-", "bg-")}`} /><span className={`font-medium ${info.color}`}>{info.label}</span></div>) : null; })}</div></div>
          <div className="p-6 rounded-2xl bg-surface border border-white/5"><h3 className="text-sm text-muted mb-4 uppercase tracking-wide">Your Goals</h3><div className="space-y-2">{goals.slice(0, 4).map((g, i) => (<p key={i} className="text-sm text-foreground/80">{"\u2022"} {g}</p>))}{goals.length > 4 && <p className="text-xs text-muted">+{goals.length - 4} more</p>}</div></div>
          <div className="p-6 rounded-2xl bg-surface border border-white/5 md:col-span-2"><h3 className="text-sm text-muted mb-4 uppercase tracking-wide">Signal Categories</h3><div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{[{ name: "Movement", color: "text-emerald-400" }, { name: "Nutrition", color: "text-amber-400" }, { name: "Screen Time", color: "text-violet-400" }, { name: "Sleep", color: "text-blue-400" }, { name: "Spending", color: "text-muted" }, { name: "Social", color: "text-muted" }, { name: "Work Stress", color: "text-muted" }].map((s) => (<div key={s.name} className="p-3 rounded-xl bg-surface-light text-center"><p className={`text-sm font-medium ${s.color}`}>{s.name}</p><p className="text-xs text-muted mt-1">Collecting</p></div>))}</div></div>
        </div>
        <div className="mt-8 p-6 rounded-2xl border border-dashed border-white/10 text-center"><p className="text-muted mb-4">Connect your apps to enrich PAUSE with real data.</p><button className="px-6 py-3 rounded-full bg-surface-light border border-white/10 text-sm font-medium hover:border-accent/30 transition-colors">Connect Apps (Coming Soon)</button></div>
      </main>
    </div>
  );
}
