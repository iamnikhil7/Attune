"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import HaroldOrb from "@/components/HaroldOrb";
import type { HaroldOrbState } from "@/components/HaroldOrb";

interface PostActivityReflection {
  activityName: string;
  attendedAt: string;
  orbState: HaroldOrbState;
  message: string;
  detail: string;
  followUp: string;
}

const reflectionBank: PostActivityReflection[] = [
  {
    activityName: "Sunday Morning Easy Run",
    attendedAt: "",
    orbState: "recovered",
    message: "You seem a bit steadier today.",
    detail: "After your run on Sunday, your recovery signals shifted. Sleep was deeper that night, and your baseline has been calmer since. It\u2019s subtle, but Harold noticed.",
    followUp: "Keep this rhythm going \u2014 consistency matters more than intensity.",
  },
  {
    activityName: "Lunch Walk",
    attendedAt: "",
    orbState: "neutral",
    message: "That break in the middle of the day helped.",
    detail: "Your afternoon patterns looked different after the walk \u2014 less restlessness, a slight dip in stress signals. Small movements like this can quietly reset your whole day.",
    followUp: "Even 15 minutes of walking shifts things more than you\u2019d expect.",
  },
  {
    activityName: "Pickup Basketball",
    attendedAt: "",
    orbState: "thriving",
    message: "Good energy. Harold could feel it.",
    detail: "After Thursday\u2019s game, your recovery metrics actually improved despite the intensity. That usually means your body needed the outlet. The social connection probably helped too.",
    followUp: "When you have good energy, channeling it into something physical seems to work for you.",
  },
  {
    activityName: "Thursday Evening Yoga",
    attendedAt: "",
    orbState: "recovered",
    message: "Something shifted after that session.",
    detail: "Your heart rate variability improved the morning after yoga. That means your nervous system got a genuine reset \u2014 not just rest, but actual recovery. Harold noticed your sleep was deeper too.",
    followUp: "Slower sessions seem to suit your current rhythm. Worth leaning into.",
  },
];

function getTimeSinceActivity(attendedAt: string): string {
  const hours = Math.floor((Date.now() - new Date(attendedAt).getTime()) / 3600000);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}

export default function ReflectionPage() {
  const router = useRouter();
  const [reflection, setReflection] = useState<PostActivityReflection | null>(null);
  const [phase, setPhase] = useState<"orb" | "message" | "detail" | "acknowledged">("orb");
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("harold_last_activity");
      if (raw) {
        const parsed = JSON.parse(raw);
        const hoursSince = (Date.now() - new Date(parsed.attendedAt).getTime()) / 3600000;
        if (hoursSince <= 48 && !parsed.reflectionShown) {
          const match = reflectionBank.find((r) => r.activityName === parsed.activityName) || reflectionBank[0];
          setReflection({ ...match, attendedAt: parsed.attendedAt });
          localStorage.setItem("harold_last_activity", JSON.stringify({ ...parsed, reflectionShown: true }));
          setTimeout(() => setPhase("message"), 2000);
        } else {
          router.push("/hub");
        }
      } else {
        const demo = reflectionBank[Math.floor(Math.random() * reflectionBank.length)];
        setReflection({ ...demo, attendedAt: new Date(Date.now() - 18 * 3600000).toISOString() });
        setTimeout(() => setPhase("message"), 2000);
      }
    } catch {
      router.push("/hub");
    }
  }, [router]);

  const handleAcknowledge = () => {
    setAcknowledged(true);
    setPhase("acknowledged");
    setTimeout(() => router.push("/hub"), 2500);
  };

  if (!reflection) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-lg mx-auto px-6 pt-28 pb-16 flex flex-col items-center justify-center min-h-[80vh]">
        <AnimatePresence mode="wait">
          {phase === "orb" && (
            <motion.div key="orb" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.6 }} className="flex flex-col items-center gap-6">
              <HaroldOrb size={120} state={reflection.orbState} />
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-sm text-foreground/40">Harold is processing\u2026</motion.p>
            </motion.div>
          )}
          {phase === "message" && (
            <motion.div key="message" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="w-full text-center space-y-8">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="flex justify-center">
                <Image src="/harold-mascot.png" alt="Harold" width={80} height={80} />
              </motion.div>
              <div className="space-y-3">
                <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xs text-accent/60 uppercase tracking-widest">After {reflection.activityName} \u00b7 {getTimeSinceActivity(reflection.attendedAt)}</motion.p>
                <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="font-serif text-2xl leading-relaxed">{reflection.message}</motion.h1>
              </div>
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setPhase("detail")} className="text-sm text-foreground/40 hover:text-foreground/60 transition-colors">Tell me more \u2192</motion.button>
            </motion.div>
          )}
          {phase === "detail" && (
            <motion.div key="detail" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="w-full space-y-8">
              <div className="flex items-start gap-4">
                <div className="shrink-0 pt-1"><HaroldOrb size={40} state={reflection.orbState} /></div>
                <div className="space-y-4">
                  <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-sm text-foreground/70 leading-relaxed">{reflection.detail}</motion.p>
                  <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-sm text-accent/70 italic">&ldquo;{reflection.followUp}&rdquo;</motion.p>
                </div>
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-col items-center gap-3 pt-4">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={handleAcknowledge} className="px-8 py-3 rounded-full text-sm font-medium bg-accent text-[#0B0B0B]">Thanks, Harold</motion.button>
                <button onClick={() => router.push("/hub")} className="text-xs text-foreground/30 hover:text-foreground/50 transition-colors">Skip to Hub</button>
              </motion.div>
            </motion.div>
          )}
          {phase === "acknowledged" && (
            <motion.div key="ack" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="text-center space-y-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }}>
                <Image src="/harold-mascot.png" alt="Harold" width={80} height={80} className="mx-auto" />
              </motion.div>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-sm text-foreground/50">Harold will keep watching. Quietly.</motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
