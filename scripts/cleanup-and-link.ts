import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env") });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { readFileSync, renameSync, unlinkSync } from "fs";
import { google } from "googleapis";
import { Readable } from "stream";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const IMPORT_DIR = resolve(__dirname, "../import-files");

// Rename map: old PDF filename → new filename (DB book title + .pdf)
const RENAME_MAP: Record<string, string> = {
  "ACCESSING THE HIDDEN POWER OF HEAVEN.pdf": "ACCESSING THE HIDDEN POWERS OF HEAVEN.pdf",
  "BREAKING STRONGHOLDS FROM THE COURT OF HEAVEN.pdf": "BREAKING STRONGHOLD FROM THE COURT OF HEAVEN.pdf",
  "Church Growth, Church Finances & Pastoral Ministry - Dr. Isaiah Wealth.pdf": "CHURCH GROWTH, CHURCH FINANCES AND PASTORAL MINISTRY.pdf",
  "Courtfare -Advance Prayer Series.pdf": "COURTFARE – ADVANCED PRAYER SERIES.pdf",
  "FAITH BOOK COMPILATION.pdf": "FAITH – STUDY COURSE SERIES.pdf",
  "FIRSTFRUIT,FIRSTLINGS,,FIRSTBORNS.pdf": "FIRSTFRUIT, FIRSTLINGS & FIRSTBORNS.pdf",
  "Making-Managing-and-Multiplying-Money-Isaiah-Michael-Wealth.pdf": "MAKING, MANAGING & MULTIPLYING MONEY.pdf",
  "Mystery-of-First-Fruit-Isaiah-Michael-Wealth-Print.pdf": "THE MYSTERY OF FIRST FRUITS.pdf",
  "Obtaining a Change of Garments from the Court of Heaven - Isaiah Michael Wealth Print.pdf": "OBTAINING A CHANGE OF GARMENT FROM THE COURT OF HEAVEN.pdf",
  "Prayer Study Course - Embeded.pdf": "PRAYER – STUDY COURSE SERIES.pdf",
  "Redeeming Your Lineage from the Court of Heaven - Isaiah Michael Wealth.pdf": "REDEEMING YOUR LINEAGE FROM THE COURTS OF HEAVEN.pdf",
  "Satan-The-Hidden-Enemy-of-The-Church.pdf": "SATAN: THE HIDDEN ENEMY OF YOUR CHURCH.pdf",
  "TAKING SOUL WINNING SERIOUSLY - Isaiah Michael Wealth Print.pdf": "TAKING SOULWINNING SERIOUSLY.pdf",
  "THE COUNSCIOUSNESS OF LAY MINISTRY.pdf": "THE CONSCIOUSNESS OF LAY MINISTRY.pdf",
  "THE GOD KIND OF PROSPERITY.pdf": "THE GOD KIND OF PROPSERITY.pdf",
  "The Dress Code For Entering The Court Of Heaven - Isaiah Michael Wealth.pdf": "DRESSCODE FOR ENTERING THE COURT OF HEAVEN.pdf",
  "YOUR MIND YOUR PROSPERITY.pdf": "YOUR MIND, YOUR PROSPERITY.pdf",
};

const DUPLICATE_TO_DELETE = "The-Dress-Code-For-Entering-The-Court-Of-Heaven-Isaiah-Michael-Wealth-Print.pdf";
const COURT_WAR_2_PDF = "COURTFARE OR WARFARE 2.pdf";

const WRONG_URL_BOOKS = [
  "BECOMING A HOP LEADER – HOP School of Harvest Training Manual (Volume 1)",
  "HOW TO RECEIVE, RETAIN AND RELEASE HEALING MIRACLES",
  "MULTIPLYING HOPS IN YOUR CITY – HOP School of Harvest Training Manual (Volume 3)",
  "OPTIMIZING HOP THROUGH THE FOP SYSTEM  – HOP School of Harvest Training Manual (Volume 4)",
  "THE MYSTERY OF ANCIENT FAITH",
  "THE PRACTICE OF LAY MINISTRY",
];

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
  // Step 1: Clear 6 wrong URLs
  console.log("=== Step 1: Clearing wrong URLs ===");
  for (const title of WRONG_URL_BOOKS) {
    const book = await prisma.book.findFirst({ where: { title }, include: { variants: true } });
    if (!book) { console.log(`  Not found: ${title}`); continue; }
    const sv = book.variants.find((v) => v.format === "SOFTCOPY" && v.downloadUrl);
    if (sv) {
      await prisma.bookVariant.update({ where: { id: sv.id }, data: { downloadUrl: "" } });
      console.log(`  Cleared: ${title}`);
    } else {
      console.log(`  No URL to clear: ${title}`);
    }
  }

  // Step 2: Add SOFTCOPY variant for COURTFARE OR WARFARE + link PDF
  console.log("\n=== Step 2: COURTFARE OR WARFARE ===");
  const cw = await prisma.book.findFirst({ where: { title: "COURTFARE OR WARFARE" }, include: { variants: true } });
  if (cw) {
    const existingSv = cw.variants.find((v) => v.format === "SOFTCOPY");
    if (!existingSv) {
      // Create SOFTCOPY variant — copy pricing from HARDCOPY
      const hc2 = cw.variants.find((v) => v.format === "HARDCOPY");
      const newVariant = await prisma.bookVariant.create({
        data: {
          bookId: cw.id,
          format: "SOFTCOPY",
          price: hc2?.price || 0,
          comparePrice: hc2?.comparePrice || 0,
          stock: 999,
        },
      });

      // Upload COURTFARE OR WARFARE 2.pdf
      const filePath = resolve(IMPORT_DIR, COURT_WAR_2_PDF);
      const fileBuffer = readFileSync(filePath);
      const url = await uploadToDrive(fileBuffer, "COURTFARE OR WARFARE.pdf");

      await prisma.bookVariant.update({
        where: { id: newVariant.id },
        data: { downloadUrl: url },
      });
      console.log(`  Created SOFTCOPY variant + linked PDF for COURTFARE OR WARFARE`);
    } else {
      console.log(`  Already has SOFTCOPY variant`);
    }
  } else {
    console.log(`  COURTFARE OR WARFARE not found in DB`);
  }

  // Step 3: Delete duplicate PDF file
  console.log("\n=== Step 3: Deleting duplicate PDF ===");
  const dupPath = resolve(IMPORT_DIR, DUPLICATE_TO_DELETE);
  try {
    unlinkSync(dupPath);
    console.log(`  Deleted: ${DUPLICATE_TO_DELETE}`);
  } catch (e) {
    console.log(`  Already deleted or not found: ${DUPLICATE_TO_DELETE}`);
  }

  // Step 4: Rename PDFs to match DB titles
  console.log("\n=== Step 4: Renaming PDFs ===");
  for (const [oldName, newName] of Object.entries(RENAME_MAP)) {
    const oldPath = resolve(IMPORT_DIR, oldName);
    const newPath = resolve(IMPORT_DIR, newName);
    try {
      renameSync(oldPath, newPath);
      console.log(`  ${oldName} → ${newName}`);
    } catch (e: any) {
      console.log(`  Could not rename ${oldName}: ${e.message}`);
    }
  }

  console.log("\n=== DONE ===");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
