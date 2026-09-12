
import { and, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { orders } from "../../db/schema.js";

export const products = {
  "mecanica-clasica-nivel-1": {
    id: "mecanica-clasica-nivel-1",
    name: "Mecánica Clásica Nivel I",
    description: "Acceso completo al curso de fundamentos de mecánica clásica.",
    amountCents: 20000,
    currency: "MXN",
  },
} as const;

export type ProductId = keyof typeof products;

export function getProduct(productId: string) {
  return products[productId as ProductId] || null;
}

export function getMercadoPagoToken() {
  return process.env.MP_ACCESS_TOKEN || "";
}

export async function getOrder(orderId: string, checkoutToken: string) {
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.checkoutToken, checkoutToken)))
    .limit(1);

  return order || null;
}

export async function syncPayment(paymentId: string, expectedOrderId?: string) {
  const accessToken = getMercadoPagoToken();
  if (!accessToken) return null;

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) return null;

  const payment = await response.json() as {
    id?: number | string;
    status?: string;
    external_reference?: string;
  };
  const orderId = String(payment.external_reference || "");

  if (!orderId || (expectedOrderId && orderId !== expectedOrderId)) return null;

  const status = payment.status === "approved"
    ? "approved"
    : payment.status === "rejected" || payment.status === "cancelled"
      ? "rejected"
      : "pending";

  const [updatedOrder] = await db
    .update(orders)
    .set({
      status,
      providerPaymentId: String(payment.id || paymentId),
      updatedAt: new Date(),
      paidAt: status === "approved" ? new Date() : null,
    })
    .where(eq(orders.id, orderId))
    .returning();

  return updatedOrder || null;
}
