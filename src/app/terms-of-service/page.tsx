import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Kairos Bookshop",
};

export default function TermsOfService() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-8">Terms of Service</h1>
      <div className="space-y-6 text-on-surface-variant leading-relaxed">
        <p>Last updated: July 2026</p>
        <section>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">Use of Our Site</h2>
          <p>By accessing Kairos Bookshop, you agree to use the site for lawful purposes only. You may not use the site to distribute harmful content, infringe on intellectual property, or engage in fraudulent activities.</p>
        </section>
        <section>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">Account Responsibility</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. Please notify us immediately of any unauthorized use.</p>
        </section>
        <section>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">Pricing &amp; Availability</h2>
          <p>All prices are listed in the currency selected at checkout and are subject to change without notice. We reserve the right to cancel orders affected by pricing errors or stock unavailability.</p>
        </section>
        <section>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">Intellectual Property</h2>
          <p>All content on this site, including book titles, descriptions, images, and logos, is the property of Kairos Bookshop and Gospel Pillars International. Unauthorized reproduction or distribution is prohibited.</p>
        </section>
        <section>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">Limitation of Liability</h2>
          <p>Kairos Bookshop shall not be liable for any indirect, incidental, or consequential damages arising from the use of our site or products.</p>
        </section>
      </div>
    </main>
  );
}
