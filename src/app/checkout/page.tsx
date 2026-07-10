"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Variant {
  id: string; format: string; price: number; stock: number;
  book: { id: string; title: string; slug: string; imageUrl: string; author: string };
}

interface CartItem {
  id: string; quantity: number;
  variant: Variant;
}

interface Cart { items: CartItem[] }

export default function CheckoutPage() {
  const { status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/signin"); return; }
    if (status !== "authenticated") return;
    fetch("/api/cart").then((r) => r.json()).then(setCart).catch(() => {}).finally(() => setLoading(false));
  }, [status, router]);

  const subtotal = cart?.items.reduce((sum, i) => sum + i.variant.price * i.quantity, 0) || 0;
  const shipping = subtotal >= 50000 ? 0 : 2000;
  const total = subtotal + shipping;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cart || cart.items.length === 0) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipping: { street, city, state } }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); return; }
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch { setError("Failed to initiate checkout"); }
    finally { setSubmitting(false); }
  }

  if (status === "loading" || loading) return (
    <main className="flex-grow pt-32 pb-unit-xl max-w-4xl mx-auto px-6">
      <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-surface-container rounded" /><div className="h-64 bg-surface-container rounded-xl" /></div>
    </main>
  );

  return (
    <main className="flex-grow pt-32 pb-unit-xl">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="font-headline-xl text-2xl md:text-headline-xl text-on-surface mb-unit-lg">Checkout</h1>

        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-unit-xl">
            <span className="material-symbols-outlined text-6xl text-outline opacity-30 mb-4">shopping_cart</span>
            <p className="text-on-surface-variant font-body-lg mb-4">Your cart is empty</p>
            <Link href="/books" className="bg-primary text-white font-label-md py-3 px-unit-lg rounded-lg inline-block hover:bg-primary-fixed-dim transition-all">Continue Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-unit-md">Shipping Address</h2>
              <div className="space-y-unit-md">
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Street Address *</label>
                  <input value={street} onChange={(e) => setStreet(e.target.value)} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" required />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">City *</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" required />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">State *</label>
                  <input value={state} onChange={(e) => setState(e.target.value)} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" required />
                </div>
                {error && <div className="text-sm text-secondary bg-red-50 border border-red-200 px-unit-sm py-unit-xs rounded-lg">{error}</div>}
                <button type="submit" disabled={submitting} className="w-full bg-primary text-white font-label-md py-4 rounded-lg hover:bg-primary-fixed-dim transition-all active:scale-95 disabled:opacity-50">
                  {submitting ? "Redirecting to Paystack..." : `Pay ₦${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </button>
              </div>
            </form>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg h-fit">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-unit-md">Order Summary</h3>
              <div className="divide-y divide-outline-variant">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-unit-sm">
                    <div className="w-10 h-14 bg-surface-container rounded overflow-hidden shrink-0">
                      {item.variant.book.imageUrl ? <img src={item.variant.book.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-outline opacity-30 text-sm">book</span></div>}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-medium truncate">{item.variant.book.title}</p>
                      <p className="text-xs text-on-surface-variant">{item.variant.format} × {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">₦{(item.variant.price * item.quantity).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm mt-unit-md pt-unit-md border-t border-outline-variant">
                <div className="flex justify-between"><span className="text-on-surface-variant">Subtotal</span><span>₦{subtotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Shipping</span><span>{shipping === 0 ? "Free" : `₦${shipping.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span></div>
                <div className="border-t border-outline-variant pt-2 flex justify-between font-bold text-lg"><span>Total</span><span>₦{total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
