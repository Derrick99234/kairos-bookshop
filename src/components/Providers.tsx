"use client";

import { SessionProvider } from "next-auth/react";
import { CurrencyProvider } from "@/lib/useCurrency";
import { CartProvider } from "@/lib/useCartCount";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CurrencyProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </CurrencyProvider>
    </SessionProvider>
  );
}
