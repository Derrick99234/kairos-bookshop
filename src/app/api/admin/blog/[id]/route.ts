import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { blogSchema } from "@/lib/validations";
import { ok, err } from "@/lib/utils";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return err("Unauthorized", 401);

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = blogSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0].message);

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return err("Post not found", 404);

    const slugConflict = await prisma.blogPost.findFirst({
      where: { slug: parsed.data.slug, id: { not: id } },
    });
    if (slugConflict) return err("A post with this slug already exists");

    const post = await prisma.blogPost.update({
      where: { id },
      data: parsed.data,
    });

    return ok(post);
  } catch {
    return err("Something went wrong", 500);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return err("Unauthorized", 401);

  const { id } = await params;

  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return err("Post not found", 404);

    await prisma.blogPost.delete({ where: { id } });
    return ok({ deleted: true });
  } catch {
    return err("Something went wrong", 500);
  }
}
