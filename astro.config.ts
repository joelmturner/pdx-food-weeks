import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";
import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  image: {
    domains: ["res.cloudinary.com"],
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    db(),
  ],
  scopedStyleStrategy: "where",
});
