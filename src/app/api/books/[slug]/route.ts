import { prisma } from "@/lib/prisma";
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
      variants: true,
      reviews: { include: { user: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!book) return err("Book not found", 404);
  return ok(book);
}
