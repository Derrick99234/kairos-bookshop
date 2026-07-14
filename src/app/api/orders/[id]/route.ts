import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err } from "@/lib/utils";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { book: { select: { slug: true } } } }, shippingAddress: true },
  });

  const isAdmin = (session.user as { role?: string }).role === "ADMIN";
  if (!order || (!isAdmin && order.userId !== session.user.id)) {
    return err("Order not found", 404);
  }

  return ok(order);
}
