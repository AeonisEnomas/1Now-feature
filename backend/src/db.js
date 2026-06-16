import pg from 'pg'
import { config } from './config.js'

/* PostgreSQL pool — connects to the Supabase Postgres database.
   The backend connects with elevated privileges, so it enforces
   per-user access itself (every query is scoped by the authenticated
   user id from the verified Supabase token). */
const { Pool } = pg

export const pool = new Pool({
  connectionString: config.databaseUrl,
  // Supabase requires SSL.
  ssl: config.databaseUrl?.includes('localhost') ? false : { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30_000,
})

export const query = (text, params) => pool.query(text, params)

/* Ensure the table exists on boot (idempotent) so the API works
   even before db/schema.sql has been run manually. */
export async function ensureSchema() {
  if (!config.databaseUrl) {
    console.warn('[db] DATABASE_URL not set — database features disabled')
    return false
  }
  await query(`
    create table if not exists public.studio_profiles (
      id            uuid primary key,
      business_card jsonb,
      car_post      jsonb,
      updated_at    timestamptz default now()
    )
  `)
  console.log('[db] connected · studio_profiles ready')
  return true
}
