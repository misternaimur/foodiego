'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_STEPS = [
  { label: 'Connecting to restaurant...', progress: 25 },
  { label: 'Assigning top rider...', progress: 50 },
  { label: 'Securing food box...', progress: 75 },
  { label: 'Dispatch Ready!', progress: 100 }
];

function Particles() {
  const particles = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      top: 10 + ((i * 11 + 7) % 80),
      duration: 2 + ((i * 3 + 5) % 20) / 10,
      delay: ((i * 7 + 3) % 30) / 10
    })), []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-emerald-400/50 rounded-full blur-[1px]"
          style={{
            top: `${p.top}%`,
            left: '-10px'
          }}
          animate={{
            x: [-10, 400],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: p.duration,
            ease: "linear",
            delay: p.delay
          }}
        />
      ))}
    </div>
  );
}

function SpeedLines() {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none overflow-hidden">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full"
          style={{ top: `${20 + i * 15}%`, width: '80%' }}
          animate={{ x: [-300, 300] }}
          transition={{
            repeat: Infinity,
            duration: 1 + i * 0.3,
            ease: "linear",
            delay: i * 0.25
          }}
        />
      ))}
    </div>
  );
}

function RoadAnimation() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none overflow-hidden opacity-30">
      <svg viewBox="0 0 800 80" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="1" />
          </linearGradient>
        </defs>
        <rect x="0" y="20" width="800" height="60" fill="url(#roadGrad)" />
        <motion.line
          x1="0" y1="50" x2="800" y2="50"
          stroke="#475569"
          strokeWidth="3"
          strokeDasharray="20 15"
          animate={{ strokeDashoffset: [-350, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        />
      </svg>
    </div>
  );
}

export default function FoodieGoLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  const stepIndex = progress >= 100 ? 3 : progress >= 75 ? 2 : progress >= 50 ? 1 : 0;

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 10);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    if (progress >= 100 && onComplete) onComplete();
  }, [progress, onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0B0F17] flex flex-col items-center justify-center text-white select-none overflow-hidden">
      {/* Soft Ambient Radial Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <Particles />
      <SpeedLines />
      <RoadAnimation />

      {/* Main Content Area */}
      <div className="w-full max-w-sm px-6 text-center z-10">
        {/* Animated Brand Logo/Title */}
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-white bg-clip-text text-transparent mb-3">
          FoodieGo
        </h1>

        {/* Dynamic Loading Step Text */}
        <AnimatePresence mode="wait">
          <motion.p
            key={stepIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-slate-400 text-sm font-medium mb-8 h-6"
          >
            {LOADING_STEPS[stepIndex].label}
          </motion.p>
        </AnimatePresence>

        {/* Glow Progress Bar */}
        <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50 p-0.5 shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Monospace Footer Status */}
        <div className="flex justify-between items-center text-xs text-slate-500 mt-3 font-mono">
          <span>DISPATCH_READY</span>
          <span className="text-emerald-400 font-bold">{progress}%</span>
        </div>
      </div>
    </div>
  );
}