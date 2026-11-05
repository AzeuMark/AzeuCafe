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

### Verification
- `GET /api/health` → `{"ok":true,"service":"AzeuCafe API"}` ✔
- `npm run build` (client) → built in 213ms; fonts confirmed **bundled** as woff2 assets (offline-proof) ✔

### Files created/changed
- `.gitignore`, `README.md`, `package.json` (root), `server-plan.md`, `client-plan.md`, `implemented.md`
- `server/package.json`, `server/.env`, `server/.env.example`, `server/src/index.js`, `server/uploads/.gitkeep`
- `client/package.json` (+deps), `client/vite.config.js`, `client/index.html`, `client/src/main.jsx`, `client/src/index.css`, `client/src/App.jsx`
- Removed template demo: `client/src/App.css`, `client/src/assets/{react.svg,vite.svg,hero.png}`, `client/public/icons.svg`

### Commits
- `0f217c2` docs: project plans, implementation log, repo foundations
- `6b75e34` feat(phase-0): server scaffold, client tokens/fonts/proxies, template demo stripped

- ~~Phase 1 — full backend~~ → **Phase 1 done, see entry below**

---

## [Phase 1 — Full Backend & AESCrypt Core] — 2026-11-05

**Status:** ✅ complete

### Built
- **`server/src/utils/aescrypt.js`** — the security file: `encrypt(text, key)` / `decrypt(text, key)`, AES-256-GCM, random 12-byte IV per call, payload format `v1.<iv>.<tag>.<cipher>`, `safeDecrypt` helper for read paths
- `server/src/config/db.js` (MONGO_URI from .env) · `utils/orderCode.js` (AZ-0001 codegen)
- Models: `user` (name/phone encrypted, email plain for login, bcrypt password, role enum) · `menuItem` (photo {type,path}, soft-retire flag) · `order` (items+price snapshots, server total, encrypted contact, status enum + history trail)
- Middleware: `auth.middleware.js` (requireAuth via httpOnly JWT cookie, requireOwner) · `error.middleware.js` (uniform `{message}` errors)
- Controllers: auth (register/login/logout/me, role locked to `user` on register) · menu (list/all/create/update/soft-retire + multer photo upload) · orders (create with SERVER-side pricing, mine, all, full role/status matrix) · security (`demo-encrypt`/`demo-decrypt` calling the real aescrypt)
- Routes wired in `index.js` + `/uploads` static serving · scripts: `seed.js` (owner + 12 items, idempotent), `cryptoCheck.js` (5 tamper/roundtrip proofs)

### Verification
- `npm run test:crypto` → **5/5 PASS** (roundtrip ×3, tamper rejection, wrong-key rejection)
- `npm run seed` → Owner ensured + 12 menu items inserted
- End-to-end API smoke (register user → order → owner accept → *user-cancel-blocked during processing* → ready → user completes; history chain `waiting → processing → ready → completed`; owner dashboard shows decrypted customer; demo-encrypt/decrypt roundtrip; API refuses tampered ciphertext) → **all PASS**
- **Raw MongoDB proof:** every stored `name`/`phone`/order-contact reads as `v1.…` ciphertext; identical plaintext ("Juan Dela Cruz" ×3) encrypts to DIFFERENT values (random-IV property) — direct slideshow material

### Files
- server: `src/{index.js}`, `config/db.js`, `utils/{aescrypt.js,orderCode.js}`, `models/{user,menuItem,order}.model.js`, `middleware/{auth,error}.middleware.js`, `controllers/{auth,menu,orders,security}.controller.js`, `routes/{auth,menu,orders,security}.routes.js`, `scripts/{seed.js,cryptoCheck.js}`

### Commits
- (this entry) `feat(phase-1): full backend — AESCrypt, models, auth, menu+upload, order state machine, demo endpoints, seed`

- ~~Phase 2 — client shell~~ → **Phase 2 done, see entry below**

---

## [Phase 2 — Client Shell] — 2026-11-05

**Status:** ✅ complete

### Built
- `api/client.js` — fetch wrapper (credentials:include, JSON, uniform `{message}` errors, `postForm` ready for uploads)
- **ThemeContext** — light-first default, localStorage-persisted, toggles `<html class="dark">`, `T` keyboard shortcut (typing-safe)
- **AuthContext** — boots with `GET /auth/me`, exposes login/register/logout + the modal controller (`openAuth(mode)`)
- **CartContext** — localStorage-persisted cart (`{id,name,price,image,qty}`), add/setQty/remove/clear, count/total derived
- Components: **Navbar** (links, cart badge, theme toggle, auth area, owner links) · **Footer** (Security Demo link + AzeuMark credit) · **AuthModal** (login/register tabs, fresh-state mount per open, Esc/backdrop close) · **ProtectedRoute** (auth + owner guards, redirects + opens login modal) · **Logo** (hand-drawn cup SVG, no stock icons) · PhaseStub
- `App.jsx` — full route table with guards; 8 page files mounted (real content lands in P3–P6)
- Hand-crafted cup-and-bean logo replaces the Vite starter identity

### Verification
- `vite build` → ✓ (45 modules, fonts bundled)
- `oxlint` → 0 errors; 3 benign context-file warnings only
- Vite dev serves shell: root div + `<title>AzeuCafe` ✔

### Files
- src: `api/client.js`, `context/{Theme,Auth,Cart}Context.jsx`, `components/{Navbar,Footer,AuthModal,ProtectedRoute,Logo,PhaseStub}.jsx`, `App.jsx`, `pages/{Home,Menu,Cart,Checkout,MyOrders,OwnerMenu,OwnerOrders,Demo,NotFound}Page.jsx`

### Next
- Phase 3 — landing page + custom favicon (anti-slop pass)


