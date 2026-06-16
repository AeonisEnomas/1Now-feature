import 'dotenv/config'

export const config = {
  port: process.env.PORT || 4000,
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  databaseUrl: process.env.DATABASE_URL,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  ollama: {
    apiKey: process.env.OLLAMA_API_KEY,
    model: process.env.OLLAMA_MODEL || 'gpt-oss:120b',
    baseUrl: (process.env.OLLAMA_BASE_URL || 'https://ollama.com').replace(/\/$/, ''),
  },
}
