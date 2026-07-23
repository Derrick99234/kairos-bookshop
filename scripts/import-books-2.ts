import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env") });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { readFileSync, readdirSync } from "fs";
import { google } from "googleapis";
import { Readable } from "stream";
import { OAuth2Client } from "google-auth-library";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const IMPORT_DIR = resolve(__dirname, "../import-files");

// More aggressive title cleaning
function cleanTitle(raw: string): string {
  let t = raw
    .replace(/\.pdf$/i, "")
    .replace(/\s*-\s*Dr\.?\s*Isaiah\s*Wealth\s*/gi, "")
    .replace(/\s*-\s*Isaiah\s*Michael\s*Wealth\s*/gi, "")
    .replace(/\s*Isaiah\s*Michael\s*wealth\s*/gi, "")
    .replace(/\s*Dr\s*Isaiah\s*Wealth\s*/gi, "")
    .replace(/\s*-\s*Embeded\s*/gi, "")
    .replace(/\s*\((1)\)\s*/gi, "")
    .replace(/\s*Amazon\s*/gi, "")
    .replace(/\s*Print\s*/gi, "")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Strip trailing author-like suffixes
  t = t.replace(/\s+-\s+.*$/, "").trim();
  t = t.replace(/\s+Isaiah.*$/, "").trim();
  t = t.replace(/\s+Dr\..*$/, "").trim();

  return t;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[&]/g, "and")
    .replace(/[,:;–—\-'']/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getGoogleClient(): OAuth2Client {
  const creds = JSON.parse(readFileSync(resolve(__dirname, "../google-credentials.json"), "utf-8"));
  const token = JSON.parse(readFileSync(resolve(__dirname, "../google-token.json"), "utf-8"));
  const { client_id, client_secret, redirect_uris } = creds.web || creds.installed;
  const auth = new OAuth2Client(client_id, client_secret, redirect_uris[0]);
  auth.setCredentials(token);
  return auth;
}

async function uploadToDrive(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
  const auth = getGoogleClient();
  const drive = google.drive({ version: "v3", auth: auth as any });

  const res = await drive.files.create({
    requestBody: { name: fileName },
    media: { body: Readable.from(fileBuffer), mimeType },
    fields: "id",
  });

  const fileId = res.data.id!;

  await drive.permissions.create({
    fileId,
    requestBody: { type: "anyone", role: "reader" },
  });

  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

async function main() {
  const allBooks = await prisma.book.findMany({
    include: { variants: true },
    orderBy: { title: "asc" },
  });

  const pdfFiles = readdirSync(IMPORT_DIR)
    .filter((f) => f.toLowerCase().endsWith(".pdf"))
    .sort();

  let matched = 0;
  let unmatched: { file: string; cleaned: string; bestGuess: string | null; reason: string }[] = [];

  for (const fileName of pdfFiles) {
    const rawTitle = cleanTitle(fileName);
    if (!rawTitle) {
      unmatched.push({ file: fileName, cleaned: "", bestGuess: null, reason: "Empty after cleaning" });
      continue;
    }

    const normalizedInput = normalize(rawTitle);
    const inputWords = normalizedInput.split(" ").filter(Boolean);

    // 1. Exact normalized match
    let book = allBooks.find((b) => normalize(b.title) === normalizedInput);

    // 2. Substring match (one title contained in the other)
    if (!book) {
      book = allBooks.find((b) => {
        const bt = normalize(b.title);
        return bt.includes(normalizedInput) || normalizedInput.includes(bt);
      });
    }

    // 3. Fuzzy word overlap — at least 70% of shorter title's words must match
    if (!book) {
      let bestOverlap = 0;
      for (const b of allBooks) {
        const btWords = normalize(b.title).split(" ").filter(Boolean);
        const shorter = inputWords.length < btWords.length ? inputWords : btWords;
        const longer = inputWords.length < btWords.length ? btWords : inputWords;
        const overlap = shorter.filter((w) => longer.includes(w)).length / shorter.length;
        if (overlap > bestOverlap) { bestOverlap = overlap; }
        if (overlap >= 0.7) { book = b; break; }
      }
    }

    if (!book) {
      // Find best guess for reporting
      let bestScore = 0;
      let bestBook: (typeof allBooks)[0] | null = null;
      for (const b of allBooks) {
        const btWords = normalize(b.title).split(" ").filter(Boolean);
        const shorter = inputWords.length < btWords.length ? inputWords : btWords;
        const longer = inputWords.length < btWords.length ? btWords : inputWords;
        const overlap = shorter.filter((w) => longer.includes(w)).length / shorter.length;
        if (overlap > bestScore) { bestScore = overlap; bestBook = b; }
      }
      unmatched.push({
        file: fileName,
        cleaned: rawTitle,
        bestGuess: bestBook?.title ?? null,
        reason: `No match (best: ${bestBook?.title ?? "none"} @ ${Math.round(bestScore * 100)}%)`,
      });
      continue;
    }

    // Found a match
    const variant = book.variants.find((v) => v.format === "SOFTCOPY");

    if (!variant) {
      // Book exists but has no SOFTCOPY variant — skip
      unmatched.push({
        file: fileName,
        cleaned: rawTitle,
        bestGuess: book.title,
        reason: `Matched "${book.title}" but no SOFTCOPY variant exists`,
      });
      continue;
    }

    if (variant.downloadUrl) {
      console.log(`⚠️  "${book.title}" already has a download URL — skipping`);
      continue;
    }

    // Upload and link
    const fileBuffer = readFileSync(resolve(IMPORT_DIR, fileName));
    const downloadUrl = await uploadToDrive(fileBuffer, fileName, "application/pdf");

    await prisma.bookVariant.update({
      where: { id: variant.id },
      data: { downloadUrl },
    });

    console.log(`✅ "${book.title}" → ${downloadUrl}`);
    matched++;
  }

  console.log(`\n\n=== Summary ===`);
  console.log(`Newly linked: ${matched}`);
  console.log(`Still unmatched: ${unmatched.length}`);
  if (unmatched.length > 0) {
    console.log(`\nUnmatched:`);
    for (const u of unmatched) {
      console.log(`  ❌ ${u.file}`);
      console.log(`     Cleaned: "${u.cleaned}"`);
      console.log(`     ${u.reason}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
