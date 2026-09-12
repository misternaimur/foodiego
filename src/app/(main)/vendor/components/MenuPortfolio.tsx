"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  UtensilsCrossed,
  PauseCircle,
  CheckCircle,
} from "lucide-react";
import {
  useMenuItems,
  useCategoryMetrics,
  useToggleMenuItem,
} from "@/hooks/useVendorMenu";
import type { MenuItem } from "@/hooks/useVendorMenu";
import AddMenuItemModal from "@/app/(main)/vendor/components/AddMenuItemModal";

const categoryIcons: Record<string, string> = {
  Burgers: "🍔",
  Pizza: "🍕",
  Drinks: "🥤",
  Desserts: "🍰",
};

const statusTabs = [
  { id: "all", label: "All Items" },
  { id: "categories", label: "Categories" },
  { id: "add", label: "+ Add New Item" },
];

export default function MenuPortfolio() {
  const [activeTab, setActiveTab] = useState<"all" | "categories" | "add">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: menuData, isLoading, isError, error } = useMenuItems({
    search: searchQuery || undefined,
    page,
  });

  const toggleMutation = useToggleMenuItem();

  const items: MenuItem[] = menuData?.items || [];
  const metrics = useCategoryMetrics(items);

  const handleToggle = (item: MenuItem) => {
    if (toggleMutation.isPending && toggleMutation.variables === item._id) return;
    toggleMutation.mutate(item._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Portfolio</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Manage your offerings, categories, and item availability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("add")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Filter size={15} />
            <span>Filter</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#10B981] px-4 py-2 text-sm font-semibold text-white hover:bg-[#059669] transition-colors shadow-md shadow-[#10B981]/20"
          >
            <Plus size={16} />
            <span>+ Add New Item</span>
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex gap-2 overflow-x-auto no-scrollbar"
      >
        {statusTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[#10B981] text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-[#E5E7EB]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </motion.div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
      >
        {activeTab === "all" && (
          <>
            <motion.div
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              {metrics.map((cat, idx) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 + idx * 0.03 }}
                  className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{categoryIcons[cat.name] || "📦"}</span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${
                        cat.activeItems > 0
                          ? "bg-emerald-50 text-[#10B981]"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {cat.activeItems > 0 ? `${cat.activeItems} Active` : "Inactive"}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-gray-900">{cat.name}</h3>
                  <p className="text-xs text-gray-500">{cat.activeItems} active items</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white shadow-xs overflow-hidden"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  Item Directory
                </h2>
                <div className="relative w-64">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    className="w-full rounded-full border border-[#E5E7EB] bg-gray-50 pl-9 pr-3 py-2 text-sm text-gray-800 focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
                  />
                </div>
              </div>

              {isError && (
                <div className="p-4 text-center text-sm text-rose-600">
                  {(error as Error)?.message || "Failed to load menu items"}
                </div>
              )}

              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#10B981] border-t-transparent"></div>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-gray-50/60">
                      <th className="px-4 py-3 font-bold text-gray-400 uppercase tracking-wider">ITEM DETAILS</th>
                      <th className="px-4 py-3 font-bold text-gray-400 uppercase tracking-wider">CATEGORY</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-400 uppercase tracking-wider">PRICE</th>
                      <th className="px-4 py-3 font-bold text-gray-400 uppercase tracking-wider">PERFORMANCE</th>
                      <th className="px-4 py-3 text-center font-bold text-gray-400 uppercase tracking-wider">AVAILABILITY</th>
                      <th className="px-4 py-3 text-center font-bold text-gray-400 uppercase tracking-wider">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.tr
                          key={item._id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ duration: 0.15 }}
                          className="border-b hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-100 overflow-hidden">
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={40}
                                    height={40}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                                    <UtensilsCrossed size={16} />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{item.name}</p>
                                {item.addons && item.addons.length > 0 && (
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    +{item.addons.length} add-on{item.addons.length > 1 ? "s" : ""}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700">
                              {categoryIcons[item.category] || "📦"}
                              <span>{item.category}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="font-semibold text-gray-900">৳{item.price.toLocaleString()}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">{item.ordersCount} Orders</span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-yellow-600">
                                ⭐ {item.rating}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <label className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.isActive}
                                onChange={() => handleToggle(item)}
                                className="sr-only"
                                aria-label={`${item.isActive ? "Deactivate" : "Activate"} ${item.name}`}
                              />
                              <span
                                className={`inline-block h-full w-full rounded-full transition-colors ${
                                  item.isActive ? "bg-[#10B981]" : "bg-gray-300"
                                }`}
                              />
                              <span
                                className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
                                  item.isActive ? "translate-x-4" : ""
                                }`}
                              />
                            </label>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleToggle(item)}
                                className={`p-1 rounded-lg transition-colors ${
                                  item.isActive
                                    ? "text-gray-600 hover:bg-gray-100"
                                    : "text-rose-600 hover:bg-rose-100"
                                }`}
                                aria-label={item.isActive ? "Deactivate" : "Activate"}
                              >
                                {item.isActive ? <PauseCircle size={14} /> : <CheckCircle size={14} />}
                              </button>
                              <Link
                                href={`/vendor/orders`}
                                className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="View orders for this item"
                              >
                                <ShoppingBag size={14} />
                              </Link>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>

                    {!isLoading && items.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center">
                          <div className="flex flex-col items-center gap-2 text-gray-400">
                            <ShoppingBag size={32} />
                            <p className="text-sm">No menu items found.</p>
                            <button
                              onClick={() => setShowAddModal(true)}
                              className="text-xs font-semibold text-[#10B981] hover:text-[#059669]"
                            >
                              Create your first item
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </motion.div>

            {menuData && menuData.total > 0 && (
              <motion.div
                className="flex items-center justify-between py-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <p className="text-sm text-gray-500">
                  Showing {Math.min((page - 1) * (menuData.limit || 20) + 1, menuData.total)}-
                  {Math.min(page * (menuData.limit || 20), menuData.total)} of {menuData.total} items
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1 || isLoading}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-[#E5E7EB] bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-xs font-semibold text-gray-700">
                    Page {page}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={!menuData || page >= menuData.totalPages || isLoading}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-[#E5E7EB] bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}

        {activeTab === "categories" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
            {metrics.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{categoryIcons[cat.name] || "📦"}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                    <p className="text-xs text-gray-500">{cat.activeItems} active items</p>
                  </div>
                </div>
                <Link
                  href={`/vendor?tab=menu&category=${cat.name.toLowerCase()}`}
                  className="text-xs font-semibold text-[#10B981] hover:text-[#059669]"
                >
                  View items
                </Link>
              </div>
            ))}
          </div>
        )}

        {activeTab === "add" && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-gray-100 p-4 mb-3">
              <Plus size={32} className="text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Add New Menu Item</h2>
            <p className="text-sm text-gray-500 max-w-sm">
              Create a new menu item with name, category, price, description,
              image, and add-on options.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 rounded-xl bg-[#10B981] px-4 py-2 text-sm font-semibold text-white hover:bg-[#059669] transition-colors"
            >
              Open Add Item Form
            </button>
          </div>
        )}
      </motion.div>

      <AddMenuItemModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </motion.div>
  );
}
