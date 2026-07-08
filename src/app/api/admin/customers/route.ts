import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { signupSchema } from "@/lib/validations";
import { ok, err } from "@/lib/utils";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return err("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const q = searchParams.get("q") || "";
  const status = searchParams.get("status") || "";
  const spending = searchParams.get("spending") || "";
  const lastOrder = searchParams.get("lastOrder") || "";

  const where: Record<string, unknown> = { role: "CUSTOMER" };

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  const now = new Date();
  let orderDateFilter: Date | null = null;
  if (lastOrder === "30") orderDateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  else if (lastOrder === "90") orderDateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  else if (lastOrder === "365") orderDateFilter = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  const [customers, total, allOrders] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        _count: { select: { orders: true } },
        orders: { select: { total: true, createdAt: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({ select: { userId: true, total: true } }),
  ]);

  let filtered = customers;

  if (orderDateFilter) {
    filtered = filtered.filter((c) =>
      c.orders.some((o) => new Date(o.createdAt) >= orderDateFilter!)
    );
  }

  if (status === "active") {
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    filtered = filtered.filter((c) =>
      c.orders.some((o) => new Date(o.createdAt) >= thirtyDaysAgo)
    );
  } else if (status === "inactive") {
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    filtered = filtered.filter((c) =>
      c.orders.length === 0 || c.orders.every((o) => new Date(o.createdAt) < ninetyDaysAgo)
    );
  }

  if (spending === "high") {
    filtered = filtered.filter((c) => c.orders.reduce((s, o) => s + o.total, 0) > 100);
  } else if (spending === "medium") {
    filtered = filtered.filter((c) => {
      const t = c.orders.reduce((s, o) => s + o.total, 0);
      return t >= 20 && t <= 100;
    });
  } else if (spending === "low") {
    filtered = filtered.filter((c) => {
      const t = c.orders.reduce((s, o) => s + o.total, 0);
      return t > 0 && t < 20;
    });
  }

  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const activeThisMonth = await prisma.order.groupBy({
    by: ["userId"],
    where: { createdAt: { gte: firstOfMonth } },
    _count: true,
  });

  const customersWithOrders = allOrders.length;
  const repeatCustomers = new Set(
    allOrders
      .map((o) => o.userId)
      .filter((id, i, arr) => arr.indexOf(id) !== arr.lastIndexOf(id))
  );

  return ok({
    customers: filtered,
    total,
    page,
    pages: Math.ceil(total / limit),
    stats: {
      totalCustomers: total,
      activeThisMonth: activeThisMonth.length,
      avgLifetimeValue: customersWithOrders > 0
        ? allOrders.reduce((s, o) => s + o.total, 0) / customersWithOrders
        : 0,
      retentionRate: customersWithOrders > 0
        ? Math.round((repeatCustomers.size / customersWithOrders) * 100)
        : 0,
    },
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return err("Unauthorized", 401);

  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0].message);

    const { name, email, password, phone } = parsed.data;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return err("Email already registered", 409);

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, phone: phone || "", role: "CUSTOMER" },
    });

    await prisma.cart.create({ data: { userId: user.id } });

    return ok({ id: user.id, name: user.name, email: user.email }, 201);
  } catch {
    return err("Something went wrong", 500);
  }
}
