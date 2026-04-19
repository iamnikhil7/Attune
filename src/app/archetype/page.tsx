"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { archetypes, type Archetype } from "@/lib/archetypes";
import PillButton from "@/components/PillButton";
import MascotImage from "@/components/MascotImage";
import { ARCHETYPE_MASCOT } from "@/lib/mascots";

/** Poetic display names + taglines for each archetype reveal. */
const DISPLAY: Record<number, { displayName: string; tagline: string }> = {
  1: {
    displayName: "The Burnt-Out Professional",
    tagline:
      "You push hard & show up, but sometimes the grind buries the person you actually want to be.",
  },
  2: {
    displayName: "The Driven Drifter",
    tagline:
      "You move fast & stay busy, but sometimes that momentum carries you past the things that matter most.",
  },
  3: {
    displayName: "The Selfless Anchor",
    tagline:
      "You hold everyone else steady — Harold wants to make sure you stay steady too.",
  },
  4: {
    displayName: "The Social Butterfly",
    tagline:
      "Connection is your fuel. Harold helps you notice when the party ends and you need yourself back.",
  },
  5: {
    displayName: "The Night Owl",
    tagline:
      "You come alive after dark. Harold helps you protect mornings from the decisions of the night before.",
  },
  6: {
    displayName: "The Comfort Seeker",
    tagline:
      "Food, screens, softness — they all meet a real need. Harold helps you notice what's underneath.",
  },
  7: {
    displayName: "The Serial Starter",
    tagline:
      "You love a fresh start. Harold helps you finish one quiet lap before the next launch.",
  },
  8: {
    displayName: "The Mindless Grazer",
    tagline:
      "Little moments add up. Harold helps you notice the nibbles before they notice you.",
  },
  9: {
    displayName: "The Perfectionist Quitter",
    tagline:
      "One slip shouldn't topple the whole tower. Harold helps you stay imperfect and in motion.",
  },
  10: {
    displayName: "The Mindful Aspirant",
    tagline:
      "You're already listening. Harold just hands you the quieter signals you might miss.",
  },
};

export default function ArchetypeRevealPage() {
  const router = useRouter();
  const [archetype, setArchetype] = useState<Archetype | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("harold_profile");
      if (!raw) {
        router.replace("/onboarding");
        return;
      }
      const profile = JSON.parse(raw);
      const a = archetypes.find((x) => x.id === profile.archetypeId);
      setArchetype(a ?? archetypes[1]);
    } catch {
      setArchetype(archetypes[1]);
    }
  }, [router]);

  if (!archetype) return null;

  const display = DISPLAY[archetype.id] ?? {
    displayName: archetype.name,
    tagline: archetype.description,
  };

  return (
    <div
      className="relative min-h-full flex flex-col"
      style={{
        background:
          "radial-gradient(130% 80% at 50% 12%, #DEE9F4 0%, #F2ECE4 55%, #EFE6D7 100%)",
      }}
    >
      {/* Top label */}
      <div className="flex items-center justify-center pt-14 pb-2">
        <span
          className="text-xs tracking-[0.2em] uppercase"
          style={{ color: "var(--muted-soft)" }}
        >
          Your Archtype
        </span>
      </div>

      <div className="flex-1 px-5 py-3 flex flex-col items-center">
        {/* Crew lockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative mb-5"
        >
          <div
            className="absolute inset-0 blur-2xl rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(circle, rgba(179,200,230,0.45), transparent 70%)",
            }}
          />
          <div className="relative flex items-end justify-center gap-2">
            <MascotImage
              name="yellow-peaceful"
              alt=""
              width={58}
              height={58}
              className="object-contain -rotate-6 opacity-85"
            />
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <MascotImage
                name={ARCHETYPE_MASCOT[archetype.id] ?? "blue-angry"}
                alt={display.displayName}
                width={140}
                height={140}
                className="object-contain"
                style={{
                  filter: "drop-shadow(0 16px 32px rgba(100,80,60,0.3))",
                }}
              />
            </motion.div>
            <MascotImage
              name="white-peaceful"
              alt=""
              width={58}
              height={58}
              className="object-contain rotate-6 opacity-85"
            />
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-4"
          style={{
            fontFamily: '"DM Serif Display", Georgia, serif',
            fontStyle: "italic",
            color: "#2C2418",
            fontSize: "clamp(1.6rem, 6vw, 2.1rem)",
          }}
        >
          {display.displayName}
        </motion.h1>

        {/* Description card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full rounded-2xl p-5 mb-5"
          style={{
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(180,165,140,0.25)",
            boxShadow: "0 6px 24px rgba(61,53,41,0.08)",
          }}
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: "#2C2418" }}
          >
            <span className="mr-1">⚡</span>
            {display.tagline}
          </p>
          <p
            className="text-sm leading-relaxed mt-3"
            style={{ color: "var(--muted)" }}
          >
            <span className="mr-1">🧡</span>
            Harold &amp; Crew will help you slow down just enough to notice what
            your body &amp; mind are telling you.
          </p>
        </motion.div>

        {/* Journey */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full flex items-center gap-2 mb-8 px-2"
        >
          <div className="flex flex-col items-center gap-1">
            <MascotImage
              name={ARCHETYPE_MASCOT[archetype.id] ?? "blue-angry"}
              alt="You're here"
              width={48}
              height={48}
              className="object-contain"
              style={{ filter: "grayscale(30%) brightness(0.95)" }}
            />
            <span
              className="text-[10px]"
              style={{ color: "var(--muted-soft)" }}
            >
              You&rsquo;re here
            </span>
          </div>
          <div
            className="flex-1 h-[2px] rounded-full"
            style={{
              background:
                "repeating-linear-gradient(90deg, rgba(139,111,71,0.55) 0 4px, transparent 4px 10px)",
            }}
          />
          <div className="flex flex-col items-center gap-1">
            <MascotImage
              name="harold-happy"
              alt="What awaits"
              width={48}
              height={48}
              className="object-contain"
              style={{
                filter: "drop-shadow(0 6px 14px rgba(100,80,60,0.3))",
              }}
            />
            <span className="text-[10px]" style={{ color: "var(--accent)" }}>
              What awaits
            </span>
          </div>
        </motion.div>

        {/* Prompt */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mb-5"
          style={{
            fontFamily: '"DM Serif Display", Georgia, serif',
            fontStyle: "italic",
            color: "#5C4F3D",
            fontSize: "clamp(1.05rem, 4.2vw, 1.3rem)",
            lineHeight: 1.3,
          }}
        >
          How would it feel if you were more
          <br />
          like that best version of yourself?
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="w-full mt-auto"
        >
          <PillButton href="/hub">Let&rsquo;s find out</PillButton>
        </motion.div>
      </div>

      <div className="pb-6" />
    </div>
  );
}
