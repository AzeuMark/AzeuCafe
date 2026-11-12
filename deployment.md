# AzeuCafe — Full Deployment Guide

Complete, step-by-step instructions for deploying **AzeuCafe** to production using:
- **Database:** MongoDB Atlas (cloud MongoDB)
- **Backend:** Railway (Node.js + Express API + static `/uploads`)
- **Frontend:** Vercel (React 19 + Vite SPA)

*(For a temporary live class demo directly from your laptop without cloud setup, see [Option B: Quick Demo via Cloudflare Tunnel](#option-b-quick-demo-via-cloudflare-tunnel) at the bottom.)*

---

## Architecture Overview

```
Browser
  │
  ├──► Vercel (https://your-app.vercel.app)
  │      ├── Serves React SPA, fonts, & bundled /menu/*.jpg photos
  │      ├── Rewrites /api/*     ──► Railway (https://your-api.up.railway.app/api/*)
  │      └── Rewrites /uploads/* ──► Railway (https://your-api.up.railway.app/uploads/*)
  │
  └──► Railway (Express Server)
         └── Connects via MONGO_URI ──► MongoDB Atlas (Cloud DB)
```

> **Why Vercel Rewrites Matter (`httpOnly` Cookies):**
> `server/src/controllers/auth.controller.js` sets the JWT cookie with `sameSite: 'lax'` (`httpOnly: true`). By proxying `/api/*` and `/uploads/*` through `vercel.json` rewrites (and leaving `VITE_API_URL` unset), the browser communicates exclusively with your Vercel domain as a **first-party same-origin request**. This prevents browsers like Safari, Chrome, and iOS browsers from blocking session cookies and avoids CORS preflight errors.

---

## Prerequisites & Pre-Deployment Checks

Before deploying, ensure you have:
1. Accounts on **[GitHub](https://github.com/)**, **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**, **[Railway](https://railway.app/)**, and **[Vercel](https://vercel.com/)**.
2. Your latest code pushed to a GitHub repository.
3. Fresh production secrets generated (64-character hex strings = 32 bytes) for `JWT_SECRET` and `AES_KEY`. Run this twice locally to generate two different keys:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   > **Important:** Keep your production `AES_KEY` safe and never change it after users/orders exist, otherwise existing encrypted names, phones, and order contacts will show `[unreadable — wrong key or tampered]`.
4. Confirm the project passes checks locally:
   ```bash
   npm run build
   npm run test:crypto --prefix server
   ```

---

## Step 1: Set Up MongoDB Atlas (Database)

1. Log in to **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**.
2. Click **+ Create** (or **Build a Database**):
   - Select the **M0 (Free)** shared tier.
   - Pick a provider (e.g., AWS) and a region close to you/your Railway region (e.g., Singapore `ap-southeast-1` or US East `us-east-1`).
   - Name the cluster (e.g., `AzeuCafe`) and click **Create Deployment**.
3. **Create a Database User:**
   - Under **Security → Database Access**, click **+ Add New Database User** (or fill out the quickstart prompt).
   - Authentication Method: **Password**.
   - Enter a username (e.g., `azeuadmin`) and generate/enter a strong password (avoid special URL characters like `@`, `#`, `:`, `/` or URL-encode them). **Save this password.**
   - Built-in Role: **Read and write to any database**.
   - Click **Add User**.
4. **Configure Network Access:**
   - Under **Security → Network Access**, click **+ Add IP Address**.
   - Click **Allow Access from Anywhere** (`0.0.0.0/0`). *(Required so Railway's dynamic IPs can connect).*
   - Click **Confirm**.
5. **Copy Your Connection String:**
   - Go to **Deployment → Database** and click **Connect** on your cluster.
   - Choose **Drivers** → **Node.js**.
   - Copy the connection string, replace `<db_password>` (or `<password>`) with your database user's password, and insert `/azeucafe` before the `?`:
     ```text
     mongodb+srv://azeuadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/azeucafe?retryWrites=true&w=majority
     ```

---

## Step 2: Deploy the Backend on Railway

1. Make sure all local commits are pushed to GitHub:
   ```bash
   git push origin main
   ```
2. Log in to **[Railway](https://railway.app/)** with GitHub.
3. Click **+ New Project** → **Deploy from GitHub repo** → choose your **AzeuCafe** repository.
4. Click on the newly created service card, open the **Settings** tab, and configure:
   - **Root Directory:** `/server`
   - **Build Command:** *(leave default; Railway runs `npm install`)*
   - **Start Command:** `npm start` *(runs `node src/index.js`)*
5. Open the **Variables** tab and add every required variable from `server/.env.example`:
   | Variable | Value / Notes |
   |---|---|
   | `PORT` | `5000` *(Railway automatically maps its public proxy to this or overrides `PORT`)* |
   | `MONGO_URI` | Your MongoDB Atlas connection string from Step 1 |
   | `JWT_SECRET` | Your generated 64-hex secret |
   | `AES_KEY` | Your generated 64-hex key (32 bytes) |
   | `CLIENT_ORIGIN` | `http://localhost:5173` *(you will add your Vercel URL here in Step 3)* |
   | `OWNER_NAME` | `Owner` |
   | `OWNER_EMAIL` | `owner@azeucafe.local` *(or your preferred owner login ID)* |
   | `OWNER_PASSWORD` | Set a strong owner password for production |
6. **Generate a Public Domain:**
   - Go to the service's **Settings** tab → **Networking** → **Public Networking**.
   - Click **Generate Domain**.
   - Copy the generated URL (e.g., `https://azeucafe-server-production.up.railway.app`).
7. **Verify the Backend Health Endpoint:**
   - Wait for the deployment status to turn **Active / Online**.
   - Open `https://YOUR_RAILWAY_DOMAIN.up.railway.app/api/health` in your browser.
   - Confirm it returns:
     ```json
     {"ok":true,"service":"AzeuCafe API","time":"..."}
     ```
8. **Optional — Persist Owner Photo Uploads:**
   - By default, Railway container disks reset on redeploy (the 12 bundled `/menu/*.jpg` photos live in `client/public/menu/` and are unaffected).
   - If you want owner-uploaded images (`POST /api/menu/upload`) to survive server redeploys, open your Railway service → **Volumes** (or right-click canvas → **Volume**) → attach a volume mounted to `/app/uploads` (or matching your container's `server/uploads` path).
9. **Seed MongoDB Atlas with Owner & Demo Menu:**
   - Run the seed script once against your Atlas database:
     - **Option 1 (Railway CLI):**
       ```bash
       npm i -g @railway/cli
       railway login
       railway link
       railway run npm run seed
       ```
     - **Option 2 (From your local machine temporarily):**
       Run `seed.js` directly against your Atlas URI (ensure your local IP is covered by `0.0.0.0/0` in Atlas):
       ```powershell
       # PowerShell
       $env:MONGO_URI="mongodb+srv://azeuadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/azeucafe?retryWrites=true&w=majority"
       $env:AES_KEY="YOUR_PRODUCTION_64_HEX_AES_KEY"
       $env:OWNER_EMAIL="owner@azeucafe.local"
       $env:OWNER_PASSWORD="YOUR_PRODUCTION_OWNER_PASSWORD"
       npm run seed
       ```
   - Confirm the output prints:
     `Owner ensured: ...`
     `Menu ensured: 12 items (12 newly inserted).`
     `Seed complete.`

---

## Step 3: Deploy the Frontend on Vercel

1. **Configure Vercel Proxy Rewrites:**
   Open [`client/vercel.json`](client/vercel.json) and add the `/api/:match*` and `/uploads/:match*` rewrite rules pointing to your Railway domain (place them **above** the `/(.*)` SPA fallback):
   ```json
   {
     "$schema": "https://openapi.vercel.sh/vercel.json",
     "rewrites": [
       {
         "source": "/api/:match*",
         "destination": "https://YOUR_RAILWAY_DOMAIN.up.railway.app/api/:match*"
       },
       {
         "source": "/uploads/:match*",
         "destination": "https://YOUR_RAILWAY_DOMAIN.up.railway.app/uploads/:match*"
       },
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
   *(If you deploy from the repository root instead of setting Root Directory to `client`, put the same three `rewrites` entries into the root [`vercel.json`](vercel.json) as well).*

2. **Commit and Push to GitHub:**
   ```bash
   git add client/vercel.json
   git commit -m "chore(deploy): wire Railway backend rewrites in vercel.json"
   git push origin main
   ```

3. **Import into Vercel:**
   - Log in to **[Vercel](https://vercel.com/)**.
   - Click **Add New...** → **Project**.
   - Select your **AzeuCafe** GitHub repository and click **Import**.
   - Configure the Project settings:
     - **Framework Preset:** `Vite`
     - **Root Directory:** Click **Edit** and select `client`
     - **Build Command:** `npm run build` *(default)*
     - **Output Directory:** `dist` *(default)*
     - **Environment Variables:** Leave `VITE_API_URL` **unset** so all requests go through the same-origin `vercel.json` rewrites.
   - Click **Deploy**.

4. **Update `CLIENT_ORIGIN` on Railway:**
   - Once Vercel finishes deploying, copy your live frontend URL (e.g., `https://azeucafe.vercel.app`).
   - Go back to **Railway → Your Server Service → Variables**.
   - Update `CLIENT_ORIGIN` (comma-separated, no spaces):
     ```text
     https://azeucafe.vercel.app,http://localhost:5173
     ```
   - Railway will automatically redeploy/restart with the updated CORS allowlist.

---

## Step 4: Post-Deployment Verification Checklist

Visit your live Vercel URL (`https://your-app.vercel.app`) and test every flow end to end:

1. **Landing & Menu (`/`, `/menu`):**
   - Hero and interior photos load cleanly.
   - All 12 menu items appear with bundled photos and peso prices.
   - Refreshing `/menu` or `/demo` directly in the browser loads the page (no 404).
2. **Customer Auth & Session Persistence:**
   - Click **Log in → Register**, create a test customer account (with name, email, phone, password ≥ 6 chars).
   - Refresh the browser (`F5`) — verify you stay logged in (`GET /api/auth/me` succeeds via the `httpOnly` cookie).
3. **Ordering & State Machine (`/cart`, `/checkout`, `/orders`):**
   - Add items to cart, adjust quantities, proceed to checkout.
   - Submit order → confirm you receive an `AZ-000X` claim code and the `"PAY CASH AT THE COUNTER"` panel.
   - On **My Orders** (`/orders`), test cancelling an order while *Waiting*.
4. **Owner Dashboard (`/owner/orders`, `/owner/menu`):**
   - Log out and log in using your seeded owner credentials (`OWNER_EMAIL` / `OWNER_PASSWORD`).
   - Open `/owner/orders`: verify decrypted customer claim names/phones display, and test moving an order through `Accept → Processing` → `Mark Ready` → `Hand out → Completed`.
   - Open `/owner/menu`: test creating or editing an item, soft-retiring it, and restoring it.
5. **Security Presentation (`/demo`):**
   - Navigate slides (`←`/`→`, `Space`), press `S` to inspect the speaker script drawer, press `F` for fullscreen.
   - On Slide 12 (live playground), click **Encrypt →**, then **← Decrypt**, then **Corrupt 1 character** → **← Decrypt** and verify the server refuses with the tamper error message.

---

## Option B: Quick Demo via Cloudflare Tunnel (No Cloud Setup)

If you just want to share your local machine online temporarily for a live presentation without setting up Atlas, Railway, or Vercel:

1. Ensure MongoDB is running locally, seeded (`npm run seed`), and start both apps:
   ```bash
   npm run dev
   ```
2. In a second terminal, run:
   ```bash
   cloudflared tunnel --url http://localhost:5173
   ```
3. Share the printed `https://*.trycloudflare.com` URL. (`client/vite.config.js` already allows `.trycloudflare.com` hosts and proxies `/api` and `/uploads` to `:5000`). The tunnel closes as soon as you stop either terminal.

---

## Troubleshooting

| Symptom | Likely Cause & Fix |
|---|---|
| **Login succeeds, but refreshing logs you out (401 on `/api/auth/me`)** | Make sure `VITE_API_URL` is **not** set on Vercel and `vercel.json` is proxying `/api/:match*` to Railway. Cross-origin domains drop `sameSite: 'lax'` cookies. |
| **CORS error in browser console** | Verify `CLIENT_ORIGIN` on Railway matches your exact Vercel URL (`https://...` with no trailing slash). |
| **Railway crashes immediately on startup** | Check Railway **Deploy Logs**. `server/src/index.js` exits if `MONGO_URI`, `JWT_SECRET`, or `AES_KEY` is missing, or if `AES_KEY` is not 64 hex characters. |
| **MongoDB connection timeout on Railway** | In MongoDB Atlas → **Network Access**, confirm `0.0.0.0/0` is active, and double-check the password in `MONGO_URI`. |
| **404 when refreshing `/menu` or `/owner/orders` on Vercel** | Ensure `client/vercel.json` (with the `/(.*) -> /index.html` rewrite) is committed and Vercel's **Root Directory** is set to `client`. |
| **Owner-uploaded photos disappear after Railway redeploy** | Railway containers are ephemeral unless a **Volume** is mounted to `server/uploads`. Bundled photos in `client/public/menu/` are unaffected. |
