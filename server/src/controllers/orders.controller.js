import Order from '../models/order.model.js'
import MenuItem from '../models/menuItem.model.js'
import { encrypt } from '../utils/aescrypt.js'
import { nextOrderCode } from '../utils/orderCode.js'

const KEY = () => process.env.AES_KEY

function httpError(status, message) {
  const err = new Error(message)
  err.status = status
  return err
}

const round2 = (n) => Math.round(n * 100) / 100

/**
 * POST /api/orders — a logged-in user converts a cart into an order.
 *
 * TRUST RULE (the whole point): the client only ever sends item IDs +
 * quantities. Names, prices and the total come from OUR database, and the
 * customer contact info is AES-encrypted before it is stored.
 */
export async function createOrder(req, res, next) {
  try {
    const rawItems = Array.isArray(req.body?.items) ? req.body.items : []
    if (!rawItems.length) throw httpError(400, 'Your cart is empty.')

    const wanted = rawItems.slice(0, 50).map((it) => ({
      id: String(it?.id ?? ''),
      qty: Number(it?.qty),
    }))
    const valid = wanted.filter(
      (w) => w.id && Number.isInteger(w.qty) && w.qty >= 1 && w.qty <= 50,
    )
    if (valid.length !== wanted.length) {
      throw httpError(400, 'Cart contains an invalid item or quantity (qty must be 1–50).')
    }

    const docMap = new Map()
    const docs = await MenuItem.find({ _id: { $in: valid.map((w) => w.id) }, retired: false })
    for (const doc of docs) docMap.set(doc._id.toString(), doc)
    if (docs.length !== valid.length) {
      throw httpError(400, 'Some items are no longer available — please refresh your cart.')
    }

    const items = valid.map((w) => {
      const doc = docMap.get(w.id)
      return {
        item: doc._id,
        name: doc.name,          // snapshot? YES — menu edits never rewrite history
        price: doc.price,        // snapshot from OUR db, not from the browser
        image: doc.image?.path ?? '',
        qty: w.qty,
      }
    })
    const total = round2(items.reduce((sum, it) => sum + it.price * it.qty, 0))

    // Contact snapshot: checkout fields win, else the user's own profile.
    const profile = req.user.contactSnapshot()
    const contactName = (String(req.body?.contact?.name ?? '').trim() || profile.name).trim()
    const contactPhone = (String(req.body?.contact?.phone ?? '').trim() || profile.phone).trim()
    const note = String(req.body?.note ?? '').trim().slice(0, 500)

    let order = null
    for (let attempt = 0; attempt < 3 && !order; attempt += 1) {
      try {
        order = await Order.create({
          orderCode: nextOrderCode(await Order.countDocuments() + 1),
          user: req.user._id,
          items,
          total,
          note,
          contact: {
            name: contactName ? encrypt(contactName, KEY()) : '',   // 🔐 AES
            phone: contactPhone ? encrypt(contactPhone, KEY()) : '', // 🔐 AES
          },
          status: 'waiting',
          history: [{ status: 'waiting', by: 'user' }],
        })
      } catch (err) {
        if (err?.code === 11000) continue // orderCode race — recompute and retry
        throw err
      }
    }
    if (!order) throw httpError(500, 'Could not allocate an order code — please retry.')

    res.status(201).json({ order: order.toPublicJSON() })
  } catch (err) {
    next(err)
  }
}

/** GET /api/orders/mine — the user's own order history. */
export async function myOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json({ orders: orders.map((o) => o.toPublicJSON()) })
  } catch (err) {
    next(err)
  }
}

/** GET /api/orders — owner dashboard (optional ?status= filter). */
export async function allOrders(req, res, next) {
  try {
    const filter = {}
    const status = req.query.status
    if (status) {
      if (!['waiting', 'processing', 'ready', 'completed', 'cancelled'].includes(status)) {
        throw httpError(400, 'Unknown status filter.')
      }
      filter.status = status
    }
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
    res.json({ orders: orders.map((o) => o.toOwnerJSON()) })
  } catch (err) {
    next(err)
  }
}

/*
 * PATCH /api/orders/:id/status — the state machine from server-plan.md §3:
 *
 *   waiting    → owner: processing | cancelled · user(own): cancelled
 *   processing → owner: ready | cancelled     · user: — (must ask owner)
 *   ready      → owner/user(own): completed
 *   completed / cancelled → terminal
 */
const TRANSITIONS = {
  waiting: { owner: ['processing', 'cancelled'], user: ['cancelled'] },
  processing: { owner: ['ready', 'cancelled'], user: [] },
  ready: { owner: ['completed'], user: ['completed'] },
  completed: { owner: [], user: [] },
  cancelled: { owner: [], user: [] },
}

export async function updateOrderStatus(req, res, next) {
  try {
    const target = String(req.body?.status ?? '')
    const order = await Order.findById(req.params.id)
    if (!order) throw httpError(404, 'Order not found.')

    const isOwner = req.user.role === 'owner'
    const isMine = String(order.user) === String(req.user._id)
    if (!isOwner && !isMine) {
      throw httpError(403, 'You can only act on your own orders.')
    }

    const actor = isOwner ? 'owner' : 'user'
    const legal = TRANSITIONS[order.status]?.[actor] ?? []
    if (!legal.includes(target)) {
      if (!isOwner && order.status === 'processing') {
        throw httpError(403, 'Orders can no longer be cancelled while processing — please ask the owner.')
      }
      throw httpError(409, `You cannot move this order from "${order.status}" to "${target || '?'}".`)
    }

    order.status = target
    order.history.push({ status: target, at: new Date(), by: actor })
    await order.save()

    if (isOwner && order.user && !order.user?.email) {
      await order.populate('user', 'name email')
    }
    res.json({ order: isOwner ? order.toOwnerJSON() : order.toPublicJSON() })
  } catch (err) {
    next(err)
  }
}
