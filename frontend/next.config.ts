import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence Turbopack warning — we configure WASM separately below
  turbopack: {},

  webpack: (config) => {
    // Allow sql.js to load its dynamic requires without warnings
    config.module = config.module || {};
    config.module.unknownContextCritical = false;
    return config;
  },
};

export default nextConfig;
