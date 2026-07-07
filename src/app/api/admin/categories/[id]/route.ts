import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err } from "@/lib/utils";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user?.id || (session.user as { role: string }).role !== "ADMIN") {
    return false;
  }
  return true;
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return err("Forbidden", 403);

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, slug, description, imageUrl } = body;
    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, description, imageUrl },
    });
    return ok(category);
  } catch {
    return err("Something went wrong", 500);
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return err("Forbidden", 403);

  try {
    const { id } = await params;
    await prisma.category.delete({ where: { id } });
    return ok({ message: "Category deleted" });
  } catch {
    return err("Something went wrong", 500);
  }
}
