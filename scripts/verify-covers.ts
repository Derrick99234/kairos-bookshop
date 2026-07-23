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
  const books = await prisma.book.findMany({ select: { title: true, imageUrl: true } });
  const wp = books.filter((b) => b.imageUrl?.includes("kairosbookshop.org"));
  const drive = books.filter((b) => b.imageUrl?.includes("drive.google.com"));
  const none = books.filter((b) => !b.imageUrl);
  console.log(`WordPress covers remaining: ${wp.length}`);
  console.log(`Drive covers: ${drive.length}`);
  console.log(`No cover: ${none.length}`);
  await prisma.$disconnect();
}
main();
