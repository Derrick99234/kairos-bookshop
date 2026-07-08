"use client";

import { useEffect, useState, useCallback } from "react";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [profile, setProfile] = useState({ name: "", email: "", phone: "", image: "" });
  const [integrations, setIntegrations] = useState({
    paystackPublicKey: "", paystackSecretKey: "", resendApiKey: "",
    resendSenderEmail: "", gaTrackingId: "", fbPixelId: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) setProfile(d.profile);
        if (d.integrations) setIntegrations(d.integrations);
      })
      .catch(() => showToast("Failed to load settings", "error"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const body: Record<string, unknown> = {};
      if (activeTab === "Profile") body.profile = profile;
      if (activeTab === "Integrations") body.integrations = integrations;

      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Save failed"); }
      showToast("Settings saved", "success");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) { showToast("Passwords do not match", "error"); return; }
    if (newPassword.length < 8) { showToast("Password must be at least 8 characters", "error"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      showToast("Password updated", "success");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-unit-xl text-on-surface-variant">Loading...</div>;
  }

  const tabs = ["Profile", "Security", "Integrations"];

  return (
    <div>
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.message}
        </div>
      )}

      <div className="mb-unit-lg">
        <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-1">
          <span className="material-symbols-outlined text-sm">settings</span>
          <span className="font-medium text-on-surface">System Settings</span>
        </div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">System Settings</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Manage your bookstore&apos;s core identity, security protocols, and operational preferences.</p>
      </div>

      <div className="flex items-center gap-1 mb-unit-lg border-b border-outline-variant overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}>{tab}</button>
        ))}
      </div>

      <div className="space-y-unit-lg">
        {activeTab === "Profile" && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-unit-md">Admin Profile</h3>
            <p className="text-sm text-on-surface-variant mb-unit-lg">Update your personal information and contact details.</p>

            <div className="space-y-unit-md max-w-lg">
              {profile.image && (
                <div className="w-20 h-20 rounded-full overflow-hidden border border-outline-variant">
                  <img src={profile.image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Avatar URL</label>
                <input value={profile.image} onChange={(e) => setProfile({ ...profile, image: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" placeholder="https://..." />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Full Name</label>
                <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Email</label>
                <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Phone</label>
                <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" />
              </div>
            </div>
          </div>
        )}

        {activeTab === "Security" && (
          <div className="space-y-unit-md">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-unit-md">Change Password</h3>
              <p className="text-sm text-on-surface-variant mb-unit-lg">Update your login password to maintain account security.</p>

              <form onSubmit={handleChangePassword} className="space-y-unit-md max-w-lg">
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Current Password</label>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" required />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">New Password</label>
                  <div className="flex items-center gap-2">
                    <input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="flex-1 h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" required minLength={8} />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="p-2 hover:bg-surface-container-high rounded text-on-surface-variant"><span className="material-symbols-outlined">{showNewPassword ? "visibility_off" : "visibility"}</span></button>
                  </div>
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Confirm New Password</label>
                  <input type={showNewPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" required />
                </div>
                <button type="submit" disabled={saving} className="bg-primary text-white px-unit-md py-unit-sm rounded-lg font-label-md text-label-md hover:bg-primary-fixed-dim transition-all disabled:opacity-50">{saving ? "Updating..." : "Update Password"}</button>
              </form>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-unit-md">Two-Factor Authentication</h3>
              <p className="text-sm text-on-surface-variant mb-unit-lg">Add an extra layer of security to your admin account.</p>

              <div className="flex items-center justify-between p-unit-md bg-surface-container-low rounded-lg max-w-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">Authenticator App</p>
                    <p className="text-xs text-on-surface-variant">Secure your account with time-based one-time passwords.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={twoFA} onChange={(e) => setTwoFA(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-container-high rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                </label>
              </div>
              {twoFA && (
                <div className="mt-unit-md p-unit-md bg-surface-container-low rounded-lg max-w-lg">
                  <p className="text-sm text-on-surface-variant mb-2">2FA setup is not yet available. Check back for updates.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "Integrations" && (
          <div className="space-y-unit-md">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-unit-md">Payment Gateway</h3>
              <p className="text-sm text-on-surface-variant mb-unit-lg">Configure Paystack keys for processing payments. Uses live keys when set, otherwise test mode.</p>

              <div className="space-y-unit-md max-w-lg">
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Paystack Public Key</label>
                  <input value={integrations.paystackPublicKey} onChange={(e) => setIntegrations({ ...integrations, paystackPublicKey: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm font-mono text-xs" placeholder="pk_live_..." />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Paystack Secret Key</label>
                  <input type="password" value={integrations.paystackSecretKey} onChange={(e) => setIntegrations({ ...integrations, paystackSecretKey: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm font-mono text-xs" placeholder="sk_live_..." />
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-unit-md">Email Service</h3>
              <p className="text-sm text-on-surface-variant mb-unit-lg">Configure Resend for transactional emails (order confirmations, password resets).</p>

              <div className="space-y-unit-md max-w-lg">
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Resend API Key</label>
                  <input type="password" value={integrations.resendApiKey} onChange={(e) => setIntegrations({ ...integrations, resendApiKey: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm font-mono text-xs" placeholder="re_..." />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Sender Email</label>
                  <input value={integrations.resendSenderEmail} onChange={(e) => setIntegrations({ ...integrations, resendSenderEmail: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" placeholder="noreply@kairosbookshop.com" />
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-unit-md">Analytics</h3>
              <p className="text-sm text-on-surface-variant mb-unit-lg">Connect tracking services to monitor site traffic and conversions.</p>

              <div className="space-y-unit-md max-w-lg">
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Google Analytics (GA4) Measurement ID</label>
                  <input value={integrations.gaTrackingId} onChange={(e) => setIntegrations({ ...integrations, gaTrackingId: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm font-mono text-xs" placeholder="G-XXXXXXXXXX" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Facebook Pixel ID</label>
                  <input value={integrations.fbPixelId} onChange={(e) => setIntegrations({ ...integrations, fbPixelId: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm font-mono text-xs" placeholder="1234567890" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-unit-md">
          <button onClick={handleSave} disabled={saving} className="bg-primary text-white px-unit-lg py-unit-sm rounded-lg font-label-md text-label-md hover:bg-primary-fixed-dim transition-all flex items-center gap-2 disabled:opacity-50">
            <span className="material-symbols-outlined text-sm">save</span>{saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
