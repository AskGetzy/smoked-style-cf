import { db } from "@/lib/cf";
import { printAuthorized } from "@/lib/printauth";

// The Pi reports back: { "status": "printed" } or { "status": "failed" }.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!printAuthorized(req)) return new Response("Unauthorized", { status: 401 });
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { status?: string };
  const status = body.status === "printed" ? "printed" : body.status === "failed" ? "failed" : null;
  if (!status || !/^\d+$/.test(id)) return new Response("Bad request", { status: 400 });
  await db()
    .prepare(
      "UPDATE print_jobs SET status = ?, printed_at = CASE WHEN ? = 'printed' THEN strftime('%Y-%m-%dT%H:%M:%fZ','now') ELSE printed_at END WHERE id = ?",
    )
    .bind(status, status, Number(id))
    .run();
  return Response.json({ ok: true });
}
