'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Plus,
  X,
  Star,
  ShoppingBag,
  Upload,
  Loader2,
  Trash2,
  UtensilsCrossed,
  Pizza,
  Wine,
  IceCream,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type Category = 'Burgers' | 'Pizza' | 'Drinks' | 'Desserts';
type ItemStatus = 'Active' | 'Inactive';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: Category;
  price: number;
  image: string;
  status: ItemStatus;
  orders: number;
  rating: number;
  tags?: { text: string; bg: string; textCol: string }[];
  addons?: string[];
}

const fetchMenuItems = async (): Promise<MenuItem[]> => {
  const res = await fetch('/api/v1/vendor/menu');
  if (!res.ok) throw new Error('Failed to fetch menu items');
  return res.json();
};

const updateAvailability = async ({ id, status }: { id: string; status: ItemStatus }): Promise<MenuItem> => {
  const res = await fetch(`/api/v1/vendor/menu/${id}/availability`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update availability');
  return res.json();
};

const createMenuItem = async (data: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
  const res = await fetch('/api/v1/vendor/menu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create item');
  return res.json();
};

const categoryConfig: Record<Category, { icon: React.ElementType; color: string; bg: string }> = {
  Burgers: { icon: UtensilsCrossed, color: 'text-orange-600', bg: 'bg-orange-50' },
  Pizza: { icon: Pizza, color: 'text-red-600', bg: 'bg-red-50' },
  Drinks: { icon: Wine, color: 'text-blue-600', bg: 'bg-blue-50' },
  Desserts: { icon: IceCream, color: 'text-pink-600', bg: 'bg-pink-50' },
};

const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Spicy Chicken Pizza',
    description: 'Spicy chicken, mozzarella, bell peppers, and chili flakes',
    category: 'Pizza',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=400',
    status: 'Active',
    orders: 520,
    rating: 4.9,
    tags: [{ text: 'BEST SELLER', bg: 'bg-yellow-100', textCol: 'text-yellow-800' }],
    addons: ['Extra Cheese', 'Jalapeños'],
  },
  {
    id: '2',
    name: 'Classic Smash Burger',
    description: 'Double patty, cheddar, pickles, and house sauce',
    category: 'Burgers',
    price: 450,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400',
    status: 'Active',
    orders: 840,
    rating: 4.7,
    tags: [{ text: 'POPULAR', bg: 'bg-green-100', textCol: 'text-green-800' }],
    addons: ['Bacon', 'Avocado'],
  },
  {
    id: '3',
    name: 'Iced Matcha Latte',
    description: 'Premium matcha with creamy milk and ice',
    category: 'Drinks',
    price: 320,
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&q=80&w=400',
    status: 'Inactive',
    orders: 120,
    rating: 4.5,
    tags: [{ text: 'NEW', bg: 'bg-blue-100', textCol: 'text-blue-800' }],
    addons: ['Extra Shot', 'Oat Milk'],
  },
];

export default function MenuPortfolio() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const itemsPerPage = 10;

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WebP, GIF)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB');
      return;
    }
    setIsUploadingImage(true);
    try {
      const uploadForm = new FormData();
      uploadForm.append('file', file);
      uploadForm.append('folder', 'menu-items');
      const res = await fetch('/api/upload/image', { method: 'POST', body: uploadForm });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setUploadedImageUrl(data.imageUrl);
      } else {
        alert(data.message || 'Image upload failed');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      alert('Unable to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const { data: items = [] } = useQuery({
    queryKey: ['menu'],
    queryFn: fetchMenuItems,
    initialData: mockMenuItems,
  });

  const availabilityMutation = useMutation({
    mutationFn: updateAvailability,
    onMutate: async (updatedItem) => {
      await queryClient.cancelQueries({ queryKey: ['menu'] });
      const previousItems = queryClient.getQueryData<MenuItem[]>(['menu']);
      queryClient.setQueryData<MenuItem[]>(['menu'], (old = []) =>
        old.map((item) => (item.id === updatedItem.id ? { ...item, status: updatedItem.status } : item))
      );
      return { previousItems };
    },
    onError: (err, updatedItem, context) => {
      queryClient.setQueryData(['menu'], context?.previousItems);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
  });

  const createMutation = useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      setIsAddModalOpen(false);
    },
  });

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const categoryCounts = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      },
      {} as Record<Category, number>
    );
  }, [items]);

  const handleToggleAvailability = (item: MenuItem) => {
    const newStatus: ItemStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    availabilityMutation.mutate({ id: item.id, status: newStatus });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Menu Portfolio & Management</h1>
            <p className="mt-1.5 text-gray-500">Organize your offerings, update availability instantly, and track item performance.</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#00A36C] hover:bg-[#008f5a] text-white font-bold py-2.5 px-5 rounded-xl shadow-sm transition-all"
          >
            <Plus size={18} />
            Add New Item
          </button>
        </div>

        {/* Category KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {(['Burgers', 'Pizza', 'Drinks', 'Desserts'] as Category[]).map((cat) => {
            const Icon = categoryConfig[cat].icon;
            const isActive = selectedCategory === cat;
            return (
              <motion.button
                key={cat}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedCategory(isActive ? 'All' : cat)}
                className={`bg-white rounded-2xl p-5 shadow-sm border transition-all text-left ${
                  isActive ? 'border-[#00A36C] ring-2 ring-[#00A36C]/20' : 'border-gray-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${categoryConfig[cat].bg} ${categoryConfig[cat].color}`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">
                    {categoryCounts[cat] || 0} items
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{cat}</h3>
                <p className="text-xs text-gray-500 mt-1">{categoryCounts[cat] || 0} active items</p>
              </motion.button>
            );
          })}
        </div>

        {/* Item Directory Table Panel */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Panel Header */}
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900">Item Directory</h2>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-80 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A36C]/20 focus:border-[#00A36C] transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Item Details</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Availability</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                  {paginatedItems.map((item) => {
                    const Icon = categoryConfig[item.category].icon;
                    return (
                      <motion.tr
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                              <Image src={item.image} alt={item.name} width={56} height={56} className="object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{item.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${categoryConfig[item.category].bg} ${categoryConfig[item.category].color}`}>
                            <Icon size={14} />
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">৳{item.price.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <ShoppingBag size={14} /> {item.orders}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star size={14} className="text-yellow-500 fill-yellow-500" /> {item.rating}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleAvailability(item)}
                            disabled={availabilityMutation.isPending}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              item.status === 'Active' ? 'bg-[#00A36C]' : 'bg-gray-200'
                            } ${availabilityMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                item.status === 'Active' ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span className="text-xs text-gray-500 mt-1 block">
                            {item.status === 'Active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} items
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-semibold text-gray-700">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsAddModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Add New Item</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                  <X size={18} />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const newItem: Omit<MenuItem, 'id'> = {
                    name: formData.get('name') as string,
                    description: formData.get('description') as string,
                    category: (formData.get('category') as Category) || 'Burgers',
                    price: parseFloat(formData.get('price') as string) || 0,
                    image: uploadedImageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400',
                    status: 'Active',
                    orders: 0,
                    rating: 0,
                    addons: formData.get('addons')?.toString().split(',').map(s => s.trim()).filter(Boolean) || [],
                  };
                  createMutation.mutate(newItem);
                  setUploadedImageUrl(null);
                }}
                className="p-6 space-y-5"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Item Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A36C]/20 focus:border-[#00A36C] transition-all"
                    placeholder="e.g. Spicy Chicken Pizza"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                    <select
                      name="category"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A36C]/20 focus:border-[#00A36C] transition-all bg-white"
                    >
                      <option value="Burgers">Burgers</option>
                      <option value="Pizza">Pizza</option>
                      <option value="Drinks">Drinks</option>
                      <option value="Desserts">Desserts</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (৳)</label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A36C]/20 focus:border-[#00A36C] transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A36C]/20 focus:border-[#00A36C] transition-all resize-none"
                    placeholder="Describe your dish..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image</label>
                  <label className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#00A36C] transition-colors cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                      disabled={isUploadingImage}
                    />
                    {isUploadingImage ? (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="animate-spin text-[#00A36C]" size={24} />
                        <p className="text-sm font-semibold text-gray-600">Uploading to Imgbb...</p>
                      </div>
                    ) : uploadedImageUrl ? (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Image src={uploadedImageUrl} alt="Preview" width={96} height={64} className="object-cover rounded-lg" />
                        <p className="text-xs font-semibold text-[#00A36C]">Image Uploaded!</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                        <p className="text-sm text-gray-600">Drop image here or click to upload</p>
                      </>
                    )}
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Add-ons (comma separated)</label>
                  <input
                    type="text"
                    name="addons"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A36C]/20 focus:border-[#00A36C] transition-all"
                    placeholder="e.g. Extra Cheese, Extra Spicy"
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#00A36C] hover:bg-[#008f5a] text-white transition-colors">
                    Add Item
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
