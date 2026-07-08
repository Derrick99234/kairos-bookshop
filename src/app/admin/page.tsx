"use client";

import { useEffect, useState } from "react";

interface Order {
  id: string; orderNumber: string;
  user: { name: string; email: string } | null;
  email?: string;
  total: number; status: string; createdAt: string;
  items: { title: string; quantity: number }[];
}

interface CategoryPct {
  name: string; books: number; pct: number;
}

interface LowStockBook {
  title: string; stock: number; slug: string; imageUrl: string;
}

interface DashboardData {
  totalOrders: number;
  totalRevenue: number;
  totalBooks: number;
  totalUsers: number;
  revenueTrend: number;
  orderTrend: number;
  recentOrders: Order[];
  categories: CategoryPct[];
  lowStockBooks: LowStockBook[];
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

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-unit-xl text-on-surface-variant">Loading...</div>;
  }
  if (!data) {
    return <div className="flex items-center justify-center py-unit-xl text-error">Failed to load</div>;
  }

  const stats = [
    { label: "Total Revenue", value: `$${data.totalRevenue.toLocaleString()}`, icon: "payments", trend: `${data.revenueTrend >= 0 ? "+" : ""}${data.revenueTrend}% from last month`, up: data.revenueTrend >= 0, color: "bg-primary/5 text-primary" },
    { label: "Total Orders", value: data.totalOrders.toLocaleString(), icon: "shopping_bag", trend: `${data.orderTrend >= 0 ? "+" : ""}${data.orderTrend}% from last month`, up: data.orderTrend >= 0, color: "bg-primary/5 text-primary" },
    { label: "Books Sold", value: data.totalBooks.toLocaleString(), icon: "auto_stories", trend: `${data.lowStockBooks.length} low stock items`, up: data.lowStockBooks.length <= 3, color: "bg-primary/5 text-primary" },
    { label: "Active Customers", value: data.totalUsers.toLocaleString(), icon: "person_check", trend: `${data.recentOrders.filter((o) => o.user).length} recent buyers`, up: true, color: "bg-primary/5 text-primary" },
  ];

  return (
    <div>
      <div className="mb-unit-lg">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Opportune Insights</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Reviewing the digital stewardship for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-unit-lg">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface-container-lowest p-unit-md border border-outline-variant rounded-xl flex flex-col">
            <div className="flex justify-between items-start">
              <span className="font-label-md text-label-md text-outline uppercase tracking-wider">{s.label}</span>
              <div className={`p-2 rounded-lg ${s.color}`}>
                <span className="material-symbols-outlined">{s.icon}</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-headline-md text-headline-md font-bold">{s.value}</h3>
              <div className={`flex items-center mt-2 font-label-md text-label-md ${s.up ? "text-green-600" : "text-red-600"}`}>
                <span className="material-symbols-outlined text-sm mr-1">{s.up ? "trending_up" : "trending_down"}</span>
                <span>{s.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
          <div className="p-unit-md border-b border-outline-variant flex justify-between items-center">
            <h4 className="font-headline-md text-headline-md">Recent Orders</h4>
            <a href="/admin/orders" className="text-primary font-label-md text-label-md hover:underline">View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {data.recentOrders.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">No orders yet</td></tr>
                ) : data.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4 font-label-md text-label-md text-primary">#{order.orderNumber}</td>
                    <td className="px-6 py-4 font-body-md text-body-md">{order.user?.name || order.email || "Guest"}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{order.items.length}</td>
                    <td className="px-6 py-4 text-on-surface-variant text-sm">{new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                    <td className="px-6 py-4 font-label-md text-label-md font-bold">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded font-label-sm text-label-sm ${statusBadge[order.status] || "bg-surface-container text-on-surface-variant"}`}>{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-gutter">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md">
            <h4 className="font-headline-md text-headline-md mb-4">Categories</h4>
            {data.categories.length === 0 ? (
              <p className="text-sm text-on-surface-variant">No categories yet</p>
            ) : (
              <div className="space-y-4">
                {data.categories.map((cat) => (
                  <div key={cat.name}>
                    <div className="flex justify-between mb-1">
                      <span className="font-label-md text-label-md text-on-surface-variant">{cat.name}</span>
                      <span className="font-label-md text-label-md font-bold">{cat.pct}%</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${cat.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-secondary">warning</span>
              <h4 className="font-headline-md text-headline-md">Low Stock</h4>
            </div>
            {data.lowStockBooks.length === 0 ? (
              <p className="text-sm text-on-surface-variant">All books are well stocked</p>
            ) : (
              <div className="space-y-3">
                {data.lowStockBooks.slice(0, 5).map((item) => (
                  <div key={item.slug} className="p-3 bg-surface-container-low rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">{item.title}</p>
                    </div>
                    <span className={`text-sm font-bold ${item.stock === 0 ? "text-red-600" : "text-secondary"}`}>{item.stock} Left</span>
                  </div>
                ))}
                {data.lowStockBooks.length > 5 && (
                  <a href="/admin/books?filter=low" className="block w-full text-center text-primary font-label-md text-label-md py-2 hover:underline">View All</a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
