"use client";

import { useEffect, useState, useCallback } from "react";

const FORMATS = ["HARDCOPY", "SOFTCOPY", "AUDIO_BOOK"];

interface Category { id: string; name: string; slug: string; }
interface Variant {
  id?: string; format: string; price: number; comparePrice: number; stock: number; sku: string;
}
interface Book {
  id: string; title: string; slug: string; author: string; description: string;
  pages: number; isbn: string;
  imageUrl: string; images: string; featured: boolean; published: boolean;
  category: { id: string; name: string } | null;
  variants: Variant[];
}

interface BooksStats {
  totalSku: number; outOfStock: number; lowStock: number; totalValue: number;
}

const FORMAT_LABELS: Record<string, string> = {
  HARDCOPY: "Hardcopy",
  SOFTCOPY: "Softcopy",
  AUDIO_BOOK: "Audio Book",
};

export default function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<BooksStats>({ totalSku: 0, outOfStock: 0, lowStock: 0, totalValue: 0 });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "", slug: "", author: "", description: "", isbn: "", pages: 0,
    categoryId: "", imageUrl: "", images: "[]", featured: false, published: true,
  });

  const [variants, setVariants] = useState<Variant[]>([
    { format: "HARDCOPY", price: 0, comparePrice: 0, stock: 0, sku: "" },
  ]);

  useEffect(() => { fetch("/api/categories").then((r) => r.json()).then(setCategories).catch(() => {}); }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get("filter");
    if (filter === "low") setStatusFilter("low");
  }, []);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  function loadBooks() {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (catFilter) params.set("category", catFilter);
    if (statusFilter) params.set("status", statusFilter);
    fetch(`/api/admin/books?${params}`)
      .then((r) => r.json())
      .then((d) => { setBooks(d.books); setPages(d.pages); setTotal(d.total); if (d.stats) setStats(d.stats); })
      .catch(() => showToast("Failed to load books", "error"))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadBooks(); }, [page, catFilter, statusFilter]);
  useEffect(() => {
    const t = setTimeout(() => { if (page === 1) loadBooks(); else setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  function openCreate() {
    setEditing(null);
    setForm({ title: "", slug: "", author: "", description: "", isbn: "", pages: 0, categoryId: "", imageUrl: "", images: "[]", featured: false, published: true });
    setVariants([{ format: "HARDCOPY", price: 0, comparePrice: 0, stock: 0, sku: "" }]);
    setShowForm(true);
  }

  function openEdit(book: Book) {
    setEditing(book);
    setForm({
      title: book.title, slug: book.slug, author: book.author, description: book.description,
      isbn: book.isbn || "", pages: book.pages || 0,
      categoryId: book.category?.id || "", imageUrl: book.imageUrl,
      images: book.images || "[]", featured: book.featured, published: book.published,
    });
    setVariants(book.variants.length > 0 ? book.variants.map((v) => ({ ...v })) : [{ format: "HARDCOPY", price: 0, comparePrice: 0, stock: 0, sku: "" }]);
    setShowForm(true);
  }

  function addVariant() {
    const used = new Set(variants.map((v) => v.format));
    const next = FORMATS.find((f) => !used.has(f));
    if (!next) { showToast("All formats already added", "error"); return; }
    setVariants([...variants, { format: next, price: 0, comparePrice: 0, stock: 0, sku: "" }]);
  }

  function removeVariant(idx: number) {
    if (variants.length <= 1) { showToast("At least one variant required", "error"); return; }
    setVariants(variants.filter((_, i) => i !== idx));
  }

  function updateVariant(idx: number, field: keyof Variant, value: string | number) {
    const updated = variants.map((v, i) => i === idx ? { ...v, [field]: value } : v);
    setVariants(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = editing ? `/api/admin/books/${editing.slug}` : "/api/admin/books";
    const method = editing ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, variants }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Request failed"); }
      setShowForm(false);
      showToast(editing ? "Book updated successfully" : "Book created successfully", "success");
      loadBooks();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Something went wrong", "error");
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm("Delete this book?")) return;
    try {
      const res = await fetch(`/api/admin/books/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Book deleted", "success");
      loadBooks();
    } catch { showToast("Failed to delete book", "error"); }
  }

  function getBookPriceRange(book: Book): string {
    const prices = book.variants.map((v) => v.price).filter((p) => p > 0);
    if (prices.length === 0) return "—";
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `₦${min.toLocaleString()}` : `₦${min.toLocaleString()} – ₦${max.toLocaleString()}`;
  }

  function getTotalStock(book: Book): number {
    return book.variants.reduce((s, v) => s + v.stock, 0);
  }

  function getStockStatus(book: Book): { label: string; color: string } {
    const total = getTotalStock(book);
    if (total === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700" };
    if (total <= 5) return { label: "Low Stock", color: "bg-orange-100 text-orange-700" };
    return { label: "Active", color: "bg-green-100 text-green-700" };
  }

  return (
    <div>
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all animate-in ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.message}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-unit-md mb-unit-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Books</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage your spiritual library and inventory records.</p>
        </div>
        <button onClick={openCreate} className="bg-[#E03636] hover:bg-[#c02e2e] text-white px-unit-lg py-unit-sm rounded-xl font-label-md text-label-md flex items-center gap-2 shadow-lg transition-all active:scale-95">
          <span className="material-symbols-outlined">add</span>
          Add New Book
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-unit-lg">
        {[
          { label: "Total SKU", value: stats.totalSku, icon: "inventory_2", color: "bg-primary/5 text-primary" },
          { label: "Out of Stock", value: stats.outOfStock, icon: "block", color: "bg-red-50 text-red-600" },
          { label: "Low Stock", value: stats.lowStock, icon: "warning", color: "bg-orange-50 text-orange-600" },
          { label: "Total Value", value: `₦${stats.totalValue.toLocaleString()}`, icon: "payments", color: "bg-green-50 text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-surface-container-lowest p-unit-md border border-outline-variant rounded-xl">
            <div className="flex justify-between items-start">
              <span className="font-label-md text-label-md text-outline uppercase tracking-wider">{s.label}</span>
              <div className={`p-2 rounded-lg ${s.color}`}><span className="material-symbols-outlined text-sm">{s.icon}</span></div>
            </div>
            <p className="font-headline-md text-headline-md font-bold mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
        <div className="p-unit-md border-b border-outline-variant flex flex-wrap items-center gap-unit-md">
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-9 pl-9 pr-3 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Search books..." />
          </div>
          <select value={catFilter} onChange={(e) => { setCatFilter(e.target.value); setPage(1); }} className="h-9 px-3 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none">
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="h-9 px-3 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Book Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Formats</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-on-surface-variant">Loading...</td></tr>
              ) : books.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-on-surface-variant">No books found</td></tr>
              ) : books.map((book) => {
                const stockStatus = getStockStatus(book);
                return (
                  <tr key={book.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {book.imageUrl && (
                          <img src={book.imageUrl} alt="" className="w-10 h-14 rounded object-cover bg-surface-container-high" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        )}
                        <div>
                          <p className="font-label-md text-label-md text-on-surface">{book.title}</p>
                          <p className="text-xs text-on-surface-variant">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{book.category?.name || "—"}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {book.variants.map((v) => (
                          <span key={v.format} className="px-1.5 py-0.5 bg-surface-container-high rounded text-[10px] font-medium text-on-surface-variant">
                            {FORMAT_LABELS[v.format] || v.format}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-label-md text-label-md">{getBookPriceRange(book)}</td>
                    <td className="px-6 py-4 text-sm">{getTotalStock(book)} units</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${stockStatus.color}`}>{stockStatus.label}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(book)} className="p-1.5 hover:bg-surface-container-high rounded text-on-surface-variant" title="Edit"><span className="material-symbols-outlined text-sm">edit</span></button>
                        <button onClick={() => handleDelete(book.slug)} className="p-1.5 hover:bg-red-50 rounded text-secondary" title="Delete"><span className="material-symbols-outlined text-sm">delete</span></button>
                        <div className="relative">
                          <button onClick={() => setOpenMenu(openMenu === book.id ? null : book.id)} className="p-1.5 hover:bg-surface-container-high rounded text-on-surface-variant" title="More"><span className="material-symbols-outlined text-sm">more_vert</span></button>
                          {openMenu === book.id && (
                            <div className="absolute right-0 top-full mt-1 bg-surface border border-outline-variant rounded-lg shadow-lg z-50 min-w-[160px] py-1" onClick={() => setOpenMenu(null)} onMouseLeave={() => setOpenMenu(null)}>
                              <a href={`/books/${book.slug}`} target="_blank" className="flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-high"><span className="material-symbols-outlined text-sm">visibility</span>View on Site</a>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="px-6 py-4 border-t border-outline-variant flex items-center justify-between text-sm text-on-surface-variant">
            <span>Showing 1 to {Math.min(20, books.length)} of {total} books</span>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:border-primary disabled:opacity-40"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
              <span className="font-medium">{page}</span>
              <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:border-primary disabled:opacity-40"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-[5vh] pb-unit-md overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="bg-surface rounded-xl max-w-2xl w-full p-unit-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-unit-md">{editing ? "Edit Book" : "Add New Book"}</h2>
            <form onSubmit={handleSubmit} className="space-y-unit-md">
              <div className="grid grid-cols-2 gap-unit-md">
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Title *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, ...(editing ? {} : { slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }) })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" required />
                </div>
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Slug</label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm font-mono text-xs" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Author</label>
                  <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Category</label>
                  <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm">
                    <option value="">Select</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Pages</label>
                  <input type="number" value={form.pages} onChange={(e) => setForm({ ...form, pages: parseInt(e.target.value) || 0 })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">ISBN</label>
                  <input value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" placeholder="978-..." />
                </div>
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full h-20 px-unit-sm py-unit-xs bg-surface-container-low border border-outline-variant rounded-lg text-sm resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Image URL</label>
                  {form.imageUrl && (
                    <div className="mb-2 w-20 h-28 rounded-lg overflow-hidden border border-outline-variant">
                      <img src={form.imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                  )}
                  <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Additional Images (JSON array)</label>
                  <input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" placeholder='["url1.jpg","url2.jpg"]' />
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-primary" />
                    <span className="text-sm text-on-surface-variant">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 accent-primary" />
                    <span className="text-sm text-on-surface-variant">Published</span>
                  </label>
                </div>
              </div>

              <div className="border-t border-outline-variant pt-unit-md">
                <div className="flex items-center justify-between mb-unit-sm">
                  <h3 className="font-headline-md text-headline-md text-on-surface">Variants</h3>
                  <button type="button" onClick={addVariant} className="text-primary text-sm flex items-center gap-1 hover:underline">
                    <span className="material-symbols-outlined text-sm">add</span> Add Format
                  </button>
                </div>
                <div className="space-y-unit-sm">
                  {variants.map((v, idx) => (
                    <div key={idx} className="bg-surface-container-low p-unit-sm rounded-lg border border-outline-variant">
                      <div className="flex items-center justify-between mb-unit-xs">
                        <select value={v.format} onChange={(e) => updateVariant(idx, "format", e.target.value)} className="h-8 px-2 bg-surface border border-outline-variant rounded text-sm font-medium" disabled={editing ? true : false}>
                          {FORMATS.map((f) => (
                            <option key={f} value={f} disabled={!editing && variants.some((x, i) => i !== idx && x.format === f)}>{FORMAT_LABELS[f]}</option>
                          ))}
                        </select>
                        <button type="button" onClick={() => removeVariant(idx)} className="text-secondary text-sm flex items-center gap-1 hover:underline">
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-unit-sm">
                        <div>
                          <label className="text-[10px] text-on-surface-variant block">Price (₦)</label>
                          <input type="number" step="0.01" value={v.price} onChange={(e) => updateVariant(idx, "price", parseFloat(e.target.value) || 0)} className="w-full h-8 px-2 bg-surface border border-outline-variant rounded text-sm" />
                        </div>
                        <div>
                          <label className="text-[10px] text-on-surface-variant block">Compare</label>
                          <input type="number" step="0.01" value={v.comparePrice} onChange={(e) => updateVariant(idx, "comparePrice", parseFloat(e.target.value) || 0)} className="w-full h-8 px-2 bg-surface border border-outline-variant rounded text-sm" />
                        </div>
                        <div>
                          <label className="text-[10px] text-on-surface-variant block">Stock</label>
                          <input type="number" value={v.stock} onChange={(e) => updateVariant(idx, "stock", parseInt(e.target.value) || 0)} className="w-full h-8 px-2 bg-surface border border-outline-variant rounded text-sm" />
                        </div>
                        <div>
                          <label className="text-[10px] text-on-surface-variant block">SKU</label>
                          <input value={v.sku} onChange={(e) => updateVariant(idx, "sku", e.target.value)} className="w-full h-8 px-2 bg-surface border border-outline-variant rounded text-sm" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-unit-md pt-unit-sm border-t border-outline-variant">
                <button type="submit" className="bg-primary text-white px-unit-md py-unit-sm rounded-lg font-label-md text-label-md hover:bg-primary-fixed-dim transition-all">{editing ? "Update" : "Create"}</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-unit-md py-unit-sm border border-outline-variant rounded-lg text-sm text-on-surface hover:bg-surface-container transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
