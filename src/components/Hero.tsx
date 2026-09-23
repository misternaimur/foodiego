'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ShoppingBag,
  Compass,
  Star,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: 'Artisan Seafood Pasta',
    img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Wood-Fired Pizza',
    img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Organic Salad Bowl',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Gourmet Double Burger',
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Lemon Herb Chicken',
    img: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop',
  },
  {
    id: 6,
    title: 'Dragon Roll Sushi',
    img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop',
  },
  {
    id: 7,
    title: 'Crispy Chicken Wrap',
    img: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&auto=format&fit=crop',
  },
  {
    id: 8,
    title: 'Vegan Power Bowl',
    img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop',
  },
];

const AUTOPLAY_MS = 1500;
const MAX_VISIBLE_OFFSET = 3;

// "Liquid glass" control: frosted translucent fill, a bright top rim and a
// soft inner glow, lifting on hover. Colours are white/black alphas so they
// read the same in both themes (this section is dark in both).
function GlassArrowButton({
  direction,
  onClick,
  className,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  className: string;
}) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'}
      className={`group absolute z-40 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/25 bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),inset_0_-10px_18px_rgba(255,255,255,0.06),0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 hover:scale-110 hover:border-white/45 hover:bg-white/20 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),inset_0_-10px_18px_rgba(255,255,255,0.1),0_14px_36px_rgba(16,185,129,0.35)] active:scale-95 sm:h-14 sm:w-14 ${className}`}
    >
      {/* glossy top highlight */}
      <span className="pointer-events-none absolute inset-x-1 top-0.5 h-1/2 rounded-full bg-linear-to-b from-white/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
      <Icon className="relative h-5 w-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110 sm:h-6 sm:w-6" />
    </button>
  );
}

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);
    updateViewportWidth();
    window.addEventListener('resize', updateViewportWidth);
    return () => window.removeEventListener('resize', updateViewportWidth);
  }, []);

  // Advances one card every 1.5s. A timeout keyed on activeIndex (rather than
  // a free-running interval) restarts the countdown after a manual arrow /
  // dot / swipe, so the next auto-step never lands right after a click.
  // Pauses only while the pointer is over the carousel itself.
  useEffect(() => {
    if (isCarouselHovered) return;
    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [activeIndex, isCarouselHovered]);

  const activeSlide = SLIDES[activeIndex];
  const cardSpacing = viewportWidth < 640 ? 150 : viewportWidth < 1024 ? 168 : 220;

  const handleNext = () =>
    setActiveIndex((prev) => (prev + 1) % SLIDES.length);

  const handlePrev = () =>
    setActiveIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
    if (info.offset.x < -60) handleNext();
    if (info.offset.x > 60) handlePrev();
  };

  return (
    <section
      className="relative flex w-full flex-col overflow-hidden bg-[#082e22] px-3 py-6 text-white sm:px-8 sm:py-10"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
{/* 
      <motion.div
        whileHover={{ scale: 1.04, y: -1 }}
        className="absolute right-4 top-4 z-30 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-slate-900/60 px-3 py-1.5 shadow-lg shadow-emerald-500/10 backdrop-blur-md sm:right-8 sm:top-6"
      > */}
        {/* <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span> */}
        {/* <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">Live</span> */}
      {/* </motion.div> */}

      <div className="relative z-20 mx-auto mb-6 max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-slate-900/60 px-4 py-1.5 shadow-lg backdrop-blur-md">
          <div className="flex -space-x-1.5">
            <div className="h-4 w-4 rounded-full border border-[#0f172a] bg-emerald-400" />
            <div className="h-4 w-4 rounded-full border border-[#0f172a] bg-teal-400" />
            <div className="h-4 w-4 rounded-full border border-[#0f172a] bg-amber-400" />
          </div>
          <span className="text-xs font-medium text-[#e2e8f0]">
            Loved By <strong className="text-white">2.4m Users</strong> with 4.8 Rating ★
          </span>
        </div>

        <h1 className="mb-3 bg-linear-to-r from-[#ffffff] via-[#f1f5f9] to-[#a7f3d0] bg-clip-text px-2 text-3xl font-black leading-tight tracking-tight text-transparent sm:px-0 sm:text-5xl">
          Fresh, Delicious &amp; Delivered To Your Door!
        </h1>

        <p className="mx-auto max-w-lg text-xs font-normal text-[#cbd5e1] sm:text-sm">
          Explore a wide selection of fresh groceries, gourmet ingredients, and ready-to-eat meals with fast delivery.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
          <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/foods"
              className="flex min-w-33 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-xs font-black text-[#020617] shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:bg-emerald-400 sm:min-w-0 sm:px-6 sm:text-sm"
            >
              <ShoppingBag className="h-4 w-4" /> SHOP NOW
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/restaurants"
              className="flex min-w-33 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-xs font-bold text-white backdrop-blur-md transition-all hover:border-white/35 hover:bg-white/10 sm:min-w-0 sm:px-6 sm:text-sm"
            >
              <Compass className="h-4 w-4 text-[#34d399]" /> Explore Menu
            </Link>
          </motion.div>
        </div>
      </div>

      {/* The deck is wider than the viewport on lg (w-[150%]) so side cards can
          fan out; `mx-auto` can't centre an element wider than its parent, which
          shifted the whole deck (and the arrows inside it) to the right. It's
          centred with left-1/2 + -translate-x-1/2 instead, and the arrows now
          live in this full-width wrapper rather than inside the deck. */}
      <div
        className="relative z-10 w-full"
        onMouseEnter={() => setIsCarouselHovered(true)}
        onMouseLeave={() => setIsCarouselHovered(false)}
      >
      <div
        className="relative left-1/2 flex h-[208px] w-full max-w-[1600px] -translate-x-1/2 items-center justify-center sm:h-[280px] lg:h-[340px] lg:w-[150%]"
        style={{ perspective: '1200px' }}
      >
        {SLIDES.map((slide, index) => {
          const rawOffset = (index - activeIndex + SLIDES.length) % SLIDES.length;
          const offset = rawOffset > SLIDES.length / 2 ? rawOffset - SLIDES.length : rawOffset;
          const absOffset = Math.abs(offset);

          const rotateY = offset * -18;
          const translateX = offset * cardSpacing;
          const translateZ = -absOffset * 130;
          const scale = 1 - absOffset * 0.1;
          // Show 3 cards on each side of the active one. With an even number of
          // slides the one directly "behind" (offset 4) always landed on the
          // right, making the deck lopsided and sitting under the next arrow.
          const hidden = absOffset > MAX_VISIBLE_OFFSET;
          const opacity = hidden ? 0 : Math.max(1 - absOffset * 0.3, 0.2);

          return (
            <motion.div
              key={slide.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              onClick={() => setActiveIndex(index)}
              aria-hidden={hidden}
              style={{ pointerEvents: hidden ? 'none' : undefined }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                x: translateX,
                z: translateZ,
                rotateY,
                scale,
                opacity,
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 22, mass: 0.8 }}
              className={`absolute top-0 h-50 w-38 cursor-pointer overflow-hidden rounded-4xl border-2 bg-slate-900 sm:h-67.5 sm:w-51.25 sm:rounded-[2.2rem] lg:h-82.5 lg:w-62.5 ${
                offset === 0
                  ? 'z-30 border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.55)]'
                  : 'z-10 border-white/10 shadow-2xl'
              }`}
            >
              <Image
                src={slide.img}
                alt={slide.title}
                width={600}
                height={800}
                className="pointer-events-none h-full w-full object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="text-[10px] font-bold text-white drop-shadow-md sm:text-sm">
                  {slide.title}
                </span>
              </div>
            </motion.div>
          );
        })}

      </div>

        {/* Vertically on the active card's centre (cards sit at top-0: 200 / 270 /
            330px tall), horizontally just outside the visible deck on wide
            screens, and pinned to the screen edge on narrow ones. */}
        <GlassArrowButton
          direction="prev"
          onClick={handlePrev}
          className="left-2 top-25 -translate-y-1/2 sm:left-6 sm:top-[135px] lg:left-[max(1rem,calc(50%-44rem))] lg:top-[165px]"
        />
        <GlassArrowButton
          direction="next"
          onClick={handleNext}
          className="right-2 top-25 -translate-y-1/2 sm:right-6 sm:top-[135px] lg:right-[max(1rem,calc(50%-44rem))] lg:top-[165px]"
        />
      </div>

      <div className="relative z-30 mt-5 flex items-center justify-center gap-2">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Show ${slide.title}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === activeIndex ? 'w-8 bg-[#34d399]' : 'w-2.5 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="relative z-30 mx-auto mt-2 flex items-center gap-2 text-sm font-semibold text-[#e2e8f0]"
        >
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span>{activeSlide.title}</span>
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="relative z-30 mx-auto mt-6 w-full max-w-4xl"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 18 },
          visible: { opacity: 1, y: 0, transition: { delayChildren: 0.15, staggerChildren: 0.1 } },
        }}
      >
        <div className="grid gap-2.5 sm:grid-cols-3">
          {[
            { icon: Clock3, label: 'Fast delivery', value: '25-35 min', detail: 'from nearby kitchens' },
            { icon: MapPin, label: 'Live tracking', value: 'On the way', detail: 'follow every order' },
            { icon: ShieldCheck, label: 'Food you trust', value: '4.8 / 5 rating', detail: 'loved by local foodies' },
          ].map(({ icon: Icon, label, value, detail }) => (
            <motion.div
              key={label}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -3, borderColor: 'rgba(52, 211, 153, 0.5)' }}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-left backdrop-blur-sm"
            >
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-[#6ee7b7]">
                <motion.span
                  className="absolute inset-0 rounded-xl border border-emerald-400/40"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <Icon className="relative h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6ee7b7]">{label}</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-white">{value}</p>
                <p className="truncate text-[11px] text-[#94a3b8]">{detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </section>
  );
}