'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star, MessageSquare, Send, User, LoaderCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string | null;
  rating: number;
  date: string;
  comment: string;
}

interface RestaurantReviewsProps {
  restaurantId: string;
  onRatingUpdate?: (newAvg: number, newCount: number) => void;
}

// UPDATE (real reviews fix): this component used to keep its whole review
// list in local `useState` only — nothing ever reached the database, so a
// submitted review vanished on refresh and never showed up on the vendor's
// own Reviews dashboard tab. It now reads/writes through
// src/app/api/v1/catalog/reviews/[restaurantId]/route.ts, which is backed by
// the same `Review` model the vendor side already uses.
export const RestaurantReviews: React.FC<RestaurantReviewsProps> = ({
  restaurantId,
  onRatingUpdate,
}) => {
  const { user } = useApp();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/v1/catalog/reviews/${restaurantId}`)
      .then((res) => res.json())
      .then((data: { reviews: Review[] }) => {
        setReviews(data.reviews || []);
        if (onRatingUpdate && data.reviews?.length) {
          const avg = data.reviews.reduce((sum, r) => sum + r.rating, 0) / data.reviews.length;
          onRatingUpdate(Number(avg.toFixed(1)), data.reviews.length);
        }
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
    // Only re-fetch when the restaurant changes — onRatingUpdate is a fresh
    // function identity on every parent render and would otherwise re-run
    // this on every keystroke elsewhere on the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  // Calculate stats DIRECTLY from the reviews list
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
    : 0;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/catalog/reviews/${restaurantId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment: comment.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to submit review');
      }

      const updatedReviews = [data.review as Review, ...reviews];
      setReviews(updatedReviews);

      const newCount = updatedReviews.length;
      const newAvg = Number(
        (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / newCount).toFixed(1)
      );
      onRatingUpdate?.(newAvg, newCount);

      setComment('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-16 pt-10 border-t border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <MessageSquare size={22} className="text-[#15462D]" />
            <span>Customer Reviews</span>
          </h3>
        </div>

        {/* Dynamic Star Badge */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-xs">
          <Star size={18} className="fill-amber-400 text-amber-400" />
          <span className="text-lg font-black">{averageRating}</span>
          <span className="text-xs text-gray-500">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmitReview} className="bg-white p-6 rounded-3xl border border-gray-200 space-y-4">
          <h4 className="font-bold text-slate-900">Leave Feedback</h4>
          
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                className="p-1 focus:outline-hidden"
              >
                <Star
                  size={20}
                  className={s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                />
              </button>
            ))}
          </div>

          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write review..."
            className="w-full p-3 text-xs bg-[#FAF7EE] border border-gray-200 rounded-xl focus:outline-hidden"
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#15462D] text-white text-xs font-bold py-3 rounded-full flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? <LoaderCircle size={14} className="animate-spin" /> : <Send size={14} />}
            Submit
          </button>
          {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
          {!user && (
            <p className="text-[11px] text-gray-400">You need to be signed in as a customer to leave a review.</p>
          )}
        </form>

        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-gray-300">
              <LoaderCircle size={22} className="animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <p className="py-6 text-center text-xs text-gray-400">No reviews yet — be the first to share your experience.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="bg-white p-5 rounded-3xl border border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-slate-900 text-sm">{r.userName}</span>
                  <span className="text-xs text-amber-500 font-bold">★ {r.rating}</span>
                </div>
                <p className="text-xs text-gray-600">{r.comment}</p>
                <p className="mt-2 text-[10px] text-gray-400">{new Date(r.date).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};