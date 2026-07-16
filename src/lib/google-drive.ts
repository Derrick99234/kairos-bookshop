const TOKEN_URL = "https://oauth2.googleapis.com/token";
const DRIVE_API = "https://www.googleapis.com/drive/v3";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET, and GOOGLE_DRIVE_REFRESH_TOKEN must be set");
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();
  if (!data.access_token) throw new Error(data.error_description || data.error || "Failed to get access token");
  return data.access_token;
}

export async function uploadToDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<{ id: string; url: string; thumbnailUrl: string }> {
  const token = await getAccessToken();
  const parentFolderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;

  const metadata: Record<string, unknown> = { name: fileName };
  if (parentFolderId) metadata.parents = [parentFolderId];

  const boundary = "drive_boundary";
  const bodyParts = [
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`,
    `--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`,
    fileBuffer,
    `\r\n--${boundary}--`,
  ];

  const body = Buffer.concat(
    bodyParts.map((p) => (typeof p === "string" ? Buffer.from(p, "utf-8") : p))
  );

  const res = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body,
    }
  );

  const data = await res.json();

  if (!data.id) throw new Error(data.error?.message || "Upload failed");

  await fetch(`${DRIVE_API}/files/${data.id}/permissions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: "anyone", role: "reader" }),
  });

  const isImage = mimeType.startsWith("image/");
  const url = isImage
    ? `https://drive.google.com/thumbnail?id=${data.id}&sz=w1000`
    : `https://drive.google.com/uc?export=download&id=${data.id}`;
  const thumbnailUrl = `https://drive.google.com/thumbnail?id=${data.id}&sz=w400`;

  return { id: data.id, url, thumbnailUrl };
}

export async function deleteFromDrive(fileId: string): Promise<void> {
  const token = await getAccessToken();
  await fetch(`${DRIVE_API}/files/${fileId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
