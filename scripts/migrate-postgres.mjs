import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) throw new Error('Configure DATABASE_URL antes de migrar.');
const sql = neon(process.env.DATABASE_URL);
const source = readFileSync(new URL('../migrations/postgres/001_initial.sql', import.meta.url), 'utf8');
const statements = source.split(';').map(s => s.trim()).filter(Boolean);
await sql.transaction(statements.map(statement => sql.query(statement)));
console.log('Migração PostgreSQL concluída.');
