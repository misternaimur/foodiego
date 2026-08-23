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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (page: string) => {
    if (page === 'deliveries' || page === 'dashboard' || page === 'map') {
      setView(page as View);
    }
    setActivePage(page as PageKey);
    setSidebarOpen(false);
  };

  const handleToggleAvailability = () => setIsOnline(!isOnline);

  return (
    <div className="flex min-h-screen bg-[#F8F9FD]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-[250px] transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <RiderSidebar
          view={view}
          activePage={activePage}
          onNavigate={handleNavigate}
          onToggleAvailability={handleToggleAvailability}
          isOnline={isOnline}
        />
      </div>

      <main className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <header className="bg-white border-b border-slate-100 px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{view === 'deliveries' ? 'Deliveries' : view === 'map' ? 'Map' : 'Dashboard'}</h1>
              <p className="text-sm text-gray-500 hidden sm:block">{view === 'deliveries' ? 'Manage your active, upcoming, and completed deliveries.' : view === 'map' ? 'Live rider map and demand zones.' : "Here's your operational overview for today."}</p>
            </div>
          </div>
          {view === 'dashboard' && (
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="p-2 bg-blue-50 text-blue-600 rounded-full">🔔</button>
              <button className="p-2 bg-blue-50 text-blue-600 rounded-full">🔍</button>
              <button onClick={handleToggleAvailability} className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium ${isOnline ? 'bg-red-50 text-red-600' : 'bg-[#FF5C28] text-white'}`}>
                {isOnline ? '🔴 Go Offline' : '🟢 Go Online'}
              </button>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-8">
          {view === 'deliveries' ? <DeliveriesView /> : view === 'map' ? <MapView /> : <DashboardView />}
        </div>
      </main>
    </div>
  );
}