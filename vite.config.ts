/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import react from "@vitejs/plugin-react";
import faviconInject from "vite-plugin-favicons-inject";

export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin(), faviconInject("./src/assets/icon.svg")],
  resolve: {
    alias: {
      "node-fetch": "isomorphic-fetch",
    },
  },
  define: {
    // global: "({})",
  },
});
