"use client";

import { motion } from "framer-motion";

const blobTransition = {
  duration: 28,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#05070D]" />

      <div className="brand-bg absolute inset-0 opacity-95" />

      <motion.div
        className="absolute left-1/2 top-1/3 h-[700px] w-[700px] -translate-x-1/2 rounded-full blur-[160px]"
        style={{
          background:
            "radial-gradient(circle, rgba(103,228,245,0.45) 0%, rgba(101,227,255,0.15) 40%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.45, 0.75, 0.45],
          x: ["-50%", "calc(-50% + 24px)", "-50%"],
          y: [0, -18, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute -left-32 top-1/4 h-[550px] w-[550px] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(101,227,255,0.55) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 40, -16, 0],
          y: [0, -28, 20, 0],
          scale: [1, 1.06, 0.96, 1],
        }}
        transition={blobTransition}
      />

      <motion.div
        className="absolute -right-24 top-1/4 h-[650px] w-[650px] rounded-full blur-[150px]"
        style={{
          background:
            "radial-gradient(circle, rgba(29,110,181,0.5) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, -36, 24, 0],
          y: [0, 32, -12, 0],
          scale: [1, 0.94, 1.05, 1],
        }}
        transition={{ ...blobTransition, duration: 34 }}
      />

      <motion.div
        className="absolute bottom-0 left-1/4 h-[450px] w-[450px] rounded-full blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, rgba(92,217,240,0.5) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 28, -20, 0],
          y: [0, -16, 24, 0],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ ...blobTransition, duration: 26 }}
      />

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(101,227,255,0.9) 1px, transparent 0)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#05070D]/10 via-transparent to-[#070B16]/85" />
    </div>
  );
}
