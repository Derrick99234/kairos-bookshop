"use client";

import { useEffect, useState, useCallback } from "react";

interface BlogPost {
  id: string; title: string; slug: string; excerpt: string;
  content: string; author: string; category: string; imageUrl: string;
  published: boolean; createdAt: string; updatedAt: string;
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [publishedFilter, setPublishedFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", author: "Dr. Isaiah Wealth",
    category: "General", imageUrl: "", published: true,
  });

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  function loadPosts() {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("q", search);
    if (publishedFilter) params.set("published", publishedFilter);
    fetch(`/api/admin/blog?${params}`)
      .then((r) => r.json())
      .then((d) => { setPosts(d.posts); setPages(d.pages); setTotal(d.total); })
      .catch(() => showToast("Failed to load posts", "error"))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadPosts(); }, [page, publishedFilter]);

  useEffect(() => {
    const t = setTimeout(() => { if (page === 1) loadPosts(); else setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  function openCreate() {
    setEditing(null);
    setForm({ title: "", slug: "", excerpt: "", content: "", author: "Dr. Isaiah Wealth", category: "General", imageUrl: "", published: true });
    setShowForm(true);
  }

  function openEdit(post: BlogPost) {
    setEditing(post);
    setForm({ title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, author: post.author, category: post.category, imageUrl: post.imageUrl, published: post.published });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = editing ? `/api/admin/blog/${editing.id}` : "/api/admin/blog";
    const method = editing ? "PUT" : "POST";
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Request failed"); }
      setShowForm(false);
      showToast(editing ? "Post updated" : "Post created", "success");
      loadPosts();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Something went wrong", "error");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Post deleted", "success");
      loadPosts();
    } catch { showToast("Failed to delete post", "error"); }
  }

  function togglePublish(post: BlogPost) {
    const updated = { ...form, published: !post.published, title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, author: post.author, category: post.category, imageUrl: post.imageUrl };
    fetch(`/api/admin/blog/${post.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) })
      .then((r) => { if (!r.ok) throw new Error(); showToast(post.published ? "Post unpublished" : "Post published", "success"); loadPosts(); })
      .catch(() => showToast("Failed to update post", "error"));
  }

  return (
    <div>
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.message}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-unit-md mb-unit-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Blog Posts</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Create and manage spiritual insights and articles.</p>
        </div>
        <button onClick={openCreate} className="bg-[#E03636] hover:bg-[#c02e2e] text-white px-unit-lg py-unit-sm rounded-xl font-label-md text-label-md flex items-center gap-2 shadow-lg transition-all active:scale-95">
          <span className="material-symbols-outlined">add</span>
          New Post
        </button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
        <div className="p-unit-md border-b border-outline-variant flex flex-wrap items-center gap-unit-md">
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-9 pl-9 pr-3 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Search posts..." />
          </div>
          <select value={publishedFilter} onChange={(e) => { setPublishedFilter(e.target.value); setPage(1); }} className="h-9 px-3 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none">
            <option value="">All</option>
            <option value="true">Published</option>
            <option value="false">Drafts</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">Loading...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">No posts found</td></tr>
              ) : posts.map((post) => (
                <tr key={post.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-label-md text-label-md text-on-surface">{post.title}</p>
                    <p className="text-xs text-on-surface-variant line-clamp-1">{post.excerpt}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{post.author}</td>
                  <td className="px-6 py-4 text-sm"><span className="px-2 py-0.5 bg-primary-container/20 text-primary rounded text-xs">{post.category}</span></td>
                  <td className="px-6 py-4">
                    <button onClick={() => togglePublish(post)} className={`px-2 py-0.5 rounded text-xs font-bold border-0 cursor-pointer ${post.published ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      {post.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a href={`/blog/${post.slug}`} target="_blank" className="p-1.5 hover:bg-surface-container-high rounded text-on-surface-variant" title="View"><span className="material-symbols-outlined text-sm">visibility</span></a>
                      <button onClick={() => openEdit(post)} className="p-1.5 hover:bg-surface-container-high rounded text-on-surface-variant" title="Edit"><span className="material-symbols-outlined text-sm">edit</span></button>
                      <button onClick={() => handleDelete(post.id)} className="p-1.5 hover:bg-red-50 rounded text-secondary" title="Delete"><span className="material-symbols-outlined text-sm">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="px-6 py-4 border-t border-outline-variant flex items-center justify-between text-sm text-on-surface-variant">
            <span>Page {page} of {pages} ({total} total)</span>
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
          <div className="bg-surface rounded-xl max-w-2xl w-full p-unit-lg shadow-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-unit-md">{editing ? "Edit Post" : "New Post"}</h2>
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
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Excerpt</label>
                  <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full h-16 px-unit-sm py-unit-xs bg-surface-container-low border border-outline-variant rounded-lg text-sm resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Content (HTML)</label>
                  <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full h-40 px-unit-sm py-unit-xs bg-surface-container-low border border-outline-variant rounded-lg text-sm resize-none font-mono text-xs" />
                </div>
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Image URL</label>
                  {form.imageUrl && (
                    <div className="mb-2 w-32 h-20 rounded-lg overflow-hidden border border-outline-variant">
                      <img src={form.imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                  )}
                  <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" />
                </div>
                <div>
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
