import { photos } from "@/lib/cf";

// Serves product photos from R2. Keys are unique per upload, so they cache forever.
export async function GET(_req: Request, ctx: { params: Promise<{ key: string[] }> }) {
  const { key } = await ctx.params;
  const path = key.join("/");
  if (!path.startsWith("products/")) return new Response("Not found", { status: 404 });

  const obj = await photos().get(path);
  if (!obj) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(obj.body, { headers });
}
