'use client';

import { useRouter } from 'next/navigation';
import OnlinePaymentModal from '@/components/client/checkout/OnlinePaymentModal';

export default function OnlinePaymentPage() {
  const router = useRouter();

  return <OnlinePaymentModal isOpen amount={2170} onClose={() => router.push('/client/checkout')} />;
}
