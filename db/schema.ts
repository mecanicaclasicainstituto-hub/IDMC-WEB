import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const orders = pgTable("orders", {
  id: uuid().defaultRandom().primaryKey(),
  checkoutToken: uuid("checkout_token").defaultRandom().notNull().unique(),
  productId: text("product_id").notNull(),
  productName: text("product_name").notNull(),
  amountCents: integer("amount_cents").notNull(),
  currency: text().notNull().default("MXN"),
  buyerName: text("buyer_name").notNull(),
  buyerEmail: text("buyer_email"),
  status: text().notNull().default("pending"),
  provider: text().notNull().default("mercado_pago"),
  providerPreferenceId: text("provider_preference_id"),
  providerPaymentId: text("provider_payment_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
});
