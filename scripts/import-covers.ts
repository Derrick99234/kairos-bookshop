import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env") });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { google } from "googleapis";
import { Readable } from "stream";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const COVER_FOLDER_ID = process.env.GOOGLE_DRIVE_COVER_FOLDER_ID;

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_DRIVE_CLIENT_ID,
  process.env.GOOGLE_DRIVE_CLIENT_SECRET,
);
auth.setCredentials({ refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN });
const drive = google.drive({ version: "v3", auth });

async function uploadCover(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
  const res = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [COVER_FOLDER_ID!],
    },
    media: { mimeType, body: Readable.from(fileBuffer) },
    fields: "id",
  });

  const fileId = res.data.id!;

  await drive.permissions.create({
    fileId,
    requestBody: { type: "anyone", role: "reader" },
  });

  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
}

function fileNameFromUrl(url: string): string {
  try {
    const segment = url.split("/").pop() || "cover.jpg";
    return decodeURIComponent(segment);
  } catch {
    return "cover.jpg";
  }
}

async function downloadImage(url: string): Promise<{ buffer: Buffer; mimeType: string }> {
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const arrayBuffer = await res.arrayBuffer();
  const mimeType = res.headers.get("content-type") || "image/jpeg";
  return { buffer: Buffer.from(arrayBuffer), mimeType };
}

async function main() {
  const books = await prisma.book.findMany({
    select: { id: true, title: true, imageUrl: true },
    orderBy: { title: "asc" },
  });

  const wordpressBooks = books.filter(
    (b) => b.imageUrl && b.imageUrl.includes("kairosbookshop.org")
  );

  console.log(`Books with WordPress covers: ${wordpressBooks.length}`);
  console.log(`Books with Drive/no cover: ${books.length - wordpressBooks.length}`);
  console.log();

  let uploaded = 0;
  let skipped = 0;
  let failed: { title: string; error: string }[] = [];

  for (const book of wordpressBooks) {
    const url = book.imageUrl!.split(",")[0].trim();

    try {
      const { buffer, mimeType } = await downloadImage(url);
      const fileName = fileNameFromUrl(url);
      const thumbnailUrl = await uploadCover(buffer, fileName, mimeType);

      await prisma.book.update({
        where: { id: book.id },
        data: { imageUrl: thumbnailUrl },
      });

      uploaded++;
      process.stdout.write(".");
      if (uploaded % 20 === 0) process.stdout.write(` ${uploaded}\n`);
    } catch (e: any) {
      failed.push({ title: book.title, error: e.message });
      process.stdout.write("x");
    }

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n\nUploaded & linked: ${uploaded}`);
  console.log(`Skipped (already Drive): ${skipped}`);

  if (failed.length > 0) {
    console.log(`\nFailed (${failed.length}):`);
    for (const f of failed) {
      console.log(`  x ${f.title}: ${f.error}`);
    }
  }

  await prisma.$disconnect();
}

main().catch(console.error);
