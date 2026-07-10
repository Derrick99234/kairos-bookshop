import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return err("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const q = searchParams.get("q") || "";
  const replied = searchParams.get("replied");

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { message: { contains: q, mode: "insensitive" } },
    ];
  }
  if (replied === "true") where.replied = true;
  else if (replied === "false") where.replied = false;

  const [inquiries, total] = await Promise.all([
    prisma.contactInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.contactInquiry.count({ where }),
  ]);

  return ok({ inquiries, total, page, pages: Math.ceil(total / limit) });
}
