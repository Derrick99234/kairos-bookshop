"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Invalid credentials");
        return;
      }
      router.push("/admin");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-unit-md">
      <div className="w-full max-w-md">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-unit-lg shadow-sm">
          <div className="text-center mb-unit-lg">
            <div className="w-14 h-14 bg-primary-container rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-on-primary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
            </div>
            <h1 className="font-headline-xl text-headline-lg text-primary">Kairos Admin</h1>
            <p className="font-label-md text-label-md text-outline uppercase tracking-wider mt-1">Admin Portal</p>
            <p className="text-sm text-on-surface-variant mt-3 max-w-xs mx-auto">Secure gateway for Kairos Bookshop stewardship and catalog management.</p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-unit-lg text-xs text-on-surface-variant bg-surface-container-low py-2 px-4 rounded-lg">
            <span className="material-symbols-outlined text-sm text-green-600">verified_user</span>
            <span>Encrypted Session</span>
          </div>

          <h2 className="font-headline-md text-headline-md text-on-surface mb-1">Welcome Back</h2>
          <p className="text-sm text-on-surface-variant mb-unit-md">Please enter your administrative credentials.</p>

          <form onSubmit={handleSubmit} className="space-y-unit-md">
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">mail</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-10 pl-9 pr-3 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="admin@kairos.com" required />
              </div>
            </div>

            <div>
              <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">lock</span>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-10 pl-9 pr-10 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface">
                  <span className="material-symbols-outlined text-sm">{showPassword ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
              <div className="text-right mt-1">
                <a href="/forgot-password" className="text-xs text-primary hover:underline">Forgot Password?</a>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded border-outline text-primary focus:ring-primary" />
              <span className="text-sm text-on-surface-variant">Remember device</span>
            </label>

            {error && <div className="text-sm text-secondary bg-red-50 border border-red-200 px-unit-sm py-unit-xs rounded-lg">{error}</div>}

            <button type="submit" disabled={loading} className="w-full bg-primary text-white font-label-md py-3 rounded-lg hover:bg-primary-fixed-dim transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">login</span>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        <div className="text-center mt-unit-md">
          <div className="flex items-center justify-center gap-1 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-xs">shield_lock</span>
            <span>Authorized Access Only</span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">&copy; 2024 Kairos Bookshop. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
}
