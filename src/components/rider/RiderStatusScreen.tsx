"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, XCircle, MapPin, Calendar, Mail, LogOut, Bike, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";

type RiderApplicationStatus = "pending" | "rejected";

interface RiderStatusScreenProps {
  status: RiderApplicationStatus;
  fullName: string;
  city: string;
  vehicleType: string;
  photoUrl?: string;
  submittedAt: string;
}

const STATUS_COPY = {
  pending: {
    badge: "Pending Review",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    heading: "Your application is under review",
    body: "Thanks for applying to become a Foodiego delivery rider. Our team is reviewing your details and will notify you as soon as a decision is made — usually within 24–48 hours.",
    ringClass: "border-amber-400/50",
    iconWrapClass: "bg-amber-100 text-amber-600",
  },
  rejected: {
    badge: "Not Approved",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    heading: "Your application wasn't approved",
    body: "After review, we're unable to approve this application right now. If you believe this is a mistake or would like more details, please reach out to our partner support team.",
    ringClass: "border-red-400/50",
    iconWrapClass: "bg-red-100 text-red-600",
  },
} as const;

export default function RiderStatusScreen({
  status,
  fullName,
  city,
  vehicleType,
  photoUrl,
  submittedAt,
}: RiderStatusScreenProps) {
  const { logoutUser } = useApp();
  const copy = STATUS_COPY[status];
  const StatusIcon = status === "pending" ? Clock : XCircle;

  return (
    <main className="flex-1 bg-white flex items-center justify-center px-4 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-[0_10px_50px_-12px_rgba(16,185,129,0.08)] sm:p-10"
      >
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center">
            {status === "pending" && (
              <motion.span
                className={`absolute inset-0 rounded-full border-2 ${copy.ringClass}`}
                animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            <div className={`relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full ${copy.iconWrapClass}`}>
              {photoUrl ? (
                <Image src={photoUrl} alt={fullName} fill className="object-cover" />
              ) : (
                <StatusIcon size={28} />
              )}
            </div>
            {photoUrl && (
              <div
                className={`absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white ${copy.iconWrapClass}`}
              >
                <StatusIcon size={15} />
              </div>
            )}
          </div>
        </div>

        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${copy.badgeClass}`}>
          {copy.badge}
        </span>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {copy.heading}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">{copy.body}</p>

        <div className="mt-7 space-y-3 rounded-2xl border border-gray-100 bg-gray-50/60 p-5 text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 ring-1 ring-gray-200/70">
              <Bike size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Vehicle</p>
              <p className="truncate text-sm font-semibold capitalize text-gray-800">{vehicleType}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 ring-1 ring-gray-200/70">
              <MapPin size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">City</p>
              <p className="truncate text-sm font-semibold text-gray-800">{city}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 ring-1 ring-gray-200/70">
              <Calendar size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Submitted</p>
              <p className="truncate text-sm font-semibold text-gray-800">
                {new Date(submittedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          {status === "rejected" && (
            <a
              href="mailto:support@foodiego.com"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Mail size={15} />
              Contact Support
            </a>
          )}
          <button
            onClick={() => logoutUser()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-colors hover:bg-emerald-700"
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>

        <p className="mt-6 inline-flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <Sparkles size={12} className="text-amber-500" />
          Hi {fullName}, we&apos;ll be in touch soon.
        </p>
      </motion.div>
    </main>
  );
}
