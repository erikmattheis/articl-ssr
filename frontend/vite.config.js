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
        additionalData: `
          @import "${path.resolve(__dirname, "src/assets/global.scss")}";
          @import "${path.resolve(__dirname, "../node_modules/@picocss/pico/scss/pico.scss")}";
        `,
      },
    },
  },
});
