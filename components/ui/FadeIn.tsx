"use client";

import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article";
  variant?: "fade-up" | "fade-in";
};

export function FadeIn({
  children,
  className = "",
  delay = 0,
  as = "div",
  variant = "fade-up",
}: FadeInProps) {
  const Component = motion[as];
  const variants = variant === "fade-in" ? fadeIn : fadeUp;

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </Component>
  );
}
