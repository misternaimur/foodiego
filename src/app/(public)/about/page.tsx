import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Bike,
  BrainCircuit,
  Clock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  Utensils,
  Users,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Foodiego',
  description:
    'Learn how Foodiego connects customers, restaurants, and riders through smarter food delivery.',
};

const values = [
  {
    icon: BrainCircuit,
    title: 'Smarter choices',
    description:
      'Personalized recommendations help customers discover meals that fit their taste, budget, and moment.',
  },
  {
    icon: Clock,
    title: 'Faster deliveries',
    description:
      'Intelligent routing and real-time coordination keep every order moving from kitchen to doorstep.',
  },
  {
    icon: Store,
    title: 'Stronger partnerships',
    description:
      'Restaurants and riders get practical tools to manage demand, preparation, routes, and earnings.',
  },
  {
    icon: ShieldCheck,
    title: 'More confidence',
    description:
      'Clear order updates, secure checkout, and responsive support make the experience easier to trust.',
  },
];

const audiences = [
  {
    icon: Users,
    title: 'For customers',
    description:
      'Find nearby restaurants, compare favorites, track every stage of an order, and get AI-powered help when you need it.',
    linkLabel: 'Explore restaurants',
    href: '/restaurants',
  },
  {
    icon: Utensils,
    title: 'For restaurants',
    description:
      'Reach more customers, manage menus and orders, and make better decisions with a focused merchant workspace.',
    linkLabel: 'Add your restaurant',
    href: '/auth/register/restaurant',
  },
  {
    icon: Bike,
    title: 'For riders',
    description:
      'Accept delivery requests, follow optimized routes, view high-demand zones, and keep earnings in one place.',
    linkLabel: 'Sign up to deliver',
    href: '/auth/register/rider',
  },
  {
    icon: Truck,
    title: 'For operators',
    description:
      'Coordinate users, vendors, commissions, disputes, and performance from a centralized operations view.',
    linkLabel: 'Contact support',
    href: 'mailto:support@foodiego.com',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF7EE]">
      <section className="relative overflow-hidden bg-[#15462D] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Our story
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Food delivery, made smarter.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-emerald-50/75 sm:text-lg">
              Foodiego connects customers, restaurants, cloud kitchens, and
              riders through one intelligent platform designed to make every
              meal easier to discover, prepare, and deliver.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/restaurants"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F6A429] px-6 py-3 text-sm font-extrabold text-gray-900 transition-colors hover:bg-[#e0931f]"
              >
                Explore restaurants
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/register/restaurant"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-extrabold text-white transition-colors hover:bg-white hover:text-[#15462D]"
              >
                Become a partner
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-extrabold text-emerald-200">AI-powered</p>
                <p className="mt-1 text-emerald-50/60">Personal discovery</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-extrabold text-emerald-200">Real-time</p>
                <p className="mt-1 text-emerald-50/60">Order coordination</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 bg-emerald-950 shadow-2xl">
              <Image
                src="/assets/images/food/hero.jpg"
                alt="A colorful selection of freshly prepared food"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#103A27] via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-6 -left-4 rounded-2xl border border-white/10 bg-[#103A27] p-4 shadow-xl sm:-left-8 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F6A429] text-gray-900">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-white">Smart logistics</p>
                  <p className="mt-0.5 text-xs text-emerald-100/70">
                    From kitchen to doorstep
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#F6A429]">
            What we believe
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#15462D] sm:text-4xl">
            Better food moments start with better connections.
          </h2>
          <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
            We bring the people behind every order into one coordinated
            experience, so customers enjoy more choice, partners can grow, and
            riders can work with clarity.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-3xl border border-[#E8E2D5] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#15462D] transition-colors group-hover:bg-[#15462D] group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-base font-extrabold text-[#15462D]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#F6A429]">
              One platform, every role
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#15462D] sm:text-4xl">
              Built for the people who make delivery possible.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {audiences.map(({ icon: Icon, title, description, linkLabel, href }) => (
              <div
                key={title}
                className="relative overflow-hidden rounded-3xl border border-[#E8E2D5] bg-[#FAF7EE] p-7 transition-all duration-300 hover:border-emerald-200 hover:shadow-lg sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#15462D] shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <Link
                    href={href}
                    className="inline-flex shrink-0 items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-[#15462D] hover:text-emerald-700"
                  >
                    {linkLabel}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <h3 className="mt-6 text-xl font-black text-[#15462D]">{title}</h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-gray-600">
                  {description}
                </p>
                <div className="mt-6 h-1.5 w-16 rounded-full bg-[#F6A429]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#15462D] py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6">
          <MapPin className="h-8 w-8 text-amber-400" />
          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
            Bringing great food closer to everyone.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/75 sm:text-base">
            Whether you are ordering dinner, growing a kitchen, or delivering
            across town, Foodiego is here to make the journey feel simple.
          </p>
          <Link
            href="/restaurants"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#F6A429] px-7 py-3 text-sm font-extrabold text-gray-900 transition-colors hover:bg-[#e0931f]"
          >
            Start exploring
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
