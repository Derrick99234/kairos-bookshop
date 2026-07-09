import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err } from "@/lib/utils";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  try {
    const { name, phone } = await req.json();
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { ...(name !== undefined && { name }), ...(phone !== undefined && { phone }) },
    });
    return ok({ name: user.name, phone: user.phone });
  } catch {
    return err("Something went wrong", 500);
  }
}
