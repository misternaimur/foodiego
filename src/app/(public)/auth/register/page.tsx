"use client";

import Link from "next/link";
import { useActionState, useState, Suspense } from "react";
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
} from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { establishSession } from "@/app/(public)/actions/auth";
import { mapAuthErrorMessage } from "@/lib/firebase/errors";
import { ROLES, RegisterFormSchema, type FormState } from "@/lib/definitions";

async function registerAction(_state: FormState, formData: FormData): Promise<FormState> {
  const redirectTo = String(formData.get("redirect") ?? "");
  const validatedFields = RegisterFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { name, email, password, role } = validatedFields.data;

  let idToken: string;
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    idToken = await credential.user.getIdToken();
  } catch (error) {
    return { message: mapAuthErrorMessage(error) };
  }

  return establishSession(idToken, { name, role }, redirectTo);
}

const ROLE_OPTIONS: {
  value: (typeof ROLES)[number];
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

function RegisterFormContent() {
  const [state, action, pending] = useActionState(registerAction, undefined);
  const [role, setRole] = useState<(typeof ROLES)[number]>("customer");
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "";

  const activeRole = ROLE_OPTIONS.find((option) => option.value === role)!;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_10px_50px_-12px_rgba(16,185,129,0.08)] sm:p-10"
    >
      {/* Top Navigation & Branding Bar */}
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

      {/* Header Heading */}
      <motion.div variants={itemVariants} className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Create an account
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Get started with your favorite meals and food ecosystem.
        </p>
      </motion.div>

      {/* Form Area */}
      <form action={action} className="space-y-5">
        <input type="hidden" name="redirect" value={redirectTo} />

        {/* Role Selection Segmented Cards */}
        <motion.div variants={itemVariants}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Select Account Type
            </span>
          </div>

          <div role="radiogroup" aria-label="Account type" className="grid grid-cols-3 gap-2.5">
            {ROLE_OPTIONS.map((option) => {
              const Icon = option.icon;
              const selected = role === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setRole(option.value)}
                  className={`group relative flex flex-col items-center justify-between overflow-hidden rounded-2xl border p-3.5 text-center transition-all ${
                    selected
                      ? "border-emerald-600 bg-emerald-50/40 shadow-sm shadow-emerald-600/10 ring-1 ring-emerald-600"
                      : "border-gray-200/80 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="role-active-bg"
                      className="absolute inset-0 bg-emerald-600/[0.06]"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  {option.badge && (
                    <span className="absolute right-2 top-2 rounded-full bg-gray-900 px-1.5 py-0.5 text-[9px] font-bold text-white">
                      {option.badge}
                    </span>
                  )}
                  <div className="relative mb-2 mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-200/50 transition-transform group-hover:scale-105">
                    <Icon size={18} className={selected ? "text-emerald-600" : "text-gray-600"} strokeWidth={selected ? 2.3 : 2} />
                  </div>
                  <div className="relative">
                    <span className={`block text-xs font-bold ${selected ? "text-emerald-600" : "text-gray-800"}`}>
                      {option.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Role Active Description feedback */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRole.value}
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 3 }}
              transition={{ duration: 0.15 }}
              className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600"
            >
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <span>{activeRole.description}</span>
            </motion.div>
          </AnimatePresence>

          <input type="hidden" name="role" value={role} />
          {state?.errors?.role && (
            <p className="mt-1 text-xs text-red-600">{state.errors.role[0]}</p>
          )}
        </motion.div>

        {/* Input Fields Container */}
        <div className="space-y-4">
          {/* Full Name */}
          <motion.div variants={itemVariants}>
            <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Full Name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="John Doe"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/30 py-2.5 pl-10 pr-3.5 text-sm text-black transition-colors placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
              />
            </div>
            <AnimatePresence>
              {state?.errors?.name && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-1 text-xs text-red-600"
                >
                  {state.errors.name[0]}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Email Address */}
          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="name@example.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/30 py-2.5 pl-10 pr-3.5 text-sm text-black transition-colors placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
              />
            </div>
            <AnimatePresence>
              {state?.errors?.email && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-1 text-xs text-red-600"
                >
                  {state.errors.email[0]}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Password Field */}
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
            {state?.errors?.password ? (
              <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-xs text-red-600">
                {state.errors.password.map((error) => (
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

        {/* Global Error Banner */}
        <AnimatePresence>
          {state?.message && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-100"
            >
              {state.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-colors hover:bg-emerald-700 disabled:opacity-60"
        >
          {pending && <LoaderCircle className="animate-spin" size={17} />}
          {pending ? "Creating account..." : "Create account"}
        </motion.button>
      </form>

      {/* Sign in Footer Link */}
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