import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err } from "@/lib/utils";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || (session.user as { role: string }).role !== "ADMIN") {
    return err("Forbidden", 403);
  }

  const { id } = await params;
  const { status } = await req.json();

  const VALID_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!VALID_STATUSES.includes(status)) return err("Invalid status");

  await prisma.order.update({ where: { id }, data: { status } });
  return ok({ updated: true });
}
