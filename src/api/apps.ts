// src/api/apps.ts
import { getApps, setAppStatus, addApp, updateApp } from '../lib/db';

export async function handleAppsRequest(req: Request): Promise<Response> {
  if (req.method === 'GET') {
    const apps = await getApps();
    return new Response(JSON.stringify(apps), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (req.method === 'POST') {
    const body = await req.json();
    await addApp(body);
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (req.method === 'PUT') {
    const body = await req.json();
    await updateApp(body);
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response('Method Not Allowed', { status: 405 });
}

export async function handleAppStatusRequest(req: Request, appId: string): Promise<Response> {
  if (req.method === 'POST') {
    const { isenabled } = await req.json();
    await setAppStatus(appId, isenabled);
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response('Method Not Allowed', { status: 405 });
}
