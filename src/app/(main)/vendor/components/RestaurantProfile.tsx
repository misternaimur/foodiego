"use client";

import { useState, useRef } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Save,
  X,
  Globe,
  Phone,
  Mail,
  Upload,
  Tag,
  FileText,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Star,
  Sparkles,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useVendorProfile, useUpdateVendorProfile } from "@/hooks/useVendorProfile";
import type { RestaurantProfile } from "@/hooks/useVendorProfile";
import { useVendorSocket } from "@/hooks/useVendorSocket";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const ProfileMap = dynamic(() => import("@/app/(main)/vendor/components/ProfileMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-2xl bg-gray-200" />
  ),
});

const glassCard =
  "relative overflow-hidden rounded-[2rem] border border-white/30 bg-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md";

const inputClasses =
  "w-full rounded-xl border border-gray-300/50 bg-white/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 backdrop-blur-sm transition-all";

export default function RestaurantProfile() {
  const { data: profile, isLoading, isError } = useVendorProfile();
  const { mutate: updateProfile, isPending: isSaving } = useUpdateVendorProfile();
  const { isConnected } = useVendorSocket();

  const [hasChanges, setHasChanges] = useState(false);
  const [blobPositions] = useState(() =>
    Array.from({ length: 5 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
    }))
  );

  const { control, handleSubmit, reset, setValue } = useForm<RestaurantProfile>({
    defaultValues: profile || undefined,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setValue("tradeLicenseUrl", objectUrl);
    setValue("ownerNidUrl", objectUrl);
    setHasChanges(true);
  };

  const packagingFeeEnabled = useWatch({ control, name: "packagingFeeEnabled" });
  const storeStatus = useWatch({ control, name: "storeStatus" });

  const handleSave = handleSubmit(async (data) => {
    await updateProfile(data);
    setHasChanges(false);
  });

  const handleDiscard = () => {
    if (profile) {
      reset(profile);
    }
    setHasChanges(false);
  };

  const handleToggleStore = () => {
    setValue("storeStatus", storeStatus === "open" ? "closed" : "open");
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="relative h-full min-h-[400px] w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-gray-100 to-gray-200" />
    );
  }

  if (isError || !profile) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center"
      >
        <AlertCircle size={32} className="mx-auto mb-3 text-rose-400" />
        <p className="text-sm text-rose-700">Unable to load restaurant profile.</p>
      </motion.div>
    );
  }

  const currentDay = new Date().toLocaleString("en-US", { weekday: "long" });
  const categoryTags = ["Burgers", "Fast Food", "Asian Fusion", "Desserts"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* ================= LIVE ANIMATED BACKGROUND ================= */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-emerald-400/30 via-teal-300/20 to-cyan-300/20 blur-3xl"
          animate={{
            x: [0, 50, 0, -50, 0],
            y: [0, 30, 0, -30, 0],
            scale: [1, 1.1, 0.95, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-amber-400/25 via-rose-300/15 to-pink-300/20 blur-3xl"
          animate={{
            x: [0, -30, 0, 30, 0],
            y: [0, -20, 0, 20, 0],
            scale: [1, 0.95, 1.1, 0.95, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/4 left-1/3 h-[300px] w-[300px] rounded-full bg-gradient-to-r from-indigo-400/20 via-purple-300/15 to-violet-300/20 blur-2xl"
          animate={{
            x: [0, 20, 0, -20, 0],
            y: [0, -15, 0, 15, 0],
            opacity: [0.5, 0.7, 0.5, 0.7, 0.5],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        {/* Particle grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            {Array.from({ length: 15 }).map((_, i) =>
              Array.from({ length: 15 }).map((_, j) => {
                const x = (i + 1) * (1200 / 15);
                const y = (j + 1) * (800 / 15);
                return (
                  <motion.circle
                    key={`${i}-${j}`}
                    cx={x}
                    cy={y}
                    r="1"
                    fill="currentColor"
                    initial={{ opacity: 0.3, scale: 1 }}
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 3 + (i + j) * 0.1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                );
              })
            )}
          </svg>
        </div>
      </div>

      {blobPositions.length > 0 &&
        blobPositions.map((pos, i) => (
          <motion.div
            key={i}
            className="fixed -z-10 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl"
            style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
            animate={{
              opacity: [0.1, 0.15, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

      {/* ================= CONTENT LAYOUT ================= */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8">
        <motion.form
          onSubmit={handleSave}
          className="w-full space-y-8"
        >
          {/* ================= IMMERSIVE 3D HERO SHOWCASE ================= */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative rounded-[2.5rem] border border-white/30 bg-white/70 shadow-2xl backdrop-blur-xl"
            style={{ perspective: "1000px" }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-500/10 opacity-60 blur-xl" />
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-100 to-transparent opacity-40" />
            <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/3 h-32 w-32 rounded-full bg-gradient-to-br from-amber-100 to-transparent opacity-30" />

            <div className="relative p-8">
              {/* Floating 3D Avatar with Glowing Pulse Ring */}
              <motion.div
                className="absolute -top-12 left-8 z-10"
                style={{ perspective: "800px" }}
                whileHover={{ rotateY: 5, rotateX: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className="relative h-28 w-28 rounded-full border-4 border-white shadow-2xl"
                  animate={{
                    boxShadow: [
                      "0 0 0 0px rgba(16, 185, 129, 0.5)",
                      "0 0 0 12px rgba(16, 185, 129, 0)",
                      "0 0 0 0px rgba(16, 185, 129, 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.logoUrl || "/placeholder-logo.svg"}
                    alt={profile.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 60%)",
                    }}
                  />
                </motion.div>
                <motion.div
                  className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-1.5 shadow-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Star size={14} className="text-white" />
                </motion.div>
              </motion.div>

              {/* Header Content */}
              <div className="ml-32 flex flex-col">
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.name || "FoodieGo Restaurant"}
                  </h1>

                  {/* Store Status Toggle */}
                  <motion.button
                    type="button"
                    onClick={handleToggleStore}
                    className="relative inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
                    style={{
                      background:
                        storeStatus === "open"
                          ? "linear-gradient(135deg, #10b981, #059669)"
                          : "linear-gradient(135deg, #9ca3af, #6b7280)",
                    }}
                  >
                    <span className="relative flex h-2 w-2">
                      <span
                        className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                          storeStatus === "open" ? "bg-white" : "bg-white/70"
                        }`}
                      />
                      <span
                        className={`relative inline-flex h-2 w-2 rounded-full ${
                          storeStatus === "open" ? "bg-white" : "bg-white/70"
                        }`}
                      />
                    </span>
                    Store Status: {storeStatus === "open" ? "OPEN" : "CLOSED"}
                  </motion.button>
                </div>

                {/* Category Tags */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {categoryTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-100/60 px-3 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm"
                    >
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  {profile.tagline || "Authentic flavors, delivered fast"}
                </p>

                {/* Live Status Badge */}
                <div className="mt-3 flex items-center gap-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold ${
                      isConnected
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isConnected ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
                      }`}
                    />
                    {isConnected ? "Live Updates" : "Offline"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {profile.email || "restaurant@foodiego.com"}
                  </span>
                </div>
              </div>
            </div>

            {/* Glowing border accent on focus */}
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-[2.5rem]"
              initial={{ opacity: 0 }}
              animate={{ opacity: hasChanges ? 0.5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 rounded-[2.5rem] border-2 border-emerald-400/50 opacity-0 shadow-[0_0_40px_theme(colors.emerald.400/40)]" />
            </motion.div>
          </motion.div>

          {/* ================= MAIN GRID ================= */}
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[0.6fr_0.4fr]">
            {/* LEFT COLUMN: Basic Information + Delivery Setup */}
            <div className="space-y-8">
              {/* Basic Information */}
              <motion.div
                initial={{ opacity: 0, x: -30, rotateY: -10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={glassCard}
              >
                <div className="relative p-6 pb-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 via-transparent to-transparent opacity-50" />
                  <h2 className="relative text-lg font-semibold text-gray-900">
                    Basic Information
                  </h2>
                  <p className="relative text-xs text-gray-500">
                    Edit your restaurant&apos;s core details
                  </p>
                </div>

                <div className="relative p-6 pt-0 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
                        <User size={14} />
                        Restaurant Name
                      </label>
                      <Controller
                        control={control}
                        name="name"
                        render={({ field }) => (
                          <input
                            {...field}
                            className={inputClasses}
                            placeholder="FoodieGo Restaurant"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setHasChanges(true);
                            }}
                          />
                        )}
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
                        <Tag size={14} />
                        Tagline
                      </label>
                      <Controller
                        control={control}
                        name="tagline"
                        render={({ field }) => (
                          <input
                            {...field}
                            className={inputClasses}
                            placeholder="Authentic flavors, delivered fast"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setHasChanges(true);
                            }}
                          />
                        )}
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
                        <Phone size={14} />
                        Phone Number
                      </label>
                      <Controller
                        control={control}
                        name="phone"
                        render={({ field }) => (
                          <input
                            {...field}
                            className={inputClasses}
                            placeholder="+880 1XXXXXXXXX"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setHasChanges(true);
                            }}
                          />
                        )}
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
                        <Mail size={14} />
                        Email Address
                      </label>
                      <Controller
                        control={control}
                        name="email"
                        render={({ field }) => (
                          <input
                            {...field}
                            type="email"
                            className={inputClasses}
                            placeholder="restaurant@foodiego.com"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setHasChanges(true);
                            }}
                          />
                        )}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
                        <Globe size={14} />
                        Website
                      </label>
                      <Controller
                        control={control}
                        name="website"
                        render={({ field }) => (
                          <input
                            {...field}
                            className={inputClasses}
                            placeholder="www.foodiego.com"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setHasChanges(true);
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Delivery Setup */}
              <motion.div
                initial={{ opacity: 0, x: -30, rotateY: -10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={glassCard}
              >
                <div className="relative p-6 pb-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 via-transparent to-transparent opacity-50" />
                  <h2 className="relative text-lg font-semibold text-gray-900">
                    Delivery Setup & Pricing
                  </h2>
                  <p className="relative text-xs text-gray-500">
                    Configure delivery fees and minimum order values
                  </p>
                </div>

                <div className="relative p-6 pt-0 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase">
                        Minimum Order Value
                      </label>
                      <Controller
                        control={control}
                        name="minOrderValue"
                        render={({ field }) => (
                          <input
                            {...field}
                            type="number"
                            className={inputClasses}
                            placeholder="৳150"
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                              setHasChanges(true);
                            }}
                          />
                        )}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase">
                        Base Delivery Fee
                      </label>
                      <Controller
                        control={control}
                        name="deliveryFee"
                        render={({ field }) => (
                          <input
                            {...field}
                            type="number"
                            className={inputClasses}
                            placeholder="৳50"
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                              setHasChanges(true);
                            }}
                          />
                        )}
                      />
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-4">
                      <Controller
                        control={control}
                        name="packagingFeeEnabled"
                        render={({ field: { value, onChange } }) => (
                          <motion.label
                            className="flex items-center gap-3 cursor-pointer"
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.div
                              className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors"
                              style={{
                                background: value
                                  ? "linear-gradient(135deg, #10b981, #059669)"
                                  : "#d1d5db",
                              }}
                              onClick={() => {
                                onChange(!value);
                                setHasChanges(true);
                              }}
                            >
                              <motion.div
                                className="absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-lg"
                                animate={{
                                  x: value ? 36 : 4,
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 30,
                                }}
                              />
                  </motion.div>
                            <span className="text-sm font-medium text-gray-700">
                              Packaging Fee Enabled
                            </span>
                          </motion.label>
                        )}
                      />

                      {packagingFeeEnabled && (
                        <Controller
                          control={control}
                          name="packagingFee"
                          render={({ field }) => (
                            <input
                              {...field}
                              type="number"
                              className={`${inputClasses} w-32`}
                              placeholder="৳15"
                              onChange={(e) => {
                                field.onChange(Number(e.target.value));
                                setHasChanges(true);
                              }}
                            />
                          )}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Document Vault */}
              <motion.div
                initial={{ opacity: 0, x: -30, rotateY: -10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={glassCard}
              >
                <div className="relative p-6 pb-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-transparent opacity-50" />
                  <h2 className="relative text-lg font-semibold text-gray-900">
                    Document Vault (Verification)
                  </h2>
                  <p className="relative text-xs text-gray-500">
                    Upload trade license and owner NID documents
                  </p>
                </div>

                <div className="relative p-6 pt-0">
                  <motion.div
                    className="relative rounded-3xl border-2 border-dashed border-gray-300/50 bg-gray-50/50 p-10 text-center transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-50/30"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="absolute inset-0 opacity-0 hover:opacity-10 transition-opacity duration-500">
                      <div className="absolute top-1/4 left-1/3 h-1 w-1/3 rotate-45 rounded-full bg-emerald-400/30 blur" />
                      <div className="absolute top-1/2 left-1/4 h-1 w-1/4 rounded-full bg-amber-400/30 blur" />
                    </div>

                    <div className="relative flex flex-col items-center">
                      <motion.div
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-amber-500/20"
                        animate={{ rotate: [0, 5, -5, 5, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Upload size={32} className="text-emerald-600" />
                      </motion.div>

                      <p className="mt-4 text-sm font-medium text-gray-700">
                        Drop your files here or click to upload
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Supported: PDF, JPG, PNG (Max 5MB each)
                      </p>

                      <ul className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                        <li className="flex items-center gap-1">
                          <FileText size={12} /> Trade License
                        </li>
                        <li className="flex items-center gap-1">
                          <FileText size={12} /> Owner NID
                        </li>
                      </ul>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      className="mt-4 rounded-xl border border-gray-300 bg-white/60 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-white/80 backdrop-blur-sm transition-all"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose Files
                    </motion.button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    </div>
                  </motion.div>

                  {profile.tradeLicenseUrl && (
                    <motion.div
                      className="mt-4 flex items-center gap-2 text-xs"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span className="text-gray-600">Trade License: Uploaded</span>
                    </motion.div>
                  )}
                  {profile.ownerNidUrl && (
                    <motion.div
                      className="mt-2 flex items-center gap-2 text-xs"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 }}
                    >
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span className="text-gray-600">Owner NID: Uploaded</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Map + Operating Hours */}
            <div className="space-y-8">
              {/* 3D Interactive Location Map */}
              <motion.div
                initial={{ opacity: 0, x: 30, rotateY: 10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className={glassCard}
              >
                <div className="relative p-6 pb-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/30 via-transparent to-transparent opacity-50" />
                  <h2 className="relative text-lg font-semibold text-gray-900">
                    Delivery Coverage Map
                  </h2>
                  <p className="relative text-xs text-gray-500">
                    Drag the pin to adjust your delivery zone origin
                  </p>
                </div>

                <div className="relative p-6 pt-0">
                  <motion.div
                    className="relative h-64 w-full overflow-hidden rounded-2xl border border-gray-200/50 shadow-inner"
                    whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
                  >
                    <ProfileMap
                      lat={profile.latitude}
                      lng={profile.longitude}
                      address={profile.address}
                      onLocationChange={(newLat, newLng) => {
                        setValue("latitude", newLat);
                        setValue("longitude", newLng);
                        setHasChanges(true);
                      }}
                    />
                  </motion.div>

                  <motion.div
                    className="mt-4 flex items-center gap-2 rounded-xl border border-gray-200/50 bg-white/40 px-3 py-2 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <MapPin size={14} className="text-emerald-600" />
                    <Controller
                      control={control}
                      name="address"
                      render={({ field }) => (
                        <input
                          {...field}
                          className="flex-1 border-0 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                          placeholder="Physical address"
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setHasChanges(true);
                          }}
                        />
                      )}
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* Operating Hours Matrix */}
              <motion.div
                initial={{ opacity: 0, x: 30, rotateY: 10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className={glassCard}
              >
                <div className="relative p-6 pb-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-100/30 via-transparent to-transparent opacity-50" />
                  <h2 className="relative text-lg font-semibold text-gray-900">
                    Operating Schedule
                  </h2>
                  <p className="relative text-xs text-gray-500">
                    Set your restaurant&apos;s availability schedule
                  </p>
                </div>

                <div className="relative p-6 pt-0 space-y-2">
                  {daysOfWeek.map((day) => {
                    const dayIndex = daysOfWeek.indexOf(day);
                    const dayData = profile.operatingHours[dayIndex] || {
                      day,
                      isOpen: false,
                      openTime: "10:00",
                      closeTime: "22:00",
                    };
                    const isToday = day === currentDay;

                    return (
                      <motion.div
                        key={day}
                        className={`relative flex items-center gap-3 rounded-xl border p-3 transition-all ${
                          isToday
                            ? "border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-100/50"
                            : "border-gray-200/50 bg-white/40 hover:bg-white/60 backdrop-blur-sm"
                        }}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * dayIndex }}
                      >
                        {isToday && (
                          <motion.div
                            className="absolute -left-1 top-1/2 -translate-y-1/2 h-4 w-1 rounded-full bg-emerald-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          />
                        )}

                        <div className="w-20 text-xs font-medium text-gray-700">
                          {day.slice(0, 3)}
                          {isToday && (
                            <motion.span
                              className="ml-1 text-emerald-500"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              •
                            </motion.span>
                          )}
                        </div>

                        <Controller
                          control={control}
                          name={`operatingHours.${dayIndex}.isOpen`}
                          render={({ field: { value, onChange } }) => (
                            <motion.label className="flex items-center cursor-pointer">
                              <motion.div
                                className="relative inline-flex h-6 w-12 items-center rounded-full"
                                style={{
                                  background: value
                                    ? "linear-gradient(135deg, #10b981, #059669)"
                                    : "#d1d5db",
                                }}
                                onClick={() => {
                                  onChange(!value);
                                  setHasChanges(true);
                                }}
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{
                                  duration: 0.3,
                                  type: "tween",
                                  stiffness: 500,
                                  damping: 30,
                                }}
                              >
                                <motion.div
                                  className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow"
                                  animate={{ x: value ? 24 : 4 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                  }}
                            />
                            </motion.div>
                            </motion.label>
                          )}
                        />

                        {dayData.isOpen && (
                          <>
                            <motion.input
                              type="time"
                              className="w-32 rounded-lg border border-gray-300/50 bg-white/50 px-3 py-1.5 text-sm text-gray-800 focus:border-emerald-500 focus:outline-none transition-all"
                              defaultValue={dayData.openTime}
                              whileFocus={{ scale: 1.02 }}
                              onChange={() => setHasChanges(true)}
                            />
                            <span className="text-gray-400">—</span>
                            <motion.input
                              type="time"
                              className="w-32 rounded-lg border border-gray-300/50 bg-white/50 px-3 py-1.5 text-sm text-gray-800 focus:border-emerald-500 focus:outline-none transition-all"
                              defaultValue={dayData.closeTime}
                              whileFocus={{ scale: 1.02 }}
                              onChange={() => setHasChanges(true)}
                            />
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>

          {/* ================= ACTION FOOTER ================= */}
          <AnimatePresence>
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.9 }}
                className="fixed bottom-8 left-0 right-0 mx-auto flex justify-center"
              >
                <motion.div
                  className="relative flex items-center gap-4 rounded-3xl border border-white/30 bg-white/80 px-8 py-4 shadow-2xl backdrop-blur-xl"
                  style={{
                    boxShadow:
                      "0 8px 32px rgba(0, 0, 0, 0.08), 0 0 40px rgba(16, 185, 129, 0.2)",
                  }}
                >
                  <motion.div
                    className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-transparent to-amber-500/10 opacity-60 blur"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                  />

                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={handleDiscard}
                    className="relative rounded-xl border border-gray-300/50 bg-white/60 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-white/80 backdrop-blur-sm transition-all"
                  >
                    <X size={14} className="absolute left-2 top-1/2 -translate-y-1/2" />
                    <span className="ml-5">Discard Changes</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={isSaving}
                    className="relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 disabled:opacity-50 transition-all"
                  >
                    {isSaving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        >
                          <Save size={14} />
                        </motion.div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Save Profile Settings
                      </>
                    )}
                  </motion.button>

                  <motion.div
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: hasChanges ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Sparkles size={10} />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </motion.div>
  );
}
