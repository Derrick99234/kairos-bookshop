"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface CartContextType {
  cartCount: number;
  optimisticAdd: (variantId: string, quantity?: number) => void;
  optimisticRemove: (itemId: string, quantity: number, restore: () => void) => void;
}

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  optimisticAdd: () => {},
  optimisticRemove: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);

  const syncCart = useCallback(async () => {
    if (!session) { setCartCount(0); return; }
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCartCount(data?.items?.length || 0);
    } catch { /* ignore */ }
  }, [session]);

  useEffect(() => { syncCart(); }, [syncCart]);

  useEffect(() => {
    const onFocus = () => syncCart();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [syncCart]);

  function optimisticAdd(variantId: string, quantity = 1) {
    setCartCount((prev) => prev + quantity);

    fetch("/api/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId, quantity }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return syncCart();
      })
      .catch(() => {
        setCartCount((prev) => Math.max(0, prev - quantity));
      });
  }

  function optimisticRemove(itemId: string, quantity: number, restore: () => void) {
    setCartCount((prev) => Math.max(0, prev - quantity));

    fetch(`/api/cart/items/${itemId}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error();
        return syncCart();
      })
      .catch(() => {
        setCartCount((prev) => prev + quantity);
        restore();
      });
  }

  return (
    <CartContext.Provider value={{ cartCount, optimisticAdd, optimisticRemove }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartCount() {
  return useContext(CartContext);
}
