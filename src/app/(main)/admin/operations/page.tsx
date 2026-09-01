'use client';

import React from 'react';
import { Truck, ClipboardCheck, AlertCircle, Clock } from 'lucide-react';

const OperationsPage = () => {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Operations Management</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor orders, deliveries, and logistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
              <Truck size={24} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Active Deliveries</p>
              <p className="text-2xl font-bold text-gray-900">234</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
              <ClipboardCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Completed Orders</p>
              <p className="text-2xl font-bold text-gray-900">1,543</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-orange-50 text-orange-600 p-3 rounded-xl">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Pending Issues</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Avg Delivery Time</p>
              <p className="text-2xl font-bold text-gray-900">28 min</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Ongoing Deliveries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Rider</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[1, 2, 3, 4].map((i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">ORD-10{i}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Rider #{i}</td>
                  <td className="px-6 py-4"><span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">In Transit</span></td>
                  <td className="px-6 py-4"><div className="w-20 bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{width: `${i * 25}%`}}></div></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OperationsPage;
