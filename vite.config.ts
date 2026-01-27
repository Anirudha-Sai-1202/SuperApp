import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { handleAppsRequest, handleAppStatusRequest } from "./src/api/apps";
import type { IncomingMessage, ServerResponse } from "http";

console.log(">>> VITE CONFIG FILE LOADED");

export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 3102,
  },

  plugins: [
    // ✅ API middleware plugin (must come BEFORE react())
    {
      name: "api-middleware",
      configureServer(server: any) {
        console.log(">>> configureServer CALLED");

        server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: any) => {
          if (!req.url?.startsWith("/api")) {
            return next();
          }

          console.log(">>> API hit:", req.url);

          const url = new URL(req.url, `http://${req.headers.host}`);

          // /api/apps
          if (url.pathname === "/api/apps") {
            const result = await handleAppsRequest(
              new Request(url.toString(), {
                method: req.method,
                headers: req.headers as any,
                body: req.method !== "GET" ? (req as any) : undefined,
                duplex: "half",
              })
            );

            res.statusCode = result.status;
            result.headers.forEach((v, k) => res.setHeader(k, v));
            res.end(await result.text());
            return;
          }

          // /api/apps/:id/status
          if (
            url.pathname.startsWith("/api/apps/") &&
            url.pathname.endsWith("/status")
          ) {
            const appId = url.pathname.split("/")[3];

            const result = await handleAppStatusRequest(
              new Request(url.toString(), {
                method: req.method,
                headers: req.headers as any,
                body: req.method !== "GET" ? (req as any) : undefined,
                duplex: "half",
              }),
              appId
            );

            res.statusCode = result.status;
            result.headers.forEach((v, k) => res.setHeader(k, v));
            res.end(await result.text());
            return;
          }

          res.statusCode = 404;
          res.end("API route not found");
        });
      },
    },

    // ✅ Your normal plugins
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  // ✅ alias needed for "@/components/..."
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
