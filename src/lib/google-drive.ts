import { google } from "googleapis";
import { Readable } from "stream";

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_DRIVE_CLIENT_ID,
  process.env.GOOGLE_DRIVE_CLIENT_SECRET,
);
auth.setCredentials({ refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN });
const drive = google.drive({ version: "v3", auth });

export async function uploadToDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
): Promise<{ id: string; url: string; thumbnailUrl: string }> {
  const res = await drive.files.create({
    requestBody: { name: fileName },
    media: { mimeType, body: Readable.from(fileBuffer) },
    fields: "id",
  });

  if (!res.data.id) throw new Error("Upload failed");

  await drive.permissions.create({
    fileId: res.data.id,
    requestBody: { type: "anyone", role: "reader" },
  });

  const isImage = mimeType.startsWith("image/");
  const url = isImage
    ? `https://drive.google.com/thumbnail?id=${res.data.id}&sz=w1000`
    : `https://drive.google.com/uc?export=download&id=${res.data.id}`;
  const thumbnailUrl = `https://drive.google.com/thumbnail?id=${res.data.id}&sz=w400`;

  return { id: res.data.id, url, thumbnailUrl };
}

export async function deleteFromDrive(fileId: string): Promise<void> {
  await drive.files.delete({ fileId });
}
