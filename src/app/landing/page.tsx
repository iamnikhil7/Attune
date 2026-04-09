"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Archetype previews ───────────────────────────────────────── */
const archetypes = [
  {
    icon: "🔥",
    name: "The Burnt-Out Professional",
    short: "Running on fumes, surviving on caffeine and delivery apps.",
    color: "#D97706",
  },
  {
    icon: "🏃",
    name: "The Former Athlete",
    short: "Once fit, now struggling as old habits stopped working.",
    color: "#059669",
  },
  {
    icon: "💛",
    name: "The Overwhelmed Parent",
    short: "Putting everyone first, forgetting to take care of yourself.",
    color: "#E11D48",
  },
  {
    icon: "🌙",
    name: "The Night Owl",
    short: "Comes alive after dark, worst decisions between 10pm-2am.",
    color: "#6366F1",
  },
  {
    icon: "🚀",
    name: "The Serial Starter",
    short: "Tried every diet & app. Starts strong, fades fast.",
    color: "#EA580C",
  },
  {
    icon: "🧘",
    name: "The Mindful Aspirant",
    short: "Already on the journey, needs tools to stay consistent.",
    color: "#0D9488",
  },
];

const steps = [
  {
    n: "01",
    title: "Observe",
    desc: "Harold quietly watches your patterns — sleep, energy, movement. No dashboards, no judgment. Just gentle understanding in the background.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C6B4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "Reflect",
    desc: "Your patterns become simple, human reflections. You see how you're doing through motion and feeling — not charts or numbers.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C6B4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a9 9 0 0 0 0 18c1.5 0 2.5-.5 2.5-.5" />
        <path d="M12 3c2 2.5 3 5.5 3 9s-1 6.5-3 9" />
        <path d="M12 3c-2 2.5-3 5.5-3 9s1 6.5 3 9" />
        <line x1="3" y1="12" x2="21" y2="12" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "Connect",
    desc: "Harold suggests 2–4 real-world group activities that fit your current state. Run clubs, walks, sports — real communities, not digital ones.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C6B4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

/* ─── Page ─────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      localStorage.setItem("haroldcrew_waitlist_email", email);
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        background: "linear-gradient(180deg, #F5F0E8 0%, #EDE7DC 30%, #E8E0D4 60%, #F2ECE4 100%)",
        color: "#3D3529",
        fontFamily: '"Inter", system-ui, sans-serif',
      }}
    >
      {/* ── Subtle top nav ──────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex items-center justify-between px-6 sm:px-10 py-5 max-w-5xl mx-auto"
      >
        <div className="flex items-center gap-2.5">
          <Image
            src="/harold-mascot.png"
            alt="Harold"
            width={36}
            height={36}
            className="rounded-xl shadow-sm"
          />
          <span
            className="text-lg tracking-tight"
            style={{ fontFamily: '"DM Serif Display", Georgia, serif' }}
          >
            Harold &amp; Crew
          </span>
        </div>
        <Link
          href="/onboarding"
          className="text-sm font-medium px-5 py-2 rounded-full transition-all"
          style={{
            background: "#3D3529",
            color: "#F5F0E8",
          }}
        >
          Get Started
        </Link>
      </motion.nav>

      {/* ── 1. HERO ─────────────────────────────────────── */}
      <section className="pt-10 sm:pt-16 pb-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Harold mascot — floating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 inline-block"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/harold-mascot.png"
                alt="Harold — your wellness companion"
                width={180}
                height={180}
                className="rounded-[32%] mx-auto"
                style={{
                  filter: "drop-shadow(0 20px 40px rgba(100,80,60,0.15))",
                }}
              />
            </motion.div>
          </motion.div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-6xl leading-[1.08] tracking-tight mb-5"
            style={{ fontFamily: '"DM Serif Display", Georgia, serif', color: "#2C2418" }}
          >
            {["You", "haven't", "lost", "yourself."].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 25, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.6,
                  delay: 0.4 + i * 0.12,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            ))}
            <br />
            {["You", "just", "drifted."].map((word, i) => (
              <motion.span
                key={`b-${word}`}
                initial={{ opacity: 0, y: 25, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.6,
                  delay: 0.9 + i * 0.12,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="inline-block mr-[0.25em]"
                style={word === "drifted." ? { color: "#8B6F47" } : {}}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="text-base sm:text-lg leading-relaxed max-w-lg mx-auto mb-10"
            style={{ color: "#6B5D4D" }}
          >
            Harold is a gentle companion who helps you notice your patterns,
            understand your rhythms, and reconnect with the version of yourself
            you actually like.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.7 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold shadow-lg transition-all"
                style={{
                  background: "#3D3529",
                  color: "#F5F0E8",
                  boxShadow: "0 8px 30px rgba(61,53,41,0.2)",
                }}
              >
                Meet Harold
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <a
                href="#how-it-works"
                className="inline-block px-7 py-3.5 rounded-full text-sm font-medium border transition-all"
                style={{
                  borderColor: "rgba(61,53,41,0.2)",
                  color: "#5C4F3D",
                }}
              >
                How It Works
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. EMPATHY SECTION ──────────────────────────── */}
      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <p
              className="text-xs uppercase tracking-[0.15em] mb-5 font-medium"
              style={{ color: "#9C8B75" }}
            >
              We get it
            </p>
            <h2
              className="text-3xl sm:text-4xl leading-[1.15] mb-6"
              style={{ fontFamily: '"DM Serif Display", Georgia, serif', color: "#2C2418" }}
            >
              Somewhere along the way, life got louder than you did.
            </h2>
          </motion.div>

          <div className="space-y-5" style={{ color: "#6B5D4D" }}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base leading-relaxed"
            >
              You used to know what made you feel good. You had your routines, your
              people, your rhythm. But slowly — through job changes, moves,
              responsibilities, or just the weight of adulting — you drifted. Not
              dramatically. Just enough that one day you looked up and thought:
            </motion.p>

            <motion.blockquote
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="pl-5 my-8 text-xl sm:text-2xl leading-relaxed"
              style={{
                fontFamily: '"DM Serif Display", Georgia, serif',
                color: "#8B6F47",
                borderLeft: "3px solid #C4AD8F",
              }}
            >
              &ldquo;When did I stop feeling like myself?&rdquo;
            </motion.blockquote>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base leading-relaxed"
            >
              Harold &amp; Crew isn&apos;t another tracker that makes you feel bad
              about what you ate. It&apos;s a quiet companion that helps you{" "}
              <strong style={{ color: "#3D3529" }}>notice</strong> — really notice
              — what your body and mind have been trying to tell you.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ─────────────────────────────── */}
      <section id="how-it-works" className="py-16 sm:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <p
              className="text-xs uppercase tracking-[0.15em] mb-3 font-medium"
              style={{ color: "#9C8B75" }}
            >
              How Harold helps
            </p>
            <h2
              className="text-3xl sm:text-4xl"
              style={{ fontFamily: '"DM Serif Display", Georgia, serif', color: "#2C2418" }}
            >
              No guilt. No graphs. Just gentle awareness.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-5">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.12,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{
                  y: -6,
                  transition: { type: "spring", stiffness: 300 },
                }}
                className="p-7 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(180,165,140,0.2)",
                  boxShadow: "0 4px 20px rgba(100,80,60,0.06)",
                }}
              >
                <div className="mb-4">{s.icon}</div>
                <span
                  className="text-xs font-mono"
                  style={{ color: "#B4A58C" }}
                >
                  {s.n}
                </span>
                <h3
                  className="text-lg mt-1 mb-2"
                  style={{ fontFamily: '"DM Serif Display", Georgia, serif', color: "#2C2418" }}
                >
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#7A6C5A" }}>
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. JOURNEY VISUALIZATION ────────────────────── */}
      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="p-8 sm:p-10 rounded-3xl text-center"
            style={{
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(180,165,140,0.2)",
              boxShadow: "0 8px 40px rgba(100,80,60,0.06)",
            }}
          >
            <p
              className="text-xs uppercase tracking-[0.15em] mb-6 font-medium"
              style={{ color: "#9C8B75" }}
            >
              Your journey
            </p>

            {/* Journey path */}
            <div className="flex items-center justify-center gap-0 mb-8 px-4">
              {/* Start state */}
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="text-4xl mb-2"
                >
                  😔
                </motion.div>
                <span className="text-xs font-medium" style={{ color: "#9C8B75" }}>
                  Drifting
                </span>
              </div>

              {/* Path line */}
              <div className="flex-1 mx-3 relative h-[2px]">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "linear-gradient(90deg, #C4AD8F, #8B6F47)" }}
                />
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                  style={{
                    background: "#8B6F47",
                    boxShadow: "0 0 10px rgba(139,111,71,0.4)",
                  }}
                  animate={{ left: ["10%", "90%", "10%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              {/* Harold in the middle */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center -mt-2"
              >
                <Image
                  src="/harold-mascot.png"
                  alt="Harold"
                  width={56}
                  height={56}
                  className="rounded-[30%] mb-1"
                  style={{ filter: "drop-shadow(0 4px 12px rgba(100,80,60,0.15))" }}
                />
                <span className="text-[10px] font-semibold" style={{ color: "#8B6F47" }}>
                  Harold
                </span>
              </motion.div>

              {/* Path line */}
              <div className="flex-1 mx-3 relative h-[2px]">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "linear-gradient(90deg, #8B6F47, #6B8F6B)" }}
                />
              </div>

              {/* End state */}
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  className="text-4xl mb-2"
                >
                  😌
                </motion.div>
                <span className="text-xs font-medium" style={{ color: "#6B8F6B" }}>
                  In rhythm
                </span>
              </div>
            </div>

            <p
              className="text-sm leading-relaxed"
              style={{ color: "#7A6C5A" }}
            >
              Harold meets you exactly where you are — no matter how far
              you&apos;ve drifted — and walks alongside you back to balance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 5. ARCHETYPES PREVIEW ───────────────────────── */}
      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <p
              className="text-xs uppercase tracking-[0.15em] mb-3 font-medium"
              style={{ color: "#9C8B75" }}
            >
              10 archetypes
            </p>
            <h2
              className="text-3xl sm:text-4xl mb-3"
              style={{ fontFamily: '"DM Serif Display", Georgia, serif', color: "#2C2418" }}
            >
              Which one sounds like you?
            </h2>
            <p className="text-base max-w-md mx-auto" style={{ color: "#7A6C5A" }}>
              Harold starts by understanding your patterns. A short quiz reveals
              your archetype — no judgment, just clarity.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {archetypes.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{
                  y: -4,
                  transition: { type: "spring", stiffness: 400, damping: 20 },
                }}
                className="p-5 rounded-xl cursor-default"
                style={{
                  background: "rgba(255,255,255,0.5)",
                  border: "1px solid rgba(180,165,140,0.15)",
                  boxShadow: "0 2px 12px rgba(100,80,60,0.04)",
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{a.icon}</span>
                  <div>
                    <h3
                      className="text-sm font-semibold mb-1"
                      style={{ color: "#2C2418" }}
                    >
                      {a.name}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: "#7A6C5A" }}>
                      {a.short}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6 text-sm"
            style={{ color: "#9C8B75" }}
          >
            + 4 more archetypes discovered during onboarding
          </motion.p>
        </div>
      </section>

      {/* ── 6. EMOTIONAL CTA ────────────────────────────── */}
      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-3xl sm:text-4xl leading-[1.2] mb-6"
              style={{
                fontFamily: '"DM Serif Display", Georgia, serif',
                color: "#2C2418",
              }}
            >
              How would it feel to be{" "}
              <span style={{ color: "#8B6F47" }}>more like that best version</span>{" "}
              of yourself?
            </h2>

            <p
              className="text-base leading-relaxed mb-10 max-w-md mx-auto"
              style={{ color: "#6B5D4D" }}
            >
              Not a fantasy version. Not a social media version. The version
              that sleeps well, moves with purpose, and feels{" "}
              <em>settled</em> in their own skin.
            </p>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold shadow-lg transition-all"
                style={{
                  background: "#3D3529",
                  color: "#F5F0E8",
                  boxShadow: "0 10px 40px rgba(61,53,41,0.2)",
                }}
              >
                Let&apos;s find out
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 7. WAITLIST ─────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="p-8 sm:p-10 rounded-3xl text-center"
            style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(180,165,140,0.2)",
              boxShadow: "0 8px 40px rgba(100,80,60,0.06)",
            }}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mb-4"
            >
              <Image
                src="/harold-mascot.png"
                alt="Harold"
                width={64}
                height={64}
                className="rounded-[30%] mx-auto"
                style={{ filter: "drop-shadow(0 4px 12px rgba(100,80,60,0.12))" }}
              />
            </motion.div>

            <h3
              className="text-xl sm:text-2xl mb-2"
              style={{ fontFamily: '"DM Serif Display", Georgia, serif', color: "#2C2418" }}
            >
              Join the community
            </h3>
            <p className="text-sm mb-6" style={{ color: "#7A6C5A" }}>
              Be among the first to meet Harold. Early access is opening soon.
            </p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-4 px-5 rounded-xl"
                  style={{
                    background: "rgba(34,139,34,0.08)",
                    border: "1px solid rgba(34,139,34,0.15)",
                  }}
                >
                  <p className="text-sm font-medium" style={{ color: "#2D7A2D" }}>
                    You&apos;re on the list! We&apos;ll be in touch soon.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSignup}
                  className="flex flex-col sm:flex-row gap-2.5"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    className="flex-1 px-4 py-3 rounded-xl text-sm transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.7)",
                      border: "1px solid rgba(180,165,140,0.25)",
                      color: "#3D3529",
                      outline: "none",
                    }}
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-6 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
                    style={{
                      background: "#3D3529",
                      color: "#F5F0E8",
                      boxShadow: "0 4px 16px rgba(61,53,41,0.15)",
                    }}
                  >
                    Sign Up
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="text-xs mt-4" style={{ color: "#B4A58C" }}>
              No spam. Just awareness.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer
        className="py-10 px-6"
        style={{ borderTop: "1px solid rgba(180,165,140,0.2)" }}
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/harold-mascot.png"
              alt="Harold"
              width={24}
              height={24}
              className="rounded-lg"
            />
            <span className="text-sm font-semibold" style={{ color: "#5C4F3D" }}>
              Harold &amp; Crew
            </span>
          </div>
          <p className="text-xs" style={{ color: "#B4A58C" }}>
            &copy; {new Date().getFullYear()} Harold &amp; Crew. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
