import { neon } from "@neondatabase/serverless";

export const TERMS_VERSION = "2026-07-16";

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  return neon(url);
}

export async function ensureSchema() {
  const sql = getSql();
  await sql`CREATE TABLE IF NOT EXISTS cases (id uuid PRIMARY KEY, clerk_user_id text NOT NULL, client_name text NOT NULL, client_email text NOT NULL, matter_type text NOT NULL, title text NOT NULL, description text NOT NULL, incident_date date, deadline date, status text NOT NULL DEFAULT 'submitted', created_at timestamptz NOT NULL DEFAULT now())`;
  await sql`CREATE TABLE IF NOT EXISTS documents (id uuid PRIMARY KEY, case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE, clerk_user_id text NOT NULL, filename text NOT NULL, blob_url text NOT NULL, content_type text, size_bytes bigint NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`;
  await sql`CREATE TABLE IF NOT EXISTS membership_acceptances (id uuid PRIMARY KEY, clerk_user_id text NOT NULL, email text NOT NULL, terms_version text NOT NULL, accepted_at timestamptz NOT NULL DEFAULT now(), ip_address text, user_agent text)`;
  await sql`CREATE TABLE IF NOT EXISTS memberships (clerk_user_id text PRIMARY KEY, email text NOT NULL, stripe_customer_id text, stripe_subscription_id text, status text NOT NULL DEFAULT 'pending', current_period_end timestamptz, updated_at timestamptz NOT NULL DEFAULT now())`;
  await sql`CREATE INDEX IF NOT EXISTS acceptances_user_idx ON membership_acceptances (clerk_user_id, accepted_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS memberships_customer_idx ON memberships (stripe_customer_id)`;
}

export async function getMembership(userId: string) {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT * FROM memberships WHERE clerk_user_id=${userId} LIMIT 1`;
  return rows[0] || null;
}

export function isMembershipActive(status?: string | null) {
  return status === "active" || status === "trialing";
}

export function adminEmails() {
  return (process.env.ADMIN_EMAILS || "").split(",").map(x => x.trim().toLowerCase()).filter(Boolean);
}

