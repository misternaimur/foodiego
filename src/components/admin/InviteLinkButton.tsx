"use client";

import { useState } from "react";
import { UserPlus, Check } from "lucide-react";

// UPDATE (admin-invite fix): "Invite Vendor"/"Invite Rider" used to be
// plain <button>s with no onClick at all. Actually emailing an invite
// needs real SMTP credentials this project doesn't have (see the OTP-email
// limitation noted elsewhere), so instead of doing nothing, this copies
// the real public registration link to the admin's clipboard so they can
// share it manually (Slack, WhatsApp, email client, etc.) with the
// person they want to onboard.
export default function InviteLinkButton({
  label,
  path,
  className = "bg-[#0d9488] hover:bg-[#0b7c72]",
}: {
  label: string;
  path: string;
  /** Tailwind background classes, to match each page's accent color. */
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this registration link:", url);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-xs font-semibold shadow-2xs transition-all ${className}`}
    >
      {copied ? <Check size={15} /> : <UserPlus size={15} />}
      <span>{copied ? "Link copied!" : label}</span>
    </button>
  );
}
