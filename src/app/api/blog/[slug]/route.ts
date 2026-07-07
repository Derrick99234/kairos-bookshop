import { prisma } from "@/lib/prisma";
import { ok, err } from "@/lib/utils";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return err("Post not found", 404);
  return ok(post);
}
