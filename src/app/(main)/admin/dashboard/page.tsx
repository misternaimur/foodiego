import React from 'react';
import { 
  ShoppingBag, 
  DollarSign, 
  Users, 
  Store, 
  Bike, 
  Navigation, 
  FileText, 
  Star, 
  ArrowUpRight, 
  MoreVertical,
  ChevronDown
} from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      
      {/* Top Subtitle & Time Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-gray-500">Here&apos;s what&apos;s happening across FoodieGo today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-between gap-4 px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 rounded-xl text-xs font-semibold transition-all shadow-2xs">
            <span>Today</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Row 1: Main Metric Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Orders</span>
            <span className="w-8 h-8 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center">
              <ShoppingBag size={16} />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">12,842</h3>
            <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
              <ArrowUpRight size={13} /> 14.8% vs last week
            </p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Revenue</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={16} />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">৳ 1,248,500</h3>
            <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
              <ArrowUpRight size={13} /> 18.4% vs last week
            </p>
          </div>
        </div>

        {/* Active Customers */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Active Customers</span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={16} />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">24,680</h3>
            <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
              <ArrowUpRight size={13} /> 8.5% vs last week
            </p>
          </div>
        </div>

        {/* Active Vendors */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Active Vendors</span>
            <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Store size={16} />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">486</h3>
            <p className="text-[11px] font-medium text-gray-400 mt-1">+12 this month</p>
          </div>
        </div>

      </div>

      {/* Row 2: Secondary Status Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Active Riders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Active Riders</span>
            <span className="w-8 h-8 rounded-xl bg-gray-50 text-gray-700 flex items-center justify-center">
              <Bike size={16} />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">1,284</h3>
            <p className="text-[11px] font-medium text-gray-400 mt-1">892 currently online</p>
          </div>
        </div>

        {/* Live Deliveries (Highlighted Teal Border) */}
        <div className="bg-white p-5 rounded-2xl border-2 border-[#0d9488] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-800">Live Deliveries</span>
            <span className="w-8 h-8 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center">
              <Navigation size={16} />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">324</h3>
            <p className="text-[11px] font-semibold text-[#0d9488] mt-1">Currently active</p>
          </div>
        </div>

        {/* Pending Approvals (Highlighted Red Border) */}
        <div className="bg-white p-5 rounded-2xl border-2 border-red-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-800">Pending Approvals</span>
            <span className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <FileText size={16} />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">38</h3>
            <p className="text-[11px] font-semibold text-red-500 mt-1">Requires attention</p>
          </div>
        </div>

        {/* Platform Rating */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Platform Rating</span>
            <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Star size={16} className="fill-amber-400 text-amber-400" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-1">
              4.7 <span className="text-xs font-medium text-gray-400">/ 5.0</span>
            </h3>
            <p className="text-[11px] font-medium text-gray-400 mt-1">Based on 48,920 reviews</p>
          </div>
        </div>

      </div>

      {/* Main Grid Section (Chart & Right Widgets) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Revenue Overview & Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Revenue Overview Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-950">Revenue Overview</h3>
              <div className="flex items-center bg-gray-50 border border-gray-200 p-1 rounded-xl text-xs font-semibold text-gray-600">
                <button className="px-3 py-1 bg-white shadow-2xs rounded-lg text-gray-900">7D</button>
                <button className="px-3 py-1 hover:text-gray-900">30D</button>
                <button className="px-3 py-1 hover:text-gray-900">1Y</button>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 text-xs text-gray-500 mb-6">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#0d9488]"></span> Gross Revenue</span>
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span> Platform Commission</span>
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span> Net Revenue</span>
            </div>

            {/* Chart Graphic Area */}
            <div className="h-60 w-full bg-gray-50/40 border border-gray-100 rounded-2xl flex items-end justify-between px-8 pb-4 pt-8 gap-6 relative">
              
              {/* Y-Axis guide lines */}
              <div className="absolute inset-x-8 top-12 border-b border-gray-200/60 flex justify-between text-[10px] text-gray-400">
                <span>1.5M</span>
              </div>
              <div className="absolute inset-x-8 top-24 border-b border-gray-200/60 flex justify-between text-[10px] text-gray-400">
                <span>1.0M</span>
              </div>
              <div className="absolute inset-x-8 top-36 border-b border-gray-200/60 flex justify-between text-[10px] text-gray-400">
                <span>500k</span>
              </div>
              <div className="absolute inset-x-8 bottom-10 border-b border-gray-200/60 flex justify-between text-[10px] text-gray-400">
                <span>0</span>
              </div>

              {/* Bars */}
              {[
                { label: "W1", hGross: "70%", hCom: "45%", hNet: "30%" },
                { label: "W2", hGross: "50%", hCom: "30%", hNet: "18%" },
                { label: "W3", hGross: "85%", hCom: "60%", hNet: "42%" },
                { label: "W4", hGross: "65%", hCom: "40%", hNet: "32%" },
              ].map((bar, i) => (
                <div key={i} className="w-full h-full flex flex-col items-center justify-end z-10">
                  <div className="w-16 h-full flex items-end justify-center gap-1">
                    <div style={{ height: bar.hGross }} className="w-full bg-[#cce8e5] rounded-t-sm"></div>
                    <div style={{ height: bar.hCom }} className="w-full bg-[#93c5fd] rounded-t-sm"></div>
                    <div style={{ height: bar.hNet }} className="w-full bg-[#0d9488] rounded-t-sm"></div>
                  </div>
                  <span className="text-[11px] font-medium text-gray-400 mt-2">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-950">Recent Orders</h3>
              <a href="/admin/orders" className="text-xs font-semibold text-[#0d9488] hover:underline">
                View All
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Order ID</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Restaurant</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {[
                    { id: "#ORD-8942", name: "John Doe", initials: "JD", rest: "Burger King", amount: "৳ 850", status: "Delivering", color: "bg-emerald-50 text-emerald-600" },
                    { id: "#ORD-8941", name: "Alice Smith", initials: "AS", rest: "KFC", amount: "৳ 1,200", status: "Preparing", color: "bg-blue-50 text-blue-600" },
                    { id: "#ORD-8940", name: "Rahat Bose", initials: "RB", rest: "Pizza Hut", amount: "৳ 2,450", status: "Completed", color: "bg-emerald-50 text-emerald-600" },
                    { id: "#ORD-8939", name: "Mita Khan", initials: "MK", rest: "Local Cafe", amount: "৳ 450", status: "Cancelled", color: "bg-red-50 text-red-600" },
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 font-bold text-[#0d9488]">{row.id}</td>
                      <td className="py-3.5 font-medium text-gray-800 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 font-bold text-[10px] flex items-center justify-center">
                          {row.initials}
                        </span>
                        {row.name}
                      </td>
                      <td className="py-3.5 text-gray-500">{row.rest}</td>
                      <td className="py-3.5 font-bold text-gray-900">{row.amount}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${row.color}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button className="text-gray-400 hover:text-gray-700 p-1">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Live Delivery Monitoring & Pending Approvals */}
        <div className="space-y-6">
          
          {/* Live Delivery Monitoring */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-950">Live Delivery Monitoring</h3>
              <button className="text-xs font-semibold text-[#0d9488] hover:underline">View Map</button>
            </div>
            
            <div className="space-y-3.5">
              {[
                { id: "ORD-8942", route: "Burger King → Gulshan 2", eta: "12 mins", status: "On Time", statusBg: "bg-emerald-50 text-emerald-600" },
                { id: "ORD-8941", route: "KFC → Banani", eta: "25 mins", status: "Delayed", statusBg: "bg-amber-50 text-amber-600" },
                { id: "ORD-8940", route: "Pizza Hut → Dhanmondi", eta: "5 mins", status: "On Time", statusBg: "bg-emerald-50 text-emerald-600" },
                { id: "ORD-8939", route: "Local Cafe → Uttara", eta: "--", status: "Preparing", statusBg: "bg-gray-100 text-gray-600" },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-gray-900">{item.id}</h4>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${item.statusBg}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">{item.route}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-gray-900">{item.eta}</span>
                    <p className="text-[9px] text-gray-400">ETA</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-950">Pending Approvals</h3>
              <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-[10px] font-bold">38 Total</span>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">New Vendor Requests</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">12 awaiting review</p>
                </div>
                <button className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-[#0d9488] rounded-xl text-xs font-bold transition-all">
                  Review
                </button>
              </div>

              <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Rider Applications</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">18 awaiting background check</p>
                </div>
                <button className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-[#0d9488] rounded-xl text-xs font-bold transition-all">
                  Review
                </button>
              </div>

              <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Restaurant Approvals</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">8 awaiting onboarding</p>
                </div>
                <button className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-[#0d9488] rounded-xl text-xs font-bold transition-all">
                  Review
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default DashboardPage;