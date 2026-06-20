import type { NextConfig } from "next";
import { dirname } from "path";
import { fileURLToPath } from "url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/reviews/:slug",
        destination: "/products/:slug",
        permanent: true
      }
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ws-in.amazon-adsystem.com" },
      { protocol: "https", hostname: "ws-na.amazon-adsystem.com" },
      { protocol: "https", hostname: "ws-eu.amazon-adsystem.com" },
      { protocol: "https", hostname: "ws-fe.amazon-adsystem.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  },
  turbopack: {
    root: projectRoot
  }
};

export default nextConfig;
