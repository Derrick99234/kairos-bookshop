import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const books = await prisma.book.count();
  const variants = await prisma.bookVariant.count();
  const cats = await prisma.category.count();
  const posts = await prisma.blogPost.count();
  const users = await prisma.user.count();

  console.log(`Books: ${books}`);
  console.log(`Variants: ${variants}`);
  console.log(`Categories: ${cats}`);
  console.log(`Blog posts: ${posts}`);
  console.log(`Users: ${users}`);

  // Show variant distribution
  const booksWithVariants = await prisma.book.findMany({
    include: { variants: true, category: true },
    orderBy: { title: "asc" },
    take: 5,
  });

  for (const b of booksWithVariants) {
    console.log(`\n${b.title} [${b.category.name}]`);
    console.log(`  Author: ${b.author}`);
    console.log(`  Desc: ${(b.description || "").substring(0, 80)}...`);
    for (const v of b.variants) {
      console.log(`  ${v.format}: ₦${v.price} (was ₦${v.comparePrice}) stock=${v.stock} sku=${v.sku}`);
    }
  }

  // Count variant format distribution
  const formatCounts = await prisma.bookVariant.groupBy({
    by: ["format"],
    _count: true,
  });
  console.log("\nFormat distribution:");
  for (const f of formatCounts) {
    console.log(`  ${f.format}: ${f._count}`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
