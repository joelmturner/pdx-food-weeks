import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: "https://1d37ca05435dff58a0a7d5e790174b9f@o556640.ingest.us.sentry.io/4509817296781312",
  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/astro/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});