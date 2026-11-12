import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incremental cache yet: every admin page reads live from D1.
// Storefront caching gets added in the storefront step.
export default defineCloudflareConfig({});
