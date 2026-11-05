/** Thin fetch wrapper for the AzeuCafe API. Every request carries the session cookie. */

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, { method = 'GET', body, form, signal } = {}) {
  const headers =
    form
      ? undefined // let the browser set multipart boundaries
      : body !== undefined
        ? { 'Content-Type': 'application/json' }
        : undefined

  const res = await fetch(`/api${path}`, {
    method,
    credentials: 'include',
    headers,
    signal,
    body: form ? form : body === undefined ? undefined : JSON.stringify(body),
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    /* empty body is fine */
  }

  if (!res.ok) {
    throw new ApiError(data?.message ?? `Request failed (${res.status})`, res.status)
  }
  return data
}

export const get = (path, opts) => request(path, { ...opts, method: 'GET' })
export const post = (path, body, opts) => request(path, { ...opts, method: 'POST', body })
export const patch = (path, body, opts) => request(path, { ...opts, method: 'PATCH', body })
export const del = (path, opts) => request(path, { ...opts, method: 'DELETE' })

/** Multipart upload — used for the Owner photo upload (Phase 5). */
export const postForm = (path, formData, opts) => request(path, { ...opts, method: 'POST', form: formData })
