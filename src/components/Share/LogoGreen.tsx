"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({
  className = "",
  width = 130,
  height = 40,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center group py-1 ${className}`}
    >
      <Image
        src="/assets/images/logo/LogoGreen.png"
        alt="Foodiego Logo"
        width={width}
        height={height}
        className="w-[170px] h-auto object-contain"
        priority
      />
    </Link>
  );
}