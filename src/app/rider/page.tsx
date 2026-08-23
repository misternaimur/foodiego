"use client";

import { useState } from 'react';
import RiderSidebar from './components/RiderSidebar';
import DeliveriesView from './components/DeliveriesView';
import DashboardView from './components/DashboardView';
import MapView from './components/MapView';

type View = 'deliveries' | 'dashboard' | 'map';
type PageKey = 'dashboard' | 'deliveries' | 'map' | 'earnings' | 'shift';

export default function RiderLayout() {
  const [view, setView] = useState<View>('deliveries');
  const [activePage, setActivePage] = useState<PageKey>('deliveries');
  const [isOnline, setIsOnline] = useState(false);

  const handleNavigate = (page: string) => {
    if (page === 'deliveries' || page === 'dashboard' || page === 'map') {
      setView(page as View);
    }
    setActivePage(page as PageKey);
  };

  const handleToggleAvailability = () => setIsOnline(!isOnline);

  return (
    <div className="flex min-h-screen bg-[#F8F9FD]">
      <RiderSidebar
        view={view}
        activePage={activePage}
        onNavigate={handleNavigate}
        onToggleAvailability={handleToggleAvailability}
        isOnline={isOnline}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{view === 'deliveries' ? 'Deliveries' : view === 'map' ? 'Map' : 'Dashboard'}</h1>
            <p className="text-sm text-gray-500">{view === 'deliveries' ? 'Manage your active, upcoming, and completed deliveries.' : view === 'map' ? 'Live rider map and demand zones.' : "Here's your operational overview for today."}</p>
          </div>
          {view === 'dashboard' && (
            <div className="flex items-center gap-3">
              <button className="p-2 bg-blue-50 text-blue-600 rounded-full">🔔</button>
              <button className="p-2 bg-blue-50 text-blue-600 rounded-full">🔍</button>
              <button onClick={handleToggleAvailability} className={`px-4 py-2 rounded-full text-sm font-medium ${isOnline ? 'bg-red-50 text-red-600' : 'bg-[#FF5C28] text-white'}`}>
                {isOnline ? '🔴 Go Offline' : '🟢 Go Online'}
              </button>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-auto p-6">
          {view === 'deliveries' ? <DeliveriesView /> : view === 'map' ? <MapView /> : <DashboardView />}
        </div>
      </main>
    </div>
  );
}