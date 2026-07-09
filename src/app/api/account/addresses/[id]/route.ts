import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err } from "@/lib/utils";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  const { id } = await params;
  const existing = await prisma.address.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) return err("Address not found", 404);

  try {
    const body = await req.json();

    if (body.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        ...(body.label !== undefined && { label: body.label }),
        ...(body.street !== undefined && { street: body.street }),
        ...(body.city !== undefined && { city: body.city }),
        ...(body.state !== undefined && { state: body.state }),
        ...(body.country !== undefined && { country: body.country }),
        ...(body.isDefault !== undefined && { isDefault: body.isDefault }),
      },
    });

    return ok(address);
  } catch {
    return err("Something went wrong", 500);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  const { id } = await params;
  const existing = await prisma.address.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) return err("Address not found", 404);

  await prisma.address.delete({ where: { id } });
  return ok({ deleted: true });
}
