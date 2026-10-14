import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL ?? "",
  },
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingIncludes: {
    "/meadow": ["./docs/office-design/meadow.html"],
  },
};

export default nextConfig;
