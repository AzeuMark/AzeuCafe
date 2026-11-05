import path from 'node:path'
import { fileURLToPath } from 'node:url'
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import menuRoutes from './routes/menu.routes.js'
import orderRoutes from './routes/orders.routes.js'
import securityRoutes from './routes/security.routes.js'
import { notFound, errorHandler } from './middleware/error.middleware.js'

// Guard the required secrets BEFORE anything else starts.
const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET', 'AES_KEY']
const missing = REQUIRED_ENV.filter((key) => !process.env[key])
if (missing.length > 0) {
  console.error(`Missing required env vars in server/.env: ${missing.join(', ')}`)
  process.exit(1)
}

const app = express()
const ALLOWED_ORIGINS = (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173').split(',')

app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }))
app.use(express.json())
app.use(cookieParser())

// Owner-uploaded item photos live on disk (server/uploads) and are served at /uploads/*
const uploadsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../uploads')
app.use('/uploads', express.static(uploadsDir))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'AzeuCafe API', time: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/security', securityRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`☕ AzeuCafe API listening on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Startup aborted:', err.message)
    process.exit(1)
  })
