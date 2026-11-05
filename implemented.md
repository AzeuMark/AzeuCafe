# AzeuCafe — Implementation Log

> Append-only record of every phase and change made to the system.
> Format: `## [Phase N — Title]` → date, status, what was done, files touched, commits, next up.

---

## [Phase 0 — Foundation & Tooling] — 2026-11-05

**Status:** ✅ complete

### Done
- Initialized git repository (`main` branch) with protective `.gitignore` (node_modules, .env, builds, uploaded runtime files)
- Wrote the three governing documents: `server-plan.md`, `client-plan.md`, this log
- Created root `package.json` — `npm run dev` runs server + client together via `concurrently`; `npm run setup` / `npm run seed` helpers
- Scaffolded `server/`: Express + Mongoose + auth stack dependencies, health-only `src/index.js` (full API is Phase 1), `.env` + `.env.example` with **generated** `JWT_SECRET` & `AES_KEY`, `uploads/` dir
- Reworked `client/`: template demo stripped; Tailwind v4 plugin wired; **Warm Espresso Café design tokens + class-based dark mode** (`@custom-variant dark`) defined in `index.css`; bundled variable fonts (Fraunces / Inter / JetBrains Mono) via @fontsource-variable (offline-safe); Vite proxies `/api` + `/uploads` → `:5000`; `server.fs.allow` so the slideshow can import the **real** `server/src/utils/aescrypt.js` with `?raw`
- Verified: server health endpoint responds; client builds cleanly

### Files created/changed
- `.gitignore`, `README.md`, `package.json` (root), `server-plan.md`, `client-plan.md`, `implemented.md`
- `server/package.json`, `server/.env`, `server/.env.example`, `server/src/index.js`, `server/uploads/.gitkeep`
- `client/package.json` (+deps), `client/vite.config.js`, `client/index.html`, `client/src/main.jsx`, `client/src/index.css`, `client/src/App.jsx`
- Removed template demo: `client/src/App.css`, `client/src/assets/{react.svg,vite.svg,hero.png}`, `client/public/icons.svg`

### Next
- Phase 1 — full backend: db, models, `aescrypt.js` + tamper test, auth, menu CRUD + upload, order state machine, demo-encrypt endpoints, seed
