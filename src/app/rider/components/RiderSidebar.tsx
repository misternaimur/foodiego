"use client";

import { ReactNode } from 'react';

type SidebarProps = {
  view: 'deliveries' | 'dashboard' | 'map';
  activePage: string;
  onNavigate: (page: string) => void;
  onToggleAvailability: () => void;
  isOnline: boolean;
};

const navItems = [
  { name: 'Dashboard', key: 'dashboard', icon: DashboardIcon },
  { name: 'Deliveries', key: 'deliveries', icon: DeliveryIcon },
  { name: 'Map', key: 'map', icon: MapIcon },
  { name: 'Earnings', key: 'earnings', icon: EarningsIcon },
  { name: 'Shift History', key: 'shift', icon: HistoryIcon },
];

export default function RiderSidebar({ view, activePage, onNavigate, onToggleAvailability, isOnline }: SidebarProps) {
  const navItemClasses = (key: string) =>
    `w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 text-sm transition-colors ${
      activePage === key ? 'bg-orange-50 text-[#FF5C28] font-medium border-r-2 border-[#FF5C28]' : 'text-gray-600 hover:bg-gray-50'
    }`;

  return (
    <aside className="w-[250px] bg-white border-r border-slate-100 flex flex-col">
      <div className="p-5">
        <h1 className="text-xl font-bold text-[#FF5C28]">Foodiego</h1>
      </div>

      <div className="px-4 mb-6">
        {view === 'deliveries' ? (
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">R</div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Foodiego Rider</p>
              <p className="text-xs text-amber-600 font-medium">Elite Tier</p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">A</div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Alex Rider</p>
              <p className="text-xs text-gray-500">Pro Tier • 4.98 ★</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-medium rounded-full">
                Online 4h 20m
              </span>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <button key={item.key} onClick={() => onNavigate(item.key)} className={navItemClasses(item.key)}>
            <item.icon />
            {item.name}
          </button>
        ))}
      </nav>

      <div className="p-4">
        {view === 'deliveries' ? (
          <button onClick={onToggleAvailability} className={`w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 ${isOnline ? 'bg-gray-900 text-white hover:bg-black' : 'bg-[#FF5C28] text-white hover:bg-[#B33C00]'}`}>
            <PowerIcon /> {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        ) : (
          <button onClick={onToggleAvailability} className="w-full flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm px-4 py-2">
            <SettingsIcon /> Settings
          </button>
        )}
      </div>
    </aside>
  );
}

function DashboardIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function DeliveryIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  );
}

function EarningsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function PowerIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v9m0 0a9 9 0 11-6.364-2.636" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}