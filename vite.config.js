import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  // Site is served at https://siggigr.github.io/
  // (repo renamed to siggigr.github.io, so it serves at the domain root)
  base: "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        cv: resolve(__dirname, "cv.html"),
      },
    },
  },
});
