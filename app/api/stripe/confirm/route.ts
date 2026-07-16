import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { ensureSchema, getSql } from "../../../../lib/db";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const key = process.env.STRIPE_SECRET_KEY;
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!key || !sessionId) redirect("/portal");
  const stripe = new Stripe(key);
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.client_reference_id !== userId && session.metadata?.clerk_user_id !== userId) return new Response("Forbidden", { status: 403 });
  if (session.status === "complete" && (session.payment_status === "paid" || session.payment_status === "no_payment_required")) {
    await ensureSchema();
    const sql = getSql();
    await sql`INSERT INTO memberships (clerk_user_id,email,stripe_customer_id,stripe_subscription_id,status,updated_at) VALUES (${userId},${session.customer_details?.email || ''},${String(session.customer || '')},${String(session.subscription || '')},'active',now()) ON CONFLICT (clerk_user_id) DO UPDATE SET email=EXCLUDED.email,stripe_customer_id=EXCLUDED.stripe_customer_id,stripe_subscription_id=EXCLUDED.stripe_subscription_id,status='active',updated_at=now()`;
  }
  redirect("/portal?payment=success");
}
