"use client";

import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  _count: { books: number };
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", imageUrl: "" });

  function loadCategories() {
    setLoading(true);
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadCategories(); }, []);

  function openCreate() {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", imageUrl: "" });
    setShowForm(true);
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, imageUrl: cat.imageUrl });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories";
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowForm(false);
    loadCategories();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? Books in this category will be orphaned.")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    loadCategories();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-unit-lg">
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Categories</h1>
        <button onClick={openCreate} className="bg-primary text-on-primary px-unit-md py-unit-sm rounded-button font-label-md text-label-md hover:bg-primary-fixed-dim transition-colors">+ Add Category</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-unit-md" onClick={() => setShowForm(false)}>
          <div className="bg-surface dark:bg-surface-dim rounded-modal max-w-md w-full p-unit-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-unit-md">{editing ? "Edit Category" : "Add Category"}</h2>
            <form onSubmit={handleSubmit} className="space-y-unit-md">
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} className="w-full h-10 px-unit-sm bg-transparent border border-outline/40 rounded-input font-body-md text-body-md text-on-surface" required />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full h-20 px-unit-sm py-unit-xs bg-transparent border border-outline/40 rounded-input font-body-md text-body-md text-on-surface resize-none" />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Image URL</label>
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full h-10 px-unit-sm bg-transparent border border-outline/40 rounded-input font-body-md text-body-md text-on-surface" />
              </div>
              <div className="flex items-center gap-unit-md pt-unit-sm">
                <button type="submit" className="bg-primary text-on-primary px-unit-md py-unit-sm rounded-button font-label-md text-label-md hover:bg-primary-fixed-dim">{editing ? "Update" : "Create"}</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-unit-md py-unit-sm border border-outline/40 rounded-button font-label-md text-label-md text-on-surface hover:bg-surface-container">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
        {loading ? (
          <div className="col-span-2 text-center py-unit-lg font-body-md text-body-md text-on-surface-variant">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="col-span-2 text-center py-unit-lg font-body-md text-body-md text-on-surface-variant">No categories</div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="bg-surface dark:bg-surface-dim rounded-modal border border-outline-variant/30 p-unit-md flex items-center justify-between">
              <div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">{cat.name}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{cat.description || "No description"}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-unit-xs">{cat._count.books} book(s)</p>
              </div>
              <div className="flex items-center gap-unit-xs">
                <button onClick={() => openEdit(cat)} className="px-unit-sm py-unit-xs bg-surface-container border border-outline/40 rounded-input font-label-sm text-label-sm text-on-surface hover:bg-surface-container-high">Edit</button>
                <button onClick={() => handleDelete(cat.id)} className="px-unit-sm py-unit-xs bg-error-container text-error rounded-input font-label-sm text-label-sm hover:bg-error">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
