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
        main: resolve(import.meta.dirname, "index.html"),
        cv: resolve(import.meta.dirname, "cv.html"),
        agents: resolve(import.meta.dirname, "agents/index.html"),
        privacy: resolve(import.meta.dirname, "privacy.html"),
        notFound: resolve(import.meta.dirname, "404.html"),
      },
    },
  },
});
