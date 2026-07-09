"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Address {
  id: string; label: string; street: string; city: string; state: string; country: string; isDefault: boolean;
}

export default function AddressesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ label: "Home", street: "", city: "", state: "", country: "Nigeria", isDefault: false });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/signin"); return; }
    if (status !== "authenticated") return;
    fetchAddresses();
  }, [status, router]);

  async function fetchAddresses() {
    try {
      const res = await fetch("/api/account/addresses");
      const d = await res.json();
      setAddresses(Array.isArray(d) ? d : []);
    } catch {} finally { setLoading(false); }
  }

  function openNew() { setEditingId(null); setForm({ label: "Home", street: "", city: "", state: "", country: "Nigeria", isDefault: false }); setShowForm(true); setFormError(""); }

  function openEdit(a: Address) { setEditingId(a.id); setForm({ label: a.label, street: a.street, city: a.city, state: a.state, country: a.country, isDefault: a.isDefault }); setShowForm(true); setFormError(""); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const url = editingId ? `/api/account/addresses/${editingId}` : "/api/account/addresses";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); setFormError(d.error || "Failed to save"); return; }
      setShowForm(false);
      setEditingId(null);
      await fetchAddresses();
    } catch { setFormError("Something went wrong"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this address?")) return;
    await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    await fetchAddresses();
  }

  async function setDefault(id: string) {
    await fetch(`/api/account/addresses/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isDefault: true }) });
    await fetchAddresses();
  }

  if (status === "loading" || loading) {
    return (
      <main className="flex-grow pt-32 pb-unit-xl max-w-6xl mx-auto px-6">
        <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-surface-container rounded" /><div className="h-64 bg-surface-container rounded-xl" /></div>
      </main>
    );
  }

  return (
    <main className="flex-grow pt-32 pb-unit-xl">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-gutter">
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md mb-unit-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold text-xl">{session?.user?.name?.charAt(0) || "U"}</div>
                <div>
                  <p className="font-label-md">{session?.user?.name}</p>
                  <p className="text-xs text-on-surface-variant">{session?.user?.email}</p>
                </div>
              </div>
            </div>
            <nav className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
              {[
                { href: "/account", label: "My Orders", icon: "receipt_long", active: false },
                { href: "/account/wishlist", label: "Wishlist", icon: "favorite", active: false },
                { href: "/account/profile", label: "My Profile", icon: "person", active: false },
                { href: "/account/addresses", label: "Saved Addresses", icon: "location_on", active: true },
              ].map((item) => (
                <Link key={item.label} href={item.href} className={`flex items-center gap-3 px-unit-md py-3 text-sm transition-colors ${item.active ? "bg-primary-container/10 text-primary font-bold" : "text-on-surface-variant hover:bg-surface-container"}`}>
                  <span className="material-symbols-outlined text-sm">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-unit-md py-3 text-sm text-secondary hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-sm">logout</span>
                Logout
              </button>
            </nav>
          </aside>

          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between mb-unit-lg">
              <h1 className="font-headline-xl text-2xl md:text-headline-xl text-on-surface">Saved Addresses</h1>
              <button onClick={openNew} className="bg-primary text-white font-label-md py-3 px-unit-lg rounded-lg hover:bg-primary-fixed-dim transition-all active:scale-95 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">add</span> Add Address
              </button>
            </div>

            {showForm && (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg mb-unit-lg">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-unit-md">{editingId ? "Edit Address" : "New Address"}</h3>
                {formError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-unit-sm rounded-lg mb-unit-md">{formError}</div>}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Label</label>
                    <select value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm">
                      <option>Home</option>
                      <option>Office</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Country</label>
                    <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Street Address</label>
                    <input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" required />
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">City</label>
                    <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" required />
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">State</label>
                    <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" required />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <input checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} type="checkbox" id="isDefault" className="rounded border-outline text-primary focus:ring-primary" />
                    <label htmlFor="isDefault" className="text-sm text-on-surface-variant">Set as default address</label>
                  </div>
                  <div className="md:col-span-2 flex gap-unit-sm">
                    <button type="submit" disabled={saving} className="bg-primary text-white font-label-md py-3 px-unit-lg rounded-lg hover:bg-primary-fixed-dim transition-all disabled:opacity-50">
                      {saving ? "Saving..." : editingId ? "Update Address" : "Add Address"}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="border border-outline-variant font-label-md py-3 px-unit-lg rounded-lg hover:bg-surface-container transition-all">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {addresses.length === 0 ? (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg text-center">
                <span className="material-symbols-outlined text-4xl text-outline opacity-30 mb-2">location_off</span>
                <p className="text-on-surface-variant mb-4">No saved addresses</p>
                <button onClick={openNew} className="bg-primary text-white font-label-md py-3 px-unit-lg rounded-lg inline-block hover:bg-primary-fixed-dim transition-all">Add Address</button>
              </div>
            ) : (
              <div className="space-y-unit-md">
                {addresses.map((a) => (
                  <div key={a.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-label-md">{a.label}</span>
                        {a.isDefault && <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">Default</span>}
                      </div>
                      <p className="text-sm text-on-surface-variant">{a.street}</p>
                      <p className="text-sm text-on-surface-variant">{a.city}, {a.state}, {a.country}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!a.isDefault && <button onClick={() => setDefault(a.id)} className="text-xs text-primary hover:underline">Set Default</button>}
                      <button onClick={() => openEdit(a)} className="text-xs text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-sm">edit</span></button>
                      <button onClick={() => handleDelete(a.id)} className="text-xs text-secondary hover:text-secondary-fixed-dim"><span className="material-symbols-outlined text-sm">delete</span></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
