import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validations";
import { ok, err } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0].message);

    const { name, email, password, phone } = parsed.data;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return err("Email already registered", 409);

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, phone: phone || "" },
    });

    await prisma.cart.create({ data: { userId: user.id } });

    return ok({ id: user.id, name: user.name, email: user.email }, 201);
  } catch {
    return err("Something went wrong", 500);
  }
}
