"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center group py-1 relative w-[170px] h-10 ${className}`}
    >
      <Image
        src="/assets/images/logo/LogoGreen.png"
        alt="Foodiego Logo"
        fill
        sizes="(max-width: 768px) 170px, 170px"
        className="object-contain"
        priority
      />
    </Link>
  );
}