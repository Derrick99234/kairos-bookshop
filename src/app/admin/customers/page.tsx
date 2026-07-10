"use client";

import { useEffect, useState, useCallback } from "react";

interface Customer {
  id: string; name: string; email: string; phone: string;
  role: string; createdAt: string;
  _count: { orders: number };
  orders: { total: number; createdAt: string }[];
}

interface CustomerStats {
  totalCustomers: number; activeThisMonth: number;
  avgLifetimeValue: number; retentionRate: number;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats>({ totalCustomers: 0, activeThisMonth: 0, avgLifetimeValue: 0, retentionRate: 0 });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [spendingFilter, setSpendingFilter] = useState("");
  const [lastOrderFilter, setLastOrderFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  function loadCustomers() {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (search) params.set("q", search);
    if (statusFilter) params.set("status", statusFilter);
    if (spendingFilter) params.set("spending", spendingFilter);
    if (lastOrderFilter) params.set("lastOrder", lastOrderFilter);
    fetch(`/api/admin/customers?${params}`)
      .then((r) => r.json())
      .then((d) => { setCustomers(d.customers); setPages(d.pages); setTotal(d.total); if (d.stats) setStats(d.stats); })
      .catch(() => showToast("Failed to load customers", "error"))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadCustomers(); }, [page, statusFilter, spendingFilter, lastOrderFilter]);

  useEffect(() => {
    const t = setTimeout(() => { if (page === 1) loadCustomers(); else setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  function exportCSV() {
    const headers = ["Name", "Email", "Phone", "Total Orders", "Total Spent", "Last Order Date", "Registered"];
    const rows = customers.map((c) => {
      const totalSpent = c.orders.reduce((s, o) => s + o.total, 0);
      const dates = c.orders.map((o) => new Date(o.createdAt).getTime());
      const lastDate = dates.length > 0 ? new Date(Math.max(...dates)).toLocaleDateString() : "—";
      return [c.name, c.email, c.phone || "—", c._count.orders, totalSpent.toFixed(2), lastDate, new Date(c.createdAt).toLocaleDateString()];
    });
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  async function handleCreateCustomer(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      setShowForm(false);
      setForm({ name: "", email: "", phone: "", password: "" });
      showToast("Customer created successfully", "success");
      loadCustomers();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Something went wrong", "error");
    }
  }

  return (
    <div>
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.message}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-unit-md mb-unit-lg">
        <div>
          <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-1">
            <span>Management</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-on-surface font-medium">Customers</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Customer Database</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage and track stewardship through purchasing history and engagement.</p>
        </div>
        <div className="flex items-center gap-unit-sm">
          <button onClick={exportCSV} className="border border-outline-variant px-unit-md py-unit-sm rounded-lg flex items-center gap-2 text-sm hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined text-sm">download</span>Export CSV
          </button>
          <button onClick={() => { setForm({ name: "", email: "", phone: "", password: "" }); setShowForm(true); }} className="bg-[#E03636] hover:bg-[#c02e2e] text-white px-unit-md py-unit-sm rounded-xl font-label-md text-label-md flex items-center gap-2 shadow-lg transition-all active:scale-95">
            <span className="material-symbols-outlined text-sm">person_add</span>New Customer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-unit-lg">
        {[
          { label: "Total Customers", value: stats.totalCustomers.toLocaleString(), icon: "group", trend: "Registered users", up: true, color: "bg-primary/5 text-primary" },
          { label: "Active This Month", value: stats.activeThisMonth.toLocaleString(), icon: "person_check", trend: "Ordered this month", up: true, color: "bg-green-50 text-green-600" },
          { label: "Avg. Lifetime Value", value: `₦${stats.avgLifetimeValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: "account_balance", trend: "Average spend", up: true, color: "bg-blue-50 text-blue-600" },
          { label: "Retention Rate", value: `${stats.retentionRate}%`, icon: "trending_up", trend: "Repeat customers", up: stats.retentionRate >= 30, color: "bg-orange-50 text-orange-600" },
        ].map((s) => (
          <div key={s.label} className="bg-surface-container-lowest p-unit-md border border-outline-variant rounded-xl">
            <div className="flex justify-between items-start">
              <span className="font-label-md text-label-md text-outline uppercase tracking-wider">{s.label}</span>
              <div className={`p-2 rounded-lg ${s.color}`}><span className="material-symbols-outlined text-sm">{s.icon}</span></div>
            </div>
            <p className="font-headline-md text-headline-md font-bold mt-2">{s.value}</p>
            <p className={`text-xs mt-1 ${s.up ? "text-green-600" : "text-red-600"}`}>{s.trend}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
        <div className="p-unit-md border-b border-outline-variant flex flex-wrap items-center justify-between gap-unit-md">
          <div className="flex flex-wrap items-center gap-unit-md">
            <div className="relative min-w-[180px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-9 pl-9 pr-3 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none" placeholder="Search name or email..." />
            </div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="h-9 px-3 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none">
              <option value="">Status: All</option>
              <option value="active">Active (ordered &lt;30d)</option>
              <option value="inactive">Inactive (&gt;90d)</option>
            </select>
            <select value={spendingFilter} onChange={(e) => { setSpendingFilter(e.target.value); setPage(1); }} className="h-9 px-3 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none">
              <option value="">Spending: Any</option>
              <option value="high">High (&gt;₦100,000)</option>
              <option value="medium">Medium (₦20,000-₦100,000)</option>
              <option value="low">Low (&lt;₦20,000)</option>
            </select>
            <select value={lastOrderFilter} onChange={(e) => { setLastOrderFilter(e.target.value); setPage(1); }} className="h-9 px-3 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none">
              <option value="">Last Order: Any</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last Year</option>
            </select>
          </div>
          <span className="text-sm text-on-surface-variant">Page {page} of {pages} ({total} total)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Total Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Last Order Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">Loading...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">No customers found</td></tr>
              ) : customers.map((c) => {
                const initials = c.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
                const dates = c.orders.map((o) => new Date(o.createdAt).getTime());
                const lastOrderDate = dates.length > 0 ? new Date(Math.max(...dates)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
                const totalSpent = c.orders.reduce((s, o) => s + o.total, 0);
                return (
                  <tr key={c.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold text-xs">{initials}</div>
                        <div>
                          <p className="font-label-md text-label-md text-on-surface">{c.name}</p>
                          <p className="text-xs text-on-surface-variant">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{c._count.orders}</td>
                    <td className="px-6 py-4 text-sm font-medium">₦{totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{lastOrderDate}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative">
                        <button onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)} className="p-1.5 hover:bg-surface-container-high rounded text-on-surface-variant" title="More">
                          <span className="material-symbols-outlined text-sm">more_vert</span>
                        </button>
                        {openMenu === c.id && (
                          <div className="absolute right-0 top-full mt-1 bg-surface border border-outline-variant rounded-lg shadow-lg z-50 min-w-[160px] py-1" onClick={() => setOpenMenu(null)} onMouseLeave={() => setOpenMenu(null)}>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-high w-full text-left"><span className="material-symbols-outlined text-sm">email</span>Send Email</button>
                          </div>
                        )}
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
            <span>Page {page} of {pages}</span>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 border border-outline-variant rounded-lg text-xs hover:border-primary transition-all disabled:opacity-40">Previous</button>
              <span className="px-2 py-1 rounded text-xs bg-primary text-white font-medium">{page}</span>
              <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 border border-outline-variant rounded-lg text-xs hover:border-primary transition-all disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-unit-md pt-unit-md border-t border-outline-variant flex items-center justify-between text-xs text-on-surface-variant">
        <span>&copy; 2024 Kairos Bookshop Stewardship Portal. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a href="/privacy-policy" className="hover:text-primary">Privacy Policy</a>
          <a href="/contact" className="hover:text-primary">Support Portal</a>
          <a href="/admin/settings" className="hover:text-primary">System Settings</a>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-unit-md" onClick={() => setShowForm(false)}>
          <div className="bg-surface rounded-xl max-w-md w-full p-unit-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-unit-md">Add New Customer</h2>
            <form onSubmit={handleCreateCustomer} className="space-y-unit-md">
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" required />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" required />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Password *</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" required minLength={8} />
              </div>
              <div className="flex items-center gap-unit-md pt-unit-sm">
                <button type="submit" className="bg-primary text-white px-unit-md py-unit-sm rounded-lg font-label-md text-label-md hover:bg-primary-fixed-dim transition-all">Create Customer</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-unit-md py-unit-sm border border-outline-variant rounded-lg text-sm text-on-surface hover:bg-surface-container transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
