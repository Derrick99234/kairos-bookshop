# Kairos Bookshop — Project Scope

**Client:** Gospel Pillars (Dr. Isaiah Wealth)
**Developer:** Deritech Innovations Limited
**Stack:** Next.js (TypeScript) + Prisma + PostgreSQL + Paystack
**Admin:** Built-in (protected routes, no separate backend)

---

## Brand Assets

| Asset | Source |
|-------|--------|
| Logo | `kairos-logo.png` (downloaded) |
| Favicon | `kairos-favicon.png` (downloaded) |
| Colors | Extract from logo (gold/cream + dark tones) |
| Font | Poppins or Inter (clean, professional) |

**Contact Info from current site:**
- Phone: +234 8135672235
- Email: TBD (site doesn't show one)
- WhatsApp: wa.me/2348135672235
- Address: 11 Kudirat Abiola Way, Alausa, Ikeja, Lagos, Nigeria

**Social Links:**
- YouTube: @ArkofLightforallNations
- Facebook: /arkoflightforallnations
- Instagram: @gospelpillars

---

## Pages

### Public Pages
1. **Home** — Hero, featured books, categories, about snippet
2. **Shop** — All books with search/filter by category
3. **Book Detail** — Title, author, description, price, variants, add to cart
4. **About** — About Dr. Isaiah Wealth, ministry info
5. **Contact** — Phone, WhatsApp, address, contact form
6. **Cart** — Cart items, quantities, total
7. **Checkout** — Paystack payment integration
8. **My Account** — Orders, profile

### Admin Pages
1. **Dashboard** — Stats (orders, revenue, books)
2. **Books** — CRUD (add/edit/delete books)
3. **Orders** — View orders, update status
4. **Categories** — Manage book categories
5. **Settings** — Site info, social links, contact

---

## Data Model

```
Book
  - id, title, slug, description
  - author, price, sale_price
  - images[], category_id
  - variants[] (e.g. paperback, hardcover)
  - featured, best_selling, top_rated (booleans)
  - created_at, updated_at

Category
  - id, name, slug, description
  - books[]

Variant
  - id, name (e.g. "Paperback", "Hardcover")
  - price_adjustment
  - stock

Order
  - id, customer_name, email, phone
  - items[], total, status
  - payment_reference (Paystack)
  - created_at

User (for admin)
  - id, email, password, role (admin)
```

---

## Categories (from current site)

- Spiritual Warfare (5)
- Spiritual Growth (15)
- Revival (5)
- Prosperity (2)
- Prophetic (2)
- Prayer (20)
- Pastoral Ministry & Church Growth (27)
- Healing (5)
- Faith (7)
- Breakthrough (15)

---

## Tech Decisions

| Decision | Choice |
|----------|--------|
| Stack | Next.js (TypeScript) |
| Styling | Tailwind CSS |
| Database | PostgreSQL (via Supabase) |
| ORM | Prisma |
| Auth | NextAuth.js (admin only) |
| Payments | Paystack |
| Admin | Protected routes in same app |
| Hosting | Vercel |

---

## Build Plan (One Feature Per Day)

### Week 1 — Foundation
1. Project setup (Next.js, Tailwind, Prisma, Supabase)
2. Auth system (admin login)
3. Database schema + seed data
4. Home page (hero, featured books)
5. Layout (header, footer, navigation)
6. Category pages
7. Shop page (grid + filters)

### Week 2 — Book Detail + Cart
8. Book detail page (images, variants, price)
9. Cart (add/remove/update)
10. Checkout page
11. Paystack integration
12. Order confirmation page
13. About + Contact pages
14. My Account (order history)

### Week 3 — Admin Panel
15. Admin dashboard (stats)
16. Admin books CRUD
17. Admin categories CRUD
18. Admin orders management
19. Admin settings
20. Image upload (Cloudinary)
21. SEO + meta tags

### Week 4 — Polish + Launch
22. Search functionality
23. Responsive design fixes
24. Error handling + loading states
25. Performance optimization
26. Testing + QA
27. Deploy to Vercel
28. Seed real products + launch

---

## Domain
- Already owned: **kairosbookshop.org** (expires 2027-02-06 ✅)

---

*Created: June 24, 2026*
