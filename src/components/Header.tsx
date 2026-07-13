"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Shop", href: "/books", icon: "menu_book" },
  { label: "Blog", href: "/blog", icon: "article" },
  { label: "About", href: "/about", icon: "info" },
  { label: "Contact", href: "/contact", icon: "mail" },
];

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!session) { setCartCount(0); return; }
    fetch("/api/cart")
      .then((r) => r.json())
      .then((data) => setCartCount(data?.items?.length || 0))
      .catch(() => {});
  }, [session]);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header className="bg-white sticky top-0 w-full z-50">
      <nav className="flex justify-between items-center px-margin-desktop max-w-container-max mx-auto h-unit-xl">
        <a href="/" className="flex items-center gap-unit-md">
          <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
          </div>
          <span className="font-headline-md text-headline-md font-bold text-primary hidden sm:inline">Kairos Bookshop</span>
        </a>
        <div className="hidden md:flex items-center gap-unit-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <a
                key={link.href}
                className={`font-label-md text-label-md transition-colors duration-200 ${
                  isActive
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-primary hover:text-primary-fixed-dim font-semibold"
                }`}
                href={link.href}
              >
                {link.label}
              </a>
            );
          })}
        </div>
        <div className="flex items-center gap-unit-md">
          <a href="/cart" className="hidden md:flex p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors relative">
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-secondary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
          </a>
          {session ? (
            <div className="relative hidden md:block">
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
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
            <a href="/signin" className="hidden md:flex p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <span className="material-symbols-outlined">person</span>
            </a>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[100] md:hidden transition-opacity duration-200 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/50 transition-opacity duration-200" onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-72 max-w-[85vw] bg-surface shadow-xl flex flex-col transition-transform duration-200 ease-out ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between px-6 h-16 border-b border-outline-variant">
            <span className="font-headline-md text-headline-md font-bold text-primary">Menu</span>
            <button onClick={() => setMobileOpen(false)} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 font-label-md text-label-md py-3 px-4 rounded-xl transition-colors ${
                      isActive
                        ? "text-primary bg-primary-container/10 font-bold"
                        : "text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    <span className="material-symbols-outlined">{link.icon}</span>
                    {link.label}
                  </a>
                );
              })}
            </div>
            <div className="mt-6 pt-6 border-t border-outline-variant space-y-2">
              <a href="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 font-label-md text-label-md py-3 px-4 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined">shopping_cart</span>
                Cart
                {cartCount > 0 && <span className="bg-secondary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ml-auto">{cartCount}</span>}
              </a>
              {session ? (
                <>
                  <a href="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 font-label-md text-label-md py-3 px-4 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined">account_circle</span>
                    My Account
                  </a>
                  <a href="/account/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 font-label-md text-label-md py-3 px-4 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined">receipt_long</span>
                    Orders
                  </a>
                  <button onClick={() => { setMobileOpen(false); signOut(); }} className="flex items-center gap-3 font-label-md text-label-md py-3 px-4 rounded-xl text-secondary hover:bg-red-50 w-full text-left transition-colors">
                    <span className="material-symbols-outlined">logout</span>
                    Sign Out
                  </button>
                </>
              ) : (
                <a href="/signin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 font-label-md text-label-md py-3 px-4 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined">person</span>
                  Sign In
                </a>
              )}
            </div>
          </div>
          {session && (
            <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-low">
              <p className="font-label-md text-label-md text-on-surface truncate">{session.user?.name || "User"}</p>
              <p className="text-xs text-on-surface-variant truncate">{session.user?.email}</p>
            </div>
          )}
        </div>
      </div>

    </header>
  );
}
