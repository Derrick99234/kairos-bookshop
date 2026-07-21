import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env") });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { readFileSync, readdirSync, statSync, createReadStream } from "fs";
import { join } from "path";
import { google } from "googleapis";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const IMPORT_DIR = resolve(__dirname, "../import-files");

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_DRIVE_CLIENT_ID,
  process.env.GOOGLE_DRIVE_CLIENT_SECRET,
);
auth.setCredentials({ refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN });
const drive = google.drive({ version: "v3", auth });

function cleanTitle(name: string): string {
  return name
    .replace(/\.pdf$/i, "")
    .replace(/\s*-\s*Dr\.?\s*Isaiah\s*Wealth\s*/i, "")
    .replace(/\s*-\s*Isaiah\s*Michael\s*Wealth\s*(Amazon|Print)?\s*/i, "")
    .replace(/\s*-\s*Embeded\s*/i, "")
    .replace(/\s*\(\d\)\s*/i, "")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function findBook(title: string) {
  const exact = await prisma.book.findFirst({
    where: { title: { equals: title, mode: "insensitive" } },
    include: { variants: true },
  });
  if (exact) return exact;

  const all = await prisma.book.findMany({ include: { variants: true } });
  const t = title.toLowerCase();
  return all.find((b) => {
    const bt = b.title.toLowerCase();
    return bt.includes(t) || t.includes(bt);
  }) || null;
}

async function uploadPdf(filePath: string, fileName: string): Promise<string> {
  const res = await drive.files.create({
    requestBody: { name: fileName },
    media: { mimeType: "application/pdf", body: createReadStream(filePath) },
    fields: "id",
  });

  if (!res.data.id) throw new Error("Upload returned no ID");

  await drive.permissions.create({
    fileId: res.data.id,
    requestBody: { type: "anyone", role: "reader" },
  });

  return `https://drive.google.com/uc?export=download&id=${res.data.id}`;
}

async function main() {
  const pdfFiles = readdirSync(IMPORT_DIR)
    .filter((f) => f.toLowerCase().endsWith(".pdf"))
    .sort();

  if (pdfFiles.length === 0) {
    console.log(`No PDF files found in ${IMPORT_DIR}`);
    console.log("Extract your downloaded ZIP into this folder first.");
    return;
  }

  console.log(`Found ${pdfFiles.length} PDFs\n`);

  let linked = 0;
  let skipped = 0;
  let errors = 0;

  for (const fileName of pdfFiles) {
    const title = cleanTitle(fileName);
    if (!title) { console.log(`SKIP: ${fileName} (empty title)`); skipped++; continue; }

    console.log(`[${linked + skipped + errors + 1}/${pdfFiles.length}] ${title}`);

    try {
      const book = await findBook(title);
      if (!book) { console.log(`  SKIP: no matching book found\n`); skipped++; continue; }

      const variant = book.variants.find((v) => v.format === "SOFTCOPY");
      if (!variant) { console.log(`  SKIP: "${book.title}" has no SOFTCOPY variant\n`); skipped++; continue; }
      if (variant.downloadUrl) { console.log(`  SKIP: "${book.title}" already has a download URL\n`); skipped++; continue; }

      console.log(`  Matching book: "${book.title}"`);
      const filePath = join(IMPORT_DIR, fileName);
      const fileSize = statSync(filePath).size;
      console.log(`  Uploading ${(fileSize / 1024 / 1024).toFixed(1)}MB to Drive...`);

      const downloadUrl = await uploadPdf(filePath, fileName);
      console.log(`  Uploaded ✓`);

      await prisma.bookVariant.update({
        where: { id: variant.id },
        data: { downloadUrl },
      });

      console.log(`  LINKED to "${book.title}" SOFTCOPY variant\n`);
      linked++;
    } catch (err) {
      console.error(`  ERROR: ${err instanceof Error ? err.message : err}\n`);
      errors++;
    }
  }

  console.log("=== DONE ===");
  console.log(`  Linked: ${linked}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Errors: ${errors}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
