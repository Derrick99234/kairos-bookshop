"use client";

import { useState } from "react";

interface Props {
  dark?: boolean;
  className?: string;
}

export default function NewsletterForm({ dark, className = "" }: Props) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true);
    setEmail("");
  }

  if (sent) {
    return <p className={`text-sm ${dark ? "text-white/80" : "text-on-surface-variant"}`}>Thank you for subscribing!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full h-10 px-4 rounded-lg border outline-none text-sm ${dark ? "bg-white/10 text-white placeholder-white/50 border-white/20 focus:border-white" : "bg-surface-container-low border-outline-variant text-on-surface focus:border-primary"}`} placeholder="Your email..." type="email" required />
      <button type="submit" className={`absolute right-1 top-1 h-8 w-8 rounded-md flex items-center justify-center ${dark ? "bg-white text-primary" : "bg-primary text-white"}`}>
        <span className="material-symbols-outlined text-sm">send</span>
      </button>
    </form>
  );
}
