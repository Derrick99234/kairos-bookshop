import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: {
      book: {
        include: { category: true, variants: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return ok(items);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  try {
    const { bookId } = await req.json();
    if (!bookId) return err("bookId is required");

    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_bookId: { userId: session.user.id, bookId } },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return ok({ wishlisted: false });
    }

    await prisma.wishlistItem.create({
      data: { userId: session.user.id, bookId },
    });

    return ok({ wishlisted: true }, 201);
  } catch {
    return err("Something went wrong", 500);
  }
}
