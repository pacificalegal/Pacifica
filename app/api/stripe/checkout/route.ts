import { auth, currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ensureSchema, getSql, TERMS_VERSION } from "../../../../lib/db";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const form = await request.formData();
  if (form.get("termsAccepted") !== "yes" || form.get("billingConsent") !== "on" || form.get("termsVersion") !== TERMS_VERSION) return new Response("You must accept the current membership and recurring-payment terms.", { status: 400 });
  const user = await currentUser();
  const email = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress || user?.emailAddresses[0]?.emailAddress;
  if (!email) return new Response("Account email unavailable", { status: 400 });
  const key = process.env.STRIPE_SECRET_KEY, price = process.env.STRIPE_PRICE_ID, base = process.env.NEXT_PUBLIC_APP_URL;
  if (!key || !price || !base) return new Response("Stripe environment variables are not configured", { status: 503 });

  await ensureSchema();
  const sql = getSql();
  const h = await headers();
  const ip = (h.get("x-forwarded-for") || "").split(",")[0].trim() || null;
  const agent = h.get("user-agent") || null;
  await sql`INSERT INTO membership_acceptances (id,clerk_user_id,email,terms_version,ip_address,user_agent) VALUES (${crypto.randomUUID()},${userId},${email.toLowerCase()},${TERMS_VERSION},${ip},${agent})`;
  await sql`INSERT INTO memberships (clerk_user_id,email,status) VALUES (${userId},${email.toLowerCase()},'pending') ON CONFLICT (clerk_user_id) DO UPDATE SET email=EXCLUDED.email,updated_at=now()`;

  const stripe = new Stripe(key);
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    client_reference_id: userId,
    customer_email: email,
    metadata: { clerk_user_id: userId, terms_version: TERMS_VERSION },
    subscription_data: { metadata: { clerk_user_id: userId, terms_version: TERMS_VERSION } },
    success_url: `${base}/api/stripe/confirm?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/membership?payment=cancelled`,
  });
  redirect(session.url!);
}
