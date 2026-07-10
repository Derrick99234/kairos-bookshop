# Kairos Bookshop — Production Checklist

> Updated: July 9, 2026
> Everything still needed before going live.

---

## 🔑 Needs Your Input (6 items)

| # | Item | Where | What To Do |
|---|------|-------|------------|
| 1 | **Paystack Secret Key** | `.env` line 27 | Uncomment and set your live `sk_live_...` key |
| 2 | **`NEXT_PUBLIC_APP_URL`** | `.env` line 15 | Change `http://localhost:3000` to your production domain |
| 3 | **Google OAuth Redirect URI** | Google Cloud Console | Add `http://localhost:3000/api/auth/callback/google` (dev) and `https://yourdomain.com/api/auth/callback/google` (prod) to **Authorized redirect URIs** |
| 4 | **Images** (books, categories, blog, author photo) | `/public/images/` + About page | Upload actual images or host externally. Seed references `/images/books/*.jpg`, `/images/categories/*.jpg`, `/images/blog/*.jpg`. Author photo uses Google CDN URL |
| 5 | **Social Media / Business Info** | Contact page | Update YouTube/Facebook/Instagram URLs, WhatsApp number, address, and phone to your real business info |
| 6 | **`AUTH_SECRET`** | `.env` line 12 | Regenerate for production: `openssl rand -hex 32` |

---

## 🛠 Needs Code Fix (10 items)

| # | Priority | Page/File | Issue | Fix |
|---|----------|-----------|-------|-----|
| 1 | **High** | `src/app/books/[slug]/page.tsx` | Duplicate `"use client"` on lines 1 and 3 — build will fail | Remove one |
| 2 | **High** | `src/app/layout.tsx` line 16 | CDN Tailwind script conflicts with PostCSS build — custom theme may break in production | Remove CDN script, ensure PostCSS config has all custom theme values |
| 3 | **High** | `src/app/api/books/route.ts` POST | Anyone can create books without auth | Add admin-only check |
| 4 | **High** | `src/app/api/categories/route.ts` POST | Anyone can create categories without auth | Add admin-only check |
| 5 | **High** | Middleware (`middleware.ts`) | `/admin/*` routes not protected — matcher missing admin paths | Add `/admin/:path*` to middleware matcher |
| 6 | **Medium** | Admin pages (Dashboard, Books, Orders, Customers) | Revenue/stats shown in **$** (USD) instead of **₦** (NGN) | Change all `$` to `₦` in admin page.tsx files |
| 7 | **Medium** | `src/app/checkout/page.tsx` | Creates duplicate "Shipping" address on every checkout | Check for existing addresses before creating, or reuse last used |
| 8 | **Medium** | `src/app/admin/orders/page.tsx` | CSV export uses `$` values | Change to `₦` |
| 9 | **Medium** | `src/app/admin/books/page.tsx` | Search debounce has stale closure | Fix dependency tracking in useEffect |
| 10 | **Low** | `src/app/admin/settings/page.tsx` | 2FA toggle shows "not yet available" | Either implement or remove the toggle |

---

## 🧩 Missing Features (12 items)

| # | Priority | Feature | Why |
|---|----------|---------|-----|
| 1 | **Medium** | **Error pages** — `not-found.tsx`, `error.tsx` | Users see generic Next.js 404/500 pages |
| 2 | **Medium** | **Sitemap** — `src/app/sitemap.ts` | Required for SEO |
| 3 | **Medium** | **Robots.txt** — `src/app/robots.ts` | Required for SEO |
| 4 | **Medium** | **Stock decrement on order** | Inventory never decreases when books are sold |
| 5 | **Medium** | **`next.config.ts`** — add `images.domains` | Needed if hosting images externally |
| 6 | **Low** | **Blog admin UI** | No way to create/edit blog posts from admin |
| 7 | **Low** | **Contact inquiry admin view** | Submissions go to DB but admin can't see/reply |
| 8 | **Low** | **Newsletter admin view** | Subscribers stored but no admin export/list |
| 9 | **Low** | **Search bar in header** | Search only available on homepage |
| 10 | **Low** | **Analytics injection** | GA4/Facebook Pixel IDs stored in Settings but never injected into pages |
| 11 | **Low** | **`loading.tsx` / `error.tsx`** | No route-level loading/error boundaries |
| 12 | **Low** | **Rate limiting** | No brute-force protection on auth endpoints |

---

## Summary

| Category | Count | Action Needed |
|----------|-------|---------------|
| 🔑 Needs Your Input | **6** | Credentials, images, content from you |
| 🛠 Needs Code Fix | **10** | I can code these |
| 🧩 Missing Features | **12** | Nice-to-haves, can be done after launch |
| **Total** | **28** | |

---

## Recommended Order

1. **You provide** Paystack key, production URL, and AUTH_SECRET
2. **I fix** the 10 code items (can batch in a few commits)
3. **You add** Google OAuth redirect URI in Cloud Console
4. **You upload** images and update business info
5. **After launch** we tackle the 12 missing features
