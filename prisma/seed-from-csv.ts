import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import fs from "fs";
import path from "path";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface Variant {
  format: string;
  price: number;
  comparePrice: number;
  stock: number;
  sku: string;
}

interface Product {
  title: string;
  slug: string;
  author: string;
  description: string;
  image_url: string;
  categories: string[];
  featured: boolean;
  variants: Variant[];
}

interface ImportData {
  categories: { name: string; slug: string }[];
  author: string;
  products: Product[];
}

async function main() {
  console.log("Reading import data...");

  const filePath = path.join(__dirname, "..", "public", "import-data.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const data: ImportData = JSON.parse(raw);

  console.log(`Categories: ${data.categories.length}`);
  console.log(`Products: ${data.products.length}`);

  // Create categories
  console.log("\nCreating categories...");
  const categoryMap = new Map<string, string>();
  for (const cat of data.categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: `Books in the ${cat.name} category`,
        imageUrl: "/images/categories/default.jpg",
      },
    });
    categoryMap.set(cat.slug, created.id);
  }

  // Create products
  console.log("\nCreating products...");
  let created = 0;
  let skipped = 0;

  for (const product of data.products) {
    // Skip test/placeholder products
    if (product.slug === "test" || !product.variants.length) {
      skipped++;
      continue;
    }

    // Find the best matching category
    let categoryId = "";
    for (const catName of product.categories) {
      const slug = data.categories.find(
        (c) => c.name.toLowerCase() === catName.toLowerCase().trim()
      )?.slug;
      if (slug && categoryMap.has(slug)) {
        categoryId = categoryMap.get(slug)!;
        break;
      }
    }
    // Fallback to first category
    if (!categoryId) {
      categoryId = categoryMap.values().next().value || "";
    }

    const book = await prisma.book.upsert({
      where: { slug: product.slug },
      update: {
        title: product.title,
        author: product.author,
        description: product.description || "",
        categoryId,
        imageUrl: product.image_url || "",
      },
      create: {
        title: product.title,
        slug: product.slug,
        author: product.author,
        description: product.description || "",
        categoryId,
        imageUrl: product.image_url || "",
        featured: product.featured,
        published: true,
      },
    });

    // Create variants
    for (const v of product.variants) {
      await prisma.bookVariant.upsert({
        where: { bookId_format: { bookId: book.id, format: v.format } },
        update: {
          price: v.price,
          comparePrice: v.comparePrice,
          stock: v.stock,
          sku: v.sku,
        },
        create: {
          bookId: book.id,
          format: v.format,
          price: v.price,
          comparePrice: v.comparePrice,
          stock: v.stock,
          sku: v.sku,
        },
      });
    }

    created++;
    if (created % 10 === 0) {
      console.log(`  ${created}/${data.products.length - skipped}...`);
    }
  }

  console.log(`\nDone! Created/updated ${created} products (skipped ${skipped}).`);
  console.log(`Run 'npx prisma db seed' to also load the original seed data (admin user, blog posts, etc.)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
