"use client";

import Link from "next/link";

export default function LogoText({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <span className="text-2xl font-extrabold tracking-tight text-[#124734]">
        Foodie
        <span className="text-[#F49D37]">Go</span>
      </span>
    </Link>
  );
}
