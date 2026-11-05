import MenuItem, { MENU_CATEGORIES } from '../models/menuItem.model.js'

function httpError(status, message) {
  const err = new Error(message)
  err.status = status
  return err
}

/** Validates + normalizes the 3-way image payload (library/upload/url). */
function normalizeImage(input) {
  if (input === undefined) return { type: 'library', path: '' }
  if (input === null || typeof input !== 'object') throw httpError(400, 'Photo must be an object { type, path }.')
  const type = input.type
  const path = String(input.path ?? '').trim()
  if (!['library', 'upload', 'url'].includes(type)) throw httpError(400, 'Photo type must be library, upload or url.')
  if (type === 'url' && !/^https?:\/\//i.test(path)) throw httpError(400, 'URL photos must start with http(s)://.')
  if (type !== 'url' && !path.startsWith('/')) throw httpError(400, 'Photo path must be an app path starting with "/".')
  return { type, path }
}

/** GET /api/menu — public, hides retired items. */
export async function listMenu(_req, res, next) {
  try {
    const items = await MenuItem.find({ retired: false }).sort({ category: 1, createdAt: 1 })
    res.json({ items: items.map((it) => it.toCard()) })
  } catch (err) {
    next(err)
  }
}

/** GET /api/menu/all — owner view, includes retired items. */
export async function listAllMenu(_req, res, next) {
  try {
    const items = await MenuItem.find({}).sort({ category: 1, createdAt: 1 })
    res.json({ items: items.map((it) => it.toCard()) })
  } catch (err) {
    next(err)
  }
}

/** POST /api/menu — owner creates an item. */
export async function createMenuItem(req, res, next) {
  try {
    const name = String(req.body?.name ?? '').trim()
    if (!name) throw httpError(400, 'Item name is required.')
    const price = Number(req.body?.price)
    if (!Number.isFinite(price) || price < 0) throw httpError(400, 'Price must be a number ≥ 0.')
    const category = String(req.body?.category ?? 'espresso-drinks')
    if (!MENU_CATEGORIES.includes(category)) throw httpError(400, `Category must be one of: ${MENU_CATEGORIES.join(', ')}.`)

    const item = await MenuItem.create({
      name,
      description: String(req.body?.description ?? '').trim(),
      category,
      price,
      image: normalizeImage(req.body?.image),
    })
    res.status(201).json({ item: item.toCard() })
  } catch (err) {
    next(err)
  }
}

/** PATCH /api/menu/:id — owner edits fields, swaps photo, or un-retires. */
export async function updateMenuItem(req, res, next) {
  try {
    const item = await MenuItem.findById(req.params.id)
    if (!item) throw httpError(404, 'Menu item not found.')

    if (req.body?.name !== undefined) {
      const name = String(req.body.name).trim()
      if (!name) throw httpError(400, 'Item name is required.')
      item.name = name
    }
    if (req.body?.description !== undefined) item.description = String(req.body.description).trim()
    if (req.body?.category !== undefined) {
      const category = String(req.body.category)
      if (!MENU_CATEGORIES.includes(category)) throw httpError(400, `Category must be one of: ${MENU_CATEGORIES.join(', ')}.`)
      item.category = category
    }
    if (req.body?.price !== undefined) {
      const price = Number(req.body.price)
      if (!Number.isFinite(price) || price < 0) throw httpError(400, 'Price must be a number ≥ 0.')
      item.price = price
    }
    if (req.body?.image !== undefined) item.image = normalizeImage(req.body.image)
    if (req.body?.retired !== undefined) item.retired = Boolean(req.body.retired)

    await item.save()
    res.json({ item: item.toCard() })
  } catch (err) {
    next(err)
  }
}

/** DELETE /api/menu/:id — SOFT retire only (order history safety). */
export async function retireMenuItem(req, res, next) {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { retired: true },
      { new: true },
    )
    if (!item) throw httpError(404, 'Menu item not found.')
    res.json({ item: item.toCard(), message: 'Item retired from the menu.' })
  } catch (err) {
    next(err)
  }
}

/** POST /api/menu/upload — multer already stored the file; answer the client. */
export function uploadPhoto(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'No photo received.' })
  }
  res.status(201).json({ path: `/uploads/${req.file.filename}` })
}
