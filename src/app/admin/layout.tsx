"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Inventory", href: "/admin/books", icon: "menu_book" },
  { label: "Orders", href: "/admin/orders", icon: "shopping_cart" },
  { label: "Customers", href: "/admin/customers", icon: "group" },
  { label: "Categories", href: "/admin/categories", icon: "category" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;
    if (status === "unauthenticated") router.push("/admin/login");
    else if (status === "authenticated" && session?.user?.role !== "ADMIN") router.push("/");
  }, [status, session, router, isLoginPage]);

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/admin/books?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  }

  if (isLoginPage) return <>{children}</>;

  if (status === "loading") {
    return (
      <div className="flex-grow flex items-center justify-center bg-surface">
        <p className="font-body-md text-body-md text-on-surface-variant">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "ADMIN") return null;

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col py-unit-md border-r border-outline-variant bg-surface z-50">
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary">Kairos Admin</h1>
            <p className="text-[10px] uppercase tracking-widest text-outline">Stewardship Portal</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <a
                key={link.href}
                href={link.href}
                className={`flex items-center px-6 py-3 font-bold transition-colors ${
                  isActive
                    ? "text-primary border-r-4 border-primary bg-primary-container/10 opacity-90"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <span className="material-symbols-outlined mr-3">{link.icon}</span>
                <span className="font-label-md text-label-md">{link.label}</span>
              </a>
            );
          })}
        </nav>
        <div className="px-6 py-unit-md mt-auto border-t border-outline-variant/30">
          <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="w-full flex items-center gap-3 hover:bg-surface-container-high rounded-lg p-2 -mx-2 transition-colors text-left">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold shrink-0">
              {session.user?.name?.charAt(0) || "A"}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="font-label-md text-label-md truncate">{session.user?.name || "Admin"}</p>
              <p className="text-[10px] text-outline truncate">{session.user?.email || ""}</p>
            </div>
            <span className="material-symbols-outlined text-sm text-on-surface-variant">expand_more</span>
          </button>
          {showProfileMenu && (
            <div className="mt-2 bg-surface border border-outline-variant rounded-lg shadow-lg overflow-hidden" onMouseLeave={() => setShowProfileMenu(false)}>
              <button onClick={() => { setShowProfileMenu(false); router.push("/admin/settings"); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-high">
                <span className="material-symbols-outlined text-sm">person</span>My Profile
              </button>
              <button onClick={() => { setShowProfileMenu(false); signOut({ callbackUrl: "/admin/login" }); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-secondary hover:bg-red-50">
                <span className="material-symbols-outlined text-sm">logout</span>Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>
      <main className="ml-64 flex flex-col min-h-screen w-full">
        <header className="bg-surface h-16 border-b border-outline-variant flex justify-between items-center px-margin-desktop w-full sticky top-0 z-40">
          <div className="flex items-center gap-unit-md flex-1">
            <div className="relative max-w-md w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-2 font-body-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="Search books, orders, or customers... (Enter to search)"
              />
            </div>
          </div>
          <div className="flex items-center gap-unit-md text-on-surface-variant">
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="flex items-center gap-2 p-2 hover:bg-surface-container-low rounded-lg transition-colors text-sm"
              title="Sign Out"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label-md text-label-md hidden lg:block text-on-surface-variant">Sign Out</span>
            </button>
          </div>
        </header>
        <div className="flex-1 p-unit-lg max-w-screen-xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
