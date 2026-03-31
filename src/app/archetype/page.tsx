"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { archetypes } from "@/lib/archetypes";
import type { Archetype } from "@/lib/archetypes";

const colorMap: Record<string, { bg: string; border: string; text: string; ring: string }> = {
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", ring: "stroke-amber-400" },
  green: { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400", ring: "stroke-green-400" },
  rose: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400", ring: "stroke-rose-400" },
  yellow: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400", ring: "stroke-yellow-400" },
  indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-400", ring: "stroke-indigo-400" },
  pink: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400", ring: "stroke-pink-400" },
  orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", ring: "stroke-orange-400" },
  gray: { bg: "bg-gray-500/10", border: "border-gray-500/30", text: "text-gray-400", ring: "stroke-gray-400" },
  slate: { bg: "bg-slate-500/10", border: "border-slate-500/30", text: "text-slate-400", ring: "stroke-slate-400" },
  teal: { bg: "bg-teal-500/10", border: "border-teal-500/30", text: "text-teal-400", ring: "stroke-teal-400" },
};

function WellnessRing({ percentage, color }: { percentage: number; color: string }) {
  const r = 54, c = 2 * Math.PI * r, offset = c - (percentage / 100) * c;
  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <circle cx="60" cy="60" r={r} fill="none" className={colorMap[color]?.ring || "stroke-accent"} strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 1.5s ease-out" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{percentage}%</span>
        <span className="text-xs text-muted">baseline</span>
      </div>
    </div>
  );
}

export default function ArchetypePage() {
  const router = useRouter();
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [goals, setGoals] = useState<string[]>([]);
  const [personalWhy, setPersonalWhy] = useState("");
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/onboarding"); return; }
      const { data: a } = await supabase.from("user_archetypes").select("archetype_id").eq("user_id", user.id).single();
      if (a) { const found = archetypes.find((x) => x.id === a.archetype_id); if (found) setArchetype(found); }
      const { data: g } = await supabase.from("user_goals").select("goal_text").eq("user_id", user.id).eq("is_active", true);
      if (g) setGoals(g.map((x) => x.goal_text));
      const { data: u } = await supabase.from("users").select("personal_why").eq("id", user.id).single();
      if (u?.personal_why) setPersonalWhy(u.personal_why);
      setTimeout(() => setRevealed(true), 300);
    }
    load();
  }, [router]);

  if (!archetype) return (<div className="min-h-screen flex flex-col items-center justify-center bg-background"><div className="w-12 h-12 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-4" /><p className="text-muted">Loading your archetype...</p></div>);
  const colors = colorMap[archetype.color] || colorMap.teal;

  return (
    <div className="min-h-screen bg-background py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className={`text-center transition-all duration-1000 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="text-6xl mb-6">{archetype.icon}</div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">{archetype.name}</h1>
          <p className="text-xl text-muted max-w-md mx-auto leading-relaxed mb-10">{archetype.description}</p>
          <div className="flex justify-center mb-10"><WellnessRing percentage={revealed ? archetype.wellnessBaseline : 0} color={archetype.color} /></div>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {archetype.keyTraits.map((trait) => (<span key={trait} className={`px-3 py-1.5 rounded-full text-sm ${colors.bg} ${colors.border} border ${colors.text}`}>{trait}</span>))}
          </div>
          {goals.length > 0 && (<div className="text-left mb-12"><h3 className="text-lg font-semibold mb-4">Your Goals</h3><div className="space-y-3">{goals.map((goal, i) => (<div key={i} className={`p-4 rounded-xl ${colors.bg} border ${colors.border}`}><p className="text-sm leading-relaxed">{goal}</p></div>))}</div></div>)}
          {personalWhy && (<div className="text-left mb-12"><h3 className="text-lg font-semibold mb-4">Your Why</h3><div className="p-6 rounded-xl bg-accent/5 border border-accent/20"><p className="text-lg italic leading-relaxed">&ldquo;{personalWhy}&rdquo;</p></div></div>)}
          <button onClick={() => router.push("/priorities")} className="w-full py-4 rounded-full bg-accent text-white font-semibold text-lg hover:bg-accent-soft transition-all">Set Your Priorities</button>
        </div>
      </div>
    </div>
  );
}
