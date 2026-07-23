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
const SUBFOLDER_ID = "1gF3ObjsK85XqfJHFVH1siKRoZNaKqjMY";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function cleanTitle(raw: string): string {
  let t = raw
    .replace(/\.pdf$/i, "")
    .replace(/\s*-\s*Dr\.?\s*Isaiah\s*Wealth\s*/gi, "")
    .replace(/\s*-\s*Isaiah\s*Michael\s*Wealth\s*/gi, "")
    .replace(/\s*Isaiah\s*Michael\s*Wealth\s*/gi, "")
    .replace(/\s*Isaiah\s*Michael\s*wealth\s*/gi, "")
    .replace(/\s*Dr\s*Isaiah\s*Wealth\s*/gi, "")
    .replace(/\s*-\s*Embeded\s*/gi, "")
    .replace(/\s*\((1)\)\s*/gi, "")
    .replace(/\s*Amazon\s*/gi, "")
    .replace(/\s*Print\s*/gi, "")
    .replace(/\s*2lqryl\s*/gi, "")
    .replace(/\s*snrlcf\s*/gi, "")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  t = t.replace(/\s+-\s+.*$/, "").trim();
  t = t.replace(/\s+Isaiah.*$/i, "").trim();
  t = t.replace(/\s+Dr\..*$/i, "").trim();
  return t;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[&]/g, "and")
    .replace(/[,:;–—\-'']/g, " ")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function wordVariants(a: string, b: string): boolean {
  if (a === b) return true;
  if (a + "s" === b || b + "s" === a) return true;
  if (a.includes(b) || b.includes(a)) return true;
  const dp = (s1: string, s2: string): number => {
    const m = s1.length, n = s2.length;
    const d: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) d[i][0] = i;
    for (let j = 0; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        d[i][j] = s1[i-1] === s2[j-1] ? d[i-1][j-1] : 1 + Math.min(d[i-1][j], d[i][j-1], d[i-1][j-1]);
    return d[m][n];
  };
  return dp(a, b) <= 2;
}

function smartOverlap(aWords: string[], bWords: string[]): number {
  const shorter = aWords.length < bWords.length ? aWords : bWords;
  const longer = aWords.length < bWords.length ? bWords : aWords;
  if (shorter.length === 0) return 0;
  let matches = 0;
  for (const sw of shorter) {
    if (longer.some(lw => wordVariants(sw, lw))) matches++;
  }
  return matches / shorter.length;
}

async function uploadToFolder(
  fileBuffer: Buffer,
  fileName: string,
  retries = 3,
): Promise<string> {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_DRIVE_CLIENT_ID,
    process.env.GOOGLE_DRIVE_CLIENT_SECRET,
  );
  auth.setCredentials({ refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN });

  const drive = google.drive({ version: "v3", auth });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await drive.files.create({
        requestBody: {
          name: fileName,
          parents: [SUBFOLDER_ID],
        },
        media: { body: Readable.from(fileBuffer), mimeType: "application/pdf" },
        fields: "id",
      });

      await drive.permissions.create({
        fileId: res.data.id!,
        requestBody: { type: "anyone", role: "reader" },
      });

      return `https://drive.google.com/uc?export=download&id=${res.data.id}`;
    } catch (e: any) {
      if (attempt < retries) {
        const wait = attempt * 3000;
        process.stdout.write(`\n  retry ${attempt}/${retries} after ${wait}ms...`);
        await sleep(wait);
      } else {
        throw e;
      }
    }
  }
  throw new Error("Upload failed after retries");
}

async function main() {
  const books = await prisma.book.findMany({
    include: { variants: true },
  });

  const pdfFiles = readdirSync(IMPORT_DIR)
    .filter((f) => f.toLowerCase().endsWith(".pdf"))
    .sort();

  let uploaded = 0;
  let failed: string[] = [];
  let notFound: string[] = [];

  for (const fileName of pdfFiles) {
    const raw = cleanTitle(fileName);
    const ni = normalize(raw);
    const niWords = ni.split(" ").filter(Boolean);
    if (!ni) continue;

    // Find matching book (has SOFTCOPY variant — may or may not have URL yet)
    let book = books.find((b) => {
      const v = b.variants.find((v) => v.format === "SOFTCOPY");
      if (!v) return false;
      const bt = normalize(b.title);
      return bt === ni || bt.includes(ni) || ni.includes(bt);
    });

    if (!book) {
      for (const b of books) {
        const v = b.variants.find((v) => v.format === "SOFTCOPY");
        if (!v) continue;
        const btWords = normalize(b.title).split(" ").filter(Boolean);
        if (smartOverlap(niWords, btWords) >= 0.65) { book = b; break; }
      }
    }

    if (!book) {
      notFound.push(fileName);
      continue;
    }

    const variant = book.variants.find((v) => v.format === "SOFTCOPY")!;

    try {
      const fileBuffer = readFileSync(resolve(IMPORT_DIR, fileName));
      const newUrl = await uploadToFolder(fileBuffer, fileName);

      await prisma.bookVariant.update({
        where: { id: variant.id },
        data: { downloadUrl: newUrl },
      });

      uploaded++;
      process.stdout.write(".");
      if (uploaded % 20 === 0) process.stdout.write(` ${uploaded}\n`);
    } catch (e: any) {
      failed.push(`${fileName} → ${book.title}: ${e.message}`);
      process.stdout.write("x");
    }

    // Small delay between uploads
    await sleep(500);
  }

  console.log(`\n\nUploaded & linked: ${uploaded}`);

  if (failed.length > 0) {
    console.log(`\nFailed:`);
    for (const f of failed) console.log(`  x ${f}`);
  }
  if (notFound.length > 0) {
    console.log(`\nCould not match:`);
    for (const f of notFound) console.log(`  ? ${f}`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
