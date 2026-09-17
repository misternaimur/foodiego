"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center group ${className}`}
    >
      <div className="relative h-10 w-35 overflow-hidden">
        <Image
          src="/assets/images/logo/Foodiego.png"
          alt="Foodiego Logo"
          fill
          sizes="140px"
          priority
          className="object-cover object-center"
        />
      </div>
    </Link>
  );
}
