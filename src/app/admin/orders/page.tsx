"use client";

import { useEffect, useState } from "react";

interface OrderItem { title: string; quantity: number; price: number; format: string; }
interface Order {
  id: string; orderNumber: string; email: string; phone: string;
  subtotal: number; shipping: number; discount: number; total: number;
  status: string; paymentStatus: string; paymentMethod: string; createdAt: string;
  items: OrderItem[];
  user: { name: string; email: string } | null;
  shippingAddress: { street: string; city: string; state: string; country: string; zip: string } | null;
}

interface OrdersStats {
  totalOrders: number; processing: number; shippedToday: number;
  totalRevenue: number; revenueTrend: number;
}

const statusBadge: Record<string, string> = {
  PENDING: "bg-orange-100 text-orange-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-green-100 text-green-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-red-100 text-red-800",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrdersStats>({ totalOrders: 0, processing: 0, shippedToday: 0, totalRevenue: 0, revenueTrend: 0 });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [search, setSearch] = useState("");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (statusFilter) params.set("status", statusFilter);
    if (dateFilter) params.set("date", dateFilter);
    if (search) params.set("q", search);
    fetch(`/api/admin/orders?${params}`)
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders); setPages(d.pages); setTotal(d.total); if (d.stats) setStats(d.stats); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, statusFilter, dateFilter]);

  useEffect(() => {
    const t = setTimeout(() => { if (page === 1) loadOrders(); else setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  function loadOrders() {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (statusFilter) params.set("status", statusFilter);
    if (dateFilter) params.set("date", dateFilter);
    if (search) params.set("q", search);
    fetch(`/api/admin/orders?${params}`)
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders); setPages(d.pages); setTotal(d.total); if (d.stats) setStats(d.stats); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  async function updateStatus(orderId: string, status: string) {
    await fetch(`/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    if (viewOrder?.id === orderId) setViewOrder((prev) => prev ? { ...prev, status } : null);
  }

  function exportCSV() {
    const headers = ["Order Number", "Date", "Customer", "Email", "Items", "Total", "Status", "Payment"];
    const rows = orders.map((o) => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleDateString(),
      o.user?.name || "Guest",
      o.email,
      o.items.length,
      o.total.toFixed(2),
      o.status,
      o.paymentStatus,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-unit-md mb-unit-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Orders Management</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Monitor and fulfill your bookshop&apos;s stewardship journey.</p>
        </div>
        <div className="flex items-center gap-unit-sm">
          <button onClick={exportCSV} className="border border-outline-variant px-unit-md py-unit-sm rounded-lg flex items-center gap-2 text-sm hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined text-sm">download</span>Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-unit-lg">
        {[
          { label: "Total Orders", value: stats.totalOrders, icon: "shopping_bag", trend: "All time", color: "bg-primary/5 text-primary" },
          { label: "Processing", value: stats.processing, icon: "pending", trend: "Action Required", color: "bg-orange-50 text-orange-600" },
          { label: "Shipped Today", value: stats.shippedToday, icon: "local_shipping", trend: "Today", color: "bg-blue-50 text-blue-600" },
          { label: "Total Revenue", value: `$${(stats.totalRevenue || 0).toLocaleString()}`, icon: "payments", trend: `${stats.revenueTrend >= 0 ? "+" : ""}${stats.revenueTrend}% vs prev period`, color: "bg-green-50 text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-surface-container-lowest p-unit-md border border-outline-variant rounded-xl">
            <div className="flex justify-between items-start">
              <span className="font-label-md text-label-md text-outline uppercase tracking-wider">{s.label}</span>
              <div className={`p-2 rounded-lg ${s.color}`}><span className="material-symbols-outlined text-sm">{s.icon}</span></div>
            </div>
            <p className="font-headline-md text-headline-md font-bold mt-2">{s.value}</p>
            <p className="text-xs text-on-surface-variant mt-1">{s.trend}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
        <div className="p-unit-md border-b border-outline-variant flex flex-wrap items-center gap-unit-md">
          <div className="relative flex-1 min-w-[160px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-9 pl-9 pr-3 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none" placeholder="Search by order # or email..." />
          </div>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="h-9 px-3 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none">
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setPage(1); }} className="h-9 px-3 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none">
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button onClick={() => { setPage(1); setStatusFilter(""); setDateFilter(""); setSearch(""); }} className="h-9 px-3 border border-outline-variant rounded-lg text-sm flex items-center gap-1 hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined text-sm">refresh</span>Refresh Data
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Items Count</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-on-surface-variant">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-on-surface-variant">No orders found</td></tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4 font-label-md text-label-md text-primary">#{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td className="px-6 py-4">
                    <p className="font-label-md text-label-md">{order.user?.name || "Guest"}</p>
                    <p className="text-xs text-on-surface-variant">{order.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{order.items.length} item(s)</td>
                  <td className="px-6 py-4 font-label-md text-label-md font-bold">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`px-2 py-1 rounded text-xs font-bold border-0 cursor-pointer appearance-none outline-none ${statusBadge[order.status] || "bg-surface-container text-on-surface-variant"}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setViewOrder(order)} className="p-1.5 hover:bg-surface-container-high rounded text-on-surface-variant" title="View Details"><span className="material-symbols-outlined text-sm">visibility</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="px-6 py-4 border-t border-outline-variant flex items-center justify-between text-sm text-on-surface-variant">
            <span>Showing 1 to {Math.min(20, orders.length)} of {total} entries</span>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:border-primary disabled:opacity-40"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
              {Array.from({ length: Math.min(pages, 5) }).map((_, i) => {
                const p = Math.max(1, Math.min(page - 2, pages - 4)) + i;
                if (p > pages) return null;
                return <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 flex items-center justify-center rounded text-sm ${p === page ? "bg-primary text-white" : "border border-outline-variant hover:border-primary"}`}>{p}</button>;
              })}
              <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:border-primary disabled:opacity-40"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-unit-md bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex items-start gap-3">
        <span className="material-symbols-outlined text-primary text-sm mt-0.5">info</span>
        <div>
          <p className="font-label-md text-label-md text-on-surface">Pro-tip for Stewardship</p>
          <p className="text-sm text-on-surface-variant mt-1">Orders with a &apos;Processing&apos; status for more than 24 hours are highlighted in red for immediate attention from the logistics team.</p>
        </div>
      </div>

      <div className="mt-unit-md bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-label-md text-label-md text-on-surface">Order Trends</p>
            <p className="text-sm text-on-surface-variant mt-1">Revenue: {stats.revenueTrend >= 0 ? "+" : ""}{stats.revenueTrend}% compared to previous period</p>
          </div>
          <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">trending_up</span>
          </div>
        </div>
      </div>

      {viewOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-unit-md" onClick={() => setViewOrder(null)}>
          <div className="bg-surface rounded-xl max-w-2xl w-full p-unit-lg shadow-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-unit-md">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Order #{viewOrder.orderNumber}</h2>
              <button onClick={() => setViewOrder(null)} className="p-1 hover:bg-surface-container-high rounded"><span className="material-symbols-outlined">close</span></button>
            </div>

            <div className="grid grid-cols-2 gap-unit-md mb-unit-md">
              <div className="bg-surface-container-low p-unit-sm rounded-lg">
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Status</p>
                <select value={viewOrder.status} onChange={(e) => updateStatus(viewOrder.id, e.target.value)} className={`px-2 py-1 rounded text-xs font-bold border-0 cursor-pointer appearance-none outline-none ${statusBadge[viewOrder.status] || "bg-surface-container text-on-surface-variant"}`}>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div className="bg-surface-container-low p-unit-sm rounded-lg">
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Payment</p>
                <p className="font-label-md text-label-md">{viewOrder.paymentStatus} {viewOrder.paymentMethod ? `(${viewOrder.paymentMethod})` : ""}</p>
              </div>
              <div className="bg-surface-container-low p-unit-sm rounded-lg">
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Date</p>
                <p className="font-label-md text-label-md">{new Date(viewOrder.createdAt).toLocaleString()}</p>
              </div>
              <div className="bg-surface-container-low p-unit-sm rounded-lg">
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Customer</p>
                <p className="font-label-md text-label-md">{viewOrder.user?.name || "Guest"}</p>
                <p className="text-xs text-on-surface-variant">{viewOrder.email}</p>
              </div>
            </div>

            {viewOrder.shippingAddress && (
              <div className="bg-surface-container-low p-unit-sm rounded-lg mb-unit-md">
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Shipping Address</p>
                <p className="text-sm">{viewOrder.shippingAddress.street}</p>
                <p className="text-sm">{viewOrder.shippingAddress.city}, {viewOrder.shippingAddress.state} {viewOrder.shippingAddress.zip || ""}</p>
                <p className="text-sm">{viewOrder.shippingAddress.country}</p>
              </div>
            )}

            <div className="border border-outline-variant rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
                  <tr><th className="px-4 py-3">Item</th><th className="px-4 py-3">Format</th><th className="px-4 py-3 text-right">Qty</th><th className="px-4 py-3 text-right">Price</th><th className="px-4 py-3 text-right">Total</th></tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {viewOrder.items.map((item, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 text-sm">{item.title}</td>
                      <td className="px-4 py-3 text-sm text-on-surface-variant">{item.format}</td>
                      <td className="px-4 py-3 text-sm text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-right">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-surface-container-low text-sm">
                  <tr><td colSpan={4} className="px-4 py-2 text-right text-on-surface-variant">Subtotal</td><td className="px-4 py-2 text-right font-medium">${viewOrder.subtotal.toFixed(2)}</td></tr>
                  {viewOrder.discount > 0 && <tr><td colSpan={4} className="px-4 py-2 text-right text-on-surface-variant">Discount</td><td className="px-4 py-2 text-right text-green-600">-${viewOrder.discount.toFixed(2)}</td></tr>}
                  <tr><td colSpan={4} className="px-4 py-2 text-right text-on-surface-variant">Shipping</td><td className="px-4 py-2 text-right font-medium">${viewOrder.shipping.toFixed(2)}</td></tr>
                  <tr className="font-bold"><td colSpan={4} className="px-4 py-2 text-right">Total</td><td className="px-4 py-2 text-right">${viewOrder.total.toFixed(2)}</td></tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-unit-md flex justify-end">
              <button onClick={() => setViewOrder(null)} className="px-unit-md py-unit-sm border border-outline-variant rounded-lg text-sm hover:bg-surface-container transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
