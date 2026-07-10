import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SEED_SLUGS = [
  "dynamics-of-the-spirit",
  "the-power-of-prayer",
  "metanoia-the-shift",
  "the-spirit-of-faith",
  "the-prophetic-voice",
  "kingdom-leadership",
  "the-word-made-plain",
  "covenant-of-marriage",
  "daily-bread-devotional",
  "prayers-that-avail-much",
];

async function main() {
  for (const slug of SEED_SLUGS) {
    const book = await prisma.book.findUnique({ where: { slug } });
    if (book) {
      await prisma.bookVariant.deleteMany({ where: { bookId: book.id } });
      await prisma.review.deleteMany({ where: { bookId: book.id } });
      await prisma.book.delete({ where: { id: book.id } });
      console.log(`Deleted: ${slug}`);
    } else {
      console.log(`Not found: ${slug}`);
    }
  }

  const remaining = await prisma.book.count();
  console.log(`\nRemaining books: ${remaining}`);
  await prisma.$disconnect();
}

main().catch(console.error);
