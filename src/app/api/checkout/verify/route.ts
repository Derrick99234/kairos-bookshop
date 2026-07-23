import { prisma } from "@/lib/prisma";
import { verifyPayment } from "@/lib/paystack";
import { ok, err } from "@/lib/utils";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { reference } = await req.json();

    if (!reference) return err("Reference is required");

    const payment = await verifyPayment(reference);

    if (payment.data.status === "success") {
      const orderId = payment.data.metadata?.orderId as string | undefined;
      const order = orderId
        ? await prisma.order.findUnique({ where: { id: orderId } })
        : await prisma.order.findFirst({
            where: { orderNumber: { contains: reference.split("-")[1] } },
          });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "PAID",
            status: "CONFIRMED",
            paymentReference: reference,
          },
        });

        const items = await prisma.orderItem.findMany({
          where: { orderId: order.id },
          select: { id: true, variantId: true, quantity: true, format: true },
        });

        for (const item of items) {
          if (item.format === "HARDCOPY") {
            if (item.variantId) {
              await prisma.bookVariant.update({
                where: { id: item.variantId },
                data: { stock: { decrement: item.quantity } },
              });
            }
            await prisma.orderItem.update({
              where: { id: item.id },
              data: { fulfillmentStatus: "SHIPPING" },
            });
          } else {
            await prisma.orderItem.update({
              where: { id: item.id },
              data: { fulfillmentStatus: "DOWNLOADABLE" },
            });
          }
        }

        const cart = await prisma.cart.findUnique({
          where: { userId: order.userId },
        });
        if (cart) {
          await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        }

        await sendOrderConfirmation(order.email, order.orderNumber);
      }
    }

    return ok({ verified: true });
  } catch {
    return err("Something went wrong", 500);
  }
}
