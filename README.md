# 1Now Social Studio

AI-powered **Business Card** & **Car Post** generator for car-rental businesses. Fill your details once, then generate polished, share-ready social graphics in seconds — and post them straight to WhatsApp, Facebook, X and LinkedIn.

> Monorepo: **`frontend/`** (React + Vite) · **`backend/`** (Express REST API) · **`db/`** (Supabase SQL). Supabase hosts both **auth** and the **PostgreSQL** database; the backend talks to Postgres and proxies the AI so no keys ever touch the browser.

---

## ✨ Features

**1. Business Card generator** — a "Company Info" page (company name, domain, country, phone, address, email, tagline + logo upload). One click generates a share-ready card.

**2. Car Post generator** — a "Car Details" page (year, make, model, price, specs, photo). One click generates a premium **landscape** rental ad.

Both share the same flow:
- **Persistent fields** — saved automatically; still filled after logout.
- **AI generation** — describe the look (or let AI draft the description), and the AI either **designs a unique layout + palette** (no template selected) or **restyles a chosen template** (locked layout, AI changes only colors + copy). Powered by **Ollama Cloud**.
- **4 hand-built templates each**, every one a distinct layout (cards: Header, Sidebar, Editorial, Onyx · posts: Spotlight, Split, Banner, Showcase).
- **Smart logo handling** — uploaded logos are auto-trimmed, squared and centered so any logo fits.
- **Live preview** that updates as you type.
- **Share** — image **+ link together** via the native share sheet (mobile / Chrome / Edge), or auto-copy-to-clipboard + open the composer on other desktops. Plus copy & download as PNG. The exported image is the full, clean rectangle (no rounded-corner artifacts).

Runs in **Demo Mode** (localStorage + offline templates) out of the box — no backend or keys required to try it.

---

## 🧱 Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, React Router, `html-to-image` |
| Backend | Node + Express, `pg` (PostgreSQL), CORS |
| Database | Supabase Postgres (table `studio_profiles`, RLS) |
| Auth | Supabase Auth (email) — validated server-side |
| AI | Ollama Cloud (chat → structured design spec) |
| Hosting | Vercel (frontend) · Render (backend) · Supabase (DB + auth) |

### Architecture
```
Browser (React)
  │  Supabase JS ───────────────►  Supabase Auth      (login / session / JWT)
  │  fetch + Bearer <token> ─────►  Backend (Express)
                                     │  validate token ► Supabase Auth
                                     │  pg ───────────► Supabase Postgres   (studio_profiles)
                                     │  fetch ────────► Ollama Cloud         (AI; key server-side)
```

---

## 🖥️ Run locally

**Prerequisites:** Node 18+ and npm.

```bash
npm run install:all      # installs root + frontend + backend
```

Create the env files (see [Configuration](#-configuration)):
- `frontend/.env`  ← copy from `frontend/.env.example`
- `backend/.env`   ← copy from `backend/.env.example`

```bash
npm run dev              # runs backend (:4000) + frontend (:5173) together
```

Open **http://localhost:5173**. (Run individually with `npm run dev:api` / `npm run dev:web`.)

> **Demo mode:** leave `frontend/.env`'s `VITE_API_URL` blank → the app runs fully on localStorage + offline templates, no backend/DB needed.

---

## 🗄️ Supabase setup (replicate the database)

1. Create a project at [supabase.com](https://supabase.com).
2. **Database:** open **SQL Editor → New query**, paste the contents of [`db/schema.sql`](db/schema.sql), and **Run**. This creates `studio_profiles` (one row per user) with Row-Level Security. *(The backend also auto-creates the table on boot as a fallback.)*
3. **Auth:** email auth is on by default. (For production you may want to disable "Confirm email" during testing, or configure SMTP.)
4. **Keys you'll need** (Dashboard → Project Settings):
   - **API** → `Project URL` and `anon` key.
   - **Database → Connection string → Session pooler (IPv4)** → use this as `DATABASE_URL`.

---

## 🔑 Configuration

### `frontend/.env`
```env
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_API_URL=http://localhost:4000          # prod: https://<backend>.onrender.com
```

### `backend/.env`
```env
PORT=4000
CORS_ORIGIN=http://localhost:5173            # prod: your Vercel URL
DATABASE_URL=postgresql://postgres.<ref>:<pwd>@aws-0-<region>.pooler.supabase.com:5432/postgres
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_ANON_KEY=<anon-key>
OLLAMA_API_KEY=<ollama-cloud-key>            # from https://ollama.com
OLLAMA_MODEL=gpt-oss:120b
```

> The Ollama key lives **only** in the backend. `localhost` and any `*.vercel.app` origin are always CORS-allowed; add your production frontend URL to `CORS_ORIGIN`.

---

## 🚀 Deploy live (Vercel + Render + Supabase)

**Order:** Supabase (DB) → Render (backend) → Vercel (frontend) → connect.

### 1. Supabase
Do the [Supabase setup](#️-supabase-setup-replicate-the-database) above. Grab the API URL, anon key, and the **Session pooler** `DATABASE_URL`.

### 2. Backend → Render
- New **Web Service** (or **Blueprint** using [`render.yaml`](render.yaml)).
- Root directory: `backend` · Build: `npm install` · Start: `npm start` · Health check: `/health`.
- Env vars: `DATABASE_URL` (Session pooler), `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `OLLAMA_API_KEY`, `OLLAMA_MODEL`, and `CORS_ORIGIN` (set after step 3). Render provides `PORT` automatically.
- Note your backend URL, e.g. `https://1now-backend.onrender.com`.

### 3. Frontend → Vercel
- Import the repo; set **Root Directory** = `frontend` (framework auto-detects Vite; output `dist`).
- Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL=https://<your-backend>.onrender.com`.
- Deploy → note your URL, e.g. `https://1now-feature.vercel.app`.
- [`frontend/vercel.json`](frontend/vercel.json) handles SPA routing (deep links / refresh).

### 4. Connect (CORS)
- In Render, set `CORS_ORIGIN` to your Vercel URL and redeploy.
- `*.vercel.app` is already allowed, so preview deployments work too.

### Gotchas
- **CORS** — if the browser logs "Access-Control-Allow-Origin missing", the requesting origin isn't allowed: add it to `CORS_ORIGIN` and confirm `VITE_API_URL` points at the right backend.
- **DB connect (`ENETUNREACH`)** — you used the direct DB host; switch `DATABASE_URL` to the **Session pooler** (IPv4).
- **Render free tier** sleeps when idle; the first request after a while is slow to wake.

---

## 🗂️ Project structure
```
frontend/
├── src/
│   ├── context/   AuthContext, ToastContext
│   ├── lib/       supabase (auth), api (backend client), store, ollama (AI),
│   │              templates, share, image, useSavedForm
│   ├── components/ AppLayout, FeaturePage, CardPreview, GenerateModal,
│   │              ShareBar, ImageField, BrandMark, Icons
│   └── pages/     Login, Signup, Dashboard, CompanyInfo, CarDetails
├── vercel.json
backend/
├── src/  index.js · config.js · db.js · auth.js · routes/{profile,ai}.js
db/  schema.sql
render.yaml
```
