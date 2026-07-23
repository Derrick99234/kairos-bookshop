import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env") });

import { google } from "googleapis";
import { Readable } from "stream";

async function main() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_DRIVE_CLIENT_ID,
    process.env.GOOGLE_DRIVE_CLIENT_SECRET,
  );
  auth.setCredentials({ refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN });

  const drive = google.drive({ version: "v3", auth });

  const folderId = "1gF3ObjsK85XqfJHFVH1siKRoZNaKqjMY";

  // Test: upload a tiny text file
  const content = "test file for kairos bookshop";
  const res = await drive.files.create({
    requestBody: {
      name: "_test_upload.txt",
      parents: [folderId],
    },
    media: { body: Readable.from(Buffer.from(content)), mimeType: "text/plain" },
    fields: "id,parents",
  });

  console.log("File created:", res.data.id);
  console.log("Parents:", JSON.stringify(res.data.parents));
  console.log("SUCCESS — parents parameter works!");

  // Clean up test file
  await drive.files.delete({ fileId: res.data.id! });
  console.log("Test file deleted.");
}

main().catch((e) => {
  console.error("FAILED:", e.message);
  if (e.response) console.error(e.response.data);
});
