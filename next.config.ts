import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  serverExternalPackages: ["mailgun.js", "form-data", "bcryptjs"],
};

export default nextConfig;
