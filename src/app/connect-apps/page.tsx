"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PhoneHeader from "@/components/PhoneHeader";
import PillButton from "@/components/PillButton";
import MascotImage from "@/components/MascotImage";

interface AppRow {
  key: string;
  name: string;
  category: string;
  glyph: string;
  iconBg: string;
  iconColor: string;
}

const APPS: AppRow[] = [
  {
    key: "apple_health",
    name: "Apple Health",
    category: "Health & Performance tracker",
    glyph: "\u2764",
    iconBg: "#FDE2E4",
    iconColor: "#E11D48",
  },
  {
    key: "oura",
    name: "Oura Ring",
    category: "Health & Performance tracker",
    glyph: "\u25CB",
    iconBg: "#F3F4F6",
    iconColor: "#111827",
  },
  {
    key: "whoop",
    name: "Whoop",
    category: "Health & Performance tracker",
    glyph: "W",
    iconBg: "#111827",
    iconColor: "#FFFFFF",
  },
  {
    key: "myfitnesspal",
    name: "MyFitnessPal",
    category: "Food & Workout Logging",
    glyph: "\u2708",
    iconBg: "#DBEAFE",
    iconColor: "#2563EB",
  },
  {
    key: "calai",
    name: "Cal.ai",
    category: "Food Logging",
    glyph: "Cal",
    iconBg: "#111827",
    iconColor: "#FFFFFF",
  },
];

export default function ConnectAppsPage() {
  const router = useRouter();
  const [connected, setConnected] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setConnected((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleReveal = () => {
    try {
      localStorage.setItem(
        "harold_connected_apps",
        JSON.stringify(Object.keys(connected).filter((k) => connected[k])),
      );
    } catch {}
    router.push("/archetype");
  };

  return (
    <div
      className="relative min-h-full flex flex-col"
      style={{ background: "var(--gradient-page)" }}
    >
      {/* Top Harold peek — curious, happy */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 0.95, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-20 right-0 z-0 pointer-events-none"
      >
        <MascotImage
          name="harold-peaceful"
          alt=""
          width={110}
          height={110}
          className="-rotate-12 translate-x-6 object-contain"
          style={{ filter: "drop-shadow(0 10px 20px rgba(100,80,60,0.2))" }}
        />
      </motion.div>

      <PhoneHeader />

      <div className="flex-1 px-5 pt-2 pb-6 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="leading-[1.15] mb-3"
          style={{
            fontFamily: '"DM Serif Display", Georgia, serif',
            fontStyle: "italic",
            color: "#2C2418",
            fontSize: "clamp(1.55rem, 5.5vw, 2rem)",
            maxWidth: "17ch",
          }}
        >
          Want Harold to observe your patterns?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm leading-relaxed mb-6"
          style={{ color: "var(--muted)", maxWidth: "34ch" }}
        >
          He can look at your health, sleep, recovery, &amp; activity data to
          help you understand what it means in your daily life.
        </motion.p>

        {/* App list */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl overflow-hidden mb-3"
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(180,165,140,0.25)",
            boxShadow: "0 10px 30px rgba(61,53,41,0.08)",
          }}
        >
          {APPS.map((app, idx) => {
            const isOn = !!connected[app.key];
            return (
              <button
                key={app.key}
                onClick={() => toggle(app.key)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/60 transition-colors"
                style={{
                  borderTop:
                    idx === 0 ? "none" : "1px solid rgba(180,165,140,0.18)",
                }}
              >
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                  style={{ background: app.iconBg, color: app.iconColor }}
                >
                  {app.glyph}
                </span>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-semibold truncate"
                    style={{ color: "#2C2418" }}
                  >
                    {app.name}
                  </div>
                  <div
                    className="text-xs truncate"
                    style={{ color: "var(--muted-soft)" }}
                  >
                    {app.category}
                  </div>
                </div>
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-base font-semibold transition-all"
                  style={{
                    background: isOn ? "var(--accent)" : "rgba(180,165,140,0.15)",
                    color: isOn ? "#F5F0E8" : "var(--muted)",
                  }}
                >
                  {isOn ? "\u2713" : "+"}
                </span>
              </button>
            );
          })}
        </motion.div>

        <button
          className="w-full py-3 rounded-2xl text-sm font-semibold"
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(180,165,140,0.25)",
            color: "#2C2418",
          }}
        >
          + Add
        </button>
      </div>

      {/* Bottom Crew peek — yellow friend waving */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.95, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute bottom-28 left-0 z-0 pointer-events-none"
      >
        <MascotImage
          name="yellow-happy"
          alt=""
          width={78}
          height={78}
          className="rotate-6 -translate-x-3 object-contain"
          style={{ filter: "drop-shadow(0 8px 16px rgba(100,80,60,0.18))" }}
        />
      </motion.div>

      {/* CTA — warm gradient anchor */}
      <div
        className="sticky bottom-0 px-5 pb-8 pt-6 z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(245,240,232,0) 0%, rgba(217,178,125,0.3) 25%, rgba(139,111,71,0.85) 80%, #5C4F3D 100%)",
        }}
      >
        <PillButton onClick={handleReveal}>Reveal Identity</PillButton>
      </div>
    </div>
  );
}
