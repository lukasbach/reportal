/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin()],
  resolve: {
    alias: {
      "node-fetch": "isomorphic-fetch",
    },
  },
  define: {
    global: {},
  },
});
