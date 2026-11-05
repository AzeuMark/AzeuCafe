import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

/** Reads the httpOnly JWT cookie; attaches the user doc or rejects. */
export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token
    if (!token) {
      return res.status(401).json({ message: 'Please log in first.' })
    }
    let payload
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET)
    } catch {
      return res.status(401).json({ message: 'Session expired or invalid — please log in again.' })
    }
    const user = await User.findById(payload.sub)
    if (!user) {
      return res.status(401).json({ message: 'Session no longer valid — please log in again.' })
    }
    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

/** Role gate — Owner-only endpoints. */
export function requireOwner(req, res, next) {
  if (req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Owner access only.' })
  }
  next()
}
