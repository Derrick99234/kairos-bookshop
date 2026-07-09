import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  });

  return ok(addresses);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  try {
    const body = await req.json();
    const { label, street, city, state, country, isDefault } = body;

    if (!street || !city || !state) return err("Street, city, and state are required");

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        label: label || "Home",
        street,
        city,
        state,
        country: country || "Nigeria",
        isDefault: isDefault || false,
      },
    });

    return ok(address, 201);
  } catch {
    return err("Something went wrong", 500);
  }
}
