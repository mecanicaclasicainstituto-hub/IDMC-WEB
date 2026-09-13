import type { Config } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { orders } from "../../db/schema.js";
import { getMercadoPagoToken, getProduct } from "./_store.mjs";

function cleanText(value: unknown, maxLength: number) {
  return String(value || "").trim().slice(0, maxLength);
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default async (req: Request) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Método no permitido." }, { status: 405 });
  }

  const accessToken = getMercadoPagoToken();
  if (!accessToken) {
    return Response.json(
      { error: "Los pagos todavía no están configurados. Agrega MP_ACCESS_TOKEN en Netlify." },
      { status: 503 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "La solicitud no contiene datos válidos." }, { status: 400 });
  }

  const product = getProduct(cleanText(payload.productId, 80));
  const buyerName = cleanText(payload.buyerName, 100) || "Estudiante";
  const buyerEmail = cleanText(payload.buyerEmail, 160).toLowerCase();

  if (!product) {
    return Response.json({ error: "El curso seleccionado no está disponible para compra." }, { status: 400 });
  }

  if (buyerEmail && !isEmail(buyerEmail)) {
    return Response.json({ error: "Escribe un correo electrónico válido." }, { status: 400 });
  }

  let order;
  try {
    [order] = await db.insert(orders).values({
      productId: product.id,
      productName: product.name,
      amountCents: product.amountCents,
      currency: product.currency,
      buyerName,
      buyerEmail: buyerEmail || null,
    }).returning();
  } catch (error) {
    console.error("No se pudo registrar la orden", error instanceof Error ? error.message : error);
    return Response.json(
      { error: "No se pudo preparar la orden. Verifica la conexión de la base de datos." },
      { status: 503 },
    );
  }

  const siteUrl = new URL(req.url).origin.replace(/\/$/, "");
  const resultUrl = (page: string) => {
    const url = new URL(page, `${siteUrl}/`);
    url.searchParams.set("order", order.id);
    url.searchParams.set("token", order.checkoutToken);
    return url.toString();
  };

  const preferenceBody = {
    items: [{
      id: product.id,
      title: product.name,
      description: product.description,
      quantity: 1,
      currency_id: product.currency,
      unit_price: product.amountCents / 100,
    }],
    payer: {
      name: buyerName,
      ...(buyerEmail ? { email: buyerEmail } : {}),
    },
    back_urls: {
      success: resultUrl("pago-exito.html"),
      failure: resultUrl("pago-error.html"),
      pending: resultUrl("pago-pendiente.html"),
    },
    auto_return: "approved",
    external_reference: order.id,
    notification_url: `${siteUrl}/api/payments/webhook`,
    metadata: { order_id: order.id, product_id: product.id },
  };

  try {
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferenceBody),
    });
    const preference = await response.json() as {
      id?: string;
      init_point?: string;
      message?: string;
    };

    if (!response.ok || !preference.id || !preference.init_point) {
      throw new Error(preference.message || "Mercado Pago rechazó la preferencia.");
    }

    await db.update(orders).set({
      providerPreferenceId: preference.id,
      updatedAt: new Date(),
    }).where(eq(orders.id, order.id));

    return Response.json({ checkoutUrl: preference.init_point }, { status: 201 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("No se pudo crear el checkout", detail);
    await db.update(orders).set({ status: "failed", updatedAt: new Date() }).where(eq(orders.id, order.id));
    return Response.json(
      { error: "No se pudo iniciar el pago. Intenta nuevamente.", detail },
      { status: 502 },
    );
  }
};

export const config: Config = {
  path: "/api/payments/checkout",
};
