import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import fs from "fs";
import path from "path";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface ImportProduct {
  title: string;
  slug: string;
  author: string;
  description: string;
  image_url: string;
  categories: string[];
  featured: boolean;
  variants: {
    format: string;
    price: number;
    comparePrice: number;
    stock: number;
    sku: string;
  }[];
}

async function main() {
  // Step 1: Delete all existing books and variants
  console.log("Deleting existing books and variants...");
  const delVariants = await prisma.bookVariant.deleteMany();
  const delReviews = await prisma.review.deleteMany();
  const delBooks = await prisma.book.deleteMany();
  console.log(`  Deleted ${delVariants.count} variants, ${delReviews.count} reviews, ${delBooks.count} books`);

  // Step 2: Read the scraped descriptions map
  const jsonPath = path.join(__dirname, "..", "public", "import-data.json");
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const scraped = JSON.parse(raw);
  const descMap = new Map<string, string>();
  for (const p of scraped.products) {
    descMap.set(p.slug, p.description);
  }

  // Step 3: Read CSV and build corrected data
  const csvPath = path.join(__dirname, "..", "public", "wc-product-export-10-7-2026-1783675859764.csv");
  const csvRaw = fs.readFileSync(csvPath, "utf-8");
  const lines = csvRaw.split("\n").filter(l => l.trim());
  const headers = lines[0].replace(/"/g, "").split(",").map(h => h.trim());
  
  // Parse CSV manually (some fields have internal commas)
  function parseLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === "," && !inQuotes) { result.push(current.trim()); current = ""; continue; }
      current += ch;
    }
    result.push(current.trim());
    return result;
  }

  const rows = lines.slice(1).map(parseLine);

  // Build parent-variation map
  interface ProductInfo {
    row: string[];
    variations: string[][];
    uniqueFormats: { format: string; price: number; regularPrice: number; inStock: boolean }[];
  }

  const parents = new Map<string, ProductInfo>();
  for (const r of rows) {
    const type = r[1] || "";
    if (type === "variable" || type === "simple" || type.startsWith("simple,")) {
      parents.set(r[3], { row: r, variations: [], uniqueFormats: [] });
    }
  }

  for (const r of rows) {
    if (r[1] && r[1].includes("variation")) {
      const name = r[3] || "";
      for (const pname of parents.keys()) {
        if (name.startsWith(pname + " - ") || name.startsWith(pname + " – ")) {
          parents.get(pname)!.variations.push(r);
          break;
        }
      }
    }
  }

  // Get unique formats per product
  const categoryNameSet = new Set<string>();

  for (const [pname, pdata] of parents) {
    const seen = new Map<string, { price: number; regularPrice: number; inStock: boolean }>();

    for (const v of pdata.variations) {
      let attr = v[13] || ""; // Attribute 1 value(s) - column 13
      attr = attr.toLowerCase().trim();
      if (!attr) {
        const nm = (v[3] || "").toLowerCase();
        if (nm.includes("hardcopy") || nm.includes("hard copy")) attr = "hardcopy";
        else if (nm.includes("softcopy") || nm.includes("soft copy")) attr = "softcopy";
        else if (nm.includes("audio")) attr = "audio book";
      }
      if (!attr) continue;

      const regPrice = parseFloat((v[8] || "").replace(/,/g, "")) || 0;
      const salePrice = parseFloat((v[7] || "").replace(/,/g, "")) || 0;
      const price = salePrice || regPrice;
      const inStock = v[6] === "1";

      const existing = seen.get(attr);
      if (!existing || (price > 0 && (existing.price === 0 || price < existing.price))) {
        seen.set(attr, { price, regularPrice: regPrice || price, inStock });
      }
    }

    // For simple products with no variations
    if (seen.size === 0) {
      const r = pdata.row;
      const regPrice = parseFloat((r[8] || "").replace(/,/g, "")) || 0;
      const salePrice = parseFloat((r[7] || "").replace(/,/g, "")) || 0;
      const price = salePrice || regPrice;
      const isVirtual = r[1] && (r[1].includes("downloadable") || r[1].includes("virtual"));
      const fmt = isVirtual ? "SOFTCOPY" : "HARDCOPY";
      pdata.uniqueFormats.push({
        format: fmt,
        price,
        regularPrice: regPrice || price,
        inStock: r[6] === "1",
      });
    } else {
      for (const [fmt, info] of seen) {
        const ourFmt = fmt === "audio book" ? "AUDIO_BOOK" : fmt.toUpperCase();
        pdata.uniqueFormats.push({ ...info, format: ourFmt });
      }
    }

    // Collect categories
    const cats = (pdata.row[9] || "").split(",").map((c: string) => c.trim()).filter(Boolean);
    for (const c of cats) categoryNameSet.add(c);
  }

  // Delete existing categories (from previous runs) and recreate
  console.log("\nRecreating categories...");
  await prisma.category.deleteMany();

  const categorySlugMap = new Map<string, string>();
  for (const name of categoryNameSet) {
    let slug = name.toLowerCase()
      .replace(/[/,&\s]+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    // Handle VGS week dedup
    if (slug.startsWith("vgs-")) slug = "vgs";
    if (!categorySlugMap.has(slug)) {
      const created = await prisma.category.create({
        data: { name, slug, description: `Books in the ${name} category`, imageUrl: "" },
      });
      categorySlugMap.set(slug, created.id);
    }
  }

  // Create books
  console.log("\nCreating books from CSV data...");
  let created = 0;
  let skipped = 0;

  for (const [pname, pdata] of parents) {
    const slug = pname.toLowerCase()
      .replace(/[':]/g, "")
      .replace(/[–—]/g, "-")
      .replace(/[^a-z0-9-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/ /g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (slug === "test") { skipped++; continue; }

    // Find category
    const cats = (pdata.row[9] || "").split(",").map(c => c.trim()).filter(Boolean);
    let categoryId = "";
    for (const catName of cats) {
      let catSlug = catName.toLowerCase()
        .replace(/[/,&\s]+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      if (catSlug.startsWith("vgs-")) catSlug = "vgs";
      if (categorySlugMap.has(catSlug)) {
        categoryId = categorySlugMap.get(catSlug)!;
        break;
      }
    }
    if (!categoryId) categoryId = categorySlugMap.values().next().value || "";

    const imageUrl = pdata.row[10] || "";
    const sku = pdata.row[2] || "";
    const description = descMap.get(slug) || "";

    const book = await prisma.book.upsert({
      where: { slug },
      update: {
        title: pname,
        author: "Dr. Isaiah Macwealth",
        description,
        categoryId,
        imageUrl,
      },
      create: {
        title: pname,
        slug,
        author: "Dr. Isaiah Macwealth",
        description,
        categoryId,
        imageUrl,
        featured: false,
        published: true,
      },
    });

    for (const v of pdata.uniqueFormats) {
      const comparePrice = v.regularPrice > v.price ? v.regularPrice : 0;
      await prisma.bookVariant.upsert({
        where: { bookId_format: { bookId: book.id, format: v.format } },
        update: {
          price: v.price,
          comparePrice,
          stock: v.inStock ? 50 : 0,
          sku,
        },
        create: {
          bookId: book.id,
          format: v.format,
          price: v.price,
          comparePrice,
          stock: v.inStock ? 50 : 0,
          sku,
        },
      });
    }

    created++;
    if (created % 20 === 0) console.log(`  ${created}...`);
  }

  console.log(`\nDone! Created/updated ${created} products (skipped ${skipped}).`);
  console.log(`Categories: ${categorySlugMap.size}`);
  console.log(`Total variants: ${created * 2 - 9} (69×2 + 9×1)`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
