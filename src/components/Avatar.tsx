"use client";
import { useEffect, useState } from "react";

export type AvatarState = "neutral" | "concerned" | "celebrating" | "glowing";

interface AvatarProps {
  archetypeColor: string;
  state?: AvatarState;
  size?: "sm" | "md" | "lg" | "xl";
}

const colorMap: Record<string, { primary: string; secondary: string; glow: string; accent: string }> = {
  amber: { primary: "#f59e0b", secondary: "#d97706", glow: "rgba(245,158,11,0.3)", accent: "#fbbf24" },
  green: { primary: "#22c55e", secondary: "#16a34a", glow: "rgba(34,197,94,0.3)", accent: "#4ade80" },
  rose: { primary: "#f43f5e", secondary: "#e11d48", glow: "rgba(244,63,94,0.3)", accent: "#fb7185" },
  yellow: { primary: "#eab308", secondary: "#ca8a04", glow: "rgba(234,179,8,0.3)", accent: "#facc15" },
  indigo: { primary: "#6366f1", secondary: "#4f46e5", glow: "rgba(99,102,241,0.3)", accent: "#818cf8" },
  pink: { primary: "#ec4899", secondary: "#db2777", glow: "rgba(236,72,153,0.3)", accent: "#f472b6" },
  orange: { primary: "#f97316", secondary: "#ea580c", glow: "rgba(249,115,22,0.3)", accent: "#fb923c" },
  gray: { primary: "#9ca3af", secondary: "#6b7280", glow: "rgba(156,163,175,0.3)", accent: "#d1d5db" },
  slate: { primary: "#64748b", secondary: "#475569", glow: "rgba(100,116,139,0.3)", accent: "#94a3b8" },
  teal: { primary: "#14b8a6", secondary: "#0d9488", glow: "rgba(20,184,166,0.3)", accent: "#2dd4bf" },
};

const sizeMap = {
  sm: { container: 64, body: 28, head: 18, eye: 3, innerGlow: 48 },
  md: { container: 96, body: 40, head: 26, eye: 4, innerGlow: 72 },
  lg: { container: 140, body: 56, head: 36, eye: 5, innerGlow: 108 },
  xl: { container: 200, body: 80, head: 52, eye: 7, innerGlow: 156 },
};

export default function Avatar({ archetypeColor, state = "neutral", size = "md" }: AvatarProps) {
  const [breathePhase, setBreathePhase] = useState(0);
  const [pulsePhase, setPulsePhase] = useState(0);
  const colors = colorMap[archetypeColor] || colorMap.teal;
  const s = sizeMap[size];

  // Breathing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathePhase((p) => (p + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Pulse for celebrating/glowing
  useEffect(() => {
    if (state !== "celebrating" && state !== "glowing") return;
    const interval = setInterval(() => {
      setPulsePhase((p) => (p + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [state]);

  const breathe = Math.sin((breathePhase * Math.PI) / 180);
  const pulse = Math.sin((pulsePhase * Math.PI) / 180);
  const cx = s.container / 2;
  const cy = s.container / 2;

  // State-specific modifiers
  const bodyY = state === "concerned" ? cy + 4 : state === "celebrating" ? cy - 3 : cy;
  const headTilt = state === "concerned" ? 5 : state === "celebrating" ? -3 : 0;
  const eyeOpenness = state === "concerned" ? 0.5 : state === "celebrating" ? 1.3 : 1;
  const shoulderDrop = state === "concerned" ? 3 : state === "celebrating" ? -4 : 0;
  const bodyScale = 1 + breathe * 0.02;
  const glowIntensity = state === "glowing" ? 0.6 + pulse * 0.3 : state === "celebrating" ? 0.4 + pulse * 0.2 : state === "concerned" ? 0.1 : 0.2 + breathe * 0.1;
  const outerGlowSize = state === "glowing" ? s.container * 0.6 : state === "celebrating" ? s.container * 0.5 : s.container * 0.4;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: s.container, height: s.container }}>
      {/* Outer glow */}
      <div
        className="absolute rounded-full transition-all duration-1000"
        style={{
          width: outerGlowSize,
          height: outerGlowSize,
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          opacity: glowIntensity,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <svg
        width={s.container}
        height={s.container}
        viewBox={`0 0 ${s.container} ${s.container}`}
        style={{ overflow: "visible" }}
      >
        {/* Inner glow circle */}
        <circle
          cx={cx}
          cy={cy}
          r={s.innerGlow / 2}
          fill="none"
          stroke={colors.primary}
          strokeWidth="0.5"
          opacity={0.1 + breathe * 0.05}
        />

        {/* Body group */}
        <g transform={`translate(${cx}, ${bodyY}) scale(${bodyScale})`}>
          {/* Body — torso */}
          <ellipse
            cx={0}
            cy={s.body * 0.35 + shoulderDrop}
            rx={s.body * 0.38}
            ry={s.body * 0.42}
            fill={colors.primary}
            opacity={state === "concerned" ? 0.5 : state === "glowing" ? 0.95 : 0.7}
          >
            {state === "glowing" && (
              <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
            )}
          </ellipse>

          {/* Shoulders */}
          <ellipse
            cx={0}
            cy={-s.body * 0.05 + shoulderDrop}
            rx={s.body * 0.45}
            ry={s.body * 0.15}
            fill={colors.primary}
            opacity={state === "concerned" ? 0.4 : state === "glowing" ? 0.9 : 0.6}
          />

          {/* Head */}
          <g transform={`rotate(${headTilt}, 0, ${-s.body * 0.3})`}>
            <circle
              cx={0}
              cy={-s.body * 0.3}
              r={s.head / 2}
              fill={colors.primary}
              opacity={state === "concerned" ? 0.6 : state === "glowing" ? 1 : 0.8}
            />

            {/* Eyes */}
            <ellipse
              cx={-s.eye * 1.5}
              cy={-s.body * 0.3 - s.eye * 0.3}
              rx={s.eye * 0.45}
              ry={s.eye * 0.45 * eyeOpenness}
              fill={state === "glowing" ? "#fff" : state === "celebrating" ? "#fff" : colors.secondary}
              opacity={state === "concerned" ? 0.4 : 0.9}
            />
            <ellipse
              cx={s.eye * 1.5}
              cy={-s.body * 0.3 - s.eye * 0.3}
              rx={s.eye * 0.45}
              ry={s.eye * 0.45 * eyeOpenness}
              fill={state === "glowing" ? "#fff" : state === "celebrating" ? "#fff" : colors.secondary}
              opacity={state === "concerned" ? 0.4 : 0.9}
            />

            {/* Mouth — only visible in celebrating/glowing */}
            {(state === "celebrating" || state === "glowing") && (
              <path
                d={`M ${-s.eye} ${-s.body * 0.3 + s.eye * 1.2} Q 0 ${-s.body * 0.3 + s.eye * 2} ${s.eye} ${-s.body * 0.3 + s.eye * 1.2}`}
                fill="none"
                stroke={colors.secondary}
                strokeWidth={1}
                opacity={0.6}
                strokeLinecap="round"
              />
            )}
          </g>

          {/* Arms */}
          {state === "celebrating" && (
            <>
              {/* Arms up */}
              <line
                x1={-s.body * 0.35}
                y1={s.body * 0.05}
                x2={-s.body * 0.55}
                y2={-s.body * 0.3}
                stroke={colors.primary}
                strokeWidth={s.body * 0.08}
                strokeLinecap="round"
                opacity={0.7}
              />
              <line
                x1={s.body * 0.35}
                y1={s.body * 0.05}
                x2={s.body * 0.55}
                y2={-s.body * 0.3}
                stroke={colors.primary}
                strokeWidth={s.body * 0.08}
                strokeLinecap="round"
                opacity={0.7}
              />
            </>
          )}
          {state !== "celebrating" && (
            <>
              {/* Arms down */}
              <line
                x1={-s.body * 0.38}
                y1={s.body * 0.1 + shoulderDrop}
                x2={-s.body * 0.42}
                y2={s.body * 0.5 + shoulderDrop}
                stroke={colors.primary}
                strokeWidth={s.body * 0.07}
                strokeLinecap="round"
                opacity={state === "concerned" ? 0.35 : 0.5}
              />
              <line
                x1={s.body * 0.38}
                y1={s.body * 0.1 + shoulderDrop}
                x2={s.body * 0.42}
                y2={s.body * 0.5 + shoulderDrop}
                stroke={colors.primary}
                strokeWidth={s.body * 0.07}
                strokeLinecap="round"
                opacity={state === "concerned" ? 0.35 : 0.5}
              />
            </>
          )}
        </g>

        {/* Glowing state — particles */}
        {state === "glowing" && (
          <>
            {[0, 60, 120, 180, 240, 300].map((angle) => {
              const rad = (angle + pulsePhase) * (Math.PI / 180);
              const dist = s.container * 0.35 + pulse * 5;
              const px = cx + Math.cos(rad) * dist;
              const py = cy + Math.sin(rad) * dist;
              return (
                <circle
                  key={angle}
                  cx={px}
                  cy={py}
                  r={1.5}
                  fill={colors.accent}
                  opacity={0.3 + pulse * 0.3}
                />
              );
            })}
          </>
        )}

        {/* Celebrating state — sparkles */}
        {state === "celebrating" && (
          <>
            {[30, 90, 150, 210, 270, 330].map((angle) => {
              const rad = (angle + pulsePhase * 0.5) * (Math.PI / 180);
              const dist = s.container * 0.38;
              const px = cx + Math.cos(rad) * dist;
              const py = cy + Math.sin(rad) * dist;
              return (
                <text
                  key={angle}
                  x={px}
                  y={py}
                  fontSize={size === "sm" ? 6 : size === "md" ? 8 : 10}
                  textAnchor="middle"
                  dominantBaseline="central"
                  opacity={0.4 + pulse * 0.4}
                >
                  {"\u2728"}
                </text>
              );
            })}
          </>
        )}

        {/* Concerned state — shadow underneath */}
        {state === "concerned" && (
          <ellipse
            cx={cx}
            cy={cy + s.body * 0.6}
            rx={s.body * 0.3}
            ry={s.body * 0.06}
            fill={colors.primary}
            opacity={0.1}
          />
        )}
      </svg>
    </div>
  );
}
