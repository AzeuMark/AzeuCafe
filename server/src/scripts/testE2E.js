/**
 * Comprehensive E2E test script for AzeuCafe
 * Tests:
 * 1. Health check
 * 2. Auth: Register (AES encrypted name/phone, bcrypt password, forced role user)
 * 3. Auth: Login (user + owner), Logout, /me session
 * 4. Menu: List public (no retired), list owner (all)
 * 5. Menu: Owner Create, Update, Soft-Retire, Restore, Upload
 * 6. Orders: User creates order (server-side calculation, AES contact snapshot)
 * 7. Orders: My orders & Owner orders dashboard
 * 8. Orders: State machine enforcement (TRANSITIONS matrix, illegal moves blocked)
 * 9. Security: Real demo-encrypt, demo-decrypt, tamper rejection
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import http from 'node:http'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
dotenv.config()
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'

import { connectDB } from '../config/db.js'
import authRoutes from '../routes/auth.routes.js'
import menuRoutes from '../routes/menu.routes.js'
import orderRoutes from '../routes/orders.routes.js'
import securityRoutes from '../routes/security.routes.js'
import { notFound, errorHandler } from '../middleware/error.middleware.js'
import { decrypt, safeDecrypt } from '../utils/aescrypt.js'
import User from '../models/user.model.js'
import Order from '../models/order.model.js'
import MenuItem from '../models/menuItem.model.js'

const KEY = process.env.AES_KEY

async function runTests() {
  console.log('--- Starting AzeuCafe E2E Test Suite ---')
  await connectDB()

  const app = express()
  app.use(cors({ origin: true, credentials: true }))
  app.use(express.json())
  app.use(cookieParser())

  const uploadsDir = path.resolve(import.meta.dirname, '../../uploads')
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

  const server = http.createServer(app)
  await new Promise((resolve) => server.listen(5099, resolve))
  const baseUrl = 'http://127.0.0.1:5099/api'

  let cookieJar = {
    user: '',
    owner: '',
  }

  async function api(path, { method = 'GET', body, role, formData } = {}) {
    const headers = {}
    if (body) headers['Content-Type'] = 'application/json'
    if (role && cookieJar[role]) headers['Cookie'] = cookieJar[role]
    if (formData) {
      // Use standard fetch body for FormData
    }

    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: formData ? (role ? { Cookie: cookieJar[role] } : {}) : headers,
      body: formData ? formData : body ? JSON.stringify(body) : undefined,
    })

    const setCookie = res.headers.get('set-cookie')
    if (setCookie && role) {
      cookieJar[role] = setCookie.split(';')[0]
    }

    let json = null
    try {
      json = await res.json()
    } catch {
      // empty
    }
    return { status: res.status, ok: res.ok, data: json }
  }

  let passed = 0
  let failed = 0

  function assert(condition, message) {
    if (condition) {
      passed++
      console.log(`  ✓ PASS: ${message}`)
    } else {
      failed++
      console.error(`  ✗ FAIL: ${message}`)
    }
  }

  try {
    // 1. Health check
    console.log('\n[1] Health Check')
    const health = await api('/health')
    assert(health.status === 200 && health.data?.ok === true, 'GET /api/health responds with ok: true')

    // 2. Auth: Register
    console.log('\n[2] Auth: Registration')
    const testEmail = `testuser_${Date.now()}@example.com`
    const regRes = await api('/auth/register', {
      method: 'POST',
      body: {
        name: 'Maria Clara',
        email: testEmail,
        phone: '09181234567',
        password: 'password123',
      },
      role: 'user',
    })
    assert(regRes.status === 201, 'POST /api/auth/register returns 201')
    assert(regRes.data?.user?.name === 'Maria Clara', 'Returned user name is decrypted')
    assert(regRes.data?.user?.role === 'user', 'Returned user role is locked to "user"')

    // Verify DB stored ciphertext
    const rawUser = await User.findOne({ email: testEmail })
    assert(rawUser.name.startsWith('v1.'), 'User name in DB is AES-256-GCM ciphertext')
    assert(rawUser.phone.startsWith('v1.'), 'User phone in DB is AES-256-GCM ciphertext')
    assert(decrypt(rawUser.name, KEY) === 'Maria Clara', 'Decrypted raw user name matches original')

    // 3. Auth: Login & Me
    console.log('\n[3] Auth: Login & Session')
    const loginUser = await api('/auth/login', {
      method: 'POST',
      body: { email: testEmail, password: 'password123' },
      role: 'user',
    })
    assert(loginUser.status === 200 && loginUser.data?.user?.email === testEmail, 'User login succeeds')

    const meRes = await api('/auth/me', { role: 'user' })
    assert(meRes.status === 200 && meRes.data?.user?.email === testEmail, 'GET /auth/me returns logged-in user profile')

    const ownerEmail = process.env.OWNER_EMAIL || 'owner'
    const ownerPass = process.env.OWNER_PASSWORD || 'owner123'
    const loginOwner = await api('/auth/login', {
      method: 'POST',
      body: { email: ownerEmail, password: ownerPass },
      role: 'owner',
    })
    assert(loginOwner.status === 200 && loginOwner.data?.user?.role === 'owner', 'Owner login succeeds')

    // 4. Menu: List
    console.log('\n[4] Menu: Browsing')
    const publicMenu = await api('/menu')
    assert(publicMenu.status === 200 && Array.isArray(publicMenu.data?.items), 'GET /api/menu returns items array')
    assert(publicMenu.data.items.length >= 12, 'Menu has at least 12 active items')

    const ownerMenu = await api('/menu/all', { role: 'owner' })
    assert(ownerMenu.status === 200 && Array.isArray(ownerMenu.data?.items), 'GET /api/menu/all accessible by owner')

    // 5. Menu CRUD
    console.log('\n[5] Menu: Owner CRUD & Soft-Retire')
    const createItem = await api('/menu', {
      method: 'POST',
      role: 'owner',
      body: {
        name: 'Special Hazelnut Macchiato',
        description: 'Rich espresso with roasted hazelnut syrup',
        category: 'espresso-drinks',
        price: 175,
        image: { type: 'library', path: '/menu/cappuccino.jpg' },
      },
    })
    assert(createItem.status === 201, 'Owner can create menu item')
    const newItemId = createItem.data?.item?.id

    const updateItem = await api(`/menu/${newItemId}`, {
      method: 'PATCH',
      role: 'owner',
      body: { price: 185 },
    })
    assert(updateItem.status === 200 && updateItem.data?.item?.price === 185, 'Owner can update item price')

    const retireItem = await api(`/menu/${newItemId}`, {
      method: 'DELETE',
      role: 'owner',
    })
    assert(retireItem.status === 200 && retireItem.data?.item?.retired === true, 'Owner can soft-retire item')

    const checkPublic = await api('/menu')
    const foundInPublic = checkPublic.data.items.some((it) => it.id === newItemId)
    assert(!foundInPublic, 'Retired item is hidden from public menu')

    const restoreItem = await api(`/menu/${newItemId}`, {
      method: 'PATCH',
      role: 'owner',
      body: { retired: false },
    })
    assert(restoreItem.status === 200 && restoreItem.data?.item?.retired === false, 'Owner can restore retired item')

    // Clean up created item
    await MenuItem.findByIdAndDelete(newItemId)

    // 6. Orders: Placement & Server-side calculation
    console.log('\n[6] Orders: Creation & Pricing Calculation')
    const sampleItems = publicMenu.data.items.slice(0, 2)
    const expectedTotal = sampleItems[0].price * 2 + sampleItems[1].price * 1

    const orderRes = await api('/orders', {
      method: 'POST',
      role: 'user',
      body: {
        items: [
          { id: sampleItems[0].id, qty: 2 },
          { id: sampleItems[1].id, qty: 1 },
        ],
        contact: { name: 'Maria Claiming', phone: '09189998888' },
        note: 'Extra napkin please',
      },
    })
    assert(orderRes.status === 201, 'User can place order')
    assert(orderRes.data?.order?.total === expectedTotal, `Server accurately computes total (₱${expectedTotal}) from DB prices`)
    assert(orderRes.data?.order?.orderCode?.startsWith('AZ-'), 'Order code generated in AZ-XXXX format')
    assert(orderRes.data?.order?.status === 'waiting', 'Initial status is "waiting"')

    const placedOrderId = orderRes.data?.order?.id

    // Check DB encryption of contact
    const rawOrder = await Order.findById(placedOrderId)
    assert(rawOrder.contact.name.startsWith('v1.'), 'Order contact name in DB is encrypted with AES-256-GCM')
    assert(rawOrder.contact.phone.startsWith('v1.'), 'Order contact phone in DB is encrypted with AES-256-GCM')
    assert(decrypt(rawOrder.contact.name, KEY) === 'Maria Claiming', 'Decrypted contact name matches')

    // 7. Orders: My Orders & Dashboard
    console.log('\n[7] Orders: View lists')
    const myOrdersRes = await api('/orders/mine', { role: 'user' })
    assert(myOrdersRes.status === 200 && myOrdersRes.data.orders.some((o) => o.id === placedOrderId), 'Order appears in user\'s /orders/mine')

    const allOrdersRes = await api('/orders', { role: 'owner' })
    assert(allOrdersRes.status === 200 && allOrdersRes.data.orders.some((o) => o.id === placedOrderId), 'Order appears on owner\'s /orders dashboard')

    // 8. Orders: State Machine Transitions
    console.log('\n[8] Orders: State Machine Enforcement')
    // Owner moves waiting -> processing
    const acceptRes = await api(`/orders/${placedOrderId}/status`, {
      method: 'PATCH',
      role: 'owner',
      body: { status: 'processing' },
    })
    assert(acceptRes.status === 200 && acceptRes.data.order.status === 'processing', 'Owner can accept order (waiting -> processing)')

    // User tries to cancel while processing -> MUST BE REJECTED 403
    const userCancelRes = await api(`/orders/${placedOrderId}/status`, {
      method: 'PATCH',
      role: 'user',
      body: { status: 'cancelled' },
    })
    assert(userCancelRes.status === 403, 'User CANNOT cancel order while processing (enforces 403 rule)')

    // Owner moves processing -> ready
    const readyRes = await api(`/orders/${placedOrderId}/status`, {
      method: 'PATCH',
      role: 'owner',
      body: { status: 'ready' },
    })
    assert(readyRes.status === 200 && readyRes.data.order.status === 'ready', 'Owner marks order ready (processing -> ready)')

    // User marks order completed
    const completeRes = await api(`/orders/${placedOrderId}/status`, {
      method: 'PATCH',
      role: 'user',
      body: { status: 'completed' },
    })
    assert(completeRes.status === 200 && completeRes.data.order.status === 'completed', 'User marks order completed (ready -> completed)')

    // Terminal check: cannot move completed order
    const illegalRes = await api(`/orders/${placedOrderId}/status`, {
      method: 'PATCH',
      role: 'owner',
      body: { status: 'waiting' },
    })
    assert(illegalRes.status === 409, 'Terminal completed order rejects any further transition (409 Conflict)')

    // Clean up created user and order
    await User.findByIdAndDelete(rawUser._id)
    await Order.findByIdAndDelete(placedOrderId)

    // 9. Security Endpoints (Playground)
    console.log('\n[9] Security Playground')
    const encRes = await api('/security/demo-encrypt', {
      method: 'POST',
      body: { text: 'AzeuCafe Security Test 2026' },
    })
    assert(encRes.status === 200 && encRes.data?.cipher?.startsWith('v1.'), 'POST /api/security/demo-encrypt encrypts text to v1 payload')

    const cleanCipher = encRes.data.cipher
    const decRes = await api('/security/demo-decrypt', {
      method: 'POST',
      body: { cipher: cleanCipher },
    })
    assert(decRes.status === 200 && decRes.data?.text === 'AzeuCafe Security Test 2026', 'POST /api/security/demo-decrypt decodes back to original text')

    // Corrupt one character
    const parts = cleanCipher.split('.')
    const last = parts[3]
    const corruptedLast = (last.slice(0, -2) + (last.endsWith('A') ? 'B' : 'A'))
    const tamperedCipher = [parts[0], parts[1], parts[2], corruptedLast].join('.')

    const tamperRes = await api('/security/demo-decrypt', {
      method: 'POST',
      body: { cipher: tamperedCipher },
    })
    assert(tamperRes.status === 400 && tamperRes.data?.message?.includes('refused'), 'POST /api/security/demo-decrypt refuses corrupted ciphertext with 400')

  } finally {
    server.close()
    await mongoose.disconnect()
  }

  console.log(`\n==================================`)
  console.log(`TOTAL: ${passed} passed, ${failed} failed`)
  console.log(`==================================`)
  process.exit(failed === 0 ? 0 : 1)
}

runTests().catch((err) => {
  console.error('Test runner failed:', err)
  process.exit(1)
})
