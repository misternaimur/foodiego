'use client';

import { useRouter } from 'next/navigation';
import OnlinePaymentModal from '@/components/checkout/OnlinePaymentModal';

export default function OnlinePaymentPage() {
  const router = useRouter();

  return <OnlinePaymentModal isOpen amount={2170} onClose={() => router.push('/client/checkout')} />;
}
