import { prisma } from "@/lib/prisma";
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
      { title: { contains: search, mode: "insensitive" } },
      { author: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category) where.categoryId = category;
  if (featured === "true") where.featured = true;

  const orderBy: Record<string, string> =
    sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { category: true, variants: true },
    }),
    prisma.book.count({ where }),
  ]);

  return ok({ books, total, page, pages: Math.ceil(total / limit) });
}
