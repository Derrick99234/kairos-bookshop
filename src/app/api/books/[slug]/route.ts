import { prisma } from "@/lib/prisma";
import { bookSchema } from "@/lib/validations";
import { ok, err } from "@/lib/utils";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const book = await prisma.book.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: { include: { user: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!book) return err("Book not found", 404);
  return ok(book);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const parsed = bookSchema.partial().safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0].message);

    const book = await prisma.book.update({
      where: { slug },
      data: parsed.data,
    });
    return ok(book);
  } catch {
    return err("Something went wrong", 500);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    await prisma.book.delete({ where: { slug } });
    return ok({ deleted: true });
  } catch {
    return err("Book not found", 404);
  }
}
