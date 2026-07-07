"use client";

import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  price: number;
  stock: number;
  featured: boolean;
  published: boolean;
  category: { name: string } | null;
  _count: { reviews: number; orderItems: number };
  imageUrl: string;
}

export default function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [form, setForm] = useState({
    title: "", slug: "", author: "", description: "", isbn: "", pages: 0,
    price: 0, comparePrice: 0, stock: 0, categoryId: "",
    imageUrl: "", featured: false, published: true, format: "PAPERBACK",
  });

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories).catch(() => {});
  }, []);

  function loadBooks() {
    setLoading(true);
    fetch(`/api/admin/books?page=${page}&limit=20`)
      .then((r) => r.json())
      .then((d) => { setBooks(d.books); setPages(d.pages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadBooks(); }, [page]);

  function openCreate() {
    setEditing(null);
    setForm({ title: "", slug: "", author: "", description: "", isbn: "", pages: 0, price: 0, comparePrice: 0, stock: 0, categoryId: categories[0]?.id || "", imageUrl: "", featured: false, published: true, format: "PAPERBACK" });
    setShowForm(true);
  }

  function openEdit(book: Book) {
    setEditing(book);
    setForm({
      title: book.title, slug: book.slug, author: book.author, description: "",
      isbn: "", pages: 0, price: book.price, comparePrice: 0, stock: book.stock,
      categoryId: book.category?.name || "", imageUrl: book.imageUrl,
      featured: book.featured, published: book.published, format: "PAPERBACK",
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = editing ? `/api/admin/books/${editing.slug}` : "/api/admin/books";
    const method = editing ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setShowForm(false);
    loadBooks();
  }

  async function handleDelete(slug: string) {
    if (!confirm("Delete this book?")) return;
    await fetch(`/api/admin/books/${slug}`, { method: "DELETE" });
    loadBooks();
  }

  async function toggleFeatured(book: Book) {
    await fetch(`/api/admin/books/${book.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !book.featured }),
    });
    loadBooks();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-unit-lg">
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Books</h1>
        <button onClick={openCreate} className="bg-primary text-on-primary px-unit-md py-unit-sm rounded-button font-label-md text-label-md hover:bg-primary-fixed-dim transition-colors">
          + Add Book
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-unit-md" onClick={() => setShowForm(false)}>
          <div className="bg-surface dark:bg-surface-dim rounded-modal max-w-lg w-full max-h-[80vh] overflow-y-auto p-unit-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-unit-md">{editing ? "Edit Book" : "Add Book"}</h2>
            <form onSubmit={handleSubmit} className="space-y-unit-md">
              <div className="grid grid-cols-2 gap-unit-md">
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Title</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })} className="w-full h-10 px-unit-sm bg-transparent border border-outline/40 rounded-input font-body-md text-body-md text-on-surface" required />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Author</label>
                  <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full h-10 px-unit-sm bg-transparent border border-outline/40 rounded-input font-body-md text-body-md text-on-surface" required />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Category</label>
                  <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full h-10 px-unit-sm bg-transparent border border-outline/40 rounded-input font-body-md text-body-md text-on-surface">
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Price (₦)</label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} className="w-full h-10 px-unit-sm bg-transparent border border-outline/40 rounded-input font-body-md text-body-md text-on-surface" required />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })} className="w-full h-10 px-unit-sm bg-transparent border border-outline/40 rounded-input font-body-md text-body-md text-on-surface" />
                </div>
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Image URL</label>
                  <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full h-10 px-unit-sm bg-transparent border border-outline/40 rounded-input font-body-md text-body-md text-on-surface" />
                </div>
              </div>
              <div className="flex items-center gap-unit-md">
                <label className="flex items-center gap-unit-xs cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-primary w-4 h-4" />
                  <span className="font-body-md text-body-md text-on-surface">Featured</span>
                </label>
                <label className="flex items-center gap-unit-xs cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="accent-primary w-4 h-4" />
                  <span className="font-body-md text-body-md text-on-surface">Published</span>
                </label>
              </div>
              <div className="flex items-center gap-unit-md pt-unit-sm">
                <button type="submit" className="bg-primary text-on-primary px-unit-md py-unit-sm rounded-button font-label-md text-label-md hover:bg-primary-fixed-dim transition-colors">
                  {editing ? "Update" : "Create"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-unit-md py-unit-sm border border-outline/40 rounded-button font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-surface dark:bg-surface-dim rounded-modal border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-low">
                <th className="text-left font-label-md text-label-md text-on-surface-variant p-unit-sm">Title</th>
                <th className="text-left font-label-md text-label-md text-on-surface-variant p-unit-sm">Author</th>
                <th className="text-left font-label-md text-label-md text-on-surface-variant p-unit-sm">Category</th>
                <th className="text-left font-label-md text-label-md text-on-surface-variant p-unit-sm">Price</th>
                <th className="text-left font-label-md text-label-md text-on-surface-variant p-unit-sm">Stock</th>
                <th className="text-left font-label-md text-label-md text-on-surface-variant p-unit-sm">Status</th>
                <th className="text-left font-label-md text-label-md text-on-surface-variant p-unit-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-unit-md text-center font-body-md text-body-md text-on-surface-variant">Loading...</td></tr>
              ) : books.length === 0 ? (
                <tr><td colSpan={7} className="p-unit-md text-center font-body-md text-body-md text-on-surface-variant">No books</td></tr>
              ) : (
                books.map((book) => (
                  <tr key={book.id} className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                    <td className="p-unit-sm">
                      <p className="font-body-md text-body-md text-on-surface">{book.title}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{book.slug}</p>
                    </td>
                    <td className="p-unit-sm font-body-md text-body-md text-on-surface">{book.author}</td>
                    <td className="p-unit-sm font-body-md text-body-md text-on-surface-variant">{book.category?.name || "-"}</td>
                    <td className="p-unit-sm font-label-md text-label-md text-on-surface">₦{book.price}</td>
                    <td className="p-unit-sm font-body-md text-body-md text-on-surface-variant">{book.stock}</td>
                    <td className="p-unit-sm">
                      <span className={`inline-block px-unit-xs py-unit-2xs rounded-input font-label-sm text-label-sm ${book.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {book.published ? "Published" : "Draft"}
                      </span>
                      {book.featured && <span className="ml-unit-xs inline-block px-unit-xs py-unit-2xs rounded-input font-label-sm text-label-sm bg-indigo-100 text-indigo-800">Featured</span>}
                    </td>
                    <td className="p-unit-sm">
                      <div className="flex items-center gap-unit-xs">
                        <button onClick={() => openEdit(book)} className="px-unit-sm py-unit-xs bg-surface-container border border-outline/40 rounded-input font-label-sm text-label-sm text-on-surface hover:bg-surface-container-high transition-colors">Edit</button>
                        <button onClick={() => toggleFeatured(book)} className="px-unit-sm py-unit-xs bg-surface-container border border-outline/40 rounded-input font-label-sm text-label-sm text-on-surface hover:bg-surface-container-high transition-colors">{book.featured ? "Unfeature" : "Feature"}</button>
                        <button onClick={() => handleDelete(book.slug)} className="px-unit-sm py-unit-xs bg-error-container text-error rounded-input font-label-sm text-label-sm hover:bg-error transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-unit-sm mt-unit-md">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-unit-sm py-unit-xs bg-surface border border-outline/40 rounded-input font-label-md text-label-md text-on-surface disabled:opacity-40">Previous</button>
          <span className="font-body-md text-body-md text-on-surface-variant">Page {page} of {pages}</span>
          <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="px-unit-sm py-unit-xs bg-surface border border-outline/40 rounded-input font-label-md text-label-md text-on-surface disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}
