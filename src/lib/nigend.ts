import type { Pool } from 'mysql2/promise';
import { pool } from './db.js';

// Change the table name here if needed
const TABLE = 'nigends';

// Generate a unique 6-digit NIGEND in [223000, 227000]
export async function generateUniqueNigend(p: Pool = pool): Promise<string> {
  const min = 223000;
  const max = 227999;
  const triesMax = 50;

  for (let i = 0; i < triesMax; i++) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    const nigend = String(num);
    const [rows] = await p.query('SELECT 1 FROM ?? WHERE nigend = ? LIMIT 1', [TABLE, nigend]);
    if ((rows as any[]).length === 0) return nigend;
  }
  throw new Error('Unable to generate a unique NIGEND after many tries.');
}

// From a display name like "CEN | Yanis Bellei", extract "Yanis Bellei"
export function extractFullnameFromDisplayName(displayName: string): string {
  // Remove "SOMETHING | " prefix once if present
  const idx = displayName.indexOf('|');
  if (idx !== -1) {
    return displayName.slice(idx + 1).trim();
  }
  // If no grade separator found, return as-is
  return displayName.trim();
}

export async function insertNigendRecord(opts: {
  discordId: string;
  nigend: string;
  fullname: string; // cleaned
  assigned: string; // full display name with grade
  phone?: string | null; // null at creation
}) {
  const { discordId, nigend, fullname, assigned, phone = null } = opts;

  const sql =
    'INSERT INTO ?? (discord_id, nigend, fullname, phone, assigned) VALUES (?, ?, ?, ?, ?)';
  await pool.query(sql, ['nigends', discordId, nigend, fullname, phone, assigned]);
}