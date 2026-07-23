import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env") });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const books = await prisma.book.findMany({
    orderBy: { title: "asc" },
    select: { title: true, category: { select: { name: true } } },
  });

  console.log(`\nAll ${books.length} books in database:\n`);
  books.forEach((b, i) => {
    console.log(`${String(i + 1).padStart(2)}. "${b.title}"  (${b.category?.name || "No category"})`);
  });
}

main().finally(() => prisma.$disconnect());
