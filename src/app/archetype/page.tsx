"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { archetypes } from "@/lib/archetypes";
import type { Archetype } from "@/lib/archetypes";
import Avatar from "@/components/Avatar";

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
    <div className="relative w-32 h-32">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <circle cx="60" cy="60" r={r} fill="none" className={colorMap[color]?.ring || "stroke-accent"} strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 1.5s ease-out" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{percentage}%</span>
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
    // Read from localStorage (no Supabase dependency)
    const archetypeId = parseInt(localStorage.getItem("pause_archetype_id") || "1");
    const storedGoals = JSON.parse(localStorage.getItem("pause_goals") || "[]");
    const storedWhy = localStorage.getItem("pause_why") || "";

    const found = archetypes.find((a) => a.id === archetypeId);
    if (found) setArchetype(found);
    setGoals(storedGoals);
    setPersonalWhy(storedWhy);
    setTimeout(() => setRevealed(true), 300);
  }, []);

  if (!archetype) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
    </div>
  );

  const colors = colorMap[archetype.color] || colorMap.teal;

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-xl mx-auto">
        <div className={`text-center transition-all duration-1000 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="mb-4">
            <Avatar archetypeColor={archetype.color} state={revealed ? "celebrating" : "neutral"} size="xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">{archetype.name}</h1>
          <p className="text-muted max-w-md mx-auto leading-relaxed mb-8">{archetype.description}</p>

          <div className="flex justify-center mb-8">
            <WellnessRing percentage={revealed ? archetype.wellnessBaseline : 0} color={archetype.color} />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {archetype.keyTraits.map((trait) => (
              <span key={trait} className={`px-3 py-1 rounded-full text-xs ${colors.bg} ${colors.border} border ${colors.text}`}>{trait}</span>
            ))}
          </div>

          {goals.length > 0 && (
            <div className="text-left mb-8">
              <h3 className="text-sm font-semibold mb-3">Your goals</h3>
              <div className="space-y-2">
                {goals.map((goal, i) => (
                  <div key={i} className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
                    <p className="text-sm leading-relaxed">{goal}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {personalWhy && (
            <div className="text-left mb-10">
              <h3 className="text-sm font-semibold mb-3">Your why</h3>
              <div className="p-4 rounded-lg bg-accent/5 border border-accent/15">
                <p className="text-sm italic leading-relaxed">&ldquo;{personalWhy}&rdquo;</p>
              </div>
            </div>
          )}

          <button onClick={() => router.push("/priorities")} className="w-full py-3 rounded-lg bg-accent text-background text-sm font-medium hover:bg-accent-soft transition-all">
            Set your priorities
          </button>
        </div>
      </div>
    </div>
  );
}
