import mongoose from 'mongoose'

export const MENU_CATEGORIES = ['espresso-drinks', 'iced-drinks', 'pastries', 'snacks']

/**
 * MenuItem — one cafe product. `image` supports all three Owner sources:
 *   library → bundled photo in client/public/menu (offline-safe)
 *   upload  → file the Owner uploaded, stored at server/uploads (/uploads/...)
 *   url     → external image link pasted by the Owner
 * `retired` is the soft delete: hidden from the menu, never hard-deleted,
 * because old orders point at snapshots (name/price) and must stay intact.
 */
const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, default: '', maxlength: 300 },
    category: {
      type: String,
      enum: MENU_CATEGORIES,
      default: 'espresso-drinks',
      index: true,
    },
    price: { type: Number, required: true, min: 0 },
    image: {
      type: { type: String, enum: ['library', 'upload', 'url'], default: 'library' },
      path: { type: String, default: '' },
    },
    retired: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
)

/** Flat shape the client consumes everywhere (menu list, cart, order snapshot). */
menuItemSchema.methods.toCard = function toCard() {
  return {
    id: this._id.toString(),
    name: this.name,
    description: this.description,
    category: this.category,
    price: this.price,
    image: { type: this.image?.type ?? 'library', path: this.image?.path ?? '' },
    retired: this.retired,
    createdAt: this.createdAt,
  }
}

export default mongoose.model('MenuItem', menuItemSchema)
