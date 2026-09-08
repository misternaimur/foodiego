'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, MessageSquare, Send, User } from 'lucide-react';
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

export const RestaurantReviews: React.FC<RestaurantReviewsProps> = ({
  restaurantId,
  onRatingUpdate,
}) => {
  const { user } = useApp();

  // Initial reviews array starting with the base feedback
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      userName: 'Tanvir Hossain',
      rating: 4.5,
      date: '2 days ago',
      comment: 'Delicious quality, delivered fresh and hot!',
    },
  ]);

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  // Calculate stats DIRECTLY from the reviews list
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
    : 0;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      userName: user?.name || 'anamulhaque0357',
      userAvatar: user?.avatarUrl,
      rating,
      date: 'Just now',
      comment: comment.trim(),
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Calculate new stats
    const newCount = updatedReviews.length;
    const newAvg = Number(
      (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / newCount).toFixed(1)
    );

    // Notify parent page to update top header stats
    if (onRatingUpdate) {
      onRatingUpdate(newAvg, newCount);
    }

    setComment('');
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
            className="w-full bg-[#15462D] text-white text-xs font-bold py-3 rounded-full flex items-center justify-center gap-2"
          >
            <Send size={14} /> Submit
          </button>
        </form>

        <div className="lg:col-span-2 space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white p-5 rounded-3xl border border-gray-200">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-slate-900 text-sm">{r.userName}</span>
                <span className="text-xs text-amber-500 font-bold">★ {r.rating}</span>
              </div>
              <p className="text-xs text-gray-600">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};