import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";
import { ok, err } from "@/lib/utils";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user?.id || (session.user as { role: string }).role !== "ADMIN") {
    return false;
  }
  return true;
}

export async function GET() {
  if (!(await checkAdmin())) return err("Forbidden", 403);

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { books: true } } },
  });

  return ok(categories);
}

export async function POST(req: Request) {
  if (!(await checkAdmin())) return err("Forbidden", 403);

  try {
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0].message);

    const category = await prisma.category.create({ data: parsed.data });
    return ok(category, 201);
  } catch {
    return err("Something went wrong", 500);
  }
}
