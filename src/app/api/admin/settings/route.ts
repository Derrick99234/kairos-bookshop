import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err } from "@/lib/utils";

const SETTING_KEYS = ["paystackPublicKey", "paystackSecretKey", "smtpHost", "smtpPort", "smtpUser", "smtpPass", "smtpFrom", "gaTrackingId", "fbPixelId", "usdRate"];

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return err("Unauthorized", 401);

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true, image: true },
  });

  const settings = await prisma.storeSetting.findMany({
    where: { key: { in: SETTING_KEYS } },
  });
  const settingsMap: Record<string, string> = {};
  settings.forEach((s) => { settingsMap[s.key] = s.value; });

  return ok({
    profile: { name: admin?.name || "", email: admin?.email || "", phone: admin?.phone || "", image: admin?.image || "" },
    integrations: {
      paystackPublicKey: settingsMap.paystackPublicKey || "",
      paystackSecretKey: settingsMap.paystackSecretKey || "",
      smtpHost: settingsMap.smtpHost || "",
      smtpPort: settingsMap.smtpPort || "",
      smtpUser: settingsMap.smtpUser || "",
      smtpPass: settingsMap.smtpPass || "",
      smtpFrom: settingsMap.smtpFrom || "",
      gaTrackingId: settingsMap.gaTrackingId || "",
      fbPixelId: settingsMap.fbPixelId || "",
    },
    pricing: {
      usdRate: settingsMap.usdRate || "1500",
    },
  });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return err("Unauthorized", 401);

  try {
    const body = await req.json();

    if (body.profile) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          ...(body.profile.name !== undefined && { name: body.profile.name }),
          ...(body.profile.email !== undefined && { email: body.profile.email }),
          ...(body.profile.phone !== undefined && { phone: body.profile.phone }),
          ...(body.profile.image !== undefined && { image: body.profile.image }),
        },
      });
    }

    if (body.integrations) {
      const upserts = Object.entries(body.integrations).map(([key, value]) =>
        prisma.storeSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        })
      );
      await Promise.all(upserts);
    }

    if (body.pricing) {
      const upserts = Object.entries(body.pricing).map(([key, value]) =>
        prisma.storeSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        })
      );
      await Promise.all(upserts);
    }

    return ok({ message: "Settings saved" });
  } catch {
    return err("Something went wrong", 500);
  }
}
