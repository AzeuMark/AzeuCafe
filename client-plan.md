# AzeuCafe — Client Plan

> React 19 + Vite + Tailwind CSS v4 · offline-proof (bundled fonts & photos) · Warm Espresso Café art direction.
> Includes the ★ security presentation deck (16 slides) delivered at `/demo`.

---

## 1. File Structure (every file that will exist)

```
client/
├── package.json
├── vite.config.js          # react + tailwind plugins · proxies /api & /uploads → :5000 · fs.allow for real-file import
├── index.html              # lang="en", title AzeuCafe, favicon
├── public/
│   ├── favicon.svg         # replaced with a custom bean/cup mark in P3 (AI-slop ban)
│   └── menu/               # ★ bundled item photos (downloaded from Unsplash/Pexels, committed) — also the Owner photo-library
└── src/
    ├── main.jsx            # font packages → ThemeContext → AuthProvider → BrowserRouter
    ├── App.jsx             # <Routes> table (§3)
    ├── index.css           # tailwind entry · @custom-variant dark · @theme tokens (§5)
    ├── assets/             # landing-page hero/section imagery (downloaded, bundled)
    ├── api/
    │   └── client.js       # fetch wrapper (credentials:'include', JSON, {message} errors)
    ├── context/
    │   ├── AuthContext.jsx # me / login / register / logout (+ re-login on refresh)
    │   ├── CartContext.jsx # items [{id,name,price,image,qty}] · add/setQty/remove/clear · localStorage
    │   └── ThemeContext.jsx# 'light'|'dark' · localStorage('theme') · <html class="dark"> · default LIGHT
    ├── components/
    │   ├── Navbar.jsx      # logo, links, cart badge, 🌗 theme toggle, auth area (opens AuthModal)
    │   ├── Footer.jsx      # links + "Security Demo" → /demo + AzeuMark credit
    │   ├── AuthModal.jsx   # login/register tabs in one modal
    │   ├── ProtectedRoute.jsx # requiresAuth / requireOwner guards → redirect or AuthModal
    │   ├── MenuItemCard.jsx# photo (or monogram fallback) + name + price + add-to-cart
    │   ├── StatusChip.jsx  # colored chip for the 5 statuses
    │   ├── OrderCard.jsx   # order summary + action buttons filtered by the role/rules matrix
    │   ├── PhotoField.jsx  # 3-way photo source picker: upload / bundled library / URL paste
    │   └── Logo.jsx        # cup-bean mark (P3)
    ├── pages/
    │   ├── HomePage.jsx    # ★ landing — moody espresso-bar hero, editorial sections (P3)
    │   ├── MenuPage.jsx    # category-grouped browse
    │   ├── CartPage.jsx
    │   ├── CheckoutPage.jsx        # name/phone confirm + note → "PAY CASH AT COUNTER" confirmation
    │   ├── MyOrdersPage.jsx        # user order list + cancel(only Waiting) / complete(Ready)
    │   ├── OwnerMenuPage.jsx       # add/edit/soft-retire + PhotoField
    │   ├── OwnerOrdersPage.jsx     # accept/mark-ready/cancel/complete + status filter (~5s polling)
    │   └── NotFoundPage.jsx
    └── security-demo/       # ★ the 16-slide presentation
        ├── DemoPage.jsx             # deck shell mounted at /demo
        ├── data/slides.js           # slide definitions + FULL SPOKEN SCRIPT per slide (English)
        └── components/
            ├── SlideDeck.jsx        # transitions, arrows/←→/space/Home/End, act-colored progress dots
            ├── PresenterNotes.jsx   # hidden-by-default script drawer · toggle button bottom-right · 'S' key
            ├── CodeWindow.jsx       # reads the REAL aescrypt.js via `?raw` import → editor-styled window
            ├── CipherMorph.jsx      # animated plaintext ⇄ ciphertext scramble
            ├── LockSketch.jsx       # self-drawing SVG padlock
            └── EncryptPlayground.jsx# input → POST /api/security/demo-encrypt → live morph → decrypt back
```

## 2. Design System — "Warm Espresso Café"

Fonts (bundled via @fontsource-variable → offline-safe):
- Display: **Fraunces** (headlines, café-menu energy)
- Body/UI: **Inter**
- Code/mono: **JetBrains Mono**

Colors (`@theme` tokens in index.css):
| Token | Hex | Use |
|---|---|---|
| latte | `#FAF4E8` | light background |
| foam | `#FFFDF7` | light surface |
| bean | `#2B1B10` | light text |
| espresso | `#1A120C` | dark background |
| roast | `#241811` | dark surface |
| milk | `#F5EDDF` | dark text |
| caramel | `#D29A5B` | primary accent (both themes) |
| caramel-deep | `#B5762F` | accent on light |

Status chip colors: waiting `#E5A13C` · processing `#4E86D8` · ready `#3D8B5F` · completed `#6F7F63` · cancelled `#C4564A`.

Dark mode: class strategy (`@custom-variant dark`), toggled on `<html>`, remembered in `localStorage`, **default light**. Site-wide — landing, app pages, owner pages, and the slideshow all follow one toggle (sun/moon button + `T` shortcut).

## 3. Routes

| Path | Page | Guard |
|---|---|---|
| `/` | HomePage | — |
| `/menu` | MenuPage | — |
| `/cart` | CartPage | — |
| `/checkout` | CheckoutPage | auth |
| `/orders` | MyOrdersPage | auth |
| `/owner/menu` | OwnerMenuPage | **owner** |
| `/owner/orders` | OwnerOrdersPage | **owner** |
| `/demo` | security-demo deck | public (footer link) |
| `*` | NotFoundPage | — |

Dev API access via Vite proxy (`/api`, `/uploads` → `http://localhost:5000`) — no hardcoded origins.

## 4. Slideshow — 16 slides, 3 acts (moved from plan discussion; final)

| # | Act | Slide |
|---|---|---|
| 1 | — | Title — "AzeuCafe" + **Uelmark G. Valdehueza (AzeuMark)** |
| 2 | 1 · Usage | What is AzeuCafe (2 roles · cash-at-counter) |
| 3 | 1 · Usage | User: register & login modal |
| 4 | 1 · Usage | User: browse menu & cart |
| 5 | 1 · Usage | User: checkout → "Pay cash at counter" prompt |
| 6 | 1 · Usage | User: order tracking — 5 statuses + cancel rules |
| 7 | 1 · Usage | Owner: menu management (add/edit/soft-retire · 3 photo sources) |
| 8 | 1 · Usage | Owner: orders dashboard + the rules table |
| 9 | 2 · Security | What we protect & why |
| 10 | 2 · Security | Encrypted vs bcrypt vs plaintext (the table) |
| 11 | 2 · Security | Key management (.env) + honest limitations |
| 12 | 3 · AESCrypt | Meet the file — AES-256-GCM, encrypt/decrypt signatures |
| 13 | 3 · AESCrypt | The REAL code window (`aescrypt.js` via ?raw, filename typed on animation) |
| 14 | 3 · AESCrypt | Live encrypt/decrypt playground |
| 15 | — | **The Team** — Uelmark + **placeholder slot** for groupmate (name/role filled later) |
| 16 | — | Summary + thank-you / Q&A |

Deck rules:
- **Every slide has a full English speaker script** in `data/slides.js`, revealed only in the PresenterNotes drawer
- PresenterNotes: bottom-right toggle button + `S` shortcut, **hidden by default** so the audience never sees it
- Branding: AzeuMark signature motif on every slide footer
- Animations on every slide: staggered reveals, cinematic transitions, self-drawing lock, typed filename, cipher morph, steam motifs — framer-motion

## 5. Photo Strategy

- Seeded item photos: downloaded from Unsplash/Pexels (~900px, q75) → `client/public/menu/*.jpg` → **committed to repo → demo works offline**, sources logged in root `CREDITS.md`
- Landing hero (moody espresso bar) + section textures: same treatment at ~1920px → `src/assets/`
- Owner item form (PhotoField): upload (multer → `/uploads/`) · bundled library (the same `public/menu/` folder) · URL paste — all three, one clean photo field
- Fallback: styled monogram card whenever an item lacks a photo

## 6. Phase Mapping (client work)

| Phase | Client deliverable |
|---|---|
| P0 | scaffolding: tokens, fonts, proxies, placeholder App, template cleanup (done in Phase 0) |
| P2 | router table, Auth/Cart/Theme contexts, Navbar/Footer/AuthModal/ProtectedRoute, api client |
| P3 | HomePage landing + custom favicon/logo (anti-slop pass) |
| P4 | MenuPage, CartPage, CheckoutPage, MyOrdersPage (ordering full loop) |
| P5 | OwnerMenuPage (PhotoField), OwnerOrdersPage (dashboard) |
| P6 | entire security-demo deck (slides, scripts, animations, playground) |
| P7 | polish: responsive passes, error/loading states, favicon/photo final QA |

Formatting helper for prices: `Intl.NumberFormat('en-PH', { style:'currency', currency:'PHP' })`.
