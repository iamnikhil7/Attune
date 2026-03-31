"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const priorities = [
  { type: "physical_health", title: "Physical Health", description: "Movement, fitness, recovery, and how your body feels day to day.", color: "text-emerald-400", activeColor: "border-emerald-400 bg-emerald-500/15", iconPath: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" },
  { type: "nutritional_health", title: "Nutritional Health", description: "What you eat, when you eat, delivery habits, and your relationship with food.", color: "text-amber-400", activeColor: "border-amber-400 bg-amber-500/15", iconPath: "M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12" },
  { type: "digital_wellness", title: "Digital Wellness", description: "Screen time, scrolling habits, phone dependency, and attention patterns.", color: "text-violet-400", activeColor: "border-violet-400 bg-violet-500/15", iconPath: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" },
];

export default function PrioritiesPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const handleContinue = async () => {
    if (selected.size === 0) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const recs = Array.from(selected).map((type) => ({ user_id: user.id, priority_type: type, is_active: true }));
      await supabase.from("user_priorities").upsert(recs, { onConflict: "user_id,priority_type" });
      await supabase.from("user_observation_status").upsert({ user_id: user.id, started_at: new Date().toISOString(), is_active: true });
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-6 bg-background">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Set Your Priorities</h1>
        <p className="text-muted text-lg mb-10">Choose the areas you want PAUSE to focus on. Select at least one.</p>
        <div className="space-y-4 mb-10">
          {priorities.map((p) => {
            const isActive = selected.has(p.type);
            return (
              <button key={p.type} onClick={() => setSelected((prev) => { const n = new Set(prev); n.has(p.type) ? n.delete(p.type) : n.add(p.type); return n; })} className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${isActive ? p.activeColor : "bg-surface border-white/5 hover:border-white/15"}`}>
                <div className="flex items-start gap-4">
                  <div className={`${isActive ? p.color : "text-muted"} transition-colors`}><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={p.iconPath} /></svg></div>
                  <div><h3 className="text-lg font-semibold mb-1">{p.title}</h3><p className="text-sm text-muted leading-relaxed">{p.description}</p></div>
                  <div className={`ml-auto mt-1 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${isActive ? "bg-accent border-accent text-white" : "border-white/20"}`}>{isActive && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}</div>
                </div>
              </button>
            );
          })}
        </div>
        <button onClick={handleContinue} disabled={selected.size === 0 || saving} className={`w-full py-4 rounded-full font-semibold text-lg transition-all ${selected.size > 0 ? "bg-accent text-white hover:bg-accent-soft" : "bg-surface-light text-muted/40 cursor-not-allowed"}`}>{saving ? "Saving..." : "Continue to Dashboard"}</button>
      </div>
    </div>
  );
}
