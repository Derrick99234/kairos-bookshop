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

  const order = await prisma.order.findFirst({
    where: { orderNumber },
    include: { items: true },
  });

  const books = order
    ? await prisma.book.findMany({
        where: { id: { in: order.items.map((i) => i.bookId) } },
        select: { id: true, slug: true },
      })
    : [];
  const bookMap = new Map(books.map((b) => [b.id, b.slug]));

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!order) {
    await t.transporter.sendMail({
      from: t.from,
      to,
      subject: `Order Confirmed — #${orderNumber}`,
      html: `<p>Your order <strong>#${orderNumber}</strong> has been confirmed.</p>`,
    });
    return;
  }

  const softcopyItems = order.items.filter((i) => i.format !== "HARDCOPY");
  const hardcopyItems = order.items.filter((i) => i.format === "HARDCOPY");

  let softcopyHtml = "";
  if (softcopyItems.length > 0) {
    softcopyHtml = `
      <tr>
        <td style="padding: 0 0 20px 0;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #1e293b;">📥 Your Digital Books Are Ready</h3>
          <table style="width: 100%; border-collapse: collapse;">
              ${softcopyItems.map((item) => `
              <tr>
                <td style="padding: 10px 14px; background: #f8fafc; border-radius: 8px; margin-bottom: 8px; display: block;">
                  <table style="width: 100%;">
                    <tr>
                      <td style="font-size: 14px; color: #1e293b; font-weight: 600;">${item.title}</td>
                      <td style="text-align: right; width: 120px;">
                        <a href="${appUrl}/api/download/${item.id}" style="display: inline-block; background: #E03636; color: #ffffff; padding: 8px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600;">Download</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            `).join("")}
          </table>
        </td>
      </tr>`;
  }

  let hardcopyHtml = "";
  if (hardcopyItems.length > 0) {
    hardcopyHtml = `
      <tr>
        <td style="padding: 0 0 20px 0;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #1e293b;">📦 Physical Books — Shipping Soon</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${hardcopyItems.map((item) => `
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #475569;">
                  ${item.title} × ${item.quantity}
                </td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #475569; text-align: right;">
                  ₦${(item.price * item.quantity).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            `).join("")}
          </table>
        </td>
      </tr>`;
  }

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table style="width: 100%; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <table style="width: 100%;">
          <tr>
            <td style="background: #E03636; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Order Confirmed ✓</h1>
              <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0 0; font-size: 14px;">#${orderNumber}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 16px; color: #1e293b; margin: 0 0 20px 0;">Thank you for your order! Your payment has been received successfully.</p>

              ${softcopyHtml}
              ${hardcopyHtml}

              <table style="width: 100%; border-top: 2px solid #e2e8f0; padding-top: 16px;">
                <tr>
                  <td style="font-size: 14px; color: #64748b;">Subtotal</td>
                  <td style="text-align: right; font-size: 14px; color: #1e293b;">₦${order.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                ${order.shipping > 0 ? `
                <tr>
                  <td style="font-size: 14px; color: #64748b;">Shipping</td>
                  <td style="text-align: right; font-size: 14px; color: #1e293b;">₦${order.shipping.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>` : ""}
                <tr>
                  <td style="font-size: 18px; font-weight: 700; color: #1e293b; padding-top: 8px;">Total</td>
                  <td style="text-align: right; font-size: 18px; font-weight: 700; color: #E03636; padding-top: 8px;">₦${order.total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 30px; background: #f8fafc; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="font-size: 13px; color: #94a3b8; margin: 0;">
                Kairos Bookshop &mdash; Gospel Pillars Ministry<br>
                <a href="${appUrl}" style="color: #E03636; text-decoration: none;">${appUrl}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await t.transporter.sendMail({
    from: t.from,
    to,
    subject: `Order Confirmed — #${orderNumber}`,
    html,
  });
}
