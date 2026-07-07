import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations";
import { ok, err } from "@/lib/utils";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  return ok(categories);
}

export async function POST(req: Request) {
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
