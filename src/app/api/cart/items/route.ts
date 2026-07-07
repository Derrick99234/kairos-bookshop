import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { cartItemSchema } from "@/lib/validations";
import { ok, err } from "@/lib/utils";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  try {
    const body = await req.json();
    const parsed = cartItemSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0].message);

    const { bookId, quantity, format } = parsed.data;

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) return err("Cart not found", 404);

    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, bookId, format },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, bookId, quantity, format },
      });
    }

    return ok({ added: true }, 201);
  } catch {
    return err("Something went wrong", 500);
  }
}
