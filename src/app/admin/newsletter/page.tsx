"use client";

import { useEffect, useState } from "react";

interface Subscriber {
  id: string; email: string; subscribed: boolean; createdAt: string;
}

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  function loadSubscribers() {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("q", search);
    fetch(`/api/admin/newsletter?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setSubscribers(d.subscribers);
        setPages(d.pages);
        setTotal(d.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadSubscribers(); }, [page]);

  useEffect(() => {
    const t = setTimeout(() => { if (page === 1) loadSubscribers(); else setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    fetch("/api/admin/newsletter?limit=1")
      .then((r) => r.json())
      .then((d) => setActiveCount(d.total))
      .catch(() => {});
  }, []);

  function exportCSV() {
    const headers = ["Email", "Subscribed", "Date"];
    const rows = subscribers.map((s) => [s.email, s.subscribed ? "Yes" : "No", new Date(s.createdAt).toLocaleDateString()]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-unit-md mb-unit-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Newsletter Subscribers</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage your email subscriber list.</p>
        </div>
        <div className="flex items-center gap-unit-sm">
          <button onClick={exportCSV} className="border border-outline-variant px-unit-md py-unit-sm rounded-lg flex items-center gap-2 text-sm hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined text-sm">download</span>Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-unit-lg">
        {[
          { label: "Total Subscribers", value: total.toLocaleString(), icon: "group", color: "bg-primary/5 text-primary" },
          { label: "Active", value: activeCount.toLocaleString(), icon: "mark_email_read", color: "bg-green-50 text-green-600" },
          { label: "This Page", value: subscribers.length, icon: "list", color: "bg-blue-50 text-blue-600" },
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
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-9 pl-9 pr-3 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none" placeholder="Search by email..." />
          </div>
          <span className="text-sm text-on-surface-variant">{total} total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Subscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-on-surface-variant">Loading...</td></tr>
              ) : subscribers.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-on-surface-variant">No subscribers found</td></tr>
              ) : subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold text-xs">
                        {sub.email.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-label-md text-label-md text-on-surface">{sub.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${sub.subscribed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {sub.subscribed ? "Active" : "Unsubscribed"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{new Date(sub.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="px-6 py-4 border-t border-outline-variant flex items-center justify-between text-sm text-on-surface-variant">
            <span>Page {page} of {pages}</span>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:border-primary disabled:opacity-40"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
              <span className="font-medium">{page}</span>
              <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:border-primary disabled:opacity-40"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
