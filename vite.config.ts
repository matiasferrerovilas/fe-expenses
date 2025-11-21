import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
  ],
  define: {
    global: "window",
  },
  build: {
    chunkSizeWarningLimit: 1500, // opcional, solo para limpiar warnings

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "react-vendor";
            if (id.includes("@tanstack")) return "tanstack";
            if (id.includes("dayjs")) return "dayjs";
            if (id.includes("antd")) return "antd"; // si usás Ant Design
            return "vendor";
          }

          // Dividí módulos propios muy pesados (por tus reportes)
          if (id.includes("movement")) return "movement";
          if (id.includes("balance")) return "balance";

          return undefined;
        },
      },
    },
  },
});
