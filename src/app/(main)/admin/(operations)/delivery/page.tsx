import { Inbox, MapPin, Truck } from "lucide-react";
import { dbConnect } from "@/lib/dbConnect";
import { verifyRole } from "@/lib/dal";
import { OrderBooking } from "@/models/OrderBooking";
import { Rider } from "@/models/Rider";
import OrderStatusActions from "@/components/admin/OrderStatusActions";
import AssignRiderAction from "@/components/admin/AssignRiderAction";

export const dynamic = "force-dynamic";

export default async function AdminDeliveryPage() {
  await verifyRole("admin");
  await dbConnect();

  const [deliveries, availableRiders, activeRiderCount] = await Promise.all([
    OrderBooking.find({ status: { $in: ["confirmed", "preparing", "out_for_delivery"] } })
      .populate("customerId", "name")
      .populate("restaurantId", "restaurantName")
      .populate("riderId", "fullName phone")
      .sort({ createdAt: -1 })
      .lean(),
    Rider.find({ status: "approved" }).select("fullName").sort({ fullName: 1 }).lean(),
    Rider.countDocuments({ status: "approved", isAvailable: true }),
  ]);

  const riderOptions = availableRiders.map((r) => ({ id: String(r._id), fullName: r.fullName }));

  return (
    <main className="flex-1 bg-gray-50/60 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Delivery & Logistics</h1>
          <p className="mt-1 text-sm text-gray-500">Live view of orders currently moving through the delivery pipeline.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-3">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Active Deliveries</span>
            <p className="mt-2 text-2xl font-extrabold text-gray-900">{deliveries.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Riders Available Now</span>
            <p className="mt-2 text-2xl font-extrabold text-emerald-600">{activeRiderCount}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Unassigned</span>
            <p className="mt-2 text-2xl font-extrabold text-amber-600">
              {deliveries.filter((d) => !d.riderId).length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          {deliveries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Inbox className="text-gray-300" size={42} />
              <p className="mt-3 text-sm font-semibold text-gray-700">No active deliveries</p>
              <p className="text-xs text-gray-400">Orders being prepared or out for delivery will show up here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase bg-gray-50/50">
                    <th className="py-3.5 px-6">Order</th>
                    <th className="py-3.5 px-6">Restaurant</th>
                    <th className="py-3.5 px-6">Customer</th>
                    <th className="py-3.5 px-6">Address</th>
                    <th className="py-3.5 px-6">Rider</th>
                    <th className="py-3.5 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {deliveries.map((d) => {
                    const id = String(d._id);
                    const customer = d.customerId as unknown as { name?: string } | null;
                    const restaurant = d.restaurantId as unknown as { restaurantName?: string } | null;
                    const rider = d.riderId as unknown as { _id: unknown; fullName?: string } | null;

                    return (
                      <tr key={id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-4 px-6 font-bold text-gray-900">#{id.slice(-6).toUpperCase()}</td>
                        <td className="py-4 px-6 text-gray-700">{restaurant?.restaurantName || d.restaurantName || "—"}</td>
                        <td className="py-4 px-6 text-gray-700">{customer?.name || "Guest"}</td>
                        <td className="py-4 px-6 text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={12} className="text-gray-400 shrink-0" />
                            <span className="truncate max-w-[220px]">{d.deliveryAddress}</span>
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {rider ? (
                            <span className="flex items-center gap-1.5 font-semibold text-gray-800">
                              <Truck size={13} className="text-emerald-600" /> {rider.fullName}
                            </span>
                          ) : (
                            <AssignRiderAction orderId={id} riders={riderOptions} />
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <OrderStatusActions orderId={id} status={d.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
