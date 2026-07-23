import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env") });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { readFileSync, renameSync } from "fs";
import { google } from "googleapis";
import { Readable } from "stream";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const IMPORT_DIR = resolve(__dirname, "../import-files");

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
  const currentFile = "THE MORNING ALTAR WARRIOR- PROPHET ISAIAH MACWEALTH.pdf";
  const newFileName = "THE MORNING ALTAR WARRIOR.pdf";
  const bookTitle = "THE MORNING ALTAR WARRIOR";

  const filePath = resolve(IMPORT_DIR, currentFile);
  const fileBuffer = readFileSync(filePath);

  console.log("Uploading to Drive...");
  const url = await uploadToDrive(fileBuffer, currentFile);
  console.log("Uploaded:", url);

  const book = await prisma.book.findFirst({
    where: { title: bookTitle },
    include: { variants: true },
  });

  if (!book) {
    console.log("Book not found:", bookTitle);
    return;
  }

  const variant = book.variants.find((v) => v.format === "SOFTCOPY");
  if (!variant) {
    console.log("No SOFTCOPY variant for", bookTitle);
    return;
  }

  await prisma.bookVariant.update({
    where: { id: variant.id },
    data: { downloadUrl: url },
  });
  console.log("Linked to:", bookTitle);

  renameSync(filePath, resolve(IMPORT_DIR, newFileName));
  console.log("Renamed to:", newFileName);

  await prisma.$disconnect();
}

main().catch(console.error);
