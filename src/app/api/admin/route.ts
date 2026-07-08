import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || (session.user as { role: string }).role !== "ADMIN") {
    return err("Forbidden", 403);
  }

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    totalOrders, totalRevenue, totalBooks, totalUsers,
    recentOrders, categories, lowStockBooks,
    lastMonthOrders, lastMonthRevenue,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.book.count(),
    prisma.user.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: { select: { title: true, quantity: true } }, user: { select: { name: true, email: true } } },
    }),
    prisma.category.findMany({
      include: { _count: { select: { books: true } } },
    }),
    prisma.book.findMany({
      where: { stock: { lte: 5 } },
      select: { title: true, stock: true, slug: true, imageUrl: true },
      orderBy: { stock: "asc" },
    }),
    prisma.order.count({ where: { createdAt: { gte: firstOfLastMonth, lt: firstOfMonth } } }),
    prisma.order.aggregate({ where: { createdAt: { gte: firstOfLastMonth, lt: firstOfMonth } }, _sum: { total: true } }),
  ]);

  const lastMonthTotal = lastMonthRevenue._sum.total || 0;
  const revenueTrend = lastMonthTotal > 0 ? ((totalRevenue._sum.total || 0) - lastMonthTotal) / lastMonthTotal * 100 : 0;
  const orderTrend = lastMonthOrders > 0 ? (totalOrders - lastMonthOrders) / lastMonthOrders * 100 : 0;

  const totalCatBooks = categories.reduce((s, c) => s + c._count.books, 0);
  const categoriesWithPct = categories.map((c) => ({
    name: c.name,
    books: c._count.books,
    pct: totalCatBooks > 0 ? Math.round((c._count.books / totalCatBooks) * 100) : 0,
  }));

  return ok({
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    totalBooks,
    totalUsers,
    revenueTrend: Math.round(revenueTrend * 10) / 10,
    orderTrend: Math.round(orderTrend * 10) / 10,
    recentOrders,
    categories: categoriesWithPct,
    lowStockBooks,
  });
}
