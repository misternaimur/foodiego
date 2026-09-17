"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Home, Briefcase, X, Check } from "lucide-react";

interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  isDefault: boolean;
}

const STORAGE_KEY = "foodiego_addresses";

const defaultAddresses: Address[] = [
  {
    id: "addr-1",
    label: "Home",
    fullName: "Naimur Rahman",
    phone: "+880 1XXXXXXXXX",
    addressLine: "House 12, Road 4, Block C",
    city: "Cox's Bazar",
    isDefault: true,
  },
];

function getLabelIcon(label: string) {
  return label.toLowerCase() === "work" ? Briefcase : Home;
}

export default function ClientAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
  });

//   useEffect(() => {
//     try {
//       const saved = localStorage.getItem(STORAGE_KEY);
//       setAddresses(saved ? JSON.parse(saved) : defaultAddresses);
//     } catch {
//       setAddresses(defaultAddresses);
//     } finally {
//       setLoaded(true);
//     }
//   }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses, loaded]);

  const openAddModal = () => {
    setEditingId(null);
    setForm({ label: "Home", fullName: "", phone: "", addressLine: "", city: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (address: Address) => {
    setEditingId(address.id);
    setForm({
      label: address.label,
      fullName: address.fullName,
      phone: address.phone,
      addressLine: address.addressLine,
      city: address.city,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.addressLine || !form.city) return;

    if (editingId) {
      setAddresses((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...form } : a)));
    } else {
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        isDefault: addresses.length === 0,
        ...form,
      };
      setAddresses((prev) => [...prev, newAddress]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Addresses</h1>
          <p className="mt-1 text-sm text-gray-500">Manage where your orders get delivered.</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#15462D] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#0e3320]"
        >
          <Plus size={15} /> Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
          <MapPin size={26} className="mx-auto text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => {
            const Icon = getLabelIcon(address.label);
            return (
              <div key={address.id} className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
                {address.isDefault && (
                  <span className="absolute right-4 top-4 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-[#15462D]">
                    Default
                  </span>
                )}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#15462D]">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900">{address.label}</p>
                    <p className="mt-0.5 text-xs font-semibold text-gray-700">
                      {address.fullName} &middot; {address.phone}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {address.addressLine}, {address.city}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#15462D] hover:underline"
                    >
                      <Check size={12} /> Set as default
                    </button>
                  )}
                  <button
                    onClick={() => openEditModal(address)}
                    className="ml-auto inline-flex items-center gap-1 rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="inline-flex items-center gap-1 rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">
                {editingId ? "Edit Address" : "Add New Address"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-500">Label</label>
                <select
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:border-[#15462D] focus:outline-none"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-500">Full Name</label>
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:border-[#15462D] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-500">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:border-[#15462D] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-500">Street Address</label>
                <input
                  required
                  value={form.addressLine}
                  onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:border-[#15462D] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-500">City</label>
                <input
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:border-[#15462D] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#15462D] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0e3320]"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}