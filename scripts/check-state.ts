import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env") });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 52 books that were correctly linked in the first import
const FIRST_IMPORT_TITLES = [
  "ADVANCING IN PRAYERS",
  "BORN TO SET NEW RECORDS",
  "BURNING FOR THE LORD",
  "CELL SYSTEM AND CHURCH GROWTH",
  "CHURCH ADMINISTRATION AND FINANCES",
  "CHURCH AND MONEY",
  "CHURCH GROWTH PRINCIPLES",
  "CHURCH PIONEERING IN MINISTRY",
  "DISARMING THE DEVIL IN PRAYER",
  "ENGAGING SPIRITUAL PRAYERS",
  "ENJOYING DIVINE HEALTH",
  "FAITH ENGINE ROOM",
  "FAITH OF THE HIDDEN MAN",
  "FASTING AND FINANCIAL BREAKTHROUGH",
  "GETTING RESULTS IN PRAYER",
  "GOD WANTS YOU TO PROSPER",
  "GROWING A NEW CHURCH",
  "GROWING CHURCH SPIRITUALLY",
  "HOW TO RELEASE THE HEALING POWER OF GOD",
  "LEADERSHIP IN LAY MINISTRY",
  "MANAGING CAREER, BUSINESS AND MINISTRY",
  "PRAYING THROUGH THE PSALMS",
  "PROSPERING BY THE BLESSING",
  "REDISCOVERING FELLOWSHIP AND DEVOTION",
  "RETAINING THE HEALING YOU HAVE RECEIVED",
  "REACHING YOUR WORLD WITH CHRIST",
  "RECOGNIZING THE VOICE OF GOD",
  "SERVING IN LOVE",
  "SETTING OUT AS A SOUL WINNER",
  "SUPERNATURAL PROSPERITY",
  "THE ANOINTING FOR LAY MINISTRY",
  "THE GEOGRAPHY OF PROSPERITY",
  "THE HABIT OF BEING IN THE SPIRIT",
  "THE LANGUAGE OF THE PROPHETIC",
  "THE MECHANISM OF FAITH",
  "THE MINISTRY OF PRAYER",
  "THE MYSTERY OF ALTARS",
  "THE MYSTERY OF CROWNS AND ETERNAL REWARDS",
  "THE MYSTERY OF SPIRITUAL FATHERHOOD",
  "THE MYSTERY OF THANKSGIVING",
  "THE PURPOSE OF YOUR CHURCH",
  "THE REALM OF FAITH",
  "THE WHOLE ARMOUR OF GOD",
  "ENTERING THE REALM OF TRUST",
  "UNLOCKING YOUR DESTINY FROM THE COURT OF HEAVEN",
  "UNDERSTANDING PASTORAL MINISTRY",
  "UNDERSTANDING PRAYER",
  "VICTORY OVER THE SPIRIT OF FEAR, ANXIETY AND CONFUSION",
  "WHY WE GO TO CHURCH",
  "WITNESSING – STUDY COURSE SERIES",
];

// 18 target books that should get a PDF linked
const TARGET_BOOKS = [
  "ACCESSING THE HIDDEN POWERS OF HEAVEN",
  "BREAKING STRONGHOLD FROM THE COURT OF HEAVEN",
  "CHURCH GROWTH, CHURCH FINANCES AND PASTORAL MINISTRY",
  "COURTFARE – ADVANCED PRAYER SERIES",
  "FAITH – STUDY COURSE SERIES",
  "FIRSTFRUIT, FIRSTLINGS & FIRSTBORNS",
  "MAKING, MANAGING & MULTIPLYING MONEY",
  "THE MYSTERY OF FIRST FRUITS",
  "OBTAINING A CHANGE OF GARMENT FROM THE COURT OF HEAVEN",
  "PRAYER – STUDY COURSE SERIES",
  "REDEEMING YOUR LINEAGE FROM THE COURTS OF HEAVEN",
  "SATAN: THE HIDDEN ENEMY OF YOUR CHURCH",
  "TAKING SOULWINNING SERIOUSLY",
  "THE CONSCIOUSNESS OF LAY MINISTRY",
  "THE GOD KIND OF PROPSERITY",
  "DRESSCODE FOR ENTERING THE COURT OF HEAVEN",
  "YOUR MIND, YOUR PROSPERITY",
  "COURTFARE OR WARFARE",
];

async function main() {
  const books = await prisma.book.findMany({
    include: { variants: true },
    orderBy: { title: "asc" },
  });

  const withUrl = books.filter((b) =>
    b.variants.some((v) => v.format === "SOFTCOPY" && v.downloadUrl)
  );

  console.log(`\n=== ALL BOOKS WITH SOFTCOPY URLs (${withUrl.length}) ===\n`);

  for (const b of withUrl) {
    const isFirstImport = FIRST_IMPORT_TITLES.includes(b.title);
    const isTarget = TARGET_BOOKS.includes(b.title);
    const label = isFirstImport ? "1ST" : isTarget ? "🎯" : "❌";
    console.log(`${label} ${b.title}`);
  }

  console.log(`\n=== BREAKDOWN ===`);
  const firstImportCount = withUrl.filter((b) => FIRST_IMPORT_TITLES.includes(b.title)).length;
  const targetCount = withUrl.filter((b) => TARGET_BOOKS.includes(b.title)).length;
  const otherCount = withUrl.filter(
    (b) => !FIRST_IMPORT_TITLES.includes(b.title) && !TARGET_BOOKS.includes(b.title)
  ).length;
  console.log(`1st import correct: ${firstImportCount}`);
  console.log(`Target books (should be linked): ${targetCount}`);
  console.log(`OTHER / WRONG: ${otherCount}`);

  if (otherCount > 0) {
    console.log(`\n=== WRONG — need to clear ===`);
    for (const b of withUrl) {
      if (!FIRST_IMPORT_TITLES.includes(b.title) && !TARGET_BOOKS.includes(b.title)) {
        console.log(`  ${b.title}`);
      }
    }
  }

  // Also check target books without URLs
  console.log(`\n=== TARGET BOOKS WITHOUT URLs ===`);
  for (const t of TARGET_BOOKS) {
    const b = books.find((x) => x.title === t);
    if (!b) {
      console.log(`NOT FOUND: ${t}`);
      continue;
    }
    const sv = b.variants.find((v) => v.format === "SOFTCOPY");
    if (!sv) {
      console.log(`NO SOFTCOPY VARIANT: ${t}`);
    } else if (!sv.downloadUrl) {
      console.log(`NO URL: ${t}`);
    }
  }

  await prisma.$disconnect();
}

main();
