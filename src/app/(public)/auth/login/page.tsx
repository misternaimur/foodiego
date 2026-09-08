"use client";

import Link from "next/link";
import { Suspense, useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LoaderCircle, ArrowLeft } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { establishSession } from "@/app/(public)/actions/auth";
import { mapAuthErrorMessage } from "@/lib/firebase/errors";
import type { FormState } from "@/lib/definitions";

async function loginAction(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "");

  let idToken: string;

  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    idToken = await credential.user.getIdToken();
  } catch (error) {
    return {
      message: mapAuthErrorMessage(error),
    };
  }

  return establishSession(idToken, undefined, redirectTo);
}

const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASE,
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: EASE,
    },
  },
};

function LoginForm() {
  const [state, action, pending] = useActionState(
    loginAction,
    undefined
  );

  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "";

  return (
    <div className="flex flex-1 items-center justify-center bg-white px-4 py-12 sm:py-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.12)] sm:p-10"
      >
        {/* Back Button */}
        <motion.div variants={itemVariants} className="mb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="mb-7 text-center"
        >
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Sign in to continue to Foodiego.
          </p>
        </motion.div>

        {/* Login Form */}
        <form action={action} className="space-y-4">
          {/* Redirect */}
          <input
            type="hidden"
            name="redirect"
            value={redirectTo}
          />

          {/* Email */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                size={17}
              />

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
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                  className="mt-1 text-xs text-red-600"
                >
                  {state.errors.email[0]}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                size={17}
              />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-sm text-black focus:border-[#c83214] focus:outline-none focus:ring-2 focus:ring-[#c83214]/30"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((value) => !value)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>

            <AnimatePresence>
              {state?.errors?.password && (
                <motion.p
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                  className="mt-1 text-xs text-red-600"
                >
                  {state.errors.password[0]}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* General Error */}
          <AnimatePresence>
            {state?.message && (
              <motion.p
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
                className="text-sm text-red-600"
              >
                {state.message}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{
              scale: 1.01,
            }}
            whileTap={{
              scale: 0.98,
            }}
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#c83214] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#a82a11] disabled:opacity-60"
          >
            {pending && (
              <LoaderCircle
                className="animate-spin"
                size={16}
              />
            )}

            {pending ? "Signing in..." : "Sign in"}
          </motion.button>
        </form>

        {/* Register Link */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-center text-sm text-gray-500"
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-[#c83214] hover:underline"
          >
            Create one
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <LoaderCircle
            className="animate-spin text-[#c83214]"
            size={24}
          />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}