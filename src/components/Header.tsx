"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/books" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-surface dark:bg-surface-dim border-b border-outline-variant dark:border-outline sticky top-0 w-full z-50">
      <nav className="flex justify-between items-center px-margin-desktop max-w-container-max mx-auto h-unit-xl">
        <div className="flex items-center gap-unit-md">
          <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
          </div>
          <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed hidden sm:inline">Kairos Bookshop</span>
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
          </a>
          {session ? (
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
                <span className="material-symbols-outlined">account_circle</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-unit-xs bg-surface dark:bg-surface-dim border border-outline-variant rounded-modal shadow-sm p-unit-sm min-w-40 z-50">
                  <p className="font-label-md text-label-md text-on-surface px-unit-sm pb-unit-xs border-b border-outline-variant/50 mb-unit-xs truncate">{session.user?.name || session.user?.email}</p>
                  <a href="/account" className="block font-body-md text-body-md text-on-surface-variant hover:text-on-surface px-unit-sm py-unit-xs rounded-input hover:bg-surface-container transition-colors">My Account</a>
                  <a href="/account/orders" className="block font-body-md text-body-md text-on-surface-variant hover:text-on-surface px-unit-sm py-unit-xs rounded-input hover:bg-surface-container transition-colors">Orders</a>
                  <button onClick={() => signOut()} className="w-full text-left font-body-md text-body-md text-error hover:text-error px-unit-sm py-unit-xs rounded-input hover:bg-error-container/20 transition-colors">Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <a href="/signin" className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
              <span className="material-symbols-outlined">person</span>
            </a>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
            <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div className="md:hidden bg-surface dark:bg-surface-dim border-t border-outline-variant">
          <div className="flex flex-col px-margin-desktop py-unit-md gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`font-label-md text-label-md py-2 px-3 rounded-lg transition-colors ${
                    isActive
                      ? "text-primary bg-primary-container/10 font-bold"
                      : "text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

