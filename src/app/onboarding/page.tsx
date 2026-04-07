"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/* --- Assessment Questions (matching mockup designs) ------------------- */

const questions = [
  {
    id: 1,
    step: "1/6",
    text: "What\u2019s the most realistic way you move today?",
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
  if (a === "rush" || a === "phone") return { name: "The Driven Drifter", description: "You move fast and stay busy\u2014but sometimes that momentum carries you past the things that matter most. Harold will help you slow down just enough to notice what your body and mind are telling you." };
  if (a === "mindful") return { name: "The Mindful Aspirant", description: "You have good instincts about what you need\u2014but life has a way of pulling you off course. Harold will help you stay connected to those instincts and build on what\u2019s already working." };
  if (a === "snooze") return { name: "The Night Owl", description: "Your energy peaks later in the day, and mornings feel like a battle. Harold will help you find a rhythm that works with your natural patterns instead of fighting against them." };
  return { name: "The Rhythm Seeker", description: "You\u2019re looking for something that feels right\u2014a pace, a pattern, a way of living that fits. Harold will help you find it, one small shift at a time." };
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
        {/* -- WELCOME -------------------------------------------- */}
        {phase === "welcome" && (
          <motion.div key="welcome" variants={stepTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }} className="h-full flex flex-col justify-between px-5 pb-8 relative overflow-hidden" style={{ paddingTop: "env(safe-area-inset-top, 48px)" }}>
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

        {/* -- ASSESSMENT QUESTIONS ------------------------------ */}
        {phase === "assessment" && (
          <motion.div key={`q-${currentQ}`} variants={stepTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }} className="h-full flex flex-col px-5 pb-6" style={{ paddingTop: "env(safe-area-inset-top, 48px)" }}>
            <div className="flex items-center gap-2 mb-6">
              <Image src="/harold-mascot.png" alt="Harold" width={32} height={32} className="rounded-xl shadow-md" />
              <span className="text-sm" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontStyle: "italic", color: "#8B7355" }}>Harold &amp; Crew</span>
            </div>
            <p className="text-sm mb-2" style={{ color: "#8B7355" }}>{q.step}</p>
            {q.prefix && <p className="text-sm italic mb-1" style={{ color: "#8B7355", fontFamily: "'DM Serif Display', Georgia, serif" }}>{q.prefix}</p>}
            <h1 className="text-2xl sm:text-3xl leading-tight mb-6" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontStyle: "italic", color: "#2A2014" }}>{q.text}</h1>
            <div className="flex-1 overflow-y-auto">
              {q.type === "image" && (
                <div className="grid grid-cols-2 gap-3 mb-4">
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
              {q.type === "illustration" && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {q.options.map((opt) => (
                    <motion.button key={opt.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => handleSelect(q.id, opt.value)}
                      className={`relative rounded-2xl overflow-hidden aspect-square flex items-end p-4 transition-all ${isSelected(q.id, opt.value) ? "ring-3 ring-[#8B7355] shadow-lg" : "shadow-md"}`}
                      style={{ background: opt.color }}>
                      <div className="absolute inset-0 flex items-center justify-center opacity-20"><div className="w-24 h-24 rounded-full" style={{ background: "#2A2014" }} /></div>
                      <span className="relative text-sm font-semibold leading-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: "#2A2014" }}>{opt.label}</span>
                      {isSelected(q.id, opt.value) && <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#8B7355] flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg></div>}
                    </motion.button>
                  ))}
                </div>
              )}
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
              <div className="mt-4 mb-4">
                <input type="text" value={somethingElse} onChange={(e) => setSomethingElse(e.target.value)} placeholder="Something else?" className="w-full px-4 py-3.5 rounded-2xl border text-sm bg-white/80 placeholder:text-[#B8A88A] focus:outline-none focus:border-[#8B7355] transition-colors" style={{ borderColor: "#D4C4A8", color: "#2A2014" }} />
              </div>
            </div>
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

        {/* -- HEALTH CONNECTION ---------------------------------- */}
        {phase === "health" && (
          <motion.div key="health" variants={stepTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }} className="h-full flex flex-col items-center justify-center px-6 pt-16 pb-8" style={{ background: "linear-gradient(180deg, #F8F3EC 0%, #E8D5B8 100%)" }}>
            <div className="max-w-xl w-full text-center">
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="flex justify-center mb-8">
                <Image src="/harold-mascot.png" alt="Harold" width={80} height={80} className="rounded-2xl shadow-xl" />
              </motion.div>
              <h2 className="text-2xl mb-3" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontStyle: "italic", color: "#2A2014" }}>Want Harold to observe your patterns?</h2>
              <p className="text-sm mb-8" style={{ color: "#8B7355" }}>I can look at your health data&mdash;sleep, recovery, activity&mdash;and help you understand what it means.</p>
              <div className="space-y-3 max-w-sm mx-auto mb-8">
                {[{ id: "apple_health", label: "Connect Apple Health", icon: "\u2764\uFE0F" }, { id: "wearable", label: "Connect Wearable", icon: "\u231A" }, { id: "skip", label: "Skip for now", icon: "\uD83D\uDD12" }].map((o) => (
                  <motion.button key={o.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => handleHealthChoice(o.id)}
                    className="w-full flex items-center gap-4 text-left px-5 py-4 rounded-2xl border bg-white/60 text-sm transition-all hover:bg-white/80" style={{ borderColor: "#D4C4A8", color: "#2A2014" }}>
                    <span className="text-xl">{o.icon}</span><span>{o.label}</span>
                  </motion.button>
                ))}
              </div>
              <p className="text-xs" style={{ color: "#B8A88A" }}>Your data never leaves your device.</p>
            </div>
          </motion.div>
        )}

        {/* -- IDENTITY ANCHOR ------------------------------------ */}
        {phase === "anchor" && (
          <motion.div key="anchor" variants={stepTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }} className="h-full flex flex-col items-center justify-center px-6 pt-16 pb-8">
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

        {/* -- ARCHETYPE REVEAL ----------------------------------- */}
        {phase === "reveal" && (
          <motion.div key="reveal" variants={stepTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }} className="h-full flex flex-col items-center justify-center px-6 pt-16 pb-8" style={{ background: "linear-gradient(180deg, #F8F3EC 0%, #E8D5B8 100%)" }}>
            <div className="max-w-xl w-full text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="flex justify-center mb-8">
                <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                  <Image src="/harold-mascot.png" alt="Harold" width={120} height={120} className="rounded-2xl shadow-xl" />
                </motion.div>
              </motion.div>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-sm uppercase tracking-widest mb-2" style={{ color: "#B8A88A" }}>Your archetype</motion.p>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, type: "spring", stiffness: 150 }} className="text-4xl mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: "#8B7355" }}>{arch.name}</motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-sm leading-relaxed mb-10 max-w-md mx-auto" style={{ color: "#6B5540" }}>{arch.description}</motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="mb-10 max-w-sm mx-auto">
                <p className="text-xs uppercase tracking-wider mb-3" style={{ color: "#B8A88A" }}>Your wellness baseline</p>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "#D4C4A8" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${baseline}%` }} transition={{ delay: 1, duration: 1, ease: "easeOut" }} className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #8B7355, #6B5540)" }} />
                </div>
                <p className="text-xs mt-2" style={{ color: "#B8A88A" }}>{baseline}% &mdash; Room to grow. Harold&apos;s here to help.</p>
              </motion.div>
              <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => router.push("/hub")}
                className="w-full max-w-sm py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 shadow-lg mx-auto" style={{ background: "linear-gradient(135deg, #8B7355, #6B5540)", color: "#F8F3EC" }}>
                Show me Harold <span>&rarr;</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
