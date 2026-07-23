import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderItemId: string }> },
) {
  const session = await auth();

  const { orderItemId } = await params;

  const orderItem = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
    include: {
      order: { select: { userId: true, email: true } },
      variant: { select: { downloadUrl: true } },
    },
  });

  if (!orderItem) {
    return NextResponse.json({ error: "Order item not found" }, { status: 404 });
  }

  if (!session?.user?.id) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const loginUrl = new URL("/api/auth/signin", appUrl);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl, 307);
  }

  const isOwner = orderItem.order.userId === session.user.id;
  const isEmailMatch = orderItem.order.email === session.user.email;
  if (!isOwner && !isEmailMatch) {
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
