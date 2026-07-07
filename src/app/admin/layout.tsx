"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const adminLinks = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Orders", href: "/admin/orders", icon: "receipt_long" },
  { label: "Books", href: "/admin/books", icon: "menu_book" },
  { label: "Categories", href: "/admin/categories", icon: "category" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex-grow flex items-center justify-center bg-surface-container-low">
        <p className="font-body-md text-body-md text-on-surface-variant">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="flex-grow flex bg-surface-container-low">
      <aside className="w-64 bg-surface dark:bg-surface-dim border-r border-outline-variant/30 hidden md:flex flex-col p-unit-md">
        <div className="mb-unit-lg px-unit-sm">
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Admin Panel</p>
          <p className="font-body-md text-body-md text-on-surface truncate mt-unit-xs">{session.user?.name}</p>
        </div>
        <nav className="flex flex-col gap-unit-xs">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`flex items-center gap-unit-sm px-unit-sm py-unit-sm rounded-input transition-colors font-label-md text-label-md ${
                  isActive
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-lg">{link.icon}</span>
                {link.label}
              </a>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-unit-md md:p-unit-lg">{children}</main>
    </div>
  );
}
