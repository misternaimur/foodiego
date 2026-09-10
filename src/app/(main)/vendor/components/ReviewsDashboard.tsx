"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Download,
  Send,
  Sparkles,
  Filter,
  SortAsc,
  MessageCircle,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useVendorSocket } from "@/hooks/useVendorSocket";
import { useReviews, useReplyToReview } from "@/hooks/useReviews";

const starOptions = [5, 4, 3, 2, 1] as const;
const sortOptions = ["Newest First", "Oldest First", "Highest Rated", "Lowest Rated"];

export default function ReviewsDashboard() {
  const [activeFilter, setActiveFilter] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState("Newest First");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("");

  const { data, isLoading, isError } = useReviews();
  const { mutate: postReply } = useReplyToReview();
  const { isConnected } = useVendorSocket();

  const reviews = data?.reviews || [];

  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === "all") return true;
    return r.rating === activeFilter;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "Newest First":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "Oldest First":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "Highest Rated":
        return b.rating - a.rating;
      case "Lowest Rated":
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  const handlePostReply = (reviewId: string) => {
    if (!draftText.trim()) return;
    postReply({ reviewId, text: draftText });
    setReplyingTo(null);
    setDraftText("");
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setDraftText("");
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600", icon: "text-emerald-500" };
      case "negative":
        return { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-600", icon: "text-rose-500" };
      case "neutral":
      default:
        return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600", icon: "text-amber-500" };
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-emerald-500";
    if (rating === 3) return "text-amber-500";
    return "text-rose-500";
  };

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center"
      >
        <AlertCircle size={32} className="mx-auto mb-3 text-rose-400" />
        <p className="text-sm text-rose-700">
          Unable to load reviews. Please try again later.
        </p>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded bg-gray-200 animate-pulse" />
        <div className="h-6 w-64 rounded bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.35fr_0.65fr]">
          <div className="h-[500px] rounded-2xl bg-gray-200 animate-pulse" />
          <div className="h-[500px] rounded-2xl bg-gray-200 animate-pulse" />
        </div>
      </div>
    );
  }

  const overallRating = data?.overallRating || 4.8;
  const totalReviews = data?.totalReviews || 1248;
  const ratingSummary = data?.ratingSummary || {};
  const sentimentInsight = data?.sentimentInsight || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Monitor customer feedback, respond to reviews, and boost your restaurant&apos;s reputation.
          </p>
        </div>
        <div className="mt-3 flex items-center gap-3 sm:mt-0">
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
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              const csv = [
                "Rating,Customer,Order,Date,Review Text",
                ...reviews.map(
                  (r) =>
                    `"${r.rating}","${r.customerName}","${r.orderName}","${r.timeAgo}","${r.text.replace(/"/g, '""')}"`
                ),
              ].join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "reviews-export.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download size={14} />
            Export CSV
          </motion.button>
        </div>
      </div>

      {/* ================= MAIN SPLIT VIEW ================= */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.35fr_0.65fr]">
        {/* LEFT COLUMN: Rating & AI Insights */}
        <div className="space-y-6">
          {/* 3D Floating Rating Card */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/20 via-transparent to-amber-500/20 opacity-60 blur-xl" />
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 bg-gradient-to-br from-emerald-100 to-transparent rounded-full opacity-30" />

            <div className="relative text-center">
              <motion.div
                className="text-6xl font-black text-gray-900 leading-none mb-2"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
              >
                {overallRating.toFixed(1)}
              </motion.div>

              <div className="flex justify-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className={i < Math.floor(overallRating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                  />
                ))}
              </div>

              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                BASED ON {totalReviews.toLocaleString()} REVIEWS
              </p>
            </div>

            <div className="relative mt-8 space-y-4">
                {[5, 4, 3, 2, 1].map((stars) => {
                const info = ratingSummary[stars];
                const percentage = info?.percentage || 0;
                return (
                  <motion.div
                    key={stars}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (5 - stars) * 0.1 }}
                  >
                    <span className="flex items-center gap-1 text-sm font-medium text-gray-700 w-16">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      {stars}
                    </span>
                    <div className="flex-1 h-3 rounded-full bg-gray-200 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + (5 - stars) * 0.1 }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-12 text-right">
                      {percentage}%
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* AI Sentiment Insight Card */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl border border-blue-200 bg-blue-50/50 p-6 shadow-xl"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-400/10 via-transparent to-transparent opacity-60 blur-xl" />

            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 border border-blue-200">
                  <Sparkles size={22} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-semibold text-blue-900">AI Sentiment Insight</h3>
                  <p className="text-sm leading-relaxed text-blue-800/90">
                    {sentimentInsight || "Analyzing customer sentiment..."}
                  </p>
                  <motion.div
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <TrendingUp size={12} />
                    Overall sentiment: Positive
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Review Feed */}
        <div className="flex flex-col gap-4">
          {/* Top Filters */}
          <div className="flex shrink-0 items-center justify-between gap-3">
            <div className="flex items-center gap-1 overflow-x-auto rounded-full bg-gray-100 p-1 border border-gray-200">
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => setActiveFilter("all")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  activeFilter === "all"
                    ? "bg-emerald-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All Reviews
              </motion.button>
              {starOptions.map((stars) => (
                <motion.button
                  key={stars}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setActiveFilter(stars)}
                  className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeFilter === stars
                      ? "bg-amber-400 text-gray-900 shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Star size={12} className="fill-current" />
                  {stars}★
                </motion.button>
              ))}
              <button
                title="Filter more options"
                className="rounded-full p-1.5 text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <Filter size={14} />
              </button>
            </div>

            <div className="relative shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                <SortAsc size={12} />
                Sort: {sortBy}
              </motion.button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-44 rounded-xl border border-gray-200 bg-white shadow-xl"
                  >
                    {sortOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSortBy(opt);
                          setDropdownOpen(false);
                        }}
                        className={`block w-full px-3 py-2 text-left text-xs font-medium ${
                          sortBy === opt
                            ? "bg-emerald-50 text-emerald-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Review Cards */}
          <div className="flex-1 overflow-y-auto">
            {sortedReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Star size={40} className="text-gray-300 mb-4" />
                <p className="text-sm text-gray-500">No reviews match the current filter.</p>
              </div>
            ) : (
              <motion.div className="space-y-4">
                {sortedReviews.map((review, index) => {
                  const sentiment = getSentimentColor(review.sentiment);
                  const ratingColor = getRatingColor(review.rating);
                  const isReplying = replyingTo === review.id;

                  return (
                    <motion.div
                      key={review.id}
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      {/* Rating & Customer Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 border border-gray-200 text-gray-700 font-bold">
                            {review.customerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">{review.customerName}</span>
                              <span className={`text-xs ${sentiment.icon} flex items-center gap-1`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${sentiment.icon.replace("text-", "bg-")}`} />
                                {review.sentiment}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className={`flex items-center gap-1 ${ratingColor}`}>
                                {Array.from({ length: review.rating }).map((_, i) => (
                                  <Star key={i} size={12} className="fill-current" />
                                ))}
                              </span>
                              <span>·</span>
                              <span>{review.timeAgo}</span>
                            </div>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center rounded-xl border px-3 py-1 text-xs font-medium ${sentiment.bg} ${sentiment.border} ${sentiment.text}`}
                        >
                          Order: {review.orderName}
                        </span>
                      </div>

                      {/* Review Text */}
                      <p className="mt-3 text-sm leading-relaxed text-gray-700">
                        {review.text}
                      </p>

                      {/* Reply States */}
                      {review.reply ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 rounded-xl bg-gray-50 border border-gray-200 p-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600 font-bold">
                              RM
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900">Your Reply</span>
                                <span className="text-xs text-gray-400">{review.reply.createdAt}</span>
                              </div>
                              <p className="text-sm text-gray-700">{review.reply.text}</p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setReplyingTo(review.id)}
                            className="mt-2 flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900"
                          >
                            Edit Reply
                          </motion.button>
                        </motion.div>
                      ) : isReplying ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-inner"
                        >
                          <textarea
                            value={draftText}
                            onChange={(e) => setDraftText(e.target.value)}
                            placeholder="Write a response..."
                            rows={3}
                            className="w-full resize-none border-0 bg-gray-50 rounded-lg p-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                            autoFocus
                          />
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              onClick={() => {
                                setDraftText("Thank you for your feedback! We're glad you enjoyed your meal. We hope to serve you again soon!");
                              }}
                              className="flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                            >
                              <Sparkles size={12} />
                              ✨ Draft AI Reply
                            </motion.button>
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                onClick={handleCancelReply}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                              >
                                Cancel
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handlePostReply(review.id)}
                                disabled={!draftText.trim()}
                                className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                              >
                                <Send size={12} />
                                Post Reply
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setReplyingTo(review.id)}
                          className="mt-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors group-hover:border-gray-300"
                        >
                          <MessageCircle size={12} />
                          Reply to Customer
                        </motion.button>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
