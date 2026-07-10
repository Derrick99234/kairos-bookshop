import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { bookWithVariantsSchema, bookSchema } from "@/lib/validations";
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

  const [books, total, allBooksCount, outOfStock, lowStock, totalValue] = await Promise.all([
    prisma.book.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: true,
        variants: true,
        _count: { select: { reviews: true, orderItems: true } },
      },
    }),
    prisma.book.count({ where }),
    prisma.book.count(),
    prisma.book.count({ where: { variants: { none: { stock: { gt: 0 } } } } }),
    prisma.book.count({ where: { variants: { some: { stock: { gt: 0, lte: 5 } } } } }),
    prisma.bookVariant.aggregate({ _sum: { price: true } }),
  ]);

  let filtered = books;
  if (status === "active") {
    filtered = books.filter((b) => b.variants.some((v) => v.stock > 5));
  } else if (status === "low") {
    filtered = books.filter((b) => b.variants.some((v) => v.stock > 0 && v.stock <= 5));
  } else if (status === "out") {
    filtered = books.filter((b) => b.variants.every((v) => v.stock === 0));
  }

  return ok({
    books: filtered,
    total,
    page,
    pages: Math.ceil(total / limit),
    stats: {
      totalSku: allBooksCount,
      outOfStock,
      lowStock,
      totalValue: totalValue._sum.price || 0,
    },
  });
}

export async function POST(req: Request) {
  if (!(await checkAdmin())) return err("Forbidden", 403);

  try {
    const body = await req.json();
    const { variants, ...bookData } = body;
    const parsedBook = bookSchema.safeParse(bookData);
    if (!parsedBook.success) return err(parsedBook.error.issues[0].message);

    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return err("At least one variant is required");
    }

    const existing = await prisma.book.findUnique({ where: { slug: parsedBook.data.slug } });
    if (existing) return err("A book with this slug already exists");

    const book = await prisma.book.create({
      data: {
        ...parsedBook.data,
        variants: {
          create: variants.map((v: { format: string; price: number; comparePrice?: number; stock?: number; sku?: string }) => ({
            format: v.format,
            price: v.price,
            comparePrice: v.comparePrice || 0,
            stock: v.stock || 0,
            sku: v.sku || "",
          })),
        },
      },
      include: { variants: true },
    });

    return ok(book, 201);
  } catch (e) {
    console.error(e);
    return err("Something went wrong", 500);
  }
}
