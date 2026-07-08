"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import NewsletterForm from "./NewsletterForm";

export default function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Header />}
      {children}
      {!isAdmin && (
        <footer className="bg-primary-container text-on-primary w-full mt-auto">
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <img alt="Kairos Bookshop Logo" className="h-8 w-8 object-contain brightness-0 invert" src="https://lh3.googleusercontent.com/aida/AP1WRLssB72y_9TyQKRY0cJqNLYUpwfxcngfFJ1MIQHVkqvUrXVeLY2QX6DrPkxXoN4tq_wkO7HsGY1bm0KFm-NHislOYg_V2IxMB_kVA-5IUI322A8dEQy11gapZReo6UMmSnCc5LvGPzWaORmWfX8ug2e67wpNS8-R9CBqsayE66AolDax4iXUXgwFTvXfDEC_Ya4Qasn72DZag8B185lQs-d8Pec1J9t7MsbOGQlpOa63CdSG701LcXbkHjaY" />
                <span className="font-display font-bold text-lg text-on-primary">Kairos Bookshop</span>
              </div>
              <p className="font-body text-body-medium text-on-primary/80">A publishing arm of Gospel Pillars International, dedicated to spreading kingdom knowledge globally.</p>
              <div className="flex gap-4 mt-2">
                <a className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-on-primary hover:bg-white/20 transition-all cursor-pointer" href="https://kairosbookshop.org" target="_blank" rel="noopener noreferrer">
                  <span className="material-symbols-outlined text-sm">public</span>
                </a>
                <a className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-on-primary hover:bg-white/20 transition-all cursor-pointer" href="mailto:info@kairosbookshop.org">
                  <span className="material-symbols-outlined text-sm">alternate_email</span>
                </a>
                <a className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-on-primary hover:bg-white/20 transition-all cursor-pointer" href="tel:+2348135672235">
                  <span className="material-symbols-outlined text-sm">call</span>
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-display font-bold text-on-primary">Visit Us</h4>
              <div className="font-body text-body-medium text-on-primary/80 space-y-2">
                <p className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-sm mt-1">location_on</span>
                  11 Kudirat Abiola Way, Ikeja, Lagos
                </p>
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">call</span>
                  +234 8135672235
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-display font-bold text-on-primary">Help &amp; Support</h4>
              <nav className="flex flex-col gap-2">
                <a className="font-body text-body-medium text-on-primary/80 hover:text-on-primary hover:underline transition-all cursor-pointer" href="/privacy-policy">Privacy Policy</a>
                <a className="font-body text-body-medium text-on-primary/80 hover:text-on-primary hover:underline transition-all cursor-pointer" href="/terms-of-service">Terms of Service</a>
                <a className="font-body text-body-medium text-on-primary/80 hover:text-on-primary hover:underline transition-all cursor-pointer" href="/shipping-info">Shipping Info</a>
                <a className="font-body text-body-medium text-on-primary/80 hover:text-on-primary hover:underline transition-all cursor-pointer" href="/returns">Returns</a>
              </nav>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-display font-bold text-on-primary">Newsletter</h4>
              <p className="font-body text-body-medium text-on-primary/80">Stay updated with our newest arrivals and spiritual insights.</p>
              <div className="mt-2">
                <NewsletterForm dark />
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 py-6 border-t border-white/10 flex justify-center">
            <p className="font-body text-body-medium text-on-primary/60">&copy; 2024 Kairos Bookshop by Gospel Pillars. All rights reserved.</p>
          </div>
        </footer>
      )}
    </>
  );
}
