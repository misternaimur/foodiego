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

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isHovered, setIsHovered] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);
    updateViewportWidth();
    window.addEventListener('resize', updateViewportWidth);
    return () => window.removeEventListener('resize', updateViewportWidth);
  }, []);

  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 2400);

    return () => clearInterval(timer);
  }, [isHovered]);

  const activeSlide = SLIDES[activeIndex];
  const cardSpacing = viewportWidth < 640 ? 150 : viewportWidth < 1024 ? 168 : 220;

  const backgroundTiles = [
    { id: 'tile-1', className: 'left-[8%] top-[18%] h-14 w-14 md:h-16 md:w-16', delay: 0 },
    { id: 'tile-2', className: 'left-[21%] top-[34%] h-12 w-12 md:h-14 md:w-14', delay: 0.9 },
    { id: 'tile-3', className: 'right-[11%] top-[15%] h-16 w-16 md:h-20 md:w-20', delay: 1.2 },
    { id: 'tile-4', className: 'right-[22%] top-[40%] h-14 w-14 md:h-16 md:w-16', delay: 0.4 },
    { id: 'tile-5', className: 'left-[15%] bottom-[16%] h-12 w-12 md:h-16 md:w-16', delay: 1.8 },
    { id: 'tile-6', className: 'right-[12%] bottom-[18%] h-14 w-14 md:h-16 md:w-16', delay: 2.2 },
    { id: 'tile-7', className: 'left-[42%] bottom-[18%] h-10 w-10 md:h-12 md:w-12', delay: 2.8 },
    { id: 'tile-8', className: 'right-[38%] top-[22%] h-10 w-10 md:h-12 md:w-12', delay: 1.4 },
  ];

  const shootingStars = [
    { id: 'shoot-1', className: 'left-[8%] top-[20%]', duration: 4.8, delay: 0.8 },
    { id: 'shoot-2', className: 'left-[28%] top-[28%]', duration: 5.6, delay: 1.7 },
    { id: 'shoot-3', className: 'right-[18%] top-[22%]', duration: 5.1, delay: 2.4 },
    { id: 'shoot-4', className: 'right-[32%] top-[36%]', duration: 6.2, delay: 3.2 },
    { id: 'shoot-5', className: 'left-[52%] top-[18%]', duration: 4.4, delay: 1.1 },
  ];

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
      className="relative flex min-h-170 w-full flex-col justify-between overflow-hidden bg-[#082e22] px-3 py-8 text-white sm:min-h-180 sm:px-8 sm:py-14"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

      <motion.div
        whileHover={{ scale: 1.04, y: -1 }}
        className="absolute right-4 top-4 z-30 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-slate-900/60 px-3 py-1.5 shadow-lg shadow-emerald-500/10 backdrop-blur-md sm:right-8 sm:top-6"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">Live</span>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block" aria-hidden="true">
        {shootingStars.map((star) => (
          <motion.div
            key={star.id}
            className={`absolute ${star.className}`}
            animate={{
              x: [0, 100, 180],
              y: [0, 50, 110],
              opacity: [0, 1, 0.8, 0],
              scale: [0.2, 1, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: star.delay,
            }}
          >
            <div className="relative h-px w-16 origin-left rounded-full bg-gradient-to-r from-transparent via-amber-200/90 to-emerald-200/0 shadow-[0_0_18px_rgba(250,204,21,0.7)]" />
            <div className="absolute -right-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-amber-200 shadow-[0_0_14px_rgba(252,211,77,1)]" />
          </motion.div>
        ))}
        {backgroundTiles.map((tile) => (
          <motion.div
            key={tile.id}
            className={`absolute rounded-[10px] border border-emerald-300/35 bg-emerald-200/5 ${tile.className}`}
            animate={{
              y: [0, -14, 0],
              x: [0, 8, 0],
              opacity: [0.12, 0.28, 0.12],
              rotate: [0, 4, 0],
              scale: [1, 1.06, 1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: tile.delay }}
          />
        ))}

        <motion.div
          className="absolute left-[4%] top-[37%] h-px w-48 origin-left rotate-24 bg-linear-to-r from-transparent via-emerald-300/30 to-transparent xl:left-[9%]"
          animate={{ opacity: [0.2, 0.65, 0.2], scaleX: [0.8, 1, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-[4%] top-[39%] h-px w-52 origin-right -rotate-24 bg-linear-to-l from-transparent via-emerald-300/30 to-transparent xl:right-[9%]"
          animate={{ opacity: [0.2, 0.65, 0.2], scaleX: [0.8, 1, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        />
        <motion.div
          className="absolute bottom-[20%] left-[8%] h-px w-40 -rotate-18 bg-linear-to-r from-transparent via-amber-300/20 to-transparent xl:left-[14%]"
          animate={{ x: [-20, 30, -20], opacity: [0, 0.8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[19%] right-[8%] h-px w-40 rotate-18 bg-linear-to-l from-transparent via-amber-300/20 to-transparent xl:right-[14%]"
          animate={{ x: [20, -30, 20], opacity: [0, 0.8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2.3 }}
        />
        {[
          'left-[15%] top-[30%]',
          'left-[21%] bottom-[26%]',
          'right-[15%] top-[31%]',
          'right-[21%] bottom-[27%]',
        ].map((position, index) => (
          <motion.span
            key={position}
            className={`absolute ${position} h-1.5 w-1.5 rounded-full ${index % 2 ? 'bg-amber-300' : 'bg-emerald-300'} shadow-[0_0_16px_currentColor]`}
            animate={{ y: [0, -10, 0], opacity: [0.25, 1, 0.25], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.65 }}
          />
        ))}
      </div>

      <div className="relative z-20 mx-auto mb-4 max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-slate-900/60 px-4 py-1.5 shadow-lg backdrop-blur-md">
          <div className="flex -space-x-1.5">
            <div className="h-4 w-4 rounded-full border border-slate-900 bg-emerald-400" />
            <div className="h-4 w-4 rounded-full border border-slate-900 bg-teal-400" />
            <div className="h-4 w-4 rounded-full border border-slate-900 bg-amber-400" />
          </div>
          <span className="text-xs font-medium text-slate-200">
            Loved By <strong className="text-white">2.4m Users</strong> with 4.8 Rating ★
          </span>
        </div>

        <h1 className="mb-3 bg-linear-to-r from-white via-slate-100 to-emerald-200 bg-clip-text px-2 text-3xl font-black leading-tight tracking-tight text-transparent sm:px-0 sm:text-5xl">
          Fresh, Delicious &amp; Delivered To Your Door!
        </h1>

        <p className="mx-auto max-w-lg text-xs font-normal text-slate-300 sm:text-sm">
          Explore a wide selection of fresh groceries, gourmet ingredients, and ready-to-eat meals with fast delivery.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
          <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/foods"
              className="flex min-w-33 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-xs font-black text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:bg-emerald-400 sm:min-w-0 sm:px-6 sm:text-sm"
            >
              <ShoppingBag className="h-4 w-4" /> SHOP NOW
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/restaurants"
              className="flex min-w-33 items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-xs font-bold text-white transition-all hover:bg-slate-800 sm:min-w-0 sm:px-6 sm:text-sm"
            >
              <Compass className="h-4 w-4 text-emerald-400" /> Explore Menu
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex h-67.5 w-full max-w-[1600px] items-center justify-center sm:h-90 lg:h-105 lg:w-[150%]" style={{ perspective: '1200px' }}>
        {SLIDES.map((slide, index) => {
          const rawOffset = (index - activeIndex + SLIDES.length) % SLIDES.length;
          const offset = rawOffset > SLIDES.length / 2 ? rawOffset - SLIDES.length : rawOffset;
          const absOffset = Math.abs(offset);

          const rotateY = offset * -18;
          const translateX = offset * cardSpacing;
          const translateZ = -absOffset * 130;
          const scale = 1 - absOffset * 0.1;
          const opacity = Math.max(1 - absOffset * 0.3, 0.2);

          return (
            <motion.div
              key={slide.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              onClick={() => setActiveIndex(index)}
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

        <button
          onClick={handlePrev}
          className="absolute left-2 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-white shadow-lg transition-all hover:bg-emerald-500 hover:text-slate-950 sm:left-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-white shadow-lg transition-all hover:bg-emerald-500 hover:text-slate-950 sm:right-10"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="relative z-30 mt-6 flex items-center justify-center gap-2">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Show ${slide.title}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === activeIndex ? 'w-8 bg-emerald-400' : 'w-2.5 bg-white/30 hover:bg-white/60'
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
          className="relative z-30 mx-auto mt-5 flex items-center gap-2 text-sm text-slate-200"
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
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3 text-left backdrop-blur-sm"
            >
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                <motion.span
                  className="absolute inset-0 rounded-xl border border-emerald-400/40"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <Icon className="relative h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-300/80">{label}</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-white">{value}</p>
                <p className="truncate text-[11px] text-slate-400">{detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </section>
  );
}