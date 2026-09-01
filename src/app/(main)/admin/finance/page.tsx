'use client';

import React from 'react';
import { DollarSign, TrendingUp, PieChart } from 'lucide-react';

const FinancePage = () => {
  const financeSummary = [
    { label: 'Total Revenue', value: '$125,450', change: '+15%', icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Total Payouts', value: '$89,230', change: '+8%', icon: TrendingUp, color: 'bg-blue-50 text-blue-600' },
    { label: 'Commission Earned', value: '$36,220', change: '+23%', icon: PieChart, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
        <p className="text-sm text-gray-500 mt-1">Track revenue, payouts, and commissions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {financeSummary.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">{item.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{item.value}</p>
                  <p className="text-xs font-semibold text-emerald-600 mt-2">{item.change}</p>
                </div>
                <div className={`${item.color} p-3 rounded-xl`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">2025-01-{15 + i}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">Revenue</td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600">${1000 * i}</td>
                  <td className="px-6 py-4"><span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">Completed</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
