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
  initialReviews?: Review[];
}

// Sample fallback reviews for testing
const defaultDemoReviews: Review[] = [
  {
    id: 'rev-1',
    userName: 'Tanvir Hossain',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    rating: 5,
    date: '2 days ago',
    comment: 'The Nehari was absolutely tender and full of rich flavor. Delivery was right on time!',
  },
  {
    id: 'rev-2',
    userName: 'Nusrat Jahan',
    userAvatar: null,
    rating: 4,
    date: '1 week ago',
    comment: 'Great portion size for the price. The butter parathas were warm and flaky.',
  },
];

export const RestaurantReviews: React.FC<RestaurantReviewsProps> = ({
  restaurantId,
  initialReviews = defaultDemoReviews,
}) => {
  const { user } = useApp();

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);

    // FUTURE BACKEND INTEGRATION PLACEHOLDER:
    // try {
    //   const response = await fetch(`/api/restaurants/${restaurantId}/reviews`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ rating, comment }),
    //   });
    //   const newBackendReview = await response.json();
    //   setReviews((prev) => [newBackendReview, ...prev]);
    // } catch (error) {
    //   console.error('Failed to submit review:', error);
    // }

    // Client-side simulation for now:
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      userName: user?.name || 'Anonymous Gourmet',
      userAvatar: user?.avatarUrl || null,
      rating,
      date: 'Just now',
      comment: comment.trim(),
    };

    setTimeout(() => {
      setReviews((prev) => [newReview, ...prev]);
      setComment('');
      setRating(5);
      setIsSubmitting(false);
    }, 400);
  };

  const avgRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <section className="mt-16 pt-10 border-t border-[#E8E2D5]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare size={22} className="text-[#15462D]" />
            <span>Customer Reviews</span>
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Read authentic feedback or share your dining experience
          </p>
        </div>

        {/* Rating Overview Pill */}
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-[#E8E2D5] w-fit shadow-xs">
          <div className="flex items-center gap-1">
            <Star size={18} className="fill-amber-400 text-amber-400" />
            <span className="text-lg font-black text-slate-900">{avgRating}</span>
          </div>
          <span className="text-xs font-semibold text-gray-400">|</span>
          <span className="text-xs font-bold text-gray-600">
            {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Write a Review Box */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-[#E8E2D5] shadow-xs h-fit">
          <h4 className="text-base font-extrabold text-slate-900 mb-1">
            Write a Review
          </h4>
          <p className="text-xs text-gray-500 mb-4">
            {user ? `Posting as ${user.name}` : 'Share what you thought about the meal!'}
          </p>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Interactive Star Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Your Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-hidden transition-transform hover:scale-110"
                  >
                    <Star
                      size={22}
                      className={`${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Area */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Your Experience
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the food quality, packaging, and speed?"
                className="w-full p-3 text-xs sm:text-sm bg-[#FAF7EE] border border-[#E8E2D5] rounded-2xl focus:outline-hidden focus:border-[#15462D] text-gray-800 placeholder-gray-400 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#15462D] hover:bg-[#0f3320] text-white text-xs font-bold py-3 rounded-full transition-all disabled:opacity-50 shadow-xs"
            >
              <Send size={14} />
              <span>{isSubmitting ? 'Posting...' : 'Submit Review'}</span>
            </button>
          </form>
        </div>

        {/* Reviews Feed */}
        <div className="lg:col-span-2 space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-[#E8E2D5] text-center">
              <p className="text-sm font-semibold text-gray-600">No reviews yet.</p>
              <p className="text-xs text-gray-400 mt-1">Be the first to leave a review!</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-5 rounded-3xl border border-[#E8E2D5] shadow-xs"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden shrink-0">
                      {rev.userAvatar ? (
                        <Image
                          src={rev.userAvatar}
                          alt={rev.userName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User size={18} className="text-[#15462D]" />
                      )}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">{rev.userName}</h5>
                      <span className="text-[10px] text-gray-400">{rev.date}</span>
                    </div>
                  </div>

                  {/* Rating Stars Badge */}
                  <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-full border border-amber-200/50">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-extrabold text-gray-900">{rev.rating}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-12">
                  {rev.comment}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};