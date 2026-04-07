"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";

interface CheckInData {
  date: string;
  sleepQuality: number;
  sleepHours: number;
  energyLevel: number;
  stressLevel: number;
  movement: string;
  mood: string;
  notes: string;
}

const sleepLabels = ["Terrible", "Poor", "Okay", "Good", "Great"];
const energyLabels = ["Exhausted", "Low", "Moderate", "Good", "High"];
const stressLabels = ["Calm", "Mild", "Moderate", "High", "Overwhelming"];

const movementOptions = [
  { emoji: "\u{1F6B6}", label: "Walking", value: "walking" },
  { emoji: "\u{1F3C3}", label: "Running", value: "running" },
  { emoji: "\u{1F9D8}", label: "Yoga/Stretch", value: "yoga" },
  { emoji: "\u{1F3C0}", label: "Sports", value: "sports" },
  { emoji: "\u{1F3CB}\uFE0F", label: "Gym", value: "gym" },
  { emoji: "\u274C", label: "None today", value: "none" },
];

const moodOptions = [
  { emoji: "\u{1F60A}", label: "Good", value: "good" },
  { emoji: "\u{1F610}", label: "Neutral", value: "neutral" },
  { emoji: "\u{1F614}", label: "Low", value: "low" },
  { emoji: "\u{1F630}", label: "Anxious", value: "anxious" },
  { emoji: "\u{1F620}", label: "Frustrated", value: "frustrated" },
  { emoji: "\u{1F971}", label: "Drained", value: "drained" },
];

const stepVariants = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

function SliderInput({ value, onChange, labels, color }: { value: number; onChange: (v: number) => void; labels: string[]; color: string }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        {labels.map((label, i) => (
          <button key={label} onClick={() => onChange(i)} className={`text-xs transition-all ${i === value ? `text-foreground font-medium` : "text-muted/40 hover:text-muted/60"}`}>
            {label}
          </button>
        ))}
      </div>
      <div className="relative h-2 bg-surface-light rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ background: color }}
          animate={{ width: `${(value / (labels.length - 1)) * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      </div>
      <div className="flex justify-between px-1">
        {labels.map((_, i) => (
          <button key={i} onClick={() => onChange(i)} className={`w-4 h-4 rounded-full border-2 transition-all ${i === value ? "border-accent bg-accent scale-125" : "border-border bg-surface hover:border-border-light"}`} />
        ))}
      </div>
    </div>
  );
}

export default function CheckInPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<CheckInData>({
    date: new Date().toISOString().split("T")[0],
    sleepQuality: 2,
    sleepHours: 7,
    energyLevel: 2,
    stressLevel: 1,
    movement: "",
    mood: "",
    notes: "",
  });
  const [haroldResponse, setHaroldResponse] = useState<{ message: string; detail: string; orbState: string } | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem("harold_checkins") || "[]");
      setStreak(history.length);
    } catch {}
  }, []);

  const updateData = (field: keyof CheckInData, value: string | number) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const generateHaroldResponse = (d: CheckInData) => {
    const sleep = d.sleepQuality;
    const energy = d.energyLevel;
    const stress = d.stressLevel;
    const moved = d.movement !== "none" && d.movement !== "";

    if (stress >= 3 && sleep <= 1) {
      return { message: "Stress is building and sleep isn\u2019t catching up.", detail: "When stress is high and sleep is low, things compound quietly. Harold thinks even one good night could shift the trajectory. Don\u2019t try to fix everything\u2014just aim for one better night.", orbState: "stressed" };
    }
    if (sleep >= 3 && energy >= 3 && moved) {
      return { message: "Good rhythm today. Harold can feel it.", detail: "Sleep was solid, energy was up, and you moved. That\u2019s not a coincidence\u2014when these three align, everything downstream gets easier. Keep this going.", orbState: "thriving" };
    }
    if (energy <= 1 && !moved) {
      return { message: "Your body has been quiet today.", detail: "Low energy and no movement often feed each other. Harold isn\u2019t pushing\u2014but even a 10-minute walk can break the loop. Sometimes the hardest part is starting.", orbState: "neutral" };
    }
    if (sleep <= 1) {
      return { message: "Last night was rough.", detail: "Poor sleep affects everything that follows\u2014decisions, cravings, patience, motivation. Be gentle with yourself today. Recovery is the priority, not productivity.", orbState: "stressed" };
    }
    if (moved && energy >= 2) {
      return { message: "Movement helped today.", detail: "You moved and your energy reflects it. Harold noticed the connection\u2014your best days tend to include some form of activity. It doesn\u2019t have to be intense to matter.", orbState: "recovered" };
    }
    if (d.mood === "anxious" || d.mood === "frustrated") {
      return { message: "Something\u2019s weighing on you.", detail: "Harold doesn\u2019t know the specifics, but the signals are there. When you feel this way, physical movement or social connection often helps more than thinking your way through it.", orbState: "stressed" };
    }
    return { message: "Harold\u2019s watching. Quietly.", detail: "Today\u2019s check-in has been logged. Harold will look for patterns across your recent entries and surface insights when something meaningful emerges. Consistency matters more than perfection.", orbState: "neutral" };
  };

  const handleSubmit = () => {
    const response = generateHaroldResponse(data);
    setHaroldResponse(response);

    const history = JSON.parse(localStorage.getItem("harold_checkins") || "[]");
    history.push({ ...data, timestamp: new Date().toISOString(), haroldResponse: response });
    localStorage.setItem("harold_checkins", JSON.stringify(history));

    const healthDay = {
      date: data.date,
      rhr: 60 + (data.stressLevel * 4) - (data.sleepQuality * 2),
      hrv: 70 - (data.stressLevel * 8) + (data.sleepQuality * 4),
      sleepHours: data.sleepHours,
      sleepQuality: data.sleepQuality * 25,
      deepSleepPct: 10 + data.sleepQuality * 4,
      steps: data.movement === "none" ? 2000 : data.movement === "walking" ? 7000 : 5000,
      activeMinutes: data.movement === "none" ? 5 : data.movement === "gym" ? 60 : 30,
      screenTimeMinutes: 180 - data.energyLevel * 20,
      lateBedtime: data.sleepQuality <= 1,
      stressScore: data.stressLevel * 25,
    };
    const healthHistory = JSON.parse(localStorage.getItem("harold_health_days") || "[]");
    healthHistory.push(healthDay);
    if (healthHistory.length > 14) healthHistory.shift();
    localStorage.setItem("harold_health_days", JSON.stringify(healthHistory));

    setStep(4);
  };

  const totalSteps = 4;

  return (
    <div className="min-h-full bg-background text-foreground">
      <Navbar />
      <main className="max-w-lg mx-auto px-6 pt-24 pb-16">
        {step < 4 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted/50">Daily Check-in</span>
              <span className="text-xs text-muted/50">{step}/{totalSteps - 1}</span>
            </div>
            <div className="h-1 bg-surface-light rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-primary rounded-full" animate={{ width: `${(step / (totalSteps - 1)) * 100}%` }} transition={{ type: "spring", stiffness: 300 }} />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }} className="space-y-10">
              <div className="text-center">
                <motion.div animate={{ y: [0, -8, 0], rotate: [0, 3, -2, 0] }} transition={{ duration: 4, repeat: Infinity }} className="inline-block mb-4">
                  <Image src="/harold-mascot.png" alt="Harold" width={80} height={80} className="drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]" />
                </motion.div>
                <h1 className="text-2xl font-bold mb-2">How are you today?</h1>
                <p className="text-sm text-muted/60">Quick check-in. Takes 30 seconds.</p>
                {streak > 0 && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-accent/60 mt-2">{streak} day streak</motion.p>
                )}
              </div>

              <div className="space-y-8">
                <div>
                  <label className="text-sm font-medium mb-4 block">How did you sleep?</label>
                  <SliderInput value={data.sleepQuality} onChange={(v) => updateData("sleepQuality", v)} labels={sleepLabels} color="linear-gradient(135deg, #8B5CF6, #3B82F6)" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Hours of sleep</label>
                  <div className="flex items-center gap-4">
                    <input type="range" min={3} max={12} step={0.5} value={data.sleepHours} onChange={(e) => updateData("sleepHours", parseFloat(e.target.value))} className="flex-1 accent-accent" />
                    <span className="text-lg font-bold text-accent w-12 text-right">{data.sleepHours}h</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-4 block">Energy level right now?</label>
                  <SliderInput value={data.energyLevel} onChange={(v) => updateData("energyLevel", v)} labels={energyLabels} color="linear-gradient(135deg, #3B82F6, #06B6D4)" />
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => setStep(2)} className="w-full py-3.5 rounded-xl text-sm font-semibold bg-gradient-primary text-white">
                Continue
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }} className="space-y-10">
              <div>
                <h2 className="text-2xl font-bold mb-2">A bit more context</h2>
                <p className="text-sm text-muted/60">So Harold can spot patterns.</p>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="text-sm font-medium mb-4 block">Stress level?</label>
                  <SliderInput value={data.stressLevel} onChange={(v) => updateData("stressLevel", v)} labels={stressLabels} color="linear-gradient(135deg, #06B6D4, #EC4899)" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Any movement today?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {movementOptions.map((opt) => (
                      <motion.button key={opt.value} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => updateData("movement", opt.value)}
                        className={`flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-xl border text-center transition-all ${data.movement === opt.value ? "bg-accent/10 border-accent text-foreground" : "bg-surface border-border text-muted/60 hover:border-border-light"}`}>
                        <span className="text-xl">{opt.emoji}</span>
                        <span className="text-xs">{opt.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Overall mood?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {moodOptions.map((opt) => (
                      <motion.button key={opt.value} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => updateData("mood", opt.value)}
                        className={`flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-xl border text-center transition-all ${data.mood === opt.value ? "bg-accent/10 border-accent text-foreground" : "bg-surface border-border text-muted/60 hover:border-border-light"}`}>
                        <span className="text-xl">{opt.emoji}</span>
                        <span className="text-xs">{opt.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-5 py-3.5 rounded-xl text-sm border border-border hover:bg-surface-hover transition-colors">Back</button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => setStep(3)} className="flex-1 py-3.5 rounded-xl text-sm font-semibold bg-gradient-primary text-white">
                  Continue
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }} className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Anything else?</h2>
                <p className="text-sm text-muted/60">Optional. Write anything you want Harold to know.</p>
              </div>

              <textarea
                value={data.notes}
                onChange={(e) => updateData("notes", e.target.value)}
                placeholder="e.g., Had a stressful meeting today... Skipped lunch... Went for a walk at sunset..."
                rows={4}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-accent/40 resize-none transition-colors"
              />

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-5 rounded-2xl border border-accent/20 bg-accent/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl bg-gradient-primary text-xs font-semibold text-white">Premium</div>
                <div className="flex items-start gap-3 mt-2">
                  <span className="text-2xl">&#x2728;</span>
                  <div>
                    <p className="text-sm font-semibold mb-1">Auto-sync with Apple Health</p>
                    <p className="text-xs text-muted/60 leading-relaxed mb-3">Skip manual check-ins. Harold reads your wearable data automatically&mdash;heart rate, HRV, sleep, steps&mdash;and generates insights without you lifting a finger.</p>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="text-xs font-medium text-accent hover:text-accent-soft transition-colors flex items-center gap-1">
                      Explore Premium
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="px-5 py-3.5 rounded-xl text-sm border border-border hover:bg-surface-hover transition-colors">Back</button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} className="flex-1 py-3.5 rounded-xl text-sm font-semibold bg-gradient-primary text-white">
                  Submit Check-in
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 4 && haroldResponse && (
            <motion.div key="s4" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }} className="space-y-8 text-center pt-8">
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }}>
                <motion.div animate={{ y: [0, -10, 0], rotate: [0, 3, -2, 0] }} transition={{ duration: 3, repeat: Infinity }} className="inline-block">
                  <Image src="/harold-mascot.png" alt="Harold" width={100} height={100} className="drop-shadow-[0_0_30px_rgba(139,92,246,0.4)]" />
                </motion.div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-3">
                <p className="text-xs text-accent/60 uppercase tracking-widest">Harold says</p>
                <h2 className="text-xl font-bold leading-relaxed">{haroldResponse.message}</h2>
              </motion.div>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-sm text-muted/70 leading-relaxed max-w-md mx-auto">
                {haroldResponse.detail}
              </motion.p>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex flex-wrap justify-center gap-2">
                <span className="text-xs px-3 py-1.5 rounded-full bg-surface border border-border">Sleep: {sleepLabels[data.sleepQuality]}</span>
                <span className="text-xs px-3 py-1.5 rounded-full bg-surface border border-border">Energy: {energyLabels[data.energyLevel]}</span>
                <span className="text-xs px-3 py-1.5 rounded-full bg-surface border border-border">Stress: {stressLabels[data.stressLevel]}</span>
                {data.movement && data.movement !== "none" && (
                  <span className="text-xs px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent">{movementOptions.find((m) => m.value === data.movement)?.label}</span>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="flex flex-col items-center gap-3 pt-4">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} onClick={() => router.push("/hub")} className="px-8 py-3.5 rounded-xl text-sm font-semibold bg-gradient-primary text-white">
                  Go to Harold
                </motion.button>
                <p className="text-xs text-muted/30">Check-in #{streak + 1} logged</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
