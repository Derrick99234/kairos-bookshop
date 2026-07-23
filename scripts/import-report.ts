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

const IMPORT_DIR = resolve(__dirname, "../import-files");

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

function similarity(a: string, b: string): number {
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  if (longer.length === 0) return 1;
  const editDist = (s1: string, s2: string): number => {
    const m = s1.length, n = s2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = s1[i - 1] === s2[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[m][n];
  };
  return 1 - editDist(longer, shorter) / longer.length;
}

async function main() {
  const allBooks = await prisma.book.findMany({
    include: { variants: true, category: true },
    orderBy: { title: "asc" },
  });

  const pdfFiles = readdirSync(IMPORT_DIR)
    .filter((f) => f.toLowerCase().endsWith(".pdf"))
    .sort();

  interface MatchResult {
    pdf: string;
    cleanedTitle: string;
    matchedBook: string | null;
    dbCategory: string | null;
    hasSoftcopy: boolean;
    hadExistingUrl: boolean;
    reason: string;
    closestDbTitle: string | null;
    similarity: number;
  }

  const results: MatchResult[] = [];

  for (const fileName of pdfFiles) {
    const title = cleanTitle(fileName);
    if (!title) {
      results.push({ pdf: fileName, cleanedTitle: "", matchedBook: null, dbCategory: null, hasSoftcopy: false, hadExistingUrl: false, reason: "Empty title", closestDbTitle: null, similarity: 0 });
      continue;
    }

    const exact = allBooks.find((b) => b.title.toLowerCase() === title.toLowerCase());
    if (exact) {
      const v = exact.variants.find((v) => v.format === "SOFTCOPY");
      const status = !v ? "⚠️ No SOFTCOPY variant" : v.downloadUrl ? "✅ Linked" : "❌ No URL set";
      results.push({ pdf: fileName, cleanedTitle: title, matchedBook: exact.title, dbCategory: exact.category?.name || null, hasSoftcopy: !!v, hadExistingUrl: !!v?.downloadUrl, reason: status, closestDbTitle: null, similarity: 0 });
      continue;
    }

    const t = title.toLowerCase();
    const fuzzy = allBooks.find((b) => {
      const bt = b.title.toLowerCase();
      return bt.includes(t) || t.includes(bt);
    });

    if (fuzzy) {
      const v = fuzzy.variants.find((v) => v.format === "SOFTCOPY");
      const status = !v ? "⚠️ No SOFTCOPY variant" : v.downloadUrl ? "✅ Linked" : "❌ No URL set";
      results.push({ pdf: fileName, cleanedTitle: title, matchedBook: fuzzy.title, dbCategory: fuzzy.category?.name || null, hasSoftcopy: !!v, hadExistingUrl: !!v?.downloadUrl, reason: status, closestDbTitle: null, similarity: 0 });
      continue;
    }

    // Find closest match by similarity
    let bestSim = 0;
    let bestBook: (typeof allBooks)[0] | null = null;
    for (const b of allBooks) {
      const sim = similarity(title.toLowerCase(), b.title.toLowerCase());
      if (sim > bestSim) { bestSim = sim; bestBook = b; }
    }

    results.push({
      pdf: fileName,
      cleanedTitle: title,
      matchedBook: null,
      dbCategory: null,
      hasSoftcopy: false,
      hadExistingUrl: false,
      reason: "No match",
      closestDbTitle: bestBook && bestSim > 0.3 ? bestBook.title : null,
      similarity: bestSim,
    });
  }

  const matched = results.filter((r) => r.matchedBook);
  const unmatched = results.filter((r) => !r.matchedBook);

  let report = `# Import Report — ${new Date().toISOString().split("T")[0]}\n\n`;

  report += `## Summary\n\n`;
  report += `- Total PDFs: ${results.length}\n`;
  report += `- Matched & linked: ${matched.length}\n`;
  report += `- Unmatched: ${unmatched.length}\n\n`;

  report += `---\n\n`;

  report += `## ✅ Matched Books (${matched.length})\n\n`;
  report += `| # | PDF Filename | Matched DB Title | DB Category | Status |\n`;
  report += `|---|-------------|-----------------|-------------|--------|\n`;
  matched.forEach((r, i) => {
    report += `| ${i + 1} | ${r.pdf} | ${r.matchedBook} | ${r.dbCategory || ""} | ${r.reason} |\n`;
  });

  report += `\n---\n\n`;

  report += `## ❌ Unmatched Books (${unmatched.length})\n\n`;
  report += `| # | PDF Filename | Cleaned Title | Closest DB Match (${Math.round(unmatched[0]?.similarity * 100)}% sim) | Issue | Suggestion |\n`;
  report += `|---|-------------|---------------|---------------------------------------------------|-------|------------|\n`;
  unmatched.forEach((r, i) => {
    const issue = r.closestDbTitle ? `Title mismatch` : "No similar title exists";
    const suggestion = r.closestDbTitle
      ? `Fix match: "${r.cleanedTitle}" ≈ "${r.closestDbTitle}"`
      : `Create new book: "${r.cleanedTitle}"`;
    const closest = r.closestDbTitle ? `${r.closestDbTitle} (${Math.round(r.similarity * 100)}%)` : "—";
    report += `| ${i + 1} | ${r.pdf} | ${r.cleanedTitle || "(empty)"} | ${closest} | ${issue} | ${suggestion} |\n`;
  });

  console.log(report);
}

main().finally(() => prisma.$disconnect());
