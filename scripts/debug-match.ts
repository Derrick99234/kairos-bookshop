import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const titles = ['FIRSTFRUIT, FIRSTLINGS & FIRSTBORNS', 'TAKING SOULWINNING SERIOUSLY', 'COURTFARE OR WARFARE'];
  for (const t of titles) {
    const b = await prisma.book.findFirst({ where: { title: t }, include: { variants: true } });
    if (b) {
      console.log('Found: ' + b.title);
      b.variants.forEach(v => console.log('  [' + v.format + '] price:' + v.price + ' hasURL:' + (v.downloadUrl ? 'YES' : 'NO')));
    } else {
      console.log('MISSING: ' + t);
    }
  }

  // Also check the actual title in DB for firstfruit
  const ff = await prisma.book.findMany({ where: { title: { contains: 'FIRSTFRUIT' } } });
  ff.forEach(b => console.log('FF match: ' + b.title));

  await prisma.$disconnect();
}

main();
