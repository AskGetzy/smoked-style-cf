import { db } from "@/lib/cf";
import { printAuthorized } from "@/lib/printauth";

// The Pi calls this every few seconds. Returns the oldest waiting job, or 204 if there is none.
export async function GET(req: Request) {
  if (!printAuthorized(req)) return new Response("Unauthorized", { status: 401 });
  const job = await db()
    .prepare("SELECT id, kind, zpl, payload FROM print_jobs WHERE status = 'waiting' ORDER BY id LIMIT 1")
    .first<{ id: number; kind: string; zpl: string; payload: string | null }>();
  if (!job) return new Response(null, { status: 204 });
  return Response.json(job, { headers: { "cache-control": "no-store" } });
}
