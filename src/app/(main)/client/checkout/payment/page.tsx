'use client';

import { useRouter } from 'next/navigation';
import OnlinePaymentModal from '@/components/client/checkout/OnlinePaymentModal';

export default function OnlinePaymentPage() {
  const router = useRouter();

  return (
    <OnlinePaymentModal
      isOpen
      amount={2170}
      deliveryFee={80}
      onClose={() => router.push('/client/checkout')}
      onSuccess={() => router.push('/client/checkout')}
    />
  );
}
