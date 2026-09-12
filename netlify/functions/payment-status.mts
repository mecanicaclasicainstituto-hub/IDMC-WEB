import type { Config } from "@netlify/functions";
import { getOrder, syncPayment } from "./_store.mjs";

export default async (req: Request) => {
  if (req.method !== "GET") {
    return Response.json({ error: "Método no permitido." }, { status: 405 });
  }

  const url = new URL(req.url);
  const orderId = url.searchParams.get("order") || "";
  const checkoutToken = url.searchParams.get("token") || "";
  const paymentId = url.searchParams.get("payment_id") || url.searchParams.get("collection_id") || "";

  if (!orderId || !checkoutToken) {
    return Response.json({ error: "Faltan datos para consultar la compra." }, { status: 400 });
  }

  let order = await getOrder(orderId, checkoutToken);
  if (!order) {
    return Response.json({ error: "No encontramos esta compra." }, { status: 404 });
  }

  if (paymentId && order.status !== "approved") {
    await syncPayment(paymentId, order.id);
    order = await getOrder(orderId, checkoutToken);
  }

  return Response.json({
    status: order?.status,
    productId: order?.productId,
    productName: order?.productName,
  });
};

export const config: Config = {
  path: "/api/payments/status",
};
