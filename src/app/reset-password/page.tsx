"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const password = form.get("password") as string;
    const confirmPassword = form.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    setMessage("Password reset successfully! Redirecting to sign in...");
    setTimeout(() => router.push("/signin"), 2000);
  }

  if (!token) {
    return (
      <div className="w-full max-w-md bg-surface dark:bg-surface-dim rounded-modal shadow-sm border border-outline-variant/30 p-unit-lg md:p-unit-xl text-center">
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-unit-md">Invalid Link</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-unit-lg">This reset link is invalid or has expired.</p>
        <a href="/forgot-password" className="text-primary hover:text-primary-fixed-dim font-label-md text-label-md">Request a new link</a>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-surface dark:bg-surface-dim rounded-modal shadow-sm border border-outline-variant/30 p-unit-lg md:p-unit-xl">
      <div className="text-center mb-unit-lg">
        <div className="flex items-center justify-center gap-unit-sm mb-unit-md">
          <img alt="Kairos Bookshop Logo" className="h-10 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AP1WRLssB72y_9TyQKRY0cJqNLYUpwfxcngfFJ1MIQHVkqvUrXVeLY2QX6DrPkxXoN4tq_wkO7HsGY1bm0KFm-NHislOYg_V2IxMB_kVA-5IUI322A8dEQy11gapZReo6UMmSnCc5LvGPzWaORmWfX8ug2e67wpNS8-R9CBqsayE66AolDax4iXUXgwFTvXfDEC_Ya4Qasn72DZag8B185lQs-d8Pec1J9t7MsbOGQlpOa63CdSG701LcXbkHjaY" />
          <span className="font-headline-md text-headline-md font-bold text-primary">Kairos Bookshop</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Set New Password</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-unit-xs">Enter your new password below.</p>
      </div>

      <form className="space-y-unit-md" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-error-container/20 text-error font-body-md text-body-md p-unit-sm rounded-input text-center">{error}</div>
        )}
        {message && (
          <div className="bg-tertiary-container/20 text-tertiary font-body-md text-body-md p-unit-sm rounded-input text-center">{message}</div>
        )}

        <div>
          <label className="font-label-md text-label-md text-on-surface-variant mb-unit-xs block" htmlFor="password">New Password</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl pointer-events-none">lock</span>
            <input id="password" name="password" type="password" placeholder="New password" required className="w-full h-12 pl-10 pr-4 bg-transparent border border-outline/40 rounded-input focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 transition-all duration-200" />
          </div>
        </div>

        <div>
          <label className="font-label-md text-label-md text-on-surface-variant mb-unit-xs block" htmlFor="confirmPassword">Confirm Password</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl pointer-events-none">lock</span>
            <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm password" required className="w-full h-12 pl-10 pr-4 bg-transparent border border-outline/40 rounded-input focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 transition-all duration-200" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full h-12 bg-primary hover:bg-primary-fixed-dim text-on-primary font-label-md text-label-md rounded-button transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-unit-sm disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? "Resetting..." : "Reset Password"}
          <span className="material-symbols-outlined text-lg">lock_reset</span>
        </button>
      </form>

      <div className="bg-primary-container/10 rounded-modal p-unit-md mt-unit-lg text-center">
        <p className="font-body-md text-body-md text-on-surface-variant">
          <a href="/signin" className="text-primary hover:text-primary-fixed-dim font-label-md text-label-md transition-colors">Back to Sign In</a>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex-grow flex items-center justify-center bg-surface-container-low min-h-[calc(100vh-64px)] px-margin-mobile md:px-margin-desktop py-unit-xl">
      <Suspense fallback={<div className="w-full max-w-md bg-surface dark:bg-surface-dim rounded-modal shadow-sm border border-outline-variant/30 p-unit-lg md:p-unit-xl text-center font-body-md text-body-md text-on-surface-variant">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
