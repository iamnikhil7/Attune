"use client";

import { useState, useEffect, useCallback } from "react";
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
    detail: "After your run on Sunday, your recovery signals shifted. Sleep was deeper that night, and your baseline has been calmer since. It's subtle, but Harold noticed.",
    followUp: "Keep this rhythm going — consistency matters more than intensity.",
  },
  {
    activityName: "Lunch Walk",
    attendedAt: "",
    orbState: "neutral",
    message: "That break in the middle of the day helped.",
    detail: "Your afternoon patterns looked different after the walk — less restlessness, a slight dip in stress signals. Small movements like this can quietly reset your whole day.",
    followUp: "Even 15 minutes of walking shifts things more than you'd expect.",
  },
  {
    activityName: "Pickup Basketball",
    attendedAt: "",
    orbState: "thriving",
    message: "Good energy. Harold could feel it.",
    detail: "After Thursday's game, your recovery metrics actually improved despite the intensity. That usually means your body needed the outlet. The social connection probably helped too.",
    followUp: "When you have good energy, channeling it into something physical seems to work for you.",
  },
  {
    activityName: "Thursday Evening Yoga",
    attendedAt: "",
    orbState: "recovered",
    message: "Something shifted after that session.",
    detail: "Your heart rate variability improved the morning after yoga. That means your nervous system got a genuine reset — not just rest, but actual recovery. Harold noticed your sleep was deeper too.",
    followUp: "Slower sessions seem to suit your current rhythm. Worth leaning into.",
  },
];

function getTimeSinceActivity(attendedAt: string): string {
  const hours = Math.floor((Date.now() - new Date(attendedAt).getTime()) / 3600000);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}

/** Speak text using Web Speech API */
function haroldSpeak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 0.95;
  utterance.volume = 0.85;
  // Try to pick a calm, natural voice
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    (v) => v.name.includes("Samantha") || v.name.includes("Daniel") || v.name.includes("Google UK English") || v.name.includes("Alex")
  );
  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
}

export default function ReflectionPage() {
  const router = useRouter();
  const [reflection, setReflection] = useState<PostActivityReflection | null>(null);
  const [phase, setPhase] = useState<"orb" | "message" | "detail" | "acknowledged">("orb");
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Preload voices (they load async in some browsers)
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }

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

  // Speak Harold's message when entering the message phase
  useEffect(() => {
    if (phase === "message" && reflection) {
      setIsSpeaking(true);
      haroldSpeak(reflection.message);
      const duration = reflection.message.length * 80;
      const timer = setTimeout(() => setIsSpeaking(false), duration);
      return () => clearTimeout(timer);
    }
    if (phase === "detail" && reflection) {
      setIsSpeaking(true);
      haroldSpeak(reflection.detail + ". " + reflection.followUp);
      const duration = (reflection.detail.length + reflection.followUp.length) * 70;
      const timer = setTimeout(() => setIsSpeaking(false), duration);
      return () => clearTimeout(timer);
    }
  }, [phase, reflection]);

  const handleAcknowledge = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setPhase("acknowledged");
    setTimeout(() => router.push("/hub"), 2500);
  }, [router]);

  if (!reflection) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-lg mx-auto px-6 pt-28 pb-16 flex flex-col items-center justify-center min-h-[80vh]">
        <AnimatePresence mode="wait">
          {/* Phase 1: Orb processing */}
          {phase === "orb" && (
            <motion.div key="orb" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.6 }} className="flex flex-col items-center gap-6">
              <HaroldOrb size={120} state={reflection.orbState} />
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-sm text-foreground/40">Harold is processing&hellip;</motion.p>
            </motion.div>
          )}

          {/* Phase 2: Harold speaks the message */}
          {phase === "message" && (
            <motion.div key="message" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="w-full text-center space-y-8">
              {/* Harold mascot with speaking animation */}
              <div className="flex justify-center">
                <motion.div
                  animate={isSpeaking ? { y: [0, -6, 0], scale: [1, 1.05, 1], rotate: [0, 2, -1, 0] } : { y: [0, -8, 0] }}
                  transition={isSpeaking ? { duration: 0.6, repeat: Infinity } : { duration: 3, repeat: Infinity }}
                  className="relative"
                >
                  {/* Speaking glow ring */}
                  {isSpeaking && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      animate={{ boxShadow: ["0 0 20px rgba(139,92,246,0.3)", "0 0 40px rgba(139,92,246,0.5)", "0 0 20px rgba(139,92,246,0.3)"] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                  <Image src="/harold-mascot.png" alt="Harold" width={100} height={100} className="rounded-2xl shadow-xl shadow-accent/20 ring-1 ring-white/[0.06]" />
                  {/* Sound wave indicator */}
                  {isSpeaking && (
                    <motion.div className="absolute -right-3 top-1/2 -translate-y-1/2 flex gap-0.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div key={i} className="w-0.5 bg-accent rounded-full" animate={{ height: [4, 12, 4] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }} />
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              </div>

              <div className="space-y-3">
                <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xs text-accent/60 uppercase tracking-widest">
                  After {reflection.activityName} &middot; {getTimeSinceActivity(reflection.attendedAt)}
                </motion.p>
                <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-2xl font-bold leading-relaxed">
                  {reflection.message}
                </motion.h1>
              </div>

              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setPhase("detail")} className="text-sm text-foreground/40 hover:text-foreground/60 transition-colors">
                Tell me more &rarr;
              </motion.button>
            </motion.div>
          )}

          {/* Phase 3: Harold speaks the detail */}
          {phase === "detail" && (
            <motion.div key="detail" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="w-full space-y-8">
              <div className="flex items-start gap-4">
                <div className="shrink-0 pt-1 relative">
                  <HaroldOrb size={40} state={reflection.orbState} />
                  {/* Speaking indicator on orb */}
                  {isSpeaking && (
                    <motion.div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-accent" animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 0.8, repeat: Infinity }} />
                  )}
                </div>
                <div className="space-y-4">
                  <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-sm text-foreground/70 leading-relaxed">{reflection.detail}</motion.p>
                  <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-sm text-accent/70 italic">&ldquo;{reflection.followUp}&rdquo;</motion.p>
                </div>
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-col items-center gap-3 pt-4">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={handleAcknowledge} className="px-8 py-3 rounded-xl text-sm font-semibold bg-gradient-primary text-white shadow-lg shadow-accent/20">Thanks, Harold</motion.button>
                <button onClick={() => { if (typeof window !== "undefined") window.speechSynthesis?.cancel(); router.push("/hub"); }} className="text-xs text-foreground/30 hover:text-foreground/50 transition-colors">Skip to Hub</button>
              </motion.div>
            </motion.div>
          )}

          {/* Phase 4: Acknowledged */}
          {phase === "acknowledged" && (
            <motion.div key="ack" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="text-center space-y-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }}>
                <Image src="/harold-mascot.png" alt="Harold" width={80} height={80} className="mx-auto rounded-2xl shadow-xl shadow-accent/10 ring-1 ring-white/[0.06]" />
              </motion.div>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-sm text-foreground/50">Harold will keep watching. Quietly.</motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
