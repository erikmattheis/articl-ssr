import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"), // Define '~' to map to 'src' folder
    },
  },
  css: {
    preprocessorOptions: {
      scss: {},
      devtools: { enabled: true },
    },
    css: {
      preprocessorOptions: {},
    },
    build: {
      rollupOptions: {
        input: "src/main.js", // Define the entry point for the build
      },
    },
  },
});
