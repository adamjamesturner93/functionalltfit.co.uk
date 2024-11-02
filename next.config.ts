import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_URL: "http://localhost:3000", // Change this to your production URL when deploying
  },
  images: {
    unoptimized: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "tmzhbryqsuuzspwa.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
