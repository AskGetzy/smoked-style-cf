import { env } from "./cf";

/** The Raspberry Pi proves who it is with a shared secret in the Authorization header. */
export function printAuthorized(req: Request): boolean {
  const secret = (env() as unknown as { PRINT_TOKEN?: string }).PRINT_TOKEN;
  if (!secret) return false;
  const given = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (given.length !== secret.length) return false;
  let diff = 0;
  for (let i = 0; i < secret.length; i++) diff |= secret.charCodeAt(i) ^ given.charCodeAt(i);
  return diff === 0;
}
