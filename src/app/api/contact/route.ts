import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { ok, err } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0].message);

    const inquiry = await prisma.contactInquiry.create({ data: parsed.data });
    return ok(inquiry, 201);
  } catch {
    return err("Something went wrong", 500);
  }
}
