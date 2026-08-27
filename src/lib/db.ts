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

  const isRemote =
    url.includes('neon.tech') ||
    url.includes('sslmode=require') ||
    url.includes('supabase') ||
    url.includes('vercel')

  _pool = new Pool({
    connectionString: url,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: isRemote ? { rejectUnauthorized: false } : undefined,
  })

  // Create ALL tables on first connection — including better-auth's own tables
  _ready = (async () => {
    // ── better-auth tables ──────────────────────────────────
    await _pool!.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
        "image" TEXT,
        "createdAt" DATE NOT NULL DEFAULT NOW(),
        "updatedAt" DATE NOT NULL DEFAULT NOW()
      );
    `)
    await _pool!.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "expiresAt" TIMESTAMPTZ NOT NULL,
        "token" TEXT NOT NULL UNIQUE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "ipAddress" TEXT,
        "userAgent" TEXT,
        "userId" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE
      );
    `)
    await _pool!.query(`
      CREATE TABLE IF NOT EXISTS "account" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "issuer" TEXT NOT NULL DEFAULT '',
        "accountId" TEXT NOT NULL DEFAULT '',
        "providerId" TEXT NOT NULL DEFAULT '',
        "userId" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
        "accessToken" TEXT,
        "refreshToken" TEXT,
        "idToken" TEXT,
        "accessTokenExpiresAt" TIMESTAMPTZ,
        "refreshTokenExpiresAt" TIMESTAMPTZ,
        "scope" TEXT,
        "password" TEXT,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)
    await _pool!.query(`
      CREATE TABLE IF NOT EXISTS "verification" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "identifier" TEXT NOT NULL,
        "value" TEXT NOT NULL,
        "expiresAt" TIMESTAMPTZ NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    await _pool!.query(`
      ALTER TABLE "session"
        ALTER COLUMN "expiresAt" TYPE TIMESTAMPTZ
          USING "expiresAt"::timestamp AT TIME ZONE 'UTC',
        ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ
          USING "createdAt"::timestamp AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ
          USING "updatedAt"::timestamp AT TIME ZONE 'UTC';
    `)
    await _pool!.query(`
      ALTER TABLE "verification"
        ALTER COLUMN "expiresAt" TYPE TIMESTAMPTZ
          USING "expiresAt"::timestamp AT TIME ZONE 'UTC',
        ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ
          USING "createdAt"::timestamp AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ
          USING "updatedAt"::timestamp AT TIME ZONE 'UTC';
    `)
    await _pool!.query(`
      ALTER TABLE "account"
        ALTER COLUMN "accessTokenExpiresAt" TYPE TIMESTAMPTZ
          USING "accessTokenExpiresAt"::timestamp AT TIME ZONE 'UTC',
        ALTER COLUMN "refreshTokenExpiresAt" TYPE TIMESTAMPTZ
          USING "refreshTokenExpiresAt"::timestamp AT TIME ZONE 'UTC',
        ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ
          USING "createdAt"::timestamp AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ
          USING "updatedAt"::timestamp AT TIME ZONE 'UTC';
    `)
    await _pool!.query(`
      ALTER TABLE "user"
        ALTER COLUMN "emailVerified" DROP DEFAULT;
    `)
    await _pool!.query(`
      ALTER TABLE "user"
        ALTER COLUMN "emailVerified" TYPE BOOLEAN
          USING CASE
            WHEN LOWER("emailVerified"::text) IN ('1', 'true', 't') THEN TRUE
            ELSE FALSE
          END;
    `)
    await _pool!.query(`
      ALTER TABLE "user"
        ALTER COLUMN "emailVerified" SET DEFAULT FALSE,
        ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ
          USING "createdAt"::timestamp AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ
          USING "updatedAt"::timestamp AT TIME ZONE 'UTC';
    `)

    // Indexes for better-auth
    await _pool!.query(`CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session" ("userId");`)
    await _pool!.query(`CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account" ("userId");`)
    await _pool!.query(`CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification" ("identifier");`)
    await _pool!.query(`CREATE UNIQUE INDEX IF NOT EXISTS "account_issuer_accountId_uidx" ON "account" ("issuer", "accountId");`)

    // ── custom tables ───────────────────────────────────────
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

    console.log('[db] All tables created successfully')
  })().catch((err) => {
    console.error('[db] Failed to create tables:', err)
  })

  return _pool
}

/** Wait for tables to be ready before querying them */
export async function ready(): Promise<void> {
  if (_ready) await _ready
}
