'use client';

import React from 'react';
import { Settings, Lock, Bell, Database } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage platform configuration and security settings.</p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* General Settings */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Settings size={24} className="text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-900">General Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
              <input type="text" defaultValue="FoodieGo" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <input type="email" defaultValue="admin@foodiego.com" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
            </div>
            <div className="flex gap-2 pt-4">
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">Save Changes</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">Cancel</button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={24} className="text-red-600" />
            <h2 className="text-lg font-bold text-gray-900">Security</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
              <input type="number" defaultValue="30" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Two-Factor Authentication</span>
              <button className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">Enabled</button>
            </div>
            <div className="flex gap-2 pt-4">
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">Update Security</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">Cancel</button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Bell size={24} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">Email Notifications</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">Push Notifications</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
              <input type="checkbox" className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">SMS Notifications</span>
            </label>
          </div>
        </div>

        {/* Database */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Database size={24} className="text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">Database</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Last Backup</p>
              <p className="text-lg font-semibold text-gray-900">Today at 02:30 AM</p>
            </div>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Create Backup Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
