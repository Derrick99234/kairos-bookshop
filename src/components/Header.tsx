"use client";

import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/books" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-surface dark:bg-surface-dim border-b border-outline-variant dark:border-outline sticky top-0 w-full z-50">
      <nav className="flex justify-between items-center px-margin-desktop max-w-container-max mx-auto h-unit-xl">
        <div className="flex items-center gap-unit-md">
          <img alt="Kairos Bookshop Logo" className="h-10 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AP1WRLssB72y_9TyQKRY0cJqNLYUpwfxcngfFJ1MIQHVkqvUrXVeLY2QX6DrPkxXoN4tq_wkO7HsGY1bm0KFm-NHislOYg_V2IxMB_kVA-5IUI322A8dEQy11gapZReo6UMmSnCc5LvGPzWaORmWfX8ug2e67wpNS8-R9CBqsayE66AolDax4iXUXgwFTvXfDEC_Ya4Qasn72DZag8B185lQs-d8Pec1J9t7MsbOGQlpOa63CdSG701LcXbkHjaY" />
          <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">Kairos Bookshop</span>
        </div>
        <div className="hidden md:flex items-center gap-unit-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <a
                key={link.href}
                className={`font-label-md text-label-md transition-colors duration-200 ${
                  isActive
                    ? "text-primary dark:text-primary-fixed border-b-2 border-primary dark:border-primary-fixed pb-1"
                    : "text-on-surface-variant dark:text-on-tertiary-container hover:text-primary dark:hover:text-primary-fixed"
                }`}
                href={link.href}
              >
                {link.label}
              </a>
            );
          })}
        </div>
        <div className="flex items-center gap-unit-md">
          <a href="/cart" className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors relative">
            <span className="material-symbols-outlined">shopping_cart</span>
            <span className="absolute -top-0.5 -right-0.5 bg-secondary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">2</span>
          </a>
          <a href="/signin" className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
            <span className="material-symbols-outlined">person</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
