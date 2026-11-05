import mongoose from 'mongoose'
import { safeDecrypt } from '../utils/aescrypt.js'

/**
 * User — one document per account.
 *
 * SECURITY NOTES (read this before the report):
 * - `name` and `phone` are AES-256-GCM ENCRYPTED before they are stored.
 *   The database literally holds "v1.<iv>.<tag>.<cipher>" strings.
 * - `password` is a bcrypt HASH (one-way). It is NOT encrypted with AES on
 *   purpose: AES is reversible, and a reversible password store would be
 *   a design mistake, not a feature.
 * - `email` stays plaintext because login looks users up by it. Encrypting
 *   the lookup field with random IVs would make login impossible without
 *   extra machinery (out of scope for a basic school system).
 */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },         // AES ciphertext
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },                                              // plaintext (login lookup)
    phone: { type: String, default: '' },           // AES ciphertext ('' if none)
    password: { type: String, required: true },     // bcrypt hash
    role: { type: String, enum: ['user', 'owner'], default: 'user' },
  },
  { timestamps: true },
)

/** API response shape: contact fields decrypted back to readable text. */
userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    name: safeDecrypt(this.name),
    email: this.email,
    phone: safeDecrypt(this.phone),
    role: this.role,
    createdAt: this.createdAt,
  }
}

/** Decrypted contact info used to snapshot onto a new order. */
userSchema.methods.contactSnapshot = function contactSnapshot() {
  return { name: safeDecrypt(this.name), phone: safeDecrypt(this.phone) }
}

export default mongoose.model('User', userSchema)
