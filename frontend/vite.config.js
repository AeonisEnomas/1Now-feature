import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// The frontend talks to the backend via VITE_API_URL (CORS-enabled),
// and to Supabase directly for auth. No AI proxy here — the backend
// owns the Ollama key.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
})
