import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Lazy initialization — avoids crashing at import time when DATABASE_URL
// is not set (e.g. Arena preview without a database attached).
const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

function getPool(): Pool {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set. Please add it to your environment variables."
    );
  }
  if (!globalForDb.__arenaNextJsPostgresqlPool) {
    globalForDb.__arenaNextJsPostgresqlPool = new Pool({
      connectionString: databaseUrl,
    });
  }
  return globalForDb.__arenaNextJsPostgresqlPool;
}

// Export a proxy so callers still write `db.select()...` etc.
// The pool is only created on first actual database call.
export const pool = new Proxy({} as Pool, {
  get(_target, prop) {
    return (getPool() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return (drizzle(getPool()) as unknown as Record<string | symbol, unknown>)[prop];
  },
});
