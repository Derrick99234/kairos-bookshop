"use client";

import { useEffect, useState, useCallback } from "react";
import ImageUpload from "@/components/ImageUpload";

interface Category {
  id: string; name: string; slug: string; description: string; imageUrl: string;
  _count: { books: number };
}

const CATEGORY_ICONS: Record<string, string> = {
  "Spiritual Growth": "shield", "Prayer": "volunteer_activism", "Faith": "all_inclusive",
  "Prophetic": "visibility", "Leadership": "groups", "Bible Study": "menu_book",
  "Marriage": "favorite", "Devotional": "auto_awesome",
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", imageUrl: "" });

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  function loadCategories() {
    setLoading(true);
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => showToast("Failed to load categories", "error"))
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
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Request failed"); }
      setShowForm(false);
      showToast(editing ? "Category updated" : "Category created", "success");
      loadCategories();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Something went wrong", "error");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Category deleted", "success");
      loadCategories();
    } catch {
      showToast("Failed to delete category", "error");
    }
  }

  const active = categories.length;
  const totalBooks = categories.reduce((s, c) => s + c._count.books, 0);
  const topCategory = [...categories].sort((a, b) => b._count.books - a._count.books)[0];

  const filtered = categories.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.message}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-unit-md mb-unit-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Categories Management</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Organize your library collections and store sections.</p>
        </div>
        <button onClick={openCreate} className="bg-[#E03636] hover:bg-[#c02e2e] text-white px-unit-lg py-unit-sm rounded-xl font-label-md text-label-md flex items-center gap-2 shadow-lg transition-all active:scale-95">
          <span className="material-symbols-outlined">add</span>
          Add New Category
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-unit-lg">
        {[
          { label: "Total Categories", value: active, icon: "list_alt", color: "bg-primary/5 text-primary" },
          { label: "Active", value: active, icon: "check_circle", color: "bg-green-50 text-green-600" },
          { label: "Books Assigned", value: totalBooks, icon: "menu_book", color: "bg-blue-50 text-blue-600" },
          { label: `Top: ${topCategory?.name || "—"}`, value: topCategory?._count.books || 0, icon: "trending_up", color: "bg-orange-50 text-orange-600" },
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
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-9 pl-9 pr-3 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Search categories..." />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Icon / Category</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Books</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">No categories found</td></tr>
              ) : filtered.map((cat) => (
                <tr key={cat.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-container/10 rounded-lg flex items-center justify-center text-primary overflow-hidden">
                        {cat.imageUrl ? (
                          <img src={cat.imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        ) : (
                          <span className="material-symbols-outlined">{CATEGORY_ICONS[cat.name] || "category"}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-label-md text-label-md text-on-surface">{cat.name}</p>
                        <p className="text-xs text-on-surface-variant">{cat.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant max-w-xs">{cat.description || "No description"}</td>
                  <td className="px-6 py-4 text-sm font-medium">{cat._count.books}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">Active</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(cat)} className="p-1.5 hover:bg-surface-container-high rounded text-on-surface-variant" title="Edit"><span className="material-symbols-outlined text-sm">edit</span></button>
                      <button onClick={() => handleDelete(cat.id)} className="p-1.5 hover:bg-red-50 rounded text-secondary" title="Delete"><span className="material-symbols-outlined text-sm">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-unit-md" onClick={() => setShowForm(false)}>
          <div className="bg-surface rounded-xl max-w-md w-full p-unit-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-unit-md">{editing ? "Edit Category" : "Add New Category"}</h2>
            <form onSubmit={handleSubmit} className="space-y-unit-md">
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" required />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm font-mono text-xs" />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full h-20 px-unit-sm py-unit-xs bg-surface-container-low border border-outline-variant rounded-lg text-sm resize-none" />
              </div>
              <div>
                <ImageUpload currentUrl={form.imageUrl} onUpload={(url) => setForm({ ...form, imageUrl: url })} label="Category Image" />
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
