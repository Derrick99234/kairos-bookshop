"use client";

import { useEffect, useState } from "react";

interface DashboardData {
  totalOrders: number;
  totalRevenue: number;
  totalBooks: number;
  totalUsers: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    email: string;
    total: number;
    status: string;
    createdAt: string;
    items: { title: string; quantity: number }[];
  }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-unit-xl">
        <p className="font-body-md text-body-md text-on-surface-variant">Loading dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-unit-xl">
        <p className="font-body-md text-body-md text-error">Failed to load dashboard data</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-warning-container text-warning",
    CONFIRMED: "bg-info-container text-info",
    PROCESSING: "bg-primary-container text-primary",
    SHIPPED: "bg-tertiary-container text-tertiary",
    DELIVERED: "bg-success-container text-success",
    CANCELLED: "bg-error-container text-error",
  };

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-unit-lg">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-unit-md mb-unit-lg">
        <div className="bg-surface dark:bg-surface-dim rounded-modal p-unit-md border border-outline-variant/30">
          <p className="font-label-md text-label-md text-on-surface-variant">Total Orders</p>
          <p className="font-headline-xl text-headline-xl font-bold text-primary mt-unit-xs">{data.totalOrders}</p>
        </div>
        <div className="bg-surface dark:bg-surface-dim rounded-modal p-unit-md border border-outline-variant/30">
          <p className="font-label-md text-label-md text-on-surface-variant">Total Revenue</p>
          <p className="font-headline-xl text-headline-xl font-bold text-tertiary mt-unit-xs">₦{data.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-surface dark:bg-surface-dim rounded-modal p-unit-md border border-outline-variant/30">
          <p className="font-label-md text-label-md text-on-surface-variant">Total Books</p>
          <p className="font-headline-xl text-headline-xl font-bold text-secondary mt-unit-xs">{data.totalBooks}</p>
        </div>
        <div className="bg-surface dark:bg-surface-dim rounded-modal p-unit-md border border-outline-variant/30">
          <p className="font-label-md text-label-md text-on-surface-variant">Total Users</p>
          <p className="font-headline-xl text-headline-xl font-bold text-primary mt-unit-xs">{data.totalUsers}</p>
        </div>
      </div>

      <div className="bg-surface dark:bg-surface-dim rounded-modal border border-outline-variant/30">
        <div className="p-unit-md border-b border-outline-variant/30">
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/30">
                <th className="text-left font-label-md text-label-md text-on-surface-variant p-unit-sm">Order</th>
                <th className="text-left font-label-md text-label-md text-on-surface-variant p-unit-sm">Customer</th>
                <th className="text-left font-label-md text-label-md text-on-surface-variant p-unit-sm">Items</th>
                <th className="text-left font-label-md text-label-md text-on-surface-variant p-unit-sm">Total</th>
                <th className="text-left font-label-md text-label-md text-on-surface-variant p-unit-sm">Status</th>
                <th className="text-left font-label-md text-label-md text-on-surface-variant p-unit-sm">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                  <td className="p-unit-sm font-label-md text-label-md text-primary">{order.orderNumber}</td>
                  <td className="p-unit-sm font-body-md text-body-md text-on-surface">{order.email}</td>
                  <td className="p-unit-sm font-body-md text-body-md text-on-surface-variant">{order.items.length} item(s)</td>
                  <td className="p-unit-sm font-label-md text-label-md text-on-surface">₦{order.total.toLocaleString()}</td>
                  <td className="p-unit-sm">
                    <span className={`inline-block px-unit-sm py-unit-xs rounded-input font-label-sm text-label-sm ${statusColors[order.status] || "bg-surface-container text-on-surface-variant"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-unit-sm font-body-md text-body-md text-on-surface-variant">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {data.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-unit-md text-center font-body-md text-body-md text-on-surface-variant">No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
