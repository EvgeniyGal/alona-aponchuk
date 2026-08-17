import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  serverExternalPackages: [
    "mailgun.js",
    "form-data",
    "bcryptjs",
    "mammoth",
    "unpdf",
    "word-extractor",
  ],
};

export default withNextIntl(nextConfig);
