import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env") });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { readdirSync } from "fs";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const books = await prisma.book.findMany({
    include: { variants: true, category: true },
    orderBy: { title: "asc" },
  });

  const total = books.length;
  const withSoftcopyUrl = books.filter((b) =>
    b.variants.some((v) => v.format === "SOFTCOPY" && v.downloadUrl)
  );
  const hasVariantNoUrl = books.filter((b) =>
    b.variants.some((v) => v.format === "SOFTCOPY" && !v.downloadUrl)
  );
  const noSoftcopyVariant = books.filter((b) =>
    !b.variants.some((v) => v.format === "SOFTCOPY")
  );

  console.log(`Total books in DB: ${total}`);
  console.log(`With SOFTCOPY + URL: ${withSoftcopyUrl.length}`);
  console.log(`Has SOFTCOPY variant but NO URL: ${hasVariantNoUrl.length}`);
  console.log(`No SOFTCOPY variant at all: ${noSoftcopyVariant.length}`);
  console.log();

  if (hasVariantNoUrl.length > 0) {
    console.log("=== HAS SOFTCOPY VARIANT BUT NO URL ===");
    for (const b of hasVariantNoUrl) {
      console.log(`  ${b.title} (${b.category?.name || "No category"})`);
    }
    console.log();
  }

  if (noSoftcopyVariant.length > 0) {
    console.log("=== NO SOFTCOPY VARIANT AT ALL ===");
    for (const b of noSoftcopyVariant) {
      console.log(`  ${b.title} (${b.category?.name || "No category"})`);
    }
    console.log();
  }

  // Total without PDF
  const without = hasVariantNoUrl.length + noSoftcopyVariant.length;
  console.log(`Total WITHOUT a PDF: ${without}`);

  // File count
  const pdfCount = readdirSync(resolve(__dirname, "../import-files"))
    .filter((f) => f.toLowerCase().endsWith(".pdf")).length;
  console.log(`PDF files in import-files/: ${pdfCount}`);

  await prisma.$disconnect();
}

main();
