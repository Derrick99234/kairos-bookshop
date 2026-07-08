"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  id: string; orderNumber: string; status: string; total: number; createdAt: string;
  items: { title: string; quantity: number; price: number }[];
}

export default function AccountOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/signin"); return; }
    if (status !== "authenticated") return;
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => setOrders(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <main className="flex-grow pt-32 pb-unit-xl max-w-6xl mx-auto px-6">
        <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-surface-container rounded" /><div className="h-64 bg-surface-container rounded-xl" /></div>
      </main>
    );
  }

  return (
    <main className="flex-grow pt-32 pb-unit-xl">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-gutter">
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md mb-unit-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold text-xl">{session?.user?.name?.charAt(0) || "U"}</div>
                <div>
                  <p className="font-label-md">{session?.user?.name}</p>
                  <p className="text-xs text-on-surface-variant">{session?.user?.email}</p>
                </div>
              </div>
            </div>
            <nav className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
              {[
                { href: "/account", label: "My Orders", icon: "receipt_long", active: true },
                { href: "/account", label: "My Profile", icon: "person", active: false },
                { href: "/account", label: "Saved Addresses", icon: "location_on", active: false },
              ].map((item) => (
                <Link key={item.label} href={item.href} className={`flex items-center gap-3 px-unit-md py-3 text-sm transition-colors ${item.active ? "bg-primary-container/10 text-primary font-bold" : "text-on-surface-variant hover:bg-surface-container"}`}>
                  <span className="material-symbols-outlined text-sm">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-unit-md py-3 text-sm text-secondary hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-sm">logout</span>
                Logout
              </button>
            </nav>
          </aside>

          <div className="flex-grow min-w-0">
            <h1 className="font-headline-xl text-2xl md:text-headline-xl text-on-surface mb-unit-lg">My Orders</h1>
            {orders.length === 0 ? (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg text-center">
                <span className="material-symbols-outlined text-4xl text-outline opacity-30 mb-2">receipt_long</span>
                <p className="text-on-surface-variant mb-4">No orders yet</p>
                <Link href="/books" className="bg-primary text-white font-label-md py-3 px-unit-lg rounded-lg inline-block hover:bg-primary-fixed-dim transition-all">Start Shopping</Link>
              </div>
            ) : (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-surface-container-low border-b border-outline-variant">
                      <tr>
                        <th className="px-4 py-3 text-xs text-on-surface-variant uppercase">Order</th>
                        <th className="px-4 py-3 text-xs text-on-surface-variant uppercase">Items</th>
                        <th className="px-4 py-3 text-xs text-on-surface-variant uppercase">Total</th>
                        <th className="px-4 py-3 text-xs text-on-surface-variant uppercase">Status</th>
                        <th className="px-4 py-3 text-xs text-on-surface-variant uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="px-4 py-3 font-label-md text-label-md text-primary">#{order.orderNumber}</td>
                          <td className="px-4 py-3 text-sm text-on-surface-variant max-w-xs truncate">{order.items.map((i) => i.title).join(", ")}</td>
                          <td className="px-4 py-3 font-medium">${order.total.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                              order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                              order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                              "bg-orange-100 text-orange-700"
                            }`}>{order.status}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-on-surface-variant">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
