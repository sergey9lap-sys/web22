import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        thanks: resolve(import.meta.dirname, "thanks/index.html"),
        spasibo: resolve(import.meta.dirname, "spasibo/index.html"),
      },
    },
  },
});
