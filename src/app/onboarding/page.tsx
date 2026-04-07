"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/* ─── Assessment Questions (matching mockup designs) ─────────────────── */

const questions = [
  {
    id: 1,
    step: "1/6",
    text: "What's the most realistic way you move today?",
    type: "image" as const,
    options: [
      { label: "Walk/ Jog/ Run", value: "walking", img: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=300&fit=crop" },
      { label: "Home workouts", value: "home_workouts", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop" },
      { label: "Sport", value: "sport", img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop" },
      { label: "Gym", value: "gym", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop" },
      { label: "Group Classes", value: "group_classes", img: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&h=300&fit=crop" },
      { label: "Not much right now", value: "none", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop" },
    ],
  },
  {
    id: 2,
    step: "2/6",
    text: "What does your morning usually look like?",
    type: "image" as const,
    options: [
      { label: "Slow & Intentional", value: "mindful", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop" },
      { label: "Coffee & Go", value: "rush", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop" },
      { label: "A few extra mins of sleep", value: "snooze", img: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop" },
      { label: "Catching up", value: "phone", img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop" },
    ],
  },
  {
    id: 3,
    step: "3/6",
    text: "What have you stopped doing that you miss?",
    type: "image" as const,
    options: [
      { label: "Regular exercise", value: "exercise", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop" },
      { label: "Creative hobbies", value: "creative", img: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop" },
      { label: "Being social/ present", value: "social", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop" },
      { label: "Reading/ Learning", value: "learning", img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop" },
    ],
  },
  {
    id: 4,
    step: "4/6",
    text: "How do you feel on an average Tuesday?",
    type: "illustration" as const,
    options: [
      { label: "Pretty good", value: "good", color: "#F5E6D0" },
      { label: "Going with the flow", value: "autopilot", color: "#F5E6D0" },
      { label: "Depends on the day", value: "variable", color: "#F5E6D0" },
      { label: "Overwhelmed", value: "overwhelmed", color: "#F5E6D0" },
    ],
  },
  {
    id: 5,
    step: "5/6",
    text: "When stressed, what do you reach for?",
    type: "image" as const,
    options: [
      { label: "Comfort Food", value: "food", img: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=300&fit=crop" },
      { label: "Social Media", value: "scrolling", img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop" },
      { label: "Isolate", value: "isolate", img: "https://images.unsplash.com/photo-1541199249251-f713e6145474?w=400&h=300&fit=crop" },
      { label: "Movement/ Exercise", value: "movement", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop" },
    ],
  },
  {
    id: 6,
    step: "6/6",
    prefix: "And lastly,",
    text: "Which patterns feel the most familiar?",
    type: "text" as const,
    multiSelect: true,
    options: [
      { label: "Staying up later than planned", value: "late_nights" },
      { label: "Too much screen time", value: "screen_time" },
      { label: "Irregular food habits", value: "irregular_eating" },
      { label: "Poor sleep", value: "poor_sleep" },
      { label: "Not going out like I used to", value: "sedentary" },
      { label: "Socially absent", value: "withdrawal" },
    ],
  },
];

const stepTransition = { initial: { opacity: 0, x: 80 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -80 } };

function getArchetype(a: string | undefined) {
  if (a === "rush" || a === "phone") return { name: "The Driven Drifter", description: "You move fast and stay busy—but sometimes that momentum carries you past the things that matter most. Harold will help you slow down just enough to notice what your body and mind are telling you." };
  if (a === "mindful") return { name: "The Mindful Aspirant", description: "You have good instincts about what you need—but life has a way of pulling you off course. Harold will help you stay connected to those instincts and build on what's already working." };
  if (a === "snooze") return { name: "The Night Owl", description: "Your energy peaks later in the day, and mornings feel like a battle. Harold will help you find a rhythm that works with your natural patterns instead of fighting against them." };
  return { name: "The Rhythm Seeker", description: "You're looking for something that feels right—a pace, a pattern, a way of living that fits. Harold will help you find it, one small shift at a time." };
}

export default function OnboardingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"welcome" | "assessment" | "health" | "anchor" | "reveal">("welcome");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [somethingElse, setSomethingElse] = useState("");
  const [healthConnection, setHealthConnection] = useState<string | null>(null);
  const [personalWhy, setPersonalWhy] = useState("");

  const q = questions[currentQ];
  const isMulti = q?.multiSelect;

  const handleSelect = (qId: number, value: string) => {
    if (isMulti) {
      setAnswers((p) => {
        const current = (p[qId] as string[]) || [];
        return { ...p, [qId]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] };
      });
    } else {
      setAnswers((p) => ({ ...p, [qId]: value }));
    }
  };

  const isSelected = (qId: number, value: string) => {
    if (isMulti) return ((answers[qId] as string[]) || []).includes(value);
    return answers[qId] === value;
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((p) => p + 1);
    } else {
      setPhase("health");
    }
  };

  const handleHealthChoice = (c: string) => {
    setHealthConnection(c);
    setPhase("anchor");
  };

  const handleFinish = () => {
    const arch = getArchetype(answers[2] as string | undefined);
    localStorage.setItem("harold_profile", JSON.stringify({
      activities: answers[1],
      assessment: answers,
      healthConnection,
      personalWhy,
      archetype: arch.name,
    }));
    setPhase("reveal");
  };

  const morningAnswer = answers[2] as string | undefined;
  const arch = getArchetype(morningAnswer);
  const baseline = morningAnswer === "mindful" ? 72 : morningAnswer === "snooze" ? 38 : (morningAnswer === "rush" || morningAnswer === "phone") ? 55 : 50;

  const canProceed = isMulti ? ((answers[q?.id] as string[]) || []).length > 0 : !!answers[q?.id];

  return (
    <div className="min-h-full relative overflow-hidden" style={{ background: "linear-gradient(180deg, #F8F3EC 0%, #F2EBE0 60%, #E8D5B8 100%)" }}>
      <AnimatePresence mode="wait">
        {/* ── WELCOME ──────────────────────────────────────────── */}
        {phase === "welcome" && (
          <motion.div key="welcome" variants={stepTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }} className="h-full flex flex-col justify-between px-5 pb-8 relative overflow-hidden" style={{ paddingTop: "env(safe-area-inset-top, 48px)" }}>
            {/* Background nature image placeholder */}
            <div className="absolute inset-0 opacity-20" style={{ background: "linear-gradient(180deg, rgba(120,160,80,0.3) 0%, rgba(180,160,100,0.2) 100%)" }} />

            <div className="relative z-10">
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Image src="/harold-mascot.png" alt="Harold" width={60} height={60} className="rounded-2xl shadow-lg mb-6" />
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-4xl leading-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: "#2A2014" }}>
                Hey there,<br />I&apos;m Harold
              </motion.h1>
            </div>

            <div className="relative z-10 space-y-4">
              <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-3xl leading-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontStyle: "italic", color: "#2A2014" }}>
                Let&apos;s get to know<br />each other!
              </motion.h2>
              <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setPhase("assessment")} className="w-full py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2" style={{ background: "#2A2014", color: "#F8F3EC" }}>
                Let&apos;s Go! <span>&rarr;</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── ASSESSMENT QUESTIONS ──────────────────────────── */}
        {phase === "assessment" && (
          <motion.div key={`q-${currentQ}`} variants={stepTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }} className="h-full flex flex-col px-5 pb-6" style={{ paddingTop: "env(safe-area-inset-top, 48px)" }}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
              <Image src="/harold-mascot.png" alt="Harold" width={32} height={32} className="rounded-xl shadow-md" />
              <span className="text-sm" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontStyle: "italic", color: "#8B7355" }}>Harold &amp; Crew</span>
            </div>

            {/* Step counter */}
            <p className="text-sm mb-2" style={{ color: "#8B7355" }}>{q.step}</p>

            {/* Question prefix */}
            {q.prefix && <p className="text-sm italic mb-1" style={{ color: "#8B7355", fontFamily: "'DM Serif Display', Georgia, serif" }}>{q.prefix}</p>}

            {/* Question text */}
            <h1 className="text-2xl sm:text-3xl leading-tight mb-6" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontStyle: "italic", color: "#2A2014" }}>
              {q.text}
            </h1>

            {/* Options */}
            <div className="flex-1 overflow-y-auto">
              {/* Image cards */}
              {q.type === "image" && (
                <div className={`grid grid-cols-2 gap-3 mb-4 ${q.options.length > 4 ? "" : ""}`}>
                  {q.options.map((opt) => (
                    <motion.button key={opt.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => handleSelect(q.id, opt.value)}
                      className={`relative rounded-2xl overflow-hidden aspect-[4/3] group transition-all ${isSelected(q.id, opt.value) ? "ring-3 ring-[#8B7355] shadow-lg" : "shadow-md"}`}>
                      <Image src={opt.img!} alt={opt.label} fill className="object-cover" sizes="50vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <span className="absolute bottom-3 left-3 right-3 text-sm font-semibold text-white leading-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{opt.label}</span>
                      {isSelected(q.id, opt.value) && <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#8B7355] flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg></div>}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Illustration cards (Tuesday question) */}
              {q.type === "illustration" && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {q.options.map((opt) => (
                    <motion.button key={opt.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => handleSelect(q.id, opt.value)}
                      className={`relative rounded-2xl overflow-hidden aspect-square flex items-end p-4 transition-all ${isSelected(q.id, opt.value) ? "ring-3 ring-[#8B7355] shadow-lg" : "shadow-md"}`}
                      style={{ background: opt.color }}>
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <div className="w-24 h-24 rounded-full" style={{ background: "#2A2014" }} />
                      </div>
                      <span className="relative text-sm font-semibold leading-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: "#2A2014" }}>{opt.label}</span>
                      {isSelected(q.id, opt.value) && <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#8B7355] flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg></div>}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Text cards (Patterns question) */}
              {q.type === "text" && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {q.options.map((opt) => (
                    <motion.button key={opt.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => handleSelect(q.id, opt.value)}
                      className={`p-5 rounded-2xl border text-left transition-all ${isSelected(q.id, opt.value) ? "border-[#8B7355] bg-[#8B7355]/10 shadow-md" : "border-[#D4C4A8] bg-white/60"}`}>
                      <span className="text-sm font-medium leading-tight" style={{ color: isSelected(q.id, opt.value) ? "#2A2014" : "#8B7355" }}>{opt.label}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Something else? */}
              <div className="mt-4 mb-4">
                <input type="text" value={somethingElse} onChange={(e) => setSomethingElse(e.target.value)} placeholder="Something else?" className="w-full px-4 py-3.5 rounded-2xl border text-sm bg-white/80 placeholder:text-[#B8A88A] focus:outline-none focus:border-[#8B7355] transition-colors" style={{ borderColor: "#D4C4A8", color: "#2A2014" }} />
              </div>
            </div>

            {/* Bottom: Harold peek (only on last question) + Next button */}
            <div className="relative mt-2">
              {currentQ === questions.length - 1 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute -top-10 left-4">
                  <Image src="/harold-mascot.png" alt="Harold" width={40} height={40} className="rounded-xl shadow-md" />
                </motion.div>
              )}
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleNext} disabled={!canProceed}
                className={`w-full py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 transition-all ${canProceed ? "shadow-lg" : "opacity-40 cursor-not-allowed"}`}
                style={{ background: canProceed ? "linear-gradient(135deg, #8B7355, #6B5540)" : "#B8A88A", color: "#F8F3EC" }}>
                Next <span>&rarr;</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── HEALTH CONNECTION ──────────────────────────────── */}
        {phase === "health" && (
          <motion.div key="health" variants={stepTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }} className="h-full flex flex-col px-5 pb-6 relative" style={{ paddingTop: "env(safe-area-inset-top, 48px)", background: "linear-gradient(180deg, #F8F3EC 0%, #F2EBE0 40%, #E8D5B8 100%)" }}>
            {/* Harold peeking from top-right */}
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-8 right-2 z-10">
              <Image src="/harold-mascot.png" alt="Harold" width={90} height={90} className="rounded-2xl shadow-lg" />
            </motion.div>

            <div className="flex-1 flex flex-col pt-2">
              <h1 className="text-3xl leading-tight mb-3 max-w-[260px]" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontStyle: "italic", color: "#2A2014" }}>
                Want Harold to observe your patterns?
              </h1>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: "#8B7355" }}>
                He can look at your health, sleep, recovery, &amp; activity data to help you understand what it means in your daily life.
              </p>

              {/* Connection list */}
              <div className="bg-white/80 rounded-3xl overflow-hidden shadow-md mb-6 flex-1">
                {[
                  { id: "apple_health", label: "Apple Health", icon: <svg width="32" height="32" viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="6" fill="#FF2D55"/><path d="M14 8C14 8 12 6 10 8C8 10 10 14 14 18C18 14 20 10 18 8C16 6 14 8 14 8Z" fill="white"/></svg> },
                  { id: "wearable", label: "Wearable", icon: <svg width="32" height="32" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="11" stroke="#1C1C2E" strokeWidth="2" fill="none"/><circle cx="14" cy="14" r="7" stroke="#1C1C2E" strokeWidth="2.5" fill="none"/></svg> },
                  { id: "health_app", label: "Health App", icon: <svg width="32" height="32" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" stroke="#2A2014" strokeWidth="1.5" fill="none"/><text x="10" y="18" fontSize="14" fill="#2A2014" fontWeight="bold" fontFamily="serif">W</text></svg> },
                  { id: "cucumber", label: "Cucumber Wellness, Inc.", sublabel: "Santa Clara, California", icon: <svg width="32" height="32" viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="6" fill="#3B82F6"/><path d="M9 14C9 11.2 11.2 9 14 9C16.8 9 19 11.2 19 14" stroke="white" strokeWidth="1.5" fill="none"/></svg> },
                  { id: "happier", label: "Happier Living", icon: <svg width="32" height="32" viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="4" fill="#1A1A1A"/><text x="5" y="20" fontSize="16" fill="white" fontWeight="bold" fontFamily="monospace">Cal.ai</text></svg> },
                ].map((item, i) => (
                  <motion.button key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.05 }}
                    onClick={() => handleHealthChoice(item.id)}
                    className="w-full flex items-center gap-4 px-5 py-5 text-left hover:bg-white/40 transition-colors border-b last:border-b-0" style={{ borderColor: "#E8D5B8" }}>
                    <div className="flex-shrink-0">{item.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: "#2A2014" }}>{item.label}</p>
                      {item.sublabel && <p className="text-xs" style={{ color: "#B8A88A" }}>{item.sublabel}</p>}
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4C4A8" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </motion.button>
                ))}
              </div>

              {/* + Add button */}
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="w-full py-4 rounded-2xl border text-sm font-semibold mb-4 transition-colors hover:bg-white/30" style={{ borderColor: "#D4C4A8", color: "#2A2014", background: "white/50" }}>
                + Add
              </motion.button>
            </div>

            {/* Bottom: Reveal button */}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setPhase("anchor")}
              className="w-full py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 shadow-lg"
              style={{ background: "linear-gradient(135deg, #8B7355, #6B5540)", color: "#F8F3EC" }}>
              Reveal Identity <span>&rarr;</span>
            </motion.button>
          </motion.div>
        )}

        {/* ── IDENTITY ANCHOR ──────────────────────────────── */}
        {phase === "anchor" && (
          <motion.div key="anchor" variants={stepTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }} className="h-full flex flex-col items-center justify-center px-5 pb-8" style={{ paddingTop: "env(safe-area-inset-top, 48px)" }}>
            <div className="max-w-xl w-full">
              <h2 className="text-2xl mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontStyle: "italic", color: "#2A2014" }}>One last thing.</h2>
              <p className="text-sm mb-8 leading-relaxed" style={{ color: "#8B7355" }}>At your lowest moments&mdash;when you&apos;re about to fall back into old patterns&mdash;what words would you want to hear from yourself?</p>
              <textarea value={personalWhy} onChange={(e) => setPersonalWhy(e.target.value)} placeholder="e.g., You used to feel strong. That person is still here." rows={4}
                className="w-full rounded-2xl border px-4 py-3 text-sm bg-white/60 placeholder:text-[#B8A88A] focus:outline-none focus:border-[#8B7355] resize-none transition-colors" style={{ borderColor: "#D4C4A8", color: "#2A2014" }} />
              <div className="flex justify-between items-center mt-2 mb-6">
                <p className="text-xs italic" style={{ color: "#B8A88A" }}>This becomes your identity anchor.</p>
                <p className="text-xs" style={{ color: personalWhy.length >= 15 ? "#8B7355" : "#B8A88A" }}>{personalWhy.length} / 15 min</p>
              </div>
              <motion.button whileHover={personalWhy.length >= 15 ? { scale: 1.02 } : {}} whileTap={personalWhy.length >= 15 ? { scale: 0.98 } : {}} onClick={handleFinish} disabled={personalWhy.length < 15}
                className={`w-full py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 transition-all ${personalWhy.length >= 15 ? "shadow-lg" : "opacity-40 cursor-not-allowed"}`}
                style={{ background: personalWhy.length >= 15 ? "linear-gradient(135deg, #8B7355, #6B5540)" : "#B8A88A", color: "#F8F3EC" }}>
                Continue <span>&rarr;</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── ARCHETYPE REVEAL ───────────────────────────────── */}
        {phase === "reveal" && (
          <motion.div key="reveal" variants={stepTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }} className="h-full flex flex-col px-5 pb-6 overflow-y-auto" style={{ paddingTop: "env(safe-area-inset-top, 48px)", background: "linear-gradient(180deg, #F8F3EC 0%, #F2EBE0 50%, #E8D5B8 100%)" }}>
            <div className="max-w-xl w-full mx-auto">
              {/* Your Archetype label */}
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-xs uppercase tracking-widest text-center mb-6" style={{ color: "#B8A88A" }}>Your Archetype</motion.p>

              {/* Archetype card */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 150 }} className="bg-white/80 rounded-3xl p-8 mb-6 shadow-lg">
                <div className="flex justify-center mb-6">
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                    {/* Archetype character - using styled div as placeholder */}
                    <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg" style={{ background: "linear-gradient(135deg, #6B7CFF, #5A6EE8)" }}>
                      👊
                    </div>
                  </motion.div>
                </div>

                <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="text-3xl text-center mb-6" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontStyle: "italic", color: "#6B7CFF" }}>
                  {arch.name}
                </motion.h1>

                {/* Insights cards */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="space-y-4 mb-6">
                  <div className="flex gap-3">
                    <div className="text-2xl flex-shrink-0">🚀</div>
                    <p className="text-sm leading-relaxed" style={{ color: "#2A2014" }}>
                      <span className="font-semibold">You move fast &amp; stay busy,</span> but sometimes that momentum carries you past the things that matter most.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl flex-shrink-0">☮️</div>
                    <p className="text-sm leading-relaxed" style={{ color: "#2A2014" }}>
                      <span className="font-semibold">Harold &amp; Crew will help you slow down</span> just enough to notice what your body &amp; mind are telling you.
                    </p>
                  </div>
                </motion.div>

                {/* Journey progression */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="flex items-center justify-between mb-6 px-2">
                  <div className="text-center flex-1">
                    <div className="text-2xl mb-2">😌</div>
                    <p className="text-xs" style={{ color: "#8B7355" }}>You&apos;re here</p>
                  </div>
                  <div className="flex-1 h-1 mx-2" style={{ background: "linear-gradient(90deg, #6B7CFF, #ccc)" }} />
                  <div className="text-center flex-1">
                    <div className="text-2xl mb-2">😊</div>
                    <p className="text-xs" style={{ color: "#8B7355" }}>What awaits</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Reflective question */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="mb-6">
                <p className="text-lg leading-relaxed text-center" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontStyle: "italic", color: "#2A2014" }}>
                  How would it feel if you were more like that best version of yourself?
                </p>
              </motion.div>

              {/* Button */}
              <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => router.push("/hub")}
                className="w-full py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 shadow-lg" style={{ background: "linear-gradient(135deg, #8B7355, #6B5540)", color: "#F8F3EC" }}>
                To Harold&apos;s Hub <span>&rarr;</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}