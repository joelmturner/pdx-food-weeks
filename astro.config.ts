import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";
import db from "@astrojs/db";
import vercel from "@astrojs/vercel/serverless";

import svelte from "@astrojs/svelte";

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
    sitemap({
      filter: page => {
        return (
          !page.includes("/api") &&
          !page.includes("/admin") &&
          !page.includes("/me") &&
          !page.includes("/login") &&
          !page.includes("/signup")
        );
      },
    }),
    db(),
    svelte(),
  ],
  scopedStyleStrategy: "where",
  output: "server",
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  vite: {
    optimizeDeps: {
      exclude: ["oslo"],
    },
  },
});
