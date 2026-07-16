"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Failed to send"); return; }
      setSent(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch { setError("Something went wrong"); }
    finally { setSending(false); }
  }

  return (
    <main className="flex-grow pt-32 pb-unit-xl">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-unit-xl">
          <h1 className="font-headline-xl text-2xl md:text-headline-xl text-primary">Contact Us</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">We&apos;d love to hear from you. Get in touch with our team.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-unit-md">Send us a Message</h2>
            {sent ? (
              <div className="text-center py-unit-lg">
                <span className="material-symbols-outlined text-5xl text-green-500 mb-3">check_circle</span>
                <p className="font-body-md text-on-surface-variant">Thank you for your message! We&apos;ll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-unit-md">
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Full Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" required />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" required />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Phone (optional)</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full h-10 px-unit-sm bg-surface-container-low border border-outline-variant rounded-lg text-sm" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">Message *</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full h-32 px-unit-sm py-unit-xs bg-surface-container-low border border-outline-variant rounded-lg text-sm resize-none" required />
                </div>
                {error && <div className="text-sm text-secondary bg-red-50 border border-red-200 px-unit-sm py-unit-xs rounded-lg">{error}</div>}
                <button type="submit" disabled={sending} className="bg-primary text-white font-label-md py-4 px-unit-lg rounded-lg hover:bg-primary-fixed-dim transition-all active:scale-95 disabled:opacity-50 w-full">
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-unit-md">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-unit-md">Contact Information</h2>
              <div className="space-y-unit-md">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <div><p className="font-label-md">Address</p><p className="text-sm text-on-surface-variant">180 Freedom Way, After Renee Supermarket, Off Admiralty Way, Lekki Phase 1, Lekki</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary">call</span>
                  <div><p className="font-label-md">Phone</p><p className="text-sm text-on-surface-variant">+234 813 567 2235</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary">alternate_email</span>
                  <div><p className="font-label-md">Email</p><p className="text-sm text-on-surface-variant">info@kairosbookshop.org</p></div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-unit-md">Follow Us</h2>
              <div className="flex gap-3">
                {[
                  { icon: "play_circle", label: "YouTube", url: "https://youtube.com/@kairosbookshop" },
                  { icon: "facebook", label: "Facebook", url: "https://facebook.com/kairosbookshop" },
                  { icon: "photo_camera", label: "Instagram", url: "https://instagram.com/kairosbookshop" },
                ].map((s) => (
                  <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white transition-all cursor-pointer">
                    <span className="material-symbols-outlined">{s.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-primary-container rounded-xl p-unit-lg text-white">
              <h3 className="font-headline-md text-headline-md mb-unit-sm">Need Prayer?</h3>
              <p className="text-sm mb-unit-md">Our team is here to pray with you and support you spiritually.</p>
              <a href="https://wa.me/2348135672235" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-primary font-label-md px-unit-md py-unit-sm rounded-lg hover:brightness-95 transition-all">
                <span className="material-symbols-outlined text-sm">chat</span>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
