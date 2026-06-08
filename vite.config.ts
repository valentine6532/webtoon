import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Connect } from "vite";

const BASE = "/webtoon/";
const OUTPUT_DIR = path.resolve(__dirname, "output");

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".md": "text/markdown; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

/**
 * Dev-only: serve the large `output/` image tree (≈350MB) as static files
 * without letting Vite bundle or transform it. Handles both `/webtoon/output/*`
 * (base-prefixed, as the app requests) and bare `/output/*`.
 */
function serveOutput() {
  return {
    name: "serve-output",
    configureServer(server: { middlewares: Connect.Server }) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? decodeURIComponent(req.url.split("?")[0]) : "";
        const match = url.match(/^(?:\/webtoon)?\/output\/(.+)$/);
        if (!match) return next();

        const rel = path.normalize(match[1]).replace(/^(\.\.[/\\])+/, "");
        const filePath = path.join(OUTPUT_DIR, rel);
        if (!filePath.startsWith(OUTPUT_DIR)) {
          res.statusCode = 403;
          return res.end("Forbidden");
        }
        try {
          const data = await fs.readFile(filePath);
          res.setHeader("Content-Type", MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream");
          res.setHeader("Cache-Control", "no-cache");
          res.end(data);
        } catch {
          res.statusCode = 404;
          res.end("Not found");
        }
      });
    }
  };
}

export default defineConfig({
  base: BASE,
  plugins: [react(), serveOutput()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        entryFileNames: "assets/index.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) return "assets/index.css";
          return "assets/[name][extname]";
        }
      }
    }
  }
});
