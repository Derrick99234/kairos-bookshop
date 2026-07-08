import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Kairos Bookshop",
};

export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-on-surface-variant leading-relaxed">
        <p>Last updated: July 2026</p>
        <section>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">Information We Collect</h2>
          <p>When you create an account, place an order, or subscribe to our newsletter, we collect personal information such as your name, email address, phone number, and shipping address. We also collect payment information through our secure payment processor; we do not store credit card details on our servers.</p>
        </section>
        <section>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">How We Use Your Information</h2>
          <p>Your information is used to process orders, deliver books, send order confirmations, respond to inquiries, and occasionally send newsletters if you have opted in. We do not sell or share your personal data with third parties for their marketing purposes.</p>
        </section>
        <section>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal data. All payment transactions are encrypted via SSL and processed through PCI-compliant gateways.</p>
        </section>
        <section>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data at any time. You may unsubscribe from marketing emails using the link provided in each email or by contacting us directly.</p>
        </section>
        <section>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">Contact</h2>
          <p>For privacy-related inquiries, email us at info@kairosbookshop.org or call +234 8135672235.</p>
        </section>
      </div>
    </main>
  );
}
