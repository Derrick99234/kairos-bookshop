# Kairos Bookshop — Production Checklist

> Updated: July 10, 2026

## 🔑 Needs Your Input

| # | Item | Where | What To Do |
|---|------|-------|------------|
| 1 | **`NEXT_PUBLIC_APP_URL`** | `.env` line 15 | Change `http://localhost:3000` to your production domain |
| 2 | **Google OAuth Redirect URI** | Google Cloud Console | Add `http://localhost:3000/api/auth/callback/google` (dev) and `https://yourdomain.com/api/auth/callback/google` (prod) to **Authorized redirect URIs** |
| 3 | **Images** (books, categories, blog, author photo) | `/public/images/` + About page | Upload actual images or host externally. Seed references `/images/books/*.jpg`, `/images/categories/*.jpg`, `/images/blog/*.jpg`. Author photo uses Google CDN URL |
| 4 | **Social Media / Business Info** | Contact page | Update YouTube/Facebook/Instagram URLs, WhatsApp number, address, and phone to your real business info |
