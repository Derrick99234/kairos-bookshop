import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { initializePayment, verifyPayment } from "@/lib/paystack";
import { generateOrderNumber, ok, err } from "@/lib/utils";
import { sendOrderConfirmation } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  try {
    const body = await req.json();
    const { shippingAddressId } = body;

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: { include: { book: true } } },
    });

    if (!cart || cart.items.length === 0) return err("Cart is empty");

    let shippingAddress;
    if (shippingAddressId) {
      shippingAddress = await prisma.address.findUnique({
        where: { id: shippingAddressId },
      });
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.book.price * item.quantity,
      0
    );
    const shipping = subtotal >= 50000 ? 0 : 2000;
    const total = subtotal + shipping;
    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        email: session.user.email!,
        subtotal,
        shipping,
        total,
        paymentStatus: "UNPAID",
        shippingAddressId: shippingAddress?.id,
        items: {
          create: cart.items.map((item) => ({
            bookId: item.bookId,
            title: item.book.title,
            price: item.book.price,
            quantity: item.quantity,
            format: item.format,
          })),
        },
      },
    });

    const payment = await initializePayment({
      email: session.user.email!,
      amount: total,
      reference: `KB-${orderNumber}-${crypto.randomBytes(4).toString("hex")}`,
      metadata: { orderId: order.id },
    });

    return ok({ authorization_url: payment.data.authorization_url, order });
  } catch {
    return err("Something went wrong", 500);
  }
}
