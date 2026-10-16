import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/$", "/access"],
        disallow: ["/films/", "/api/"],
      },
    ],
    sitemap: "https://s42films.com/sitemap.xml",
  };
}
