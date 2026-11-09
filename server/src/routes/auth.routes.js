import { Router } from 'express'
import * as auth from '../controllers/auth.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/register', auth.register)
router.post('/login', auth.login)
router.post('/logout', auth.logout)
router.get('/me', requireAuth, auth.me)

export default router
