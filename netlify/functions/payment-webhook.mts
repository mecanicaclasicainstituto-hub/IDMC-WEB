import type { Config } from "@netlify/functions";
import { syncPayment } from "./_store.mjs";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  const url = new URL(req.url);
  let paymentId = url.searchParams.get("data.id") || url.searchParams.get("id") || "";

  if (!paymentId) {
    try {
      const body = await req.json() as { data?: { id?: string | number } };
      paymentId = String(body.data?.id || "");
    } catch {
      paymentId = "";
    }
  }

  if (paymentId) {
    try {
      await syncPayment(paymentId);
    } catch (error) {
      console.error("No se pudo sincronizar el pago", error instanceof Error ? error.message : error);
    }
  }

  return new Response(null, { status: 200 });
};

export const config: Config = {
  path: "/api/payments/webhook",
};
