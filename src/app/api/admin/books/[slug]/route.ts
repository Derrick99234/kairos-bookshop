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
    const { variants, ...bookData } = body;

    const parsed = bookSchema.partial().safeParse(bookData);
    if (!parsed.success) return err(parsed.error.issues[0].message);

    const book = await prisma.book.findUnique({ where: { slug } });
    if (!book) return err("Book not found", 404);

    const updatedBook = await prisma.book.update({
      where: { slug },
      data: {
        ...parsed.data,
        variants: variants
          ? {
              deleteMany: {},
              create: variants.map((v: { format: string; price: number; comparePrice?: number; priceUsd?: number; comparePriceUsd?: number; stock?: number; sku?: string; downloadUrl?: string }) => ({
                format: v.format,
                price: v.price,
                comparePrice: v.comparePrice || 0,
                priceUsd: v.priceUsd || 0,
                comparePriceUsd: v.comparePriceUsd || 0,
                stock: v.stock || 0,
                sku: v.sku || "",
                downloadUrl: v.downloadUrl || "",
              })),
            }
          : undefined,
      },
      include: { variants: true },
    });

    return ok(updatedBook);
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
