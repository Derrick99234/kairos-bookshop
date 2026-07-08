import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Refunds | Kairos Bookshop",
};

export default function Returns() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-8">Returns &amp; Refunds</h1>
      <div className="space-y-6 text-on-surface-variant leading-relaxed">
        <section>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">Return Policy</h2>
          <p>We want you to be completely satisfied with your purchase. If you are not satisfied, you may return eligible items within 14 days of delivery for a refund or exchange.</p>
        </section>
        <section>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">Condition Requirements</h2>
          <p>Books must be returned in their original condition — unmarked, undamaged, and with all accompanying materials. Items showing signs of wear or damage may be refused.</p>
        </section>
        <section>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">Non-Returnable Items</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Digital or downloadable products</li>
            <li>Damaged or used items beyond minor inspection</li>
            <li>Items returned after 14-day window</li>
          </ul>
        </section>
        <section>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">Refund Process</h2>
          <p>Once we receive and inspect your return, we will notify you of the approval or rejection. Approved refunds will be processed within 5–7 business days to your original payment method. Shipping costs are non-refundable.</p>
        </section>
        <section>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">How to Initiate a Return</h2>
          <p>Email us at info@kairosbookshop.org with your order number and reason for return. We will provide a return address and further instructions.</p>
        </section>
      </div>
    </main>
  );
}
