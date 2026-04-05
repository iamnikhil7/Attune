"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";

const activityOptions = ["Running/Walking", "Yoga/Stretching", "Recreational Sports", "Group Fitness", "Community Events", "Open to Anything"];

const assessmentQuestions = [
  { id: 1, text: "What does your morning usually look like?", options: [{ emoji: "\u2615", label: "Coffee and go", value: "rush" }, { emoji: "\uD83E\uDDD8", label: "Slow and intentional", value: "mindful" }, { emoji: "\uD83D\uDCF1", label: "Phone first", value: "phone" }, { emoji: "\uD83D\uDE34", label: "Snooze battle", value: "snooze" }] },
  { id: 2, text: "What did you stop doing that you miss?", options: [{ emoji: "\uD83C\uDFC3", label: "Regular exercise", value: "exercise" }, { emoji: "\uD83C\uDFA8", label: "Creative hobbies", value: "creative" }, { emoji: "\uD83D\uDC65", label: "Seeing friends regularly", value: "social" }, { emoji: "\uD83D\uDCD6", label: "Reading or learning", value: "learning" }] },
  { id: 3, text: "How do you feel on an average Tuesday?", options: [{ emoji: "\uD83D\uDE10", label: "Going through the motions", value: "autopilot" }, { emoji: "\uD83D\uDE30", label: "Overwhelmed", value: "overwhelmed" }, { emoji: "\uD83D\uDE0A", label: "Pretty good actually", value: "good" }, { emoji: "\uD83E\uDD37", label: "Depends on the day", value: "variable" }] },
  { id: 4, text: "When stressed, what do you reach for?", options: [{ emoji: "\uD83C\uDF55", label: "Comfort food", value: "food" }, { emoji: "\uD83D\uDCF1", label: "Endless scrolling", value: "scrolling" }, { emoji: "\uD83D\uDECB\uFE0F", label: "Cancel plans, isolate", value: "isolate" }, { emoji: "\uD83C\uDFC3", label: "Movement or exercise", value: "movement" }] },
  { id: 5, text: "Which patterns feel familiar?", multiSelect: true, options: [{ emoji: "\uD83C\uDF19", label: "Late nights", value: "late_nights" }, { emoji: "\uD83D\uDCF1", label: "Too much screen time", value: "screen_time" }, { emoji: "\uD83C\uDF54", label: "Irregular eating", value: "irregular_eating" }, { emoji: "\uD83D\uDE34", label: "Poor sleep", value: "poor_sleep" }, { emoji: "\uD83C\uDFE0", label: "Rarely leaving home", value: "sedentary" }, { emoji: "\uD83D\uDE36", label: "Social withdrawal", value: "withdrawal" }] },
];

const stepVariants = { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -60 } };
const cardHover = { y: -4, transition: { type: "spring" as const, stiffness: 300 } };
const cardTap = { scale: 0.97 };
const buttonHover = { scale: 1.05 };
const buttonTap = { scale: 0.97 };
const containerStagger = { animate: { transition: { staggerChildren: 0.08 } } };
const itemFade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

function getArchetype(a: string | undefined) {
  if (a === "rush" || a === "phone") return { name: "The Driven Drifter", description: "You move fast and stay busy\u2014but sometimes that momentum carries you past the things that matter most. Harold will help you slow down just enough to notice what your body and mind are telling you." };
  if (a === "mindful") return { name: "The Mindful Aspirant", description: "You have good instincts about what you need\u2014but life has a way of pulling you off course. Harold will help you stay connected to those instincts and build on what\u2019s already working." };
  if (a === "snooze") return { name: "The Night Owl", description: "Your energy peaks later in the day, and mornings feel like a battle. Harold will help you find a rhythm that works with your natural patterns instead of fighting against them." };
  return { name: "The Rhythm Seeker", description: "You\u2019re looking for something that feels right\u2014a pace, a pattern, a way of living that fits. Harold will help you find it, one small shift at a time." };
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState("");
  const [activityPreferences, setActivityPreferences] = useState<string[]>([]);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, string | string[]>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [healthConnection, setHealthConnection] = useState<string | null>(null);
  const [personalWhy, setPersonalWhy] = useState("");

  const toggleActivity = (a: string) => setActivityPreferences((p) => p.includes(a) ? p.filter((x) => x !== a) : [...p, a]);

  const handleAnswer = (qId: number, val: string, multi?: boolean) => {
    if (multi) { setAssessmentAnswers((p) => { const c = (p[qId] as string[]) || []; return { ...p, [qId]: c.includes(val) ? c.filter((v) => v !== val) : [...c, val] }; }); }
    else { setAssessmentAnswers((p) => ({ ...p, [qId]: val })); if (currentQuestion < assessmentQuestions.length - 1) setTimeout(() => setCurrentQuestion((p) => p + 1), 350); else setTimeout(() => setStep(4), 350); }
  };

  const handleMultiContinue = () => { if (currentQuestion < assessmentQuestions.length - 1) setCurrentQuestion((p) => p + 1); else setStep(4); };
  const handleHealthChoice = (c: string) => { setHealthConnection(c); setStep(5); };

  const handleFinish = () => {
    const arch = getArchetype(assessmentAnswers[1] as string | undefined);
    localStorage.setItem("harold_profile", JSON.stringify({ location, activities: activityPreferences, assessment: assessmentAnswers, healthConnection, personalWhy, archetype: arch.name }));
    setStep(6);
  };

  const ma = assessmentAnswers[1] as string | undefined;
  const arch = getArchetype(ma);
  const baseline = ma === "mindful" ? 72 : ma === "snooze" ? 38 : (ma === "rush" || ma === "phone") ? 55 : 50;

  return (
    <div className="min-h-screen bg-background text-foreground"><Navbar />
      <AnimatePresence mode="wait">
        {step === 1 && (<motion.div key="s1" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }} className="min-h-screen flex items-center justify-center px-6"><div className="max-w-xl w-full text-center">
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 3, repeat: Infinity }} className="flex justify-center mb-8"><Image src="/harold-mascot.png" alt="Harold" width={120} height={120} /></motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-serif text-3xl mb-4">Hi. I&apos;m Harold.</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="text-foreground/60 leading-relaxed mb-10">I&apos;m here to help you notice patterns you might otherwise miss&mdash;and connect you to experiences that help restore rhythm to your life.</motion.p>
          <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} whileHover={buttonHover} whileTap={buttonTap} onClick={() => setStep(2)} className="px-8 py-3 rounded-lg text-sm font-medium bg-accent text-[#0B0B0B]">Let&apos;s start</motion.button>
        </div></motion.div>)}

        {step === 2 && (<motion.div key="s2" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }} className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12"><div className="max-w-xl w-full">
          <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-2xl mb-6">Where are you?</motion.h2>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-2"><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City or neighborhood" className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-[#8B5CF6]/40 transition-colors" /></motion.div>
          <p className="text-xs text-foreground/40 mb-1">This helps me find group activities near you.</p>
          <p className="text-xs text-foreground/25 mb-10">Your location stays private&mdash;it&apos;s only used for activity suggestions.</p>
          <motion.h3 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-serif text-lg mb-4">What sounds appealing?</motion.h3>
          <motion.div variants={containerStagger} initial="initial" animate="animate" className="grid grid-cols-2 gap-2 mb-8">
            {activityOptions.map((a) => (<motion.button key={a} variants={itemFade} whileHover={cardHover} whileTap={cardTap} onClick={() => toggleActivity(a)} className={`px-4 py-3 rounded-lg text-sm text-left transition-colors border ${activityPreferences.includes(a) ? "bg-accent/10 border-[#8B5CF6] text-foreground" : "bg-white/[0.03] border-white/[0.06] text-foreground/60 hover:border-white/10"}`}>{a}</motion.button>))}
          </motion.div>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} whileHover={buttonHover} whileTap={buttonTap} onClick={() => setStep(3)} className="w-full py-3 rounded-lg text-sm font-medium bg-accent text-[#0B0B0B]">Continue</motion.button>
        </div></motion.div>)}

        {step === 3 && (<motion.div key="s3" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }} className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12"><div className="max-w-xl w-full">
          <div className="flex justify-center gap-2 mb-10">{assessmentQuestions.map((_, i) => (<motion.div key={i} className={`w-2 h-2 rounded-full ${i === currentQuestion ? "bg-accent" : i < currentQuestion ? "bg-accent/40" : "bg-white/10"}`} animate={i === currentQuestion ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.4 }} />))}</div>
          <AnimatePresence mode="wait">{assessmentQuestions.map((q, idx) => idx === currentQuestion && (
            <motion.div key={q.id} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.35 }}>
              <h2 className="font-serif text-2xl mb-8 text-center">{q.text}</h2>
              <motion.div variants={containerStagger} initial="initial" animate="animate" className={`grid ${q.options.length > 4 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"} gap-3`}>
                {q.options.map((o) => { const sel = q.multiSelect ? ((assessmentAnswers[q.id] as string[]) || []).includes(o.value) : assessmentAnswers[q.id] === o.value; return (<motion.button key={o.value} variants={itemFade} whileHover={cardHover} whileTap={cardTap} onClick={() => handleAnswer(q.id, o.value, q.multiSelect)} className={`flex flex-col items-center gap-2 px-4 py-5 rounded-xl border text-center transition-colors ${sel ? "bg-accent/10 border-[#8B5CF6] text-foreground" : "bg-white/[0.03] border-white/[0.06] text-foreground/60 hover:border-white/10"}`}><span className="text-2xl">{o.emoji}</span><span className="text-sm">{o.label}</span></motion.button>); })}
              </motion.div>
              {q.multiSelect && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 flex justify-center"><motion.button whileHover={buttonHover} whileTap={buttonTap} onClick={handleMultiContinue} className="px-8 py-3 rounded-lg text-sm font-medium bg-accent text-[#0B0B0B]">Continue</motion.button></motion.div>)}
            </motion.div>
          ))}</AnimatePresence>
        </div></motion.div>)}

        {step === 4 && (<motion.div key="s4" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }} className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12"><div className="max-w-xl w-full text-center">
          <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-2xl mb-3">Want Harold to observe your patterns?</motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-foreground/60 leading-relaxed mb-8 text-sm">I can look at your health data&mdash;sleep, recovery, activity&mdash;and help you understand what it means.</motion.p>
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 3, repeat: Infinity }} className="flex justify-center mb-8"><Image src="/harold-mascot.png" alt="Harold" width={80} height={80} /></motion.div>
          <motion.div variants={containerStagger} initial="initial" animate="animate" className="space-y-3 mb-8 max-w-sm mx-auto">
            {[{id:"apple_health",label:"Connect Apple Health",icon:"\u2764\uFE0F"},{id:"wearable",label:"Connect Wearable",icon:"\u231A"},{id:"skip",label:"Skip for now",icon:"\uD83D\uDD12"}].map((o) => (<motion.button key={o.id} variants={itemFade} whileHover={cardHover} whileTap={cardTap} onClick={() => handleHealthChoice(o.id)} className="w-full flex items-center gap-4 text-left px-5 py-4 rounded-xl border border-white/[0.06] bg-white/[0.03] text-sm text-foreground/80 hover:border-white/10 transition-colors"><span className="text-xl">{o.icon}</span><span>{o.label}</span></motion.button>))}
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-xs text-foreground/25">Your data never leaves your device. Harold doesn&apos;t store raw metrics.</motion.p>
        </div></motion.div>)}

        {step === 5 && (<motion.div key="s5" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }} className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12"><div className="max-w-xl w-full">
          <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-2xl mb-4">One last thing.</motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-foreground/60 leading-relaxed mb-8">At your lowest moments&mdash;when you&apos;re about to fall back into old patterns&mdash;what words would you want to hear from yourself?</motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <textarea value={personalWhy} onChange={(e) => setPersonalWhy(e.target.value)} placeholder="e.g., You used to feel strong. That person is still here." rows={4} className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-[#8B5CF6]/40 transition-colors resize-none" />
            <div className="flex justify-between items-center mt-2 mb-2"><p className="text-xs text-foreground/30 italic">This becomes your identity anchor.</p><p className={`text-xs ${personalWhy.length >= 15 ? "text-accent/60" : "text-foreground/30"}`}>{personalWhy.length} / 15 min</p></div>
          </motion.div>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} whileHover={personalWhy.length >= 15 ? buttonHover : {}} whileTap={personalWhy.length >= 15 ? buttonTap : {}} onClick={handleFinish} disabled={personalWhy.length < 15} className={`w-full py-3 rounded-lg text-sm font-medium mt-6 ${personalWhy.length >= 15 ? "bg-accent text-[#0B0B0B]" : "bg-accent/30 text-[#0B0B0B]/40 cursor-not-allowed"}`}>Continue</motion.button>
        </div></motion.div>)}

        {step === 6 && (<motion.div key="s6" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }} className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12"><div className="max-w-xl w-full text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="flex justify-center mb-8"><motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 3, repeat: Infinity }}><Image src="/harold-mascot.png" alt="Harold" width={120} height={120} /></motion.div></motion.div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-foreground/40 text-sm uppercase tracking-widest mb-2">Your archetype</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, type: "spring", stiffness: 150 }} className="font-serif text-4xl mb-4 text-accent">{arch.name}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-foreground/60 leading-relaxed mb-10 max-w-md mx-auto">{arch.description}</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="mb-10 max-w-sm mx-auto">
            <p className="text-xs text-foreground/40 mb-3 uppercase tracking-wider">Your wellness baseline</p>
            <div className="w-full h-3 bg-white/[0.06] rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${baseline}%` }} transition={{ delay: 1, duration: 1, ease: "easeOut" }} className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#8B5CF6]/60 rounded-full" /></div>
            <p className="text-xs text-foreground/30 mt-2">{baseline}% &mdash; Room to grow. Harold&apos;s here to help.</p>
          </motion.div>
          <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} whileHover={buttonHover} whileTap={buttonTap} onClick={() => router.push("/hub")} className="px-8 py-3 rounded-lg text-sm font-medium bg-accent text-[#0B0B0B]">Show me the Hub</motion.button>
        </div></motion.div>)}
      </AnimatePresence>
    </div>
  );
}
