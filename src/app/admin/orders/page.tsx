"use client";

import { useEffect, useState } from "react";

interface Order {
  id: string;
  orderNumber: string;
  email: string;
  phone: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: { title: string; quantity: number; price: number; format: string }[];
  user: { name: string; email: string } | null;
  shippingAddress: { street: string; city: string; state: string; country: string } | null;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-indigo-100 text-indigo-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/orders?page=${page}&limit=20`)
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.orders);
        setPages(d.pages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  async function updateStatus(orderId: string, status: string) {
    setUpdating(orderId);
    await fetch(`/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    setUpdating(null);
  }

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-unit-lg">Orders</h1>

      <div className="bg-surface dark:bg-surface-dim rounded-modal border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-low">
                <th className="text-left font-label-md text-label-md text-on-surface-variant p-unit-sm">Order</th>
                <th className="text-left font-label-md text-label-md text-on-surface-variant p-unit-sm">Customer</th>
                <th className="text-left font-label-md text-label-md text-on-surface-variant p-unit-sm">Items</th>
                <th className="text-left font-label-md text-label-md text-on-surface-variant p-unit-sm">Total</th>
                <th className="text-left font-label-md text-label-md text-on-surface-variant p-unit-sm">Payment</th>
                <th className="text-left font-label-md text-label-md text-on-surface-variant p-unit-sm">Status</th>
                <th className="text-left font-label-md text-label-md text-on-surface-variant p-unit-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-unit-md text-center font-body-md text-body-md text-on-surface-variant">Loading...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-unit-md text-center font-body-md text-body-md text-on-surface-variant">No orders found</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                    <td className="p-unit-sm font-label-md text-label-md text-primary">{order.orderNumber}</td>
                    <td className="p-unit-sm">
                      <p className="font-body-md text-body-md text-on-surface">{order.user?.name || order.email}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{order.email}</p>
                    </td>
                    <td className="p-unit-sm font-body-md text-body-md text-on-surface-variant">
                      {order.items.map((i) => `${i.title} x${i.quantity}`).join(", ")}
                    </td>
                    <td className="p-unit-sm font-label-md text-label-md text-on-surface">₦{order.total.toLocaleString()}</td>
                    <td className="p-unit-sm">
                      <span className={`inline-block px-unit-xs py-unit-2xs rounded-input font-label-sm text-label-sm ${order.paymentStatus === "PAID" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-unit-sm">
                      <span className={`inline-block px-unit-xs py-unit-2xs rounded-input font-label-sm text-label-sm ${statusColors[order.status] || ""}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-unit-sm">
                      <select
                        value={order.status}
                        disabled={updating === order.id}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="bg-surface-container border border-outline/40 rounded-input px-unit-sm py-unit-xs font-body-md text-body-md text-on-surface cursor-pointer disabled:opacity-50"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-unit-sm mt-unit-md">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-unit-sm py-unit-xs bg-surface border border-outline/40 rounded-input font-label-md text-label-md text-on-surface disabled:opacity-40"
          >
            Previous
          </button>
          <span className="font-body-md text-body-md text-on-surface-variant">Page {page} of {pages}</span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-unit-sm py-unit-xs bg-surface border border-outline/40 rounded-input font-label-md text-label-md text-on-surface disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
