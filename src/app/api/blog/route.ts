import { prisma } from "@/lib/prisma";
import { blogSchema } from "@/lib/validations";
import { ok, err } from "@/lib/utils";

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  return ok(posts);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = blogSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0].message);

    const post = await prisma.blogPost.create({ data: parsed.data });
    return ok(post, 201);
  } catch {
    return err("Something went wrong", 500);
  }
}
