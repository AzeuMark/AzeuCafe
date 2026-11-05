import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

const ALLOWED_ORIGINS = (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173').split(',')

app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }))
app.use(express.json())
app.use(cookieParser())

// Phase 1 will mount: /api/auth, /api/menu (+ /uploads static), /api/orders, /api/security
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'AzeuCafe API', time: new Date().toISOString() })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`☕ AzeuCafe API listening on http://localhost:${PORT}`)
})
