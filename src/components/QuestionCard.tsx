"use client";
import { useState, useEffect } from "react";
import type { Question } from "@/lib/questions";

interface Props {
  question: Question;
  sensitivityMode: boolean;
  value: string | string[] | number | null;
  onChange: (value: string | string[] | number) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  currentIndex: number;
  totalQuestions: number;
}

const encouragements = [
  "Good. Keep going.",
  "That's helpful.",
  "Noted.",
  "This matters more than you think.",
  "You're doing well.",
  "That says a lot.",
  "Interesting.",
  "We're getting somewhere.",
  "This is the hard part. You're doing it.",
  "Nobody asks these questions. That's the point.",
  "You're being honest. That's rare.",
  "We hear you.",
  "Almost there.",
  "One more step.",
];

export default function QuestionCard({ question, sensitivityMode, value, onChange, onNext, onBack, isFirst, isLast, currentIndex, totalQuestions }: Props) {
  const [animating, setAnimating] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [encouragement, setEncouragement] = useState("");
  const questionText = sensitivityMode ? question.sensitiveText : question.text;
  const isPart2Start = question.id === 8;
  const isGrid = question.cardLayout === "grid";

  useEffect(() => {
    setAnimating(true);
    setShowEncouragement(false);
    const timer = setTimeout(() => setAnimating(false), 50);
    return () => clearTimeout(timer);
  }, [question.id]);

  const isValid = () => {
    if (question.type === "multi_select") return Array.isArray(value) && value.length > 0;
    if (question.type === "slider") return true;
    return value !== null && value !== undefined;
  };

  const handleAutoAdvance = (val: string) => {
    onChange(val);
    setTimeout(() => {
      setEncouragement(encouragements[currentIndex % encouragements.length]);
      setShowEncouragement(true);
      setTimeout(() => {
        setShowEncouragement(false);
        onNext();
      }, 600);
    }, 250);
  };

  const handleNext = () => {
    setEncouragement(encouragements[currentIndex % encouragements.length]);
    setShowEncouragement(true);
    setTimeout(() => {
      setShowEncouragement(false);
      onNext();
    }, 600);
  };

  // Encouragement flash
  if (showEncouragement) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 flex items-center justify-center min-h-[400px]">
        <p className="text-muted text-sm animate-in">{encouragement}</p>
      </div>
    );
  }

  // Part 2 transition
  if (isPart2Start && value === null) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 text-center animate-in">
        <div className="w-px h-10 bg-white/10 mx-auto mb-8" />
        <p className="text-xs text-accent uppercase tracking-wider mb-4">Part 2 of 2</p>
        <h2 className="text-2xl font-bold mb-3">Who are you now?</h2>
        <p className="text-sm text-muted leading-relaxed mb-8 max-w-sm mx-auto">
          You&apos;ve told us about before. Now let&apos;s look at where you are — no judgment.
        </p>
        <button onClick={() => onChange(50)} className="px-6 py-2.5 rounded-lg bg-accent text-background text-sm font-medium hover:bg-accent-soft transition-all">
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-3xl mx-auto px-4 transition-all duration-300 ${animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
      {/* Progress dots */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted/30">{currentIndex + 1} of {totalQuestions}</span>
          <span className="text-xs text-muted/30">{question.part === 1 ? "Who were you?" : "Who are you now?"}</span>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div key={i} className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${i < currentIndex ? "bg-accent" : i === currentIndex ? "bg-accent/50" : "bg-white/5"}`} />
          ))}
        </div>
      </div>

      {/* Question */}
      <h2 className="text-xl sm:text-2xl font-bold leading-snug mb-2">{questionText}</h2>
      {question.hint && <p className="text-sm text-muted/50 italic mb-6">{question.hint}</p>}
      {!question.hint && <div className="mb-6" />}

      {/* SINGLE CHOICE — CARD GRID */}
      {question.type === "single_choice" && question.options && isGrid && (
        <div className={`grid gap-2.5 mb-6 ${
          question.options.length <= 4 ? "grid-cols-2" :
          question.options.length <= 6 ? "grid-cols-2 sm:grid-cols-3" :
          "grid-cols-2 sm:grid-cols-4"
        }`}>
          {question.options.map((option) => {
            const selected = value === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleAutoAdvance(option.value)}
                className={`text-left p-4 rounded-xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  selected
                    ? "bg-accent/10 border-accent/30"
                    : "bg-surface border-white/5 hover:border-white/10"
                }`}
              >
                <span className="text-2xl block mb-2">{option.emoji}</span>
                <p className="text-sm font-medium leading-tight">{option.label}</p>
                {option.subtitle && (
                  <p className="text-xs text-muted/50 mt-1 leading-snug">{option.subtitle}</p>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* SINGLE CHOICE — LIST (fallback) */}
      {question.type === "single_choice" && question.options && !isGrid && (
        <div className="space-y-2 mb-6">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAutoAdvance(option.value)}
              className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all flex items-center gap-3 ${
                value === option.value
                  ? "bg-accent/10 border-accent/30 text-foreground"
                  : "bg-surface border-white/5 text-muted hover:border-white/10 hover:text-foreground"
              }`}
            >
              <span className="text-lg">{option.emoji}</span>
              <div>
                <span className="font-medium">{option.label}</span>
                {option.subtitle && <span className="text-muted/50 ml-1.5">{option.subtitle}</span>}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* MULTI SELECT — cards */}
      {question.type === "multi_select" && question.options && (
        <div className="space-y-2 mb-6">
          {question.options.map((option) => {
            const selected = Array.isArray(value) && value.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => {
                  const current = Array.isArray(value) ? value : [];
                  onChange(selected ? current.filter((v) => v !== option.value) : [...current, option.value]);
                }}
                className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all flex items-center gap-3 ${
                  selected
                    ? "bg-accent/10 border-accent/30 text-foreground"
                    : "bg-surface border-white/5 text-muted hover:border-white/10 hover:text-foreground"
                }`}
              >
                <span className="text-lg">{option.emoji}</span>
                <span className="flex-1 font-medium">{option.label}</span>
                <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-[10px] transition-all ${
                  selected ? "bg-accent border-accent text-background scale-110" : "border-white/15"
                }`}>
                  {selected ? "\u2713" : ""}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* SLIDER */}
      {question.type === "slider" && (
        <div className="pt-6 mb-6">
          <div className="relative mb-8">
            <input
              type="range"
              min={question.sliderMin}
              max={question.sliderMax}
              value={typeof value === "number" ? value : 50}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full h-1.5 bg-surface-light rounded-full appearance-none cursor-pointer accent-accent"
            />
            <div
              className="absolute -top-10 transform -translate-x-1/2 text-accent font-bold text-3xl tabular-nums transition-all"
              style={{ left: `${typeof value === "number" ? value : 50}%` }}
            >
              {typeof value === "number" ? value : 50}
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted/30">
            <span>{question.sliderMinLabel}</span>
            <span>{question.sliderMaxLabel}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        {!isFirst && (
          <button onClick={onBack} className="px-4 py-2.5 rounded-lg text-sm text-muted/30 hover:text-muted transition-colors">
            Back
          </button>
        )}
        {/* Continue for multi-select and slider only */}
        {(question.type === "multi_select" || question.type === "slider") && (
          <button
            onClick={handleNext}
            disabled={!isValid()}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isValid()
                ? "bg-accent text-background hover:bg-accent-soft"
                : "bg-surface-light text-muted/15 cursor-not-allowed"
            }`}
          >
            {isLast ? "See my results" : "Continue"}
          </button>
        )}
      </div>
    </div>
  );
}
