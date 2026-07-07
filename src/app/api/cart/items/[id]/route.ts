import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  const { id } = await params;
  const { quantity } = await req.json();

  if (!quantity || quantity < 1) return err("Invalid quantity");

  await prisma.cartItem.update({ where: { id }, data: { quantity } });
  return ok({ updated: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  const { id } = await params;
  await prisma.cartItem.delete({ where: { id } });
  return ok({ deleted: true });
}
