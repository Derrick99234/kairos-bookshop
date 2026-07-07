import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { reviewSchema } from "@/lib/validations";
import { ok, err } from "@/lib/utils";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  try {
    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0].message);

    const existing = await prisma.review.findUnique({
      where: { bookId_userId: { bookId: parsed.data.bookId, userId: session.user.id } },
    });

    if (existing) return err("You already reviewed this book");

    const review = await prisma.review.create({
      data: { ...parsed.data, userId: session.user.id },
    });

    return ok(review, 201);
  } catch {
    return err("Something went wrong", 500);
  }
}
