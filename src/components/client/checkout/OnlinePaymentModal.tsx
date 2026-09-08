'use client';

import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CreditCard,
  Lock,
  Smartphone,
  X,
} from 'lucide-react';

type PaymentMethod = 'card' | 'mobile' | 'bank';

interface OnlinePaymentModalProps {
  isOpen: boolean;
  amount: number;
  onClose: () => void;
}

const fieldClasses = 'mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10';

const paymentMethods = [
  { id: 'card' as const, label: 'Card payment', description: 'Visa, Mastercard and supported cards', icon: CreditCard },
  { id: 'mobile' as const, label: 'Mobile payment', description: 'Pay using bKash, Nagad or Rocket', icon: Smartphone },
  { id: 'bank' as const, label: 'Other online payment', description: 'Pay through a supported partner bank', icon: Building2 },
];

export default function OnlinePaymentModal({ isOpen, amount, onClose }: OnlinePaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mobile');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mobileOperator, setMobileOperator] = useState('bkash');
  const [mobileNumber, setMobileNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [selectedBank, setSelectedBank] = useState('ebl');
  const [transactionId] = useState(() => `TRX-${Math.floor(100000 + Math.random() * 900000)}`);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isProcessing) onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen) return null;

  const handlePaymentSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  const handleClose = () => {
    if (!isProcessing) onClose();
  };

  return (
    <div className="fixed inset-0 z-70 flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) handleClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="online-payment-title" className="flex max-h-[min(760px,calc(100dvh-1rem))] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:rounded-3xl">
        <header className="flex items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Secure checkout</p><h2 id="online-payment-title" className="mt-1 text-xl font-bold tracking-tight text-slate-950">Online payment</h2><p className="mt-1 text-sm text-slate-500">Securely complete your payment.</p></div>
          <button type="button" onClick={handleClose} disabled={isProcessing} aria-label="Close online payment" className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"><X size={20} /></button>
        </header>

        <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          {isSuccess ? <div className="py-8 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 size={35} strokeWidth={2.5} /></div><h3 className="mt-5 text-xl font-bold text-slate-950">Payment successful</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">Your payment was processed securely. Your transaction is ready.</p><div className="mx-auto mt-6 max-w-sm divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50 text-left text-sm"><div className="flex justify-between px-4 py-3"><span className="text-slate-500">Transaction ID</span><strong className="font-mono">{transactionId}</strong></div><div className="flex justify-between px-4 py-3"><span className="text-slate-500">Total paid</span><strong className="text-[#15462d]">৳{amount.toLocaleString()}</strong></div></div><button type="button" onClick={onClose} className="mt-6 w-full max-w-sm rounded-xl bg-[#15462d] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#103b26] focus:outline-none focus:ring-4 focus:ring-emerald-500/20">Done</button></div> : <form onSubmit={handlePaymentSubmit}>
            <fieldset disabled={isProcessing}>
              <legend className="text-sm font-bold text-slate-900">Choose payment method</legend>
              <div className="mt-3 space-y-2.5">{paymentMethods.map(({ id, label, description, icon: Icon }) => <button key={id} type="button" onClick={() => setSelectedMethod(id)} aria-pressed={selectedMethod === id} className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition focus:outline-none focus:ring-4 focus:ring-emerald-500/20 ${selectedMethod === id ? 'border-emerald-500 bg-emerald-50/70 ring-4 ring-emerald-500/10' : 'border-slate-200 hover:border-emerald-300'}`}><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${selectedMethod === id ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}><Icon size={18} /></span><span className="min-w-0 flex-1"><strong className="block text-sm text-slate-900">{label}</strong><span className="mt-0.5 block text-xs text-slate-500">{description}</span></span><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selectedMethod === id ? 'border-emerald-600' : 'border-slate-300'}`}>{selectedMethod === id && <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />}</span></button>)}</div>

              <div className="mt-5 border-t border-slate-100 pt-5">
                {selectedMethod === 'mobile' && <div className="space-y-4"><div><label className="text-sm font-semibold text-slate-700">Mobile operator</label><div className="mt-2 grid grid-cols-3 gap-2">{['bkash', 'nagad', 'rocket'].map((operator) => <button key={operator} type="button" onClick={() => setMobileOperator(operator)} className={`rounded-xl border px-3 py-2.5 text-xs font-bold uppercase transition focus:outline-none focus:ring-4 focus:ring-emerald-500/20 ${mobileOperator === operator ? 'border-[#15462d] bg-[#15462d] text-white' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300'}`}>{operator}</button>)}</div></div><label className="block text-sm font-semibold text-slate-700">Account / wallet number<input type="tel" required placeholder="017XXXXXXXX" value={mobileNumber} onChange={(event) => setMobileNumber(event.target.value)} className={fieldClasses} /></label></div>}
                {selectedMethod === 'card' && <div className="space-y-4"><label className="block text-sm font-semibold text-slate-700">Card number<input type="text" required placeholder="4532 •••• •••• 8920" value={cardNumber} onChange={(event) => setCardNumber(event.target.value)} className={`${fieldClasses} font-mono`} /></label><div className="grid grid-cols-2 gap-3"><label className="text-sm font-semibold text-slate-700">Expiry date<input type="text" required placeholder="MM/YY" value={cardExpiry} onChange={(event) => setCardExpiry(event.target.value)} className={`${fieldClasses} font-mono`} /></label><label className="text-sm font-semibold text-slate-700">CVV / CVC<input type="password" required maxLength={4} placeholder="123" value={cardCvc} onChange={(event) => setCardCvc(event.target.value)} className={`${fieldClasses} font-mono`} /></label></div></div>}
                {selectedMethod === 'bank' && <label className="block text-sm font-semibold text-slate-700">Select partner bank<select value={selectedBank} onChange={(event) => setSelectedBank(event.target.value)} className={`${fieldClasses} cursor-pointer`}><option value="ebl">Eastern Bank PLC (EBL)</option><option value="brac">BRAC Bank PLC</option><option value="city">The City Bank</option><option value="dutch">Dutch-Bangla Bank (DBBL)</option><option value="hsbc">HSBC Bangladesh</option></select></label>}
              </div>
            </fieldset>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center justify-between text-sm text-slate-500"><span>Subtotal</span><strong className="text-slate-900">৳{(amount - 80).toLocaleString()}</strong></div><div className="mt-2 flex items-center justify-between text-sm text-slate-500"><span>Delivery fee</span><strong className="text-slate-900">৳80</strong></div><div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3"><span className="font-bold text-slate-900">Total</span><strong className="text-xl text-[#15462d]">৳{amount.toLocaleString()}</strong></div></div>
            <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500"><Lock className="mt-0.5 shrink-0 text-emerald-700" size={15} /><span><strong className="text-slate-700">Secure payment.</strong> Your payment information is securely processed.</span></div>
            <button type="submit" disabled={isProcessing} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#15462d] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-[#103b26] focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60">{isProcessing ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Processing payment...</> : <>Pay ৳{amount.toLocaleString()} <ArrowRight size={17} /></>}</button>
          </form>}
        </div>
      </section>
    </div>
  );
}
