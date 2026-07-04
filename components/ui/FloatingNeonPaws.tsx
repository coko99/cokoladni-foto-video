"use client";

import { motion } from "framer-motion";

function PawIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden>
      <ellipse cx="32" cy="44" rx="13" ry="11" opacity="0.85" />
      <circle cx="17" cy="26" r="6.5" />
      <circle cx="31" cy="20" r="6.5" />
      <circle cx="45" cy="26" r="6.5" />
      <circle cx="50" cy="38" r="5.5" />
    </svg>
  );
}

type PawTrail = {
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  x: number[];
  y: number[];
  rotate: number[];
};

const trails: PawTrail[] = [
  {
    left: "12%",
    top: "78%",
    size: 26,
    duration: 32,
    delay: 0,
    opacity: 0.22,
    x: [0, 60, 130],
    y: [0, -90, -200],
    rotate: [-12, -6, 4],
  },
  {
    left: "68%",
    top: "82%",
    size: 20,
    duration: 38,
    delay: 8,
    opacity: 0.16,
    x: [0, -50, -110],
    y: [0, -110, -230],
    rotate: [10, 4, -8],
  },
  {
    left: "42%",
    top: "88%",
    size: 24,
    duration: 35,
    delay: 14,
    opacity: 0.18,
    x: [0, 40, 95],
    y: [0, -120, -250],
    rotate: [0, 12, 18],
  },
  {
    left: "85%",
    top: "55%",
    size: 18,
    duration: 42,
    delay: 4,
    opacity: 0.14,
    x: [0, -70, -140],
    y: [0, -60, -140],
    rotate: [15, 8, 0],
  },
  {
    left: "22%",
    top: "45%",
    size: 16,
    duration: 45,
    delay: 20,
    opacity: 0.12,
    x: [0, 90, 170],
    y: [0, -50, -110],
    rotate: [-8, 0, 10],
  },
  {
    left: "55%",
    top: "62%",
    size: 22,
    duration: 36,
    delay: 11,
    opacity: 0.2,
    x: [0, -35, -80],
    y: [0, -85, -180],
    rotate: [6, -4, -12],
  },
];

export function FloatingNeonPaws() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {trails.map((trail, i) => (
        <motion.div
          key={i}
          className="absolute text-accent"
          style={{
            left: trail.left,
            top: trail.top,
            width: trail.size,
            height: trail.size,
            filter: "drop-shadow(0 0 6px rgba(101,227,255,0.45)) drop-shadow(0 0 18px rgba(101,227,255,0.2))",
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, trail.opacity, trail.opacity * 0.7, 0],
            x: trail.x,
            y: trail.y,
            rotate: trail.rotate,
          }}
          transition={{
            duration: trail.duration,
            delay: trail.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <PawIcon />
        </motion.div>
      ))}
    </div>
  );
}
