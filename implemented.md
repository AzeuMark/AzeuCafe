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

- ~~Phase 3 — landing page~~ → **Phase 3 done, see below**

---

## [Phase 3 — Landing Page & Brand] — 2026-11-05

**Status:** ✅ complete

### Built
- **Real photography, offline-proof:** fetched from Unsplash with fallback candidates and committed to the repo —
  - `src/assets/landing-hero.jpg` — moody espresso-bar photo (first-choice ID `photo-1509042239860-f550ce710b93`, 853 KB)
  - `src/assets/landing-interior.jpg` — cozy café interior (`photo-1521017432531-fbd92d768814`, 242 KB)
- **`HomePage.jsx` rebuilt as the anti-slop editorial landing:**
  - Full-bleed moody hero (real photo + espresso gradient overlay, cream Fraunces headline, staggered entrance)
  - "How ordering works" — numbered editorial list (01/02/03), no card grids
  - Story section on espresso — interior photo with offset caramel frame + **"A word on privacy"** block linking to `/demo` (AES-256-GCM explained in one breath)
  - **Menu teaser pulling REAL items from the API** (`GET /api/menu`) with serif monogram fallback and peso prices
  - Hours & location on a foam panel with the cash-at-counter reminder
  - framer-motion reveals throughout (whileInView, once, staggered)
- Custom favicon: espresso rounded square + cream cup mark (matches the Logo component)
- `utils/format.js` — shared `peso()` formatter (en-PH)
- `CREDITS.md` (root) — Unsplash sources + license note for the class report

### Verification
- `vite build` → ✓ (469 modules; hero 873 KB + interior 247 KB bundled as hashed assets)

### Files
- `client/src/pages/HomePage.jsx`, `client/src/assets/landing-{hero,interior}.jpg`, `client/public/favicon.svg`, `client/src/utils/format.js`, `CREDITS.md`

### Next
- ~~Phase 4 — ordering loop~~ → **Phase 4 done, see entry below**

---

## [Phase 4 — Ordering Full Loop] — 2026-11-05

**Status:** ✅ complete

### Built
- **12 menu-item photos bundled**: fetched from Unsplash into `client/public/menu/*.jpg` (all first/second-choice candidates, zero fallbacks needed), matching the seeded slugs; sources logged in `CREDITS.md` — menu is photo-complete, still fully offline
- **Shared components**: `MenuItemPhoto` (photo with serif-monogram fallback via onError — never a broken-image icon), `StatusChip` (5-status pill using theme tokens), `MenuItemCard` (photo, price, add-to-cart with transient "Added ✓")
- **MenuPage**: category tabs (All / Espresso / Iced / Pastries / Snacks with live counts), category-grouped menu board with staggered framer-motion reveals, add-to-cart, cart shortcut chip
- **CartPage**: photo rows, qty steppers (− / +, min 1 max 50), line totals, clear-cart, subtotal, checkout hand-off + cash reminder; crafted empty state
- **CheckoutPage**: claim details prefilled from the encrypted-only-in-DB profile (editable), barista note, sticky summary sidebar (server re-prices at submit), places the real order → **success screen: big `AZ-000X` claim code, `PAY CASH AT THE COUNTER` panel, Waiting chip, track-orders CTA**, cart auto-clears
- **MyOrdersPage**: polls `/orders/mine` every 10s; waiting → amber cash banner; ready → green "ready for pickup" banner + **"I've got it — mark completed"** button; processing → the exact rule notice (only owner can cancel); cancel allowed **only in Waiting** (with confirm dialog); per-order history chain rendered `waiting → processing → …`

### Verification
- `vite build` → ✓ 472 modules, photos + fonts bundled
- lint: 0 errors (remaining warnings are oxlint heuristics on standard context/fetch patterns)

### Files
- `client/public/menu/*.jpg` (12), `components/{MenuItemPhoto,StatusChip,MenuItemCard}.jsx`, `pages/{Menu,Cart,Checkout,MyOrders}Page.jsx`, `CREDITS.md`

### Next
- ~~Phase 5 — Owner pages~~ → **Phase 5 done, see entry below**

---

## [Phase 5 — Owner Pages] — 2026-11-05

**Status:** ✅ complete

### Built
- **`PhotoField.jsx`** — the 3-way photo source picker used everywhere the Owner touches photos:
  - **Library**: grid of the 12 bundled photos (`/menu/*.jpg`, offline-safe for the demo)
  - **Upload**: file → `POST /api/menu/upload` multipart → multer stores under `/uploads/item-<ts>-<rand>.jpg` (5 MB, JPG/PNG/WebP)
  - **From URL**: pasted link validated to `http(s)://` before applying
  - Always emits `{ type, path }`; inline preview with monogram fallback + "Remove photo"; parse-free swap between modes
- **`MenuItemForm.jsx`** — one form for create AND edit (`POST /menu` / `PATCH /menu/:id`): name, price (₱, numeric), category select, description, PhotoField; server re-validates every field
- **`OwnerMenuPage.jsx`** rebuilt (replaces stub):
  - Loads `GET /api/menu/all` (owner-only list INCLUDING retired items)
  - Category-grouped rows with photo thumb, name/description, price, exact stored photo source caption
  - **Retire** (soft — `DELETE /menu/:id` sets `retired:true`, order history stays intact) with confirm dialog, **Restore** (`PATCH {retired:false}`), "Show retired" toggle with retired count
  - Inline new/edit form panel with framer-motion entrance
- **`OwnerOrdersPage.jsx`** rebuilt (replaces stub):
  - Loads `GET /api/orders`, **polls every 5s** (last-sync timestamp shown)
  - Status filter tabs (All/Waiting/Processing/Ready/Completed/Cancelled) with live counts
  - Cards show claim info **as the server decrypted it** (name · phone), placing account (name/email), barista note, items, total tagged "cash", full `waiting → …` history chain
  - Action buttons mirror the server's `TRANSITIONS` matrix exactly: waiting → **Accept → Processing** / Cancel · processing → **Mark Ready** / Cancel (owner may; users may not) · ready → **Hand out → Completed** · terminal = no buttons
  - Active orders highlighted with caramel border; terminal ones dimmed

### Verified (live API smoke run, server on :5000)
- Owner login ✓ → `/api/menu/all` returns all 12 items as `{ type, path }` images ✓
- Create item ✓ → PATCH price + swap photo to uploaded file ✓ → soft retire ✓ → un-retire ✓
- Multipart upload ✓ → `/uploads/item-….jpg` served ✓
- `GET /api/orders` (owner) → decrypted contact + user name/email + history chains ✓
- Unauthenticated `/api/menu/all` → **401** ✓
- Test artifacts deleted afterwards (test item removed from DB, upload file deleted)
- `vite build` ✓ (474 modules) · oxlint 0 errors (4 known benign warnings)

### Files
- `client/src/components/{PhotoField,MenuItemForm}.jsx`, `client/src/pages/{OwnerMenuPage,OwnerOrdersPage}.jsx`

### Next
- ~~Phase 6 — security-demo slideshow~~ → **Phase 6 done, see entry below**

---

## [Phase 6 — Security Presentation at /demo] — 2026-11-05

**Status:** ✅ complete — the deck for the instructor is live

### Built (`client/src/security-demo/` per client-plan.md §4)
- **`data/slides.js`** — all 16 slide definitions + the FULL spoken English script under each one; act metadata (Act 1 · Usage = blue, Act 2 · Security = amber, Act 3 · AESCrypt = green). Deck flow exactly per plan: title → usage walkthrough (6 slides) → security overview (3 slides) → AESCrypt deep-dive (3 slides) → team → thank-you
- **`SlideDeck.jsx`** — the engine: keyboard (← → ↑ ↓ · Space · PageUp/Down · Home/End), swipe drag, clickable act-colored progress dots, direction-aware AnimatePresence transitions, footer signature motif (AzeuMark cup + "Uelmark G. Valdehueza")
- **`PresenterNotes.jsx`** — the hidden-by-default script drawer (bottom-right button + **S** key, guarded against typing in inputs and Ctrl/Cmd/Alt combos); act-colored spine, prev/next inside the drawer so the audience never sees the script
- **`SlideContent.jsx`** — the 16 visuals: roles cards, auth-modal mockouts, a REAL-photo menu trio, checkout claim-code mock, the 5-status chips + rules table, PhotoField breakdown, owner dashboard TRANSITIONS table, the protect-table (per-data-type storage decisions), encrypted-vs-bcrypt-vs-plaintext 3-column table, keys & honest limitations
- **`LockSketch.jsx`** — self-drawing SVG padlock (shackle → body → keyhole → satisfying click-twist) on the "Meet the file" slide
- **`CodeWindow.jsx`** — **the REAL `aescrypt.js`** imported via `?raw` from the server tree (zero copy, zero drift; `server.fs.allow ['..']` pre-wired in Phase 0 for exactly this), editor chrome, typed filename animation, line gutter + comment/export highlighting
- **`CipherMorph.jsx`** — animated plaintext ⇄ ciphertext glyph-scramble used across the deck
- **`EncryptPlayground.jsx`** — the Act-3 finale against the REAL crypto: input → `POST /api/security/demo-encrypt` → live cipher morph → decrypt back; **"Corrupt 1 character" button** that flips a byte inside the last base64 segment so decryption *provably* fails with the server's GCM message
- `pages/DemoPage.jsx` re-exports the deck so the `/demo` route kept its place in App.jsx

### Verified (live run: server :5000 + dev :5173)
- `demo-encrypt` → real `v1.<iv>.<tag>.<cipher>` payload ✓ · round-trip `demo-decrypt` → original text ✓ · **tampered cipher → refused** with "wrong key or the ciphertext was tampered with." ✓
- Dev-mode `?raw` fetch of `aescrypt.js` through Vite → **HTTP 200**, full file served as a module string ✓ (build-time inlining also ✓, 483 modules)
- `vite build` ✓ · oxlint 0 errors (warnings are the known benign set + 2 new accepted: rAF ref pattern in CipherMorph, setState-in-effect in CodeWindow)

### Files
- `security-demo/{DemoPage.jsx, data/slides.js}`, `security-demo/components/{SlideDeck,PresenterNotes,SlideContent,CodeWindow,CipherMorph,LockSketch,EncryptPlayground}.jsx`, `pages/DemoPage.jsx`

### Next
- ~~Phase 7 — QA & README~~ → **Phase 7 done, see entry below**

---

## [Phase 7 — QA Pass, README, Demo Rehearsal] — 2026-11-05

**Status:** ✅ complete — project is demo-ready

### Built
- **`README.md` rewritten as the final doc**: what-it-does table (customer / owner / class), the per-data-type security design table (bcrypt · AES-256-GCM · plaintext email · server-side pricing, mirroring deck slide 10), a proper quick start (prereqs → setup → `.env` from template → `npm run seed` → `npm run dev`), accounts, an 8-row **demo-day cheat-sheet** (URLs, keyboard map: deck ←→/Space/Home/End/**S**, theme **T**, playground corruption trick), project map, API overview, honest-notes box
- **Full-stack rehearsal run against the live API** (new demo customer "Maria Santos", owner jar):
  - Registration forced role `user` ✓ · user hitting `POST /api/menu` → **403** ✓
  - Order placed from server-side prices: 2× Cappuccino + 1× Loaded Fries → total **₱420 computed by the server** ✓ and contact stored encrypted, returned decrypted for the owner's own ticket ✓
  - The full dance: Accept → Processing · user cancel **while processing → 403** with the "ask the owner" message ✓ · owner cancel **while processing → legal** (intentional rule) · illegal payload in ready → **409** ✓ · owner Ready → user "I've got it" → **completed 200**, history chain `waiting -> processing -> ready -> completed` ✓ · terminal order refuses every further move → **409** ✓
  - Unauthenticated guards: `/api/menu/all`, `/api/orders`, `/api/orders/mine` → all **401** ✓
- **BUG FOUND & FIXED by the rehearsal** — `normalizeImage` rejected photo-less items (empty path) even though the model defaults `image.path: ''` and `PhotoField` supports "no photo" (monogram). Server now treats a blank library/upload path as intentionally photo-less; URL photos still must be `http(s)://`. Re-verified live: photo-less create → 201 ✓, retire → hidden from public menu ✓, owner `/menu/all` still lists it ✓, temp item purged from the DB afterwards
- **Secrets sweep**: git tracks only `server/.env.example` (placeholders only) + `server/uploads/.gitkeep`; real `.env`, JWT secret, AES key and uploaded photos are all gitignored ✓
- **`npm run test:crypto` (server's own script): 5/5 PASS** — 3 round-trips exact, tamper throws (auth-tag mismatch), wrong key throws

### Demo data state (deliberate, kept)
- Menu: the 12 seeded items, none retired · Orders: `AZ-0001` waiting · `AZ-0002` completed · **`AZ-0003` cancelled** (organic cancel-rule demo) · **`AZ-0004` completed by user claim** · account "Maria Santos" as a second customer so the owner dashboard looks lived-in

### Verification
- rehearsal as above · `vite build` ✓ (483 modules, Phase 6) · oxlint 0 errors · server boots clean after the fix

### Next
- User runs the rehearsal themselves (`npm run dev` → the cheat-sheet in README) — and when ready, supplies the **groupmate name + role** to fill the reserved dashed slot on `/demo` slide 15 (one-line change in `security-demo/components/SlideContent.jsx` TeamSlide).







