import mongoose from 'mongoose'
import { safeDecrypt } from '../utils/aescrypt.js'

export const ORDER_STATUSES = ['waiting', 'processing', 'ready', 'completed', 'cancelled']

/*
 * Order lifecycle (confirmed spec, server-plan.md §3):
 *   waiting → processing → ready → completed
 *      ↘ cancelled (rules differ per role)
 * Every status change is pushed into `history` so the owner dashboard can
 * show the full timeline during the demo.
 */
const orderItemSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name: { type: String, required: true },   // snapshot — survives menu edits
    price: { type: Number, required: true, min: 0 }, // snapshot — survives price changes
    image: { type: String, default: '' },     // snapshot of the item photo path
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: { type: [orderItemSchema], validate: (v) => Array.isArray(v) && v.length > 0 },
    total: { type: Number, required: true, min: 0 }, // computed SERVER-SIDE from DB prices
    note: { type: String, default: '', maxlength: 500 },
    contact: {
      // AES-encrypted snapshots — ciphertext in the DB, see server-plan.md
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'waiting',
      index: true,
    },
    history: [
      {
        status: { type: String, enum: ORDER_STATUSES },
        at: { type: Date, default: Date.now },
        by: { type: String, enum: ['user', 'owner'] },
      },
    ],
  },
  { timestamps: true },
)

/** Shape for the customer who owns this order. */
orderSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    orderCode: this.orderCode,
    items: this.items.map((it) => ({
      id: it.item?.toString?.() ?? String(it.item),
      name: it.name,
      price: it.price,
      image: it.image,
      qty: it.qty,
    })),
    total: this.total,
    note: this.note,
    // contact came in encrypted; decrypt for display to the owner/holder
    contact: {
      name: safeDecrypt(this.contact?.name),
      phone: safeDecrypt(this.contact?.phone),
    },
    status: this.status,
    history: this.history,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

/** Shape for the Owner dashboard — adds who placed the order. */
orderSchema.methods.toOwnerJSON = function toOwnerJSON() {
  const base = this.toPublicJSON()
  base.user = {
    id: String(this.user?._id ?? this.user ?? ''),
    name: safeDecrypt(this.user?.name ?? ''),
    email: this.user?.email ?? '',
  }
  return base
}

export default mongoose.model('Order', orderSchema)
