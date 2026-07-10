# Kairos Bookshop — Production Checklist

> Updated: July 10, 2026

---

## ✅ Completed

| # | Item | Status |
|---|------|--------|
| 1 | **Paystack test keys** added to `.env` | ✅ Done |
| 2 | **Checkout flow** — shipping address saved, Paystack init with callback URL, payment verification, stock decrement, cart clear, order confirmation email | ✅ Done |
| 3 | **Error pages** — `not-found.tsx` (404), `error.tsx` (500) at root | ✅ Done |
| 4 | **Sitemap** — `src/app/sitemap.ts` with books, categories, blog posts | ✅ Done |
| 5 | **Robots.txt** — `src/app/robots.ts` allow all | ✅ Done |
| 6 | **Stock management** — decrements on payment, restores on cancel | ✅ Done |
| 7 | **Blog admin UI** — full CRUD with publish toggle | ✅ Done |
| 8 | **Contact inquiry admin view** — list, search, filter, CSV export | ✅ Done |
| 9 | **Newsletter admin view** — list, stats, CSV export | ✅ Done |
| 10 | **`loading.tsx` / `error.tsx`** — at root, books, blog, checkout, account | ✅ Done |
| 11 | **Product variations (BookVariant)** — HARDCOPY/SOFTCOPY/AUDIO_BOOK per book | ✅ Done |
| 12 | **77 CSV books imported** with real descriptions scraped from kairosbookshop.org | ✅ Done |
| 13 | **Homepage** — live autocomplete search, real products, sorted categories | ✅ Done |
| 14 | **Books page** — live debounced search (case-insensitive), category/sort filters | ✅ Done |
| 15 | **Book detail** — variant format selector, description section with collapse | ✅ Done |

---

## 🔑 Needs Your Input (4 items)

| # | Item | Where | What To Do |
|---|------|-------|------------|
| 1 | **`NEXT_PUBLIC_APP_URL`** | `.env` line 15 | Change `http://localhost:3000` to your production domain |
| 2 | **Google OAuth Redirect URI** | Google Cloud Console | Add `http://localhost:3000/api/auth/callback/google` (dev) and `https://yourdomain.com/api/auth/callback/google` (prod) to **Authorized redirect URIs** |
| 3 | **Images** (books, categories, blog, author photo) | `/public/images/` + About page | Upload actual images or host externally. Seed references `/images/books/*.jpg`, `/images/categories/*.jpg`, `/images/blog/*.jpg`. Author photo uses Google CDN URL |
| 4 | **Social Media / Business Info** | Contact page | Update YouTube/Facebook/Instagram URLs, WhatsApp number, address, and phone to your real business info |

---

## 🛠 Needs Code Fix (1 item)

| # | Priority | Page/File | Issue | Fix |
|---|----------|-----------|-------|-----|
| 1 | **High** | `next.config.ts` | `images.domains` not configured | Add remote image domains so Next.js can serve external images |

---

## Summary

| Category | Count | Action Needed |
|----------|-------|---------------|
| ✅ Completed | **15** | — |
| 🔑 Needs Your Input | **4** | Credentials, images, content from you |
| 🛠 Needs Code Fix | **1** | I can code this |
| **Total Remaining** | **5** | |
