import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ok, err } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password || password.length < 8) {
      return err("Invalid request");
    }

    const record = await prisma.verificationToken.findFirst({
      where: { token, expires: { gte: new Date() } },
    });

    if (!record) return err("Invalid or expired token", 400);

    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email: record.identifier },
      data: { password: hashed },
    });

    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: record.identifier, token: record.token } },
    });

    return ok({ message: "Password reset successfully" });
  } catch {
    return err("Something went wrong", 500);
  }
}
