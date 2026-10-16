import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.s42films.com/access",
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
