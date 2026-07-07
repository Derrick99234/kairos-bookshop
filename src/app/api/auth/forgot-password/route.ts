import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations";
import { sendPasswordResetEmail } from "@/lib/email";
import { ok, err } from "@/lib/utils";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0].message);

    const { email } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return ok({ message: "If the email exists, a reset link has been sent." });

    const token = crypto.randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
      data: { identifier: email, token, expires: new Date(Date.now() + 3600000) },
    });

    await sendPasswordResetEmail(email, token);

    return ok({ message: "If the email exists, a reset link has been sent." });
  } catch {
    return err("Something went wrong", 500);
  }
}
