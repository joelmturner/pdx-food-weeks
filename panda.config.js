import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: [
    "./src/components/**/*.{ts,tsx,js,jsx}",
    "./src/app/**/*.{ts,tsx,js,jsx}",
  ],

  // Files to exclude
  exclude: [],

  conditions: {
    light: "[data-theme=light] &",
    dark: "[data-theme=dark] &",
  },

  // Useful for theme customization
  theme: {
    extend: {
      semanticTokens: {
        colors: {
          primary: {
            value: {
              base: "{colors.orange.600}",
              _dark: "hsl(31.02 100% 71.176%)",
            },
          },
          secondary: {
            value: {
              base: "{colors.sky.600}",
              _dark: "hsl(229.57 70.868% 86%)",
            },
          },
          bg: {
            DEFAULT: {
              value: {
                base: "{colors.slate.000}",
                _dark: "{colors.slate.900}",
              },
            },
            muted: {
              value: {
                base: "{colors.slate.100}",
                _dark: "{colors.slate.700}",
              },
            },
          },
          text: {
            DEFAULT: {
              value: {
                base: "{colors.gray.700}",
                _dark: "{colors.gray.200}",
              },
            },
            muted: {
              value: {
                base: "{colors.gray.500}",
                _dark: "{colors.gray.400}",
              },
            },
          },
        },
        fonts: {
          body: { value: "system-ui, sans-serif" },
        },
      },
    },
  },

  jsxFramework: "react",
  strictTokens: true,

  // The output directory for your css system
  outdir: "./src/styled-system",
});
