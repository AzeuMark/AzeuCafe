# AzeuCafe ☕ — Café Ordering System

Full-stack café ordering system for a school activity.
Client: React 19 + Vite + Tailwind · Server: Node/Express + MongoDB (Mongoose) · Security: AES-256-GCM field encryption (`server/src/utils/aescrypt.js`) + bcrypt passwords.

- `server-plan.md` / `client-plan.md` — the build contract
- `implemented.md` — append-only log of everything done

## Quick start

```bash
# 1. MongoDB must be running locally (mongodb://127.0.0.1:27017)
# 2. Copy env template → real file, adjust if needed
cp server/.env.example server/.env

# 3. Install everything
npm run setup        # or: npm install && npm run install:server? see scripts — setup does both folders

# 4. Seed owner account + sample menu
npm run seed

# 5. Run both apps
npm run dev          # client → http://localhost:5173 · API → http://localhost:5000
```

Owner demo login: `owner@azeucafe.local` / `owner1234` (from `server/.env`).
