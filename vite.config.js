/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    css: true,
    setupFiles: ["./setupTests.js"],
  },
  build: {
    rollupOptions: {
      // Batasi jumlah file chunk
      output: {
        manualChunks: undefined,
      },
    },
  },
});
