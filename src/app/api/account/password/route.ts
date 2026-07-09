import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err } from "@/lib/utils";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  try {
    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return err("New password must be at least 8 characters");
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return err("User not found", 404);

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return err("Current password is incorrect");

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: session.user.id }, data: { password: hashed } });

    return ok({ updated: true });
  } catch {
    return err("Something went wrong", 500);
  }
}
