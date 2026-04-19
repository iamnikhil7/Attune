"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { questions } from "@/lib/questions";
import { archetypes } from "@/lib/archetypes";
import { calculateArchetypeScores } from "@/lib/scoring";
import QuestionCard from "@/components/QuestionCard";
import PhoneHeader from "@/components/PhoneHeader";
import PillButton from "@/components/PillButton";
import MascotImage from "@/components/MascotImage";

type Responses = Record<number, string | string[] | number | null>;

function buildResponseArray(responses: Responses) {
  return questions.map((q) => ({
    questionId: q.id,
    responseType: q.type,
    responseChoice: responses[q.id] as string | string[] | number,
  }));
}

/* ─── Intro screen ──────────────────────────────────────────────── */
function IntroScreen({
  sensitivityMode,
  onToggleSensitivity,
  onStart,
}: {
  sensitivityMode: boolean;
  onToggleSensitivity: () => void;
  onStart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-md mx-auto px-5"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="mb-6"
      >
        <MascotImage
          name="harold-happy"
          alt="Harold"
          width={150}
          height={150}
          className="mx-auto object-contain"
          style={{ filter: "drop-shadow(0 18px 34px rgba(100,80,60,0.25))" }}
        />
      </motion.div>

      <h1
        className="mb-3"
        style={{
          fontFamily: '"DM Serif Display", Georgia, serif',
          fontStyle: "italic",
          color: "#2C2418",
          fontSize: "clamp(1.7rem, 5.5vw, 2.1rem)",
        }}
      >
        A few honest questions
      </h1>
      <p
        className="text-sm leading-relaxed mb-7 max-w-xs mx-auto"
        style={{ color: "var(--muted)" }}
      >
        Six quick prompts. No wrong answers — just you, being honest with
        yourself.
      </p>

      <div
        className="mb-7 p-4 rounded-2xl text-left"
        style={{
          background: "rgba(255,255,255,0.85)",
          border: "1px solid rgba(180,165,140,0.25)",
        }}
      >
        <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
          Prefer gentler phrasing for sensitive topics?
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => sensitivityMode && onToggleSensitivity()}
            className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: !sensitivityMode ? "#3D3529" : "transparent",
              color: !sensitivityMode ? "#F5F0E8" : "var(--muted)",
            }}
          >
            Standard
          </button>
          <button
            onClick={() => !sensitivityMode && onToggleSensitivity()}
            className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: sensitivityMode ? "#3D3529" : "transparent",
              color: sensitivityMode ? "#F5F0E8" : "var(--muted)",
            }}
          >
            Sensitive
          </button>
        </div>
      </div>

      <PillButton onClick={onStart}>Let&apos;s begin</PillButton>

      <p className="text-xs mt-4" style={{ color: "var(--muted-soft)" }}>
        Your answers stay private and on your device.
      </p>
    </motion.div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────── */
export default function OnboardingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "questions">("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Responses>(() =>
    Object.fromEntries(questions.map((q) => [q.id, null])),
  );
  const [sensitivityMode, setSensitivityMode] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleChange = useCallback(
    (value: string | string[] | number) => {
      setResponses((prev) => ({ ...prev, [currentQuestion.id]: value }));
    },
    [currentQuestion.id],
  );

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      return;
    }
    const responseArr = buildResponseArray(responses);
    const result = calculateArchetypeScores(responseArr);
    const archetype =
      archetypes.find((a) => a.id === result.primaryArchetypeId) ?? archetypes[0];

    try {
      localStorage.setItem(
        "harold_profile",
        JSON.stringify({
          archetype: archetype.name,
          archetypeId: archetype.id,
          completedAt: new Date().toISOString(),
          scores: result.allScores,
        }),
      );
    } catch {}

    router.push("/connect-apps");
  }, [currentIndex, responses, router]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  return (
    <div
      className="min-h-full flex flex-col"
      style={{ background: "var(--gradient-page)" }}
    >
      <PhoneHeader
        right={
          phase === "questions" ? (
            <div className="flex items-center gap-3">
              {currentIndex > 0 && (
                <button
                  onClick={handleBack}
                  className="text-xs"
                  style={{ color: "var(--muted-soft)" }}
                >
                  Back
                </button>
              )}
              <button
                onClick={() => setSensitivityMode((m) => !m)}
                className="text-[10px]"
                style={{ color: "var(--muted-soft)" }}
              >
                {sensitivityMode ? "Sensitive" : "Standard"}
              </button>
            </div>
          ) : undefined
        }
      />

      <div className="flex-1 flex items-start justify-center pt-1 pb-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div key="intro" className="w-full">
              <IntroScreen
                sensitivityMode={sensitivityMode}
                onToggleSensitivity={() => setSensitivityMode((m) => !m)}
                onStart={() => setPhase("questions")}
              />
            </motion.div>
          )}

          {phase === "questions" && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="w-full"
            >
              <QuestionCard
                question={currentQuestion}
                sensitivityMode={sensitivityMode}
                value={responses[currentQuestion.id] ?? null}
                onChange={handleChange}
                onNext={handleNext}
                onBack={handleBack}
                isFirst={currentIndex === 0}
                isLast={currentIndex === questions.length - 1}
                currentIndex={currentIndex}
                totalQuestions={questions.length}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
