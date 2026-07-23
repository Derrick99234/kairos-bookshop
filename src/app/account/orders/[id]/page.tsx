"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCurrency } from "@/lib/useCurrency";
import { formatPrice, toCurrencyPrice } from "@/lib/price";

interface OrderItem {
  id: string; title: string; price: number; quantity: number; format: string;
  fulfillmentStatus: string;
  book: { slug: string };
}

interface ShippingAddress {
  label: string; street: string; city: string; state: string; country: string;
}

interface Order {
  id: string; orderNumber: string; status: string; subtotal: number; shipping: number; total: number;
  paymentStatus: string; paymentReference: string; phone: string; createdAt: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress | null;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { status: authStatus } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const { currency, usdRate } = useCurrency();

  useEffect(() => {
    if (authStatus === "unauthenticated") { router.push("/signin"); return; }
    if (authStatus !== "authenticated") return;
    if (!params?.id) return;
    fetch(`/api/orders/${params.id}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then(setOrder)
      .catch(() => router.push("/account/orders"))
      .finally(() => setLoading(false));
  }, [params?.id, router, authStatus]);

  async function cancelOrder() {
    if (!order || !confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      if (!res.ok) return;
      setOrder({ ...order, status: "CANCELLED" });
    } finally { setCancelling(false); }
  }

  if (authStatus === "loading" || loading) {
    return (
      <main className="flex-grow pt-32 pb-unit-xl max-w-3xl mx-auto px-6">
        <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-surface-container rounded" /><div className="h-64 bg-surface-container rounded-xl" /></div>
      </main>
    );
  }

  if (!order) return null;

  return (
    <main className="flex-grow pt-32 pb-unit-xl">
      <div className="max-w-3xl mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-unit-lg">
          <Link href="/account" className="hover:text-primary">My Account</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link href="/account/orders" className="hover:text-primary">Orders</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-on-surface">#{order.orderNumber}</span>
        </nav>

        <div className="flex items-center justify-between mb-unit-lg">
          <div>
            <h1 className="font-headline-xl text-2xl md:text-headline-xl text-on-surface">Order #{order.orderNumber}</h1>
            <p className="text-sm text-on-surface-variant mt-1">Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded text-xs font-bold ${
              order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
              order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
              "bg-orange-100 text-orange-700"
            }`}>{order.status}</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden mb-unit-lg">
          <div className="px-unit-lg py-unit-md bg-surface-container-low border-b border-outline-variant">
            <h2 className="font-headline-md text-headline-md text-on-surface">Items</h2>
          </div>
          <div className="divide-y divide-outline-variant">
              {order.items.map((item) => (
                <div key={item.id} className="px-unit-lg py-unit-md flex items-center justify-between">
                  <div>
                    <p className="font-label-md">{item.title}</p>
                    <p className="text-xs text-on-surface-variant">Qty: {item.quantity} × {formatPrice(toCurrencyPrice(item.price, 0, currency, usdRate), currency)} — {item.format}</p>
                    <p className="text-xs mt-1">
                      {item.fulfillmentStatus === "DOWNLOADABLE" ? (
                        <span className="text-green-600 font-medium">Ready to read</span>
                      ) : item.fulfillmentStatus === "SHIPPING" ? (
                        <span className="text-blue-600 font-medium">Shipping in progress</span>
                      ) : (
                        <span className="text-on-surface-variant">{item.fulfillmentStatus}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatPrice(toCurrencyPrice(item.price * item.quantity, 0, currency, usdRate), currency)}</span>
                    {item.fulfillmentStatus === "DOWNLOADABLE" && (
                      <a href={`/api/download/${item.id}`} className="bg-primary text-white text-xs px-3 py-1.5 rounded-lg hover:bg-primary-fixed-dim transition-colors">Download</a>
                    )}
                  </div>
                </div>
              ))}
          </div>
          <div className="px-unit-lg py-unit-md border-t border-outline-variant space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-on-surface-variant">Subtotal</span><span>{formatPrice(toCurrencyPrice(order.subtotal, 0, currency, usdRate), currency)}</span></div>
            <div className="flex justify-between"><span className="text-on-surface-variant">Shipping</span><span>{formatPrice(toCurrencyPrice(order.shipping, 0, currency, usdRate), currency)}</span></div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-outline-variant"><span>Total</span><span>{formatPrice(toCurrencyPrice(order.total, 0, currency, usdRate), currency)}</span></div>
            <div className="flex justify-between text-xs pt-2"><span className="text-on-surface-variant">Payment</span><span className={order.paymentStatus === "PAID" ? "text-green-600" : "text-orange-600"}>{order.paymentStatus}</span></div>
          </div>
        </div>

        {order.shippingAddress && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg mb-unit-lg">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-unit-sm">Shipping Address</h2>
            <p className="text-sm text-on-surface-variant">{order.shippingAddress.street}</p>
            <p className="text-sm text-on-surface-variant">{order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country}</p>
          </div>
        )}

        <div className="flex items-center gap-unit-sm">
          <Link href="/account/orders" className="border border-outline-variant font-label-md py-3 px-unit-lg rounded-lg hover:bg-surface-container transition-all">&larr; Back to Orders</Link>
          {order.status === "PENDING" && (
            <button onClick={cancelOrder} disabled={cancelling} className="bg-secondary text-white font-label-md py-3 px-unit-lg rounded-lg hover:brightness-110 transition-all disabled:opacity-50">
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
