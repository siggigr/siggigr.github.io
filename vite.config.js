import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Site is served at https://siggigr.github.io/siggi-site/
  // If you ever move it to a custom domain or a user site, change to "/".
  base: "/siggi-site/",
});
