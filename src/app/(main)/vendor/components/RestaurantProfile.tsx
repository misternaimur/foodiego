"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useVendorProfile, useUpdateVendorProfile } from "@/hooks/useVendorProfile";
import type { RestaurantProfile } from "@/hooks/useVendorProfile";
import { useVendorSocket } from "@/hooks/useVendorSocket";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const inputClasses =
  "w-full rounded-xl border border-gray-300 bg-white/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 backdrop-blur-sm transition-all";

const glassCard =
  "rounded-3xl border border-white/30 bg-white/70 shadow-2xl backdrop-blur-md";

export default function RestaurantProfile() {
  const { data: profile, isLoading, isError } = useVendorProfile();
  const { mutate: updateProfile, isPending: isSaving } = useUpdateVendorProfile();
  const { isConnected } = useVendorSocket();

  const [hasChanges, setHasChanges] = useState(false);

  const { control, handleSubmit, reset } = useForm<RestaurantProfile>({
    defaultValues: profile || undefined,
  });

  const packagingFeeEnabled = useWatch({ control, name: "packagingFeeEnabled" });

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded bg-gray-200 animate-pulse" />
        <div className="h-96 rounded-3xl bg-gray-200 animate-pulse" />
        <div className="h-64 rounded-3xl bg-gray-200 animate-pulse" />
      </div>
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

  return (
    <motion.form
      onSubmit={handleSave}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Profile</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Manage your restaurant details, delivery settings, and operating hours
          </p>
        </div>
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
      </div>

      {/* ================= BASIC INFORMATION CARD ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotateX: -10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={glassCard}
      >
        <div className="p-6 pb-2">
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
          <p className="text-xs text-gray-500">Edit your restaurant&apos;s core details</p>
        </div>

        <div className="p-6 pt-0 space-y-4">
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
                    onChange={(e) => { field.onChange(e.target.value); setHasChanges(true); }}
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
                    onChange={(e) => { field.onChange(e.target.value); setHasChanges(true); }}
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
                    onChange={(e) => { field.onChange(e.target.value); setHasChanges(true); }}
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
                    onChange={(e) => { field.onChange(e.target.value); setHasChanges(true); }}
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
                    onChange={(e) => { field.onChange(e.target.value); setHasChanges(true); }}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.6fr_0.4fr]">
        {/* LEFT COLUMN: Delivery Setup & Document Vault */}
        <div className="space-y-6">
          {/* Delivery Setup */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={glassCard}
          >
            <div className="p-6 pb-2">
              <h2 className="text-lg font-semibold text-gray-900">Delivery Setup & Pricing</h2>
              <p className="text-xs text-gray-500">Configure delivery fees and minimum order values</p>
            </div>

            <div className="p-6 pt-0 space-y-4">
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
                        onChange={(e) => { field.onChange(Number(e.target.value)); setHasChanges(true); }}
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
                        onChange={(e) => { field.onChange(Number(e.target.value)); setHasChanges(true); }}
                      />
                    )}
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-4">
                  <Controller
                    control={control}
                    name="packagingFeeEnabled"
                    render={({ field: { value, onChange } }) => (
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? "bg-emerald-500" : "bg-gray-300"
                          }`}
                          onClick={() => { onChange(!value); setHasChanges(true); }}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                              value ? "translate-x-5" : "translate-x-1"
                            }`}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          Packaging Fee Enabled
                        </span>
                      </label>
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
                          onChange={(e) => { field.onChange(Number(e.target.value)); setHasChanges(true); }}
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
            initial={{ opacity: 0, y: 20, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={glassCard}
          >
            <div className="p-6 pb-2">
              <h2 className="text-lg font-semibold text-gray-900">Document Vault (Verification)</h2>
              <p className="text-xs text-gray-500">Upload trade license and owner NID documents</p>
            </div>

            <div className="p-6 pt-0">
              <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-8 text-center transition-colors hover:border-emerald-300 hover:bg-emerald-50/30">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <Upload size={24} className="text-emerald-600" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-gray-700">
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
                  <button
                    type="button"
                    className="mt-4 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Choose Files
                  </button>
                </div>
              </div>

              {profile.tradeLicenseUrl && (
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-gray-600">Trade License: Uploaded</span>
                </div>
              )}
              {profile.ownerNidUrl && (
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-gray-600">Owner NID: Uploaded</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Location & Operating Hours */}
        <div className="space-y-6">
          {/* Operating Hours Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={glassCard}
          >
            <div className="p-6 pb-2">
              <h2 className="text-lg font-semibold text-gray-900">Operating Hours</h2>
              <p className="text-xs text-gray-500">Set your restaurant&apos;s availability schedule</p>
            </div>

            <div className="p-6 pt-0 space-y-3">
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
                  <div
                    key={day}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                      isToday
                        ? "border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-100/50"
                        : "border-gray-200 bg-white/50 hover:bg-gray-50/50"
                    }`}
                  >
                    <div className="w-20 text-xs font-medium text-gray-700">
                      {day.slice(0, 3)}
                      {isToday && <span className="ml-1 text-emerald-500">*</span>}
                    </div>

                    <Controller
                      control={control}
                      name={`operatingHours.${dayIndex}.isOpen`}
                      render={({ field: { value, onChange } }) => (
                        <label className="flex items-center cursor-pointer">
                          <div
                            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                              value ? "bg-emerald-500" : "bg-gray-300"
                            }`}
                            onClick={() => { onChange(!value); setHasChanges(true); }}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                value ? "translate-x-5" : "translate-x-1"
                              }`}
                            />
                          </div>
                        </label>
                      )}
                    />

                    {dayData.isOpen && (
                      <>
                        <input
                          type="time"
                          className="w-32 rounded-lg border border-gray-300 bg-white/50 px-3 py-1.5 text-sm text-gray-800 focus:border-emerald-500 focus:outline-none"
                          defaultValue={dayData.openTime}
                          onChange={(e) => {
                            const hours = [...profile.operatingHours];
                            if (hours[dayIndex]) {
                              hours[dayIndex] = { ...hours[dayIndex], openTime: e.target.value };
                            }
                            setHasChanges(true);
                          }}
                        />
                        <span className="text-gray-400">—</span>
                        <input
                          type="time"
                          className="w-32 rounded-lg border border-gray-300 bg-white/50 px-3 py-1.5 text-sm text-gray-800 focus:border-emerald-500 focus:outline-none"
                          defaultValue={dayData.closeTime}
                          onChange={(e) => {
                            const hours = [...profile.operatingHours];
                            if (hours[dayIndex]) {
                              hours[dayIndex] = { ...hours[dayIndex], closeTime: e.target.value };
                            }
                            setHasChanges(true);
                          }}
                        />
                      </>
                    )}
                  </div>
                );
              })}

              <p className="text-xs text-gray-400">
                * {currentDay} — highlighted as current day
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ================= ACTION FOOTER ================= */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-0 right-0 mx-auto flex justify-center"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white/80 px-6 py-4 shadow-2xl backdrop-blur-md">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleDiscard}
                className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <X size={14} />
                Discard Changes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50 transition-colors"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
