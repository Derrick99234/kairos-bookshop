"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCurrency } from "@/lib/useCurrency";
import { useCartCount } from "@/lib/useCartCount";
import { formatPrice, toCurrencyPrice } from "@/lib/price";

interface Variant {
  id: string; format: string; price: number; priceUsd: number; stock: number;
  book: { id: string; title: string; slug: string; imageUrl: string; author: string };
}

interface CartItem {
  id: string; quantity: number;
  variant: Variant;
}

interface Cart { items: CartItem[] }

const FORMAT_LABELS: Record<string, string> = {
  HARDCOPY: "Hardcopy",
  SOFTCOPY: "Softcopy",
  AUDIO_BOOK: "Audio Book",
};

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const { currency, usdRate } = useCurrency();
  const { optimisticRemove } = useCartCount();

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/signin"); return; }
    if (status !== "authenticated") return;
    fetch("/api/cart")
      .then((r) => r.json())
      .then(setCart)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status, router]);

  async function updateQuantity(itemId: string, delta: number) {
    const item = cart?.items.find((i) => i.id === itemId);
    if (!item) return;
    const prevQty = item.quantity;
    const qty = Math.max(1, Math.min(item.variant.stock, item.quantity + delta));
    if (qty === prevQty) return;
    setCart((prev) => prev ? { ...prev, items: prev.items.map((i) => i.id === itemId ? { ...i, quantity: qty } : i) } : prev);
    try {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: qty }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setCart((prev) => prev ? { ...prev, items: prev.items.map((i) => i.id === itemId ? { ...i, quantity: prevQty } : i) } : prev);
    }
  }

  async function removeItem(itemId: string) {
    const removed = cart?.items.find((i) => i.id === itemId);
    if (!removed) return;
    setCart((prev) => prev ? { ...prev, items: prev.items.filter((i) => i.id !== itemId) } : prev);
    optimisticRemove(itemId, removed.quantity, () => {
      setCart((prev) => prev ? { ...prev, items: [...prev.items, removed] } : prev);
    });
  }

  if (status === "loading" || loading) {
    return (
      <main className="flex-grow pt-32 pb-unit-xl max-w-7xl mx-auto px-6">
        <div className="animate-pulse space-y-4"><div className="h-8 w-32 bg-surface-container rounded" /><div className="h-20 bg-surface-container rounded-xl" /><div className="h-20 bg-surface-container rounded-xl" /></div>
      </main>
    );
  }

  const hardSubtotal = cart?.items.filter((i) => i.variant.format === "HARDCOPY").reduce((sum, i) => sum + i.variant.price * i.quantity, 0) || 0;
  const softSubtotal = cart?.items.filter((i) => i.variant.format !== "HARDCOPY").reduce((sum, i) => sum + i.variant.price * i.quantity, 0) || 0;
  const subtotal = hardSubtotal + softSubtotal;
  const shipping = hardSubtotal >= 50000 ? 0 : 2000;
  const total = subtotal + shipping;

  return (
    <main className="flex-grow pt-32 pb-unit-xl">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-headline-xl text-2xl md:text-headline-xl text-on-surface mb-unit-lg">Shopping Cart</h1>

        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-unit-xl">
            <span className="material-symbols-outlined text-6xl text-outline opacity-30 mb-4">shopping_cart</span>
            <p className="text-on-surface-variant font-body-lg mb-4">Your cart is empty</p>
            <Link href="/books" className="bg-primary text-white font-label-md py-3 px-unit-lg rounded-lg inline-block hover:bg-primary-fixed-dim transition-all">Continue Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            <div className="lg:col-span-2 space-y-unit-md">
              {cart.items.map((item) => (
                <div key={item.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex items-center gap-unit-md">
                  <Link href={`/books/${item.variant.book.slug}`} className="w-20 h-28 bg-surface-container rounded-lg overflow-hidden shrink-0">
                    {item.variant.book.imageUrl ? <img src={item.variant.book.imageUrl} alt={item.variant.book.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-outline opacity-30">book</span></div>}
                  </Link>
                  <div className="flex-grow">
                    <Link href={`/books/${item.variant.book.slug}`} className="font-headline-md text-headline-md text-primary hover:underline">{item.variant.book.title}</Link>
                    <p className="text-label-sm text-on-surface-variant uppercase">{item.variant.book.author}</p>
                    <p className="text-label-sm text-on-surface-variant">Format: {FORMAT_LABELS[item.variant.format] || item.variant.format}</p>
                    <div className="flex items-center justify-between mt-unit-sm">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded-md text-sm hover:bg-surface-container">-</button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded-md text-sm hover:bg-surface-container">+</button>
                      </div>
                      <div className="flex items-center gap-unit-sm">
                        <span className="font-bold text-primary">{formatPrice(toCurrencyPrice(item.variant.price, item.variant.priceUsd || 0, currency, usdRate) * item.quantity, currency)}</span>
                        <button onClick={() => removeItem(item.id)} className="text-secondary hover:text-secondary-fixed-dim text-sm"><span className="material-symbols-outlined text-sm">delete</span></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md h-fit">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-unit-md">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-on-surface-variant">Subtotal (Hardcopy)</span><span>{formatPrice(toCurrencyPrice(hardSubtotal, 0, currency, usdRate), currency)}</span></div>
                {softSubtotal > 0 && <div className="flex justify-between"><span className="text-on-surface-variant">Subtotal (Softcopy)</span><span>{formatPrice(toCurrencyPrice(softSubtotal, 0, currency, usdRate), currency)}</span></div>}
                <div className="flex justify-between"><span className="text-on-surface-variant">Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(toCurrencyPrice(shipping, 0, currency, usdRate), currency)}</span></div>
                <div className="border-t border-outline-variant pt-3 flex justify-between font-bold text-lg"><span>Total</span><span>{formatPrice(toCurrencyPrice(total, 0, currency, usdRate), currency)}</span></div>
              </div>
              <button onClick={() => router.push("/checkout")} className="w-full bg-primary text-white font-label-md py-4 rounded-lg mt-unit-md hover:bg-primary-fixed-dim transition-all active:scale-95">Proceed to Checkout</button>
              <Link href="/books" className="w-full block text-center text-primary font-label-md py-3 mt-2 hover:underline">Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
