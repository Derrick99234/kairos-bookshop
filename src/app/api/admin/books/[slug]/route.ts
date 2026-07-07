import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { bookSchema } from "@/lib/validations";
import { ok, err } from "@/lib/utils";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user?.id || (session.user as { role: string }).role !== "ADMIN") {
    return false;
  }
  return true;
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await checkAdmin())) return err("Forbidden", 403);

  try {
    const { slug } = await params;
    const body = await req.json();
    const parsed = bookSchema.partial().safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0].message);

    const book = await prisma.book.update({ where: { slug }, data: parsed.data });
    return ok(book);
  } catch {
    return err("Something went wrong", 500);
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await checkAdmin())) return err("Forbidden", 403);

  try {
    const { slug } = await params;
    await prisma.book.delete({ where: { slug } });
    return ok({ message: "Book deleted" });
  } catch {
    return err("Something went wrong", 500);
  }
}
