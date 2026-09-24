"use client";

import { type ReactNode, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

interface LandingRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function LandingPageShell({ children }: { children: ReactNode }) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div className="landing-shell">
      <motion.div
        className="landing-progress"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />
      <div className="landing-atmosphere" aria-hidden="true" />
      <div className="landing-content">{children}</div>
    </div>
  );
}

export default function LandingReveal({
  children,
  className = "",
  delay = 0,
}: LandingRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const [hasEntered, setHasEntered] = useState(Boolean(prefersReducedMotion));

  return (
    <motion.div
      className={`landing-reveal ${hasEntered ? "is-visible" : ""} ${className}`}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 34, scale: 0.985 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      onViewportEnter={() => setHasEntered(true)}
      viewport={{ once: true, amount: 0.14, margin: "0px 0px -7%" }}
      transition={{
        duration: 0.78,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}