"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/lib/questions";
import { calculateArchetypeScores, generateGoalSuggestions } from "@/lib/scoring";
import QuestionCard from "@/components/QuestionCard";

type Step = "sensitivity" | "questionnaire" | "goals" | "why";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("sensitivity");
  const [sensitivityMode, setSensitivityMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, string | string[] | number>>({});
  const [suggestedGoals, setSuggestedGoals] = useState<string[]>([]);
  const [activeGoals, setActiveGoals] = useState<boolean[]>([]);
  const [personalWhy, setPersonalWhy] = useState("");
  const [loading, setLoading] = useState(false);
  // Store results in memory for now (no Supabase)
  const [archetypeResult, setArchetypeResult] = useState<{ primaryArchetypeId: number } | null>(null);

  const handleSensitivityChoice = (sensitive: boolean) => {
    setSensitivityMode(sensitive);
    setStep("questionnaire");
  };

  const handleResponse = (value: string | string[] | number) => {
    setResponses((prev) => ({ ...prev, [questions[currentQuestion].id]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((p) => p + 1);
      return;
    }

    // All questions answered
    setLoading(true);
    const formatted = Object.entries(responses).map(([qid, value]) => {
      const q = questions.find((q) => q.id === Number(qid))!;
      return {
        questionId: Number(qid),
        responseType: q.type,
        responseText: undefined,
        responseChoice: value,
      };
    });

    const result = calculateArchetypeScores(formatted);
    setArchetypeResult(result);
    const goals = generateGoalSuggestions(result.primaryArchetypeId, formatted);
    setSuggestedGoals(goals);
    setActiveGoals(goals.map(() => true));
    setLoading(false);
    setStep("goals");
  };

  const handleGoalsComplete = () => {
    setStep("why");
  };

  const handleWhyComplete = () => {
    // Store in localStorage for the archetype page to read
    localStorage.setItem("pause_archetype_id", String(archetypeResult?.primaryArchetypeId || 1));
    localStorage.setItem("pause_goals", JSON.stringify(suggestedGoals.filter((_, i) => activeGoals[i])));
    localStorage.setItem("pause_why", personalWhy.trim());
    localStorage.setItem("pause_sensitivity", String(sensitivityMode));
    router.push("/archetype");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-4" />
        <p className="text-muted text-sm">Finding your archetype...</p>
      </div>
    );
  }

  if (step === "sensitivity") return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="max-w-md w-full animate-in">
        <p className="text-xs text-muted/40 mb-8">Before we begin</p>
        <p className="text-lg leading-relaxed mb-8">
          Some of what we explore touches on food, body image, and health habits.
          If any of these feel sensitive for you right now, that&apos;s completely okay.
        </p>
        <p className="text-sm text-muted mb-6">Do any of these feel difficult right now?</p>
        <div className="space-y-2">
          <button onClick={() => handleSensitivityChoice(false)} className="w-full text-left px-4 py-3.5 rounded-lg border border-white/5 text-sm hover:border-white/10 hover:text-foreground text-muted transition-colors">
            No, I&apos;m good to continue
          </button>
          <button onClick={() => handleSensitivityChoice(true)} className="w-full text-left px-4 py-3.5 rounded-lg border border-white/5 text-sm hover:border-white/10 hover:text-foreground text-muted transition-colors">
            Yes, some of these feel sensitive
          </button>
        </div>
        <p className="text-xs text-muted/20 mt-6">Either way, we&apos;ll adapt to you.</p>
      </div>
    </div>
  );

  if (step === "questionnaire") return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-background">
      <QuestionCard
        question={questions[currentQuestion]}
        sensitivityMode={sensitivityMode}
        value={responses[questions[currentQuestion].id] ?? null}
        onChange={handleResponse}
        onNext={handleNext}
        onBack={() => setCurrentQuestion((p) => p - 1)}
        isFirst={currentQuestion === 0}
        isLast={currentQuestion === questions.length - 1}
        currentIndex={currentQuestion}
        totalQuestions={questions.length}
      />
    </div>
  );

  if (step === "goals") return (
    <div className="min-h-screen flex items-center justify-center py-12 px-6 bg-background">
      <div className="max-w-2xl w-full animate-in">
        <p className="text-xs text-accent uppercase tracking-wider mb-3">Part 3</p>
        <h2 className="text-2xl font-bold mb-2">Here&apos;s what we think matters for you</h2>
        <p className="text-sm text-muted mb-8">These aren&apos;t metrics. They&apos;re identity anchors. Remove any that don&apos;t feel right.</p>
        <div className="space-y-2 mb-8">
          {suggestedGoals.map((goal, i) => (
            <div key={i} className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${activeGoals[i] ? "bg-accent/5 border-accent/15" : "bg-surface border-white/5 opacity-40"}`}>
              <button onClick={() => setActiveGoals((p) => { const n = [...p]; n[i] = !n[i]; return n; })} className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center text-xs transition-colors ${activeGoals[i] ? "bg-accent border-accent text-background" : "border-white/20"}`}>
                {activeGoals[i] ? "\u2713" : ""}
              </button>
              <p className={`text-sm leading-relaxed ${activeGoals[i] ? "text-foreground" : "text-muted"}`}>{goal}</p>
            </div>
          ))}
        </div>
        <button onClick={handleGoalsComplete} disabled={!activeGoals.some(Boolean)} className={`w-full py-3 rounded-lg text-sm font-medium transition-all ${activeGoals.some(Boolean) ? "bg-accent text-background hover:bg-accent-soft" : "bg-surface-light text-muted/40 cursor-not-allowed"}`}>
          Continue
        </button>
      </div>
    </div>
  );

  if (step === "why") return (
    <div className="min-h-screen flex items-center justify-center py-12 px-6 bg-background">
      <div className="max-w-2xl w-full animate-in">
        <p className="text-xs text-muted/40 mb-6">Last step</p>
        <h2 className="text-2xl font-bold mb-2">Now write your why.</h2>
        <p className="text-sm text-muted mb-6">
          At 11pm, when you&apos;re reaching for the thing you said you wouldn&apos;t — these words will appear. Make them count.
        </p>
        <textarea
          value={personalWhy}
          onChange={(e) => setPersonalWhy(e.target.value)}
          placeholder="I want to feel like myself again..."
          rows={4}
          className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-accent/30 resize-none transition-colors mb-2"
        />
        <p className="text-xs text-muted mb-6">
          {personalWhy.trim().length < 15 ? `${15 - personalWhy.trim().length} more characters` : "\u2713 Ready"}
        </p>
        <button onClick={handleWhyComplete} disabled={personalWhy.trim().length < 15} className={`w-full py-3 rounded-lg text-sm font-medium transition-all ${personalWhy.trim().length >= 15 ? "bg-accent text-background hover:bg-accent-soft" : "bg-surface-light text-muted/40 cursor-not-allowed"}`}>
          Reveal my archetype
        </button>
      </div>
    </div>
  );

  return null;
}
