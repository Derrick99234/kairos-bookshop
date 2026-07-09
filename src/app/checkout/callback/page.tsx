"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function CallbackInner() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref") || "";
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!reference) { setStatus("error"); setMessage("No payment reference found."); return; }

    fetch("/api/checkout/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.verified) {
          setStatus("success");
          setMessage("Payment confirmed! Your order has been placed.");
        } else {
          setStatus("error");
          setMessage("Payment verification failed. Please contact support.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong while verifying your payment.");
      });
  }, [reference]);

  return (
    <main className="flex-grow pt-32 pb-unit-xl max-w-lg mx-auto px-6 text-center">
      {status === "verifying" && (
        <div>
          <span className="material-symbols-outlined text-6xl text-primary animate-spin mb-4">progress_activity</span>
          <h1 className="font-headline-xl text-headline-xl text-primary mb-2">Verifying Payment...</h1>
          <p className="text-on-surface-variant">Please wait while we confirm your payment.</p>
        </div>
      )}

      {status === "success" && (
        <div>
          <span className="material-symbols-outlined text-6xl text-green-500 mb-4">check_circle</span>
          <h1 className="font-headline-xl text-headline-xl text-primary mb-2">Payment Successful!</h1>
          <p className="text-on-surface-variant font-body-lg mb-6">{message}</p>
          <div className="flex flex-col gap-3 items-center">
            <Link href="/account/orders" className="bg-primary text-white font-label-md py-4 px-unit-lg rounded-lg inline-block hover:bg-primary-fixed-dim transition-all">View My Orders</Link>
            <Link href="/books" className="text-primary font-label-md hover:underline">Continue Shopping</Link>
          </div>
        </div>
      )}

      {status === "error" && (
        <div>
          <span className="material-symbols-outlined text-6xl text-secondary mb-4">error</span>
          <h1 className="font-headline-xl text-headline-xl text-primary mb-2">Payment Issue</h1>
          <p className="text-on-surface-variant font-body-lg mb-6">{message}</p>
          <div className="flex flex-col gap-3 items-center">
            <Link href="/account/orders" className="bg-primary text-white font-label-md py-4 px-unit-lg rounded-lg inline-block hover:bg-primary-fixed-dim transition-all">View My Orders</Link>
            <Link href="/contact" className="text-primary font-label-md hover:underline">Contact Support</Link>
          </div>
        </div>
      )}
    </main>
  );
}

export default function CheckoutCallbackPage() {
  return (
    <Suspense fallback={
      <main className="flex-grow pt-32 pb-unit-xl max-w-lg mx-auto px-6 text-center">
        <span className="material-symbols-outlined text-6xl text-primary animate-spin mb-4">progress_activity</span>
        <h1 className="font-headline-xl text-headline-xl text-primary mb-2">Verifying Payment...</h1>
      </main>
    }>
      <CallbackInner />
    </Suspense>
  );
}
