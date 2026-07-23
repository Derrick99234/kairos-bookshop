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

const BLOG_FOLDER_ID = process.env.GOOGLE_DRIVE_BLOG_FOLDER_ID;

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_DRIVE_CLIENT_ID,
  process.env.GOOGLE_DRIVE_CLIENT_SECRET,
);
auth.setCredentials({ refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN });
const drive = google.drive({ version: "v3", auth: auth as any });

async function uploadImage(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
  const res = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [BLOG_FOLDER_ID!],
    },
    media: { mimeType, body: Readable.from(fileBuffer) },
    fields: "id",
  });

  await drive.permissions.create({
    fileId: res.data.id!,
    requestBody: { role: "reader", type: "anyone" },
  });

  return `https://drive.google.com/thumbnail?id=${res.data.id}&sz=w1000`;
}

async function main() {
  const posts = await prisma.blogPost.findMany({
    where: { imageUrl: { not: "" } },
  });

  console.log(`Found ${posts.length} posts with images\n`);

  let uploaded = 0;
  let skipped = 0;

  for (const post of posts) {
    const url = post.imageUrl;

    if (url.includes("drive.google.com")) {
      console.log(`  SKIP (already Drive): ${post.slug}`);
      skipped++;
      continue;
    }

    console.log(`  Downloading: ${url}`);

    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        console.log(`    Failed to download (status ${resp.status}), skipping`);
        skipped++;
        continue;
      }

      const blob = await resp.blob();
      const buffer = Buffer.from(await blob.arrayBuffer());
      const mimeType = blob.type || "image/png";
      const ext = mimeType.split("/")[1] || "png";
      const fileName = `blog-${post.slug.slice(0, 50)}.${ext}`;

      const driveUrl = await uploadImage(buffer, fileName, mimeType);

      await prisma.blogPost.update({
        where: { id: post.id },
        data: { imageUrl: driveUrl },
      });

      console.log(`    Uploaded -> ${driveUrl}`);
      uploaded++;
    } catch (e) {
      console.log(`    Error: ${e}, skipping`);
      skipped++;
    }
  }

  console.log(`\nDone. Uploaded: ${uploaded}, Skipped: ${skipped}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
