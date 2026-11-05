import crypto from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import multer from 'multer'
import { Router } from 'express'
import * as menu from '../controllers/menu.controller.js'
import { requireAuth, requireOwner } from '../middleware/auth.middleware.js'

const router = Router()

/** server/uploads — Owner-uploaded photos, served statically as /uploads/* */
const uploadsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../uploads')

const EXT_BY_MIME = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' }

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (_req, file, cb) =>
      cb(
        null,
        `item-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${
          EXT_BY_MIME[file.mimetype] ?? path.extname(file.originalname) ?? '.bin'
        }`,
      ),
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) =>
    EXT_BY_MIME[file.mimetype]
      ? cb(null, true)
      : cb(Object.assign(new Error('Only JPG, PNG or WebP images are allowed.'), { status: 400 })),
})

router.get('/', menu.listMenu)                                        // public
router.get('/all', requireAuth, requireOwner, menu.listAllMenu)       // owner
router.post('/', requireAuth, requireOwner, menu.createMenuItem)      // owner
router.patch('/:id', requireAuth, requireOwner, menu.updateMenuItem)  // owner
router.delete('/:id', requireAuth, requireOwner, menu.retireMenuItem) // owner (soft)
router.post('/upload', requireAuth, requireOwner, upload.single('photo'), menu.uploadPhoto) // owner

export default router
