import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  experimental: {
    serverActions: { bodySizeLimit: "8mb" }, // product photo uploads
  },
};

export default nextConfig;

// Gives `next dev` access to the D1 and R2 bindings from wrangler.jsonc
initOpenNextCloudflareForDev();
