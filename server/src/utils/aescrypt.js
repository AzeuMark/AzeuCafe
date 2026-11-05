import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

/**
 * ★★★ AzeuCafe AESCrypt ★★★
 *
 * THE security file of the whole system. Every piece of personal data that
 * touches MongoDB (user names, phone numbers, order contact info) goes
 * through the two functions below — nothing else in the project is allowed
 * to encrypt or decrypt.
 *
 *   encrypt(text, key)  →  AES-256-GCM ciphertext
 *   decrypt(text, key)  →  original plaintext (or throws)
 *
 * Why GCM and not plain AES-CBC? GCM is *authenticated*: the ciphertext
 * carries an integrity tag, so if anyone touches one byte in the database,
 * decryption refuses to run. That is exactly the "tamper-proof" guarantee
 * shown in the security slideshow.
 *
 * Payload format: "v1.<ivB64>.<tagB64>.<ciphertextB64>"
 *   - iv  : fresh random 12 bytes per encryption (same name never encrypts
 *           to the same ciphertext twice)
 *   - tag : GCM auth tag proving integrity
 * The key itself lives ONLY in server/.env (AES_KEY) — never in the client.
 */

const VERSION = 'v1'

/** Validates the hex key and returns a 32-byte buffer. */
function parseKey(key) {
  const buf = Buffer.from(String(key ?? ''), 'hex')
  if (buf.length !== 32) {
    throw new Error('aescrypt: key must be 32 bytes, hex-encoded (64 hex characters)')
  }
  return buf
}

/**
 * Encrypt plaintext. Exact signature requested for this system:
 *   encrypt(text, key)
 * @param {string} text  plaintext (anything that can be String()-ed)
 * @param {string} key   32-byte hex key (AES_KEY from .env — never client-side)
 * @returns {string} "v1.<ivB64>.<tagB64>.<ciphertextB64>"
 */
export function encrypt(text, key) {
  const keyBuf = parseKey(key)
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', keyBuf, iv)
  const ciphertext = Buffer.concat([cipher.update(String(text), 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [VERSION, iv.toString('base64'), tag.toString('base64'), ciphertext.toString('base64')].join('.')
}

/**
 * Decrypt a payload produced by encrypt(). Exact signature:
 *   decrypt(text, key)
 * @param {string} text  payload string ("v1.<iv>.<tag>.<cipher>")
 * @param {string} key   32-byte hex key
 * @returns {string} original plaintext
 * @throws when the key is wrong, the format is unknown, or the ciphertext
 *         was tampered with (auth tag mismatch) — never returns garbage.
 */
export function decrypt(text, key) {
  const parts = String(text ?? '').split('.')
  if (parts.length !== 4 || parts[0] !== VERSION) {
    throw new Error('aescrypt: unrecognized payload format')
  }
  const keyBuf = parseKey(key)
  const tag = Buffer.from(parts[2], 'base64')
  const iv = Buffer.from(parts[1], 'base64')
  const ciphertext = Buffer.from(parts[3], 'base64')
  const decipher = createDecipheriv('aes-256-gcm', keyBuf, iv)
  decipher.setAuthTag(tag)
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]) // throws on tamper
  return plaintext.toString('utf8')
}

/**
 * Decrypt without ever crashing a request: empty stays empty, and a value
 * encrypted under a different/lost key surfaces as a readable marker
 * instead of breaking the page.
 */
export function safeDecrypt(payload, key = process.env.AES_KEY) {
  if (!payload) return ''
  try {
    return decrypt(payload, key)
  } catch {
    return '[unreadable — wrong key or tampered]'
  }
}

export const AESCRYPT_ALGORITHM = 'AES-256-GCM'
export const AESCRYPT_VERSION = VERSION
