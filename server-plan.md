# AzeuCafe — Server Plan

> School project — intentionally basic, not enterprise-grade.
> Stack: Node.js (ES Modules) · Express 5 · Mongoose (MongoDB) · JWT (httpOnly cookie) · bcrypt passwords · **AES-256-GCM field encryption via `aescrypt.js`**.

---

## 1. File Structure (every file that will exist)

```
server/
├── package.json
├── .env                         # real secrets — never committed
├── .env.example                 # committed template of required variables
├── uploads/                     # owner-uploaded menu photos, served at /uploads
│   └── .gitkeep
└── src/
    ├── index.js                 # entry: dotenv → express app → cors/cookies/json → routes → errors
    ├── config/
    │   └── db.js                # mongoose.connect(MONGO_URI), friendly startup errors
    ├── models/
    │   ├── user.model.js        # User schema (+ toPublicJSON → decrypts name/phone)
    │   ├── menuItem.model.js    # Menu item schema (soft-retire flag `retired`)
    │   └── order.model.js       # Order schema (status enum + status history)
    ├── middleware/
    │   ├── auth.middleware.js   # requireAuth (JWT cookie), requireOwner
    │   └── error.middleware.js  # 404 fallback + centralized error responder
    ├── controllers/
    │   ├── auth.controller.js   # register / login / logout / me
    │   ├── menu.controller.js   # list, create, update, soft-retire, photo upload
    │   ├── orders.controller.js # create, mine, list-all, status transitions
    │   └── security.controller.js # demo-encrypt / demo-decrypt (slideshow playground)
    ├── routes/
    │   ├── auth.routes.js
    │   ├── menu.routes.js       # includes multer upload route
    │   ├── orders.routes.js
    │   └── security.routes.js
    ├── scripts/
    │   ├── seed.js              # `npm run seed` → upsert Owner + 12 menu items
    │   └── cryptoCheck.js       # `npm run test:crypto` → roundtrip + tamper-proof demo
    └── utils/
        ├── aescrypt.js          # ★ THE security file (see §4)
        └── orderCode.js         # order codes: AZ-0001, AZ-0002, ...
```

## 2. Database Collections ("tables")

### users
| field | type | notes |
|---|---|---|
| name | String | **AES-encrypted at rest** (aescrypt) |
| email | String | plaintext on purpose — used for login lookup & uniqueness |
| phone | String | **AES-encrypted at rest** |
| password | String | **bcrypt hash only** — never AES-encrypted, never decryptable |
| role | `'user' \| 'owner'` | default `user`; owner created only via seed script |
| timestamps | — | createdAt / updatedAt |

### menu_items
| field | type | notes |
|---|---|---|
| name | String | |
| description | String | |
| category | enum | `espresso-drinks` `iced-drinks` `pastries` `snacks` |
| price | Number | stored numeric (₱ assumed), formatted client-side |
| image | `{ type, path }` | type: `library`(bundled) / `upload`(server folder) / `url` — optional, client falls back to monogram card |
| retired | Boolean | soft delete — hidden from menu, never hard-deleted (order history safety) |
| timestamps | — | |

### orders
| field | type | notes |
|---|---|---|
| orderCode | String | unique, `AZ-0001` style |
| user | ObjectId → users | login required to order |
| items | `[{ item, name, price, image, qty }]` | name/price **frozen at order time** (price changes never rewrite history) |
| total | Number | **server-computed from its own DB prices** — client totals never trusted |
| note | String | optional customer note |
| contact | `{ name, phone }` | **both AES-encrypted** (snapshot from profile/checkout) |
| status | enum | `waiting` `processing` `ready` `completed` `cancelled` — default `waiting` |
| history | `[{ status, at, by }]` | audit trail — every status change logged |
| timestamps | — | |

## 3. Order State Machine (confirmed spec)

| From | To | Allowed by |
|---|---|---|
| waiting | processing | **Owner** (Accept) |
| waiting | cancelled | Owner, or the owning User |
| processing | ready | Owner |
| processing | cancelled | **Owner only** (user must ask owner — school note shown in UI) |
| ready | completed | Owner, or the owning User |
| ready | cancelled | — nobody (per confirmed rules) |

`completed` and `cancelled` are terminal. Every transition enforced server-side (role + ownership checks); violations → `403`/`409`.

## 4. `aescrypt.js` — the security file (centerpiece)

- **Public API exactly as specified:** `encrypt(text, key)` and `decrypt(text, key)`
- Algorithm: **AES-256-GCM** (authenticated — tampering breaks decryption), random 12-byte IV per call
- Wire format returned by `encrypt`: `v1.<ivB64>.<tagB64>.<ctB64>`
- `decrypt` parses the format, verifies the auth tag (throws on tamper), returns plaintext
- Key: 32-byte **hex** string from `AES_KEY` in `.env` — never shipped to the client
- Scope discipline (deliberate, school-basic):
  - Encrypt: user `name`, user `phone`, order contact snapshot
  - Plaintext: `email` (random-IV encryption would break login lookups; a deterministic scheme = enterprise territory, out of scope)
  - Passwords: bcrypt only (AES is reversible; passwords must not be)
- Demo honesty (to be stated on the limitations slide): single `.env` key, no rotation, no KMS/HSM

## 5. API Surface

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | public | create user (role locked to `user`), encrypts name/phone, bcrypt password, sets JWT cookie |
| POST | `/api/auth/login` | public | verify bcrypt, set JWT cookie |
| POST | `/api/auth/logout` | cookie | clear cookie |
| GET | `/api/auth/me` | cookie | current user (name/phone decrypted) |
| GET | `/api/menu` | public | list active (non-retired) items |
| GET | `/api/menu/all` | owner | includes retired items |
| POST | `/api/menu` | owner | create item |
| PATCH | `/api/menu/:id` | owner | edit fields / swap photo / un-retire (`retired:false`) |
| DELETE | `/api/menu/:id` | owner | soft-retire (`retired:true`) |
| POST | `/api/menu/upload` | owner | multer file → `{ path: "/uploads/<file>" }` |
| POST | `/api/orders` | user | create order from `[{ id, qty }]`; server prices/total/contact-encryption |
| GET | `/api/orders/mine` | user | own order history |
| GET | `/api/orders` | owner | all orders (dashboard) |
| PATCH | `/api/orders/:id/status` | role-matrix | apply state machine (§3) |
| POST | `/api/security/demo-encrypt` | public | `{ text }` → `{ cipher }` using the REAL `aescrypt.js` (slideshow playground) |
| POST | `/api/security/demo-decrypt` | public | `{ cipher }` → `{ text }` (roundtrip proof for the demo) |

Error convention: uniform `{ message }` body + proper HTTP status; centralized error middleware.

## 6. Uploads Policy (multer)

- Storage: disk → `server/uploads/`, filename `item-<timestamp>-<rand><ext>`
- Allowed: `image/jpeg`, `image/png`, `image/webp` — max **5 MB**
- Served statically at `http://localhost:5000/uploads/...`

## 7. Environment Variables (.env)

| Var | Example / decided value |
|---|---|
| PORT | `5000` |
| MONGO_URI | `mongodb://127.0.0.1:27017/azeucafe` (local now; swap to Atlas = one-line change) |
| CLIENT_ORIGIN | `http://localhost:5173` |
| JWT_SECRET | generated 64-hex |
| AES_KEY | generated 64-hex (32 bytes) |
| OWNER_NAME | `Owner` |
| OWNER_EMAIL | `owner@azeucafe.local` |
| OWNER_PASSWORD | `owner1234` (demo password — changeable in `.env`) |

## 8. Scripts

- `npm run dev` → `node --watch src/index.js`
- `npm start` → production-style start
- `npm run seed` → upsert Owner (if missing) + the 12 menu items (idempotent)
- `npm run test:crypto` → AES roundtrip + tamper-rejection proof (feeds the slideshow narrative)

## 9. Phase Mapping (server work)

| Phase | Server deliverable |
|---|---|
| P0 | scaffolding: deps, `.env`s, health-only index.js (done in Phase 0) |
| P1 | **everything**: db.js, models, `aescrypt.js` + cryptoCheck, auth, full menu CRUD + upload, full order state machine, demo-encrypt/decrypt, seed — deliberately complete so all later phases are frontend-only |
| P4/P5 | consume endpoints; server changes only if client reveals a bug |
| P6 | none — demo endpoints already exist |
| P7 | bugfixes only |

Seeded menu (~12 items / 4 categories): espresso drinks ×3, iced drinks ×3, pastries ×3, snacks ×3, each mapped to a bundled photo in `client/public/menu/` (fetched from Unsplash/Pexels, logged in `CREDITS.md`).
