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
    select: { title: true, imageUrl: true },
    orderBy: { title: "asc" },
  });

  const withCover = books.filter((b) => b.imageUrl);
  const driveCovers = withCover.filter((b) => b.imageUrl?.includes("drive.google.com"));
  const otherCovers = withCover.filter((b) => b.imageUrl && !b.imageUrl.includes("drive.google.com"));

  console.log(`Books with cover images: ${withCover.length}`);
  console.log(`Drive covers: ${driveCovers.length}`);
  console.log(`Other covers: ${otherCovers.length}`);
  if (otherCovers.length > 0) {
    console.log("\nNon-Drive covers:");
    otherCovers.forEach((b) => console.log(`  ${b.title}: ${b.imageUrl}`));
  }

  // Check audio variants
  const audioVariants = await prisma.bookVariant.findMany({ where: { format: "AUDIO" }, include: { book: { select: { title: true } } } });
  console.log(`\nAudio variants: ${audioVariants.length}`);
  audioVariants.forEach((v) => console.log(`  ${v.book.title}: ${v.downloadUrl ? "has URL" : "no URL"}`));

  await prisma.$disconnect();
}

main();
