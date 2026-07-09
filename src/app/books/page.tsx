"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Book {
  id: string; title: string; slug: string; author: string; price: number;
  comparePrice: number; imageUrl: string; stock: number;
  category: { id: string; name: string; slug: string };
}

interface Category {
  id: string; name: string; slug: string;
}

function ShopAllBooks() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", "12");
    try {
      const res = await fetch(`/api/books?${params}`);
      const data = await res.json();
      setBooks(data.books || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [search, category, sort, page]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories).catch(() => {});
  }, []);

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v); else params.delete(k);
    });
    if (updates.category !== undefined || updates.search !== undefined || updates.sort !== undefined) params.set("page", "1");
    router.push(`/books?${params.toString()}`);
  }

  async function addToCart(e: React.MouseEvent, book: Book) {
    e.preventDefault();
    if (!session) { router.push("/signin"); return; }
    setAddingId(book.id);
    try {
      await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book.id, quantity: 1, format: "PAPERBACK" }),
      });
    } catch { /* ignore */ }
    setTimeout(() => setAddingId(null), 1500);
  }

  return (
    <main className="flex-grow pt-32 pb-unit-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-unit-lg">
          <div>
            <h1 className="font-headline-xl text-2xl md:text-headline-xl text-on-surface">Browse All Books</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">Showing {loading ? "..." : `${books.length > 0 ? (page - 1) * 12 + 1 : 0}–${Math.min(page * 12, total)} of ${total} results`}</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-gutter">
          <aside className="w-full md:w-1/4 flex flex-col gap-unit-lg">
            <div>
              <h3 className="font-headline-md text-label-md uppercase tracking-wider text-on-surface border-b border-outline-variant pb-unit-sm mb-unit-md">Filter by Category</h3>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input checked={category === ""} onChange={() => updateParams({ category: "" })} type="radio" name="category" className="w-4 h-4 rounded-full border-outline text-primary focus:ring-primary" />
                  <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary">All Categories</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                    <input checked={category === cat.id} onChange={() => updateParams({ category: cat.id })} type="radio" name="category" className="w-4 h-4 rounded-full border-outline text-primary focus:ring-primary" />
                    <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-headline-md text-label-md uppercase tracking-wider text-on-surface border-b border-outline-variant pb-unit-sm mb-unit-md">Sort By</h3>
              <select value={sort} onChange={(e) => updateParams({ sort: e.target.value })} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-body-md focus:border-primary outline-none">
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </aside>
          <div className="w-full md:w-3/4">
            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); updateParams({ search: fd.get("search") as string }); }} className="relative mb-unit-lg">
              <input name="search" defaultValue={search} className="w-full h-14 pl-12 pr-6 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-body-md outline-none" placeholder="Search by title or author..." />
              <button type="submit" className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary">search</button>
            </form>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {loading ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-surface-container-lowest rounded-lg p-4 animate-pulse">
                  <div className="aspect-[3/4] bg-surface-container rounded-sm mb-unit-md" />
                  <div className="h-4 bg-surface-container rounded w-3/4 mb-2" />
                  <div className="h-3 bg-surface-container rounded w-1/2 mb-2" />
                  <div className="h-4 bg-surface-container rounded w-1/4" />
                </div>
              )) : books.length === 0 ? (
                <div className="col-span-full text-center py-unit-lg text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                  <p>No books found. Try adjusting your search or filters.</p>
                </div>
              ) : books.map((book) => (
                <Link key={book.id} href={`/books/${book.slug}`} className="bg-surface-container-lowest rounded-lg p-4 flex flex-col group hover:shadow-lg transition-all border border-outline-variant/50">
                  <div className="relative aspect-[3/4] mb-unit-md overflow-hidden rounded-sm bg-surface-container">
                    {book.imageUrl ? (
                      <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-outline opacity-30 text-6xl">book</span></div>
                    )}
                    {book.comparePrice > book.price && (
                      <div className="absolute top-2 right-2 bg-secondary px-2 py-1 text-white text-[10px] font-bold rounded-sm uppercase">Sale</div>
                    )}
                  </div>
                  <h4 className="font-headline-md text-body-lg text-on-surface line-clamp-1">{book.title}</h4>
                  <p className="font-label-md text-label-md text-on-surface-variant uppercase mt-1">{book.author}</p>
                  <div className="mt-auto pt-unit-sm flex items-center justify-between">
                    <div className="flex flex-col">
                      {book.comparePrice > book.price && <span className="text-xs text-on-surface-variant line-through">₦{book.comparePrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>}
                      <span className="font-headline-md text-headline-md text-primary">₦{book.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <button onClick={(e) => addToCart(e, book)} className="bg-primary text-white p-2 rounded-lg hover:opacity-90 active:scale-95 transition-all">
                      <span className="material-symbols-outlined">{addingId === book.id ? "check" : "add_shopping_cart"}</span>
                    </button>
                  </div>
                </Link>
              ))}
            </div>
            {pages > 1 && (
              <div className="mt-unit-xl flex items-center justify-center gap-2">
                <button disabled={page <= 1} onClick={() => updateParams({ page: String(page - 1) })} className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:border-primary transition-all text-on-surface-variant hover:text-primary disabled:opacity-40">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                {Array.from({ length: Math.min(pages, 5) }).map((_, i) => {
                  const p = Math.max(1, Math.min(page - 2, pages - 4)) + i;
                  if (p > pages) return null;
                  return (
                    <button key={p} onClick={() => updateParams({ page: String(p) })} className={`w-10 h-10 flex items-center justify-center rounded-lg ${p === page ? "bg-primary text-white font-bold" : "border border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary"}`}>{p}</button>
                  );
                })}
                <button disabled={page >= pages} onClick={() => updateParams({ page: String(page + 1) })} className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:border-primary transition-all text-on-surface-variant hover:text-primary disabled:opacity-40">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <main className="flex-grow pt-32 pb-unit-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-surface-container rounded" />
            <div className="h-4 w-64 bg-surface-container rounded" />
            <div className="grid grid-cols-3 gap-4 mt-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-surface-container rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </main>
    }>
      <ShopAllBooks />
    </Suspense>
  );
}
