import { neon } from "@neondatabase/serverless";

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  return neon(url);
}

export async function ensureSchema() {
  const sql = getSql();
  await sql`CREATE TABLE IF NOT EXISTS cases (id uuid PRIMARY KEY, clerk_user_id text NOT NULL, client_name text NOT NULL, client_email text NOT NULL, matter_type text NOT NULL, title text NOT NULL, description text NOT NULL, incident_date date, deadline date, status text NOT NULL DEFAULT 'submitted', created_at timestamptz NOT NULL DEFAULT now())`;
  await sql`CREATE TABLE IF NOT EXISTS documents (id uuid PRIMARY KEY, case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE, clerk_user_id text NOT NULL, filename text NOT NULL, blob_url text NOT NULL, content_type text, size_bytes bigint NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`;
}

export function adminEmails() {
  return (process.env.ADMIN_EMAILS || "").split(",").map(x => x.trim().toLowerCase()).filter(Boolean);
}
