import { Router } from 'express'
import * as orders from '../controllers/orders.controller.js'
import { requireAuth, requireOwner } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/', requireAuth, orders.createOrder)       // any logged-in user
router.get('/mine', requireAuth, orders.myOrders)       // any logged-in user
router.get('/', requireAuth, requireOwner, orders.allOrders)              // owner
router.patch('/:id/status', requireAuth, orders.updateOrderStatus)        // role matrix inside

export default router
