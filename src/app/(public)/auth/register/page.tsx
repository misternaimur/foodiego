"use client";

import Link from "next/link";
import { useEffect, useState, useTransition, Suspense, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LoaderCircle,
  ShoppingBag,
  UtensilsCrossed,
  Bike,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { establishSession } from "@/app/(public)/actions/auth";
import { sendRegistrationOtp, verifyRegistrationOtp } from "@/app/(public)/actions/otp";
import { mapAuthErrorMessage } from "@/lib/firebase/errors";
import { ROLES, RegisterFormSchema, type SelectableRole } from "@/lib/definitions";

const ROLE_OPTIONS: {
  value: SelectableRole;
  label: string;
  description: string;
  icon: typeof ShoppingBag;
  badge?: string;
}[] = [
  {
    value: "customer",
    label: "Customer",
    description: "Order food & track delivery.",
    icon: ShoppingBag,
  },
  {
    value: "restaurant",
    label: "Restaurant",
    description: "Manage menu & incoming orders.",
    icon: UtensilsCrossed,
    badge: "Partner",
  },
  {
    value: "rider",
    label: "Rider",
    description: "Deliver & earn on your schedule.",
    icon: Bike,
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

const ROLE_HEADINGS: Record<SelectableRole, { title: string; subtitle: string }> = {
  customer: {
    title: "Create an account",
    subtitle: "Get started with your favorite meals and food ecosystem.",
  },
  restaurant: {
    title: "Become a Restaurant Partner",
    subtitle: "Manage your menu and start receiving orders on Foodiego.",
  },
  rider: {
    title: "Join as a Delivery Rider",
    subtitle: "Deliver orders and earn on your own schedule.",
  },
};

function isSelectableRole(value: string | null): value is SelectableRole {
  return !!value && (ROLES as readonly string[]).includes(value);
}

const inputBase =
  "w-full rounded-xl border border-gray-200 bg-gray-50/30 py-2.5 pl-10 pr-3.5 text-sm text-black transition-colors placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-600/10";

type FieldErrors = Partial<Record<"name" | "email" | "password" | "role", string[]>>;
type PendingPayload = { name: string; email: string; password: string; role: SelectableRole };

function RegisterFormContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "";
  const requestedRole = searchParams.get("role");
  const role: SelectableRole = isSelectableRole(requestedRole) ? requestedRole : "customer";

  const activeRole = ROLE_OPTIONS.find((option) => option.value === role)!;
  const heading = ROLE_HEADINGS[role];

  const [step, setStep] = useState<"details" | "otp">("details");
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const [otp, setOtp] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const [payload, setPayload] = useState<PendingPayload | null>(null);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  function handleDetailsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const parsed = RegisterFormSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    });

    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    startTransition(async () => {
      const result = await sendRegistrationOtp(parsed.data.email);
      if (!result.ok) {
        setFormError(result.message);
        return;
      }
      setPayload(parsed.data);
      setDevCode(result.devCode ?? null);
      setOtp("");
      setResendIn(30);
      setStep("otp");
    });
  }

  function handleOtpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!payload) {
      setStep("details");
      return;
    }

    startTransition(async () => {
      const verified = await verifyRegistrationOtp(payload.email, otp);
      if (!verified.ok) {
        setFormError(verified.message);
        return;
      }

      let idToken: string;
      try {
        const credential = await createUserWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        );
        idToken = await credential.user.getIdToken();
      } catch (error) {
        setFormError(mapAuthErrorMessage(error));
        return;
      }

      const result = await establishSession(
        idToken,
        { name: payload.name, role: payload.role },
        redirectTo
      );
      // establishSession redirects on success — a return value means it failed.
      if (result?.errors) {
        setFieldErrors(result.errors);
        setStep("details");
      }
      if (result?.message) {
        setFormError(result.message);
      }
    });
  }

  function handleResend() {
    if (!payload || resendIn > 0) return;
    setFormError(null);

    startTransition(async () => {
      const result = await sendRegistrationOtp(payload.email);
      if (!result.ok) {
        setFormError(result.message);
        return;
      }
      setDevCode(result.devCode ?? null);
      setResendIn(30);
    });
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_10px_50px_-12px_rgba(16,185,129,0.08)] sm:p-10"
    >
      <motion.div variants={itemVariants} className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-emerald-600"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
          <span>Home</span>
        </Link>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
          <Sparkles size={13} />
          <span>Join Foodiego</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {step === "otp" ? "Verify your email" : heading.title}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {step === "otp"
            ? `Enter the 6-digit code we sent to ${payload?.email ?? "your email"}.`
            : heading.subtitle}
        </p>
      </motion.div>

      {step === "details" ? (
        <form onSubmit={handleDetailsSubmit} className="space-y-5">
          <motion.div variants={itemVariants}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Account Type
              </span>
              {role !== "customer" && (
                <Link
                  href={`/auth/register${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
                  className="text-xs font-semibold text-emerald-600 hover:underline"
                >
                  Sign up as a customer instead
                </Link>
              )}
            </div>

            <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-emerald-600 bg-emerald-50/40 p-3.5 shadow-sm shadow-emerald-600/10 ring-1 ring-emerald-600">
              {activeRole.badge && (
                <span className="absolute right-2 top-2 rounded-full bg-gray-900 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  {activeRole.badge}
                </span>
              )}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-200/50">
                <activeRole.icon size={18} className="text-emerald-600" strokeWidth={2.3} />
              </div>
              <div>
                <span className="block text-xs font-bold text-emerald-600">{activeRole.label}</span>
                <span className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-600">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  {activeRole.description}
                </span>
              </div>
            </div>

            <input type="hidden" name="role" value={role} />
            {fieldErrors.role && <p className="mt-1 text-xs text-red-600">{fieldErrors.role[0]}</p>}
          </motion.div>

          <div className="space-y-4">
            <motion.div variants={itemVariants}>
              <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input id="name" name="name" type="text" autoComplete="name" required placeholder="John Doe" className={inputBase} />
              </div>
              {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name[0]}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input id="email" name="email" type="email" autoComplete="email" required placeholder="name@example.com" className={inputBase} />
              </div>
              {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email[0]}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/30 py-2.5 pl-10 pr-10 text-sm text-black transition-colors placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {fieldErrors.password ? (
                <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-xs text-red-600">
                  {fieldErrors.password.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1.5 text-xs text-gray-400">
                  Min 8 characters with at least a letter and a number.
                </p>
              )}
            </motion.div>
          </div>

          <AnimatePresence>
            {formError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-100"
              >
                {formError}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            {pending && <LoaderCircle className="animate-spin" size={17} />}
            {pending ? "Sending code..." : "Continue"}
          </motion.button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-5">
          <motion.div variants={itemVariants} className="flex items-center gap-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 ring-1 ring-emerald-200/60">
              <ShieldCheck size={17} />
            </div>
            <p className="text-xs text-gray-600">
              We sent a one-time code to <span className="font-semibold text-gray-800">{payload?.email}</span>.
              It expires in 10 minutes.
            </p>
          </motion.div>

          {devCode && (
            <motion.div
              variants={itemVariants}
              className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800"
            >
              Dev mode (no email provider configured): your code is{" "}
              <span className="font-mono text-sm font-bold tracking-widest">{devCode}</span>
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <label htmlFor="otp" className="mb-1.5 block text-xs font-semibold text-gray-700">
              6-digit code
            </label>
            <input
              id="otp"
              name="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="••••••"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 text-center text-lg font-semibold tracking-[0.5em] text-black transition-colors placeholder:tracking-[0.4em] placeholder:text-gray-300 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
            />
          </motion.div>

          <AnimatePresence>
            {formError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-100"
              >
                {formError}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={pending || otp.length !== 6}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            {pending && <LoaderCircle className="animate-spin" size={17} />}
            {pending ? "Verifying..." : "Verify & create account"}
          </motion.button>

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setStep("details");
                setFormError(null);
              }}
              className="font-semibold text-gray-500 hover:text-gray-800"
            >
              ← Change details
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendIn > 0 || pending}
              className="font-semibold text-emerald-600 hover:underline disabled:text-gray-400 disabled:no-underline"
            >
              {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
            </button>
          </div>
        </form>
      )}

      <motion.p variants={itemVariants} className="mt-7 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-emerald-600 hover:underline">
          Sign in
        </Link>
      </motion.p>
    </motion.div>
  );
}

export default function RegisterPage() {
  return (
    <main className="flex-1 bg-white flex items-center justify-center px-4 py-12 sm:py-16">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20 text-gray-400">
            <LoaderCircle className="animate-spin text-emerald-600" size={26} />
          </div>
        }
      >
        <RegisterFormContent />
      </Suspense>
    </main>
  );
}
