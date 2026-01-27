import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
  return open({
    filename: './db/superapp.db',
    driver: sqlite3.Database
  });
}


export async function getApps() {
  const db = await openDb();
  return db.all('SELECT * FROM apps');
}


export async function setAppStatus(id: string, isenabled: boolean) {
  const db = await openDb();
  await db.run('UPDATE apps SET isenabled = ? WHERE id = ?', isenabled ? 1 : 0, id);
}


export async function addApp(app: {
  id: string;
  name: string;
  description?: string;
  url: string;
  icon?: string;
  category?: string;
  color?: string;
  gradient?: string;
  newTab?: boolean;
  isenabled?: boolean;
}) {
  const db = await openDb();
  await db.run(
    `INSERT INTO apps (id, name, description, url, icon, category, color, gradient, newTab, isenabled)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    app.id,
    app.name,
    app.description || '',
    app.url,
    app.icon || '',
    app.category || '',
    app.color || '',
    app.gradient || '',
    app.newTab ? 1 : 0,
    app.isenabled !== undefined ? (app.isenabled ? 1 : 0) : 1
  );
}

export async function isAdmin(email: string) {
  return email === import.meta.env.VITE_ADMIN_EMAIL;
}

export async function updateApp(app: {
  id: string;
  name: string;
  description?: string;
  url: string;
  icon?: string;
  category?: string;
  color?: string;
  gradient?: string;
  newTab?: boolean;
  isenabled?: boolean;
}) {
  const db = await openDb();
  await db.run(
    `UPDATE apps 
     SET name = ?, description = ?, url = ?, icon = ?, category = ?, color = ?, gradient = ?, newTab = ?, isenabled = ?
     WHERE id = ?`,
    app.name,
    app.description || '',
    app.url,
    app.icon || '',
    app.category || '',
    app.color || '',
    app.gradient || '',
    app.newTab ? 1 : 0,
    app.isenabled !== undefined ? (app.isenabled ? 1 : 0) : 1,
    app.id
  );
}
