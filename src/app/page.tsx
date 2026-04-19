"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import MascotImage from "@/components/MascotImage";
import { CREW_LINEUP } from "@/lib/mascots";

/**
 * Harold & Crew landing — full-bleed meadow hero with serif italic
 * headlines top and bottom, a small crew lockup in the corner, and
 * a chocolate pill CTA anchored against a warm gradient wash.
 */
export default function Home() {
  return (
    <div className="relative min-h-full w-full overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1501696461415-6bd6660c6742?auto=format&fit=crop&w=1400&q=80"
          alt="Friends walking through a meadow at sunset"
          fill
          priority
          sizes="(max-width: 480px) 100vw, 430px"
          className="object-cover"
        />
        <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-black/55 via-black/15 to-transparent" />
        <div
          className="absolute inset-x-0 bottom-0 h-[55%]"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(217,178,125,0.35) 38%, rgba(139,111,71,0.88) 75%, #5C4F3D 100%)",
          }}
        />
      </div>

      {/* Crew lockup — reads from CREW_LINEUP in src/lib/mascots.ts */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 flex items-center gap-0 px-5 pt-16"
      >
        <div className="flex items-center -space-x-3">
          {CREW_LINEUP.map((name) => (
            <MascotImage
              key={name}
              name={name}
              alt=""
              width={42}
              height={42}
              className="object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.3)]"
            />
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-[calc(100vh-88px)] px-5 pt-6 pb-8">
        {/* Top headline */}
        <motion.div
          initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.8,
            delay: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <h1
            className="text-white leading-[1.1] drop-shadow-lg"
            style={{
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontStyle: "italic",
              fontSize: "clamp(1.9rem, 7.5vw, 2.9rem)",
            }}
          >
            Hey there,
            <br />
            We&rsquo;re Harold &amp; Crew
          </h1>
        </motion.div>

        <div className="flex-1" />

        {/* Bottom headline */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mb-6"
        >
          <h2
            className="text-white leading-[1.1] drop-shadow-lg"
            style={{
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontStyle: "italic",
              fontSize: "clamp(1.7rem, 6.5vw, 2.5rem)",
            }}
          >
            Let&rsquo;s get to know
            <br />
            each other!
          </h2>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <Link
            href="/onboarding"
            className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-full font-semibold text-base"
            style={{
              background: "#3D3529",
              color: "#F5F0E8",
              boxShadow: "0 14px 40px rgba(61,53,41,0.45)",
            }}
          >
            Let&rsquo;s Go!
            <svg
              width="18"
              height="18"
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

          <div className="flex items-center justify-center gap-4 mt-5 text-xs text-white/85">
            <Link href="/auth" className="hover:text-white transition-colors">
              I already have an account
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
