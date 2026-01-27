import { handleAppsRequest, handleAppStatusRequest } from "./api/apps";

export async function middleware(req: Request): Promise<Response | null> {
  const url = new URL(req.url);

  console.log("Middleware hit:", url.pathname);

  // GET & POST /api/apps
  if (url.pathname.startsWith("/api/apps") && !url.pathname.includes("/status")) {
    return await handleAppsRequest(req);
  }

  // POST /api/apps/:id/status
  if (
    url.pathname.startsWith("/api/apps/") &&
    url.pathname.endsWith("/status")
  ) {
    const parts = url.pathname.split("/");
    const appId = parts[3];
    return await handleAppStatusRequest(req, appId);
  }

  return null; // let Vite serve frontend
}
