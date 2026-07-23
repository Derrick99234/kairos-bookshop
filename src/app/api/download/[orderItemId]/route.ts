import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderItemId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderItemId } = await params;

  const orderItem = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
    include: {
      order: { select: { userId: true } },
      variant: { select: { downloadUrl: true } },
    },
  });

  if (!orderItem) {
    return NextResponse.json({ error: "Order item not found" }, { status: 404 });
  }

  if (orderItem.order.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (orderItem.fulfillmentStatus !== "DOWNLOADABLE") {
    return NextResponse.json({ error: "Not available for download" }, { status: 403 });
  }

  const downloadUrl = orderItem.variant?.downloadUrl;
  if (!downloadUrl) {
    return NextResponse.json({ error: "Download not available" }, { status: 404 });
  }

  return NextResponse.redirect(downloadUrl, 307);
}
