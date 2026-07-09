"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface WishlistBook {
  id: string; title: string; slug: string; author: string; price: number; imageUrl: string;
  category: { name: string; slug: string };
}

interface WishlistItem {
  id: string; bookId: string; book: WishlistBook; createdAt: string;
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/signin"); return; }
    if (status !== "authenticated") return;
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status, router]);

  async function removeFromWishlist(bookId: string) {
    await fetch(`/api/wishlist/${bookId}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.bookId !== bookId));
  }

  if (status === "loading" || loading) {
    return (
      <main className="flex-grow pt-32 pb-unit-xl max-w-6xl mx-auto px-6">
        <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-surface-container rounded" /><div className="h-64 bg-surface-container rounded-xl" /></div>
      </main>
    );
  }

  return (
    <main className="flex-grow pt-32 pb-unit-xl">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-gutter">
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md mb-unit-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold text-xl">{session?.user?.name?.charAt(0) || "U"}</div>
                <div>
                  <p className="font-label-md">{session?.user?.name}</p>
                  <p className="text-xs text-on-surface-variant">{session?.user?.email}</p>
                </div>
              </div>
            </div>
            <nav className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
              {[
                { href: "/account", label: "My Orders", icon: "receipt_long", active: false },
                { href: "/account/wishlist", label: "Wishlist", icon: "favorite", active: true },
                { href: "/account/profile", label: "My Profile", icon: "person", active: false },
                { href: "/account/addresses", label: "Saved Addresses", icon: "location_on", active: false },
              ].map((item) => (
                <Link key={item.label} href={item.href} className={`flex items-center gap-3 px-unit-md py-3 text-sm transition-colors ${item.active ? "bg-primary-container/10 text-primary font-bold" : "text-on-surface-variant hover:bg-surface-container"}`}>
                  <span className="material-symbols-outlined text-sm">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-unit-md py-3 text-sm text-secondary hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-sm">logout</span>
                Logout
              </button>
            </nav>
          </aside>

          <div className="flex-grow min-w-0">
            <h1 className="font-headline-xl text-2xl md:text-headline-xl text-on-surface mb-unit-lg">My Wishlist</h1>
            {items.length === 0 ? (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg text-center">
                <span className="material-symbols-outlined text-4xl text-outline opacity-30 mb-2">favorite</span>
                <p className="text-on-surface-variant mb-4">Your wishlist is empty</p>
                <Link href="/books" className="bg-primary text-white font-label-md py-3 px-unit-lg rounded-lg inline-block hover:bg-primary-fixed-dim transition-all">Browse Books</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {items.map((item) => (
                  <div key={item.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col group">
                    <Link href={`/books/${item.book.slug}`} className="aspect-[3/4] bg-surface-container overflow-hidden block">
                      {item.book.imageUrl ? (
                        <img src={item.book.imageUrl} alt={item.book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-outline opacity-30 text-6xl">book</span></div>
                      )}
                    </Link>
                    <div className="p-unit-md flex flex-col flex-grow">
                      <span className="text-label-sm text-secondary uppercase tracking-widest mb-unit-xs">{item.book.category.name}</span>
                      <Link href={`/books/${item.book.slug}`} className="font-headline-md text-headline-md text-primary line-clamp-2 mb-unit-sm hover:underline">{item.book.title}</Link>
                      <p className="font-label-md text-label-md text-on-surface-variant uppercase mb-unit-sm">{item.book.author}</p>
                      <div className="mt-auto flex items-center justify-between pt-unit-sm border-t border-outline-variant">
                        <span className="font-bold text-primary">₦{item.book.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <div className="flex gap-1">
                          <button onClick={() => removeFromWishlist(item.bookId)} className="p-2 text-secondary hover:bg-secondary/5 rounded-full transition-all">
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
