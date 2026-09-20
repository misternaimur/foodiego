"use client";

import type { Transition, Variants } from "motion/react";

export const springTransition: Transition = {
  type: "spring",
  stiffness: 350,
  damping: 25,
};

export const softTransition: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 28,
};

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -12, scale: 0.99 },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.04,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: springTransition },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export const modalTransition: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 30,
};
