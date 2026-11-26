import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence Turbopack warning — we configure WASM separately below
  turbopack: {},

  // Study With Me became the Community board; old links (and notifications already sent) keep working.
  // Query strings such as ?post=… are passed through.
  async redirects() {
    return [{ source: "/study-with-me", destination: "/community", permanent: true }];
  },

  webpack: (config) => {
    // Allow sql.js to load its dynamic requires without warnings
    config.module = config.module || {};
    config.module.unknownContextCritical = false;
    return config;
  },
};

export default nextConfig;
