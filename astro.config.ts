import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";
import db from "@astrojs/db";
import vercel from "@astrojs/vercel/serverless";
import svelte from "@astrojs/svelte";
import sentry from "@sentry/astro";
import { readdirSync } from "fs";
import { join } from "path";

// generate sitemap URLs programmatically by reading the content directory
function generateSitemapUrls() {
  const baseUrl = SITE.website;
  const contentDir = join(process.cwd(), "src/content/food");
  const foodTypes = readdirSync(contentDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const urls: string[] = [];

  foodTypes.forEach(foodType => {
    const foodTypeDir = join(contentDir, foodType);
    const yearFiles = readdirSync(foodTypeDir)
      .filter(file => file.endsWith(".json"))
      .map(file => file.replace(".json", ""));

    yearFiles.forEach(year => {
      urls.push(`${baseUrl}${foodType}/${year}`);
    });
  });

  return urls;
}

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
      customPages: generateSitemapUrls(),
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
    resolve: {
      alias: {
        "@assets": "/src/assets",
        "@config": "/src/config",
        "@components": "/src/components",
        "@content": "/src/content",
        "@layouts": "/src/layouts",
        "@pages": "/src/pages",
        "@styles": "/src/styles",
        "@utils": "/src/utils",
      },
    },
  },
});
