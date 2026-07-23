import { uploadToDrive } from "@/lib/google-drive";
import { auth } from "@/lib/auth";
import { ok, err } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || (session.user as { role: string }).role !== "ADMIN") {
    return err("Forbidden", 403);
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return err("No file provided");

    const ext = file.name.includes(".") ? `.${file.name.split(".").pop()}` : "";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadType = (formData.get("type") as string) || "cover";
    const folderId =
      uploadType === "pdf"
        ? process.env.GOOGLE_DRIVE_PDF_FOLDER_ID
        : uploadType === "audio"
          ? process.env.GOOGLE_DRIVE_AUDIO_FOLDER_ID
          : uploadType === "blog"
            ? process.env.GOOGLE_DRIVE_BLOG_FOLDER_ID
            : process.env.GOOGLE_DRIVE_COVER_FOLDER_ID;

    const result = await uploadToDrive(buffer, fileName, file.type, folderId);

    return ok({ url: result.url, thumbnailUrl: result.thumbnailUrl, id: result.id });
  } catch (e) {
    console.error("Upload error:", e);
    return err("Upload failed", 500);
  }
}
