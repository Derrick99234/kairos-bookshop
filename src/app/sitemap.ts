import { prisma } from "@/lib/prisma";

const BASE_URL = "https://kairosbookshop.org";

export default async function sitemap() {
  const books = await prisma.book.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const categories = await prisma.category.findMany({
    select: { slug: true },
  });

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${BASE_URL}/books`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE_URL}/terms-of-service`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE_URL}/shipping-info`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE_URL}/returns`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
  ];

  const bookPages = books.map((b) => ({
    url: `${BASE_URL}/books/${b.slug}`,
    lastModified: b.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const categoryPages = categories.map((c) => ({
    url: `${BASE_URL}/books?category=${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const blogPages = posts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...bookPages, ...categoryPages, ...blogPages];
}
