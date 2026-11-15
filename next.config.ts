import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev is bound to 0.0.0.0 while the browser uses 127.0.0.1. Without this,
  // Next blocks the dev Flight/HMR channel and the page never hydrates.
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
