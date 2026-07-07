import { prisma } from "@/lib/prisma";
import { bookSchema } from "@/lib/validations";
import { ok, err } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const featured = searchParams.get("featured");

  const where: Record<string, unknown> = { published: true };

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { author: { contains: search } },
    ];
  }

  if (category) where.categoryId = category;
  if (featured === "true") where.featured = true;

  const orderBy: Record<string, string> =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { category: true },
    }),
    prisma.book.count({ where }),
  ]);

  return ok({ books, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: Request) {
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
