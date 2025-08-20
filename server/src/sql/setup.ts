import { pool } from '../db.js';
import fs from 'fs';
import path from 'path';
async function main() {
  const schema = fs.readFileSync(path.join(process.cwd(), 'src/sql/schema.sql'),'utf8');
  const seed = fs.readFileSync(path.join(process.cwd(), 'src/sql/seed.sql'),'utf8');
  const statements = schema.split(';').map(s=>s.trim()).filter(Boolean);
  for (const s of statements) {
    await pool.query(s);
    console.log('Executed:', s.slice(0,80),'...');
  }
  const seedStatements = seed.split(';').map(s=>s.trim()).filter(Boolean);
  for (const s of seedStatements) {
    await pool.query(s);
    console.log('Seeded:', s.slice(0,80),'...');
  }
  console.log('DB setup complete.');
  process.exit(0);
}
main().catch(e=>{ console.error(e); process.exit(1); });
