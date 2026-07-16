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
                <div className="w-8 h-8 bg-on-primary/20 rounded flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
                </div>
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
                  180 Freedom Way, After Renee Supermarket, Off Admiralty Way, Lekki Phase 1, Lekki
                </p>
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">call</span>
                  +234 8135672235
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-display font-bold text-on-primary">Quick Links</h4>
              <nav className="flex flex-col gap-2">
                <a className="font-body text-body-medium text-on-primary/80 hover:text-on-primary hover:underline transition-all cursor-pointer" href="/books">Shop Books</a>
                <a className="font-body text-body-medium text-on-primary/80 hover:text-on-primary hover:underline transition-all cursor-pointer" href="/blog">Blog</a>
                <a className="font-body text-body-medium text-on-primary/80 hover:text-on-primary hover:underline transition-all cursor-pointer" href="/about">About Us</a>
                <a className="font-body text-body-medium text-on-primary/80 hover:text-on-primary hover:underline transition-all cursor-pointer" href="/contact">Contact</a>
              </nav>
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
            <p className="font-body text-body-medium text-on-primary/60">&copy; {new Date().getFullYear()} Kairos Bookshop by Gospel Pillars. All rights reserved.</p>
          </div>
        </footer>
      )}
    </>
  );
}
