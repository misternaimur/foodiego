'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '@/context/AppContext';
import { queryClient } from '@/lib/queryClient';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>{children}</AppProvider>
    </QueryClientProvider>
  );
}