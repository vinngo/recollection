import type { NextConfig } from "next";

if (!process.env.NEXT_PUBLIC_CDN_URL) {
  throw new Error("NEXT_PUBLIC_CDN_URL is not defined");
}

// Extract hostname from URL (remove protocol)
const cdnUrl = new URL(process.env.NEXT_PUBLIC_CDN_URL);

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: cdnUrl.protocol.replace(":", "") as "http" | "https",
        hostname: cdnUrl.hostname,
        port: cdnUrl.port,
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
