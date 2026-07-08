import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { bookSchema } from "@/lib/validations";
import { ok, err } from "@/lib/utils";
import { NextRequest } from "next/server";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user?.id || (session.user as { role: string }).role !== "ADMIN") {
    return false;
  }
  return true;
}

export async function GET(req: NextRequest) {
  if (!(await checkAdmin())) return err("Forbidden", 403);

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { author: { contains: search } },
    ];
  }
  if (category) where.categoryId = category;
  if (status === "active") where.stock = { gt: 5 };
  else if (status === "low") where.stock = { gt: 0, lte: 5 };
  else if (status === "out") where.stock = 0;

  const [books, total, stats] = await Promise.all([
    prisma.book.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { category: true, _count: { select: { reviews: true, orderItems: true } } },
    }),
    prisma.book.count({ where }),
    Promise.all([
      prisma.book.count(),
      prisma.book.count({ where: { stock: 0 } }),
      prisma.book.count({ where: { stock: { gt: 0, lte: 5 } } }),
      prisma.book.aggregate({ _sum: { price: true } }),
    ]),
  ]);

  return ok({
    books,
    total,
    page,
    pages: Math.ceil(total / limit),
    stats: {
      totalSku: stats[0],
      outOfStock: stats[1],
      lowStock: stats[2],
      totalValue: stats[3]._sum.price || 0,
    },
  });
}

export async function POST(req: Request) {
  if (!(await checkAdmin())) return err("Forbidden", 403);

  try {
    const body = await req.json();
    const parsed = bookSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0].message);

    const book = await prisma.book.create({ data: parsed.data });
    return ok(book, 201);
  } catch {
    return err("Something went wrong", 500);
  }
}
