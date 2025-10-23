import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";
import sentry from "@sentry/astro";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
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
    sentry({
      sourceMapsUploadOptions: {
        project: "pdx-food-weeks",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
  ],
  scopedStyleStrategy: "where",
  output: "server",
  adapter: vercel(),
  vite: {
    optimizeDeps: {
      exclude: ["oslo"],
    },
  },
});
