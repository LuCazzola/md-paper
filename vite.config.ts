import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

const isPaperMode = !!process.env.PAPER_MODE;
const engineDir = path.resolve(__dirname);
const projectRoot = isPaperMode ? path.resolve(engineDir, "..") : engineDir;

// Read basePath from publication.ts so users never need to set VITE_BASE manually.
// Falls back to VITE_BASE env var, then "/".
function readBasePath(): string {
  const pubFile = path.join(projectRoot, "publication.ts");
  if (fs.existsSync(pubFile)) {
    const src = fs.readFileSync(pubFile, "utf-8");
    const m = src.match(/basePath\s*:\s*["'`]([^"'`]+)["'`]/);
    if (m) return m[1];
  }
  return process.env.VITE_BASE ?? "/";
}

export default defineConfig(({ mode }) => ({
  root: engineDir,
  base: mode === "development" ? "/" : readBasePath(),
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
      name: "paper-root-resolver",
      resolveId(id) {
        if (id === "/publication.ts") return path.join(projectRoot, "publication.ts");
        if (id === "/content.md")     return { id: path.join(projectRoot, "content.md") };
        if (id === "/content.md?raw") return { id: path.join(projectRoot, "content.md?raw") };
      },
      load(id) {
        if (id.includes("content.md") && id.includes("raw")) {
          const filePath = path.join(projectRoot, "content.md");
          if (fs.existsSync(filePath))
            return `export default ${JSON.stringify(fs.readFileSync(filePath, "utf-8"))}`;
        }
      },
    },
  ],
  resolve: {
    alias: { "@": path.join(engineDir, "src") },
  },
  css: {
    postcss: path.join(engineDir, "postcss.config.js"),
  },
}));
