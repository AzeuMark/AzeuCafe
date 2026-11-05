# AzeuCafe ☕ — Café Ordering System

A full-stack café ordering system built for a school activity: customers order
online, **pay cash at the counter**, and follow their order through a strict
five-status state machine — while every piece of personal data that reaches the
database is **AES-256-GCM encrypted**. The `/demo` route ships a 16-slide
animated security presentation, including a live encrypt/decrypt playground
running the system's *actual* crypto code.

**Stack** — React 19 · Vite · Tailwind v4 · framer-motion (client) — Node/Express · MongoDB · Mongoose · JWT · bcrypt · multer (server)

> Docs: `server-plan.md` / `client-plan.md` are the build contract ·
> `implemented.md` is the append-only phase log · photo sources live in `CREDITS.md`.

---

## What it does

| Who | What they get |
|---|---|
| **Customer** (`user`) | Register/login · browse the menu · fill a cart · check out → **`AZ-000X` claim code** + "PAY CASH AT THE COUNTER" · track orders · cancel **only while Waiting** · confirm pickup when Ready |
| **Owner** (`owner`) | Menu manager (add/edit/**soft-retire** + 3-way photo field: bundled library / upload / URL) · live orders dashboard (5 s polling) with the server-enforced transition buttons (Accept → Processing, Mark Ready, Hand out → Completed, Cancel) |
| **The class** | `/demo` — the security presentation: 3 acts, full speaker script in a hidden drawer, the real `aescrypt.js` on screen, live AES-256-GCM playground |

### The security design (per data type — the heart of the project)

| Data | Stored as | Why |
|---|---|---|
| Passwords | **bcrypt** hash + per-user salt | Must *never* be recoverable — one-way by design |
| User name · phone · every order's claim contact | **AES-256-GCM ciphertext** (`v1.<iv>.<tag>.<cipher>`) | Must come back later (claims, call-backs) — authenticated, tamper-proof, key-only-on-server |
| Email | plaintext | Login needs exact-match lookup + unique index — public by choice, documented |
| Cart prices/total | recomputed **server-side from its own DB** | The browser only sends ids + quantities — tampering the UI can't change what you owe |

Order status rules are enforced by a transitions matrix in
`server/src/controllers/orders.controller.js` (`TRANSITIONS`) — the client only
ever *asks*, the server *decides*.

---

## Quick start

```bash
# prerequisites: Node 18+, MongoDB running locally (mongodb://127.0.0.1:27017)

# 1. install both apps
npm run setup

# 2. create the server env from the template, adjust if needed
cp server/.env.example server/.env

# 3. seed the owner account + the 12-item demo menu (idempotent)
npm run seed

# 4. run both apps
npm run dev            # client → http://localhost:5173 · API → http://localhost:5000
```

**Owner login** (seeded from `server/.env`): `owner@azeucafe.local` / `owner1234`
Public registration always creates the `user` role — the server decides roles, never the forms.

Crypto self-check: `cd server && npm run test:crypto` (encrypt/decrypt/tamper round-trip on the console).

---

## Demo-day cheat-sheet

| Thing | Where / what |
|---|---|
| Café site | http://localhost:5173 — landing → **Menu** → cart → checkout (`AZ-000X` code) → **My Orders** |
| Owner dashboards | **Orders** `/owner/orders` (accept/mark-ready/hand out, 5 s polling) · **Manage** `/owner/menu` (3-way PhotoField, soft-retire + restore) |
| The presentation | http://localhost:5173/demo — arrows / Space navigate · Home/End jump · **S = speaker script drawer** (hidden by default) |
| Theme | Sun/moon button or **T** — light-first, applies site-wide incl. the deck |
| Playground magic | `/demo` slide 14: type a name → **Encrypt** → **Decrypt** round-trip → **Corrupt 1 character** → decrypt now refuses with the GCM tamper error |
| Claim a code | Owner: Accept → Processing → Mark Ready; customer gets the pickup banner + "I've got it" button |

---

## Run it online (Cloudflare Tunnel)

The stack can be put on the public internet in one command — the demo tunnel
bakes everything needed into the repo already (`allowedHosts` in `vite.config.js`,
HTTPS-safe `httpOnly` cookies, Vite proxy for `/api` + `/uploads`):

```powershell
npm run dev                        # server :5000 + vite :5173 (keep running)
cloudflared tunnel --url http://localhost:5173   # prints a public URL
```

- Anyone on the internet can open the printed `*.trycloudflare.com` URL —
  the café app, owner dashboards and `/demo` all work (login included).
- **Quick tunnels are session-scoped**: the URL changes on every restart and
  dies when `npm run dev` or `cloudflared` stops. Re-run the two commands to get a fresh one.
- For a permanent branded URL you need a Cloudflare account with a domain:
  `cloudflared tunnel login` → named tunnel → DNS route. Not needed for a class demo.

## Project map

```
├── client/
│   ├── public/menu/            12 bundled item photos (offline demo) + favicon
│   ├── src/
│   │   ├── api/client.js       fetch wrapper (cookie sessions, forms)
│   │   ├── components/         Navbar · Footer · AuthModal · StatusChip · MenuItemCard…
│   │   ├── context/            Theme (light-first, T) · Auth (modal) · Cart (localStorage)
│   │   ├── pages/              Home · Menu · Cart · Checkout · MyOrders · OwnerMenu · OwnerOrders
│   │   └── security-demo/      ★ the 16-slide deck (slides data, SlideDeck, PresenterNotes,
│   │                             CodeWindow ← ?raw import of the real aescrypt.js, playground)
├── server/
│   ├── src/
│   │   ├── utils/aescrypt.js   ★ THE security file — encrypt/decrypt/safeDecrypt
│   │   ├── models/             User (bcrypt + AES fields) · MenuItem · Order (snapshots)
│   │   ├── controllers/        auth · menu (+ multer upload) · orders (TRANSITIONS matrix)
│   │   ├── routes/             /api/auth · /api/menu · /api/orders · /api/security (demo)
│   │   └── scripts/            seed.js (idempotent) · cryptoCheck.js
│   └── uploads/                runtime owner-uploaded photos (gitignored)
```

## API overview

| Endpoint | Auth | Purpose |
|---|---|---|
| `POST /api/auth/register` · `/login` · `/logout` · `GET /me` | — | Sessions (JWT httpOnly cookie) |
| `GET /api/menu` / `GET /api/menu/all` | public / owner | Public board · owner list incl. retired |
| `POST·PATCH·DELETE /api/menu…` + `POST /api/menu/upload` | owner | CRUD (DELETE = soft retire) · multer photo |
| `POST /api/orders` · `GET /api/orders/mine` · `GET /api/orders` · `PATCH /api/orders/:id/status` | user/owner · owner | Order with server-side pricing · my history · dashboard · the state machine |
| `POST /api/security/demo-encrypt` · `demo-decrypt` | public | Slideshow playground — runs the real `encrypt()/decrypt()` |

---

## Honest notes

- Greenfield demo scale: one node, one laptop, secrets in `server/.env` (gitignored).
  Lost key = old ciphertexts surface as `[unreadable — wrong key or tampered]`
  markers via `safeDecrypt` — by design, never fake data.
- Payment is **cash only** — there is no gateway, no card data, anywhere.
- Everything bundled (photos, fonts) so the demo works with **zero internet**.

Built by **Uelmark G. Valdehueza (AzeuMark)** · 2026.
