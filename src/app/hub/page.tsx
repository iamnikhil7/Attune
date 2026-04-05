"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import HaroldOrb from "@/components/HaroldOrb";
import type { HaroldOrbState } from "@/components/HaroldOrb";

interface Insight { text: string; severity: "mild" | "moderate"; state: HaroldOrbState; observation: string; noticed: string[]; suggestions: string[]; weekDots: ("green" | "yellow" | "red")[]; }

const insights: Insight[] = [
  { text: "You\u2019ve been a bit out of rhythm this week", severity: "mild", state: "neutral", observation: "Your activity pattern shifted compared to last week. You moved less on the days you usually move most, and your rest days didn\u2019t feel particularly restful either. It\u2019s not alarming \u2014 just a pattern worth noticing.", noticed: ["Monday and Wednesday had almost no movement", "Sleep quality dipped mid-week", "Weekend activity was higher than usual, possibly compensating"], suggestions: ["Try a short walk tomorrow morning to reset your rhythm", "Consider a lighter session instead of skipping entirely", "Set a gentle reminder for your usual Wednesday activity"], weekDots: ["green", "red", "yellow", "red", "yellow", "green", "green"] },
  { text: "Your stress seems to be accumulating", severity: "moderate", state: "stressed", observation: "Over the past few days, the signals Harold tracks have been trending in a direction that suggests mounting tension. Heart rate variability is lower than your baseline, and you\u2019ve been less active than usual.", noticed: ["Heart rate variability dropped 15% from your baseline", "Three consecutive days with minimal movement", "Evening restlessness patterns detected"], suggestions: ["A gentle yoga or stretching session could help reset", "Try a 10-minute breathing exercise before bed tonight", "Consider joining the Thursday Evening Yoga this week"], weekDots: ["yellow", "yellow", "red", "red", "red", "yellow", "yellow"] },
  { text: "You seem more steady after slower sessions", severity: "mild", state: "recovered", observation: "Harold noticed something interesting: after your slower-paced activities, your recovery metrics improve noticeably. Your body seems to respond well to gentler movement rather than intense sessions right now.", noticed: ["Recovery scores are 20% better after easy-paced activities", "Sleep quality improves on days with gentle movement", "Your best days this week followed low-intensity sessions"], suggestions: ["Lean into slower sessions for the next week", "The Sunday Morning Easy Run could be a great fit", "Try pairing gentle movement with your lunch break"], weekDots: ["yellow", "green", "green", "yellow", "green", "green", "green"] },
  { text: "Something feels slightly off today", severity: "moderate", state: "stressed", observation: "Today\u2019s readings are a bit different from your recent pattern. It\u2019s subtle \u2014 nothing dramatic \u2014 but Harold wanted to flag it so you can check in with yourself.", noticed: ["Morning heart rate was elevated compared to your norm", "Movement patterns suggest restlessness", "Your typical rhythm feels disrupted today"], suggestions: ["Take a few minutes to check in with how you\u2019re feeling", "A short walk might help you recalibrate", "Don\u2019t push yourself if something feels off \u2014 rest is okay"], weekDots: ["green", "green", "yellow", "green", "yellow", "yellow", "red"] },
  { text: "Good to see you finding some rhythm", severity: "mild", state: "thriving", observation: "This has been one of your more consistent weeks. You\u2019ve been moving regularly, sleeping better, and your overall pattern looks steady. Harold just wanted to acknowledge that \u2014 consistency matters more than intensity.", noticed: ["Five out of seven days had meaningful movement", "Sleep consistency improved over the week", "Your recovery metrics are trending upward"], suggestions: ["Keep doing what you\u2019re doing \u2014 it\u2019s working", "Consider adding a social activity to build connection", "The Sunday run could help anchor this rhythm long-term"], weekDots: ["green", "green", "green", "yellow", "green", "green", "green"] },
];

const secondaryActivities = [
  { name: "Lunch Walk Tomorrow", atmosphere: "Casual, drop-in, no commitment", timing: "Tuesday 12:30 PM", haroldNote: "Low effort. Might be a good way to break up your day.", href: "/hub/activity/lunch-walk" },
  { name: "Pickup Basketball Tonight", atmosphere: "Competitive but welcoming, all skill levels", timing: "Tonight 7:00 PM", haroldNote: "You\u2019ve had good energy the past few days. This could be a good outlet.", href: "/hub/activity/pickup-basketball" },
  { name: "Thursday Evening Yoga", atmosphere: "Gentle, restorative, beginner-friendly", timing: "Thursday 6:30 PM", haroldNote: "Slower sessions might help right now.", href: "/hub/activity/evening-yoga" },
];

function getGreeting(): string { const h = new Date().getHours(); if (h < 12) return "Good morning"; if (h < 18) return "Good afternoon"; return "Good evening"; }
const dotColor: Record<string, string> = { green: "bg-emerald-400", yellow: "bg-amber-400", red: "bg-red-400" };
const stateColor: Record<HaroldOrbState, string> = { stressed: "bg-red-400", neutral: "bg-[#FF8897]", recovered: "bg-purple-400", thriving: "bg-emerald-400" };
const stateLabel: Record<HaroldOrbState, string> = { stressed: "Stressed", neutral: "Neutral", recovered: "Recovered", thriving: "Thriving" };

const sectionVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } };
const cardHover = { y: -6, transition: { type: "spring" as const, stiffness: 300, damping: 20 } };
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const staggerItem = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } };
const statPillVariants = { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: "easeOut" as const } } };

export default function HubPage() {
  const [greeting, setGreeting] = useState("Good evening");
  const [insight, setInsight] = useState<Insight | null>(null);
  const [insightExpanded, setInsightExpanded] = useState(false);
  const [healthConnected, setHealthConnected] = useState(false);
  const [archetype, setArchetype] = useState<string | null>(null);

  useEffect(() => {
    setGreeting(getGreeting());
    setInsight(insights[Math.floor(Math.random() * insights.length)]);
    try { const hc = localStorage.getItem("health_connected"); if (hc === "true") setHealthConnected(true); } catch {}
    try { const raw = localStorage.getItem("harold_profile"); if (raw) { const p = JSON.parse(raw); if (p?.archetype) setArchetype(p.archetype); } } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground"><Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-16 space-y-10">
        <motion.header className="flex items-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Image src="/harold-mascot.png" alt="Harold" width={40} height={40} className="rounded-full" />
          <div><h1 className="font-serif text-2xl">{greeting}</h1>
            {archetype && (<motion.span className="inline-block mt-1 text-xs text-[#FF8897]/70 bg-[#FF8897]/10 px-2.5 py-0.5 rounded-full" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.4 }}>Welcome back, {archetype}</motion.span>)}
          </div>
        </motion.header>

        {insight && (<motion.div className="rounded-2xl bg-surface/80 backdrop-blur border border-white/[0.06] overflow-hidden" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
          <button onClick={() => setInsightExpanded((v) => !v)} className="w-full flex items-center gap-4 p-4 text-left">
            <HaroldOrb size={48} state={insight.state} />
            <p className="text-sm text-muted flex-1">{insight.text}</p>
            <motion.svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted/50 shrink-0" animate={{ rotate: insightExpanded ? 180 : 0 }} transition={{ duration: 0.25 }}><path d="m6 9 6 6 6-6" /></motion.svg>
          </button>
          <AnimatePresence initial={false}>
            {insightExpanded && (<motion.div key="detail" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: "easeInOut" }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-5 border-t border-white/[0.04] pt-4">
                <p className="text-sm text-muted leading-relaxed">{insight.observation}</p>
                <div className="space-y-2"><span className="text-xs uppercase tracking-wider text-muted/50">Your week at a glance</span>
                  <div className="flex gap-2">{insight.weekDots.map((c, i) => (<motion.div key={i} className={`w-4 h-4 rounded-full ${dotColor[c]}`} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.08 * i, duration: 0.3, type: "spring", stiffness: 400 }} />))}</div>
                </div>
                <div className="space-y-2"><span className="text-xs uppercase tracking-wider text-muted/50">What Harold noticed</span>
                  <ul className="space-y-1.5">{insight.noticed.map((item, i) => (<motion.li key={i} className="text-sm text-muted/80 flex items-start gap-2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i + 0.2, duration: 0.3 }}><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF8897]/60 shrink-0" />{item}</motion.li>))}</ul>
                </div>
                <div className="space-y-2"><span className="text-xs uppercase tracking-wider text-muted/50">What might help</span>
                  <ul className="space-y-1.5">{insight.suggestions.map((item, i) => (<motion.li key={i} className="text-sm text-muted/80 flex items-start gap-2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i + 0.4, duration: 0.3 }}><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400/60 shrink-0" />{item}</motion.li>))}</ul>
                </div>
                <motion.button onClick={() => setInsightExpanded(false)} className="text-xs text-muted/50 hover:text-foreground transition-colors" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>Dismiss</motion.button>
              </div>
            </motion.div>)}
          </AnimatePresence>
        </motion.div>)}

        {!healthConnected && (<motion.div className="p-4 rounded-2xl bg-surface/80 backdrop-blur border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center gap-3" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
          <p className="text-sm text-muted flex-1">Connect your health data to unlock deeper insights</p>
          <Link href="/health-connect" className="inline-block px-4 py-2 rounded-full bg-[#FF8897]/15 text-[#FF8897] text-sm font-medium hover:bg-[#FF8897]/25 transition-colors shrink-0">Connect Apple Health</Link>
        </motion.div>)}

        <motion.section className="space-y-3" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.span className="uppercase text-xs tracking-wider text-muted/50 block" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>Your anchor</motion.span>
          <motion.div className="p-8 rounded-2xl bg-surface border border-border relative overflow-hidden" whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-[#FF8897]/5 blur-3xl pointer-events-none" />
            <div className="relative space-y-4">
              <h2 className="font-serif text-xl">Sunday Morning Easy Run</h2>
              <p className="text-sm text-muted">Easy-paced, conversational, all levels welcome</p>
              <div className="flex flex-col gap-1 text-sm text-muted"><span>Sundays at 8:00 AM</span><span>Starts at Central Park South entrance</span></div>
              <p className="text-sm text-[#FF8897]/70 italic">&ldquo;This might help you build some consistency. Longer sessions like this one tend to create rhythm.&rdquo;</p>
              <p className="text-xs text-muted/40">18 people joined last week</p>
              <Link href="/hub/activity/sunday-run"><motion.span className="inline-block mt-2 px-5 py-2.5 rounded-full bg-accent text-foreground text-sm font-medium hover:bg-accent-soft transition-colors cursor-pointer" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>I&apos;m interested</motion.span></Link>
            </div>
          </motion.div>
        </motion.section>

        <motion.section className="space-y-3" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <span className="uppercase text-xs tracking-wider text-muted/50">This week</span>
          <motion.div className="grid sm:grid-cols-3 gap-4" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {secondaryActivities.map((a) => (<motion.div key={a.href} className="p-6 rounded-2xl bg-surface border border-border flex flex-col gap-3" variants={staggerItem} whileHover={cardHover}>
              <h3 className="font-serif text-base">{a.name}</h3><p className="text-xs text-muted">{a.atmosphere}</p><p className="text-xs text-muted/70">{a.timing}</p>
              <p className="text-xs text-[#FF8897]/70 italic flex-1">&ldquo;{a.haroldNote}&rdquo;</p>
              <Link href={a.href} className="text-xs text-muted hover:text-foreground transition-colors mt-auto">View details &rarr;</Link>
            </motion.div>))}
          </motion.div>
        </motion.section>

        <motion.div className="flex flex-wrap justify-center gap-4" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.div className="flex flex-col items-center gap-1 px-5 py-3 rounded-2xl bg-surface/80 backdrop-blur border border-white/[0.06]" variants={statPillVariants}><span className="text-lg font-semibold">Day 3</span><span className="text-xs text-muted/60">Current Streak</span></motion.div>
          <motion.div className="flex flex-col items-center gap-1 px-5 py-3 rounded-2xl bg-surface/80 backdrop-blur border border-white/[0.06]" variants={statPillVariants}><span className="text-lg font-semibold">2</span><span className="text-xs text-muted/60">Activities This Month</span></motion.div>
          <motion.div className="flex flex-col items-center gap-1 px-5 py-3 rounded-2xl bg-surface/80 backdrop-blur border border-white/[0.06]" variants={statPillVariants}><div className="flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${insight ? stateColor[insight.state] : stateColor.neutral}`} /><span className="text-lg font-semibold">{insight ? stateLabel[insight.state] : "Neutral"}</span></div><span className="text-xs text-muted/60">Current State</span></motion.div>
        </motion.div>

        <footer className="pt-6 flex justify-center"><Link href="/settings" className="text-xs text-muted/40 hover:text-muted transition-colors flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>Settings</Link></footer>
      </main>
    </div>
  );
}