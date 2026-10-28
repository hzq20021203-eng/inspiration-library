import { Pool, QueryResult, QueryResultRow } from 'pg';

let pool: Pool | null = null;

export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  return Boolean(url && url.trim().length > 0 && !url.includes('your_connection_string_here'));
}

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL?.trim();
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL is not set. Please add your Supabase PostgreSQL connection string to .env.local"
      );
    }

    const isCloudOrSupabase =
      connectionString.includes('supabase.co') ||
      connectionString.includes('pooler.supabase.com') ||
      connectionString.includes('sslmode=require');

    pool = new Pool({
      connectionString,
      ssl: isCloudOrSupabase ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }
  return pool;
}

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const p = getPool();
  return p.query<T>(text, params);
}
