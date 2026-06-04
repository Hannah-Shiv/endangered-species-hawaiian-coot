import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const isVercel     = !!process.env.VERCEL;
const isGitHubPages = !!process.env.GITHUB_PAGES;
const isReplit     = !!process.env.REPL_ID;

// PORT — required on Replit dev/preview, not needed for static builds
const port = (() => {
  if (isVercel || isGitHubPages) return 3000;
  const rawPort = process.env.PORT;
  if (!rawPort) throw new Error("PORT environment variable is required but was not provided.");
  const p = Number(rawPort);
  if (Number.isNaN(p) || p <= 0) throw new Error(`Invalid PORT value: "${rawPort}"`);
  return p;
})();

// BASE_PATH — hardcoded for GH Pages, "/" for Vercel, injected by Replit workflow otherwise
const basePath = (() => {
  if (isGitHubPages) return "/endangered-species-hawaiian-coot/";
  if (isVercel) return "/";
  const bp = process.env.BASE_PATH;
  if (!bp) throw new Error("BASE_PATH environment variable is required but was not provided.");
  return bp;
})();

export default defineConfig({
  base: basePath,
  assetsInclude: ["**/*.m4a", "**/*.mp3"],
  plugins: [
    react(),
    tailwindcss(),
    ...(isReplit && !isVercel && !isGitHubPages
      ? [
          (await import("@replit/vite-plugin-runtime-error-modal")).default(),
          ...(process.env.NODE_ENV !== "production"
            ? [
                await import("@replit/vite-plugin-cartographer").then((m) =>
                  m.cartographer({ root: path.resolve(import.meta.dirname, "..") }),
                ),
                await import("@replit/vite-plugin-dev-banner").then((m) => m.devBanner()),
              ]
            : []),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: { strict: true },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
