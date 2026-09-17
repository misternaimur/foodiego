// src/app/(main)/vendor/profile/page.tsx
"use client";

import { useState } from "react";
import { Camera, Save, Store, MapPin, Phone, Clock, Utensils } from "lucide-react";
import * as vendorActions from "@/actions/vendor";
import { uploadImage } from "@/actions/upload";

const updateVendorProfile = (
  vendorActions as typeof vendorActions & {
    updateVendorProfile: (
      id: string,
      data: Record<string, string | undefined>,
    ) => Promise<{ success: boolean; message?: string }>
  }
).updateVendorProfile;

interface VendorProfileProps {
  initialData?: {
    id?: string;
    restaurantName?: string;
    description?: string;
    phone?: string;
    address?: string;
    cuisineType?: string;
    openingTime?: string;
    closingTime?: string;
    bannerUrl?: string;
    logoUrl?: string;
    email?: string;
  };
}

export default function VendorProfilePage({ initialData }: VendorProfileProps) {
  // সেফ ফলব্যাক ইনিশিয়ালাইজেশন (ডাটা না থাকলে ক্র্যাশ করবে না)
  const [formData, setFormData] = useState({
    id: initialData?.id || "",
    restaurantName: initialData?.restaurantName || "",
    description: initialData?.description || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    cuisineType: initialData?.cuisineType || "",
    openingTime: initialData?.openingTime || "",
    closingTime: initialData?.closingTime || "",
    bannerUrl: initialData?.bannerUrl || "",
    logoUrl: initialData?.logoUrl || "",
    email: initialData?.email || "",
  });

  const [loading, setLoading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Handle Image Upload
  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>, type: "banner" | "logo") {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("folder", "restaurants");

    if (type === "banner") setUploadingBanner(true);
    else setUploadingLogo(true);

    try {
      const res = await uploadImage(uploadData);
      if (res.success) {
        setFormData((prev) => ({
          ...prev,
          [type === "banner" ? "bannerUrl" : "logoUrl"]: res.data.imageUrl,
        }));
      } else {
        alert(res.error);
      }
    } catch {
      alert("Image upload failed.");
    } finally {
      if (type === "banner") setUploadingBanner(false);
      else setUploadingLogo(false);
    }
  }

  // Handle Form Submit
  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData.id) {
      setMessage({ type: "error", text: "Restaurant ID is missing." });
      return;
    }

    setLoading(true);
    setMessage(null);

    const res = await updateVendorProfile(formData.id, {
      restaurantName: formData.restaurantName,
      description: formData.description,
      phone: formData.phone,
      address: formData.address,
      cuisineType: formData.cuisineType,
      openingTime: formData.openingTime,
      closingTime: formData.closingTime,
      bannerUrl: formData.bannerUrl,
      logoUrl: formData.logoUrl,
    });

    if (res.success) {
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } else {
      setMessage({ type: "error", text: res.message || "Update failed." });
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Restaurant Profile</h1>
        <p className="text-sm text-gray-500">Manage your restaurant banner, logo, and core details.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Banner & Logo Section */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
          {/* Banner */}
          <div className="relative h-48 sm:h-64 bg-gray-100">
            {formData?.bannerUrl ? (
              <img src={formData.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">No Banner Uploaded</div>
            )}
            <label className="absolute bottom-4 right-4 cursor-pointer bg-black/60 hover:bg-black/80 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 backdrop-blur-xs transition-colors">
              <Camera size={15} />
              {uploadingBanner ? "Uploading..." : "Change Banner"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, "banner")} />
            </label>
          </div>

          {/* Logo & Basic Info Header */}
          <div className="px-6 pb-6 pt-4 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
            <div className="flex items-end gap-4">
              <div className="relative h-24 w-24 rounded-2xl border-4 border-white bg-white shadow-md overflow-hidden shrink-0">
                {formData?.logoUrl ? (
                  <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50 text-gray-400">
                    <Store size={24} />
                  </div>
                )}
                <label className="absolute inset-0 bg-black/40 text-white opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                  <Camera size={18} />
                  {uploadingLogo && <span className="sr-only">Uploading...</span>}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, "logo")} />
                </label>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{formData.restaurantName || "Restaurant Name"}</h2>
                <p className="text-xs text-gray-500">{formData.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Form Fields */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Restaurant Information</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Restaurant Name</label>
              <input
                type="text"
                value={formData.restaurantName}
                onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#15462D]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Cuisine Type</label>
              <div className="relative">
                <Utensils size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  value={formData.cuisineType}
                  onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
                  placeholder="e.g. Fast Food, Biryani, Cafe"
                  className="w-full rounded-xl border border-gray-200 pl-9 pr-3.5 py-2.5 text-sm focus:outline-none focus:border-[#15462D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 pl-9 pr-3.5 py-2.5 text-sm focus:outline-none focus:border-[#15462D]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Address</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 pl-9 pr-3.5 py-2.5 text-sm focus:outline-none focus:border-[#15462D]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Opening Time</label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  value={formData.openingTime}
                  onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                  placeholder="e.g. 09:00 AM"
                  className="w-full rounded-xl border border-gray-200 pl-9 pr-3.5 py-2.5 text-sm focus:outline-none focus:border-[#15462D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Closing Time</label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  value={formData.closingTime}
                  onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                  placeholder="e.g. 11:00 PM"
                  className="w-full rounded-xl border border-gray-200 pl-9 pr-3.5 py-2.5 text-sm focus:outline-none focus:border-[#15462D]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell customers about your restaurant..."
              className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#15462D]"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-[#15462D] px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#0e3320] disabled:opacity-50"
            >
              <Save size={15} />
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}