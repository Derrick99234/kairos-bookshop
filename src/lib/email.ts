import nodemailer from "nodemailer";
import { prisma } from "./prisma";

async function getTransporter() {
  const settings = await prisma.storeSetting.findMany({
    where: { key: { in: ["smtpHost", "smtpPort", "smtpUser", "smtpPass", "smtpFrom"] } },
  });

  const map: Record<string, string> = {};
  settings.forEach((s) => { map[s.key] = s.value; });

  const host = map.smtpHost || process.env.SMTP_HOST || "";
  const port = parseInt(map.smtpPort || process.env.SMTP_PORT || "587", 10);
  const user = map.smtpUser || process.env.SMTP_USER || "";
  const pass = map.smtpPass || process.env.SMTP_PASS || "";
  const from = map.smtpFrom || process.env.SMTP_FROM || "noreply@kairosbookshop.org";

  if (!host || !user || !pass) return null;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return { transporter, from };
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const t = await getTransporter();
  if (!t) return;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetUrl = `${appUrl}/reset-password?token=${token}`;
  await t.transporter.sendMail({
    from: t.from,
    to,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  });
}

export async function sendOrderConfirmation(to: string, orderNumber: string) {
  const t = await getTransporter();
  if (!t) return;
  await t.transporter.sendMail({
    from: t.from,
    to,
    subject: `Order Confirmed — #${orderNumber}`,
    html: `<p>Your order <strong>#${orderNumber}</strong> has been confirmed.</p>`,
  });
}
