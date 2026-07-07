const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_API = "https://api.paystack.co";

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
  const res = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
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
  const res = await fetch(
    `${PAYSTACK_API}/transaction/verify/${reference}`,
    {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    }
  );
  return res.json();
}
