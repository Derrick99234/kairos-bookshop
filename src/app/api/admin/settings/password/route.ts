import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err } from "@/lib/utils";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return err("Unauthorized", 401);

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) return err("Both passwords are required");
    if (newPassword.length < 8) return err("New password must be at least 8 characters");

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || !user.password) return err("User not found");

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return err("Current password is incorrect");

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: session.user.id }, data: { password: hashed } });

    return ok({ message: "Password updated" });
  } catch {
    return err("Something went wrong", 500);
  }
}
