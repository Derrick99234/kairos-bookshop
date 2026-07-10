import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { blogSchema } from "@/lib/validations";
import { ok, err } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return err("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const q = searchParams.get("q") || "";
  const published = searchParams.get("published");

  const where: Record<string, unknown> = {};
  if (q) where.OR = [{ title: { contains: q, mode: "insensitive" } }];
  if (published === "true") where.published = true;
  else if (published === "false") where.published = false;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return ok({ posts, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return err("Unauthorized", 401);

  try {
    const body = await req.json();
    const parsed = blogSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0].message);

    const existing = await prisma.blogPost.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) return err("A post with this slug already exists");

    const post = await prisma.blogPost.create({ data: parsed.data });
    return ok(post, 201);
  } catch {
    return err("Something went wrong", 500);
  }
}
