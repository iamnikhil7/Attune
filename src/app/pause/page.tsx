"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";

type PauseLayer = "cooldown" | "your_why" | "witness" | "response" | "result";

export default function PausePage() {
  const router = useRouter();
  const [layer, setLayer] = useState<PauseLayer>("cooldown");
  const [countdown, setCountdown] = useState(45);
  const [personalWhy, setPersonalWhy] = useState("");
  const [triggerContext, setTriggerContext] = useState("");
  const [showWitness, setShowWitness] = useState(false);
  const [outcome, setOutcome] = useState<"resisted" | "overrode" | "modified" | null>(null);
  const [overrideReason, setOverrideReason] = useState("");
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [archetypeColor, setArchetypeColor] = useState("teal");

  useEffect(() => {
    // Load archetype color
    const archetypes = ["", "amber", "green", "rose", "yellow", "indigo", "pink", "orange", "gray", "slate", "teal"];
    const id = parseInt(localStorage.getItem("pause_archetype_id") || "10");
    setArchetypeColor(archetypes[id] || "teal");
    const why = localStorage.getItem("pause_why") || "I want to feel like myself again.";
    setPersonalWhy(why);

    // Simulate trigger context based on time of day
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 5) {
      setTriggerContext("It's late. You've opened this app 3 times this week after 10pm.");
    } else if (hour >= 17 && hour < 22) {
      setTriggerContext("You've been scrolling for 28 minutes. This is usually when the pattern starts.");
    } else {
      setTriggerContext("This is the third time this week. The pattern is forming.");
    }

    // Check if witness should show (simulated repeat override)
    const overrideCount = parseInt(localStorage.getItem("pause_override_count") || "0");
    setShowWitness(overrideCount >= 2);
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (layer !== "cooldown") return;
    if (countdown <= 0) {
      setLayer("your_why");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [layer, countdown]);

  const handleResisted = () => {
    setOutcome("resisted");
    setLayer("result");
    // Track resistance
    const count = parseInt(localStorage.getItem("pause_resist_count") || "0");
    localStorage.setItem("pause_resist_count", String(count + 1));
    localStorage.setItem("pause_override_count", "0"); // Reset override streak
  };

  const handleOverrode = () => {
    setOutcome("overrode");
    setLayer("result");
    // Track override
    const count = parseInt(localStorage.getItem("pause_override_count") || "0");
    localStorage.setItem("pause_override_count", String(count + 1));
  };

  const handleModified = () => {
    setOutcome("modified");
    setLayer("result");
    const count = parseInt(localStorage.getItem("pause_resist_count") || "0");
    localStorage.setItem("pause_resist_count", String(count + 1));
  };

  // ===== LAYER 1: COOLDOWN =====
  if (layer === "cooldown") {
    const progress = ((45 - countdown) / 45) * 100;
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Breathing circle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-72 h-72 rounded-full border border-accent/10"
            style={{
              animation: "pulse 4s ease-in-out infinite",
              transform: `scale(${0.8 + (progress / 100) * 0.4})`,
              opacity: 0.15 + (progress / 100) * 0.15,
            }}
          />
        </div>

        <div className="relative z-10 text-center max-w-xs">
          <div className="mb-6">
            <Avatar archetypeColor={archetypeColor} state="concerned" size="md" />
          </div>
          <p className="text-xs text-muted uppercase tracking-wider mb-8">Layer 01 — Cooldown</p>

          {/* Timer */}
          <div className="relative w-28 h-28 mx-auto mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
              <circle
                cx="60" cy="60" r="54" fill="none"
                stroke="var(--accent)" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 54}
                strokeDashoffset={2 * Math.PI * 54 * (1 - progress / 100)}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold tabular-nums">{countdown}</span>
            </div>
          </div>

          <p className="text-sm text-muted leading-relaxed">
            Take a breath. This moment is yours.
          </p>

          <p className="text-xs text-muted/30 mt-8">You cannot skip this.</p>
        </div>
      </div>
    );
  }

  // ===== LAYER 2: YOUR WHY =====
  if (layer === "your_why") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="text-xs text-muted uppercase tracking-wider mb-6">Layer 02 — Your Why</p>

          {/* Context */}
          <p className="text-sm text-accent mb-8">{triggerContext}</p>

          {/* The user's own words */}
          <div className="p-6 rounded-xl bg-surface border border-white/5 mb-8">
            <p className="text-xl leading-relaxed italic">
              &ldquo;{personalWhy}&rdquo;
            </p>
            <p className="text-xs text-muted mt-3">— You wrote this</p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleResisted}
              className="w-full py-3 rounded-lg bg-emerald-600/80 text-white text-sm font-medium hover:bg-emerald-600 transition-all"
            >
              I&apos;m going to resist
            </button>
            <button
              onClick={handleModified}
              className="w-full py-3 rounded-lg bg-amber-600/60 text-white text-sm font-medium hover:bg-amber-600/80 transition-all"
            >
              I&apos;ll modify what I was going to do
            </button>
            <button
              onClick={() => {
                if (showWitness) {
                  setLayer("witness");
                } else {
                  handleOverrode();
                }
              }}
              className="w-full py-3 rounded-lg border border-white/10 text-sm text-muted hover:text-foreground transition-all"
            >
              I&apos;m going to proceed anyway
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== LAYER 3: WITNESS NUDGE (only for repeat overrides) =====
  if (layer === "witness") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <p className="text-xs text-muted uppercase tracking-wider mb-10">Layer 03 — Witness</p>

          <div className="mb-10">
            <p className="text-lg text-muted leading-relaxed">
              This is the same pattern.
            </p>
            <p className="text-lg text-muted/60 leading-relaxed mt-2">
              We&apos;re not judging. Just noticing.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleResisted}
              className="w-full py-3 rounded-lg bg-emerald-600/80 text-white text-sm font-medium hover:bg-emerald-600 transition-all"
            >
              Actually, I&apos;ll resist
            </button>
            <button
              onClick={handleOverrode}
              className="w-full py-3 rounded-lg border border-white/10 text-sm text-muted hover:text-foreground transition-all"
            >
              I understand. Proceeding.
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== RESULT =====
  if (layer === "result") {
    const resistCount = parseInt(localStorage.getItem("pause_resist_count") || "0");

    if (outcome === "resisted") {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
          <div className="max-w-sm text-center">
            <div className="mb-6">
              <Avatar archetypeColor={archetypeColor} state="glowing" size="lg" />
            </div>

            <h2 className="text-xl font-bold mb-2">You resisted.</h2>
            <p className="text-sm text-muted mb-6">
              That&apos;s {resistCount} time{resistCount !== 1 ? "s" : ""} you&apos;ve chosen the person you want to be.
            </p>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 rounded-lg bg-accent text-background text-sm font-medium hover:bg-accent-soft transition-all"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      );
    }

    if (outcome === "modified") {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
          <div className="max-w-sm text-center">
            <div className="mb-6">
              <Avatar archetypeColor={archetypeColor} state="celebrating" size="lg" />
            </div>

            <h2 className="text-xl font-bold mb-2">Modified. That counts.</h2>
            <p className="text-sm text-muted mb-6">
              Choosing differently — even a small change — is still choosing.
            </p>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 rounded-lg bg-accent text-background text-sm font-medium hover:bg-accent-soft transition-all"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      );
    }

    // Overrode — completely neutral
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <h2 className="text-xl font-bold mb-2">Noted.</h2>
          <p className="text-sm text-muted mb-6">
            No judgment. Every response helps PAUSE learn.
          </p>

          {!showReasonInput ? (
            <button
              onClick={() => setShowReasonInput(true)}
              className="text-xs text-muted/50 hover:text-muted transition-colors mb-6 block mx-auto"
            >
              Want to note why? (totally optional)
            </button>
          ) : (
            <div className="mb-6">
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="What happened..."
                rows={2}
                className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-accent/30 resize-none mb-2"
              />
              <button
                onClick={() => {
                  if (overrideReason.trim()) {
                    localStorage.setItem("pause_last_override_reason", overrideReason.trim());
                  }
                  setShowReasonInput(false);
                }}
                className="text-xs text-accent hover:text-accent-soft transition-colors"
              >
                Save
              </button>
            </div>
          )}

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-3 rounded-lg bg-surface border border-white/10 text-sm font-medium text-foreground hover:bg-surface-light transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return null;
}
