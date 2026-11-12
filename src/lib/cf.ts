import { getCloudflareContext } from "@opennextjs/cloudflare";

/** Cloudflare bindings for the current request (D1, R2, vars, secrets). */
export function env(): CloudflareEnv {
  return getCloudflareContext().env;
}

export function db(): D1Database {
  return env().DB;
}

export function photos(): R2Bucket {
  return env().PHOTOS;
}
