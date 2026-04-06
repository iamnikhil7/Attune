"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const DATA_CATEGORIES = [
  {
    emoji: "\u2764\uFE0F",
    title: "Heart & Recovery",
    description: "Resting heart rate, HRV, recovery trends",
  },
  {
    emoji: "\uD83D\uDE34",
    title: "Sleep",
    description: "Duration, quality, deep sleep percentage, bedtime patterns",
  },
  {
    emoji: "\uD83C\uDFC3",
    title: "Activity",
    description: "Steps, active minutes, movement patterns",
  },
];

const PERMISSIONS = [
  { key: "heartRate", label: "Heart Rate", emoji: "\u2764\uFE0F" },
  { key: "hrv", label: "Heart Rate Variability", emoji: "\uD83D\uDC93" },
  { key: "sleep", label: "Sleep Analysis", emoji: "\uD83D\uDE34" },
  { key: "steps", label: "Steps", emoji: "\uD83D\uDC5F" },
  { key: "activeEnergy", label: "Active Energy", emoji: "\uD83D\uDD25" },
  { key: "workouts", label: "Workouts", emoji: "\uD83C\uDFCB\uFE0F" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const stepTransition = {
  initial: { opacity: 0, x: 80 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -80 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

export default function HealthConnectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [permissions, setPermissions] = useState<Record<string, boolean>>(
    Object.fromEntries(PERMISSIONS.map((p) => [p.key, true]))
  );
  const [healthConnected, setHealthConnected] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(false);

  const togglePermission = (key: string) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAllow = () => {
    const enabledPermissions = Object.entries(permissions)
      .filter(([, v]) => v)
      .map(([k]) => k);

    localStorage.setItem(
      "harold_health",
      JSON.stringify({
        connected: true,
        permissions: enabledPermissions,
        connectedAt: new Date().toISOString(),
      })
    );

    setHealthConnected(true);
    setAnalysisProgress(true);
    setStep(3);
  };

  const handleDeny = () => {
    localStorage.setItem(
      "harold_health",
      JSON.stringify({
        connected: false,
        permissions: [],
        connectedAt: new Date().toISOString(),
      })
    );

    setHealthConnected(false);
    setStep(3);
  };

  const handleSkip = () => {
    localStorage.setItem(
      "harold_health",
      JSON.stringify({
        connected: false,
        permissions: [],
        connectedAt: new Date().toISOString(),
      })
    );

    setHealthConnected(false);
    setStep(3);
  };

  const enabledPermissions = Object.entries(permissions)
    .filter(([, v]) => v)
    .map(([k]) => k);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-lg mx-auto px-6 pt-20 pb-16">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={stepTransition.initial}
              animate={stepTransition.animate}
              exit={stepTransition.exit}
              transition={stepTransition.transition}
            >
              <div className="text-center mb-8">
                <motion.div
                  className="inline-block mb-4"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image src="/harold-mascot.png" alt="Harold mascot" width={80} height={80} className="mx-auto" />
                </motion.div>
                <h1 className="font-serif text-3xl mb-3">Connect Your Health Data</h1>
                <p className="text-sm text-muted/60 leading-relaxed max-w-sm mx-auto">
                  Harold can observe patterns from your health data&mdash;sleep, recovery, activity&mdash;and help you understand what they mean.
                </p>
              </div>
              <div className="space-y-3 mb-6">
                {DATA_CATEGORIES.map((cat, i) => (
                  <motion.div key={cat.title} custom={i} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.02 }} className="bg-surface border border-border rounded-2xl p-5 flex items-start gap-4">
                    <span className="text-2xl mt-0.5">{cat.emoji}</span>
                    <div>
                      <p className="text-sm font-medium mb-1">{cat.title}</p>
                      <p className="text-xs text-muted/50 leading-relaxed">{cat.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible" className="rounded-2xl p-5 mb-8 border border-white/[0.06]" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)", backdropFilter: "blur(12px)" }}>
                <div className="flex items-start gap-3">
                  <span className="text-lg">&#x1F512;</span>
                  <div>
                    <p className="text-sm font-medium mb-1">Your data stays private</p>
                    <p className="text-xs text-muted/50 leading-relaxed">Harold only sees patterns and trends&mdash;never raw numbers. Your data never leaves your device.</p>
                  </div>
                </div>
              </motion.div>
              <div className="space-y-3">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => setStep(2)} className="w-full py-3.5 rounded-full text-sm font-semibold transition-colors" style={{ background: "#8B5CF6", color: "#0B0B0B" }}>Connect Apple Health</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => setStep(2)} className="w-full py-3.5 rounded-full text-sm font-medium border border-border text-muted hover:text-foreground transition-colors">Connect Other Wearable</motion.button>
                <div className="text-center pt-2"><button onClick={handleSkip} className="text-xs text-muted/30 hover:text-muted/50 transition-colors">Skip for now</button></div>
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="step-2" initial={stepTransition.initial} animate={stepTransition.animate} exit={stepTransition.exit} transition={stepTransition.transition}>
              <div className="text-center mb-8">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: "linear-gradient(135deg, #FF6B8A, #FF2D55)" }}>
                  <span className="text-2xl">{"\u2764\uFE0F"}</span>
                </motion.div>
                <h2 className="font-serif text-xl mb-2">&ldquo;Harold &amp; Crew&rdquo; would like to access your health data</h2>
                <p className="text-xs text-muted/40">Toggle the data types you&apos;d like to share</p>
              </div>
              <div className="space-y-2 mb-8">
                {PERMISSIONS.map((perm, i) => (
                  <motion.div key={perm.key} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.35 }} onClick={() => togglePermission(perm.key)} className="flex items-center justify-between p-4 rounded-xl border border-border cursor-pointer select-none hover:border-white/10 transition-colors" style={{ background: permissions[perm.key] ? "rgba(255,136,151,0.06)" : "rgba(255,255,255,0.02)" }}>
                    <div className="flex items-center gap-3"><span className="text-lg">{perm.emoji}</span><span className="text-sm">{perm.label}</span></div>
                    <motion.div layout className="w-11 h-6 rounded-full p-0.5 cursor-pointer flex items-center" style={{ background: permissions[perm.key] ? "#8B5CF6" : "rgba(255,255,255,0.1)", justifyContent: permissions[perm.key] ? "flex-end" : "flex-start" }} transition={{ type: "spring", stiffness: 500, damping: 30 }}>
                      <motion.div layout className="w-5 h-5 rounded-full bg-white shadow-sm" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              <div className="space-y-3">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={handleAllow} className="w-full py-3.5 rounded-full text-sm font-semibold transition-colors" style={{ background: "#8B5CF6", color: "#0B0B0B" }}>Allow Access</motion.button>
                <div className="text-center pt-1"><button onClick={handleDeny} className="text-xs text-muted/30 hover:text-muted/50 transition-colors">Don&apos;t Allow</button></div>
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="step-3" initial={stepTransition.initial} animate={stepTransition.animate} exit={stepTransition.exit} transition={stepTransition.transition} className="text-center">
              {healthConnected ? (
                <>
                  <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="mb-6">
                    <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 0.6, repeat: 2, ease: "easeOut" }}>
                      <Image src="/harold-mascot.png" alt="Harold celebrating" width={80} height={80} className="mx-auto" />
                    </motion.div>
                  </motion.div>
                  <h2 className="font-serif text-2xl mb-3">You&apos;re all set!</h2>
                  <p className="text-sm text-muted/60 leading-relaxed max-w-sm mx-auto mb-6">Harold is now observing your patterns. He&apos;ll surface insights when there&apos;s something worth noticing&mdash;not before.</p>
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {enabledPermissions.map((key, i) => {
                      const perm = PERMISSIONS.find((p) => p.key === key);
                      if (!perm) return null;
                      return (<motion.span key={key} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.08 }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-surface border border-border"><span>{perm.emoji}</span><span>{perm.label}</span><span className="text-emerald-400">{"\u2713"}</span></motion.span>);
                    })}
                  </div>
                  {analysisProgress && (<div className="mb-8 max-w-xs mx-auto"><p className="text-xs text-muted/40 mb-2">Initial pattern analysis</p><div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden"><motion.div className="h-full rounded-full" style={{ background: "#8B5CF6" }} initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3, ease: "easeInOut" }} /></div></div>)}
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => router.push("/hub")} className="px-8 py-3.5 rounded-full text-sm font-semibold transition-colors" style={{ background: "#8B5CF6", color: "#0B0B0B" }}>Go to Harold</motion.button>
                </>
              ) : (
                <>
                  <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="mb-6">
                    <Image src="/harold-mascot.png" alt="Harold" width={80} height={80} className="mx-auto opacity-80" />
                  </motion.div>
                  <h2 className="font-serif text-2xl mb-3">No worries!</h2>
                  <p className="text-sm text-muted/60 leading-relaxed max-w-sm mx-auto mb-8">You can connect your health data anytime from Settings. Harold will still suggest activities based on your preferences.</p>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => router.push("/hub")} className="px-8 py-3.5 rounded-full text-sm font-semibold transition-colors" style={{ background: "#8B5CF6", color: "#0B0B0B" }}>Go to Harold</motion.button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
