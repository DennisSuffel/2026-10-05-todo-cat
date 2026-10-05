import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The e2e dev server sets NEXT_DIST_DIR so it can run next to `npm run dev`.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
};

export default nextConfig;
