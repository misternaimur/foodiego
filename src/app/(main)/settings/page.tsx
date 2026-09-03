import Layout from '@/components/Layout';
import { Settings, Bell, Shield, CreditCard, User, Globe } from 'lucide-react';

export const metadata = {
  title: 'Settings · Foodiego',
};

const settingsSections = [
  {
    title: 'Account',
    items: [
      { label: 'Profile', icon: User, href: '/account' },
      { label: 'Privacy', icon: Shield, href: '#' },
      { label: 'Notifications', icon: Bell, href: '#' },
    ],
  },
  {
    title: 'Billing',
    items: [
      { label: 'Payment Methods', icon: CreditCard, href: '#' },
      { label: 'Billing History', icon: CreditCard, href: '#' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { label: 'Language', icon: Globe, href: '#' },
      { label: 'Currency', icon: CreditCard, href: '#' },
    ],
  },
];

export default function SettingsPage() {
  return (
    <Layout
      user={{
        name: 'abid',
        email: 'user@example.com',
        role: 'restaurant',
      }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your account preferences and billing.</p>
      </div>

      <div className="space-y-6">
        {settingsSections.map((section) => (
          <div key={section.title} className="bg-white rounded-2xl border border-[#E8E2D5]/70 shadow-sm overflow-hidden">
            <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider px-6 py-3 border-b border-[#E8E2D5]/50">
              {section.title}
            </h2>
            <div className="divide-y divide-[#E8E2D5]/50">
              {section.items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <item.icon size={18} className="text-[#15462D]" />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
