"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ensureSchema, getSql } from "../../lib/db";

const value = (form: FormData, key: string) => String(form.get(key) || "").trim();

export async function submitAttorneyApplication(form: FormData) {
  if (value(form, "website")) redirect("/attorney-network/apply?submitted=1");
  const fullName = value(form, "fullName").slice(0, 120);
  const firmName = value(form, "firmName").slice(0, 160);
  const email = value(form, "email").toLowerCase().slice(0, 200);
  const phone = value(form, "phone").slice(0, 40);
  const state = value(form, "state").slice(0, 80);
  const barNumber = value(form, "barNumber").slice(0, 80);
  const practiceAreas = value(form, "practiceAreas").slice(0, 500);
  const message = value(form, "message").slice(0, 3000);
  if (!fullName || !email || !phone) throw new Error("Name, email, and phone are required.");
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Enter a valid email address.");
  await ensureSchema();
  const h = await headers();
  const ip = (h.get("x-forwarded-for") || "").split(",")[0].trim() || null;
  const userAgent = h.get("user-agent") || null;
  const sql = getSql();
  await sql`INSERT INTO attorney_applications (id,full_name,firm_name,email,phone,state,bar_number,practice_areas,message,ip_address,user_agent) VALUES (${crypto.randomUUID()},${fullName},${firmName || null},${email},${phone},${state || null},${barNumber || null},${practiceAreas || null},${message || null},${ip},${userAgent})`;
  redirect("/attorney-network/apply?submitted=1");
}

