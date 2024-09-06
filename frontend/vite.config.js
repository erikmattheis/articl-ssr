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
      scss: {
        additionalData: [`@import "~/assets/variables.scss";`], // Add any global SCSS here
      },
    },
    devtools: { enabled: true },
  },
  build: {
    rollupOptions: {
      input: [
        '@picocss/pico/scss/pico.scss',
        '~/assets/global.scss'
      ]
    }
  },
});
