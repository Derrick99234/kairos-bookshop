import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { initializePayment } from "@/lib/paystack";
import { generateOrderNumber, ok, err } from "@/lib/utils";
import crypto from "crypto";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  try {
    const body = await req.json();
    const { shippingAddressId, street, city, state } = body;

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            variant: { include: { book: true } },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) return err("Cart is empty");

    let shippingId = shippingAddressId;

    if (!shippingId && street && city) {
      const address = await prisma.address.create({
        data: {
          userId: session.user.id,
          street,
          city,
          state: state || "",
          isDefault: false,
        },
      });
      shippingId = address.id;
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.variant.price * item.quantity,
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
        shippingAddressId: shippingId,
        items: {
          create: cart.items.map((item) => ({
            bookId: item.variant.book.id,
            variantId: item.variant.id,
            title: item.variant.book.title,
            price: item.variant.price,
            quantity: item.quantity,
            format: item.variant.format,
          })),
        },
      },
    });

    const reference = `KB-${orderNumber}-${crypto.randomBytes(4).toString("hex")}`;
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/callback`;

    const payment = await initializePayment({
      email: session.user.email!,
      amount: total,
      reference,
      metadata: { orderId: order.id },
      callbackUrl,
    });

    if (!payment.status) {
      return err(payment.message || "Payment initiation failed", 400);
    }

    return ok({ authorization_url: payment.data.authorization_url, order });
  } catch (e) {
    console.error(e);
    return err("Something went wrong", 500);
  }
}
