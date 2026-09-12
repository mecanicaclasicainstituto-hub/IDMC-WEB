CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"checkout_token" uuid DEFAULT gen_random_uuid() NOT NULL UNIQUE,
	"product_id" text NOT NULL,
	"product_name" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" text DEFAULT 'MXN' NOT NULL,
	"buyer_name" text NOT NULL,
	"buyer_email" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"provider" text DEFAULT 'mercado_pago' NOT NULL,
	"provider_preference_id" text,
	"provider_payment_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"paid_at" timestamp with time zone
);
