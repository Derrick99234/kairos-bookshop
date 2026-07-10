"use client";

import { useEffect, useState } from "react";

interface Inquiry {
  id: string; name: string; email: string; phone: string;
  message: string; replied: boolean; createdAt: string;
}

export default function AdminContact() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [repliedFilter, setRepliedFilter] = useState("");
  const [viewInquiry, setViewInquiry] = useState<Inquiry | null>(null);

  function loadInquiries() {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("q", search);
    if (repliedFilter) params.set("replied", repliedFilter);
    fetch(`/api/admin/contact?${params}`)
      .then((r) => r.json())
      .then((d) => { setInquiries(d.inquiries); setPages(d.pages); setTotal(d.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadInquiries(); }, [page, repliedFilter]);

  useEffect(() => {
    const t = setTimeout(() => { if (page === 1) loadInquiries(); else setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  function exportCSV() {
    const headers = ["Name", "Email", "Phone", "Message", "Replied", "Date"];
    const rows = inquiries.map((i) => [i.name, i.email, i.phone || "—", `"${i.message.replace(/"/g, '""')}"`, i.replied ? "Yes" : "No", new Date(i.createdAt).toLocaleDateString()]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `contact-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-unit-md mb-unit-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Contact Inquiries</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Review and manage messages from your community.</p>
        </div>
        <div className="flex items-center gap-unit-sm">
          <button onClick={exportCSV} className="border border-outline-variant px-unit-md py-unit-sm rounded-lg flex items-center gap-2 text-sm hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined text-sm">download</span>Export CSV
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
        <div className="p-unit-md border-b border-outline-variant flex flex-wrap items-center gap-unit-md">
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-9 pl-9 pr-3 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none" placeholder="Search by name, email, or message..." />
          </div>
          <select value={repliedFilter} onChange={(e) => { setRepliedFilter(e.target.value); setPage(1); }} className="h-9 px-3 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none">
            <option value="">All</option>
            <option value="false">Unreplied</option>
            <option value="true">Replied</option>
          </select>
          <span className="text-sm text-on-surface-variant">{total} total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">Loading...</td></tr>
              ) : inquiries.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">No inquiries found</td></tr>
              ) : inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-label-md text-label-md text-on-surface">{inq.name}</p>
                    {inq.phone && <p className="text-xs text-on-surface-variant">{inq.phone}</p>}
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{inq.email}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant max-w-xs truncate">{inq.message}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${inq.replied ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      {inq.replied ? "Replied" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{new Date(inq.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setViewInquiry(inq)} className="p-1.5 hover:bg-surface-container-high rounded text-on-surface-variant" title="View"><span className="material-symbols-outlined text-sm">visibility</span></button>
                  </td>
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

      {viewInquiry && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-unit-md" onClick={() => setViewInquiry(null)}>
          <div className="bg-surface rounded-xl max-w-lg w-full p-unit-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-unit-md">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Inquiry Details</h2>
              <button onClick={() => setViewInquiry(null)} className="p-1 hover:bg-surface-container-high rounded"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="space-y-3">
              <div className="bg-surface-container-low p-unit-sm rounded-lg">
                <p className="text-xs text-on-surface-variant uppercase tracking-wider">Name</p>
                <p className="font-label-md text-label-md">{viewInquiry.name}</p>
              </div>
              <div className="bg-surface-container-low p-unit-sm rounded-lg">
                <p className="text-xs text-on-surface-variant uppercase tracking-wider">Email</p>
                <p className="font-label-md text-label-md">{viewInquiry.email}</p>
              </div>
              {viewInquiry.phone && (
                <div className="bg-surface-container-low p-unit-sm rounded-lg">
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider">Phone</p>
                  <p className="font-label-md text-label-md">{viewInquiry.phone}</p>
                </div>
              )}
              <div className="bg-surface-container-low p-unit-sm rounded-lg">
                <p className="text-xs text-on-surface-variant uppercase tracking-wider">Date</p>
                <p className="font-label-md text-label-md">{new Date(viewInquiry.createdAt).toLocaleString()}</p>
              </div>
              <div className="bg-surface-container-low p-unit-sm rounded-lg">
                <p className="text-xs text-on-surface-variant uppercase tracking-wider">Status</p>
                <p className="font-label-md text-label-md">{viewInquiry.replied ? "Replied" : "Pending"}</p>
              </div>
              <div className="bg-surface-container-low p-unit-sm rounded-lg">
                <p className="text-xs text-on-surface-variant uppercase tracking-wider">Message</p>
                <p className="text-sm whitespace-pre-wrap">{viewInquiry.message}</p>
              </div>
            </div>
            <div className="mt-unit-md flex justify-end">
              <button onClick={() => setViewInquiry(null)} className="px-unit-md py-unit-sm border border-outline-variant rounded-lg text-sm hover:bg-surface-container transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
