"use client";

import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  AlertTriangle, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

interface Review {
  id: string;
  customer: string;
  vendor: string;
  rating: number; // e.g., 1 to 5
  reviewText: string;
  date: string;
  status: 'Published' | 'Flagged' | 'Hidden';
}

const initialReviews: Review[] = [
  {
    id: "1",
    customer: "Alex Johnson",
    vendor: "Greenhouse Cafe",
    rating: 5,
    reviewText: "Amazing food quality and super fast delivery! Will definitely order again.",
    date: "Oct 24, 2026",
    status: "Published"
  },
  {
    id: "2",
    customer: "Sarah Williams",
    vendor: "Burger Joint Co.",
    rating: 2,
    reviewText: "The burger was completely cold when it arrived and missing fries.",
    date: "Oct 24, 2026",
    status: "Flagged"
  },
  {
    id: "3",
    customer: "David Brown",
    vendor: "Sweet Treats",
    rating: 4,
    reviewText: "Great desserts, though packaging could be slightly better secured.",
    date: "Oct 23, 2026",
    status: "Published"
  },
  {
    id: "4",
    customer: "Emma Davis",
    vendor: "Downtown Bistro",
    rating: 1,
    reviewText: "Inappropriate language and completely rude behavior from delivery partner.",
    date: "Oct 22, 2026",
    status: "Flagged"
  }
];

export default function ReviewsRatingsPage() {
  // Structured state ready for backend API endpoints (e.g., GET /api/admin/reviews)
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [activeTab, setActiveTab] = useState<'All' | 'Published' | 'Flagged'>('All');
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter logic ready for backend query parameter mapping
  const filteredReviews = reviews.filter(item => {
    const matchesTab = activeTab === 'All' || item.status === activeTab;
    const matchesSearch = item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.reviewText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const flaggedCount = reviews.filter(r => r.status === 'Flagged').length;
  const publishedCount = reviews.filter(r => r.status === 'Published').length;

  // Handlers for simple moderation actions (ready for PATCH /api/admin/reviews/:id)
  const handleToggleHide = (id: string) => {
    setReviews(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'Hidden' ? 'Published' : 'Hidden';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const handleDelete = (id: string) => {
    setReviews(prev => prev.filter(item => item.id !== id));
  };

  return (
    <main className="flex-1 bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              Reviews & Ratings
              {flaggedCount > 0 && (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-rose-100 text-rose-800 rounded-full">
                  {flaggedCount} Flagged
                </span>
              )}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor customer feedback, vendor ratings, and moderate reported reviews.
            </p>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Card 1: Average Rating */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Average Rating
              </span>
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Star size={16} className="fill-current" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-950">4.8 / 5.0</div>
              <span className="text-xs font-semibold text-emerald-600">+0.2 this month</span>
            </div>
          </div>

          {/* Card 2: Total Reviews */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Total Reviews
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                <MessageSquare size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-950">14,290</div>
              <span className="text-xs font-semibold text-emerald-600">+18% growth</span>
            </div>
          </div>

          {/* Card 3: Reported Reviews */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Reported Reviews
              </span>
              <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-950">{flaggedCount}</div>
              <span className="text-xs font-semibold text-rose-600">Requires review</span>
            </div>
          </div>

        </div>

        {/* Main Content Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          
          {/* Tabs Navigation Header */}
          <div className="border-b border-gray-200 px-6 pt-4 flex gap-8 text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setActiveTab('All')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'All'
                  ? 'border-[#065f46] text-[#065f46]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              All Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('Published')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'Published'
                  ? 'border-[#065f46] text-[#065f46]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setActiveTab('Flagged')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'Flagged'
                  ? 'border-[#065f46] text-[#065f46]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <span>Flagged</span>
              {flaggedCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold border border-rose-100">
                  {flaggedCount}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search size={15} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer, vendor, or review text..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#065f46] focus:border-transparent"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/60 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Vendor</th>
                  <th className="px-6 py-3.5">Rating</th>
                  <th className="px-6 py-3.5">Review</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-xs">
                      No reviews found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{item.customer}</td>
                      <td className="px-6 py-4 font-semibold text-gray-700">{item.vendor}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 font-bold text-gray-900">
                          <Star size={14} className="text-amber-500 fill-amber-500" />
                          <span>{item.rating}.0</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={item.reviewText}>
                        {item.reviewText}
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">{item.date}</td>
                      <td className="px-6 py-4">
                        {item.status === 'Published' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 tracking-wider">
                            Published
                          </span>
                        )}
                        {item.status === 'Flagged' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 tracking-wider">
                            Flagged
                          </span>
                        )}
                        {item.status === 'Hidden' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-gray-200 text-gray-700 tracking-wider">
                            Hidden
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            onClick={() => handleToggleHide(item.id)}
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            title={item.status === 'Hidden' ? 'Restore Review' : 'Hide Review'}
                          >
                            <Eye size={15} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Review"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-500">
              Showing 1 to {filteredReviews.length} of {reviews.length} entries
            </span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 hover:bg-gray-50 rounded-lg border border-gray-200 text-gray-400 transition-all disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button 
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 hover:bg-gray-50 rounded-lg border border-gray-200 text-gray-600 transition-all cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}