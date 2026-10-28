export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/sepet", "/odeme", "/siparis-alindi", "/yonetim"] },
    sitemap: `${site.url.replace(/\/$/, "")}/sitemap.xml`,
  };
}
