import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env") });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { readFileSync, readdirSync } from "fs";
import { google } from "googleapis";
import { Readable } from "stream";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const IMPORT_DIR = resolve(__dirname, "../import-files");

// Manual mapping of PDF filename → DB book title
const MANUAL_MAP: Record<string, string> = {
  "ACCESSING THE HIDDEN POWER OF HEAVEN.pdf": "ACCESSING THE HIDDEN POWERS OF HEAVEN",
  "BREAKING STRONGHOLDS FROM THE COURT OF HEAVEN.pdf": "BREAKING STRONGHOLD FROM THE COURT OF HEAVEN",
  "Church Growth, Church Finances & Pastoral Ministry - Dr. Isaiah Wealth.pdf": "CHURCH GROWTH, CHURCH FINANCES AND PASTORAL MINISTRY",
  "Courtfare -Advance Prayer Series.pdf": "COURTFARE – ADVANCED PRAYER SERIES",
  "FAITH BOOK COMPILATION.pdf": "FAITH – STUDY COURSE SERIES",
  "FIRSTFRUIT,FIRSTLINGS,,FIRSTBORNS.pdf": "FIRSTFRUIT, FIRSTLINGS & FIRSTBORNS",
  "Making-Managing-and-Multiplying-Money-Isaiah-Michael-Wealth.pdf": "MAKING, MANAGING & MULTIPLYING MONEY",
  "Mystery-of-First-Fruit-Isaiah-Michael-Wealth-Print.pdf": "THE MYSTERY OF FIRST FRUITS",
  "Obtaining a Change of Garments from the Court of Heaven - Isaiah Michael Wealth Print.pdf": "OBTAINING A CHANGE OF GARMENT FROM THE COURT OF HEAVEN",
  "Prayer Study Course - Embeded.pdf": "PRAYER – STUDY COURSE SERIES",
  "Redeeming Your Lineage from the Court of Heaven - Isaiah Michael Wealth.pdf": "REDEEMING YOUR LINEAGE FROM THE COURTS OF HEAVEN",
  "Satan-The-Hidden-Enemy-of-The-Church.pdf": "SATAN: THE HIDDEN ENEMY OF YOUR CHURCH",
  "TAKING SOUL WINNING SERIOUSLY - Isaiah Michael Wealth Print.pdf": "TAKING SOULWINNING SERIOUSLY",
  "THE COUNSCIOUSNESS OF LAY MINISTRY.pdf": "THE CONSCIOUSNESS OF LAY MINISTRY",
  "THE GOD KIND OF PROSPERITY.pdf": "THE GOD KIND OF PROPSERITY",
  "The Dress Code For Entering The Court Of Heaven - Isaiah Michael Wealth.pdf": "DRESSCODE FOR ENTERING THE COURT OF HEAVEN",
  "The-Dress-Code-For-Entering-The-Court-Of-Heaven-Isaiah-Michael-Wealth-Print.pdf": "DRESSCODE FOR ENTERING THE COURT OF HEAVEN",
  "YOUR MIND YOUR PROSPERITY.pdf": "YOUR MIND, YOUR PROSPERITY",
};

async function uploadToDrive(fileBuffer: Buffer, fileName: string): Promise<string> {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_DRIVE_CLIENT_ID,
    process.env.GOOGLE_DRIVE_CLIENT_SECRET,
  );
  auth.setCredentials({ refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN });

  const drive = google.drive({ version: "v3", auth });

  const res = await drive.files.create({
    requestBody: { name: fileName },
    media: { body: Readable.from(fileBuffer), mimeType: "application/pdf" },
    fields: "id",
  });

  const fileId = res.data.id!;
  await drive.permissions.create({ fileId, requestBody: { type: "anyone", role: "reader" } });

  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

async function main() {
  // First, reset ALL softcopy downloadUrl fields to NULL
  // (the 53 correct links will be re-established from the first import's uploaded files)

  // Actually, let me first figure out which books already have correct downloadUrls
  const allBooks = await prisma.book.findMany({
    include: { variants: true },
  });

  // Books with SOFTCOPY downloadUrl
  const withUrl = allBooks.filter(b =>
    b.variants.some(v => v.format === "SOFTCOPY" && v.downloadUrl)
  );
  console.log(`Books with existing SOFTCOPY URLs: ${withUrl.length}`);

  // Now compare with our manual map
  const alreadyMapped: string[] = [];
  const needsUrl: { fileName: string; bookTitle: string }[] = [];

  for (const [fileName, bookTitle] of Object.entries(MANUAL_MAP)) {
    const book = allBooks.find(b => b.title === bookTitle);
    if (!book) {
      console.log(`❌ Book not found: "${bookTitle}"`);
      continue;
    }

    const variant = book.variants.find(v => v.format === "SOFTCOPY");
    if (!variant) {
      console.log(`⚠️  No SOFTCOPY variant for "${bookTitle}"`);
      continue;
    }

    if (variant.downloadUrl) {
      alreadyMapped.push(bookTitle);
    } else {
      needsUrl.push({ fileName, bookTitle });
    }
  }

  console.log(`\nAlready have URL (from first import): ${alreadyMapped.length}`);
  alreadyMapped.forEach(t => console.log(`  ✅ ${t}`));

  console.log(`\nNeed to upload & link: ${needsUrl.length}`);
  needsUrl.forEach(n => console.log(`  📄 ${n.fileName} → "${n.bookTitle}"`));

  if (needsUrl.length === 0) {
    console.log("\nNothing to do!");
    return;
  }

  console.log("\nUploading...");
  for (const { fileName, bookTitle } of needsUrl) {
    const book = allBooks.find(b => b.title === bookTitle)!;
    const variant = book.variants.find(v => v.format === "SOFTCOPY")!;
    const filePath = resolve(IMPORT_DIR, fileName);

    if (!readFileSync(filePath, { flag: 'r' })) {
      console.log(`❌ File not found: ${fileName}`);
      continue;
    }

    const fileBuffer = readFileSync(filePath);
    const url = await uploadToDrive(fileBuffer, fileName);

    await prisma.bookVariant.update({
      where: { id: variant.id },
      data: { downloadUrl: url },
    });

    console.log(`✅ "${bookTitle}" → linked`);
  }

  console.log("\nDone!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
