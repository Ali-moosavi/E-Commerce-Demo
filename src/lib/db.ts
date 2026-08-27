import { Pool } from 'pg'

let _pool: Pool | null = null
let _ready: Promise<void> | null = null

export function getDb(): Pool {
  if (_pool) return _pool

  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      'DATABASE_URL is required. Set it to your PostgreSQL connection string (Neon, Supabase, Vercel Postgres, etc.).',
    )
  }

  _pool = new Pool({
    connectionString: url,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  })

  // Create custom tables on first connection (better-auth creates its own tables)
  _ready = (async () => {
    await _pool!.query(`
      CREATE TABLE IF NOT EXISTS "app_users" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "identifier" TEXT NOT NULL UNIQUE,
        "passwordHash" TEXT NOT NULL DEFAULT '',
        "termsAccepted" INTEGER NOT NULL DEFAULT 0,
        "fullname" TEXT,
        "identifierComponent" TEXT,
        "dob" TEXT,
        "createdAt" TEXT NOT NULL,
        "updatedAt" TEXT NOT NULL
      );
    `)
    await _pool!.query(`
      CREATE TABLE IF NOT EXISTS "carts" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL UNIQUE,
        "addedProducts" TEXT NOT NULL DEFAULT '[]',
        "createdAt" TEXT NOT NULL,
        "updatedAt" TEXT NOT NULL
      );
    `)
  })().catch((err) => {
    console.error('Failed to create custom tables:', err)
  })

  return _pool
}

/** Wait for custom tables to be ready before querying them */
export async function ready(): Promise<void> {
  if (_ready) await _ready
}
