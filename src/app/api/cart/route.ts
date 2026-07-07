import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { book: true },
      },
    },
  });

  return ok(cart || { items: [] });
}
