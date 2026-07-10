import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";
import { ok, err } from "@/lib/utils";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { books: true } } },
  });
  return ok(categories);
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return err("Unauthorized", 401);

    const body = await req.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0].message);

    const category = await prisma.category.create({ data: parsed.data });
    return ok(category, 201);
  } catch {
    return err("Something went wrong", 500);
  }
}
