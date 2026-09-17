'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Search,
  Download,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Bot,
  Send,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Pencil,
  Clock,
} from 'lucide-react';

type RatingFilter = 'All Reviews' | '5★' | '4★' | '3★' | '2★' | '1★';
type SortOption = 'Newest First' | 'Oldest First' | 'Highest Rating' | 'Lowest Rating';

interface ReviewItem {
  id: string;
  customerName: string;
  avatarInitials: string;
  timestamp: string;
  rating: number;
  orderedItem: string;
  body: string;
  merchantReply?: string;
  replyEditedAt?: string;
}

interface RatingBreakdown {
  stars: number;
  percentage: number;
}

const ratingBreakdown: RatingBreakdown[] = [
  { stars: 5, percentage: 85 },
  { stars: 4, percentage: 10 },
  { stars: 3, percentage: 3 },
  { stars: 2, percentage: 1 },
  { stars: 1, percentage: 1 },
];

const mockReviews: ReviewItem[] = [
  {
    id: '1',
    customerName: 'Rahim Ahmed',
    avatarInitials: 'RA',
    timestamp: '2 hours ago',
    rating: 5,
    orderedItem: 'Order: Truffle Burger Combo',
    body: 'Absolutely loved the smashburger! The truffle aioli was perfectly balanced and the patty was cooked exactly as requested. Delivery was quick too.',
    merchantReply: 'Thank you, Rahim! We are glad you enjoyed the truffle aioli. We will see you again soon!',
    replyEditedAt: '1 hour ago',
  },
  {
    id: '2',
    customerName: 'Karim Uddin',
    avatarInitials: 'KU',
    timestamp: '5 hours ago',
    rating: 4,
    orderedItem: 'Order: Margherita Pizza',
    body: 'Great pizza overall. The crust was crispy and ingredients fresh. Only minor issue was that it arrived slightly cooler than expected.',
    merchantReply: 'Thanks for the feedback, Karim. We have noted the temperature concern and are improving our packaging for delivery.',
    replyEditedAt: '3 hours ago',
  },
  {
    id: '3',
    customerName: 'Fatima Begum',
    avatarInitials: 'FB',
    timestamp: 'Yesterday',
    rating: 2,
    orderedItem: 'Order: Chicken Biryani',
    body: 'The biryani was a bit too salty and the chicken pieces were smaller than usual. Hope this improves next time.',
    merchantReply: '',
    replyEditedAt: '',
  },
];

const aiInsights = {
  positive: 'Customers frequently praise the delivery speed and the truffle smashburger flavor.',
  constructive: 'Some late-night orders mention cold fries and slower-than-usual delivery on rainy days.',
};

export default function ReviewsRatings() {
  const [activeFilter, setActiveFilter] = useState<RatingFilter>('All Reviews');
  const [sortBy, setSortBy] = useState<SortOption>('Newest First');
  const [searchQuery, setSearchQuery] = useState('');
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  const filterOptions: RatingFilter[] = ['All Reviews', '5★', '4★', '3★', '2★', '1★'];

  const filteredReviews = useMemo(() => {
    return mockReviews.filter((review) => {
      const matchesFilter = activeFilter === 'All Reviews' || review.rating === parseInt(activeFilter);
      const matchesSearch =
        searchQuery.trim().length === 0 ||
        review.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.orderedItem.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / reviewsPerPage));
  const paginatedReviews = filteredReviews.slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage);

  const overallRating = 4.8;
  const totalReviews = 1248;

  const handleGenerateAIReply = async () => {
    setIsGeneratingAI(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setReplyText(`Hi there! Thank you for your feedback. We appreciate you taking the time to share your experience. We would love to make this right — please reach out to us directly so we can address your concerns.`);
    setIsGeneratingAI(false);
  };

  const handlePostReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    alert(`Reply posted to review ${reviewId}`);
    setReplyText('');
    setReplyingTo(null);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Reviews & Ratings</h1>
            <p className="mt-1 text-gray-500">Manage customer feedback and monitor your restaurant&apos;s performance.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-80 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A36C]/20 focus:border-[#00A36C] transition-all bg-white"
              />
            </div>
            <button className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 font-semibold text-sm py-2.5 px-4 rounded-xl hover:bg-gray-50 transition-colors">
              <Download size={18} />
              Export CSV
            </button>
            <button
              onClick={() => setIsStoreOpen(!isStoreOpen)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                isStoreOpen
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-gray-100 text-gray-700 border-gray-200'
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${isStoreOpen ? 'bg-emerald-500' : 'bg-gray-400'}`} />
              {isStoreOpen ? 'Open' : 'Closed'}
            </button>
          </div>
        </div>

        {/* Main Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Rating Overview & AI Insights */}
          <div className="lg:col-span-4 space-y-6">
            {/* Overall Rating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Overall Rating</h3>
              <div className="flex items-end gap-4 mb-6">
                <div>
                  <p className="text-5xl font-black text-gray-900">{overallRating}</p>
                  <div className="flex items-center gap-1 mt-1">{renderStars(5)}</div>
                </div>
                <div className="pb-1">
                  <p className="text-sm text-gray-500">{totalReviews.toLocaleString()} reviews</p>
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-3">
                {ratingBreakdown.map((item) => (
                  <div key={item.stars} className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700 w-6">{item.stars}★</span>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.8, delay: item.stars * 0.1 }}
                        className={`h-full rounded-full ${
                          item.stars >= 4 ? 'bg-emerald-500' : item.stars === 3 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-500 w-10 text-right">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AI Sentiment Insight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Bot size={20} className="text-violet-600" />
                <h3 className="text-lg font-bold text-gray-900">AI Sentiment Insights</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsUp size={16} className="text-emerald-600" />
                    <p className="text-sm font-bold text-emerald-900">Positive Trends</p>
                  </div>
                  <p className="text-sm text-emerald-800 leading-relaxed">{aiInsights.positive}</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsDown size={16} className="text-amber-600" />
                    <p className="text-sm font-bold text-amber-900">Constructive Feedback</p>
                  </div>
                  <p className="text-sm text-amber-800 leading-relaxed">{aiInsights.constructive}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Review Feed & Reply Management */}
          <div className="lg:col-span-8 space-y-4">
            {/* Filter Strip */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {filterOptions.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setActiveFilter(filter);
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        activeFilter === filter
                          ? 'bg-[#00A36C] text-white shadow-sm'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00A36C]/20 focus:border-[#00A36C] transition-all bg-white"
                >
                  <option value="Newest First">Newest First</option>
                  <option value="Oldest First">Oldest First</option>
                  <option value="Highest Rating">Highest Rating</option>
                  <option value="Lowest Rating">Lowest Rating</option>
                </select>
              </div>
            </div>

            {/* Review Cards Feed */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {paginatedReviews.map((review) => (
                  <motion.div
                    key={review.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
                  >
                    {/* Review Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#00A36C] flex items-center justify-center text-white font-bold text-sm">
                          {review.avatarInitials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-gray-900">{review.customerName}</h4>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock size={12} />
                              {review.timestamp}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(review.rating)}
                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg">
                              {review.orderedItem}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>

                    {/* Review Body */}
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">{review.body}</p>

                    {/* Existing Merchant Reply */}
                    {review.merchantReply && (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <MessageSquare size={16} className="text-[#00A36C]" />
                            <span className="text-sm font-bold text-gray-900">Your Reply</span>
                          </div>
                          <button
                            onClick={() => {
                              setReplyingTo(review.id);
                              setReplyText(review.merchantReply || '');
                            }}
                            className="text-xs font-semibold text-[#00A36C] hover:text-[#008f5a] flex items-center gap-1"
                          >
                            <Pencil size={12} />
                            Edit Reply
                          </button>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{review.merchantReply}</p>
                        {review.replyEditedAt && (
                          <p className="text-xs text-gray-400 mt-2">Edited {review.replyEditedAt}</p>
                        )}
                      </div>
                    )}

                    {/* Inline Reply Editor */}
                    {replyingTo === review.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border border-gray-200 rounded-xl p-4 mb-4"
                      >
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply..."
                          rows={3}
                          className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A36C]/20 focus:border-[#00A36C] transition-all resize-none mb-3"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleGenerateAIReply()}
                            disabled={isGeneratingAI}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-violet-200 text-violet-700 text-xs font-bold hover:bg-violet-50 transition-colors disabled:opacity-50"
                          >
                            {isGeneratingAI ? (
                              <>
                                <Bot size={14} className="animate-pulse" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Bot size={14} />
                                AI Auto-Generate Reply
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                            className="px-4 py-2 rounded-xl text-gray-700 text-xs font-semibold hover:bg-gray-100 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handlePostReply(review.id)}
                            disabled={!replyText.trim()}
                            className="px-4 py-2 rounded-xl bg-[#00A36C] hover:bg-[#008f5a] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                          >
                            <Send size={14} />
                            Post Reply
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Reply Action Button (when not replying) */}
                    {replyingTo !== review.id && (
                      <button
                        onClick={() => setReplyingTo(review.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
                      >
                        <MessageSquare size={16} />
                        {review.merchantReply ? 'Update Reply' : 'Reply'}
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * reviewsPerPage + 1}-{Math.min(currentPage * reviewsPerPage, filteredReviews.length)} of{' '}
                {filteredReviews.length} reviews
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
      </div>
    </div>
  );
}
