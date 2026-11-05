/** 404 for unknown API paths. */
export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
}

/** Central error responder — uniform { message } bodies everywhere. */
export function errorHandler(err, _req, res, _next) {
  if (err?.code === 'LIMIT_FILE_SIZE') {
    err.message = 'Photo is too large (max 5 MB).'
  }
  let status = err?.status ?? 500
  if (err?.name === 'ValidationError') status = 400
  if (status >= 500) console.error('[AzeuCafe error]', err)
  res.status(status).json({ message: err?.message ?? 'Something went wrong.' })
}
