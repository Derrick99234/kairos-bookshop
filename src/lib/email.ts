import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendPasswordResetEmail(to: string, token: string) {
  if (!resend) return;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetUrl = `${appUrl}/reset-password?token=${token}`;
  await resend.emails.send({
    from: "Kairos Bookshop <noreply@kairosbookshop.org>",
    to,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  });
}

export async function sendOrderConfirmation(
  to: string,
  orderNumber: string
) {
  if (!resend) return;
  await resend.emails.send({
    from: "Kairos Bookshop <noreply@kairosbookshop.org>",
    to,
    subject: `Order Confirmed — #${orderNumber}`,
    html: `<p>Your order <strong>#${orderNumber}</strong> has been confirmed.</p>`,
  });
}
