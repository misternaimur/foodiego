"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Upload, Plus, Trash2, Check } from "lucide-react";
import { useCreateMenuItem, useUpdateMenuItem } from "@/hooks/useVendorMenu";
import type { CreateMenuItemInput, MenuItemAddon, MenuItem } from "@/hooks/useVendorMenu";

interface AddMenuItemModalProps {
  open: boolean;
  onClose: () => void;
  /** UPDATE (menu-edit fix): when set, the modal edits this item instead
   * of creating a new one — the same form pre-filled with its current
   * values, submitting to useUpdateMenuItem instead of useCreateMenuItem.
   * This is the only place in the app a vendor can change an existing
   * item; before this, there was no edit UI at all. */
  editItem?: MenuItem | null;
}

export default function AddMenuItemModal({ open, onClose, editItem }: AddMenuItemModalProps) {
  // UPDATE (menu-edit fix): the actual form used to live directly in this
  // component, reset via a useEffect keyed on `open`/`editItem` — that
  // tripped the React Compiler's "no setState in an effect body" rule.
  // The form is now its own component instance, mounted fresh only while
  // `open` is true (see the AnimatePresence block below), so its useState
  // calls can just read their initial value straight from `editItem` —
  // no effect, and it can't show stale data from the previously-edited
  // item either.
  return (
    <AnimatePresence>
      {open && <ModalBody key={editItem?._id ?? "new"} onClose={onClose} editItem={editItem} />}
    </AnimatePresence>
  );
}

function ModalBody({ onClose, editItem }: { onClose: () => void; editItem?: MenuItem | null }) {
  const isEditMode = !!editItem;

  const [name, setName] = useState(editItem?.name ?? "");
  const [category, setCategory] = useState(editItem?.category ?? "Burgers");
  const [price, setPrice] = useState(editItem ? String(editItem.price) : "");
  const [description, setDescription] = useState(editItem?.description ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(editItem?.image ?? "");
  const [addons, setAddons] = useState<MenuItemAddon[]>(editItem?.addons ?? []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: createItem, isPending: isCreating, isError: isCreateError, error: createError } = useCreateMenuItem();
  const { mutateAsync: updateItem, isPending: isUpdating, isError: isUpdateError, error: updateError } = useUpdateMenuItem();

  const isSaving = isEditMode ? isUpdating : isCreating;
  const isError = isEditMode ? isUpdateError : isCreateError;
  const error = isEditMode ? updateError : createError;

  const categories = ["Burgers", "Pizza", "Drinks", "Desserts", "Sides", "Snacks"];
  const categoryIcons: Record<string, string> = {
    Burgers: "🍔",
    Pizza: "🍕",
    Drinks: "🥤",
    Desserts: "🍰",
    Sides: "🍟",
    Snacks: "🥨",
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const input: CreateMenuItemInput & { imageFile?: File } = {
      name,
      category,
      price: parseFloat(price),
      description,
      addons,
    };

    if (imageFile) {
      input.imageFile = imageFile;
    } else if (imagePreview) {
      input.image = imagePreview;
    }

    try {
      if (isEditMode && editItem) {
        await updateItem({ id: editItem._id, input });
      } else {
        await createItem(input);
      }
      onClose();
    } catch {
      // error is handled by isError in the UI
    }
  };

  const addAddon = () => {
    setAddons([...addons, { name: "", price: 0 }]);
  };

  const removeAddon = (idx: number) => {
    setAddons(addons.filter((_, i) => i !== idx));
  };

  const updateAddon = (idx: number, field: "name" | "price", value: string | number) => {
    const newAddons = [...addons];
    if (field === "name") {
      newAddons[idx].name = value as string;
    } else {
      newAddons[idx].price = Number(value);
    }
    setAddons(newAddons);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
      >
            <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
              <h2 className="text-xl font-bold text-gray-900">{isEditMode ? "Edit Menu Item" : "Add New Menu Item"}</h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* UPDATE (menu-edit fix): the submit button used to live
                OUTSIDE this <form> element entirely (as a sibling below),
                relying only on its own onClick to call handleSubmit — it
                happened to still work, but it meant pressing Enter in any
                field did nothing (no in-form submit button to activate)
                and the structure was misleading. The form now wraps the
                whole modal body including its footer buttons. */}
            <form onSubmit={handleSubmit} className="flex max-h-[80vh] flex-col">
            <div className="p-6 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-gray-800 focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
                    placeholder="e.g. Classic Smash Burger"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {categoryIcons[cat]} {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Price (USD $)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-gray-800 focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
                    placeholder="e.g. 450"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-gray-800 resize-none focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
                    placeholder="Describe your dish..."
                    rows={3}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Item Image
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-24 w-24 items-center justify-center rounded-xl border-2 border-dashed border-[#E5E7EB] bg-gray-50 text-gray-500 hover:border-[#10B981] hover:text-[#10B981] transition-colors"
                    >
                      <Upload size={24} />
                    </button>
                    {imagePreview ? (
                      <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-[#E5E7EB]">
                        <img
                          src={imagePreview}
                          alt="Upload preview"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview("");
                          }}
                          className="absolute top-1 right-1 rounded-full bg-gray-100 p-1 text-gray-600 hover:bg-gray-200"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">
                        Click to upload (max 5MB)
                      </span>
                    )}
                  </div>
                </div>

                {isError && (
                  <div className="sm:col-span-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                    {(error as Error)?.message || `An error occurred while ${isEditMode ? "updating" : "creating"} the item.`}
                  </div>
                )}

                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Add-on Options
                    </label>
                    <button
                      type="button"
                      onClick={addAddon}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#10B981] hover:text-[#059669]"
                    >
                      <Plus size={12} />
                      Add On
                    </button>
                  </div>

                  {addons.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#E5E7EB] py-6 text-center">
                      <p className="text-sm text-gray-400">No add-ons added yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {addons.map((addon, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={addon.name}
                            onChange={(e) => updateAddon(idx, "name", e.target.value)}
                            className="flex-1 rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm text-gray-800 focus:border-[#10B981] focus:outline-none"
                            placeholder="Add-on name"
                          />
                          <div className="flex items-center gap-1 rounded-xl border border-[#E5E7EB] px-2 py-2">
                            <span className="text-xs text-gray-400">$</span>
                            <input
                              type="number"
                              value={addon.price || ""}
                              onChange={(e) => updateAddon(idx, "price", Number(e.target.value) || 0)}
                              className="w-12 border-0 text-sm text-gray-800 focus:outline-none"
                              placeholder="0"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAddon(idx)}
                            className="rounded-xl p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-[#E5E7EB] bg-gray-50/60">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !name || !price}
                  className="rounded-xl bg-[#10B981] px-4 py-2 text-sm font-semibold text-white hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      {isEditMode ? "Save Changes" : "Create Item"}
                    </>
                  )}
                </button>
              </div>
            </form>
      </motion.div>
    </motion.div>
  );
}
