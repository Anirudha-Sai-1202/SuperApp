// src/api/index.ts
import { handleAppsRequest, handleAppStatusRequest } from './apps.ts';

export async function handleApiRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  if (url.pathname === '/api/apps') {
    return handleAppsRequest(req);
  }
  const match = url.pathname.match(/^\/api\/apps\/(.+)\/status$/);
  if (match) {
    const appId = match[1];
    return handleAppStatusRequest(req, appId);
  }
  return new Response('Not Found', { status: 404 });
}
