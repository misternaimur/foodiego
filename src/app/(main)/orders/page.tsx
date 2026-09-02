import Layout from '@/components/Layout';
import { ShoppingBag, Clock, CheckCircle2, X } from 'lucide-react';

export const metadata = {
  title: 'Orders · Foodiego',
};

const orders = [
  { id: '#A2051', customer: 'Aarav Mehta', item: 'Truffle Smashburger', amount: 37.0, status: 'Prepping', time: '12 min ago' },
  { id: '#A2050', customer: 'Sofia Reyes', item: 'Margherita Pizza', amount: 22.0, status: 'Ready', time: '8 min ago' },
  { id: '#A2049', customer: 'Liam Chen', item: 'Crispy Fries', amount: 12.0, status: 'Delivered', time: '22 min ago' },
  { id: '#A2048', customer: 'Noor Khan', item: 'Caramel Latte', amount: 11.0, status: 'Cancelled', time: '1 hr ago' },
];

export default function OrdersPage() {
  return (
    <Layout
      user={{
        name: 'abid',
        email: 'user@example.com',
        role: 'restaurant',
      }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">View and manage all your orders.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E2D5]/70 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50/80 border-b border-[#E8E2D5]">
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Amount</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-[#E8E2D5]/50 last:border-0 hover:bg-gray-50/60">
                <td className="px-4 py-3 font-extrabold text-gray-900">{o.id}</td>
                <td className="px-4 py-3 text-gray-700">{o.customer}</td>
                <td className="px-4 py-3 text-gray-600">{o.item}</td>
                <td className="px-4 py-3 text-right font-bold text-gray-900">${o.amount.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      o.status === 'Prepping'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : o.status === 'Ready'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : o.status === 'Delivered'
                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {o.status === 'Prepping' && <Clock size={12} />}
                    {o.status === 'Ready' && <CheckCircle2 size={12} />}
                    {o.status === 'Delivered' && <CheckCircle2 size={12} />}
                    {o.status === 'Cancelled' && <X size={12} />}
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{o.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
