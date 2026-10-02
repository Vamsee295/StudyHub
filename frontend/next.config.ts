import type { NextConfig } from "next";
import nextMDX from "@next/mdx";

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ES only
    // https://github.com/remarkjs/remark-gfm#install
    providerImportSource: "@mdx-js/react",
  },
});

const nextConfig: NextConfig = {
  // Silence Turbopack warning — we configure WASM separately below
  turbopack: {},

  webpack: (config) => {
    // Allow sql.js to load its dynamic requires without warnings
    config.module = config.module || {};
    config.module.unknownContextCritical = false;
    return config;
  },
  // Add support for MDX files
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

export default withMDX(nextConfig);
