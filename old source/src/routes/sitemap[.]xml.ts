import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "";

const routes = [
  { path: "/", priority: "1.0", changefreq: "weekly" as const },
  { path: "/mission", priority: "0.8", changefreq: "monthly" as const },
  { path: "/method", priority: "0.8", changefreq: "monthly" as const },
  { path: "/services", priority: "0.9", changefreq: "monthly" as const },
  { path: "/case-stories", priority: "0.8", changefreq: "monthly" as const },
  { path: "/responsible-ai", priority: "0.8", changefreq: "monthly" as const },
  { path: "/research", priority: "0.7", changefreq: "monthly" as const },
  { path: "/about", priority: "0.7", changefreq: "monthly" as const },
  { path: "/contact", priority: "0.9", changefreq: "monthly" as const },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = routes
          .map(
            (r) =>
              `  <url>\n    <loc>${BASE_URL}${r.path}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
