"use client";

import Link from "next/link";
import { Suspense, useActionState, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { Mail, Lock, Eye, EyeOff, LoaderCircle, ArrowLeft } from "lucide-react";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";
import { establishGoogleSession, establishSession } from "@/app/(public)/actions/auth";
import { isAuthPopupDismissed, mapAuthErrorMessage } from "@/lib/firebase/errors";
import type { FormState } from "@/lib/definitions";
import LogoText from "@/components/Share/LogoText";

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
      getClientAuth(),
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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
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
  const [googlePending, startGoogle] = useTransition();
  const [googleError, setGoogleError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "";

  // Customer-only Google sign-in. The popup is opened synchronously inside the
  // click (before any await) so browsers don't treat it as an unsolicited
  // pop-up. If the server refuses the account (e.g. it's a rider or
  // restaurant), the Firebase client session is signed out again so the app
  // doesn't look half-logged-in.
  const handleGoogleSignIn = () => {
    setGoogleError(null);
    startGoogle(async () => {
      const auth = getClientAuth();
      let idToken: string;
      try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        const credential = await signInWithPopup(auth, provider);
        idToken = await credential.user.getIdToken();
      } catch (error) {
        if (!isAuthPopupDismissed(error)) setGoogleError(mapAuthErrorMessage(error));
        return;
      }

      const result = await establishGoogleSession(idToken, redirectTo);
      if (result?.message) {
        await signOut(auth).catch(() => {});
        setGoogleError(result.message);
      }
    });
  };
  const busy = pending || googlePending;

  return (
    <div className="fg-auth-main flex flex-1 items-center justify-center bg-white px-4 py-12 sm:py-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="fg-auth-card w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.12)] sm:p-10"
      >
        {/* Back Button */}
        <motion.div variants={itemVariants} className="relative mb-5 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>
          <LogoText className="absolute left-1/2 -translate-x-1/2" />
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
            disabled={busy}
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

        {/* Google sign-in (customers only) */}
        <motion.div variants={itemVariants} className="mt-5">
          <div className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-gray-400">
            <span className="h-px flex-1 bg-gray-200" />
            or
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={busy}
            className="group flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/60 hover:text-gray-900 hover:shadow-lg hover:shadow-emerald-500/10 active:translate-y-0 active:shadow-sm disabled:pointer-events-none disabled:opacity-60"
          >
            {googlePending ? (
              <LoaderCircle className="animate-spin" size={17} />
            ) : (
              <span className="transition-transform duration-300 group-hover:rotate-[360deg] group-hover:scale-110">
                <GoogleIcon />
              </span>
            )}
            {googlePending ? "Connecting to Google..." : "Continue with Google"}
          </button>
          <p className="mt-2 text-center text-xs text-gray-400">
            For customer accounts. Restaurants and riders, please use email and password.
          </p>

          <AnimatePresence>
            {googleError && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 text-center text-sm text-red-600"
                role="alert"
              >
                {googleError}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

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
        <div className="fg-auth-shell flex min-h-screen items-center justify-center bg-white">
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