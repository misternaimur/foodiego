"use client";

import Link from "next/link";
import Image from "next/image";

export default function LogoText({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <Image
        src="/assets/images/logo/LogoGreen.png"
        alt="Foodiego"
        width={175}
        height={51}
        priority
        className="h-auto w-37.5 dark:hidden"
      />
      <Image
        src="/assets/images/logo/Foodiego.png"
        alt="Foodiego"
        width={175}
        height={51}
        priority
        className="hidden h-auto w-37.5 dark:block"
      />
    </Link>
  );
}
