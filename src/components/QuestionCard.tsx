"use client";
import { useState } from "react";
import type { Question } from "@/lib/questions";

interface Props { question: Question; sensitivityMode: boolean; value: string | string[] | number | null; onChange: (value: string | string[] | number) => void; onNext: () => void; onBack: () => void; isFirst: boolean; isLast: boolean; currentIndex: number; totalQuestions: number; }

export default function QuestionCard({ question, sensitivityMode, value, onChange, onNext, onBack, isFirst, isLast, currentIndex, totalQuestions }: Props) {
  const [textValue, setTextValue] = useState(typeof value === "string" ? value : "");
  const questionText = sensitivityMode ? question.sensitiveText : question.text;
  const isValid = () => {
    if (question.type === "open_text") return textValue.trim().length >= 10;
    if (question.type === "multi_select") return Array.isArray(value) && value.length > 0;
    return value !== null && value !== undefined;
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted mb-2">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <span>Part {question.part}: {question.part === 1 ? "Who Were You?" : "Who Are You Now?"}</span>
        </div>
        <div className="w-full h-1 bg-surface-light rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-accent to-cyan-400 rounded-full transition-all duration-500" style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }} />
        </div>
      </div>
      <h2 className="text-2xl sm:text-3xl font-semibold leading-snug mb-8">{questionText}</h2>
      <div className="mb-10">
        {question.type === "open_text" && (
          <div>
            <textarea value={textValue} onChange={(e) => { setTextValue(e.target.value); onChange(e.target.value); }} placeholder={question.placeholder} rows={4} className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 resize-none transition-colors" />
            <p className="text-xs text-muted mt-2">{textValue.trim().length < 10 ? `${10 - textValue.trim().length} more characters needed` : ""}</p>
          </div>
        )}
        {question.type === "single_choice" && question.options && (
          <div className="space-y-3">
            {question.options.map((option) => (
              <button key={option.value} onClick={() => onChange(option.value)} className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${value === option.value ? "bg-accent/10 border-accent/40 text-foreground" : "bg-surface border-white/5 text-muted hover:border-white/15 hover:text-foreground"}`}>{option.label}</button>
            ))}
          </div>
        )}
        {question.type === "multi_select" && question.options && (
          <div className="space-y-3">
            {question.options.map((option) => {
              const selected = Array.isArray(value) && value.includes(option.value);
              return (
                <button key={option.value} onClick={() => { const current = Array.isArray(value) ? value : []; onChange(selected ? current.filter((v) => v !== option.value) : [...current, option.value]); }} className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${selected ? "bg-accent/10 border-accent/40 text-foreground" : "bg-surface border-white/5 text-muted hover:border-white/15 hover:text-foreground"}`}>
                  <span className="mr-3 inline-block w-5 h-5 border rounded text-center leading-5 text-xs align-middle" style={{ borderColor: selected ? "var(--accent)" : "rgba(255,255,255,0.15)", background: selected ? "var(--accent)" : "transparent", color: selected ? "white" : "transparent" }}>{selected ? "\u2713" : ""}</span>
                  {option.label}
                </button>
              );
            })}
            <p className="text-xs text-muted mt-2">Select all that apply</p>
          </div>
        )}
        {question.type === "slider" && (
          <div className="space-y-4">
            <input type="range" min={question.sliderMin} max={question.sliderMax} value={typeof value === "number" ? value : 50} onChange={(e) => onChange(Number(e.target.value))} className="w-full h-2 bg-surface-light rounded-full appearance-none cursor-pointer accent-accent" />
            <div className="flex justify-between text-sm text-muted">
              <span>{question.sliderMinLabel}</span>
              <span className="text-accent font-semibold text-lg">{typeof value === "number" ? value : 50}</span>
              <span>{question.sliderMaxLabel}</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-4">
        {!isFirst && (<button onClick={onBack} className="px-6 py-3 rounded-full border border-white/10 text-muted hover:text-foreground hover:border-white/20 transition-colors">Back</button>)}
        <button onClick={onNext} disabled={!isValid()} className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all ${isValid() ? "bg-accent text-white hover:bg-accent-soft" : "bg-surface-light text-muted/40 cursor-not-allowed"}`}>{isLast ? "See My Results" : "Continue"}</button>
      </div>
    </div>
  );
}
