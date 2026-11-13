import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incremental cache yet: every admin page reads live from D1.
// Storefront caching gets added in the storefront step.
export default {
  ...defineCloudflareConfig({}),
  // OpenNext runs this to build Next itself, so "npm run build" can be the OpenNext build
  // (Cloudflare's dashboard runs "npm run build" by default).
  buildCommand: "next build",
};
