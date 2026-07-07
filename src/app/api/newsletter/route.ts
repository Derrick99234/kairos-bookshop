import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validations";
import { ok, err } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0].message);

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: parsed.data.email },
    });

    if (existing) {
      if (!existing.subscribed) {
        await prisma.newsletterSubscriber.update({
          where: { id: existing.id },
          data: { subscribed: true },
        });
      }
      return ok({ message: "Already subscribed" });
    }

    await prisma.newsletterSubscriber.create({ data: parsed.data });
    return ok({ subscribed: true }, 201);
  } catch {
    return err("Something went wrong", 500);
  }
}
