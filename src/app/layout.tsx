import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Kairos Bookshop | Find Your Next Transformation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="scroll-smooth" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script id="tailwind-config" dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              darkMode: "class",
              theme: {
                extend: {
                  colors: {
                    "on-tertiary-fixed-variant": "#474744",
                    "tertiary-container": "#52524f",
                    "secondary": "#b7141e",
                    "on-tertiary-container": "#c6c5c2",
                    "tertiary-fixed": "#e4e2de",
                    "inverse-on-surface": "#f3f0f5",
                    "secondary-fixed": "#ffdad6",
                    "on-primary": "#ffffff",
                    "outline": "#787585",
                    "surface-bright": "#fbf8fe",
                    "primary-container": "#493dbb",
                    "on-background": "#1b1b1f",
                    "on-surface": "#1b1b1f",
                    "on-tertiary": "#ffffff",
                    "tertiary-fixed-dim": "#c8c6c3",
                    "surface-tint": "#564bc9",
                    "primary": "#311fa4",
                    "on-surface-variant": "#474553",
                    "on-primary-fixed-variant": "#3e30b0",
                    "surface-dim": "#dcd9de",
                    "on-error-container": "#93000a",
                    "inverse-surface": "#303034",
                    "surface-container": "#f0edf2",
                    "surface-container-highest": "#e4e1e7",
                    "on-secondary-fixed": "#410003",
                    "surface": "#fbf8fe",
                    "on-primary-fixed": "#130067",
                    "on-primary-container": "#c3beff",
                    "primary-fixed": "#e3dfff",
                    "surface-container-low": "#f6f2f8",
                    "error": "#ba1a1a",
                    "background": "#fbf8fe",
                    "on-error": "#ffffff",
                    "primary-fixed-dim": "#c5c0ff",
                    "surface-variant": "#e4e1e7",
                    "inverse-primary": "#c5c0ff",
                    "on-tertiary-fixed": "#1b1c1a",
                    "on-secondary-container": "#fffbff",
                    "error-container": "#ffdad6",
                    "tertiary": "#3b3b39",
                    "secondary-fixed-dim": "#ffb3ad",
                    "outline-variant": "#c8c4d6",
                    "surface-container-lowest": "#ffffff",
                    "surface-container-high": "#eae7ed",
                    "on-secondary-fixed-variant": "#930011",
                    "secondary-container": "#db3233",
                    "on-secondary": "#ffffff"
                  },
                  borderRadius: {
                    DEFAULT: "0.125rem",
                    lg: "0.25rem",
                    xl: "0.5rem",
                    full: "0.75rem"
                  },
                  spacing: {
                    "container-max": "1280px",
                    gutter: "24px",
                    "unit-xl": "64px",
                    "margin-mobile": "20px",
                    "margin-desktop": "64px",
                    "unit-xs": "4px",
                    "unit-md": "16px",
                    "unit-sm": "8px",
                    "unit-lg": "32px"
                  },
                  fontFamily: {
                    "body-md": ["Inter"],
                    "body-lg": ["Inter"],
                    "headline-lg": ["Inter"],
                    "headline-xl": ["Inter"],
                    "label-md": ["Inter"],
                    "headline-lg-mobile": ["Inter"],
                    "label-sm": ["Inter"],
                    "headline-md": ["Inter"]
                  },
                  fontSize: {
                    "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
                    "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
                    "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "700" }],
                    "headline-xl": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
                    "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "600" }],
                    "headline-lg-mobile": ["28px", { lineHeight: "36px", letterSpacing: "-0.01em", fontWeight: "700" }],
                    "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }],
                    "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }]
                  }
                }
              }
            }
          `
        }} />
      </head>
      <body className="text-on-background antialiased flex flex-col min-h-screen">
        <Providers>
          <Header />
          {children}
        </Providers>
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
                <a className="font-body text-body-medium text-on-primary/80 hover:text-on-primary hover:underline transition-all cursor-pointer" href="/contact">Privacy Policy</a>
                <a className="font-body text-body-medium text-on-primary/80 hover:text-on-primary hover:underline transition-all cursor-pointer" href="/contact">Terms of Service</a>
                <a className="font-body text-body-medium text-on-primary/80 hover:text-on-primary hover:underline transition-all cursor-pointer" href="/contact">Shipping Info</a>
                <a className="font-body text-body-medium text-on-primary/80 hover:text-on-primary hover:underline transition-all cursor-pointer" href="/contact">Returns</a>
              </nav>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-display font-bold text-on-primary">Newsletter</h4>
              <p className="font-body text-body-medium text-on-primary/80">Stay updated with our newest arrivals and spiritual insights.</p>
              <div className="relative mt-2">
                <input className="w-full h-10 px-4 bg-white/10 text-on-primary placeholder-on-primary/50 rounded-lg border border-white/20 focus:border-white outline-none text-sm" placeholder="Your email..." type="email" />
                <button className="absolute right-1 top-1 h-8 w-8 bg-white text-primary rounded-md flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 py-6 border-t border-white/10 flex justify-center">
            <p className="font-body text-body-medium text-on-primary/60">&copy; 2024 Kairos Bookshop by Gospel Pillars. All rights reserved.</p>
          </div>
        </footer>
        </body>
    </html>
  );
}
