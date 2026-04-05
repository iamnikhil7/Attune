"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";

/* ─── Data ─────────────────────────────────────────────────────────── */

const team = [
  {
    name: "Andy Igwe",
    role: "Founder & Researcher",
    bio: "Focused on creating experiences that feel human-first, not tech-first.",
    photo: "/Andy.png",
  },
  {
    name: "Mariana Alonso",
    role: "Founder & Designer",
    bio: "Bridging the gap between behavioral psychology and everyday digital experiences.",
    photo: "/Mariana.png",
  },
  {
    name: "Neel Pendse",
    role: "Founder, Designer & Researcher",
    bio: "Driven by the belief that great engineering can make complex things feel effortless.",
    photo: "/Neel.png",
  },
  {
    name: "Nikhil Khanal",
    role: "Founder, Designer & Developer",
    bio: "Passionate about building technology that meets people where they are, not where they should be.",
    photo: "/Nikhil.jpg",
  },
];

const steps = [
  {
    n: "01",
    title: "Observe",
    desc: "Harold quietly observes patterns from your health data and daily rhythms. No dashboards, no metrics\u2014just understanding in the background.",
  },
  {
    n: "02",
    title: "Reflect",
    desc: "Harold translates patterns into simple, human-readable reflections. You see how you\u2019re doing through motion and animation\u2014immediately felt, not analyzed.",
  },
  {
    n: "03",
    title: "Connect",
    desc: "The Hub presents 2\u20134 real-world group activities that fit your current state. Run clubs, walks, recreational sports\u2014real communities, not digital ones.",
  },
];

const stats = [
  { value: "2-4x", label: "Weekly app visits" },
  { value: "3-4", label: "Activities per month" },
  { value: "Zero", label: "Dashboards or charts" },
];

/* ─── Helpers ──────────────────────────────────────────────────────── */

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────── */

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const videoRef = useRef<HTMLDivElement>(null);
  const videoInView = useInView(videoRef, { once: true, margin: "-100px" });

  const aboutRef = useRef<HTMLDivElement>(null);
  const aboutInView = useInView(aboutRef, { once: true, margin: "-100px" });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      localStorage.setItem("haroldcrew_waitlist_email", email);
      setSubmitted(true);
      setEmail("");
    }
  };

  const currentYear = new Date().getFullYear();

  const headlineWords = ["Regain", "your", "rhythm"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── 1. HERO ────────────────────────────────────────────────── */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="min-h-[100vh] flex flex-col items-center justify-center px-6 pt-16 relative overflow-hidden"
      >
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[180px]"
            style={{
              background:
                "radial-gradient(circle, rgba(255,136,151,0.1) 0%, rgba(255,136,151,0.04) 40%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center">
          {/* Harold mascot */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-6"
          >
            <Image
              src="/harold-mascot.png"
              alt="Harold the lion mascot"
              width={160}
              height={160}
              priority
              className="w-40 h-40 object-contain"
            />
          </motion.div>

          {/* Logo text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif text-2xl tracking-tight mb-8"
          >
            Harold &amp; Crew
          </motion.p>

          {/* Headline — staggered word reveal */}
          <h1 className="font-serif text-5xl sm:text-7xl leading-[1.05] tracking-tight mb-6 flex flex-wrap justify-center gap-x-4">
            {headlineWords.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.7,
                  delay: 0.5 + i * 0.15,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1, ease: "easeOut" }}
            className="text-base text-muted max-w-lg mx-auto leading-relaxed mb-10"
          >
            A companion who helps you understand your patterns, connect with
            your community, and restore balance to your life.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/onboarding"
                className="inline-block px-7 py-3 rounded-full text-sm font-medium transition-all"
                style={{ background: "#FF8897", color: "#0B0B0B" }}
              >
                Meet Harold
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="#how-it-works"
                className="inline-block px-7 py-3 rounded-full border border-white/10 text-sm font-medium hover:bg-white/[0.03] transition-all"
              >
                How It Works
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.svg
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted/40"
          >
            <polyline points="6 9 12 15 18 9" />
          </motion.svg>
        </motion.div>
      </motion.section>

      {/* ── 2. VIDEO SECTION ───────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/[0.04]" ref={videoRef}>
        <div className="max-w-4xl mx-auto">
          <AnimatedSection className="text-center mb-8">
            <p className="text-xs uppercase tracking-wider text-muted/50 mb-3">
              See Harold in action
            </p>
          </AnimatedSection>

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={
              videoInView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 60, scale: 0.96 }
            }
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative aspect-video rounded-2xl bg-surface border border-border overflow-hidden flex items-center justify-center group cursor-pointer"
          >
            {/* Play button */}
            <motion.div
              whileHover={{ scale: 1.12 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-center gap-4"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center transition-shadow duration-300 group-hover:shadow-[0_0_40px_rgba(255,136,151,0.25)]"
                style={{ background: "rgba(255,136,151,0.12)" }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="#FF8897"
                  className="ml-1"
                >
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </div>
              <span className="text-sm text-muted/50">Coming Soon</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. ABOUT ───────────────────────────────────────────────── */}
      <section
        id="about"
        className="py-24 px-6 border-t border-white/[0.04]"
        ref={aboutRef}
      >
        <div className="max-w-2xl mx-auto">
          <AnimatedSection>
            <p className="text-xs uppercase tracking-wider text-muted/50 mb-6">
              About Harold &amp; Crew
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h2 className="font-serif text-3xl sm:text-4xl leading-[1.15] mb-8">
              {aboutInView && (
                <>
                  {["Understanding", "patterns,", "not", "tracking", "metrics"].map(
                    (word, i) => (
                      <motion.span
                        key={word}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.15 + i * 0.08,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        className="inline-block mr-[0.3em]"
                      >
                        {word}
                      </motion.span>
                    )
                  )}
                </>
              )}
            </h2>
          </AnimatedSection>

          <div className="space-y-5 text-muted leading-relaxed">
            <AnimatedSection delay={0.3}>
              <p>
                Modern life has become increasingly unstructured. Many people
                have access to health data but no meaningful way to interpret it.
                Simultaneously, they&apos;ve lost regular, shared physical
                activity&mdash;the very thing that creates rhythm, consistency,
                and connection.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.45}>
              <p>
                Harold &amp; Crew exists to help you regain that rhythm. Through
                a calm, character-led interface, Harold observes your patterns,
                translates them into simple reflections, and connects you to
                real-world group activities that fit your current state.
              </p>
            </AnimatedSection>

            <motion.blockquote
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="text-foreground/80 font-serif text-xl leading-relaxed pl-5 border-l-2 border-harold/30 my-8"
            >
              Behavior change is not driven by instruction, but by perception.
            </motion.blockquote>
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-24 px-6 border-t border-white/[0.04]"
      >
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <p className="text-xs uppercase tracking-wider text-muted/50 mb-3">
              How It Works
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl mb-12">
              Three simple steps to restored rhythm
            </h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-3 gap-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.12,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{
                  y: -8,
                  transition: { type: "spring", stiffness: 300 },
                }}
                className="relative p-6 rounded-2xl bg-surface border border-border overflow-hidden"
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{
                    background:
                      "linear-gradient(90deg, #FF8897 0%, rgba(255,136,151,0.2) 100%)",
                  }}
                />
                <span className="text-xs font-mono text-muted/50">{s.n}</span>
                <h3 className="text-sm font-medium mt-3 mb-2">{s.title}</h3>
                <p className="text-sm text-muted/50 leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. STATS ───────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                }}
                className="p-8 rounded-2xl bg-surface border border-border text-center"
              >
                <motion.p
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + i * 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 12,
                  }}
                  className="font-serif text-4xl sm:text-5xl mb-2"
                  style={{ color: "#FF8897" }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-muted/50">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. TEAM ────────────────────────────────────────────────── */}
      <section
        id="team"
        className="py-24 px-6 border-t border-white/[0.04]"
      >
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <p className="text-xs uppercase tracking-wider text-muted/50 mb-3">
              The Team
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl mb-4">
              Built by people who get it
            </h2>
            <p className="text-muted leading-relaxed mb-12 max-w-xl">
              We&apos;ve all experienced identity drift &mdash; slowly becoming
              someone we didn&apos;t fully recognize. Harold &amp; Crew is the
              tool we wished existed.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
                className="p-6 rounded-2xl bg-surface border border-border text-center"
              >
                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm font-semibold mb-1">{member.name}</h3>
                <p className="text-xs text-accent/70 mb-3">{member.role}</p>
                <p className="text-xs text-muted/50 leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. SIGN UP / CTA ──────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="font-serif text-2xl sm:text-3xl mb-3">
              Join the community
            </h2>
            <p className="text-sm text-muted mb-8 max-w-md mx-auto">
              Be among the first to experience health awareness that actually
              works. Sign up to get early access and updates.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="py-4 px-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                >
                  <p className="text-emerald-400 text-sm font-medium">
                    You&apos;re on the list! We&apos;ll be in touch soon.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSignup}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-4 py-3 rounded-xl bg-background border border-white/10 text-sm text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent/40 transition-colors"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
                    style={{ background: "#FF8897", color: "#0B0B0B" }}
                  >
                    Sign Up
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="text-xs text-muted/30 mt-4">
              No spam. Just awareness.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 8. FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.04] py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-serif text-sm font-medium">
              Harold &amp; Crew
            </span>
            <span className="text-xs text-muted/25">Regain your rhythm</span>
            <span className="text-xs text-muted/25">
              &copy; {currentYear} Harold &amp; Crew. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
