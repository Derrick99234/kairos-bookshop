import crypto from "crypto";

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const DRIVE_API = "https://www.googleapis.com/drive/v3";

function getServiceAccount(): Record<string, string> {
  const raw = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT;
  if (!raw) throw new Error("GOOGLE_DRIVE_SERVICE_ACCOUNT not set");
  return JSON.parse(raw);
}

function base64Url(input: Buffer): string {
  return input
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function getAccessToken(): Promise<string> {
  const sa = getServiceAccount();
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: sa.client_email,
    scope: SCOPES.join(" "),
    aud: TOKEN_URL,
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = base64Url(Buffer.from(JSON.stringify(header)));
  const encodedPayload = base64Url(Buffer.from(JSON.stringify(payload)));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signatureInput);
  const signature = base64Url(signer.sign(sa.private_key));

  const jwt = `${signatureInput}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const data = await res.json();
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
    `${DRIVE_API}/files?uploadType=multipart&fields=id`,
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
