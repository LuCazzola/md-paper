import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

const isPaperMode = !!process.env.PAPER_MODE;
const engineDir = path.resolve(__dirname);
const projectRoot = isPaperMode ? path.resolve(engineDir, "..") : engineDir;

export default defineConfig(({ mode }) => ({
  root: engineDir,
  base: mode === "development" ? "/" : (process.env.VITE_BASE ?? "/"),
  publicDir: path.join(projectRoot, "public"),
  build: {
    outDir: path.join(projectRoot, "docs"),
    emptyOutDir: true,
  },
  server: {
    fs: { allow: [projectRoot, engineDir] },
  },
  plugins: [
    react(),
    {
      // Redirect absolute /publication.ts and /content.md to the paper repo root
      name: "paper-root-resolver",
      resolveId(id) {
        if (id === "/publication.ts")    return path.join(projectRoot, "publication.ts");
        if (id === "/content.md")        return { id: path.join(projectRoot, "content.md") };
        if (id === "/content.md?raw")    return { id: path.join(projectRoot, "content.md?raw") };
      },
      load(id) {
        if (id.endsWith("content.md?raw") || (id.includes("content.md") && id.includes("raw"))) {
          const filePath = path.join(projectRoot, "content.md");
          if (fs.existsSync(filePath)) {
            return `export default ${JSON.stringify(fs.readFileSync(filePath, "utf-8"))}`;
          }
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.join(engineDir, "src"),
    },
  },
  css: {
    postcss: path.join(engineDir, "postcss.config.js"),
  },
}));
