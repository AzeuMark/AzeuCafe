import { encrypt, decrypt, AESCRYPT_ALGORITHM } from '../utils/aescrypt.js'

const KEY = () => process.env.AES_KEY

/**
 * Public endpoints used ONLY by the security slideshow (Act 3 playground).
 * They call the real encrypt()/decrypt() from server/src/utils/aescrypt.js
 * so the class sees the system's actual security code working live.
 */

/** POST /api/security/demo-encrypt { text } → { cipher } */
export function demoEncrypt(req, res, next) {
  try {
    const text = String(req.body?.text ?? '')
    if (!text.trim()) {
      return res.status(400).json({ message: 'Type something to encrypt first.' })
    }
    if (text.length > 500) {
      return res.status(400).json({ message: 'Keep the demo text under 500 characters.' })
    }
    res.json({
      cipher: encrypt(text, KEY()),
      algorithm: AESCRYPT_ALGORITHM,
      file: 'server/src/utils/aescrypt.js',
    })
  } catch (err) {
    next(err)
  }
}

/** POST /api/security/demo-decrypt { cipher } → { text } */
export function demoDecrypt(req, res, next) {
  try {
    const cipher = String(req.body?.cipher ?? '')
    try {
      res.json({ text: decrypt(cipher, KEY()) })
    } catch {
      res.status(400).json({
        message: 'Decryption failed — wrong key or the ciphertext was tampered with.',
      })
    }
  } catch (err) {
    next(err)
  }
}
