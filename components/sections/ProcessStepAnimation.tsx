"use client";

import { motion } from "framer-motion";

type ProcessAnimationProps = {
  id: string;
};

const neonFilter = (
  <defs>
    <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

function NeonSvg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-hidden
    >
      {neonFilter}
      <g filter="url(#neon-glow)" stroke="#65E3FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  );
}

function MeetingAnimation() {
  return (
    <NeonSvg>
      <motion.circle
        cx="38"
        cy="48"
        r="14"
        fill="rgba(101,227,255,0.08)"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M38 62 C38 56 44 52 52 52"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="82"
        cy="48"
        r="14"
        fill="rgba(101,227,255,0.08)"
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
      <motion.path
        d="M82 62 C82 56 76 52 68 52"
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M${52 + i * 8} 38 Q60 28 68 38`}
          strokeOpacity={0.5 + i * 0.15}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
      <motion.rect
        x="44"
        y="72"
        width="32"
        height="20"
        rx="6"
        fill="rgba(101,227,255,0.06)"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
      <motion.line
        x1="50"
        y1="80"
        x2="70"
        y2="80"
        animate={{ pathLength: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.line
        x1="50"
        y1="86"
        x2="62"
        y2="86"
        strokeOpacity={0.6}
        animate={{ pathLength: [0.2, 0.8, 0.2] }}
        transition={{ duration: 2.2, repeat: Infinity, delay: 0.3 }}
      />
    </NeonSvg>
  );
}

function PlanAnimation() {
  return (
    <NeonSvg>
      <motion.rect
        x="32"
        y="24"
        width="56"
        height="72"
        rx="8"
        fill="rgba(101,227,255,0.06)"
        animate={{ rotate: [-1, 1, -1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "60px", originY: "60px" }}
      />
      <motion.line
        x1="42"
        y1="40"
        x2="78"
        y2="40"
        animate={{ x1: [42, 44, 42], x2: [78, 76, 78] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      {[52, 62, 72, 82].map((y, i) => (
        <g key={y}>
          <motion.rect
            x="42"
            y={y - 4}
            width="8"
            height="8"
            rx="2"
            fill="rgba(101,227,255,0.15)"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.35 }}
          />
          <motion.line
            x1="56"
            y1={y}
            x2={72 - i * 4}
            y2={y}
            strokeOpacity={0.7}
            animate={{ pathLength: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.25 }}
          />
        </g>
      ))}
      <motion.circle
        cx="88"
        cy="32"
        r="10"
        fill="rgba(101,227,255,0.1)"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{ originX: "88px", originY: "32px" }}
      />
      <motion.path
        d="M88 26 L88 32 L92 34"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{ originX: "88px", originY: "32px" }}
      />
    </NeonSvg>
  );
}

function CameraAnimation() {
  return (
    <NeonSvg>
      <motion.rect
        x="28"
        y="40"
        width="64"
        height="44"
        rx="8"
        fill="rgba(101,227,255,0.08)"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="60"
        cy="62"
        r="14"
        fill="rgba(5,7,13,0.8)"
        stroke="#65E3FF"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.circle
        cx="60"
        cy="62"
        r="6"
        fill="rgba(101,227,255,0.2)"
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.rect
        x="72"
        y="34"
        width="16"
        height="12"
        rx="3"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
      <motion.circle
        cx="92"
        cy="38"
        r="4"
        fill="#65E3FF"
        animate={{ opacity: [1, 0.2, 1], scale: [1, 0.8, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <motion.path
        d="M20 52 L28 52"
        animate={{ x1: [18, 22, 18], x2: [28, 32, 28] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M${96 + i * 2} ${52 + i * 2} A ${10 + i * 5} ${10 + i * 5} 0 0 1 ${96 + i * 2} ${72 - i * 2}`}
          strokeOpacity={0.3 + i * 0.2}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </NeonSvg>
  );
}

function DeliveryAnimation() {
  return (
    <NeonSvg>
      <motion.rect
        x="34"
        y="36"
        width="52"
        height="40"
        rx="6"
        fill="rgba(101,227,255,0.06)"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2.8, repeat: Infinity }}
      />
      {[44, 56, 68].map((x, i) => (
        <motion.rect
          key={x}
          x={x}
          y="44"
          width="8"
          height="24"
          rx="2"
          fill="rgba(101,227,255,0.12)"
          animate={{ height: [20, 26, 20], y: [46, 42, 46] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
      <motion.path
        d="M30 78 L90 78"
        animate={{ pathLength: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.path
        d="M60 76 L60 88"
        animate={{ y1: [76, 74, 76], y2: [88, 90, 88] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.circle
        cx="48"
        cy="88"
        r="5"
        fill="rgba(101,227,255,0.15)"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ originX: "48px", originY: "88px" }}
      />
      <motion.circle
        cx="72"
        cy="88"
        r="5"
        fill="rgba(101,227,255,0.15)"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ originX: "72px", originY: "88px" }}
      />
      {[
        { x: 88, y: 28, delay: 0 },
        { x: 96, y: 36, delay: 0.4 },
        { x: 84, y: 44, delay: 0.8 },
      ].map((star) => (
        <motion.path
          key={`${star.x}-${star.y}`}
          d={`M${star.x} ${star.y} l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z`}
          fill="rgba(101,227,255,0.4)"
          stroke="none"
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], y: [0, -6, -12] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: star.delay }}
        />
      ))}
      <motion.path
        d="M22 58 L30 58 L34 52"
        strokeOpacity={0.6}
        animate={{ x: [0, 4, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </NeonSvg>
  );
}

const animations: Record<string, React.ComponentType> = {
  meeting: MeetingAnimation,
  plan: PlanAnimation,
  camera: CameraAnimation,
  delivery: DeliveryAnimation,
};

export function ProcessStepAnimation({ id }: ProcessAnimationProps) {
  const Animation = animations[id] ?? MeetingAnimation;

  return (
    <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-[#05070d]/60">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(101,227,255,0.2), transparent 65%)",
        }}
      />
      <motion.div
        className="relative h-28 w-28 sm:h-32 sm:w-32"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Animation />
      </motion.div>
      <motion.div
        className="absolute bottom-4 left-1/2 h-px w-16 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        animate={{ opacity: [0.3, 0.8, 0.3], scaleX: [0.8, 1.2, 0.8] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  );
}
