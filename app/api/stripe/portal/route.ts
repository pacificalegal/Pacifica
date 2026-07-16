import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { getMembership } from "../../../../lib/db";
import { redirect } from "next/navigation";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const key = process.env.STRIPE_SECRET_KEY, base = process.env.NEXT_PUBLIC_APP_URL;
  if (!key || !base) return new Response("Stripe is not configured", { status: 503 });
  const membership = await getMembership(userId);
  if (!membership?.stripe_customer_id) redirect("/membership");
  const stripe = new Stripe(key);
  const session = await stripe.billingPortal.sessions.create({ customer: membership.stripe_customer_id, return_url: `${base}/portal` });
  redirect(session.url);
}

