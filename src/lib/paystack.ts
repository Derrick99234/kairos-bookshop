import { prisma } from "./prisma";

const PAYSTACK_API = "https://api.paystack.co";

async function getSecretKey() {
  const setting = await prisma.storeSetting.findUnique({ where: { key: "paystackSecretKey" } });
  return setting?.value || process.env.PAYSTACK_SECRET_KEY || "";
}

interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    paid_at: string;
  };
}

export async function initializePayment(params: {
  email: string;
  amount: number;
  reference: string;
  metadata?: Record<string, unknown>;
}): Promise<PaystackInitResponse> {
  const secret = await getSecretKey();
  const res = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amount * 100),
      reference: params.reference,
      metadata: params.metadata,
    }),
  });
  return res.json();
}

export async function verifyPayment(
  reference: string
): Promise<PaystackVerifyResponse> {
  const secret = await getSecretKey();
  const res = await fetch(
    `${PAYSTACK_API}/transaction/verify/${reference}`,
    {
      headers: { Authorization: `Bearer ${secret}` },
    }
  );
  return res.json();
}
