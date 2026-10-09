import 'server-only';
import { Pool, type PoolClient, type QueryResultRow } from 'pg';
import { workspacePgSsl } from './pg-ssl.mjs';

let pool: Pool | undefined;
export function databaseConfigured() { return Boolean(process.env.DATABASE_URL); }
export function db(): Pool {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL belum dikonfigurasi. Workspace tidak tersedia.');
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 4, idleTimeoutMillis: 30000, connectionTimeoutMillis: 8000, ssl: workspacePgSsl() });
  return pool;
}
export async function rows<T extends QueryResultRow>(sql: string, params: unknown[] = []): Promise<T[]> { return (await db().query<T>(sql, params)).rows; }
export async function one<T extends QueryResultRow>(sql: string, params: unknown[] = []): Promise<T | undefined> { return (await rows<T>(sql, params))[0]; }
export async function transaction<T>(run: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await db().connect();
  try { await client.query('begin'); const result = await run(client); await client.query('commit'); return result; }
  catch (error) { await client.query('rollback'); throw error; }
  finally { client.release(); }
}
