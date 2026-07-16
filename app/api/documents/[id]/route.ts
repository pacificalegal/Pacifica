import { auth, currentUser } from "@clerk/nextjs/server";
import { get } from "@vercel/blob";
import { adminEmails, ensureSchema, getSql } from "../../../../lib/db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const user = await currentUser();
  const email = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress || user?.emailAddresses[0]?.emailAddress || "";
  await ensureSchema();
  const sql = getSql();
  const { id } = await params;
  const rows = await sql`SELECT * FROM documents WHERE id=${id}`;
  const doc = rows[0];
  if (!doc) return new Response("Not found", { status: 404 });
  if (doc.clerk_user_id !== userId && !adminEmails().includes(email.toLowerCase())) return new Response("Forbidden", { status: 403 });
  const result = await get(doc.blob_url, { access: "private" });
  if (!result || result.statusCode !== 200) return new Response("Not found", { status: 404 });
  const filename = String(doc.filename).replace(/["\r\n]/g, "");
  return new Response(result.stream, { headers: { "Content-Type": doc.content_type || "application/octet-stream", "Content-Disposition": `attachment; filename="${filename}"`, "Cache-Control": "private, no-store" } });
}
