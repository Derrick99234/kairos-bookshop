"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface CartItem {
  id: string; quantity: number; format: string;
  book: { id: string; title: string; slug: string; price: number; imageUrl: string; stock: number; author: string };
}

interface Cart { items: CartItem[] }

export default function CheckoutPage() {
  const { status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/signin"); return; }
    if (status !== "authenticated") return;
    fetch("/api/cart").then((r) => r.json()).then(setCart).catch(() => {}).finally(() => setLoading(false));
  }, [status, router]);

  async function placeOrder() {
    if (!cart || cart.items.length === 0) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Failed to place order"); return; }
      setDone(true);
    } catch { setError("Something went wrong"); }
    finally { setSubmitting(false); }
  }

  if (status === "loading" || loading) {
    return (
      <main className="flex-grow pt-32 pb-unit-xl max-w-4xl mx-auto px-6">
        <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-surface-container rounded" /><div className="h-40 bg-surface-container rounded-xl" /></div>
      </main>
    );
  }

  const subtotal = cart?.items.reduce((s, i) => s + i.book.price * i.quantity, 0) || 0;
  const shipping = subtotal >= 50 ? 0 : 5;
  const total = subtotal + shipping;

  if (done) {
    return (
      <main className="flex-grow pt-32 pb-unit-xl max-w-4xl mx-auto px-6 text-center">
        <span className="material-symbols-outlined text-6xl text-green-500 mb-4">check_circle</span>
        <h1 className="font-headline-xl text-headline-xl text-primary mb-2">Order Placed!</h1>
        <p className="text-on-surface-variant font-body-lg mb-6">Your order has been submitted successfully. You will receive a confirmation email shortly.</p>
        <Link href="/account/orders" className="bg-primary text-white font-label-md py-4 px-unit-lg rounded-lg inline-block hover:bg-primary-fixed-dim transition-all">View My Orders</Link>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="flex-grow pt-32 pb-unit-xl max-w-4xl mx-auto px-6 text-center">
        <p className="text-on-surface-variant font-body-lg mb-4">Your cart is empty</p>
        <Link href="/books" className="bg-primary text-white font-label-md py-3 px-unit-lg rounded-lg inline-block">Shop Now</Link>
      </main>
    );
  }

  return (
    <main className="flex-grow pt-32 pb-unit-xl">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="font-headline-xl text-2xl md:text-headline-xl text-on-surface mb-unit-lg">Checkout</h1>

        <div className="space-y-unit-md">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-unit-md">Order Summary</h3>
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-label-md">{item.book.title}</p>
                    <p className="text-xs text-on-surface-variant">Qty: {item.quantity} x ${item.book.price.toFixed(2)}</p>
                  </div>
                  <span className="font-medium">${(item.book.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-outline-variant pt-3 space-y-1">
                <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between font-bold text-lg pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-unit-md rounded-lg text-sm">{error}</div>}

          <button onClick={placeOrder} disabled={submitting} className="w-full bg-primary text-white font-label-md py-4 rounded-xl hover:bg-primary-fixed-dim transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting ? (
              <><span className="material-symbols-outlined animate-spin">progress_activity</span> Processing...</>
            ) : (
              `Place Order — $${total.toFixed(2)}`
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
