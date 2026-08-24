"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
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
} from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { establishSession } from "@/app/actions/auth";
import { mapAuthErrorMessage } from "@/lib/firebase/errors";
import { ROLES, RegisterFormSchema, type FormState } from "@/lib/definitions";

async function registerAction(_state: FormState, formData: FormData): Promise<FormState> {
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

  return establishSession(idToken, { name, role });
}

const ROLE_OPTIONS: {
  value: (typeof ROLES)[number];
  label: string;
  description: string;
  icon: typeof ShoppingBag;
}[] = [
  {
    value: "customer",
    label: "Customer",
    description: "Order food from restaurants near you.",
    icon: ShoppingBag,
  },
  {
    value: "restaurant",
    label: "Restaurant",
    description: "List your restaurant and manage orders.",
    icon: UtensilsCrossed,
  },
  {
    value: "rider",
    label: "Rider",
    description: "Deliver orders and earn on your schedule.",
    icon: Bike,
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, undefined);
  const [role, setRole] = useState<(typeof ROLES)[number]>("customer");
  const [showPassword, setShowPassword] = useState(false);

  const activeRole = ROLE_OPTIONS.find((option) => option.value === role)!;

  return (
    <main className="flex-1 bg-white flex items-center justify-center px-4 py-12 sm:py-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.12)] sm:p-10"
      >
        <motion.div variants={itemVariants} className="mb-7 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">Join Foodiego in a few seconds.</p>
        </motion.div>

        <form action={action} className="space-y-5">
          {/* Role selection — top of form */}
          <motion.div variants={itemVariants}>
            <span className="mb-2 block text-sm font-medium text-gray-700">I want to join as</span>
            <div role="radiogroup" aria-label="Account type" className="grid grid-cols-3 gap-2">
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
                    className={`relative flex flex-col items-center gap-1.5 overflow-hidden rounded-xl border px-2 py-3.5 text-center transition-colors ${
                      selected
                        ? "border-[#c83214] text-[#c83214]"
                        : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    {selected && (
                      <motion.span
                        layoutId="role-active-bg"
                        className="absolute inset-0 rounded-xl bg-[#c83214]/[0.06]"
                        transition={{ type: "spring", stiffness: 500, damping: 32 }}
                      />
                    )}
                    <span className="relative flex flex-col items-center gap-1.5">
                      <Icon size={20} strokeWidth={selected ? 2.4 : 2} />
                      <span className="text-xs font-semibold">{option.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={activeRole.value}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="mt-2 text-xs text-gray-400"
              >
                {activeRole.description}
              </motion.p>
            </AnimatePresence>
            <input type="hidden" name="role" value={role} />
            {state?.errors?.role && (
              <p className="mt-1 text-xs text-red-600">{state.errors.role[0]}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
              Full name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3.5 text-sm text-black focus:border-[#c83214] focus:outline-none focus:ring-2 focus:ring-[#c83214]/30"
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

          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3.5 text-sm text-black focus:border-[#c83214] focus:outline-none focus:ring-2 focus:ring-[#c83214]/30"
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

          <motion.div variants={itemVariants}>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
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
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-sm text-black focus:border-[#c83214] focus:outline-none focus:ring-2 focus:ring-[#c83214]/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {state?.errors?.password ? (
              <ul className="mt-1 list-inside list-disc space-y-0.5 text-xs text-red-600">
                {state.errors.password.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-xs text-gray-400">
                At least 8 characters, with a letter and a number.
              </p>
            )}
          </motion.div>

          <AnimatePresence>
            {state?.message && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-600"
              >
                {state.message}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#c83214] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#a82a11] disabled:opacity-60"
          >
            {pending && <LoaderCircle className="animate-spin" size={16} />}
            {pending ? "Creating account..." : "Create account"}
          </motion.button>
        </form>

        <motion.p variants={itemVariants} className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#c83214] hover:underline">
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </main>
  );
}
