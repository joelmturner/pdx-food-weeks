import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";
import db from "@astrojs/db";
import vercel from "@astrojs/vercel/serverless";
import svelte from "@astrojs/svelte";
import sentry from "@sentry/astro";

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
      customPages: [
        "https://pdxfoodweeks.com/burger/2019",
        "https://pdxfoodweeks.com/burger/2023",
        "https://pdxfoodweeks.com/burger/2024",
        "https://pdxfoodweeks.com/burger/2025",
        "https://pdxfoodweeks.com/nacho/2019",
        "https://pdxfoodweeks.com/nacho/2023",
        "https://pdxfoodweeks.com/nacho/2025",
        "https://pdxfoodweeks.com/pizza/2024",
        "https://pdxfoodweeks.com/pizza/2025",
        "https://pdxfoodweeks.com/sandwich/2022",
        "https://pdxfoodweeks.com/sandwich/2024",
        "https://pdxfoodweeks.com/sandwich/2025",
        "https://pdxfoodweeks.com/taco/2025",
        "https://pdxfoodweeks.com/wing/2024",
      ],
    }),
    db(),
    svelte(),
    sentry({
      sourceMapsUploadOptions: {
        project: "pdx-food-weeks",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
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
