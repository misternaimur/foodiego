"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingBag,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  UtensilsCrossed,
  PauseCircle,
  CheckCircle,
  Tag,
  LoaderCircle,
  AlertCircle,
  LayoutGrid,
  List,
  Grid2x2,
  Pizza,
  CupSoda,
  Cake,
  Cookie,
  Popcorn,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  useMenuItems,
  useToggleMenuItem,
} from "@/hooks/useVendorMenu";
import type { MenuItem } from "@/hooks/useVendorMenu";
import AddMenuItemModal from "@/app/(main)/vendor/components/AddMenuItemModal";
import { springTransition, staggerContainer, staggerItem } from "@/app/(main)/vendor/components/motion";

const categoryMeta: Record<string, { label: string; icon: typeof UtensilsCrossed; badgeClass: string }> = {
  Burgers: { label: "Burgers", icon: UtensilsCrossed, badgeClass: "bg-gradient-to-br from-emerald-500 to-teal-600" },
  Pizza: { label: "Pizza", icon: Pizza, badgeClass: "bg-gradient-to-br from-amber-500 to-orange-600" },
  Drinks: { label: "Drinks", icon: CupSoda, badgeClass: "bg-gradient-to-br from-teal-500 to-cyan-600" },
  Desserts: { label: "Desserts", icon: Cake, badgeClass: "bg-gradient-to-br from-rose-500 to-pink-600" },
  Sides: { label: "Sides", icon: Cookie, badgeClass: "bg-gradient-to-br from-indigo-500 to-purple-600" },
  Snacks: { label: "Snacks", icon: Popcorn, badgeClass: "bg-gradient-to-br from-indigo-500 to-purple-600" },
};

export default function MenuPortfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [density, setDensity] = useState<"compact" | "normal">("normal");

  const { data: menuData, isLoading, isError, error } = useMenuItems({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    search: searchQuery || undefined,
    page,
  });
  const toggleMutation = useToggleMenuItem();
  const allItems: MenuItem[] = menuData?.items ?? [];

  // Filter items based on selected category
  const filteredItems = selectedCategory === "all"
    ? allItems
    : allItems.filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleToggle = (item: MenuItem) => {
    if (toggleMutation.isPending && toggleMutation.variables === item._id) return;
    toggleMutation.mutate(item._id);
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory((prev) => (prev === categoryName ? "all" : categoryName));
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={staggerItem} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-rose-500 uppercase">Catalog workspace</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Menu Management</h1>
          <p className="mt-1 text-sm text-slate-500">Curate your offerings, control availability, and spotlight what sells.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition-colors hover:bg-slate-800"
        >
          <Plus size={16} />
          Add New Item
        </button>
      </motion.div>

      <motion.div variants={staggerItem} className="flex items-center gap-2 overflow-x-auto border-b border-slate-200/70 pb-1">
        <div className="relative ml-auto hidden sm:block">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(event) => { setSearchQuery(event.target.value); setPage(1); }}
            className="w-52 rounded-full border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-700 placeholder-slate-400 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <div className="flex items-center gap-1.5 ml-4 sm:ml-auto p-1 bg-slate-100/50 rounded-lg border border-slate-200/50">
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded transition-colors ${viewMode === "table" ? "bg-white shadow-sm text-rose-600" : "text-slate-500 hover:text-slate-700"}`}
            aria-label="Table view"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-rose-600" : "text-slate-500 hover:text-slate-700"}`}
            aria-label="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
          <div className="w-px h-6 bg-slate-300 mx-1" />
          <select
            value={density}
            onChange={(e) => setDensity(e.target.value as "compact" | "normal")}
            className="px-2 py-1 text-xs bg-white border border-slate-200 rounded text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-200"
            aria-label="Row density"
          >
            <option value="compact">Compact</option>
            <option value="normal">Normal</option>
          </select>
        </div>
      </motion.div>

      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
        {/* Category Overview Grid - Compact Horizontal Pill Cards */}
        <motion.div variants={staggerContainer} className="flex flex-wrap gap-3">
          {Object.entries(categoryMeta).map(([catName, meta]) => {
            const allItemsForCat = allItems.filter((i) => i.category === catName);
            const totalCount = allItemsForCat.length;
            const activeCount = allItemsForCat.filter((i) => i.isActive).length;
            const isSelected = selectedCategory === catName;
            const MetaIcon = meta.icon;

            return (
              <motion.div
                key={catName}
                variants={staggerItem}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(catName)}
                className={`group relative p-3.5 bg-white/90 backdrop-blur-md rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 min-w-[160px] ${
                  isSelected
                    ? "border-emerald-500/60 bg-emerald-50/30 shadow-[0_0_0_1px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/20"
                    : "border-slate-200/80 hover:border-emerald-500 hover:shadow-sm"
                }`}
              >
                {/* Left: Small gradient icon badge */}
                <div className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg ${
                  isSelected ? "bg-emerald-100" : "bg-slate-100 group-hover:bg-slate-200"
                } transition-colors`}>
                  <span className={`flex h-8 w-8 items-center justify-center rounded-md ${meta.badgeClass} text-white`}>
                    <MetaIcon size={16} />
                  </span>
                </div>

                {/* Middle: Category name with item count */}
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <h3 className={`font-black text-sm truncate ${isSelected ? "text-emerald-700" : "text-slate-900"}`}>
                    {meta.label}
                  </h3>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    activeCount > 0
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : totalCount > 0
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}>
                    {activeCount > 0 ? `${activeCount} active` : totalCount > 0 ? `${totalCount} items` : "Empty"}
                  </span>
                </div>

                {/* Right: Quick add button on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(catName);
                      setShowAddModal(true);
                    }}
                    className="flex-shrink-0 p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                    aria-label={`Add item to ${meta.label}`}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Item Directory */}
        <motion.div variants={staggerItem} className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-800">Item Directory</h2>
              <p className="mt-0.5 text-xs text-slate-400">{menuData?.total ?? 0} total items</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(event) => { setSelectedCategory(event.target.value); setPage(1); }}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                <option value="all">All categories</option>
                {Object.keys(categoryMeta).map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
              {selectedCategory !== "all" && (
                <button onClick={() => setSelectedCategory("all")} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200">Clear</button>
              )}
            </div>
          </div>

          <div className="relative min-h-[300px]">
            {isError && (
              <div className="flex items-center gap-2 p-4 text-sm text-rose-700"><AlertCircle size={16} />{(error as Error)?.message || "Failed to load menu items."}</div>
            )}
            {isLoading && !filteredItems.length && (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-400"><LoaderCircle size={18} className="animate-spin" />Loading menu...</div>
            )}
            {!isLoading && !isError && filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-slate-400">
                <ShoppingBag size={32} />
                <p className="text-sm">{selectedCategory === "all" ? "No menu items found." : `No items in ${selectedCategory} category.`}</p>
                <button onClick={() => setShowAddModal(true)} className="mt-2 text-xs font-bold text-rose-600 hover:text-rose-700">{selectedCategory === "all" ? "Create your first item" : `Add ${selectedCategory} item`}</button>
              </div>
            )}
            {!isError && filteredItems.length > 0 && (
              <div className="overflow-x-auto">
                {viewMode === "table" ? (
                  <table className="w-full min-w-[720px] text-left text-xs">
                    <thead className="sticky top-0 z-10">
                      <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        <th className="px-4 py-3">Item details</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3 text-right">Price</th>
                        <th className="px-4 py-3">Performance</th>
                        <th className="px-4 py-3 text-center">Availability</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <AnimatePresence>
                        {filteredItems.map((item) => (
                          <motion.tr key={item._id} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.18 }} className={`transition-colors hover:bg-rose-50/20 ${density === "compact" ? "" : ""}`}>
                            <td className={`px-4 py-3 ${density === "compact" ? "py-2" : ""}`}>
                              <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                  {item.image ? <Image src={item.image} alt={item.name} fill className="object-cover" /> : <UtensilsCrossed size={16} className="m-auto text-slate-300" />}
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-bold text-slate-900">{item.name}</p>
                                  <p className="mt-0.5 text-[10px] text-slate-400">{item.addons?.length ? `${item.addons.length} add-on${item.addons.length > 1 ? "s" : ""}` : "No add-ons"}</p>
                                </div>
                              </div>
                            </td>
                            <td className={`px-4 py-3 ${density === "compact" ? "py-2" : ""}`}>
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600"><Tag size={11} />{item.category}</span>
                            </td>
                            <td className={`px-4 py-3 text-right text-sm font-black text-slate-900 ${density === "compact" ? "py-2" : ""}`}>৳{(item.price ?? 0).toLocaleString()}</td>
                            <td className={`px-4 py-3 ${density === "compact" ? "py-2" : ""}`}>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                <span className="font-bold text-slate-700">{item.ordersCount ?? 0} orders</span>
                                <span>•</span>
                                <span className="font-bold text-amber-600">★ {(item.rating ?? 0).toFixed(1)}</span>
                              </div>
                            </td>
                            <td className={`px-4 py-3 text-center ${density === "compact" ? "py-2" : ""}`}>
                              <label className="relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors">
                                <input type="checkbox" checked={item.isActive} onChange={() => handleToggle(item)} className="sr-only" aria-label={`Toggle ${item.name}`} />
                                <span className={`h-full w-full rounded-full transition-colors ${item.isActive ? "bg-emerald-500" : "bg-slate-300"}`} />
                                <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${item.isActive ? "translate-x-4" : ""}`} />
                              </label>
                            </td>
                            <td className={`px-4 py-3 ${density === "compact" ? "py-2" : ""}`}>
                              <div className="flex items-center justify-center gap-1">
                                <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }} transition={springTransition} onClick={() => handleToggle(item)} disabled={toggleMutation.isPending && toggleMutation.variables === item._id} className={`rounded-lg p-1.5 transition-colors disabled:opacity-50 ${item.isActive ? "text-slate-500 hover:bg-slate-100" : "text-rose-600 hover:bg-rose-50"}`} aria-label={item.isActive ? `Pause ${item.name}` : `Activate ${item.name}`}>
                                  {toggleMutation.isPending && toggleMutation.variables === item._id ? <LoaderCircle size={14} className="animate-spin" /> : item.isActive ? <PauseCircle size={14} /> : <CheckCircle size={14} />}
                                </motion.button>
                                <Link href="/vendor?tab=orders" className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100" aria-label={`View orders for ${item.name}`}><ShoppingBag size={14} /></Link>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-3">
                    <AnimatePresence>
                      {filteredItems.map((item) => (
                        <motion.div
                          key={item._id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.18 }}
                          className="group rounded-2xl border border-slate-200/70 bg-white/85 p-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:border-rose-200 hover:bg-rose-50/40 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]"
                        >
                          <div className="aspect-square relative overflow-hidden rounded-xl bg-slate-100 mb-3">
                            {item.image ? (
                              <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                              <UtensilsCrossed size={24} className="absolute inset-0 m-auto text-slate-300" />
                            )}
                          </div>
                          <div className="space-y-2 min-h-[80px]">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-bold text-slate-900 truncate text-sm">{item.name}</h3>
                              <label className="relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors flex-shrink-0">
                                <input type="checkbox" checked={item.isActive} onChange={() => handleToggle(item)} className="sr-only" aria-label={`Toggle ${item.name}`} />
                                <span className={`h-full w-full rounded-full transition-colors ${item.isActive ? "bg-emerald-500" : "bg-slate-300"}`} />
                                <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${item.isActive ? "translate-x-4" : ""}`} />
                              </label>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600"><Tag size={10} />{item.category}</span>
                              <span className="font-bold text-amber-600">★ {(item.rating ?? 0).toFixed(1)}</span>
                              <span>•</span>
                              <span className="font-bold text-slate-700">{item.ordersCount ?? 0} orders</span>
                            </div>
                            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                              <span className="text-sm font-black text-slate-900">৳{(item.price ?? 0).toLocaleString()}</span>
                              <div className="flex items-center gap-1">
                                <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }} transition={springTransition} onClick={() => handleToggle(item)} disabled={toggleMutation.isPending && toggleMutation.variables === item._id} className={`rounded-lg p-1.5 transition-colors disabled:opacity-50 ${item.isActive ? "text-slate-500 hover:bg-slate-100" : "text-rose-600 hover:bg-rose-50"}`} aria-label={item.isActive ? `Pause ${item.name}` : `Activate ${item.name}`}>
                                  {toggleMutation.isPending && toggleMutation.variables === item._id ? <LoaderCircle size={12} className="animate-spin" /> : item.isActive ? <PauseCircle size={12} /> : <CheckCircle size={12} />}
                                </motion.button>
                                <Link href="/vendor?tab=orders" className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100" aria-label={`View orders for ${item.name}`}><ShoppingBag size={12} /></Link>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}
            {isLoading && filteredItems.length > 0 && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                <LoaderCircle size={24} className="animate-spin text-rose-500" />
              </div>
            )}
          </div>

          <div className="sticky bottom-0 border-t border-slate-100 bg-white/95 backdrop-blur-sm p-4 sm:flex sm:items-center sm:justify-between">
            {menuData && menuData.total > 0 && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between w-full">
                <p className="text-xs text-slate-500">Showing {(page - 1) * (menuData.limit || 20) + 1}–{Math.min(page * (menuData.limit || 20), menuData.total)} of {menuData.total}</p>
                <div className="flex items-center gap-2">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={springTransition} onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1 || isLoading} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40" aria-label="Previous page"><ChevronLeft size={14} /></motion.button>
                  <span className="text-xs font-bold text-slate-700">Page {page}</span>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={springTransition} onClick={() => setPage(page + 1)} disabled={!menuData || page >= menuData.totalPages || isLoading} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40" aria-label="Next page"><ChevronRight size={14} /></motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      <AddMenuItemModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </motion.div>
  );
}
