"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Currency } from "./price";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggleCurrency: () => void;
  usdRate: number;
}

const DEFAULT_RATE = 1500;

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "NGN",
  setCurrency: () => {},
  toggleCurrency: () => {},
  usdRate: DEFAULT_RATE,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [usdRate, setUsdRate] = useState(DEFAULT_RATE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("kairos_currency") as Currency | null;
    if (stored === "NGN" || stored === "USD") setCurrency(stored);
    setMounted(true);

    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d?.pricing?.usdRate) {
          const rate = parseInt(d.pricing.usdRate);
          if (rate > 0) setUsdRate(rate);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("kairos_currency", currency);
  }, [currency, mounted]);

  function toggleCurrency() {
    setCurrency((c) => (c === "NGN" ? "USD" : "NGN"));
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, toggleCurrency, usdRate }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
