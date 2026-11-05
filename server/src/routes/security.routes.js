import { Router } from 'express'
import * as security from '../controllers/security.controller.js'

const router = Router()

// Public BY DESIGN: these power the slideshow EncryptPlayground (Act 3).
router.post('/demo-encrypt', security.demoEncrypt)
router.post('/demo-decrypt', security.demoDecrypt)

export default router
