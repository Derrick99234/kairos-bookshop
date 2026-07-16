export type Currency = "NGN" | "USD";

const DEFAULT_RATE = 1500;

export function getUsdRate(rate?: string | number): number {
  const parsed = typeof rate === "string" ? parseInt(rate) : rate;
  return parsed && parsed > 0 ? parsed : DEFAULT_RATE;
}

export function ngnToUsd(ngn: number, rate: number): number {
  return ngn / rate;
}

export function calcUsdPrice(
  ngnPrice: number,
  manualUsd: number,
  rate: number
): number {
  if (manualUsd > 0) return manualUsd;
  return ngnToUsd(ngnPrice, rate);
}

export function toCurrencyPrice(
  ngnPrice: number,
  manualUsd: number,
  currency: Currency,
  rate: number
): number {
  if (currency === "NGN") return ngnPrice;
  return calcUsdPrice(ngnPrice, manualUsd, rate);
}

export function toCurrencyCompare(
  ngnCompare: number,
  manualUsd: number,
  currency: Currency,
  rate: number
): number {
  if (currency === "NGN" || !ngnCompare) return ngnCompare;
  return calcUsdCompare(ngnCompare, manualUsd, rate);
}

export function calcUsdCompare(
  ngnCompare: number,
  manualUsd: number,
  rate: number
): number {
  if (!ngnCompare) return 0;
  if (manualUsd > 0) return manualUsd;
  return ngnToUsd(ngnCompare, rate);
}

export function formatPrice(
  amount: number,
  currency: Currency,
): string {
  if (currency === "USD") {
    return `$${amount.toFixed(2)}`;
  }
  return `₦${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatRange(
  min: number,
  max: number,
  currency: Currency,
): string {
  if (min === max) return formatPrice(min, currency);
  return `${formatPrice(min, currency)} – ${formatPrice(max, currency)}`;
}
