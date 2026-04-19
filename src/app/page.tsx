"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import MascotImage from "@/components/MascotImage";

/**
 * Harold & Crew marketing landing — "Helping you live a more meaningful life."
 *
 * Structure (top → bottom):
 *   1. Nav
 *   2. Hero — cream pill badge + lion mascot peek + 4-panel lifestyle collage
 *   3. AI Coach — pink heart mascot + two coaching bubbles
 *   4. Features — four pillar cards (mornings, movement, nutrition, mindfulness)
 *   5. Meet Harold — dedicated mascot introduction
 *   6. Calendar sync — integration callout
 *   7. Footer
 */

/* ── 4-panel lifestyle imagery used behind the hero and in sections ─── */
const lifestyle = {
  gym: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
  nutrition:
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80",
  walking:
    "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80",
  morning:
    "https://images.unsplash.com/photo-1507120410856-1f35574c3b45?auto=format&fit=crop&w=600&q=80",
  meadow:
    "https://images.unsplash.com/photo-1501696461415-6bd6660c6742?auto=format&fit=crop&w=1400&q=80",
};

const features = [
  {
    title: "Morning Routine",
    body: "A gentle wake-up and the first 20 minutes of your day — protected.",
    image: lifestyle.morning,
    icon: "🌅",
  },
  {
    title: "Exercise & Movement",
    body: "Walks, runs, home workouts, or the gym — whatever matches your energy.",
    image: lifestyle.gym,
    icon: "🏃",
  },
  {
    title: "Nutrition",
    body: "Real meals over delivery. Small upgrades to what's already in your fridge.",
    image: lifestyle.nutrition,
    icon: "🥗",
  },
  {
    title: "Mindfulness & Wellness",
    body: "A breath, a pause, a walk — calm moments woven through the busy ones.",
    image: lifestyle.walking,
    icon: "🌿",
  },
];

export default function Home() {
  return (
    <div
      className="min-h-full w-full"
      style={{ background: "var(--cream-soft)", color: "var(--foreground)" }}
    >
      <TopNav />
      <HeroSection />
      <AICoachSection />
      <FeaturesSection />
      <MeetHaroldSection />
      <CalendarSection />
      <FooterSection />
    </div>
  );
}

/* ─── 1. Nav ────────────────────────────────────────────────────────── */

function TopNav() {
  return (
    <nav
      className="sticky top-0 z-40 flex items-center justify-between px-5 sm:px-10 py-4"
      style={{
        background: "rgba(250,248,243,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(180,165,140,0.2)",
      }}
    >
      <Link href="/" className="flex items-center gap-2">
        <MascotImage
          name="harold-peaceful"
          alt="Harold"
          width={30}
          height={30}
          className="mascot-img"
        />
        <span
          className="text-base"
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: "italic",
            fontWeight: 600,
            color: "var(--foreground)",
          }}
        >
          Harold &amp; Crew
        </span>
      </Link>
      <div className="hidden sm:flex items-center gap-6 text-sm" style={{ color: "var(--taupe)" }}>
        <a href="#features" className="hover:text-[color:var(--foreground)] transition-colors">
          Features
        </a>
        <a href="#ai-coach" className="hover:text-[color:var(--foreground)] transition-colors">
          AI Coach
        </a>
        <a href="#about" className="hover:text-[color:var(--foreground)] transition-colors">
          About
        </a>
      </div>
      <Link
        href="/onboarding"
        className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold"
        style={{
          background: "#3D3529",
          color: "#F5F0E8",
          boxShadow: "0 8px 20px rgba(61,53,41,0.18)",
        }}
      >
        Get Started
      </Link>
    </nav>
  );
}

/* ─── 2. Hero ───────────────────────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative px-5 sm:px-10 pt-10 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
      {/* Cream pill badge + lion mascot peek */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative max-w-3xl mx-auto flex flex-col items-center"
      >
        <div
          className="relative inline-flex items-center gap-3 px-7 sm:px-10 py-4 sm:py-5 rounded-[40px] shadow-lg"
          style={{
            background: "var(--cream)",
            border: "1px solid rgba(180,165,140,0.35)",
            boxShadow: "0 14px 40px rgba(61,53,41,0.1)",
          }}
        >
          <h1
            className="leading-none"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: "italic",
              fontWeight: 600,
              color: "#2C2418",
              fontSize: "clamp(2.2rem, 7vw, 3.8rem)",
            }}
          >
            Harold &amp; Crew
          </h1>
          {/* Lion mascot peeking from the right of the badge */}
          <motion.div
            animate={{ y: [0, -4, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-6 sm:-right-10 -top-8 sm:-top-12"
          >
            <MascotImage
              name="white-happy"
              alt="Harold the lion"
              width={90}
              height={90}
              className="mascot-img sm:!w-[120px] sm:!h-[120px]"
              style={{ filter: "drop-shadow(0 10px 20px rgba(100,80,60,0.18))" }}
            />
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-center max-w-xl"
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: "italic",
            fontWeight: 400,
            color: "var(--taupe)",
            fontSize: "clamp(1.1rem, 3.2vw, 1.5rem)",
            lineHeight: 1.35,
          }}
        >
          Helping you live a more meaningful life.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 sm:mt-8"
        >
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base"
            style={{
              background: "#3D3529",
              color: "#F5F0E8",
              boxShadow: "0 14px 40px rgba(61,53,41,0.3)",
            }}
          >
            Start Your Journey
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </motion.div>
      </motion.div>

      {/* 4-panel lifestyle collage */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-14 sm:mt-20 max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { src: lifestyle.morning, label: "Morning" },
          { src: lifestyle.gym, label: "Movement" },
          { src: lifestyle.nutrition, label: "Nutrition" },
          { src: lifestyle.walking, label: "Outside" },
        ].map((panel) => (
          <div
            key={panel.label}
            className="relative aspect-square rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 10px 30px rgba(61,53,41,0.12)" }}
          >
            <Image
              src={panel.src}
              alt={panel.label}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              style={{ objectFit: "cover" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <span className="absolute bottom-3 left-3 text-xs uppercase tracking-[0.15em] text-white/95 font-semibold">
              {panel.label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

/* ─── 3. AI Coach ───────────────────────────────────────────────────── */

function AICoachSection() {
  return (
    <section
      id="ai-coach"
      className="relative px-5 sm:px-10 py-16 sm:py-24"
      style={{ background: "var(--cream)" }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Left — lifestyle photo with Harold peek */}
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden"
          style={{ boxShadow: "0 16px 40px rgba(61,53,41,0.15)" }}
        >
          <Image
            src={lifestyle.walking}
            alt="Walking outside"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-6 left-6"
          >
            <MascotImage
              name="harold-love"
              alt="Harold, your AI coach"
              width={110}
              height={110}
              className="mascot-img"
              style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))" }}
            />
          </motion.div>
        </div>

        {/* Right — coaching copy + bubbles */}
        <div>
          <span
            className="text-xs uppercase tracking-[0.2em] font-semibold mb-4 block"
            style={{ color: "var(--amber)" }}
          >
            Your AI Coach
          </span>
          <h2
            className="mb-5"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: "italic",
              fontWeight: 600,
              color: "#2C2418",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              lineHeight: 1.1,
            }}
          >
            A companion who knows what you need, before you do.
          </h2>
          <p
            className="mb-8 max-w-md"
            style={{ color: "var(--taupe)", fontSize: "1rem", lineHeight: 1.6 }}
          >
            Harold reads the signals — your sleep, energy, stress, and schedule —
            then offers the smallest next step. No dashboards. No guilt. Just a
            gentle nudge at the right moment.
          </p>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="coach-bubble"
            >
              <p className="coach-bubble-heading">Feeling overwhelmed?</p>
              <p className="coach-bubble-body">
                Let&rsquo;s try a quick 10-minute{" "}
                <span className="coach-bubble-highlight">walk</span>.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="coach-bubble ml-0 md:ml-8"
            >
              <p className="coach-bubble-heading">It&rsquo;s been a slow day!</p>
              <p className="coach-bubble-body">
                Let&rsquo;s get moving with some{" "}
                <span className="coach-bubble-highlight">exercise</span>.
                You&rsquo;ll feel energized after.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="coach-bubble"
            >
              <p className="coach-bubble-heading">Craving something sweet?</p>
              <p className="coach-bubble-body">
                There&rsquo;s fruit in the fridge — your{" "}
                <span className="coach-bubble-highlight">body</span> will thank you.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 4. Features ──────────────────────────────────────────────────── */

function FeaturesSection() {
  return (
    <section id="features" className="px-5 sm:px-10 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <span
            className="text-xs uppercase tracking-[0.2em] font-semibold mb-4 block"
            style={{ color: "var(--amber)" }}
          >
            The four pillars
          </span>
          <h2
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: "italic",
              fontWeight: 600,
              color: "#2C2418",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              lineHeight: 1.1,
            }}
          >
            Everything Harold notices, gently.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-3xl overflow-hidden"
              style={{
                background: "var(--cream)",
                border: "1px solid rgba(180,165,140,0.25)",
                boxShadow: "0 10px 30px rgba(61,53,41,0.08)",
              }}
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={f.image}
                  alt={f.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-5">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h3
                  className="mb-1.5"
                  style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontStyle: "italic",
                    fontWeight: 600,
                    color: "#2C2418",
                    fontSize: "1.35rem",
                    lineHeight: 1.1,
                  }}
                >
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--taupe)" }}>
                  {f.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 5. Meet Harold ──────────────────────────────────────────────── */

function MeetHaroldSection() {
  return (
    <section
      id="about"
      className="px-5 sm:px-10 py-16 sm:py-24"
      style={{ background: "var(--cream)" }}
    >
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Mascot — large, contained, never cropped */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto"
        >
          <div
            className="absolute inset-0 blur-3xl rounded-full opacity-50"
            style={{
              background:
                "radial-gradient(circle, rgba(212,168,71,0.3), transparent 70%)",
            }}
          />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <MascotImage
              name="white-peaceful"
              alt="Meet Harold"
              width={340}
              height={340}
              className="mascot-img mx-auto"
              style={{
                filter: "drop-shadow(0 24px 48px rgba(100,80,60,0.25))",
              }}
            />
          </motion.div>
          {/* Smaller crew around */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-2 -left-4"
          >
            <MascotImage
              name="yellow-peaceful"
              alt=""
              width={80}
              height={80}
              className="mascot-img"
            />
          </motion.div>
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-4 -right-4"
          >
            <MascotImage
              name="harold-happy"
              alt=""
              width={75}
              height={75}
              className="mascot-img"
            />
          </motion.div>
        </motion.div>

        {/* Copy */}
        <div>
          <span
            className="text-xs uppercase tracking-[0.2em] font-semibold mb-4 block"
            style={{ color: "var(--amber)" }}
          >
            Meet Harold
          </span>
          <h2
            className="mb-5"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: "italic",
              fontWeight: 600,
              color: "#2C2418",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              lineHeight: 1.1,
            }}
          >
            Your gentle companion, and the crew behind him.
          </h2>
          <p
            className="mb-5"
            style={{ color: "var(--taupe)", fontSize: "1rem", lineHeight: 1.6 }}
          >
            Harold is a little lion who noticed you drifting. He&rsquo;s soft,
            curious, and never judgmental — the opposite of every tracker that
            made you feel bad about your weekend.
          </p>
          <p style={{ color: "var(--taupe)", fontSize: "1rem", lineHeight: 1.6 }}>
            Behind him stand the crew — little characters who show up at the
            exact moment you need them. A cheer when you nail a streak. A hand
            when the week gets heavy.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── 6. Calendar sync ─────────────────────────────────────────────── */

function CalendarSection() {
  return (
    <section id="calendar" className="px-5 sm:px-10 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8"
        style={{
          background: "var(--cream)",
          border: "1px solid rgba(180,165,140,0.25)",
          boxShadow: "0 12px 36px rgba(61,53,41,0.1)",
        }}
      >
        <div
          className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex flex-col items-center justify-center"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(180,165,140,0.3)",
            boxShadow: "0 8px 24px rgba(61,53,41,0.1)",
          }}
        >
          <span
            className="text-[10px] uppercase tracking-[0.2em] font-semibold"
            style={{ color: "var(--amber)" }}
          >
            Wed
          </span>
          <span
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 600,
              color: "#2C2418",
              fontSize: "2.5rem",
              lineHeight: 1,
            }}
          >
            17
          </span>
          <div className="flex gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--amber)" }} />
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(139,111,71,0.4)" }} />
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(139,111,71,0.4)" }} />
          </div>
        </div>
        <div className="text-center md:text-left">
          <h3
            className="mb-2"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: "italic",
              fontWeight: 600,
              color: "#2C2418",
              fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
              lineHeight: 1.1,
            }}
          >
            Syncs with your calendar
          </h3>
          <p style={{ color: "var(--taupe)", fontSize: "1rem", lineHeight: 1.55 }}>
            Harold knows your schedule and coaches you around it — back-to-back
            meetings, a late dinner, the 6am flight. Works with Outlook, Google
            Calendar, and Apple Calendar.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── 7. Footer ────────────────────────────────────────────────────── */

function FooterSection() {
  return (
    <footer
      className="px-5 sm:px-10 pt-16 pb-10"
      style={{
        background: "var(--cream-soft)",
        borderTop: "1px solid rgba(180,165,140,0.2)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start gap-10 sm:gap-16">
          {/* Brand */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <MascotImage
                name="white-peaceful"
                alt="Harold"
                width={36}
                height={36}
                className="mascot-img"
              />
              <span
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontStyle: "italic",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  fontSize: "1.2rem",
                }}
              >
                Harold &amp; Crew
              </span>
            </div>
            <p
              className="max-w-xs"
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontStyle: "italic",
                color: "var(--taupe)",
                fontSize: "1rem",
                lineHeight: 1.4,
              }}
            >
              Helping you live a more meaningful life.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 text-sm">
            <FooterCol
              title="Product"
              links={[
                { label: "Features", href: "#features" },
                { label: "AI Coach", href: "#ai-coach" },
                { label: "Get Started", href: "/onboarding" },
              ]}
            />
            <FooterCol
              title="Company"
              links={[
                { label: "About", href: "#about" },
                { label: "Contact", href: "mailto:hello@haroldcrew.com" },
              ]}
            />
            <FooterCol
              title="Legal"
              links={[
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
              ]}
            />
          </div>
        </div>

        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{
            color: "var(--muted-soft)",
            borderTop: "1px solid rgba(180,165,140,0.2)",
          }}
        >
          <span>
            &copy; {new Date().getFullYear()} Harold &amp; Crew. All rights reserved.
          </span>
          <span>Made with care.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p
        className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-3"
        style={{ color: "var(--muted-soft)" }}
      >
        {title}
      </p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="transition-colors"
              style={{ color: "var(--taupe)" }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
