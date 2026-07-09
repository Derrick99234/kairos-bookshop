import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err } from "@/lib/utils";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  const { id } = await params;
  const { status } = await req.json();

  const VALID_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!VALID_STATUSES.includes(status)) return err("Invalid status");

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return err("Order not found", 404);

  const isAdmin = (session.user as { role?: string }).role === "ADMIN";
  const isOwner = order.userId === session.user.id;

  if (!isAdmin && !isOwner) return err("Forbidden", 403);

  if (!isAdmin && status !== "CANCELLED") return err("You can only cancel orders");
  if (!isAdmin && order.status !== "PENDING") return err("Only pending orders can be cancelled");

  await prisma.order.update({ where: { id }, data: { status } });
  return ok({ updated: true });
}
