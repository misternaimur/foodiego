"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useActionState, type ComponentType } from "react";
import { motion, type Variants } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Bike,
  IdCard,
  Hash,
  ImagePlus,
  UploadCloud,
  X,
  ArrowLeft,
  Sparkles,
  LoaderCircle,
} from "lucide-react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "@/lib/firebase/client";
import { registerRider } from "@/app/(public)/actions/rider";
import { mapAuthErrorMessage } from "@/lib/firebase/errors";
import {
  RIDER_VEHICLE_TYPES,
  RiderRegisterFormSchema,
  type RiderFormState,
} from "@/lib/definitions";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB

function getStr(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalStr(formData: FormData, key: string) {
  const value = getStr(formData, key);
  return value ? value : undefined;
}

async function registerRiderAction(
  _state: RiderFormState,
  formData: FormData
): Promise<RiderFormState> {
  const fields = {
    fullName: getStr(formData, "fullName"),
    email: getStr(formData, "email"),
    password: getStr(formData, "password"),
    phone: getStr(formData, "phone"),
    address: getStr(formData, "address"),
    city: getStr(formData, "city"),
    vehicleType: getStr(formData, "vehicleType"),
    vehicleNumber: getOptionalStr(formData, "vehicleNumber"),
    licenseNumber: getStr(formData, "licenseNumber"),
  };

  const confirmPassword = getStr(formData, "confirmPassword");
  if (fields.password !== confirmPassword) {
    return { errors: { password: ["Passwords do not match."] } };
  }

  const validatedFields = RiderRegisterFormSchema.safeParse(fields);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const photoFile = formData.get("photo");
  if (!(photoFile instanceof File) || photoFile.size === 0) {
    return { message: "Please upload a profile photo." };
  }
  if (photoFile.size > MAX_PHOTO_SIZE) {
    return { message: "Photo must be smaller than 5MB." };
  }

  let idToken: string;
  let uid: string;
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      validatedFields.data.email,
      validatedFields.data.password
    );
    uid = credential.user.uid;
    idToken = await credential.user.getIdToken();
  } catch (error) {
    if (error instanceof FirebaseError && error.code === "auth/email-already-in-use") {
      try {
        const credential = await signInWithEmailAndPassword(
          auth,
          validatedFields.data.email,
          validatedFields.data.password
        );
        uid = credential.user.uid;
        idToken = await credential.user.getIdToken();
      } catch {
        return { message: "An account with this email already exists. Please sign in instead." };
      }
    } else {
      return { message: mapAuthErrorMessage(error) };
    }
  }

  // Best-effort photo upload: if Storage is unreachable (e.g. missing bucket
  // CORS policy for web origins) we still complete the registration rather than
  // leaving the form stuck. The photo can be added later from the profile page.
  let photoUrl: string | undefined;
  try {
    const photoRef = ref(storage, `rider-photos/${uid}/${Date.now()}-${photoFile.name}`);
    await uploadBytes(photoRef, photoFile);
    photoUrl = await getDownloadURL(photoRef);
  } catch (error) {
    console.warn("Rider photo upload failed, continuing without it:", error);
  }

  return registerRider(idToken, { ...validatedFields.data, photoUrl });
}

const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, staggerChildren: 0.05, delayChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-xs text-red-600">{errors[0]}</p>;
}

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
        <Icon size={16} />
      </div>
      <div>
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50/30 py-2.5 pl-10 pr-3.5 text-sm text-black transition-colors placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-600/10";

const plainInputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3.5 py-2.5 text-sm text-black transition-colors placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-600/10";

function RiderRegisterFormContent() {
  const [state, action, pending] = useActionState(registerRiderAction, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photoPreview = useMemo(
    () => (photoFile ? URL.createObjectURL(photoFile) : null),
    [photoFile]
  );

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handleFileSelect = (file: File | null) => {
    if (file && !file.type.startsWith("image/")) return;
    setPhotoFile(file);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-3xl rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_10px_50px_-12px_rgba(16,185,129,0.08)] sm:p-10"
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
          <span>Rider Partner Application</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Become a Delivery Rider
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Tell us about yourself and your vehicle. Our team reviews every application before it goes
          live — you&apos;ll be notified as soon as a decision is made.
        </p>
      </motion.div>

      <form action={action} className="space-y-8">
        {/* Personal & Contact Information */}
        <motion.div variants={itemVariants} className="space-y-4">
          <SectionHeading icon={User} title="Personal & Contact Information" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-xs font-semibold text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input id="fullName" name="fullName" type="text" autoComplete="name" required placeholder="Jane Doe" className={inputClass} />
              </div>
              <FieldError errors={state?.errors?.fullName} />
            </div>

            <div>
              <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input id="phone" name="phone" type="tel" autoComplete="tel" required placeholder="+1 (555) 019-2834" className={inputClass} />
              </div>
              <FieldError errors={state?.errors?.phone} />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
              <input id="email" name="email" type="email" autoComplete="email" required placeholder="rider@example.com" className={inputClass} />
            </div>
            <FieldError errors={state?.errors?.email} />
          </div>
        </motion.div>

        {/* Address */}
        <motion.div variants={itemVariants} className="space-y-4 border-t border-gray-100 pt-6">
          <SectionHeading icon={MapPin} title="Address" />

          <div>
            <label htmlFor="address" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Street Address
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
              <input id="address" name="address" type="text" required placeholder="128 Savor Avenue" className={inputClass} />
            </div>
            <FieldError errors={state?.errors?.address} />
          </div>

          <div>
            <label htmlFor="city" className="mb-1.5 block text-xs font-semibold text-gray-700">
              City
            </label>
            <input id="city" name="city" type="text" required placeholder="Foodiego City" className={plainInputClass} />
            <FieldError errors={state?.errors?.city} />
          </div>
        </motion.div>

        {/* Vehicle Information */}
        <motion.div variants={itemVariants} className="space-y-4 border-t border-gray-100 pt-6">
          <SectionHeading icon={Bike} title="Vehicle Information" subtitle="How you'll be making deliveries" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="vehicleType" className="mb-1.5 block text-xs font-semibold text-gray-700">
                Vehicle Type
              </label>
              <select id="vehicleType" name="vehicleType" required defaultValue="" className={plainInputClass}>
                <option value="" disabled>
                  Select vehicle type
                </option>
                {RIDER_VEHICLE_TYPES.map((v) => (
                  <option key={v} value={v} className="capitalize">
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </option>
                ))}
              </select>
              <FieldError errors={state?.errors?.vehicleType} />
            </div>

            <div>
              <label htmlFor="vehicleNumber" className="mb-1.5 block text-xs font-semibold text-gray-700">
                Vehicle Number / Plate <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <div className="relative">
                <Hash className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input id="vehicleNumber" name="vehicleNumber" type="text" placeholder="DHK-12-3456" className={inputClass} />
              </div>
              <FieldError errors={state?.errors?.vehicleNumber} />
            </div>
          </div>

          <div>
            <label htmlFor="licenseNumber" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Driving Licence Number
            </label>
            <div className="relative">
              <IdCard className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
              <input id="licenseNumber" name="licenseNumber" type="text" required placeholder="DL-9921-8472" className={inputClass} />
            </div>
            <FieldError errors={state?.errors?.licenseNumber} />
          </div>
        </motion.div>

        {/* Profile Photo */}
        <motion.div variants={itemVariants} className="space-y-3 border-t border-gray-100 pt-6">
          <SectionHeading icon={ImagePlus} title="Profile Photo" subtitle="Shown to customers and admin reviewers" />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFileSelect(e.dataTransfer.files?.[0] ?? null);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
              isDragging
                ? "border-emerald-600 bg-emerald-50/60"
                : "border-gray-200 bg-gray-50/40 hover:border-emerald-300 hover:bg-emerald-50/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              name="photo"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
            />
            {photoPreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview before upload */}
                <img
                  src={photoPreview}
                  alt="Profile photo preview"
                  className="h-24 w-24 rounded-2xl object-cover ring-2 ring-emerald-600/20"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileSelect(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute right-3 top-3 rounded-full bg-white p-1 text-gray-500 shadow-sm ring-1 ring-gray-200 transition-colors hover:text-red-600"
                  aria-label="Remove photo"
                >
                  <X size={14} />
                </button>
                <p className="max-w-xs truncate text-xs font-medium text-gray-600">{photoFile?.name}</p>
                <span className="text-[11px] font-semibold text-emerald-600">Click to change</span>
              </>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <UploadCloud size={20} />
                </div>
                <p className="text-sm font-semibold text-gray-700">Upload a clear profile photo</p>
                <p className="text-xs text-gray-400">PNG or JPG, up to 5MB — drag &amp; drop or click to browse</p>
              </>
            )}
          </div>
        </motion.div>

        {/* Account / Password Information */}
        <motion.div variants={itemVariants} className="space-y-4 border-t border-gray-100 pt-6">
          <SectionHeading icon={Lock} title="Account / Password Information" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
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
              <FieldError errors={state?.errors?.password} />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-semibold text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/30 py-2.5 pl-10 pr-10 text-sm text-black transition-colors placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400">Min 8 characters with at least a letter and a number.</p>
        </motion.div>

        {state?.message && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-700"
          >
            {state.message}
          </motion.div>
        )}

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-colors hover:bg-emerald-700 disabled:opacity-60"
        >
          {pending && <LoaderCircle className="animate-spin" size={17} />}
          {pending ? "Submitting application..." : "Submit Application"}
        </motion.button>
      </form>

      <motion.p variants={itemVariants} className="mt-7 text-center text-sm text-gray-500">
        Already have a rider account?{" "}
        <Link href="/auth/login" className="font-semibold text-emerald-600 hover:underline">
          Sign in
        </Link>
      </motion.p>
    </motion.div>
  );
}

export default function RiderRegisterPage() {
  return (
    <main className="flex-1 bg-white flex items-center justify-center px-4 py-12 sm:py-16">
      <RiderRegisterFormContent />
    </main>
  );
}
