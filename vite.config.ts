import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  base: mode === "development" ? "/" : (process.env.VITE_BASE ?? "/"),
  build: { outDir: "docs", emptyOutDir: true },
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
}));
