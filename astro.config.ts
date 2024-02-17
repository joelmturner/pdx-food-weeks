import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  image: {
    domains: ["res.cloudinary.com", "d2sa0osf92td39.cloudfront.net", "*.cloudfront.net"],
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
  ],
  scopedStyleStrategy: "where",
});
