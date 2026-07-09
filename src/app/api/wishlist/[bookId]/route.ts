import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err } from "@/lib/utils";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  const { bookId } = await params;

  const item = await prisma.wishlistItem.findUnique({
    where: { userId_bookId: { userId: session.user.id, bookId } },
  });

  if (!item) return err("Not found", 404);

  await prisma.wishlistItem.delete({ where: { id: item.id } });
  return ok({ deleted: true });
}
