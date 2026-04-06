"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface HaroldMascotProps {
  size?: number;
  animate?: boolean;
  glow?: boolean;
  className?: string;
}

/**
 * Harold mascot with organic styling — rounded corners, soft shadow,
 * subtle glow, and playful animation so it doesn't look cut-and-pasted.
 */
export default function HaroldMascot({ size = 120, animate = true, glow = true, className = "" }: HaroldMascotProps) {
  const content = (
    <div className={`relative inline-block ${className}`}>
      {/* Glow aura */}
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-[28%] blur-2xl"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.25), rgba(59,130,246,0.1), transparent 70%)" }}
          animate={animate ? { scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] } : undefined}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {/* Mascot image */}
      <Image
        src="/harold-mascot.png"
        alt="Harold"
        width={size}
        height={size}
        className="relative z-10 rounded-[28%] shadow-xl shadow-black/30 ring-1 ring-white/[0.06]"
        style={{ width: size, height: size, objectFit: "cover" }}
      />
      {/* Playful sparkle particles */}
      {animate && (
        <>
          <motion.div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent z-20" animate={{ scale: [0, 1, 0], opacity: [0, 0.8, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} />
          <motion.div className="absolute top-2 -left-2 w-2 h-2 rounded-full bg-accent-blue z-20" animate={{ scale: [0, 1, 0], opacity: [0, 0.7, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1 }} />
          <motion.div className="absolute -bottom-1 right-3 w-2 h-2 rounded-full bg-accent-pink z-20" animate={{ scale: [0, 1, 0], opacity: [0, 0.6, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1.8 }} />
        </>
      )}
    </div>
  );

  if (!animate) return content;

  return (
    <motion.div
      animate={{ y: [0, -8, 0], rotate: [0, 2, -1, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {content}
    </motion.div>
  );
}
