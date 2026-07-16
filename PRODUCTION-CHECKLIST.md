# Kairos Bookshop — Production Checklist

> Updated: July 16, 2026

---

## 🔑 Needs Your Input

| # | Item | Where | What To Do |
|---|------|-------|------------|
| 1 | **`NEXT_PUBLIC_APP_URL`** | `.env` line 15 | Change `http://localhost:3000` to your production domain |
| 2 | **Google OAuth Redirect URI** | Google Cloud Console | Add `https://yourdomain.com/api/auth/callback/google` to **Authorized redirect URIs** in Google Cloud Console |
| 3 | **Images** (books, categories, blog, author photo) | `/public/images/` + About page | Upload actual images or host externally. Seed references `/images/books/*.jpg`, `/images/categories/*.jpg`, `/images/blog/*.jpg`. Author photo uses Google CDN URL |
| 4 | **Social Media / Business Info** | Contact page | Update YouTube/Facebook/Instagram URLs, WhatsApp number, address, and phone to your real business info |
| 5 | **SMTP credentials** | Admin → Settings → Integrations | Configure SMTP for transactional emails (order confirmations, password resets). Without this, users get **no emails** — the app silently succeeds without sending |
| 6 | **Paystack live keys** | Admin → Settings → Integrations | Switch from test keys to live Paystack public + secret keys for real payment processing |
| 7 | **Google Analytics & Facebook Pixel** | Admin → Settings → Integrations | Enter your GA tracking ID and FB Pixel ID — they are **not yet injected** into the frontend (see code task #5 below) |
| 8 | **Upload domain whitelist** | Google Cloud Console | If using Google Drive uploads, ensure the production domain is whitelisted in OAuth consent screen |

---

## 🔴 Must Fix Before Launch

| # | Item | Location | What To Do |
|---|------|----------|------------|
| 1 | **XSS in About page** | `src/app/about/page.tsx:127` | Replace `dangerouslySetInnerHTML` with a proper React `useEffect` for IntersectionObserver + hover animations |
| 2 | **Analytics/Pixel not injected** | Root layout (`src/app/layout.tsx`) | Google Analytics and FB Pixel config exists in settings but is never rendered in the `<head>` or `<body>` of any page. Must add `<Script>` tags to root layout |
| 3 | **`callbackUrl` lost on sign-in** | `src/app/signin/page.tsx:33` | Middleware sets `callbackUrl` param when redirecting to sign-in, but the sign-in form ignores it and always redirects to `/`. Users lose their intended destination |
| 4 | **Silent email failures** | `src/lib/email.ts` | `sendPasswordResetEmail` and `sendOrderConfirmation` silently return if SMTP is unconfigured. User sees "reset link sent" even when no email was dispatched. Log to console or show admin warning |
| 5 | **No .env.example** | Project root | Create `.env.example` with all keys documented (no secrets). Prevents future contributors from guessing what's needed |
| 6 | **Paystack secret key exposed to frontend** | `src/app/api/admin/settings/route.ts` | The settings API returns `paystackSecretKey` to the browser. Any admin can see it in network tab. Either mask it or serve it only to server-side code |
| 7 | **No stock validation on checkout** | `src/app/api/checkout/route.ts` | Stock is only decremented *after* payment succeeds. A race condition exists where two users could buy the last item. Add stock check + row-level locking or optimistic concurrency |

---

## 🟡 Should Address

| # | Item | Location | What To Do |
|---|------|----------|------------|
| 1 | **User dropdown doesn't close on click-outside** | `src/components/Header.tsx:75` | Add a click-outside handler or backdrop to the user menu dropdown |
| 2 | **Phone number not pre-filled on profile page** | `src/app/account/profile/page.tsx` | Fetch and display the current phone number instead of showing an empty field |
| 3 | **No saved address selector on checkout** | `src/app/checkout/page.tsx` | The checkout form has no "Use saved address" dropdown — users must re-type every time |
| 4 | **Address management silently swallows errors** | `src/app/account/addresses/page.tsx:58-67` | `handleDelete` and `setDefault` optimistically update UI but never roll back on API failure |
| 5 | **Wishlist remove silently swallows errors** | `src/app/account/wishlist/page.tsx:42` | Item removed from UI optimistically but never restored if API call fails |
| 6 | **Cart quantity/remove failures have no user feedback** | `src/app/cart/page.tsx` | When quantity update or remove fails, the UI rolls back silently. No toast or error message shown |
| 7 | **Blank page if book/order fetch fails unexpectedly** | `src/app/books/[slug]/page.tsx:139`, `src/app/account/orders/[id]/page.tsx:69` | `if (!data) return null` leaves user on blank page instead of showing an error state |
| 8 | **No rate limiting on auth endpoints** | `src/app/api/auth/signup`, forgot-password, reset-password, newsletter | No brute-force or spam protection on any public POST endpoint |
| 9 | **No CSRF protection** | All API routes | No double-submit cookie or CSRF token pattern on any non-GET endpoint |
| 10 | **No security headers** | `next.config.ts` | No `headers()` function setting CSP, HSTS, X-Frame-Options, etc. |
| 11 | **No health check endpoint** | `src/app/api/` | No `/api/health` route for monitoring/load-balancer pings |
| 12 | **No request timeout on Paystack fetch** | `src/lib/paystack.ts` | `fetch` calls to Paystack have no `AbortController` timeout — hangs indefinitely if Paystack is slow |
| 13 | **Auth authorize callback has no try/catch** | `src/lib/auth.ts:37-59` | DB connection error in the `authorize` callback throws unhandled, returns 500 instead of graceful error |

---

## 🟢 Nice to Have / Polish

| # | Item | Location | What To Do |
|---|------|----------|------------|
| 1 | **Newsletter section commented out on homepage** | `src/app/page.tsx` lines 330-343 | Either uncomment and wire up or remove the dead code |
| 2 | **`book.pages` no fallback** | `src/app/books/[slug]/page.tsx:215` | Show "N/A" when `pages` is null/0 |
| 3 | **Image gallery not implemented** | `src/app/books/[slug]/page.tsx` | The `images` field exists (JSON string array) but no gallery/carousel is rendered |
| 4 | **Checkout callback: wrong CTA when payment ref missing** | `src/app/checkout/callback/page.tsx:14` | Shows "View My Orders" but order may not exist. Better to show "Try Again" or "Return to Checkout" |
| 5 | **Account sidebar duplicated in every page** | `src/app/account/*/page.tsx` | Extract sidebar to an account layout to reduce duplication |
| 6 | **No client-side validation on checkout form** | `src/app/checkout/page.tsx` | Zod schemas exist in `validations.ts` but checkout form has no client-side validation before submit |
| 7 | **Orders API allows invalid status transitions** | `src/app/api/orders/[id]/status/route.ts` | No state machine — can transition from "DELIVERED" back to "PENDING". Should restrict valid transitions |
| 8 | **No database seed script** | Project root | Create a seed script with sample books, categories, blog posts for fresh installs |
| 9 | **Static pages are marked "use client" unnecessarily** | `privacy-policy`, `terms-of-service`, `shipping-info`, `returns` | These are pure static content — can be server components for better performance |
| 10 | **No database backup strategy** | Infrastructure | Add pg_dump cron job or backup service before going live |
| 11 | **No tests anywhere** | Project root | Zero unit, integration, or E2E tests. Start with critical paths (auth, checkout, cart) |
| 12 | **No Docker config** | Project root | No `Dockerfile` or `docker-compose.yml` for reproducible deployments |

---

## ✅ Already Done

| # | Item | Notes |
|---|------|-------|
| 1 | Loading states (skeletons) on all pages | Present on homepage, books, book detail, cart, checkout, all account pages |
| 2 | Empty states with CTAs | Cart, wishlist, orders, addresses all have well-designed empty states |
| 3 | Error boundaries at root + checkout + account levels | Root `error.tsx`, checkout `error.tsx`, account `error.tsx` all present |
| 4 | Dynamic sitemap + robots.txt | `sitemap.ts` covers books, categories, blog, static pages; `robots.ts` configured |
| 5 | Currency toggle (NGN/USD) with persistence | All price displays are currency-aware; toggle persisted to localStorage |
| 6 | Optimistic cart updates | Add, remove, and quantity update all use optimistic UI with rollback |
| 7 | Google Drive OAuth2 upload | Production-ready file upload with refresh token |
| 8 | Multi-currency pricing (NGN base, USD auto-calc) | Each variant has `priceUsd`/`comparePriceUsd` with manual override option |
| 9 | Order confirmation email with download links | Rich HTML email sent on payment verification (if SMTP configured) |
| 10 | Role-based access (CUSTOMER vs ADMIN) | Middleware + layout guarding for admin and account routes |
| 11 | Paystack payment integration | Full checkout flow with payment verification callback |
| 12 | Password reset flow | Forgot/reset password with token verification |
