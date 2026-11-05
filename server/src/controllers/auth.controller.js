import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import { encrypt } from '../utils/aescrypt.js'

const KEY = () => process.env.AES_KEY
const COOKIE_OPTS = { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 7 * 24 * 60 * 60 * 1000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function httpError(status, message) {
  const err = new Error(message)
  err.status = status
  return err
}

function issueToken(res, user) {
  const token = jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  )
  res.cookie('token', token, COOKIE_OPTS)
}

/**
 * POST /api/auth/register
 * Role is LOCKED to 'user' here on purpose — the Owner account only comes
 * from the seed script. `name` and `phone` are encrypted BEFORE storage.
 */
export async function register(req, res, next) {
  try {
    const name = String(req.body?.name ?? '').trim()
    const email = String(req.body?.email ?? '').trim().toLowerCase()
    const phone = String(req.body?.phone ?? '').replace(/[\s\-()]/g, '')
    const password = String(req.body?.password ?? '')

    if (!name) throw httpError(400, 'Name is required.')
    if (name.length > 80) throw httpError(400, 'Name is too long (max 80).')
    if (!EMAIL_RE.test(email)) throw httpError(400, 'Enter a valid email address.')
    if (password.length < 6) throw httpError(400, 'Password must be at least 6 characters.')
    if (phone && (phone.replace(/\D/g, '').length < 7 || phone.replace(/\D/g, '').length > 15)) {
      throw httpError(400, 'Phone number looks wrong (7–15 digits).')
    }

    const exists = await User.findOne({ email })
    if (exists) throw httpError(409, 'That email is already registered.')

    const user = await User.create({
      name: encrypt(name, KEY()),                     // 🔐 AES-256-GCM
      email,                                          // plaintext — login lookup field
      phone: phone ? encrypt(phone, KEY()) : '',      // 🔐 AES-256-GCM
      password: await bcrypt.hash(password, 10),      // bcrypt — one-way, by design
      role: 'user',
    })

    issueToken(res, user)
    res.status(201).json({ user: user.toPublicJSON() })
  } catch (err) {
    next(err)
  }
}

/** POST /api/auth/login */
export async function login(req, res, next) {
  try {
    const email = String(req.body?.email ?? '').trim().toLowerCase()
    const password = String(req.body?.password ?? '')

    const user = await User.findOne({ email })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw httpError(401, 'Invalid email or password.')
    }

    issueToken(res, user)
    res.json({ user: user.toPublicJSON() })
  } catch (err) {
    next(err)
  }
}

/** POST /api/auth/logout */
export function logout(req, res) {
  res.clearCookie('token', { path: '/' })
  res.json({ message: 'Logged out.' })
}

/** GET /api/auth/me */
export function me(req, res) {
  res.json({ user: req.user.toPublicJSON() })
}
