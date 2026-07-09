"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordDone, setPasswordDone] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/signin"); return; }
    if (session?.user) {
      setName(session.user.name || "");
    }
  }, [status, router, session]);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setProfileError("");
    setSaved(false);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      if (!res.ok) { const d = await res.json(); setProfileError(d.error || "Failed to update"); return; }
      setSaved(true);
      await update();
    } catch { setProfileError("Something went wrong"); }
    finally { setSaving(false); }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordDone(false);
    if (newPassword !== confirmPassword) { setPasswordError("Passwords do not match"); return; }
    if (newPassword.length < 8) { setPasswordError("Password must be at least 8 characters"); return; }
    setChanging(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) { const d = await res.json(); setPasswordError(d.error || "Failed to change password"); return; }
      setPasswordDone(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch { setPasswordError("Something went wrong"); }
    finally { setChanging(false); }
  }

  if (status === "loading") {
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
                { href: "/account/profile", label: "My Profile", icon: "person", active: true },
                { href: "/account/addresses", label: "Saved Addresses", icon: "location_on", active: false },
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

          <div className="flex-grow min-w-0 space-y-unit-lg">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-unit-md">Profile Information</h2>
              {saved && <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-unit-sm rounded-lg mb-unit-md">Profile updated successfully!</div>}
              {profileError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-unit-sm rounded-lg mb-unit-md">{profileError}</div>}
              <form onSubmit={handleProfileSave} className="space-y-unit-md">
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" required />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Email</label>
                  <input value={session?.user?.email || ""} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm cursor-not-allowed opacity-70" disabled />
                  <p className="text-xs text-on-surface-variant mt-1">Email cannot be changed.</p>
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Phone</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" placeholder="+234..." />
                </div>
                <button type="submit" disabled={saving} className="bg-primary text-white font-label-md py-3 px-unit-lg rounded-lg hover:bg-primary-fixed-dim transition-all active:scale-95 disabled:opacity-50">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-unit-md">Change Password</h2>
              {passwordDone && <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-unit-sm rounded-lg mb-unit-md">Password changed successfully!</div>}
              {passwordError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-unit-sm rounded-lg mb-unit-md">{passwordError}</div>}
              <form onSubmit={handlePasswordChange} className="space-y-unit-md">
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Current Password</label>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" required />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">New Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" required />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Confirm New Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" required />
                </div>
                <button type="submit" disabled={changing} className="bg-secondary text-white font-label-md py-3 px-unit-lg rounded-lg hover:brightness-110 transition-all active:scale-95 disabled:opacity-50">
                  {changing ? "Changing..." : "Change Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
