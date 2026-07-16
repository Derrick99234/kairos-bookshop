import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err } from "@/lib/utils";
import { NextRequest } from "next/server";

function getDateRange(filter: string): Date | null {
  const now = new Date();
  switch (filter) {
    case "today": {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return start;
    }
    case "week": {
      const day = now.getDay();
      const diff = day === 0 ? 6 : day - 1;
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
      return start;
    }
    case "month":
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case "year":
      return new Date(now.getFullYear(), 0, 1);
    default:
      return null;
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || (session.user as { role: string }).role !== "ADMIN") {
    return err("Forbidden", 403);
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const status = searchParams.get("status") || "";
  const dateFilter = searchParams.get("date") || "";
  const q = searchParams.get("q") || "";

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const dateFrom = getDateRange(dateFilter);
  if (dateFrom) where.createdAt = { gte: dateFrom };

  if (q) {
    where.OR = [
      { orderNumber: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    orders, total, allOrders, prevOrders,
    processingCount, shippedToday, prevRevenue,
  ] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { items: true, user: { select: { name: true, email: true } }, shippingAddress: true },
    }),
    prisma.order.count({ where }),
    prisma.order.aggregate({ where: { createdAt: { gte: thirtyDaysAgo } }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } }, _sum: { total: true } }),
    prisma.order.count({ where: { status: { in: ["PROCESSING", "CONFIRMED"] } } }),
    prisma.order.count({ where: { createdAt: { gte: todayStart }, status: { in: ["SHIPPED", "DELIVERED"] } } }),
    prisma.order.aggregate({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } }, _sum: { total: true } }),
  ]);

  const allOrdersCount = await prisma.order.count();

  const currentRevenue = allOrders._sum.total || 0;
  const prevRevenueTotal = prevRevenue._sum.total || 0;
  const revenueTrend = prevRevenueTotal > 0 ? ((currentRevenue - prevRevenueTotal) / prevRevenueTotal) * 100 : 0;

  return ok({
    orders,
    total: allOrdersCount,
    page,
    pages: Math.ceil(total / limit),
    stats: {
      totalOrders: allOrdersCount,
      processing: processingCount,
      shippedToday: shippedToday,
      totalRevenue: currentRevenue + prevRevenueTotal,
      revenueTrend: Math.round(revenueTrend * 10) / 10,
    },
  });
}
