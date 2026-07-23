import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env") });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PAYSTACK_API = "https://api.paystack.co";

async function getSecretKey() {
  const setting = await prisma.storeSetting.findUnique({
    where: { key: "paystackSecretKey" },
  });
  return setting?.value || process.env.PAYSTACK_SECRET_KEY || "";
}

async function fetchAllSuccessfulTransactions() {
  const secret = await getSecretKey();
  const allTxns: any[] = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `${PAYSTACK_API}/transaction?status=success&perPage=100&page=${page}`,
      { headers: { Authorization: `Bearer ${secret}` } },
    );
    const body = await res.json();
    if (!body.status || !body.data?.length) break;
    allTxns.push(...body.data);
    if (page >= (body.meta?.pageCount || 1)) break;
    page++;
  }

  return allTxns;
}

async function main() {
  console.log("Finding stuck orders...\n");

  const unpaidOrders = await prisma.order.findMany({
    where: { paymentStatus: "UNPAID" },
    include: { items: true },
    orderBy: { createdAt: "asc" },
  });

  console.log(`Found ${unpaidOrders.length} unpaid orders in DB\n`);

  const unpaidIds = new Set(unpaidOrders.map((o) => o.id));

  console.log("Fetching all successful Paystack transactions...");
  const txns = await fetchAllSuccessfulTransactions();
  console.log(`Found ${txns.length} successful transactions\n`);

  const matched: Array<{ order: (typeof unpaidOrders)[0]; txn: any }> = [];

  for (const txn of txns) {
    const orderId = txn.metadata?.orderId as string | undefined;
    if (orderId && unpaidIds.has(orderId)) {
      matched.push({
        order: unpaidOrders.find((o) => o.id === orderId)!,
        txn,
      });
    }
  }

  console.log(`Matched ${matched.length} unpaid orders to successful Paystack transactions\n`);

  // Handle orders that match by reference pattern (orderNumber in reference)
  const unpaidMap = new Map(unpaidOrders.map((o) => [o.orderNumber, o]));
  const alreadyMatched = new Set(matched.map((m) => m.order.id));

  for (const txn of txns) {
    // Reference format: KB-{orderNumber}-{hex}
    const parts = txn.reference?.split("-") || [];
    if (parts.length >= 3 && parts[0] === "KB" && parts[1] === "KB") {
      const orderNumber = `KB-${parts[2]}`;
      const order = unpaidMap.get(orderNumber);
      if (order && !alreadyMatched.has(order.id)) {
        matched.push({ order, txn });
        alreadyMatched.add(order.id);
        console.log(`  Reference match: #${orderNumber} -> orderId ${order.id}`);
      }
    }
  }

  let recovered = 0;

  for (const { order, txn } of matched) {
    console.log(`\n  RECOVERING order #${order.orderNumber} (${order.email})`);

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED",
        paymentReference: txn.reference,
      },
    });

    for (const item of order.items) {
      if (item.format === "HARDCOPY") {
        if (item.variantId) {
          await prisma.bookVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        }
        await prisma.orderItem.update({
          where: { id: item.id },
          data: { fulfillmentStatus: "SHIPPING" },
        });
      } else {
        await prisma.orderItem.update({
          where: { id: item.id },
          data: { fulfillmentStatus: "DOWNLOADABLE" },
        });
      }
    }

    console.log(`    → ${order.items.length} items, payment: PAID`);
    recovered++;
  }

  let stillUnpaid = unpaidOrders.length - recovered;
  console.log(`\nDone. Recovered: ${recovered}, Still unpaid: ${stillUnpaid}`);
  if (stillUnpaid > 0) {
    console.log("\nUnpaid orders with no Paystack match:");
    for (const o of unpaidOrders) {
      if (!alreadyMatched.has(o.id)) {
        console.log(`  #${o.orderNumber} — ${o.email} — ${o.createdAt}`);
      }
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
