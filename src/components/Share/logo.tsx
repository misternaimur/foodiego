"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Utensils } from "lucide-react";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({ className = "", width = 22, height = 22 }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group py-1 ${className}`}>
      {/* Minimal Icon Box with Soft Green Theme */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center p-2 bg-green-500 text-white rounded-xl shadow-sm shadow-green-500/20 group-hover:bg-green-600 transition-colors"
      >
        <Utensils width={width} height={height} strokeWidth={2.5} />
      </motion.div>

      {/* Clean Modern Typography */}
      <div className="flex items-center text-2xl font-black tracking-tight select-none">
        {/* "Foodi" part */}
        <span className="text-gray-900">Foodi</span>
        
        {/* "Go" part with subtle green color */}
        <motion.span 
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-green-600 ml-[1px]"
        >
          Go
        </motion.span>

        {/* Minimal dot indicator */}
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 ml-0.5 animate-pulse" />
      </div>
    </Link>
  );
}