"use client";

import { useEffect, useState, useCallback } from "react";

interface Category { id: string; name: string; slug: string; }
interface Book {
  id: string; title: string; slug: string; author: string; description: string;
  price: number; comparePrice: number; stock: number; pages: number; isbn: string;
  format: string; imageUrl: string; images: string; featured: boolean; published: boolean;
  category: { id: string; name: string } | null;
}

interface BooksStats {
  totalSku: number; outOfStock: number; lowStock: number; totalValue: number;
}

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
    price: 0, comparePrice: 0, stock: 0, categoryId: "",
    imageUrl: "", images: "[]", featured: false, published: true, format: "PAPERBACK",
  });

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
    setForm({ title: "", slug: "", author: "", description: "", isbn: "", pages: 0, price: 0, comparePrice: 0, stock: 0, categoryId: "", imageUrl: "", images: "[]", featured: false, published: true, format: "PAPERBACK" });
    setShowForm(true);
  }

  function openEdit(book: Book) {
    setEditing(book);
    setForm({
      title: book.title, slug: book.slug, author: book.author, description: book.description,
      isbn: book.isbn || "", pages: book.pages || 0, price: book.price, comparePrice: book.comparePrice,
      stock: book.stock, categoryId: book.category?.id || "", imageUrl: book.imageUrl,
      images: book.images || "[]", featured: book.featured, published: book.published,
      format: book.format || "PAPERBACK",
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = editing ? `/api/admin/books/${editing.slug}` : "/api/admin/books";
    const method = editing ? "PUT" : "POST";
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
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
    } catch {
      showToast("Failed to delete book", "error");
    }
  }

  async function handleDuplicate(book: Book) {
    const newSlug = `${book.slug}-copy`;
    setForm({
      title: `${book.title} (Copy)`, slug: newSlug, author: book.author, description: book.description,
      isbn: "", pages: book.pages, price: book.price, comparePrice: 0, stock: 0,
      categoryId: book.category?.id || "", imageUrl: book.imageUrl, images: book.images || "[]",
      featured: false, published: false, format: book.format || "PAPERBACK",
    });
    setEditing(null);
    setShowForm(true);
    setOpenMenu(null);
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
          { label: "Total Value", value: `$${stats.totalValue.toLocaleString()}`, icon: "payments", color: "bg-green-50 text-green-600" },
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
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">Loading...</td></tr>
              ) : books.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">No books found</td></tr>
              ) : books.map((book) => {
                const status = book.stock === 0 ? "out" : book.stock <= 5 ? "low" : "active";
                return (
                  <tr key={book.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {book.imageUrl && (
                          <img src={book.imageUrl} alt="" className="w-10 h-14 rounded object-cover bg-surface-container-high" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        )}
                        <div>
                          <p className="font-label-md text-label-md text-on-surface">{book.title}</p>
                          <p className="text-xs text-on-surface-variant">{book.author} {book.format ? `· ${book.format}` : ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{book.category?.name || "—"}</td>
                    <td className="px-6 py-4 font-label-md text-label-md">
                      ${book.price.toFixed(2)}
                      {book.comparePrice > 0 && book.comparePrice > book.price && (
                        <span className="text-xs text-on-surface-variant line-through ml-1">${book.comparePrice.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">{book.stock} units</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        status === "active" ? "bg-green-100 text-green-700" :
                        status === "low" ? "bg-orange-100 text-orange-700" :
                        "bg-red-100 text-red-700"
                      }`}>{status === "active" ? "Active" : status === "low" ? "Low Stock" : "Out of Stock"}</span>
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
                              <button onClick={() => handleDuplicate(book)} className="flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-high w-full text-left"><span className="material-symbols-outlined text-sm">content_copy</span>Duplicate</button>
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
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-unit-md" onClick={() => setShowForm(false)}>
          <div className="bg-surface rounded-xl max-w-lg w-full p-unit-lg shadow-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Price ($)</label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Compare Price ($)</label>
                  <input type="number" step="0.01" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: parseFloat(e.target.value) || 0 })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Pages</label>
                  <input type="number" value={form.pages} onChange={(e) => setForm({ ...form, pages: parseInt(e.target.value) || 0 })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">ISBN</label>
                  <input value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" placeholder="978-..." />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Format</label>
                  <select value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm">
                    <option value="PAPERBACK">Paperback</option>
                    <option value="HARDCOVER">Hardcover</option>
                  </select>
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
              <div className="flex items-center gap-unit-md pt-unit-sm">
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
