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

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    const result = await uploadToDrive(buffer, fileName, file.type);

    return ok({ url: result.url, thumbnailUrl: result.thumbnailUrl, id: result.id });
  } catch (e) {
    console.error("Upload error:", e);
    return err("Upload failed", 500);
  }
}
