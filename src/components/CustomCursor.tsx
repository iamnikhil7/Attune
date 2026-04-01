"use client";
import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hoverText, setHoverText] = useState(false);
  const [hidden, setHidden] = useState(false);
  const ringRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Hide on touch devices
    if (typeof window !== "undefined" && "ontouchstart" in window) {
      setHidden(true);
      return;
    }

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    const onOverInteractive = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const tag = target.tagName.toLowerCase();
      const isLink = tag === "a" || target.closest("a");
      const isButton = tag === "button" || target.closest("button") || target.getAttribute("role") === "button";
      const isInput = tag === "input" || tag === "textarea" || tag === "select";
      const isText = tag === "p" || tag === "span" || tag === "h1" || tag === "h2" || tag === "h3" || tag === "li" || tag === "blockquote";

      if (isLink || isButton) setHovering(true);
      else setHovering(false);

      if (isInput) setHoverText(true);
      else if (isText && window.getSelection()?.toString()) setHoverText(true);
      else setHoverText(false);
    };

    const onOutInteractive = () => {
      setHovering(false);
      setHoverText(false);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseover", onOverInteractive);
    document.addEventListener("mouseout", onOutInteractive);

    // Smooth ring follow
    const animate = () => {
      ringRef.current.x += (pos.x - ringRef.current.x) * 0.15;
      ringRef.current.y += (pos.y - ringRef.current.y) * 0.15;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover", onOverInteractive);
      document.removeEventListener("mouseout", onOutInteractive);
      cancelAnimationFrame(rafRef.current);
    };
  }, [pos.x, pos.y]);

  if (hidden) return null;

  const dotSize = clicking ? 6 : hovering ? 4 : 5;
  const ringSize = hovering ? 44 : clicking ? 28 : 32;
  const ringOpacity = hovering ? 0.2 : clicking ? 0.15 : 0.08;

  return (
    <>
      {/* Hide default cursor globally */}
      <style jsx global>{`
        *, *::before, *::after { cursor: none !important; }
      `}</style>

      {/* Dot — follows exactly */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: `translate(${pos.x - dotSize / 2}px, ${pos.y - dotSize / 2}px)`,
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          background: hoverText ? "transparent" : "#F5F5F0",
          border: hoverText ? "1.5px solid #F5F5F0" : "none",
          transition: "width 0.15s ease, height 0.15s ease, background 0.15s ease, border 0.15s ease",
        }}
      />

      {/* Ring — follows with lag */}
      <RingFollower
        targetX={pos.x}
        targetY={pos.y}
        size={ringSize}
        opacity={ringOpacity}
        hovering={hovering}
      />
    </>
  );
}

function RingFollower({ targetX, targetY, size, opacity, hovering }: { targetX: number; targetY: number; size: number; opacity: number; hovering: boolean }) {
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: targetX, y: targetY });

  useEffect(() => {
    targetRef.current = { x: targetX, y: targetY };
  }, [targetX, targetY]);

  useEffect(() => {
    const animate = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.12;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.12;
      setRingPos({ x: currentRef.current.x, y: currentRef.current.y });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
      style={{
        transform: `translate(${ringPos.x - size / 2}px, ${ringPos.y - size / 2}px)`,
        width: size,
        height: size,
        border: `1px solid rgba(245, 245, 240, ${opacity})`,
        transition: "width 0.3s cubic-bezier(0.25,0.46,0.45,0.94), height 0.3s cubic-bezier(0.25,0.46,0.45,0.94), border 0.2s ease",
        background: hovering ? `rgba(245, 245, 240, 0.03)` : "transparent",
      }}
    />
  );
}
