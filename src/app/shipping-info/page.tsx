import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Information | Kairos Bookshop",
};

export default function ShippingInfo() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-8">Shipping Information</h1>
      <div className="space-y-6 text-on-surface-variant leading-relaxed">
        <section>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">Delivery Areas</h2>
          <p>We currently ship to all 36 states in Nigeria, including the Federal Capital Territory. International shipping is available on select titles — please contact us for a quote.</p>
        </section>
        <section>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">Processing Time</h2>
          <p>Orders are processed within 1–3 business days after payment confirmation. You will receive a notification once your order has been shipped.</p>
        </section>
        <section>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">Shipping Rates &amp; Delivery Times</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Lagos Metro:</strong> 1–2 business days — ₦1,500</li>
            <li><strong>South-West Nigeria:</strong> 2–4 business days — ₦2,500</li>
            <li><strong>Other Nigerian States:</strong> 3–7 business days — ₦3,500</li>
            <li><strong>International:</strong> 7–21 business days — calculated at checkout</li>
          </ul>
        </section>
        <section>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">Order Tracking</h2>
          <p>A tracking number will be provided once your order is dispatched. You can track your order status from your account dashboard.</p>
        </section>
        <section>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">Delivery Issues</h2>
          <p>If your order has not arrived within the estimated timeframe, please contact our support team at info@kairosbookshop.org or call +234 8135672235.</p>
        </section>
      </div>
    </main>
  );
}
