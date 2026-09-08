import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/upload", "/api/"],
    },
    sitemap: "https://www.arinkarabulut.com/sitemap.xml",
    host: "https://www.arinkarabulut.com",
  };
}
