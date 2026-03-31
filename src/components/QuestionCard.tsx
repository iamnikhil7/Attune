"use client";
import { useState, useEffect, useRef } from "react";
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
  "Almost there.",
  "You're doing well.",
  "That says a lot.",
  "Interesting.",
  "We're getting somewhere.",
  "One more step closer.",
  "This is the hard part. You're doing it.",
  "Nobody asks these questions. That's the point.",
  "You're being honest. That's rare.",
  "We hear you.",
];

export default function QuestionCard({ question, sensitivityMode, value, onChange, onNext, onBack, isFirst, isLast, currentIndex, totalQuestions }: Props) {
  const [textValue, setTextValue] = useState("");
  const [animating, setAnimating] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [encouragement, setEncouragement] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const questionText = sensitivityMode ? question.sensitiveText : question.text;
  const isPart2Start = question.id === 8;

  // Reset on question change
  useEffect(() => {
    if (question.type === "open_text") {
      setTextValue(typeof value === "string" ? value : "");
    }
    setAnimating(true);
    setShowEncouragement(false);
    const timer = setTimeout(() => setAnimating(false), 50);
    return () => clearTimeout(timer);
  }, [question.id, question.type, value]);

  // Auto-focus textarea
  useEffect(() => {
    if (question.type === "open_text" && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [question.id, question.type]);

  const isValid = () => {
    if (question.type === "open_text") return textValue.trim().length >= 10;
    if (question.type === "multi_select") return Array.isArray(value) && value.length > 0;
    if (question.type === "slider") return true;
    return value !== null && value !== undefined;
  };

  const handleNext = () => {
    // Show encouragement briefly before transitioning
    setEncouragement(encouragements[currentIndex % encouragements.length]);
    setShowEncouragement(true);
    setTimeout(() => {
      setShowEncouragement(false);
      onNext();
    }, 800);
  };

  // Auto-advance for single choice after selection
  const handleSingleChoice = (val: string) => {
    onChange(val);
    // Small delay then auto-advance
    setTimeout(() => {
      setEncouragement(encouragements[currentIndex % encouragements.length]);
      setShowEncouragement(true);
      setTimeout(() => {
        setShowEncouragement(false);
        onNext();
      }, 700);
    }, 300);
  };

  // Encouragement overlay
  if (showEncouragement) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 flex items-center justify-center min-h-[400px]">
        <p className="text-muted text-sm animate-in">{encouragement}</p>
      </div>
    );
  }

  // Part 2 transition
  if (isPart2Start && !value && currentIndex > 0) {
    return (
      <div className="w-full max-w-xl mx-auto px-4">
        <div className="text-center py-12 animate-in">
          <div className="w-px h-12 bg-white/10 mx-auto mb-8" />
          <p className="text-xs text-accent uppercase tracking-wider mb-4">Part 2 of 2</p>
          <h2 className="text-2xl font-bold mb-3">Who are you now?</h2>
          <p className="text-sm text-muted leading-relaxed mb-8 max-w-sm mx-auto">
            You&apos;ve told us who you were. Now let&apos;s look at where you are — without judgment.
          </p>
          <button
            onClick={() => {
              // Set a default slider value so this screen doesn't re-show
              onChange(50);
            }}
            className="px-6 py-2.5 rounded-lg bg-accent text-background text-sm font-medium hover:bg-accent-soft transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-2xl mx-auto px-4 transition-all duration-300 ${animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
      {/* Progress — minimal dots + number */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted/40">{currentIndex + 1}/{totalQuestions}</span>
          <span className="text-xs text-muted/40">
            {question.part === 1 ? "Who were you?" : "Who are you now?"}
          </span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
                i < currentIndex ? "bg-accent" : i === currentIndex ? "bg-accent/60" : "bg-white/5"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <h2 className="text-xl sm:text-2xl font-semibold leading-snug mb-8">{questionText}</h2>

      {/* Input area */}
      <div className="mb-8">
        {/* OPEN TEXT */}
        {question.type === "open_text" && (
          <div>
            <textarea
              ref={textareaRef}
              key={question.id}
              value={textValue}
              onChange={(e) => { setTextValue(e.target.value); onChange(e.target.value); }}
              placeholder={question.placeholder}
              rows={3}
              className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-foreground text-lg placeholder:text-muted/20 focus:outline-none focus:border-accent/40 resize-none transition-colors"
              style={{ lineHeight: "1.6" }}
            />
            <div className="flex justify-between mt-2">
              <p className="text-xs text-muted/30">
                {textValue.trim().length < 10 && textValue.length > 0
                  ? `${10 - textValue.trim().length} more`
                  : ""}
              </p>
              <p className="text-xs text-muted/20">{textValue.length > 0 ? `${textValue.length}` : ""}</p>
            </div>
          </div>
        )}

        {/* SINGLE CHOICE — cards that auto-advance */}
        {question.type === "single_choice" && question.options && (
          <div className="space-y-2">
            {question.options.map((option, i) => (
              <button
                key={option.value}
                onClick={() => handleSingleChoice(option.value)}
                className={`w-full text-left px-4 py-3.5 rounded-lg border text-sm transition-all group ${
                  value === option.value
                    ? "bg-accent/10 border-accent/30 text-foreground"
                    : "border-white/5 text-muted hover:border-white/10 hover:text-foreground"
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className={`inline-block w-5 text-xs ${value === option.value ? "text-accent" : "text-muted/30"}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                {option.label}
              </button>
            ))}
          </div>
        )}

        {/* MULTI SELECT */}
        {question.type === "multi_select" && question.options && (
          <div className="space-y-2">
            {question.options.map((option) => {
              const selected = Array.isArray(value) && value.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    const current = Array.isArray(value) ? value : [];
                    onChange(selected ? current.filter((v) => v !== option.value) : [...current, option.value]);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all flex items-center gap-3 ${
                    selected
                      ? "bg-accent/10 border-accent/30 text-foreground"
                      : "border-white/5 text-muted hover:border-white/10 hover:text-foreground"
                  }`}
                >
                  <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center text-[10px] transition-all ${
                    selected ? "bg-accent border-accent text-background scale-110" : "border-white/15"
                  }`}>
                    {selected ? "\u2713" : ""}
                  </span>
                  {option.label}
                </button>
              );
            })}
            <p className="text-xs text-muted/30 mt-1">Select all that resonate</p>
          </div>
        )}

        {/* SLIDER */}
        {question.type === "slider" && (
          <div className="pt-4">
            <div className="relative mb-6">
              <input
                type="range"
                min={question.sliderMin}
                max={question.sliderMax}
                value={typeof value === "number" ? value : 50}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-1 bg-surface-light rounded-full appearance-none cursor-pointer accent-accent"
              />
              {/* Value indicator */}
              <div
                className="absolute -top-8 transform -translate-x-1/2 text-accent font-bold text-2xl tabular-nums transition-all"
                style={{ left: `${typeof value === "number" ? value : 50}%` }}
              >
                {typeof value === "number" ? value : 50}
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted/40">
              <span>{question.sliderMinLabel}</span>
              <span>{question.sliderMaxLabel}</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {!isFirst && (
          <button
            onClick={onBack}
            className="px-4 py-2.5 rounded-lg text-sm text-muted/40 hover:text-muted transition-colors"
          >
            Back
          </button>
        )}
        {/* Only show continue for non-single-choice (those auto-advance) */}
        {question.type !== "single_choice" && (
          <button
            onClick={handleNext}
            disabled={!isValid()}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isValid()
                ? "bg-accent text-background hover:bg-accent-soft"
                : "bg-surface-light text-muted/20 cursor-not-allowed"
            }`}
          >
            {isLast ? "See my results" : "Continue"}
          </button>
        )}
        {/* For single choice, show a subtle "or press Continue" only if already selected */}
        {question.type === "single_choice" && value && (
          <button
            onClick={handleNext}
            className="flex-1 py-2.5 rounded-lg text-sm text-muted/30 hover:text-muted hover:bg-surface-light transition-all"
          >
            {isLast ? "See my results" : "Continue"}
          </button>
        )}
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-[10px] text-muted/15 mt-6">
        {question.type === "open_text" ? "" : ""}
      </p>
    </div>
  );
}
