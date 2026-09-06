'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Truck,
  User,
} from 'lucide-react';
import Link from 'next/link';
import OnlinePaymentModal from '@/components/checkout/OnlinePaymentModal';

interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  area: string;
  note: string;
  paymentMethod: 'cod' | 'online';
}

const inputClasses =
  'mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10';

export default function CheckoutPage() {
  const [formData, setFormData] = useState<CheckoutForm>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Chattogram',
    area: '',
    note: '',
    paymentMethod: 'cod',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const cartItems = [
    { id: '1', name: 'Organic Fresh Honey', price: 1250, quantity: 1, vendor: 'Fresh Farms Co.' },
    { id: '2', name: 'Natural Green Tea', price: 840, quantity: 2, vendor: 'Daily Grocers' },
  ];
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = 80;
  const total = subtotal + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7faf8] px-4 py-12 text-slate-900">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-[0_18px_60px_rgba(21,70,45,0.1)] sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 size={34} strokeWidth={2.5} /></div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Order confirmed</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Your order is on its way</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">Thanks for ordering{formData.fullName ? `, ${formData.fullName}` : ''}. We have received your order and are getting it ready.</p>
          <div className="mt-7 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50 text-left text-sm">
            <div className="flex items-center justify-between px-4 py-3.5"><span className="text-slate-500">Order number</span><strong>#ORD-2026-8942</strong></div>
            <div className="flex items-center justify-between px-4 py-3.5"><span className="text-slate-500">Payment</span><strong>{formData.paymentMethod === 'cod' ? 'Cash on delivery' : 'Online payment'}</strong></div>
            <div className="flex items-center justify-between px-4 py-3.5"><span className="text-slate-500">Estimated delivery</span><strong>2-3 business days</strong></div>
          </div>
          <Link href="/" className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-[#15462d] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#103b26] focus:outline-none focus:ring-4 focus:ring-emerald-500/20">Continue shopping</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7faf8] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#15462d] focus:outline-none focus:ring-4 focus:ring-emerald-500/20"><ArrowLeft size={16} /> Back to cart</Link>
            <div className="mt-5 flex items-center gap-2"><ShoppingBag className="text-[#15462d]" size={23} /><h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Checkout</h1></div>
            <p className="mt-1 text-sm text-slate-500">Almost there. Confirm your details and we&apos;ll handle the rest.</p>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-800 shadow-sm sm:flex"><LockKeyhole size={14} /> Secure checkout</div>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1fr)_370px]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-start gap-3 border-b border-slate-100 pb-5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#15462d]"><MapPin size={19} /></div><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Step 1</p><h2 className="mt-1 text-lg font-bold text-slate-950">Delivery address</h2><p className="mt-1 text-sm text-slate-500">Where should we bring your order?</p></div></div>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Full name <span className="text-rose-500">*</span><span className="relative block"><User className="pointer-events-none absolute left-3 top-5 text-slate-400" size={16} /><input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} placeholder="e.g. Md. Naimur Rahman" className={`${inputClasses} pl-10`} /></span></label>
                <label className="text-sm font-semibold text-slate-700">Email address <span className="text-rose-500">*</span><span className="relative block"><Mail className="pointer-events-none absolute left-3 top-5 text-slate-400" size={16} /><input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="naimur@example.com" className={`${inputClasses} pl-10`} /></span></label>
                <label className="text-sm font-semibold text-slate-700">Phone number <span className="text-rose-500">*</span><span className="relative block"><Phone className="pointer-events-none absolute left-3 top-5 text-slate-400" size={16} /><input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="+880 1XXXXXXXXX" className={`${inputClasses} pl-10`} /></span></label>
                <label className="text-sm font-semibold text-slate-700">City <span className="text-rose-500">*</span><select name="city" value={formData.city} onChange={handleInputChange} className={`${inputClasses} cursor-pointer`}><option>Chattogram</option><option>Dhaka</option><option>Sylhet</option><option>Rajshahi</option><option>Khulna</option></select></label>
                <label className="text-sm font-semibold text-slate-700">Area / Thana <span className="text-rose-500">*</span><input type="text" name="area" required value={formData.area} onChange={handleInputChange} placeholder="e.g. GEC, Nasirabad" className={inputClasses} /></label>
                <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Street address / house details <span className="text-rose-500">*</span><textarea name="address" required rows={2} value={formData.address} onChange={handleInputChange} placeholder="House #, Road #, Block/Sector..." className={`${inputClasses} resize-none`} /></label>
                <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Delivery instructions <span className="font-normal text-slate-400">(optional)</span><input type="text" name="note" value={formData.note} onChange={handleInputChange} placeholder="Gate code, landmark, or anything your rider should know" className={inputClasses} /></label>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-start gap-3 border-b border-slate-100 pb-5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#15462d]"><Truck size={19} /></div><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Step 2</p><h2 className="mt-1 text-lg font-bold text-slate-950">Delivery information</h2><p className="mt-1 text-sm text-slate-500">Simple, reliable delivery to your door.</p></div></div>
              <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3"><div className="rounded-xl bg-slate-50 p-3.5"><p className="text-xs text-slate-500">Estimated arrival</p><p className="mt-1 font-bold text-slate-900">2-3 business days</p></div><div className="rounded-xl bg-slate-50 p-3.5"><p className="text-xs text-slate-500">Delivery type</p><p className="mt-1 font-bold text-slate-900">Doorstep delivery</p></div><div className="rounded-xl bg-slate-50 p-3.5"><p className="text-xs text-slate-500">Contact</p><p className="mt-1 font-bold text-slate-900">Rider will call</p></div></div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-start gap-3 border-b border-slate-100 pb-5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#15462d]"><CreditCard size={19} /></div><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Step 3</p><h2 className="mt-1 text-lg font-bold text-slate-950">Payment method</h2><p className="mt-1 text-sm text-slate-500">Choose how you&apos;d like to pay.</p></div></div>
              <div className="mt-5 space-y-3">
                <label className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition ${formData.paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-50/60 ring-4 ring-emerald-500/10' : 'border-slate-200 hover:border-emerald-200'}`}><span className="flex items-center gap-3"><input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={() => setFormData((prev) => ({ ...prev, paymentMethod: 'cod' }))} className="h-4 w-4 accent-emerald-700" /><span><strong className="block text-sm text-slate-900">Cash on delivery</strong><span className="mt-1 block text-xs text-slate-500">Pay with cash when your order arrives.</span></span></span><Truck className="shrink-0 text-emerald-700" size={20} /></label>
                <label className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition ${formData.paymentMethod === 'online' ? 'border-emerald-500 bg-emerald-50/60 ring-4 ring-emerald-500/10' : 'border-slate-200 hover:border-emerald-200'}`}><span className="flex items-center gap-3"><input type="radio" name="paymentMethod" value="online" checked={formData.paymentMethod === 'online'} onChange={() => { setFormData((prev) => ({ ...prev, paymentMethod: 'online' })); setIsPaymentModalOpen(true); }} className="h-4 w-4 accent-emerald-700" /><span><strong className="block text-sm text-slate-900">Online payment</strong><span className="mt-1 block text-xs text-slate-500">Pay securely online with a supported method.</span></span></span><CreditCard className="shrink-0 text-emerald-700" size={20} /></label>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-6"><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(21,70,45,0.08)] sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Your order</p><h2 className="mt-1 text-xl font-bold text-slate-950">Order summary</h2></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">{cartItems.length} items</span></div>
            <div className="divide-y divide-slate-100 py-2">{cartItems.map((item) => <div key={item.id} className="flex items-start justify-between gap-4 py-4 text-sm"><div><p className="font-semibold text-slate-900">{item.name}</p><p className="mt-1 text-xs text-slate-500">{item.quantity} × ৳{item.price.toLocaleString()} · {item.vendor}</p></div><span className="shrink-0 font-bold text-slate-900">৳{(item.price * item.quantity).toLocaleString()}</span></div>)}</div>
            <div className="space-y-3 border-t border-slate-100 pt-5 text-sm"><div className="flex justify-between text-slate-500"><span>Subtotal</span><strong className="text-slate-900">৳{subtotal.toLocaleString()}</strong></div><div className="flex justify-between text-slate-500"><span>Delivery fee</span><strong className="text-slate-900">৳{shippingFee}</strong></div><div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-5"><span className="font-bold text-slate-900">Total to pay</span><strong className="text-2xl font-bold text-[#15462d]">৳{total.toLocaleString()}</strong></div></div>
            <button type="submit" disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#15462d] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-[#103b26] focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Processing order...</> : <>Place order · ৳{total.toLocaleString()} <Check size={17} /></>}</button>
            <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500"><ShieldCheck className="mt-0.5 shrink-0 text-emerald-700" size={15} /><span>Your payment information is protected. You can review everything before placing the order.</span></div>
          </section></aside>
        </form>
        <OnlinePaymentModal isOpen={isPaymentModalOpen} amount={total} onClose={() => setIsPaymentModalOpen(false)} />
      </div>
    </main>
  );
}
